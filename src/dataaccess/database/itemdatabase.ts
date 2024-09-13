import * as sqlite from "expo-sqlite";

import { Item } from "@/model/Item";
import { Category } from "@/model/category";
import { groupBy } from "@/utils";
import { initializeCategoryDatabase } from "./categoryDatabase";

const db = sqlite.openDatabaseSync("inventory");

export async function initializeItemDatabase() {
    await initializeCategoryDatabase();
    db.execAsync(`
        CREATE TABLE IF NOT EXISTS items (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL UNIQUE,
            quantity INTEGER,
            category INTEGER REFERENCES categories(id)
        );
    `);
}

export async function getAllGroupByCategory(): Promise<Category[]> {
    await initializeItemDatabase();

    const statement = await db.prepareAsync(`
        SELECT items.id, items.name, items.quantity, categories.id as categoryId, categories.name as categoryName
        FROM items
        INNER JOIN categories ON items.category = categories.id
    `);
    interface Result {
        id: number;
        name: string;
        quantity: number;
        categoryId: number;
        categoryName: string;
    }

    try {
        const result = (await (await statement.executeAsync()).getAllAsync()) as Result[];
        if (result.length === 0) return [];
        const categories = groupBy(result, "categoryName");
        return Object.keys(categories)
            .map((key) => {
                return {
                    id: categories[key][0].categoryId,
                    name: key,
                    items: categories[key].map((item: Result) => {
                        return new Item(item.id, item.name, item.quantity);
                    }),
                };
            })
            .map((category) => new Category(category.id, category.name, category.items));
    } finally {
        statement.finalizeAsync();
    }
}

export async function getByName(name: string): Promise<Item> {
    await initializeItemDatabase();

    const statement = await db.prepareAsync(`
        SELECT id, name, quantity
        FROM items
        WHERE name = $name
    `);
    interface Result {
        id: number;
        name: string;
        quantity: number;
    }

    try {
        const result = (await (await statement.executeAsync({ $name: name })).getFirstAsync()) as Result;
        if (!result) return null;
        return new Item(result.id, result.name, result.quantity);
    } finally {
        statement.finalizeAsync();
    }
}

export async function insert(name: string, quantity: number, categoryId: number): Promise<number> {
    await initializeItemDatabase();

    if (!Item.isNameValid(name)) {
        throw new Error("Item name is invalid");
    }
    if (!Item.isQuantityValid(quantity)) {
        throw new Error("Item quantity out of bounds");
    }

    const statement = await db.prepareAsync(`
        INSERT INTO items (name, quantity, category)
        VALUES ($name, $quantity, $category)
    `);
    try {
        const result = await statement.executeAsync({
            $name: name,
            $quantity: quantity,
            $category: categoryId,
        });
        return result.lastInsertRowId;
    } finally {
        statement.finalizeAsync();
    }
}

export async function updateQuantity(id: number, quantity: number): Promise<number> {
    await initializeItemDatabase();

    if (!Item.isQuantityValid(quantity)) {
        throw new Error("Item quantity out of bounds");
    }

    const statement = await db.prepareAsync(`
        UPDATE items
        SET quantity = $quantity
        WHERE id = $id
    `);
    try {
        const result = await statement.executeAsync({
            $quantity: quantity,
            $id: id,
        });
        return result.lastInsertRowId;
    } finally {
        statement.finalizeAsync();
    }
}
