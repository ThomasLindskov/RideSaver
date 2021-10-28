import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import AddCoordinate from '../AddCoordinate';
import CoordinateListScreen from '../../screens/CoordinateListScreen';
import CoordinateDetails from '../CoordinateDetails';

const CoordinateStackNavigator = () => {
  const Stack = createStackNavigator();

  return (
    <Stack.Navigator>
      <Stack.Screen name="Coordinate List" component={CoordinateListScreen} />
      <Stack.Screen name="Coordinate Details" component={CoordinateDetails} />
      <Stack.Screen name="Edit Coordinate" component={AddCoordinate} />
    </Stack.Navigator>
  );
};

export default CoordinateStackNavigator;
