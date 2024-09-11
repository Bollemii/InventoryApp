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
