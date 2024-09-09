import { StyleSheet, Text, View } from "react-native";

import { Item } from "@/model/Item";
import PlusMinusButton from "./PlusMinusButton";

interface ItemProps {
    index: number;
    item: Item;
    handleChangeQuantity: (index: number, quantity: number) => void;
}

export default function ItemList({
    index,
    item,
    handleChangeQuantity,
}: ItemProps) {
    return (
        <View style={[styles.item, { borderTopWidth: index === 0 ? 1 : 0 }]}>
            <Text style={styles.name}>{item.name}</Text>
            <View style={styles.quantityBox}>
                <PlusMinusButton
                    onPress={handleChangeQuantity}
                    plus={false}
                    itemIndex={index}
                />
                <Text style={styles.quantity}>{item.quantity}</Text>
                <PlusMinusButton
                    onPress={handleChangeQuantity}
                    plus={true}
                    itemIndex={index}
                />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    item: {
        alignItems: "center",
        flexDirection: "row",
        padding: 10,
        borderWidth: 1,
        height: 50,
        width: "100%",
    },
    name: {
        flexGrow: 4,
        fontSize: 15,
    },
    quantityBox: {
        flexDirection: "row",
        width: "30%",
        alignItems: "center",
        justifyContent: "space-around",
    },
    quantity: {
        textAlign: "center",
        width: "20%",
        fontSize: 15,
    },
});
