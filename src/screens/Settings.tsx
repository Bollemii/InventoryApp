import { useState } from "react";
import { ScrollView, StyleSheet, View } from "react-native";

import { useSettingsContext } from "@/contexts/settingsContext";
import { useModalVisibleContext } from "@/contexts/modalVisibleContext";
import CardViewSetting from "@/components/settings/CardViewSetting";
import ThemeSetting from "@/components/settings/ThemeSetting";
import NotificationsSetting from "@/components/settings/NotificationsSetting";

export default function Settings() {
    const { settingsCtx } = useSettingsContext();
    const { modalVisibleCtx } = useModalVisibleContext();
    const [i, setI] = useState(0); // Force re-render

    const rerender = () => {
        setI(i + 1);
    };

    return (
        <>
        {modalVisibleCtx && <View style={styles.opacityView} /> /* Modal opacity background */}
        <View style={[styles.container, { backgroundColor: settingsCtx.theme.colors.background }]}>
            <ScrollView>
                <CardViewSetting />
                <ThemeSetting parentRerender={rerender} />
                <NotificationsSetting />
            </ScrollView>
        </View>
        </>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 10,
    },
    opacityView: {
        position: "absolute",
        height: "100%",
        width: "100%",
        zIndex: 1,
        backgroundColor: "black",
        opacity: 0.6,
    },
});
