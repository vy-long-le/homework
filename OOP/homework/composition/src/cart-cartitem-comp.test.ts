import { describe, test } from "node:test";
import assert from "node:assert/strict";
import { Cart } from "./cart-cartitem-comp.js";

function getNumberIDFromCart(cart: Cart): number {
  return Number(cart.cartId.replace("C", ""));
}

test("total is 2268 after a 10% discount", () => {
  const cartA = new Cart("Alice", "Bruce");
  cartA.addItem("P001", "iPhone 18", 2500, 1);
  cartA.addItem("P002", "Case iPhone 18", 10, 2);
  cartA.applyDiscount(10);
  assert.equal(cartA.getTotal(), 2268);
});

describe("Cart constructor", () => {
  const validStringCases: [string, string, string, string][] = [
    ["Alice", "Bruce", "Alice", "Bruce"],
    [" Alice ", " Bruce ", "Alice", "Bruce"],
    [" Alic e", "Bruc e ", "Alic e", "Bruc e"],
    ["A\tlic\n e", "\tBruce\n", "A\tlic\n e", "Bruce"],
    ["Vỹ Lê", "Vincent Lê", "Vỹ Lê", "Vincent Lê"],
    [
      "Alice".repeat(1000),
      "Bruce".repeat(1000),
      "Alice".repeat(1000),
      "Bruce".repeat(1000),
    ],
  ];

  for (const [c, cu, exC, exCu] of validStringCases) {
    test(`accepts ${JSON.stringify(c)} / ${JSON.stringify(cu)}`, () => {
      const cart = new Cart(c, cu);
      assert.match(cart.cartId, /^C\d{3}$/);
      assert.equal(cart.cashierName, exC);
      assert.equal(cart.customerName, exCu);
    });
  }

  test("check if new id is 1 higher than latest id", () => {
    const cartA = new Cart("Alice", "Bruce");
    const cartB = new Cart("Luna", "Harry");
    assert.equal(getNumberIDFromCart(cartA), getNumberIDFromCart(cartB) - 1);
  });

  const invalidStringCases: [string, string][] = [
    ["", "Bruce"],
    [" ", "Bruce"],
    [" \t ", "Bruce"],
    [" \t\n", "Bruce"],
    ["\t\n", "Bruce"],
  ];

  for (const [c, cu] of invalidStringCases) {
    test(`throws ${JSON.stringify(c)} / ${JSON.stringify(cu)}`, () => {
      assert.throws(() => new Cart(c, cu), /empty/i);
    });
  }

  test("check if a fail constructor consume an ID", () => {
    const cartA = new Cart("Alice", "Bruce");
    assert.throws(() => new Cart("", "Kevin"), /empty/i);
    const cartC = new Cart("Alice", "Harry");
    assert.equal(getNumberIDFromCart(cartA), getNumberIDFromCart(cartC) - 1);
  });
});
