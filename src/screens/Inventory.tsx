import { useEffect, useState } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { useIsFocused } from "@react-navigation/native";

import Category from "@/components/Category";
import { Item } from "@/model/Item";
import { Category as CategoryObj } from "@/model/category";
import { addItem, fetchAllItems, updateItemQuantity } from "@/dataaccess/itemRepository";
import { useSettingsContext } from "@/contexts/settingsContext";
import Button from "@/components/Button";
import AddItemModal from "@/components/AddItemModal";
import { addCategory } from "@/dataaccess/categoryRepository";

export default function Inventory() {
    const isFocused = useIsFocused();
    const { settingsCtx } = useSettingsContext();
    const [categories, setCategories] = useState<CategoryObj[]>([]);
    const [showAddItemModal, setShowAddItemModal] = useState(false);

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
    const handleAddItem = async (category: CategoryObj, item?: Item) : Promise<number> => {
        let id : number;
        if (!item) {
            // add new category
            if (!CategoryObj.isNameValid(category.name)) return -1;

            id = await addCategory(category.name);
        } else {
            // add new item
            if (!Item.isNameValid(item.name)) return -1;
            
            id = await addItem(item, category);
            if (id === -1) return -1;
            const categoryFound = categories.find((c) => c.id === category.id);
            if (categoryFound) {
                categoryFound.items.push(new Item(id, item.name, item.quantity));
            } else {
                category.addItem(new Item(id, item.name, item.quantity));
                categories.push(category);
            }
            setCategories([...categories]);
        }

        setShowAddItemModal(false);
        return id;
    };

    if (!isFocused) return null;
    return (
        <View
            style={{
                flex: 1,
                backgroundColor: settingsCtx.theme.colors.background,
            }}
        >
            <AddItemModal
                visible={showAddItemModal}
                close={() => setShowAddItemModal(false)}
                save={handleAddItem}
            />
            <ScrollView>
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
                        onPress={() => setShowAddItemModal(true)}
                        style={styles.button}
                        colors={{
                            normal: settingsCtx.theme.colors.items.button
                                .normal,
                            pressed:
                                settingsCtx.theme.colors.items.button.pressed,
                        }}
                    >
                        <Text>Add something</Text>
                    </Button>
                </View>
            </ScrollView>
        </View>
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
    modal: {
        alignSelf: "center",
        justifyContent: "center",
        alignItems: "center",
        top: "35%",
        height: "30%",
        width: "50%",
        backgroundColor: "white",
        borderWidth: 1,
        elevation: 10,
    },
});
