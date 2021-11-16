// Importing modules and components
import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import firebase from 'firebase';

// Profilescreen if a user is not logged in
const ProfileScreen = () => {
  if (!firebase.auth().currentUser) {
    return (
      <View style={styles.container}>
        <Text>
          HEY! You should not have access to this site as you are not logged in
        </Text>
      </View>
    );
  }

  // If a user is logged in they wiil se this screen with their email
  return (
    <View style={styles.container}>
      <Text style={styles.header}>Profilescreen</Text>
      <Text>
        This is the profilescreen of: {firebase.auth().currentUser.email}
      </Text>
    </View>
  );
};

export default ProfileScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFBFF',
  },
  header: {
    color: '#CE8964',
    fontWeight: 'bold',
    fontSize: 30,
    textAlign: 'center',
  },
});
