import React from 'react';
import { StyleSheet, View } from 'react-native';

const Screen1 = (props) => {
  return (
    <View style={styles.container}>
      <Text>Screen 1</Text>
    </View>
  );
};

export default Screen1;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
