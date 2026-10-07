import assert from "node:assert/strict";
import { test } from "node:test";
import pricing from "../.test-build/lib/kernel/nine-subscription-discount.js";

const { calculateNineSubscriptionPreview } = pricing;

test("shows one-third savings rounded to cents for illustrative subscription prices", () => {
  assert.deepEqual(calculateNineSubscriptionPreview(399), {
    originalMinorUnits: 399,
    savingsMinorUnits: 133,
    discountedMinorUnits: 266,
  });
  assert.deepEqual(calculateNineSubscriptionPreview(899), {
    originalMinorUnits: 899,
    savingsMinorUnits: 300,
    discountedMinorUnits: 599,
  });
  assert.deepEqual(calculateNineSubscriptionPreview(1499), {
    originalMinorUnits: 1499,
    savingsMinorUnits: 500,
    discountedMinorUnits: 999,
  });
  assert.deepEqual(calculateNineSubscriptionPreview(2499), {
    originalMinorUnits: 2499,
    savingsMinorUnits: 833,
    discountedMinorUnits: 1666,
  });
});

test("handles the free tier without a charge or savings", () => {
  assert.deepEqual(calculateNineSubscriptionPreview(0), {
    originalMinorUnits: 0,
    savingsMinorUnits: 0,
    discountedMinorUnits: 0,
  });
});

test("rejects invalid prices instead of showing misleading checkout math", () => {
  assert.throws(() => calculateNineSubscriptionPreview(-1), RangeError);
  assert.throws(() => calculateNineSubscriptionPreview(1.5), RangeError);
  assert.throws(() => calculateNineSubscriptionPreview(Number.MAX_SAFE_INTEGER + 1), RangeError);
});
