import { useState, useEffect } from 'react';
import { FontAwesome } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import {useInventoryContext} from '../../../Contexts/InventoryContext'
import {
  View,
  Text,
  TextInput,
  Platform,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
  SafeAreaView,
  Alert,
} from 'react-native';

function UpdateItemInInventory({ setModalVisibility, book }) {
  const [name, setName] = useState(book.name);
  const [isbn, setIsbn] = useState(book.isbn);
  const [author, setAuthor] = useState(book.author);
  const [price, setPrice] = useState(book.price.toString());
  const [quantity, setQuantity] = useState(book.quantity.toString());

  const [loading, setLoading] = useState(false);
  const [publishDate, setPublishDate] = useState(new Date(book.publishDate));
  const [showDatePicker, setShowDatePicker] = useState(false);

  const {validateBook, updateBookInInventory} = useInventoryContext();

  useEffect(() => {
    setName(book.name);
    setIsbn(book.isbn);
    setPrice(book.price.toString());
    setQuantity(book.quantity.toString());
    setAuthor(book.author);
    setPublishDate(new Date(book.publishDate));
  }, [book]);

  const toggleDatePicker = () => {
    setShowDatePicker(!showDatePicker);
  };

  const onChangeDate = ({ type }, selectedDate) => {
    if (type === 'set') {
      const currentDate = selectedDate;
      setPublishDate(currentDate);
      if (Platform.OS === 'android') {
        toggleDatePicker();
      }
    } else {
      toggleDatePicker();
    }
  };

  const handleSubmit = () => {
    const updatedBook = {
      ...book,
      name,
      isbn,
      author,
      publishDate,
      price: parseInt(price, 10),
      quantity: parseInt(quantity, 10),
    };
    const validate = validateBook(updatedBook);
    if (validate.valid === false) {
      Alert.alert(validate.valid, validate.message);
      return;
    }

    setLoading(true);
    updateBookInInventory(updatedBook);

    setTimeout(() => {
      setLoading(false);
      setModalVisibility(false);
    }, 1000);
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#FFAD01' }}>
      <View style={formStyle.navbar}>
        <TouchableOpacity style={formStyle.btn} onPress={() => setModalVisibility(false)}>
          <Text style={formStyle.btnText}>Cancel</Text>
        </TouchableOpacity>
        <TouchableOpacity style={formStyle.btn} onPress={handleSubmit}>
          {!loading && <Text style={formStyle.btnText}>Save</Text>}
          {loading && <ActivityIndicator size="small" color="white" />}
        </TouchableOpacity>
      </View>
      <View style={formStyle.modalContainer}>
        <View style={formStyle.modalView}>
          <Text style={formStyle.headerText}>Enter Book Details</Text>
          <View>
            <View style={formStyle.inputField}>
              <TextInput
                style={formStyle.userInput}
                value={name}
                onChangeText={setName}
                placeholder="Enter book name"
              />
              <Text style={formStyle.label}>Book Name</Text>
            </View>
            <View style={formStyle.inputField}>
              <TextInput
                style={formStyle.userInput}
                value={isbn}
                onChangeText={setIsbn}
                placeholder="Enter book ISBN"
              />
              <Text style={formStyle.label}>Book ISBN</Text>
            </View>
            <View style={formStyle.inputField}>
              <TextInput
                style={formStyle.userInput}
                value={author}
                onChangeText={setAuthor}
                placeholder="Enter book author"
              />
              <Text style={formStyle.label}>Book Author</Text>
            </View>
            <View style={[formStyle.inputField, formStyle.multipleInputField]}>
              <View style={formStyle.subInputField}>
                <TextInput
                  style={formStyle.userInput}
                  keyboardType="numeric"
                  value={price}
                  onChangeText={setPrice}
                  placeholder="Enter price"
                />
                <Text style={formStyle.label}>Price</Text>
              </View>
              <View style={formStyle.subInputField}>
                <TextInput
                  style={formStyle.userInput}
                  keyboardType="numeric"
                  value={quantity}
                  onChangeText={setQuantity}
                  placeholder="Enter quantity"
                />
                <Text style={formStyle.label}>Quantity</Text>
              </View>
            </View>
            <View style={formStyle.inputField}>
              <TextInput
                style={formStyle.userInput}
                value={publishDate.toDateString()}
                editable={false}
                placeholder="Select publish date"
              />
              <TouchableOpacity style={formStyle.calendarIcon} onPress={toggleDatePicker}>
                <FontAwesome name="calendar" size={24} color="black" />
              </TouchableOpacity>
              {showDatePicker && (
                <DateTimePicker
                  mode="date"
                  display="spinner"
                  value={publishDate}
                  onChange={onChangeDate}
                  style={formStyle.datePicker}
                />
              )}
              {showDatePicker && Platform.OS === 'ios' && (
                <View>
                  <TouchableOpacity style={formStyle.cancelBtn} onPress={() => setShowDatePicker(false)}>
                    <Text style={formStyle.cancelBtnText}>Cancel</Text>
                  </TouchableOpacity>
                </View>
              )}
              <Text style={formStyle.label}>Publish Date</Text>
            </View>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}

export default UpdateItemInInventory;

const formStyle = StyleSheet.create({
  modalContainer: {
    flex: 1,
  },
  navbar: {
    height: 50,
    paddingLeft: 20,
    paddingRight: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  btnText: {
    fontSize: 16,
    color: '#fff',
    fontWeight: '700',
  },
  headerText: {
    padding: 20,
    fontSize: 30,
    fontWeight: '800',
    textAlign: 'center',
  },
  modalView: {
    height: '105%',
    paddingBottom: 30,
    shadowColor: '#000',
    backgroundColor: 'white',
  },
  inputField: {
    marginLeft: 20,
    marginRight: 20,
    marginBottom: 10,
  },
  userInput: {
    height: 50,
    marginTop: 5,
    padding: 8,
    fontSize: 18,
    borderWidth: 2,
    borderRadius: 5,
    borderColor: 'black',
  },
  label: {
    top: -3,
    left: 12,
    fontSize: 14,
    paddingLeft: 5,
    paddingRight: 5,
    fontWeight: '600',
    position: 'absolute',
    backgroundColor: 'white',
  },
  btn: {
    width: 60,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  datePicker: {
    height: 120,
    marginTop: 15,
    borderRadius: 20,
    color: 'red',
    backgroundColor: 'black',
  },
  calendarIcon: {
    top: 5,
    right: 10,
    height: 50,
    position: 'absolute',
    justifyContent: 'center',
  },
  cancelBtn: {
    backgroundColor: 'black',
  },
  multipleInputField: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  subInputField: {
    width: 162,
  },
  cancelBtnText: {
    color: 'white',
    textAlign: 'center',
    fontSize: 16,
    padding: 13,
    fontWeight: '600',
  },
});