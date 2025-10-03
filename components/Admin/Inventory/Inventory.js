import { useState } from 'react';
import { useThemeContext } from '../../../Contexts/ThemeContext';
import ShowAlert from '../../Common/ShowAlert';
import Searchbar from '../../Common/Searchbar';
import AddItemToInventory from './AddItemToInventory';
import UpdateItemInInventory from './UpdateItemInInventory';
import { useInventoryContext } from '../../../Contexts/InventoryContext';
import { MaterialIcons, Feather } from '@expo/vector-icons';
import { Modal, StyleSheet, Text, Pressable, View, FlatList, Image, ActivityIndicator, TouchableOpacity } from 'react-native';

function Inventory({navigation}) {
  const { theme } = useThemeContext();
  const { inventory, deleteBookFromInventory, searchBooks } = useInventoryContext();
  const [addItemFormVisibility, setAddItemFormVisibility] = useState(false);
  const [updateItemFormVisibility, setUpdateItemFormVisibility] = useState(false);
  const [bookToDelete, setBookToDelete] = useState(null);
  const [showDeleteAlert, setShowDeleteAlert] = useState(false);
  const [filteredBooks, setFilteredBooks] = useState(null);

  const handleDelete = (bookId) => {
    setBookToDelete(bookId);
    setShowDeleteAlert(true);
  };

  const confirmDelete = (response) => {
    setShowDeleteAlert(false);
    if (response && bookToDelete) {
      deleteBookFromInventory(bookToDelete);
    }
    setBookToDelete(null);
  };

  const [updatedBook, setUpdatedBook] = useState(null);

  const showUpdateItemForm = (book) => {
    setUpdatedBook(book);
    setUpdateItemFormVisibility(true);
  };

  const handleSearchbar = (searchedKeyword) => {
    if(searchedKeyword.trim().length > 0)
      setFilteredBooks(searchBooks(searchedKeyword));
    else
      setFilteredBooks(null);
  }

  const Book = ({ book }) => {
    const redirectToProductDetailScreen = (item) => {
      navigation.navigate('BookDetailsScreen', {item})
    }
    return (
      <View style={[inventoryStyle.bookDetails, { borderColor: theme.borderColor }]}>
        <TouchableOpacity onPress={() => redirectToProductDetailScreen(book)}>
          <Image source={{uri: book.image}} style={inventoryStyle.bookImage} />
        </TouchableOpacity>
        <View style={inventoryStyle.bookDetail}>
          <Text style={{ fontSize: 16, fontWeight: '800', color: theme.textColor }}>{book.name}</Text>
          <Text style={{ fontSize: 15, fontWeight: '600', marginTop: 5, color: theme.textColor }}>Rs: {book.price}</Text>
          <View style={[inventoryStyle.quantityContainer, { borderColor: theme.secondary }]}>
            <Text style={[inventoryStyle.title, { color: theme.secondary }]}>{`Stock: ${book.quantity}`}</Text>
          </View>
        </View>
        <View style={inventoryStyle.adminActions}>
          <Pressable onPress={() => showUpdateItemForm(book)}>
            <Feather name="edit" size={24} color="green" />
          </Pressable>
          <Pressable onPress={() => handleDelete(book.id)}>
            <MaterialIcons name="delete" size={29} color="red" />
          </Pressable>
        </View>
      </View>
    );
  } 

  if (!inventory) {
    return (
      <View style={{flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: theme.background }}>
        <ActivityIndicator color={theme.secondary} />
      </View>
    );
  }
  
  return (
    <>
      <Searchbar searchbar={true} logout={true} handleFilteredData={handleSearchbar} />
      <View style={[inventoryStyle.container, { backgroundColor: theme.background }]}>
        <FlatList
          style={inventoryStyle.detailsContainer}
          data={filteredBooks === null? inventory : filteredBooks}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <Book book={item} />}
        />
        <Pressable style={[inventoryStyle.addButton, { backgroundColor: theme.secondary }]} onPress={() => setAddItemFormVisibility(true)}>
          <Text style={inventoryStyle.addButtonText}>+</Text>
        </Pressable>
        <Modal animationType="slide" transparent={false} visible={addItemFormVisibility}>
          <AddItemToInventory setModalVisibility={setAddItemFormVisibility} />
        </Modal>
        <Modal animationType="slide" transparent={false} visible={updateItemFormVisibility}>
          <UpdateItemInInventory
            setModalVisibility={setUpdateItemFormVisibility}
            book={updatedBook}
          />
        </Modal>
      </View>

      {showDeleteAlert && (
        <ShowAlert
          title="Confirm Delete"
          description="Are you sure you want to delete this item from the inventory?"
          onConfirm={confirmDelete}
        />
      )}
    </>
  );
}

export default Inventory;

const inventoryStyle = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15,
    justifyContent: 'flex-end',
  },
  addButton: {
    position: 'absolute',
    bottom: 20,
    right: 63,
    borderRadius: 50,
    width: 50,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addButtonText: {
    color: 'white',
    fontSize: 30,
    fontWeight: 'bold',
  },
  adminActions: {
    height: 80,
    marginTop: 'auto',
    marginLeft: 'auto',
    alignItems: 'center',
    marginBottom: 'auto',
    justifyContent: 'space-between',
  },
  detailsContainer: {
    width: '100%',
  },
  bookDetails: {
    display: 'flex',
    flexDirection: 'row',
    padding: 10,
    height: 120,
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 15,
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
  },
  quantityContainer: {
    margin: 'auto',
    marginRight: 50,
    marginBottom: 0,
    borderRadius: 5,
    borderWidth: 2,
  },
  title: {
    padding: 3,
    paddingLeft: 7,
    paddingRight: 7,
    fontSize: 14,
    fontWeight: '600',
  },
});