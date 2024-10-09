import { Category } from "@/model/category";
import * as database from "./common/sqliteDatabase";

/**
 * Initialize the category database
 */
export async function initializeCategoryDatabase() {
    database.execute(`
        CREATE TABLE IF NOT EXISTS categories (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL UNIQUE
        );
    `);
}

/**
 * Fetch all categories
 * 
 * @returns A promise that resolves to all categories
 */
export async function getAll(): Promise<Category[]> {
    await initializeCategoryDatabase();
    interface Result {
        id: number;
        name: string;
    }

    const result = (await database.getAll(`
        SELECT id, name
        FROM categories
    `)) as Result[];
    if (result.length === 0) return [];
    return result.map((category) => new Category(category.id, category.name));
}

/**
 * Fetch a category by ID
 * 
 * @param id The ID of the category
 * @returns A promise that resolves to the category
 */
export async function getById(id: number): Promise<Category> {
    await initializeCategoryDatabase();
    interface Result {
        id: number;
        name: string;
    }

    const result = (await database.getOne(
        `
        SELECT id, name
        FROM categories
        WHERE id = $id
    `,
        { $id: id }
    )) as Result;
    if (!result) return null;
    return new Category(result.id, result.name);
}

/**
 * Fetch a category by name
 * 
 * @param name The name of the category
 * @returns A promise that resolves to the category
 */
export async function getByName(name: string): Promise<Category> {
    await initializeCategoryDatabase();
    interface Result {
        id: number;
        name: string;
    }

    const result = await database.getOne(
        `
        SELECT id, name
        FROM categories
        WHERE name = $name
    `,
        { $name: name.trim() }
    ) as Result;
    if (!result) return null;
    return new Category(result.id, result.name);
}

/**
 * Insert a category
 * 
 * @param name The name of the category
 * @returns A promise that resolves to the ID of the inserted category
 */
export async function insert(name: string): Promise<number> {
    await initializeCategoryDatabase();

    if (!Category.isNameValid(name)) {
        throw new Error("Category name is invalid");
    }

    const result = await database.executeStatement(
        `
        INSERT INTO categories (name)
        VALUES ($name)
    `,
        { $name: name.trim() }
    );
    return result.lastInsertRowId;
}

/**
 * Update the name of a category
 * 
 * @param id The ID of the category
 * @param name The new name of the category
 */
export async function updateName(id: number, name: string) {
    await initializeCategoryDatabase();

    if (!Category.isNameValid(name)) {
        throw new Error("Category name is invalid");
    }

    await database.executeStatement(
        `
        UPDATE categories
        SET name = $name
        WHERE id = $id
    `,
        { $name: name.trim(), $id: id }
    );
}

/**
 * Remove a category
 * 
 * @param id The ID of the category
 */
export async function remove(id: number) {
    await initializeCategoryDatabase();

    await database.executeStatement(
        `
        DELETE FROM categories
        WHERE id = $id
    `,
        { $id: id }
    );
}
