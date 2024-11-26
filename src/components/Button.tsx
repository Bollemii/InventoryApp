import { useSettingsContext } from "@/contexts/settingsContext";
import { Pressable, Text } from "react-native";

interface ButtonProps {
    children?: any;
    title?: string;
    onPress: () => void;
    style?: any;
    colors?: { normal: string; pressed: string };
}

/**
 * A button component
 * The button changes its background color when pressed. The colors can be customized in the "colors" prop as an object with "normal" and "pressed" properties
 * 
 * @param props The component props : {children, title, onPress, style, colors}
 * @returns The JSX element
 */
export default function Button(props: ButtonProps) {
    const { settingsCtx } = useSettingsContext();

    return (
        <Pressable
            onPress={props.onPress}
            style={(state) => [
                { alignItems: "center", justifyContent: "center", padding: 10 },
                props.style,
                {
                    backgroundColor: props.colors ? (state.pressed ? props.colors.pressed : props.colors.normal) :
                    (state.pressed ? settingsCtx.theme.colors.items.button.pressed : settingsCtx.theme.colors.items.button.normal),
                },
            ]}
        >
            {props.children ? props.children : <Text>{props.title}</Text>}
        </Pressable>
    );
}
