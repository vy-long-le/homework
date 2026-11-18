export interface Product {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

export type Result =
  | { ok: true; product: Product }
  | { ok: false; error: string };

type ValidationResult<T> =
  | { ok: true; value: T }
  | { ok: false; error: string };

export type ProductListResult =
  | { ok: true; products: Product[] }
  | { ok: false; error: string };

// Create empty store var with Set data-structure typed Product
const store = new Set<Product>();

//* ===================== CREATE =====================

/**
 * createProduct
 * * Create a product from an unknown input, after creating, return a copy of that product
 * @param input The unknown keys-values from the input
 * @returns Result
 */
export function createProduct(input: unknown): Result {
  const validProduct = checkValidInput(input);
  if (!validProduct.ok) return validProduct;

  const candidateName = checkValidName(validProduct.value);
  if (!candidateName.ok) return candidateName;

  const candidatePrice = checkValidPrice(validProduct.value);
  if (!candidatePrice.ok) return candidatePrice;

  const candidateQuantity = checkValidQuantity(validProduct.value);
  if (!candidateQuantity.ok) return candidateQuantity;

  const product: Product = {
    id: calculateId(),
    name: candidateName.value,
    price: candidatePrice.value,
    quantity: candidateQuantity.value,
  };
  store.add(product);

  return {
    ok: true,
    product: { ...product },
  };
}

function ok<T>(value: T): ValidationResult<T> {
  return { ok: true, value };
}

/**
 * checkValidInput
 * * turn unknown input into an object of fields-values
 * @param input unknown, the input that need to check
 * @returns ValidationResult<object>, access input object via .value
 */
function checkValidInput(input: unknown): ValidationResult<object> {
  if (input === null || typeof input !== "object" || Array.isArray(input)) {
    return { ok: false, error: "input must be an object" };
  }

  return ok(input);
}

/**
 * checkValidId
 * * get a valid ID string value from an input object
 * @param input object, the object that contain the ID
 * @returns ValidationResult<string>, status ok: true | false,
 * error: string | value: if typed string
 */
function checkValidId(input: object): ValidationResult<string> {
  const candidateId = "id" in input ? input.id : undefined;
  if (typeof candidateId !== "string") {
    return { ok: false, error: "id field invalid" };
  }

  const trimmedId = candidateId.trim();

  if (trimmedId === "") {
    return { ok: false, error: "id must not be empty" };
  }

  const validId = /^P\d{3,}$/.test(trimmedId);
  const num = Number(trimmedId.replace("P", ""));
  const canonicalId = "P" + String(num).padStart(3, "0");
  const isSafeInteger = Number.isSafeInteger(num);

  if (!validId) {
    return { ok: false, error: "id value invalid" };
  }
  if (!isSafeInteger) {
    return { ok: false, error: "id number part must be a safe integer" };
  }
  if (trimmedId !== canonicalId) {
    return { ok: false, error: "id must match base pattern (P001)" };
  }

  return ok(trimmedId);
}

/**
 * checkValidName
 * * from the input object get the value of the name field
 * @param input object, the object that we want to get the name field value
 * @returns ValidationResult<string>, access name value via .value
 */
function checkValidName(input: object): ValidationResult<string> {
  const candidateName = "name" in input ? input.name : undefined;
  if (typeof candidateName !== "string") {
    return { ok: false, error: "name field invalid" };
  }

  const trimmedCandidateName = candidateName.trim();

  if (trimmedCandidateName === "") {
    return { ok: false, error: "name value can not be empty" };
  }

  return ok(trimmedCandidateName);
}

/**
 * checkValidPrice
 * * from the input object get the value of the price field
 * @param input object, the object that we want to get the price field value
 * @returns ValidationResult<number>, access price value via .value
 */
function checkValidPrice(input: object): ValidationResult<number> {
  const candidatePrice = "price" in input ? input.price : undefined;
  if (typeof candidatePrice !== "number") {
    return { ok: false, error: "price field invalid" };
  }

  if (!isValidNumber(candidatePrice, 0, Number.MAX_SAFE_INTEGER)) {
    return { ok: false, error: "price value invalid" };
  }

  return ok(candidatePrice);
}

/**
 * checkValidQuantity
 * * from the input object get the value of the quantity field
 * @param input object, the object that we want to get the quantity field value
 * @returns ValidationResult<number>, access quantity value via .value
 */
function checkValidQuantity(input: object): ValidationResult<number> {
  const candidateQuantity = "quantity" in input ? input.quantity : undefined;
  if (typeof candidateQuantity !== "number") {
    return { ok: false, error: "quantity field invalid" };
  }

  if (!isValidNumber(candidateQuantity, 0, Number.MAX_SAFE_INTEGER, true)) {
    return { ok: false, error: "quantity value invalid" };
  }

  return ok(candidateQuantity);
}

/**
 * isValidNumber
 * * check that if a number is valid or not, after checking, return a boolean
 * @param n The number we want to check
 * @param min The minimum number n can be
 * @param max The maximum number n can be
 * @param integer If n is an integer or not
 * @returns boolean
 */
function isValidNumber(
  n: number,
  min: number,
  max: number,
  integer = false,
): boolean {
  const valid =
    Number.isFinite(n) &&
    n >= min &&
    n <= max &&
    (!integer || Number.isInteger(n));
  return valid;
}

/**
 * calculateId
 * * calculate the new id base on the current ids in store by taking the highest id + 1. Base id is "P001"
 * @returns a new string ID
 * ? Should this function add a parameter for future modularize of "store" Set<Product>
 */
function calculateId(): string {
  const storeArr: Product[] = [...store];
  if (storeArr.length === 0) {
    return "P001";
  }
  const idArr = storeArr.map((s) => s.id);
  const numberedIdArr = idArr.map((id) => Number(id.replace("P", "")));
  const maxNumber: number = Math.max(...numberedIdArr);
  const nextId: string = "P" + `${maxNumber + 1}`.padStart(3, "0");
  return nextId;
}

//* ===================== LIST =====================

//* Return a Product array whose items are copied object from the store
export function listProducts(): Product[] {
  const result: Product[] = [];

  for (const p of store) {
    result.push({ ...p });
  }

  return result;
}

//* ===================== DELETE =====================

/**
 * deleteProduct
 * * delete a product from the store, after deleting, return a copied object of that deleted product
 * @param id unknown, the id of the product we want to delete
 * @returns the copied of the product that's just been deleted
 */
export function deleteProduct(id: unknown): Result {
  const found = findProductById(id);

  if (!found.ok) {
    return found;
  }

  store.delete(found.product);

  return { ok: true, product: { ...found.product } };
}

/**
 * findProductById
 * * find the original product in the store by id
 * @param id unknown, the id we want to search for
 * @returns Result with the original product object
 */
function findProductById(id: unknown): Result {
  if (typeof id !== "string") {
    return { ok: false, error: "id must be a string" };
  }

  const storeArr: Product[] = [...store];
  const normalizedId: string = id.toLowerCase().trim();

  if (normalizedId === "") {
    return { ok: false, error: "ID must not be empty" };
  }

  const found: Product | undefined = storeArr.find(
    (s) => s.id.toLowerCase() === normalizedId,
  );

  if (!found) {
    return {
      ok: false,
      error: `product with ID (${id}) is not in store`,
    };
  }

  return { ok: true, product: found };
}

export function getProductById(id: unknown): Result {
  const product = findProductById(id);
  if (!product.ok) return product;

  return { ok: true, product: { ...product.product } };
}

//* ===================== UPDATE =====================

/**
 * updateProduct
 * * update an existing product in the store
 * @param id unknown, the id of the product that we want to update
 * @param patch unknown, the values of the product that we want to update
 * @returns Result, status ok: true | false, error: string | product: copy of the updated product in the store
 */
export function updateProduct(id: unknown, patch: unknown): Result {
  const found = findProductById(id);
  if (!found.ok) return found;

  const validProduct = checkValidInput(patch);
  if (!validProduct.ok) return validProduct;

  const patchValueObj = validProduct.value;

  const hasNameField = Object.hasOwn(patchValueObj, "name");
  const hasPriceField = Object.hasOwn(patchValueObj, "price");
  const hasQuantityField = Object.hasOwn(patchValueObj, "quantity");
  if (!hasNameField && !hasPriceField && !hasQuantityField)
    return { ok: false, error: "patch needs name, price or quantity" };

  let updatedName = found.product.name;
  let updatedPrice = found.product.price;
  let updatedQuantity = found.product.quantity;

  if (hasNameField) {
    const name = checkValidName(patchValueObj);
    if (!name.ok) return name;

    updatedName = name.value;
  }
  if (hasPriceField) {
    const price = checkValidPrice(patchValueObj);
    if (!price.ok) return price;

    updatedPrice = price.value;
  }
  if (hasQuantityField) {
    const quantity = checkValidQuantity(patchValueObj);
    if (!quantity.ok) return quantity;

    updatedQuantity = quantity.value;
  }

  found.product.name = updatedName;
  found.product.price = updatedPrice;
  found.product.quantity = updatedQuantity;

  return { ok: true, product: { ...found.product } };
}

//* ===================== SEARCH =====================

/**
 * searchProducts
 * * search list of products from an unknown query to the current store
 * @param query unknown, the name of the product we want to search
 * @returns ProductListResult, status ok: true | false, error: string | products: Product[]
 */
export function searchProducts(query: unknown): ProductListResult {
  if (typeof query !== "string") {
    return { ok: false, error: "query must be a string" };
  }

  const trimmedQuery = query.trim();
  if (trimmedQuery === "") {
    return { ok: true, products: listProducts() };
  }

  const searchedQuery = toSearchText(trimmedQuery);

  const foundProducts = listProducts().filter((s) =>
    toSearchText(s.name).includes(searchedQuery),
  );

  return { ok: true, products: foundProducts };
}

/**
 * toSearchText
 * * turn a string query into lower case -> normalized with NFD (flatten VI marks into string)
 * * -> replace those VI marks with "" (remove)
 * * -> replace all "đ" with "d" (NFD can't turn it into string)
 * @param query string, the query that we want to clean
 * @returns string, the query after being cleaned
 */
function toSearchText(query: string): string {
  const lowerCaseQuery = query.toLowerCase();
  const normalizedQuery = lowerCaseQuery.normalize("NFD");
  const noAccentsQuery = normalizedQuery.replace(/\p{M}/gu, "");
  const specialCharQuery = noAccentsQuery.replace(/đ/g, "d");

  return specialCharQuery;
}

//* ===================== SORT =====================

/**
 * sortProducts
 * * sort products list from listProducts() or searchProducts()
 * * by name, price or quantity with direction ascending or descending
 * @param products Product[], get from listProducts() or searchProducts()
 * @param by unknown, user input by name, price or quantity
 * @param direction unknown, user input direction asc or desc
 * @returns ProductListResult, status ok: true | false, error: string | products: Product[]
 */
export function sortProducts(
  products: Product[],
  by: unknown,
  direction: unknown,
): ProductListResult {
  if (typeof by !== "string" || !["name", "price", "quantity"].includes(by)) {
    return { ok: false, error: `by must be "name", "price" or "quantity"` };
  }

  if (typeof direction !== "string" || !["asc", "desc"].includes(direction)) {
    return { ok: false, error: `direction must be "asc" or "desc"` };
  }

  const sortedProducts: Product[] = [];

  for (const p of products) {
    sortedProducts.push({ ...p });
  }

  const sign = direction === "asc" ? 1 : -1;

  sortedProducts.sort((a, b) => {
    if (by === "name") return sign * a.name.localeCompare(b.name, "vi");
    if (by === "price") return sign * (a.price - b.price);
    return sign * (a.quantity - b.quantity);
  });

  return { ok: true, products: sortedProducts };
}

//* ===================== LOAD =====================

/**
 * loadProducts
 * * from a data list typed unknown -> load -> check -> replace store -> return copy
 * @param data unknown, the data that we want to process
 * @returns ProductListResult, status ok: true | false, error: string |
 * products: Product[]
 */
export function loadProducts(data: unknown): ProductListResult {
  if (!Array.isArray(data)) {
    return { ok: false, error: "data must be an array" };
  }

  const validData: Product[] = [];
  const validIds = new Set<string>();

  for (let i = 0; i < data.length; i++) {
    const dObj = checkValidInput(data[i]);
    if (!dObj.ok) return { ok: false, error: `data[${i}]: ${dObj.error}` };

    const dId = checkValidId(dObj.value);
    if (!dId.ok) return { ok: false, error: `data[${i}]: ${dId.error}` };

    const dName = checkValidName(dObj.value);
    if (!dName.ok) return { ok: false, error: `data[${i}]: ${dName.error}` };

    const dPrice = checkValidPrice(dObj.value);
    if (!dPrice.ok) return { ok: false, error: `data[${i}]: ${dPrice.error}` };

    const dQuantity = checkValidQuantity(dObj.value);
    if (!dQuantity.ok)
      return { ok: false, error: `data[${i}]: ${dQuantity.error}` };

    if (validIds.has(dId.value)) {
      return { ok: false, error: `data[${i}]: has duplicated ID` };
    }
    validIds.add(dId.value);

    validData.push({
      id: dId.value,
      name: dName.value,
      price: dPrice.value,
      quantity: dQuantity.value,
    });
  }

  store.clear();
  for (const p of validData) {
    store.add(p);
  }

  return { ok: true, products: listProducts() };
}
