export class ProductCreatedEvent {
  constructor(public readonly productId: string) {}
}

export class ProductPriceUpdatedEvent {
  constructor(
    public readonly productId: string,
    public readonly newPrice: number,
  ) {}
}
