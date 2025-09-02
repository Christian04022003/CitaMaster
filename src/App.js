import React from 'react';
import { StatusBar, useColorScheme } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { Provider } from 'react-redux';
import { store } from './store';
import AppNavigator from './navigation/AppNavigator';
import { ThemeProvider } from './context/ThemeContext';

function App() {
  const isDarkMode = useColorScheme() === 'dark';

  return (
    // Envuelve toda la aplicación con el proveedor de Redux para que los componentes puedan acceder al estado global.
    <Provider store={store}>
      {/* Envuelve la aplicación con el proveedor de tema para manejar los estilos. */}
      <ThemeProvider>
        {/* Proporciona las áreas seguras de la interfaz de usuario para diferentes dispositivos. */}
        <SafeAreaProvider>
          {/* Contenedor principal de navegación que gestiona las rutas. */}
          <NavigationContainer>
            {/* El componente principal que decide qué pantalla mostrar. */}
            <AppNavigator />
          </NavigationContainer>
          <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
        </SafeAreaProvider>
      </ThemeProvider>
    </Provider>
  );
}

export default App;
