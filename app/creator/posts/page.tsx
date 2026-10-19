// cspell:ignore Fcreator Fposts
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { CreatorPostComposer } from "@/components/creator/creator-post-composer";
import { PublicCreatorEntry } from "@/components/creator/public-creator-entry";
import { deleteCreatorPost } from "@/app/creator/posts/actions";
import type { CreatorPublicFeedEntry } from "@/lib/kernel/creator-post";
import "./posts.css";

export const dynamic = "force-dynamic";
export const metadata = { title: "Creator feed and stories", robots: { index: false, follow: false } };

export default async function CreatorPostsPage() {
  const configured = Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL &&
    (process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY));
  if (!configured) redirect("/sign-up?type=creator");
  const supabase = await createClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) redirect("/sign-up?type=creator&next=%2Fcreator%2Fposts");

  const { data: profile } = await supabase.from("profiles").select("is_creator, username").eq("id", user.id).maybeSingle();
  if (profile?.is_creator !== true) redirect("/creator/studio");

  const { data } = await supabase.from("creator_posts")
    .select("id, creator_id, kind, caption, media_path, media_type, published_at, expires_at")
    .eq("creator_id", user.id)
    .order("published_at", { ascending: false });
  const publications = (data ?? []) as Array<CreatorPublicFeedEntry & { creator_id: string }>;

  return (
    <main className="creator-posts-page">
      <header className="creator-posts-topbar">
        <Link href="/" aria-label="VIXEN home"><Image src="/assets/vixen-mark-3d.png" alt="VIXEN emblem" width={140} height={140} priority /></Link>
        <nav aria-label="Creator workspace"><Link href="/creator/studio">Workspace</Link><Link href={profile.username ? "/creators/" + encodeURIComponent(profile.username) : "/creators"}>Public profile</Link><Link href="/account">My account</Link></nav>
      </header>
      <section className="creator-posts-layout">
        <div>
          <p className="vixen-kicker">APPROVED CREATOR · PUBLIC FEED</p>
          <h1>Posts and stories.</h1>
          <p className="creator-posts-intro">Publish updates for everyone to see. Your stories expire after 24 hours. Membership-only posts, paid drops, and private media are not active.</p>
          <CreatorPostComposer />
        </div>
        <aside>
          <p className="vixen-kicker">YOUR PUBLISHING BOUNDARY</p>
          <h2>Public means public.</h2>
          <p>Anyone can view or save a public post’s media if they have its link. This workspace does not accept private or membership-locked media.</p>
          <p>Only publish content you own or have permission to share. Everyone depicted must be an adult and have consented.</p>
          <Link href="/creator/studio">Back to creator workspace <span aria-hidden="true">→</span></Link>
        </aside>
      </section>
      <section className="creator-publications">
        <div><p className="vixen-kicker">YOUR LIVE PUBLICATIONS</p><h2>What members can see</h2></div>
        {publications.length ? publications.map((entry) => (
          <div className="creator-publication-row" key={entry.id}>
            <PublicCreatorEntry entry={{ ...entry, username: profile.username ?? "creator", display_name: null, avatar_url: null, cover_url: null, bio: null }} />
            <form action={deleteCreatorPost}><input type="hidden" name="postId" value={entry.id} /><button type="submit">Delete publication</button></form>
          </div>
        )) : <p className="creator-posts-empty">You haven’t published anything yet. Public posts and stories appear here after you share them.</p>}
      </section>
    </main>
  );
}
