import { StyleSheet, Text, View } from "react-native";

import { Item } from "@/model/Item";
import PlusMinusButton from "./PlusMinusButton";

interface ItemProps {
    categoryIndex: number;
    itemIndex: number;
    item: Item;
    handleChangeQuantity: (
        categoryIndex: number,
        itemIndex: number,
        quantity: number
    ) => void;
}

export default function ItemList({
    categoryIndex,
    itemIndex,
    item,
    handleChangeQuantity,
}: ItemProps) {
    return (
        <View style={styles.item}>
            <Text style={styles.name}>{item.name}</Text>
            <View style={styles.quantityBox}>
                <PlusMinusButton
                    onPress={handleChangeQuantity}
                    plus={false}
                    categoryIndex={categoryIndex}
                    itemIndex={itemIndex}
                />
                <Text style={styles.quantity}>{item.quantity}</Text>
                <PlusMinusButton
                    onPress={handleChangeQuantity}
                    plus={true}
                    categoryIndex={categoryIndex}
                    itemIndex={itemIndex}
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
        marginHorizontal: 10,
        borderBottomWidth: 1,
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
