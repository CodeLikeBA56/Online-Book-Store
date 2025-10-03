import { useState } from 'react';
import * as ImagePicker from 'expo-image-picker';
import { FontAwesome, FontAwesome6 } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useInventoryContext } from '../../../Contexts/InventoryContext';
import {
  View,
  Text,
  Alert,
  Platform,
  TextInput,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  ActivityIndicator,
  Dimensions,
} from 'react-native';

const screenWidth = Dimensions.get('window').width;

function AddItemToInventory({ setModalVisibility }) {
  const [name, setName] = useState('');
  const [isbn, setIsbn] = useState('');
  const [price, setPrice] = useState('0');
  const [images, setImages] = useState([]);
  const [author, setAuthor] = useState('');
  const [quantity, setQuantity] = useState('0');
  const [publishDate, setPublishDate] = useState(new Date());

  const [loading, setLoading] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const { validateBook, addBookToInventory } = useInventoryContext();

  const toggleDatePicker = () => setShowDatePicker(!showDatePicker);

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
    const book = {
      name,
      isbn,
      author,
      publishDate,
      price: parseFloat(price),
      quantity: parseInt(quantity, 10),
      image: 'https://via.placeholder.com/85',
    };
    const validate = validateBook(book);
    if (validate.valid === false) {
      Alert.alert(validate.valid, validate.message);
      return;
    }

    setLoading(true);
    addBookToInventory(book);

    setTimeout(() => {
      setName('');
      setIsbn('');
      setAuthor('');
      setPublishDate(new Date());
      setImages([]);
      setPrice('');
      setQuantity('');
      setLoading(false);
      setModalVisibility(false);
    }, 1600);
  };

  const pickImages = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      quality: 1,
      aspect: [4, 3],
      selectionLimit: 4,
      orderedSelection: true,
      allowsMultipleSelection: true,
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
    });

    if (!result.canceled) {
      setImages(result.assets.map(asset => asset.uri));
    }
  };

  return (
    <SafeAreaView style={formStyle.safeArea}>
      <View style={formStyle.navbar}>
        <TouchableOpacity
          style={formStyle.btn}
          onPress={() => setModalVisibility(false)}>
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
                autoCapitalize="words"
              />
              <Text style={formStyle.label}>Book Name</Text>
            </View>
            <View style={formStyle.inputField}>
              <TextInput
                style={formStyle.userInput}
                value={isbn}
                onChangeText={setIsbn}
              />
              <Text style={formStyle.label}>Book ISBN</Text>
            </View>
            <View style={formStyle.inputField}>
              <TextInput
                style={formStyle.userInput}
                value={author}
                onChangeText={setAuthor}
                autoCapitalize="words"
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
                />
                <Text style={formStyle.label}>Price</Text>
              </View>
              <View style={formStyle.subInputField}>
                <TextInput
                  style={formStyle.userInput}
                  keyboardType="numeric"
                  value={quantity}
                  onChangeText={setQuantity}
                />
                <Text style={formStyle.label}>Quantity</Text>
              </View>
            </View>
            <View style={formStyle.dateAndImageContainer}>
              <View>
                <TextInput
                  style={formStyle.publishDateInput}
                  value={publishDate.toDateString()}
                  editable={false}
                />
                <TouchableOpacity
                  style={formStyle.calendarIcon}
                  onPress={toggleDatePicker}>
                  <FontAwesome name="calendar" size={24} color="black" />
                </TouchableOpacity>
                <Text style={formStyle.label}>Publish Date</Text>
              </View>
              <TouchableOpacity
                style={formStyle.imagePickerBtn}
                onPress={() => pickImages()}>
                <FontAwesome6 name="image" size={24} color="white" />
              </TouchableOpacity>
            </View>
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
                <TouchableOpacity
                  style={formStyle.cancelBtn}
                  onPress={() => setShowDatePicker(false)}>
                  <Text style={formStyle.cancelBtnText}>Cancel</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}

export default AddItemToInventory;

const formStyle = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFAD01',
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
  modalContainer: {
    flex: 1,
  },
  modalView: {
    height: '105%',
    paddingBottom: 30,
    shadowColor: '#000',
    backgroundColor: 'white',
  },
  headerText: {
    padding: 20,
    fontSize: 30,
    fontWeight: '800',
    textAlign: 'center',
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
  publishDateInput: {
    height: 50,
    width: 275,
    padding: 8,
    fontSize: 18,
    marginTop: 5,
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
  cancelBtnText: {
    color: 'white',
    textAlign: 'center',
    fontSize: 16,
    padding: 10,
  },
  multipleInputField: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  subInputField: {
    width: screenWidth / 2.4,
  },
  dateAndImageContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginLeft: 20,
    marginRight: 20,
    marginBottom: 10,
  },
  imagePickerBtn: {
    width: 50,
    height: 50,
    marginTop: 5,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#007bff',
    borderRadius: 5,
  },
});