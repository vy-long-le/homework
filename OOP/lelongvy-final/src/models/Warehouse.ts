import { Product, isValidNumber } from "./Product.js";
import { Laptop } from "./Laptop.js";
import { Phone } from "./Phone.js";
import { Accessory } from "./Accessory.js";

export class Warehouse {
  private warehouseName: string;
  private products: Product[] = [];

  constructor(name: string) {
    const trimName = name.trim();
    if (trimName === "") {
      throw new Error("warehouse name must not be empty");
    }

    this.warehouseName = trimName;
  }

  addProduct(product: Product): void {
    if (!this.products.includes(product)) {
      this.products.push(product);
    } else {
      throw new Error("this product object is already added");
    }
  }

  printProducts(): void {
    if (this.products.length === 0) {
      console.log("warehouse empty");
      return;
    }

    const arr = this.products.map((p) => ({
      ID: p.getId(),
      MaSP: p.getMaSP(),
      TenSP: p.getTenSP(),
      SoLuong: p.getSoLuong(),
      DonGia: p.getDonGia(),
      HinhAnh: p.getHinhAnh(),
      GiamGia: p.getDis() ? "Co Giam Gia" : "Khong Giam Gia",
      Supplier: p.getSupplier()?.getName() ?? "No Supplier",
      ...(p instanceof Laptop ? { RAM: p.ram, CPU: p.cpu } : {}),
      ...(p instanceof Phone ? { OS: p.os } : {}),
      ...(p instanceof Accessory ? { Brand: p.brand } : {}),
    }));

    console.table(arr);
  }

  removeProductById(id: number): void {
    if (!isValidNumber(id, 0, Number.MAX_SAFE_INTEGER, true)) {
      throw new Error("id must be a positive integer");
    }

    const found = this.products.find((p) => p.getId() === id);
    if (!found) {
      console.log(`can not find product with ID (${id})`);
      return;
    }

    this.products.splice(this.products.indexOf(found), 1);
  }

  getMaxPriceProduct(): Product {
    if (this.products.length === 0) {
      throw new Error("warehouse is empty");
    }

    const sortDescByPrice = [...this.products].sort(
      (a, b) => b.getDonGia() - a.getDonGia(),
    );

    return sortDescByPrice[0]!;
  }

  getMaxQtyProduct(): Product {
    if (this.products.length === 0) {
      throw new Error("warehouse is empty");
    }

    const sortDescByQty = [...this.products].sort(
      (a, b) => b.getSoLuong() - a.getSoLuong(),
    );

    return sortDescByQty[0]!;
  }

  calculateWarehouseTotalProductPrice(): number {
    if (this.products.length === 0) {
      throw new Error("warehouse is empty");
    }

    let productsTotal: number = 0;

    for (const p of this.products) {
      productsTotal += p.getThanhTien();
    }

    return productsTotal;
  }
}
