import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import NewsScreen from '../../screens/NewsScreen';
import ProfileScreen from '../../screens/ProfileScreen';
import HomeScreen from '../../screens/HomeScreen';
import TestScreen from '../../screens/TestScreen';

const Tab = createBottomTabNavigator();

const TabNavigator = () => {
  return (
    <Tab.Navigator screenOptions={{ tabBarActiveTintColor: '#CE8964' }}>
      <Tab.Screen
        name='Home'
        component={HomeScreen}
        options={{
          headerTintColor: '#E7C4B1',
          headerTitleAlign: 'center',
          headerStyle: {
            backgroundColor: '#131200',
          },
          tabBarIcon: () => <Ionicons name='home-outline' size={20} />,
        }}
      />
      <Tab.Screen
        name='News'
        component={NewsScreen}
        options={{
          headerTintColor: '#E7C4B1',
          headerTitleAlign: 'center',
          headerStyle: {
            backgroundColor: '#131200',
          },
          tabBarIcon: () => <Ionicons name='newspaper-outline' size={20} />,
        }}
      />
      <Tab.Screen
        name='Profile'
        component={ProfileScreen}
        options={{
          headerTintColor: '#E7C4B1',
          headerTitleAlign: 'center',
          headerStyle: {
            backgroundColor: '#131200',
          },
          tabBarIcon: () => <Ionicons name='person-circle-outline' size={20} />,
        }}
      />
      <Tab.Screen
        name='Test'
        component={TestScreen}
        options={{
          headerTintColor: '#E7C4B1',
          headerTitleAlign: 'center',
          headerStyle: {
            backgroundColor: '#131200',
          },
          tabBarIcon: () => <Ionicons name='settings-outline' size={20} />,
        }}
      />
    </Tab.Navigator>
  );
};

export default TabNavigator;
