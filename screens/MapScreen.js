// Importing modules and components
import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  SafeAreaView,
  Dimensions,
  Button,
  Modal,
  Pressable,
  TouchableOpacity,
  Picker,
} from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import { Accuracy } from 'expo-location';
import * as Haptics from 'expo-haptics';
import Constants from 'expo-constants';
import DateTimePicker from '@react-native-community/datetimepicker';
import DropDownPicker from 'react-native-dropdown-picker';

const MapScreen = () => {
  // State for creating markers on the map, setting the default location etc.
  const [hasLocationPermission, setHasLocationPermission] = useState(false);
  const [currentLocation, setCurrentLocation] = useState(null);
  const [userMarkerCoordinates, setUserMarkerCoordinates] = useState([]);
  const [selectedCoordinate, setSelectedCoordinate] = useState(null);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [location, setLocation] = useState({
    latitude: 55.666388,
    longitude: 12.623887,
  });

  const [modalVisible, setModalVisible] = useState(false);

  const [date, setDate] = useState(new Date());
  const [mode, setMode] = useState('date');
  const [show, setShow] = useState(false);

  //State for dropdownpicker
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(null);
  const [numSeats, setNumSeats] = useState([
    { label: 0, value: 0 },
    { label: 1, value: 1 },
    { label: 2, value: 2 },
    { label: 3, value: 3 },
    { label: 4, value: 4 },
    { label: 5, value: 5 },
  ]);

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
  });

  // Only used for getting coordinates from current location shown on map not a marker
  // Maybe remove this function xx
  const updateLocation = async () => {
    await Location.getCurrentPositionAsync({
      accuracy: Accuracy.Balanced,
    }).then((item) => {
      setCurrentLocation(item.coords);
    });
  };

  // When the map is long pressed we set a coordinate and updates the userMarkerCoordinates array
  const handleLongPress = (event) => {
    const coordinate = event.nativeEvent.coordinate;
    setUserMarkerCoordinates((userMarkerCoordinates) => [
      ...userMarkerCoordinates,
      coordinate,
    ]);
    // Haptics creates a vibration for longpress
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
  };

  // When creating a new coordinate this sets a selectedadress which is run on line 130-136
  const handleSelectMarker = async (coordinate) => {
    setSelectedCoordinate(coordinate);
    await Location.reverseGeocodeAsync(coordinate).then((data) => {
      setSelectedAddress(data);
    });
  };

  // Close infobox for specific coordinate.
  const closeInfoBox = () =>
    setSelectedCoordinate(null) && setSelectedAddress(null);

  // If no hasLocationPermission === null we return null
  // If there is an error we return a text asking to change settings
  // Otherwise the button for update location is shown (which is the function we might not need xx)
  const RenderCurrentLocation = (props) => {
    if (props.hasLocationPermission === null) {
      return null;
    }
    if (props.hasLocationPermission === false) {
      return <Text>No location access. Go to settings to change</Text>;
    }
    return (
      <View>
        <Button
          style={styles.container}
          title='update location'
          onPress={updateLocation}
        />
        {currentLocation && (
          <Text>
            {`Lat: ${currentLocation.latitude},\nLong:${currentLocation.longitude}`}
          </Text>
        )}
      </View>
    );
  };

  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setShow(Platform.OS === 'ios');
    setDate(currentDate);
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

  //   const handleChangeText = (name, event) => {
  //     setUserMarkerCoordinates({ ...userMarkerCoordinates, [name]: event });
  //   };

  //   <TextInput
  //   style={styles.input}
  //   onChangeText={(event) => handleChangeText(key, event)}
  //   value={userMarkerCoordinates[key]}
  // />

  // initialRegion={{
  //   latitude: 55.666388,
  //   longitude: 12.623887,
  //   latitudeDelta: 0.0922,
  //   longitudeDelta: 0.0421,
  // }}

  // <DialogInput
  //   title={'Create Ride'}
  //   message={'Do you want to create a ride from your current location?'}
  //   hintInput={'Add comment to your ride'}
  //   submitInput={(inputText) => {
  //     this.sendInput(inputText);
  //   }}
  //   closeDialog={() => {
  //     this.showDialog(false);
  //   }}
  // />;

  // <TextInput
  //             style={styles.input}
  //             placeholder='Choose number of available seats'
  //             value={number}
  //             onChangeText={onChangeNumber}
  //             keyboardType='numeric'
  //           />


    // RenderCurrentLocation might not be needed xx
  return (
    <SafeAreaView style={styles.container}>
      <RenderCurrentLocation
        props={{
          hasLocationPermission: hasLocationPermission,
          currentLocation: currentLocation,
        }}
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
        {/* 3 predefined markers */}
        <Marker
          title='Hjem'
          description='Her bor jeg'
          coordinate={{
            latitude: 55.66663192214644,
            longitude: 12.623913456074268,
          }}
        />
        <Marker
          title='Babistan'
          description='bab'
          coordinate={{
            latitude: 55.667885358340435,
            longitude: 12.548816787109843,
          }}
        />
        <Marker
          title='Spunk'
          description='ad'
          coordinate={{
            latitude: 55.6713715888453,
            longitude: 12.560422585260284,
          }}
        />
        {/* Mapping through userMarkerCoordinates array and outputs each one, this should be updated to not be an empty array,
        but import existing coordinates from firebase. */}
        {userMarkerCoordinates.map((coordinate, index) => (
          <Marker
            coordinate={coordinate}
            key={index.toString()}
            onPress={() => handleSelectMarker(coordinate)}
          />
        ))}
      </MapView>
      <Modal
        animationType='slide'
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          Alert.alert('Modal has been closed.');
          setModalVisible(!modalVisible);
        }}
      >
        <View style={styles.centeredView}>
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
              <Text>{date.toString().split(' ').splice(0, 5).join(' ')}</Text>
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
                value={date}
                mode={mode}
                is24Hour={true}
                display='default'
                onChange={onChange}
              />
            )}

            <Text style={styles.modalText}>Number of seats</Text>
            <DropDownPicker
              open={open}
              value={value}
              numSeats={numSeats}
              min={1}
              setOpen={setOpen}
              setValue={setValue}
              setNumSeats={setNumSeats}
            />
            <Pressable
              style={[styles.button, styles.buttonClose]}
              onPress={() => setModalVisible(!modalVisible)}
            >
              <Text style={styles.textStyle}>Close</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
      <Pressable
        style={[styles.button, styles.buttonOpen]}
        onPress={() => setModalVisible(true)}
      >
        <Text style={styles.textStyle}>Create Ride</Text>
      </Pressable>
{/* Shows info about a selected coordinate, and closes onPress of button*/}
      {selectedCoordinate && selectedAddress && (
        <View style={styles.infoBox}>
          <Text style={styles.infoText}>
            {selectedCoordinate.latitude}, {selectedCoordinate.longitude}
          </Text>
          <Text style={styles.infoText}>
            Name: {selectedAddress[0].name} Region: {selectedAddress[0].region}
          </Text>
          <Button title='close' onPress={closeInfoBox} />
        </View>
      )}
    </SafeAreaView>
  );
};

export default MapScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 8,
    paddingTop: Constants.statusBarHeight,
  },
  map: {
    flex: 1,
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
  },
  infoBox: {
    height: 200,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'yellow',
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
  },
  infoText: {
    fontSize: 15,
  },
  input: {
    borderWidth: 1,
    padding: 5,
  },
  modalView: {
    margin: 30,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    marginTop: 70,
    alignItems: 'center',
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
