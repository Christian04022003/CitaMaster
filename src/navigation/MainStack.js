import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import TypeUserScreen from '../features/auth/screens/TypeUserScreen';
import { BusinessInfoScreen } from '../features/business-profile/screens/BusinessInfoScreen';
import { ServiceScreen } from '../features/business-profile/screens/ServiceScreen';
import {AddServiceScreen} from '../features/business-profile/screens/AddServiceScreen'
import { WorkersScreen } from '../features/business-profile/screens/WorkersScreen';
import { AddWorkerScreen} from '../features/business-profile/screens/AddWorkerScreen'
import { AppointmentScreen } from '../features/business-profile/screens/AppointmentScreen';

const Stack = createNativeStackNavigator();

const MainStack = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="TypeUser" component={TypeUserScreen} />
      <Stack.Screen name="BusinessInfo" component={BusinessInfoScreen} />
      <Stack.Screen name="Services" component={ServiceScreen} />
      <Stack.Screen name="AddService" component={AddServiceScreen} />
      <Stack.Screen name="Workers" component={WorkersScreen}></Stack.Screen>
      <Stack.Screen name="AddWorker" component={AddWorkerScreen}></Stack.Screen>
      <Stack.Screen name={"Appointment"} component={AppointmentScreen}></Stack.Screen>

    </Stack.Navigator>
  );
};

export default MainStack;
