import User from '../Users';
import Profile from '../Profile';
import Dashboard from '../Dashboard';
import Inventory from '../Inventory/Inventory';
import { Text, View, StyleSheet } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Entypo, Octicons, MaterialIcons, FontAwesome } from '@expo/vector-icons';

const Tab = createBottomTabNavigator();

function Tabs() {
  const components = [
    {
      name: 'Dashboard',
      component: Dashboard,
      iconComponent: Entypo,
      props: { name: 'home', size: 24, color: 'black' }
    },
    {
      name: 'Inventory',
      component: Inventory,
      iconComponent: Octicons,
      props: { name: 'checklist', size: 24 }
    },
    {
      name: 'Users',
      component: User,
      iconComponent: FontAwesome,
      props: { name: 'users', size: 24 }
    },
    {
      name: 'Admin-Profile',
      component: Profile,
      iconComponent: MaterialIcons,
      props: { name: 'account-circle', size: 24 }
    },
  ];

  const Icon = ({ focused, name, iconComponent: Icon, props }) => {
    return (
      <View style={{ alignItems: 'center', justifyContent: 'center' }}>
        <Icon {...props} color={focused ? '#e32f45' : '#fff'} />
        <Text style={{ color: focused ? '#e32f45' : '#fff', fontSize: 12, marginTop: 3 }}>{name}</Text>
      </View>
    );
  };

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused }) => {
          const tab = components.find(c => c.name === route.name);
          return <Icon focused={focused} name={tab.name} iconComponent={tab.iconComponent} props={tab.props} />;
        },
        tabBarStyle: {
          height: 60,
          alignItems: 'center',
          justifyContent: 'center',
          alignContent: 'center',
          backgroundColor: '#FFAD01',
          ...tabsStyle.shadow,
        },
        headerShown: false,
        tabBarShowLabel: false,
      })}
      initialRouteName="Dashboard"
    >
      {
        components.map((tab, index) => (
          <Tab.Screen key={index} name={tab.name} component={tab.component} />
        ))
      }
    </Tab.Navigator>
  );
}

export default Tabs;

const tabsStyle = StyleSheet.create({
  shadow: {
    elevation: 5,
    shadowRadius: 3.5,
    shadowOpacity: .25,
    shadowColor: '#333',
    shadowOffset: { width: 0, height: -5 },
  },
});