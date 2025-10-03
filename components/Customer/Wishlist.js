import { useState } from 'react';
import Searchbar from '../Common/Searchbar';
import { useNavigation } from '@react-navigation/native';
import { useCartContext } from '../../Contexts/CartContext';
import { useSettingContext } from '../../Contexts/SettingContext';
import { useWishlistContext } from '../../Contexts/WishlistContext';
import { useInventoryContext } from '../../Contexts/InventoryContext';
import { useThemeContext } from '../../Contexts/ThemeContext';
import { FontAwesome5, AntDesign } from '@expo/vector-icons';
import {
  Text,
  View,
  Image,
  Alert,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';

function Wishlist() {
  const navigation = useNavigation();
  const { wishlist } = useWishlistContext();
  const { showLogoutBtn } = useSettingContext();
  const { findBookById } = useInventoryContext();
  const { addToCart, isBookAlreadyInCart } = useCartContext();
  const { theme } = useThemeContext();

  const redirectUserToProductDetailPage = (bookId) => {
    const item = findBookById(bookId);
    if (item) {
      navigation.navigate('BookDetailsScreen', { item });
    } else {
      Alert.alert('Error', 'Item not found in inventory.');
    }
  };

  const Book = ({ wishlistItem }) => {
    const [loading, setLoading] = useState(false);
    const isAvailable = wishlistItem.bookQuantity > 0;
    const availabilityColor = isAvailable ? '#01a78c' : 'red';
    const availabilityText = isAvailable ? 'Available' : 'Out of Stock';

    const handleAddBookToCart = (item) => {
      if (!isAvailable) {
        Alert.alert('Out of Stock', `${item.bookName} is currently out of stock.`);
        setTimeout(() => {
          setLoading(false);
        }, 1200);
        return;
      }

      const book = {
        id: item.bookId,
        name: item.bookName,
        price: item.bookPrice,
        quantity: 1,
        image: item.image,
        isSelectedForOrder: false,
      };

      const alreadyInCart = isBookAlreadyInCart(item.bookId);
      
      if (!alreadyInCart) {
        addToCart(book);
      }

      setTimeout(() => {
        setLoading(false);
        if (!alreadyInCart) {
          Alert.alert('Success', `${item.bookName} has been successfully added to your cart.`);
        } else {
          Alert.alert('Notice', `${item.bookName} is already in your cart.`);
        }
      }, 1200);
    };

    return (
      <View style={[styles.bookDetails, {borderColor: theme.textColor }]}>
        <TouchableOpacity onPress={() => redirectUserToProductDetailPage(wishlistItem.bookId)}>
          <Image
            source={{ uri: wishlistItem.image }}
            style={styles.bookImage}
          />
        </TouchableOpacity>
        <View style={styles.bookDetail}>
          <Text style={[styles.bookName, { color: theme.textColor }]}>
            {wishlistItem.bookName}
          </Text>
          <Text style={[styles.bookPrice, { color: theme.textColor }]}>
            Rs: {wishlistItem.bookPrice}
          </Text>
          <View style={[styles.availabilityContainer, { borderColor: availabilityColor }]}>
            <AntDesign
              name="earth"
              size={20}
              color={availabilityColor}
            />
            <Text style={[styles.availabilityText, { color: availabilityColor }]}>
              {availabilityText}
            </Text>
          </View>
        </View>
        <View style={styles.customerActions}>
          {loading === true ? (
            <ActivityIndicator color="#01a78c" />
          ) : (
            <TouchableOpacity activeOpacity={0.5} onPress={() => {setLoading(true); handleAddBookToCart(wishlistItem)}}>
              <FontAwesome5 name="cart-arrow-down" size={24} color="#01a78c" />
            </TouchableOpacity>
          )}
        </View>
      </View>
    );
  };

  const [filteredWishlist, setFilteredWishlist] = useState(null);

  const handleWishlistSearch = (searchedKeyword) => {
    if (searchedKeyword.trim().length > 0) {
      const filteredWishlist = wishlist.filter((item) => {
        return (
          item.bookName.toLowerCase().includes(searchedKeyword.toLowerCase())
        );
      });
      setFilteredWishlist(filteredWishlist);
    } else {
      setFilteredWishlist(null);
    }
  };

  return (
    <>
      <Searchbar searchbar={true} logout={showLogoutBtn} handleFilteredData={handleWishlistSearch} />
      <View style={[styles.container, { backgroundColor: theme.background }]}>
        <FlatList
          data={filteredWishlist === null? wishlist : filteredWishlist}
          keyExtractor={(item) => item.bookId.toString()}
          renderItem={({ item }) => <Book wishlistItem={item} />}
          ListEmptyComponent={() => <Text style={[styles.emptyList, { color: theme.textColor }]}>Your wishlist is empty.</Text>}
        />
      </View>
    </>
  );
}

export default Wishlist;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15,
  },
  bookDetails: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 120,
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 15,
    padding: 15,
  },
  bookImage: {
    width: 85,
    height: 100,
    borderRadius: 8,
    resizeMode: 'contain',
    marginRight: 10,
  },
  bookDetail: {
    flex: 1,
    height: 85,
  },
  bookName: {
    fontSize: 16,
    fontWeight: '800',
  },
  bookPrice: {
    fontSize: 15,
    fontWeight: '600',
    marginTop: 5,
  },
  availabilityContainer: {
    marginTop: 'auto',
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 'auto',
    marginRight: 20,
    borderWidth: 1,
    padding: 3,
    borderRadius: 5,
  },
  availabilityText: {
    marginLeft: 7,
  },
  customerActions: {
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    width: 40,
  },
  emptyList: {
    textAlign: 'center',
    fontSize: 16,
    marginTop: 20,
  },
});
