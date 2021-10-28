import React, { useEffect, useState } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';
import NewsScreen from '../../screens/Notused/NewsScreen';
import ProfileScreen from '../../screens/ProfileScreen';
import HomeScreen from '../../screens/HomeScreen';
import TestScreen from '../../screens/TestScreen';
import LoginScreen from '../../screens/LoginScreen';
import { auth } from '../../firebase';
import { Button } from 'react-native';
import MapScreen from '../../screens/MapScreen';
import CoordinateStackNavigator from './CoordinateStackNavigator';

const Tab = createBottomTabNavigator();

const TabNavigator = ({ navigation }) => {
  const [user, setUser] = useState({ loggedIn: false });

  function onAuthStateChange(callback) {
    return auth.onAuthStateChanged((user) => {
      if (user) {
        callback({ loggedIn: true, user: user });
      } else {
        callback({ loggedIn: false });
      }
    });
  }

  //Heri aktiverer vi vores listener i form af onAuthStateChanged, så vi dynamisk observerer om brugeren er aktiv eller ej.
  useEffect(() => {
    const unsubscribe = onAuthStateChange(setUser);
    return () => {
      unsubscribe();
    };
  }, []);

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
        name="News"
        component={TestScreen}
        options={{
          headerTintColor: '#E7C4B1',
          headerTitleAlign: 'center',
          headerStyle: {
            backgroundColor: '#131200',
          },
          headerRight: () => LogoutButton(),
          tabBarIcon: () => <Ionicons name="newspaper-outline" size={20} />,
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
