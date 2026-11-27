import { Product } from "./Product.js";

export class Accessory extends Product {
  brand: string;
  protected discount: number = 5;

  constructor(
    name: string,
    quantity: number,
    price: number,
    image: string,
    brand: string,
  ) {
    const trimBrand = brand.trim();
    if (trimBrand === "") {
      throw new Error("brand text must not be empty");
    }

    super(name, quantity, price, image);
    this.brand = trimBrand;
  }

  printDetails(): void {
    const details = {
      ID: this.id,
      MaSP: this.maSP,
      TenSP: this.tenSP,
      SoLuong: this.soLuong,
      DonGia: this.donGia,
      HinhAnh: this.hinhAnh,
      Brand: this.brand,
    };
    console.table(details);
  }
}
