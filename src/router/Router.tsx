import { useEffect, useState } from "react";
import { Pressable, Text } from "react-native";
import { NavigationContainer, useNavigationContainerRef } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import { RootStackParamList, routes } from "@/router/routes";
import { colorScheme } from "@/styles/colors";
import Inventory from "@/screens/Inventory";
import Settings from "@/screens/Settings";
import { getThemeSetting } from "@/dataaccess/settingsRepository";
import { Theme } from "types/theme";
import { log } from "@/logger";
import Icon from "@/components/Icon";

declare global {
    namespace ReactNavigation {
        interface RootParamList extends RootStackParamList {}
    }
}

export default function Router() {
    const Stack = createNativeStackNavigator<RootStackParamList>();
    const navigationRef = useNavigationContainerRef();
    const [theme, setTheme] = useState(colorScheme.dark);

    useEffect(() => {
        getThemeSetting().then((theme) => {
            setTheme(theme);
        });
    }, []);

    const handleError = (error: any) => {
        log.warn(`Unhandled routing action : ${error} (Router)`);
        navigationRef.navigate("*");
    };

    return (
        <NavigationContainer fallback={<Text>Chargement...</Text>} ref={navigationRef} onUnhandledAction={handleError}>
            <Stack.Navigator
                initialRouteName="Inventory"
                screenOptions={({ navigation }) => ({
                    ...headerOptions(navigation, theme),
                })}
            >
                <Stack.Screen name="Inventory" component={Inventory} options={{ title: "Inventaire" }} />
                <Stack.Screen
                    name="Settings"
                    component={Settings}
                    options={{ title: "Paramètres", headerRight: () => null }}
                />
                <Stack.Screen name="*" component={Inventory} />
            </Stack.Navigator>
        </NavigationContainer>
    );
}

function headerOptions(navigation: any, theme: Theme) {
    return {
        headerStyle: {
            backgroundColor: theme.colors.headers.background,
        },
        headerTintColor: theme.colors.headers.elements,
        headerRight: () => (
            <Pressable onPress={() => navigation.navigate(routes.Settings)}>
                <Icon icon="gear" size={25} color={theme.colors.headers.elements} />
            </Pressable>
        ),
    };
}
