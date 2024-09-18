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
import {
    addCategory,
    deleteCategory,
    editCategoryName,
    fetchAllCategories,
    fetchCategoryByName,
} from "@/dataaccess/categoryRepository";

export default function Inventory() {
    const isFocused = useIsFocused();
    const { settingsCtx } = useSettingsContext();
    const { editionModeCtx, setEditionModeCtx } = useEditionModeContext();
    const { modalVisibleCtx } = useModalVisibleContext();
    const [categories, setCategories] = useState<CategoryObj[]>([]);
    const [categoriesWithoutItems, setCategoriesWithoutItems] = useState<CategoryObj[]>([]);

    useEffect(() => {
        async function fetchAll() {
            const items = await fetchAllItems();
            setCategories(items);
            const categories = await fetchAllCategories();
            setCategoriesWithoutItems(categories.filter((category) => !items.some((c) => c.id === category.id)));
        }
        fetchAll();
    }, []);

    const handleChangeQuantityItem = async (categoryIndex: number, itemIndex: number, add: number) => {
        const categoryAffected = categories[categoryIndex];
        const itemAffected = categoryAffected.items[itemIndex];
        if (!Item.isQuantityValid(itemAffected.quantity + add)) return;

        const idChanged = await updateItemQuantity(itemAffected.id, itemAffected.quantity + add);
        if (idChanged === -1) return;

        itemAffected.add(add);
        setCategories([...categories]); // Force re-render
    };
    const handleAddNewItem = async (category: CategoryObj, item: Item) => {
        if (!Item.isNameValid(item.name)) {
            throw new Error("Item name is required");
        }

        const itemFetched = await fetchItemByName(item.name.trim());
        if (itemFetched) {
            throw new Error("This item already exists");
        }

        const id = await addItem(item, category);
        const categoryFound = categories.find((c) => c.id === category.id);
        if (categoryFound) {
            categoryFound.items.push(new Item(id, item.name.trim(), item.quantity));
        } else {
            category.addItem(new Item(id, item.name.trim(), item.quantity));
            categories.push(category);
        }
        setCategories([...categories]); // Force re-render
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
    const handleAddNewCategory = async (category: CategoryObj): Promise<number> => {
        if (!CategoryObj.isNameValid(category.name)) {
            throw new Error("Category name is required");
        }

        const fetchedCategory = await fetchCategoryByName(category.name.trim());
        if (fetchedCategory) {
            throw new Error("This category already exists");
        }

        return await addCategory(category.name.trim());
    };
    const handleEditCategory = async (categoryIndex: number, category: CategoryObj) => {
        if (!CategoryObj.isNameValid(category.name)) {
            throw new Error("Category name is required");
        }

        const fetchedCategory = await fetchCategoryByName(category.name.trim());
        if (fetchedCategory) {
            throw new Error("This category already exists");
        }

        await editCategoryName(category.id, category.name.trim());
        if (categories[categoryIndex]?.id === category.id) {
            categories[categoryIndex].name = category.name.trim();
            setCategories([...categories]); // Force re-render
        } else {
            categoriesWithoutItems[categoryIndex].name = category.name.trim();
            setCategoriesWithoutItems([...categoriesWithoutItems]); // Force re-render
        }
    };
    const handleRemoveCategory = async (categoryIndex: number) => {
        const categoryAffected = categoriesWithoutItems[categoryIndex];

        if (categoryAffected.items.length > 0) {
            throw new Error("Category is not empty");
        }

        await deleteCategory(categoryAffected.id);

        categoriesWithoutItems.splice(categoryIndex, 1);
        setCategoriesWithoutItems([...categoriesWithoutItems]); // Force re-render
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
                        handleChangeQuantityItem={handleChangeQuantityItem}
                        handleRemoveItem={handleRemoveItem}
                        handleEditCategory={handleEditCategory}
                        handleRemoveCategory={handleRemoveCategory}
                    />
                ))}
                {editionModeCtx &&
                    categoriesWithoutItems.map((category, categoryIndex) => (
                        <Category
                            key={categoryIndex}
                            categoryIndex={categoryIndex}
                            category={category}
                            handleChangeQuantityItem={handleChangeQuantityItem}
                            handleRemoveItem={handleRemoveItem}
                            handleEditCategory={handleEditCategory}
                            handleRemoveCategory={handleRemoveCategory}
                        />
                    ))}
                <View style={{ alignItems: "center" }}>
                    {editionModeCtx ? (
                        <>
                            <AddThingModal
                                saveItem={handleAddNewItem}
                                saveCategory={handleAddNewCategory}
                                buttonStyle={styles.button}
                            />
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
