import {
  type Product,
  createProduct,
  listProducts,
  deleteProduct,
  getProductById,
  updateProduct,
  searchProducts,
  sortProducts,
} from "./product-core.js";

function getElement(id: string): HTMLElement {
  const element = document.getElementById(id);
  if (!(element instanceof HTMLElement)) {
    throw new Error(`element #${id} not found`);
  }

  return element;
}

function getInput(id: string): HTMLInputElement {
  const element = document.getElementById(id);
  if (!(element instanceof HTMLInputElement)) {
    throw new Error(`input element #${id} not found`);
  }

  return element;
}

function getFormElement(id: string): HTMLFormElement {
  const element = document.getElementById(id);
  if (!(element instanceof HTMLFormElement)) {
    throw new Error(`form element #${id} not found`);
  }

  return element;
}

function getSelectElement(id: string): HTMLSelectElement {
  const element = document.getElementById(id);
  if (!(element instanceof HTMLSelectElement)) {
    throw new Error(`select element #${id} not found`);
  }

  return element;
}

function renderProducts(products: Product[]): void {
  const tBodyEle = getElement("product-body");
  tBodyEle.replaceChildren();
  const emptyMessageEle = getElement("empty-message");

  if (products.length === 0) {
    emptyMessageEle.hidden = false;
  } else {
    emptyMessageEle.hidden = true;

    for (const p of products) {
      const tRowEle = document.createElement("tr");
      const tDataIdEle = document.createElement("td");
      const tDataNameEle = document.createElement("td");
      const tDataPriceEle = document.createElement("td");
      const tDataQuantityEle = document.createElement("td");
      const tDataActionsEle = document.createElement("td");
      const editBtn = document.createElement("button");
      const deleteBtn = document.createElement("button");

      tDataPriceEle.className = "num";
      tDataQuantityEle.className = "num";
      tDataActionsEle.className = "actions";
      editBtn.textContent = "Edit";
      deleteBtn.textContent = "Delete";
      editBtn.className = "btn";
      deleteBtn.className = "btn btn-danger";
      tDataIdEle.textContent = p.id;
      tDataNameEle.textContent = p.name;
      tDataPriceEle.textContent = p.price.toLocaleString("vi-VN", {
        style: "currency",
        currency: "VND",
      });
      tDataQuantityEle.textContent = String(p.quantity);
      editBtn.dataset["action"] = "edit";
      deleteBtn.dataset["action"] = "delete";
      editBtn.dataset["id"] = p.id;
      deleteBtn.dataset["id"] = p.id;

      tDataActionsEle.append(editBtn, deleteBtn);
      tRowEle.append(
        tDataIdEle,
        tDataNameEle,
        tDataPriceEle,
        tDataQuantityEle,
        tDataActionsEle,
      );
      tBodyEle.append(tRowEle);
    }
  }
}

function refresh(): void {
  const emptyMessageEle = getElement("empty-message");
  const query = getInput("search-input");
  const trimmedQueryValue = query.value.trim();

  let products: Product[];

  if (trimmedQueryValue === "") {
    products = listProducts();
  } else {
    const foundProducts = searchProducts(trimmedQueryValue);
    if (!foundProducts.ok) {
      throw new Error(foundProducts.error);
    }
    if (foundProducts.products.length === 0) {
      emptyMessageEle.hidden = false;
      products = [];
    }

    products = foundProducts.products;
  }

  const sortBy = getSelectElement("sort-by");
  const sortDir = getSelectElement("sort-dir");
  if (sortBy.value !== "") {
    const sortedProducts = sortProducts(products, sortBy.value, sortDir.value);
    if (!sortedProducts.ok) {
      throw new Error(sortedProducts.error);
    }

    products = sortedProducts.products;
  }

  renderProducts(products);
}

function seedDemoProducts(): void {
  const seedProducts = [
    { name: "Laptop", price: 24000000, quantity: 5 },
    { name: "Mouse", price: 720000, quantity: 50 },
    { name: "Keyboard", price: 1920000, quantity: 20 },
    { name: "Monitor", price: 7200000, quantity: 8 },
    { name: "USB Cable", price: 240000, quantity: 100 },
  ];

  for (const p of seedProducts) {
    const newProduct = createProduct(p);
    if (!newProduct.ok) throw new Error(newProduct.error);
  }
}

function handleAddSubmit(event: SubmitEvent): void {
  event.preventDefault();
  const errorMsgEle = getElement("add-error");

  const nameInp = getInput("add-name");
  const priceInp = getInput("add-price");
  const quantityInp = getInput("add-quantity");

  const trimmedNameInp = nameInp.value.trim();
  const trimmedPriceInp = priceInp.value.trim();
  const trimmedQuantityInp = quantityInp.value.trim();

  if (trimmedPriceInp === "" || trimmedQuantityInp === "") {
    errorMsgEle.hidden = false;
    errorMsgEle.textContent = "price and quantity can not be empty";
    return;
  }

  const newProduct = createProduct({
    name: trimmedNameInp,
    price: Number(trimmedPriceInp),
    quantity: Number(trimmedQuantityInp),
  });
  if (!newProduct.ok) {
    errorMsgEle.hidden = false;
    errorMsgEle.textContent = newProduct.error;
    return;
  }
  errorMsgEle.hidden = true;
  nameInp.value = "";
  priceInp.value = "";
  quantityInp.value = "";
  refresh();
}

function handleTableClick(event: MouseEvent): void {
  if (!(event.target instanceof Element)) return;

  const productBodyEle = getElement("product-body");

  const btn = event.target.closest<HTMLButtonElement>("button[data-id]");

  if (!btn || !productBodyEle.contains(btn)) return;

  const action = btn.dataset.action;
  const id = btn.dataset.id;

  if (!action || !id) return;

  const editSection = getElement("edit-section");
  const idInp = getInput("edit-id");
  const nameInp = getInput("edit-name");
  const priceInp = getInput("edit-price");
  const qtyInp = getInput("edit-quantity");

  if (action === "delete") {
    if (window.confirm("Delete this product?")) {
      const deleteStatus = deleteProduct(id);
      if (!deleteStatus.ok) {
        throw new Error(deleteStatus.error);
      }
      if (id === idInp.value) {
        closeEditSection();
      }
      refresh();
    }
  }
  if (action === "edit") {
    const editFrm = getFormElement("edit-form");
    const editError = getElement("edit-error");

    editFrm.reset();
    editError.textContent = "";
    editError.hidden = true;
    const oldProduct = getProductById(id);
    if (!oldProduct.ok) {
      throw new Error(oldProduct.error);
    }

    idInp.value = oldProduct.product.id;
    nameInp.placeholder = oldProduct.product.name;
    priceInp.placeholder = String(oldProduct.product.price);
    qtyInp.placeholder = String(oldProduct.product.quantity);

    editSection.hidden = false;
  }
}

function handleEditSubmit(event: SubmitEvent): void {
  event.preventDefault();

  const idInp = getInput("edit-id");
  const nameInp = getInput("edit-name");
  const priceInp = getInput("edit-price");
  const qtyInp = getInput("edit-quantity");

  const trimmedNameValue = nameInp.value.trim();
  const trimmedPriceValue = priceInp.value.trim();
  const trimmedQtyValue = qtyInp.value.trim();
  const editError = getElement("edit-error");

  let patch: object = {};

  if (trimmedNameValue !== "") {
    patch = { ...patch, name: trimmedNameValue };
  }
  if (trimmedPriceValue !== "") {
    patch = { ...patch, price: Number(trimmedPriceValue) };
  }
  if (trimmedQtyValue !== "") {
    patch = { ...patch, quantity: Number(trimmedQtyValue) };
  }

  const updatedProduct = updateProduct(idInp.value, patch);
  if (!updatedProduct.ok) {
    editError.textContent = updatedProduct.error;
    editError.hidden = false;
    return;
  }

  closeEditSection();
  refresh();
}

function closeEditSection(): void {
  const editSection = getElement("edit-section");
  const editFrm = getFormElement("edit-form");
  const editError = getElement("edit-error");

  editFrm.reset();
  editError.textContent = "";
  editError.hidden = true;
  editSection.hidden = true;
}

getElement("tools").hidden = false;

getElement("add-form").addEventListener("submit", handleAddSubmit);

getElement("product-body").addEventListener("click", handleTableClick);

getElement("edit-form").addEventListener("submit", handleEditSubmit);

getElement("edit-cancel").addEventListener("click", closeEditSection);

getInput("search-input").addEventListener("input", refresh);

getSelectElement("sort-by").addEventListener("change", refresh);

getSelectElement("sort-dir").addEventListener("change", refresh);

seedDemoProducts();
refresh();
