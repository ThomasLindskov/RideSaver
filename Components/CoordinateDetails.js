// Importing modules and firebase to acces data
import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Platform, Button, Alert } from 'react-native';
import firebase from 'firebase';

// Passed props which are deconstructed to acces navigation and route
const CoordinateDetails = (props) => {
  const { navigation, route } = props;
  const [coordinate, setCoordinate] = useState({});

  // useEffect hook will set the coordinate state from the passed route prop and return an empty object xx
  useEffect(() => {
    setCoordinate(route.params.coordinate[1]);

    return () => {
      setCoordinate({});
    };
  });

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
    const id = route.params.coordinate[0];
    try {
      firebase.database().ref(`/Coordinates/${id}`).remove();
      navigation.goBack();
    } catch (error) {
      Alert.alert(error.message);
    }
  };

  // If no coordinates it shows this
  if (!coordinate) {
    return <Text>No data</Text>;
  }

  // When we have a coordinate it shows and edit or delete button and all items under that coordinate (lat, long, leaveTime and availableSeats)
  // Why is the button on top and on the bottom? xx
  return (
    <View style={styles.container}>
      <Button title="Edit" onPress={() => handleEdit()} />
      <Button title="Delete" onPress={() => confirmDelete()} />
      {Object.entries(coordinate).map((item, index) => {
        return (
          <View style={styles.row} key={index}>
            <Text style={styles.label}> {item[0]} </Text>
            <Text style={styles.label}> {item[1]} </Text>
          </View>
        );
      })}
      <Button title="Edit" onPress={() => handleEdit()} />
      <Button title="Delete" onPress={() => handleDelete()} />
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
  label: { width: 100, fontWeight: 'bold' },
  value: { flex: 1 },
});
