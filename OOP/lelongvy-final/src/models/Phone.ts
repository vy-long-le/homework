import { Product } from "./Product.js";

export class Phone extends Product {
  os: string;
  protected discount: number = 10;

  constructor(
    name: string,
    quantity: number,
    price: number,
    image: string,
    os: string,
  ) {
    const trimOS = os.trim();
    if (trimOS === "") {
      throw new Error("os text must not be empty");
    }

    super(name, quantity, price, image);
    this.os = trimOS;
  }

  printDetails(): void {
    const details = {
      ID: this.id,
      MaSP: this.maSP,
      TenSP: this.tenSP,
      SoLuong: this.soLuong,
      DonGia: this.donGia,
      HinhAnh: this.hinhAnh,
      OS: this.os,
    };
    console.table(details);
  }
}
