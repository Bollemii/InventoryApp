import { Pressable, StyleSheet, Text, View } from "react-native";

interface PlusMinusButtonProps {
    onPress: (index: number, number: number) => void;
    plus: boolean;
    itemIndex: number;
};

export default function PlusMinusButton({ onPress, plus, itemIndex }: PlusMinusButtonProps) {
    return (
        <Pressable
            onPress={() => onPress(itemIndex, plus ? 1 : -1)}
            style={(state) => state.pressed ? [styles.button, {backgroundColor: "grey"}] : styles.button}
        >
            <View><Text>{plus ? "+" : "-"}</Text></View>
        </Pressable>
    );
};

const styles = StyleSheet.create({
    button: {
        borderRadius: 10,
        alignContent: "center",
        justifyContent: "center",
        flexDirection: "row",
        height: 30,
        width: 30,
        backgroundColor: "lightgrey",
    },
});
