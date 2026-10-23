-- VIXEN platform admin, private crypto payment evidence, and creator settlement.
-- The platform-admin flag is assigned to the single owner account in Supabase Auth app_metadata.
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

-- Existing VIXEN application records remain RLS protected; the platform admin
-- receives full app-level CRUD access without exposing a service role key.
grant select, insert, update, delete on
  public.profiles, public.subscriptions, public.conversations, public.messages,
  public.message_media, public.blocks, public.reports, public.creator_applications
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
  payment_type text not null check (payment_type in ('creator_payment', 'store_order', 'donation')),
  creator_id uuid references public.profiles(id),
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
  constraint crypto_payment_proofs_reference_check
    check (order_reference is null or char_length(order_reference) between 1 and 120),
  constraint crypto_payment_proofs_network_asset_check check (
    (asset in ('USDT', 'USDC') and network in ('Solana', 'BNB Smart Chain', 'Polygon', 'Ethereum'))
    or (asset = 'TRX' and network = 'Tron')
  ),
  constraint crypto_payment_proofs_creator_check check (
    (payment_type = 'creator_payment' and creator_id is not null)
    or (payment_type in ('store_order', 'donation') and creator_id is null)
  ),
  constraint crypto_payment_proofs_review_state_check check (
    (status = 'pending' and reviewed_by is null and reviewed_at is null)
    or (status in ('approved', 'rejected') and reviewed_by is not null and reviewed_at is not null)
  )
);
alter table public.crypto_payment_proofs enable row level security;
grant select, insert, update, delete on public.crypto_payment_proofs to authenticated;
create policy "members submit own crypto payment proof" on public.crypto_payment_proofs
  for insert to authenticated with check (
    user_id = (select auth.uid()) and status = 'pending'
    and reviewed_by is null and reviewed_at is null and admin_note is null
    and screenshot_path like ((select auth.uid())::text || '/%')
  );
create policy "members read own crypto payment proof" on public.crypto_payment_proofs
  for select to authenticated using (user_id = (select auth.uid()));
create policy "vixen platform admin full access" on public.crypto_payment_proofs
  for all to authenticated using (public.is_vixen_admin()) with check (public.is_vixen_admin());

create table public.creator_earning_ledger (
  id uuid primary key default gen_random_uuid(),
  creator_id uuid not null references public.profiles(id),
  payment_proof_id uuid not null unique references public.crypto_payment_proofs(id),
  asset text not null check (asset in ('USDT', 'USDC', 'TRX')),
  network text not null,
  gross_amount numeric(18, 8) not null check (gross_amount > 0),
  platform_fee_amount numeric(18, 8) not null check (platform_fee_amount >= 0),
  creator_net_amount numeric(18, 8) not null check (creator_net_amount > 0),
  created_at timestamptz not null default now(),
  constraint creator_earning_network_asset_check check (
    (asset in ('USDT', 'USDC') and network in ('Solana', 'BNB Smart Chain', 'Polygon', 'Ethereum'))
    or (asset = 'TRX' and network = 'Tron')
  ),
  constraint creator_earning_split_check check (
    gross_amount = platform_fee_amount + creator_net_amount
    and platform_fee_amount in (
      round(gross_amount * 0.05, 8),
      round(gross_amount * 0.15, 8)
    )
  )
);
alter table public.creator_earning_ledger enable row level security;
grant select, insert, update, delete on public.creator_earning_ledger to authenticated;
create policy "creators read own earnings" on public.creator_earning_ledger
  for select to authenticated using (creator_id = (select auth.uid()));
create policy "vixen platform admin full access" on public.creator_earning_ledger
  for all to authenticated using (public.is_vixen_admin()) with check (public.is_vixen_admin());

create table public.creator_withdrawal_requests (
  id uuid primary key default gen_random_uuid(),
  creator_id uuid not null references public.profiles(id),
  asset text not null check (asset in ('USDT', 'USDC', 'TRX')),
  network text not null,
  amount numeric(18, 8) not null check (amount > 0),
  destination_address text not null check (char_length(destination_address) between 20 and 180),
  status text not null default 'pending' check (status in ('pending', 'approved', 'paid', 'rejected')),
  creator_note text,
  admin_note text,
  reviewed_by uuid references auth.users(id),
  reviewed_at timestamptz,
  paid_at timestamptz,
  payout_transaction_hash text,
  created_at timestamptz not null default now(),
  constraint creator_withdrawal_network_asset_check check (
    (asset in ('USDT', 'USDC') and network in ('Solana', 'BNB Smart Chain', 'Polygon', 'Ethereum'))
    or (asset = 'TRX' and network = 'Tron')
  ),
  constraint creator_withdrawal_final_state_check check (
    (status in ('pending', 'rejected') and paid_at is null)
    or (status in ('approved', 'paid') and reviewed_by is not null and reviewed_at is not null)
  ),
  constraint creator_withdrawal_paid_state_check check (
    (status = 'paid' and paid_at is not null)
    or (status <> 'paid' and paid_at is null)
  )
);
alter table public.creator_withdrawal_requests enable row level security;
grant select, insert, update, delete on public.creator_withdrawal_requests to authenticated;
create policy "creators read own withdrawal requests" on public.creator_withdrawal_requests
  for select to authenticated using (creator_id = (select auth.uid()));
create policy "vixen platform admin full access" on public.creator_withdrawal_requests
  for all to authenticated using (public.is_vixen_admin()) with check (public.is_vixen_admin());

create or replace function public.post_creator_earning_for_approved_proof()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_fee numeric(18, 8);
begin
  if new.status = 'approved' and old.status is distinct from 'approved'
     and new.payment_type = 'creator_payment' then
    if not exists (
      select 1 from public.profiles p
      where p.id = new.creator_id and p.is_creator is true
    ) then
      raise exception 'Only an approved creator profile can receive credited earnings.';
    end if;
    -- First official week discount only: VIXEN commission is 5% from Nov 3
    -- through Nov 9, 2026 in Trinidad & Tobago time; standard 15% applies outside it.
    v_fee := round(new.amount * case
      when new.created_at >= timestamptz '2026-11-03 00:00:00-04'
       and new.created_at < timestamptz '2026-11-10 00:00:00-04'
      then 0.05
      else 0.15
    end, 8);
    insert into public.creator_earning_ledger
      (creator_id, payment_proof_id, asset, network, gross_amount, platform_fee_amount, creator_net_amount)
    values
      (new.creator_id, new.id, new.asset, new.network, new.amount, v_fee, new.amount - v_fee)
    on conflict (payment_proof_id) do nothing;
  end if;
  return new;
end;
$$;
revoke all on function public.post_creator_earning_for_approved_proof() from public, anon, authenticated;
create trigger post_creator_earning_for_approved_proof
  after update of status on public.crypto_payment_proofs
  for each row execute function public.post_creator_earning_for_approved_proof();

create or replace function public.request_creator_withdrawal(
  p_asset text,
  p_network text,
  p_amount numeric,
  p_destination_address text,
  p_creator_note text default null
)
returns uuid
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_creator_id uuid := auth.uid();
  v_available numeric(18, 8);
  v_request_id uuid;
begin
  if v_creator_id is null then
    raise exception 'Sign in to request a withdrawal.';
  end if;
  if not exists (
    select 1 from public.profiles p
    where p.id = v_creator_id and p.is_creator is true
  ) then
    raise exception 'Only approved creators can request a withdrawal.';
  end if;
  if p_amount is null or p_amount <= 0 then
    raise exception 'Enter a withdrawal amount greater than zero.';
  end if;
  if char_length(coalesce(p_destination_address, '')) < 20
     or char_length(p_destination_address) > 180 then
    raise exception 'Enter a valid destination wallet address.';
  end if;
  if not (
    (p_asset in ('USDT', 'USDC') and p_network in ('Solana', 'BNB Smart Chain', 'Polygon', 'Ethereum'))
    or (p_asset = 'TRX' and p_network = 'Tron')
  ) then
    raise exception 'The selected asset and network are not supported.';
  end if;
  if char_length(coalesce(p_creator_note, '')) > 500 then
    raise exception 'The note can be up to 500 characters.';
  end if;

  perform pg_catalog.pg_advisory_xact_lock(
    pg_catalog.hashtextextended(v_creator_id::text || ':' || p_asset || ':' || p_network, 0)
  );
  select
    coalesce((select sum(e.creator_net_amount) from public.creator_earning_ledger e
      where e.creator_id = v_creator_id and e.asset = p_asset and e.network = p_network), 0)
    - coalesce((select sum(w.amount) from public.creator_withdrawal_requests w
      where w.creator_id = v_creator_id and w.asset = p_asset and w.network = p_network
        and w.status in ('pending', 'approved', 'paid')), 0)
  into v_available;

  if p_amount > v_available then
    raise exception 'The requested amount exceeds the available balance.';
  end if;

  insert into public.creator_withdrawal_requests
    (creator_id, asset, network, amount, destination_address, creator_note)
  values
    (v_creator_id, p_asset, p_network, round(p_amount, 8), p_destination_address, nullif(p_creator_note, ''))
  returning id into v_request_id;
  return v_request_id;
end;
$$;
revoke all on function public.request_creator_withdrawal(text, text, numeric, text, text) from public, anon;
grant execute on function public.request_creator_withdrawal(text, text, numeric, text, text) to authenticated;

create view public.creator_balances with (security_invoker = true) as
with balance_keys as (
  select creator_id, asset, network from public.creator_earning_ledger
  union
  select creator_id, asset, network from public.creator_withdrawal_requests
),
earnings as (
  select creator_id, asset, network,
    sum(gross_amount) as gross_earned,
    sum(platform_fee_amount) as platform_fees,
    sum(creator_net_amount) as creator_earned
  from public.creator_earning_ledger group by creator_id, asset, network
),
withdrawals as (
  select creator_id, asset, network,
    sum(amount) filter (where status = 'paid') as paid_amount,
    sum(amount) filter (where status in ('pending', 'approved')) as reserved_amount
  from public.creator_withdrawal_requests group by creator_id, asset, network
)
select k.creator_id, k.asset, k.network,
  coalesce(e.gross_earned, 0)::numeric(18,8) as gross_earned,
  coalesce(e.platform_fees, 0)::numeric(18,8) as platform_fees,
  coalesce(e.creator_earned, 0)::numeric(18,8) as creator_earned,
  coalesce(w.paid_amount, 0)::numeric(18,8) as paid_amount,
  coalesce(w.reserved_amount, 0)::numeric(18,8) as reserved_amount,
  (coalesce(e.creator_earned, 0) - coalesce(w.paid_amount, 0) - coalesce(w.reserved_amount, 0))::numeric(18,8) as available_balance
from balance_keys k
left join earnings e using (creator_id, asset, network)
left join withdrawals w using (creator_id, asset, network);
grant select on public.creator_balances to authenticated;

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('crypto-payment-proofs', 'crypto-payment-proofs', false, 5242880, array['image/jpeg', 'image/png', 'image/webp'])
on conflict (id) do update
set public = false, file_size_limit = excluded.file_size_limit, allowed_mime_types = excluded.allowed_mime_types;

create policy "members upload own crypto payment proof images" on storage.objects
  for insert to authenticated with check (
    bucket_id = 'crypto-payment-proofs'
    and (storage.foldername(name))[1] = (select auth.uid())::text
  );
create policy "members remove own unlinked crypto proof image" on storage.objects
  for delete to authenticated using (
    bucket_id = 'crypto-payment-proofs'
    and (storage.foldername(name))[1] = (select auth.uid())::text
    and not exists (select 1 from public.crypto_payment_proofs p where p.screenshot_path = name)
  );
create policy "vixen platform admin full storage access" on storage.objects
  for all to authenticated using (public.is_vixen_admin()) with check (public.is_vixen_admin());

create index crypto_payment_proofs_status_created_at_idx on public.crypto_payment_proofs (status, created_at desc);
create index crypto_payment_proofs_user_created_at_idx on public.crypto_payment_proofs (user_id, created_at desc);
create index creator_earning_ledger_creator_created_at_idx on public.creator_earning_ledger (creator_id, created_at desc);
create index creator_withdrawal_creator_status_idx on public.creator_withdrawal_requests (creator_id, status, created_at desc);
