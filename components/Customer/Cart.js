import { useState, useEffect } from 'react';
import Searchbar from '../Common/Searchbar';
import ShowAlert from '../Common/ShowAlert';
import {useNavigation} from '@react-navigation/native';
import QuantitySelector from '../Common/QuantitySelector';
import { useCartContext } from '../../Contexts/CartContext';
import { useSettingContext } from '../../Contexts/SettingContext';
import { useInventoryContext } from '../../Contexts/InventoryContext';
import { MaterialIcons, FontAwesome, Entypo } from '@expo/vector-icons';
import { StyleSheet, TouchableOpacity, Text, Pressable, View, FlatList, Image, Dimensions, Alert } from 'react-native';
import { useThemeContext } from '../../Contexts/ThemeContext';

const screenWidth = Dimensions.get('window').width;

function Cart({navigation}) {
  const { theme } = useThemeContext();
  const {
    cart,
    subTotal,
    getSelectedProducts,
    handleRemoveFromCart,
    updateCartItemQuantity,
    updateSelectedForOrder,
    calculateSubTotal,
    selectAllProducts,
    unSelectAllProducts,
    isAllProductSelected,
  } = useCartContext();
  const Navigation = useNavigation();
  const {findBookById} = useInventoryContext();
  const { showLogoutBtn } = useSettingContext();
  
  const [selectAll, setSelectAll] = useState(false);
  const [bookToDelete, setBookToDelete] = useState(null);
  const [showDeleteAlert, setShowDeleteAlert] = useState(false);


  const handleDelete = (bookId) => {
    setBookToDelete(bookId);
    setShowDeleteAlert(true);
  };

  const confirmDelete = (response) => {
    setShowDeleteAlert(false);
    if (response && bookToDelete) {
      handleRemoveFromCart(bookToDelete);
    }
    setBookToDelete(null);
  };

  useEffect(() => {
    setSelectAll(isAllProductSelected);
  }, [isAllProductSelected]);

  const toggleSelectedForOrder = (bookId, isSelected) => {
    updateSelectedForOrder(bookId, !isSelected);
    setSelectAll(isAllProductSelected);
  };

  const selectAllToggle = () => {
    if (!selectAll) {
      selectAllProducts();
    } else {
      unSelectAllProducts();
    }
  };

  const redirectUserToProductDetailPage = (bookId) => {
    const item = findBookById(bookId);
    if(item)
      Navigation.navigate('BookDetailsScreen', { item });
  }

  const Book = ({ cartItem }) => {
    const handleIncrement = () => {
      updateCartItemQuantity(cartItem.id, cartItem.quantity + 1);
    };
    const handleDecrement = () => {
      if (cartItem.quantity > 1) {
        updateCartItemQuantity(cartItem.id, cartItem.quantity - 1);
      }
    };

    return (
      <View style={[cartStyle.bookDetails, { borderColor: theme.borderColor }]}>
        <TouchableOpacity
          onPress={() =>
          toggleSelectedForOrder(cartItem.id, cartItem.isSelectedForOrder)}
        >
          <View style={cartStyle.customerActions}>
            {cartItem.isSelectedForOrder ? (
              <FontAwesome name="check-circle" size={28} color={theme.textColor} />
            ) : (
              <Entypo name="circle" size={24} color={theme.textColor} />
            )}
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => redirectUserToProductDetailPage(cartItem.id)}
        >
          <Image source={{ uri: cartItem.image }} style={cartStyle.bookImage} />
        </TouchableOpacity>
        <View style={cartStyle.bookDetail}>
          <Text style={{ fontSize: 16, fontWeight: '800', color: theme.textColor }}>
            {cartItem.name}
          </Text>
          <Text style={{ fontSize: 15, fontWeight: '600', marginTop: 5, color: theme.textColor }}>
            Rs: {cartItem.price}
          </Text>
          <View style={{ marginTop: 'auto' }}>
            <QuantitySelector
              quantity={cartItem.quantity}
              onIncrement={handleIncrement}
              onDecrement={handleDecrement}
              size="small"
            />
          </View>
        </View>
        <View style={[cartStyle.customerActions, { marginLeft: 'auto' }]}>
          <Pressable onPress={() => handleDelete(cartItem.id)}>
            <MaterialIcons name="delete" size={29} color="red" />
          </Pressable>
        </View>
      </View>
    );
  };

  const redirectUserToCheckoutScreen = () => {
    const products = getSelectedProducts();
    
    if (products.length === 0) {
      Alert.alert('Error', 'Please select at least one product before proceeding to checkout.');
      return;
    }

    const order = {
      amount: subTotal,
      orderStatus: 'Pending',
      address: addresses[0],
      orderedProducts: products,
    };
    
    navigation.navigate('Checkout', { order });
  }

  const [filteredCart, setFilteredCart] = useState(null);

  const handleCartSearch = (searchedKeyword) => {
    if (searchedKeyword.trim().length > 0) {
      const filteredCart = cart.filter((item) => {
        return (
          item.name.toLowerCase().includes(searchedKeyword.toLowerCase()) ||
          item.author.toLowerCase().includes(searchedKeyword.toLowerCase())
        );
      });
      setFilteredCart(filteredCart);
    } else {
      setFilteredCart(null);
    }
  };

  return (
    <>
      <Searchbar searchbar={true} logout={showLogoutBtn} handleFilteredData={handleCartSearch} />
      <View style={[cartStyle.container, { backgroundColor: theme.background }]}>
        <FlatList
          style={{marginBottom: 55}}
          data={filteredCart === null? cart : filteredCart}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => <Book cartItem={item} />}
          ListEmptyComponent={() => <Text style={[cartStyle.emptyList, { color: theme.textColor }]}>{(filteredCart === null)? 'Your cart is empty.' : 'No results found'}</Text>}
        />
        <View style={[cartStyle.checkOutContainer, { backgroundColor: theme.primary }]}>
          <TouchableOpacity
            activeOpacity={0.5}
            style={cartStyle.subTotalContainer}
            onPress={selectAllToggle}>
            {selectAll ? (
              <FontAwesome name="check-circle" size={28} color={theme.textColor} />
            ) : (
              <Entypo name="circle" size={24} color={theme.textColor} />
            )}
            <Text style={{ marginLeft: 5, fontSize: 14, color: theme.textColor }}>
              {selectAll ? 'Deselect All' : 'Select All'}
            </Text>
          </TouchableOpacity>
          <View style={{ marginLeft: 'auto', flexDirection: 'row' }}>
            <Text style={{ fontSize: 16, fontWeight: 700, color: theme.textColor }}>Subtotal: </Text>
            <Text style={{ fontSize: 16, fontWeight: 500, color: theme.textColor }}>
              {calculateSubTotal()}
            </Text>
          </View>
          <TouchableOpacity style={[cartStyle.checkoutBtn, { backgroundColor: theme.secondary }]} onPress={() => redirectUserToCheckoutScreen()}>
            <Text style={cartStyle.btnText}>Checkout</Text>
          </TouchableOpacity>
        </View>
      </View>
      {showDeleteAlert && (
        <ShowAlert
          title="Confirm Delete"
          description="Are you sure you want to delete this item from the cart?"
          onConfirm={confirmDelete}
        />
      )}
    </>
  );
}

export default Cart;

const cartStyle = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15,
  },
  customerActions: {
    height: 85,
    paddingLeft: 8,
    paddingRight: 8,
    justifyContent: 'center',
  },
  bookImage: {
    width: 85,
    height: 100,
    borderRadius: 8,
    resizeMode: 'contain',
    marginRight: 10,
  },
  bookDetails: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    height: 120,
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 15,
    borderColor: 'grey',
  },
  bookDetail: {
    flex: 1,
    height: 85,
  },
  checkOutContainer: {
    height: 60,
    position: 'absolute',
    bottom: 0,
    paddingLeft: 15,
    paddingRight: 15,
    alignItems: 'center',
    justifyContent: 'flex-end',
    width: screenWidth,
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
  },
  subTotalContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  btnText: {
    fontSize: 16,
    color: 'white',
    fontWeight: '700',
  },
  checkoutBtn: {
    height: 45,
    paddingLeft: 16,
    paddingRight: 16,
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 15,
    backgroundColor: '#FFAD01',
  },
  emptyList: {
    textAlign: 'center',
    fontSize: 16,
    marginTop: 20,
  },
});