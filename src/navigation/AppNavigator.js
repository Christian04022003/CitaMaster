// src/navigation/AppNavigator.js

import React from 'react';
import { useSelector } from 'react-redux';
import AuthStack from './AuthStack';
// Importa el nuevo MainStack
import MainStack from './MainStack';

const AppNavigator = () => {
  const { isAuthenticated } = useSelector((state) => state.auth);
  
  // Si el usuario está autenticado, muestra el MainStack que contiene todas las pantallas post-login.
  // De lo contrario, muestra el AuthStack.
  return isAuthenticated ? <MainStack /> : <AuthStack />;
};

export default AppNavigator;