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

interface NotificationsSettingProps {
    style: any;
}

/**
 * A notifications setting component : switch to enable/disable the notifications
 * It displays a modal to set the reminder for the inventory
 * 
 * @param props The component props : {style}
 * @returns The JSX element
 */
export default function NotificationsSetting(props: NotificationsSettingProps) {
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
        setSavedNotif(settingsCtx.notification)
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
            style={[props.style, styles.item, {height: notifsEnabled ? 135: 80}]}
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
        flexDirection: "column",
    },
    title: {
        fontSize: 16,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        width: "100%",
        flex: 1,
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
