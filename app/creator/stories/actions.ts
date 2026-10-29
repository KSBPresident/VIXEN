"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export type CreatorStoryActionState = { status: "idle" | "success" | "error"; message: string };

const mediaExtensions: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "video/mp4": "mp4",
  "video/webm": "webm",
};

async function removeStoryMedia(supabase: Awaited<ReturnType<typeof createClient>>, path: string) {
  await supabase.storage.from("creator-story-media").remove([path]);
}

export async function publishCreatorStory(_previous: CreatorStoryActionState, formData: FormData): Promise<CreatorStoryActionState> {
  const supabase = await createClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) return { status: "error", message: "Sign in to publish a story." };

  const { data: profile, error: profileError } = await supabase.from("profiles").select("is_creator,username").eq("id", user.id).maybeSingle();
  if (profileError || profile?.is_creator !== true) return { status: "error", message: "Only approved creators can publish stories." };

  const caption = String(formData.get("caption") ?? "").trim();
  const mediaPath = String(formData.get("mediaPath") ?? "").trim();
  const mediaType = String(formData.get("mediaType") ?? "").trim();
  const pathMatch = mediaPath.match(/^([0-9a-f-]{36})\/(story-[0-9a-f-]{36})\.(jpg|png|webp|mp4|webm)$/i);
  if (caption.length > 500 || !pathMatch || pathMatch[1].toLowerCase() !== user.id.toLowerCase()) {
    if (pathMatch?.[1].toLowerCase() === user.id.toLowerCase()) await removeStoryMedia(supabase, mediaPath);
    return { status: "error", message: "Choose a valid photo or video from your creator account." };
  }
  if (mediaExtensions[mediaType] !== pathMatch[3].toLowerCase()) {
    await removeStoryMedia(supabase, mediaPath);
    return { status: "error", message: "The uploaded file type does not match its storage path." };
  }

  const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();
  const { data: saved, error } = await (supabase as any).from("creator_stories").insert({
    creator_id: user.id,
    caption,
    media_path: mediaPath,
    media_type: mediaType,
    expires_at: expiresAt,
  }).select("id").maybeSingle();

  if (error || !saved) {
    await removeStoryMedia(supabase, mediaPath);
    return { status: "error", message: "We couldn’t publish your story. Check your upload and try again." };
  }

  revalidatePath("/creator/stories");
  revalidatePath("/creator/studio");
  if (profile.username) revalidatePath("/creators/" + profile.username);
  return { status: "success", message: "Your story is live for up to 24 hours." };
}

export async function deleteCreatorStory(formData: FormData) {
  const supabase = await createClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) redirect("/account");
  const id = String(formData.get("storyId") ?? "");
  if (!/^[0-9a-f-]{36}$/i.test(id)) redirect("/creator/stories");

  const { data: story } = await (supabase as any).from("creator_stories")
    .select("id,media_path").eq("id", id).eq("creator_id", user.id).maybeSingle();
  if (!story) redirect("/creator/stories?removed=not-found");

  const { error: mediaError } = await supabase.storage.from("creator-story-media").remove([story.media_path]);
  if (mediaError) redirect("/creator/stories?removed=not-removed");
  const { error } = await (supabase as any).from("creator_stories").delete().eq("id", id).eq("creator_id", user.id);
  if (error) redirect("/creator/stories?removed=not-removed");

  revalidatePath("/creator/stories");
  revalidatePath("/creator/studio");
  revalidatePath("/creators");
  redirect("/creator/stories?removed=yes");
}
