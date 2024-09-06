import { NavigationContainer, useNavigationContainerRef } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Text } from 'react-native';

import { RootStackParamList } from '@/router/routes';
import Inventory from '@/screens/Inventory';

declare global {
    namespace ReactNavigation {
        interface RootParamList extends RootStackParamList {}
    }
};

export default function Router() {
    const Stack = createNativeStackNavigator<RootStackParamList>();
    const navigationRef = useNavigationContainerRef();

    const handleError = (error: any) => {
        console.log("Unhandled routing action", error);
        navigationRef.navigate("*");
    };

    return (
        <NavigationContainer
            fallback={<Text>Chargement...</Text>}
            ref={navigationRef}
            onUnhandledAction={handleError}
        >
            <Stack.Navigator screenOptions={{headerShown: false}} initialRouteName="Inventory">
                <Stack.Screen name="Inventory" component={Inventory} />
                <Stack.Screen name='*' component={Inventory} />
            </Stack.Navigator>
        </NavigationContainer>
    );
};
