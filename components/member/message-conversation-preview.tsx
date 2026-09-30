"use client";

import { useState, type FormEvent } from "react";

export function MessageConversationPreview() {
  const [draft, setDraft] = useState("");
  const [localMessage, setLocalMessage] = useState("");
  const [error, setError] = useState("");

  function previewDraft(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const message = draft.trim();
    if (!message) {
      setError("Enter a message to preview.");
      return;
    }

    setLocalMessage(message);
    setDraft("");
    setError("");
  }

  return (
    <div className="message-preview-conversation">
      <header>
        <span className="member-avatar rose">NL</span>
        <div><strong>Nova Luxe</strong><small>Example conversation · not a real message</small></div>
      </header>

      <div className="message-preview-bubbles" role="log" aria-label="Sample conversation and local draft preview" aria-live="polite">
        <p className="message-preview-bubble member">I enjoyed your latest studio update.<small>Example member message</small></p>
        <p className="message-preview-bubble">Thanks for checking it out ✨<small>Example creator reply</small></p>
        <p className="message-preview-bubble member">I’d love to hear about the creative process.<small>Example member message</small></p>
        {localMessage && (
          <div className="message-preview-local-draft">
            <p className="message-preview-bubble member">{localMessage}<small>Local draft preview · not sent</small></p>
            <button className="message-preview-remove" type="button" onClick={() => setLocalMessage("")}>Remove draft preview</button>
          </div>
        )}
      </div>

      <form className="message-preview-composer" aria-label="Local message draft preview" onSubmit={previewDraft}>
        <label className="visually-hidden" htmlFor="message-preview-input">Write a sample message draft</label>
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
          placeholder="Write a sample message — preview only"
          aria-describedby="message-preview-help message-preview-count"
        />
        <button type="submit">Preview draft</button>
        <p className="message-preview-composer-note" id="message-preview-help">This stays temporarily in this page’s browser memory. It is not sent, saved, or shown to a creator.</p>
        <p className="message-preview-char-count" id="message-preview-count" aria-live="polite">{draft.length}/500 characters</p>
        {error && <p className="message-preview-error" role="alert">{error}</p>}
      </form>
    </div>
  );
}
