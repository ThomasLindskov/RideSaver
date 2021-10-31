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

const AddCoordinate = (props) => {
  const { navigation, route } = props;

  const initialState = { lat: '', long: '', leaveTime: '', availableSeats: [] };
  const [newCoordinate, setNewCoordinate] = useState(initialState);

  const isEditCoordinate = route.name === 'Edit Coordinate';

  useEffect(() => {
    if (isEditCoordinate) {
      const coordinate = route.params.coordinate[1];
      setNewCoordinate(coordinate);
    }
    return () => {
      setNewCoordinate(initialState);
    };
  }, []);

  const changeTextInput = (name, event) => {
    setNewCoordinate({ ...newCoordinate, [name]: event });
  };

  const handleSave = () => {
    const { lat, long, leaveTime, availableSeats } = newCoordinate;
    if (
      lat.length === 0 ||
      long.length === 0 ||
      leaveTime.length === 0 ||
      availableSeats.length === 0
    ) {
      return Alert.alert('something alert alert');
    }

    if (isEditCoordinate) {
      const id = route.params.coordinate[0];
      try {
        firebase
          .database()
          .ref(`/Coordinates/${id}`)
          // Vi bruger update, så kun de felter vi angiver, bliver ændret
          .update({ lat, long, leaveTime, availableSeats });
        // Når koordinatet er ændret, går vi tilbage.
        Alert.alert('Your info has been updated');
        const coordinate = [id, newCoordinate];
        navigation.navigate('Coordinate details', { coordinate });
      } catch (error) {
        console.log(`Error: ${error.message}`);
      }
    } else {
      try {
        firebase
          .database()
          .ref(`/Coordinate/`)
          .push({ lat, long, leaveTime, availableSeats });
        Alert.alert('Saved');
      } catch (error) {
        console.log(`Error: ${error.message}`);
      }
    }
  };

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
