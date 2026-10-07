import Link from "next/link";
import { getMembershipPricingPreview } from "@/lib/application/pricing/get-membership-pricing-preview";
import { calculateNineSubscriptionPreview } from "@/lib/kernel/nine-subscription-discount";
import "./checkout-preview.css";

export const metadata = {
  title: "Membership checkout preview",
  description: "Review illustrative creator membership pricing and planned NINE savings.",
  robots: { index: false, follow: false },
};

type CheckoutSearchParams = { plan?: string; creator?: string };

export default async function MembershipCheckoutPreview({
  searchParams,
}: {
  searchParams: Promise<CheckoutSearchParams>;
}) {
  const params = await searchParams;
  const plan = getMembershipPricingPreview().find((item) => item.id === params.plan && item.id !== "free");
  const creator = typeof params.creator === "string" ? params.creator.trim().slice(0, 80) : "";
  const creatorLabel = creator || "One creator you choose";
  const example = plan ? calculateNineSubscriptionPreview(plan.monthlyPriceMinorUnits) : null;
  const format = (minorUnits: number) =>
    new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(minorUnits / 100);

  return (
    <main className="membership-checkout-preview">
      <Link className="checkout-preview-back" href={creator ? `/pricing?creator=${encodeURIComponent(creator)}` : "/pricing"}>← Back to memberships</Link>
      <article className="checkout-preview-card">
        <p className="checkout-preview-label">MEMBER APP · CHECKOUT PREVIEW</p>
        <h1>Review your <span>membership.</span></h1>
        <p className="checkout-preview-intro">This example shows what a member should review before subscribing. Membership access is for one creator, and these prices and NINE savings are illustrative only.</p>

        {plan && example ? (
          <>
            <div className="checkout-preview-summary" aria-label="Illustrative subscription summary">
              <span>Creator</span><strong>{creatorLabel}</strong>
              <span>Membership</span><strong>{plan.name} · example monthly</strong>
              <span>Example price</span><strong>{format(example.originalMinorUnits)} / month</strong>
              <span>Planned NINE savings · 33⅓%</span><strong>−{format(example.savingsMinorUnits)}</strong>
              <span className="checkout-preview-total">Illustrative amount with NINE</span><strong className="checkout-preview-total">{format(example.discountedMinorUnits)} / month</strong>
            </div>

            <section className="checkout-preview-scope" aria-labelledby="checkout-included">
              <h2 id="checkout-included">What this tier includes</h2>
              <ul>{plan.included.map((item) => <li key={item}>{item}</li>)}</ul>
            </section>
            <section className="checkout-preview-boundaries" aria-labelledby="checkout-boundaries">
              <h2 id="checkout-boundaries">What it does not include</h2>
              <ul><li>{plan.excluded}</li><li>This subscription applies to {creatorLabel} only; other creators require separate choices.</li></ul>
            </section>

            <p className="checkout-preview-notice"><strong>No payment will be taken.</strong> NINE is not accepted yet, and account signup, checkout, renewals, cancellation, refunds, and membership access are not active. NINE savings are a planned subscription-only example, rounded to the nearest cent; they do not apply to store items or private video sessions. Final creator pricing and renewal/cancellation/refund terms must be confirmed before a real checkout exists.</p>
          </>
        ) : (
          <>
            <p className="checkout-preview-intro">Choose a paid creator tier from the memberships page to see its example summary. No booking or charge can be created here.</p>
            <p className="checkout-preview-notice"><strong>Preview only.</strong> This page cannot create an account, subscription, or payment.</p>
          </>
        )}

        <div className="checkout-preview-actions">
          <Link className="button button-outline" href={creator ? `/pricing?creator=${encodeURIComponent(creator)}` : "/pricing"}>Compare membership tiers</Link>
          <Link className="button" href="/sign-up?type=member">Create a free account <span aria-hidden="true">↗</span></Link>
        </div>
      </article>
    </main>
  );
}
