import React from 'react';
import { View, Text, StyleSheet, ScrollView } from "react-native";
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Ionicons';
import { Button } from "../../../components/Button"; 
import { colors } from "../../../context/theme";


// ---------- Pantallas ----------
export const AppointmentScreen = () => {
  const insets = useSafeAreaInsets();
  return (
    <View style={[style.container, { paddingTop: insets.top, paddingBottom: insets.bottom }]}>
      <Text style={style.textTitle}>Citas</Text>

      <Button style={style.Button}>
        <Text style={style.buttonText}>Agregar Cita</Text>
      </Button>

      <ScrollView style={style.card}>
        <Text style={style.text}>Aquí se mostrarán las citas</Text>
      </ScrollView>
    </View>
  );
};

export const EmployeeScreen = () => (
  <View style={style.container}>
    <Text style={style.textTitle}>Empleados</Text>
    <Text style={style.text}>Aquí se mostrarán los empleados</Text>
  </View>
);

export const ServiceScreen = () => (
  <View style={style.container}>
    <Text style={style.textTitle}>Servicios</Text>
    <Text style={style.text}>Aquí se mostrarán los servicios</Text>
  </View>
);

// ---------- Bottom Tabs ----------
const Tab = createBottomTabNavigator();

function MyTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false, // oculta el header superior
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
      <Tab.Screen name="Empleados" component={EmployeeScreen} />
      <Tab.Screen name="Servicios" component={ServiceScreen} />
    </Tab.Navigator>
  );
}

// ---------- App ----------
export default function App() {
  return (
    <NavigationContainer>
      <MyTabs />
    </NavigationContainer>
  );
}

// ---------- Styles ----------
const style = StyleSheet.create({
  container: {
    justifyContent: 'flex-start',
    paddingHorizontal: 20,
    backgroundColor: colors.background,
    flex: 1
  },
  textTitle: {
    textAlign: 'center',
    width: '100%',
    marginTop: 50,
    color: colors.textOnBackground,
    fontSize: 20,
    fontWeight: 'bold',
  },
  text: {
    textAlign: 'left',
    width: '100%',
    marginTop: 20,
    marginBottom: 10,
    color: colors.textOnBackground,
    fontSize: 16,
    fontWeight: 'bold',
  },
  card: {
    backgroundColor: colors.button,
    width: '100%',
    height: 400,
    borderRadius: 12,
    padding: 10,
    marginBottom: 10,
    marginTop: 20,
  },
  buttonText: {
    textAlign: 'center',
    color: 'white',
    fontWeight: 'bold',
  },
  Button: {
    marginTop: 20,
  }
});
