import { StyleSheet } from "react-native";

import { useSettingsContext } from "@/contexts/settingsContext";
import Button from "./Button";
import Icon from "./Icon";

interface PlusMinusButtonProps {
    onPress: () => void;
    plus: boolean;
    style?: any;
}

export default function PlusMinusButton(props: PlusMinusButtonProps) {
    const { settingsCtx } = useSettingsContext();

    return (
        <Button
            onPress={props.onPress}
            style={[styles.button, props.style]}
        >
            <Icon icon={props.plus ? "plus" : "minus"} size={15} color={settingsCtx.theme.colors.items.button.icon} />
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
