export class Item {
    private _name: string;
    private _quantity: number;

    constructor(name: string, quantity: number) {
        this._name = name;
        this._quantity = quantity;
    };

    get name() {
        return this._name;
    };
    
    get quantity() {
        return this._quantity;
    };

    set name(name: string) {
        if (name === "") return;

        this._name = name;
    };

    set quantity(quantity: number) {
        if (quantity < 0) return;

        this._quantity = quantity;
    };

    public add(quantity: number): void {
        if (this._quantity + quantity < 0) return;

        this._quantity += quantity;
    }

    public toString(): string {
        return `${this._name} (${this._quantity})`;
    };
}