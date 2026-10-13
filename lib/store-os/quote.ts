export interface StoreQuoteLineInput {
  /** Stable SKU or variant identifier resolved by a trusted catalog adapter. */
  productId: string;
  quantity: number;
  /** Trusted catalog price in integer minor units; never accept from the browser as authoritative. */
  unitPriceMinorUnits: number;
}

export interface StoreQuoteLine extends StoreQuoteLineInput {
  lineTotalMinorUnits: number;
}

export interface StoreQuote {
  currency: string;
  lines: readonly StoreQuoteLine[];
  subtotalMinorUnits: number;
}

/** Computes a deterministic merchandise subtotal only; this does not authorize or create a checkout. */
export function quoteStoreLines(currency: string, inputLines: readonly StoreQuoteLineInput[]): StoreQuote {
  if (!/^[A-Z]{3}$/.test(currency)) throw new RangeError("Currency must be a three-letter uppercase code.");

  const seen = new Set<string>();
  let subtotalMinorUnits = 0;
  const lines = inputLines.map((line) => {
    const productId = typeof line.productId === "string" ? line.productId.trim() : "";
    if (!productId) throw new RangeError("Each store line needs a product identifier.");
    if (seen.has(productId)) throw new RangeError("Combine duplicate products into a single store line.");
    seen.add(productId);
    if (!Number.isSafeInteger(line.quantity) || line.quantity < 1 || line.quantity > 99) {
      throw new RangeError("Quantity must be a whole number from 1 to 99.");
    }
    if (!Number.isSafeInteger(line.unitPriceMinorUnits) || line.unitPriceMinorUnits < 0) {
      throw new RangeError("Unit price must be a non-negative safe integer in minor units.");
    }
    const lineTotalMinorUnits = line.quantity * line.unitPriceMinorUnits;
    if (!Number.isSafeInteger(lineTotalMinorUnits)) throw new RangeError("Line total exceeds the safe money range.");
    subtotalMinorUnits += lineTotalMinorUnits;
    if (!Number.isSafeInteger(subtotalMinorUnits)) throw new RangeError("Subtotal exceeds the safe money range.");
    return { productId, quantity: line.quantity, unitPriceMinorUnits: line.unitPriceMinorUnits, lineTotalMinorUnits };
  });
  return { currency, lines, subtotalMinorUnits };
}
