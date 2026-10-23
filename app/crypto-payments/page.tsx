import Link from "next/link";
import { directWalletRoutes } from "@/lib/payments/direct-wallet-receivers";
import { DirectWalletOptions } from "@/components/payments/direct-wallet-options";

export const metadata = {
  title: "Crypto receive options · VIXEN",
  description: "VIXEN manual-review crypto receive routes for USDT, USDC, and TRX.",
  robots: { index: false, follow: false },
};

export default function CryptoPaymentsPage() {
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
        <p className="eyebrow">DIRECT WALLET · CRYPTO</p>
        <h1>Pay with <span>crypto.</span></h1>
        <p>Choose an available wallet route and use its exact asset and network. Other assets are shown as coming soon until their complete payment and payout flows are ready.</p>
      </section>

      <section className="section-wrap subpage-content">
        <div className="crypto-payment-callout" role="note">
          <strong>USDT, USDC, and TRX transfers are available for manual review.</strong>
          <p>Ask VIXEN for an exact order total and confirm the selected asset/network before sending. USDT, USDC, and TRX routes can currently be submitted as payment proof. Other assets remain coming soon while their proof, balance-accounting, and payout flows are prepared. Transfers are not matched automatically; VIXEN must verify the transaction and manually provide the purchase. Keep your transaction ID.</p>
        </div>
        <DirectWalletOptions routes={directWalletRoutes} />
        <p className="center-action"><Link className="button" href="/crypto-payments/proof">Submit payment proof</Link></p>
        <p className="crypto-payment-footnote">Wallet transfers are generally irreversible. Verify the asset, network, address, and amount in your wallet before sending. VIXEN never needs your wallet password, recovery phrase, or private key.</p>
        <p className="center-action"><Link className="button button-outline" href="/pricing">Review memberships</Link> <Link className="button" href="/donate">Donate to VIXEN</Link></p>
      </section>

      <footer className="site-footer"><div className="section-wrap footer-inner">
        <p>© VIXEN · Verified Interactive Xperience &amp; Entertainment Network</p>
        <div className="footer-links"><Link href="/donate">Donate</Link><Link href="/about">About</Link><Link href="/privacy">Privacy</Link><Link href="/terms">Terms</Link></div>
        <small>Website Designed &amp; Developed by Nebula Interstellar Networking Economy LLC.</small>
      </div></footer>
      <style>{`.brand{font:800 24px var(--display);letter-spacing:.16em;color:#f5eff6}.brand span{color:var(--pink);text-shadow:0 0 16px rgba(255,22,136,.7)}.crypto-payment-callout{max-width:850px;margin:0 auto 24px;padding:20px 22px;border:1px solid rgba(255,184,84,.32);background:linear-gradient(110deg,rgba(88,53,14,.18),#100d12);color:#c9c0ca}.crypto-payment-callout strong{color:#ffd888;font:700 14px var(--display)}.crypto-payment-callout p{margin:7px 0 0;font-size:12px;line-height:1.75}.crypto-payment-footnote{max-width:740px;margin:24px auto 0;color:#928994;font-size:11px;line-height:1.7;text-align:center}.crypto-payment-footnote+.center-action{margin-top:22px}`}</style>
    </main>
  );
}
