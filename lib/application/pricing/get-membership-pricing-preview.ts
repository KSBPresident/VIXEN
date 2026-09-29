import {
  formatExamplePrice,
  membershipPricingExamples,
} from "@/lib/kernel/membership-pricing";

/**
 * Read model for the pricing page. This keeps the Front OS view free from
 * pricing policy and lets the Kernel remain the single source of truth.
 */
export function getMembershipPricingPreview() {
  return membershipPricingExamples.map((plan) => ({
    ...plan,
    price: formatExamplePrice(plan.monthlyPriceMinorUnits),
  }));
}
