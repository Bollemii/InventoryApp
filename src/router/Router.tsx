import { Pressable, Text } from "react-native";
import {
    NavigationContainer,
    useNavigationContainerRef,
} from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faGear } from "@fortawesome/free-solid-svg-icons";

import { RootStackParamList } from "@/router/routes";
import { colors } from "@/styles/colors";
import Inventory from "@/screens/Inventory";
import Settings from "@/screens/Settings";

declare global {
    namespace ReactNavigation {
        interface RootParamList extends RootStackParamList {}
    }
}

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
            <Stack.Navigator
                initialRouteName="Inventory"
                screenOptions={({ navigation, route }) => ({
                    ...Header({ navigation, route }),
                })}
            >
                <Stack.Screen
                    name="Inventory"
                    component={Inventory}
                />
                <Stack.Screen
                    name="Settings"
                    component={Settings}
                    options={{ headerRight: () => null }}
                />
                <Stack.Screen name="*" component={Inventory} />
            </Stack.Navigator>
        </NavigationContainer>
    );
}

function Header({ navigation, route }) {
    return {
        title: route.name,
        headerRight: () => (
            <Pressable onPress={() => navigation.navigate("Settings")}>
                <FontAwesomeIcon icon={faGear} size={25} color={colors.black} />
            </Pressable>
        ),
    };
}
