import Link from "next/link";

export const metadata = { title: "Privacy · VIXEN", description: "How VIXEN handles account and payment review information." };

export default function PrivacyPage() {
  return (
    <main>
      <header className="site-header"><Link className="brand" href="/">VIXEN.</Link><nav className="main-nav" aria-label="Main navigation"><Link href="/creators">Discover</Link><Link href="/pricing">Memberships</Link><Link href="/store">Store</Link></nav></header>
      <section className="subpage-hero"><p className="eyebrow">YOUR INFORMATION</p><h1>Privacy at <span>VIXEN.</span></h1><p>This page describes the current preview’s data practices. It is not a substitute for the full privacy notice that must be published before paid services launch.</p></section>
      <section className="section-wrap subpage-content">
        <h2>Account information</h2><p>VIXEN uses Supabase authentication and stores account details needed to provide sign-in and profile features. Public creator profile information is visible to visitors when a creator profile is approved and published.</p>
        <h2>Payment evidence</h2><p>Signed-in members can submit a screenshot and transaction reference for a manually arranged crypto transfer. Accepted proof images are stored in private storage and available to the VIXEN administrator for review. Upload only the payment evidence requested; never upload recovery phrases, private keys, or unrelated account information. A screenshot alone does not confirm settlement, create an order, or unlock access.</p>
        <h2>Current service status</h2><p>VIXEN displays wallet receive addresses and accepts payment-proof submissions for manual review. It does not automatically monitor blockchains, create orders, confirm settlement, or unlock purchases. Paid memberships, store checkout, creator feed publishing, messaging, and private video remain unavailable or in preview.</p>
        <h2>Questions and requests</h2><p>Contact VIXEN through the support channel listed on the service. Before launch, VIXEN must publish complete details on retention, deletion, processors, user rights, and jurisdiction-specific privacy requirements.</p>
        <p><Link href="/terms">Read the service terms →</Link></p>
      </section>
    </main>
  );
}
