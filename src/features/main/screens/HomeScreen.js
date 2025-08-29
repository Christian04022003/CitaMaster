// src/features/main/screens/HomeScreen.js
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
// Importa el hook para la navegación
import { useNavigation } from '@react-navigation/native';
// Importa tu componente de botón
import { Button } from '../../../components/Button';

const HomeScreen = () => {
    // Inicializa el hook de navegación
    const navigation = useNavigation();

    // Define una función que navega a la pantalla
    const handleNavigate = () => {
        // Usa el nombre que le diste a la pantalla en tu MainStack.js
        navigation.navigate('BusinessInfo');
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Pantalla Principal</Text>
            
            <Button
                title="Ir a Información del Negocio"
                onPress={handleNavigate}
                style={styles.button}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    title: {
        fontSize: 20,
        marginBottom: 20,
    },
    button: {
        backgroundColor: 'blue',
        // Asegúrate de definir otros estilos que necesites para el botón
    },
});

export default HomeScreen;