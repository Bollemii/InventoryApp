import { useState } from "react";
import { StyleSheet, Text, View } from "react-native";

import { Item as ItemObj } from "@/model/Item";
import Item from "@/components/Item";

export default function Inventory() {
    const [items, setItems] = useState<ItemObj[]>([
        new ItemObj("Apple", 5),
        new ItemObj("Banana", 3),
        new ItemObj("Cherry", 7),
        new ItemObj("Date", 1),
        new ItemObj("Elderberry", 2),
        new ItemObj("Fig", 4),
    ]);

    const handleChangeQuantity = (index: number, quantity: number) => {
        items[index].add(quantity);
        setItems([...items]);
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Inventory</Text>
            <View style={styles.inventory}>
                {items.map((item, index) => (
                    <Item key={index} index={index} item={item} handleChangeQuantity={handleChangeQuantity}/>
                ))}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
    },
    title: {
        fontSize: 20,
        fontWeight: "bold",
        margin: 20,
        color: "black"
    },
    inventory: {
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent: "center",
        marginHorizontal: 10,
    },
});
