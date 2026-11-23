import * as readline from "node:readline";
import { stdin, stdout } from "node:process";
import {
  printProducts,
  deleteProductById,
  addProduct,
  updateProduct,
  calculateAmount,
  lnSearch,
  bnSearchById,
  bbSortByPrice,
  quickSortByAmount,
} from "./array.js";
import {
  type Product,
  products,
  productsStack,
  productsQueue,
  productsLinkedList,
} from "./mimosa-product.js";

const rl = readline.createInterface({ input: stdin, output: stdout });

// ----------------------------- HELPERS -----------------------------
const askNumber = (
  prompt: string,
  min: number,
  max: number,
  integer: boolean = false,
  done: (value: number | null) => void,
): void => {
  rl.question(prompt, (raw) => {
    const trimmed = raw.trim();

    if (trimmed === "") {
      console.log("number must not be empty");
      return askNumber(prompt, min, max, integer, done);
    }

    const number = Number(trimmed);
    const valid =
      number >= min && number <= max && (!integer || Number.isInteger(number));
    if (valid) return done(number);
    console.log(
      `Invalid choice. Please choose a ${integer ? "an integer" : "a number"} from ${min} to ${max}`,
    );
    askNumber(prompt, min, max, integer, done);
  });
};

// ----------------------------- MENUS -----------------------------
const mainMenu = (): void => {
  askNumber(
    `
=============MAIN MENU=============
1. Print
2. Create
3. Delete
4. Update
5. Calculate amount
6. Stack Menu
7. Queue Menu
8. Linked List Menu
9. Search
10. Sort
0. Exit
Enter your choice(0-5): `,
    0,
    10,
    true,
    (choice) => {
      switch (choice) {
        case 1:
          printProducts(products);
          return mainMenu();
        case 2:
          const newProduct: Product = {
            id: 3,
            name: "Macbook Air",
            image: "macbook-air.jpg",
            price: 30500000,
            quantity: 10,
            discount: 10,
            amount: 0,
          };
          console.log("Add new product", newProduct);
          addProduct(newProduct);
          printProducts(products);
          return mainMenu();
        case 3:
          const deleteId = 3;
          console.log(`delete product with ID (${deleteId})`);
          deleteProductById(products, deleteId);
          printProducts(products);
          return mainMenu();
        case 4:
          const updateId = 2;
          const patch = {
            name: "Macbook Neo",
            image: "macbook-neo.jpg",
            price: 20000000,
            quantity: 15,
            discount: 20,
            amount: 0,
          };
          console.log(`update product ID (${updateId}) with patch`, patch);
          updateProduct(updateId, patch);
          printProducts(products);
          return mainMenu();
        case 5:
          products.forEach((p) => calculateAmount(p));
          printProducts(products);
          return mainMenu();
        case 6:
          return stackMenu();
        case 7:
          return queueMenu();
        case 8:
          return linkedListMenu();
        case 9:
          return searchMenu();
        case 10:
          return sortMenu();
        case 0:
          console.log("Exit the program!");
          return rl.close();
        default:
          return mainMenu();
      }
    },
  );
};

const stackMenu = (): void => {
  askNumber(
    `
=============STACK MENU=============
1. Print stack
2. Push to Stack
3. Pop
4. Peek
0. Main Menu
Enter your choice(0-4): `,
    0,
    4,
    true,
    (choice) => {
      switch (choice) {
        case 1:
          printProducts(productsStack.toArray());
          return stackMenu();
        case 2:
          products.forEach((p) => productsStack.pushItem(p));
          printProducts(productsStack.toArray());
          return stackMenu();
        case 3:
          productsStack.popItem();
          printProducts(productsStack.toArray());
          return stackMenu();
        case 4:
          const peekedProduct = productsStack.peek();
          if (peekedProduct === undefined) {
            console.log("can not peek");
            return;
          }
          console.table(peekedProduct);
          return stackMenu();
        case 0:
          console.log("To Main Menu!");
          return mainMenu();
        default:
          return stackMenu();
      }
    },
  );
};

const queueMenu = (): void => {
  askNumber(
    `
=============QUEUE MENU=============
1. Print queue
2. Enqueue products
3. Dequeue
4. Front
0. Main Menu
Enter your choice(0-4): `,
    0,
    4,
    true,
    (choice) => {
      switch (choice) {
        case 1:
          printProducts(productsQueue.toArray());
          return queueMenu();
        case 2:
          products.forEach((p) => productsQueue.enqueue(p));
          printProducts(productsQueue.toArray());
          return queueMenu();
        case 3:
          productsQueue.dequeue();
          printProducts(productsQueue.toArray());
          return queueMenu();
        case 4:
          const frontProduct = productsQueue.front();
          console.table(frontProduct);
          return queueMenu();
        case 0:
          console.log("To Main Menu!");
          return mainMenu();
        default:
          return queueMenu();
      }
    },
  );
};

const linkedListMenu = (): void => {
  askNumber(
    `
=============LINKED LIST MENU=============
1. Print Linked List
2. Add first
3. Add last
0. Main Menu
Enter your choice(0-3): `,
    0,
    3,
    true,
    (choice) => {
      switch (choice) {
        case 1:
          productsLinkedList.print();
          return linkedListMenu();
        case 2:
          const firstProducts: Product[] = [
            {
              id: 4,
              name: "Mechanical Keyboard",
              image: "keyboard.jpg",
              price: 850000,
              quantity: 12,
              discount: 5,
              amount: 9690000,
            },
            {
              id: 5,
              name: "Wireless Mouse",
              image: "mouse.jpg",
              price: 450000,
              quantity: 20,
              discount: 10,
              amount: 8100000,
            },
            {
              id: 6,
              name: "27-inch Monitor",
              image: "monitor.jpg",
              price: 4500000,
              quantity: 5,
              discount: 15,
              amount: 19125000,
            },
          ];
          firstProducts.forEach((f) => productsLinkedList.prepend(f));
          productsLinkedList.print();
          return linkedListMenu();
        case 3:
          const lastProducts: Product[] = [
            {
              id: 7,
              name: "Wireless Headphones",
              image: "headphones.jpg",
              price: 1200000,
              quantity: 8,
              discount: 20,
              amount: 7680000,
            },
            {
              id: 8,
              name: "USB-C Hub",
              image: "usb-c-hub.jpg",
              price: 950000,
              quantity: 10,
              discount: 0,
              amount: 9500000,
            },
            {
              id: 9,
              name: "HD Webcam",
              image: "webcam.jpg",
              price: 1650000,
              quantity: 7,
              discount: 12,
              amount: 10164000,
            },
            {
              id: 10,
              name: "External SSD",
              image: "external-ssd.jpg",
              price: 2300000,
              quantity: 4,
              discount: 8,
              amount: 8464000,
            },
          ];
          lastProducts.forEach((l) => productsLinkedList.append(l));
          productsLinkedList.print();
          return linkedListMenu();
        case 0:
          console.log("To Main Menu!");
          return mainMenu();
        default:
          return linkedListMenu();
      }
    },
  );
};

const searchMenu = (): void => {
  askNumber(
    `
=============SEARCH MENU=============
1. Linear search
2. Binary search
0. Main Menu
Enter your choice(0-2): `,
    0,
    2,
    true,
    (choice) => {
      switch (choice) {
        case 1:
          const query = "MacBook Air";
          console.log("Search name", query);
          console.time("lnSearch");
          const found = lnSearch(products, query);
          console.timeEnd("lnSearch");
          if (Array.isArray(found)) printProducts(found);
          return searchMenu();
        case 2:
          const newProducts: Product[] = [
            {
              id: 10,
              name: "Mechanical Keyboard",
              image: "keyboard.jpg",
              price: 850000,
              quantity: 12,
              discount: 5,
              amount: 9690000,
            },
            {
              id: 8,
              name: "Wireless Mouse",
              image: "mouse.jpg",
              price: 450000,
              quantity: 20,
              discount: 10,
              amount: 8100000,
            },
            {
              id: 5,
              name: "27-inch Monitor",
              image: "monitor.jpg",
              price: 4500000,
              quantity: 5,
              discount: 15,
              amount: 19125000,
            },
            {
              id: 4,
              name: "Wireless Headphones",
              image: "headphones.jpg",
              price: 1200000,
              quantity: 8,
              discount: 20,
              amount: 7680000,
            },
            {
              id: 6,
              name: "USB-C Hub",
              image: "usb-c-hub.jpg",
              price: 950000,
              quantity: 10,
              discount: 0,
              amount: 9500000,
            },
            {
              id: 7,
              name: "HD Webcam",
              image: "webcam.jpg",
              price: 1650000,
              quantity: 7,
              discount: 12,
              amount: 10164000,
            },
            {
              id: 9,
              name: "External SSD",
              image: "external-ssd.jpg",
              price: 2300000,
              quantity: 4,
              discount: 8,
              amount: 8464000,
            },
          ];
          newProducts.forEach((p) => products.push(p));
          printProducts(products);
          console.log("Products after sort");
          printProducts(products.sort((a, b) => a.id - b.id));

          const searchId = 11;
          console.log("Search ID: ", searchId);
          console.time("bnSearchById");
          const foundById = bnSearchById(products, searchId);
          console.timeEnd("bnSearchById");

          if (foundById) {
            console.table(foundById);
          }

          return searchMenu();
        case 0:
          console.log("To Main Menu!");
          return mainMenu();
        default:
          return searchMenu();
      }
    },
  );
};

let haveProducts: boolean = false;

const sortMenu = (): void => {
  askNumber(
    `
=============SORT MENU=============
1. Bubble sort
2. Quick sort
0. Main Menu
Enter your choice(0-2): `,
    0,
    2,
    true,
    (choice) => {
      switch (choice) {
        case 1:
          const newProducts: Product[] = [
            {
              id: 10,
              name: "Mechanical Keyboard",
              image: "keyboard.jpg",
              price: 850000,
              quantity: 12,
              discount: 5,
              amount: 0,
            },
            {
              id: 8,
              name: "Wireless Mouse",
              image: "mouse.jpg",
              price: 450000,
              quantity: 20,
              discount: 10,
              amount: 0,
            },
            {
              id: 5,
              name: "27-inch Monitor",
              image: "monitor.jpg",
              price: 4500000,
              quantity: 5,
              discount: 15,
              amount: 0,
            },
            {
              id: 4,
              name: "Wireless Headphones",
              image: "headphones.jpg",
              price: 1200000,
              quantity: 8,
              discount: 20,
              amount: 0,
            },
            {
              id: 6,
              name: "USB-C Hub",
              image: "usb-c-hub.jpg",
              price: 950000,
              quantity: 10,
              discount: 0,
              amount: 0,
            },
            {
              id: 7,
              name: "HD Webcam",
              image: "webcam.jpg",
              price: 1650000,
              quantity: 7,
              discount: 12,
              amount: 0,
            },
            {
              id: 9,
              name: "External SSD",
              image: "external-ssd.jpg",
              price: 2300000,
              quantity: 4,
              discount: 8,
              amount: 0,
            },
          ];
          newProducts.forEach((p) => products.push(p));
          haveProducts = true;
          console.log("products array before sort");
          printProducts(products);

          console.time("bbSortByPrice");
          const sorted = bbSortByPrice(products);
          console.timeEnd("bbSortByPrice");

          printProducts(sorted);
          return sortMenu();
        case 2:
          if (haveProducts) {
            console.log("products array before sort");
            products.forEach((p) => calculateAmount(p));
            printProducts(products);

            console.time("quickSortByAmount");
            const quickSort = quickSortByAmount(products);
            console.timeEnd("quickSortByAmount");
            printProducts(quickSort);
          } else {
            console.log("choose option 1 first to insert products");
          }

          return sortMenu();
        case 0:
          console.log("To Main Menu!");
          return mainMenu();
        default:
          return sortMenu();
      }
    },
  );
};

mainMenu();
