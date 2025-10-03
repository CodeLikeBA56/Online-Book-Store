import {Alert} from 'react-native';
import { useContext, createContext, useState, useEffect } from 'react';

export const InventoryContext = createContext();

const InventoryProvider = ({ children }) => {
  const [inventory, setInventory] = useState([]);

  const getBooksDataFromDatabase = () => {
    return fetch('https://book-e-commerce-bd561-default-rtdb.firebaseio.com/Books.json')
      .then(response => response.json())
      .then(data => {
        const books = Object.values(data || {});
        return books;
      }).catch(error => {
        Alert.alert('Failed to fetch data.',error.message);
        return [];
      })
  };

  useEffect(() => {
    getBooksDataFromDatabase().then(books => {
      const validBooks = books.filter((book) => book !== null && typeof book === 'object');
      setInventory(validBooks);
    });
  }, []);

  const saveInDatabase = (bookId, book) => {
    fetch(`https://book-e-commerce-bd561-default-rtdb.firebaseio.com/Books/${bookId}.json`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ...book,
        id: bookId,
      }),
    });
  };

  const addBookToInventory = (book) => {
    const bookId = inventory.length + 1;
    saveInDatabase(bookId, book);
    setInventory((prevInventory) => [...prevInventory, {id: bookId, ...book}]);
  };

  const deleteBookFromInventory = async (bookId) => {
    try {
      const response = await fetch("https://book-e-commerce-bd561-default-rtdb.firebaseio.com/Books/" + bookId + ".json",
        { method: 'DELETE' }
      );

      if (!response.ok)
        throw new Error('Network response was not ok.');

      setInventory((prevInventory) => prevInventory.filter(book => book.id !== bookId));
      Alert.alert("Book successfully deleted");
    } catch (error) {
      Alert.alert("Failed to delete book", error.message);
    }
  }

  const updateBookInInventory = (updatedBook) => {
    saveInDatabase(updatedBook.id, updatedBook);
    setInventory((prevInventory) =>
      prevInventory.map(book => book.id === updatedBook.id ? { ...book, ...updatedBook } : book)
    );
  };

  const findBookById = (bookId) => {
    return inventory.find((item) => item.id === bookId);
  }

  const validateInput = (value, min, max) => {
    const numericValue = parseInt(value, 10);
    if (isNaN(numericValue) || numericValue < min || numericValue > max) {
      return false;
    }
    return true;
  };

  const validateBook = (book) => {
    if (book.name.length < 2 || book.name.length > 50) {
      return { valid: false, message: 'Name must be between 2 and 50 characters.' };
    }
    const isbnRegex = /^[0-9]{10,13}$/;
    if (!isbnRegex.test(book.isbn)) {
      return { valid: false, message: 'ISBN must be a numeric string between 10 and 13 digits.' };
    }
    if (book.author.length < 5 || book.author.length > 50) {
      return { valid: false, message: 'Author name must be between 5 and 50 characters.' };
    }
    const parsedPrice = parseInt(book.price, 10);
    if (isNaN(parsedPrice) || parsedPrice < 0.01) {
      return { valid: false, message: 'Price must be a number greater than 0.' };
    }
    if (!validateInput(book.quantity, 1, 999)) {
      return { valid: false, message: 'Quantity must be between 1 and 999.' };
    }
    return { valid: true };
  };

  const searchBooks = (searchedKeyword) => {
    const lowercasedKeyword = searchedKeyword.toLowerCase();

    return inventory.filter((book) => {
      const bookName = book.name.toLowerCase();
      return bookName.includes(lowercasedKeyword);
    });
  };

  const getBooksWithLowStock = () => {
    return inventory.filter(book => book.quantity < 10);
  };


  return (
    <InventoryContext.Provider
      value={{
        inventory,
        findBookById,
        searchBooks,
        validateBook,
        addBookToInventory,
        updateBookInInventory,
        deleteBookFromInventory,
        getBooksWithLowStock,
      }}
    >
      {children}
    </InventoryContext.Provider>
  );
};

export const useInventoryContext = () => {
  return useContext(InventoryContext);
};

export default InventoryProvider;