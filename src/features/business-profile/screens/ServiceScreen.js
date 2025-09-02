import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, Alert, TouchableOpacity } from "react-native";
import { colors } from "../../../context/theme";
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Button } from "../../../components/Button";
import { useNavigation } from '@react-navigation/native';
import firestore from '@react-native-firebase/firestore';
import { useSelector } from 'react-redux';


export const ServiceScreen = () => {
    const insets = useSafeAreaInsets();
    const navigation = useNavigation();
    const user = useSelector(state => state.auth.user);
    const [services, setServices] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    // useEffect para obtener los servicios del usuario en tiempo real
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

        // Retorna una función de limpieza para desuscribirse del listener
        return () => unsubscribe();
    }, [user]);


    const handleAddService = () => {
        navigation.navigate('AddService');
    };

    const handleWorker = () =>{
        navigation.navigate('Workers')
    }

    const handleDeleteService = async (serviceId) => {
        try {
            if (!user || !user.uid) {
                Alert.alert('Error', 'No se puede eliminar el servicio. No hay usuario autenticado.');
                return;
            }
            const serviceDocRef = firestore().collection('businesses').doc(user.uid).collection('services').doc(serviceId);
            await serviceDocRef.delete();
            Alert.alert('Éxito', 'Servicio eliminado correctamente.');
        } catch (error) {
            console.error("Error al eliminar el servicio:", error);
            Alert.alert('Error', 'Hubo un problema al eliminar el servicio. Intenta de nuevo.');
        }
    };

    return (
        <View style={[style.container, { paddingTop: insets.top, paddingBottom: insets.bottom }]}>
            <Text style={style.textTitle}>Lista de Servicios</Text>

            {isLoading ? (
                <ActivityIndicator size="large" color={colors.button} />
            ) : (
                <ScrollView style={style.card}>
                    {services.length > 0 ? (
                        services.map((service) => (
                            <View key={service.id} style={style.serviceItem}>
                                <View>
                                    <Text style={style.serviceText}>Nombre: {service.serviceName}</Text>
                                    <Text style={style.serviceText}>Duración: {service.serviceDuration} min</Text>
                                    <Text style={style.serviceText}>Tipo: {service.serviceType}</Text>
                                </View>
                                <TouchableOpacity onPress={() => handleDeleteService(service.id)} style={style.deleteButton}>
                                    <Text style={style.deleteButtonText}>Eliminar</Text>
                                </TouchableOpacity>
                            </View>
                        ))
                    ) : (
                        <Text style={style.noServicesText}>Aún no has agregado ningún servicio.</Text>
                    )}
                </ScrollView>
            )}

            <Button onPress={handleAddService} style={style.addButton}>
                <Text style={style.buttonText}>Agregar Servicio</Text>
            </Button>

            <Button onPress={handleWorker}>
                <Text style={style.buttonText}>Listo</Text>
            </Button>
        </View>
    );
};


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
    errorText: {
        color: 'red',
        fontSize: 12,
        marginBottom: 5,
        width: '100%',
        textAlign: 'left',
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
    serviceItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: colors.input,
        padding: 15,
        borderRadius: 8,
        marginBottom: 10,
    },
    serviceText: {
        color: colors.textOnInput,
    },
    deleteButton: {
        backgroundColor: 'red',
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 5,
    },
    deleteButtonText: {
        color: 'white',
    },
    noServicesText: {
        color: colors.textOnInput,
        textAlign: 'center',
        marginTop: 20,
    },
    addButton: {
        marginTop: 20,
    }
});

export default ServiceScreen;
