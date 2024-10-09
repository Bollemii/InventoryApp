import { Item } from "./Item";

/**
 * Category class, it contains a list of items
 * It contains the category properties : id, name and items
 */
export class Category {
    private _id: number;
    private _name: string;
    private _items: Item[];

    constructor(id: number, name: string, items: Item[] = []) {
        if (!Category.isNameValid(name)) {
            throw new Error("Category name is invalid");
        }

        this._id = id;
        this._name = name.trim();
        this._items = items;
    }

    get id() {
        return this._id;
    }

    get name() {
        return this._name;
    }

    set name(name: string) {
        if (!Category.isNameValid(name)) {
            throw new Error("Category name is invalid");
        }
        this._name = name.trim();
    }

    get items() {
        return this._items;
    }

    public addItem(item: Item): void {
        this._items.push(item);
    }

    static isNameValid(name: string): boolean {
        return name.trim().length > 0;
    }

    public toString(): string {
        return `${this._id} ${this._name} (${this._items.length})`;
    }
}
