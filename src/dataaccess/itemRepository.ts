import { Item } from "@/model/Item";
import { getItems, updateQuantity } from "./itemdatabase";

export async function fetchAllItems(): Promise<Item[]> {
    try {
        return await getItems();
    } catch (error) {
        console.error(error);
        return [];
    }
}

export async function updateItemQuantity(
    id: number,
    quantity: number
): Promise<number> {
    try {
        if (!Item.isQuantityValid(quantity)) {
            throw new Error("Item quantity out of bounds");
        }
        return await updateQuantity(id, quantity);
    } catch (error) {
        console.error(error);
        return -1;
    }
}
