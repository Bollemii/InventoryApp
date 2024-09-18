import { Item } from "@/model/Item";
import { Category } from "@/model/category";
import { groupBy } from "@/utils";
import { initializeCategoryDatabase } from "./categoryDatabase";
import * as database from "./common/sqliteDatabase";

export async function initializeItemDatabase() {
    await initializeCategoryDatabase();
    await database.execute(`
        CREATE TABLE IF NOT EXISTS items (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL UNIQUE,
            quantity INTEGER
        );
    `);
    if (!(await database.columnExists("items", "category"))) {
        database.execute(`
            ALTER TABLE items ADD COLUMN category INTEGER REFERENCES categories(id);
        `);
    }
}

export async function getAllGroupByCategory(): Promise<Category[]> {
    await initializeItemDatabase();
    interface Result {
        id: number;
        name: string;
        quantity: number;
        categoryId: number;
        categoryName: string;
    }

    const result = (await database.getAll(`
        SELECT items.id, items.name, items.quantity, categories.id as categoryId, categories.name as categoryName
        FROM items
        INNER JOIN categories ON items.category = categories.id
    `)) as Result[];
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
}

export async function getByName(name: string): Promise<Item> {
    await initializeItemDatabase();
    interface Result {
        id: number;
        name: string;
        quantity: number;
    }

    const result = (await database.getOne(
        `
        SELECT id, name, quantity FROM items
        WHERE name = $name`,
        { $name: name.trim() }
    )) as Result;

    if (!result) return null;
    return new Item(result.id, result.name, result.quantity);
}

export async function insert(name: string, quantity: number, categoryId: number): Promise<number> {
    await initializeItemDatabase();

    if (!Item.isNameValid(name)) {
        throw new Error("Item name is invalid");
    }
    if (!Item.isQuantityValid(quantity)) {
        throw new Error("Item quantity out of bounds");
    }

    const result = await database.executeStatement(
        `
        INSERT INTO items (name, quantity, category)
        VALUES ($name, $quantity, $category)
    `,
        {
            $name: name.trim(),
            $quantity: quantity,
            $category: categoryId,
        }
    );
    return result.lastInsertRowId;
}

export async function updateQuantity(id: number, quantity: number): Promise<number> {
    await initializeItemDatabase();

    if (!Item.isQuantityValid(quantity)) {
        throw new Error("Item quantity out of bounds");
    }

    const result = await database.executeStatement(
        `
        UPDATE items
        SET quantity = $quantity
        WHERE id = $id
    `,
        {
            $quantity: quantity,
            $id: id,
        }
    );
    return result.lastInsertRowId;
}

export async function deleteOne(id: number): Promise<void> {
    await initializeItemDatabase();

    await database.executeStatement(
        `
        DELETE FROM items
        WHERE id = $id
    `,
        { $id: id }
    );
}
