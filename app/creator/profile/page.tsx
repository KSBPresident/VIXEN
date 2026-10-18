import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
// cspell:ignore Fcreator Fprofile
import { CreatorProfileEditor } from "@/components/creator/creator-profile-editor";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";
export const metadata = { title: "Edit creator profile", robots: { index: false, follow: false } };

export default async function CreatorProfileSettingsPage() {
  const supabaseConfigured = Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
      (process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY),
  );
  if (!supabaseConfigured) redirect("/sign-up?type=creator");

  const supabase = await createClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) redirect("/sign-up?type=creator&next=%2Fcreator%2Fprofile");

  const { data: profile, error } = await supabase
    .from("profiles")
    .select("is_creator, username, display_name, avatar_url, cover_url, bio")
    .eq("id", user.id)
    .maybeSingle();

  if (error || !profile) {
    return (
      <main className="vixen-home">
        <header className="vixen-account-topbar">
          <Link href="/" aria-label="VIXEN home"><Image src="/assets/vixen-mark-3d.png" alt="VIXEN emblem" width={200} height={200} priority /></Link>
        </header>
        <section className="vixen-account-content">
          <div className="vixen-account-panel">
            <p className="vixen-kicker">CREATOR PROFILE</p>
            <h1>We couldn’t load your profile.</h1>
            <p>Refresh the page or return to your VIXEN account. Your profile data has not been changed.</p>
            <Link className="vixen-discover-link" href="/account">Open your account <span aria-hidden="true">→</span></Link>
          </div>
        </section>
      </main>
    );
  }

  if (profile.is_creator !== true) redirect("/account");

  const avatarUrl = profile.avatar_url?.startsWith("https://") ? profile.avatar_url : null;
  const coverUrl = profile.cover_url?.startsWith("https://") ? profile.cover_url : null;
  const publicProfileHref = profile.username
    ? `/creators/${encodeURIComponent(profile.username)}`
    : "/creators";

  return (
    <main className="vixen-home creator-profile-settings-page">
      <header className="vixen-account-topbar">
        <Link href="/" aria-label="VIXEN home"><Image src="/assets/vixen-mark-3d.png" alt="VIXEN emblem" width={200} height={200} priority /></Link>
        <nav aria-label="Creator profile actions">
          <Link href={publicProfileHref}>View public profile</Link>
          <Link href="/creator/studio">Creator workspace</Link>
        </nav>
      </header>
      <section className="vixen-account-content">
        <div className="vixen-account-panel">
          <p className="vixen-kicker">APPROVED CREATOR ACCOUNT</p>
          <h1>Edit your public profile.</h1>
          <p>Your public details are visible to VIXEN members. Only your approved creator account can change these fields.</p>
          <CreatorProfileEditor
            username={profile.username ?? ""}
            displayName={profile.display_name ?? ""}
            bio={profile.bio ?? ""}
            avatarUrl={avatarUrl}
            coverUrl={coverUrl}
          />
        </div>
      </section>
    </main>
  );
}
