// src/features/auth/components/SocialLoginButton.js
import React from 'react';
import { StyleSheet, Image, Text, View } from 'react-native';
import { Button } from '../../../components/Button';
import { colors } from '../../../context/theme';

// Rutas de importación de imágenes corregidas
const appleLogo = require('../../../assets/images/apple-logo.png');
const googleLogo = require('../../../assets/images/google-logo.png');

const getLogoSource = (company) => {
  if (company === 'apple') {
    return appleLogo;
  }
  if (company === 'google') {
    return googleLogo;
  }
  return null;
};

export const SocialLoginButton = ({ company, onPress, title, disabled }) => {
  const logoSource = getLogoSource(company);

  return (
    <Button
      onPress={onPress}
      disabled={disabled}
      style={styles.socialButton}
    >
      <View style={styles.content}>
        {logoSource && <Image source={logoSource} style={styles.logo} />}
        <Text style={styles.buttonText}>{title}</Text>
      </View>
    </Button>
  );
};

const styles = StyleSheet.create({
  socialButton: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ccc',
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    width: 20,
    height: 20,
    marginRight: 10,
  },
  buttonText: {
    color: '#000',
    fontWeight: 'bold',
    color: colors.textOnInput,
  },
});