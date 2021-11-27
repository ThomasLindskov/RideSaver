// Importing modules and firebase to acces data
import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Platform, Button, Alert } from 'react-native';
import { auth, db } from '../../firebase';
import Modal from 'react-native-modal';
import { GlobalStyles, BrandColors } from '../../Styles/GlobalStyles';

// Passed  which are deconstructed to acces navigation and route
const CoordinateDetailsModal = ({ isOpen, handleClose, coordinate }) => {
  const initialState = {
    address: '',
    date: '',
    availableSeats: '',
  };
  const [joinedUsers, setjoinedUsers] = useState([]);
  const [nameOfUser, setnameOfUser] = useState([]);

  // We find a Users name, depending on the userid on the coordinate.
  useEffect(() => {
    getUserName(coordinate.userid);
    //Here we find the joined users, which are on the coordinate, which is not used right now, but is supposed to be showing in this modal
    if (coordinate.userjoined) {
      setjoinedUsers(Object.keys(coordinate.userjoined));
    }
  }, [isOpen]);

  //This functions joins the logged in user on the coordinate.
  const handleJoinRide = () => {
    const id = coordinate.id;

    if (coordinate.userid == auth.currentUser.uid) {
      return Alert.alert('This is your ride');
    }
    // To edit the coordinate we request the id from firebase and use .update to update the attributes of the initalState object
    // We also substract one from available seats, cause we now have a new user. We could have userjoined and then substract that from availble seats.
    coordinate.availableSeats -= 1;
    try {
      db.ref(`coordinates/${id}`)
        // Only choosen fields will be updated
        .update({ availableSeats: coordinate.availableSeats });
      // Alert after updating info
      Alert.alert('You joined the ride!');
    } catch (error) {
      console.log(`Error: ${error.message}`);
    }

    //Here we throw in userjoined into the coordinate, this could also be done in the one above.
    try {
      db.ref(`coordinates/${id}/userjoined/` + auth.currentUser.uid)
        // we set the userjoined/:id to true, so that user is now joined the ride.
        .set({ 0: true });

      Alert.alert('You joined the ride!');
    } catch (error) {
      console.log(`Error: ${error.message}`);
    }
    //Close the modal
    handleClose();
  };

  //This functions handles when a user who is already joined wants to unjoin
  const handleRemoveRide = () => {
    const id = coordinate.id;

    // These to ifs should never pop, but they are their if it happens.
    if (coordinate.userid == auth.currentUser.uid) {
      return Alert.alert('This is your ride');
    }

    if (coordinate.availableSeats == 0) {
      return Alert.alert('No room on this ride');
    }

    coordinate.availableSeats += 1;
    try {
      db.ref(`coordinates/${id}`)
        // Only choosen fields will be updated
        .update({ availableSeats: coordinate.availableSeats });
      // Alert after updating info
      Alert.alert('You joined the ride!');
    } catch (error) {
      console.log(`Error: ${error.message}`);
    }

    try {
      db.ref(`coordinates/${id}/userjoined/` + auth.currentUser.uid)
        // We remove the key in userjoined, which is the currentuser, so now the userjoined key object, does not have our user anymore
        .remove();
      // Alert after updating info
      Alert.alert('You cancelled your seat');
    } catch (error) {
      console.log(`Error: ${error.message}`);
    }
    //Close the modal
    handleClose();
  };

  //Here we go in userData and get the Name of the user who made the coordinate.
  const getUserName = async (id) => {
    let name;
    await db
      .ref('userData/' + id)
      .get()
      .then((snapshot) => {
        if (snapshot.exists()) {
          name = snapshot.val().name;
        } else {
          console.log('No data available');
        }
      })
      .catch((error) => {
        console.error(error);
      });

    setnameOfUser(name);
  };

  // If no coordinate it shows this
  if (!coordinate) {
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
        <Button
          title="Close"
          color={BrandColors.Primary}
          onPress={() => handleClose()}
        />
      </Modal>
    );
  }

  //if the current user is in joined users, which is the joined users key, then you can cancel else you can join.
  const buttons = () => {
    if (joinedUsers.includes(auth.currentUser.uid)) {
      return (
        <View style={{ marginVertical: 10 }}>
          <Button
            title="Cancel Ride"
            color={BrandColors.Primary}
            onPress={() => handleRemoveRide()}
          />
        </View>
      );
    } else {
      return (
        <View style={{ marginVertical: 10 }}>
          <Button
            title="Join Ride"
            color={BrandColors.Primary}
            onPress={() => handleJoinRide()}
          />
        </View>
      );
    }
  };

  //Here we return the modal.
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
        <Text style={{ fontWeight: 'bold' }}> Driver: {nameOfUser} </Text>
        {Object.keys(initialState).map((key, index) => {
          //We make different formating for different keys
          //We need more data when the key is a address
          if (key == 'address') {
            return (
              <View style={styles.row} key={index}>
                <Text style={{ fontWeight: 'bold' }}>Address: </Text>
                <Text style={{ width: '80%' }}>
                  {`${coordinate[key].street} ${coordinate[key].name} ${coordinate[key].city} ${coordinate[key].postalCode}`}{' '}
                </Text>
              </View>
            );
          } else if (key == 'date') {
            //The same here with date, it needs to be formatted to readable string
            let formattedDate = new Date(Date.parse(coordinate[key]));
            let dateString = `${formattedDate.toLocaleString('default', {
              month: 'short',
            })}`;
            return (
              <View style={styles.row} key={index}>
                <Text style={{ fontWeight: 'bold' }}>Date:</Text>
                <Text> {dateString} </Text>
              </View>
            );
          } else {
            return (
              <View style={styles.row} key={index}>
                <Text style={{ fontWeight: 'bold' }}>Number of seats: </Text>
                <Text> {coordinate[key]} </Text>
              </View>
            );
          }
        })}
        {buttons()}
        <Button
          title="Close"
          color={BrandColors.Primary}
          onPress={() => {
            handleClose();
          }}
        />
      </View>
    </Modal>
  );
};

export default CoordinateDetailsModal;

const styles = StyleSheet.create({
  row: {
    margin: 5,
    padding: 5,
    flexDirection: 'row',
  },
  modalView: {
    margin: 30,
    backgroundColor: BrandColors.WhiteLight,
    borderRadius: 20,
    padding: 35,
    marginTop: 70,
    alignItems: 'center',
    shadowColor: BrandColors.GreyDark,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  buttonContainer: {
    width: '60%',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 40,
  },
  button: {
    backgroundColor: BrandColors.PrimaryLight,
    width: '100%',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  buttonOutline: {
    backgroundColor: BrandColors.WhiteLight,
    marginTop: 5,
    borderColor: BrandColors.PrimaryLight,
    borderWidth: 2,
  },

  buttonText: {
    color: BrandColors.WhiteLight,
    fontWeight: '700',
    fontSize: 16,
  },
  buttonOutlineText: {
    color: BrandColors.PrimaryLight,
    fontWeight: '700',
    fontSize: 16,
  },
});
