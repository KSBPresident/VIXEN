"use client";

type OAuthProvider = "google" | "apple" | "azure";
type SocialSignUpProps = { configured: boolean; nextPath?: string };

const providers: { id: OAuthProvider; label: string }[] = [
  { id: "google", label: "Google" },
  { id: "apple", label: "Apple" },
  { id: "azure", label: "Microsoft" },
];

export function SocialSignUp({ configured }: SocialSignUpProps) {
  return (
    <div>
      <div className="vixen-social-actions" aria-label="Social sign-in providers">
        {providers.map(({ id, label }) => (
          <button
            className="vixen-social-button"
            type="button"
            key={id}
            disabled
            aria-disabled="true"
            title={`${label} sign-in is not connected yet`}
          >
            <span>{label}</span>
            <span className="vixen-social-coming-soon">Coming soon</span>
          </button>
        ))}
      </div>
      <p className="vixen-social-feedback" role="status" aria-live="polite">
        {configured
          ? "Google, Apple, and Microsoft sign-in are not connected yet. Create your VIXEN account with email and password."
          : "Account sign-up will open here soon."}
      </p>
    </div>
  );
}
