"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export type CreatorProfileActionState = {
  status: "idle" | "success" | "error";
  message: string;
};

const bucketName = "creator-profile-media";

function isOwnedMediaPath(value: string, userId: string, kind: "avatar" | "cover") {
  return new RegExp(`^${userId}/${kind}-[0-9a-f-]{36}\\.(?:jpg|png|webp)$`, "i").test(value);
}

function storedProfilePath(value: string | null, supabaseUrl: string) {
  if (!value) return null;
  const prefix = `${supabaseUrl}/storage/v1/object/public/${bucketName}/`;
  if (!value.startsWith(prefix)) return null;
  try {
    const path = decodeURIComponent(value.slice(prefix.length));
    return path;
  } catch {
    return null;
  }
}

export async function updateCreatorProfile(
  _previousState: CreatorProfileActionState,
  formData: FormData,
): Promise<CreatorProfileActionState> {
  const supabase = await createClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) {
    return { status: "error", message: "Sign in again to edit your creator profile." };
  }

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("is_creator, username, avatar_url, cover_url")
    .eq("id", user.id)
    .maybeSingle();

  if (profileError || !profile) {
    return { status: "error", message: "We couldn't load your creator profile. Please try again." };
  }
  if (profile.is_creator !== true) {
    return { status: "error", message: "Creator profile tools unlock after your creator application is approved." };
  }

  const username = String(formData.get("username") ?? "").trim().replace(/^@/, "").toLowerCase();
  const displayName = String(formData.get("displayName") ?? "").trim();
  const bio = String(formData.get("bio") ?? "").trim();
  const avatarPath = String(formData.get("avatarPath") ?? "").trim();
  const coverPath = String(formData.get("coverPath") ?? "").trim();

  if (!/^[a-z0-9._]{3,30}$/.test(username)) {
    return { status: "error", message: "Use 3–30 letters, numbers, periods, or underscores for your @username." };
  }
  if (displayName.length < 1 || displayName.length > 80) {
    return { status: "error", message: "Your display name must be between 1 and 80 characters." };
  }
  if (bio.length > 500) {
    return { status: "error", message: "Your bio can be up to 500 characters." };
  }
  if (avatarPath && !isOwnedMediaPath(avatarPath, user.id, "avatar")) {
    return { status: "error", message: "Choose a valid profile image upload." };
  }
  if (coverPath && !isOwnedMediaPath(coverPath, user.id, "cover")) {
    return { status: "error", message: "Choose a valid cover image upload." };
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (!supabaseUrl) {
    return { status: "error", message: "Profile media storage is not configured yet." };
  }

  const updates: {
    username: string;
    display_name: string;
    bio: string;
    avatar_url?: string;
    cover_url?: string;
  } = { username, display_name: displayName, bio };

  if (avatarPath) {
    updates.avatar_url = supabase.storage.from(bucketName).getPublicUrl(avatarPath).data.publicUrl;
  }
  if (coverPath) {
    updates.cover_url = supabase.storage.from(bucketName).getPublicUrl(coverPath).data.publicUrl;
  }

  const { data: savedProfile, error } = await supabase
    .from("profiles")
    .update(updates)
    .eq("id", user.id)
    .select("id")
    .maybeSingle();

  if (error || !savedProfile) {
    return {
      status: "error",
      message: error?.code === "23505"
        ? "That @username is already in use. Try another one."
        : "We couldn't save your creator profile. Please try again.",
    };
  }

  // Remove a replaced image only after the new profile URL is safely stored.
  const previousAvatarPath = storedProfilePath(profile.avatar_url, supabaseUrl);
  const previousCoverPath = storedProfilePath(profile.cover_url, supabaseUrl);
  const replacedPaths = [
    avatarPath && previousAvatarPath && avatarPath !== previousAvatarPath ? previousAvatarPath : null,
    coverPath && previousCoverPath && coverPath !== previousCoverPath ? previousCoverPath : null,
  ].filter((path): path is string => Boolean(path));
  if (replacedPaths.length) {
    await supabase.storage.from(bucketName).remove(replacedPaths);
  }

  revalidatePath("/account");
  revalidatePath("/creator/profile");
  revalidatePath("/creators");
  revalidatePath(`/creators/${profile.username}`);
  revalidatePath(`/creators/${username}`);
  return { status: "success", message: "Your public creator profile has been saved." };
}
