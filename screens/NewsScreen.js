import React from 'react';
import { StyleSheet, View } from 'react-native';

const NewsScreen = (props) => {
  return (
    <View style={styles.container}>
      <Text>News screen</Text>
    </View>
  );
};

export default NewsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
