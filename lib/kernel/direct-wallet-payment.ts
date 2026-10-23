/**
 * Direct-to-wallet stablecoin payment evidence policy.
 *
 * This module does not create invoices, watch a chain, or move funds. Only a
 * trusted chain adapter may supply an observed transfer. Callers must persist
 * the result idempotently and fulfill only when status is "confirmed".
 */
export type StablecoinAsset = "USDT" | "USDC";

export interface DirectWalletPaymentIntent {
  id: string;
  orderId: string;
  network: string;
  asset: StablecoinAsset;
  tokenContract: string;
  recipient: string;
  /** Exact integer base units from a trusted server-side quote. */
  amountBaseUnits: string;
  expiresAtMs: number;
}

export interface ObservedStablecoinTransfer {
  transactionId: string;
  network: string;
  asset: StablecoinAsset;
  tokenContract: string;
  recipient: string;
  amountBaseUnits: string;
  /** Timestamp and confirmation count supplied by the trusted chain adapter. */
  blockTimestampMs: number;
  confirmations: number;
}

export type WalletPaymentAssessment =
  | { status: "awaiting_payment"; fulfillmentEligible: false }
  | { status: "expired"; fulfillmentEligible: false }
  | { status: "underpaid"; fulfillmentEligible: false }
  | { status: "review_required"; fulfillmentEligible: false; reason: "transfer_mismatch" | "overpaid" | "duplicate_transfer" | "late_transfer" }
  | { status: "confirming"; fulfillmentEligible: false; confirmations: number; requiredConfirmations: number }
  | { status: "confirmed"; fulfillmentEligible: true; transactionId: string };

function isPositiveBaseUnitAmount(value: string): boolean {
  return typeof value === "string" && /^[1-9][0-9]*$/.test(value);
}

function isSafeTimestamp(value: number): boolean {
  return Number.isSafeInteger(value) && value > 0;
}

/**
 * Compares one canonicalized chain transfer against a server-created invoice.
 * Address and token identifiers must be canonicalized by the chain adapter for
 * that network before they reach this function (some networks are case-sensitive).
 */
export function assessDirectWalletPayment(input: {
  intent: DirectWalletPaymentIntent;
  transfer: ObservedStablecoinTransfer | null;
  requiredConfirmations: number;
  alreadyAppliedTransactionIds?: readonly string[];
  nowMs: number;
}): WalletPaymentAssessment {
  const { intent, transfer, requiredConfirmations, nowMs } = input;

  if (
    !intent.id.trim() ||
    !intent.orderId.trim() ||
    !intent.network.trim() ||
    !intent.tokenContract.trim() ||
    !intent.recipient.trim() ||
    !isPositiveBaseUnitAmount(intent.amountBaseUnits) ||
    !isSafeTimestamp(intent.expiresAtMs) ||
    !isSafeTimestamp(nowMs) ||
    !Number.isSafeInteger(requiredConfirmations) ||
    requiredConfirmations < 1
  ) {
    throw new RangeError("Crypto payment intent, expiry, or confirmation policy is invalid.");
  }

  if (!transfer) {
    return nowMs >= intent.expiresAtMs
      ? { status: "expired", fulfillmentEligible: false }
      : { status: "awaiting_payment", fulfillmentEligible: false };
  }

  if (
    !transfer.transactionId.trim() ||
    !transfer.network.trim() ||
    !transfer.tokenContract.trim() ||
    !transfer.recipient.trim() ||
    !isPositiveBaseUnitAmount(transfer.amountBaseUnits) ||
    !isSafeTimestamp(transfer.blockTimestampMs) ||
    !Number.isSafeInteger(transfer.confirmations) ||
    transfer.confirmations < 0
  ) {
    throw new RangeError("Observed chain transfer evidence is invalid.");
  }

  if ((input.alreadyAppliedTransactionIds ?? []).includes(transfer.transactionId)) {
    return { status: "review_required", fulfillmentEligible: false, reason: "duplicate_transfer" };
  }

  if (
    transfer.network !== intent.network ||
    transfer.asset !== intent.asset ||
    transfer.tokenContract !== intent.tokenContract ||
    transfer.recipient !== intent.recipient
  ) {
    return { status: "review_required", fulfillmentEligible: false, reason: "transfer_mismatch" };
  }

  if (transfer.blockTimestampMs > intent.expiresAtMs) {
    return { status: "review_required", fulfillmentEligible: false, reason: "late_transfer" };
  }

  const received = BigInt(transfer.amountBaseUnits);
  const expected = BigInt(intent.amountBaseUnits);
  if (received < expected) return { status: "underpaid", fulfillmentEligible: false };
  if (received > expected) return { status: "review_required", fulfillmentEligible: false, reason: "overpaid" };

  if (transfer.confirmations < requiredConfirmations) {
    return {
      status: "confirming",
      fulfillmentEligible: false,
      confirmations: transfer.confirmations,
      requiredConfirmations,
    };
  }

  return {
    status: "confirmed",
    fulfillmentEligible: true,
    transactionId: transfer.transactionId,
  };
}
