export type VixenRole = "member" | "creator" | "creator_manager" | "platform_admin";
export type AccountState = "active" | "suspended" | "closed";

/**
 * A server-verified account principal. Never construct this from form fields or
 * browser state; the identity adapter must derive it from a trusted session and
 * persisted, reviewed role records.
 */
export interface VerifiedPrincipal {
  userId: string;
  role: VixenRole;
  accountState: AccountState;
  adultVerified: boolean;
  creatorId?: string;
  managedCreatorIds?: readonly string[];
}
