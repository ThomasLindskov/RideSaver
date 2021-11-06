import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import AddCoordinate from '../AddCoordinate';
import CoordinateListScreen from '../../screens/CoordinateListScreen';
import CoordinateDetails from '../CoordinateDetails';
import firebase from 'firebase';

const CoordinateStackNavigator = () => {
  const Stack = createStackNavigator();

  const firebaseConfig = {
    apiKey: 'AIzaSyBE-92DxJK4ihRwMio9vN049LDWRkNtKHo',
    authDomain: 'secret-fff0d.firebaseapp.com',
    databaseURL:
      'https://secret-fff0d-default-rtdb.europe-west1.firebasedatabase.app',
    projectId: 'secret-fff0d',
    storageBucket: 'secret-fff0d.appspot.com',
    messagingSenderId: '962298843369',
    appId: '1:962298843369:web:bbb96b7942c4624d622078',
  };

  if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
  } else {
    firebase.app();
  }

  return (
    <Stack.Navigator>
      <Stack.Screen name='Coordinate List' component={CoordinateListScreen} />
      <Stack.Screen name='Coordinate Details' component={CoordinateDetails} />
      <Stack.Screen name='Edit Coordinate' component={AddCoordinate} />
    </Stack.Navigator>
  );
};

export default CoordinateStackNavigator;
