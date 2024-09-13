import { Pressable, StyleSheet } from "react-native";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faPlus, faMinus } from "@fortawesome/free-solid-svg-icons";

import { useSettingsContext } from "@/contexts/settingsContext";
import Button from "./Button";

interface PlusMinusButtonProps {
    onPress: (categoryIndex: number, itemIndex: number, number: number) => void;
    plus: boolean;
    categoryIndex: number;
    itemIndex: number;
}

export default function PlusMinusButton({ onPress, plus, categoryIndex, itemIndex }: PlusMinusButtonProps) {
    const { settingsCtx } = useSettingsContext();

    return (
        <Button
            onPress={() => onPress(categoryIndex, itemIndex, plus ? 1 : -1)}
            style={styles.button}
            colors={{
                normal: settingsCtx.theme.colors.items.button.normal,
                pressed: settingsCtx.theme.colors.items.button.pressed,
            }}
        >
            <FontAwesomeIcon
                icon={plus ? faPlus : faMinus}
                size={15}
                color={settingsCtx.theme.colors.items.button.icon}
            />
        </Button>
    );
}

const styles = StyleSheet.create({
    button: {
        borderWidth: 1,
        borderRadius: 10,
        alignItems: "center",
        justifyContent: "center",
        height: 30,
        width: 30,
    },
});
