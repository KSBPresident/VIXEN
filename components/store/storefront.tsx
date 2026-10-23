import Image from "next/image";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

function formatPrice(currency: string, minorUnits: number) {
  return new Intl.NumberFormat("en-TT", { style: "currency", currency }).format(minorUnits / 100);
}

export async function Storefront() {
  const supabase = await createClient();
  const { data: products, error } = await supabase
    .from("store_products")
    .select("id, name, category, description, price_minor_units, currency, stock_quantity, fulfillment_details, return_policy")
    .eq("status", "published")
    .order("updated_at", { ascending: false });

  return (
    <main className="store-app">
      <header className="site-header store-header">
        <Link className="vixen-subpage-logo" href="/" aria-label="VIXEN home"><Image src="/assets/vixen-mark-3d.png" alt="" width={120} height={120} /></Link>
        <nav className="main-nav" aria-label="Main navigation"><Link href="/creators">Discover</Link><Link href="/store" aria-current="page">Store</Link><Link href="/pricing">Memberships</Link></nav>
        <div className="header-actions"><Link className="button button-small button-outline" href="/account">My account</Link></div>
      </header>

      <section className="store-welcome section-wrap">
        <div><p className="eyebrow"><span className="store-age-mark">18+</span> VIXEN STORE</p><h1>Your space for <span>discovery.</span></h1><p>Store listings are published by VIXEN administrators after inventory, price, shipping, and return details are confirmed.</p></div>
        <aside className="store-promise"><span aria-hidden="true">✦</span><strong>{error ? "Catalog unavailable" : products?.length ? "Verified listings" : "Coming soon"}</strong><small>{error ? "Please check back later" : products?.length ? `${products.length} item${products.length === 1 ? "" : "s"} currently listed` : "No products are listed for sale yet"}</small></aside>
      </section>

      <section className="store-catalog section-wrap" aria-labelledby="store-catalog-title">
        <div className="store-toolbar"><div><p className="eyebrow">THE VIXEN STORE</p><h2 id="store-catalog-title">Verified listings</h2></div></div>
        {error ? <div className="store-empty"><h3>Store listings could not load.</h3><p>The catalog is temporarily unavailable. Try again later.</p></div>
          : products?.length ? <div className="store-product-grid">{products.map((product) => (
            <article className="store-product-card" key={product.id}>
              <p className="eyebrow">{product.category}</p>
              <h3>{product.name}</h3>
              <p>{product.description}</p>
              <strong className="store-product-price">{formatPrice(product.currency, product.price_minor_units)}</strong>
              <dl className="store-product-details">
                <div><dt>Availability</dt><dd>{product.stock_quantity} in stock</dd></div>
                <div><dt>Fulfillment</dt><dd>{product.fulfillment_details}</dd></div>
                <div><dt>Returns</dt><dd>{product.return_policy}</dd></div>
              </dl>
              <p className="store-product-checkout">Checkout is coming soon. Contact VIXEN to arrange an order before sending payment.</p>
            </article>
          ))}</div>
          : <div className="store-empty"><span aria-hidden="true">⌕</span><h3>No verified items for sale yet</h3><p>Only VIXEN administrators can publish store items. Products appear here after real inventory and fulfillment details are confirmed.</p></div>}
      </section>

      <section className="store-care-note section-wrap"><div><p className="eyebrow">SHOP WITH CONFIDENCE</p><h2>Clear details before checkout.</h2></div><p>Product availability, exact price, payment methods, shipping, returns, and final order total must be clear before an order is placed.</p></section>

      <section className="section-wrap store-payment-options" aria-labelledby="store-payment-title">
        <div><p className="eyebrow">PAY YOUR WAY</p><h2 id="store-payment-title">Crypto receive options</h2><p>USDT, USDC, and TRX wallet transfers are available for manually arranged orders. Contact VIXEN first for an exact order total and reference; sending funds alone does not place an order or unlock a product.</p><p><Link className="button button-outline" href="/crypto-payments">View supported assets and networks</Link></p></div>
        <p className="payment-method-note">Store checkout is not active. Order fulfillment is arranged manually with VIXEN.</p>
      </section>

      <footer className="site-footer"><div className="section-wrap footer-inner"><Link className="vixen-subpage-logo" href="/" aria-label="VIXEN home"><Image src="/assets/vixen-mark-3d.png" alt="" width={120} height={120} /></Link><p>Intimate wellness, on your terms.</p><div className="footer-links"><Link href="/creators">Discover</Link><Link href="/pricing">Memberships</Link><Link href="/crypto-payments">Crypto payments</Link></div><small>© {new Date().getFullYear()} VIXEN. Store products require administrator approval.</small></div></footer>
      <style>{".store-product-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,260px),1fr));gap:16px}.store-product-card{padding:20px;border:1px solid rgba(255,255,255,.14);background:#100d12}.store-product-card h3{margin:6px 0;font-size:21px}.store-product-card>p:not(.eyebrow){color:#b9b0bd;line-height:1.6}.store-product-price{display:block;margin:18px 0;color:#ff58a8;font-size:24px}.store-product-details{display:grid;gap:10px;margin:18px 0}.store-product-details div{display:grid;grid-template-columns:100px 1fr;gap:12px}.store-product-details dt{color:#a99eac}.store-product-details dd{margin:0;line-height:1.5}.store-product-checkout{margin:0;padding-top:14px;border-top:1px solid rgba(255,255,255,.12);font-size:12px;color:#d2c8d6}"}</style>
    </main>
  );
}
