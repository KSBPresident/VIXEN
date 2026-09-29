"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";

const products = [
  { id: "aura-wave", name: "Aura Wave", category: "Massagers", price: 64, mark: "A", color: "rose", detail: "Quiet, body-safe silicone massager with a flexible shape and USB charging.", material: "Body-safe silicone · USB rechargeable" },
  { id: "pulse-mini", name: "Pulse Mini", category: "Massagers", price: 32, mark: "P", color: "plum", detail: "A compact, travel-friendly personal massager with a soft-touch finish.", material: "Body-safe silicone · Travel size" },
  { id: "duo-loop", name: "Duo Loop", category: "For couples", price: 48, mark: "D", color: "silver", detail: "A flexible, rechargeable couples’ accessory designed for shared discovery.", material: "Flexible silicone · USB rechargeable" },
  { id: "afterglow-robe", name: "Afterglow Robe", category: "Lingerie & apparel", price: 59, mark: "A", color: "wine", detail: "A smooth satin wrap robe with an adjustable waist tie.", material: "Satin-touch fabric · One size range" },
  { id: "midnight-lace", name: "Midnight Lace", category: "Lingerie & apparel", price: 46, mark: "M", color: "black", detail: "A refined lace bodysuit with adjustable straps and a soft lining.", material: "Stretch lace · Adjustable fit" },
  { id: "intimate-gel", name: "Silk Water-Based Gel", category: "Intimate care", price: 18, mark: "S", color: "pink", detail: "A simple, water-based personal lubricant made for everyday comfort.", material: "Water-based · 100 ml" },
  { id: "clean-care", name: "Clean Care", category: "Intimate care", price: 14, mark: "C", color: "silver", detail: "A gentle cleanser for reusable personal wellness products.", material: "Fragrance-free · 150 ml" },
  { id: "travel-pouch", name: "Private Carry Case", category: "Accessories", price: 22, mark: "V", color: "plum", detail: "A soft-lined zip case for keeping personal items together while traveling.", material: "Wipe-clean lining · Compact" },
] as const;

const categories = ["All items", "Massagers", "For couples", "Lingerie & apparel", "Intimate care", "Accessories"] as const;
type Category = (typeof categories)[number];
type Product = (typeof products)[number];

export function Storefront() {
  const [category, setCategory] = useState<Category>("All items");
  const [query, setQuery] = useState("");
  const [bag, setBag] = useState<Record<string, number>>({});
  const [bagOpen, setBagOpen] = useState(false);

  const visibleProducts = useMemo(() => {
    const term = query.trim().toLocaleLowerCase();
    return products.filter((product) => {
      const categoryMatches = category === "All items" || product.category === category;
      const queryMatches = !term || [product.name, product.category, product.detail, product.material].some((value) => value.toLocaleLowerCase().includes(term));
      return categoryMatches && queryMatches;
    });
  }, [category, query]);

  const bagItems = products.filter((product) => bag[product.id]);
  const count = Object.values(bag).reduce((sum, value) => sum + value, 0);
  const subtotal = bagItems.reduce((sum, product) => sum + product.price * bag[product.id], 0);
  const money = (amount: number) => new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(amount);

  function addToBag(product: Product) {
    setBag((current) => ({ ...current, [product.id]: (current[product.id] ?? 0) + 1 }));
  }

  function changeQuantity(productId: string, delta: number) {
    setBag((current) => {
      const quantity = (current[productId] ?? 0) + delta;
      const next = { ...current };
      if (quantity <= 0) delete next[productId];
      else next[productId] = quantity;
      return next;
    });
  }

  return (
    <main className="store-app">
      <header className="site-header store-header">
        <Link className="vixen-subpage-logo" href="/" aria-label="VIXEN home"><Image src="/assets/vixen-mark-3d.png" alt="" width={120} height={120} /></Link>
        <nav className="main-nav" aria-label="Main navigation">
          <Link href="/creators">Discover</Link>
          <Link href="/store" aria-current="page">Store</Link>
          <Link href="/pricing">Memberships</Link>
        </nav>
        <div className="header-actions">
          <button className="button button-small store-bag-button" type="button" onClick={() => setBagOpen((open) => !open)} aria-expanded={bagOpen} aria-controls="store-bag">
            Bag <span className="store-bag-count" aria-label={`${count} items`}>{count}</span>
          </button>
        </div>
      </header>

      <section className="store-welcome section-wrap">
        <div>
          <p className="eyebrow"><span className="store-age-mark">18+</span> VIXEN INTIMATE WELLNESS</p>
          <h1>Make room for <span>pleasure.</span></h1>
          <p>Discover thoughtfully chosen intimate wellness, lingerie, and care essentials—on your terms and with your privacy in mind.</p>
        </div>
        <aside className="store-promise">
          <span aria-hidden="true">✦</span>
          <strong>Adults only</strong>
          <small>For customers 18 years and older</small>
        </aside>
      </section>

      <section className="store-catalog section-wrap" aria-labelledby="store-catalog-title">
        <div className="store-toolbar">
          <div>
            <p className="eyebrow">THE VIXEN SHOP</p>
            <h2 id="store-catalog-title">Find your favorite.</h2>
          </div>
          <label className="store-search">
            <span className="visually-hidden">Search the store</span>
            <span aria-hidden="true">⌕</span>
            <input type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search products" />
          </label>
        </div>

        <div className="store-category-list" role="group" aria-label="Filter products by category">
          {categories.map((item) => (
            <button key={item} type="button" className={category === item ? "store-category is-active" : "store-category"} aria-pressed={category === item} onClick={() => setCategory(item)}>
              {item}
            </button>
          ))}
        </div>

        <p className="store-results" aria-live="polite">{visibleProducts.length} {visibleProducts.length === 1 ? "item" : "items"}</p>
        {visibleProducts.length ? (
          <div className="store-product-grid">
            {visibleProducts.map((product) => (
              <article className="store-product-card" key={product.id}>
                <div className={`store-product-art art-${product.color}`} aria-hidden="true">
                  <span className="store-product-monogram">{product.mark}</span>
                  <span className="store-product-glow" />
                  <span className="store-product-category">{product.category}</span>
                </div>
                <div className="store-product-info">
                  <div className="store-product-title-row"><h3>{product.name}</h3><strong>{money(product.price)}</strong></div>
                  <p>{product.detail}</p>
                  <small>{product.material}</small>
                  <button className="store-add-button" type="button" onClick={() => addToBag(product)}>
                    {bag[product.id] ? `Added · ${bag[product.id]}` : "Add to bag"} <span aria-hidden="true">＋</span>
                  </button>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="store-empty"><span aria-hidden="true">⌕</span><h3>No items match that search</h3><p>Try a different name or choose another category.</p><button type="button" className="store-category" onClick={() => { setQuery(""); setCategory("All items"); }}>Show all items</button></div>
        )}
      </section>

      <section className="store-care-note section-wrap">
        <div><p className="eyebrow">SHOP WITH CONFIDENCE</p><h2>Comfort. Care. Your choice.</h2></div>
        <p>Every item in this preview is described with its materials and intended use. Product details, availability, shipping, returns, and final prices will be confirmed before checkout is enabled.</p>
      </section>

      <section className="section-wrap store-payment-options" aria-labelledby="store-payment-title">
        <div>
          <p className="eyebrow">PAY YOUR WAY</p>
          <h2 id="store-payment-title">More ways to pay are planned.</h2>
          <p>Card, bank transfer, cryptocurrency, WiPay, PayPal, and Wise are planned options. What’s available may vary by country and order type; we’ll confirm options before checkout.</p>
        </div>
        <p className="payment-method-note">Checkout is not active in this preview. No orders or payments are processed.</p>
      </section>

      <footer className="site-footer"><div className="section-wrap footer-inner"><Link className="vixen-subpage-logo" href="/" aria-label="VIXEN home"><Image src="/assets/vixen-mark-3d.png" alt="" width={120} height={120} /></Link><p>Intimate wellness, on your terms.</p><div className="footer-links"><Link href="/creators">Discover</Link><Link href="/pricing">Memberships</Link><Link href="/sign-up">Join VIXEN</Link></div><small>© {new Date().getFullYear()} VIXEN. 18+ only. Store catalog preview. <span className="company-name">Verified Interactive Xperience &amp; Entertainment Network</span></small></div></footer>

      {bagOpen && (
        <div className="store-bag-backdrop" onClick={() => setBagOpen(false)}>
          <aside className="store-bag-panel" id="store-bag" role="dialog" aria-modal="true" aria-labelledby="store-bag-title" onClick={(event) => event.stopPropagation()}>
            <div className="store-bag-heading"><div><p className="eyebrow">YOUR SELECTION</p><h2 id="store-bag-title">Shopping bag <span>({count})</span></h2></div><button type="button" className="store-close-button" onClick={() => setBagOpen(false)} aria-label="Close shopping bag">×</button></div>
            {bagItems.length ? <div className="store-bag-items">{bagItems.map((product) => (
              <div className="store-bag-item" key={product.id}><div><strong>{product.name}</strong><small>{money(product.price)} each</small></div><div className="store-quantity"><button type="button" onClick={() => changeQuantity(product.id, -1)} aria-label={`Remove one ${product.name}`}>−</button><span>{bag[product.id]}</span><button type="button" onClick={() => changeQuantity(product.id, 1)} aria-label={`Add one ${product.name}`}>＋</button></div></div>
            ))}</div> : <div className="store-bag-empty"><span aria-hidden="true">♡</span><p>Your bag is waiting for something special.</p></div>}
            <div className="store-bag-total"><span>Preview subtotal</span><strong>{money(subtotal)}</strong></div>
            <p className="store-checkout-note">This is a demo bag. No order or payment is created.</p>
            <button className="button store-checkout-button" type="button" disabled>Checkout coming later</button>
          </aside>
        </div>
      )}
    </main>
  );
}
