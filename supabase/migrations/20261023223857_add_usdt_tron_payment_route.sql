alter table public.crypto_payment_proofs
  drop constraint if exists crypto_payment_proofs_asset_check,
  drop constraint if exists crypto_payment_proofs_network_asset_check;

alter table public.crypto_payment_proofs
  add constraint crypto_payment_proofs_asset_check
  check (asset = any (array['USDT'::text, 'USDC'::text, 'TRX'::text]));

alter table public.crypto_payment_proofs
  add constraint crypto_payment_proofs_network_asset_check
  check (
    ((asset = any (array['USDT'::text, 'USDC'::text]))
      and (network = any (array['Solana'::text, 'BNB Smart Chain'::text, 'Polygon'::text, 'Ethereum'::text])))
    or ((asset = 'USDT'::text) and (network = 'Tron'::text))
    or ((asset = 'TRX'::text) and (network = 'Tron'::text))
  );
