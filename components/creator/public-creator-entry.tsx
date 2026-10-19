import Image from "next/image";
import Link from "next/link";
import type { CreatorPublicFeedEntry } from "@/lib/kernel/creator-post";
import { getCreatorPublicMediaUrl } from "@/lib/adapters/creator-public-feed";

export function PublicCreatorEntry({ entry }: { entry: CreatorPublicFeedEntry }) {
  const mediaUrl = getCreatorPublicMediaUrl(entry.media_path);
  const name = entry.display_name?.trim() || entry.username;
  return (
    <article className="public-creator-entry">
      <header>
        {entry.avatar_url ? <Image className="public-entry-avatar" src={entry.avatar_url} alt="" width={44} height={44} unoptimized /> : <span className="public-entry-avatar portrait-violet">{name.slice(0, 2).toLocaleUpperCase()}</span>}
        <div><Link href={"/creators/" + encodeURIComponent(entry.username)}>{name}</Link><small>@{entry.username} · {entry.kind === "story" ? "Story · 24 hours" : "Public post"}</small></div>
        <time dateTime={entry.published_at}>{new Date(entry.published_at).toLocaleDateString()}</time>
      </header>
      {mediaUrl && (entry.media_type?.startsWith("video/") ? (
        <video className="public-creator-entry-media" controls playsInline preload="metadata" aria-label={name + " public creator video"}>
          <source src={mediaUrl} type={entry.media_type} />
        </video>
      ) : (
        <Image className="public-creator-entry-media" src={mediaUrl} alt="" width={900} height={650} unoptimized />
      ))}
      {entry.caption && <p>{entry.caption}</p>}
      <footer><Link href={"/creators/" + encodeURIComponent(entry.username)}>View creator profile <span aria-hidden="true">→</span></Link><span>PUBLIC · FREE TO VIEW</span></footer>
    </article>
  );
}
