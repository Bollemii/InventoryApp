import { Item } from "./Item";

export class Category {
    private _name: string;
    private _items: Item[];

    constructor(name: string = "", items: Item[]) {
        this._name = name;
        this._items = items;
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

    public toString(): string {
        return `${this._name} (${this._items.length})`;
    }
}
