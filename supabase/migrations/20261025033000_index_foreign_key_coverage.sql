-- Add indexes to foreign-key columns used by review, moderation, and ownership queries.
-- These are additive and do not change access policies or application behavior.

create index if not exists creator_withdrawal_requests_reviewed_by_idx
  on public.creator_withdrawal_requests (reviewed_by);

create index if not exists crypto_payment_proofs_creator_id_idx
  on public.crypto_payment_proofs (creator_id);

create index if not exists crypto_payment_proofs_reviewed_by_idx
  on public.crypto_payment_proofs (reviewed_by);

create index if not exists messages_sender_id_idx
  on public.messages (sender_id);

create index if not exists reports_message_id_idx
  on public.reports (message_id);

create index if not exists reports_reported_user_id_idx
  on public.reports (reported_user_id);

create index if not exists reports_reporter_id_idx
  on public.reports (reporter_id);

create index if not exists store_products_created_by_idx
  on public.store_products (created_by);
