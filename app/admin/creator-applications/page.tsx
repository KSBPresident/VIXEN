import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { isVixenPlatformAdmin } from "@/lib/server/platform-admin";

export const dynamic = "force-dynamic";
export const metadata = { title: "Creator applications · VIXEN", robots: { index: false, follow: false } };

type CreatorProfile = {
  id: string;
  username: string | null;
  display_name: string | null;
  is_creator: boolean;
};

export default async function AdminCreatorApplicationsPage() {
  const supabase = await createClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !isVixenPlatformAdmin(user)) redirect("/account");

  const { data: applications, error } = await supabase
    .from("creator_applications")
    .select("user_id, status, created_at, reviewed_at")
    .order("created_at", { ascending: false })
    .limit(100);

  if (error) {
    return <main className="vixen-home"><section className="vixen-account-content"><div className="vixen-account-panel"><h1>Creator applications are unavailable.</h1><p>Confirm that the creator signup migration is installed, then refresh this page.</p><Link href="/admin">Back to administrator console</Link></div></section></main>;
  }

  const userIds = (applications ?? []).map((application) => application.user_id);
  const { data: profiles, error: profileError } = userIds.length
    ? await supabase.from("profiles").select("id, username, display_name, is_creator").in("id", userIds)
    : { data: [], error: null };
  const profilesById = new Map<string, CreatorProfile>((profiles ?? []).map((profile) => [profile.id, profile]));
  const pendingCount = (applications ?? []).filter((application) => application.status === "pending").length;

  return (
    <main className="vixen-home">
      <header className="vixen-account-topbar"><Link href="/">VIXEN</Link><nav><Link href="/admin">Admin console</Link><Link href="/admin/payment-proofs">Payment reviews</Link><Link href="/admin/withdrawals">Withdrawals</Link></nav></header>
      <section className="vixen-account-content">
        <div className="vixen-account-panel">
          <p className="vixen-kicker">PRIVATE · ADMIN ONLY</p>
          <h1>Creator applications</h1>
          <p>Review application status and the public profile details available so far. {pendingCount} pending · newest 100 applications.</p>
          <aside className="creator-review-gate" role="note">
            <strong>Creator approval is not available here.</strong>
            <p>VIXEN has no connected age and identity verification provider and these application records do not contain verification evidence. Do not approve creator access based on this queue alone. Do not ask applicants to send government ID, selfies, bank details, or tax IDs by email or chat.</p>
          </aside>
          {profileError && <p role="alert" className="creator-review-error">Application statuses are available, but public profile details could not be loaded.</p>}
          {(applications ?? []).length === 0 ? <p className="creator-review-empty">No creator applications have been submitted.</p> : (
            <div className="creator-review-list">{applications?.map((application) => {
              const profile = profilesById.get(application.user_id);
              return (
                <article className="creator-review-card" key={application.user_id}>
                  <div className="creator-review-heading"><div><p className="vixen-kicker">{application.status.replaceAll("_", " ").toUpperCase()}</p><h2>{profile?.display_name || profile?.username || "Profile details not set"}</h2></div><time dateTime={application.created_at}>{new Date(application.created_at).toLocaleString()}</time></div>
                  <dl>
                    <div><dt>Account ID</dt><dd>{application.user_id}</dd></div>
                    {profile?.username && <div><dt>Username</dt><dd>@{profile.username}</dd></div>}
                    <div><dt>Creator access</dt><dd>{profile?.is_creator ? "Enabled" : "Not enabled"}</dd></div>
                    {application.reviewed_at && <div><dt>Last reviewed</dt><dd>{new Date(application.reviewed_at).toLocaleString()}</dd></div>}
                  </dl>
                  {application.status === "pending" && <p className="creator-review-pending">Pending · age and identity review still required</p>}
                </article>
              );
            })}</div>
          )}
          <p><Link href="/admin">← Back to administrator console</Link></p>
        </div>
      </section>
      <style>{".creator-review-gate{margin:20px 0;padding:16px;border:1px solid rgba(255,190,94,.42);background:rgba(118,71,12,.13);color:#f5d8a6}.creator-review-gate p{margin:8px 0 0;color:#d2c3ae}.creator-review-error{color:#ff9bbf}.creator-review-empty{color:#aaa2ad}.creator-review-list{display:grid;gap:14px;margin:20px 0}.creator-review-card{padding:18px;border:1px solid rgba(255,255,255,.14);background:#100d12}.creator-review-heading{display:flex;justify-content:space-between;align-items:flex-start;gap:12px}.creator-review-heading h2{margin:6px 0;font-size:19px}.creator-review-heading time{color:#aaa2ad;font-size:12px}.creator-review-card dl{display:grid;gap:8px;margin:14px 0}.creator-review-card dl div{display:grid;grid-template-columns:minmax(125px,170px) 1fr;gap:12px}.creator-review-card dt{color:#aaa2ad}.creator-review-card dd{margin:0;overflow-wrap:anywhere}.creator-review-pending{color:#f5c36a;font-size:13px}@media(max-width:600px){.creator-review-heading{display:grid}.creator-review-card dl div{grid-template-columns:1fr;gap:3px}}"}</style>
    </main>
  );
}
