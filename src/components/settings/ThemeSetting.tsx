import { useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { Picker } from "@react-native-picker/picker";

import { colorScheme } from "@/styles/colors";
import { useSettingsContext } from "@/contexts/settingsContext";
import { setThemeSetting } from "@/dataaccess/settingsRepository";

interface ThemeSettingProps {
    style: any;
    parentRerender: () => void;
}

/**
 * A theme setting component : select the theme of the application
 * 
 * @param props The component props : {style, parentRerender}
 * @returns The JSX element
 */
export default function ThemeSetting(props: ThemeSettingProps) {
    const { settingsCtx, setSettingsCtx } = useSettingsContext();
    const [selectedTheme, setSelectedTheme] = useState(Object.keys(colorScheme)[0]);

    useEffect(() => {
        setSelectedTheme(settingsCtx.theme.name);
    }, []);

    const handleTheme = (value: string) => {
        setSelectedTheme(value);
        setThemeSetting(value);
        settingsCtx.theme = colorScheme[value];
        setSettingsCtx(settingsCtx);
        props.parentRerender();
    };

    return (
        <View
            style={props.style}
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
    );
}

const styles = StyleSheet.create({
    itemText: {
        fontSize: 16,
    },
    pickerContainer: {
        width: "40%",
        height: 60,
        borderWidth: 1,
        borderRadius: 10,
        paddingHorizontal: 10,
    },
    picker: {
        flex: 1,
        padding: 10,
    },
});
