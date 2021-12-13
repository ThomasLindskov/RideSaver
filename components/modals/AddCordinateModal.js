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
  Keyboard,
  TouchableWithoutFeedback 
} from 'react-native';
import { auth, db } from '../../firebase';
import Modal from 'react-native-modal';
import { GlobalStyles, BrandColors } from '../../styles/GlobalStyles';
import DateTimePicker from '@react-native-community/datetimepicker';

//Modal for use in Map Screen to make a coordinate.
const AddCoordinateModal = ({
  isOpen,
  handleClose,
  coordinate,
  setUserMarkerCoordinate,
  address,
  group,
}) => {
  // Here we take in the different variables we want to use
  // A userDate made from the data picker
  const [userDate, setUserDate] = useState(new Date());
  const [mode, setMode] = useState('date');
  const [show, setShow] = useState(false);
  const [availableSeats, setAvailableSeats] = useState();

  //Get the mode to show in date picker, depending if you press change time or date
  const showMode = (currentMode) => {
    setShow(true);
    setMode(currentMode);
  };

  //For the date, used for Andriod
  const showDatepicker = () => {
    showMode('date');
  };

  //For the time, used for Andriod
  const showTimepicker = () => {
    showMode('time');
  };

  //For the time and date, used for IOS
  const showDateTimepicker = () => {
    showMode('datetime');
  };

  //This creates the ride
  const createRide = async (event) => {
    let newDate = userDate.toString();
    let formattedAddress = {
          city: address[0].city,
          country: address[0].country,
          district: address[0].district,
          isoCountryCode: address[0].isoCountryCode,
          name: address[0].name,
          postalCode: address[0].postalCode,
          street: address[0].street,
    }
    
    //If android we change the name to be the same as IOS. 
    if(Platform.OS == 'android'){
      formattedAddress.name = address[0].street + " " + address[0].name
    }
    try {
      //Here we push the new coordinate into the coordinate object.
      db.ref('coordinates/').push({
        latitude: coordinate.latitude,
        longitude: coordinate.longitude,
        address: address,
        userid: auth.currentUser.uid,
        availableSeats: availableSeats,
        groupId: group,
        date: newDate,
        //Should deconstruct the address later, to only use the things we use.
        address: formattedAddress,
      });
    } catch (error) {
      Alert.alert(`Error: ${error.message}`);
    }

    //Here we set the userMarker to null, so the yellow marker disappers
    setUserMarkerCoordinate(null);
    //Here the modal is closed
    handleClose();
  };

  //When changing the date, we set the date as userDate
  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate || userDate;
    setShow(Platform.OS === 'ios');
    setUserDate(currentDate);
  };

  //To show the address when android and ios.The maps return different values dependent on OS. 
  const showAddress = () => {
    if(Platform.OS === 'ios') {
      return ` ${address[0].name} ${address[0].city} ${address[0].postalCode}`
    } else {
      return `${address[0].street} ${address[0].name} ${address[0].city} ${address[0].postalCode}`
    }
  }

  //To show date and time when android and ios. IOS can have only one button, android needs two. 
  const DateTimerPicker = () => {
    if(Platform.OS === 'ios') {
      return (
      <View>
        <TouchableOpacity
          onPress={showDateTimepicker}
          style={[styles.button, styles.buttonClose]}
        >
          <Text style={styles.textStyle}>Choose date and time</Text>
        </TouchableOpacity>
      </View>
      )
    } else {
      return (
        <View>
          <TouchableOpacity
            onPress={showDatepicker}
            style={[styles.button, styles.buttonClose]}
          >
            <Text style={styles.textStyle}>Choose date</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={showTimepicker}
            style={[styles.button, styles.buttonClose]}
          >
            <Text style={styles.textStyle}>Choose departure time</Text>
          </TouchableOpacity>
        </View>
        )
    }
  }

  //If address is null, then we show a loading modal
  if (!address) {
    return (
      <Modal
        visible={isOpen}
        animationType="slide"
        transparent={true}
        onRequestClose={() => {
          handleClose();
        }}
      >
        <Text>Loading...</Text>
        <Button title="Close" onPress={() => handleClose()} />
      </Modal>
    );
  }
  //Here we return the modal which is called from the MapScreen
  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
    <Modal
      visible={isOpen}
      animationType="slide"
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
        <Text style={styles.modalText}>Departure Time: </Text>
        <View style={styles.pickedDateContainer}>
          <Text>{userDate.toString().split(' ').splice(0, 5).join(' ')}</Text>
        </View>
     
        <Text style={{ fontWeight: 'bold', marginTop: 5 }}>Address: </Text>
        <Text>{showAddress()}</Text>
        <View> 
        {DateTimerPicker()}
        {show && (
          <DateTimePicker
            testID="dateTimePicker"
            value={userDate}
            mode={mode}
            is24Hour={true}
            display="default"
            onChange={onChange}
          />
        )}
        </View>
        <Text style={{ fontWeight: 'bold', marginTop: 5 }}>Seats in car: </Text>       
        <TextInput
          style={GlobalStyles.input}
          onChangeText={setAvailableSeats}
          value={availableSeats}
          placeholder="Plesae insert number of seats"
          keyboardType="numeric"
        />
        <View style={{flexDirection: 'row'}}>
          <Pressable
            style={[styles.button, styles.buttonClose]}
            onPress={() => handleClose()}
          >
            <Text style={styles.textStyle}>Close</Text>
          </Pressable>
          <Pressable
            style={[styles.button, styles.buttonSave] }
            onPress={() => createRide()}
          >
            <Text style={styles.textStyle}>Create ride</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
    </TouchableWithoutFeedback>
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
    marginRight: 5
  },
  buttonSave: {
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
