import { Item } from "@/model/Item";
import { Category } from "@/model/category";
import {
    getItemsGroupByCategory,
    updateQuantity,
} from "./database/itemdatabase";

export async function fetchAllItems(): Promise<Category[]> {
    try {
        return await getItemsGroupByCategory();
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
