// Importing modules and components
import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import firebase from 'firebase';
import { auth, db } from '../firebase';
import { GlobalStyles, BrandColors } from '../styles/GlobalStyles';

// This is testscreen, currently used to showcase how the app function with different groups/organisations
// For future iterations, users will automaticly grouped by their email address (which should be for the company/organisation)
const TestScreen = () => {
  const [groups, setGroups] = useState();

  if (!firebase.auth().currentUser) {
    return (
      <View style={GlobalStyles.container}>
        <Text>
          HEY! You should not have access to this site as you are not logged in
        </Text>
      </View>
    );
  }

  useEffect(() => {
    if (!groups) {
      db.ref('groups')
        .get()
        .then((snapshot) => {
          if (snapshot.exists()) {
            setGroups(snapshot.val());
          } else {
            console.log('No data available');
          }
        })
        .catch((error) => {
          console.error(error);
        });
    }
  }, []);

  //Updates the group which is pressed.
  const handleSelectGroup = (id) => {
    const group = Object.entries(groups).find(
      (group) => group[0] === id /*id*/
    );
    let userId = auth.currentUser.uid;
    db.ref('userData/' + userId).update({ group: group[0] });
  };

  if (!groups) {
    return <Text>Loading...</Text>;
  }

  const groupArray = Object.values(groups);
  const groupKeys = Object.keys(groups);

  // If a user is logged in they will se this screen with their email
  return (
    <View style={GlobalStyles.container}>
      <Text style={GlobalStyles.header}>Test screen</Text>
      <Text style={{ color: BrandColors.Primary, margin: 5 }}>
        This is a test screen, and you are logged in as:{' '}
        {firebase.auth().currentUser.email}
      </Text>
      <Text style={{ margin: 5 }}>
        This page illustrates how the app divides users into groups. Press one
        of the groups below, go to the map screen and press reload map, to see rides for
        this group.
      </Text>
      <FlatList
        data={groupArray}
        // We use groupKeys to find by ID
        keyExtractor={(item, index) => groupKeys[index]}
        renderItem={({ item, index }) => {
          return (
            <TouchableOpacity
              style={GlobalStyles.container}
              onPress={() => handleSelectGroup(groupKeys[index])}
            >
              <Text style={{ color: BrandColors.Grey }}>
                {item.organisation}
              </Text>
            </TouchableOpacity>
          );
        }}
      />
    </View>
  );
};

export default TestScreen;
