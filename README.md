# ** RideSaver **

### Ridesharing app for companies to offer to their employees.

The app uses a stack of React Native, Firebase and Firebase Realtime Database and has the following dependencies:

xx we need to update package.json (why do we have camera and medialibrary??)

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

_Give companies the choice of a greener future_

xx her tilføjer vi nogle billeder fra appen

### Screendumps fra appen

![Login screen](https://link.to.picture.com/picture1.jpg)  
![Home screen](https://link.to.picture.com/picture2.jpg)  
![Map screen](https://link.to.picture.com/picture3.jpg)  
![Ride details](https://link.to.picture.com/picture4.jpg)  
![Profile screen](https://link.to.picture.com/picture5.jpg)

xx
for more info https://docs.github.com/en/github/writing-on-github/getting-started-with-writing-and-formatting-on-github/basic-writing-and-formatting-syntax relative links

## Component structure

1. App.js
   - Components
     - Modals
       - AddCoordinateModal.js
       - CoordinateDetailsModal.js
       - EditCoordinateModal.js
     - Navigation
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

