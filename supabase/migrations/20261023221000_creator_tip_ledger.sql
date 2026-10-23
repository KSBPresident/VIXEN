-- Add voluntary creator tips to the same manually reviewed settlement ledger.
-- Tips are off-chain wallet transfers; approval requires admin verification and grants no content access.
alter table public.crypto_payment_proofs
  drop constraint if exists crypto_payment_proofs_payment_type_check;
alter table public.crypto_payment_proofs
  add constraint crypto_payment_proofs_payment_type_check
  check (payment_type in ('creator_payment', 'creator_tip', 'store_order', 'donation'));

alter table public.crypto_payment_proofs
  drop constraint if exists crypto_payment_proofs_creator_check;
alter table public.crypto_payment_proofs
  add constraint crypto_payment_proofs_creator_check check (
    (payment_type in ('creator_payment', 'creator_tip') and creator_id is not null)
    or (payment_type in ('store_order', 'donation') and creator_id is null)
  );

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
     and new.payment_type in ('creator_payment', 'creator_tip') then
    if not exists (
      select 1 from public.profiles p
      where p.id = new.creator_id and p.is_creator is true
    ) then
      raise exception 'Only an approved creator profile can receive credited earnings.';
    end if;
    -- The first official week discount is applied to tips on the same basis
    -- as other creator payments; the proof timestamp fixes the fee at submission.
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
