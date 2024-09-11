import { Pressable, StyleSheet } from "react-native";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faPlus, faMinus } from "@fortawesome/free-solid-svg-icons";

import { colorScheme } from "@/styles/colors";
import { useEffect, useState } from "react";
import { getThemeSetting } from "@/dataaccess/settingsRepository";

interface PlusMinusButtonProps {
    onPress: (categoryIndex: number, itemIndex: number, number: number) => void;
    plus: boolean;
    categoryIndex: number;
    itemIndex: number;
}

export default function PlusMinusButton({
    onPress,
    plus,
    categoryIndex,
    itemIndex,
}: PlusMinusButtonProps) {
    const [theme, setTheme] = useState(colorScheme.dark);

    useEffect(() => {
        getThemeSetting().then((theme) => { setTheme(theme) });
    }, []);

    return (
        <Pressable
            onPress={() => onPress(categoryIndex, itemIndex, plus ? 1 : -1)}
            style={(state) =>
                state.pressed
                    ? [styles.button, { backgroundColor: theme.colors.items.button.pressed }]
                    : [styles.button, { backgroundColor: theme.colors.items.button.normal }]
            }
        >
            <FontAwesomeIcon
                icon={plus ? faPlus : faMinus}
                size={15}
                color={theme.colors.items.button.icon}
            />
        </Pressable>
    );
}

const styles = StyleSheet.create({
    button: {
        borderRadius: 10,
        alignItems: "center",
        justifyContent: "center",
        height: 30,
        width: 30,
    },
});
