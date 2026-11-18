import * as readline from "node:readline/promises";
import { stdin, stdout } from "node:process";
import type { Product } from "./product-core.js";
import {
  createProduct,
  listProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  searchProducts,
  sortProducts,
} from "./product-core.js";

const rl = readline.createInterface({ input: stdin, output: stdout });

const printAllProducts = (): void => {
  const products = listProducts();
  if (products.length === 0) {
    console.log("List is empty");
  } else {
    printProducts(products);
  }
};

const printProducts = (products: Product[]): void => {
  if (products.length === 0) {
    console.log("List is empty");
  } else {
    console.table(products);
  }
};

const printProduct = (product: Product): void => {
  console.table(product);
};

const enterProduct = async (): Promise<void> => {
  const name = await askText("Enter name: ");
  const price = await askNumber("Enter price: ", 0, Number.MAX_SAFE_INTEGER);
  const quantity = await askNumber(
    "Enter quantity: ",
    0,
    Number.MAX_SAFE_INTEGER,
    true,
  );
  const input = { name, price, quantity };

  const product = createProduct(input);
  if (product.ok) {
    return printProduct(product.product);
  }

  return console.error(product.error);
};

const updateProductById = async (): Promise<void> => {
  if (listProducts().length === 0) return console.error("List is empty");

  printAllProducts();

  const id = await askText("Enter ID to update: ");
  const found = getProductById(id);
  if (!found.ok) return console.error(found.error);

  printProduct(found.product);
  let patch: object = {};

  const name = (await rl.question("Enter name: ")).trim();
  if (name !== "") {
    patch = { ...patch, name };
  }

  const price = (await rl.question("Enter price: ")).trim();
  if (price !== "") {
    patch = { ...patch, price: Number(price) };
  }

  const quantity = (await rl.question("Enter quantity: ")).trim();
  if (quantity !== "") {
    patch = { ...patch, quantity: Number(quantity) };
  }

  const updatedProduct = updateProduct(found.product.id, patch);
  if (!updatedProduct.ok) return console.error(updatedProduct.error);

  printProduct(updatedProduct.product);
};

const deleteProductById = async (): Promise<void> => {
  if (listProducts().length === 0) return console.error("List is empty");

  printAllProducts();

  const id = await askText("Enter ID to delete: ");
  const found = getProductById(id);
  if (!found.ok) return console.error(found.error);

  printProduct(found.product);

  const choice = await askNumber(
    "Delete product?\n1. Yes\n2. No\nEnter choice: ",
    1,
    2,
    true,
  );

  if (choice === 1) {
    const deletedProduct = deleteProduct(found.product.id);
    if (!deletedProduct.ok) return console.error(deletedProduct.error);

    console.log("Delete product successfully");
  } else {
    console.log("Cancel deleting product");
  }
};

const sortListProducts = async (): Promise<void> => {
  const products = listProducts();
  if (products.length === 0) {
    console.log("List is empty");
    return;
  }
  printProducts(products);

  let by: string;
  let direction: string;

  const byChoice = await askNumber(
    `
============SORT MENU===============
1. Name
2. Price
3. Quantity
0. Main menu
====================================
Enter your choice (0-3): `,
    0,
    3,
    true,
  );
  switch (byChoice) {
    case 1:
      by = "name";
      break;
    case 2:
      by = "price";
      break;
    case 3:
      by = "quantity";
      break;
    case 0:
      console.log("Exit sort menu. Load Main menu");
      return;
    default:
      console.log("Invalid choice");
      return;
  }

  const directionChoice = await askNumber(
    "1. Ascending or 2. Descending",
    1,
    2,
    true,
  );
  direction = directionChoice === 1 ? "asc" : "desc";

  const sortedProducts = sortProducts(products, by, direction);
  if (!sortedProducts.ok) return console.error(sortedProducts.error);

  printProducts(sortedProducts.products);
};

const searchProductsByName = async (): Promise<void> => {
  if (listProducts().length === 0) return console.error("List is empty");

  printAllProducts();

  const query = await askText("Enter product name to search: ");

  const foundProducts = searchProducts(query);
  if (!foundProducts.ok) return console.error(foundProducts.error);

  printProducts(foundProducts.products);
};

const askMainMenu = async (): Promise<void> => {
  while (true) {
    const choice = await askNumber(
      `
============MAIN MENU===============
1. Add 1 product
2. Print all products
3. Update a product by ID
4. Delete a product by ID
5. Search products by name
6. Sort products
0. Exit
====================================
Enter your choice (0-6): `,
      0,
      6,
      true,
    );

    switch (choice) {
      case 1:
        await enterProduct();
        break;
      case 2:
        printAllProducts();
        break;
      case 3:
        await updateProductById();
        break;
      case 4:
        await deleteProductById();
        break;
      case 5:
        await searchProductsByName();
        break;
      case 6:
        await sortListProducts();
        break;
      case 0:
        console.log("Exit! Thanks for using.");
        rl.close();
        return;
      default:
        console.log("Invalid choice");
        break;
    }
  }
};

const askNumber = async (
  prompt: string,
  min: number,
  max: number,
  integer: boolean = false,
): Promise<number> => {
  while (true) {
    const raw = (await rl.question(prompt)).trim();
    const value = Number(raw);

    const valid =
      raw !== "" &&
      Number.isFinite(value) &&
      value >= min &&
      value <= max &&
      (!integer || Number.isInteger(value));
    if (valid) return value;
    console.log(
      `Enter ${integer ? "an integer" : "a number"} from ${min} to ${max}`,
    );
  }
};

const askText = async (prompt: string): Promise<string> => {
  while (true) {
    const text = await rl.question(prompt);
    const trimmedText = text.trim();

    if (trimmedText !== "") return trimmedText;
    console.log("Text must not be empty");
  }
};

await askMainMenu();
