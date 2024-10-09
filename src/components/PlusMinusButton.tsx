import { StyleSheet } from "react-native";

import { useSettingsContext } from "@/contexts/settingsContext";
import Button from "./Button";
import Icon from "./Icon";

interface PlusMinusButtonProps {
    onPress: () => void;
    plus: boolean;
    style?: any;
}

/**
 * A button that displays a plus or minus icon
 * 
 * @param props The component props : {onPress, plus, style}
 * @returns The JSX element
 */
export default function PlusMinusButton(props: PlusMinusButtonProps) {
    const { settingsCtx } = useSettingsContext();

    let bgColor: any;
    if (props.style?.backgroundColor) {        
        bgColor = props.style.backgroundColor;
    }

    return (
        <Button
            onPress={props.onPress}
            style={[styles.button, props.style]}
            colors={bgColor && { normal: bgColor, pressed: bgColor }}
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
