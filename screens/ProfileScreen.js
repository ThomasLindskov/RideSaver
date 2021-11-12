import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import firebase from 'firebase';
import Tags from '../Components/Notused/Tags';

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

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Profilescreen</Text>
      <Text>
        This is the profilescreen of: {firebase.auth().currentUser.email}
      </Text>
      <Text>Choose tags below to get news customized for you:</Text>
      <Tags />
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
