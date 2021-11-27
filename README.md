# ** RideSaver **

### Ridesharing app for companies to offer to their employees.

The app uses a stack of React Native, Firebase and Firebase Realtime Database and has the following dependencies:

![Dependencies](/assets/app/Dependencies.jpg)

To run the app run the following commands in the terminal:

```
npm install

npm start
```

To test the app, either scan the QR code with the expo app, which can be dowloaded here:  
Android: https://play.google.com/store/apps/details?id=host.exp.exponent&hl=da&gl=US  
iPhone: https://apps.apple.com/us/app/expo-go/id982107779

or press the 'w' in the console to open in web (not created or tested for webview)

## App Vision

_Creating a greener future for Denmark_

### Screendumps fra appen

![Login screen]<img src='/assets/app/LoginScreen.jpg' width='400' height='790'>  
![Register screen](/assets/app/RegisterScreen.jpg | width=100)  
![Map screen](/assets/app/MapScreen.jpg | width=200)  
![Join Ride](/assets/app/JoinRide.jpg)  
![Profile screen](/assets/app/ProfileScreen.jpg)
![Info screen](/assets/app/InfoScreen.jpg)  
![Create Ride](/assets/app/AddRide.jpg)

## Component structure

1. App.js
   - components
     - modals
       - AddCoordinateModal.js
       - CoordinateDetailsModal.js
       - EditCoordinateModal.js
     - navigation
       - CoordinateStackNavigator.js
       - TabNavigator.js
   - Screens
     - InfoScreen.js
     - LoginScreen.js
     - MapScreen.js
     - RegisterScreen.js
     - TestScreen.js
   - styles
     - GlobalStyles.js
2. firebase.js
