// Import modules and firebase to access data from database
import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  Button,
  Pressable,
  TouchableOpacity,
} from 'react-native';
import { auth, db } from '../../firebase';
import Modal from 'react-native-modal';
import { GlobalStyles, BrandColors } from '../../styles/GlobalStyles';

// Is passed props which are deconstructed to get access to navigation and route
// Navigation is used in CoordinateStackNavigator, route is to return different views whether 'Edit Coordinate' or 'Add Coordinate' was the route prop passed
const AddCoordinateModal = ({
  isOpen,
  handleClose,
  coordinate,
  setUserMarkerCoordinate,
  geoConverter,
}) => {
  const [userDate, setUserDate] = useState(new Date());
  const [mode, setMode] = useState('date');
  const [show, setShow] = useState(false);
  const [availableSeats, setAvailableSeats] = useState();
  const [address, setAddress] = useState();

  // const cord = {
  //   latitude: coordinate.latitude,
  //   longitude: coordinate.longitude,
  // };
  // console.log(geoConverter(cord));
  // console.log(coordinate);
  // console.log(address);

  useEffect(() => {
    setAddress(geoConverter(coordinate));
  }, []);

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

  const createRide = async (event) => {
    handleClose();
    let groupid;

    await db
      .ref('userData/' + auth.currentUser.uid)
      .get()
      .then((snapshot) => {
        if (snapshot.exists()) {
          groupid = snapshot.val().group;
        } else {
          console.log('No data available');
        }
      })
      .catch((error) => {
        console.error(error);
      });

    let newDate = JSON.stringify(userDate);
    try {
      db.ref('coordinates/').push({
        latitude: coordinate.latitude,
        longitude: coordinate.longitude,
        userid: auth.currentUser.uid,
        availableSeats: availableSeats,
        groupId: groupid,
        date: newDate,
      });
    } catch (error) {
      console.log(`Error: ${error.message}`);
    }

    setUserMarkerCoordinate(null);
  };

  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate || userDate;
    setShow(Platform.OS === 'ios');
    setUserDate(currentDate);
  };

  if (!coordinate) {
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
        <Text
          style={{
            textAlign: 'center',
            marginTop: 10,
            marginBottom: 10,
            fontSize: 25,
            fontWeight: 'bold',
          }}
        >
          Create Ride
        </Text>
        <Text>Ride from: {address}</Text>
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
        <TextInput
          style={GlobalStyles.input}
          onChangeText={setAvailableSeats}
          value={availableSeats}
          placeholder='Seats in car'
          keyboardType='numeric'
        />

        <Pressable
          style={[styles.button, styles.buttonClose]}
          onPress={() => handleClose()}
        >
          <Text style={styles.textStyle}>Close</Text>
        </Pressable>
        <Pressable
          style={[styles.button, styles.buttonClose]}
          onPress={() => createRide()}
        >
          <Text style={styles.textStyle}>Create ride</Text>
        </Pressable>
      </View>
    </Modal>
  );
};

export default AddCoordinateModal;

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
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
    marginTop: 15,
  },
  buttonClose: {
    backgroundColor: BrandColors.Primary,
  },
  textStyle: {
    color: BrandColors.WhiteLight,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalText: {
    marginBottom: 15,
    marginTop: 15,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  pickedDateContainer: {
    padding: 5,
    backgroundColor: BrandColors.WhiteDark,
    borderRadius: 2,
  },
});
