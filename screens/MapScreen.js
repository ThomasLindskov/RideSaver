// Importing modules and components
import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  SafeAreaView,
  Dimensions,
  Button,
  Pressable,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import * as Haptics from 'expo-haptics';
import DateTimePicker from '@react-native-community/datetimepicker';
import { GlobalStyles, Colors, BrandColors } from '../styles/GlobalStyles';
import Modal from 'react-native-modal';
import { auth, db } from '../firebase';
import EditCoordinateModal from '../Components/Modals/EditCoordinateModal';
import CoordinateDetailsModal from '../Components/Modals/CoordinateDetailsModal';

const MapScreen = ({ route }) => {
  // State for creating markers on the map, setting the default location etc.
  const [hasLocationPermission, setHasLocationPermission] = useState(false);
  const [userMarkerCoordinate, setUserMarkerCoordinate] = useState(null);

  const [location, setLocation] = useState({
    latitude: 55.666388,
    longitude: 12.623887,
  });

  const [modalVisible, setModalVisible] = useState(false);
  const [coordinateModalVisible, setCoordinateModalVisible] = useState(false);
  const [coordinates, setCoordinates] = useState([]);
  const [userDate, setUserDate] = useState(new Date());
  const [mode, setMode] = useState('date');
  const [show, setShow] = useState(false);
  const [availableSeats, setAvailableSeats] = useState();
  const [groupCoordinates, setGroupCoordinates] = useState();

  // Alerts user to give locationpermission
  const getLocationPermission = async () => {
    await Location.requestForegroundPermissionsAsync().then((item) => {
      setHasLocationPermission(item.granted);
    });
  };

  // The useEffect hook runs everytime the page updates, which means if something happens,
  // getLocationPermission will run again to check if we have location permission
  useEffect(() => {
    const response = getLocationPermission();
    getCoordinates();
  }, []);

  const getCoordinates = async () => {
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

    let coordinates = [];
    await db
      .ref('coordinates/')
      .get()
      .then((snapshot) => {
        if (snapshot.exists()) {
          snapshot.forEach((coordinate) => {
            if (coordinate.val().groupId == groupid) {
              let newObj = {
                id: coordinate.key,
                availableSeats: coordinate.val().availableSeats,
                date: coordinate.val().date,
                groupId: coordinate.val().groupId,
                lat: coordinate.val().lat,
                long: coordinate.val().long,
                userid: coordinate.val().userid,
                userjoined: coordinate.val().userjoined,
              };
              coordinates.push(newObj);
            }
          });
        } else {
          console.log('No data available');
        }
      })
      .catch((error) => {
        console.error(error);
      });

    setCoordinates(coordinates);
  };

  // When the map is long pressed we set a coordinate and updates the userMarkerCoordinates array
  const handleLongPress = (event) => {
    const coordinate = event.nativeEvent.coordinate;

    setUserMarkerCoordinate(coordinate);
    // Haptics creates a vibration for longpress
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    setModalVisible(true);
  };

  const createRide = async (event) => {
    setModalVisible(false);
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
        lat: userMarkerCoordinate.latitude,
        long: userMarkerCoordinate.longitude,
        userid: auth.currentUser.uid,
        availableSeats: availableSeats,
        groupId: groupid,
        date: newDate,
      });
    } catch (error) {
      console.log(`Error: ${error.message}`);
    }

    getCoordinates();
  };

  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate || userDate;
    setShow(Platform.OS === 'ios');
    setUserDate(currentDate);
  };

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

  const getPinColor = (userid) => {
    if (userid == auth.currentUser.uid) {
      return 'blue';
    } else {
      return 'red';
    }
  };

  const getModal = (coordinate) => {
    return console.log(coordinate);
    if (coordinate.userid != auth.currentUser.uid) {
      return (
        <CoordinateDetailsModal
          open={coordinateModalVisible}
          onClose={() => setCoordinateModalVisible(false)}
          coordinate={coordinate}
        />
      );
    } else {
      return (
        <EditCoordinateModal
          open={coordinateModalVisible}
          onClose={() => setCoordinateModalVisible(false)}
          coordinate={coordinate}
        />
      );
    }
  };

  const userMarker =
    userMarkerCoordinate != null ? (
      <Marker
        title='Custom ting'
        description='Sindssyg custom ting'
        pinColor='yellow'
        coordinate={userMarkerCoordinate}
      />
    ) : null;

  return (
    <SafeAreaView style={styles.container}>
      <Button
        onPress={getCoordinates}
        title='Reload map (Test button)'
        color={BrandColors.SecondaryDark}
        accessibilityLabel='Reload map'
      />

      {/* Mapview shows the current location and adds a coordinate onLongPress */}
      <MapView
        initialRegion={{
          latitude: location.latitude,
          longitude: location.longitude,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
        style={styles.map}
        showsUserLocation
        onRegionChange={(region) => {
          setHasLocationPermission({
            latitude: region.latitude,
            longitude: region.longitude,
          });
        }}
        onRegionChangeComplete={(region) => {
          setHasLocationPermission({
            latitude: region.latitude,
            longitude: region.longitude,
          });
        }}
        onLongPress={handleLongPress}
      >
        {/* 2 predefined markers */}
        <Marker
          title='Babistan'
          description='bab'
          coordinate={{
            latitude: 55.667885358340435,
            longitude: 12.548816787109843,
          }}
        />

        {coordinates.map((coordinate, index) => (
          <Marker
            title={coordinate.date}
            description='This is a coordinate.'
            key={index}
            onCalloutPress={() => getModal(coordinate)}
            pinColor={getPinColor(coordinate.userid)}
            coordinate={{
              latitude: Number(coordinate.lat),
              longitude: Number(coordinate.long),
            }}
          />
        ))}
        {/* Mapping through userMarkerCoordinates array and outputs each one, this should be updated to not be an empty array,
        but import existing coordinates from firebase. */}
        {userMarker}
      </MapView>
      <View>
        <Modal
          visible={modalVisible}
          animationType='slide'
          transparent={true}
          onRequestClose={() => {
            setModalVisible(!modalVisible);
          }}
        >
          <View style={styles.modalView}>
            <Text style={styles.header}>Create Ride</Text>
            <Text style={styles.modalText}>Departure Time</Text>
            <View style={styles.pickedDateContainer}>
              <Text>
                {userDate.toString().split(' ').splice(0, 5).join(' ')}
              </Text>
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
              style={styles.input}
              onChangeText={setAvailableSeats}
              value={availableSeats}
              placeholder='Seats in car'
              keyboardType='numeric'
            />

            <Pressable
              style={[styles.button, styles.buttonClose]}
              onPress={() => setModalVisible(!modalVisible)}
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
      </View>
    </SafeAreaView>
  );
};

export default MapScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 0,
  },
  header: {
    ...GlobalStyles.header,
    color: BrandColors.SecondaryDark,
  },
  map: {
    flex: 1,
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
  },
  input: {
    borderWidth: 1,
    padding: 5,
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
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
    marginTop: 15,
  },
  buttonClose: {
    backgroundColor: BrandColors.SecondaryDark,
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
