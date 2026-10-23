import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { WithdrawalRequestForm } from "@/components/creator/withdrawal-request-form";

export const dynamic = "force-dynamic";
export const metadata = { title: "Creator earnings · VIXEN", robots: { index: false, follow: false } };

function amount(value: number | string, asset: string) {
  return Number(value).toFixed(8) + " " + asset;
}

export default async function CreatorEarningsPage() {
  const supabase = await createClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) redirect(`/sign-up?type=creator&next=${encodeURIComponent("/creator/earnings")}`);

  const { data: profile } = await supabase.from("profiles").select("is_creator").eq("id", user.id).maybeSingle();
  if (profile?.is_creator !== true) redirect("/account");

  const [balanceResult, withdrawalResult] = await Promise.all([
    supabase.from("creator_balances").select("asset, network, gross_earned, platform_fees, creator_earned, paid_amount, reserved_amount, available_balance").eq("creator_id", user.id).order("asset"),
    supabase.from("creator_withdrawal_requests").select("id, asset, network, amount, status, created_at, admin_note, payout_transaction_hash").eq("creator_id", user.id).order("created_at", { ascending: false }).limit(50),
  ]);

  return (
    <main className="vixen-home">
      <header className="vixen-account-topbar"><Link href="/">VIXEN</Link><nav><Link href="/creator/studio">Creator space</Link><Link href="/creator/profile">Edit profile</Link><Link href="/account">Account</Link></nav></header>
      <section className="vixen-account-content">
        <div className="vixen-account-panel creator-earnings-panel">
          <p className="vixen-kicker">CREATOR EARNINGS · MANUAL PAYOUT</p>
          <h1>Your earnings</h1>
          <p>Verified creator payments are credited after VIXEN reviews the transaction. VIXEN handles creator withdrawals manually.</p>
          <div className="creator-commission-notice"><strong>First official week discount</strong><p>For payment proofs submitted November 3–9, 2026 only, VIXEN’s commission is discounted to 5% and creators keep 95%. The standard split resumes November 10: VIXEN 15%, creator 85%.</p></div>
          {balanceResult.error ? <p className="creator-earnings-error">Earnings are not available yet. Please refresh after the VIXEN payment system is connected.</p> : (balanceResult.data ?? []).length === 0 ? <p className="creator-earnings-empty">No verified creator payments have been credited to your balance yet.</p> : <div className="creator-balance-grid">{balanceResult.data?.map((balance) => (
            <article className="creator-balance-card" key={balance.asset + balance.network}>
              <h2>{balance.asset} · {balance.network}</h2>
              <dl>
                <div><dt>Gross payments</dt><dd>{amount(balance.gross_earned, balance.asset)}</dd></div>
                <div><dt>VIXEN commission</dt><dd>{amount(balance.platform_fees, balance.asset)}</dd></div>
                <div><dt>Your share earned</dt><dd>{amount(balance.creator_earned, balance.asset)}</dd></div>
                <div><dt>Already paid</dt><dd>{amount(balance.paid_amount, balance.asset)}</dd></div>
                <div><dt>Pending withdrawal</dt><dd>{amount(balance.reserved_amount, balance.asset)}</dd></div>
                <div className="creator-available-row"><dt>Available balance</dt><dd>{amount(balance.available_balance, balance.asset)}</dd></div>
              </dl>
            </article>
          ))}</div>}
          {!balanceResult.error && <WithdrawalRequestForm balances={balanceResult.data ?? []} />}
          <section className="creator-withdrawal-history"><h2>Withdrawal history</h2>{withdrawalResult.error ? <p>Withdrawal history is unavailable right now.</p> : (withdrawalResult.data ?? []).length === 0 ? <p>No withdrawal requests yet.</p> : <div className="creator-history-list">{withdrawalResult.data?.map((request) => <article key={request.id}><div><strong>{amount(request.amount, request.asset)} · {request.network}</strong><span>{request.status} · {new Date(request.created_at).toLocaleString()}</span></div>{request.admin_note && <p>{request.admin_note}</p>}{request.payout_transaction_hash && <small>Transfer reference: {request.payout_transaction_hash}</small>}</article>)}</div>}</section>
        </div>
      </section>
      <style>{".creator-earnings-panel{max-width:920px}.creator-commission-notice{margin:20px 0;padding:16px;border:1px solid rgba(255,22,136,.34);background:rgba(255,22,136,.06)}.creator-commission-notice strong{color:#ff75b8}.creator-commission-notice p{margin:7px 0 0;color:#c1b7c5;font-size:13px;line-height:1.6}.creator-balance-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(280px,1fr));gap:14px;margin:20px 0}.creator-balance-card{padding:18px;border:1px solid rgba(255,255,255,.14);background:#100d12}.creator-balance-card h2{font-size:16px}.creator-balance-card dl{display:grid;gap:10px}.creator-balance-card dl div{display:flex;justify-content:space-between;gap:12px;color:#afa6b3;font-size:12px}.creator-balance-card dd{margin:0;color:#f7f1f8;text-align:right}.creator-balance-card .creator-available-row{padding-top:10px;border-top:1px solid rgba(255,255,255,.14);color:#ff75b8;font-weight:700}.creator-balance-card .creator-available-row dd{color:#ff75b8}.creator-earnings-empty,.creator-earnings-error{padding:16px;border:1px solid rgba(255,255,255,.12);color:#b7aeba}.creator-earnings-error{color:#f3c4d7}.creator-withdrawal-history{margin-top:24px}.creator-history-list{display:grid;gap:9px}.creator-history-list article{padding:13px;border:1px solid rgba(255,255,255,.12);background:#100d12}.creator-history-list article div{display:flex;justify-content:space-between;gap:10px;flex-wrap:wrap}.creator-history-list span,.creator-history-list p,.creator-history-list small{color:#aaa2ad;font-size:12px}.creator-history-list p{margin:8px 0 0}.creator-history-list small{overflow-wrap:anywhere}@media(max-width:600px){.creator-balance-card dl div{display:grid;gap:3px}.creator-balance-card dd{text-align:left}}"}
      </style>
    </main>
  );
}
