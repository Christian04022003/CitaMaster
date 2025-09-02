import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, Alert, TouchableOpacity } from "react-native";
import { colors } from "../../../context/theme";
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Button } from "../../../components/Button";
import { useNavigation } from '@react-navigation/native';
import firestore from '@react-native-firebase/firestore';
import { useSelector } from 'react-redux';


export const WorkersScreen = () => {
    const insets = useSafeAreaInsets();
    const navigation = useNavigation();
    const user = useSelector(state => state.auth.user);
    const [workers, setWorkers] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    // useEffect para obtener los empleados del usuario en tiempo real
    useEffect(() => {
        if (!user || !user.uid) {
            setIsLoading(false);
            return;
        }

        const workersRef = firestore().collection('businesses').doc(user.uid).collection('workers');

        const unsubscribe = workersRef.onSnapshot(querySnapshot => {
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
            console.error("Error al obtener empleados:", error);
            Alert.alert('Error', 'Hubo un problema al cargar los empleados.');
            setIsLoading(false);
        });

        // Retorna una función de limpieza para desuscribirse del listener
        return () => unsubscribe();
    }, [user]);


    const handleAddWorker = () => {
        navigation.navigate('AddWorker');
    };

    const handleAppointment = () =>{
        navigation.navigate("Appointment")
    }

    const handleDeleteWorker = async (workerId) => {
        try {
            if (!user || !user.uid) {
                Alert.alert('Error', 'No se puede eliminar el empleado. No hay usuario autenticado.');
                return;
            }
            const workerDocRef = firestore().collection('businesses').doc(user.uid).collection('workers').doc(workerId);
            await workerDocRef.delete();
            Alert.alert('Éxito', 'Empleado eliminado correctamente.');
        } catch (error) {
            console.error("Error al eliminar el empleado:", error);
            Alert.alert('Error', 'Hubo un problema al eliminar el empleado. Intenta de nuevo.');
        }
    };

    const handleEditWorker = (worker) => {
        // Navega a la pantalla de agregar empleado y pasa los datos del empleado para editarlo
        navigation.navigate('AddWorker', { workerData: worker });
    };

    return (
        <View style={[style.container, { paddingTop: insets.top, paddingBottom: insets.bottom }]}>
            <Text style={style.textTitle}>Lista de Empleados</Text>
 
            {isLoading ? (
                <ActivityIndicator size="large" color={colors.button} />
            ) : (
                <ScrollView style={style.card}>
                    {workers.length > 0 ? (
                        workers.map((worker) => (
                            <View key={worker.id} style={style.workerItem}>
                                <View style={style.workerInfo}>
                                    <Text style={style.workerText}>Nombre: {worker.workerName}</Text>
                                    <Text style={style.workerText}>Oficio: {worker.jobTitle}</Text>
                                    <Text style={style.workerText}>Servicios:</Text>
                                    <View style={style.tagsContainer}>
                                        {worker.offeredServices.map((service) => (
                                            <View key={service.id} style={style.tag}>
                                                <Text style={style.tagText}>{service.serviceName}</Text>
                                            </View>
                                        ))}
                                    </View>
                                </View>
                                <View style={style.buttonContainer}>
                                    <TouchableOpacity onPress={() => handleEditWorker(worker)} style={style.editButton}>
                                        <Text style={style.buttonTextSmall}>Editar</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity onPress={() => handleDeleteWorker(worker.id)} style={style.deleteButton}>
                                        <Text style={style.buttonTextSmall}>Eliminar</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        ))
                    ) : (
                        <Text style={style.noServicesText}>Aún no has agregado ningún empleado.</Text>
                    )}
                </ScrollView>
            )}

            <Button onPress={handleAddWorker} style={style.addButton}>
                <Text style={style.buttonText}>Agregar Empleado</Text>
            </Button>

            <Button onPress={handleAppointment}>
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
    workerItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        backgroundColor: colors.input,
        padding: 15,
        borderRadius: 8,
        marginBottom: 10,
    },
    workerInfo: {
        flex: 1,
    },
    workerText: {
        color: colors.textOnInput,
    },
    buttonContainer: {
        flexDirection: 'row',
        gap: 10,
    },
    deleteButton: {
        backgroundColor: 'red',
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 5,
    },
    deleteButtonText: {
        color: 'white',
        fontSize: 12,
    },
    editButton: {
        backgroundColor: 'darkblue',
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 5,
    },
    buttonTextSmall: {
        color: 'white',
        fontSize: 12,
    },
    noServicesText: {
        color: colors.textOnInput,
        textAlign: 'center',
        marginTop: 20,
    },
    addButton: {
        marginTop: 20,
    },
    tagsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginTop: 5,
        gap: 5,
    },
    tag: {
        backgroundColor: colors.primary,
        borderRadius: 15,
        paddingHorizontal: 10,
        paddingVertical: 5,
    },
    tagText: {
        color: 'white',
        fontSize: 12,
    },
});

export default WorkersScreen;
