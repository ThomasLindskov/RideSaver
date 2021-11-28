// Firebase setup
// Import firebase
import firebase from 'firebase';


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

//we export both the auth and the db objects, which we get from these two functions. 
const auth = firebase.auth();
const db = firebase.database();


export { auth, db };
