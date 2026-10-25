import "server-only";
import type { User } from "@supabase/supabase-js";
import { isConfiguredPlatformOwner } from "@/lib/kernel/identity";

const CONFIGURED_PLATFORM_OWNER_EMAIL = "ishmealreyes@proton.me";

/** Admin access is limited to the confirmed owner account in the server allowlist. */
export function isVixenPlatformAdmin(user: User | null | undefined): boolean {
  if (!user) return false;

  return isConfiguredPlatformOwner({
    email: user.email,
    emailConfirmedAt: user.email_confirmed_at,
  }, CONFIGURED_PLATFORM_OWNER_EMAIL);
}
