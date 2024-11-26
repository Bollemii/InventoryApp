/**
 * Item model
 * It contains the item properties : id, name and quantity
 */
export class Item {
    static QUANTITY_MIN = 0;
    static QUANTITY_MAX = 99;

    private _id: number;
    private _name: string;
    private _quantity: number;

    constructor(id: number, name: string, quantity: number = 0) {
        if (!Item.isNameValid(name)) {
            throw new Error("Item name is invalid");
        }
        if (!Item.isQuantityValid(quantity)) {
            throw new Error("Item quantity is invalid");
        }

        this._id = id;
        this._name = name.trim();
        this._quantity = quantity;
    }

    get id() {
        return this._id;
    }

    get name() {
        return this._name;
    }

    get quantity() {
        return this._quantity;
    }

    set id(id: number) {
        this._id = id;
    }

    set name(name: string) {
        if (!Item.isNameValid(name)) {
            throw new Error("Item name is invalid");
        }

        this._name = name.trim();
    }

    set quantity(quantity: number) {
        if (!Item.isQuantityValid(quantity)) {
            throw new Error("Item quantity is invalid");
        }

        this._quantity = quantity;
    }

    public add(quantity: number): void {
        if (!Item.isQuantityValid(this._quantity + quantity)) {
            throw new Error("Item quantity is invalid");
        }

        this._quantity += quantity;
    }

    public toString(): string {
        return `${this._id} - ${this._name} (${this._quantity})`;
    }

    static isNameValid(name: string): boolean {
        return name.trim().length > 0;
    }

    static isQuantityValid(quantity: number): boolean {
        return quantity >= Item.QUANTITY_MIN && quantity <= Item.QUANTITY_MAX;
    }
}
