import appleAuth from '@invertase/react-native-apple-authentication';
import firestore, { doc, setDoc, getDoc, serverTimestamp } from '@react-native-firebase/firestore';

// Define las credenciales para entrar (simulación)
const VALID_EMAIL = 'a';
const VALID_PASSWORD = 'pa';

/**
 * Función auxiliar para guardar o actualizar el perfil del usuario en Firestore.
 * Utiliza el email o el ID de usuario como el ID del documento para evitar duplicados.
 * @param {object} user - El objeto de usuario simulado.
 */
const saveUserProfile = async (user) => {
  try {
    const db = firestore();
    const userRef = doc(db, 'users', user.uid);
    const docSnap = await getDoc(userRef);

    let dataToSet = {
      id: user.uid,
      createdAt: serverTimestamp(),
    };

    // Solo se guardan los datos si existen para evitar sobrescribir con valores nulos
    // Esto es crucial para los inicios de sesión recurrentes con Apple
    if (user.email) {
      dataToSet.email = user.email;
    }
    if (user.firstName) {
      dataToSet.firstName = user.firstName;
    }
    if (user.lastName) {
      dataToSet.lastName = user.lastName;
    }

    await setDoc(userRef, dataToSet, { merge: true });
    console.log('Perfil del usuario guardado en Firestore:', user.uid);
  } catch (error) {
    console.error('Error al guardar el perfil en Firestore:', error);
    throw error;
  }
};

export const loginWithApple = async () => {
  try {
    const appleAuthRequestResponse = await appleAuth.performRequest({
      requestedOperation: appleAuth.Operation.LOGIN,
      requestedScopes: [appleAuth.Scope.EMAIL, appleAuth.Scope.FULL_NAME],
    });

    const { identityToken, user, fullName, email } = appleAuthRequestResponse;
    const firstName = fullName?.givenName ?? '';
    const lastName = fullName?.familyName ?? '';

    if (identityToken) {
      const simulatedUser = {
        uid: user, // El ID de Apple se usa como el ID del documento
        email,
        firstName,
        lastName,
      };

      await saveUserProfile(simulatedUser);
      return { user: simulatedUser };

    } else {
      throw new Error('No se recibio un token de identidad.');
    }
  } catch (error) {
    if (error.code === appleAuth.Error.CANCELED) {
      throw new Error('La autenticacion de Apple fue cancelada.');
    } else {
      throw new Error('Error al iniciar sesion con Apple.');
    }
  }
};

// Esta función simula un inicio de sesión con email y contraseña
export const loginUser = (credentials) => {
  return new Promise(async (resolve, reject) => {
    setTimeout(async () => {
      if (credentials.email === VALID_EMAIL && credentials.password === VALID_PASSWORD) {
        const simulatedUser = {
          uid: credentials.email, // El email se usa como el ID del documento
          email: credentials.email,
          firstName: 'Nombre de prueba',
          lastName: 'Apellido de prueba',
        };

        try {
          await saveUserProfile(simulatedUser);
          resolve({ user: simulatedUser });
        } catch (error) {
          reject(new Error('Credenciales correctas, pero hubo un error al guardar el usuario.'));
        }
      } else {
        reject(new Error('Credenciales incorrectas.'));
      }
    }, 1000);
  });
};
