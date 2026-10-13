# vMessage

vMessage is the VIXEN name for its planned private member-to-creator messaging experience.

## Current state

The current vMessage screen is a UI preview. Sample drafts remain in the visitor's browser and are not sent, persisted, or encrypted. Do not describe vMessage as an active private or end-to-end encrypted service until the security and delivery work is implemented and verified.

## Release requirements

- Keep private conversation access limited to its participants; staff access must be explicitly scoped, audited, and disclosed.
- For end-to-end encryption, encrypt message bodies and attachments on user devices. Private keys must remain user-controlled; the server must not hold a decryption key.
- Include authenticated device/key enrollment, identity verification, device changes and revocation, forward secrecy, attachment encryption, abuse reporting boundaries, and tested backup/recovery behavior before release.
- Keep paid unlocks and purchase records separate from message plaintext. A payment state must never grant broad conversation or device-key access.
- Verify encryption/decryption, multi-device behavior, key changes, and access controls before removing preview-only labels.

vMessage describes the VIXEN product feature, not Apple Messages or iMessage.