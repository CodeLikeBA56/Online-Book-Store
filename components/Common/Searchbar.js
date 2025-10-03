import React, { useState, useRef } from 'react';
import { useNavigation } from '@react-navigation/native';
import { useAuthContext } from '../../Contexts/AuthContext';
import { Entypo, FontAwesome, MaterialIcons } from '@expo/vector-icons';
import { View, TextInput, StyleSheet, TouchableOpacity, Animated, Alert } from 'react-native';

const Searchbar = ({ enableGoBack, navigateTo, searchbar, wishlist, logout, handleFilteredData }) => {
  const {logoutUser} = useAuthContext();
  const Navigation = useNavigation();
  const [search, setSearch] = useState('');
  const [tapCount, setTapCount] = useState(0);
  const [isFocused, setIsFocused] = useState(false);

  const searchbarWidth = useRef(new Animated.Value(40)).current;
  const searchbarRef = useRef(null);

  const createLogoutAlert = () => {
    Alert.alert(
      'Confirm Logout',
      'Are you sure you want to log out?',
      [{ text: 'Cancel' },
       { text: 'Logout',
         style: 'destructive',
         onPress: () => {
          Navigation.reset({
            index: 0,
            routes: [{ name: 'Login' }],
          });
          logoutUser();
         },
        },
      ],
      { cancelable: false }
    );
  };

  const validateInput = () => {
    return search.trim().length > 0;
  };

  const handleSearchBar = () => {
    if(tapCount === 0) {
      searchbarRef.current?.focus();
      setTapCount(1);
      Animated.timing(searchbarWidth, {
        toValue: 260,
        duration: 700,
        useNativeDriver: false,
      }).start();
    }
    if (tapCount > 0 && validateInput())
      handleFilteredData(search);
  };

  const handleBlurSearchbar = () => {
    if (tapCount === 1 && !validateInput()) {
      setTapCount(0);
      Animated.timing(searchbarWidth, {
        toValue: 40,
        duration: 700,
        useNativeDriver: false,
      }).start();
      handleFilteredData(search);
    }
    setIsFocused(false);
  };

  return (
    <View style={[searchbarStyle.navigationbar, searchbarStyle.shadow]}>
      {enableGoBack && (
        <TouchableOpacity
          style={[searchbarStyle.backBtn, { marginRight: 'auto' }]}
          onPress={() => Navigation.goBack()}
        >
          <MaterialIcons name="arrow-back-ios" size={24} color="white" />
        </TouchableOpacity>
      )}
      {searchbar && (
        <Animated.View
          style={[searchbarStyle.searchbarContainer, { width: searchbarWidth }]}
        >
          <TextInput
            ref={searchbarRef}
            style={[searchbarStyle.searchbar,{
                paddingRight: isFocused ? 40 : 15,
                borderColor: isFocused ? 'grey' : 'white',
            }]}
            placeholder="Search"
            value={search}
            onChangeText={setSearch}
            onFocus={() => setIsFocused(true)}
            onBlur={handleBlurSearchbar}
            returnKeyType="search"
            onSubmitEditing={() => validateInput() && handleFilteredData(search)}
          />
          <TouchableOpacity
            style={searchbarStyle.searchbarIcon}
            onPress={handleSearchBar}
          >
            <FontAwesome name="search" size={24} color="black" />
          </TouchableOpacity>
        </Animated.View>
      )}
      {wishlist && (
        <TouchableOpacity
          style={searchbarStyle.btn}
          onPress={() => Navigation.navigate('Wishlist')}
        >
          <Entypo name="heart" size={30} color="black" />
        </TouchableOpacity>
      )}
      {logout && (
        <TouchableOpacity style={searchbarStyle.btn} onPress={createLogoutAlert}>
          <FontAwesome name="power-off" size={25} color="black" />
        </TouchableOpacity>
      )}
    </View>
  );
};

export default Searchbar;

const searchbarStyle = StyleSheet.create({
  navigationbar: {
    height: 55,
    paddingLeft: 10,
    paddingRight: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    backgroundColor: '#FFAD01',
  },
  searchbarContainer: {
    marginLeft: 'auto',
    flexDirection: 'row',
    alignItems: 'center',
    overflow: 'hidden',
    justifyContent: 'flex-start',
  },
  searchbar: {
    width: '100%',
    height: 40,
    fontSize: 15,
    borderWidth: 2,
    paddingLeft: 15,
    borderRadius: 10,
    backgroundColor: '#ffffff',
  },
  searchbarIcon: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    right: 0,
  },
  backBtn: {
    width: 40,
    height: 40,
    alignItems: 'center',
    marginLeft: 8,
    borderRadius: 10,
    justifyContent: 'center',
  },
  btn: {
    width: 40,
    height: 40,
    alignItems: 'center',
    marginLeft: 8,
    borderRadius: 10,
    backgroundColor: '#fff',
    justifyContent: 'center',
  },
  shadow: {
    elevation: 5,
    shadowRadius: 3.5,
    shadowOpacity: 0.25,
    shadowColor: '#333',
    shadowOffset: { width: 0, height: 5 },
  },
});