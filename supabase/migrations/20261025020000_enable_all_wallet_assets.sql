-- Enable every wallet asset and network supplied by the VIXEN owner.
-- Settlement remains manual: screenshots are evidence for review, not automatic verification.
alter table public.crypto_payment_proofs
  drop constraint if exists crypto_payment_proofs_asset_check,
  drop constraint if exists crypto_payment_proofs_network_asset_check;
alter table public.crypto_payment_proofs
  add constraint crypto_payment_proofs_asset_check
    check (asset = any (array['USDT','USDC','TRX','BNB','SOL','ETH','MATIC']::text[])),
  add constraint crypto_payment_proofs_network_asset_check check (
    (asset = 'USDT' and network in ('Solana','BNB Smart Chain','Polygon','Ethereum','Tron'))
    or (asset = 'USDC' and network in ('Solana','BNB Smart Chain','Polygon','Ethereum'))
    or (asset = 'TRX' and network = 'Tron')
    or (asset = 'BNB' and network = 'BNB Smart Chain')
    or (asset = 'SOL' and network = 'Solana')
    or (asset = 'ETH' and network = 'Ethereum')
    or (asset = 'MATIC' and network = 'Ethereum')
  );

alter table public.creator_earning_ledger
  drop constraint if exists creator_earning_ledger_asset_check,
  drop constraint if exists creator_earning_network_asset_check;
alter table public.creator_earning_ledger
  add constraint creator_earning_ledger_asset_check
    check (asset = any (array['USDT','USDC','TRX','BNB','SOL','ETH','MATIC']::text[])),
  add constraint creator_earning_network_asset_check check (
    (asset = 'USDT' and network in ('Solana','BNB Smart Chain','Polygon','Ethereum','Tron'))
    or (asset = 'USDC' and network in ('Solana','BNB Smart Chain','Polygon','Ethereum'))
    or (asset = 'TRX' and network = 'Tron')
    or (asset = 'BNB' and network = 'BNB Smart Chain')
    or (asset = 'SOL' and network = 'Solana')
    or (asset = 'ETH' and network = 'Ethereum')
    or (asset = 'MATIC' and network = 'Ethereum')
  );

alter table public.creator_withdrawal_requests
  drop constraint if exists creator_withdrawal_requests_asset_check,
  drop constraint if exists creator_withdrawal_network_asset_check;
alter table public.creator_withdrawal_requests
  add constraint creator_withdrawal_requests_asset_check
    check (asset = any (array['USDT','USDC','TRX','BNB','SOL','ETH','MATIC']::text[])),
  add constraint creator_withdrawal_network_asset_check check (
    (asset = 'USDT' and network in ('Solana','BNB Smart Chain','Polygon','Ethereum','Tron'))
    or (asset = 'USDC' and network in ('Solana','BNB Smart Chain','Polygon','Ethereum'))
    or (asset = 'TRX' and network = 'Tron')
    or (asset = 'BNB' and network = 'BNB Smart Chain')
    or (asset = 'SOL' and network = 'Solana')
    or (asset = 'ETH' and network = 'Ethereum')
    or (asset = 'MATIC' and network = 'Ethereum')
  );

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
as $function$
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
    (p_asset = 'USDT' and p_network in ('Solana','BNB Smart Chain','Polygon','Ethereum','Tron'))
    or (p_asset = 'USDC' and p_network in ('Solana','BNB Smart Chain','Polygon','Ethereum'))
    or (p_asset = 'TRX' and p_network = 'Tron')
    or (p_asset = 'BNB' and p_network = 'BNB Smart Chain')
    or (p_asset = 'SOL' and p_network = 'Solana')
    or (p_asset = 'ETH' and p_network = 'Ethereum')
    or (p_asset = 'MATIC' and p_network = 'Ethereum')
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
$function$;
revoke all on function public.request_creator_withdrawal(text, text, numeric, text, text) from public, anon;
grant execute on function public.request_creator_withdrawal(text, text, numeric, text, text) to authenticated;
