import { Category } from "@/model/category";
import { getAll, getById, getByName, insert } from "./database/categoryDatabase";
import { log } from "@/logger";

export async function fetchAllCategories(): Promise<Category[]> {
    try {
        return getAll();
    } catch (error) {
        log.error(`${error} (CategoryRepository::fetchAllCategories)`);
        throw error;
    }
}

export async function fetchCategoryById(id: number): Promise<Category> {
    try {
        return getById(id);
    } catch (error) {
        log.error(`${error} (CategoryRepository::fetchCategoryById)`);
        throw error;
    }
}

export async function fetchCategoryByName(name: string): Promise<Category> {
    try {
        return getByName(name);
    } catch (error) {
        log.error(`${error} (CategoryRepository::fetchCategoryByName)`);
        throw error;
    }
}

export async function addCategory(name: string): Promise<number> {
    try {
        if (!Category.isNameValid(name)) {
            throw new Error("Category name is invalid");
        }

        const categoryFetched = await fetchCategoryByName(name);
        if (categoryFetched) {
            throw new Error("Category already exists");
        }

        return insert(name);
    } catch (error) {
        log.error(`${error} (CategoryRepository::addCategory)`);
        throw error;
    }
}
