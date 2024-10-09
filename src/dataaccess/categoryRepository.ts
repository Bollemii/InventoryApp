import { Category } from "@/model/category";
import { getAll, getById, getByName, insert, remove, updateName } from "./database/categoryDatabase";
import { log } from "@/logger";

/**
 * Fetch all categories
 * 
 * @returns A promise that resolves to all categories
 */
export async function fetchAllCategories(): Promise<Category[]> {
    try {
        return getAll();
    } catch (error) {
        log.error(`${error} (CategoryRepository::fetchAllCategories)`);
        throw error;
    }
}

/**
 * Fetch a category by its ID
 * 
 * @param id The ID of the category to fetch
 * @returns A promise that resolves to the category
 */
export async function fetchCategoryById(id: number): Promise<Category> {
    try {
        return getById(id);
    } catch (error) {
        log.error(`${error} (CategoryRepository::fetchCategoryById)`);
        throw error;
    }
}

/**
 * Fetch a category by its name
 * 
 * @param name The name of the category to fetch
 * @returns A promise that resolves to the category
 */
export async function fetchCategoryByName(name: string): Promise<Category> {
    try {
        return getByName(name.trim());
    } catch (error) {
        log.error(`${error} (CategoryRepository::fetchCategoryByName)`);
        throw error;
    }
}

/**
 * Add a category
 * 
 * @param name The name of the category
 * @returns A promise that resolves to the ID of the added category
 */
export async function addCategory(name: string): Promise<number> {
    try {
        if (!Category.isNameValid(name)) {
            throw new Error("Category name is invalid");
        }

        const categoryFetched = await fetchCategoryByName(name.trim());
        if (categoryFetched) {
            throw new Error("Category already exists");
        }

        return insert(name.trim());
    } catch (error) {
        log.error(`${error} (CategoryRepository::addCategory)`);
        throw error;
    }
}

/**
 * Edit a category name
 * 
 * @param id The ID of the category to edit
 * @param name The new name of the category
 */
export async function editCategoryName(id: number, name: string) {
    try {
        if (!Category.isNameValid(name)) {
            throw new Error("Category name is invalid");
        }

        const categoryFetched = await fetchCategoryByName(name.trim());
        if (categoryFetched) {
            throw new Error("Category already exists");
        }

        await updateName(id, name.trim());
    } catch (error) {
        log.error(`${error} (CategoryRepository::editCategoryName)`);
        throw error;
    }
}

/**
 * Delete a category
 * 
 * @param id The ID of the category to delete
 */
export async function deleteCategory(id: number) {
    try {
        const category = await fetchCategoryById(id);
        if (category.items.length > 0) {
            throw new Error("Category is not empty");
        }

        await remove(id);
    } catch (error) {
        log.error(`${error} (CategoryRepository::deleteCategory)`);
        throw error;
    }
}
