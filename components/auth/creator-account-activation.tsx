"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export function CreatorAccountActivation({ applicationId, token, configured }: { applicationId: string; token: string; configured: boolean }) {
  const router = useRouter();
  const claimPath = "/creator/setup?application=" + encodeURIComponent(applicationId) + "&token=" + encodeURIComponent(token);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [adultConfirmed, setAdultConfirmed] = useState(false);
  const [pending, setPending] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("");
    setError(false);
    if (!configured) {
      setError(true);
      setMessage("VIXEN account service is not configured.");
      return;
    }
    if (!adultConfirmed) {
      setError(true);
      setMessage("Confirm that you are at least 18 years old.");
      return;
    }

    setPending(true);
    try {
      const supabase = createClient();
      const callback = new URL("/auth/callback", window.location.origin);
      callback.searchParams.set("next", claimPath);
      const { data, error: signUpError } = await supabase.auth.signUp({
        email: email.trim().toLowerCase(),
        password,
        options: { emailRedirectTo: callback.toString(), data: { vixen_account_type: "member" } },
      });
      if (signUpError) throw signUpError;
      if (data.session) {
        router.push(claimPath);
        return;
      }
      setMessage("Check your email and follow the confirmation link to activate your approved creator account. Use the same email that received the invitation.");
    } catch (err) {
      setError(true);
      const code = err && typeof err === "object" ? (err as { code?: string }).code : "";
      setMessage(code === "user_already_exists"
        ? "That email already has a VIXEN login. Sign out, then contact VIXEN admin so the approved invitation can be linked safely."
        : "We couldn’t create the account. Check the invitation email, password, and try again.");
    } finally {
      setPending(false);
    }
  }

  return <form className="vixen-email-form creator-activation-form" onSubmit={submit}>
    <label htmlFor="creator-activation-email">Invited email address</label>
    <input id="creator-activation-email" type="email" autoComplete="email" required maxLength={320} value={email} onChange={(event) => setEmail(event.target.value)} />
    <label htmlFor="creator-activation-password">Create your VIXEN password</label>
    <input id="creator-activation-password" type="password" autoComplete="new-password" minLength={8} required value={password} onChange={(event) => setPassword(event.target.value)} />
    <label className="vixen-age-confirmation"><input type="checkbox" required checked={adultConfirmed} onChange={(event) => setAdultConfirmed(event.target.checked)} /><span>I confirm I am 18 or older.</span></label>
    <button className="vixen-email-submit" disabled={!configured || pending}>{pending ? "Creating account…" : "Create approved creator account"}</button>
    <p className={error ? "vixen-email-feedback is-error" : "vixen-email-feedback"} role={error ? "alert" : "status"} aria-live="polite">{message || (!configured ? "Creator account activation is unavailable." : "Your email must match the application approved by VIXEN.")}</p>
    <p className="vixen-auth-caption">Already have a VIXEN account? <a href={"/sign-up?type=member&mode=signin&next=" + encodeURIComponent(claimPath)}>Sign in with the invited email to activate this approval.</a></p>
  </form>;
}
