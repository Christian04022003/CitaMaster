// src/navigation/MainStack.js

import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import TypeUserScreen from '../features/auth/screens/TypeUserScreen';
import { BusinessInfoScreen } from '../features/business-profile/screens/BusinessInfoScreen';
import { ServiceScreen } from '../features/business-profile/screens/ServiceScreen';
import {AddServiceScreen} from '../features/business-profile/screens/AddServiceScreen'
const Stack = createNativeStackNavigator();

const MainStack = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="TypeUser" component={TypeUserScreen} />
      <Stack.Screen name="BusinessInfo" component={BusinessInfoScreen} />
      <Stack.Screen name="Services" component={ServiceScreen} />
      <Stack.Screen name="AddService" component={AddServiceScreen} />

      
    </Stack.Navigator>
  );
};

export default MainStack;