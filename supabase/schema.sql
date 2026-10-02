-- ==============================================================================
-- ReturnRadar - Supabase PostgreSQL Schema
-- Includes Row Level Security (RLS), Triggers, Indexes & Sample Seed
-- ==============================================================================

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- 1. Profiles Table
create table if not exists public.profiles (
  id uuid references auth.users on delete cascade primary key,
  email text not null,
  full_name text,
  avatar_url text,
  preferred_currency text default 'USD',
  notify_days_before integer[] default '{7, 3, 1}',
  email_notifications_enabled boolean default true,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 2. Products Table
create table if not exists public.products (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users on delete cascade not null,
  name text not null,
  store text not null,
  category text default 'Other',
  price numeric(10, 2) not null default 0.00,
  currency text default 'USD' not null,
  purchase_date date not null,
  return_period_days integer not null default 30,
  return_deadline date not null,
  warranty_period_months integer default 12,
  warranty_deadline date,
  status text not null default 'active' check (status in ('active', 'expiring_soon', 'expired', 'returned', 'kept')),
  order_number text,
  serial_number text,
  receipt_url text,
  notes text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 3. Notifications Table
create table if not exists public.notifications (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users on delete cascade not null,
  product_id uuid references public.products on delete cascade,
  title text not null,
  message text not null,
  type text not null default 'return_deadline' check (type in ('return_deadline', 'warranty_deadline', 'system')),
  is_read boolean default false not null,
  deadline_date date,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- ==============================================================================
-- Indexes for Performance
-- ==============================================================================
create index if not exists products_user_id_idx on public.products(user_id);
create index if not exists products_return_deadline_idx on public.products(return_deadline);
create index if not exists products_status_idx on public.products(status);
create index if not exists notifications_user_id_idx on public.notifications(user_id);
create index if not exists notifications_is_read_idx on public.notifications(is_read);

-- ==============================================================================
-- Row Level Security (RLS)
-- ==============================================================================
alter table public.profiles enable row level security;
alter table public.products enable row level security;
alter table public.notifications enable row level security;

-- Profiles Policies
create policy "Users can view own profile" 
  on public.profiles for select 
  using (auth.uid() = id);

create policy "Users can update own profile" 
  on public.profiles for update 
  using (auth.uid() = id);

create policy "Users can insert own profile" 
  on public.profiles for insert 
  with check (auth.uid() = id);

-- Products Policies
create policy "Users can view own products" 
  on public.products for select 
  using (auth.uid() = user_id);

create policy "Users can insert own products" 
  on public.products for insert 
  with check (auth.uid() = user_id);

create policy "Users can update own products" 
  on public.products for update 
  using (auth.uid() = user_id);

create policy "Users can delete own products" 
  on public.products for delete 
  using (auth.uid() = user_id);

-- Notifications Policies
create policy "Users can view own notifications" 
  on public.notifications for select 
  using (auth.uid() = user_id);

create policy "Users can update own notifications" 
  on public.notifications for update 
  using (auth.uid() = user_id);

create policy "Users can delete own notifications" 
  on public.notifications for delete 
  using (auth.uid() = user_id);

-- ==============================================================================
-- Automated Updated At Trigger Function
-- ==============================================================================
create or replace function public.handle_updated_at()
returns trigger as $$
begin
  new.updated_at = timezone('utc'::text, now());
  return new;
end;
$$ language plpgsql;

create trigger on_products_updated
  before update on public.products
  for each row execute procedure public.handle_updated_at();

create trigger on_profiles_updated
  before update on public.profiles
  for each row execute procedure public.handle_updated_at();

-- Auto-create profile on signup trigger
create or replace function public.handle_new_user() 
returns trigger as $$
begin
  insert into public.profiles (id, email, full_name, avatar_url)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1)),
    new.raw_user_meta_data->>'avatar_url'
  );
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
