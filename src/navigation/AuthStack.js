import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from '../features/auth/screens/LoginScreen';
import TypeUserScreen from '../features/auth/screens/TypeUserScreen';

const Stack = createNativeStackNavigator();

const AuthStack = () => (
  <Stack.Navigator>
    <Stack.Screen name="Login" component={LoginScreen}  />
    <Stack.Screen name="TypeUser" component={TypeUserScreen} />
  </Stack.Navigator>
);

export default AuthStack;
