"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { isVixenPlatformAdmin } from "@/lib/server/platform-admin";

export async function reviewCreatorWithdrawal(formData: FormData) {
  const supabase = await createClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !isVixenPlatformAdmin(user)) redirect("/account");

  const id = String(formData.get("withdrawalId") ?? "");
  const status = String(formData.get("decision") ?? "");
  const adminNote = String(formData.get("adminNote") ?? "").trim();
  const payoutHash = String(formData.get("payoutTransactionHash") ?? "").trim();
  if (!/^[0-9a-f-]{36}$/i.test(id) || !["approved", "rejected", "paid"].includes(status) || adminNote.length > 500 || payoutHash.length > 180) {
    redirect("/admin/withdrawals");
  }
  if (status === "paid" && payoutHash.length < 8) redirect("/admin/withdrawals?review=missing-payout-reference");

  const reviewedAt = new Date().toISOString();
  const update = {
    status,
    admin_note: adminNote || null,
    reviewed_by: user.id,
    reviewed_at: reviewedAt,
    paid_at: status === "paid" ? reviewedAt : null,
    payout_transaction_hash: status === "paid" ? payoutHash : null,
  };
  const { data, error } = await supabase
    .from("creator_withdrawal_requests")
    .update(update)
    .eq("id", id)
    .in("status", ["pending", "approved"])
    .select("id")
    .maybeSingle();

  revalidatePath("/admin");
  revalidatePath("/admin/withdrawals");
  revalidatePath("/creator/earnings");
  if (error || !data) redirect("/admin/withdrawals?review=not-saved");
  redirect("/admin/withdrawals?review=saved");
}
