import { useEffect, useState } from "react";
import { FlatList, StyleSheet, Text, View } from "react-native";

import Item from "@/components/Item";
import { Item as ItemObj } from "@/model/Item";
import { fetchAllItems, updateItemQuantity } from "@/dataaccess/itemRepository";

export default function Inventory() {
    const [items, setItems] = useState<ItemObj[]>([]);

    useEffect(() => {
        fetchAllItems().then((items) => setItems(items));
    }, []);

    const handleChangeQuantity = async (index: number, add: number) => {
        const itemAffected = items[index];
        const idChanged = await updateItemQuantity(items[index].id, itemAffected.quantity + add);
        if (idChanged === -1) return;

        items[index].add(add);
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
