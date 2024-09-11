import { Pressable, StyleSheet } from "react-native";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faPlus, faMinus } from "@fortawesome/free-solid-svg-icons";

import { colors } from "@/styles/colors";

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
    return (
        <Pressable
            onPress={() => onPress(categoryIndex, itemIndex, plus ? 1 : -1)}
            style={(state) =>
                state.pressed
                    ? [styles.button, { backgroundColor: colors.grey }]
                    : styles.button
            }
        >
            <FontAwesomeIcon
                icon={plus ? faPlus : faMinus}
                size={15}
                color={colors.black}
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
        backgroundColor: colors.lightgrey,
    },
});
