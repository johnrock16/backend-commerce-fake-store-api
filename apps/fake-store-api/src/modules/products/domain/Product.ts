export class Product {
  constructor(
    public readonly id: string,
    public name: string,
    public price: number,
  ) {
    if (price < 0) throw new Error('Price cannot be negative');
  }

  changePrice(newPrice: number) {
    if (newPrice < 0) throw new Error('Invalid price');
    this.price = newPrice;
  }
}
