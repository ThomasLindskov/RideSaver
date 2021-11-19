// Importing modules and firebase to acces data
import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Platform, Button, Alert } from 'react-native';
import { auth , db } from '../../firebase';  
import Modal from "react-native-modal";


// Passed props which are deconstructed to acces navigation and route
const CoordinateDetailsModal = ({open, onClose, coordinate}) => {
  const initialState = { lat: '', long: '', date: '', availableSeats: '' };
  const [joinedUsers, setjoinedUsers] = useState([])

  

  // useEffect hook will set the coordinate state from the passed route prop and return an empty object xx
  useEffect(() => {
    if(coordinate.userjoined){
      setjoinedUsers(Object.keys(coordinate.userjoined))
    }
  }, []);




  const handleJoinRide = () => {
    const id = coordinate.id;

    if(coordinate.userid == auth.currentUser.uid){
      return Alert.alert('This is your ride')
    }
    // If we want to edit the coordinate we request the id from firebase and use .update to update the attributes of the initalState object

    coordinate.availableSeats -= 1
    try {
      db
        .ref(`coordinates/${id}`)
        // Only choosen fields will be updated
        .update({ availableSeats: coordinate.availableSeats });
      // Alert after updating info and navigate back to 'Coordinate details' xx might need to be 'Coordinate Details'
      Alert.alert('Your Joined the ride');
    } catch (error) {
      console.log(`Error: ${error.message}`);
    }

    try {
      db
        .ref(`coordinates/${id}/userjoined/` + auth.currentUser.uid)
        // Only choosen fields will be updated
        .set({"0": true});
      // Alert after updating info and navigate back to 'Coordinate details' xx might need to be 'Coordinate Details'
      Alert.alert('Your Joined the ride');
    } catch (error) {
      console.log(`Error: ${error.message}`);
    }
    onClose();

  };

  const handleRemoveRide = () => {
    const id = coordinate.id;

    if(coordinate.userid == auth.currentUser.uid){
      return Alert.alert('This is your ride')
    }

    if(coordinate.availableSeats == 0){
      return Alert.alert('No room on this ride')
    }
    // If we want to edit the coordinate we request the id from firebase and use .update to update the attributes of the initalState object

    coordinate.availableSeats += 1
    try {
      db
        .ref(`coordinates/${id}`)
        // Only choosen fields will be updated
        .update({ availableSeats: coordinate.availableSeats });
      // Alert after updating info and navigate back to 'Coordinate details' xx might need to be 'Coordinate Details'
      Alert.alert('Your Joined the ride');
    } catch (error) {
      console.log(`Error: ${error.message}`);
    }

    try {
      db
        .ref(`coordinates/${id}/userjoined/` + auth.currentUser.uid)
        // Only choosen fields will be updated
        .remove();
      // Alert after updating info and navigate back to 'Coordinate details' xx might need to be 'Coordinate Details'
      Alert.alert('Your cancelled your seat');
    } catch (error) {
      console.log(`Error: ${error.message}`);
    }

    onClose();
    
  };

  

  // If no coordinates it shows this
  if (!coordinate) {
    return (
      <Modal 
    visible={open}
    animationType='slide'
    transparent={true}
    onRequestClose={() => {
       onClose();
    }}>
      <Text>Loading...</Text>
      <Button title="Close" onPress={() => onClose()} /> 
    </Modal>
    )
  }

  const buttons = () => {
    if (joinedUsers.includes(auth.currentUser.uid)) {
      return(
        <View>
          <Button title="cancel seat" onPress={() => handleRemoveRide()} />
        </View>
      ) 
    } else {
      return(
      <Button title="Join Ride" onPress={() => handleJoinRide()} /> 
      )
    }
  } 


  // When we have a coordinate it shows and edit or delete button and all items under that coordinate (lat, long, leaveTime and availableSeats)
  // Why is the button on top and on the bottom? xx
  return (
    <Modal 
    visible={open}
    animationType='slide'
    transparent={true}
    onRequestClose={() => {
      onClose();
    }}>
      <View style={styles.container}>
        {Object.keys(initialState).map((key, index) => {
            return (
              <View style={styles.row} key={index}>
                <Text style={styles.label}>{key}</Text>
                <Text style={styles.label}> {coordinate[key]} </Text>
              </View>
            );
          })}
        {buttons()}
        <Button title="Close" onPress={() => onClose()} /> 

      </View>
    </Modal>
  );
};

export default CoordinateDetailsModal;

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'flex-start' },
  row: {
    margin: 5,
    padding: 5,
    flexDirection: 'row',
  },
  label: { width: 100, fontWeight: 'bold' },
  value: { flex: 1 },
  input: {
    borderWidth: 1,
    padding: 5,
    width: 200,
  },
});
