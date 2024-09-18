import { Item } from "@/model/Item";
import { Category } from "@/model/category";
import { getAllGroupByCategory, getByName, insert, updateQuantity, deleteOne, updateName, updateCategory } from "./database/itemdatabase";
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

export async function deleteItem(id: number) {
    try {
        await deleteOne(id);
    } catch (error) {
        log.error(`${error} (ItemRepository::deleteItem)`);
        throw error;
    }
}
