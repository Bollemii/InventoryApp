import Item from "./Item";

export default class Inventory {
  items: Array<Item>

  constructor() {
    this.items = []
  }

  public addItem(item: Item) {
    const found = this.items.find(i => i.name === item.name)
    if (!found) {
      this.items.push(item)
    } else {
      found.quantity = item.quantity
    }
  }

  public deleteItem(name: string) {
    this.items = this.items.filter(i => i.name !== name)
  }
}