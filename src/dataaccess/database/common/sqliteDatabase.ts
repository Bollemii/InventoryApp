import * as sqlite from "expo-sqlite";

const db = sqlite.openDatabaseSync("inventory");

function cleanQuery(query: string) {
    return query.trim().replace(/\s+/g, " ").replace("\n", " ");
}

export async function execute(query: string) {
    return db.execAsync(cleanQuery(query));
}

export async function executeStatement(query: string, params?: sqlite.SQLiteBindParams) {
    const statement = await db.prepareAsync(cleanQuery(query));
    try {
        return await statement.executeAsync(params || {});
    } finally {
        statement.finalizeAsync();
    }
}

export async function columnExists(table: string, column: string) {
    const result = await db.getAllAsync(`PRAGMA table_info(${table})`);

    return result.some((row: any) => row.name === column);
}

export async function getAll(query: string): Promise<any[]> {
    const statement = await db.prepareAsync(cleanQuery(query));
    try {
        return await (await statement.executeAsync()).getAllAsync();
    } finally {
        statement.finalizeAsync();
    }
}

export async function get(query: string, params: sqlite.SQLiteBindParams): Promise<any[]> {
    const statement = await db.prepareAsync(cleanQuery(query));
    try {
        return await (await statement.executeAsync(params)).getAllAsync();
    } finally {
        statement.finalizeAsync();
    }
}

export async function getOne(query: string, params: sqlite.SQLiteBindParams): Promise<any> {
    const statement = await db.prepareAsync(cleanQuery(query));
    try {
        return await (await statement.executeAsync(params)).getFirstAsync();
    } finally {
        statement.finalizeAsync();
    }
}
