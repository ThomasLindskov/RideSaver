// Importing modules and components
import React from 'react';
import { View, Text, Image } from 'react-native';
import { GlobalStyles, BrandColors } from '../styles/GlobalStyles';

const InfoScreen = () => {
  return (
    <View style={GlobalStyles.container}>
      <Text style={GlobalStyles.header}>Info screen</Text>
      <Text style={{ color: BrandColors.Primary, margin: 5 }}>
        Hello and welcome to RideSaver
      </Text>
      <Text style={{ margin: 5 }}>
        In this app you can create rides or join available rides.
      </Text>
      <View>
        <Text style={GlobalStyles.ul}>
          {'\u2B24'} For the rides that you have created, you can update time
          and available seats.
        </Text>
        <Text style={GlobalStyles.ul}>
          {'\u2B24'} For rides created by others, you can join and cancel the
          ride.
        </Text>
        <Text style={GlobalStyles.ul}>
          {'\u2B24'} A new ride is created by longpressing on your desired
          starting point on the map.
        </Text>
        <Text style={GlobalStyles.ul}>
          {'\u2B24'} Info about can be accessed by pressing the pins on the map.
        </Text>
      </View>
      <View style={GlobalStyles.collumnView}>
        <Text>
          <Image
            style={GlobalStyles.pin}
            source={require('../assets/BluePinSmall.png')}
          />
          Blue Pin
        </Text>
        <Text>
          <Image
            style={GlobalStyles.pin}
            source={require('../assets/RedPinSmall.png')}
          />
          Red Pin
        </Text>
        <Text>
          <Image
            style={GlobalStyles.pin}
            source={require('../assets/YellowPinSmall.png')}
          />
          Yellow Pin
        </Text>
        <Text>
          <Image
            style={GlobalStyles.pin}
            source={require('../assets/WhitePinSmall.png')}
          />
          White Pin
        </Text>
      </View>
    </View>
  );
};

export default InfoScreen;
