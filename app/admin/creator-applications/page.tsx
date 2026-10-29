import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { isVixenPlatformAdmin } from "@/lib/server/platform-admin";
import { reviewCreatorPreapplication, reviewExistingCreatorApplication, renewCreatorInvitation } from "./review-actions";
import { CopyCreatorInvite } from "@/components/admin/copy-creator-invite";

export const dynamic = "force-dynamic";
export const metadata = { title: "Creator applications · VIXEN", robots: { index: false, follow: false } };

type SearchParams = Promise<{ invitationId?: string; token?: string; review?: string }>;
type PreapplicationRow = { id: string; email: string; display_name: string; bio: string; status: string; review_note: string | null; created_at: string; reviewed_at: string | null; invite_token_expires_at: string | null };
type LegacyApplicationRow = { user_id: string; email: string | null; status: string; created_at: string; reviewed_at: string | null; username: string | null; display_name: string | null; is_creator: boolean };
export default async function AdminCreatorApplicationsPage({ searchParams }: { searchParams: SearchParams }) {
  const params = await searchParams;
  const supabase = await createClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !isVixenPlatformAdmin(user)) redirect("/account");

  // The new table type will be generated after this migration is installed.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const preapplicationQuery = (supabase as any).from("creator_preapplications")
    .select("id,email,display_name,bio,status,review_note,created_at,reviewed_at,invite_token_expires_at")
    .order("created_at", { ascending: false }).limit(100);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const legacyQuery = (supabase as any).rpc("admin_creator_application_queue");
  const [{ data: applicationData, error: applicationError }, { data: legacyData, error: legacyError }] = await Promise.all([preapplicationQuery, legacyQuery]);
  const applications = (applicationData ?? []) as PreapplicationRow[];
  const legacy = (legacyData ?? []) as LegacyApplicationRow[];

  let invitation: { email: string; display_name: string } | null = null;
  if (params.invitationId && params.token && /^[0-9a-f-]{36}$/i.test(params.invitationId)) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data } = await (supabase as any).from("creator_preapplications")
      .select("email,display_name").eq("id", params.invitationId).eq("status", "approved").maybeSingle();
    invitation = data ?? null;
  }

  const pending = applications.filter((row) => row.status === "pending");
  const approvedUnclaimed = applications.filter((row) => row.status === "approved");
  const legacyPending = legacy.filter((row) => row.status === "pending");

  const inviteUrl = invitation
    ? "https://vixen-production-package.vercel.app/creator/setup?application=" + encodeURIComponent(params.invitationId!) + "&token=" + encodeURIComponent(params.token!)
    : null;
  const emailBody = inviteUrl
    ? encodeURIComponent("Your VIXEN creator application was approved. Use this one-time link to set up your creator account. Confirm your email to activate it: " + inviteUrl)
    : "";

  return (
    <main className="vixen-home">
      <header className="vixen-account-topbar"><Link href="/">VIXEN</Link><nav><Link href="/admin">Admin console</Link><Link href="/admin/payment-proofs">Payment reviews</Link><Link href="/admin/withdrawals">Withdrawals</Link></nav></header>
      <section className="vixen-account-content"><div className="vixen-account-panel">
        <p className="vixen-kicker">PRIVATE · ADMIN ONLY</p>
        <h1>Creator approval queue</h1>
        <p>Review creators before they create an account. Confirm age and identity using VIXEN’s approved review process before approving. Do not collect identity documents in email or chat.</p>
        {params.review === "verification-required" && <p className="creator-queue-alert" role="alert">Confirm the identity review before approval.</p>}
        {params.review === "not-saved" && <p className="creator-queue-alert" role="alert">The review could not be saved. Refresh and try again.</p>}
        {params.review === "profile-not-saved" && <p className="creator-queue-alert" role="alert">The application changed, but creator access could not be updated. Contact support before retrying.</p>}
        {applicationError && <p className="creator-queue-alert" role="alert">Pre-account applications could not be loaded. Confirm the creator approval migration is installed.</p>}
        {legacyError && <p className="creator-queue-alert" role="alert">Existing creator applications could not be loaded.</p>}

        {invitation && inviteUrl && <aside className="creator-invite-ready" role="status">
          <p className="vixen-kicker">APPROVED · ACCOUNT LINK READY</p>
          <h2>{invitation.display_name} · {invitation.email}</h2>
          <p>Send this one-time link to the applicant at the reviewed email address. They must confirm control of that inbox before creator access is activated. It expires in seven days. Keep it private.</p>
          <CopyCreatorInvite href={inviteUrl} />
          <a href={"mailto:" + encodeURIComponent(invitation.email) + "?subject=" + encodeURIComponent("VIXEN creator application approved") + "&body=" + emailBody}>Open email to applicant ↗</a>
        </aside>}

        <section className="creator-queue-section">
          <h2>Approved · awaiting account setup <span>{approvedUnclaimed.length}</span></h2>
          {approvedUnclaimed.length === 0 ? <p className="creator-queue-empty">No approved applicants are waiting to set up accounts.</p> : <div className="creator-review-list">{approvedUnclaimed.map((application) => (
            <article className="creator-review-card" key={application.id}>
              <p className="vixen-kicker">APPROVED · NO ACCOUNT YET</p><h3>{application.display_name}</h3>
              <p>{application.email} · Approved {application.reviewed_at ? new Date(application.reviewed_at).toLocaleString() : "date unavailable"}</p>
              <p>Invitation {application.invite_token_expires_at && new Date(application.invite_token_expires_at) > new Date() ? "expires " + new Date(application.invite_token_expires_at).toLocaleString() : "expired or not issued"}.</p>
              <form action={renewCreatorInvitation}><input type="hidden" name="applicationId" value={application.id} /><button type="submit">Create a new one-time setup link</button></form>
            </article>
          ))}</div>}
        </section>

        <section className="creator-queue-section">
          <h2>Pre-account applications <span>{pending.length} pending</span></h2>
          <p>These applicants do not have VIXEN logins. Approval creates a one-time account setup link.</p>
          {pending.length === 0 ? <p className="creator-queue-empty">No pre-account applications are waiting.</p> : (
            <div className="creator-review-list">
              {pending.map((application) => (
                <article className="creator-review-card" key={application.id}>
                  <div className="creator-review-heading">
                    <div><p className="vixen-kicker">PENDING · NO ACCOUNT</p><h3>{application.display_name}</h3></div>
                    <time dateTime={application.created_at}>{new Date(application.created_at).toLocaleString()}</time>
                  </div>
                  <dl>
                    <div><dt>Email</dt><dd>{application.email}</dd></div>
                    {application.bio ? <div><dt>Creator plans</dt><dd>{application.bio}</dd></div> : null}
                    <div><dt>Applicant confirms</dt><dd>Adult woman · creator terms accepted</dd></div>
                  </dl>
                  <form action={reviewCreatorPreapplication} className="creator-review-form">
                    <input type="hidden" name="applicationId" value={application.id} />
                    <label>Internal review note<textarea name="reviewNote" maxLength={500} defaultValue={application.review_note ?? ""} placeholder="Optional admin-only note" /></label>
                    <label className="creator-verification-check"><input type="checkbox" name="identityVerified" required /> I completed the required age and identity check through VIXEN’s approved process.</label>
                    <div><button name="decision" value="approved" type="submit">Approve and prepare account link</button><button className="creator-reject-button" name="decision" value="rejected" type="submit">Reject application</button></div>
                  </form>
                </article>
              ))}
            </div>
          )}
        </section>

        <section className="creator-queue-section">
          <h2>Existing-account applications</h2>
          <p>These are older applications created after account signup. Review them separately; approving requires the same completed age and identity check.</p>
          {legacyPending.length === 0 ? <p className="creator-queue-empty">No existing-account applications are waiting.</p> : <div className="creator-review-list">{legacyPending.map((application) => {
            return <article className="creator-review-card" key={application.user_id}>
              <div className="creator-review-heading"><div><p className="vixen-kicker">PENDING · ACCOUNT EXISTS</p><h3>{application.display_name || application.username || "Profile details not set"}</h3></div><time dateTime={application.created_at}>{new Date(application.created_at).toLocaleString()}</time></div>
              <dl><div><dt>Email</dt><dd>{application.email || "Email unavailable"}</dd></div>{application.username && <div><dt>Username</dt><dd>@{application.username}</dd></div></dl>
              <form action={reviewExistingCreatorApplication} className="creator-review-form">
                <input type="hidden" name="userId" value={application.user_id} />
                <label className="creator-verification-check"><input type="checkbox" name="identityVerified" required /> I completed the required age and identity check through VIXEN’s approved process.</label>
                <div><button name="decision" value="approved" type="submit">Approve creator access</button><button className="creator-reject-button" name="decision" value="rejected" type="submit">Reject application</button></div>
              </form>
            </article>;
          })}</div>}
        </section>
        <p><Link href="/admin">← Back to administrator console</Link></p>
      </div></section>
      <style>{".creator-queue-section{margin-top:28px;padding-top:22px;border-top:1px solid rgba(255,255,255,.14)}.creator-queue-section h2{display:flex;justify-content:space-between;gap:12px}.creator-queue-section h2 span{color:#ff75b8;font-size:13px}.creator-queue-section>p,.creator-queue-empty{color:#aaa2ad;font-size:13px}.creator-queue-alert{padding:12px;color:#ffd0df;background:#44152c}.creator-invite-ready{display:grid;gap:12px;margin:20px 0;padding:18px;border:1px solid #ff3f9b;background:#190d16}.creator-invite-ready h2{margin:0;font-size:18px}.creator-invite-ready>p:not(.vixen-kicker){color:#c9bdcc;font-size:13px;line-height:1.6}.creator-invite-ready>a{color:#ff75b8;font-size:13px}.creator-invite-copy{display:flex;gap:8px}.creator-invite-copy input{flex:1;min-width:0;padding:10px;background:#09070a;color:white;border:1px solid rgba(255,255,255,.18)}.creator-invite-copy button,.creator-review-form button{min-height:42px;padding:0 14px;border:1px solid #ff1688;background:#bd0c68;color:#fff;cursor:pointer}.creator-review-list{display:grid;gap:14px;margin:18px 0}.creator-review-card{padding:18px;border:1px solid rgba(255,255,255,.14);background:#100d12}.creator-review-heading{display:flex;justify-content:space-between;gap:12px}.creator-review-heading h3{margin:5px 0}.creator-review-heading time{color:#aaa2ad;font-size:12px}.creator-review-card dl{display:grid;gap:9px;margin:15px 0}.creator-review-card dl div{display:grid;grid-template-columns:130px 1fr;gap:12px}.creator-review-card dt{color:#aaa2ad}.creator-review-card dd{margin:0;overflow-wrap:anywhere}.creator-review-form{display:grid;gap:12px}.creator-review-form label{display:grid;gap:6px;font-size:13px}.creator-review-form textarea{min-height:65px;padding:10px;color:white;background:#09070a;border:1px solid rgba(255,255,255,.16)}.creator-review-form .creator-verification-check{display:flex;align-items:flex-start;gap:9px;color:#f0d6e1}.creator-review-form .creator-verification-check input{margin-top:3px}.creator-review-form div{display:flex;gap:9px;flex-wrap:wrap}.creator-review-card>form button{min-height:42px;padding:0 14px;border:1px solid #ff1688;background:#bd0c68;color:#fff;cursor:pointer}.creator-review-form .creator-reject-button{border-color:rgba(255,255,255,.2);background:#17131a}@media(max-width:600px){.creator-review-heading{display:grid}.creator-review-card dl div{grid-template-columns:1fr;gap:3px}.creator-invite-copy{flex-direction:column}}"}
      </style>
    </main>
  );
}
