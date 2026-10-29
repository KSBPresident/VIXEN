"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export type CreatorPostActionState = { status: "idle" | "success" | "error"; message: string };

const allowedMediaTypes = new Set(["image/jpeg", "image/png", "image/webp", "video/mp4", "video/webm"]);

export async function createCreatorPost(_previous: CreatorPostActionState, formData: FormData): Promise<CreatorPostActionState> {
  const supabase = await createClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) return { status: "error", message: "Sign in to your approved creator account." };

  const { data: profile, error: profileError } = await supabase.from("profiles").select("is_creator,username").eq("id", user.id).maybeSingle();
  if (profileError || profile?.is_creator !== true) return { status: "error", message: "Only approved creators can publish feed posts." };

  const caption = String(formData.get("caption") ?? "").trim();
  const mediaPath = String(formData.get("mediaPath") ?? "").trim();
  const mediaType = String(formData.get("mediaType") ?? "").trim();
  if (!caption && !mediaPath) return { status: "error", message: "Add a caption or choose a photo/video." };
  if (caption.length > 2000) return { status: "error", message: "Captions can be up to 2,000 characters." };
  if (mediaPath && (!new RegExp("^" + user.id + "/post-[0-9a-f-]{36}\\.(?:jpg|png|webp|mp4|webm)$", "i").test(mediaPath) || !allowedMediaTypes.has(mediaType))) {
    return { status: "error", message: "Choose a valid VIXEN feed upload." };
  }
  if (!mediaPath && mediaType) return { status: "error", message: "Upload a photo or video before publishing." };

  const { error } = await (supabase as any).from("creator_posts").insert({
    creator_id: user.id,
    caption,
    media_path: mediaPath || null,
    media_type: mediaPath ? mediaType : null,
    status: "published",
  });
  if (error) return { status: "error", message: "We couldn’t publish your post. Check your upload and try again." };

  revalidatePath("/creator/posts");
  revalidatePath("/creator/studio");
  if (profile.username) revalidatePath("/creators/" + profile.username);
  return { status: "success", message: "Your post is live on your public profile." };
}

export async function deleteCreatorPost(formData: FormData) {
  const supabase = await createClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) redirect("/account");
  const id = String(formData.get("postId") ?? "");
  if (!/^[0-9a-f-]{36}$/i.test(id)) redirect("/creator/posts");
  const { data: post } = await (supabase as any).from("creator_posts").select("id,media_path").eq("id", id).eq("creator_id", user.id).maybeSingle();
  if (!post) redirect("/creator/posts?removed=not-found");
  const { error } = await (supabase as any).from("creator_posts").delete().eq("id", id).eq("creator_id", user.id);
  if (!error && post.media_path) await supabase.storage.from("creator-feed-media").remove([post.media_path]);
  revalidatePath("/creator/posts");
  revalidatePath("/creator/studio");
  redirect("/creator/posts?removed=" + (error ? "not-removed" : "yes"));
}
