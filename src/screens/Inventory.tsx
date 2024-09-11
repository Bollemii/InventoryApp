import { useEffect, useState } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { useIsFocused } from "@react-navigation/native";

import Category from "@/components/Category";
import { Item } from "@/model/Item";
import { Category as CategoryObj } from "@/model/category";
import { fetchAllItems, updateItemQuantity } from "@/dataaccess/itemRepository";
import { getCardViewSetting, getThemeSetting } from "@/dataaccess/settingsRepository";
import { colorScheme } from "@/styles/colors";

export default function Inventory() {
    const [theme, setTheme] = useState(colorScheme.dark);
    const isFocused = useIsFocused();
    const [categories, setCategories] = useState<CategoryObj[]>([]);
    const [cardViewSetting, setCardViewSetting] = useState(false);
    
    useEffect(() => {
        getThemeSetting().then((theme) => { setTheme(theme) });
        fetchAllItems().then((categories) => setCategories(categories));
        getCardViewSetting().then((value) => setCardViewSetting(value));
    }, []);
    useEffect(() => {
        if (!isFocused) return;

        getThemeSetting().then((theme) => { setTheme(theme) });
        getCardViewSetting().then((value) => setCardViewSetting(value));
    }, [isFocused]);

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

    return (
        <ScrollView style={[styles.container, {backgroundColor: theme.colors.background}]}>
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
    },
});
