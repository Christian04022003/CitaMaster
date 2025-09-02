import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, Alert } from "react-native";
import { Formik } from 'formik';
import * as Yup from 'yup';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { Button } from "../../../components/Button";
import { Input } from "../../../components/Input";
import { colors } from "../../../context/theme";
import firestore, { addDoc, serverTimestamp } from '@react-native-firebase/firestore';
import { useSelector } from 'react-redux';


// Esquema de validación con Yup
const validationSchema = Yup.object().shape({
    serviceName: Yup.string()
        .required('El nombre del servicio es obligatorio'),
    serviceDuration: Yup.number()
        .typeError('La duración debe ser un número')
        .required('La duración del servicio es obligatoria')
        .min(1, 'La duración mínima es de 1 minuto'),
    serviceType: Yup.string()
        .required('El tipo de servicio es obligatorio'),
});

export const AddServiceScreen = () => {
    const insets = useSafeAreaInsets();
    const navigation = useNavigation();
    const user = useSelector(state => state.auth.user);

    const [isLoading, setIsLoading] = useState(false);

    const initialValues = {
        serviceName: '',
        serviceDuration: '',
        serviceType: '',
    };

    const handleSaveService = async (values, { resetForm }) => {
        setIsLoading(true);

        if (!user || !user.uid) {
            Alert.alert('Error', 'No hay un usuario autenticado para guardar los servicios.');
            setIsLoading(false);
            return;
        }

        try {
            // Referencia a la subcolección 'services' dentro del documento del negocio
            const servicesRef = firestore().collection('businesses').doc(user.uid).collection('services');

            // Guarda el nuevo servicio en la subcolección
            await addDoc(servicesRef, {
                ...values,
                createdAt: serverTimestamp(),
            });

            Alert.alert('Éxito', 'Servicio agregado correctamente.');
            resetForm(); // Limpia el formulario para agregar otro servicio

        } catch (error) {
            console.error("Error al guardar el servicio en Firestore:", error);
            Alert.alert('Error', 'Hubo un problema al guardar el servicio. Intenta de nuevo.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleFinish = () => {
        navigation.navigate('Services');
    };

    return (
        <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={handleSaveService}
        >
            {({ handleChange, handleBlur, handleSubmit, values, errors, touched, resetForm }) => (
                <ScrollView contentContainerStyle={[style.container, { paddingTop: insets.top, paddingBottom: insets.bottom }]}>
                    <Text style={style.textTitle}>¿Qué servicios Ofreces?</Text>

                    <Text style={style.text}>Nombre del servicio</Text>
                    <Input
                        onChangeText={handleChange('serviceName')}
                        onBlur={handleBlur('serviceName')}
                        value={values.serviceName}
                        placeholder="Corte de cabello, afeitado, etc."
                    />
                    {errors.serviceName && touched.serviceName && (
                        <Text style={style.errorText}>{errors.serviceName}</Text>
                    )}

                    <Text style={style.text}>Tipo de servicio</Text>
                    <Input
                        onChangeText={handleChange('serviceType')}
                        onBlur={handleBlur('serviceType')}
                        value={values.serviceType}
                        placeholder="Cabello, uñas, barba, etc."
                    />
                    {errors.serviceType && touched.serviceType && (
                        <Text style={style.errorText}>{errors.serviceType}</Text>
                    )}

                    <Text style={style.text}>Duración del servicio (minutos)</Text>
                    <Input
                        onChangeText={handleChange('serviceDuration')}
                        onBlur={handleBlur('serviceDuration')}
                        value={values.serviceDuration}
                        placeholder="Ejemplo: 30"
                        keyboardType="numeric"
                    />
                    {errors.serviceDuration && touched.serviceDuration && (
                        <Text style={style.errorText}>{errors.serviceDuration}</Text>
                    )}

                    <Button onPress={handleSubmit} disabled={isLoading}>
                        {isLoading ? (
                            <ActivityIndicator color="white" />
                        ) : (
                            <Text style={style.buttonText}>Agregar Servicio</Text>
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
    }
});

export default AddServiceScreen;
