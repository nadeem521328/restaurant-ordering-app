create extension if not exists pgcrypto;

do $$
begin
  create type public.restaurant_status_type as enum ('OPEN', 'CLOSED', 'SOLD_OUT');
exception
  when duplicate_object then null;
end $$;

do $$
begin
  create type public.order_status_type as enum (
    'Pending',
    'Accepted',
    'Out For Delivery',
    'Delivered',
    'Cancelled'
  );
exception
  when duplicate_object then null;
end $$;

do $$
begin
  create type public.payment_method_type as enum ('COD', 'UPI', 'RAZORPAY', 'PHONEPE');
exception
  when duplicate_object then null;
end $$;

create table if not exists public.admins (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null unique references auth.users(id) on delete cascade,
  name text not null,
  created_at timestamptz not null default now()
);

create table if not exists public.menu_items (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  image_url text,
  price integer not null check (price > 0),
  availability boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists public.restaurant_status (
  id integer primary key default 1 check (id = 1),
  status public.restaurant_status_type not null default 'CLOSED',
  message text,
  updated_at timestamptz not null default now(),
  updated_by_admin uuid references public.admins(id)
);

create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  order_number text not null unique,
  customer_name text not null,
  phone text not null check (phone ~ '^[0-9]{10}$'),
  address text not null,
  notes text,
  item_name text not null,
  quantity integer not null check (quantity > 0 and quantity <= 20),
  total_price integer not null check (total_price > 0),
  payment_method public.payment_method_type not null default 'COD',
  status public.order_status_type not null default 'Pending',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  updated_by_admin uuid references public.admins(id)
);

create index if not exists orders_created_at_idx on public.orders (created_at desc);
create index if not exists orders_status_idx on public.orders (status);

create or replace function public.touch_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists orders_touch_updated_at on public.orders;
create trigger orders_touch_updated_at
before update on public.orders
for each row execute function public.touch_updated_at();

drop trigger if exists restaurant_status_touch_updated_at on public.restaurant_status;
create trigger restaurant_status_touch_updated_at
before update on public.restaurant_status
for each row execute function public.touch_updated_at();

create or replace function public.is_admin_user()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.admins
    where user_id = auth.uid()
  );
$$;

alter table public.admins enable row level security;
alter table public.menu_items enable row level security;
alter table public.restaurant_status enable row level security;
alter table public.orders enable row level security;

grant usage on schema public to anon, authenticated, service_role;

grant usage on type public.restaurant_status_type to anon, authenticated, service_role;
grant usage on type public.order_status_type to authenticated, service_role;
grant usage on type public.payment_method_type to service_role;

grant select on public.menu_items to anon;
grant select, insert, update, delete on public.menu_items to authenticated;
grant all on public.menu_items to service_role;

grant select on public.restaurant_status to anon;
grant select, update on public.restaurant_status to authenticated;
grant all on public.restaurant_status to service_role;

grant select on public.admins to authenticated;
grant all on public.admins to service_role;

grant select, update on public.orders to authenticated;
grant all on public.orders to service_role;

drop policy if exists "Admins can read own profile" on public.admins;
create policy "Admins can read own profile"
on public.admins for select
to authenticated
using (user_id = auth.uid());

drop policy if exists "Public can read available menu" on public.menu_items;
create policy "Public can read available menu"
on public.menu_items for select
to anon, authenticated
using (availability = true);

drop policy if exists "Admins can manage menu" on public.menu_items;
create policy "Admins can manage menu"
on public.menu_items for all
to authenticated
using (public.is_admin_user())
with check (public.is_admin_user());

drop policy if exists "Public can read restaurant status" on public.restaurant_status;
create policy "Public can read restaurant status"
on public.restaurant_status for select
to anon, authenticated
using (id = 1);

drop policy if exists "Admins can update restaurant status" on public.restaurant_status;
create policy "Admins can update restaurant status"
on public.restaurant_status for update
to authenticated
using (public.is_admin_user())
with check (public.is_admin_user());

drop policy if exists "Admins can read orders" on public.orders;
create policy "Admins can read orders"
on public.orders for select
to authenticated
using (public.is_admin_user());

drop policy if exists "Admins can update orders" on public.orders;
create policy "Admins can update orders"
on public.orders for update
to authenticated
using (public.is_admin_user())
with check (public.is_admin_user());

insert into public.restaurant_status (id, status, message)
values (1, 'OPEN', 'Fresh roast biryani available today.')
on conflict (id) do nothing;

insert into public.menu_items (name, image_url, price, availability)
values ('Roast Biryani', '/roast-biryani.png', 220, true)
on conflict do nothing;

do $$
begin
  alter publication supabase_realtime add table public.orders;
exception
  when duplicate_object then null;
end $$;

do $$
begin
  alter publication supabase_realtime add table public.restaurant_status;
exception
  when duplicate_object then null;
end $$;
