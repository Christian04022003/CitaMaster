import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import TypeUserScreen from '../features/auth/screens/TypeUserScreen';
import { BusinessInfoScreen } from '../features/business-profile/screens/BusinessInfoScreen';
import { ServiceScreen } from '../features/business-profile/screens/ServiceScreen';
import { AddServiceScreen } from '../features/business-profile/screens/AddServiceScreen';
import { WorkersScreen } from '../features/business-profile/screens/WorkersScreen';
import { AddWorkerScreen } from '../features/business-profile/screens/AddWorkerScreen';
import BottomTabNavigator from '/Users/christianjairrodriguezhernadez/Documents/ReactNative/CitaMaster/src/navigation/BottomTabNavigator.js'; // /Users/christianjairrodriguezhernadez/Documents/ReactNative/CitaMaster/src/navigation/BottomTabNavigator.jsa el nuevo componente
import { AddAppointmentScreen} from '/Users/christianjairrodriguezhernadez/Documents/ReactNative/CitaMaster/src/features/business-profile/screens/AddAppointmentScreen.js'



const Stack = createNativeStackNavigator();

const MainStack = () => {
  return (
    <Stack.Navigator >
      <Stack.Screen name="TypeUser" component={TypeUserScreen} />
      <Stack.Screen name="BusinessInfo" component={BusinessInfoScreen} />
      <Stack.Screen name="Services" component={ServiceScreen} />
      <Stack.Screen name="AddService" component={AddServiceScreen} />
      <Stack.Screen name="Workers" component={WorkersScreen}></Stack.Screen>
      <Stack.Screen name="AddWorker" component={AddWorkerScreen}></Stack.Screen>
      <Stack.Screen name={"Appointment"} component={BottomTabNavigator} options={{ headerShown: false }}></Stack.Screen>
      <Stack.Screen name={"AddAppointment"} component={AddAppointmentScreen}></Stack.Screen>

    </Stack.Navigator>
  );
};

export default MainStack;
