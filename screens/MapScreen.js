// Importing modules and components
import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  SafeAreaView,
  Dimensions,
  Button,
} from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import * as Haptics from 'expo-haptics';
import { GlobalStyles, BrandColors } from '../styles/GlobalStyles';
import { auth, db } from '../firebase';
import EditCoordinateModal from '../Components/Modals/EditCoordinateModal';
import AddCoordinateModal from '../Components/Modals/AddCoordinateModal';

import CoordinateDetailsModal from '../Components/Modals/CoordinateDetailsModal';
import { LocationEventEmitter } from 'expo-location/build/LocationEventEmitter';


const MapScreen = ({ route }) => {
  // State for creating markers on the map, setting the default location etc.
  const [hasLocationPermission, setHasLocationPermission] = useState(false);
  const [userMarkerCoordinate, setUserMarkerCoordinate] = useState(null);

  const [location, setLocation] = useState({
    latitude: 55.666388,
    longitude: 12.623887,
  });

  const [modalVisible, setModalVisible] = useState(false);

  const [modalInsert, setModalInsert] = useState();
  const [coordinates, setCoordinates] = useState([]);
  const [markerAddress, setMarkerAddress] = useState();

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
  }, [modalInsert, modalVisible]);

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
                latitude: coordinate.val().latitude,
                longitude: coordinate.val().longitude,
                userid: coordinate.val().userid,
                userjoined: coordinate.val().userjoined,
                address: coordinate.val().address
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
  const handleLongPress = async (event) => {
    const coordinate = event.nativeEvent.coordinate;
    
    //Skal testes på Iphone da Mikkels virkede anderledes. 
    await Location.reverseGeocodeAsync(coordinate).then((data) => {
      setMarkerAddress(data)
    } )
    setUserMarkerCoordinate(coordinate);
    // Haptics creates a vibration for longpress
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    setModalVisible(true);

  };

  const getPinColor = (userid) => {
    if (userid == auth.currentUser.uid) {
      return 'blue';
    } else {
      return 'red';
    }
  };

  const handleClose = () => {
    setModalInsert(null);
  };

  const handleNewClose = () => {
    setModalVisible(false);
  };

  const getModal = (coordinate) => {
    if (coordinate.userid != auth.currentUser.uid) {
      setModalInsert(
        <CoordinateDetailsModal
          isOpen={true}
          handleClose={handleClose}
          coordinate={coordinate}
        />
      );
    } else {
      setModalInsert(
        <EditCoordinateModal
          isOpen={true}
          handleClose={handleClose}
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
        onPress={() => {getCoordinates()}}
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
        {coordinates.map((coordinate, index) => {
        let formattedDate = new Date( Date.parse(coordinate.date) );
        let dateString = `${formattedDate.toLocaleString('default', { month: 'short' })}`
        return (<Marker
            title={dateString}
            description='Press here to get more info.'
            key={index}
            onCalloutPress={() => {
              getModal(coordinate);
            }}
            pinColor={getPinColor(coordinate.userid)}
            coordinate={{
              latitude: Number(coordinate.latitude),
              longitude: Number(coordinate.longitude),
            }}
          />)
          })}
        {/* Mapping through userMarkerCoordinates array and outputs each one, this should be updated to not be an empty array,
        but import existing coordinates from firebase. */}
        {userMarker}
      </MapView>
      <View>
        {
          <AddCoordinateModal
            isOpen={modalVisible}
            handleClose={handleNewClose}
            coordinate={userMarkerCoordinate}
            address = {markerAddress}
            setUserMarkerCoordinate={setUserMarkerCoordinate}
          />
        }
        {modalInsert}
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
