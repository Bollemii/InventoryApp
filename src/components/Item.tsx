import { Item as ItemObj } from "@/model/Item";
import { StyleSheet, Text, View } from "react-native";
import PlusMinusButton from "./PlusMinusButton";

interface ItemProps {
    index: number;
    item: ItemObj;
    handleChangeQuantity: (index: number, quantity: number) => void;
};

const SIZE = 110;

export default function Item({ index, item, handleChangeQuantity }: ItemProps) {
    return (
        <View style={styles.item}>
            <Text style={styles.name}>{item.name}</Text>
            <View style={styles.quantityBox}>
                <PlusMinusButton onPress={handleChangeQuantity} plus={true} itemIndex={index} />
                <Text style={styles.quantity}>{item.quantity}</Text>
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
        height: SIZE,
        width: SIZE,
    },
    name: {
        width: "100%",
        flexGrow: 1,
        textAlign: "center",
        fontSize: 15,
    },
    quantityBox: {
        flexDirection: "row",
        width: "100%",
        flexGrow: 2,
        alignItems: "center",
        justifyContent: "space-around",
    },
    quantity: {
        width: "40%",
        textAlign: "center",
        fontSize: 15,
    },
});
