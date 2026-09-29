import type { VerifiedPrincipal } from "./identity";

export const membershipTierRank = {
  free: 0,
  bronze: 1,
  silver: 2,
  gold: 3,
  elite: 4,
} as const;

export type MembershipTier = keyof typeof membershipTierRank;

export type AccessDenialReason =
  | "sign_in_required"
  | "account_unavailable"
  | "adult_verification_required"
  | "member_account_required"
  | "creator_scope_mismatch"
  | "membership_required"
  | "higher_tier_required"
  | "manager_audit_required"
  | "identity_unavailable"
  | "entitlement_unavailable"
  | "audit_unavailable";

export type ContentAccessDecision =
  | { allowed: true; reason: "creator_owner" | "member_entitlement" | "creator_manager_audited" }
  | { allowed: false; reason: AccessDenialReason };

export interface CreatorContentAccessRequest {
  principal: VerifiedPrincipal | null;
  creatorId: string;
  requiredTier: MembershipTier;
  memberTier: MembershipTier | null;
}

export function authorizeCreatorContent({
  principal,
  creatorId,
  requiredTier,
  memberTier,
}: CreatorContentAccessRequest): ContentAccessDecision {
  if (!principal) return { allowed: false, reason: "sign_in_required" };
  if (principal.accountState !== "active") return { allowed: false, reason: "account_unavailable" };
  if (!principal.adultVerified) return { allowed: false, reason: "adult_verification_required" };

  if (principal.role === "creator" && principal.creatorId === creatorId) {
    return { allowed: true, reason: "creator_owner" };
  }

  if (principal.role === "creator_manager") {
    return principal.managedCreatorIds?.includes(creatorId)
      ? { allowed: false, reason: "manager_audit_required" }
      : { allowed: false, reason: "creator_scope_mismatch" };
  }

  if (principal.role !== "member") {
    return { allowed: false, reason: "member_account_required" };
  }

  if (requiredTier === "free") {
    return { allowed: true, reason: "member_entitlement" };
  }

  if (!memberTier || memberTier === "free") {
    return { allowed: false, reason: "membership_required" };
  }

  if (membershipTierRank[memberTier] < membershipTierRank[requiredTier]) {
    return { allowed: false, reason: "higher_tier_required" };
  }

  return { allowed: true, reason: "member_entitlement" };
}
