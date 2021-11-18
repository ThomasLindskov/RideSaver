// Firebase setup
// Import firebase
import firebase from 'firebase';

// Setting up admin access to the firebase database so we can access it without constantly updating the rules
/*const { initializeApp } = require('firebase-admin/app');

// Not done with this - xx https://firebase.google.com/docs/admin/setup#windows

initializeApp({
  credential: applicationDefault(),
  databaseURL: 'https://<DATABASE_NAME>.firebaseio.com'
});*/


// Firebase configuration for project
const firebaseConfig = {
  apiKey: 'AIzaSyBE-92DxJK4ihRwMio9vN049LDWRkNtKHo',
  authDomain: 'secret-fff0d.firebaseapp.com',
  databaseURL:
    'https://secret-fff0d-default-rtdb.europe-west1.firebasedatabase.app',
  projectId: 'secret-fff0d',
  storageBucket: 'secret-fff0d.appspot.com',
  messagingSenderId: '962298843369',
  appId: '1:962298843369:web:bbb96b7942c4624d622078',
};

// Initialize Firebase if it is not already initialized
let app;
if (firebase.apps.length === 0) {
  app = firebase.initializeApp(firebaseConfig);
} else {
  app = firebase.app();
}

const auth = firebase.auth();

export { auth };
