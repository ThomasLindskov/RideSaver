// Import modules and firebase to access data from database
import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TextInput, Button, Alert, TouchableOpacity } from 'react-native';
import { auth, db } from '../../firebase';
import Modal from 'react-native-modal';
import DateTimePicker from '@react-native-community/datetimepicker';

//import Geocoder from 'react-native-geocoding';
//import { API_KEY } from '../../config';

// Geocoder.init('AIzaSyC8UVX6Sq2nxphNaOQsBTk1gu3nFfLkDmk', { language: 'en' });

// Is passed props which are deconstructed to get access to navigation and route
// Navigation is used in CoordinateStackNavigator, route is to return different views whether 'Edit Coordinate' or 'Add Coordinate' was the route prop passed
const EditCoordinateModal = ({ isOpen, handleClose, coordinate }) => {
  // Initial state oject with 4 basic attributes and state for adding a new coordinate
  const initialState = {
    address: '',
    date: '',
    availableSeats: '',
  };
  const [joinedUsers, setjoinedUsers] = useState([]);
  const [newCoordinate, setNewCoordinate] = useState(initialState);
  const [mode, setMode] = useState('date');
  const [show, setShow] = useState(false);
  const [userDate, setUserDate] = useState(new Date(coordinate.date));


  const showMode = (currentMode) => {
    setShow(true);
    setMode(currentMode);
  };

  const showDatepicker = () => {
    showMode('date');
  };

  const showTimepicker = () => {
    showMode('time');
  };

  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate || userDate;
    setShow(Platform.OS === 'ios');
    setUserDate(currentDate);
  };

  // This component is used for editing and adding new coordinates, and if the route prop passed was 'Edit Coordinate' we set isEditCoordinate which is used later

  // useEffect hook runs if we are here to edit, and can update through initialState
  useEffect(() => {
    setNewCoordinate(coordinate);
    if (coordinate.userjoined) {
      setjoinedUsers(Object.keys(coordinate.userjoined));
    }
  }, []);

  // const getAddress = async () => {
  //   let { status } = await Location.requestForegroundPermissionsAsync(); // Get the location permission from the user and extract the 'status' key from it.
  //   if (status !== 'granted') {
  //     alert('permission denied!');
  //     return;
  //   }
  //   let address = Location.reverseGeoCodeAsync({
  //     latitude: newCoordinate.lat,
  //     longtitude: newCoordinate.long,
  //   });
  //   return address;
  // };

  // getAddress().then((result) => console.log(result));

  // const geoCodeReverse = () => {
  //   Geocoder.from(Number(newCoordinate.lat), Number(newCoordinate.long))
  //     .then((json) => {
  //       var addressComponent = json.results[0].address_components[0];
  //       console.log(addressComponent);
  //     })
  //     .catch((error) => console.warn(error));
  // };
  // console.log('GeoCoderTest', geoCodeReverse());

  // Update state for initalState in textinput field
  const changeTextInput = (key, event) => {
    setNewCoordinate({ ...newCoordinate, [key]: event });
  };

  // Save and set as newCoordinate if the length of data inputted is not 0 else, alert error
  const handleSave = () => {
    if (newCoordinate.userid != auth.currentUser.uid) {
      return Alert.alert('Not your ride');
    }

    //FIND UD AF HVORDAN FANDEN VI OPDATERE ADRESSE

    const date = userDate
    const id = newCoordinate.id;
    const {  availableSeats } = newCoordinate;
    const { latitude, longitude } = coordinate
    if (
      latitude.length === 0 ||
      latitude.length === 0 ||
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

  // This shows coordinates by their id, and creates a TextInput field for each attribute of initialState? xx
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
          if (key == 'address') {
            return (
              <View key={index}>
                <View style={styles.row}>
                  <Text style={styles.label}>Street</Text>
                  <TextInput
                    value={`${coordinate[key].street} ${coordinate[key].name}` }
                    onChangeText={(event) => changeTextInput(key, event)}
                    style={styles.input}
                  />
                   </View>
                   <View style={styles.row}>
                  <Text style={styles.label}>City</Text>
                  <TextInput
                    value={`${coordinate[key].city}`}
                    onChangeText={(event) => changeTextInput(key, event)}
                    style={styles.input}
                  />
                  </View>
              </View>
            );
          } else if(key == 'date') {
            return (
              <View  key={index}>
                <Text style={styles.modalText}>Departure Time</Text>
                <View style={styles.pickedDateContainer}>
                  <Text>{userDate.toString().split(' ').splice(0, 5).join(' ')}</Text>
                </View>
                <TouchableOpacity onPress={showDatepicker} style={{ marginTop: 5 }}>
                  <Text>Choose date</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={showTimepicker} style={{ marginTop: 5 }}>
                  <Text>Choose departure time</Text>
                </TouchableOpacity>
                {show && (
                  <DateTimePicker
                    testID='dateTimePicker'
                    value={userDate}
                    mode={mode}
                    is24Hour={true}
                    display='default'
                    onChange={onChange}
                  />
                )}
              </View>
            );
          } else {
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
          }
        })}
        {/*This button use handleSave() to save the changes in the ride */}
        <Button title={'Save changes'} onPress={() => handleSave()} />

        {/*This button use handleClose() from MapScreen to remove the modal from the screen  */}
        <Button
          title='Close'
          onPress={() => {
            handleClose();
          }}
        />

        {/*This button use confirmDelete() and deletes the ride   */}
        <Button title={'Delete ride'} onPress={() => confirmDelete()} />
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
  pickedDateContainer: {
    padding: 5,
    backgroundColor: '#eee',
    borderRadius: 2,
  },
  modalText: {
    marginBottom: 15,
    marginTop: 15,
    textAlign: 'center',
    fontWeight: 'bold',
  },
});
