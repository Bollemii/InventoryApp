import { useEffect, useState } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { useIsFocused } from "@react-navigation/native";

import Category from "@/components/Category";
import { Item } from "@/model/Item";
import { Category as CategoryObj } from "@/model/category";
import { fetchAllItems, updateItemQuantity } from "@/dataaccess/itemRepository";
import { getCardViewSetting } from "@/dataaccess/settingsRepository";
import { colors } from "@/styles/colors";

export default function Inventory() {
    const isFocused = useIsFocused();
    const [categories, setCategories] = useState<CategoryObj[]>([]);
    const [cardViewSetting, setCardViewSetting] = useState(false);
    
    useEffect(() => {        
        fetchAllItems().then((categories) => setCategories(categories));
        getCardViewSetting().then((value) => setCardViewSetting(value));
    }, []);

    useEffect(() => {
        if (!isFocused) return;

        getCardViewSetting().then((value) => setCardViewSetting(value));
    }, [isFocused]);

    const handleChangeQuantity = async (categoryIndex: number, itemIndex: number, add: number) => {
        const categoryAffected = categories[categoryIndex]
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

    return (
        <ScrollView style={styles.container}>
            {categories.map((category, categoryIndex) => (
                <Category
                    key={categoryIndex}
                    categoryIndex={categoryIndex}
                    category={category}
                    cardViewSetting={cardViewSetting}
                    handleChangeQuantity={handleChangeQuantity}
                />
            ))}
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.white,
    },
});
