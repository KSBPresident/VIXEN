"use server";

import { randomBytes, createHash } from "node:crypto";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { isVixenPlatformAdmin } from "@/lib/server/platform-admin";

async function requireAdmin() {
  const supabase = await createClient();
  const { data: { user }, error } = await supabase.auth.getUser();
  if (error || !user || !isVixenPlatformAdmin(user)) redirect("/account");
  return { supabase, user };
}

export async function reviewCreatorPreapplication(formData: FormData) {
  const { supabase, user } = await requireAdmin();
  const id = String(formData.get("applicationId") ?? "");
  const decision = String(formData.get("decision") ?? "");
  const note = String(formData.get("reviewNote") ?? "").trim().slice(0, 500);
  if (!/^[0-9a-f-]{36}$/i.test(id) || !["approved", "rejected"].includes(decision)) redirect("/admin/creator-applications");

  const { data: row } = await (supabase as any).from("creator_preapplications")
    .select("id,email").eq("id", id).eq("status", "pending").maybeSingle();
  if (!row) redirect("/admin/creator-applications?review=not-found");

  if (decision === "approved" && formData.get("identityVerified") !== "on") {
    redirect("/admin/creator-applications?review=verification-required");
  }

  const token = decision === "approved" ? randomBytes(32).toString("base64url") : null;
  const tokenHash = token ? createHash("sha256").update(token).digest("hex") : null;
  const { data, error } = await (supabase as any).from("creator_preapplications").update({
    status: decision,
    review_note: note || null,
    reviewed_by: user.id,
    reviewed_at: new Date().toISOString(),
    invite_token_hash: tokenHash,
  }).eq("id", id).eq("status", "pending").select("id").maybeSingle();

  if (error || !data) redirect("/admin/creator-applications?review=not-saved");
  revalidatePath("/admin");
  revalidatePath("/admin/creator-applications");
  revalidatePath("/sign-up");
  if (token) redirect("/admin/creator-applications?invitationId=" + encodeURIComponent(id) + "&token=" + encodeURIComponent(token));
  redirect("/admin/creator-applications?review=rejected");
}

export async function reviewExistingCreatorApplication(formData: FormData) {
  const { supabase, user } = await requireAdmin();
  const id = String(formData.get("userId") ?? "");
  const decision = String(formData.get("decision") ?? "");
  if (!/^[0-9a-f-]{36}$/i.test(id) || !["approved", "rejected"].includes(decision)) redirect("/admin/creator-applications");
  if (decision === "approved" && formData.get("identityVerified") !== "on") redirect("/admin/creator-applications?review=verification-required");

  const { data: application, error } = await (supabase as any).from("creator_applications").update({
    status: decision,
    reviewed_at: new Date().toISOString(),
  }).eq("user_id", id).eq("status", "pending").select("user_id").maybeSingle();
  if (error || !application) redirect("/admin/creator-applications?review=not-saved");

  const { error: profileError } = await (supabase as any).from("profiles").update({ is_creator: decision === "approved" }).eq("id", id);
  if (profileError) redirect("/admin/creator-applications?review=profile-not-saved");

  revalidatePath("/admin");
  revalidatePath("/admin/creator-applications");
  revalidatePath("/account");
  revalidatePath("/creator/studio");
  redirect("/admin/creator-applications?review=" + decision);
}
