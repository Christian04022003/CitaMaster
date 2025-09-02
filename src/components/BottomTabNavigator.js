import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/Ionicons';
import { WorkersScreen } from "./WorkersScreen";
import { ServicesScreen } from "./ServicesScreen";
import { colors } from "../../../context/theme";
import { TabStyles } from "./TabStyles";
import { AppointmentScreenContent } from "./AppointmentScreen";

const Tab = createBottomTabNavigator();

export const BottomTabNavigator = () => {
    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                tabBarIcon: ({ focused, color, size }) => {
                    let iconName;
                    if (route.name === 'Citas') {
                        iconName = focused ? 'calendar' : 'calendar-outline';
                    } else if (route.name === 'Empleados') {
                        iconName = focused ? 'people' : 'people-outline';
                    } else if (route.name === 'Servicios') {
                        iconName = focused ? 'briefcase' : 'briefcase-outline';
                    }
                    return <Icon name={iconName} size={size} color={color} />;
                },
                tabBarActiveTintColor: colors.button,
                tabBarInactiveTintColor: 'gray',
                headerShown: false,
                tabBarStyle: TabStyles.BottomBar,
            })}
        >
            <Tab.Screen name="Citas" component={AppointmentScreenContent} />
            <Tab.Screen name="Empleados" component={WorkersScreen} />
            <Tab.Screen name="Servicios" component={ServicesScreen} />
        </Tab.Navigator>
    );
};
