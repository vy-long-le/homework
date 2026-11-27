import type { Supplier } from "./Supplier.js";

export const isValidNumber = (
  n: number,
  min: number,
  max: number,
  integer: boolean = false,
): boolean => {
  const valid = n >= min && n <= max && (!integer || Number.isInteger(n));
  return valid;
};

const MAX_QUANTITY: number = 10_000_000;
const MAX_PRICE: number = 10_000_000_000;

export abstract class Product {
  protected id: number;
  protected maSP: string;
  protected tenSP: string;
  protected soLuong: number;
  protected donGia: number;
  protected hinhAnh: string;
  private static idCounter: number = 0;
  protected abstract discount: number;
  protected applyDis: boolean = false;
  private supplier: Supplier | null = null;

  constructor(name: string, quantity: number, price: number, image: string) {
    const trimImg = image.trim();
    if (trimImg === "") {
      throw new Error("image text must not be empty");
    }
    const trimName = name.trim();
    if (trimName === "") {
      throw new Error("name text must not be empty");
    }
    if (!isValidNumber(quantity, 0, MAX_QUANTITY, true)) {
      throw new Error("quantity must be a positive integer");
    }
    if (!isValidNumber(price, 0, MAX_PRICE)) {
      throw new Error("price must be a positive number");
    }

    this.id = this.calculateNextId();
    this.maSP = this.calculateMaSP();
    this.tenSP = trimName;
    this.soLuong = quantity;
    this.donGia = price;
    this.hinhAnh = trimImg;
  }

  private calculateNextId(): number {
    return ++Product.idCounter;
  }

  private calculateMaSP(): string {
    return "SP" + String(this.id).padStart(3, "0");
  }

  getId(): number {
    return this.id;
  }

  getMaSP(): string {
    return this.maSP;
  }

  getTenSP(): string {
    return this.tenSP;
  }

  getSoLuong(): number {
    return this.soLuong;
  }

  setSoLuong(quantity: number): void {
    if (!isValidNumber(quantity, 0, MAX_QUANTITY, true)) {
      throw new Error("quantity must be a positive integer");
    }
    this.soLuong = quantity;
  }

  getDonGia(): number {
    return this.donGia;
  }

  setDonGia(price: number): void {
    if (!isValidNumber(price, 0, MAX_PRICE)) {
      throw new Error("price must be a positive number");
    }
    this.donGia = price;
  }

  getThanhTien(): number {
    return this.soLuong * this.donGia;
  }

  getHinhAnh(): string {
    return this.hinhAnh;
  }

  getDis(): boolean {
    return this.applyDis;
  }

  resetDiscount(): void {
    this.applyDis = false;
  }

  calculateDiscount(): number {
    this.applyDis = true;
    return Number(((this.getDonGia() * this.discount) / 100).toFixed(2));
  }

  displayInfo(): void {
    const tienGiam = this.applyDis ? this.calculateDiscount() : 0;
    const percentage = this.applyDis ? this.discount : 0;
    const display = {
      TenSP: this.tenSP,
      DonGia: this.donGia,
      TienGiam: `${tienGiam} (⬇${percentage}%)`,
      GiaSauGiam: this.donGia - tienGiam,
    };
    console.table(display);
  }

  abstract printDetails(): void;

  setSupplier(supplier: Supplier): void {
    this.supplier = supplier;
  }

  getSupplier(): Supplier | null {
    return this.supplier;
  }
}
