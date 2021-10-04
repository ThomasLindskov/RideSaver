import React, { Component } from 'react';
import { ScrollView, View, Text, StyleSheet } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';

const categories = [
  'Entertainment',
  'Business',
  'Politics',
  'Health',
  'Technology',
  'Sports',
];

class Categories extends Component {
  render() {
    return (
      <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
        {categories.map((category, index) => (
          <TouchableOpacity
            key={index}
            onPress={() =>
              this.props.navigation.navigate('GetNews', { category })
            }
          >
            <View>
              <Text style={styles.categories}>{category}</Text>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    );
  }
}

export default Categories;

const styles = StyleSheet.create({
  categories: {
    padding: 10,
    borderWidth: 1,
    borderColor: '#131200',
    fontSize: 19,
    margin: 10,
    borderRadius: 10,
  },
});
