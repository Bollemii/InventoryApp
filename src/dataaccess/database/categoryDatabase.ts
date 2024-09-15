import { Category } from "@/model/category";
import * as database from "./common/sqliteDatabase";

export async function initializeCategoryDatabase() {
    database.execute(`
        CREATE TABLE IF NOT EXISTS categories (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL UNIQUE
        );
    `);
}

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
        { $name: name }
    );
    if (!result) return null;
    return new Category(result.id, result.name);
}

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
        { $name: name }
    );
    return result.lastInsertRowId;
}
