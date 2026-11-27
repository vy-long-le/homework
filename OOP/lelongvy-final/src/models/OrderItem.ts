import { Product, isValidNumber } from "./Product.js";

export class OrderItem {
  private product: Product;
  private quantity: number;

  constructor(p: Product, qty: number) {
    if (!isValidNumber(qty, 1, p.getSoLuong(), true)) {
      throw new Error(
        `buy quantity (${qty}) exceeds store quantity (${p.getSoLuong()})`,
      );
    }
    p.setSoLuong(p.getSoLuong() - qty);
    this.product = p;
    this.quantity = qty;
  }

  getAmount(): number {
    return this.product.getDonGia() * this.quantity;
  }

  getProduct(): Product {
    return this.product;
  }

  getQuantity(): number {
    return this.quantity;
  }
}
