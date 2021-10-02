import { useNavigation } from '@react-navigation/core';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { auth } from '../firebase';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import Ionicons from 'react-native-vector-icons/Ionicons';
import ProfileScreen from './ProfileScreen';
import NewsScreen from './NewsScreen';
import Screen1 from './Screen1';

const HomeScreen = () => {
  const navigation = useNavigation();
  const ProfileStack = createStackNavigator();
  const ProfileTab = createBottomTabNavigator();

  const handleSignOut = () => {
    auth
      .signOut()
      .then(() => {
        navigation.replace('Login');
      })
      .catch((error) => alert(error.message));
  };

  const ProfileNavigator = () => {
    return (
      <ProfileStack.Navigator>
        <ProfileStack.Screen name='Profile Screen' component={ProfileScreen} />
        <ProfileStack.Screen name='Screen 1' component={Screen1} />
      </ProfileStack.Navigator>
    );
  };

  return (
    <View style={styles.container}>
      <Text>
        You are now logged in with the email: {auth.currentUser?.email}
      </Text>

      <TouchableOpacity onPress={handleSignOut} style={styles.button}>
        <Text style={styles.buttonText}>Sign out</Text>
      </TouchableOpacity>
      <NavigationContainer independent={true}>
        <ProfileTab.Navigator>
          <ProfileTab.Screen
            name={'Profile'}
            component={ProfileNavigator}
            options={{
              tabBarIcon: () => (
                <Ionicons name='person-circle-outline' size={20} />
              ),
            }}
          />
          <ProfileTab.Screen
            name='News'
            component={NewsScreen}
            options={{
              tabBarIcon: () => <Ionicons name='newspaper-outline' size={20} />,
            }}
          />
        </ProfileTab.Navigator>
      </NavigationContainer>
    </View>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  button: {
    backgroundColor: '#0782F9',
    width: '60%',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 40,
  },
  buttonText: {
    color: 'white',
    fontWeight: '700',
    fontSize: 16,
  },
});
