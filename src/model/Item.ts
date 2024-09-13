export class Item {
    static QUANTITY_MIN = 0;
    static QUANTITY_MAX = 99;

    private _id: number;
    private _name: string;
    private _quantity: number;

    constructor(id: number, name: string, quantity: number) {
        this._id = id;
        this._name = name;
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

    set name(name: string) {
        if (name === "") return;

        this._name = name;
    }

    set quantity(quantity: number) {
        if (!Item.isQuantityValid(quantity)) return;

        this._quantity = quantity;
    }

    public add(quantity: number): void {
        if (!Item.isQuantityValid(this._quantity + quantity)) return;

        this._quantity += quantity;
    }

    public toString(): string {
        return `${this._id} - ${this._name} (${this._quantity})`;
    }

    static isNameValid(name: string): boolean {
        return name.length > 0;
    }

    static isQuantityValid(quantity: number): boolean {
        return quantity >= Item.QUANTITY_MIN && quantity <= Item.QUANTITY_MAX;
    }
}
