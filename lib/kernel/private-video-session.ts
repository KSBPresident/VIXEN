import type { VerifiedPrincipal } from "./identity";

export type PrivateVideoBookingState = "confirmed" | "cancelled" | "completed";
export type PrivateVideoPaymentState = "paid" | "pending" | "failed" | "refunded";

/**
 * Values must come from a trusted booking/payment record, never from form fields.
 * Camera and microphone permission is a separate browser action after this policy
 * allows the participant to enter.
 */
export interface PrivateVideoBooking {
  id: string;
  memberId: string;
  creatorId: string;
  state: PrivateVideoBookingState;
  paymentState: PrivateVideoPaymentState;
  creatorAccepted: boolean;
  amountMinorUnits: number;
  currency: string;
  startsAt: number;
  endsAt: number;
}

export type PrivateVideoJoinDecision =
  | { allowed: true; participant: "member" | "creator" }
  | {
      allowed: false;
      reason:
        | "sign_in_required"
        | "account_unavailable"
        | "adult_verification_required"
        | "participant_role_required"
        | "booking_unavailable"
        | "creator_acceptance_required"
        | "payment_required"
        | "booking_time_invalid"
        | "booking_not_started"
        | "booking_ended"
        | "participant_mismatch";
    };

/** Fail-closed join policy for a paid one-to-one private video booking. */
export function authorizePrivateVideoJoin(input: {
  principal: VerifiedPrincipal | null;
  booking: PrivateVideoBooking | null;
  now?: number;
}): PrivateVideoJoinDecision {
  const { principal, booking } = input;
  const now = input.now ?? Date.now();

  if (!principal) return { allowed: false, reason: "sign_in_required" };
  if (principal.accountState !== "active") return { allowed: false, reason: "account_unavailable" };
  if (!principal.adultVerified) return { allowed: false, reason: "adult_verification_required" };
  if (principal.role !== "member" && principal.role !== "creator") {
    return { allowed: false, reason: "participant_role_required" };
  }
  if (!booking || booking.state !== "confirmed") {
    return { allowed: false, reason: "booking_unavailable" };
  }
  if (!booking.creatorAccepted) return { allowed: false, reason: "creator_acceptance_required" };
  if (booking.paymentState !== "paid") return { allowed: false, reason: "payment_required" };
  if (
    !Number.isFinite(booking.startsAt) ||
    !Number.isFinite(booking.endsAt) ||
    booking.startsAt >= booking.endsAt ||
    !Number.isFinite(booking.amountMinorUnits) ||
    booking.amountMinorUnits <= 0 ||
    !/^[A-Z]{3}$/.test(booking.currency)
  ) {
    return { allowed: false, reason: "booking_time_invalid" };
  }
  if (now < booking.startsAt) return { allowed: false, reason: "booking_not_started" };
  if (now >= booking.endsAt) return { allowed: false, reason: "booking_ended" };

  if (principal.role === "member") {
    if (principal.userId !== booking.memberId) {
      return { allowed: false, reason: "participant_mismatch" };
    }
    return { allowed: true, participant: "member" };
  }

  if (principal.creatorId !== booking.creatorId) {
    return { allowed: false, reason: "participant_mismatch" };
  }
  return { allowed: true, participant: "creator" };
}
