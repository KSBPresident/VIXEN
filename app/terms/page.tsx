import Link from "next/link";

export const metadata = { title: "Terms · VIXEN", description: "Current access and feature status for the VIXEN web app." };

export default function TermsPage() {
  return (
    <main>
      <header className="site-header"><Link className="brand" href="/">VIXEN.</Link><nav className="main-nav" aria-label="Main navigation"><Link href="/creators">Discover</Link><Link href="/pricing">Memberships</Link><Link href="/store">Store</Link></nav></header>
      <section className="subpage-hero"><p className="eyebrow">SERVICE INFORMATION</p><h1>VIXEN service <span>terms.</span></h1><p>This preview explains current feature status and access boundaries. Full service terms must be published and accepted before paid services launch.</p></section>
      <section className="section-wrap subpage-content">
        <h2>Age and accounts</h2><p>VIXEN is intended for adults aged 18 and over. Keep your login credentials private and provide accurate information. Creator accounts are separate and require review before creator features can be enabled.</p>
        <h2>Creator content and permissions</h2><p>Creators are responsible for content they submit and must have the rights and permissions needed to publish it. Content must comply with applicable law and VIXEN’s safety and consent rules. No content involving minors or non-consensual material is allowed.</p>
        <h2>Payments and balances</h2><p>Payment options shown as previews are not necessarily available for checkout. Direct wallet transfers require independent transaction verification; uploading a screenshot does not itself confirm settlement or unlock a purchase. Creator balances and withdrawals are subject to the displayed review process and final terms.</p>
        <h2>Feature availability</h2><p>Account access may be active while paid memberships, store checkout, messaging, private video, creator publishing, and event services remain unavailable or in preview. Do not rely on preview screens as an offer to purchase.</p>
        <h2>Before paid launch</h2><p>VIXEN will publish complete terms covering prices, renewals, refunds, cancellations, content rules, account suspension, payment disputes, and dispute resolution before accepting payment for services.</p>
        <p><Link href="/privacy">Read the privacy information →</Link></p>
      </section>
    </main>
  );
}
