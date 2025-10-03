import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, SafeAreaView, StyleSheet, KeyboardAvoidingView, Platform, Alert } from 'react-native';

export default function SignUp({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const defaultSettingsOfUser = async (userToken, email) => {
    try {
      await fetch(`https://book-e-commerce-bd561-default-rtdb.firebaseio.com/users/${userToken}.json`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: '',
          phone: '',
          gender: '',
          email,
        }),
      });
      await fetch(`https://book-e-commerce-bd561-default-rtdb.firebaseio.com/users/${userToken}/settings.json`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          darkMode: false,
          showLogout: true,
          showStatusbar: false,
        }),
      });
    } catch (error) {
      console.error('Error saving user settings:', error);
    }
  };

  const onSubmit = () => {
    if (!email || !password || !confirmPassword) {
      Alert.alert('Error', 'Please fill in all fields.');
      return;
    }
    if (!validateEmail(email)) {
      Alert.alert('Error', 'Please enter a valid email address.');
      return;
    }
    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match.');
      return;
    }
    if (password.length < 6) {
      Alert.alert('Error', 'Password should be at least 6 characters long.');
      return;
    }

    setLoading(true);

    fetch("https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=", {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email,
        password,
        returnSecureToken: true,
      }),
    }).then(response => response.json())
      .then(async (result) => {
        if (result.error) {
          const errorMessage = result.error.message;

          if (errorMessage === 'EMAIL_EXISTS') {
            Alert.alert('Error', 'This email address is already in use.');
          } else if (errorMessage === 'INVALID_EMAIL') {
            Alert.alert('Error', 'The email address is not valid.');
          } else if (errorMessage === 'WEAK_PASSWORD') {
            Alert.alert('Error', 'The password is too weak.');
          } else {
            Alert.alert('Error', errorMessage);
          }
        } else if (result.idToken) {
          await defaultSettingsOfUser(result.localId, result.email);
          Alert.alert('Success', 'Registration successful!');
          navigation.replace('Login');
        } else {
          Alert.alert('Error', 'Unexpected error occurred.');
        }
      }).catch((error) => {
        Alert.alert('Error', 'Network error occurred. Please try again.');
      }).finally(() => {
        setLoading(false);
      });
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      enabled={true}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <SafeAreaView>
        <View style={styles.loginContainer}>
          <View style={styles.inputField}>
            <Text style={styles.label}>Email</Text>
            <TextInput
              style={styles.userInput}
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              autoFocus
              returnKeyType='done'
            />
          </View>
          <View style={styles.inputField}>
            <Text style={styles.label}>Password</Text>
            <TextInput
              style={styles.userInput}
              value={password}
              onChangeText={setPassword}
              secureTextEntry={true}
            />
          </View>
          <View style={styles.inputField}>
            <Text style={styles.label}>Confirm Password</Text>
            <TextInput
              style={styles.userInput}
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry={true}
            />
          </View>
          <TouchableOpacity style={styles.button} activeOpacity={0.5} onPress={onSubmit} disabled={loading}>
            <Text style={styles.buttonText}>{loading ? 'Registering...' : 'Register'}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={{ marginTop: 20, flexDirection: 'row', justifyContent: 'center' }}
            onPress={() => navigation.goBack()}
          >
            <Text style={{ textDecorationLine: 'underline', fontSize: 14, fontWeight: '600', textAlign: 'center' }}>
              Already have an account?
            </Text>
            <Text style={{ fontSize: 14, fontWeight: '600', textAlign: 'center', marginLeft: 5, color: '#ff8bb1' }}>
              Sign-in
            </Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#FFAD01',
  },
  loginContainer: {
    width: 350,
    margin: 20,
    marginTop: 0,
    padding: 40,
    borderRadius: 20,
    position: 'relative',
    backgroundColor: '#fff',
  },
  inputField: {
    marginTop: 10,
  },
  label: {
    fontSize: 18,
    fontWeight: '600',
  },
  userInput: {
    height: 40,
    padding: 7,
    fontSize: 16,
    borderColor: 'grey',
    borderBottomWidth: 2,
  },
  button: {
    padding: 16,
    marginTop: 30,
    borderRadius: 50,
    overflow: 'hidden',
    backgroundColor: '#FFAD01',
  },
  buttonText: {
    fontSize: 18,
    color: 'white',
    letterSpacing: 2,
    fontWeight: '800',
    textAlign: 'center',
  }
});
