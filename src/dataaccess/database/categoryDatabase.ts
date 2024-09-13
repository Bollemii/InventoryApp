import { Category } from "@/model/category";
import * as sqlite from "expo-sqlite";

const db = sqlite.openDatabaseSync("inventory");

export async function initializeCategoryDatabase() {
    db.execAsync(`
        CREATE TABLE IF NOT EXISTS categories (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL UNIQUE
        );
    `);
}

export async function getAll(): Promise<Category[]> {
    await initializeCategoryDatabase();

    const statement = await db.prepareAsync(`
        SELECT id, name
        FROM categories
    `);
    interface Result {
        id: number;
        name: string
    }

    try {
        const result = (await (
            await statement.executeAsync()
        ).getAllAsync()) as Result[];
        if (result.length === 0) return [];
        return result.map((category) => new Category(category.id, category.name));
    } finally {
        statement.finalizeAsync();
    }
}

export async function getById(id: number): Promise<Category> {
    await initializeCategoryDatabase();

    const statement = await db.prepareAsync(`
        SELECT id, name
        FROM categories
        WHERE id = $id
    `);
    interface Result {
        id: number;
        name: string
    }

    try {
        const result = (await (
            await statement.executeAsync({$id: id})
        ).getFirstAsync()) as Result;
        if (!result) return null;
        return new Category(result.id, result.name);
    } finally {
        statement.finalizeAsync();
    }
}

export async function getByName(name: string): Promise<Category> {
    await initializeCategoryDatabase();

    const statement = await db.prepareAsync(`
        SELECT id, name
        FROM categories
        WHERE name = $name
    `);
    interface Result {
        id: number;
        name: string
    }

    try {
        const result = (await (
            await statement.executeAsync({$name: name})
        ).getFirstAsync()) as Result;
        if (!result) return null;
        return new Category(result.id, result.name);
    } finally {
        statement.finalizeAsync();
    }
}

export async function insert(name: string): Promise<number> {
    await initializeCategoryDatabase();

    if (!Category.isNameValid(name)) {
        throw new Error("Category name is invalid");
    }

    const statement = await db.prepareAsync(`
        INSERT INTO categories (name)
        VALUES ($name)
    `);
    try {
        const result = await statement.executeAsync({$name: name});
        return result.lastInsertRowId;
    } finally {
        statement.finalizeAsync();
    }
}
