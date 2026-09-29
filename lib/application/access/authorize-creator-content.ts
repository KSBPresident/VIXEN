import {
  authorizeCreatorContent,
  type ContentAccessDecision,
  type MembershipTier,
} from "@/lib/kernel/content-access";
import type { VerifiedPrincipal } from "@/lib/kernel/identity";
import type {
  AdapterResult,
  AuditWriter,
  IdentityAdapter,
  MembershipRepository,
} from "@/lib/adapters/service-contracts";

export interface CreatorContentAccessDependencies {
  identity: IdentityAdapter;
  memberships: MembershipRepository;
  audit: AuditWriter;
}

/**
 * MIDDLE OS access workflow. Identity, creator role, age verification, and
 * membership level come only from trusted Back OS adapters. Manager access is
 * denied unless its audit event has been durably recorded.
 */
export async function authorizeCreatorContentRequest(
  input: { request: Request; creatorId: string; requiredTier: MembershipTier },
  dependencies: CreatorContentAccessDependencies,
): Promise<ContentAccessDecision> {
  const identity = await dependencies.identity.verifyRequestIdentity(input.request);
  if (!identity.ok) return { allowed: false, reason: "sign_in_required" };

  const principal = identity.value.principal as VerifiedPrincipal | null;
  let memberTier: MembershipTier | null = null;

  if (principal?.role === "member" && input.requiredTier !== "free") {
    const membership = await dependencies.memberships.findActiveTier({
      memberId: principal.userId,
      creatorId: input.creatorId,
    });
    if (!membership.ok) return { allowed: false, reason: "membership_required" };
    memberTier = membership.value.tier;
  }

  const decision = authorizeCreatorContent({
    principal,
    creatorId: input.creatorId,
    requiredTier: input.requiredTier,
    memberTier,
  });

  if (decision.reason !== "manager_audit_required" || !principal) return decision;

  const audit = await dependencies.audit.record({
    eventName: "creator.content.viewed_by_manager",
    actorId: principal.userId,
    targetType: "creator",
    targetId: input.creatorId,
    details: { requiredTier: input.requiredTier },
  });

  if (!audit.ok) return { allowed: false, reason: "manager_audit_required" };
  return { allowed: true, reason: "creator_manager_audited" };
}

export type AccessAdapterFailure = AdapterResult<never>;
