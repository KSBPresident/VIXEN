/**
 * Back OS contracts only. No provider is connected by this file.
 * Implementations belong behind these interfaces and must keep credentials
 * server-side while returning normalized errors to Middle OS workflows.
 */
export type AdapterResult<T> =
  | { ok: true; value: T }
  | { ok: false; code: string; message: string; retryable: boolean };

export interface IdentityAdapter {
  verifyRequestIdentity(request: Request): Promise<AdapterResult<{ userId: string }>>;
}

export interface MembershipRepository {
  findMemberEntitlement(input: {
    memberId: string;
    creatorId: string;
    tierId: string;
  }): Promise<AdapterResult<{ active: boolean }>>;
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
