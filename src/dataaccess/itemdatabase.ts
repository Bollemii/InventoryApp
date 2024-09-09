import * as sqlite from 'expo-sqlite';

import { Item } from '@/model/Item';

const db = sqlite.openDatabaseSync('inventory');

interface IItem {
    id: number;
    name: string;
    quantity: number;
};

export async function initializeDatabase() {
    db.execAsync(`
        CREATE TABLE IF NOT EXISTS categories (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL UNIQUE
        );
        CREATE TABLE IF NOT EXISTS items (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL UNIQUE,
            quantity INTEGER
        );
    `);
};

export async function getItems(): Promise<Item[]> {
    await initializeDatabase();
    const statement = await db.prepareAsync('SELECT * FROM items');
    try {
        const result = await (await statement.executeAsync()).getAllAsync() as IItem[];
        return result.map((item: IItem) => new Item(item.id, item.name, item.quantity));
    } finally {
        statement.finalizeAsync();
    }
};

export async function getItemById(id: number): Promise<Item> {
    await initializeDatabase();
    const statement = await db.prepareAsync('SELECT * FROM items WHERE id = $id');
    try {
        const result = await (await statement.executeAsync({$id: id})).getFirstAsync() as IItem;
        return new Item(result.id, result.name, result.quantity);
    } finally {
        statement.finalizeAsync();
    }
};

export async function updateQuantity(id: number, quantity: number): Promise<number> {
    await initializeDatabase();
    const statement = await db.prepareAsync('UPDATE items SET quantity = $quantity WHERE id = $id');
    try {
        const result = await statement.executeAsync({$quantity: quantity, $id: id});
        return result.lastInsertRowId;
    } finally {
        statement.finalizeAsync();
    }
};
