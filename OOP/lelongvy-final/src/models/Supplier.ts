import type { Product } from "./Product.js";

export class Supplier {
  private id: string;
  private supplierName: string;
  private products = new Map<string, Product>();
  private static idCounter = 0;

  constructor(supplierName: string) {
    const trimName = supplierName.trim();
    if (trimName === "") {
      throw new Error("supplier name must not be empty");
    }

    this.id = this.calculateNextId();
    this.supplierName = trimName;
  }

  private calculateNextId(): string {
    return "SU" + String(++Supplier.idCounter).padStart(3, "0");
  }

  getName(): string {
    return this.supplierName;
  }

  addProduct(product: Product): void {
    if (!this.products.has(product.getMaSP())) {
      this.products.set(product.getMaSP(), product);
    }
    if (product.getSupplier !== null) {
      product.getSupplier()?.removeProduct(product);
    }
    product.setSupplier(this);
  }

  getProducts(): Product[] {
    if (this.products.size === 0) {
      throw new Error("products is empty");
    }
    const arr = this.products.values();
    return [...arr];
  }

  removeProduct(p: Product): void {
    if (this === p.getSupplier()) {
      this.products.delete(p.getMaSP());
    } else {
      throw new Error("not your product to remove");
    }
  }

  printSupplierProductsLink(): void {
    const arr = this.getProducts().map((p) => ({
      SupplierId: this.id,
      SupplierName: this.supplierName,
      MaSP: p.getMaSP(),
      TenSP: p.getTenSP(),
    }));
    console.table(arr);
  }
}
