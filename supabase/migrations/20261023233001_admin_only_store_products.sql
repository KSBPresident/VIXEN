-- Allow only the configured VIXEN administrator to create or publish store listings.
-- Public and signed-in users may read published listings only; the catalog remains empty until an administrator adds verified inventory.
create or replace function public.is_vixen_admin()
returns boolean
language sql
stable
security invoker
set search_path = ''
as $$
  select coalesce(auth.jwt() -> 'app_metadata' ->> 'vixen_admin', 'false') = 'true'
    and lower(btrim(coalesce(auth.jwt() ->> 'email', ''))) = 'ishmealreyes@proton.me';
$$;
revoke all on function public.is_vixen_admin() from public, anon;
grant execute on function public.is_vixen_admin() to authenticated;

create table public.store_products (
  id uuid primary key default gen_random_uuid(),
  name text not null check (char_length(btrim(name)) between 3 and 120),
  category text not null check (char_length(btrim(category)) between 2 and 80),
  description text not null check (char_length(btrim(description)) between 10 and 4000),
  price_minor_units integer not null check (price_minor_units > 0),
  currency text not null check (currency in ('USD', 'TTD')),
  stock_quantity integer not null check (stock_quantity between 0 and 999999),
  fulfillment_details text not null check (char_length(btrim(fulfillment_details)) between 10 and 2000),
  return_policy text not null check (char_length(btrim(return_policy)) between 10 and 2000),
  status text not null default 'draft' check (status in ('draft', 'published', 'archived')),
  created_by uuid not null references auth.users(id) on delete restrict,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint published_store_items_require_stock check (status <> 'published' or stock_quantity > 0)
);
alter table public.store_products enable row level security;
revoke all on public.store_products from public, anon, authenticated;
grant select on public.store_products to anon, authenticated;
grant insert, update, delete on public.store_products to authenticated;

create policy "published store products are publicly readable"
  on public.store_products for select to anon, authenticated
  using (status = 'published');
create policy "vixen admin manages store products"
  on public.store_products for all to authenticated
  using (public.is_vixen_admin())
  with check (public.is_vixen_admin());

create index store_products_published_updated_idx
  on public.store_products (updated_at desc)
  where status = 'published';

create or replace function public.set_store_product_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at := pg_catalog.now();
  return new;
end;
$$;
revoke all on function public.set_store_product_updated_at() from public, anon, authenticated;
create trigger set_store_product_updated_at
  before update on public.store_products
  for each row execute function public.set_store_product_updated_at();
