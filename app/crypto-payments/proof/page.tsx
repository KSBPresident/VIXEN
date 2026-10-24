import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { PaymentProofForm } from "@/components/payments/payment-proof-form";

export const dynamic = "force-dynamic";
export const metadata = { title: "Submit crypto payment proof", robots: { index: false, follow: false } };

type PaymentProofPageProps = { searchParams: Promise<{ type?: string | string[]; creator?: string | string[] }> };

export default async function PaymentProofPage({ searchParams }: PaymentProofPageProps) {
  const params = await searchParams;
  const requestedType = Array.isArray(params.type) ? params.type[0] : params.type;
  const requestedCreator = Array.isArray(params.creator) ? params.creator[0] : params.creator;
  const isTip = requestedType === "creator_tip";
  const isDonation = requestedType === "donation";
  const initialPaymentType = isDonation ? "donation" : isTip ? "creator_tip" : "creator_payment";
  const safeCreator = requestedCreator && /^[a-z0-9._]{3,30}$/i.test(requestedCreator) ? requestedCreator : "";
  const nextPath = "/crypto-payments/proof" + (isTip ? "?type=creator_tip" + (safeCreator ? "&creator=" + encodeURIComponent(safeCreator) : "") : isDonation ? "?type=donation" : "");
  const supabaseConfigured = Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL && (process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY));
  if (!supabaseConfigured) redirect("/sign-up?type=member&next=" + encodeURIComponent(nextPath));

  const supabase = await createClient();
  const { data: { user }, error } = await supabase.auth.getUser();
  if (error || !user) redirect("/sign-up?type=member&next=" + encodeURIComponent(nextPath));

  const { data } = await supabase.from("profiles")
    .select("id, username, display_name")
    .eq("is_creator", true)
    .not("username", "is", null)
    .order("username", { ascending: true });
  const creators = data ?? [];
  const initialCreatorId = safeCreator
    ? creators.find((creator) => creator.username.toLocaleLowerCase() === safeCreator.toLocaleLowerCase())?.id ?? ""
    : "";

  return (
    <main>
      <header className="site-header"><Link className="brand" href="/">VIXEN.</Link><div className="header-actions"><Link className="button button-small button-outline" href="/crypto-payments">Back to crypto payments</Link></div></header>
      <section className="subpage-hero"><p className="eyebrow">{isTip ? "CREATOR TIP · PAYMENT REVIEW" : isDonation ? "VIXEN DONATION · PAYMENT REVIEW" : "PAYMENT REVIEW"}</p><h1>{isTip ? <>Send a <span>creator tip.</span></> : isDonation ? <>Support <span>VIXEN.</span></> : <>Send your <span>proof.</span></>}</h1><p>{isTip ? "Choose a creator, send a voluntary tip to the matching wallet, then submit your receipt for review." : isDonation ? "Submit your voluntary VIXEN donation transfer for administrator review." : "Upload the transfer screenshot and transaction ID so VIXEN can check your payment."}</p></section>
      <section className="section-wrap subpage-content">
        <div className="crypto-payment-callout" role="note"><strong>Review is manual.</strong><p>Upload a screenshot only after sending funds to the matching VIXEN wallet address. Your screenshot stays in private storage and is visible to the administrator for review. Do not upload wallet recovery phrases or unrelated account information. {isTip ? "A tip does not unlock content or access. VIXEN credits the selected creator’s earnings only after the transfer is independently verified and approved." : isDonation ? "A donation is voluntary and does not unlock content, memberships, store items, or other access. VIXEN records it as a donation only after independently verifying the transfer." : "Approval does not automatically unlock a purchase."}</p></div>
        <PaymentProofForm userId={user.id} creators={creators} initialPaymentType={initialPaymentType} initialCreatorId={initialCreatorId} />
      </section>
    </main>
  );
}
