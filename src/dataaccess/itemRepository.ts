import { Item } from "@/model/Item";
import { Category } from "@/model/category";
import { getAllGroupByCategory, getByName, insert, updateQuantity, deleteOne } from "./database/itemdatabase";
import { fetchCategoryById } from "./categoryRepository";
import { log } from "@/logger";

export async function fetchAllItems(): Promise<Category[]> {
    try {
        return getAllGroupByCategory();
    } catch (error) {
        log.error(`${error} (ItemRepository::fetchAllItems)`);
        throw error;
    }
}

export async function fetchItemByName(name: string): Promise<Item> {
    try {
        return getByName(name.trim());
    } catch (error) {
        log.error(`${error} (ItemRepository::fetchItemByName)`);
        throw error;
    }
}

export async function addItem(item: Item, category: Category): Promise<number> {
    try {
        if (!Item.isNameValid(item.name)) {
            throw new Error("Item name is invalid");
        }
        if (!Item.isQuantityValid(item.quantity)) {
            throw new Error("Item quantity out of bounds");
        }

        const categoryFetched = await fetchCategoryById(category.id);
        if (!categoryFetched) {
            throw new Error("Category not found");
        }
        const itemFetched = await fetchItemByName(item.name.trim());
        if (itemFetched) {
            throw new Error("Item already exists");
        }

        return insert(item.name.trim(), item.quantity, category.id);
    } catch (error) {
        log.error(`${error} (ItemRepository::addItem)`);
        throw error;
    }
}

export async function updateItemQuantity(id: number, quantity: number): Promise<number> {
    try {
        if (!Item.isQuantityValid(quantity)) {
            throw new Error("Item quantity out of bounds");
        }
        return updateQuantity(id, quantity);
    } catch (error) {
        log.error(`${error} (ItemRepository::updateItemQuantity)`);
        throw error;
    }
}

export async function deleteItem(id: number): Promise<number> {
    try {
        await deleteOne(id);
        return 0;
    } catch (error) {
        log.error(`${error} (ItemRepository::deleteItem)`);
        throw error;
    }
}
