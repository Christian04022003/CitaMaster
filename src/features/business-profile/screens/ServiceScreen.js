import { View, Text, StyleSheet } from "react-native"
import { colors } from "../../../context/theme";
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Button } from "../../../components/Button";
import { useNavigation } from '@react-navigation/native';




export const ServiceScreen = () => {
    const insets = useSafeAreaInsets(); // Obtiene los valores de padding
    const navigation = useNavigation();


    const handleAddService = () => {
        navigation.navigate('AddService')

    }

    return (
        <View style={[style.container,
        { paddingTop: insets.top, paddingBottom: insets.bottom }]}>
            <Text style={style.textTitle}>Lista de Servicios</Text>

            <View style={style.card}>
                <Text>inS</Text>

            </View>

            <Button onPress={handleAddService}>
                <Text style={style.buttonText}>Agregar Servicio</Text>
            </Button>

            <Button>
                <Text style={style.buttonText}>Listo</Text>
            </Button>
        </View>

    )

}


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
    }
});


