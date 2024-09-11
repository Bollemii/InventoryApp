import { useEffect, useState } from "react";
import { ScrollView, StyleSheet, Switch, Text, View } from "react-native";
import { Picker } from "@react-native-picker/picker";

import {
    getCardViewSetting,
    getThemeSetting,
    setCardViewSetting,
    setThemeSetting,
} from "@/dataaccess/settingsRepository";
import { colorScheme } from "@/styles/colors";

const switchColors = {
    track: { true: "#4A85EB", false: "#767577" },
    thumb: { true: "#1545D5", false: "#F4F3F4" },
};

export default function Settings() {
    const [theme, setTheme] = useState(colorScheme.dark);
    const [cardsView, setCardsView] = useState(false);
    const [selectedTheme, setSelectedTheme] = useState("dark");

    useEffect(() => {
        getCardViewSetting().then(setCardsView);
        getThemeSetting().then((theme) => { setTheme(theme); });
    }, []);
    useEffect(() => {
        setSelectedTheme(theme.name);
    }, [theme]);

    const handleCardsView = (value: boolean) => {
        setCardsView(value);
        setCardViewSetting(value);
    };
    const handleTheme = (value: string) => {
        setSelectedTheme(value);
        setThemeSetting(value);
        setTheme(colorScheme[value]);
    }

    return (
        <ScrollView style={[styles.container, {backgroundColor: theme.colors.background}]}>
            <View style={[styles.item, {backgroundColor: theme.colors.items.background}]}>
                <Text style={[styles.itemText, {color: theme.colors.texts}]}>Cards view</Text>
                <Switch
                    trackColor={switchColors.track}
                    thumbColor={cardsView ? switchColors.thumb.true : switchColors.thumb.false}
                    onValueChange={handleCardsView}
                    value={cardsView}
                />
            </View>
            <View style={[styles.item, , {backgroundColor: theme.colors.items.background}]}>
                <Text style={[styles.itemText, {color: theme.colors.texts}]}>Dark mode</Text>
                <View style={styles.pickerContainer}>
                    <Picker
                        selectedValue={selectedTheme}
                        onValueChange={(itemValue) => {
                            handleTheme(itemValue);
                        }}
                        style={[styles.picker, {backgroundColor: theme.colors.items.background}]}
                        mode="dropdown"
                    >
                        {
                            Object.keys(colorScheme).map((theme) => (
                                <Picker.Item key={theme} label={theme} value={theme} />
                            ))
                        }
                    </Picker>
                </View>
            </View>
        </ScrollView>
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
    },
    itemText: {
        fontSize: 16,
    },
    pickerContainer: {
        width: "40%",
        borderWidth: 1,
        borderRadius: 10,
        paddingHorizontal: 10,
    },
    picker: {
        flex: 1,
        padding: 10,
    },
});
