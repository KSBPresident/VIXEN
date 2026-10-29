"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export type ProfileActionState = {
  status: "idle" | "success" | "error";
  message: string;
};

export async function updateProfile(
  _previousState: ProfileActionState,
  formData: FormData,
): Promise<ProfileActionState> {
  const supabase = await createClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) {
    return { status: "error", message: "Sign in again to update your profile." };
  }

  const submittedUsername = String(formData.get("username") ?? "").trim().replace(/^@/, "").toLowerCase();
  const displayName = String(formData.get("displayName") ?? "").trim();

  if (!/^[a-z0-9._]{3,30}$/.test(submittedUsername)) {
    return {
      status: "error",
      message: "Use 3–30 letters, numbers, periods, or underscores for your @username.",
    };
  }

  if (displayName.length > 80) {
    return { status: "error", message: "Display names can be up to 80 characters." };
  }

  const { data, error } = await supabase
    .from("profiles")
    .update({
      username: submittedUsername,
      display_name: displayName || null,
    })
    .eq("id", user.id)
    .select("id")
    .maybeSingle();

  if (error) {
    return {
      status: "error",
      message: error.code === "23505"
        ? "That @username is already in use. Try another one."
        : "We couldn't save your profile. Please try again.",
    };
  }

  if (!data) {
    return { status: "error", message: "Your VIXEN profile could not be found. Please sign out and back in." };
  }

  revalidatePath("/account");
  revalidatePath("/creators");
  return { status: "success", message: "Your profile has been saved." };
}

export async function applyForCreator(formData: FormData) {
  if (formData.get("adultCreatorAttestation") !== "on") {
    redirect("/account?creatorApplication=attestation-required");
  }

  const supabase = await createClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) redirect("/sign-up?type=member&mode=signin&next=%2Faccount");

  const [{ data: profile }, { data: existing, error: applicationError }] = await Promise.all([
    supabase.from("profiles").select("is_creator").eq("id", user.id).maybeSingle(),
    supabase.from("creator_applications").select("status").eq("user_id", user.id).maybeSingle(),
  ]);

  if (profile?.is_creator) redirect("/account?creatorApplication=already-creator");
  if (applicationError) redirect("/account?creatorApplication=unavailable");
  if (existing?.status === "pending") redirect("/account?creatorApplication=already-pending");
  if (existing?.status === "approved") redirect("/account?creatorApplication=already-approved");
  if (existing?.status === "rejected") redirect("/account?creatorApplication=contact-admin");

  const { error } = await supabase.from("creator_applications").insert({
    user_id: user.id,
    adult_creator_attestation: true,
  });

  if (error) {
    redirect(error.code === "23505"
      ? "/account?creatorApplication=already-submitted"
      : "/account?creatorApplication=unavailable");
  }

  revalidatePath("/account");
  revalidatePath("/admin/creator-applications");
  redirect("/account?creatorApplication=submitted");
}

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/");
}
