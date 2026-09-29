const assert = require("node:assert/strict");
const { test } = require("node:test");

const { authorizeCreatorContent } = require("../.test-build/lib/kernel/content-access.js");
const { evaluateCapabilityActivation } = require("../.test-build/lib/executive/platform-readiness.js");

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

test("requires manager scope and a separate audited workflow for roster access", () => {
  const manager = member({ role: "creator_manager", managedCreatorIds: ["creator-1"] });
  assert.equal(decide(manager).reason, "manager_audit_required");
  assert.equal(decide(manager, "bronze", null, "creator-2").reason, "creator_scope_mismatch");
});

test("does not grant content access to platform administrators by default", () => {
  const admin = member({ role: "platform_admin" });
  assert.equal(decide(admin).reason, "member_account_required");
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
