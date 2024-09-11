import * as sqlite from "expo-sqlite";

import { Item } from "@/model/Item";
import { Category } from "@/model/category";
import { groupBy } from "@/utils";

const db = sqlite.openDatabaseSync("inventory");

interface IItem {
    id: number;
    name: string;
    quantity: number;
    category: string;
}

export async function initializeDatabase() {
    db.execAsync(`
        CREATE TABLE IF NOT EXISTS categories (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL UNIQUE
        );
        CREATE TABLE IF NOT EXISTS items (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL UNIQUE,
            quantity INTEGER,
            category INTEGER REFERENCES categories(id)
        );
    `);
}

export async function getItemsGroupByCategory(): Promise<Category[]> {
    await initializeDatabase();
    const statement = await db.prepareAsync(`
        SELECT items.id, items.name, items.quantity, categories.name as category
        FROM items
        INNER JOIN categories ON items.category = categories.id
    `);
    try {
        const result = (await (
            await statement.executeAsync()
        ).getAllAsync()) as IItem[];

        const categories = groupBy(result, "category");
        return Object.keys(categories)
            .map((key) => {
                return {
                    name: key,
                    items: categories[key].map((item) => {
                        return new Item(item.id, item.name, item.quantity);
                    }),
                };
            })
            .map((category) => new Category(category.name, category.items));
    } finally {
        statement.finalizeAsync();
    }
}

export async function updateQuantity(
    id: number,
    quantity: number
): Promise<number> {
    if (!Item.isQuantityValid(quantity)) {
        throw new Error("Item quantity out of bounds");
    }

    await initializeDatabase();
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
