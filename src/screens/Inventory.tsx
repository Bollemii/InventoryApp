import { useEffect, useState } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { useIsFocused } from "@react-navigation/native";

import { useSettingsContext } from "@/contexts/settingsContext";
import { useEditionModeContext } from "@/contexts/editionModeContext";
import { useModalVisibleContext } from "@/contexts/modalVisibleContext";
import Category from "@/components/inventory/Category";
import AddThingModal from "@/components/inventory/AddThingModal";
import Button from "@/components/Button";
import { Item } from "@/model/Item";
import { Category as CategoryObj } from "@/model/category";
import * as ItemRepository from "@/dataaccess/itemRepository";
import * as CategoryRepository from "@/dataaccess/categoryRepository";

export default function Inventory() {
    const isFocused = useIsFocused();
    const { settingsCtx } = useSettingsContext();
    const { editionModeCtx, setEditionModeCtx } = useEditionModeContext();
    const { modalVisibleCtx } = useModalVisibleContext();
    const [categories, setCategories] = useState<CategoryObj[]>([]);
    const [categoriesWithoutItems, setCategoriesWithoutItems] = useState<CategoryObj[]>([]);

    useEffect(() => {
        async function fetchAll() {
            const items = await ItemRepository.fetchAllItems();
            setCategories(items);
            const categories = await CategoryRepository.fetchAllCategories();
            setCategoriesWithoutItems(categories.filter((category) => !items.some((c) => c.id === category.id)));
        }
        fetchAll();
    }, []);

    const handleChangeQuantityItem = async (categoryIndex: number, itemIndex: number, add: number) => {
        const categoryAffected = categories[categoryIndex];
        const itemAffected = categoryAffected.items[itemIndex];
        if (!Item.isQuantityValid(itemAffected.quantity + add)) return;

        await ItemRepository.editItemQuantity(itemAffected.id, itemAffected.quantity + add);

        itemAffected.add(add);
        setCategories([...categories]); // Force re-render
    };
    const handleAddNewItem = async (category: CategoryObj, item: Item) => {
        if (!Item.isNameValid(item.name)) {
            throw new Error("Item name is required");
        }

        const itemFetched = await ItemRepository.fetchItemByName(item.name.trim());
        if (itemFetched) {
            throw new Error("This item already exists");
        }

        const id = await ItemRepository.addItem(item, category);
        const categoryFound = categories.find((c) => c.id === category.id);
        if (categoryFound) {
            categoryFound.items.push(new Item(id, item.name.trim(), item.quantity));
        } else {
            category.addItem(new Item(id, item.name.trim(), item.quantity));
            categories.push(category);
            categoriesWithoutItems.splice(
                categoriesWithoutItems.findIndex((c) => c.id === category.id),
                1
            );
        }
        setCategories([...categories]); // Force re-render
    };
    const handleEditItem = async (categoryIndex: number, itemIndex: number, item: Item, category: CategoryObj) => {        
        const categoryAffected = categories[categoryIndex];
        const itemAffected = categories[categoryIndex].items[itemIndex];

        if (itemAffected.name !== item.name) {            
            if (!Item.isNameValid(item.name)) {
                throw new Error("Item name is required");
            }

            const itemFetched = await ItemRepository.fetchItemByName(item.name.trim());
            if (itemFetched) {
                throw new Error("This item already exists");
            }

            itemAffected.name = item.name.trim();
            await ItemRepository.editItemName(itemAffected.id, itemAffected.name);
            setCategories([...categories]); // Force re-render
        }
        if (categoryAffected.id !== category.id) {            
            await ItemRepository.editItemCategory(itemAffected.id, category);

            const categoryFound = categories.find((c) => c.id === category.id);
            if (categoryFound) {
                categoryFound.items.push(itemAffected);
                categoryAffected.items.splice(itemIndex, 1);
            } else {
                category.addItem(itemAffected);
                categories.push(category);
                categoriesWithoutItems.splice(
                    categoriesWithoutItems.findIndex((c) => c.id === category.id),
                    1
                );
                categoryAffected.items.splice(itemIndex, 1);
                if (categoryAffected.items.length === 0) {
                    categoriesWithoutItems.push(categoryAffected);
                    categories.splice(categoryIndex, 1);
                }
            }
            setCategories([...categories]); // Force re-render
        }
    };
    const handleRemoveItem = async (categoryIndex: number, itemIndex: number) => {
        const itemAffected = categories[categoryIndex].items[itemIndex];

        await ItemRepository.deleteItem(itemAffected.id);

        categories[categoryIndex].items.splice(itemIndex, 1);
        if (categories[categoryIndex].items.length === 0) {
            categoriesWithoutItems.push(categories[categoryIndex]);
            categories.splice(categoryIndex, 1);
        }
        setCategories([...categories]); // Force re-render
    };
    const handleAddNewCategory = async (category: CategoryObj): Promise<number> => {
        if (!CategoryObj.isNameValid(category.name)) {
            throw new Error("Category name is required");
        }

        const fetchedCategory = await CategoryRepository.fetchCategoryByName(category.name.trim());
        if (fetchedCategory) {
            throw new Error("This category already exists");
        }

        categoriesWithoutItems.push(category);
        return await CategoryRepository.addCategory(category.name.trim());
    };
    const handleEditCategory = async (categoryIndex: number, category: CategoryObj) => {
        if (!CategoryObj.isNameValid(category.name)) {
            throw new Error("Category name is required");
        }

        const fetchedCategory = await CategoryRepository.fetchCategoryByName(category.name.trim());
        if (fetchedCategory) {
            throw new Error("This category already exists");
        }

        await CategoryRepository.editCategoryName(category.id, category.name.trim());
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

        await CategoryRepository.deleteCategory(categoryAffected.id);

        categoriesWithoutItems.splice(categoryIndex, 1);
        setCategoriesWithoutItems([...categoriesWithoutItems]); // Force re-render
    };

    if (!isFocused) return null;
    return (
        <>
        {modalVisibleCtx && <View style={styles.opacityView} /> /* Modal opacity background */}
        <View
            style={{
                flex: 1,
                backgroundColor: settingsCtx.theme.colors.background,
            }}
        >
            <ScrollView>
                {categories.map((category, categoryIndex) => (
                    <Category
                        key={categoryIndex}
                        categoryIndex={categoryIndex}
                        category={category}
                        handleChangeQuantityItem={handleChangeQuantityItem}
                        handleEditItem={handleEditItem}
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
                            handleEditItem={handleEditItem}
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
        </>
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
