import { Item } from "./Item";

export class Category {
    private _id: number;
    private _name: string;
    private _items: Item[];

    constructor(id: number, name: string, items: Item[] = []) {
        this._id = id;
        this._name = name;
        this._items = items;
    }

    get id() {
        return this._id;
    }

    get name() {
        return this._name;
    }

    get items() {
        return this._items;
    }

    public addItem(item: Item): void {
        this._items.push(item);
    }

    static isNameValid(name: string): boolean {
        return name.length > 0;
    }

    public toString(): string {
        return `${this._id} ${this._name} (${this._items.length})`;
    }
}
