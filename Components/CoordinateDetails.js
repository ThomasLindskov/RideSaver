import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Platform, Button, Alert } from 'react-native';
import firebase from 'firebase';

const CoordinateDetails = (props) => {
  const { navigation, route } = props;
  const [coordinate, setCoordinate] = useState({});

  useEffect(() => {
    setCoordinate(route.params.coordinate[1]);

    return () => {
      setCoordinate({});
    };
  });

  const handleEdit = () => {
    const coordinate = route.params.coordinate;
    navigation.navigate('Edit Coordinate', { coordinate });
  };

  const confirmDelete = () => {
    if (Platform.OS === 'ios' || Platform.OS === 'android') {
      Alert.alert('Are you sure?', 'Do you want to delete the coordinate?', [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete', style: 'destructive', onPress: () => handleDelete() },
      ]);
    }
  };

  const handleDelete = () => {
    const id = route.params.coordinate[0];
    try {
      firebase.database().ref(`/Coordinates/${id}`).remove();
      navigation.goBack();
    } catch (error) {
      Alert.alert(error.message);
    }
  };

  if (!coordinate) {
    return <Text>No data</Text>;
  }

  return (
    <View style={styles.container}>
      <Button title="Edit" onPress={() => handleEdit()} />
      <Button title="Delete" onPress={() => confirmDelete()} />
      {Object.entries(coordinate).map((item, index) => {
        return (
          <View style={styles.row} key={index}>
            <Text style={styles.label}> {item[0]} </Text>
            <Text style={styles.label}> {item[1]} </Text>
          </View>
        );
      })}
      <Button title="Edit" onPress={() => handleEdit()} />
      <Button title="Delete" onPress={() => handleDelete()} />
    </View>
  );
};

export default CoordinateDetails;

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'flex-start' },
  row: {
    margin: 5,
    padding: 5,
    flexDirection: 'row',
  },
  label: { width: 100, fontWeight: 'bold' },
  value: { flex: 1 },
});
