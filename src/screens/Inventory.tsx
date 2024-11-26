import { ScrollView, StyleSheet, Text, View } from "react-native";
import { useIsFocused } from "@react-navigation/native";

import { useSettingsContext } from "@/contexts/settingsContext";
import { useEditionModeContext } from "@/contexts/editionModeContext";
import { useModalVisibleContext } from "@/contexts/modalVisibleContext";
import { useInventoryContext } from "@/contexts/inventoryContext";
import Category from "@/components/inventory/Category";
import AddThingModal from "@/components/inventory/AddThingModal";
import Button from "@/components/Button";
import { Item } from "@/model/Item";
import { Category as CategoryObj } from "@/model/category";
import * as ItemRepository from "@/dataaccess/itemRepository";
import * as CategoryRepository from "@/dataaccess/categoryRepository";

/**
 * The inventory screen
 * It displays the categories and items
 * It allows to add, edit or remove items and categories
 *
 * @returns The JSX element
 */
export default function Inventory() {
    const isFocused = useIsFocused();
    const { settingsCtx } = useSettingsContext();
    const { editionModeCtx, setEditionModeCtx } = useEditionModeContext();
    const { modalVisibleCtx } = useModalVisibleContext();
    const { inventoryCtx, addItem, addCategory } = useInventoryContext();

    const handleAddNewItem = async (category: CategoryObj, item: Item) => {
        if (!Item.isNameValid(item.name)) {
            throw new Error("Item name is required");
        }

        const itemFetched = await ItemRepository.fetchItemByName(item.name.trim());
        if (itemFetched) {
            throw new Error("This item already exists");
        }

        const id = await ItemRepository.addItem(item, category);
        item.id = id;
        addItem(category.id, item);
    };
    const handleAddNewCategory = async (category: CategoryObj): Promise<number> => {
        if (!CategoryObj.isNameValid(category.name)) {
            throw new Error("Category name is required");
        }

        const fetchedCategory = await CategoryRepository.fetchCategoryByName(category.name.trim());
        if (fetchedCategory) {
            throw new Error("This category already exists");
        }
        const id = await CategoryRepository.addCategory(category.name.trim());
        category.id = id;
        addCategory(category);
        return id;
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
                    {inventoryCtx
                        .filter((category) => category.items.length > 0)
                        .map((category, categoryIndex) => (
                            <Category key={categoryIndex} categoryIndex={categoryIndex} category={category} />
                        ))}
                    {editionModeCtx &&
                        inventoryCtx
                            .filter((category) => category.items.length === 0)
                            .map((category, categoryIndex) => (
                                <Category key={categoryIndex} categoryIndex={categoryIndex} category={category} />
                            ))}
                    <View style={{ alignItems: "center" }}>
                        {editionModeCtx ? (
                            <>
                                <AddThingModal
                                    buttonStyle={styles.button}
                                    saveItem={handleAddNewItem}
                                    saveCategory={handleAddNewCategory}
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
