import Login from './Pages/Login';
import SignUp from './Pages/Sign-up';
import Profile from './components/Common/Profile';
import AdminHome from './Pages/Admin-Home-Screen';
import BookDetail from './Pages/Book-Detail-Screen';
import { SafeAreaView, StatusBar } from 'react-native';
import CustomerHome from './Pages/Customer-Home-Screen';
import {useThemeContext} from './Contexts/ThemeContext';
import {useSettingContext} from './Contexts/SettingContext';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

const Stack = createNativeStackNavigator();

export default function App() {

  const {theme} = useThemeContext();
  const {showStatusbar} = useSettingContext();

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: theme.secondary}}>
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: false }} initialRouteName="Login">
          <Stack.Screen name="Login" component={Login} />
          <Stack.Screen name="Profile" component={Profile} />
          <Stack.Screen name="Sign-up" component={SignUp} />
          <Stack.Screen name="AdminHome" component={AdminHome} />
          <Stack.Screen name="CustomerHome" component={CustomerHome} />
          <Stack.Screen name="BookDetailsScreen" component={BookDetail} />
        </Stack.Navigator>
      </NavigationContainer>
      <StatusBar hidden={showStatusbar} />
    </SafeAreaView>
  );
}