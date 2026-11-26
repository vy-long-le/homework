import { Product } from "./Product.js";

export class Laptop extends Product {
  ram: string;
  cpu: string;
  protected discount: number = 15;

  constructor(
    name: string,
    quantity: number,
    price: number,
    image: string,
    cpu: string,
    ram: string,
  ) {
    const trimCPU = cpu.trim();
    if (trimCPU === "") {
      throw new Error("cpu text must not be empty");
    }
    const trimRAM = ram.trim();
    if (trimCPU === "") {
      throw new Error("ram text must not be empty");
    }

    super(name, quantity, price, image);
    this.ram = trimRAM;
    this.cpu = trimCPU;
  }

  printDetails(): void {
    const details = {
      ID: this.id,
      MaSP: this.maSP,
      TenSP: this.tenSP,
      SoLuong: this.soLuong,
      DonGia: this.donGia,
      HinhAnh: this.hinhAnh,
      RAM: this.ram,
      CPU: this.cpu,
    };
    console.table(details);
  }
}
