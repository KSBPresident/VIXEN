import assert from "node:assert/strict";
import { test } from "node:test";
import { assessDirectWalletPayment } from "../.test-build/lib/kernel/direct-wallet-payment.js";
import { directWalletRoutes, getDirectWalletRoutes } from "../.test-build/lib/payments/direct-wallet-receivers.js";

const intent = {
  id: "intent-1",
  orderId: "order-1",
  network: "ethereum",
  asset: "USDT",
  tokenContract: "usdt-contract",
  recipient: "merchant-wallet",
  amountBaseUnits: "1000000",
  expiresAtMs: 2_000,
};
const transfer = {
  transactionId: "tx-1",
  network: "ethereum",
  asset: "USDT",
  tokenContract: "usdt-contract",
  recipient: "merchant-wallet",
  amountBaseUnits: "1000000",
  blockTimestampMs: 1_000,
  confirmations: 12,
};

test("exact, confirmed transfer is eligible for fulfillment", () => {
  assert.deepEqual(assessDirectWalletPayment({
    intent, transfer, requiredConfirmations: 12, nowMs: 1_500,
  }), { status: "confirmed", fulfillmentEligible: true, transactionId: "tx-1" });
});

test("never fulfills an unobserved, underpaid, unconfirmed, or expired order", () => {
  assert.equal(assessDirectWalletPayment({ intent, transfer: null, requiredConfirmations: 12, nowMs: 1_500 }).fulfillmentEligible, false);
  assert.equal(assessDirectWalletPayment({
    intent, transfer: { ...transfer, amountBaseUnits: "999999" }, requiredConfirmations: 12, nowMs: 1_500,
  }).status, "underpaid");
  assert.equal(assessDirectWalletPayment({
    intent, transfer: { ...transfer, confirmations: 1 }, requiredConfirmations: 12, nowMs: 1_500,
  }).status, "confirming");
  assert.equal(assessDirectWalletPayment({ intent, transfer: null, requiredConfirmations: 12, nowMs: 2_000 }).status, "expired");
});

test("routes require review on mismatches, late transfers, overpayments, and duplicate transaction IDs", () => {
  for (const changed of [
    { network: "polygon" },
    { asset: "USDC" },
    { tokenContract: "other-token" },
    { recipient: "other-wallet" },
    { blockTimestampMs: 2_001 },
    { amountBaseUnits: "1000001" },
  ]) {
    const result = assessDirectWalletPayment({
      intent, transfer: { ...transfer, ...changed }, requiredConfirmations: 12, nowMs: 1_500,
    });
    assert.equal(result.fulfillmentEligible, false);
    assert.equal(result.status, "review_required");
  }
  assert.deepEqual(assessDirectWalletPayment({
    intent, transfer, requiredConfirmations: 12, alreadyAppliedTransactionIds: ["tx-1"], nowMs: 1_500,
  }), { status: "review_required", fulfillmentEligible: false, reason: "duplicate_transfer" });
});

test("only wallet receive routes shown in the supplied screenshots are configured", () => {
  assert.equal(directWalletRoutes.length, 5);
  assert.deepEqual(getDirectWalletRoutes("USDT").map(({ network }) => network), [
    "Solana", "BNB Smart Chain", "Polygon", "Ethereum",
  ]);
  assert.deepEqual(getDirectWalletRoutes("TRX").map(({ network }) => network), ["Tron"]);
  assert.equal(getDirectWalletRoutes("USDC").length, 0);
  assert.equal(directWalletRoutes.every((route) => route.status === "manual_review"), true);
  assert.equal(directWalletRoutes[0].address, "72jittFfSyu7cPSPMEhSv83qXG8TBt3GERdSxyFp56Rg");
  assert.equal(directWalletRoutes[1].address, "TYMeD5NpSEShWuJyMDwopwaEHGnvrbw82c");
  assert.equal(directWalletRoutes[2].address, "0xE51A7Ca633e27a1e369A9480BAC69cA64e48dE75");
});
