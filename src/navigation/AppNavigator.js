import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import AuthStack from './AuthStack';
import MainStack from './MainStack';
import { initializeAuth } from '../features/auth/store/authSlice';
import SplashScreen from '../components/SplashScreen';

const AppNavigator = () => {
  const dispatch = useDispatch();
  const { user, isLoading } = useSelector((state) => state.auth);

  useEffect(() => {
    // Inicializa la autenticación de Firebase al cargar la aplicación
    // Este thunk se encargará de manejar la persistencia de la sesión
    dispatch(initializeAuth());
  }, [dispatch]);

  // Si la aplicación aún está cargando el estado de autenticación,
  // muestra la pantalla de carga para evitar un "parpadeo" en la interfaz
  if (isLoading) {
    return <SplashScreen />;
  }

  // Una vez que la carga ha terminado, decide qué pila de navegación mostrar
  // Si hay un usuario, muestra la pila principal; de lo contrario, la pila de autenticación.
  return user ? <MainStack /> : <AuthStack />;
};

export default AppNavigator;
