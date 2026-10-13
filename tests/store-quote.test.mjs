import assert from "node:assert/strict";
import { test } from "node:test";
import store from "../.test-build/lib/store-os/quote.js";

const { quoteStoreLines } = store;

test("quotes trusted merchandise lines with integer minor units", () => {
  assert.deepEqual(quoteStoreLines("TTD", [
    { productId: "care-1", quantity: 2, unitPriceMinorUnits: 1299 },
    { productId: "lingerie-2", quantity: 1, unitPriceMinorUnits: 4500 },
  ]), {
    currency: "TTD",
    lines: [
      { productId: "care-1", quantity: 2, unitPriceMinorUnits: 1299, lineTotalMinorUnits: 2598 },
      { productId: "lingerie-2", quantity: 1, unitPriceMinorUnits: 4500, lineTotalMinorUnits: 4500 },
    ],
    subtotalMinorUnits: 7098,
  });
});

test("allows an empty cart quote without implying checkout", () => {
  assert.deepEqual(quoteStoreLines("USD", []), { currency: "USD", lines: [], subtotalMinorUnits: 0 });
});

test("rejects invalid values, duplicates, and overflow", () => {
  assert.throws(() => quoteStoreLines("usd", []), RangeError);
  for (const quantity of [0, 1.2, 100]) {
    assert.throws(() => quoteStoreLines("USD", [{ productId: "sku", quantity, unitPriceMinorUnits: 0 }]), RangeError);
  }
  assert.throws(() => quoteStoreLines("USD", [{ productId: "", quantity: 1, unitPriceMinorUnits: 0 }]), RangeError);
  assert.throws(() => quoteStoreLines("USD", [{ productId: "sku", quantity: 1, unitPriceMinorUnits: -1 }]), RangeError);
  assert.throws(() => quoteStoreLines("USD", [
    { productId: "sku", quantity: 1, unitPriceMinorUnits: 1 },
    { productId: "sku", quantity: 1, unitPriceMinorUnits: 1 },
  ]), RangeError);
  assert.throws(() => quoteStoreLines("USD", [{ productId: "sku", quantity: 99, unitPriceMinorUnits: Number.MAX_SAFE_INTEGER }]), RangeError);
});
