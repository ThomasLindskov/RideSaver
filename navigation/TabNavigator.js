import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import NewsScreen from '../screens/NewsScreen';
import ProfileScreen from '../screens/ProfileScreen';
import HomeScreen from '../screens/HomeScreen';

const Tab = createBottomTabNavigator();

const TabNavigator = () => {
  return (
    <Tab.Navigator>
      <Tab.Screen
        name='Home'
        component={HomeScreen}
        options={{
          tabBarIcon: () => <Ionicons name='home-outline' size={20} />,
        }}
      />
      <Tab.Screen
        name='News'
        component={NewsScreen}
        options={{
          tabBarIcon: () => <Ionicons name='newspaper-outline' size={20} />,
        }}
      />
      <Tab.Screen
        name='Profile'
        component={ProfileScreen}
        options={{
          tabBarIcon: () => <Ionicons name='person-circle-outline' size={20} />,
        }}
      />
    </Tab.Navigator>
  );
};

export default TabNavigator;
