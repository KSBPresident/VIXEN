export type CapabilityState = "preview" | "planned" | "active";

export interface CapabilityReadiness {
  state: CapabilityState;
  evidenceRequired: string;
}

/**
 * TOP / Executive OS release registry. A capability may be shown as active
 * only after its evidence requirements are met; current records are honest
 * about integrations deliberately deferred from the website-first phase.
 */
type CapabilityId =
  | "memberExperience"
  | "creatorStudio"
  | "paidMemberships"
  | "creatorPayouts"
  | "supabase"
  | "n8n";

export const platformReadiness: Record<CapabilityId, CapabilityReadiness> = {
  memberExperience: {
    state: "preview",
    evidenceRequired: "Production authentication and a verified end-to-end member journey",
  },
  creatorStudio: {
    state: "planned",
    evidenceRequired: "Verified creator onboarding, role enforcement, and publishing checks",
  },
  paidMemberships: {
    state: "preview",
    evidenceRequired: "Configured payment processing, entitlement enforcement, and tested cancellation/refund handling",
  },
  creatorPayouts: {
    state: "planned",
    evidenceRequired: "Approved creator terms, payout provider, reconciliation, and operational controls",
  },
  supabase: {
    state: "planned",
    evidenceRequired: "Approved schema, migrations, row-level security, and production configuration",
  },
  n8n: {
    state: "planned",
    evidenceRequired: "Approved workflow manifest, authenticated triggers, and end-to-end verification",
  },
} as const satisfies Record<string, CapabilityReadiness>;

export function isCapabilityActive(capability: CapabilityId): boolean {
  return platformReadiness[capability].state === "active";
}
