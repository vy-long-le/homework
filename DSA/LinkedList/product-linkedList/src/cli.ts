import * as readline from "node:readline";
import { stdin, stdout } from "node:process";
import { Product, productList } from "./product-core.js";

const rl = readline.createInterface({ input: stdin, output: stdout });

type AddDirection = "prepend" | "append";
type Done = () => void;

// ------------------------------ HELPERS ------------------------------
const askNumber = (
  prompt: string,
  min: number,
  max: number,
  integer: boolean = false,
  canBeEmpty: boolean = false,
  done: (value: number | null) => void,
): void => {
  rl.question(prompt, (raw) => {
    const trimmed = raw.trim();

    if (trimmed === "") {
      if (canBeEmpty) return done(null);
      console.error("a number is required");
      return askNumber(prompt, min, max, integer, canBeEmpty, done);
    }

    const number = Number(trimmed);
    const valid =
      number >= min && number <= max && (!integer || Number.isInteger(number));
    if (valid) return done(number);

    console.error(
      `Invalid choice. Please choose a ${integer ? "an integer" : "a number"} from ${min} to ${max}`,
    );
    askNumber(prompt, min, max, integer, canBeEmpty, done);
  });
};

const askText = (
  prompt: string,
  canBeEmpty: boolean = false,
  done: (value: string | null) => void,
): void => {
  rl.question(prompt, (raw) => {
    const trimmed = raw.trim();

    if (trimmed === "") {
      if (canBeEmpty) return done(null);
      console.error("text must not be empty");
      return askText(prompt, canBeEmpty, done);
    }

    done(trimmed);
  });
};

// ------------------------------ CREATE ------------------------------
const addProduct = (done: Done): void => {
  askText("Enter name: ", false, (name) => {
    askNumber(
      "Enter price: ",
      0,
      Number.MAX_SAFE_INTEGER,
      false,
      false,
      (price) => {
        askText("Enter image URL: ", false, (img) => {
          askNumber(
            "1. Prepend\n2. Append\nEnter your choice: ",
            1,
            2,
            true,
            false,
            (dirOption) => {
              const dir: AddDirection = dirOption === 1 ? "prepend" : "append";
              productList.createProduct(new Product(name!, price!, img!), dir);
              console.log("add product successfully");
              done();
            },
          );
        });
      },
    );
  });
};

// ------------------------------ UPDATE ------------------------------
const updateById = (done: Done): void => {
  productList.printAll();
  askText("Enter id: ", false, (id) => {
    const found = productList.findNodeById(id!);
    if (found === null) {
      console.log(`can not find product with id (${id})`);
      return done();
    }
    console.table(found.data);

    let patch: object = {};
    askText("Enter new name(Leave empty to skip): ", true, (name) => {
      askNumber(
        "Enter new price(Leave empty to skip): ",
        0,
        Number.MAX_SAFE_INTEGER,
        false,
        true,
        (price) => {
          askText("Enter new img(Leave empty to skip): ", true, (img) => {
            let patch: object = {};
            if (name !== null) patch = { ...patch, name };
            if (price !== null) patch = { ...patch, price };
            if (img !== null) patch = { ...patch, img };

            productList.updateNodeData(found.data, patch);
            console.table(found.data);
            done();
          });
        },
      );
    });
  });
};

// ------------------------------ DELETE ------------------------------
const deleteById = (done: Done): void => {
  productList.printAll();
  askText("Enter id: ", false, (id) => {
    const found = productList.findNodeById(id!);
    if (found === null) {
      console.log(`can not find product with id (${id})`);
      return done();
    }
    console.table(found.data);

    askNumber(
      "1. Yes\n2. No\nEnter your choice: ",
      1,
      2,
      true,
      false,
      (choice) => {
        if (choice === 2) {
          console.log("cancel deletion");
        } else {
          productList.removeNode(found);
          console.log("delete successfully");
        }
        done();
      },
    );
  });
};

// ------------------------------ SEARCH ------------------------------
const searchProduct = (done: Done): void => {
  askNumber(
    "1. Search by ID\n2. Search by name\nEnter your choice: ",
    1,
    2,
    true,
    false,
    (choice) => {
      if (choice === 1) {
        askText("Enter id: ", false, (id) => {
          const found = productList.findNodeById(id!);
          if (found === null) {
            console.log(`can not find product with id (${id})`);
          } else {
            console.table(found.data);
          }
          done();
        });
      } else {
        askText("Enter name: ", false, (name) => {
          const found = productList.findProductsByName(name!);
          if (found.length === 0) {
            console.log(`can not find any product with name (${name})`);
          } else {
            console.table(found);
          }
          done();
        });
      }
    },
  );
};

// ------------------------------ MENU ------------------------------
const mainMenu = (): void => {
  askNumber(
    `
=============MAIN MENU=============
1. Create
2. Read
3. Update
4. Delete
5. Search
0. Exit
Enter your choice(0-5): `,
    0,
    5,
    true,
    false,
    (choice) => {
      switch (choice) {
        case 1:
          return addProduct(mainMenu);
        case 2:
          productList.printAll();
          return mainMenu();
        case 3:
          return updateById(mainMenu);
        case 4:
          return deleteById(mainMenu);
        case 5:
          return searchProduct(mainMenu);
        case 0:
          console.log("Exit the program. Thank you for using.");
          return rl.close();
        default:
          return mainMenu();
      }
    },
  );
};

mainMenu();
