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
import { auth , db } from '../../firebase';  
import Modal from "react-native-modal";

// Is passed props which are deconstructed to get access to navigation and route
// Navigation is used in CoordinateStackNavigator, route is to return different views whether 'Edit Coordinate' or 'Add Coordinate' was the route prop passed
const EditCoordinateModal = ( {isOpen, handleClose, coordinate }) => {

  // Initial state oject with 4 basic attributes and state for adding a new coordinate
  const initialState = { lat: '', long: '', date: '', availableSeats: '' };
  const [joinedUsers, setjoinedUsers] = useState([])
  const [newCoordinate, setNewCoordinate] = useState(initialState);



  // This component is used for editing and adding new coordinates, and if the route prop passed was 'Edit Coordinate' we set isEditCoordinate which is used later
 

  // useEffect hook runs if we are here to edit, and can update through initialState
  useEffect(() => {
    setNewCoordinate(coordinate)
    if(coordinate.userjoined){
      setjoinedUsers(Object.keys(coordinate.userjoined))
    }
  }, []);

  // Update state for initalState in textinput field
  const changeTextInput = (key, event) => {
    setNewCoordinate({ ...newCoordinate, [key]: event });
  };

  // Save and set as newCoordinate if the length of data inputted is not 0 else, alert error
  const handleSave = () => {
    if(newCoordinate.userid != auth.currentUser.uid){
      return Alert.alert('Not your ride')
    }

    const id = newCoordinate.id
    const { lat, long, date, availableSeats } = newCoordinate;
    if (
      lat.length === 0 ||
      long.length === 0 ||
      date.length === 0 ||
      availableSeats.length === 0
    ) {
      return console.log('Error with input');
    }

    // If we want to edit the coordinate we request the id from firebase and use .update to update the attributes of the initalState object

    try {
      db
        .ref(`coordinates/${id}`)
        // Only choosen fields will be updated
        .update({ lat, long, date, availableSeats });
      // Alert after updating info and navigate back to 'Coordinate details' xx might need to be 'Coordinate Details'
      Alert.alert('Your info has been updated');
    } catch (error) {
      console.log(`Error: ${error.message}`);
    }
    // If we don't want to edit, but to add new coordinate, this will run
  } 

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
        onClose();
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
        handleClose()
      }}>
        <Text>Loading...</Text>
        <Button title="Close" onPress={() =>  handleClose()} /> 
      </Modal>
      )
    }
  // This shows coordinates by their id, and creates a TextInput field for each attribute of initialState? xx
  return (
    <Modal 
    visible={isOpen}
    animationType='slide'
    transparent={true}
    onRequestClose={() => {
      handleClose();
    }}>
      <View style={styles.modalView}>
          {Object.keys(initialState).map((key, index) => {
            if(typeof newCoordinate[key] == 'number'){
              newCoordinate[key] = newCoordinate[key].toString();
            }
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
            title={'Save changes'}
            onPress={() => handleSave()}
          />
          <Button title="Close" onPress={() => {
          handleClose()
          }} /> 
      </View>
    </Modal>
  );
};

export default EditCoordinateModal;

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
  modalView: {
    margin: 30,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    marginTop: 70,
    alignItems: 'flex-start',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
});
