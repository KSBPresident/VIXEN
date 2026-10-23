"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { isVixenPlatformAdmin } from "@/lib/server/platform-admin";
import { validateStoreProductInput } from "@/lib/store-os/product-input";

export async function saveStoreProduct(formData: FormData) {
  const supabase = await createClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user || !isVixenPlatformAdmin(user)) redirect("/account");

  const productId = String(formData.get("productId") ?? "").trim();
  if (productId && !/^[0-9a-f-]{36}$/i.test(productId)) redirect("/admin/store?error=invalid");
  const parsed = validateStoreProductInput({
    name: String(formData.get("name") ?? ""),
    category: String(formData.get("category") ?? ""),
    description: String(formData.get("description") ?? ""),
    price: String(formData.get("price") ?? ""),
    currency: String(formData.get("currency") ?? ""),
    stockQuantity: String(formData.get("stockQuantity") ?? ""),
    fulfillmentDetails: String(formData.get("fulfillmentDetails") ?? ""),
    returnPolicy: String(formData.get("returnPolicy") ?? ""),
    status: String(formData.get("status") ?? ""),
  });
  if (!parsed.ok) redirect("/admin/store?error=invalid");

  const { value } = parsed;
  const saved = productId
    ? await supabase.from("store_products").update({ ...value, updated_at: new Date().toISOString() }).eq("id", productId).select("id").maybeSingle()
    : await supabase.from("store_products").insert({ ...value, created_by: user.id }).select("id").maybeSingle();

  if (saved.error || !saved.data) redirect("/admin/store?error=save");
  revalidatePath("/store");
  revalidatePath("/admin");
  revalidatePath("/admin/store");
  redirect("/admin/store?saved=1");
}
