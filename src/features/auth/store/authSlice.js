import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { onAuthStateChanged, getAuth } from 'firebase/auth';
import { loginUser, loginWithApple } from '../services/authService';

// Estado inicial de la autenticación
const initialState = {
  user: null,
  isAuthenticated: false,
  isLoading: true, // Inicia en true para manejar la carga inicial de Firebase
  error: null,
};

// Thunk para manejar la inicialización de la autenticación de Firebase
export const initializeAuth = createAsyncThunk(
  'auth/initializeAuth',
  async (_, { dispatch }) => {
    const auth = getAuth(); // La instancia de Firebase se obtiene sin pasarle el "app"
    return new Promise((resolve, reject) => {
      onAuthStateChanged(auth, (user) => {
        if (user) {
          // El usuario está autenticado. Actualiza el estado de Redux.
          dispatch(authSlice.actions.setUser(user));
          resolve();
        } else {
          // No hay un usuario autenticado. Actualiza el estado.
          dispatch(authSlice.actions.setUser(null));
          resolve();
        }
      });
    });
  }
);

// Thunk para manejar el inicio de sesión con email y contraseña
export const login = createAsyncThunk(
  'auth/login',
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await loginUser(credentials);
      return response.user;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Thunk para manejar el inicio de sesión con Apple
export const loginApple = createAsyncThunk(
  'auth/loginApple',
  async (_, { rejectWithValue }) => {
    try {
      const response = await loginWithApple();
      return response.user;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    // Reductor para establecer el usuario
    setUser: (state, action) => {
      state.user = action.payload;
      state.isAuthenticated = !!action.payload;
      state.isLoading = false;
    },
    // Reductor para cerrar la sesión
    logout: (state) => {
      state.isAuthenticated = false;
      state.user = null;
      state.isLoading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Maneja la carga inicial del estado de Firebase
      .addCase(initializeAuth.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(initializeAuth.fulfilled, (state) => {
        state.isLoading = false;
      })
      .addCase(initializeAuth.rejected, (state) => {
        state.isLoading = false;
      })
      // Casos para el inicio de sesión con email y contraseña
      .addCase(login.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = true;
        state.user = action.payload;
      })
      .addCase(login.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Casos para el inicio de sesión con Apple
      .addCase(loginApple.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginApple.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = true;
        state.user = action.payload;
      })
      .addCase(loginApple.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export const { logout } = authSlice.actions;

export default authSlice.reducer;
