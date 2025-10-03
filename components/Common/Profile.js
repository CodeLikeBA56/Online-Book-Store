import Searchbar from './Searchbar';
import { useState, useEffect } from 'react';
import male from '../../Assets/Male-Profile.jpg';
import female from '../../Assets/Female-Profile.jpg';
import { useAuthContext } from '../../Contexts/AuthContext';
import { useThemeContext } from '../../Contexts/ThemeContext';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  Image,
  ActivityIndicator,
} from 'react-native';

const Profile = () => {
  const { theme } = useThemeContext();
  const { userToken } = useAuthContext();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch(`https://book-e-commerce-bd561-default-rtdb.firebaseio.com/users/${userToken}.json`)
      .then((response) => {
        if (!response.ok) throw new Error('Failed to fetch user data.');
        return response.json();
      }).then((data) => {
        setUser(data);
      }).catch((error) => {
        Alert.alert('Error', error.message);
      }).finally(() => {
        setLoading(false);
      });
  }, [userToken]);

  const handleInputChange = (field, value) => {
    setUser({ ...user, [field]: value });
  };

  const handleSubmit = () => {
    if (!user.username || !user.email) {
      Alert.alert('Validation Error', 'Username and email are required.');
      return;
    }

    setSaving(true);

    fetch(`https://book-e-commerce-bd561-default-rtdb.firebaseio.com/users/${userToken}.json`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(user),
    }).then((response) => {
        if (!response.ok) throw new Error('Failed to update user data.');
        return response.json();
      }).then(() => {
        Alert.alert('Success', 'Profile updated successfully.');
      }).catch((error) => {
        Alert.alert('Error', error.message);
      }).finally(() => {
        setSaving(false);
      });
  };

  const handleProfilePress = () => {
    Alert.alert('Profile Action', 'Change profile picture feature is under development.');
  };

  if (loading) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center', backgroundColor: theme.background }]}>
        <ActivityIndicator size="large" color={theme.secondary} />
      </View>
    );
  }

  return (
    <>
      <Searchbar enableGoBack={true} />
      <ScrollView style={[styles.container, { backgroundColor: theme.background }]}>
        <View style={styles.form}>
          <TouchableOpacity style={styles.profileButton} onPress={handleProfilePress}>
            <Image
              source={user.gender === 'male' ? male : female}
              style={{ width: 150, height: 150, borderRadius: 75 }}
            />
          </TouchableOpacity>

          <View style={styles.inputField}>
            <TextInput
              style={[styles.userInput, { color: theme.textColor, borderColor: theme.textColor }]}
              value={user.username}
              onChangeText={(value) => handleInputChange('username', value)}
              placeholderTextColor={theme.textColor}
              autoCapitalize='word'
            />
            <Text
              style={[styles.label, { color: theme.textColor, backgroundColor: theme.background }]}
            >
              Username
            </Text>
          </View>

          <View style={styles.inputField}>
            <TextInput
              style={[styles.userInput, { color: theme.textColor, borderColor: theme.textColor }]}
              value={user.phone}
              onChangeText={(value) => handleInputChange('phone', value)}
              placeholderTextColor={theme.textColor}
              keyboardType="phone-pad"
            />
            <Text
              style={[styles.label, { color: theme.textColor, backgroundColor: theme.background }]}
            >
              Phone
            </Text>
          </View>

          <View style={styles.inputField}>
            <TextInput
              style={[styles.userInput, { color: theme.textColor, borderColor: theme.textColor }]}
              value={user.email}
              onChangeText={(value) => handleInputChange('email', value)}
              placeholderTextColor={theme.textColor}
              keyboardType="email-address"
              editable={false}
            />
            <Text
              style={[styles.label, { color: theme.textColor, backgroundColor: theme.background }]}
            >
              Email
            </Text>
          </View>

          <View style={styles.inputField}>
            <TextInput
              style={[styles.userInput, { color: theme.textColor, borderColor: theme.textColor }]}
              value={user.gender}
              onChangeText={(value) => handleInputChange('gender', value)}
              placeholderTextColor={theme.textColor}
              autoCapitalize='none'
            />
            <Text
              style={[styles.label, { color: theme.textColor, backgroundColor: theme.background }]}
            >
              Gender
            </Text>
          </View>

          <TouchableOpacity
            style={[styles.button, { backgroundColor: theme.secondary }]}
            onPress={handleSubmit}
            disabled={saving}
          >
            <Text style={[styles.buttonText, { color: theme.primary }]}>
              {saving ? 'Saving...' : 'Save Changes'}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  form: {
    marginTop: 20,
    marginLeft: 20,
    marginRight: 20,
    alignItems: 'center',
  },
  profileButton: {
    width: 150,
    height: 150,
    borderRadius: 75,
    marginBottom: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#1b1c1e',
  },
  inputField: {
    marginBottom: 26,
    position: 'relative',
    width: '100%',
  },
  userInput: {
    height: 50,
    fontSize: 18,
    padding: 10,
    borderWidth: 2,
    borderRadius: 5,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    position: 'absolute',
    left: 15,
    top: -8,
    paddingLeft: 5,
    paddingRight: 5,
  },
  button: {
    paddingVertical: 14,
    borderRadius: 50,
    alignItems: 'center',
    marginTop: 20,
    width: '100%',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default Profile;