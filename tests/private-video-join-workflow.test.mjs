import assert from "node:assert/strict";
import { test } from "node:test";
import workflow from "../.test-build/lib/application/private-video/create-join-credential.js";

const { createPrivateVideoJoinCredential } = workflow;
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
const member = (overrides = {}) => ({
  userId: "member-1",
  role: "member",
  accountState: "active",
  adultVerified: true,
  ...overrides,
});
function dependencies({ principal = member(), session = booking(), auditOk = true, roomOk = true, expiresAt = now + 120_000 } = {}) {
  const calls = [];
  return {
    calls,
    deps: {
      now: () => now,
      identity: {
        async verifyRequestIdentity() {
          calls.push("identity");
          return { ok: true, value: { principal } };
        },
      },
      bookings: {
        async findBooking() {
          calls.push("booking");
          return { ok: true, value: { booking: session } };
        },
      },
      audit: {
        async record(event) {
          calls.push(event.eventName);
          return auditOk
            ? { ok: true, value: { recorded: true } }
            : { ok: false, code: "audit_down", message: "unavailable", retryable: true };
        },
      },
      rooms: {
        async issueJoinCredential() {
          calls.push("room");
          return roomOk
            ? { ok: true, value: { credential: "opaque-short-lived-token", expiresAt } }
            : { ok: false, code: "provider_down", message: "unavailable", retryable: true };
        },
      },
    },
  };
}
const run = (deps) =>
  createPrivateVideoJoinCredential({ request: new Request("https://vixen.example/api/private-video/join"), bookingId: "session-1" }, deps);

test("audits a verified booking before issuing a short-lived provider credential", async () => {
  const { deps, calls } = dependencies();
  const result = await run(deps);
  assert.deepEqual(calls, [
    "identity",
    "booking",
    "private_video.join_authorized",
    "room",
  ]);
  assert.deepEqual(result, {
    ok: true,
    value: {
      bookingId: "session-1",
      creatorId: "creator-1",
      credential: "opaque-short-lived-token",
      expiresAt: now + 120_000,
    },
  });
});

test("denies unpaid sessions, audits the denial, and never requests a room credential", async () => {
  const { deps, calls } = dependencies({ session: booking({ paymentState: "pending" }) });
  assert.deepEqual(await run(deps), { ok: false, code: "access_denied" });
  assert.equal(calls.includes("private_video.join_denied"), true);
  assert.equal(calls.includes("room"), false);
});

test("fails closed when the authorization audit cannot be persisted", async () => {
  const { deps, calls } = dependencies({ auditOk: false });
  assert.deepEqual(await run(deps), { ok: false, code: "audit_unavailable" });
  assert.equal(calls.includes("room"), false);
});

test("does not request a provider credential if the room service fails", async () => {
  const { deps } = dependencies({ roomOk: false });
  assert.deepEqual(await run(deps), { ok: false, code: "room_unavailable" });
});

test("rejects missing, expired, or overlong provider credentials", async () => {
  const blank = dependencies();
  blank.deps.rooms.issueJoinCredential = async () => ({
    ok: true,
    value: { credential: " ", expiresAt: now + 30_000 },
  });
  assert.deepEqual(await run(blank.deps), { ok: false, code: "room_unavailable" });

  const overlong = dependencies({ expiresAt: now + 180_001 });
  assert.deepEqual(await run(overlong.deps), { ok: false, code: "room_unavailable" });

  const expired = dependencies({ expiresAt: now });
  assert.deepEqual(await run(expired.deps), { ok: false, code: "room_unavailable" });
});

test("does not query bookings for missing principals", async () => {
  const { deps, calls } = dependencies({ principal: null });
  assert.deepEqual(await run(deps), { ok: false, code: "access_denied" });
  assert.equal(calls.includes("booking"), false);
  assert.equal(calls.includes("room"), false);
});
