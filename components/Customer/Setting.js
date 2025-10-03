import { useState, useEffect } from 'react';
import maleProfile from '../../Assets/Male-Profile.jpg';
import femaleProfile from '../../Assets/Female-Profile.jpg';
import { useAuthContext } from '../../Contexts/AuthContext';
import { useThemeContext } from '../../Contexts/ThemeContext';
import { useSettingContext } from '../../Contexts/SettingContext';
import { StyleSheet, View, Text, Image, TouchableOpacity, Switch, Alert } from 'react-native';

const Settings = ({navigation}) => {
  const {userToken, logoutUser, user} = useAuthContext();
  const [username, setUsername] = useState('Loading...');
  const {theme, isDarkMode, toggleTheme} = useThemeContext();
  const {showLogoutBtn, showStatusbar, toggleShowLogoutBtn, toggleShowStatusbar} = useSettingContext();
  
  const createLogoutAlert = () => {
    Alert.alert(
      'Confirm Logout',
      'Are you sure you want to log out?',
      [
        { text: 'Cancel' },
        {
          text: 'Logout',
          onPress: () => {
            navigation.reset({
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

  useEffect(() => {
    const fetchUsername = async () => {
      const response = await fetch(`https://book-e-commerce-bd561-default-rtdb.firebaseio.com/users/${userToken}.json`);
      const data = await response.json();
      const username = data.username;
      setUsername(username);
    } 
    fetchUsername();
  }, [userToken])

  return (
    <View style={[settingStyles.container, {backgroundColor: theme.background}]}>
      <Text style={[settingStyles.title, {color: theme.textColor}]}>Settings</Text>
      <View style={[settingStyles.profile, {marginBottom: 30, borderRadius: 8, backgroundColor: theme.primary}]}>
        <TouchableOpacity
          style={settingStyles.profileBtn}
          onPress={() => navigation.navigate('Profile')}
        >
          <Image
            resizeMode='contain'
            style={[settingStyles.avatar, {backgroundColor: theme.background}]}
            source={user !== null? user.gender === 'male'? maleProfile : femaleProfile : null} />
          <Text style={[settingStyles.personName, {color: theme.textColor}]}>{username}</Text>
        </TouchableOpacity>
      </View>
      <View style={{overflow: 'hidden', marginBottom: 15}}>
        <View style={[settingStyles.profile, {backgroundColor: theme.primary, borderTopLeftRadius: 8, borderTopRightRadius: 8}]}>
          <TouchableOpacity
            style={[settingStyles.btn, {justifyContent: 'space-between'}]}
          >
            <Text style={[settingStyles.text, {color: theme.textColor}]}>Show Logout on Top</Text>
            <Switch onValueChange={toggleShowLogoutBtn} value={showLogoutBtn} ios_backgroundColor="#3e3e3e" />
          </TouchableOpacity>
        </View>
        <View style={[settingStyles.profile, {backgroundColor: theme.primary}]}>
          <TouchableOpacity
            style={[settingStyles.btn, {justifyContent: 'space-between'}]}
          >
            <Text style={[settingStyles.text, {color: theme.textColor}]}>Dark Mode</Text>
            <Switch onValueChange={toggleTheme} value={isDarkMode} ios_backgroundColor="#3e3e3e"/>
          </TouchableOpacity>
        </View>
        <View style={[settingStyles.profile, {backgroundColor: theme.primary, borderBottomLeftRadius: 8, borderBottomRightRadius: 8}]}>
          <TouchableOpacity
            style={[settingStyles.btn, {justifyContent: 'space-between'}]}
          >
            <Text style={[settingStyles.text, {color: theme.textColor}]}>Hide Statusbar</Text>
            <Switch onValueChange={toggleShowStatusbar} value={showStatusbar} ios_backgroundColor="#3e3e3e"/>
          </TouchableOpacity>
        </View>
      </View>
      <View style={[settingStyles.profile, {backgroundColor: theme.primary, borderRadius: 8}]}>
        <TouchableOpacity
          style={[settingStyles.btn, {justifyContent: 'center', height: 50}]}
          onPress={createLogoutAlert}
        >
          <Text style={[settingStyles.text, {color: 'red', fontSize: 18, fontWeight: 800}]}>Logout</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const settingStyles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 12,
    paddingBottom: 12,
  },
  title:{
    padding: 12,
    fontSize: 28,
    fontWeight: 800,
    paddingBottom: 24,
  },
  profile: {
    paddingLeft: 15,
    paddingRight: 15,
    marginLeft: 20,
    marginRight: 20,
  },
  avatar: {
    width: 45,
    height: 45,
    marginRight: 8,
    borderRadius: 50,
  },
  profileBtn: {
    height: 80,
    flexDirection: 'row',
    alignItems: 'center',
  },
  personName: {
    fontSize: 18,
    fontWeight: 600,
  },
  btn: {
    height: 55,
    flexDirection: 'row',
    alignItems: 'center',
  },
  text: {
    fontSize: 15,
    fontWeight: 700,
  }
});

export default Settings;