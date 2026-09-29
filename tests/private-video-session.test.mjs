import assert from "node:assert/strict";
import { test } from "node:test";
import video from "../.test-build/lib/kernel/private-video-session.js";

const { authorizePrivateVideoJoin } = video;
const now = 1_800_000_000_000;
const booking = (overrides = {}) => ({
  id: "session-1",
  memberId: "member-1",
  creatorId: "creator-1",
  state: "confirmed",
  paymentState: "paid",
  creatorAccepted: true,
  amountMinorUnits: 2500,
  currency: "USD",
  startsAt: now - 60_000,
  endsAt: now + 60_000,
  ...overrides,
});
const principal = (overrides = {}) => ({
  userId: "member-1",
  role: "member",
  accountState: "active",
  adultVerified: true,
  ...overrides,
});
const decide = (identity = principal(), session = booking()) =>
  authorizePrivateVideoJoin({ principal: identity, booking: session, now });

test("allows only the booked adult-verified member or opted-in creator during the paid slot", () => {
  assert.deepEqual(decide(), { allowed: true, participant: "member" });
  assert.deepEqual(
    decide(principal({ userId: "creator-user", role: "creator", creatorId: "creator-1" })),
    { allowed: true, participant: "creator" },
  );
});

test("requires sign-in, active account, adult verification, and participant roles", () => {
  assert.equal(decide(null).reason, "sign_in_required");
  assert.equal(decide(principal({ accountState: "suspended" })).reason, "account_unavailable");
  assert.equal(decide(principal({ adultVerified: false })).reason, "adult_verification_required");
  assert.equal(decide(principal({ role: "platform_admin" })).reason, "participant_role_required");
});

test("requires a confirmed booking, creator acceptance, and settled payment", () => {
  assert.equal(decide(principal(), null).reason, "booking_unavailable");
  assert.equal(decide(principal(), booking({ state: "cancelled" })).reason, "booking_unavailable");
  assert.equal(decide(principal(), booking({ creatorAccepted: false })).reason, "creator_acceptance_required");
  assert.equal(decide(principal(), booking({ paymentState: "pending" })).reason, "payment_required");
  assert.equal(decide(principal(), booking({ paymentState: "refunded" })).reason, "payment_required");
});

test("rejects mismatched members and creators", () => {
  assert.equal(decide(principal({ userId: "other-member" })).reason, "participant_mismatch");
  assert.equal(
    decide(principal({ userId: "creator-user", role: "creator", creatorId: "creator-2" })).reason,
    "participant_mismatch",
  );
});

test("enforces the booking time window and valid server-side price details", () => {
  assert.equal(decide(principal(), booking({ startsAt: now + 1 })).reason, "booking_not_started");
  assert.equal(decide(principal(), booking({ endsAt: now })).reason, "booking_ended");
  assert.equal(decide(principal(), booking({ startsAt: now, endsAt: now })).reason, "booking_time_invalid");
  assert.equal(decide(principal(), booking({ amountMinorUnits: 0 })).reason, "booking_time_invalid");
  assert.equal(decide(principal(), booking({ currency: "usd" })).reason, "booking_time_invalid");
});
