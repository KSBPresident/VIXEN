import type { AuditEvent } from "@/lib/kernel/audit";
import type { MembershipTier } from "@/lib/kernel/content-access";
import type { VerifiedPrincipal } from "@/lib/kernel/identity";

export type AdapterResult<T> =
  | { ok: true; value: T }
  | { ok: false; code: string; message: string; retryable: boolean };

/** Back OS ports only; no service provider is connected yet. */
export interface IdentityAdapter {
  verifyRequestIdentity(request: Request): Promise<AdapterResult<{ principal: VerifiedPrincipal | null }>>;
}

export interface MembershipRepository {
  findActiveTier(input: { memberId: string; creatorId: string }): Promise<AdapterResult<{ tier: MembershipTier | null }>>;
}

export interface AuditWriter {
  record(event: AuditEvent): Promise<AdapterResult<{ recorded: true }>>;
}

export interface PaymentAdapter {
  createCheckout(input: {
    memberId: string;
    creatorId: string;
    tierId: string;
    amountMinorUnits: number;
    currency: string;
    idempotencyKey: string;
  }): Promise<AdapterResult<{ checkoutUrl: string }>>;
}

export interface AutomationAdapter {
  dispatch(input: {
    trigger: string;
    eventId: string;
    payload: Record<string, unknown>;
  }): Promise<AdapterResult<{ accepted: boolean }>>;
}
