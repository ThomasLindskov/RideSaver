import React, { useState, useEffect } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Image,
} from 'react-native';
import { auth } from '../firebase';
import { GlobalStyles, BrandColors } from '../styles/GlobalStyles';

const LoginScreen = ({ navigation }) => {

  //Two variables used for providing email and password
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  useEffect(() => {
    //If the user is already logged in go to HomeScreen, which is a reference to the tab navigator
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        navigation.replace('HomeScreen');
      }
    });
    return unsubscribe;
  }, []);

  //Go to the register screen should you want to register
  const handleRegister = () => {
    navigation.navigate('Register');
  };

  //This handles login
  const handleLogin = () => {
    //Uses firebase method sign in user if in auth in firebase. 
    auth
      .signInWithEmailAndPassword(email, password)
      .then((userCredentials) => {
        const user = userCredentials.user;
        console.log('Logged in with: ', user.email);
      })
      .catch((error) => alert(error.message));
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={styles.inputContainer}>
        <View style={{ justifyContent: 'center', alignItems: 'center' }}>
          <Image
            source={require('../assets/Logo.png')}
            style={{
              height: 64,
              width: 456,
              margin: 10,
            }}
          />
        </View>
        <Text style={styles.header}>Welcome to RideSaver, please log in!</Text>
        <TextInput
          placeholder='Email'
          value={email}
          onChangeText={(text) => setEmail(text)}
          style={styles.input}
        />
        <TextInput
          placeholder='Password'
          value={password}
          onChangeText={(text) => setPassword(text)}
          style={styles.input}
          secureTextEntry
        />
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity onPress={handleLogin} style={styles.button}>
          <Text style={styles.buttonText}>Login</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={handleRegister}
          style={[styles.button, styles.buttonOutline]}
        >
          <Text style={styles.buttonOutlineText}>Register</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  container: {
    ...GlobalStyles.container,
    backgroundColor: BrandColors.Primary,
  },
  inputContainer: {
    width: '80%',
  },
  input: {
    backgroundColor: BrandColors.WhiteLight,
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 10,
    marginTop: 5,
    color: BrandColors.GreyDark,
    borderColor: BrandColors.Secondary,
    borderWidth: 2,
  },

  buttonContainer: {
    width: '60%',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 40,
  },
  button: {
    backgroundColor: BrandColors.PrimaryLight,
    width: '100%',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },

  buttonOutline: {
    backgroundColor: BrandColors.WhiteLight,
    marginTop: 5,
    borderColor: BrandColors.PrimaryLight,
    borderWidth: 2,
  },

  buttonText: {
    color: BrandColors.WhiteLight,
    fontWeight: '700',
    fontSize: 16,
  },
  buttonOutlineText: {
    color: BrandColors.PrimaryLight,
    fontWeight: '700',
    fontSize: 16,
  },
  header: {
    alignItems: 'center',
    fontWeight: 'bold',
    paddingBottom: 20,
    fontSize: 18,
    color: BrandColors.WhiteLight,
  },
});
