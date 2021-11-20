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
import MapView, { Marker, Callout } from 'react-native-maps';
import * as Location from 'expo-location';
import { Accuracy } from 'expo-location';
import * as Haptics from 'expo-haptics';
import DateTimePicker from '@react-native-community/datetimepicker';
import Modal from "react-native-modal";
import { auth , db } from '../firebase';  
import EditCoordinateModal from '../Components/Modals/EditCoordinateModal';
import AddCoordinateModal from '../Components/Modals/AddCoordinateModal';

import CoordinateDetailsModal from '../Components/Modals/CoordinateDetailsModal';




const MapScreen = ({route}) => {
  // State for creating markers on the map, setting the default location etc.
  const [hasLocationPermission, setHasLocationPermission] = useState(false);
  const [currentLocation, setCurrentLocation] = useState(null);
  const [userMarkerCoordinate, setUserMarkerCoordinate] = useState(null);

  const [selectedCoordinate, setSelectedCoordinate] = useState(null);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [location, setLocation] = useState({
    latitude: 55.666388,
    longitude: 12.623887,
  });

  const [modalVisible, setModalVisible] = useState(false);

  const [modalInsert, setModalInsert] = useState();
  const [coordinates, setCoordinates] = useState([]);



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
    }, [modalInsert, modalVisible])

   
    const getCoordinates = async () => {
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

      let coordinates = []
      await db.ref('coordinates/').get().then(snapshot => {
        if (snapshot.exists()) {
          snapshot.forEach(coordinate => {
            if(coordinate.val().groupId == groupid){
              let newObj = {
                id: coordinate.key,
                availableSeats: coordinate.val().availableSeats,
                date: coordinate.val().date,
                groupId: coordinate.val().groupId,
                lat: coordinate.val().lat,
                long: coordinate.val().long,
                userid: coordinate.val().userid,
                userjoined: coordinate.val().userjoined
              }
              coordinates.push(newObj)
            }
           
          })
        } else {
          console.log("No data available");
        }
      })
      .catch((error) => {
        console.error(error);
      })

      setCoordinates(coordinates)


    }

    
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


    setUserMarkerCoordinate(coordinate)
    // Haptics creates a vibration for longpress
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    setModalVisible(true)
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
  /*const RenderCurrentLocation = (props) => {
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
  };*/



  const getPinColor = (userid) => {
    if(userid == auth.currentUser.uid){
      return "blue"
    }else {
      return "red"
    }
  };

  const handleClose = ()=>{
    setModalInsert(null)
  }

  const handleNewClose = ()=>{
    setModalVisible(false)
  }

  const getModal = (coordinate) => {
      if(coordinate.userid != auth.currentUser.uid){
        setModalInsert(<CoordinateDetailsModal isOpen={true} handleClose={handleClose} coordinate = {coordinate}/>)
      }else {
        setModalInsert(<EditCoordinateModal isOpen={true} handleClose={handleClose} coordinate = {coordinate}/>)
      }
      

      
  };





  const userMarker = userMarkerCoordinate != null ? (
      <Marker
        title='Custom ting'
        description='Sindssyg custom ting'
        pinColor = 'yellow'
        coordinate= {userMarkerCoordinate}
      />): null;




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
 

   let modal;
  
  return (
    <SafeAreaView style={styles.container}>
      <Button
        onPress={getCoordinates}
        title="Reload map (Test button)"
        color="#841584"
        accessibilityLabel="Reload map"
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
            title = {coordinate.date}
            description = 'This is a coordinate.'
            key={index}
            onCalloutPress={() => {
              getModal(coordinate)  
              setCoordinateModalVisible(true)
            }}
            pinColor = {getPinColor(coordinate.userid)} 
            coordinate={{
              latitude: Number(coordinate.lat),
              longitude: Number(coordinate.long),
            }}
          />
          ))
        } 
        {/* Mapping through userMarkerCoordinates array and outputs each one, this should be updated to not be an empty array,
        but import existing coordinates from firebase. */}
        {userMarker}
      </MapView>
      <View>
        {<AddCoordinateModal isOpen={modalVisible} handleClose = {handleNewClose} coordinate = {userMarkerCoordinate} setUserMarkerCoordinate = {setUserMarkerCoordinate}  /> }
        {modalInsert}
      </View>

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
    padding: 0,
    
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
