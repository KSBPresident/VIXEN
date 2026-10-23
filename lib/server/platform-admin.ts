import "server-only";
import type { User } from "@supabase/supabase-js";
import { isConfiguredPlatformAdmin } from "@/lib/kernel/identity";

const CONFIGURED_PLATFORM_OWNER_EMAIL = "ishmealreyes@proton.me";

/** Admin access requires the trusted Auth flag and the confirmed owner email. */
export function isVixenPlatformAdmin(user: User | null | undefined): boolean {
  if (!user) return false;

  return isConfiguredPlatformAdmin({
    email: user.email,
    emailConfirmedAt: user.email_confirmed_at,
    trustedAdminFlag: user.app_metadata?.vixen_admin,
  }, CONFIGURED_PLATFORM_OWNER_EMAIL);
}
