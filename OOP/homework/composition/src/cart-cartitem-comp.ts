const isValidNumber = (
  n: number,
  min: number,
  max: number,
  integer: boolean = false,
): boolean => {
  const valid =
    Number.isFinite(n) &&
    n >= min &&
    n <= max &&
    (!integer || Number.isInteger(n));
  return valid;
};

const trimmedText = (text: string): string => {
  return text.trim();
};

class CartItem {
  private productId: string;
  private productName: string;
  private unitPrice: number;
  private quantity: number;

  constructor(id: string, name: string, price: number, qty: number) {
    const trimmedId = trimmedText(id);
    if (trimmedId === "") {
      throw new Error("id must not be empty");
    }

    const trimmedName = trimmedText(name);
    if (trimmedName === "") {
      throw new Error("name must not be empty");
    }

    const validPrice = isValidNumber(price, 0, Number.MAX_SAFE_INTEGER);
    if (!validPrice) {
      throw new Error(`price (${price}) is invalid`);
    }

    const validQty = isValidNumber(qty, 1, Number.MAX_SAFE_INTEGER, true);
    if (!validQty) {
      throw new Error(`quantity (${qty}) is invalid`);
    }

    this.productId = trimmedId;
    this.productName = trimmedName;
    this.unitPrice = price;
    this.quantity = qty;
  }

  getProductId(): string {
    return this.productId;
  }

  getProductName(): string {
    return this.productName;
  }

  getUnitPrice(): number {
    return this.unitPrice;
  }

  getQuantity(): number {
    return this.quantity;
  }

  getSubTotal(): number {
    return this.quantity * this.unitPrice;
  }

  setQuantity(qty: number): void {
    const validQty = isValidNumber(qty, 1, Number.MAX_SAFE_INTEGER, true);
    if (!validQty) {
      throw new Error(`quantity (${qty}) is invalid`);
    }
    this.quantity = qty;
  }

  clone(): CartItem {
    return new CartItem(
      this.productId,
      this.productName,
      this.unitPrice,
      this.quantity,
    );
  }
}

export class Cart {
  readonly cartId: string;
  readonly cashierName: string;
  readonly customerName: string;
  private discountPercentage: number = 0;
  private items: CartItem[] = [];
  private static cartIdCounter: number = 0;
  private existingItemsId = new Set<string>();

  constructor(cashier: string, customer: string) {
    const trimmedCashier = trimmedText(cashier);
    if (trimmedCashier === "") {
      throw new Error("cashier name must not be empty");
    }

    const trimmedCustomer = trimmedText(customer);
    if (trimmedCustomer === "") {
      throw new Error("customer name must not be empty");
    }

    this.cashierName = trimmedCashier;
    this.customerName = trimmedCustomer;
    this.cartId = Cart.calculateNextId();
  }

  private static calculateNextId(): string {
    return `C` + String(++Cart.cartIdCounter).padStart(3, "0");
  }

  addItem(
    productId: string,
    name: string,
    unitPrice: number,
    quantity: number,
  ): void {
    const trimmedId = trimmedText(productId);
    if (trimmedId === "") {
      throw new Error("id must not be empty");
    }

    const trimmedName = trimmedText(name);
    if (trimmedName === "") {
      throw new Error("name must not be empty");
    }

    const validPrice = isValidNumber(unitPrice, 0, Number.MAX_SAFE_INTEGER);
    if (!validPrice) {
      throw new Error(`price (${unitPrice}) is invalid`);
    }

    const validQty = isValidNumber(quantity, 1, Number.MAX_SAFE_INTEGER, true);
    if (!validQty) {
      throw new Error(`quantity (${quantity}) is invalid`);
    }

    if (this.existingItemsId.has(trimmedId.toUpperCase())) {
      const foundItem = this.getItemById(trimmedId);

      const foundItemName = foundItem.getProductName();
      if (foundItemName.toLowerCase() !== trimmedName.toLowerCase()) {
        throw new Error(
          `there is a name mismatch between existing, and new item (${foundItemName}, and ${trimmedName}) `,
        );
      }

      const foundItemUPrice = foundItem.getUnitPrice();
      if (foundItemUPrice !== unitPrice) {
        throw new Error(
          `there is a unit price mismatch between existing, and new item (${foundItemUPrice}, and ${unitPrice}) `,
        );
      }

      const oldQty = foundItem.getQuantity();
      const newQty = oldQty + quantity;
      this.changeQtyById(trimmedId, newQty);
      return;
    }

    this.items.push(new CartItem(trimmedId, name, unitPrice, quantity));
    this.existingItemsId.add(trimmedId.toUpperCase());
  }

  removeItem(productId: string): void {
    const normalizedId = trimmedText(productId).toLowerCase();
    if (normalizedId === "") {
      throw new Error("id must not be empty");
    }

    const oldLength = this.items.length;
    const newItems = this.items.filter(
      (item) => item.getProductId().toLowerCase() !== normalizedId,
    );
    const newLength = newItems.length;
    if (oldLength === newLength) {
      throw new Error(`Can not find productId (${productId}) in items array`);
    }
    this.items = newItems;
    this.existingItemsId.delete(normalizedId.toUpperCase());
  }

  changeQtyById(productId: string, qty: number): void {
    const normalizedId = trimmedText(productId).toLowerCase();
    if (normalizedId === "") {
      throw new Error("productId must not be empty");
    }

    const validQty = isValidNumber(qty, 1, Number.MAX_SAFE_INTEGER, true);
    if (!validQty) {
      throw new Error(`quantity (${qty}) is invalid`);
    }

    const found = this.items.find(
      (item) => item.getProductId().toLowerCase() === normalizedId,
    );
    if (!found) {
      throw new Error(`Can not find productId (${productId}) in items array`);
    }

    found.setQuantity(qty);
  }

  applyDiscount(percentage: number): void {
    const validPercent = isValidNumber(percentage, 0, 100, true);
    if (!validPercent) {
      throw new Error(`percentage (${percentage}) is invalid`);
    }

    this.discountPercentage = percentage;
  }

  getTotal(): number {
    const itemsSubTotal = this.items.reduce(
      (total, current) => total + current.getSubTotal(),
      0,
    );
    const afterDiscount =
      (itemsSubTotal * (100 - this.discountPercentage)) / 100;
    return afterDiscount;
  }

  private getItemById(id: string): CartItem {
    const normalizedId = trimmedText(id).toLowerCase();
    if (normalizedId === "") {
      throw new Error("product id must not be empty");
    }

    const found = this.items.find(
      (item) => item.getProductId().toLowerCase() === normalizedId,
    );
    if (!found) {
      throw new Error(`can not find item with id (${id})`);
    }

    return found.clone();
  }

  clear(): void {
    this.items = [];
    this.discountPercentage = 0;
    this.existingItemsId.clear();
  }
}
