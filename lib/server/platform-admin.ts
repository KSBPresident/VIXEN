import "server-only";
import type { User } from "@supabase/supabase-js";

/** Admin access comes only from trusted Supabase Auth app_metadata. */
export function isVixenPlatformAdmin(user: User | null | undefined): boolean {
  return Boolean(
    user &&
    user.email_confirmed_at &&
    user.app_metadata?.vixen_admin === true &&
    user.app_metadata?.role === "platform_admin"
  );
}
