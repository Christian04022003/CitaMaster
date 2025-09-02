import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, Alert, Pressable, Modal, TouchableOpacity } from "react-native";
import { Formik } from 'formik';
import * as Yup from 'yup';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Button } from "../../../components/Button";
import { Input } from "../../../components/Input";
import { colors } from "../../../context/theme";
import firestore, { addDoc, serverTimestamp, updateDoc, doc } from '@react-native-firebase/firestore';
import { useSelector } from 'react-redux';


// Esquema de validación con Yup
const validationSchema = Yup.object().shape({
    workerName: Yup.string()
        .required('El nombre del empleado es obligatorio'),
    jobTitle: Yup.string()
        .required('El oficio es obligatorio'),
    offeredServices: Yup.array()
        .min(1, 'Debe seleccionar al menos un servicio')
        .required('La selección de servicios es obligatoria'),
});

export const AddWorkerScreen = () => {
    const [isPickerVisible, setPickerVisible] = useState(false);
    const [services, setServices] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isServicesLoading, setIsServicesLoading] = useState(true);

    const insets = useSafeAreaInsets();
    const navigation = useNavigation();
    const route = useRoute();
    const { workerData } = route.params || {};
    const isEditing = !!workerData;

    const user = useSelector(state => state.auth.user);

    // Fetch services from Firestore
    useEffect(() => {
        if (!user || !user.uid) {
            setIsServicesLoading(false);
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
            setIsServicesLoading(false);
        }, error => {
            console.error("Error al obtener servicios:", error);
            Alert.alert('Error', 'Hubo un problema al cargar los servicios.');
            setIsServicesLoading(false);
        });

        return () => unsubscribe();
    }, [user]);

    const handleSaveWorker = async (values) => {
        setIsLoading(true);

        if (!user || !user.uid) {
            Alert.alert('Error', 'No hay un usuario autenticado para guardar los servicios.');
            setIsLoading(false);
            return;
        }

        try {
            const workerRef = firestore().collection('businesses').doc(user.uid).collection('workers');
            
            if (isEditing) {
                // Modo edición: actualiza el documento existente
                const workerDocRef = workerRef.doc(workerData.id);
                await updateDoc(workerDocRef, {
                    workerName: values.workerName,
                    jobTitle: values.jobTitle,
                    offeredServices: values.offeredServices,
                });
                Alert.alert('Éxito', 'Empleado actualizado correctamente.');
            } else {
                // Modo agregar: crea un nuevo documento
                await addDoc(workerRef, {
                    workerName: values.workerName,
                    jobTitle: values.jobTitle,
                    offeredServices: values.offeredServices,
                    createdAt: serverTimestamp(),
                });
                Alert.alert('Éxito', 'Empleado agregado correctamente.');
            }
            
            navigation.navigate('Workers');

        } catch (error) {
            console.error("Error al guardar el empleado en Firestore:", error);
            Alert.alert('Error', 'Hubo un problema al guardar el empleado. Intenta de nuevo.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleFinish = () => {
        navigation.navigate('Workers');
    };

    return (
        <Formik
            initialValues={{
                workerName: workerData?.workerName || '',
                jobTitle: workerData?.jobTitle || '',
                offeredServices: workerData?.offeredServices || [],
            }}
            validationSchema={validationSchema}
            onSubmit={handleSaveWorker}
        >
            {({ handleChange, handleBlur, handleSubmit, setFieldValue, values, errors, touched }) => (
                <ScrollView contentContainerStyle={[style.container, { paddingTop: insets.top, paddingBottom: insets.bottom }]}>
                    <Text style={style.textTitle}>
                        {isEditing ? 'Editar Empleado' : 'Información del Empleado'}
                    </Text>

                    <Text style={style.text}>Nombre del Empleado</Text>
                    <Input
                        onChangeText={handleChange('workerName')}
                        onBlur={handleBlur('workerName')}
                        value={values.workerName}
                        placeholder="Nombre del empleado"
                    />
                    {errors.workerName && touched.workerName && (
                        <Text style={style.errorText}>{errors.workerName}</Text>
                    )}

                    <Text style={style.text}>Servicios que ofrece</Text>
                    <Pressable
                        onPress={() => setPickerVisible(true)}
                        style={[style.pickerInput, { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }]}
                    >
                        <Text style={style.pickerText}>
                            {values.offeredServices.length > 0
                                ? values.offeredServices.map(s => s.serviceName).join(', ')
                                : 'Seleccionar servicios'}
                        </Text>
                    </Pressable>
                    {errors.offeredServices && touched.offeredServices && (
                        <Text style={style.errorText}>{errors.offeredServices}</Text>
                    )}

                    <Modal
                        transparent={true}
                        visible={isPickerVisible}
                        onRequestClose={() => setPickerVisible(false)}
                    >
                        <View style={style.modalContainer}>
                            <View style={style.modalContent}>
                                <Text style={style.modalTitle}>Seleccionar Servicios</Text>
                                {isServicesLoading ? (
                                    <ActivityIndicator size="small" color={colors.button} />
                                ) : services.length > 0 ? (
                                    <ScrollView style={style.serviceList}>
                                        {services.map((service) => (
                                            <TouchableOpacity
                                                key={service.id}
                                                style={[style.modalOption, values.offeredServices.some(s => s.id === service.id) && style.selectedOption]}
                                                onPress={() => {
                                                    const currentServices = values.offeredServices;
                                                    const isSelected = currentServices.some(s => s.id === service.id);

                                                    if (isSelected) {
                                                        const newServices = currentServices.filter(s => s.id !== service.id);
                                                        setFieldValue('offeredServices', newServices);
                                                    } else {
                                                        setFieldValue('offeredServices', [...currentServices, service]);
                                                    }
                                                }}
                                            >
                                                <Text style={style.modalOptionText}>{service.serviceName}</Text>
                                            </TouchableOpacity>
                                        ))}
                                    </ScrollView>
                                ) : (
                                    <Text style={style.noServicesText}>No has agregado servicios.</Text>
                                )}
                                <Button onPress={() => setPickerVisible(false)}>
                                    <Text style={style.buttonText}>Cerrar</Text>
                                </Button>
                            </View>
                        </View>
                    </Modal>

                    <Text style={style.text}>Oficio</Text>
                    <Input
                        onChangeText={handleChange('jobTitle')}
                        onBlur={handleBlur('jobTitle')}
                        value={values.jobTitle}
                        placeholder="Ejemplo: Barbero, Estilista"
                    />
                    {errors.jobTitle && touched.jobTitle && (
                        <Text style={style.errorText}>{errors.jobTitle}</Text>
                    )}

                    <Button onPress={handleSubmit} disabled={isLoading}>
                        {isLoading ? (
                            <ActivityIndicator color="white" />
                        ) : (
                            <Text style={style.buttonText}>
                                {isEditing ? 'Guardar Cambios' : 'Agregar Empleado'}
                            </Text>
                        )}
                    </Button>

                    <Button onPress={handleFinish} style={style.finishButton}>
                        <Text style={style.buttonText}>Finalizar</Text>
                    </Button>

                </ScrollView>
            )}
        </Formik>
    )
}

const style = StyleSheet.create({
    container: {
        justifyContent: 'flex-start',
        paddingHorizontal: 20,
        backgroundColor: colors.background,
        flexGrow: 1
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
    buttonText: {
        textAlign: 'center',
        color: 'white',
        fontWeight: 'bold',
    },
    finishButton: {
        marginTop: 20,
        backgroundColor: 'darkgreen',
    },
    pickerInput: {
        width: '100%',
        height: 50,
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 5,
        justifyContent: 'center',
        paddingHorizontal: 15,
        marginBottom: 10,
        backgroundColor: colors.input,
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
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 15,
        textAlign: 'center',
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
    selectedOption: {
        backgroundColor: '#e0e0e0',
    },
    serviceList: {
        maxHeight: 300,
        width: '100%',
    },
    noServicesText: {
        color: 'gray',
        textAlign: 'center',
        fontStyle: 'italic',
        marginBottom: 10,
    }
});

export default AddWorkerScreen;
