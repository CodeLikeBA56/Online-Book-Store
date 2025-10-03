import React from 'react';
import Home from '../Home';
import Cart from '../Cart';
import Settings from '../Setting';
import Wishlist from '../Wishlist';
import { Text, View, StyleSheet } from 'react-native';
import { Entypo, MaterialIcons, FontAwesome } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

const Icon = ({ focused, name, IconComponent, iconProps }) => {
  return (
    <View style={{ alignItems: 'center', justifyContent: 'center' }}>
      <IconComponent {...iconProps} color={focused ? '#e32f45' : '#fff'} />
      <Text style={{ color: focused ? '#e32f45' : '#fff', fontSize: 12, marginTop: 3 }}>{name}</Text>
    </View>
  );
};

function Tabs() {
  const components = [
    {
      name: 'Home',
      component: Home,
      iconComponent: Entypo,
      iconProps: { name: 'home', size: 24 },
    },
    {
      name: 'Wishlist',
      component: Wishlist,
      iconComponent: FontAwesome,
      iconProps: { name: 'heart', size: 24 },
    },
    {
      name: 'Cart',
      component: Cart,
      iconComponent: FontAwesome,
      iconProps: { name: 'cart-plus', size: 24 },
    },
    {
      name: 'Setting',
      component: Settings,
      iconComponent: MaterialIcons,
      iconProps: { name: 'settings', size: 24 },
    },
  ];

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused }) => {
          const tab = components.find((c) => c.name === route.name);
          return (
            <Icon
              focused={focused}
              name={tab.name}
              IconComponent={tab.iconComponent}
              iconProps={tab.iconProps}
            />
          );
        },
        tabBarStyle: {
          height: 60,
          backgroundColor: '#FFAD01',
          ...tabsStyle.shadow,
        },
        tabBarShowLabel: false,
        headerShown: false,
      })}
      initialRouteName="Home"
    >
      {components.map((tab, index) => (
        <Tab.Screen key={index} name={tab.name} component={tab.component} />
      ))}
    </Tab.Navigator>
  );
}

export default Tabs;

const tabsStyle = StyleSheet.create({
  shadow: {
    elevation: 5,
    shadowRadius: 3.5,
    shadowOpacity: 0.25,
    shadowColor: '#333',
    shadowOffset: { width: 0, height: -5 },
  },
});