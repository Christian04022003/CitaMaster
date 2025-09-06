import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView } from "react-native";

import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Ionicons';
import { Button } from "../../../components/Button";
import { colors } from "../../../context/theme";
import { useNavigation } from '@react-navigation/native';
import { useSelector } from 'react-redux';
import firestore, { addDoc, serverTimestamp } from '@react-native-firebase/firestore';






// ---------- Pantallas ----------
export const AppointmentScreen = () => {
  const navigation = useNavigation();
  const user = useSelector(state => state.auth.user);
  const [isLoading, setIsLoading] = useState(false);
  const [workers, setWorkers] = useState([]);




  const handleAddAppointment = () => {
    navigation.navigate('AddAppointment')
  }

  useEffect(() => {
    if (!user || !user.uid) {
      setIsLoading(false);
      return;
    }

    const servicesRef = firestore().collection('businesses').doc(user.uid).collection('workers');

    const unsubscribe = servicesRef.onSnapshot(querySnapshot => {
      const fetchedWorkers = [];
      querySnapshot.forEach(doc => {
        fetchedWorkers.push({
          id: doc.id,
          ...doc.data()
        });
      });
      setWorkers(fetchedWorkers);
      setIsLoading(false);
    }, error => {
      console.error("Error al obtener servicios:", error);
      Alert.alert('Error', 'Hubo un problema al cargar los servicios.');
      setIsLoading(false);
    });

    // Retorna una función de limpieza para desuscribirse del listener
    return () => unsubscribe();
  }, [user]);

    useEffect(() => {
    if (!user || !user.uid) {
      setIsLoading(false);
      return;
    }

    const servicesRef = firestore().collection('businesses').doc(user.uid).collection('services');

    const unsubscribe = servicesRef.onSnapshot(querySnapshot => {
      const fetchedServices = [];
      querySnapshot.forEach(doc => {
        fetchedServices.push({
          id: doc.id,
          ...doc.data()
        });
      });
      setServices(fetchedServices);
      setIsLoading(false);
    }, error => {
      console.error("Error al obtener servicios:", error);
      Alert.alert('Error', 'Hubo un problema al cargar los servicios.');
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, [user]);

  return (
    <SafeAreaView style={style.container} edges={['top']}>
      <Text style={style.textTitle}>Citas</Text>

      <Button style={style.Button}
        onPress={handleAddAppointment}
      >
        <Text style={style.buttonText}>Agregar Cita</Text>
      </Button>

      <ScrollView style={style.card}>
        {workers.length > 0 ? (
          workers.map((worker) => (
            <View key={worker.id} style={style.AppointmentItem}>

              <Text style={style.AppointmentText}>Hora de inicio: </Text>
              <Text style={style.AppointmentText}>Trabajador: {worker.workerName}</Text>
              <Text style={style.AppointmentText}>Servicio:  </Text>
              <Text style={style.AppointmentText}>Tipo: </Text>

            </View>
          ))

        ) : (<Text style={style.noServicesText}>Aún no has agregado ningún servicio.</Text>
        )}


      </ScrollView>



    </SafeAreaView>
  );
};


// ---------- Bottom Tabs ----------
const Tab = createBottomTabNavigator();

function MyTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false, // oculta el header superior
        tabBarStyle: { display: 'flex' }, // asegura que la barra siempre aparezca
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



// ---------- Styles ----------
const style = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    paddingHorizontal: 20,
    backgroundColor: colors.background,
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
  },
  AppointmentItem: {
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    backgroundColor: colors.input,
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
  },
  AppointmentText: {
    color: colors.textOnInput,
    fontWeight: 'bold',


  },
});
