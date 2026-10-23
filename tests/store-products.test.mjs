import assert from "node:assert/strict";
import { test } from "node:test";
import store from "../.test-build/lib/store-os/product-input.js";

const { validateStoreProductInput } = store;
const valid = {
  name: "VIXEN Gift Box",
  category: "Accessories",
  description: "A real, confirmed item with details for shoppers.",
  price: "25.50",
  currency: "USD",
  stockQuantity: "3",
  fulfillmentDetails: "Local pickup or tracked delivery arranged with VIXEN.",
  returnPolicy: "Returns accepted within seven days if unused.",
  status: "published",
};

test("validates a complete published listing and converts price to minor units", () => {
  assert.deepEqual(validateStoreProductInput(valid), {
    ok: true,
    value: {
      name: "VIXEN Gift Box",
      category: "Accessories",
      description: "A real, confirmed item with details for shoppers.",
      price_minor_units: 2550,
      currency: "USD",
      stock_quantity: 3,
      fulfillment_details: "Local pickup or tracked delivery arranged with VIXEN.",
      return_policy: "Returns accepted within seven days if unused.",
      status: "published",
    },
  });
});

test("rejects a published listing with no inventory", () => {
  assert.deepEqual(validateStoreProductInput({ ...valid, stockQuantity: "0" }), {
    ok: false,
    error: "A published listing must have stock available.",
  });
});

test("rejects unsupported currencies, fractional stock, and incomplete fulfillment terms", () => {
  assert.equal(validateStoreProductInput({ ...valid, currency: "EUR" }).ok, false);
  assert.equal(validateStoreProductInput({ ...valid, stockQuantity: "1.5" }).ok, false);
  assert.equal(validateStoreProductInput({ ...valid, returnPolicy: "none" }).ok, false);
});

test("rejects zero, malformed, and over-precision prices", () => {
  for (const price of ["0", "-1", "1.239", "1e3", "10000000"]) {
    assert.equal(validateStoreProductInput({ ...valid, price }).ok, false);
  }
});
