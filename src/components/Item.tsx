import { Item as ItemObj } from "@/model/Item";
import { StyleSheet, Text, View } from "react-native";
import PlusMinusButton from "./PlusMinusButton";

interface ItemProps {
    index: number;
    item: ItemObj;
    handleChangeQuantity: (index: number, quantity: number) => void;
};

export default function Item({ index, item, handleChangeQuantity }: ItemProps) {
    return (
        <View style={styles.item}>
            <Text style={styles.name}>{item.name}</Text>
            <View style={styles.quantity}>
                <PlusMinusButton onPress={handleChangeQuantity} plus={true} itemIndex={index} />
                <Text>{item.quantity}</Text>
                <PlusMinusButton onPress={handleChangeQuantity} plus={false} itemIndex={index} />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    item: {
        alignItems: "center",
        padding: 10,
        borderWidth: 1,
        borderRadius: 20,
        margin: 5,
        height: 100,
        width: 100,
    },
    name: {
        width: "100%",
        flexGrow: 1,
        textAlign: "center",
    },
    quantity: {
        flexDirection: "row",
        width: "100%",
        flexGrow: 2,
        alignItems: "center",
        justifyContent: "space-around",
    },
});
