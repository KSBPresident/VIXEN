"use client";

import { useState } from "react";

export function CopyCreatorInvite({ href }: { href: string }) {
  const [copied, setCopied] = useState(false);
  async function copy() {
    try {
      await navigator.clipboard.writeText(href);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  }
  return <div className="creator-invite-copy"><input aria-label="One-time creator account link" readOnly value={href} onFocus={(event) => event.currentTarget.select()} /><button type="button" onClick={copy}>{copied ? "Copied" : "Copy account link"}</button></div>;
}
