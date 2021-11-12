import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  SectionList,
  StatusBar,
  SafeAreaView,
} from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';

const Tags = () => {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState([]);
  const [items, setItems] = useState([
    { label: 'Technology', value: 1, disabled: true },
    { label: 'Computer', value: 'computer', parent: 1 },
    { label: 'Phone', value: 'phone', parent: 1 },
    { label: 'AI', value: 'ai', parent: 1 },

    { label: 'Food News', value: 2, disabled: true },
    { label: 'Kebab', value: 'kebab', parent: 2 },
    { label: 'Pizza', value: 'pizza', parent: 2 },
    { label: 'Burger', value: 'burger', parent: 2 },
    { label: 'Sushi', value: 'sushi', parent: 2 },
    { label: 'Fries', value: 'fries', parent: 2 },
    { label: 'Fruit', value: 'fruit', parent: 2 },

    { label: 'Politics', value: 3, disabled: true },
    { label: 'Denmark', value: 'denmark', parent: 3 },
    { label: 'UK', value: 'uk', parent: 3 },
    { label: 'Germany', value: 'germany', parent: 3 },
    { label: 'France', value: 'france', parent: 3 },
    { label: 'China', value: 'china', parent: 3 },
    { label: 'USA', value: 'usa', parent: 3 },

    { label: 'Economics', value: 4, disabled: true },
    { label: 'Housing market', value: 'housing market', parent: 4 },
    { label: 'Stock market', value: 'stock market', parent: 4 },
    { label: 'Car market', value: 'car market', parent: 4 },

    { label: 'Sports', value: 5 },
    { label: 'Football', value: 'football', parent: 5 },
    { label: 'American football', value: 'american football', parent: 5 },
    { label: 'Cycling', value: 'cycling', parent: 5 },
    { label: 'Motorsport', value: 'motorsport', parent: 5 },
    { label: 'Esport', value: 'esport', parent: 5 },
  ]);

  return (
    <DropDownPicker
      categorySelectable={true}
      open={open}
      value={value}
      items={items}
      multiple={true}
      min={0}
      max={15}
      setOpen={setOpen}
      setValue={setValue}
      setItems={setItems}
    />
  );
};

export default Tags;
