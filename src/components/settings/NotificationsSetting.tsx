import { Pressable, StyleSheet, Switch, Text, View } from "react-native";

import { switchColors } from "@/styles/colors";
import HorizontalLine from "../HorizontalLine";
import { useSettingsContext } from "@/contexts/settingsContext";
import { useState } from "react";
import Icon from "../Icon";
import NotificationModal from "./NotificationModal";

export default function NotificationsSetting() {
    const { settingsCtx, setSettingsCtx } = useSettingsContext();
    const [notifsEnabled, setNotifsEnabled] = useState(false);

    return (
        <View
            style={[
                styles.item,
                {
                    backgroundColor: settingsCtx.theme.colors.items.background,
                },
            ]}
        >
            <View style={styles.title}>
                <Text style={[styles.itemText, { color: settingsCtx.theme.colors.texts }]}>Notifications</Text>
                <Switch
                    trackColor={switchColors.track}
                    thumbColor={notifsEnabled ? switchColors.thumb.true : switchColors.thumb.false}
                    onValueChange={setNotifsEnabled}
                    value={notifsEnabled}
                />
            </View>
            { notifsEnabled && (
                <>
                    <HorizontalLine />
                    <NotificationModal />
                </>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    item: {
        padding: 10,
        borderWidth: 1,
        borderRadius: 10,
        marginVertical: 5,
    },
    title: {
        fontSize: 16,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        width: "100%",
    },
    itemText: {
        fontSize: 16,
    },
    notifBox: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingVertical: 10,
    },
});
