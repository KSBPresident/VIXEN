import Image from "next/image";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

type Story = { id: string; caption: string; media_path: string; media_type: string; expires_at: string; url: string };

export async function CreatorStoryStrip({ creatorId, username, isSignedIn }: { creatorId: string; username: string; isSignedIn: boolean }) {
  if (!isSignedIn) return <section className="vixen-story-strip"><p className="member-eyebrow">24-HOUR STORIES</p><h2>A closer look, while it lasts.</h2><p>Sign in to view this creator’s active stories.</p><Link href="/sign-up?type=member">Sign in or create a free account →</Link></section>;
  let stories: Story[] = [];
  let available = false;
  try {
    const supabase = await createClient();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data, error } = await (supabase as any).from("creator_stories").select("id,caption,media_path,media_type,expires_at").eq("creator_id", creatorId).gt("expires_at", new Date().toISOString()).order("created_at", { ascending: false }).limit(20);
    if (!error) {
      available = true;
      stories = (await Promise.all(((data ?? []) as Omit<Story, "url">[]).map(async (story) => {
        const remaining = Math.floor((new Date(story.expires_at).getTime() - Date.now()) / 1000);
        if (remaining <= 0) return null;
        const { data: signed, error: signError } = await supabase.storage.from("creator-story-media").createSignedUrl(story.media_path, Math.max(1, Math.min(300, remaining - 2)));
        return signError || !signed?.signedUrl ? null : { ...story, url: signed.signedUrl };
      }))).filter((story): story is Story => Boolean(story));
    }
  } catch {
    available = false;
    stories = [];
  }
  return <section className="vixen-story-strip" aria-labelledby="vixen-stories-title">
    <div className="vixen-story-heading"><div><p className="member-eyebrow">24-HOUR STORIES</p><h2 id="vixen-stories-title">A closer look, while it lasts.</h2></div><span>BY @{username}</span></div>
    {!available ? <p>Stories are being prepared for this profile.</p> : stories.length === 0 ? <p>No active stories right now. New moments disappear after 24 hours.</p> : <div className="vixen-story-list">{stories.map((story) => <article className="vixen-story-card" key={story.id}>
      <div className="vixen-story-media">{story.media_type.startsWith("video/") ? <video controls playsInline preload="metadata" src={story.url}>Your browser cannot play this video.</video> : <Image src={story.url} alt={story.caption || "Creator story"} width={600} height={760} unoptimized />}</div>
      {story.caption && <p>{story.caption}</p>}<time dateTime={story.expires_at}>Expires {new Date(story.expires_at).toLocaleString()}</time><span>PRIVATE · SIGNED-IN MEMBERS</span>
    </article>)}</div>}
    <style>{".vixen-story-strip{margin:24px 0;padding:20px;border:1px solid rgba(255,73,157,.32);border-radius:18px;background:linear-gradient(120deg,rgba(36,12,30,.82),rgba(15,12,17,.94))}.vixen-story-heading{display:flex;align-items:end;justify-content:space-between;gap:16px}.vixen-story-heading h2{margin:4px 0 14px;font-size:clamp(20px,3vw,28px)}.vixen-story-heading>span,.vixen-story-card>span{color:#ff75b8;font-size:9px;font-weight:700;letter-spacing:.12em}.vixen-story-list{display:flex;gap:14px;overflow-x:auto;padding:4px 0 12px;scroll-snap-type:x mandatory}.vixen-story-card{flex:0 0 min(70vw,245px);display:grid;align-content:start;gap:9px;scroll-snap-align:start}.vixen-story-media{height:300px;overflow:hidden;border:1px solid rgba(255,255,255,.14);border-radius:14px;background:#080609}.vixen-story-media img,.vixen-story-media video{width:100%;height:100%;object-fit:cover}.vixen-story-card p{margin:0;white-space:pre-wrap;overflow-wrap:anywhere}.vixen-story-card time{color:#aaa2ad;font-size:10px}.vixen-story-card>span{font-size:8px}@media(min-width:900px){.vixen-story-card{flex-basis:220px}}"} </style>
  </section>;
}
