import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import GetNews from './screens/GetNews';
import WebViewComponent from './Components/WebView';
import TabNavigator from './Components/Navigation/TabNavigator';

export default function App() {
  const Stack = createNativeStackNavigator();

  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          options={{ headerShown: false }}
          name="HomeScreen"
          component={TabNavigator}
        />
        <Stack.Screen name="GetNews" component={GetNews} />
        <Stack.Screen
          name="WebView"
          screenOptions={{ animationEnabled: false }}
          component={WebViewComponent}
          options={{ headerShown: true }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFBFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
