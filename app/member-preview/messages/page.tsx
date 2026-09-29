import Image from "next/image";
import Link from "next/link";
import "../member-preview.css";
import "../member-interactions.css";
import "../member-search.css";

export const metadata = {
  title: "Messages preview",
  description: "Preview the planned browser-based VIXEN member messaging experience.",
  robots: { index: false, follow: false },
};

export default function MemberMessagesPreviewPage() {
  return (
    <main className="member-app">
      <header className="member-topbar">
        <Link href="/" className="member-brand" aria-label="VIXEN home">
          <Image src="/assets/vixen-mark-3d.png" alt="" width={62} height={62} priority />
          <span>VIXEN</span>
        </Link>
        <form className="member-search" action="/creators" role="search" aria-label="Search creators"><span aria-hidden="true">⌕</span><label className="visually-hidden" htmlFor="member-creator-search">Search creators and interests</label><input id="member-creator-search" type="search" name="q" placeholder="Search creators and interests" /><button type="submit" aria-label="Search creators">↵</button></form>
        <div className="member-top-actions"><span className="member-preview-pill"><i /> PREVIEW</span><Link href="/sign-up?type=member">Create free account <b aria-hidden="true">↗</b></Link></div>
      </header>

      <div className="member-shell">
        <aside className="member-sidebar" aria-label="Member app navigation">
          <p className="member-sidebar-label">YOUR VIXEN</p>
          <Link className="member-nav-item" href="/member-preview"><span>▦</span> For you</Link>
          <Link className="member-nav-item" href="/creators"><span>⌕</span> Discover creators</Link>
          <Link className="member-nav-item" href="/pricing"><span>◇</span> Memberships</Link>
          <Link className="member-nav-item" href="/member-preview/sessions"><span>◉</span> Private video</Link>
          <Link className="interaction-sidebar-link" href="/member-preview/messages" aria-current="page"><span>✉</span> Messages</Link>
          <Link className="member-nav-item" href="/store"><span>⌑</span> Store</Link>
          <div className="member-sidebar-card"><span className="member-sidebar-spark">✦</span><strong>Your VIXEN account</strong><p>Real messaging will be available after member accounts are connected.</p><Link href="/sign-up?type=member">Join free <span aria-hidden="true">→</span></Link></div>
          <div className="member-sidebar-foot"><span>Adults 18+ only</span><span>Verified Interactive Xperience &amp; Entertainment Network</span></div>
        </aside>

        <section className="member-main interaction-workspace" aria-labelledby="messages-heading">
          <header>
            <p className="member-eyebrow"><span /> MEMBER APP · PREVIEW</p>
            <h1 className="interaction-page-title" id="messages-heading">Messages</h1>
            <p className="interaction-page-intro">A private place for members and creators to talk inside VIXEN.</p>
          </header>
          <div className="interaction-status" role="note"><span className="interaction-status-mark" aria-hidden="true">ⓘ</span><span><strong>Preview only.</strong> The conversation shown is fictional sample content. Messaging, delivery, paid messages, and notifications are not connected.</span></div>

          <section className="message-preview-grid" aria-label="Illustrative messaging interface">
            <div className="message-preview-contacts">
              <h2>Creator conversations</h2>
              <Link className="message-preview-contact is-selected" href="/creators/nova-luxe">
                <span className="member-avatar rose">NL</span><span><strong>Nova Luxe</strong><small>Sample conversation · Preview</small></span>
              </Link>
              <Link className="message-preview-contact" href="/creators/vee-saint">
                <span className="member-avatar silver">VS</span><span><strong>Vee Saint</strong><small>Sample profile · Preview</small></span>
              </Link>
              <Link className="message-preview-contact" href="/creators/kira-moss">
                <span className="member-avatar violet">KM</span><span><strong>Kira Moss</strong><small>Sample profile · Preview</small></span>
              </Link>
            </div>
            <div className="message-preview-conversation">
              <header><span className="member-avatar rose">NL</span><div><strong>Nova Luxe</strong><small>Example conversation · not a real message</small></div></header>
              <div className="message-preview-bubbles">
                <p className="message-preview-bubble member">I enjoyed your latest studio update.<small>Example member message</small></p>
                <p className="message-preview-bubble">Thanks for checking it out ✨<small>Example creator reply</small></p>
                <p className="message-preview-bubble member">I’d love to hear about the creative process.<small>Example member message</small></p>
              </div>
              <form className="message-preview-composer" aria-label="Message composer preview">
                <label className="visually-hidden" htmlFor="message-preview-input">Write a message</label>
                <input id="message-preview-input" type="text" placeholder="Messaging will open when accounts are connected" disabled />
                <button type="button" disabled aria-disabled="true">Send</button>
              </form>
            </div>
          </section>
        </section>

        <aside className="member-right-rail" aria-label="Messaging and sessions">
          <section className="member-rail-card"><p className="member-eyebrow">PRIVATE VIDEO</p><h2>Meet face to face.</h2><p>Creators will be able to offer private browser-based video sessions with clear availability, length, price, and boundaries.</p><Link href="/member-preview/sessions">Preview private sessions <span aria-hidden="true">→</span></Link></section>
          <section className="member-rail-card member-tier-card"><p className="member-eyebrow">YOUR CONTROL</p><h2>Choose your conversations.</h2><p>Creator reply expectations, paid-message prices, privacy, and reporting tools must be clear before messaging opens.</p><Link href="/pricing">Review membership details <span aria-hidden="true">→</span></Link></section>
          <p className="member-rail-foot">All profiles and example messages on this preview are illustrative, not real creator communications.</p>
        </aside>
      </div>

      <nav className="member-mobile-nav" aria-label="Member app navigation"><Link href="/member-preview"><span>▦</span>Home</Link><Link href="/creators"><span>⌕</span>Discover</Link><Link href="/member-preview/messages" aria-current="page"><span>✉</span>Messages</Link><Link href="/member-preview/sessions"><span>◉</span>Video</Link></nav>
    </main>
  );
}
