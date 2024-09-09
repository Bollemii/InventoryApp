import { useState } from "react";
import { FlatList, StyleSheet, Text, View } from "react-native";

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
            <FlatList
                data={items}
                extraData={items}
                renderItem={({ item, index }) => (
                    <Item
                        index={index}
                        item={item}
                        handleChangeQuantity={handleChangeQuantity}
                    />
                )}
                keyExtractor={(_, index) => index.toString()}
                columnWrapperStyle={styles.inventory}
                numColumns={3}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "white",
    },
    title: {
        fontSize: 20,
        fontWeight: "bold",
        margin: 20,
        color: "black",
        textAlignVertical: "center",
    },
    inventory: {
        flexDirection: "row",
        flexWrap: "wrap",
        marginHorizontal: 10,
    },
});
