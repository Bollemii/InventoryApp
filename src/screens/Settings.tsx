import { useEffect, useState } from "react";
import { ScrollView, StyleSheet, Switch, Text, View } from "react-native";
import { Picker } from "@react-native-picker/picker";

import { colorScheme } from "@/styles/colors";
import { useSettingsContext } from "@/contexts/settingsContext";
import { setCardViewSetting, setThemeSetting } from "@/dataaccess/settingsRepository";

const switchColors = {
    track: { true: "#4A85EB", false: "#767577" },
    thumb: { true: "#1545D5", false: "#F4F3F4" },
};

export default function Settings() {
    const { settingsCtx, setSettingsCtx } = useSettingsContext();
    const [cardsView, setCardsView] = useState(false);
    const [selectedTheme, setSelectedTheme] = useState(Object.keys(colorScheme)[0]);

    useEffect(() => {
        setCardsView(settingsCtx.cardsView);
        setSelectedTheme(settingsCtx.theme.name);
    }, []);

    const handleCardsView = (value: boolean) => {
        setCardsView(value);
        setCardViewSetting(value);
        settingsCtx.cardsView = value;
        setSettingsCtx(settingsCtx);
    };
    const handleTheme = (value: string) => {
        setSelectedTheme(value);
        setThemeSetting(value);
        settingsCtx.theme = colorScheme[value];
        setSettingsCtx(settingsCtx);
    };

    return (
        <ScrollView style={[styles.container, { backgroundColor: settingsCtx.theme.colors.background }]}>
            <View
                style={[
                    styles.item,
                    {
                        backgroundColor: settingsCtx.theme.colors.items.background,
                    },
                ]}
            >
                <Text style={[styles.itemText, { color: settingsCtx.theme.colors.texts }]}>Cards view</Text>
                <Switch
                    trackColor={switchColors.track}
                    thumbColor={cardsView ? switchColors.thumb.true : switchColors.thumb.false}
                    onValueChange={handleCardsView}
                    value={cardsView}
                />
            </View>
            <View
                style={[
                    styles.item,
                    ,
                    {
                        backgroundColor: settingsCtx.theme.colors.items.background,
                    },
                ]}
            >
                <Text style={[styles.itemText, { color: settingsCtx.theme.colors.texts }]}>Dark mode</Text>
                <View style={styles.pickerContainer}>
                    <Picker
                        selectedValue={selectedTheme}
                        onValueChange={(itemValue) => {
                            handleTheme(itemValue);
                        }}
                        style={[
                            styles.picker,
                            {
                                backgroundColor: settingsCtx.theme.colors.items.background,
                            },
                        ]}
                        mode="dropdown"
                    >
                        {Object.keys(colorScheme).map((theme) => (
                            <Picker.Item key={theme} label={theme} value={theme} />
                        ))}
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
