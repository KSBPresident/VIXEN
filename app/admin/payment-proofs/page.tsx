import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { isVixenPlatformAdmin } from "@/lib/server/platform-admin";
import { reviewCryptoPaymentProof } from "./actions";

export const dynamic = "force-dynamic";
export const metadata = { title: "Crypto payment review · VIXEN", robots: { index: false, follow: false } };

export default async function AdminPaymentProofsPage() {
  const supabase = await createClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !isVixenPlatformAdmin(user)) redirect("/account");

  const { data: proofs, error } = await supabase
    .from("crypto_payment_proofs")
    .select("id, user_id, payment_type, creator_id, order_reference, asset, network, amount, transaction_hash, screenshot_path, status, admin_note, created_at, reviewed_at")
    .order("created_at", { ascending: false })
    .limit(100);

  if (error) {
    return <main className="vixen-home"><section className="vixen-account-content"><div className="vixen-account-panel"><h1>Payment reviews are unavailable.</h1><p>Confirm that the VIXEN payment migration is installed, then refresh this page.</p><Link href="/admin">Back to administrator console</Link></div></section></main>;
  }

  const rows = await Promise.all((proofs ?? []).map(async (proof) => {
    const signed = await supabase.storage.from("crypto-payment-proofs").createSignedUrl(proof.screenshot_path, 300);
    return { ...proof, screenshotUrl: signed.data?.signedUrl ?? null };
  }));

  return (
    <main className="vixen-home">
      <header className="vixen-account-topbar"><Link href="/">VIXEN</Link><nav><Link href="/admin">Admin console</Link><Link href="/admin/withdrawals">Withdrawals</Link></nav></header>
      <section className="vixen-account-content">
        <div className="vixen-account-panel">
          <p className="vixen-kicker">PRIVATE EVIDENCE · ADMIN ONLY</p>
          <h1>Crypto payment review</h1>
          <p>Check each transaction independently on the selected network before approving it. A screenshot by itself does not confirm settlement. Creator balances update only after an approved creator payment; store access is still fulfilled manually.</p>
          <p className="vixen-auth-caption">{rows.filter((row) => row.status === "pending").length} awaiting review · newest 100 submissions</p>
          {rows.length === 0 ? <p className="admin-empty-state">No payment proofs have been submitted.</p> : <div className="admin-review-list">{rows.map((proof) => (
            <article className="admin-review-card" key={proof.id}>
              <div className="admin-review-heading"><div><p className="vixen-kicker">{proof.payment_type.replaceAll("_", " ")} · {proof.status}</p><h2>{proof.amount} {proof.asset} on {proof.network}</h2></div><time>{new Date(proof.created_at).toLocaleString()}</time></div>
              <dl className="admin-proof-details">
                <div><dt>Submitted by</dt><dd>{proof.user_id}</dd></div>
                {proof.creator_id && <div><dt>Creator profile</dt><dd>{proof.creator_id}</dd></div>}
                {proof.order_reference && <div><dt>Order reference</dt><dd>{proof.order_reference}</dd></div>}
                <div><dt>Transaction ID</dt><dd className="admin-break">{proof.transaction_hash}</dd></div>
              </dl>
              {proof.screenshotUrl ? <a href={proof.screenshotUrl} target="_blank" rel="noreferrer">Open private screenshot in a new tab</a> : <p>Screenshot could not be signed. Check storage access.</p>}
              {proof.admin_note && <p className="admin-review-note">Previous note: {proof.admin_note}</p>}
              {proof.status === "pending" && <form action={reviewCryptoPaymentProof} className="admin-review-form">
                <input type="hidden" name="proofId" value={proof.id} />
                <label>Review note <textarea name="adminNote" maxLength={500} placeholder="Optional internal note" /></label>
                <div><button name="decision" value="approved" type="submit">Approve after verification</button><button className="admin-reject-button" name="decision" value="rejected" type="submit">Reject</button></div>
              </form>}
            </article>
          ))}</div>}
        </div>
      </section>
      <style>{".admin-review-list{display:grid;gap:16px;margin-top:20px}.admin-review-card{padding:18px;border:1px solid rgba(255,255,255,.14);background:#100d12}.admin-review-heading{display:flex;justify-content:space-between;gap:16px;align-items:flex-start}.admin-review-heading h2{margin:6px 0;font-size:19px}.admin-review-heading time,.admin-empty-state{color:#aaa2ad;font-size:12px}.admin-proof-details{display:grid;gap:9px;margin:16px 0}.admin-proof-details div{display:grid;grid-template-columns:minmax(110px,160px) 1fr;gap:12px}.admin-proof-details dt{color:#aaa2ad}.admin-proof-details dd{margin:0}.admin-break{overflow-wrap:anywhere}.admin-review-form{display:grid;gap:12px;margin-top:18px}.admin-review-form label{display:grid;gap:6px;color:#d7ceda;font-size:12px}.admin-review-form textarea{min-height:70px;padding:10px;color:#fff;background:#09070a;border:1px solid rgba(255,255,255,.16)}.admin-review-form div{display:flex;gap:10px;flex-wrap:wrap}.admin-review-form button{min-height:42px;padding:0 16px;border:1px solid #ff1688;background:#bd0c68;color:#fff;cursor:pointer}.admin-review-form .admin-reject-button{border-color:rgba(255,255,255,.24);background:#17131a}.admin-review-note{color:#f6ca78;font-size:12px}@media(max-width:600px){.admin-review-heading{display:grid}.admin-proof-details div{grid-template-columns:1fr;gap:3px}}"}
    </main>
  );
}
