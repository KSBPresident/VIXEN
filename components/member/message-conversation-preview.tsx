"use client";

import { useState, type FormEvent } from "react";

const sampleMessages = [
  { id: "member-1", side: "member", text: "I enjoyed your latest studio update.", label: "Example member message" },
  { id: "creator-1", side: "creator", text: "Thank you for being here. I have a new behind-the-scenes set ready for members.", label: "Example creator reply" },
];

export function MessageConversationPreview() {
  const [draft, setDraft] = useState("");
  const [localMessages, setLocalMessages] = useState<string[]>([]);
  const [notice, setNotice] = useState("");
  const [error, setError] = useState("");

  function previewDraft(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const message = draft.trim();
    if (!message) {
      setError("Enter a message to preview.");
      return;
    }

    setLocalMessages((messages) => [...messages, message]);
    setDraft("");
    setError("");
    setNotice("Preview only: this message stays in this browser and was not sent or saved.");
  }

  return (
    <div className="message-preview-conversation">
      <header>
        <span className="member-avatar rose">NL</span>
        <div><strong>Nova Luxe</strong><small>Sample creator · Preview conversation</small></div>
        <button className="message-conversation-menu" type="button" disabled aria-label="Conversation options unavailable in preview">•••</button>
      </header>

      <div className="message-preview-bubbles" role="log" aria-label="Illustrative conversation preview" aria-live="polite">
        {sampleMessages.map((message) => (
          <p className={`message-preview-bubble ${message.side === "member" ? "member" : ""}`} key={message.id}>
            {message.text}<small>{message.label} · Sample</small>
          </p>
        ))}

        <article className="message-paid-preview">
          <div className="message-paid-preview-lock" aria-hidden="true">▣</div>
          <div className="message-paid-preview-copy">
            <strong>Locked creator message</strong>
            <p>Creators can offer a photo or video with a clear price and preview before a member chooses to unlock it.</p>
            <small>Illustrative feature · No media or payment is connected</small>
          </div>
          <button type="button" onClick={() => setNotice("Preview only: paid unlocks are not active. No charge was made.")}>
            Preview unlock
          </button>
        </article>

        {localMessages.map((message, index) => (
          <p className="message-preview-bubble member" key={`local-${index}`}>
            {message}<small>Local preview · Not sent</small>
          </p>
        ))}
      </div>

      <div className="message-preview-actions" aria-label="Preview messaging actions">
        <button type="button" disabled title="Media uploads are not connected">＋ Add media <span>Coming soon</span></button>
        <button type="button" disabled title="Tips are not connected">♡ Send a tip <span>Coming soon</span></button>
      </div>

      <form className="message-preview-composer" aria-label="Local message draft preview" onSubmit={previewDraft}>
        <label className="visually-hidden" htmlFor="message-preview-input">Write a message preview</label>
        <textarea
          id="message-preview-input"
          name="message"
          rows={2}
          maxLength={500}
          value={draft}
          onChange={(event) => {
            setDraft(event.target.value);
            if (error) setError("");
          }}
          placeholder="Write a message…"
          aria-describedby="message-preview-help message-preview-count"
        />
        <button type="submit">Preview message</button>
        <p className="message-preview-composer-note" id="message-preview-help">Member-to-creator messages, paid unlocks, and media delivery will be available when messaging is connected.</p>
        <p className="message-preview-char-count" id="message-preview-count" aria-live="polite">{draft.length}/500 characters</p>
        {error && <p className="message-preview-error" role="alert">{error}</p>}
        {notice && <p className="message-preview-notice" role="status" aria-live="polite">{notice}</p>}
      </form>
    </div>
  );
}
