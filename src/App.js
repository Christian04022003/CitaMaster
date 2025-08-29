// src/App.js

import React from 'react';
import { StatusBar, useColorScheme } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { Provider } from 'react-redux';
import { store } from './store';
import AppNavigator from './navigation/AppNavigator';

// 1. Importa el ThemeProvider desde tu archivo de contexto
import { ThemeProvider } from './context/ThemeContext';

function App() {
  const isDarkMode = useColorScheme() === 'dark';

  return (
    // 2. Envuelve toda la aplicación con el ThemeProvider
    <Provider store={store}>
      <ThemeProvider>
        <SafeAreaProvider>
          <NavigationContainer>
            <AppNavigator />
          </NavigationContainer>
          <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
        </SafeAreaProvider>
      </ThemeProvider>
    </Provider>
  );
}

export default App;