import Link from "next/link";
import { directWalletRoutes } from "@/lib/payments/direct-wallet-receivers";
import { DirectWalletOptions } from "@/components/payments/direct-wallet-options";

export const metadata = {
  title: "Donate to VIXEN",
  description: "Support VIXEN with a voluntary direct crypto contribution.",
};

export default function DonatePage() {
  return (
    <main>
      <header className="site-header">
        <Link className="brand" href="/" aria-label="VIXEN home">VIXEN<span aria-hidden="true">.</span></Link>
        <nav className="main-nav" aria-label="Main navigation">
          <Link href="/creators">Discover</Link>
          <Link href="/store">Store</Link>
          <Link href="/pricing">Memberships</Link>
        </nav>
        <div className="header-actions"><Link className="button button-small button-outline" href="/">Back to VIXEN</Link></div>
      </header>

      <section className="subpage-hero">
        <p className="eyebrow">SUPPORT VIXEN</p>
        <h1>Fuel the <span>movement.</span></h1>
        <p>Make a voluntary contribution using one of the supported wallet assets and networks.</p>
      </section>

      <section className="section-wrap subpage-content">
        <div className="crypto-payment-callout" role="note">
          <strong>Direct wallet donations · manual confirmation</strong>
          <p>Choose the exact asset and network, then copy its receive address. Donations are separate from purchases and do not unlock memberships, store items, creator content, or other paid access. This page does not issue an automatic receipt or payment confirmation.</p>
        </div>
        <DirectWalletOptions routes={directWalletRoutes} />
        <p className="center-action"><Link className="button button-outline" href="/crypto-payments/proof">Submit donation proof</Link></p>
        <p className="crypto-payment-footnote">Wallet transfers are generally irreversible. Verify the asset, network, and address in your wallet before sending. Never share your recovery phrase or private key.</p>
      </section>

      <footer className="site-footer"><div className="section-wrap footer-inner">
        <p>© {new Date().getFullYear()} VIXEN · Verified Interactive Xperience &amp; Entertainment Network</p>
        <div className="footer-links"><Link href="/crypto-payments">Crypto payments</Link><Link href="/about">About</Link><Link href="/privacy">Privacy</Link><Link href="/terms">Terms</Link></div>
        <small>Website Designed &amp; Developed by Nebula Interstellar Networking Economy LLC.</small>
      </div></footer>
      <style>{`.brand{font:800 24px var(--display);letter-spacing:.16em;color:#f5eff6}.brand span{color:var(--pink);text-shadow:0 0 16px rgba(255,22,136,.7)}.crypto-payment-callout{max-width:850px;margin:0 auto 24px;padding:20px 22px;border:1px solid rgba(255,184,84,.32);background:linear-gradient(110deg,rgba(88,53,14,.18),#100d12);color:#c9c0ca}.crypto-payment-callout strong{color:#ffd888;font:700 14px var(--display)}.crypto-payment-callout p{margin:7px 0 0;font-size:12px;line-height:1.75}.crypto-payment-footnote{max-width:740px;margin:24px auto 0;color:#928994;font-size:11px;line-height:1.7;text-align:center}`}</style>
    </main>
  );
}
