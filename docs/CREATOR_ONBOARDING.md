# VIXEN creator onboarding requirements

## Purpose

A VIXEN login or application is not identity approval and does not by itself authorize adult publishing, paid access, video sessions, or withdrawals.

## 1. Pre-account application

The current creator path asks for an email address, creator/stage name, short bio, an 18+ adult-woman self-attestation, and agreement to publish only authorized content featuring consenting adults. Applications are private and reviewed by a VIXEN administrator before any creator account is created.

Do not upload or email identity documents, selfies, biometric captures, bank details, tax identifiers, wallet recovery phrases, or private keys. The application form does not request or store those materials.

## 2. Admin review and account activation

An administrator can approve or reject a pending application. Approval requires the admin review form's identity-review confirmation. The application row records the decision, reviewer, and timestamp, but does not separately store the checkbox value or an external provider's evidence. Approval issues a single-use invitation bound to the application email. It expires after seven days. The invited person must sign up with that email and confirm control of the inbox before creator access is activated.

The confirmation checkbox is an administrator attestation, not a connected identity-verification provider or biometric check. No identity provider is currently integrated. Until a secure age/identity process is established and actually performed, do not approve anyone for adult-content publishing or monetization. Never treat a self-attestation or successful email confirmation as identity proof.

## 3. Age and identity verification

Before adult publishing or earning, VIXEN needs an appropriate way to verify that the creator is an adult and matches the submitted identity. Identity providers and their privacy, security, retention/deletion, supported-country, age-verification, and adult-content requirements have not been selected or integrated.

Do not add ID/selfie uploads or raw legal-identity fields to VIXEN until a vetted provider and access/retention controls are selected. If a provider is later connected, store only the minimum provider reference and verification decision/status needed for access control, with auditable review history. Keep raw identity material with that provider.

## 4. Payout and tax setup

Payout onboarding and country-specific tax information are not connected. Do not collect bank or tax identifiers in profile metadata, logs, analytics, browser storage, or ordinary VIXEN tables. Withdrawals and creator earnings must remain clearly identified as manual or unavailable until the relevant identity, payout, tax, settlement, and reconciliation steps have been implemented and tested.

## Current implementation state

Creator pre-applications, admin review, expiring invitation links, email confirmation, approved creator profiles, and public creator feed publishing are implemented in the web app. The Supabase migration is applied. The production routes were checked, but no real creator has completed the application-to-account-to-upload flow yet. Feed posts are public; do not upload private or paid material there.

Creator stories, paid memberships, paid messages, private video, integrated age/identity verification, payout/tax onboarding, automatic settlement, and end-to-end monetization are not active. Keep those surfaces marked as previews or coming soon until each full flow is secured and verified.
