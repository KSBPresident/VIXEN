import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { isVixenPlatformAdmin } from "@/lib/server/platform-admin";
import { reviewCreatorWithdrawal } from "./actions";

export const dynamic = "force-dynamic";
export const metadata = { title: "Creator withdrawals · VIXEN", robots: { index: false, follow: false } };

export default async function AdminWithdrawalsPage() {
  const supabase = await createClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !isVixenPlatformAdmin(user)) redirect("/account");

  const { data: requests, error } = await supabase
    .from("creator_withdrawal_requests")
    .select("id, creator_id, asset, network, amount, destination_address, status, creator_note, admin_note, payout_transaction_hash, created_at")
    .in("status", ["pending", "approved"])
    .order("created_at", { ascending: true })
    .limit(100);

  if (error) {
    return <main className="vixen-home"><section className="vixen-account-content"><div className="vixen-account-panel"><h1>Withdrawals are unavailable.</h1><p>Confirm that the VIXEN payout migration is installed, then refresh this page.</p><Link href="/admin">Back to administrator console</Link></div></section></main>;
  }

  return (
    <main className="vixen-home">
      <header className="vixen-account-topbar"><Link href="/">VIXEN</Link><nav><Link href="/admin">Admin console</Link><Link href="/admin/payment-proofs">Payment reviews</Link></nav></header>
      <section className="vixen-account-content">
        <div className="vixen-account-panel">
          <p className="vixen-kicker">MANUAL CREATOR PAYOUTS</p>
          <h1>Withdrawal requests</h1>
          <p>Review creator destination details carefully. Mark a request paid only after you have sent the funds, and save the transaction reference for the audit trail. Pending and approved requests reserve the creator’s available balance.</p>
          {(requests ?? []).length === 0 ? <p className="admin-empty-state">No withdrawal requests need action.</p> : <div className="admin-review-list">{requests?.map((request) => (
            <article className="admin-review-card" key={request.id}>
              <p className="vixen-kicker">{request.status} · {new Date(request.created_at).toLocaleString()}</p>
              <h2>{request.amount} {request.asset} on {request.network}</h2>
              <dl className="admin-proof-details">
                <div><dt>Creator account</dt><dd>{request.creator_id}</dd></div>
                <div><dt>Send to</dt><dd className="admin-break">{request.destination_address}</dd></div>
                {request.creator_note && <div><dt>Creator note</dt><dd>{request.creator_note}</dd></div>}
              </dl>
              <form action={reviewCreatorWithdrawal} className="admin-review-form">
                <input type="hidden" name="withdrawalId" value={request.id} />
                <label>Internal note <textarea name="adminNote" maxLength={500} defaultValue={request.admin_note ?? ""} /></label>
                <label>Payout transaction reference <input name="payoutTransactionHash" maxLength={180} defaultValue={request.payout_transaction_hash ?? ""} placeholder="Required to mark paid" /></label>
                <div><button name="decision" value="approved" type="submit">Approve request</button><button name="decision" value="paid" type="submit">Mark paid</button><button className="admin-reject-button" name="decision" value="rejected" type="submit">Reject</button></div>
              </form>
            </article>
          ))}</div>}
        </div>
      </section>
      <style>{".admin-review-list{display:grid;gap:16px;margin-top:20px}.admin-review-card{padding:18px;border:1px solid rgba(255,255,255,.14);background:#100d12}.admin-review-card h2{margin:6px 0;font-size:19px}.admin-empty-state{color:#aaa2ad;font-size:12px}.admin-proof-details{display:grid;gap:9px;margin:16px 0}.admin-proof-details div{display:grid;grid-template-columns:minmax(110px,160px) 1fr;gap:12px}.admin-proof-details dt{color:#aaa2ad}.admin-proof-details dd{margin:0}.admin-break{overflow-wrap:anywhere}.admin-review-form{display:grid;gap:12px;margin-top:18px}.admin-review-form label{display:grid;gap:6px;color:#d7ceda;font-size:12px}.admin-review-form textarea,.admin-review-form input{min-height:42px;padding:10px;color:#fff;background:#09070a;border:1px solid rgba(255,255,255,.16)}.admin-review-form textarea{min-height:70px}.admin-review-form div{display:flex;gap:10px;flex-wrap:wrap}.admin-review-form button{min-height:42px;padding:0 16px;border:1px solid #ff1688;background:#bd0c68;color:#fff;cursor:pointer}.admin-review-form .admin-reject-button{border-color:rgba(255,255,255,.24);background:#17131a}@media(max-width:600px){.admin-proof-details div{grid-template-columns:1fr;gap:3px}}"}
    </main>
  );
}
