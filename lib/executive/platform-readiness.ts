export type CapabilityState = "preview" | "planned" | "active";

export interface CapabilityReadiness {
  state: CapabilityState;
  requiredEvidence: readonly string[];
}

type CapabilityId =
  | "memberExperience"
  | "creatorStudio"
  | "paidMemberships"
  | "creatorPayouts"
  | "contentAccess"
  | "privateVideoSessions"
  | "creatorManagement"
  | "auditTrail"
  | "supabase"
  | "n8n";

export const platformReadiness: Record<CapabilityId, CapabilityReadiness> = {
  memberExperience: {
    state: "preview",
    requiredEvidence: ["production authentication", "verified end-to-end member journey"],
  },
  creatorStudio: {
    state: "planned",
    requiredEvidence: ["verified creator onboarding", "server-enforced creator role", "publishing checks"],
  },
  paidMemberships: {
    state: "preview",
    requiredEvidence: ["configured payment processing", "Kernel entitlement enforcement", "tested cancellation and refund handling"],
  },
  creatorPayouts: {
    state: "planned",
    requiredEvidence: ["approved creator terms", "payout provider", "reconciliation and operational controls"],
  },
  privateVideoSessions: {
    state: "planned",
    requiredEvidence: [
      "verified payment confirmation and refund handling",
      "authenticated signaling with short-lived room credentials",
      "durable creator opt-in and booking records",
      "device QA on iOS Safari, Android browsers, and Windows browsers",
      "consent, moderation, privacy, and incident workflows",
    ],
  },
  contentAccess: {
    state: "planned",
    requiredEvidence: ["trusted identity and adult-verification source", "active entitlement store", "server route enforcement"],
  },
  creatorManagement: {
    state: "planned",
    requiredEvidence: ["verified manager identity", "scoped roster permissions", "durable audit records"],
  },
  auditTrail: {
    state: "planned",
    requiredEvidence: ["durable append-only audit adapter", "retention policy", "admin review workflow"],
  },
  supabase: {
    state: "planned",
    requiredEvidence: ["approved schema and migrations", "row-level security", "production configuration"],
  },
  n8n: {
    state: "planned",
    requiredEvidence: ["approved workflow manifest", "authenticated triggers", "end-to-end verification"],
  },
};

export type CapabilityIdKey = keyof typeof platformReadiness;

export function evaluateCapabilityActivation(
  capability: CapabilityIdKey,
  verifiedEvidence: readonly string[],
): { eligible: boolean; missingEvidence: readonly string[] } {
  const missingEvidence = platformReadiness[capability].requiredEvidence.filter(
    (item) => !verifiedEvidence.includes(item),
  );

  return { eligible: missingEvidence.length === 0, missingEvidence };
}

export function isCapabilityActive(capability: CapabilityIdKey): boolean {
  return platformReadiness[capability].state === "active";
}
