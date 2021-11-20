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
  Pressable,
  TouchableOpacity,
} from 'react-native';
import { auth , db } from '../../firebase';  
import Modal from "react-native-modal";

// Is passed props which are deconstructed to get access to navigation and route
// Navigation is used in CoordinateStackNavigator, route is to return different views whether 'Edit Coordinate' or 'Add Coordinate' was the route prop passed
const EditCoordinateModal = ( {isOpen, handleClose, coordinate, setUserMarkerCoordinate }) => {

  // Initial state oject with 4 basic attributes and state for adding a new coordinate
  const [userDate, setUserDate] = useState(new Date());
  const [mode, setMode] = useState('date');
  const [show, setShow] = useState(false);
  const [availableSeats, setAvailableSeats] = useState();


    // useEffect hook runs if we are here to edit, and can update through initialState
    useEffect(() => {
  
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

    await db.ref('userData/' + auth.currentUser.uid).get().then(snapshot => {
       if (snapshot.exists()) { 
         groupid = snapshot.val().group
       } else {
         console.log("No data available");
       }
     })
     .catch((error) => {
       console.error(error);
     })

     let newDate = JSON.stringify(userDate)
     try {
      db.ref('coordinates/').push({
        lat: coordinate.latitude,
        long: coordinate.longitude,
        userid: auth.currentUser.uid,
        availableSeats: availableSeats,
        groupId: groupid,
        date: newDate
      })
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




  // This component is used for editing and adding new coordinates, and if the route prop passed was 'Edit Coordinate' we set isEditCoordinate which is used later
 



  // Update state for initalState in textinput field




  
    if (!coordinate) {
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
              {/* Det er den her der ødelægger modallen.
              <Text style={styles.modalText}>Number of seats</Text>
              <DropDownPicker
                open={open}
                value={value}
                numSeats={numSeats}
                min={1}
                setOpen={setOpen}
                setValue={setValue}
                setNumSeats={setNumSeats}
              />*/}
               <TextInput
              style={styles.input}
              onChangeText={setAvailableSeats}
              value={availableSeats}
              placeholder="Seats in car"
              keyboardType="numeric"
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
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
    marginTop: 15,
  },
  buttonOpen: {
    backgroundColor: '#F194FF',
  },
  buttonClose: {
    backgroundColor: '#2196F3',
  },
  textStyle: {
    color: 'white',
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
    backgroundColor: '#eee',
    borderRadius: 2,
  },
});
