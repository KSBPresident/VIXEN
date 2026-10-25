import "server-only";
import type { User } from "@supabase/supabase-js";
import { isConfiguredPlatformOwner } from "@/lib/kernel/identity";

const CONFIGURED_PLATFORM_OWNER_EMAILS = [
  "ishmealreyes@proton.me",
  "garvinfrancis@proton.me",
] as const;

/** Admin access is limited to confirmed accounts in the server-side owner allowlist. */
export function isVixenPlatformAdmin(user: User | null | undefined): boolean {
  if (!user) return false;

  const identity = {
    email: user.email,
    emailConfirmedAt: user.email_confirmed_at,
  };
  return CONFIGURED_PLATFORM_OWNER_EMAILS.some((email) =>
    isConfiguredPlatformOwner(identity, email),
  );
}
