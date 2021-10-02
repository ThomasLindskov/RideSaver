import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text } from 'react-native';

const NewsScreen = () => {
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
