// src/features/auth/screens/LoginScreen.js
import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
// Importa también la acción loginApple
import { login, loginApple } from '../store/authSlice';
import { Input } from '../../../components/Input';
import { Button } from '../../../components/Button';
import { SocialLoginButton } from '../components/SocialLoginButton';
import { useTheme } from '../../../context/ThemeContext';
import { colors } from '../../../context/theme'; // Esta importación es innecesaria

const LoginScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const dispatch = useDispatch();
  const { isLoading, error } = useSelector((state) => state.auth);

  // La forma correcta de acceder a los colores es desde el hook
  const { colors } = useTheme();

  const handleLogin = () => {
    dispatch(login({ email, password }));
  };

  return (
    // Usa los estilos dinámicos del tema en la vista principal
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Text style={[styles.title, { color: colors.textOnBackground }]}>Iniciar Sesión</Text>
      
      <Input
        placeholder="Correo Electrónico"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
        placeholderTextColor={colors.textSecondary}
      />
      <Input
        placeholder="Contraseña"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        placeholderTextColor={colors.textSecondary}
      />
      {error && <Text style={styles.errorText}>{error}</Text>}

      <Button
        onPress={handleLogin}
        disabled={isLoading}
        // Aplica el color del botón desde el tema
        style={[styles.loginButton, { backgroundColor: colors.primary }]}
      >
        <Text style={[styles.loginButtonText, { color: colors.buttonText }]}>{isLoading ? 'Cargando...' : 'Entrar'}</Text>
      </Button>

      <SocialLoginButton
        company="google"
        title="Entrar con Google"
        onPress={() => console.log('Login con Google')}
      />

      <SocialLoginButton
        company="apple"
        title="Entrar con Apple"
        // Llama a la acción de loginApple que importaste
        onPress={() => dispatch(loginApple())}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  errorText: {
    color: 'red',
    marginBottom: 10,
  },
  loginButton: {
    // Estilos base del botón, el color se define de forma dinámica
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    width: '100%',
    marginTop: 10,
  },
  loginButtonText: {
    fontWeight: 'bold',
  },
});

export default LoginScreen;