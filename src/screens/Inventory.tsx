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
    const [rerender, setRerender] = useState(false);
    const { settingsCtx } = useSettingsContext();
    const { editionModeCtx, setEditionModeCtx } = useEditionModeContext();
    const { modalVisibleCtx } = useModalVisibleContext();
    const [categories, setCategories] = useState<CategoryObj[]>([]);
    const [categoriesWithoutItems, setCategoriesWithoutItems] = useState<CategoryObj[]>([]);

    useEffect(() => {
        async function fetchAll() {
            const catItems = await ItemRepository.fetchAllItems();
            catItems.forEach((cat) => {
                sortArray(cat.items);
            });
            sortArray(catItems);
            setCategories(catItems);

            let catEmpty = await CategoryRepository.fetchAllCategories();
            catEmpty = catEmpty.filter((category) => !catItems.some((c) => c.id === category.id));
            sortArray(catEmpty);
            setCategoriesWithoutItems(catEmpty);
        }
        fetchAll();
    }, []);

    const sortArray = (array: { name: string }[]) => {
        array.sort((a, b) => a.name.localeCompare(b.name));
    };

    const handleChangeQuantityItem = async (categoryIndex: number, itemIndex: number, add: number) => {
        const categoryAffected = categories[categoryIndex];
        const itemAffected = categoryAffected.items[itemIndex];
        if (!Item.isQuantityValid(itemAffected.quantity + add)) return;

        await ItemRepository.editItemQuantity(itemAffected.id, itemAffected.quantity + add);

        itemAffected.add(add);
        setRerender(!rerender);
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
            sortArray(categoryFound.items);
        } else {
            category.addItem(new Item(id, item.name.trim(), item.quantity));
            categories.push(category);
            sortArray(categories)
            categoriesWithoutItems.splice(
                categoriesWithoutItems.findIndex((c) => c.id === category.id),
                1
            );
        }
        setRerender(!rerender);
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
            sortArray(categoryAffected.items);
        }
        if (categoryAffected.id !== category.id) {            
            await ItemRepository.editItemCategory(itemAffected.id, category);

            const categoryFound = categories.find((c) => c.id === category.id);
            if (categoryFound) {
                categoryFound.items.push(itemAffected);
                sortArray(categoryFound.items);
                categoryAffected.items.splice(itemIndex, 1);
                if (categoryAffected.items.length === 0) {
                    categoriesWithoutItems.push(categoryAffected);
                    sortArray(categoriesWithoutItems);
                    categories.splice(categoryIndex, 1);
                }
            } else {
                category.addItem(itemAffected);
                categories.push(category);
                sortArray(categories)
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
        }
        setRerender(!rerender);
    };
    const handleRemoveItem = async (categoryIndex: number, itemIndex: number) => {
        const itemAffected = categories[categoryIndex].items[itemIndex];

        await ItemRepository.deleteItem(itemAffected.id);

        categories[categoryIndex].items.splice(itemIndex, 1);
        if (categories[categoryIndex].items.length === 0) {
            categoriesWithoutItems.push(categories[categoryIndex]);
            sortArray(categoriesWithoutItems);
            categories.splice(categoryIndex, 1);
        }
        setRerender(!rerender);
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
        sortArray(categoriesWithoutItems);
        setRerender(!rerender);
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
            sortArray(categories);
        } else {
            categoriesWithoutItems[categoryIndex].name = category.name.trim();
            sortArray(categoriesWithoutItems);
        }
        setRerender(!rerender);
    };
    const handleRemoveCategory = async (categoryIndex: number) => {
        const categoryAffected = categoriesWithoutItems[categoryIndex];

        if (categoryAffected.items.length > 0) {
            throw new Error("Category is not empty");
        }

        await CategoryRepository.deleteCategory(categoryAffected.id);

        categoriesWithoutItems.splice(categoryIndex, 1);
        sortArray(categoriesWithoutItems);
        setRerender(!rerender);
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
