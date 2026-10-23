"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { isVixenPlatformAdmin } from "@/lib/server/platform-admin";

export async function reviewCryptoPaymentProof(formData: FormData) {
  const supabase = await createClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user || !isVixenPlatformAdmin(user)) redirect("/account");

  const id = String(formData.get("proofId") ?? "");
  const status = String(formData.get("decision") ?? "");
  const adminNote = String(formData.get("adminNote") ?? "").trim();
  if (!/^[0-9a-f-]{36}$/i.test(id) || !["approved", "rejected"].includes(status) || adminNote.length > 500) {
    redirect("/admin/payment-proofs");
  }

  const { data, error } = await supabase
    .from("crypto_payment_proofs")
    .update({ status, admin_note: adminNote || null, reviewed_by: user.id, reviewed_at: new Date().toISOString() })
    .eq("id", id)
    .eq("status", "pending")
    .select("id")
    .maybeSingle();

  revalidatePath("/admin");
  revalidatePath("/admin/payment-proofs");
  revalidatePath("/creator/earnings");
  if (error || !data) redirect("/admin/payment-proofs?review=not-saved");
  redirect("/admin/payment-proofs?review=saved");
}
