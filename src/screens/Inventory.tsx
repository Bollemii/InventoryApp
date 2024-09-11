import { useEffect, useState } from "react";
import { FlatList, StyleSheet, View } from "react-native";
import { useIsFocused } from "@react-navigation/native";

import ItemCard from "@/components/ItemCard";
import ItemList from "@/components/ItemList";
import { Item } from "@/model/Item";
import { fetchAllItems, updateItemQuantity } from "@/dataaccess/itemRepository";
import { getCardViewSetting } from "@/dataaccess/settingsRepository";

export default function Inventory() {
    const isFocused = useIsFocused();
    const [items, setItems] = useState<Item[]>([]);
    const [cardViewSetting, setCardViewSetting] = useState(false);
    
    useEffect(() => {        
        fetchAllItems().then((items) => setItems(items));
        getCardViewSetting().then((value) => setCardViewSetting(value));
    }, []);

    useEffect(() => {
        if (!isFocused) return;

        getCardViewSetting().then((value) => setCardViewSetting(value));
    }, [isFocused]);

    const handleChangeQuantity = async (index: number, add: number) => {
        const itemAffected = items[index];
        if (!Item.isQuantityValid(itemAffected.quantity + add)) return;

        const idChanged = await updateItemQuantity(
            items[index].id,
            itemAffected.quantity + add
        );
        if (idChanged === -1) return;

        itemAffected.add(add);
        setItems([...items]); // Force re-render
    };

    return (
        <View style={styles.container}>
            <FlatList
                data={items}
                renderItem={({ item, index }) => (
                    cardViewSetting ? (
                        <ItemCard
                            item={item}
                            index={index}
                            handleChangeQuantity={handleChangeQuantity}
                        />
                    ) : (
                        <ItemList
                            item={item}
                            index={index}
                            handleChangeQuantity={handleChangeQuantity}
                        />
                    )
                )}
                keyExtractor={(_, index) => index.toString()}
                columnWrapperStyle={styles.inventory}
                numColumns={3}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        paddingVertical: 10,
        backgroundColor: "white",
    },
    inventory: {
        flexDirection: "row",
        flexWrap: "wrap",
        marginHorizontal: 10,
    },
});
