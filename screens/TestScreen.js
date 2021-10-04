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
import config from '../config/config';

const deviceHeight = Dimensions.get('window').height;
const deviceWidth = Dimensions.get('window').width;

class TestScreen extends Component {
  render() {
    return (
      <View style={{ backgroundColor: '#FFFBFF' }}>
        <Text style={styles.header}>Testscreen</Text>
        <Categories navigation={this.props.navigation} />
        <TrendingNews navigation={this.props.navigation} />
      </View>
    );
  }
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
