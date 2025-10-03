import {
  StyleSheet,
  SafeAreaView,
} from 'react-native';
import Tabs from '../components/Customer/Navigation/Tabs';
import { NavigationContainer } from '@react-navigation/native';

export default function CustomerHome() {
  return (
    <SafeAreaView style={customerStyle.safeArea}>
      <Tabs />
    </SafeAreaView>
  );
}

const customerStyle = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFAD01',
  },
});