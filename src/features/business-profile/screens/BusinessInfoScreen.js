import React, { useState } from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, Pressable, ScrollView, ActivityIndicator, Alert } from "react-native";
import { Formik } from 'formik';
import * as Yup from 'yup';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Input } from "../../../components/Input";
import { Button } from "../../../components/Button";
import { colors } from "../../../context/theme";
import firestore, { collection, addDoc, serverTimestamp } from '@react-native-firebase/firestore';

// Esquema de validación con Yup
const validationSchema = Yup.object().shape({
    businessName: Yup.string()
        .required('El nombre del negocio es obligatorio'),
    businessType: Yup.string()
        .required('El tipo de negocio es obligatorio'),
    postalCode: Yup.string()
        .required('El código postal es obligatorio')
        .matches(/^[0-9]+$/, 'Solo se permiten números'),
    country: Yup.string()
        .required('El país es obligatorio'),
    state: Yup.string()
        .required('El estado es obligatorio'),
    city: Yup.string()
        .required('La ciudad es obligatoria'),
    street: Yup.string()
        .required('La calle es obligatoria'),
    outdoorNumber: Yup.string()
        .required('El número exterior es obligatorio'),
    indoorNumber: Yup.string(), // Este campo es opcional
});

const businessTypes = [
    { label: 'Barbería', value: 'barberia' },
    // Puedes agregar más tipos de negocio aquí
];

// Recibe 'navigation' como una prop del componente
export const BusinessInfoScreen = ({ navigation }) => {
    const [isPickerVisible, setPickerVisible] = useState(false);
    const [isLoading, setIsLoading] = useState(false); // Nuevo estado de carga
    const insets = useSafeAreaInsets(); // Obtiene los valores de padding

    const initialValues = {
        businessName: '',
        businessType: '',
        postalCode: '',
        country: '',
        state: '',
        city: '',
        street: '',
        outdoorNumber: '',
        indoorNumber: '',
    };
    
    // Función para manejar el envío del formulario
    const handleSubmit = async (values) => {
        setIsLoading(true);

        try {
            // Guardar los datos del formulario en Firestore en la colección 'businesses'
            const db = firestore();
            await addDoc(collection(db, 'businesses'), {
                ...values, // Esparce todos los valores del formulario
                createdAt: serverTimestamp(), // Marca de tiempo
            });

            // En lugar de solo registrar, navega a la siguiente pantalla
            Alert.alert('Éxito', 'Información del negocio guardada correctamente.');
            navigation.navigate('Services');
        } catch (error) {
            console.error("Error al guardar en Firestore:", error);
            Alert.alert('Error', 'Hubo un problema al guardar la información. Intenta de nuevo.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
        >
            {({ handleChange, handleBlur, handleSubmit, setFieldValue, values, errors, touched }) => (
                <ScrollView contentContainerStyle={[
                    style.container,
                    { paddingTop: insets.top, paddingBottom: insets.bottom }
                ]}>
                    <Text style={style.textTitle}>Hola</Text>

                    <Text style={style.text}>Nombre del negocio</Text>
                    <Input
                        onChangeText={handleChange('businessName')}
                        onBlur={handleBlur('businessName')}
                        value={values.businessName}
                        placeholder="Nombre del negocio"
                    />
                    {errors.businessName && touched.businessName && (
                        <Text style={style.errorText}>{errors.businessName}</Text>
                    )}

                    <Text style={style.text}>Tipo de negocio</Text>
                    <Pressable
                        onPress={() => setPickerVisible(true)}
                        style={style.pickerInput}
                    >
                        <Text style={style.pickerText}>
                            {values.businessType ? businessTypes.find(t => t.value === values.businessType).label : 'Selecciona un tipo de negocio'}
                        </Text>
                    </Pressable>
                    {errors.businessType && touched.businessType && (
                        <Text style={style.errorText}>{errors.businessType}</Text>
                    )}

                    <Modal
                        animationType="slide"
                        transparent={true}
                        visible={isPickerVisible}
                        onRequestClose={() => setPickerVisible(false)}
                    >
                        <View style={style.modalContainer}>
                            <View style={style.modalContent}>
                                <Text style={style.modalTitle}>Tipo de Negocio</Text>
                                {businessTypes.map((type) => (
                                    <TouchableOpacity
                                        key={type.value}
                                        style={style.modalOption}
                                        onPress={() => {
                                            setFieldValue('businessType', type.value);
                                            setPickerVisible(false);
                                        }}
                                    >
                                        <Text style={style.modalOptionText}>{type.label}</Text>
                                    </TouchableOpacity>
                                ))}
                                <Button onPress={() => setPickerVisible(false)}>
                                    <Text style={style.buttonText}>Cerrar</Text>
                                </Button>
                            </View>
                        </View>
                    </Modal>

                    <Text style={style.text}>Código Postal</Text>
                    <Input
                        onChangeText={handleChange('postalCode')}
                        onBlur={handleBlur('postalCode')}
                        value={values.postalCode}
                        placeholder='Código Postal'
                        keyboardType='numeric'
                    />
                    {errors.postalCode && touched.postalCode && (
                        <Text style={style.errorText}>{errors.postalCode}</Text>
                    )}

                    <Text style={style.text}>País</Text>
                    <Input
                        onChangeText={handleChange('country')}
                        onBlur={handleBlur('country')}
                        value={values.country}
                        placeholder='País'
                    />
                    {errors.country && touched.country && (
                        <Text style={style.errorText}>{errors.country}</Text>
                    )}

                    <Text style={style.text}>Estado</Text>
                    <Input
                        onChangeText={handleChange('state')}
                        onBlur={handleBlur('state')}
                        value={values.state}
                        placeholder='Estado'
                    />
                    {errors.state && touched.state && (
                        <Text style={style.errorText}>{errors.state}</Text>
                    )}

                    <Text style={style.text}>Ciudad</Text>
                    <Input
                        onChangeText={handleChange('city')}
                        onBlur={handleBlur('city')}
                        value={values.city}
                        placeholder='Ciudad'
                    />
                    {errors.city && touched.city && (
                        <Text style={style.errorText}>{errors.city}</Text>
                    )}
                    
                    <Text style={style.text}>Calle</Text>
                    <Input
                        onChangeText={handleChange('street')}
                        onBlur={handleBlur('street')}
                        value={values.street}
                        placeholder='Calle'
                    />
                    {errors.street && touched.street && (
                        <Text style={style.errorText}>{errors.street}</Text>
                    )}
                    
                    <Text style={style.text}>Número Exterior</Text>
                    <Input
                        onChangeText={handleChange('outdoorNumber')}
                        onBlur={handleBlur('outdoorNumber')}
                        value={values.outdoorNumber}
                        placeholder='Número Exterior'
                        keyboardType='numeric'

                    />
                    {errors.outdoorNumber && touched.outdoorNumber && (
                        <Text style={style.errorText}>{errors.outdoorNumber}</Text>
                    )}
                    
                    <Text style={style.text}>Número Interior (opcional)</Text>
                    <Input
                        onChangeText={handleChange('indoorNumber')}
                        onBlur={handleBlur('indoorNumber')}
                        value={values.indoorNumber}
                        placeholder='Número Interior'
                        keyboardType='numeric'

                    />
                    {errors.indoorNumber && touched.indoorNumber && (
                        <Text style={style.errorText}>{errors.indoorNumber}</Text>
                    )}

                    <Button onPress={handleSubmit} disabled={isLoading}>
                        {isLoading ? (
                            <ActivityIndicator color="white" />
                        ) : (
                            <Text style={style.buttonText}>Continuar</Text>
                        )}
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
    },
    buttonText: {
        textAlign: 'center',
        color: 'white',
        fontWeight: 'bold',
    }
});

export default BusinessInfoScreen;
