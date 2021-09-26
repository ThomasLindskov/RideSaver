// Import the functions you need from the SDKs you need
import * as firebase from 'firebase';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: 'AIzaSyBE-92DxJK4ihRwMio9vN049LDWRkNtKHo',
  authDomain: 'secret-fff0d.firebaseapp.com',
  projectId: 'secret-fff0d',
  storageBucket: 'secret-fff0d.appspot.com',
  messagingSenderId: '962298843369',
  appId: '1:962298843369:web:bbb96b7942c4624d622078',
};

// Initialize Firebase
let app;
if (firebase.apps.length === 0) {
  app = firebase.initializeApp(firebaseConfig);
} else {
  app = firebase.app();
}

const auth = firebase.auth();

export { auth };
