import React, { useEffect, useState } from 'react';
import { Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';

const CoordinateListScreen = ({ navigation }) => {
  const [coordinates, setCoordinates] = useState();

  useEffect(() => {
    if (!coordinates) {
      firebase
        .database()
        .ref('/Coordinates')
        .on('value', (snapshot) => {
          setCoordinates(snapshot.val());
        });
    }
  }, []);

  if (!coordinates) {
    return <Text>Loading...</Text>;
  }

  const handleSelectCoordinate = (id) => {
    const coordinate = Object.entries(coordinates).find(
      (coordinate) => coordinate[0] === id /*id*/
    );
    navigation.navigate('Coordinate Details', { coordinate });
  };

  const coordinateArray = Object.values(coordinates);
  const coordinateKeys = Object.keys(coordinates);

  return (
    <FlatList
      data={coordinateArray}
      keyExtractor={(item, index) => coordinateKeys[index]}
      renderItem={({ item, index }) => {
        return (
          <TouchableOpacity
            style={styles.container}
            onPress={() => handleSelectCoordinate(coordinateKeys[index])}
          >
            <Text>
              {item.leaveTime} {item.availableSeats}
            </Text>
          </TouchableOpacity>
        );
      }}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 10,
    margin: 5,
    padding: 5,
    height: 50,
    justifyContent: 'center',
  },
  label: { fontWeight: 'bold' },
});

export default CoordinateListScreen;
