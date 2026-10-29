import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { CreatorPostComposer } from "@/components/creator/creator-post-composer";
import { deleteCreatorPost } from "./actions";

export const dynamic = "force-dynamic";
export const metadata = { title: "Creator posts · VIXEN", robots: { index: false, follow: false } };

export default async function CreatorPostsPage({ searchParams }: { searchParams: Promise<{ removed?: string }> }) {
  const params = await searchParams;
  const supabase = await createClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) redirect("/sign-up?type=creator&mode=signin&next=%2Fcreator%2Fposts");
  const { data: profile } = await supabase.from("profiles").select("is_creator,username").eq("id", user.id).maybeSingle();
  if (profile?.is_creator !== true) redirect("/account");

  const { data: posts, error } = await (supabase as any).from("creator_posts")
    .select("id,caption,media_path,media_type,status,created_at")
    .eq("creator_id", user.id).order("created_at", { ascending: false }).limit(100);
  const publicProfile = profile.username ? "/creators/" + encodeURIComponent(profile.username) : "/creator/profile";

  return <main className="vixen-home">
    <header className="vixen-account-topbar"><Link href="/">VIXEN</Link><nav><Link href="/creator/studio">Creator space</Link><Link href="/creator/profile">Edit profile</Link><Link href="/account">Account</Link></nav></header>
    <section className="vixen-account-content"><div className="vixen-account-panel creator-posts-panel">
      <p className="vixen-kicker">APPROVED CREATOR · PUBLIC FEED</p>
      <h1>Creator posts</h1>
      <p>Publish a public update with text, a photo, or a video. You can remove your posts at any time.</p>
      <nav className="creator-post-nav"><Link href={publicProfile}>View public profile →</Link><Link href="/creator/profile">Edit profile →</Link></nav>
      {params.removed === "yes" && <p role="status">Post removed from your profile.</p>}
      {params.removed === "not-removed" && <p role="alert">The post could not be removed. Refresh and try again.</p>}
      {error ? <section className="creator-post-unavailable" role="alert"><h2>Publishing setup is not active yet.</h2><p>The creator feed database migration has not been applied. Your profile and existing posts are unchanged.</p></section> : <>
        <CreatorPostComposer />
        <section className="creator-own-feed"><h2>Your published posts</h2>
          {(posts ?? []).length === 0 ? <p className="creator-post-empty">Your feed is empty. Your first published post will appear here and on your public profile.</p> : <div className="creator-own-post-list">{posts?.map((post: any) => {
            const mediaUrl = post.media_path ? supabase.storage.from("creator-feed-media").getPublicUrl(post.media_path).data.publicUrl : null;
            return <article className="creator-own-post" key={post.id}>
              <div className="creator-own-post-heading"><span>{new Date(post.created_at).toLocaleString()}</span><form action={deleteCreatorPost}><input type="hidden" name="postId" value={post.id} /><button type="submit" aria-label="Delete this post">Delete</button></form></div>
              {post.caption && <p>{post.caption}</p>}
              {mediaUrl && post.media_type?.startsWith("video/") && <video controls playsInline preload="metadata" src={mediaUrl}>Your browser cannot play this video.</video>}
              {mediaUrl && post.media_type?.startsWith("image/") && <Image src={mediaUrl} alt="Creator post media" width={960} height={720} unoptimized />}
              <span className="creator-own-post-access">PUBLIC POST · VISIBLE TO EVERYONE</span>
            </article>;
          })}</div>}
        </section>
      </>}
    </div></section>
    <style>{".creator-posts-panel{max-width:900px}.creator-post-nav{display:flex;gap:16px;flex-wrap:wrap;margin:16px 0}.creator-post-nav a{color:#ff75b8;font-size:13px}.creator-post-unavailable{padding:16px;border:1px solid rgba(255,190,94,.35);color:#e4d1af}.creator-post-empty{padding:16px;color:#aaa2ad;border:1px solid rgba(255,255,255,.12)}.creator-own-feed{margin-top:28px}.creator-own-post-list{display:grid;gap:14px}.creator-own-post{display:grid;gap:12px;padding:16px;border:1px solid rgba(255,255,255,.14);background:#100d12}.creator-own-post-heading{display:flex;justify-content:space-between;align-items:center;color:#aaa2ad;font-size:12px}.creator-own-post-heading form{margin:0}.creator-own-post-heading button{color:#ff9bbf;border:1px solid rgba(255,255,255,.18);padding:8px 12px;background:#17131a;cursor:pointer}.creator-own-post>p{white-space:pre-wrap;overflow-wrap:anywhere}.creator-own-post>img,.creator-own-post>video{display:block;width:100%;height:auto;max-height:680px;object-fit:contain;background:#09070a}.creator-own-post-access{color:#ff75b8;font-size:10px;font-weight:700;letter-spacing:.12em}"}</style>
  </main>;
}
