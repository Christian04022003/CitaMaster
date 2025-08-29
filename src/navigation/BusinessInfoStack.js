import { createStackNavigator } from '@react-navigation/stack';
import { BusinessInfoScreen } from '../features/business-profile/screens/BusinessInfoScreen';
import { ServiceScreen } from '../features/business-profile/screens/ServicesScreen';

const Stack = createStackNavigator();

export const BusinessInfo = () => {
    return (
        <Stack.Navigator>
            <Stack.Screen
                name="BusinessInfo"
                component={BusinessInfoScreen}
                options={{ headerShown: false }}
            />
            <Stack.Screen
                name="ServiceScreen"
                component={ServiceScreen}
                options={{ headerShown: false }}
            />
        </Stack.Navigator>
    );
};
