// Import modules and firebase to access data from database
import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  Button,
  Alert,
  SafeAreaView,
  ScrollView,
} from 'react-native';
import firebase from 'firebase';

// Is passed props which are deconstructed to get access to navigation and route
// Navigation is used in CoordinateStackNavigator, route is to return different views whether 'Edit Coordinate' or 'Add Coordinate' was the route prop passed
const AddCoordinate = (props) => {
  const { navigation, route } = props;

  // Initial state oject with 4 basic attributes and state for adding a new coordinate
  const initialState = { lat: '', long: '', leaveTime: '', availableSeats: [] };
  const [newCoordinate, setNewCoordinate] = useState(initialState);

  // This component is used for editing and adding new coordinates, and if the route prop passed was 'Edit Coordinate' we set isEditCoordinate which is used later
  const isEditCoordinate = route.name === 'Edit Coordinate';

  // useEffect hook runs if we are here to edit, and can update through initialState
  useEffect(() => {
    if (isEditCoordinate) {
      const coordinate = route.params.coordinate[1];
      setNewCoordinate(coordinate);
    }
    return () => {
      setNewCoordinate(initialState);
    };
  }, []);

  // Update state for initalState in textinput field
  const changeTextInput = (name, event) => {
    setNewCoordinate({ ...newCoordinate, [name]: event });
  };

  // Save and set as newCoordinate if the length of data inputted is not 0 else, alert error
  const handleSave = () => {
    const { lat, long, leaveTime, availableSeats } = newCoordinate;
    if (
      lat.length === 0 ||
      long.length === 0 ||
      leaveTime.length === 0 ||
      availableSeats.length === 0
    ) {
      return Alert.alert('Error with input');
    }

    // If we want to edit the coordinate we request the id from firebase and use .update to update the attributes of the initalState object
    if (isEditCoordinate) {
      const id = route.params.coordinate[0];
      try {
        firebase
          .database()
          .ref(`/Coordinates/${id}`)
          // Only choosen fields will be updated
          .update({ lat, long, leaveTime, availableSeats });
        // Alert after updating info and navigate back to 'Coordinate details' xx might need to be 'Coordinate Details'
        Alert.alert('Your info has been updated');
        const coordinate = [id, newCoordinate];
        navigation.navigate('Coordinate details', { coordinate });
      } catch (error) {
        console.log(`Error: ${error.message}`);
      }
      // If we don't want to edit, but to add new coordinate, this will run
    } else {
      try {
        firebase
          .database()
          .ref(`/Coordinate/`)
          // We push the inputted lat, long, leaveTime and availableSeats and alert 'Saved'
          .push({ lat, long, leaveTime, availableSeats });
        Alert.alert('Saved');
      } catch (error) {
        console.log(`Error: ${error.message}`);
      }
    }
  };

  // This shows coordinates by their id, and creates a TextInput field for each attribute of initialState? xx
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        {Object.keys(initialState).map((key, index) => {
          return (
            <View style={styles.row} key={index}>
              <Text style={styles.label}>{key}</Text>
              <TextInput
                value={newCoordinate[key]}
                onChangeText={(event) => changeTextInput(key, event)}
                style={styles.input}
              />
            </View>
          );
        })}
        {/* Only show this button, if route prop was 'Edit Coordinate'*/}
        <Button
          title={isEditCoordinate ? 'Save changes' : 'Add coordinate'}
          onPress={() => handleSave()}
        />
      </ScrollView>
    </SafeAreaView>
  );
};

export default AddCoordinate;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E8EAED',
    justifyContent: 'center',
  },
  row: {
    flexDirection: 'row',
    height: 30,
    width: 10,
  },
  label: {
    fontWeight: 'bold',
    width: 100,
  },
  input: {
    borderWidth: 1,
    padding: 5,
    width: 200,
  },
});
