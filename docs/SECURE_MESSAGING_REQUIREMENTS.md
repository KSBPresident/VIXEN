# VIXEN private messaging security requirements

Status: planned. The current Messages page is fictional preview content. It does not send, store, or encrypt conversations.

## Required privacy boundary

- Direct message text and attachments must be encrypted on the sender's device before upload and decrypted only on authorized participant devices.
- VIXEN servers, database administrators, platform owners, and support staff must not receive keys that decrypt private message bodies or attachments.
- Key establishment and message encryption must use a maintained, independently reviewed end-to-end encryption protocol and maintained implementations. Do not invent a protocol or rely on TLS alone.
- Users must be able to verify conversation/device keys and be warned when a participant's keys change.
- Device addition, account recovery, backups, and lost-key behavior must be specified before launch. Recovery must not silently give VIXEN the ability to decrypt existing conversations.
- Delivery/read state, participants, timestamps, billing events, and moderation/reporting events may reveal metadata even when content is end-to-end encrypted; disclose that separately.
- Paid-message purchases must never require the platform to decrypt private message content. Only the price, transaction status, and explicitly disclosed delivery metadata should be handled by billing services.
- Platform-owner access to creator posts does not grant access to private messages. Admin access must never bypass message encryption.

## Release gate

Messaging remains inactive until key management, multi-device operation, identity verification, encrypted attachment handling, abuse reporting, deletion behavior, mobile and desktop browser compatibility, and independent security review are complete. The preview must continue to say it is not encrypted until then.
