import appleAuth from '@invertase/react-native-apple-authentication';
import firestore, { doc, setDoc, serverTimestamp } from '@react-native-firebase/firestore';

// Define las credenciales para entrar
const VALID_EMAIL = 'a';
const VALID_PASSWORD = 'pa';

/**
 * Función auxiliar para guardar el perfil del usuario en Firestore.
 * Utiliza el email o el ID de usuario como el ID del documento para evitar duplicados.
 * @param {object} user - El objeto de usuario simulado.
 */
const saveUserProfile = async (user) => {
  try {
    const db = firestore();
    const userRef = doc(db, 'users', user.uid);
    
    // Objeto para los datos que se guardarán, siempre incluyendo el ID
    const userDataToSave = {
      id: user.uid,
      createdAt: serverTimestamp(),
    };

    // Solo agrega el email si no está vacío
    if (user.email) {
      userDataToSave.email = user.email;
    }
    
    // Solo agrega el nombre y apellido si no están vacíos
    if (user.firstName) {
      userDataToSave.firstName = user.firstName;
    }
    if (user.lastName) {
      userDataToSave.lastName = user.lastName;
    }

    await setDoc(userRef, userDataToSave, { merge: true }); 
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
    const userEmail = email ?? ''; 

    if (identityToken) {
      const simulatedUser = {
        uid: user, // Usa el UID de Apple como el identificador principal
        email: userEmail,
        firstName,
        lastName,
      };
      
      await saveUserProfile(simulatedUser);
      return { user: simulatedUser };

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
  return new Promise(async (resolve, reject) => {
    // Simula un retraso de la red de 1 segundo
    setTimeout(async () => {
      if (credentials.email === VALID_EMAIL && credentials.password === VALID_PASSWORD) {
        // Devuelve un objeto de usuario si las credenciales son correctas
        const simulatedUser = {
          uid: credentials.email, // Usa el email como el ID único
          email: credentials.email, // Ahora se usa el email real de las credenciales
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
        // Rechaza la promesa con un error si las credenciales son incorrectas
        reject(new Error('Credenciales incorrectas.'));
      }
    }, 1000); // Agrega un retraso para simular la red
  });
};
