import { StyleSheet, Text, View } from "react-native";

import { useSettingsContext } from "@/contexts/settingsContext";
import { useEditionModeContext } from "@/contexts/editionModeContext";
import { useInventoryContext } from "@/contexts/inventoryContext";
import PlusMinusButton from "../PlusMinusButton";
import EditItemModal from "./EditItemModal";
import { Item } from "@/model/Item";
import { Category } from "@/model/category";
import * as ItemRepository from "@/dataaccess/itemRepository";

interface ItemProps {
    item: Item;
    category: Category;
}

const SIZE = 110;

/**
 * A component that displays an item in a card
 * It displays the item name and its quantity
 *
 * @param props The component props : {item, category}
 * @returns The JSX element
 */
export default function ItemCard(props: ItemProps) {
    const { settingsCtx } = useSettingsContext();
    const { editionModeCtx } = useEditionModeContext();
    const { inventoryCtx, changeQuantityItem, renameItem, moveItem, removeItem } = useInventoryContext();

    const handleChangeQuantity = async (add: number) => {
        if (!Item.isQuantityValid(props.item.quantity + add)) return;

        await ItemRepository.editItemQuantity(props.item.id, props.item.quantity + add);

        changeQuantityItem(props.category.id, props.item.id, add);
    };

    const handleRenameItem = async (name: string) => {
        if (!Item.isNameValid(name)) {
            throw new Error("Item name is required");
        }

        const itemFetched = await ItemRepository.fetchItemByName(name.trim());
        if (itemFetched) {
            throw new Error("This item already exists");
        }

        await ItemRepository.editItemName(props.item.id, name);
        renameItem(props.category.id, props.item.id, name);
    };
    const handleMoveItem = async (newCategoryId: number) => {
        const newCategory = inventoryCtx.find((c) => c.id === newCategoryId);
        if (!newCategory) {
            throw new Error("Category does not exist");
        }

        await ItemRepository.editItemCategory(props.item.id, newCategory);
        moveItem(props.category.id, props.item.id, newCategoryId);
    };
    const handleRemoveItem = async () => {
        await ItemRepository.deleteItem(props.item.id);

        removeItem(props.category.id, props.item.id);
    };

    return (
        <View style={[styles.item, { backgroundColor: settingsCtx.theme.colors.items.background, height: SIZE }]}>
            <Text style={styles.name}>{props.item.name}</Text>
            <View style={styles.quantityBox}>
                {editionModeCtx ? (
                    <EditItemModal
                        item={props.item}
                        categoryName={props.category.name}
                        rename={handleRenameItem}
                        move={handleMoveItem}
                        remove={handleRemoveItem}
                    />
                ) : (
                    <>
                        <PlusMinusButton onPress={() => handleChangeQuantity(-1)} plus={false} />
                        <Text style={styles.quantity}>{props.item.quantity}</Text>
                        <PlusMinusButton onPress={() => handleChangeQuantity(1)} plus={true} />
                    </>
                )}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    item: {
        alignItems: "center",
        padding: 10,
        borderWidth: 1,
        borderRadius: 20,
        marginHorizontal: 7,
        marginVertical: 5,
        height: SIZE,
        width: SIZE,
    },
    name: {
        width: "100%",
        flexGrow: 1,
        textAlign: "center",
        fontSize: 15,
        marginTop: 5,
    },
    quantityBox: {
        flexDirection: "row",
        width: "100%",
        flexGrow: 2,
        alignItems: "center",
        justifyContent: "space-around",
        marginVertical: 5,
    },
    quantity: {
        width: "40%",
        textAlign: "center",
        fontSize: 15,
    },
});
