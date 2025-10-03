import { useAuthContext } from './AuthContext';
import { useInventoryContext } from './InventoryContext';
import { useContext, createContext, useState, useEffect } from 'react';
import { Alert } from 'react-native';

export const WishlistContext = createContext();

const WishlistProvider = ({ children }) => {
  const { userToken } = useAuthContext();
  const { inventory } = useInventoryContext();
  const [wishlist, setWishlist] = useState([]);

  useEffect(() => {
    const fetchWishlist = async () => {
      if (!userToken) return;

      try {
        const response = await fetch(`https://book-e-commerce-bd561-default-rtdb.firebaseio.com/users/${userToken}/wishlist.json`);

        if (!response.ok) throw new Error('Failed to fetch wishlist.');

        const data = await response.json();
        return Object.values(data || {}).filter(item => item !== null);
      } catch (error) {
        Alert.alert('Failed to fetch wishlist', error.message);
      }
    };

    fetchWishlist().then(fetchedWishlist => {
      if (!fetchedWishlist) return;

      const updatedWishlist = fetchedWishlist.map(wishlistItem => {
        const book = inventory.find(book => book.id === wishlistItem.bookId);
        return book ? {
          bookId: book.id,
          image: book.image,
          bookName: book.name,
          bookPrice: book.price,
          bookQuantity: book.quantity,
          addedOn: wishlistItem.addedOn,
        } : null;
      }).filter(item => item !== null);

      setWishlist(updatedWishlist);
    });

  }, [userToken, inventory]);

  const addBookToWishlist = async (book) => {
    try {
      const response = await fetch(`https://book-e-commerce-bd561-default-rtdb.firebaseio.com/users/${userToken}/wishlist/${book.bookId}.json`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          bookId: book.bookId,
          addedOn: book.addedOn,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to add book to the wishlist.');
      }

      setWishlist((prevWishlist) => [...prevWishlist, book]);
      Alert.alert("Book successfully added to the Wishlist");
    } catch (error) {
      Alert.alert("Failed to add book to the wishlist", error.message);
    }
  };

  const deleteBookFromWishlist = async (bookId) => {
    try {
      const response = await fetch(`https://book-e-commerce-bd561-default-rtdb.firebaseio.com/users/${userToken}/wishlist/${bookId}.json`, {
        method: 'DELETE'
      });

      if (!response.ok)
        throw new Error('Network response was not ok.');

      setWishlist((prevWishlist) => prevWishlist.filter((book) => book.bookId !== bookId));
      Alert.alert("Book successfully removed from the Wishlist");
    } catch (error) {
      Alert.alert("Failed to remove book from the wishlist", error.message);
    }
  };

  const isBookAlreadyInWishlist = (bookId) => {
    return wishlist.some((item) => item.bookId === bookId);
  };

  return (
    <WishlistContext.Provider value={{ wishlist, addBookToWishlist, deleteBookFromWishlist, isBookAlreadyInWishlist }}>
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlistContext = () => {
  return useContext(WishlistContext);
};

export default WishlistProvider;