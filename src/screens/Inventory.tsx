import { useEffect, useState } from "react";
import { ScrollView, StyleSheet } from "react-native";
import { useIsFocused } from "@react-navigation/native";

import Category from "@/components/Category";
import { Item } from "@/model/Item";
import { Category as CategoryObj } from "@/model/category";
import { fetchAllItems, updateItemQuantity } from "@/dataaccess/itemRepository";
import { useSettingsContext } from "@/contexts/settingsContext";

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

    if (!isFocused) return null;
    return (
        <ScrollView
            style={[
                styles.container,
                { backgroundColor: settingsCtx.theme.colors.background },
            ]}
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
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
});
