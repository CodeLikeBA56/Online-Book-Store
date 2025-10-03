import { useState } from 'react';
import PandaFace from '../PandaFace';
import { useAuthContext } from '../Contexts/AuthContext';
import { View, Text, Alert, TextInput, StyleSheet, SafeAreaView, TouchableOpacity, KeyboardAvoidingView, Platform } from 'react-native';

export default function Login({ navigation }) {
  const { login } = useAuthContext();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const adminUID = 'ynwPy0bx7Sbj5WIy1qBUJ3TpcIk2';

  const onSubmit = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please fill in both fields.');
      return;
    }

    try {
      const response = await fetch("https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=", {
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
      });

      const result = await response.json();

      if (!response.ok) {
        const errorMessage = result.error?.message || 'Authentication failed. Please try again.';
        Alert.alert('Error', errorMessage);
        return;
      }

      if (result.localId === adminUID) {
        login(result.localId);
        navigation.replace('AdminHome');
      } else {
        login(result.localId);
        navigation.replace('CustomerHome');
      }

    } catch (error) {
      Alert.alert('Error', 'An unexpected error occurred. Please try again.');
      console.error('Error:', error);
    }
  };
  
  return (
    <KeyboardAvoidingView
      style={styles.container}
      enabled={true}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <SafeAreaView>
        <PandaFace />
        <View style={styles.loginContainer}>
          <View style={[styles.pandaLimb, styles.pandaLeftHand]}></View>
          <View style={[styles.pandaLimb, styles.pandaRightHand]}></View>
          <View style={styles.inputField}>
            <Text style={styles.label}>Email</Text>
            <TextInput
              style={styles.userInput}
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
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
          <TouchableOpacity style={styles.button} activeOpacity={0.5} onPress={onSubmit}>
            <Text style={styles.buttonText}>Login</Text>
          </TouchableOpacity>
          <View style={[styles.pandaLimb, styles.pandaLeftFoot]}>
            <View style={[styles.nail, styles.leftNail]}></View>
            <View style={[styles.nail, styles.middleNail]}></View>
            <View style={[styles.nail, styles.rightNail]}></View>
            <View style={styles.innerSide}></View>
          </View>
          <View style={[styles.pandaLimb, styles.pandaRightFoot]}>
            <View style={[styles.nail, styles.leftNail]}></View>
            <View style={[styles.nail, styles.middleNail]}></View>
            <View style={[styles.nail, styles.rightNail]}></View>
            <View style={styles.innerSide}></View>
          </View>
          <TouchableOpacity
            style={{ marginTop: 12, flexDirection: 'row', justifyContent: 'center' }}
            onPress={() => navigation.navigate('Sign-up')}
          >
            <Text style={{ textDecorationLine: 'underline', fontSize: 14, fontWeight: '600', textAlign: 'center' }}>
              Don't have an account?
            </Text>
            <Text style={{ fontSize: 14, fontWeight: '600', textAlign: 'center', marginLeft: 5, color: '#ff8bb1' }}>
              Sign-up
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
  },
  pandaLimb: {
    position: 'absolute',
    backgroundColor: '#3f3554',
    borderTopLeftRadius: 6,
    borderTopRightRadius: 6,
  },
  pandaLeftHand: {
    width: 40,
    height: 60,
    top: '-10%',
    left: '15%',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  pandaRightHand: {
    width: 40,
    height: 60,
    top: '-10%',
    right: '15%',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  pandaLeftFoot: {
    width: 40,
    height: 45,
    bottom: '-8%',
    left: '28%',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    borderBottomLeftRadius: 9,
    borderBottomRightRadius: 9,
  },
  pandaRightFoot: {
    width: 40,
    height: 45,
    bottom: '-8%',
    right: '28%',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    borderBottomLeftRadius: 9,
    borderBottomRightRadius: 9,
  },
  innerSide: {
    width: 25,
    height: 20,
    marginBottom: 8,
    overflow: 'hidden',
    marginTop: 'auto',
    marginLeft: 'auto',
    marginRight: 'auto',
    backgroundColor: '#fff',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    borderBottomLeftRadius: 9,
    borderBottomRightRadius: 9,
  },
  nail: {
    position: 'absolute',
    width: 6,
    height: 6,
    borderRadius: 50,
    backgroundColor: '#fff',
  },
  leftNail: {
    top: '22%',
    left: '13%',
  },
  rightNail: {
    top: '22%',
    right: '13%',
  },
  middleNail: {
    top: '9%',
    left: '50%',
    transform: [{ translateX: -3.5 }],
  },
});
