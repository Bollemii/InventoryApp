import { useEffect, useState } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { useIsFocused } from "@react-navigation/native";

import Category from "@/components/Category";
import { Item } from "@/model/Item";
import { Category as CategoryObj } from "@/model/category";
import { fetchAllItems, updateItemQuantity } from "@/dataaccess/itemRepository";
import { useSettingsContext } from "@/contexts/settingsContext";
import Button from "@/components/Button";

export default function Inventory() {
    const isFocused = useIsFocused();
    const { settingsCtx } = useSettingsContext();
    const [categories, setCategories] = useState<CategoryObj[]>([]);

    useEffect(() => {
        fetchAllItems().then((categories) => setCategories(categories));
    }, []);

    const handleChangeQuantity = async (
        categoryIndex: number,
        itemIndex: number,
        add: number
    ) => {
        const categoryAffected = categories[categoryIndex];
        const itemAffected = categoryAffected.items[itemIndex];
        if (!Item.isQuantityValid(itemAffected.quantity + add)) return;

        const idChanged = await updateItemQuantity(
            itemAffected.id,
            itemAffected.quantity + add
        );
        if (idChanged === -1) return;

        itemAffected.add(add);
        setCategories([...categories]); // Force re-render
    };
    const handleAddItem = () => {
        // Add item to the database
    };

    if (!isFocused) return null;
    return (
        <ScrollView
            style={{
                flex: 1,
                backgroundColor: settingsCtx.theme.colors.background,
            }}
        >
            {categories.map((category, categoryIndex) => (
                <Category
                    key={categoryIndex}
                    categoryIndex={categoryIndex}
                    category={category}
                    cardViewSetting={settingsCtx.cardsView}
                    handleChangeQuantity={handleChangeQuantity}
                />
            ))}
            <View style={{ alignItems: "center" }}>
                <Button
                    onPress={handleAddItem}
                    style={styles.button}
                    colors={{
                        normal: settingsCtx.theme.colors.items.button.normal,
                        pressed: settingsCtx.theme.colors.items.button.pressed,
                    }}
                >
                    <Text>Add item</Text>
                </Button>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    button: {
        width: "80%",
        height: 40,
        margin: 10,
        borderWidth: 1,
        borderRadius: 10,
    },
});
