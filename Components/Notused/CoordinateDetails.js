// Importing modules and firebase to acces data
import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Platform, Button, Alert } from 'react-native';
import firebase from 'firebase';
import { GlobalStyles, Colors } from '../../styles/GlobalStyles';
import { VideoExportPreset } from 'expo-image-picker';
import { set } from 'react-native-reanimated';
import { auth, db } from '../../firebase';

// Passed props which are deconstructed to acces navigation and route
const CoordinateDetails = (props) => {
  const { navigation, route } = props;
  const initialState = {
    latitude: '',
    longitude: '',
    date: '',
    availableSeats: '',
  };
  const [coordinate, setCoordinate] = useState(initialState);
  const [joinedUsers, setjoinedUsers] = useState([]);

  // useEffect hook will set the coordinate state from the passed route prop and return an empty object xx
  useEffect(() => {
    setCoordinate(route.params.coordinate[1]);
    if (route.params.coordinate[1].userjoined) {
      setjoinedUsers(Object.keys(route.params.coordinate[1].userjoined));
    }
  }, []);

  // Navigating to Edit Coordinate which does not exist xx - I think its AddCoordinate.js
  const handleEdit = () => {
    const coordinate = route.params.coordinate;
    navigation.navigate('Edit Coordinate', { coordinate });
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
      navigation.goBack({ changed: true });
    } catch (error) {
      console.log(error.message);
    }
  };

  const handleJoinRide = () => {
    const id = coordinate.id;

    if (coordinate.userid == auth.currentUser.uid) {
      return Alert.alert('This is your ride');
    }
    // If we want to edit the coordinate we request the id from firebase and use .update to update the attributes of the initalState object

    coordinate.availableSeats -= 1;
    try {
      db.ref(`coordinates/${id}`)
        // Only choosen fields will be updated
        .update({ availableSeats: coordinate.availableSeats });
      // Alert after updating info and navigate back to 'Coordinate details' xx might need to be 'Coordinate Details'
      Alert.alert('You joined the ride!');
    } catch (error) {
      console.log(`Error: ${error.message}`);
    }

    try {
      db.ref(`coordinates/${id}/userjoined/` + auth.currentUser.uid)
        // Only choosen fields will be updated
        .set({ 0: true });
      // Alert after updating info and navigate back to 'Coordinate details' xx might need to be 'Coordinate Details'
      Alert.alert('You joined the ride!');
    } catch (error) {
      console.log(`Error: ${error.message}`);
    }
    navigation.navigate('Coordinate List');
  };

  const handleRemoveRide = () => {
    const id = coordinate.id;

    if (coordinate.userid == auth.currentUser.uid) {
      return Alert.alert('This is your ride');
    }

    if (coordinate.availableSeats == 0) {
      return Alert.alert('No room on this ride');
    }
    // If we want to edit the coordinate we request the id from firebase and use .update to update the attributes of the initalState object

    coordinate.availableSeats += 1;
    try {
      db.ref(`coordinates/${id}`)
        // Only choosen fields will be updated
        .update({ availableSeats: coordinate.availableSeats });
      // Alert after updating info and navigate back to 'Coordinate details' xx might need to be 'Coordinate Details'
      Alert.alert('You joined the ride!');
    } catch (error) {
      console.log(`Error: ${error.message}`);
    }

    try {
      db.ref(`coordinates/${id}/userjoined/` + auth.currentUser.uid)
        // Only choosen fields will be updated
        .remove();
      // Alert after updating info and navigate back to 'Coordinate details' xx might need to be 'Coordinate Details'
      Alert.alert('Your cancelled your seat');
    } catch (error) {
      console.log(`Error: ${error.message}`);
    }

    navigation.navigate('Coordinate List');
  };

  // If no coordinates it shows this
  if (!coordinate) {
    return <Text>No data</Text>;
  }

  const buttons = () => {
    if (auth.currentUser.uid == coordinate.userid) {
      return (
        <View>
          <Button title='Edit' onPress={() => handleEdit()} />
          <Button title='Delete' onPress={() => confirmDelete()} />
        </View>
      );
      //
    } else if (joinedUsers.includes(auth.currentUser.uid)) {
      return (
        <View>
          <Button title='Cancel Seat' onPress={() => handleRemoveRide()} />
        </View>
      );
    } else {
      return <Button title='Join Ride' onPress={() => handleJoinRide()} />;
    }
  };

  // When we have a coordinate it shows and edit or delete button and all items under that coordinate (lat, long, leaveTime and availableSeats)
  // Why is the button on top and on the bottom? xx
  return (
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
    </View>
  );
};

export default CoordinateDetails;

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'flex-start' },
  row: {
    margin: 5,
    padding: 5,
    flexDirection: 'row',
  },
  label: {
    fontWeight: 'bold',
    width: 100,
  },
  value: { flex: 1 },
  input: {
    borderWidth: 1,
    padding: 5,
    width: 200,
  },
});
