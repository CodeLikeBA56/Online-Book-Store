import { createContext, useContext, useReducer, useEffect } from 'react';
import { Alert } from 'react-native';
import { useAuthContext } from './AuthContext';
import { useInventoryContext } from './InventoryContext';

export const cartContext = createContext();

const initialState = {
  cart: [],
  subTotal: 0,
  isAllProductSelected: false,
};

const calculateSubTotal = (cart) => {
  return cart.reduce((total, item) => item.isSelectedForOrder ? total + item.quantity * item.price : total, 0)
};

const checkAllProductsSelected = (cart) => {
  return cart.length > 0 && cart.every((item) => item.isSelectedForOrder)
};

function reducer(state, action) {
  if (action.type === 'ADD_TO_CART') {
    const item = action.payload;
    if (state.cart.some((cartItem) => cartItem.id === item.id)) {
      Alert.alert('Item Already in Cart', `${item.name} is already in your cart.`);
      return state;
    }
    const newCart = [...state.cart, item];
    const subTotal = calculateSubTotal(newCart);
    const isAllProductSelected = checkAllProductsSelected(newCart);

    return {
      ...state,
      subTotal,
      cart: newCart,
      isAllProductSelected,
    };
  } else if (action.type === 'REMOVE_FROM_CART') {
    const newCart = state.cart.filter((item) => item.id !== action.payload);
    const subTotal = calculateSubTotal(newCart);
    const isAllProductSelected = checkAllProductsSelected(newCart);

    return {
      ...state,
      cart: newCart,
      subTotal,
      isAllProductSelected,
    };
  } else if (action.type === 'UPDATE_CART_ITEM_QUANTITY') {
    const { id, newQuantity } = action.payload;
    const newCart = state.cart.map((item) => item.id === id ? { ...item, quantity: newQuantity } : item);
    const subTotal = calculateSubTotal(newCart);

    return {
      ...state,
      cart: newCart,
      subTotal,
    };
  } else if (action.type === 'UPDATE_CART_FROM_INVENTORY') {
    const updatedCart = action.payload;
    const subTotal = calculateSubTotal(updatedCart);
    const isAllProductSelected = checkAllProductsSelected(updatedCart);

    return {
      ...state,
      cart: updatedCart,
      subTotal,
      isAllProductSelected,
    };
  } else if (action.type === 'UPDATE_SELECTED_FOR_ORDER') {
    const { id, isSelected } = action.payload;
    const newCart = state.cart.map((item) => item.id === id ? { ...item, isSelectedForOrder: isSelected } : item);
    const subTotal = calculateSubTotal(newCart);
    const isAllProductSelected = checkAllProductsSelected(newCart);

    return {
      ...state,
      cart: newCart,
      subTotal,
      isAllProductSelected,
    };
  } else if (action.type === 'SELECT_ALL_PRODUCTS') {
    const newCart = state.cart.map(item => ({...item, isSelectedForOrder: true}));
    const subTotal = calculateSubTotal(newCart);

    return {
      ...state,
      cart: newCart,
      isAllProductSelected: true,
      subTotal,
    };
  } else if (action.type === 'UNSELECT_ALL_PRODUCTS') {
    const newCart = state.cart.map((item) => ({...item, isSelectedForOrder: false}));

    return {
      ...state,
      cart: newCart,
      isAllProductSelected: false,
      subTotal: 0,
    };
  } else {
    return state;
  }
}

const CartProvider = ({ children }) => {
  const { userToken } = useAuthContext();
  const { inventory } = useInventoryContext();
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    const fetchCart = async () => {
      if (!userToken) return;

      try {
        const response = await fetch(
          `https://book-e-commerce-bd561-default-rtdb.firebaseio.com/users/${userToken}/cart.json`
        );

        if (!response.ok) throw new Error('Failed to fetch cart.');

        const data = await response.json();
        return Object.values(data || {}).filter(item => item !== null);
      } catch (error) {
        Alert.alert('Failed to fetch cart', error.message);
      }
    };

    fetchCart().then(cart => {
      if (!cart) return;

      const updatedCart = cart.map(cartItem => {
        const book = inventory.find((book) => book.id === cartItem.id);
        return book ? {
          id: book.id,
          name: book.name,
          author: book.author,
          image: book.image,
          price: book.price,
          quantity: cartItem.quantity,
          isSelectedForOrder: false,
        } : null;
      }).filter((item) => item !== null);

      dispatch({ type: 'UPDATE_CART_FROM_INVENTORY', payload: updatedCart });
    });

  }, [userToken, inventory]);

  const saveCartDataInDatabase = async (itemId, quantity) => {
    try {
      await fetch(`https://book-e-commerce-bd561-default-rtdb.firebaseio.com/users/${userToken}/cart/${itemId}.json`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            id: itemId,
            quantity,
          }),
        }
      );
    } catch (error) {
      Alert.alert('Failed to save cart data', error.message);
    }
  };

  const deleteItemFromDatabaseCart = async (itemId) => {
    try {
      await fetch(`https://book-e-commerce-bd561-default-rtdb.firebaseio.com/users/${userToken}/cart/${itemId}.json`, { method: 'DELETE' });
    } catch (error) {
      Alert.alert('Failed to delete cart item', error.message);
    }
  };

  const addToCart = (item) => {
    dispatch({ type: 'ADD_TO_CART', payload: item });
    saveCartDataInDatabase(item.id, item.quantity);
  };

  const handleRemoveFromCart = (id) => {
    dispatch({ type: 'REMOVE_FROM_CART', payload: id });
    deleteItemFromDatabaseCart(id);
  };

  const updateCartItemQuantity = (id, newQuantity) => {
    dispatch({ type: 'UPDATE_CART_ITEM_QUANTITY', payload: { id, newQuantity } });
    saveCartDataInDatabase(id, newQuantity);
  };

  const updateSelectedForOrder = (id, isSelected) => {
    dispatch({ type: 'UPDATE_SELECTED_FOR_ORDER', payload: { id, isSelected } });
  };

  const selectAllProducts = () => {
    dispatch({ type: 'SELECT_ALL_PRODUCTS' });
  };

  const unSelectAllProducts = () => {
    dispatch({ type: 'UNSELECT_ALL_PRODUCTS' });
  };

  const isBookAlreadyInCart = (bookId) => {
    return state.cart.some((item) => item.id === bookId);
  };

  const getSelectedProducts = () => {
    return state.cart.map(item => {
      return item.isSelectedForOrder === true? {
        id: item.id,
        name: item.name,
        image: item.image,
        price: item.price,
        quantity: item.quantity,
      } : null
    }).filter(item => item !== null);
  }

  return (
    <cartContext.Provider
      value={{
        cart: state.cart,
        subTotal: state.subTotal,
        getSelectedProducts,
        addToCart,
        handleRemoveFromCart,
        updateCartItemQuantity,
        updateSelectedForOrder,
        calculateSubTotal: () => state.subTotal,
        selectAllProducts,
        unSelectAllProducts,
        isBookAlreadyInCart,
        isAllProductSelected: state.isAllProductSelected,
      }}
    >
      {children}
    </cartContext.Provider>
  );
};

export const useCartContext = () => {
  return useContext(cartContext);
};

export default CartProvider;