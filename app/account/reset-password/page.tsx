// cspell:ignore Freset
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";
export const metadata = {
  title: "Reset your password",
  robots: { index: false, follow: false },
};

type ResetPasswordPageProps = {
  searchParams: Promise<{ error?: string; updated?: string }>;
};

async function updatePassword(formData: FormData) {
  "use server";

  const password = String(formData.get("password") ?? "");
  const confirmPassword = String(formData.get("confirmPassword") ?? "");
  if (password.length < 8) redirect("/account/reset-password?error=short");
  if (password !== confirmPassword) redirect("/account/reset-password?error=mismatch");

  const supabase = await createClient();
  const { data: { user }, error: userError } = await supabase.auth.getUser();
  if (userError || !user) redirect("/sign-up?type=member&next=%2Faccount%2Freset-password");

  const { error } = await supabase.auth.updateUser({ password });
  if (error) redirect("/account/reset-password?error=update");
  redirect("/account/reset-password?updated=1");
}

export default async function ResetPasswordPage({ searchParams }: ResetPasswordPageProps) {
  const params = await searchParams;
  const supabase = await createClient();
  const { data: { user }, error } = await supabase.auth.getUser();
  if (error || !user) redirect("/sign-up?type=member&next=%2Faccount%2Freset-password");

  const errorMessage = params.error === "mismatch"
    ? "Those passwords don’t match. Try again."
    : params.error === "short"
      ? "Use a password with at least 8 characters."
      : params.error === "update"
        ? "We couldn’t update your password. Request a new reset link and try again."
        : "";

  return (
    <main className="vixen-home">
      <header className="vixen-account-topbar">
        <Link href="/" aria-label="VIXEN home">
          <Image src="/assets/vixen-mark-3d.png" alt="VIXEN emblem" width={200} height={200} priority />
        </Link>
      </header>
      <section className="vixen-account-content">
        <div className="vixen-account-panel">
          <p className="vixen-kicker">SECURE ACCOUNT ACCESS</p>
          {params.updated === "1" ? (
            <>
              <h1>Password updated.</h1>
              <p role="status">Your VIXEN password has been changed.</p>
              <p><Link className="vixen-discover-link" href="/account">Return to your account <span aria-hidden="true">→</span></Link></p>
            </>
          ) : (
            <>
              <h1>Choose a new password.</h1>
              <p>Set a new password for your VIXEN account. This page is available only through a valid signed-in recovery session.</p>
              {errorMessage && <p className="vixen-auth-alert" role="alert">{errorMessage}</p>}
              <form action={updatePassword} className="vixen-email-form">
                <label htmlFor="new-password">New VIXEN password</label>
                <input id="new-password" name="password" type="password" autoComplete="new-password" minLength={8} required />
                <label htmlFor="confirm-password">Confirm new password</label>
                <input id="confirm-password" name="confirmPassword" type="password" autoComplete="new-password" minLength={8} required />
                <button className="vixen-email-submit" type="submit">Update password</button>
              </form>
            </>
          )}
        </div>
      </section>
    </main>
  );
}
