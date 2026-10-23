import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { PaymentProofForm } from "@/components/payments/payment-proof-form";

export const dynamic = "force-dynamic";
export const metadata = { title: "Submit crypto payment proof", robots: { index: false, follow: false } };

export default async function PaymentProofPage() {
  const supabase = await createClient();
  const { data: { user }, error } = await supabase.auth.getUser();
  if (error || !user) {
    const nextPath = "/crypto-payments/proof";
    redirect("/sign-up?type=member&next=" + encodeURIComponent(nextPath));
  }

  const { data } = await supabase.from("profiles")
    .select("id, username, display_name")
    .eq("is_creator", true)
    .not("username", "is", null)
    .order("username", { ascending: true });

  return (
    <main>
      <header className="site-header"><Link className="brand" href="/">VIXEN.</Link><div className="header-actions"><Link className="button button-small button-outline" href="/crypto-payments">Back to crypto payments</Link></div></header>
      <section className="subpage-hero"><p className="eyebrow">PAYMENT REVIEW</p><h1>Send your <span>proof.</span></h1><p>Upload the transfer screenshot and transaction ID so VIXEN can check your payment.</p></section>
      <section className="section-wrap subpage-content">
        <div className="crypto-payment-callout" role="note"><strong>Review is manual.</strong><p>Upload a screenshot only after sending funds to the matching VIXEN wallet address. Your screenshot stays in private storage and is visible to the administrator for review. Do not upload wallet recovery phrases or unrelated account information. Approval does not automatically unlock a purchase.</p></div>
        <PaymentProofForm userId={user.id} creators={data ?? []} />
      </section>
    </main>
  );
}
