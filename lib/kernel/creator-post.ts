export const creatorPostMaxMediaBytes = 45 * 1024 * 1024;
export const creatorStoryDurationMs = 24 * 60 * 60 * 1000;

export const creatorPostMediaTypes = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "video/mp4": "mp4",
  "video/webm": "webm",
} as const;

export type CreatorPublicationKind = "post" | "story";
export type CreatorPublicFeedEntry = {
  id: string;
  username: string;
  display_name: string | null;
  avatar_url: string | null;
  cover_url: string | null;
  bio: string | null;
  kind: CreatorPublicationKind;
  caption: string;
  media_path: string | null;
  media_type: string | null;
  published_at: string;
  expires_at: string | null;
};

export type CreatorPublicationInput = {
  kind: string;
  caption: string;
  mediaType: string | null;
  mediaSize: number | null;
};

export function validateCreatorPublication(input: CreatorPublicationInput): string | null {
  const caption = input.caption.trim();
  if (input.kind !== "post" && input.kind !== "story") return "Choose a post or a 24-hour story.";
  if (caption.length > 2000) return "Captions can be up to 2,000 characters.";
  const hasMediaType = Boolean(input.mediaType);
  const hasMediaSize = input.mediaSize !== null;
  if (input.kind === "story" && (!hasMediaType || !hasMediaSize || !input.mediaSize)) return "Stories need an image or video.";
  if (hasMediaType !== hasMediaSize || (hasMediaSize && (!input.mediaSize || input.mediaSize <= 0))) return "Choose a valid image or video file.";
  if (input.mediaType && !(input.mediaType in creatorPostMediaTypes)) return "Choose a JPEG, PNG, WebP, MP4, or WebM file.";
  if (input.mediaSize !== null && input.mediaSize > creatorPostMaxMediaBytes) return "Media must be 45 MiB or smaller.";
  if (!caption && !hasMediaType) return "Add a caption or a media file before publishing.";
  return null;
}
