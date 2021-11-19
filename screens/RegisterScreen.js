import React, { useState, useEffect } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { auth, db } from '../firebase';
import { GlobalStyles, BrandColors } from '../styles/GlobalStyles';

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        navigation.replace('HomeScreen');
      }
    });
    return unsubscribe;
  }, []);

  const handleRegister = () => {
    auth
      .createUserWithEmailAndPassword(email, password)
      .then((user) => {
        const userCredentials = user.user;
        if (user && name) {
          try {
            db.ref('userData/' + userCredentials.uid).set({
              name: name,
              groups: [1],
            });
          } catch (error) {
            console.log(`Error: ${error.message}`);
          }
        }
        console.log('Registered user with email: ', userCredentials.uid);
      })
      .catch((error) => alert(error.message));
  };

  const handleLogin = () => {
    navigation.navigate('Login');
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={styles.inputContainer}>
        <Text style={styles.header}>
          Welcome to RideSaver, please register!
        </Text>
        <Text style={styles.buttonOutlineText}>
          Use your company email when signing up!
        </Text>
        <TextInput
          placeholder='Name'
          value={name}
          onChangeText={(text) => setName(text)}
          style={styles.input}
        />
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
        <TouchableOpacity
          onPress={handleRegister}
          style={[styles.button, styles.buttonOutline]}
        >
          <Text style={styles.buttonOutlineText}>Register</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={handleLogin} style={styles.button}>
          <Text style={styles.buttonText}>Login</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  container: {
    ...GlobalStyles.container,
    backgroundColor: BrandColors.Secondary,
  },
  header: {
    ...GlobalStyles.header,
    color: BrandColors.GreyDark,
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
    borderColor: BrandColors.Primary,
    borderWidth: 2,
  },

  buttonContainer: {
    width: '60%',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 40,
  },
  button: {
    backgroundColor: BrandColors.Primary,
    width: '100%',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },

  buttonOutline: {
    backgroundColor: BrandColors.WhiteLight,
    marginTop: 5,
    marginBottom: 5,
    borderColor: BrandColors.Primary,
    borderWidth: 2,
  },

  buttonText: {
    color: BrandColors.WhiteLight,
    fontWeight: '700',
    fontSize: 16,
  },
  buttonOutlineText: {
    color: BrandColors.GreyDark,
    fontWeight: '700',
    fontSize: 16,
  },
});
