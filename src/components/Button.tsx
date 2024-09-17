import { useSettingsContext } from "@/contexts/settingsContext";
import { Pressable, Text } from "react-native";

interface ButtonProps {
    children?: any;
    title?: string;
    onPress: () => void;
    style?: any;
    colors?: { normal: string; pressed: string };
}

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
