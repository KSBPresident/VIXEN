import Link from "next/link";
import { directWalletRoutes } from "@/lib/payments/direct-wallet-receivers";
import { DirectWalletOptions } from "@/components/payments/direct-wallet-options";

export const metadata = {
  title: "Crypto receive options · VIXEN",
  description: "VIXEN direct wallet receive addresses for USDT, USDC, and TRX.",
  robots: { index: false, follow: false },
};

export default function CryptoPaymentsPage() {
  return (
    <main>
      <header className="site-header">
        <Link className="wordmark" href="/" aria-label="VIXEN home"><span className="wordmark-v">V</span>IXEN<span className="wordmark-dot">.</span></Link>
        <nav className="main-nav" aria-label="Main navigation">
          <Link href="/creators">Discover</Link>
          <Link href="/store">Store</Link>
          <Link href="/pricing">Memberships</Link>
        </nav>
        <div className="header-actions"><Link className="button button-small button-outline" href="/">Back to VIXEN</Link></div>
      </header>

      <section className="subpage-hero">
        <p className="eyebrow">DIRECT WALLET · CRYPTO</p>
        <h1>Pay with <span>crypto.</span></h1>
        <p>Choose the exact asset and network from the receive options provided by VIXEN.</p>
      </section>

      <section className="section-wrap subpage-content">
        <div className="crypto-payment-callout" role="note">
          <strong>Manual payment setup — no automatic checkout yet.</strong>
          <p>Only send funds after VIXEN gives you an exact order total and confirms this payment method for that order. Payments are not matched to orders, credited, or fulfilled automatically by this page. Keep your transaction ID and wait for manual confirmation before expecting delivery or access.</p>
        </div>
        <DirectWalletOptions routes={directWalletRoutes} />
        <p className="crypto-payment-footnote">Wallet transfers are generally irreversible. Verify the asset, network, address, and amount in your wallet before sending. VIXEN never needs your wallet password, recovery phrase, or private key.</p>
        <p className="center-action"><Link className="button button-outline" href="/pricing">Review memberships</Link></p>
      </section>

      <footer className="site-footer"><div className="section-wrap footer-inner">
        <p>© VIXEN · Verified Interactive Xperience &amp; Entertainment Network</p>
        <div className="footer-links"><Link href="/about">About</Link><Link href="/privacy">Privacy</Link><Link href="/terms">Terms</Link></div>
        <small>Website Designed &amp; Developed by Nebula Interstellar Networking Economy LLC.</small>
      </div></footer>
      <style>{`.crypto-payment-callout{max-width:850px;margin:0 auto 24px;padding:20px 22px;border:1px solid rgba(255,184,84,.32);background:linear-gradient(110deg,rgba(88,53,14,.18),#100d12);color:#c9c0ca}.crypto-payment-callout strong{color:#ffd888;font:700 14px var(--display)}.crypto-payment-callout p{margin:7px 0 0;font-size:12px;line-height:1.75}.crypto-payment-footnote{max-width:740px;margin:24px auto 0;color:#928994;font-size:11px;line-height:1.7;text-align:center}.crypto-payment-footnote+.center-action{margin-top:22px}`}</style>
    </main>
  );
}
