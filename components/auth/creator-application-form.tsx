"use client";

import { useState, type FormEvent } from "react";
import { createClient } from "@/lib/supabase/client";

export function CreatorApplicationForm({ configured }: { configured: boolean }) {
  const [email, setEmail] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [bio, setBio] = useState("");
  const [adultWoman, setAdultWoman] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState(false);
  const [pending, setPending] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("");
    setError(false);
    if (!configured) {
      setError(true);
      setMessage("VIXEN applications are unavailable until its account service is configured.");
      return;
    }
    if (!adultWoman || !termsAccepted) {
      setError(true);
      setMessage("Confirm the age and creator policy requirements before applying.");
      return;
    }

    setPending(true);
    try {
      const supabase = createClient();
      const { error: insertError } = await (supabase as any).from("creator_preapplications").insert({
        email: email.trim().toLowerCase(),
        display_name: displayName.trim(),
        bio: bio.trim(),
        applicant_is_adult_woman: adultWoman,
        accepts_creator_terms: termsAccepted,
      });
      if (insertError) {
        if (insertError.code === "23505") {
          setMessage("An application for that email is already pending or approved. Check your inbox or contact VIXEN support.");
        } else {
          throw insertError;
        }
        setError(true);
        return;
      }
      setEmail("");
      setDisplayName("");
      setBio("");
      setAdultWoman(false);
      setTermsAccepted(false);
      setMessage("Application submitted. An administrator must review it before you can create a creator account. Do not send identity documents by email or chat.");
    } catch {
      setError(true);
      setMessage("We couldn’t submit your application. Check your details and try again.");
    } finally {
      setPending(false);
    }
  }

  return (
    <form className="creator-preapplication-form vixen-email-form" onSubmit={submit}>
      <label htmlFor="creator-application-email">Email address</label>
      <input id="creator-application-email" name="email" type="email" autoComplete="email" maxLength={320} required value={email} onChange={(event) => setEmail(event.target.value)} placeholder="you@example.com" />
      <label htmlFor="creator-application-name">Creator or stage name</label>
      <input id="creator-application-name" name="displayName" maxLength={80} required value={displayName} onChange={(event) => setDisplayName(event.target.value)} placeholder="The name members will know" />
      <label htmlFor="creator-application-bio">What do you plan to create?</label>
      <textarea id="creator-application-bio" name="bio" rows={4} maxLength={500} value={bio} onChange={(event) => setBio(event.target.value)} placeholder="Tell the review team about your creator page." />
      <label className="vixen-age-confirmation">
        <input type="checkbox" required checked={adultWoman} onChange={(event) => setAdultWoman(event.target.checked)} />
        <span>I am a woman aged 18 or older and can complete VIXEN’s required identity and age review.</span>
      </label>
      <label className="vixen-age-confirmation">
        <input type="checkbox" required checked={termsAccepted} onChange={(event) => setTermsAccepted(event.target.checked)} />
        <span>I will only publish content I own or am authorized to share, and will ensure everyone depicted is an adult who gave informed consent.</span>
      </label>
      <p className="creator-application-privacy">Your application is private and reviewed by VIXEN administrators. Do not upload or email IDs, selfies, bank details, tax numbers, or recovery phrases.</p>
      <button className="vixen-email-submit" type="submit" disabled={!configured || pending}>{pending ? "Submitting…" : "Submit creator application"}</button>
      <p className={`vixen-email-feedback${error ? " is-error" : ""}`} role={error ? "alert" : "status"} aria-live="polite">{message || (!configured ? "Creator applications are currently unavailable." : "")}</p>
      <style>{".creator-application-privacy{color:#aaa2ad;font-size:12px;line-height:1.6}.creator-preapplication-form textarea{min-height:100px;padding:12px;color:#fff;background:#09070a;border:1px solid rgba(255,255,255,.16);font:inherit;resize:vertical}"}</style>
    </form>
  );
}
