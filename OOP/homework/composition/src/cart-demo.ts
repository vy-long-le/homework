import { Cart } from "./cart-cartitem-comp.js";

console.log("1. Create a cart (cashier Alice, customer Bruce)");
const a = new Cart("Alice", "Bruce");
console.log("   cartId:", a.cartId, "| total:", a.getTotal()); // C001, 0

console.log("2. addItem: the cart creates and owns its CartItems");
a.addItem("P001", "iPhone 18", 2500, 1);
a.addItem("P002", "Case iPhone 18", 10, 2);
console.log("   total (2500x1 + 10x2):", a.getTotal()); // 2520

console.log("3. applyDiscount(10): total is reduced by 10%");
a.applyDiscount(10);
console.log("   total after 10% discount:", a.getTotal()); // 2268

console.log(
  "4. addItem with an existing id: quantity merges, no duplicate item",
);
a.addItem("P002", "Case iPhone 18", 10, 1);
console.log("   total (case now x3, 10% off):", a.getTotal()); // 2277

console.log("5. removeItem(P002): the item is removed from the cart");
a.removeItem("P002");
console.log("   total (iPhone only, 10% off):", a.getTotal()); // 2250

console.log("6. A second cart gets its own id and its own items");
const b = new Cart("Luna", "Harry");
console.log("   cartId:", b.cartId, "| total:", b.getTotal()); // C002, 0

console.log(
  "7. clear(): the cart's items and discount are reset (composition)",
);
a.clear();
console.log("   total after clear:", a.getTotal()); // 0

console.log("8. Invalid operations throw an Error");
try {
  a.removeItem("P999");
} catch (e) {
  console.log("   removeItem(P999) threw:", (e as Error).message);
}
try {
  new Cart("", "Bruce");
} catch (e) {
  console.log("   new Cart('', 'Bruce') threw:", (e as Error).message);
}
