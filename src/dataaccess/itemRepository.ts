import { Item } from "@/model/Item";
import { Category } from "@/model/category";
import { getAllGroupByCategory, getByName, insert, updateQuantity, deleteOne, updateName, updateCategory } from "./database/itemdatabase";
import { fetchCategoryById } from "./categoryRepository";
import { log } from "@/logger";

/**
 * Fetch all items
 * 
 * @returns A promise that resolves to all items
 */
export async function fetchAllItems(): Promise<Category[]> {
    try {
        return getAllGroupByCategory();
    } catch (error) {
        log.error(`${error} (ItemRepository::fetchAllItems)`);
        throw error;
    }
}

/**
 * Fetch an item by its name
 * 
 * @param name The name of the item to fetch
 * @returns A promise that resolves to the item
 */
export async function fetchItemByName(name: string): Promise<Item> {
    try {
        return getByName(name.trim());
    } catch (error) {
        log.error(`${error} (ItemRepository::fetchItemByName)`);
        throw error;
    }
}

/**
 * Add an item
 * 
 * @param item The item to add
 * @param category The category to add the item to
 * @returns A promise that resolves to the ID of the added item
 */
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

/**
 * Edit an item's quantity
 * 
 * @param id The ID of the item to edit
 * @param quantity The new quantity of the item
 */
export async function editItemQuantity(id: number, quantity: number) {
    try {
        if (!Item.isQuantityValid(quantity)) {
            throw new Error("Item quantity out of bounds");
        }
        await updateQuantity(id, quantity);
    } catch (error) {
        log.error(`${error} (ItemRepository::updateItemQuantity)`);
        throw error;
    }
}

/**
 * Edit an item's name
 * 
 * @param id The ID of the item to edit
 * @param name The new name of the item
 */
export async function editItemName(id: number, name: string) {
    try {
        if (!Item.isNameValid(name)) {
            throw new Error("Item name is invalid");
        }

        const itemFetched = await fetchItemByName(name.trim());
        if (itemFetched) {
            throw new Error("Item already exists");
        }
        
        await updateName(id, name.trim());
    } catch (error) {
        log.error(`${error} (ItemRepository::editItemName)`);
        throw error;
    }
}

/**
 * Edit an item's category
 * 
 * @param id The ID of the item to edit
 * @param category The new category of the item
 */
export async function editItemCategory(id: number, category: Category) {
    try {
        const categoryFetched = await fetchCategoryById(category.id);
        if (!categoryFetched) {
            throw new Error("Category not found");
        }

        await updateCategory(id, category.id);
    } catch (error) {
        log.error(`${error} (ItemRepository::editItemCategory)`);
        throw error;
    }
}

/**
 * Delete an item
 * 
 * @param id The ID of the item to delete
 */
export async function deleteItem(id: number) {
    try {
        await deleteOne(id);
    } catch (error) {
        log.error(`${error} (ItemRepository::deleteItem)`);
        throw error;
    }
}
