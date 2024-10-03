import { useEffect, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { Picker } from "@react-native-picker/picker";

import { useSettingsContext } from "@/contexts/settingsContext";
import { useModalVisibleContext } from "@/contexts/modalVisibleContext";
import Icon from "../Icon";
import Modal from "../Modal";
import Button from "../Button";
import { getNotificationSetting, setNotificationSetting } from "@/dataaccess/settingsRepository";
import { NotificationRequest } from "types/notifications";
import { cancelNotification, scheduleInventoryNotification } from "@/utils/notification";

const WEEKDAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

export default function NotificationModal() {
    const { settingsCtx } = useSettingsContext();
    const { setModalVisibleCtx } = useModalVisibleContext();
    const [visible, setVisible] = useState(false);
    const [savedNotif, setSavedNotif] = useState<NotificationRequest | null>(null);
    const [notifWeekDay, setNotifWeekDay] = useState(WEEKDAYS[4]);
    const [notifHour, setNotifHour] = useState("17h00");

    useEffect(() => {
        setModalVisibleCtx(false);

        getNotificationSetting().then((notif) => {
            setSavedNotif(notif || null);
            setNotifWeekDay(notif ? WEEKDAYS[notif?.trigger.weekday] : WEEKDAYS[4]);
            setNotifHour(notif ? `${notif?.trigger.hour}h00` : "17h00");
        });
    }, []);
    useEffect(() => {
        if (!visible) return;
        getNotificationSetting().then((notif) => {
            setSavedNotif(notif || null);
            setNotifWeekDay(notif ? WEEKDAYS[notif?.trigger.weekday] : WEEKDAYS[4]);
            setNotifHour(notif ? `${notif?.trigger.hour}h00` : "17h00");
        });
    }, [visible]);

    const toggleVisible = (value: boolean) => {
        setVisible(value);
        setModalVisibleCtx(value);
    };

    const save = async () => {
        try {            
            if (savedNotif) {
                cancelNotification(savedNotif.identifier);
            }
            
            const notification = await scheduleInventoryNotification(
                WEEKDAYS.indexOf(notifWeekDay),
                parseInt(notifHour.split("h")[0])
            );

            setNotificationSetting(notification);
            setSavedNotif(notification);

            toggleVisible(false);
        } catch (e) {
            console.error(e);
        }
    };

    return (
        <>
            <Pressable onPress={() => toggleVisible(true)} style={styles.notifBox}>
                {savedNotif ? (
                    <>
                        <Text style={[styles.itemText, { color: settingsCtx.theme.colors.texts }]}>
                            {WEEKDAYS[savedNotif?.trigger.weekday]} {savedNotif?.trigger.hour}h00
                        </Text>
                        <Icon icon="pen" size={20} color={settingsCtx.theme.colors.texts} />
                    </>
                ) : (
                    <Text style={[styles.itemText, { color: settingsCtx.theme.colors.texts }]}>Set reminder</Text>
                )}
            </Pressable>
            <Modal title="Edit inventory reminder" visible={visible} close={() => toggleVisible(false)}>
                <View style={styles.pickerContainer}>
                    <Picker
                        selectedValue={notifWeekDay}
                        onValueChange={(itemValue) => setNotifWeekDay(itemValue)}
                        style={styles.picker}
                        mode="dropdown"
                    >
                        {WEEKDAYS.map((day) => (
                            <Picker.Item key={day} label={day} value={day} />
                        ))}
                    </Picker>
                </View>
                <View style={styles.pickerContainer}>
                    <Picker
                        selectedValue={notifHour}
                        onValueChange={(itemValue) => setNotifHour(itemValue)}
                        style={styles.picker}
                        mode="dropdown"
                    >
                        {Array.from({ length: 24 }, (_, i) => {
                            const hour = `${i.toString().padStart(2, "0")}h00`;
                            return <Picker.Item key={hour} label={hour} value={hour} />;
                        })}
                    </Picker>
                </View>
                <Button onPress={save} style={styles.actionButton}>
                    <Text>Save</Text>
                </Button>
            </Modal>
        </>
    );
}

const styles = StyleSheet.create({
    itemText: {
        fontSize: 16,
    },
    notifBox: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        width: "100%",
        flex: 1,
    },
    pickerContainer: {
        width: "60%",
        height: 60,
        borderWidth: 1,
        borderRadius: 10,
        paddingHorizontal: 10,
        margin: 10,
    },
    picker: {
        flex: 1,
        padding: 10,
    },
    actionButton: {
        width: "80%",
        height: 40,
        margin: 10,
        borderWidth: 1,
        borderRadius: 10,
    },
});
