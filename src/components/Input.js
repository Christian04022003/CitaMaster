import React from 'react';
import { TextInput, StyleSheet } from 'react-native';
import { colors } from '../context/theme';

export const Input = (props) => {
  return <TextInput {...props} style={styles.input}
  placeholderTextColor = {colors.placeholderInput}
   />;
};

const styles = StyleSheet.create({
  input: {
    height: 40,
    width: '100%',
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 10,
    backgroundColor: colors.input,
    color: colors.textOnInput,

  },
});