import { useNavigation } from '@react-navigation/core';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { auth } from '../firebase';
import Categories from '../Components/Categories';
import TrendingNews from "../Components/TrendingNews";

const HomeScreen = ({navigation}) => {

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Trending news</Text>
      <TrendingNews navigation={navigation} />
    </View>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFBFF',
  },
  button: {
    backgroundColor: '#CE8964',
    width: '60%',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 40,
  },
  buttonText: {
    color: '#FFFBFF',
    fontWeight: '700',
    fontSize: 16,
  },
  header: {
    color: '#CE8964',
    fontWeight: 'bold',
    fontSize: 30,
    textAlign: 'center',
    marginTop: 20,
  },

});
