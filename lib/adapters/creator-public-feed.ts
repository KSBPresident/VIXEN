import type { CreatorPublicFeedEntry } from "@/lib/kernel/creator-post";

export type { CreatorPublicFeedEntry };

export function getCreatorPublicMediaUrl(path: string | null): string | null {
  const baseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (!baseUrl || !path || !/^[0-9a-f-]{36}\/[0-9a-f-]{36}\.(?:jpg|png|webp|mp4|webm)$/i.test(path)) return null;
  const safePath = path.split("/").map((segment) => encodeURIComponent(segment)).join("/");
  return baseUrl.replace(/\/$/, "") + "/storage/v1/object/public/creator-post-media/" + safePath;
}
