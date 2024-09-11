import { View } from "react-native";

import Router from "@/router/Router";
import { colorScheme } from "@/styles/colors";
import { useEffect, useState } from "react";
import { getThemeSetting } from "@/dataaccess/settingsRepository";

export default function App() {
    const [theme, setTheme] = useState(colorScheme.dark);
    useEffect(() => {
        getThemeSetting().then((theme) => { setTheme(theme) });
    }, []);

    return (
        <View style={{ flex: 1, backgroundColor: theme.colors.background }}>
            <Router />
        </View>
    );
}
