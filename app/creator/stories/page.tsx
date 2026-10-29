import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { CreatorStoryComposer } from "@/components/creator/creator-story-composer";
import { deleteCreatorStory } from "./actions";

export const dynamic = "force-dynamic";
export const metadata = { title: "Creator stories · VIXEN", robots: { index: false, follow: false } };

type StoryRow = { id: string; caption: string; media_path: string; media_type: string; expires_at: string; created_at: string };
type SignedStory = StoryRow & { signedUrl: string };

export default async function CreatorStoriesPage({ searchParams }: { searchParams: Promise<{ removed?: string }> }) {
  const params = await searchParams;
  const configured = Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL && (process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY));
  if (!configured) return <main className="vixen-home"><header className="vixen-account-topbar"><Link href="/">VIXEN</Link></header><section className="vixen-account-content"><div className="vixen-account-panel">
    <p className="vixen-kicker">CREATOR STORIES</p><h1>Story publishing is unavailable.</h1><p>VIXEN’s account service is not configured for this environment.</p><Link href="/sign-up?type=creator">Creator application information →</Link>
  </div></section></main>;

  const supabase = await createClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) redirect("/sign-up?type=creator&mode=signin&next=/creator/stories");
  const { data: profile } = await supabase.from("profiles").select("is_creator,username").eq("id", user.id).maybeSingle();
  if (profile?.is_creator !== true) redirect("/account");

  let stories: SignedStory[] = [];
  let storiesAvailable = true;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data, error } = await (supabase as any).from("creator_stories")
    .select("id,caption,media_path,media_type,expires_at,created_at")
    .eq("creator_id", user.id).gt("expires_at", new Date().toISOString()).order("created_at", { ascending: false }).limit(30);
  if (error) {
    storiesAvailable = false;
  } else {
    const rows = (data ?? []) as StoryRow[];
    stories = (await Promise.all(rows.map(async (story) => {
      const secondsLeft = Math.floor((new Date(story.expires_at).getTime() - Date.now()) / 1000);
      if (secondsLeft <= 0) return null;
      const ttl = Math.max(1, Math.min(300, secondsLeft - 2));
      const { data: signed, error: signError } = await supabase.storage.from("creator-story-media").createSignedUrl(story.media_path, ttl);
      return signError || !signed?.signedUrl ? null : { ...story, signedUrl: signed.signedUrl };
    }))).filter((story): story is SignedStory => Boolean(story));
  }

  const publicProfile = profile.username ? "/creators/" + encodeURIComponent(profile.username) : "/creator/profile";
  return <main className="vixen-home">
    <header className="vixen-account-topbar"><Link href="/">VIXEN</Link><nav><Link href="/creator/studio">Creator space</Link><Link href="/creator/posts">Public posts</Link><Link href="/account">Account</Link></nav></header>
    <section className="vixen-account-content"><div className="vixen-account-panel creator-stories-panel">
      <p className="vixen-kicker">APPROVED CREATOR · 24-HOUR STORIES</p>
      <h1>Your stories</h1>
      <p>Share a photo or video with signed-in members. Each story disappears from VIXEN after 24 hours; access links expire no later than the story.</p>
      <nav className="creator-stories-nav"><Link href={publicProfile}>View your public profile →</Link><Link href="/creator/posts">Manage public posts →</Link></nav>
      {params.removed === "yes" && <p role="status">Story and media removed.</p>}
      {params.removed === "not-removed" && <p role="alert">The story could not be removed. Refresh and try again.</p>}
      {!storiesAvailable && <section className="creator-stories-unavailable" role="alert"><h2>Story storage is not ready yet.</h2><p>The secure story migration must be applied before publishing stories.</p></section>}
      {storiesAvailable && <CreatorStoryComposer />}
      <section className="creator-stories-list" aria-labelledby="creator-stories-list-title">
        <h2 id="creator-stories-list-title">Active stories <span>{stories.length}</span></h2>
        {stories.length === 0 ? <p className="creator-stories-empty">{storiesAvailable ? "No active stories. Your first story will appear here and on your profile." : "Stories will appear here after secure storage is configured."}</p> : <div className="creator-stories-grid">
          {stories.map((story) => <article className="creator-story-own-card" key={story.id}>
            <div className="creator-story-own-head"><time dateTime={story.expires_at}>Expires {new Date(story.expires_at).toLocaleString()}</time><form action={deleteCreatorStory}><input type="hidden" name="storyId" value={story.id} /><button type="submit" aria-label="Delete this story">Delete</button></form></div>
            {story.caption && <p>{story.caption}</p>}
            {story.media_type.startsWith("video/") ? <video controls playsInline preload="metadata" src={story.signedUrl}>Your browser cannot play this video.</video> : <Image src={story.signedUrl} alt="Creator story" width={720} height={960} unoptimized />}
            <span>PRIVATE MEDIA · SIGNED-IN MEMBERS · EXPIRES WITH STORY</span>
          </article>)}
        </div>}
      </section>
    </div></section>
    <style>{".creator-stories-panel{max-width:980px}.creator-stories-nav{display:flex;gap:16px;flex-wrap:wrap;margin:16px 0}.creator-stories-nav a{color:#ff75b8;font-size:13px}.creator-stories-unavailable{padding:16px;border:1px solid rgba(255,190,94,.35);color:#e4d1af}.creator-stories-empty{padding:16px;color:#aaa2ad;border:1px solid rgba(255,255,255,.12)}.creator-stories-list{margin-top:28px}.creator-stories-list h2{display:flex;gap:10px;align-items:center}.creator-stories-list h2 span{font-size:12px;color:#ff75b8}.creator-stories-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(230px,1fr));gap:14px}.creator-story-own-card{display:grid;gap:12px;padding:14px;border:1px solid rgba(255,255,255,.14);background:#100d12}.creator-story-own-head{display:flex;justify-content:space-between;align-items:center;color:#aaa2ad;font-size:11px}.creator-story-own-head form{margin:0}.creator-story-own-head button{color:#ff9bbf;border:1px solid rgba(255,255,255,.18);padding:7px 10px;background:#17131a;cursor:pointer}.creator-story-own-card>p{white-space:pre-wrap}.creator-story-own-card>img,.creator-story-own-card>video{display:block;width:100%;height:auto;max-height:440px;object-fit:contain;background:#09070a}.creator-story-own-card>span{color:#ff75b8;font-size:9px;font-weight:700;letter-spacing:.1em}"}</style>
  </main>;
}
