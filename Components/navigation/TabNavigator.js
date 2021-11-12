// Importing modules, screens and components used for the bootom tab navigator
import React, { useEffect, useState } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';
import ProfileScreen from '../../screens/ProfileScreen';
import HomeScreen from '../../screens/HomeScreen';
import LoginScreen from '../../screens/LoginScreen';
import { auth } from '../../firebase';
import { Button } from 'react-native';
import MapScreen from '../../screens/MapScreen';
import CoordinateStackNavigator from './CoordinateStackNavigator';

const Tab = createBottomTabNavigator();

// Is passed navigation as state
const TabNavigator = ({ navigation }) => {
  // We set an initial state of loggedIn to false, to use firebase to check whether a user is logged in or not
  const [user, setUser] = useState({ loggedIn: false });

  // Check the login state of a user - This is code from firebase
  function onAuthStateChange(callback) {
    return auth.onAuthStateChanged((user) => {
      if (user) {
        callback({ loggedIn: true, user: user });
      } else {
        callback({ loggedIn: false });
      }
    });
  }

  //useEffect hook, which listens for onAuthChanged to know if the user is active or not or unsubscribes them (log out)
  useEffect(() => {
    const unsubscribe = onAuthStateChange(setUser);
    return () => {
      unsubscribe();
    };
  }, []);

  //TabScreen for loggin in, which is only shown if loggedIn: false
  const loginTab = () => {
    if (!user.loggedIn) {
      return (
        <Tab.Screen
          name="Log In"
          component={LoginScreen}
          options={{
            headerTintColor: '#E7C4B1',
            headerTitleAlign: 'center',
            headerStyle: {
              backgroundColor: '#131200',
            },
            headerRight: () => LogoutButton(),
            tabBarIcon: () => <Ionicons name="home-outline" size={20} />,
          }}
        />
      );
    } else {
      // If loggedIn is not false, a TabScreen is shown for the profile screen.
      return (
        <Tab.Screen
          name="Profile"
          component={ProfileScreen}
          options={{
            headerTintColor: '#E7C4B1',
            headerTitleAlign: 'center',
            headerStyle: {
              backgroundColor: '#131200',
            },
            headerRight: () => LogoutButton(),
            tabBarIcon: () => (
              <Ionicons name="person-circle-outline" size={20} />
            ),
          }}
        />
      );
    }
  };

  // The logout button is shown if a user is logged in and changes the loggedIn state if pressed, and navigates to homescreen
  const LogoutButton = () => {
    if (user.loggedIn) {
      return (
        <Button
          onPress={() => {
            auth
              .signOut()
              .then(() => {
                navigation.replace('HomeScreen');
              })
              .catch((error) => alert(error.message));
          }}
          title="Logout"
          color="#000"
        />
      );
    }
  };

  //Show Homescreen, MapScreen and CoordinateStackNavigator regardless of loggedIn status
  return (
    <Tab.Navigator screenOptions={{ tabBarActiveTintColor: '#CE8964' }}>
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          headerTintColor: '#E7C4B1',
          headerTitleAlign: 'center',
          headerStyle: {
            backgroundColor: '#131200',
          },
          headerRight: () => LogoutButton(),
          tabBarIcon: () => <Ionicons name="home-outline" size={20} />,
        }}
      />

      <Tab.Screen
        name="Map"
        component={MapScreen}
        options={{
          headerTintColor: '#E7C4B1',
          headerTitleAlign: 'center',
          headerStyle: {
            backgroundColor: '#131200',
          },
          headerRight: () => LogoutButton(),
          tabBarIcon: () => <Ionicons name="globe" size={20} />,
        }}
      />
      <Tab.Screen
        name="Coordinates"
        component={CoordinateStackNavigator}
        options={{
          headerTintColor: '#E7C4B1',
          headerTitleAlign: 'center',
          headerStyle: {
            backgroundColor: '#131200',
          },
          headerRight: () => LogoutButton(),
          tabBarIcon: () => <Ionicons name="location-outline" size={20} />,
        }}
      />
      {loginTab()}
    </Tab.Navigator>
  );
};

export default TabNavigator;
