# VIXEN creator onboarding requirements

## Purpose

Creator registration has three distinct stages. A VIXEN login is not creator approval and does not authorize publishing, paid access, video sessions, or withdrawals.

## 1. Account and public profile

The initial creator signup creates a VIXEN login using email and a VIXEN password, with an 18+ confirmation. Creators must confirm their email and complete a public profile with a username, display name, profile image, cover image, and bio before launching a creator page. Profile details are public; legal identity details are not.

## 2. Age and identity verification

Before any creator can publish adult content or earn, VIXEN must verify that the person is an adult and matches the submitted identity. The required verification information is:

- Legal name and date of birth.
- Residential address.
- A current, unexpired government photo ID, front and back.
- A selfie with the ID.
- A live facial/live-person verification check.

VIXEN has not selected or connected a verification provider. Until it has, the signup page explains what creators will need and expressly tells them not to send identity documents to VIXEN. Do not add ID/selfie uploads or persist these fields in the VIXEN database. When selecting a provider, review its security, privacy, retention, deletion, supported-country, age-verification, and adult-content requirements first. Store only the minimum provider reference and decision/status needed for access control, with audit history; keep raw identity material with the vetted provider.

## 3. Payout and tax setup

After identity approval and before enabling withdrawals, collect the payout details required by the selected payout provider and tax identification details applicable to the creator's country. These values must use a vetted, access-controlled provider flow; do not put bank or tax identifiers in profile metadata, application logs, analytics, browser storage, or ordinary VIXEN tables. The provider's supported countries, adult-business eligibility, fees, settlement, tax reporting, and failure/refund handling must be confirmed before activation.

## Access gates

- A new creator login remains an applicant; a user-selected signup type must never set an approved creator role.
- Identity/age approval and VIXEN review are required before publishing or monetization.
- Payout setup and country-specific tax information are required before withdrawals.
- Keep every gate enforced in server/API and database policies, not only in the UI.
- Any rejection, pending review, expired/invalid ID, failed live-person verification check, or unavailable provider must fail closed and explain the next safe action.
- Keep member accounts independent from creator applications. A member can browse with a free account; creator verification requirements do not apply to ordinary member registration.

## Current implementation state

The signup UI presents these three stages and allows a creator to create a VIXEN login. Verification-provider and payout-provider flows are not connected, and there is no live creator verification, creator approval submission, or payout onboarding yet. Do not describe the creator application or earning capabilities as active until the provider integrations, server-side gates, database policies, and end-to-end checks are in place.
