import { Category } from "@/model/category";
import { getAll, getById, getByName, insert } from "./database/categoryDatabase";

export async function fetchAllCategories(): Promise<Category[]> {
    try {
        return getAll();
    } catch (error) {
        console.error(error);
        return [];
    }
}

export async function fetchCategoryById(id: number): Promise<Category> {
    try {
        return getById(id);
    } catch (error) {
        console.error(error);
        return null;
    }
}

export async function fetchCategoryByName(name: string): Promise<Category> {
    try {
        return getByName(name);
    } catch (error) {
        console.error(error);
        return null;
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
        console.error(error);
        return -1;
    }
}
