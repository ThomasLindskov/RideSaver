// Import modules and firebase to access data from database
import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  Button,
  Alert,
  TouchableOpacity,
} from 'react-native';
import { auth, db } from '../../firebase';
import Modal from 'react-native-modal';
import { GlobalStyles, BrandColors } from '../../Styles/GlobalStyles';
import DateTimePicker from '@react-native-community/datetimepicker';

// We could have made add coordinate and edit coordinate to be one, but this makes the code a little more simple
const EditCoordinateModal = ({ isOpen, handleClose, coordinate }) => {
  // Initial state oject with 3
  const initialState = {
    address: '',
    date: '',
    availableSeats: '',
  };
  // Here we take in the different variables we want to use
  const [joinedUsers, setjoinedUsers] = useState([]);
  const [newCoordinate, setNewCoordinate] = useState(initialState);
  const [mode, setMode] = useState('date');
  const [show, setShow] = useState(false);
  const [userDate, setUserDate] = useState(new Date(coordinate.date));

  //Get the mode to show in date picker, depending if you press change time or date
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

  useEffect(() => {
    //Here we find the joined users, which are on the coordinate, which is not used right now, but is supposed to be showing in this modal
    setNewCoordinate(coordinate);
    if (coordinate.userjoined) {
      setjoinedUsers(Object.keys(coordinate.userjoined));
    }
  }, []);

  // When receving input if puts it in a newcordinate object.
  const changeTextInput = (key, event) => {
    setNewCoordinate({ ...newCoordinate, [key]: event });
  };

  const handleSave = () => {
    //If this happens, it handles it.
    if (newCoordinate.userid != auth.currentUser.uid) {
      return Alert.alert('Not your ride');
    }

    //Gets the variables we need. Lat and long are included for future use, but will always be the value of the pressed coordinate
    const date = userDate;
    const id = newCoordinate.id;
    const { availableSeats } = newCoordinate;
    const { latitude, longitude } = coordinate;
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
      // Alert after updating info, this only updates lat and long, address cannot be edited yet.
      Alert.alert('Your info has been updated');
    } catch (error) {
      console.log(`Error: ${error.message}`);
    }
    // This closes the modal
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

  // Removes coordinate from firebase database and navigates back or catch an error and console.logs the message
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

  return (
    <Modal
      visible={isOpen}
      animationType="slide"
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
          //Address and date keys, need some formatting.
          if (key == 'address') {
            return (
              <View key={index}>
                <View style={styles.row}>
                  <Text style={{ fontWeight: 'bold' }}>Street: </Text>
                  <Text
                    value={`${coordinate[key].street} ${coordinate[key].name}`}
                  />
                </View>
                <View style={styles.row}>
                  <Text style={{ fontWeight: 'bold' }}>City: </Text>
                  <Text
                    value={`${coordinate[key].city}`}
                  />
                </View>
              </View>
            );
          } else if (key == 'date') {
            return (
              <View key={index}>
                <Text style={styles.modalText}>Departure Time: </Text>
                <View style={styles.pickedDateContainer}>
                  <Text>
                    {userDate.toString().split(' ').splice(0, 5).join(' ')}
                  </Text>
                </View>
                <TouchableOpacity
                  onPress={showDatepicker}
                  style={styles.button}
                >
                  <Text>Choose date</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={showTimepicker}
                  style={styles.button}
                >
                  <Text>Choose departure time</Text>
                </TouchableOpacity>
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
            );
          } else {
            return (
              <View key={index}>
                <Text style={{ fontWeight: 'bold' }}>Available seats: </Text>
                <TextInput
                  value={newCoordinate[key]}
                  style={GlobalStyles.input}
                  onChangeText={(event) => changeTextInput(key, event)}
                />
              </View>
            );
          }
        })}
        {/*This button use handleSave() to save the changes in the ride */}
        <View style={{ marginVertical: 5 }}>
          <Button
            title={'Save changes'}
            color={BrandColors.Primary}
            onPress={() => handleSave()}
          />
        </View>
        {/*This button use handleClose() from MapScreen to remove the modal from the screen  */}
        <View style={{ marginVertical: 5 }}>
          <Button
            title="Close"
            color={BrandColors.Primary}
            onPress={() => {
              handleClose();
            }}
          />
        </View>

        {/*This button use confirmDelete() and deletes the ride */}
        <View style={{ marginVertical: 5 }}>
          <Button
            title={'Delete ride'}
            color={BrandColors.Primary}
            onPress={() => confirmDelete()}
          />
        </View>
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
  pickedDateContainer: {
    padding: 5,
    backgroundColor: BrandColors.WhiteDark,
    borderRadius: 2,
    marginBottom: 5,
  },
  modalText: {
    marginBottom: 15,
    marginTop: 15,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  button: {
    margin: 5,
    backgroundColor: BrandColors.WhiteLight,
    width: '100%',
    borderColor: BrandColors.PrimaryLight,
    borderWidth: 2,
    marginTop: 5,
    padding: 5,
    alignItems: 'center',
    borderRadius: 10,
  },
});
