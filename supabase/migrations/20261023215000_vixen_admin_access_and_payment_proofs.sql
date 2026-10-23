-- VIXEN platform admin and private crypto payment evidence.
-- Admin status is stored in Supabase Auth app_metadata, which users cannot edit.
create or replace function public.is_vixen_admin()
returns boolean
language sql
stable
security invoker
set search_path = ''
as $$
  select coalesce(auth.jwt() -> 'app_metadata' ->> 'vixen_admin', 'false') = 'true';
$$;

revoke all on function public.is_vixen_admin() from public, anon;
grant execute on function public.is_vixen_admin() to authenticated;

do $$
declare
  target_id uuid;
begin
  select id into target_id
  from auth.users
  where lower(email) = 'ishmealreyes@proton.me'
    and email_confirmed_at is not null;

  if target_id is null then
    raise exception 'The confirmed VIXEN admin account ishmealreyes@proton.me was not found.';
  end if;

  update auth.users
  set raw_app_meta_data =
    (coalesce(raw_app_meta_data, '{}'::jsonb) - 'vixen_admin' - 'role' - 'is_admin')
    || '{"vixen_admin": true, "role": "platform_admin"}'::jsonb
  where id = target_id;

  update auth.users
  set raw_app_meta_data = coalesce(raw_app_meta_data, '{}'::jsonb) - 'vixen_admin' - 'is_admin'
  where id <> target_id
    and (
      coalesce(raw_app_meta_data->>'vixen_admin', 'false') = 'true'
      or coalesce(raw_app_meta_data->>'is_admin', 'false') = 'true'
      or raw_app_meta_data->>'role' = 'platform_admin'
    );
end;
$$;

-- The platform administrator can manage every current VIXEN application record.
grant select, insert, update, delete on
  public.profiles,
  public.subscriptions,
  public.conversations,
  public.messages,
  public.message_media,
  public.blocks,
  public.reports,
  public.creator_applications
to authenticated;

create policy "vixen platform admin full access" on public.profiles
  for all to authenticated using (public.is_vixen_admin()) with check (public.is_vixen_admin());
create policy "vixen platform admin full access" on public.subscriptions
  for all to authenticated using (public.is_vixen_admin()) with check (public.is_vixen_admin());
create policy "vixen platform admin full access" on public.conversations
  for all to authenticated using (public.is_vixen_admin()) with check (public.is_vixen_admin());
create policy "vixen platform admin full access" on public.messages
  for all to authenticated using (public.is_vixen_admin()) with check (public.is_vixen_admin());
create policy "vixen platform admin full access" on public.message_media
  for all to authenticated using (public.is_vixen_admin()) with check (public.is_vixen_admin());
create policy "vixen platform admin full access" on public.blocks
  for all to authenticated using (public.is_vixen_admin()) with check (public.is_vixen_admin());
create policy "vixen platform admin full access" on public.reports
  for all to authenticated using (public.is_vixen_admin()) with check (public.is_vixen_admin());
create policy "vixen platform admin full access" on public.creator_applications
  for all to authenticated using (public.is_vixen_admin()) with check (public.is_vixen_admin());

create table public.crypto_payment_proofs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  payment_type text not null check (payment_type in ('purchase', 'donation')),
  order_reference text,
  asset text not null check (asset in ('USDT', 'USDC', 'TRX')),
  network text not null,
  amount numeric(18, 8) not null check (amount > 0),
  transaction_hash text not null check (char_length(transaction_hash) between 8 and 180),
  screenshot_path text not null unique,
  status text not null default 'pending' check (status in ('pending', 'approved', 'rejected')),
  admin_note text,
  reviewed_by uuid references auth.users(id),
  reviewed_at timestamptz,
  created_at timestamptz not null default now(),
  constraint crypto_payment_proofs_order_reference_check
    check (order_reference is null or char_length(order_reference) between 1 and 120),
  constraint crypto_payment_proofs_network_asset_check check (
    (asset in ('USDT', 'USDC') and network in ('Solana', 'BNB Smart Chain', 'Polygon', 'Ethereum'))
    or (asset = 'TRX' and network = 'Tron')
  ),
  constraint crypto_payment_proofs_review_state_check check (
    (status = 'pending' and reviewed_by is null and reviewed_at is null)
    or (status in ('approved', 'rejected') and reviewed_by is not null and reviewed_at is not null)
  )
);

alter table public.crypto_payment_proofs enable row level security;
grant select, insert, update, delete on public.crypto_payment_proofs to authenticated;

create policy "members submit own crypto payment proof" on public.crypto_payment_proofs
  for insert to authenticated
  with check (
    user_id = (select auth.uid())
    and status = 'pending'
    and reviewed_by is null
    and reviewed_at is null
    and admin_note is null
    and screenshot_path like ((select auth.uid())::text || '/%')
  );
create policy "members read own crypto payment proof" on public.crypto_payment_proofs
  for select to authenticated
  using (user_id = (select auth.uid()));
create policy "vixen platform admin full access" on public.crypto_payment_proofs
  for all to authenticated using (public.is_vixen_admin()) with check (public.is_vixen_admin());

-- Proof images remain private. Downloads require an authenticated admin session.
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'crypto-payment-proofs',
  'crypto-payment-proofs',
  false,
  5242880,
  array['image/jpeg', 'image/png', 'image/webp']
)
on conflict (id) do update
set public = false,
    file_size_limit = excluded.file_size_limit,
    allowed_mime_types = excluded.allowed_mime_types;

create policy "members upload own crypto payment proof images" on storage.objects
  for insert to authenticated
  with check (
    bucket_id = 'crypto-payment-proofs'
    and (storage.foldername(name))[1] = (select auth.uid())::text
  );
create policy "members remove own unlinked crypto proof image" on storage.objects
  for delete to authenticated
  using (
    bucket_id = 'crypto-payment-proofs'
    and (storage.foldername(name))[1] = (select auth.uid())::text
    and not exists (
      select 1 from public.crypto_payment_proofs p
      where p.screenshot_path = name
    )
  );
create policy "vixen platform admin full storage access" on storage.objects
  for all to authenticated using (public.is_vixen_admin()) with check (public.is_vixen_admin());

create index crypto_payment_proofs_status_created_at_idx
  on public.crypto_payment_proofs (status, created_at desc);
create index crypto_payment_proofs_user_created_at_idx
  on public.crypto_payment_proofs (user_id, created_at desc);
