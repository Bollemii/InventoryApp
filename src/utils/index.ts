/**
 * Group an array of objects by a key.
 * 
 * @param items The array of objects to group
 * @param key The key to group by
 * @returns An object with the keys as the unique values of the key and the values as the items with that key
 */
export function groupBy(items: any, key: string): object {
    const result = {};
    for (const item of items) {
        if (!result[item[key]]) {
            result[item[key]] = [];
        }
        result[item[key]].push(item);
    }
    return result;
}
