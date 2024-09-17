import { StyleSheet } from "react-native";

import Button from "./Button";
import { useSettingsContext } from "@/contexts/settingsContext";
import Icon from "./Icon";

interface DeleteItemButtonProps {
    onPress: () => void;
    style?: any;
}

const SIZE = 30;
const COLORS = {normal: "red", pressed: "darkred"}

export default function DeleteItemButton({ onPress, style } : DeleteItemButtonProps) {
    const { settingsCtx } = useSettingsContext();

    return (
        <Button onPress={onPress} style={[style, styles.button, {width: settingsCtx.cardsView ? "100%" : SIZE}]} colors={COLORS}>
            <Icon icon="trash" size={15} color="white"/>
        </Button>
    );
}

const styles = StyleSheet.create({
    button: {
        height: SIZE,
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 10,
    },
});
