import Image from "next/image";
import Link from "next/link";

export function Storefront() {
  return (
    <main className="store-app">
      <header className="site-header store-header">
        <Link className="vixen-subpage-logo" href="/" aria-label="VIXEN home"><Image src="/assets/vixen-mark-3d.png" alt="" width={120} height={120} /></Link>
        <nav className="main-nav" aria-label="Main navigation"><Link href="/creators">Discover</Link><Link href="/store" aria-current="page">Store</Link><Link href="/pricing">Memberships</Link></nav>
        <div className="header-actions"><Link className="button button-small button-outline" href="/account">My account</Link></div>
      </header>

      <section className="store-welcome section-wrap">
        <div><p className="eyebrow"><span className="store-age-mark">18+</span> VIXEN STORE</p><h1>Your space for <span>discovery.</span></h1><p>The VIXEN Store will list real products after sellers, stock, prices, shipping, and returns are confirmed.</p></div>
        <aside className="store-promise"><span aria-hidden="true">✦</span><strong>Coming soon</strong><small>No products are listed for sale yet</small></aside>
      </section>

      <section className="store-catalog section-wrap" aria-labelledby="store-catalog-title">
        <div className="store-toolbar"><div><p className="eyebrow">THE VIXEN STORE</p><h2 id="store-catalog-title">Verified listings</h2></div></div>
        <div className="store-empty"><span aria-hidden="true">⌕</span><h3>No verified items for sale yet</h3><p>We removed illustrative products and prices. Items will appear once VIXEN has real listings with confirmed inventory and fulfillment details.</p></div>
      </section>

      <section className="store-care-note section-wrap"><div><p className="eyebrow">SHOP WITH CONFIDENCE</p><h2>Clear details before checkout.</h2></div><p>Product availability, seller, exact price, payment methods, shipping, returns, and final order total must be clear before an order is placed.</p></section>

      <section className="section-wrap store-payment-options" aria-labelledby="store-payment-title">
        <div><p className="eyebrow">PAY YOUR WAY</p><h2 id="store-payment-title">Crypto receive options</h2><p>USDT, USDC, and TRX wallet transfers are available for manually arranged orders. Contact VIXEN first for an exact order total and reference; sending funds alone does not place an order or unlock a product.</p><p><Link className="button button-outline" href="/crypto-payments">View supported assets and networks</Link></p></div>
        <p className="payment-method-note">Store checkout is not active because there are no verified listings yet.</p>
      </section>

      <footer className="site-footer"><div className="section-wrap footer-inner"><Link className="vixen-subpage-logo" href="/" aria-label="VIXEN home"><Image src="/assets/vixen-mark-3d.png" alt="" width={120} height={120} /></Link><p>Intimate wellness, on your terms.</p><div className="footer-links"><Link href="/creators">Discover</Link><Link href="/pricing">Memberships</Link><Link href="/crypto-payments">Crypto payments</Link></div><small>© {new Date().getFullYear()} VIXEN. No listings are available for purchase.</small></div></footer>
    </main>
  );
}
