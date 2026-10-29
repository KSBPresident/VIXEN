import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { isVixenPlatformAdmin } from "@/lib/server/platform-admin";

export const dynamic = "force-dynamic";
export const metadata = { title: "VIXEN admin", robots: { index: false, follow: false } };

export default async function AdminPage() {
  const supabase = await createClient();
  const { data: { user }, error } = await supabase.auth.getUser();
  if (error || !user || !isVixenPlatformAdmin(user)) redirect("/account");

  const [profiles, creators, applications, preapplications, payments, withdrawals, reports, storeProducts] = await Promise.all([
    supabase.from("profiles").select("id", { count: "exact", head: true }),
    supabase.from("profiles").select("id", { count: "exact", head: true }).eq("is_creator", true),
    supabase.from("creator_applications").select("user_id", { count: "exact", head: true }).eq("status", "pending"),
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (supabase as any).from("creator_preapplications").select("id", { count: "exact", head: true }).eq("status", "pending"),
    supabase.from("crypto_payment_proofs").select("id", { count: "exact", head: true }).eq("status", "pending"),
    supabase.from("creator_withdrawal_requests").select("id", { count: "exact", head: true }).in("status", ["pending", "approved"]),
    supabase.from("reports").select("id", { count: "exact", head: true }),
    supabase.from("store_products").select("id", { count: "exact", head: true }).eq("status", "published"),
  ]);

  const stats = [
    ["Accounts", profiles.count ?? 0],
    ["Approved creators", creators.count ?? 0],
    ["Creator applications to review", (applications.count ?? 0) + (preapplications.count ?? 0)],
    ["Crypto proofs to review", payments.count ?? 0],
    ["Creator withdrawals to process", withdrawals.count ?? 0],
    ["Safety reports", reports.count ?? 0],
    ["Published store listings", storeProducts.count ?? 0],
  ];

  return (
    <main className="vixen-home">
      <header className="vixen-account-topbar"><Link href="/">VIXEN</Link><span>PLATFORM ADMIN</span></header>
      <section className="vixen-account-content">
        <div className="vixen-account-panel">
          <p className="vixen-kicker">FULL PLATFORM ACCESS</p>
          <h1>Administrator console</h1>
          <p>Your confirmed administrator account has full in-app access to member and creator records, content, messages, payment evidence, balances, withdrawals, and moderation records.</p>
          <p className="vixen-account-email">{user.email}</p>
          <div className="admin-overview-grid">{stats.map(([label, count]) => <article key={label}><strong>{count}</strong><span>{label}</span></article>)}</div>
          <nav className="admin-links" aria-label="Administrator tools">
            <Link className="vixen-discover-link" href="/admin/creator-applications">Review creator applications →</Link>
            <Link className="vixen-discover-link" href="/admin/payment-proofs">Review crypto payment proofs →</Link>
            <Link className="vixen-discover-link" href="/admin/withdrawals">Manage creator withdrawals →</Link>
            <Link className="vixen-discover-link" href="/admin/store">Manage store listings →</Link>
            <Link className="vixen-discover-link" href="/creators">Open creator directory →</Link>
            <Link className="vixen-discover-link" href="/store">Open store →</Link>
            <Link className="vixen-discover-link" href="/account">Open my account →</Link>
          </nav>
        </div>
      </section>
      <style>{".admin-overview-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(145px,1fr));gap:10px;margin:26px 0}.admin-overview-grid article{display:grid;gap:5px;padding:16px;border:1px solid rgba(255,255,255,.12);background:#100d12}.admin-overview-grid strong{font-size:25px;color:#fff}.admin-overview-grid span{color:#b6aeba;font-size:12px}.admin-links{display:grid;gap:12px;padding-top:18px;border-top:1px solid rgba(255,255,255,.12)}"}</style>
    </main>
  );
}
