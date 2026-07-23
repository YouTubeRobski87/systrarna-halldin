create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  order_number text not null unique,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  customer_name text not null,
  customer_email text not null,
  customer_phone text not null,
  address text not null,
  postal_code text not null,
  city text not null,
  items jsonb not null,
  subtotal numeric(10, 2) not null check (subtotal >= 0),
  shipping_cost numeric(10, 2) not null default 0 check (shipping_cost >= 0),
  total numeric(10, 2) not null check (total >= 0),
  payment_method text not null check (payment_method in ('swish')),
  payment_status text not null default 'pending' check (payment_status in ('pending', 'paid')),
  order_status text not null default 'new' check (order_status in ('new', 'packing', 'shipped', 'cancelled')),
  customer_message text not null default ''
);

alter table public.orders enable row level security;
revoke all on table public.orders from anon, authenticated;

create or replace function public.set_orders_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists orders_set_updated_at on public.orders;
create trigger orders_set_updated_at before update on public.orders
for each row execute function public.set_orders_updated_at();

revoke all on function public.set_orders_updated_at() from public;
