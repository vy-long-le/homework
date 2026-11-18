export class Product {
  private static idCounter: number = 0;
  private id: string;
  private name: string;
  private price: number;
  private img: string;

  constructor(name: string, price: number, img: string) {
    this.id = this.calculateNextId();
    this.name = name;
    this.price = price;
    this.img = img;
  }

  calculateNextId(): string {
    return "P" + String(++Product.idCounter).padStart(3, "0");
  }

  getId(): string {
    return this.id;
  }

  getName(): string {
    return this.name;
  }

  setName(name: string): void {
    this.name = name;
  }

  setPrice(price: number): void {
    this.price = price;
  }

  setImg(img: string): void {
    this.img = img;
  }
}

class ListNode<T> {
  data: T;
  next: ListNode<T> | null;

  constructor(data: T) {
    this.data = data;
    this.next = null;
  }
}

class LinkedList<T extends Product> {
  private head: ListNode<T> | null;
  private tail: ListNode<T> | null;

  constructor() {
    this.head = null;
    this.tail = null;
  }

  isEmpty(): boolean {
    if (this.head === null) {
      return true;
    }
    return false;
  }

  createProduct(product: T, dir: string): void {
    if (dir === "prepend") {
      this.prepend(product);
    } else {
      this.append(product);
    }
  }

  prepend(data: T): void {
    const newNode = new ListNode<T>(data);
    if (this.isEmpty()) {
      this.head = newNode;
      this.tail = newNode;
      return;
    }
    const firstNode = this.head;
    this.head = newNode;
    newNode.next = firstNode;
  }

  append(data: T): void {
    const lastNode = this.tail;
    if (lastNode === null) {
      this.prepend(data);
      return;
    }
    const newNode = new ListNode<T>(data);
    lastNode.next = newNode;
    this.tail = newNode;
  }

  printAll(): void {
    const productArr: T[] = [];
    let currentNode = this.head;
    if (currentNode === null) {
      return console.log("no products");
    }
    while (currentNode !== null) {
      productArr.push(currentNode.data);
      currentNode = currentNode.next;
    }
    console.table(productArr);
  }

  findNodeById(id: string): ListNode<T> | null {
    let currentNode = this.head;
    const normalizedId = id.toLowerCase();
    while (currentNode !== null) {
      if (currentNode.data.getId().toLowerCase() !== normalizedId) {
        currentNode = currentNode.next;
      } else {
        return currentNode;
      }
    }

    return null;
  }

  findProductsByName(name: string): T[] {
    let currentNode = this.head;
    const normalizedName = name.trim().toLowerCase();

    const found: T[] = [];
    while (currentNode !== null) {
      if (currentNode.data.getName().toLowerCase().includes(normalizedName)) {
        found.push(currentNode.data);
      }
      currentNode = currentNode.next;
    }

    return found;
  }

  updateNodeData(data: T, patch: unknown): void {
    if (patch === null || typeof patch !== "object" || Array.isArray(patch)) {
      return console.log("patch must be an object");
    }

    const hasNameField = Object.hasOwn(patch, "name");
    const hasPriceField = Object.hasOwn(patch, "price");
    const hasImgField = Object.hasOwn(patch, "img");
    if (!hasNameField && !hasPriceField && !hasImgField) {
      return console.log("patch needs name, price, or img");
    }

    if (hasNameField) {
      const name = "name" in patch ? patch.name : undefined;
      if (typeof name !== "string") {
        return console.log("name must be a string");
      }

      data.setName(name);
    }

    if (hasPriceField) {
      const price = "price" in patch ? patch.price : undefined;
      if (typeof price !== "number") {
        return console.log("price must be a number");
      }

      data.setPrice(price);
    }

    if (hasImgField) {
      const img = "img" in patch ? patch.img : undefined;
      if (typeof img !== "string") {
        return console.log("img must be a string");
      }

      data.setImg(img);
    }
  }

  findPrevNode(node: ListNode<T>): ListNode<T> | null {
    let currentNode = this.head;
    while (currentNode !== null && currentNode.next !== node) {
      currentNode = currentNode.next;
    }
    return currentNode;
  }

  removeNode(node: ListNode<T>): void {
    if (this.head === this.tail && this.head === node) {
      this.head = null;
      this.tail = null;
      return;
    }
    if (this.head !== this.tail && this.head === node) {
      this.head = node.next;
      node.next = null;
      return;
    }

    const prevNode = this.findPrevNode(node);
    if (prevNode === null) {
      return console.log("nothing to remove");
    }
    if (node.next === null) {
      prevNode.next = null;
      this.tail = prevNode;
    } else {
      prevNode.next = node.next;
      node.next = null;
    }
  }
}

export const productList = new LinkedList<Product>();
