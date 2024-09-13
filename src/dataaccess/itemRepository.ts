import { Item } from "@/model/Item";
import { Category } from "@/model/category";
import {
    getAllGroupByCategory,
    getByName,
    insert,
    updateQuantity,
} from "./database/itemdatabase";
import { fetchCategoryById } from "./categoryRepository";

export async function fetchAllItems(): Promise<Category[]> {
    try {
        return getAllGroupByCategory();
    } catch (error) {
        console.error(error);
        return [];
    }
}

export async function fetchItemByName(name: string): Promise<Item> {
    try {
        return getByName(name);
    } catch (error) {
        console.error(error);
        return null;
    }
}

export async function addItem(
    item: Item,
    category: Category
): Promise<number> {
    try {
        if (!Item.isNameValid(item.name)) {
            throw new Error("Item name is invalid");
        }
        if (!Item.isQuantityValid(item.quantity)) {
            throw new Error("Item quantity out of bounds");
        }
        console.log(item, category);
        
        const categoryFetched = await fetchCategoryById(category.id);
        if (!categoryFetched) {
            throw new Error("Category not found");
        }
        const itemFetched = await fetchItemByName(item.name);
        if (itemFetched) {
            throw new Error("Item already exists");
        }

        return insert(item.name, item.quantity, category.id);
    } catch (error) {
        console.error(error);
        return -1;
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
        return updateQuantity(id, quantity);
    } catch (error) {
        console.error(error);
        return -1;
    }
}
