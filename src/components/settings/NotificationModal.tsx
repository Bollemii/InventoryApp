import { useEffect, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { useSettingsContext } from "@/contexts/settingsContext";
import { useModalVisibleContext } from "@/contexts/modalVisibleContext";
import Icon from "../Icon";
import Modal from "../Modal";
import { Picker } from "@react-native-picker/picker";
import Button from "../Button";

const WEEKDAYS = ["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi", "Dimanche"];

export default function NotificationModal() {
    const { settingsCtx, setSettingsCtx } = useSettingsContext();
    const { setModalVisibleCtx } = useModalVisibleContext();
    const [visible, setVisible] = useState(false);
    const [savedNotif, setSavedNotif] = useState({ weekDay: WEEKDAYS[4], hour: "17h00" });
    const [notifWeekDay, setNotifWeekDay] = useState(WEEKDAYS[4]);
    const [notifHour, setNotifHour] = useState("17h00");

    useEffect(() => {
        setModalVisibleCtx(false);
    }, []);
    useEffect(() => {
        if (!visible) return;

        // Fetch saved notification settings
        // setSavedNotif({});
    }, [visible]);

    const toggleVisible = (value: boolean) => {
        // Disable notification => cancel it

        setVisible(value);
        setModalVisibleCtx(value);
    };

    const save = () => {
        // Change notification => cancel it and set new one

        setSavedNotif({
            weekDay: notifWeekDay,
            hour: notifHour,
        });
        toggleVisible(false);
    };

    return (
        <>
            <Pressable onPress={() => toggleVisible(true)} style={styles.notifBox}>
                <Text style={[styles.itemText, { color: settingsCtx.theme.colors.texts }]}>
                    {savedNotif.weekDay} {savedNotif.hour}
                </Text>
                <Icon icon="pen" size={20} color={settingsCtx.theme.colors.texts} />
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
        paddingVertical: 10,
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
