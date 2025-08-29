// src/features/main/screens/HomeScreen.js
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
// Importa el hook para la navegación
import { useNavigation } from '@react-navigation/native';
// Importa tu componente de botón
import { Button } from '../../../components/Button';
import { colors } from '../../../context/theme';

const TypeUserScreen = () => {
    // Inicializa el hook de navegación
    const navigation = useNavigation();

    // Define una función que navega a la pantalla
    const handleNavigate = () => {
        // Usa el nombre que le diste a la pantalla en tu MainStack.js
        navigation.navigate('BusinessInfo');
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Tipo de Usuario</Text>

            <Button
                title="Ir a Información del Negocio"
                onPress={handleNavigate}
                style={styles.button}
            ><Text style={styles.text}>Negocio</Text>
            </Button>

            <Button
                title="Ir a Información del Negocio"
                onPress={handleNavigate}
                style={styles.button}
            ><Text style={styles.text}>Empleado</Text>
            </Button>

            <Button
                title="Ir a Información del Negocio"
                onPress={handleNavigate}
                style={styles.button}
            ><Text style={styles.text}>Cliente</Text>
            </Button>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
        backgroundColor: colors.background
    },
    title: {
        fontSize: 20,
        marginBottom: 20,
    },
    button: {
        backgroundColor: 'blue',
        // Asegúrate de definir otros estilos que necesites para el botón
    },
    text: {
        color: colors.textOnInput,

    }
});

export default TypeUserScreen;