-- ============================================================
-- VOU GA — Supabase Schema (à exécuter dans SQL Editor)
-- ============================================================

-- ── Profiles ──────────────────────────────────────────────
create table public.profiles (
  id                  uuid references auth.users(id) on delete cascade primary key,
  type                text not null default 'individual'
                        check (type in ('individual', 'company')),
  full_name           text not null default '',
  phone               text,
  whatsapp            text not null default '',
  avatar_url          text,
  company_name        text,
  company_reg         text,
  verification_status text not null default 'pending'
                        check (verification_status in ('pending', 'submitted', 'verified', 'rejected')),
  verification_note   text,
  is_admin            boolean not null default false,
  rating              numeric(3,2) not null default 0,
  review_count        integer not null default 0,
  created_at          timestamptz not null default now(),
  updated_at          timestamptz not null default now()
);

-- RLS
alter table public.profiles enable row level security;

create policy "Profiles visibles par tous"
  on public.profiles for select using (true);

create policy "Utilisateur modifie son propre profil"
  on public.profiles for update using (auth.uid() = id);

-- Trigger : crée le profil à l'inscription
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, full_name, whatsapp, type, company_name)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'full_name', ''),
    coalesce(new.raw_user_meta_data->>'whatsapp', ''),
    coalesce(new.raw_user_meta_data->>'type', 'individual'),
    new.raw_user_meta_data->>'company_name'
  );
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ── Documents ─────────────────────────────────────────────
create table public.documents (
  id          uuid default gen_random_uuid() primary key,
  profile_id  uuid references public.profiles(id) on delete cascade not null,
  type        text not null
                check (type in ('id_card', 'passport', 'company_reg', 'selfie')),
  file_url    text not null,
  status      text not null default 'pending'
                check (status in ('pending', 'approved', 'rejected')),
  admin_note  text,
  created_at  timestamptz not null default now()
);

alter table public.documents enable row level security;

create policy "Utilisateur voit ses propres documents"
  on public.documents for select using (auth.uid() = profile_id);

create policy "Utilisateur insère ses propres documents"
  on public.documents for insert with check (auth.uid() = profile_id);

-- ── Storage bucket ─────────────────────────────────────────
-- À créer dans Storage → New bucket :
--   Name : documents
--   Public : true (ou false si vous gérez les URLs signées)
--
-- Policy RLS storage (dans Policies du bucket) :
--   INSERT : (auth.uid())::text = (storage.foldername(name))[1]
--   SELECT : true (si bucket public)

-- ── Prochaines tables (Lot 3+) ────────────────────────────
-- trips, parcel_requests, bookings, parcels, parcel_events, reviews
-- → seront ajoutées dans supabase/schema_lot3.sql