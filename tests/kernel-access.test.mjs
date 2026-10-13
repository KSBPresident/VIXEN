import assert from "node:assert/strict";
import { test } from "node:test";
import contentAccess from "../.test-build/lib/kernel/content-access.js";
import identity from "../.test-build/lib/kernel/identity.js";
import executive from "../.test-build/lib/executive/platform-readiness.js";

const { authorizeCreatorContent } = contentAccess;
const { isConfiguredPlatformOwner } = identity;
const { evaluateCapabilityActivation } = executive;

const member = (overrides = {}) => ({
  userId: "member-1",
  role: "member",
  accountState: "active",
  adultVerified: true,
  ...overrides,
});

const decide = (principal, requiredTier = "bronze", memberTier = null, creatorId = "creator-1") =>
  authorizeCreatorContent({ principal, creatorId, requiredTier, memberTier });

test("denies missing, suspended, and age-unverified principals", () => {
  assert.equal(decide(null).reason, "sign_in_required");
  assert.equal(decide(member({ accountState: "suspended" })).reason, "account_unavailable");
  assert.equal(decide(member({ adultVerified: false })).reason, "adult_verification_required");
  assert.equal(decide(member({ role: "platform_admin", adultVerified: false })).reason, "adult_verification_required");
});

test("only the confirmed configured email resolves as the platform owner", () => {
  assert.equal(isConfiguredPlatformOwner({
    email: "Admin@VixenVortex.com",
    emailConfirmedAt: "2026-10-13T00:00:00Z",
  }, "admin@vixenvortex.com"), true);
  assert.equal(isConfiguredPlatformOwner({
    email: "admin@vixenvortex.com",
    emailConfirmedAt: null,
  }, "admin@vixenvortex.com"), false);
  assert.equal(isConfiguredPlatformOwner({
    email: "other@vixenvortex.com",
    emailConfirmedAt: "2026-10-13T00:00:00Z",
  }, "admin@vixenvortex.com"), false);
  assert.equal(isConfiguredPlatformOwner({
    email: "admin@vixenvortex.com",
    emailConfirmedAt: "2026-10-13T00:00:00Z",
  }, undefined), false);
});

test("allows public member previews after adult verification without a paid tier", () => {
  assert.deepEqual(decide(member(), "free"), { allowed: true, reason: "member_entitlement" });
});

test("requires a matching active membership tier for locked posts", () => {
  assert.equal(decide(member()).reason, "membership_required");
  assert.equal(decide(member(), "gold", "silver").reason, "higher_tier_required");
  assert.deepEqual(decide(member(), "silver", "gold"), {
    allowed: true,
    reason: "member_entitlement",
  });
});

test("lets creators access their own content, never another creator's", () => {
  const creator = member({ role: "creator", creatorId: "creator-1" });
  assert.deepEqual(decide(creator), { allowed: true, reason: "creator_owner" });
  assert.equal(decide(creator, "bronze", null, "creator-2").reason, "member_account_required");
});

test("allows only an active platform administrator tier-independent content access", () => {
  const admin = member({ userId: "platform-owner-1", role: "platform_admin" });
  for (const tier of ["free", "bronze", "silver", "gold", "elite"]) {
    assert.deepEqual(decide(admin, tier), { allowed: true, reason: "platform_admin_content_access" });
  }
  assert.equal(decide(member({ role: "platform_admin", accountState: "suspended" })).reason, "account_unavailable");
});

test("requires manager scope and a separate audited workflow for roster access", () => {
  const manager = member({ role: "creator_manager", managedCreatorIds: ["creator-1"] });
  assert.equal(decide(manager).reason, "manager_audit_required");
  assert.equal(decide(manager, "bronze", null, "creator-2").reason, "creator_scope_mismatch");
});

test("Executive OS requires every release evidence item", () => {
  const partial = evaluateCapabilityActivation("creatorManagement", ["verified manager identity"]);
  assert.equal(partial.eligible, false);
  assert.equal(partial.missingEvidence.length, 2);

  const complete = evaluateCapabilityActivation("creatorManagement", [
    "verified manager identity",
    "scoped roster permissions",
    "durable audit records",
  ]);
  assert.deepEqual(complete, { eligible: true, missingEvidence: [] });
});
