import { products, type Product, type ProductPatch } from "./mimosa-product.js";

// ----------------------------- PRINT -----------------------------
export const printProducts = (items: Product[]): void => {
  if (items.length === 0) {
    console.log("items is empty");
  }
  console.table(items);
};

// ----------------------------- ADD -----------------------------
export const addProduct = (item: Product): void => {
  const found = findProductById(item.id, products);
  if (found) {
    console.log(`item with ID (${item.id}} is duplicated`);
    return;
  }
  products.push(item);
};

// ----------------------------- DELETE -----------------------------
export const deleteProductById = (items: Product[], id: number): void => {
  const found = findProductById(id, items);
  if (!found) return console.log(`can not find product with ID (${id})`);
  items.splice(items.indexOf(found), 1);
  console.log("delete success");
};

// ----------------------------- FIND -----------------------------
export const findProductById = (id: number, items: Product[]): Product | undefined => {
  const found = items.find((i) => i.id === id);
  return found;
};

// ----------------------------- UPDATE -----------------------------
export const updateProduct = (id: number, patch: ProductPatch): void => {
  const found = findProductById(id, products);
  if (!found) return console.log(`can not find product with ID (${id})`);

  found.name = patch.name;
  found.image = patch.image;
  found.price = patch.price;
  found.quantity = patch.quantity;
  found.discount = patch.discount;
  console.log("update success");
};

// ----------------------------- CALCULATE AMOUNT -----------------------------
export const calculateAmount = (item: Product): void => {
  const result = (item.price * item.quantity * (100 - item.discount)) / 100;
  item.amount = result;
};

// ----------------------------- LINEAR SEARCH -----------------------------
export const lnSearch = (items: Product[], query: string): Product[] | void => {
  const normalizedQuery = query.trim().toLowerCase();
  if (normalizedQuery === "") {
    console.log("query must not be empty");
    return;
  }

  const found: Product[] = [];

  for (const i of items) {
    if (i.name.toLowerCase().includes(normalizedQuery)) {
      found.push(i);
    }
  }

  if (found.length === 0) {
    console.log(`can not find product name (${query})`);
    return;
  }

  return found;
};

// ----------------------------- BINARY SEARCH -----------------------------
export const bnSearchById = (items: Product[], id: number): Product | void => {
  let low = 0;
  let high = items.length - 1;

  while (low <= high) {
    const middle = Math.floor((low + high) / 2);
    if (items[middle]) {
      if (items[middle].id === id) {
        return items[middle];
      }

      if (id < items[middle].id) {
        high = middle - 1;
      } else {
        low = middle + 1;
      }
    }
  }

  console.log(`can not find product with ID (${id})`);
};

// ----------------------------- BUBBLE SORT -----------------------------
export const bbSortByPrice = (items: Product[]): Product[] => {
  if (items.length <= 1) {
    return items;
  }

  for (let i = 0; i < items.length - 1; i++) {
    for (let j = 0; j < items.length - i - 1; j++) {
      const current = items[j];
      const next = items[j + 1];

      if (current && next && current.price > next.price) {
        items[j] = next;
        items[j + 1] = current;
      }
    }
  }

  return items;
};

// ----------------------------- QUICK SORT -----------------------------
export const quickSortByAmount = (items: Product[]): Product[] => {
  if (items.length <= 1) {
    return items;
  }

  const pivotItem = items[items.length - 1];
  if (!pivotItem) return items;

  const pivot = pivotItem.amount;

  const left: Product[] = [];
  const right: Product[] = [];

  for (const i of items.slice(0, -1)) {
    if (i.amount > pivot) {
      right.push(i);
    } else {
      left.push(i);
    }
  }

  return [...quickSortByAmount(left), pivotItem, ...quickSortByAmount(right)];
};
