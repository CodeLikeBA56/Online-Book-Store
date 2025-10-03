import { useState } from 'react';
import Searchbar from '../Common/Searchbar';
import { useNavigation } from '@react-navigation/native';
import { useThemeContext } from '../../Contexts/ThemeContext';
import { useSettingContext } from '../../Contexts/SettingContext';
import { useInventoryContext } from '../../Contexts/InventoryContext';
import {
  StyleSheet,
  FlatList,
  Image,
  View,
  Text,
  TouchableOpacity,
} from 'react-native';

const Home = () => {
  const {theme} = useThemeContext();
  const {inventory, searchBooks} = useInventoryContext();
  const {showLogoutBtn} = useSettingContext();
  const [filteredBooks, setFilteredBooks] = useState(null);

  const navigation = useNavigation();

  const RenderBook = ({ item }) => {
    return (
      <TouchableOpacity
        style={[homeStyles.itemContainer, {backgroundColor: theme.primary}]}
        activeOpacity={0.6}
        onPress={() => navigation.navigate('BookDetailsScreen', { item })}>
        <Image
          resizeMode="contain"
          source={{ uri: item.image }}
          style={homeStyles.productImage}
        />
        <View style={{ marginTop: 'auto', padding: 8 }}>
          <Text style={[homeStyles.productName, {color: theme.textColor}]}>{item.name}</Text>
          <Text style={[homeStyles.productAuthor, {color: theme.textColor}]}>{item.author}</Text>
          <Text style={[homeStyles.productPrice, {color: theme.textColor}]}>
            Rs. {item.price.toFixed(2)}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  const handleSearchbar = (searchedKeyword) => {
    if(searchedKeyword.trim().length > 0)
      setFilteredBooks(searchBooks(searchedKeyword));
    else
      setFilteredBooks(null);
  }

  return (
    <>
      <Searchbar searchbar={true} wishlist={true} logout={showLogoutBtn} handleFilteredData={handleSearchbar} />
      <View style={[homeStyles.container, {backgroundColor: theme.background}]}>
        <FlatList
          style={homeStyles.flatListContainer}
          data={filteredBooks === null? inventory : filteredBooks}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => <RenderBook item={item} />}
          numColumns={2}
          showsVerticalScrollIndicator={false}
          columnWrapperStyle={homeStyles.columnWrapper}
        />
      </View>
    </>
  );
};

const homeStyles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 12,
    paddingBottom: 12,
  },
  flatListContainer: {
    paddingHorizontal: 12,
  },
  columnWrapper: {
    justifyContent: 'space-between',
  },
  itemContainer: {
    flex: 1,
    margin: 8,
    borderRadius: 12,
    overflow: 'hidden',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  productImage: {
    width: '100%',
    height: 100,
  },
  productName: {
    fontSize: 15,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  productAuthor: {
    fontSize: 14,
    marginBottom: 4,
  },
  productPrice: {
    fontSize: 14,
    fontWeight: '600',
  },
});

export default Home;