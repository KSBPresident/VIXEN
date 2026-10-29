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

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: row } = await (supabase as any).from("creator_preapplications")
    .select("id,email").eq("id", id).eq("status", "pending").maybeSingle();
  if (!row) redirect("/admin/creator-applications?review=not-found");

  if (decision === "approved" && formData.get("identityVerified") !== "on") {
    redirect("/admin/creator-applications?review=verification-required");
  }

  const token = decision === "approved" ? randomBytes(32).toString("base64url") : null;
  const tokenHash = token ? createHash("sha256").update(token).digest("hex") : null;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data, error } = await (supabase as any).from("creator_preapplications").update({
    status: decision,
    review_note: note || null,
    reviewed_by: user.id,
    reviewed_at: new Date().toISOString(),
    invite_token_hash: tokenHash,
    invite_token_expires_at: token ? new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString() : null,
  }).eq("id", id).eq("status", "pending").select("id").maybeSingle();

  if (error || !data) redirect("/admin/creator-applications?review=not-saved");
  revalidatePath("/admin");
  revalidatePath("/admin/creator-applications");
  revalidatePath("/sign-up");
  if (token) redirect("/admin/creator-applications?invitationId=" + encodeURIComponent(id) + "&token=" + encodeURIComponent(token));
  redirect("/admin/creator-applications?review=rejected");
}

export async function reviewExistingCreatorApplication(formData: FormData) {
  const { supabase } = await requireAdmin();
  const id = String(formData.get("userId") ?? "");
  const decision = String(formData.get("decision") ?? "");
  if (!/^[0-9a-f-]{36}$/i.test(id) || !["approved", "rejected"].includes(decision)) redirect("/admin/creator-applications");
  if (decision === "approved" && formData.get("identityVerified") !== "on") redirect("/admin/creator-applications?review=verification-required");

  // The RPC commits the application decision and creator role in one transaction.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: reviewed, error } = await (supabase as any).rpc("review_creator_application", {
    p_user_id: id,
    p_decision: decision,
    p_identity_verified: formData.get("identityVerified") === "on",
  });
  if (error || reviewed !== true) redirect("/admin/creator-applications?review=not-saved");

  revalidatePath("/admin");
  revalidatePath("/admin/creator-applications");
  revalidatePath("/account");
  revalidatePath("/creator/studio");
  redirect("/admin/creator-applications?review=" + decision);
}

export async function renewCreatorInvitation(formData: FormData) {
  const { supabase } = await requireAdmin();
  const id = String(formData.get("applicationId") ?? "");
  if (!/^[0-9a-f-]{36}$/i.test(id)) redirect("/admin/creator-applications");
  const token = randomBytes(32).toString("base64url");
  const tokenHash = createHash("sha256").update(token).digest("hex");
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data, error } = await (supabase as any).from("creator_preapplications").update({
    invite_token_hash: tokenHash,
    invite_token_expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
  }).eq("id", id).eq("status", "approved").select("id").maybeSingle();
  if (error || !data) redirect("/admin/creator-applications?review=not-saved");
  redirect("/admin/creator-applications?invitationId=" + encodeURIComponent(id) + "&token=" + encodeURIComponent(token));
}
