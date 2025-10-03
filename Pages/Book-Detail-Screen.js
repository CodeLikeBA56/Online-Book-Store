import { useReducer, useState } from 'react';
import { Entypo } from '@expo/vector-icons';
import Carousel from '../components/Common/Carousel';
import {useAuthContext} from '../Contexts/AuthContext';
import Searchbar from '../components/Common/Searchbar';
import {useCartContext} from '../Contexts/CartContext';
import {useWishlistContext} from '../Contexts/WishlistContext';
import QuantitySelector from '../components/Common/QuantitySelector';
import image1 from '../Assets/The-Great-Gatsby-1.jpg';
import image2 from '../Assets/The-Great-Gatsby-2.jpg';
import image3 from '../Assets/Image-1.webp';
import image4 from '../Assets/Image-2.webp';
import image5 from '../Assets/Image-3.webp';
import { Text, StyleSheet, View, Image, TouchableOpacity, Modal, Pressable, Alert, ActivityIndicator} from 'react-native';

const images = [{ link: image1 }, { link: image2 }, { link: image3 }, { link: image4 }, { link: image5 }];

function BookDetail({ navigation, route }) {
  const { item } = route.params;
  const {addresses} = useAuthContext();
  const {addToCart, isBookAlreadyInCart} = useCartContext();
  const {addBookToWishlist, deleteBookFromWishlist, isBookAlreadyInWishlist} = useWishlistContext();

  const [loading, setLoading] = useState(false);
  const [modalVisibility, setModalVisible] = useState(false);
  const [addToWishlist, setAddToWishlist] = useState(item ? isBookAlreadyInWishlist(item.id) : false);

  const initialState = {
    quantity: 1,
    subTotal: item.price,
  };

  function reducer(state, action) {
    if (action.type === 'increment') {
      return {
        quantity: state.quantity + 1,
        subTotal: item.price * (state.quantity + 1),
      };
    } else if (action.type === 'decrement') {
      if (state.quantity > 1) {
        return {
          quantity: state.quantity - 1,
          subTotal: item.price * (state.quantity - 1),
        };
      }
      return state;
    } else if (action.type === 'reset') {
      return initialState;
    } else {
      return state;
    }
  }

  const [state, dispatch] = useReducer(reducer, initialState);

  const handleIncrement = () => {
    dispatch({ type: 'increment' });
  };

  const handleDecrement = () => {
    dispatch({ type: 'decrement' });
  };

  const handleAddToWishListToggle = () => {
    if(addToWishlist === false) {
      const book = {
        bookId: item.id, 
        bookName: item.name, 
        bookPrice: item.price, 
        bookQuantity: item.quantity, 
        addedOn: new Date().toDateString(), 
        image: item.image,
      }
      addBookToWishlist(book);
    } else {
      deleteBookFromWishlist(item.id);
    }
    setAddToWishlist(!addToWishlist)
  };

  const handleAddToCart = (id, quantity, book) => {
    setLoading(true);
    const item = {
      id: book.id,
      name: book.name,
      price: book.price,
      quantity,
      image: book.image,
      isSelectedForOrder: false
    }
    const response = isBookAlreadyInCart(id);
    addToCart(item);
    setTimeout(() => {
      setLoading(false);
      setModalVisible(false);
      if(!response) {
        Alert.alert('Success', `${item.name} has been successfully added to your cart.`);
      }
    }, 1200);
  }

  const redirectUserToCheckoutScreen = () => {
    const products = [{
      id: item.id,
      name: item.name,
      image: item.image,
      price: item.price,
      quantity: state.quantity
    }];
    
    if (!addresses || addresses.length === 0) {
      Alert.alert('Error', 'Please provide a shipping address before proceeding to checkout.');
      return;
    }
    
    if (products.length === 0) {
      Alert.alert('Error', 'Please select at least one product before proceeding to checkout.');
      return;
    }
      
    const order = {
      amount: state.subTotal,
      orderStatus: 'Pending',
      address: addresses[0],
      orderedProducts: products,
    };

    navigation.navigate('Checkout', { order });
  };

  return (
    <>
      <View style={styles.container}>
        <Searchbar enableGoBack={true}  logout={true} />
        <Carousel images={images} />
        <View style={styles.productDetail}>
          <Text style={styles.productName}>{item.name}</Text>
          <Text style={styles.productPrice}>Rs. {item.price}</Text>
          <View style={{marginTop: 10, marginBottom: 10}}>
            <QuantitySelector
              quantity={state.quantity}
              onIncrement={handleIncrement}
              onDecrement={handleDecrement}
              size='large'
            />
          </View>
          <View style={styles.frutherDetail}>
            <Text style={styles.textStyle}>ISBN: {item.isbn}</Text>
            <Text style={styles.textStyle}>Author: {item.author}</Text>
            <Text style={styles.textStyle}>Published on: {item.publishDate}</Text>
          </View>
        </View>
        <Modal
          animationType="fade"
          transparent={true}
          visible={modalVisibility}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalView}>
              <Pressable
                style={styles.closeButton}
                onPress={() => setModalVisible(false)}>
                <Text style={styles.closeButtonText}>X</Text>
              </Pressable>
              <View style={styles.modalContent}>
                <Image
                  source={item.image[0]}
                  resizeMode="contain"
                  style={styles.modalImage}
                />
                <View style={styles.modalDetails}>
                  <Text style={styles.modalProductName}>{item.name}</Text>
                  <Text style={styles.modalProductPrice}>
                    Rs. {state.subTotal}
                  </Text>
                  <View style={{marginTop: 10, marginBottom: 10}}>
                    <QuantitySelector
                      quantity={state.quantity}
                      onIncrement={handleIncrement}
                      onDecrement={handleDecrement}
                      size='large'
                    />
                  </View>
                </View>
              </View>
              <TouchableOpacity style={styles.addToCartBtn} activeOpacity={0.5} onPress={() => handleAddToCart(item.id, state.quantity, item)}>
                {!loading && <Text style={styles.btnText}>Add to cart</Text>}
                {loading && <ActivityIndicator size="small" color="white" />}
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </View>
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.btn} onPress={() => redirectUserToCheckoutScreen()}>
          <Text style={styles.btnText}>Buy now</Text>
        </TouchableOpacity>

        <Pressable style={styles.btn} onPress={() => setModalVisible(true)}>
          <Text style={styles.btnText}>Add to cart</Text>
        </Pressable>

        <TouchableOpacity style={styles.btn} onPress={handleAddToWishListToggle}>
          <Entypo
            name={addToWishlist ? 'heart' : 'heart-outlined'}
            size={28}
            color="white"
          />
        </TouchableOpacity>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F2F7',
  },
  productDetail: {
    paddingLeft: 15,
    paddingRight: 15,
  },
  productName: {
    fontSize: 24,
    marginBottom: 5,
    fontWeight: 800,
    letterSpacing: 2,
  },
  productPrice: {
    fontSize: 18,
    fontWeight: 500,
  },
  frutherDetail: {
    marginTop: 10,
    marginBottom: 10,
  },
  textStyle: {
    fontSize: 15,
    fontWeight: 500,
    marginVertical: 3,
  },
  buttonContainer: {
    height: 70,
    paddingLeft: 15,
    paddingRight: 15,
    marginTop: 'auto',
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    backgroundColor: '#FFAD01',
  },
  btn: {
    height: 45,
    paddingLeft: 12,
    paddingRight: 12,
    borderRadius: 5,
    marginLeft: 8,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#e32f45',
  },
  btnText: {
    fontSize: 16,
    color: 'white',
    fontWeight: '800',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalView: {
    width: '100%',
    backgroundColor: '#F2F2F7',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    height: 320,
  },
  modalContent: {
    flexDirection: 'row',
    padding: 20,
    paddingTop: 60,
  },
  modalImage: {
    width: 100,
    height: 100,
  },
  modalDetails: {
    flex: 1,
    marginLeft: 20,
  },
  modalProductName: {
    fontSize: 20,
    fontWeight: '800',
    marginBottom: 4,
  },
  modalProductPrice: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  closeButton: {
    zIndex: 1,
    width: 35,
    height: 35,
    borderRadius: 50,
    alignItems: 'center',
    backgroundColor: 'red',
    justifyContent: 'center',
    position: 'absolute',
    top: 20,
    right: 20,
  },
  closeButtonText: {
    color: 'white',
    fontSize: 14,
  },
  addToCartBtn: {
    height: 45,
    marginLeft: 20,
    marginRight: 20,
    marginTop: 'auto',
    marginBottom: 55,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFAD01',
  },
});

export default BookDetail;