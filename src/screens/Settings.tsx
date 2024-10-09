import { useState } from "react";
import { ScrollView, StyleSheet, View } from "react-native";

import { useSettingsContext } from "@/contexts/settingsContext";
import { useModalVisibleContext } from "@/contexts/modalVisibleContext";
import CardViewSetting from "@/components/settings/CardViewSetting";
import ThemeSetting from "@/components/settings/ThemeSetting";
import NotificationsSetting from "@/components/settings/NotificationsSetting";

/**
 * The settings screen
 * It displays the settings of the application
 * 
 * @returns The JSX element
 */
export default function Settings() {
    const { settingsCtx } = useSettingsContext();
    const { modalVisibleCtx } = useModalVisibleContext();
    const [rerender, setRerender] = useState(false);
    const itemStyle = [
        styles.item,
        {
            backgroundColor: settingsCtx.theme.colors.items.background,
        },
    ]

    return (
        <>
        {modalVisibleCtx && <View style={styles.opacityView} /> /* Modal opacity background */}
        <View style={[styles.container, { backgroundColor: settingsCtx.theme.colors.background }]}>
            <ScrollView>
                <CardViewSetting style={itemStyle} />
                <ThemeSetting style={itemStyle} parentRerender={() => setRerender(!rerender)} />
                <NotificationsSetting style={itemStyle} />
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
    item: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        padding: 10,
        borderWidth: 1,
        borderRadius: 10,
        marginVertical: 5,
        height: 80,
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
