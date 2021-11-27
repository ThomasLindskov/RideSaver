// Importing modules, components and screens
import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import AddCoordinate from './EditCoordinate';
import CoordinateListScreen from '../../screens/Notused/CoordinateListScreen';
import CoordinateDetails from './CoordinateDetails';
import { Colors } from '../../styles/GlobalStyles';

const CoordinateStackNavigator = () => {
  const Stack = createStackNavigator();

  // CoordinateStackNavigator which shows list for coordinates, details and the add/edit coordinate component
  return (
    <Stack.Navigator>
      <Stack.Screen
        options={{
          headerTintColor: Colors.prm,
          headerTitleAlign: 'center',
          headerStyle: {
            backgroundColor: Colors.bck,
          },
        }}
        name="Coordinate List"
        component={CoordinateListScreen}
        initialParams={{ changed: false }}
      />
      <Stack.Screen
        options={{
          headerTintColor: Colors.prm,
          headerTitleAlign: 'center',
          headerStyle: {
            backgroundColor: Colors.bck,
          },
        }}
        name="Coordinate Details"
        component={CoordinateDetails}
      />
      <Stack.Screen
        options={{
          headerTintColor: Colors.prm,
          headerTitleAlign: 'center',
          headerStyle: {
            backgroundColor: Colors.bck,
          },
        }}
        name="Edit Coordinate"
        component={AddCoordinate}
      />
    </Stack.Navigator>
  );
};

export default CoordinateStackNavigator;
