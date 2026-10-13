export type VixenRole = "member" | "creator" | "creator_manager" | "platform_admin";
export type AccountState = "active" | "suspended" | "closed";

/**
 * A server-verified account principal. Never construct this from form fields or
 * browser state; the identity adapter must derive it from a trusted session and
 * persisted, reviewed role records. The configured platform owner may be
 * resolved from a confirmed Supabase email plus a server-only allowlist.
 */
export interface VerifiedPrincipal {
  userId: string;
  role: VixenRole;
  accountState: AccountState;
  adultVerified: boolean;
  creatorId?: string;
  managedCreatorIds?: readonly string[];
}

export interface AuthenticatedEmailIdentity {
  email: string | null | undefined;
  emailConfirmedAt: string | null | undefined;
}

/** True only for the confirmed account named by the server-side owner allowlist. */
export function isConfiguredPlatformOwner(
  identity: AuthenticatedEmailIdentity,
  configuredOwnerEmail: string | undefined,
): boolean {
  const email = identity.email?.trim().toLowerCase();
  const ownerEmail = configuredOwnerEmail?.trim().toLowerCase();
  return Boolean(email && ownerEmail && identity.emailConfirmedAt && email === ownerEmail);
}
