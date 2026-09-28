"use client";

import { createBrowserClient } from "@supabase/ssr";
import { useState } from "react";

type OAuthProvider = "google" | "apple" | "azure";
type SocialSignUpProps = { configured: boolean; nextPath?: string };

const providers: { id: OAuthProvider; label: string }[] = [
  { id: "google", label: "Continue with Google" },
  { id: "apple", label: "Continue with Apple" },
  { id: "azure", label: "Continue with Microsoft" },
];

function ProviderMark({ provider }: { provider: OAuthProvider }) {
  if (provider === "google") {
    return <svg viewBox="0 0 48 48" aria-hidden="true"><path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5Z"/><path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94a11.1 11.1 0 0 1-4.8 7.28l7.74 6C44.39 38.09 47 31.9 47 24.55Z"/><path fill="#FBBC05" d="M10.53 28.59A14.4 14.4 0 0 1 9.75 24c0-1.59.27-3.13.76-4.59l-7.98-6.19A23.9 23.9 0 0 0 0 24c0 3.87.93 7.53 2.56 10.78l7.97-6.19Z"/><path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.91-5.7l-7.74-6c-2.15 1.45-4.9 2.3-8.17 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48Z"/></svg>;
  }
  if (provider === "apple") {
    return <svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M16.37 12.34c.02 2.2 1.93 2.94 1.95 2.95-.02.05-.3 1.03-.99 2.05-.6.89-1.22 1.77-2.2 1.79-.96.02-1.27-.58-2.37-.58s-1.45.56-2.36.6c-.95.03-1.68-.96-2.29-1.84-1.25-1.8-2.2-5.08-.92-7.3.64-1.1 1.78-1.8 3.02-1.82.94-.02 1.82.64 2.39.64.57 0 1.64-.79 2.77-.67.47.02 1.8.19 2.65 1.44-.07.05-1.58.92-1.65 2.74ZM14.56 6.98c.5-.6.84-1.44.75-2.28-.72.03-1.59.48-2.1 1.08-.46.53-.87 1.39-.76 2.21.8.06 1.61-.41 2.11-1.01Z"/></svg>;
  }
  return <svg viewBox="0 0 24 24" aria-hidden="true"><path fill="#F25022" d="M1 1h10v10H1z"/><path fill="#7FBA00" d="M13 1h10v10H13z"/><path fill="#00A4EF" d="M1 13h10v10H1z"/><path fill="#FFB900" d="M13 13h10v10H13z"/></svg>;
}

export function SocialSignUp({ configured, nextPath = "/account" }: SocialSignUpProps) {
  const [pendingProvider, setPendingProvider] = useState<OAuthProvider | null>(null);
  const [message, setMessage] = useState("");

  async function signUp(provider: OAuthProvider) {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    if (!url || !key) {
      setMessage("Account sign-up isn’t available just yet. Please try again soon.");
      return;
    }

    setMessage("");
    setPendingProvider(provider);
    try {
      const supabase = createBrowserClient(url, key);
      const callback = new URL("/auth/callback", window.location.origin);
      callback.searchParams.set("next", nextPath);
      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: { redirectTo: callback.toString() },
      });
      if (error) throw error;
    } catch {
      setMessage("That sign-up option isn’t available right now. Please try another or come back soon.");
      setPendingProvider(null);
    }
  }

  return (
    <div>
      <div className="vixen-social-actions">
        {providers.map(({ id, label }) => (
          <button className="vixen-social-button" type="button" key={id} disabled={!configured || pendingProvider !== null} onClick={() => signUp(id)}>
            <ProviderMark provider={id} />
            <span>{pendingProvider === id ? "Connecting…" : label}</span>
          </button>
        ))}
      </div>
      <p className="vixen-social-feedback" role="status" aria-live="polite">
        {message || (!configured ? "Account sign-up will open here soon." : "")}
      </p>
    </div>
  );
}
