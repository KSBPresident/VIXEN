"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { validateCreatorPublication } from "@/lib/kernel/creator-post";

export type CreatorPublicationActionState = {
  status: "idle" | "success" | "error";
  message: string;
};

const bucketName = "creator-post-media";
const mediaExtensions: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "video/mp4": "mp4",
  "video/webm": "webm",
};

async function removeUploadedMedia(supabase: Awaited<ReturnType<typeof createClient>>, path: string) {
  await supabase.storage.from(bucketName).remove([path]);
}

export async function publishCreatorPost(
  _previousState: CreatorPublicationActionState,
  formData: FormData,
): Promise<CreatorPublicationActionState> {
  const supabase = await createClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) return { status: "error", message: "Sign in to publish a creator update." };

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("is_creator, username")
    .eq("id", user.id)
    .maybeSingle();
  if (profileError || profile?.is_creator !== true) {
    return { status: "error", message: "Only approved creators can publish public updates." };
  }

  const kind = String(formData.get("kind") ?? "");
  const caption = String(formData.get("caption") ?? "").trim();
  const mediaPath = String(formData.get("mediaPath") ?? "").trim();
  const mediaType = String(formData.get("mediaType") ?? "").trim() || null;
  const validationMessage = validateCreatorPublication({
    kind,
    caption,
    mediaType,
    mediaSize: mediaType ? 1 : null,
  });
  const pathMatch = mediaPath.match(/^([0-9a-f-]{36})\/([0-9a-f-]{36})\.(jpg|png|webp|mp4|webm)$/i);
  if (validationMessage || (mediaPath && (!pathMatch || pathMatch[1].toLowerCase() !== user.id.toLowerCase())) || Boolean(mediaPath) !== Boolean(mediaType)) {
    if (pathMatch?.[1].toLowerCase() === user.id.toLowerCase()) await removeUploadedMedia(supabase, mediaPath);
    return { status: "error", message: validationMessage ?? "Choose a valid upload from your creator account." };
  }
  if (mediaType && pathMatch && mediaExtensions[mediaType] !== pathMatch[3].toLowerCase()) {
    await removeUploadedMedia(supabase, mediaPath);
    return { status: "error", message: "The uploaded file type did not match its storage path." };
  }
  if (formData.get("consentConfirmed") !== "on") {
    if (mediaPath && pathMatch?.[1].toLowerCase() === user.id.toLowerCase()) await removeUploadedMedia(supabase, mediaPath);
    return { status: "error", message: "Confirm that everyone shown is an adult and has consented to publication." };
  }

  const now = Date.now();
  const publishedAt = new Date(now).toISOString();
  const expiresAt = kind === "story" ? new Date(now + 24 * 60 * 60 * 1000).toISOString() : null;
  const { data: saved, error } = await supabase.from("creator_posts").insert({
    creator_id: user.id,
    kind,
    caption,
    visibility: "public",
    creator_attested_consent: true,
    media_path: mediaPath || null,
    media_type: mediaPath ? mediaType : null,
    published_at: publishedAt,
    expires_at: expiresAt,
  }).select("id").maybeSingle();

  if (error || !saved) {
    if (mediaPath && pathMatch?.[1].toLowerCase() === user.id.toLowerCase()) await removeUploadedMedia(supabase, mediaPath);
    return { status: "error", message: "We could not publish that update. Check the caption and media, then try again." };
  }

  revalidatePath("/creator/posts");
  revalidatePath("/creator/studio");
  revalidatePath("/member-preview");
  revalidatePath("/creators");
  revalidatePath("/creators/" + profile.username);
  return { status: "success", message: kind === "story" ? "Your public story is live for 24 hours." : "Your public creator update is live." };
}

export async function deleteCreatorPost(formData: FormData): Promise<void> {
  const supabase = await createClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) return;
  const postId = String(formData.get("postId") ?? "");
  if (!/^[0-9a-f-]{36}$/i.test(postId)) return;

  const { data: existing } = await supabase.from("creator_posts")
    .select("id, media_path")
    .eq("id", postId)
    .eq("creator_id", user.id)
    .maybeSingle();
  if (!existing) return;

  const { data: profile } = await supabase.from("profiles").select("is_creator, username").eq("id", user.id).maybeSingle();
  if (profile?.is_creator !== true) return;

  if (existing.media_path) {
    const { error: mediaError } = await supabase.storage.from(bucketName).remove([existing.media_path]);
    if (mediaError) return;
  }
  const { error } = await supabase.from("creator_posts").delete().eq("id", postId).eq("creator_id", user.id);
  if (error) return;

  revalidatePath("/creator/posts");
  revalidatePath("/member-preview");
  revalidatePath("/creators");
  if (profile.username) revalidatePath("/creators/" + profile.username);
}
