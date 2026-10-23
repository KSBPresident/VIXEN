import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { isVixenPlatformAdmin } from "@/lib/server/platform-admin";
import { saveStoreProduct } from "./actions";

export const dynamic = "force-dynamic";
export const metadata = { title: "Store listings · VIXEN", robots: { index: false, follow: false } };

type StoreProduct = {
  id: string;
  name: string;
  category: string;
  description: string;
  price_minor_units: number;
  currency: "USD" | "TTD";
  stock_quantity: number;
  fulfillment_details: string;
  return_policy: string;
  status: "draft" | "published" | "archived";
};

function ProductForm({ product }: { product?: StoreProduct }) {
  return (
    <form action={saveStoreProduct} className="store-admin-form">
      {product && <input type="hidden" name="productId" value={product.id} />}
      <label>Product name<input name="name" required minLength={3} maxLength={120} defaultValue={product?.name ?? ""} /></label>
      <label>Category<input name="category" required minLength={2} maxLength={80} defaultValue={product?.category ?? ""} /></label>
      <label>Description<textarea name="description" required minLength={10} maxLength={4000} defaultValue={product?.description ?? ""} /></label>
      <div className="store-admin-row">
        <label>Price<input name="price" required inputMode="decimal" pattern="(?:0|[1-9][0-9]{0,6})(?:\.[0-9]{1,2})?" placeholder="0.00" defaultValue={product ? (product.price_minor_units / 100).toFixed(2) : ""} /></label>
        <label>Currency<select name="currency" defaultValue={product?.currency ?? "TTD"}><option value="TTD">TTD</option><option value="USD">USD</option></select></label>
        <label>Stock quantity<input name="stockQuantity" type="number" required min={0} max={999999} step={1} defaultValue={product?.stock_quantity ?? 1} /></label>
      </div>
      <label>Shipping / fulfillment details<textarea name="fulfillmentDetails" required minLength={10} maxLength={2000} defaultValue={product?.fulfillment_details ?? ""} placeholder="How and where will this item be delivered?" /></label>
      <label>Returns / exchanges<textarea name="returnPolicy" required minLength={10} maxLength={2000} defaultValue={product?.return_policy ?? ""} placeholder="State the return or exchange terms clearly." /></label>
      <label>Listing status<select name="status" defaultValue={product?.status ?? "draft"}><option value="draft">Draft — only admin can see</option><option value="published">Published — visible in store</option><option value="archived">Archived — hidden from store</option></select></label>
      <button type="submit">{product ? "Save listing" : "Create listing"}</button>
    </form>
  );
}

export default async function AdminStorePage({ searchParams }: { searchParams: Promise<{ saved?: string; error?: string }> }) {
  const supabase = await createClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !isVixenPlatformAdmin(user)) redirect("/account");

  const { data: products, error } = await supabase.from("store_products")
    .select("id, name, category, description, price_minor_units, currency, stock_quantity, fulfillment_details, return_policy, status")
    .order("updated_at", { ascending: false })
    .limit(100);
  const params = await searchParams;

  return (
    <main className="vixen-home">
      <header className="vixen-account-topbar"><Link href="/">VIXEN</Link><nav><Link href="/admin">Admin console</Link><Link href="/store">Public store</Link></nav></header>
      <section className="vixen-account-content">
        <div className="vixen-account-panel">
          <p className="vixen-kicker">ADMIN-ONLY STORE PUBLISHING</p>
          <h1>Manage store listings</h1>
          <p>Only the configured VIXEN administrator can create or publish items. Add verified inventory and complete price, shipping, and return details before publishing. Store checkout is still coming soon.</p>
          {params.saved && <p role="status" className="store-admin-status">Listing saved.</p>}
          {params.error && <p role="alert" className="store-admin-error">The listing could not be saved. Check each field and try again.</p>}
          {error ? <div className="store-admin-error" role="alert"><strong>Store catalog is not ready.</strong><p>Confirm the administrator-only store migration is installed before managing listings.</p></div> : <>
            <h2>Create a listing</h2>
            <ProductForm />
            <h2>Existing listings</h2>
            {(products ?? []).length === 0 ? <p>No listings yet. New products start as drafts unless you choose to publish.</p> : <div className="store-admin-list">{products?.map((product) => <article className="store-admin-card" key={product.id}>
              <p className="vixen-kicker">{product.status.toUpperCase()} · {product.category}</p>
              <h3>{product.name}</h3>
              <ProductForm product={product} />
            </article>)}</div>}
          </>}
          <p><Link href="/admin">← Back to administrator console</Link></p>
        </div>
      </section>
      <style>{".store-admin-form{display:grid;gap:13px;margin:18px 0 30px}.store-admin-form label{display:grid;gap:6px;color:#d7ceda;font-size:12px}.store-admin-form input,.store-admin-form textarea,.store-admin-form select{min-height:42px;padding:10px;color:#fff;background:#09070a;border:1px solid rgba(255,255,255,.16);font:inherit}.store-admin-form textarea{min-height:90px;resize:vertical}.store-admin-row{display:grid;grid-template-columns:2fr 1fr 1fr;gap:12px}.store-admin-form button{min-height:44px;padding:0 18px;border:1px solid #ff1688;background:#bd0c68;color:#fff;font-weight:700;cursor:pointer}.store-admin-list{display:grid;gap:14px}.store-admin-card{padding:16px;border:1px solid rgba(255,255,255,.13);background:#100d12}.store-admin-status{color:#54dc9b}.store-admin-error{color:#ff9bbf}.store-admin-error p{margin:5px 0}@media(max-width:650px){.store-admin-row{grid-template-columns:1fr}.store-admin-form button{width:100%}}"}</style>
    </main>
  );
}
