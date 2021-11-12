// Importing modules and components
import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  SafeAreaView,
  Dimensions,
  Button,
} from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import { Accuracy } from 'expo-location';
import * as Haptics from 'expo-haptics';
import Constants from 'expo-constants';

const MapScreen = () => {
  // State for creating markers on the map, setting the default location etc.
  const [hasLocationPermission, setHasLocationPermission] = useState(false);
  const [currentLocation, setCurrentLocation] = useState(null);
  const [userMarkerCoordinates, setUserMarkerCoordinates] = useState([]);
  const [selectedCoordinate, setSelectedCoordinate] = useState(null);
  const [selectedAddress, setSelectedAddress] = useState(null);

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
          title="update location"
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
        style={styles.map}
        showsUserLocation
        onLongPress={handleLongPress}
      >
        {/* 3 predefined markers */}
        <Marker
          title="Hjem"
          description="Her bor jeg"
          coordinate={{
            latitude: 55.66663192214644,
            longitude: 12.623913456074268,
          }}
        />
        <Marker
          title="Babistan"
          description="bab"
          coordinate={{
            latitude: 55.667885358340435,
            longitude: 12.548816787109843,
          }}
        />
        <Marker
          title="Spunk"
          description="ad"
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
      {/* Shows info about a selected coordinate, and closes onPress of button*/}
      {selectedCoordinate && selectedAddress && (
        <View style={styles.infoBox}>
          <Text style={styles.infoText}>
            {selectedCoordinate.latitude}, {selectedCoordinate.longitude}
          </Text>
          <Text style={styles.infoText}>
            Name: {selectedAddress[0].name} Region: {selectedAddress[0].region}
          </Text>
          <Button title="close" onPress={closeInfoBox} />
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
});
