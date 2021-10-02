import React from 'react';
import { Button, StyleSheet, View, Text } from 'react-native';
import firebase from 'firebase';

const ProfileScreen = () => {
  const handleLogOut = async () => {
    await firebase.auth().signOut();
  };

  if (!firebase.auth().currentUser) {
    return (
      <View>
        <Text>Not found</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text>Current user: {firebase.auth().currentUser.email}</Text>
      <Button onPress={() => handleLogOut()} title='Log out' />
    </View>
  );
};

export default ProfileScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
