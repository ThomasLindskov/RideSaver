import React, { Component } from 'react';
import {
  ActivityIndicator,
  Text,
  View,
  StyleSheet,
  Dimensions,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import Categories from '../Components/Categories';
import TrendingNews from '../Components/TrendingNews';
import config from '../config';

const deviceHeight = Dimensions.get('window').height;
const deviceWidth = Dimensions.get('window').width;

const TestScreen = ({navigation}) => {
    return (
      <View style={{ backgroundColor: '#FFFBFF' }}>
        <Text style={styles.header}>Testscreen</Text>
        <Categories navigation={navigation} />
      </View>
    );
}

const styles = StyleSheet.create({
  header: {
    color: '#CE8964',
    fontWeight: 'bold',
    fontSize: 30,
    textAlign: 'center',
  },
});

export default TestScreen;
