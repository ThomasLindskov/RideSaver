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
import { GlobalStyles, Colors, BrandColors } from '../styles/GlobalStyles';

// TestScreen only used in testing
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

  const handleSelectGroup = (id) => {
    /*Her søger vi direkte i vores array af biler og finder bil objektet som matcher idet vi har tilsendt*/
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

  // If a user is logged in they wiil se this screen with their email
  return (
    <View style={GlobalStyles.container}>
      <Text style={GlobalStyles.header}>Test screen</Text>
      <Text style={{ color: BrandColors.Primary }}>
        This is the testScreen of: {firebase.auth().currentUser.email}
        Here you can change your groups
      </Text>
      <FlatList
        data={groupArray}
        // Vi bruger groupKeys til at finde ID
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
