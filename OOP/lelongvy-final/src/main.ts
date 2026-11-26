import {
  Product,
  Laptop,
  Phone,
  Accessory,
  Supplier,
  Warehouse,
  Order,
} from "./models/index.js";

const section = (text: string): void => {
  console.log(`--------------------- ${text} ---------------------`);
};

const laptop: Laptop[] = [
  new Laptop(
    "Laptop Dell",
    5,
    15_000_000,
    "laptop-dell.jpg",
    "Intel Core Ultra 7",
    "32 GB",
  ),
  new Laptop(
    "MacBook Air M3",
    7,
    28_000_000,
    "macbook-air-m3.jpg",
    "Apple M3",
    "16 GB",
  ),
  new Laptop(
    "ASUS Zenbook 14",
    6,
    25_000_000,
    "zenbook-14.jpg",
    "Intel Core Ultra 7",
    "16 GB",
  ),
  new Laptop(
    "HP Pavilion 15",
    9,
    18_000_000,
    "hp-pavilion-15.jpg",
    "Intel Core i5",
    "16 GB",
  ),
];
const phone: Phone[] = [
  new Phone("iPhone 15", 10, 25_000_000, "iphone-16.jpg", "Apple"),
  new Phone("Samsung S24", 8, 22_000_000, "samsung-s24.jpg", "Android"),
  new Phone("Google Pixel 9", 6, 20_000_000, "pixel-9.jpg", "Android"),
  new Phone("Xiaomi 14", 9, 18_000_000, "xiaomi-14.jpg", "Android"),
  new Phone("OPPO Reno 12", 12, 12_000_000, "oppo-reno-12.jpg", "Android"),
  new Phone("iPhone 14", 5, 19_000_000, "iphone-14.jpg", "iOS"),
];
const accessory: Accessory[] = [
  new Accessory("Tai nghe Sony", 20, 3_000_000, "tai-nghe-sony.jpg", "Sony"),
  new Accessory(
    "Ban phim Keychron",
    15,
    2_500_000,
    "ban-phim-keychron.jpg",
    "Keychron",
  ),
  new Accessory(
    "Logitech MX Master 3S",
    12,
    2_800_000,
    "mx-master-3s.jpg",
    "Logitech",
  ),
  new Accessory("Anker 30W Charger", 25, 700_000, "anker-30w.jpg", "Anker"),
  new Accessory("JBL Go 4 Speaker", 14, 1_200_000, "jbl-go-4.jpg", "JBL"),
];

const products: Product[] = [laptop, phone, accessory].flat();

section("Inheritance, Polymorphism, and Abstraction".toUpperCase());
for (const p of products) {
  p.printDetails();
  p.calculateDiscount();
  p.displayInfo();
}

section("ASSOCIATION");
const firstHalf = products.slice(0, Math.floor(products.length / 2));
const secondHalf = products.slice(
  Math.floor(products.length / 2),
  products.length,
);
const supplier1 = new Supplier("Dell Viet Nam");
const supplier2 = new Supplier("Apple Viet Nam");
for (const p of firstHalf) {
  supplier1.addProduct(p);
}
supplier1.printSupplierProductsLink();
for (const p of secondHalf) {
  supplier2.addProduct(p);
}
supplier2.printSupplierProductsLink();

section("AGGREGATION");
const ware1 = new Warehouse("Kho CNTT Da Nang");
products.forEach((p) => ware1.addProduct(p));
ware1.printProducts();
ware1.removeProductById(1);
ware1.printProducts();

section("COMPOSITION");
const order1 = new Order();
for (const p of phone) {
  order1.addItem(p, Math.floor(p.getSoLuong() / 2));
}
order1.displayOrder();

section("BONUS");
section("SP Co GIA Cao Nhat");
ware1.getMaxPriceProduct().displayInfo();

section("SP Co SO LUONG Cao Nhat");
ware1.getMaxQtyProduct().printDetails();

section("Tong Gia Tri Kho Hang");
console.log(
  "Tong Gia Tri Kho Hang",
  ware1.calculateWarehouseTotalProductPrice(),
);
