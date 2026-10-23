/**
 * Illustrative checkout math for the planned NINE Coin subscription benefit.
 * This never authorizes or processes a payment. The planned benefit is 10% off
 * creator subscriptions only; the displayed payable amount is rounded to cents.
 */
export function calculateNineSubscriptionPreview(amountMinorUnits: number) {
  if (!Number.isSafeInteger(amountMinorUnits) || amountMinorUnits < 0) {
    throw new RangeError("Subscription example must be a non-negative safe integer.");
  }

  const savingsMinorUnits = Math.floor(amountMinorUnits / 10) + (amountMinorUnits % 10 >= 5 ? 1 : 0);
  const discountedMinorUnits = amountMinorUnits - savingsMinorUnits;

  return {
    originalMinorUnits: amountMinorUnits,
    savingsMinorUnits,
    discountedMinorUnits,
  };
}
