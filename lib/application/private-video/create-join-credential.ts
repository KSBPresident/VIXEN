import type { AdapterResult, AuditWriter, IdentityAdapter, PrivateVideoBookingRepository, PrivateVideoRoomAdapter } from "../../adapters/service-contracts";
import { authorizePrivateVideoJoin } from "../../kernel/private-video-session";

export type PrivateVideoJoinWorkflowResult =
  | { ok: true; value: { bookingId: string; creatorId: string; credential: string; expiresAt: number } }
  | {
      ok: false;
      code: "identity_unavailable" | "booking_unavailable" | "access_denied" | "audit_unavailable" | "room_unavailable";
    };

export interface PrivateVideoJoinDependencies {
  identity: IdentityAdapter;
  bookings: PrivateVideoBookingRepository;
  rooms: PrivateVideoRoomAdapter;
  audit: AuditWriter;
  now?: () => number;
}

function fail<T>(code: string, message: string, retryable = false): AdapterResult<T> {
  return { ok: false, code, message, retryable };
}

/**
 * MIDDLE OS join flow. It loads the booking from trusted storage, checks the
 * Kernel policy, durably audits the authorized attempt, and only then requests
 * a short-lived room credential. It never handles browser camera permission.
 */
export async function createPrivateVideoJoinCredential(
  input: { request: Request; bookingId: string },
  dependencies: PrivateVideoJoinDependencies,
): Promise<PrivateVideoJoinWorkflowResult> {
  const identity = await dependencies.identity.verifyRequestIdentity(input.request);
  if (!identity.ok) return { ok: false, code: "identity_unavailable" };

  const principal = identity.value.principal;
  if (!principal) return { ok: false, code: "access_denied" };

  const bookingResult = await dependencies.bookings.findBooking({ bookingId: input.bookingId });
  if (!bookingResult.ok || !bookingResult.value.booking) {
    return { ok: false, code: "booking_unavailable" };
  }

  const booking = bookingResult.value.booking;
  const now = dependencies.now?.() ?? Date.now();
  const decision = authorizePrivateVideoJoin({ principal, booking, now });

  if (!decision.allowed) {
    const audit = await dependencies.audit.record({
      eventName: "private_video.join_denied",
      actorId: principal.userId,
      targetType: "session",
      targetId: booking.id,
      details: { reason: decision.reason },
    });
    if (!audit.ok) return { ok: false, code: "audit_unavailable" };
    return { ok: false, code: "access_denied" };
  }

  const audit = await dependencies.audit.record({
    eventName: "private_video.join_authorized",
    actorId: principal.userId,
    targetType: "session",
    targetId: booking.id,
    details: { participant: decision.participant },
  });
  if (!audit.ok) return { ok: false, code: "audit_unavailable" };

  const room = await dependencies.rooms.issueJoinCredential({
    sessionId: booking.id,
    creatorId: booking.creatorId,
    participantId: principal.userId,
    participant: decision.participant,
  });
  if (!room.ok) return { ok: false, code: "room_unavailable" };

  const { credential, expiresAt } = room.value;
  const maxCredentialLifetimeMs = 3 * 60 * 1000;
  if (
    typeof credential !== "string" ||
    credential.trim().length === 0 ||
    !Number.isFinite(expiresAt) ||
    expiresAt <= now ||
    expiresAt > now + maxCredentialLifetimeMs
  ) {
    return { ok: false, code: "room_unavailable" };
  }

  return {
    ok: true,
    value: { bookingId: booking.id, creatorId: booking.creatorId, credential, expiresAt },
  };
}
