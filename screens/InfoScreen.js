// Importing modules and components
import React from 'react';
import { View, Text, Image, ScrollView } from 'react-native';
import { GlobalStyles, BrandColors } from '../styles/GlobalStyles';

const InfoScreen = () => {
  return (
    <ScrollView>
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
            {'\u2B24'} Info about can be accessed by pressing the pins on the
            map.
          </Text>
        </View>
        <View style={GlobalStyles.collumnView}>
          <View
            style={{ flexDirection: 'row', alignItems: 'center', margin: 5 }}
          >
            <Image
              style={GlobalStyles.pin}
              source={require('../assets/BluePin.png')}
            />
            <Text style={GlobalStyles.pinText}>
              The Blue Pin is shown for alle rides created by you. These can
              either be deleted or you can change time and date or available
              seats.
            </Text>
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Image
              style={GlobalStyles.pin}
              source={require('../assets/RedPin.png')}
            />
            <Text style={GlobalStyles.pinText}>
              The Red Pin is shown for all rides created by other users. These
              can be joined if they have avilable seats, otherwise they will not
              appear on the map (unless you joined the ride before full
              capacity)
            </Text>
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Image
              style={GlobalStyles.pin}
              source={require('../assets/YellowPin.png')}
            />
            <Text style={GlobalStyles.pinText}>
              The Yellow Pin is a temporary pin, which shows up, if a ride modal
              was activated (by longpressing) but not created (by pressing
              create ride)
            </Text>
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Image
              style={GlobalStyles.pin}
              source={require('../assets/GreenPin.png')}
            />
            <Text style={GlobalStyles.pinText}>
              The Green Pin is the location of the organisation/company/group
              which. These are currently manually added in the database for each
              new group
            </Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

export default InfoScreen;
