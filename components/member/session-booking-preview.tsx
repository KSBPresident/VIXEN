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
  initialCreatorSlug?: string;
};

export function SessionBookingPreview({ creators, initialCreatorSlug }: SessionBookingPreviewProps) {
  const [activeCreatorSlug, setActiveCreatorSlug] = useState<string | null>(initialCreatorSlug ?? null);
  const flowRef = useRef<HTMLElement | null>(null);
  const triggerRef = useRef<HTMLButtonElement | null>(null);
  const [step, setStep] = useState<"details" | "checkout">("details");
  const activeCreator = creators.find((creator) => creator.slug === activeCreatorSlug);

  useEffect(() => {
    if (activeCreator && flowRef.current) flowRef.current.focus();
  }, [activeCreatorSlug, step, activeCreator]);

  function closePreview() {
    setActiveCreatorSlug(null);
    setStep("details");
    triggerRef.current?.focus();
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
            <h2>Private one-to-one video</h2>
            <p>{creator.intro}</p>
            <div className="session-preview-details" aria-label={`Illustrative session details for ${creator.name}`}>
              <span><strong>Call length</strong> {creator.sampleLength}</span>
              <span><strong>One-time price</strong> {creator.samplePrice} USD</span>
              <span><strong>Availability</strong> Live calendar not connected</span>
              <span><strong>Before you pay</strong> Final total and cancellation terms must be shown</span>
              <span><strong>Boundaries</strong> Creator sets the session scope; either person can stop at any time</span>
            </div>
            <button
              className="session-request-button session-preview-open"
              type="button"
              ref={activeCreatorSlug === creator.slug ? triggerRef : undefined}
              onClick={() => {
                triggerRef.current = document.activeElement instanceof HTMLButtonElement ? document.activeElement : null;
                setActiveCreatorSlug(creator.slug);
                setStep("details");
              }}
            >
              Review booking steps
            </button>
            <Link className="member-post-open" href={`/creators/${creator.slug}`}>View creator profile <span aria-hidden="true">↗</span></Link>
          </article>
        ))}
      </div>

      {activeCreator && (
        <section ref={flowRef} className="session-flow-preview" tabIndex={-1} aria-labelledby="session-flow-title">
          <div className="session-flow-heading">
            <div>
              <p className="member-eyebrow"><span /> PRIVATE CALL · PREVIEW · STEP {step === "details" ? "1" : "2"} OF 2</p>
              <h2 id="session-flow-title">{step === "details" ? "Review the call before booking." : "Review your one-time payment."}</h2>
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
                <div><dt>Call</dt><dd>Private one-to-one video · {activeCreator.sampleLength}</dd></div>
                <div><dt>One-time price</dt><dd>{activeCreator.samplePrice} USD · example only; separate from a creator subscription</dd></div>
                <div><dt>Choose a time</dt><dd>A live calendar must show the creator’s actual availability and your local time zone. No time is available to select in this preview.</dd></div>
                <div><dt>Final total</dt><dd>Any tax, currency conversion, or provider fee must be disclosed before a real payment is authorized.</dd></div>
                <div><dt>Cancellation and refunds</dt><dd>Final terms must be visible before checkout. They are not configured in this preview.</dd></div>
                <div><dt>Boundaries and consent</dt><dd>The creator defines what the call includes. Either participant can decline or end it; payment never implies consent beyond the agreed session.</dd></div>
                <div><dt>Camera and microphone</dt><dd>Your browser asks for permission only after you choose to enter an authorized live call.</dd></div>
              </dl>
              <div className="session-flow-actions">
                <button className="session-request-button session-preview-open" type="button" onClick={() => setStep("checkout")}>Continue to payment review</button>
                <p>Preview only. No date is selected and no time is held.</p>
              </div>
            </>
          ) : (
            <>
              <div className="session-flow-checkout">
                <p className="session-flow-checkout-label">ONE-TIME CALL · SAMPLE ORDER</p>
                <div><span>{activeCreator.name} · private video · {activeCreator.sampleLength}</span><strong>{activeCreator.samplePrice} USD</strong></div>
                <div><span>Taxes, conversion, and provider fees</span><strong>Not calculated</strong></div>
                <div><span>Amount authorized</span><strong>No charge</strong></div>
                <div><span>Payment service</span><strong>Not connected</strong></div>
                <div><span>NINE subscription benefit</span><strong>Does not apply to calls</strong></div>
                <div><span>Booking or call room</span><strong>Not created</strong></div>
              </div>
              <div className="interaction-status session-flow-notice" role="note">
                <span className="interaction-status-mark" aria-hidden="true">ⓘ</span>
                <span><strong>Paid calls are not active yet.</strong> This sample will not reserve creator time, charge a payment method, or start a video call. A payment provider and video service must be connected first.</span>
              </div>
              <div className="session-flow-actions">
                <button className="session-request-button session-preview-open" type="button" onClick={closePreview}>Finish preview</button>
                <button className="session-flow-back" type="button" onClick={() => setStep("details")}>Back to call details</button>
              </div>
            </>
          )}
        </section>
      )}
    </>
  );
}
