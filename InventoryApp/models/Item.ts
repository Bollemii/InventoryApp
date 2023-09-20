export default class Item {
  name: string
  quantity: number = 0
  icon?: string

  constructor(name: string, quantity = 0, icon?: string) {
    this.name = name
    this.quantity = quantity
    this.icon = icon
  }

  public addQuantity(number: number) {
    this.quantity += number
  }
}