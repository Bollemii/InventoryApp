import { StyleSheet, Switch, Text, View } from "react-native";

import { switchColors } from "@/styles/colors";
import HorizontalLine from "../HorizontalLine";
import { useSettingsContext } from "@/contexts/settingsContext";
import { useEffect, useState } from "react";
import NotificationModal from "./NotificationModal";
import {
    cancelNotification,
    getAllScheduledNotifications,
    scheduleInventoryNotification,
} from "@/utils/notification";
import { NotificationRequest } from "types/notifications";
import { getNotificationSetting } from "@/dataaccess/settingsRepository";

export default function NotificationsSetting() {
    const { settingsCtx } = useSettingsContext();
    const [notifsEnabled, setNotifsEnabled] = useState(false);
    const [foregroundNotif, setForegroundNotif] = useState<NotificationRequest | null>(null);
    const [savedNotif, setSavedNotif] = useState<NotificationRequest | null>(null);

    useEffect(() => {
        getAllScheduledNotifications().then((notifs) => {
            const fgNotif = notifs.find((notif) => notif.content.title === "Inventaire");
            setForegroundNotif(fgNotif || null);
            setNotifsEnabled(fgNotif !== undefined);
        });
        getNotificationSetting().then((notif) => {
            setSavedNotif(notif || null);
        });
    }, []);

    const toggleEnabled = (value: boolean) => {
        try {
            if (!value && foregroundNotif) {
                cancelNotification(foregroundNotif.identifier);
            } else if (value && !foregroundNotif && savedNotif) {
                scheduleInventoryNotification(savedNotif.trigger.weekday, savedNotif.trigger.hour);
            }
            setNotifsEnabled(value);
        } catch (e) {
            console.error(e);
        }
    };

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
                    onValueChange={toggleEnabled}
                    value={notifsEnabled}
                />
            </View>
            {notifsEnabled && (
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
