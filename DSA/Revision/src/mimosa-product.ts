import { findProductById } from "./array.js";

export interface Product {
  id: number;
  name: string;
  image: string;
  price: number;
  quantity: number;
  discount: number;
  amount: number;
}

export interface ProductPatch {
  name: string;
  image: string;
  price: number;
  quantity: number;
  discount: number;
  amount: number;
}

export const products: Product[] = [
  {
    id: 1,
    name: "Laptop Lenovo",
    image: "lenovo.jpg",
    price: 14500000,
    quantity: 6,
    discount: 0,
    amount: 0,
  },
  {
    id: 2,
    name: "iPhone 16",
    image: "iphone16.jpg",
    price: 23000000,
    quantity: 13,
    discount: 0,
    amount: 0,
  },
];

class Stack<T extends Product> {
  private items: T[] = [];

  constructor(private readonly capacity: number) {}

  isEmpty(): boolean {
    return this.items.length === 0;
  }

  isFull(): boolean {
    return this.items.length >= this.capacity;
  }

  pushItem(item: T): void {
    if (this.isFull()) {
      console.log("Stack Full");
      return;
    }
    const found = findProductById(item.id, this.items);
    if (found) {
      console.log(`item with ID (${item.id}) is duplicated`);
      return;
    }
    this.items.push(item);
  }

  popItem(): T | undefined {
    return this.items.pop();
  }

  toArray(): T[] {
    return [...this.items];
  }

  peek(): T | void {
    if (this.isEmpty()) {
      console.log("stack empty");
      return;
    }
    const peekedProduct = this.items[this.items.length - 1];
    if (peekedProduct === undefined) {
      return;
    }
    return peekedProduct;
  }
}

export const productsStack = new Stack<Product>(100);

class Queue<T extends Product> {
  private items: T[] = [];

  constructor(private readonly capacity: number) {}

  isFull(): boolean {
    return this.items.length === this.capacity;
  }

  isEmpty(): boolean {
    return this.items.length === 0;
  }

  enqueue(item: T): void {
    const found = findProductById(item.id, this.items);
    if (found) {
      console.log(`item with ID (${item.id}) is duplicated`);
      return;
    }
    this.items.push(item);
  }

  dequeue(): T | undefined {
    return this.items.shift();
  }

  toArray(): T[] {
    return [...this.items];
  }

  front(): T | void {
    if (this.isEmpty()) {
      console.log("queue empty");
      return;
    }

    const front = this.items[0];
    return front;
  }
}

export const productsQueue = new Queue<Product>(100);

class ListNode<T> {
  data: T;
  next: ListNode<T> | null;

  constructor(data: T) {
    this.data = data;
    this.next = null;
  }
}

class LinkedList<T extends Product> {
  head: ListNode<T> | null;
  tail: ListNode<T> | null;

  constructor() {
    this.head = null;
    this.tail = null;
  }

  isEmpty(): boolean {
    return this.head === null;
  }

  prepend(data: T): ListNode<T> | undefined {
    const newNode = new ListNode<T>(data);
    if (this.isEmpty()) {
      this.head = newNode;
      this.tail = newNode;
      return newNode;
    }
    if (this.hasDuplicate(data.id)) {
      console.log(`data with ID (${data.id}) is duplicated`);
      return;
    }
    const firstNode = this.head;
    this.head = newNode;
    newNode.next = firstNode;

    return newNode;
  }

  append(data: T): ListNode<T> | undefined {
    if (this.hasDuplicate(data.id)) {
      console.log(`data with ID (${data.id}) is duplicated`);
      return;
    }
    const lastListNode = this.tail;

    if (lastListNode === null) {
      return this.prepend(data);
    }
    const newNode = new ListNode<T>(data);
    lastListNode.next = newNode;
    this.tail = newNode;

    return newNode;
  }

  print(): void {
    if (this.isEmpty()) {
      console.log("nothing to print");
      return;
    }

    let currentNode = this.head;
    let result: string = "";

    while (currentNode !== null) {
      result += `ID: ${currentNode.data.id} - Name: ${currentNode.data.name} - Image: ${currentNode.data.image} - Quantity: ${currentNode.data.quantity} - Discount: ${currentNode.data.discount}% - Amount: ${currentNode.data.amount} ->\n`;
      currentNode = currentNode.next;
    }
    console.log(`${result}null`);
  }

  hasDuplicate(id: number): boolean {
    let current = this.head;
    if (current === null) {
      return false;
    }

    while (current !== null) {
      if (current.data.id === id) {
        return true;
      }

      current = current.next;
    }

    return false;
  }
}

export const productsLinkedList = new LinkedList();
