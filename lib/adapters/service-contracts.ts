import type { AuditEvent } from "../kernel/audit";
import type { MembershipTier } from "../kernel/content-access";
import type { VerifiedPrincipal } from "../kernel/identity";
import type { PrivateVideoBooking } from "../kernel/private-video-session";

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

export interface PrivateVideoBookingRepository {
  findBooking(input: { bookingId: string }): Promise<AdapterResult<{ booking: PrivateVideoBooking | null }>>;
}

/** Issues participant-bound, short-lived credentials only; never expose provider admin keys. */
export interface PrivateVideoRoomAdapter {
  issueJoinCredential(input: {
    sessionId: string;
    creatorId: string;
    participantId: string;
    participant: "member" | "creator";
  }): Promise<AdapterResult<{ credential: string; expiresAt: number }>>;
}

export interface AutomationAdapter {
  dispatch(input: {
    trigger: string;
    eventId: string;
    payload: Record<string, unknown>;
  }): Promise<AdapterResult<{ accepted: boolean }>>;
}
