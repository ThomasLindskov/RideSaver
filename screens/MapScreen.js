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
  const [hasLocationPermission, setHasLocationPermission] = useState(false);
  const [currentLocation, setCurrentLocation] = useState(null);
  const [userMarkerCoordinates, setUserMarkerCoordinates] = useState([]);
  const [selectedCoordinate, setSelectedCoordinate] = useState(null);
  const [selectedAddress, setSelectedAddress] = useState(null);

  const getLocationPermission = async () => {
    await Location.requestForegroundPermissionsAsync().then((item) => {
      setHasLocationPermission(item.granted);
    });
  };

  useEffect(() => {
    const response = getLocationPermission();
  });

  const updateLocation = async () => {
    await Location.getCurrentPositionAsync({
      accuracy: Accuracy.Balanced,
    }).then((item) => {
      setCurrentLocation(item.coords);
    });
  };

  const handleLongPress = (event) => {
    const coordinate = event.nativeEvent.coordinate;
    setUserMarkerCoordinates((userMarkerCoordinates) => [
      ...userMarkerCoordinates,
      coordinate,
    ]);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
  };

  const handleSelectMarker = async (coordinate) => {
    setSelectedCoordinate(coordinate);
    await Location.reverseGeocodeAsync(coordinate).then((data) => {
      setSelectedAddress(data);
    });
  };

  const closeInfoBox = () =>
    setSelectedCoordinate(null) && setSelectedAddress(null);

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

  return (
    <SafeAreaView style={styles.container}>
      <RenderCurrentLocation
        props={{
          hasLocationPermission: hasLocationPermission,
          currentLocation: currentLocation,
        }}
      />
      <MapView
        style={styles.map}
        showsUserLocation
        onLongPress={handleLongPress}
      >
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
        {userMarkerCoordinates.map((coordinate, index) => (
          <Marker
            coordinate={coordinate}
            key={index.toString()}
            onPress={() => handleSelectMarker(coordinate)}
          />
        ))}
      </MapView>

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
