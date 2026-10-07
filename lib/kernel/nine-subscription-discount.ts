/**
 * Illustrative checkout math for the planned NINE Coin subscription benefit.
 * This never authorizes or processes a payment. The benefit is one third off
 * creator subscriptions only; the displayed payable amount is rounded to cents.
 */
export function calculateNineSubscriptionPreview(amountMinorUnits: number) {
  if (!Number.isSafeInteger(amountMinorUnits) || amountMinorUnits < 0) {
    throw new RangeError("Subscription example must be a non-negative safe integer.");
  }

  const amount = BigInt(amountMinorUnits);
  const discountedMinorUnits = Number((amount * 2n + 1n) / 3n);

  return {
    originalMinorUnits: amountMinorUnits,
    savingsMinorUnits: amountMinorUnits - discountedMinorUnits,
    discountedMinorUnits,
  };
}
