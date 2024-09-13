import { StyleSheet } from "react-native";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";

import Button from "./Button";
import { useSettingsContext } from "@/contexts/settingsContext";

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
            <FontAwesomeIcon icon={faTrash} size={15} color="white"/>
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
