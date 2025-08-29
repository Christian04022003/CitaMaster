// src/components/Button.js
import React from 'react';
import { TouchableOpacity, StyleSheet, View } from 'react-native';
import { colors } from '../context/theme';

export const Button = ({ onPress, disabled, children }) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled}
      style={[styles.button, disabled && styles.disabledButton]}
    >
      <View style={styles.buttonContent}>
        {children}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    width: '100%',
    marginTop: 10,
    backgroundColor: colors.button
  },
  disabledButton: {
    backgroundColor: 'black',
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
});