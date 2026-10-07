/**
 * Illustrative checkout math for the planned NINE Coin subscription benefit.
 * This never authorizes or processes a payment. The benefit is one third off
 * creator subscriptions only; the displayed payable amount is rounded to cents.
 */
export function calculateNineSubscriptionPreview(amountMinorUnits: number) {
  if (!Number.isSafeInteger(amountMinorUnits) || amountMinorUnits < 0) {
    throw new RangeError("Subscription example must be a non-negative safe integer.");
  }

  const quotient = Math.floor(amountMinorUnits / 3);
  const remainder = amountMinorUnits % 3;
  const discountedMinorUnits = quotient * 2 + (remainder > 0 ? 1 : 0);

  return {
    originalMinorUnits: amountMinorUnits,
    savingsMinorUnits: amountMinorUnits - discountedMinorUnits,
    discountedMinorUnits,
  };
}
