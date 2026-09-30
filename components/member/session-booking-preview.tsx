"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";

type SessionCreator = {
  slug: string;
  name: string;
  initials: string;
  category: string;
  tone: string;
  intro: string;
  sampleLength: string;
  samplePrice: string;
};

type SessionBookingPreviewProps = {
  creators: SessionCreator[];
};

export function SessionBookingPreview({ creators }: SessionBookingPreviewProps) {
  const [activeCreatorSlug, setActiveCreatorSlug] = useState<string | null>(null);
  const flowRef = useRef<HTMLElement | null>(null);
  const triggerRef = useRef<HTMLButtonElement | null>(null);
  const [step, setStep] = useState<"details" | "checkout">("details");
  const activeCreator = creators.find((creator) => creator.slug === activeCreatorSlug);

  useEffect(() => {
    if (activeCreator && flowRef.current) flowRef.current.focus();
  }, [activeCreatorSlug, step]);

  function closePreview() {
    setActiveCreatorSlug(null);
    setStep("details");
  }

  return (
    <>
      <div className="session-preview-grid">
        {creators.map((creator) => (
          <article className="session-preview-card" key={creator.slug}>
            <div className="session-preview-creator">
              <span className={`member-avatar ${creator.tone}`}>{creator.initials}</span>
              <div><strong>{creator.name}</strong><small>{creator.category} · sample profile</small></div>
            </div>
            <h2>Private one-to-one session</h2>
            <p>{creator.intro}</p>
            <div className="session-preview-details" aria-label={`Illustrative session details for ${creator.name}`}>
              <span><strong>Example length</strong> {creator.sampleLength}</span>
              <span><strong>Example price</strong> {creator.samplePrice} USD</span>
              <span><strong>Availability</strong> No live calendar</span>
              <span><strong>Cancellation</strong> Policy not set; must be shown before a real booking</span>
              <span><strong>Boundaries</strong> Creator sets the session scope; either person can stop at any time</span>
            </div>
            <button
              className="session-request-button session-preview-open"
              type="button"
              onClick={() => {
                setActiveCreatorSlug(creator.slug);
                setStep("details");
              }}
            >
              Preview booking steps
            </button>
            <Link className="member-post-open" href={`/creators/${creator.slug}`}>View creator profile <span aria-hidden="true">↗</span></Link>
          </article>
        ))}
      </div>

      {activeCreator && (
        <section ref={flowRef} className="session-flow-preview" tabIndex={-1} aria-labelledby="session-flow-title">
          <div className="session-flow-heading">
            <div>
              <p className="member-eyebrow"><span /> BOOKING FLOW · PREVIEW · STEP {step === "details" ? "1" : "2"} OF 2</p>
              <h2 id="session-flow-title">{step === "details" ? "Review the session first." : "Checkout review preview."}</h2>
            </div>
            <button className="session-flow-close" type="button" onClick={closePreview}>Close preview</button>
          </div>

          <div className="session-flow-creator">
            <span className={`member-avatar ${activeCreator.tone}`}>{activeCreator.initials}</span>
            <div><strong>{activeCreator.name}</strong><small>Sample creator · no live availability</small></div>
          </div>

          {step === "details" ? (
            <>
              <dl className="session-flow-terms">
                <div><dt>Session</dt><dd>Private one-to-one video · {activeCreator.sampleLength}</dd></div>
                <div><dt>Example price</dt><dd>{activeCreator.samplePrice} USD · illustrative only</dd></div>
                <div><dt>Availability</dt><dd>No sample time is reserved. A live calendar must show the creator’s actual availability.</dd></div>
                <div><dt>Cancellation and refunds</dt><dd>VIXEN’s policy is not set yet. Final terms must be visible before a real checkout.</dd></div>
                <div><dt>Boundaries</dt><dd>The creator defines what the session includes. Either participant can decline or end it; a payment never implies consent to anything outside the agreed session.</dd></div>
                <div><dt>Device access</dt><dd>Your browser will request camera or microphone access only after you choose to enter an authorized live session.</dd></div>
              </dl>
              <div className="session-flow-actions">
                <button className="session-request-button session-preview-open" type="button" onClick={() => setStep("checkout")}>Continue to checkout preview</button>
                <p>Example only. No date is selected and no session is held.</p>
              </div>
            </>
          ) : (
            <>
              <div className="session-flow-checkout">
                <p className="session-flow-checkout-label">ORDER SUMMARY · SAMPLE</p>
                <div><span>{activeCreator.name} · {activeCreator.sampleLength}</span><strong>{activeCreator.samplePrice} USD</strong></div>
                <div><span>Taxes, fees, and final total</span><strong>Not calculated</strong></div>
                <div><span>Payment method</span><strong>Not connected</strong></div>\n                <div><span>NINE discount</span><strong>Creator subscriptions only</strong></div>
                <div><span>Cancellation policy</span><strong>Not set</strong></div>
              </div>
              <div className="interaction-status session-flow-notice" role="note">
                <span className="interaction-status-mark" aria-hidden="true">ⓘ</span>
                <span><strong>Checkout is not active.</strong> This sample flow will not create a booking, charge a payment method, reserve creator time, or start a video call.</span>
              </div>
              <div className="session-flow-actions">
                <button className="session-request-button session-preview-open" type="button" onClick={closePreview}>Finish preview</button>
                <button className="session-flow-back" type="button" onClick={() => setStep("details")}>Back to session details</button>
              </div>
            </>
          )}
        </section>
      )}
    </>
  );
}
