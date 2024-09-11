import { View } from "react-native";

import Router from "@/router/Router";
import { colors } from "@/styles/colors";

const BACKGROUND_COLOR = colors.white;

export default function App() {
    return (
        <View style={{ flex: 1, backgroundColor: BACKGROUND_COLOR }}>
            <Router />
        </View>
    );
}
