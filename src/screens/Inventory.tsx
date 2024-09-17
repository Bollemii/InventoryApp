import { useEffect, useState } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { useIsFocused } from "@react-navigation/native";

import { useSettingsContext } from "@/contexts/settingsContext";
import { useEditionModeContext } from "@/contexts/editionModeContext";
import { useModalVisibleContext } from "@/contexts/modalVisibleContext";
import Category from "@/components/Category";
import Button from "@/components/Button";
import AddThingModal from "@/components/AddThingModal";
import { Item } from "@/model/Item";
import { Category as CategoryObj } from "@/model/category";
import { addItem, deleteItem, fetchAllItems, fetchItemByName, updateItemQuantity } from "@/dataaccess/itemRepository";
import { addCategory, fetchCategoryByName } from "@/dataaccess/categoryRepository";

export default function Inventory() {
    const isFocused = useIsFocused();
    const { settingsCtx } = useSettingsContext();
    const { editionModeCtx, setEditionModeCtx } = useEditionModeContext();
    const { modalVisibleCtx } = useModalVisibleContext();
    const [categories, setCategories] = useState<CategoryObj[]>([]);

    useEffect(() => {
        fetchAllItems().then((categories) => setCategories(categories));
    }, []);

    const handleChangeQuantity = async (categoryIndex: number, itemIndex: number, add: number) => {
        const categoryAffected = categories[categoryIndex];
        const itemAffected = categoryAffected.items[itemIndex];
        if (!Item.isQuantityValid(itemAffected.quantity + add)) return;

        const idChanged = await updateItemQuantity(itemAffected.id, itemAffected.quantity + add);
        if (idChanged === -1) return;

        itemAffected.add(add);
        setCategories([...categories]); // Force re-render
    };
    const handleAddNewThing = async (category: CategoryObj, item?: Item): Promise<number> => {
        let id: number;
        if (!item) {
            // add new category
            if (!CategoryObj.isNameValid(category.name)) {
                throw new Error("Category name is required");
            }

            const fetchedCategory = await fetchCategoryByName(category.name);
            if (fetchedCategory) {
                throw new Error("This category already exists");
            }

            id = await addCategory(category.name);
        } else {
            // add new item
            if (!Item.isNameValid(item.name)) {
                throw new Error("Item name is required");
            }

            const itemFetched = await fetchItemByName(item.name);
            if (itemFetched) {
                throw new Error("This item already exists");
            }

            id = await addItem(item, category);
            const categoryFound = categories.find((c) => c.id === category.id);
            if (categoryFound) {
                categoryFound.items.push(new Item(id, item.name, item.quantity));
            } else {
                category.addItem(new Item(id, item.name, item.quantity));
                categories.push(category);
            }
            setCategories([...categories]); // Force re-render
        }

        return id;
    };
    const handleRemoveItem = async (categoryIndex: number, itemIndex: number) => {
        const itemAffected = categories[categoryIndex].items[itemIndex];

        const finishId = await deleteItem(itemAffected.id);
        if (finishId === -1) return;

        categories[categoryIndex].items.splice(itemIndex, 1);
        if (categories[categoryIndex].items.length === 0) {
            categories.splice(categoryIndex, 1);
        }
        setCategories([...categories]); // Force re-render
    };

    if (!isFocused) return null;
    return (
        <View
            style={{
                flex: 1,
                backgroundColor: settingsCtx.theme.colors.background,
            }}
        >
            {modalVisibleCtx && <View style={styles.opacityView} /> /* Modal opacity background */}
            <ScrollView>
                {categories.map((category, categoryIndex) => (
                    <Category
                        key={categoryIndex}
                        categoryIndex={categoryIndex}
                        category={category}
                        handleChangeQuantity={handleChangeQuantity}
                        handleRemoveItem={handleRemoveItem}
                    />
                ))}
                <View style={{ alignItems: "center" }}>
                    {editionModeCtx ? (
                        <>
                            <AddThingModal save={handleAddNewThing} buttonStyle={styles.button} />
                            <Button onPress={() => setEditionModeCtx(false)} style={styles.button}>
                                <Text>Quit edition mode</Text>
                            </Button>
                        </>
                    ) : (
                        <Button onPress={() => setEditionModeCtx(true)} style={styles.button}>
                            <Text>Edition mode</Text>
                        </Button>
                    )}
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
        marginBottom: 5,
        borderWidth: 1,
        borderRadius: 10,
    },
    opacityView: {
        position: "absolute",
        height: "100%",
        width: "100%",
        zIndex: 1,
        backgroundColor: "black",
        opacity: 0.6,
    },
});
