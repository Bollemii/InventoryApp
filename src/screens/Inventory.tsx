import { useEffect, useState } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { useIsFocused } from "@react-navigation/native";

import { useSettingsContext } from "@/contexts/settingsContext";
import { useEditionModeContext } from "@/contexts/editionModeContext";
import { useModalVisibleContext } from "@/contexts/modalVisibleContext";
import Category from "@/components/Category";
import Button from "@/components/Button";
import AddItemModal from "@/components/AddItemModal";
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
    const handleAddNewItem = async (category: CategoryObj, item?: Item): Promise<number> => {
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
            {modalVisibleCtx && <View style={styles.opacityView} />}
            <ScrollView>
                {categories.map((category, categoryIndex) => (
                    <Category
                        key={categoryIndex}
                        categoryIndex={categoryIndex}
                        category={category}
                        cardViewSetting={settingsCtx.cardsView}
                        handleChangeQuantity={handleChangeQuantity}
                        handleRemoveItem={handleRemoveItem}
                    />
                ))}
                <View style={{ alignItems: "center" }}>
                    {editionModeCtx ? (
                        <>
                            <AddItemModal save={handleAddNewItem} />
                            <Button
                                onPress={() => setEditionModeCtx(false)}
                                style={styles.button}
                                colors={{
                                    normal: settingsCtx.theme.colors.items.button.normal,
                                    pressed: settingsCtx.theme.colors.items.button.pressed,
                                }}
                            >
                                <Text>Quit edition mode</Text>
                            </Button>
                        </>
                    ) : (
                        <Button
                            onPress={() => setEditionModeCtx(true)}
                            style={styles.button}
                            colors={{
                                normal: settingsCtx.theme.colors.items.button.normal,
                                pressed: settingsCtx.theme.colors.items.button.pressed,
                            }}
                        >
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
    opacityView: {
        position: "absolute",
        height: "100%",
        width: "100%",
        zIndex: 1,
        backgroundColor: "black",
        opacity: 0.6,
    },
});
