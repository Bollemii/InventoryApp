import * as sqlite from "expo-sqlite";

const db = sqlite.openDatabaseSync("inventory");

function cleanQuery(query: string) {
    return query.trim().replace(/\s+/g, " ").replace("\n", " ");
}

/**
 * Execute a query
 * 
 * @param query The SQL query to execute
 * @returns A promise that resolves to the result of the query
 */
export async function execute(query: string) {
    return db.execAsync(cleanQuery(query));
}

/**
 * Execute a statement (modifying query) with parameters
 * The params object should be an object with keys that match the parameter names in the query
 * e.g. : "SELECT * FROM table WHERE id = $id" and params = { $id: 1 }
 * 
 * @param query The SQL query to execute
 * @param params The parameters to bind to the query
 * @returns A promise that resolves to the result of the query
 */
export async function executeStatement(query: string, params?: sqlite.SQLiteBindParams) {
    const statement = await db.prepareAsync(cleanQuery(query));
    try {
        return await statement.executeAsync(params || {});
    } finally {
        statement.finalizeAsync();
    }
}

/**
 * Check if a column exists in a table
 * 
 * @param table The table name
 * @param column The column name to check for
 * @returns A promise that resolves to a boolean indicating if the column exists
 */
export async function columnExists(table: string, column: string) {
    const result = await db.getAllAsync(`PRAGMA table_info(${table})`);

    return result.some((row: any) => row.name === column);
}

/**
 * Get all rows from a query
 * 
 * @param query The SQL query to execute 
 * @returns A promise that resolves to an array of rows
 */
export async function getAll(query: string): Promise<any[]> {
    const statement = await db.prepareAsync(cleanQuery(query));
    try {
        return await (await statement.executeAsync()).getAllAsync();
    } finally {
        statement.finalizeAsync();
    }
}

/**
 * Get all rows from a query with parameters
 * 
 * @param query The SQL query to execute
 * @param params The parameters to bind to the query
 * @returns A promise that resolves to the first row
 */
export async function get(query: string, params: sqlite.SQLiteBindParams): Promise<any[]> {
    const statement = await db.prepareAsync(cleanQuery(query));
    try {
        return await (await statement.executeAsync(params)).getAllAsync();
    } finally {
        statement.finalizeAsync();
    }
}

/**
 * Get one row from a query
 * 
 * @param query The SQL query to execute
 * @param params The parameters to bind to the query
 * @returns A promise that resolves to the first row
 */
export async function getOne(query: string, params: sqlite.SQLiteBindParams): Promise<any> {
    const statement = await db.prepareAsync(cleanQuery(query));
    try {
        return await (await statement.executeAsync(params)).getFirstAsync();
    } finally {
        statement.finalizeAsync();
    }
}
