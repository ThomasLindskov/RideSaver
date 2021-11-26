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
import { GlobalStyles, Colors } from '../../styles/GlobalStyles';
import { auth, db } from '../../firebase';

// Is passed props which are deconstructed to get access to navigation and route
// Navigation is used in CoordinateStackNavigator, route is to return different views whether 'Edit Coordinate' or 'Add Coordinate' was the route prop passed
const EditCoordinate = ({ route, navigation }) => {
  // Initial state oject with 4 basic attributes and state for adding a new coordinate
  const initialState = {
    latitude: '',
    longitude: '',
    date: '',
    availableSeats: '',
  };
  const [newCoordinate, setNewCoordinate] = useState(initialState);

  // This component is used for editing and adding new coordinates, and if the route prop passed was 'Edit Coordinate' we set isEditCoordinate which is used later

  // useEffect hook runs if we are here to edit, and can update through initialState
  useEffect(() => {
    const coordinate = route.params.coordinate[1];
    setNewCoordinate(coordinate);
  }, []);

  // Update state for initalState in textinput field
  // const changeTextInput = (key, event) => {
  //   setNewCoordinate({ ...newCoordinate, [key]: event });
  // };

  // Save and set as newCoordinate if the length of data inputted is not 0 else, alert error
  const handleSave = () => {
    if (newCoordinate.userid != auth.currentUser.uid) {
      return Alert.alert('Not your ride');
    }

    const id = newCoordinate.id;
    const { latitude, longitude, date, availableSeats } = newCoordinate;
    if (
      latitude.length === 0 ||
      longitude.length === 0 ||
      date.length === 0 ||
      availableSeats.length === 0
    ) {
      return console.log('Error with input');
    }

    // If we want to edit the coordinate we request the id from firebase and use .update to update the attributes of the initalState object

    try {
      db.ref(`coordinates/${id}`)
        // Only choosen fields will be updated
        .update({ latitude, longitude, date, availableSeats });
      // Alert after updating info and navigate back to 'Coordinate details' xx might need to be 'Coordinate Details'
      Alert.alert('Your info has been updated');
      const coordinate = [id, newCoordinate];
      navigation.navigate('Coordinate Details', { coordinate });
    } catch (error) {
      console.log(`Error: ${error.message}`);
    }
    // If we don't want to edit, but to add new coordinate, this will run
  };

  if (!newCoordinate) {
    return <Text>Loading...</Text>;
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        {Object.keys(initialState).map((key, index) => {
          if (typeof newCoordinate[key] == 'number') {
            newCoordinate[key] = newCoordinate[key].toString();
          }
          return (
            <View style={styles.row} key={index}>
              <Text style={GlobalStyles.label}>{key}</Text>
              <Text value={newCoordinate[key]} style={GlobalStyles.input} />
            </View>
          );
        })}
        {/* Only show this button, if route prop was 'Edit Coordinate'*/}
        <Button
          title={'Save changes'}
          color={Colors.scn}
          onPress={() => handleSave()}
        />
      </ScrollView>
    </SafeAreaView>
  );
};

export default EditCoordinate;

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'flex-start' },
  row: {
    flexDirection: 'row',
    height: 30,
    width: 10,
  },
});
