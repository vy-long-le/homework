import { Product } from "./Product.js";
import { OrderItem } from "./OrderItem.js";

export class Order {
  private orderId: number;
  private items: OrderItem[] = [];
  private static idCounter = 0;

  constructor() {
    this.orderId = this.calculateNextId();
  }

  calculateNextId(): number {
    return ++Order.idCounter;
  }

  addItem(item: Product, qty: number): void {
    const newItem = new OrderItem(item, qty);
    this.items.push(newItem);
  }

  displayOrder(): void {
    const amountArr: number[] = this.items.map((i) => i.getAmount());
    const total: number = amountArr.reduce((prev, current) => prev + current);
    const arr = this.items.map((i) => ({
      OrderId: this.orderId,
      ProductId: i.getProduct().getId(),
      TenSP: i.getProduct().getTenSP(),
      SoLuong: i.getQuantity(),
      DonGia: i.getProduct().getDonGia(),
      ThanhTien: i.getAmount(),
    }));

    console.table(arr);
    console.log(`-------------> Tong Tien: ${total} <--------------`);
  }
}
