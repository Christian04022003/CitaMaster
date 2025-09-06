import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, ScrollView, ActivityIndicator } from "react-native"
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from "@react-navigation/native";
import { colors } from "../../../context/theme";
import { Input } from "../../../components/Input"
import { Button } from "../../../components/Button"
import { Formik } from 'formik';
import * as Yup from 'yup';
import firestore from '@react-native-firebase/firestore';
import { useSelector } from 'react-redux';


// Esquema de validación con Yup
const validationSchema = Yup.object().shape({
    startTime: Yup.string().required('La hora de inicio es obligatoria'),
    worker: Yup.string().required('El trabajador es obligatorio'),
    serviceName: Yup.string().required('El nombre del servicio es obligatorio'),
    serviceType: Yup.string().required('El tipo de servicio es obligatorio'),
});

export const AddAppointmentScreen = () => {
    const insets = useSafeAreaInsets();
    const navigation = useNavigation();

    // Estado para los datos de Firestore
    const [workers, setWorkers] = useState([]);
    const [services, setServices] = useState([]);
    const [isLoadingData, setIsLoadingData] = useState(true);

    // Estado para controlar la visibilidad de los modales
    const [isWorkerModalVisible, setIsWorkerModalVisible] = useState(false);
    const [isServiceModalVisible, setIsServiceModalVisible] = useState(false);

    // Obtiene el usuario de Redux para filtrar los datos
    const user = useSelector(state => state.auth.user);
    console.log(user)

    useEffect(() => {
        if (!user) {
            console.error("No se encontró usuario autenticado.");
            setIsLoadingData(false);
            return;
        }

        const fetchWorkersAndServices = async () => {
            try {
                // Suscripción a la colección de trabajadores
                const workersUnsubscribe = firestore()
                    .collection('workers')
                    .where('userId', '==', user.uid)
                    .onSnapshot(querySnapshot => {
                        const workersList = querySnapshot.docs.map(doc => ({
                            id: doc.id,
                            ...doc.data(),
                        }));
                        setWorkers(workersList);
                    }, error => {
                        console.error("Error al suscribirse a los trabajadores:", error);
                    });

                // Suscripción a la colección de servicios
                const servicesUnsubscribe = firestore()
                    .collection('services')
                    .where('userId', '==', user.uid)
                    .onSnapshot(querySnapshot => {
                        const servicesList = querySnapshot.docs.map(doc => ({
                            id: doc.id,
                            ...doc.data(),
                        }));
                        setServices(servicesList);
                    }, error => {
                        console.error("Error al suscribirse a los servicios:", error);
                    });
                
                setIsLoadingData(false);
                
                // Función de limpieza para desuscribirse cuando el componente se desmonte
                return () => {
                    workersUnsubscribe();
                    servicesUnsubscribe();
                };

            } catch (error) {
                console.error("Error fetching data:", error);
                setIsLoadingData(false);
            }
        };

        fetchWorkersAndServices();
    }, [user]);

    // Valores iniciales del formulario
    const initialValues = {
        startTime: '',
        worker: '',
        serviceName: '',
        serviceType: '',
    };

    const handleAddAppointment = (values) => {
        // Aquí iría la lógica para agregar la cita, por ejemplo, guardarla en una base de datos.
        console.log('Cita agregada:', values);
        navigation.navigate('Appointment');
    };

    if (isLoadingData) {
        return (
            <View style={[style.loadingContainer, { paddingTop: insets.top, paddingBottom: insets.bottom }]}>
                <ActivityIndicator size="large" color={colors.primary} />
                <Text style={style.loadingText}>Cargando datos...</Text>
            </View>
        );
    }

    return (
        <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={handleAddAppointment}
        >
            {({ handleChange, handleBlur, handleSubmit, setFieldValue, values, errors, touched }) => (
                <View style={[style.container, { paddingTop: insets.top, paddingBottom: insets.bottom }]}>
                    <Text style={style.text}>Hora de Inicio: </Text>
                    <Input
                        onChangeText={handleChange('startTime')}
                        onBlur={handleBlur('startTime')}
                        value={values.startTime}
                        placeholder="ej. 10:00 AM"
                    />
                    {errors.startTime && touched.startTime && (
                        <Text style={style.errorText}>{errors.startTime}</Text>
                    )}

                    <Text style={style.text}>Trabajador: </Text>
                    <TouchableOpacity
                        style={style.pickerInput}
                        onPress={() => setIsWorkerModalVisible(true)}
                    >
                        <Text style={style.pickerText}>
                            {values.worker || "Selecciona un trabajador"}
                        </Text>
                    </TouchableOpacity>
                    {errors.worker && touched.worker && (
                        <Text style={style.errorText}>{errors.worker}</Text>
                    )}

                    <Text style={style.text}>Nombre del servicio: </Text>
                    <TouchableOpacity
                        style={style.pickerInput}
                        onPress={() => setIsServiceModalVisible(true)}
                    >
                        <Text style={style.pickerText}>
                            {values.serviceName || "Selecciona un servicio"}
                        </Text>
                    </TouchableOpacity>
                    {errors.serviceName && touched.serviceName && (
                        <Text style={style.errorText}>{errors.serviceName}</Text>
                    )}

                    <Text style={style.text}>Tipo de servicio: </Text>
                    <Input
                        onChangeText={handleChange('serviceType')}
                        onBlur={handleBlur('serviceType')}
                        value={values.serviceType}
                        placeholder="ej. Peluquería"
                    />
                    {errors.serviceType && touched.serviceType && (
                        <Text style={style.errorText}>{errors.serviceType}</Text>
                    )}

                    <Button onPress={handleSubmit}>
                        <Text style={style.buttonText}>Agregar</Text>
                    </Button>

                    {/* Modal para seleccionar trabajador */}
                    <Modal
                        animationType="slide"
                        transparent={true}
                        visible={isWorkerModalVisible}
                        onRequestClose={() => setIsWorkerModalVisible(false)}
                    >
                        <View style={style.modalContainer}>
                            <View style={style.modalContent}>
                                <Text style={style.modalTitle}>Selecciona un Trabajador</Text>
                                <ScrollView>
                                    {workers.map((worker) => (
                                        <TouchableOpacity
                                            key={worker.id}
                                            style={style.modalOption}
                                            onPress={() => {
                                                setFieldValue('worker', worker.name);
                                                setIsWorkerModalVisible(false);
                                            }}
                                        >
                                            <Text style={style.modalOptionText}>{worker.name}</Text>
                                        </TouchableOpacity>
                                    ))}
                                </ScrollView>
                                <Button onPress={() => setIsWorkerModalVisible(false)}>
                                    <Text style={style.buttonText}>Cerrar</Text>
                                </Button>
                            </View>
                        </View>
                    </Modal>

                    {/* Modal para seleccionar servicio */}
                    <Modal
                        animationType="slide"
                        transparent={true}
                        visible={isServiceModalVisible}
                        onRequestClose={() => setIsServiceModalVisible(false)}
                    >
                        <View style={style.modalContainer}>
                            <View style={style.modalContent}>
                                <Text style={style.modalTitle}>Selecciona un Servicio</Text>
                                <ScrollView>
                                    {services.map((service) => (
                                        <TouchableOpacity
                                            key={service.id}
                                            style={style.modalOption}
                                            onPress={() => {
                                                setFieldValue('serviceName', service.serviceName);
                                                setFieldValue('serviceType', service.serviceType); // Actualiza el tipo de servicio también
                                                setIsServiceModalVisible(false);
                                            }}
                                        >
                                            <Text style={style.modalOptionText}>{service.serviceName} ({service.serviceType})</Text>
                                        </TouchableOpacity>
                                    ))}
                                </ScrollView>
                                <Button onPress={() => setIsServiceModalVisible(false)}>
                                    <Text style={style.buttonText}>Cerrar</Text>
                                </Button>
                            </View>
                        </View>
                    </Modal>

                </View>
            )}
        </Formik>
    )

}

const style = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'flex-start',
        paddingHorizontal: 20,
        backgroundColor: colors.background,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: colors.background,
    },
    loadingText: {
        marginTop: 10,
        color: colors.textOnBackground,
        fontSize: 16,
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
    buttonText: {
        textAlign: 'center',
        color: 'white',
        fontWeight: 'bold',
    },
    errorText: {
        color: 'red',
        fontSize: 12,
        marginBottom: 5,
        width: '100%',
        textAlign: 'left',
    },
    pickerInput: {
        width: '100%',
        height: 50,
        borderColor: colors.border,
        borderWidth: 1,
        borderRadius: 5,
        justifyContent: 'center',
        paddingHorizontal: 15,
        backgroundColor: colors.input,
        marginBottom: 10,
    },
    pickerText: {
        color: colors.textOnInput,
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.5)',
    },
    modalContent: {
        backgroundColor: 'white',
        padding: 20,
        borderRadius: 10,
        width: '80%',
        maxHeight: '70%',
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 15,
        textAlign: 'center',
        color: 'black',
    },
    modalOption: {
        paddingVertical: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    modalOptionText: {
        fontSize: 16,
        color: 'black',
    },
});
