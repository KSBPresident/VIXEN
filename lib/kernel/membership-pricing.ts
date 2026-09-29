export interface MembershipPricingExample {
  id: string;
  name: string;
  monthlyPriceMinorUnits: number;
  billing: string;
  summary: string;
  included: readonly string[];
  excluded: string;
  free?: boolean;
}

/**
 * Illustrative member-facing prices. A paid membership is scoped to one creator.
 * These examples are not creator signup fees or active offers; creators will
 * set their own prices when the platform's account and payment flows are ready.
 */
export const membershipPricingExamples = [
  {
    id: "free",
    name: "Free account",
    monthlyPriceMinorUnits: 0,
    billing: "No payment or renewal",
    summary: "A free adult member account to explore public creator previews.",
    included: ["Browse creator profiles", "View public posts and previews", "No card and no recurring charge"],
    excluded: "Member-only posts and drops, paid messages, tips, creator publishing, payouts, and management tools.",
    free: true,
  },
  {
    id: "bronze",
    name: "Bronze",
    monthlyPriceMinorUnits: 399,
    billing: "example / month / creator",
    summary: "The lowest-cost paid way into one creator’s member space.",
    included: ["Everything in Free", "Bronze-only member posts and updates from that creator"],
    excluded: "Silver, Gold, and Elite content; paid messages, tips, and one-off purchases unless the creator explicitly includes them.",
  },
  {
    id: "silver",
    name: "Silver",
    monthlyPriceMinorUnits: 899,
    billing: "example / month / creator",
    summary: "A deeper look at one creator’s member posts and drops.",
    included: ["Everything in Bronze", "Silver-only posts and creator-listed exclusive drops"],
    excluded: "Gold and Elite content; paid messages, tips, and one-off purchases unless the creator explicitly includes them.",
  },
  {
    id: "gold",
    name: "Gold",
    monthlyPriceMinorUnits: 1499,
    billing: "example / month / creator",
    summary: "More of that creator’s listed member content.",
    included: ["Everything in Silver", "Gold-only posts and drops", "Early access when listed by the creator"],
    excluded: "Elite-only content; paid messages, tips, and one-off purchases unless the creator explicitly includes them.",
  },
  {
    id: "elite",
    name: "Elite",
    monthlyPriceMinorUnits: 2499,
    billing: "example / month / creator",
    summary: "The most inclusive example tier, with perks the creator names.",
    included: ["Everything in Gold", "Elite-only posts, drops, and perks explicitly listed by the creator"],
    excluded: "Unlisted services, paid messages, tips, custom work, or one-off purchases. Elite does not mean unlimited access or guaranteed replies.",
  },
] as const satisfies readonly MembershipPricingExample[];

export function formatExamplePrice(minorUnits: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(minorUnits / 100);
}
