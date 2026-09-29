"use client";

import { FormEvent, useState } from "react";
import { createClient } from "@/lib/supabase/client";

type EmailAccountAccessProps = {
  configured: boolean;
  nextPath?: string;
};

export function EmailAccountAccess({ configured, nextPath = "/account" }: EmailAccountAccessProps) {
  const [mode, setMode] = useState<"create" | "sign-in">("create");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [pending, setPending] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("");
    setError(false);
    if (!configured) {
      setError(true);
      setMessage("VIXEN account service is not connected yet. Your email and password have not been sent.");
      return;
    }

    setPending(true);
    try {
      const supabase = createClient();
      if (mode === "create") {
        const callback = new URL("/auth/callback", window.location.origin);
        callback.searchParams.set("next", nextPath);
        const { data, error: authError } = await supabase.auth.signUp({
          email: email.trim(),
          password,
          options: { emailRedirectTo: callback.toString() },
        });
        if (authError) throw authError;
        if (data.session) {
          window.location.assign(nextPath);
          return;
        }
        setMessage("Check your inbox to confirm your VIXEN account, then sign in.");
      } else {
        const { error: authError } = await supabase.auth.signInWithPassword({
          email: email.trim(),
          password,
        });
        if (authError) throw authError;
        window.location.assign(nextPath);
        return;
      }
    } catch {
      setError(true);
      setMessage(mode === "create"
        ? "We couldn’t create that account. Check the details or try signing in if you already registered."
        : "We couldn’t sign you in with those details. Check your email and password and try again.");
    } finally {
      setPending(false);
    }
  }

  return (
    <section className="vixen-email-access" aria-label="Email account access">
      <div className="vixen-email-mode" role="group" aria-label="Account action">
        <button type="button" aria-pressed={mode === "create"} onClick={() => { setMode("create"); setMessage(""); }}>
          Create account
        </button>
        <button type="button" aria-pressed={mode === "sign-in"} onClick={() => { setMode("sign-in"); setMessage(""); }}>
          Sign in
        </button>
      </div>
      <form className="vixen-email-form" onSubmit={submit}>
        <label htmlFor="vixen-email">Email address</label>
        <input id="vixen-email" name="email" type="email" autoComplete="email" required value={email} onChange={(event) => setEmail(event.target.value)} placeholder="you@proton.me" />
        <label htmlFor="vixen-password">{mode === "create" ? "Create a VIXEN password" : "VIXEN password"}</label>
        <input id="vixen-password" name="password" type="password" autoComplete={mode === "create" ? "new-password" : "current-password"} minLength={8} required value={password} onChange={(event) => setPassword(event.target.value)} />
        <p className="vixen-proton-note">Proton Mail addresses are welcome. Create a separate VIXEN password; never enter your Proton password.</p>
        <button className="vixen-email-submit" type="submit" disabled={!configured || pending}>
          {pending ? "Please wait…" : mode === "create" ? "Create free account" : "Sign in to VIXEN"}
        </button>
        <p className={`vixen-email-feedback${error ? " is-error" : ""}`} role={error ? "alert" : "status"} aria-live="polite">
          {message || (!configured ? "Sign-up and sign-in will activate when VIXEN’s own Supabase Auth project is connected." : "")}
        </p>
      </form>
    </section>
  );
}
