// Import modules and firebase to access data from database
import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TextInput, Button, Alert } from 'react-native';
import { auth, db } from '../../firebase';
import Modal from 'react-native-modal';
import Geocoder from 'react-native-geocoding';
import { API_KEY } from '../../config';
import { GlobalStyles, BrandColors } from '../../styles/GlobalStyles';

// Is passed props which are deconstructed to get access to navigation and route
// Navigation is used in CoordinateStackNavigator, route is to return different views whether 'Edit Coordinate' or 'Add Coordinate' was the route prop passed
const EditCoordinateModal = ({ isOpen, handleClose, coordinate }) => {
  // Initial state oject with 4 basic attributes and state for adding a new coordinate
  const initialState = {
    latitude: '',
    longitude: '',
    date: '',
    availableSeats: '',
  };
  const [joinedUsers, setjoinedUsers] = useState([]);
  const [newCoordinate, setNewCoordinate] = useState(initialState);

  // useEffect hook runs if we are here to edit, and can update through initialState
  useEffect(() => {
    setNewCoordinate(coordinate);
    if (coordinate.userjoined) {
      setjoinedUsers(Object.keys(coordinate.userjoined));
    }
  }, []);

  const changeTextInput = (key, event) => {
    setNewCoordinate({ ...newCoordinate, [key]: event });
  };

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
    } catch (error) {
      console.log(`Error: ${error.message}`);
    }
    // If we don't want to edit, but to add new coordinate, this will run
    handleClose();
  };

  // Alert to either cancel or accept deletion of coordinate, will run handleDelete if Delete is pressed
  const confirmDelete = () => {
    if (Platform.OS === 'ios' || Platform.OS === 'android') {
      Alert.alert('Are you sure?', 'Do you want to delete the coordinate?', [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete', style: 'destructive', onPress: () => handleDelete() },
      ]);
    }
  };

  // Removes coordinate from firebase database and navigates back or catch an error and alerts the message
  const handleDelete = () => {
    const id = coordinate.id;
    try {
      db.ref(`coordinates/` + id).remove();
      handleClose();
    } catch (error) {
      console.log(error.message);
    }
  };

  if (!newCoordinate) {
    return (
      <Modal
        visible={isOpen}
        animationType='slide'
        transparent={true}
        onRequestClose={() => {
          handleClose();
        }}
      >
        <Text>Loading...</Text>
        <Button title='Close' onPress={() => handleClose()} />
      </Modal>
    );
  }
  return (
    <Modal
      visible={isOpen}
      animationType='slide'
      transparent={true}
      onRequestClose={() => {
        handleClose();
      }}
    >
      <View style={styles.modalView}>
        {Object.keys(initialState).map((key, index) => {
          if (typeof newCoordinate[key] == 'number') {
            newCoordinate[key] = newCoordinate[key].toString();
          }
          return (
            <View key={index}>
              <Text style={GlobalStyles.label}>{key}</Text>
              <TextInput
                value={newCoordinate[key]}
                onChangeText={(event) => changeTextInput(key, event)}
                style={GlobalStyles.input}
              />
            </View>
          );
        })}
        {/*This button use handleSave() to save the changes in the ride */}
        <Button
          title={'Save changes'}
          color={BrandColors.Primary}
          onPress={() => handleSave()}
        />

        {/*This button use handleClose() from MapScreen to remove the modal from the screen  */}
        <Button
          title='Close'
          color={BrandColors.Primary}
          onPress={() => {
            handleClose();
          }}
        />

        {/*This button use confirmDelete() and deletes the ride   */}
        <Button
          title={'Delete ride'}
          color={BrandColors.Primary}
          onPress={() => confirmDelete()}
        />
      </View>
    </Modal>
  );
};

export default EditCoordinateModal;

const styles = StyleSheet.create({
  modalView: {
    margin: 30,
    backgroundColor: BrandColors.WhiteLight,
    borderRadius: 20,
    padding: 35,
    marginTop: 70,
    alignItems: 'flex-start',
    shadowColor: BrandColors.GreyDark,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
});
