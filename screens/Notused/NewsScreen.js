import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import Categories from '../../Components/Categories';
import TrendingNews from '../../Components/TrendingNews';

const NewsScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.header}>Newsscreen</Text>
      <Text>This is the color palette for the app</Text>
      <View style={styles.box}>
        <Text style={styles.box1}>67697C</Text>
        <Text style={styles.box2}>E7C4B1</Text>
        <Text style={styles.box3}>FFFBFF</Text>
        <Text style={styles.box4}>CE8964</Text>
        <Text style={styles.box5}>131200</Text>
      </View>
    </View>
  );
};

export default NewsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFBFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  header: {
    color: '#CE8964',
    fontWeight: 'bold',
    fontSize: 30,
    textAlign: 'center',
  },
  box: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-around', //Aligning items along main axis (flexdirection)
    alignItems: 'center', //Aligning items along secondary axis
    paddingTop: 10,
    height: '100%',
  },
  box1: { flex: 1, padding: 30, backgroundColor: '#67697C', color: '#FFFBFF' },
  box2: { flex: 1, padding: 30, backgroundColor: '#E7C4B1', color: '#131200' },
  box3: { flex: 1, padding: 30, backgroundColor: '#FFFBFF', color: '#131200' },
  box4: { flex: 1, padding: 30, backgroundColor: '#CE8964', color: '#FFFBFF' },
  box5: { flex: 1, padding: 30, backgroundColor: '#131200', color: '#FFFBFF' },
});
