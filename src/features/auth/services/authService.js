// src/features/auth/services/authService.js
import appleAuth from '@invertase/react-native-apple-authentication';

// Define las credenciales para entrar
const VALID_EMAIL = 'a';
const VALID_PASSWORD = 'pa';


export const loginWithApple = async () => {
  try {
    const appleAuthRequestResponse = await appleAuth.performRequest({
      requestedOperation: appleAuth.Operation.LOGIN,
      requestedScopes: [appleAuth.Scope.EMAIL, appleAuth.Scope.FULL_NAME],
    });

    // Lógica para verificar el usuario con tu backend si es necesario
    // Para este ejemplo, solo retornamos el usuario
    const { identityToken, authorizationCode, user } = appleAuthRequestResponse;

    if (identityToken) {
      // Retorna el ID de usuario de Apple
      return { user: { email: user, id: user } };
    } else {
      throw new Error('No se recibió un token de identidad.');
    }
  } catch (error) {
    if (error.code === appleAuth.Error.CANCELED) {
      throw new Error('La autenticación de Apple fue cancelada.');
    } else {
      throw new Error('Error al iniciar sesión con Apple.');
    }
  }
};
// Esta función simula una llamada a una API
export const loginUser = (credentials) => {
  return new Promise((resolve, reject) => {
    // Simula un retraso de la red de 1 segundo

      if (credentials.email === VALID_EMAIL && credentials.password === VALID_PASSWORD) {
        // Devuelve un objeto de usuario si las credenciales son correctas
        resolve({ user: { email: VALID_EMAIL } });
      } else {
        // Rechaza la promesa con un error si las credenciales son incorrectas
        reject(new Error('Credenciales incorrectas.'));
      }

  });
};