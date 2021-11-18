// Importing modules, components and screens
import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import AddCoordinate from '../EditCoordinate';
import CoordinateListScreen from '../../screens/CoordinateListScreen';
import CoordinateDetails from '../CoordinateDetails';
import firebase from 'firebase';

const CoordinateStackNavigator = () => {
  const Stack = createStackNavigator();


  // CoordinateStackNavigator which shows list for coordinates, details and the add/edit coordinate component
  return (
    <Stack.Navigator>
      <Stack.Screen name='Coordinate List' component={CoordinateListScreen} />
      <Stack.Screen name='Coordinate Details' component={CoordinateDetails} />
      <Stack.Screen name='Edit Coordinate' component={AddCoordinate} />
    </Stack.Navigator>
  );
};

export default CoordinateStackNavigator;
