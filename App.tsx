import { View } from "react-native";

import Router from "@/router/Router";
import ContextsProvider from "@/contexts";
import { useSettingsContext } from "@/contexts/settingsContext";

export default function App() {
    const { settingsCtx } = useSettingsContext();

    return (
        <View
            style={{
                flex: 1,
                backgroundColor: settingsCtx.theme.colors.background,
            }}
        >
            <ContextsProvider>
                <Router />
            </ContextsProvider>
        </View>
    );
}
