import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Ionicons';
import { colors } from '../context/theme';

// ---------- Pantallas de las pestañas ----------
import { AppointmentScreen } from '/Users/christianjairrodriguezhernadez/Documents/ReactNative/CitaMaster/src/features/business-profile/screens/AppointmentScreen.js';
import { WorkersScreen } from '/Users/christianjairrodriguezhernadez/Documents/ReactNative/CitaMaster/src/features/business-profile/screens/WorkersScreen.js';
import { ServiceScreen } from '/Users/christianjairrodriguezhernadez/Documents/ReactNative/CitaMaster/src/features/business-profile/screens/ServiceScreen.js';


const Tab = createBottomTabNavigator();

export default function BottomTabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarStyle: { display: 'flex' },
        tabBarIcon: ({ color, size }) => {
          let iconName;   
          if (route.name === 'Citas') {
            iconName = 'calendar';
          } else if (route.name === 'Empleados') {
            iconName = 'people';
          } else if (route.name === 'Servicios') {
            iconName = 'construct';
          }
          return <Icon name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: 'gray',
      })}
    >
      <Tab.Screen name="Citas" component={AppointmentScreen} />
      <Tab.Screen name="Empleados" component={WorkersScreen} />
      <Tab.Screen name="Servicios" component={ServiceScreen} />
    </Tab.Navigator>
  );
}
