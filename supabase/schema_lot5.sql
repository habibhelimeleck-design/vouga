-- ============================================================
-- VOU GA — Lot 5 : Bookings + Parcels + Événements
-- ============================================================

-- ── Bookings ──────────────────────────────────────────────
create table public.bookings (
  id                uuid default gen_random_uuid() primary key,
  parcel_request_id uuid references public.parcel_requests(id) on delete cascade not null,
  traveler_id       uuid references public.profiles(id) on delete cascade not null,
  sender_id         uuid references public.profiles(id) on delete cascade not null,
  notes             text,
  status            text not null default 'pending'
                      check (status in ('pending', 'accepted', 'rejected', 'cancelled')),
  created_at        timestamptz not null default now(),
  unique(parcel_request_id, traveler_id)
);

create index bookings_request_idx  on public.bookings (parcel_request_id);
create index bookings_traveler_idx on public.bookings (traveler_id);
create index bookings_sender_idx   on public.bookings (sender_id);

alter table public.bookings enable row level security;

create policy "Voyageur et expéditeur voient leurs bookings"
  on public.bookings for select
  using (auth.uid() = traveler_id or auth.uid() = sender_id);

create policy "Voyageur crée un booking"
  on public.bookings for insert
  with check (auth.uid() = traveler_id);

create policy "Expéditeur met à jour le booking"
  on public.bookings for update
  using (auth.uid() = sender_id or auth.uid() = traveler_id);

-- ── Parcels ───────────────────────────────────────────────
create table public.parcels (
  id                    uuid default gen_random_uuid() primary key,
  booking_id            uuid references public.bookings(id) on delete cascade not null unique,
  parcel_request_id     uuid references public.parcel_requests(id) on delete cascade not null,
  sender_id             uuid references public.profiles(id) on delete cascade not null,
  traveler_id           uuid references public.profiles(id) on delete cascade not null,
  secret_code           text not null,
  status                text not null default 'created'
                          check (status in ('created','accepted','picked_up','in_transit','delivered','dispute')),
  pickup_proof_url      text,
  delivery_proof_url    text,
  pickup_confirmed_at   timestamptz,
  delivery_confirmed_at timestamptz,
  created_at            timestamptz not null default now(),
  updated_at            timestamptz not null default now()
);

create index parcels_sender_idx   on public.parcels (sender_id);
create index parcels_traveler_idx on public.parcels (traveler_id);
create index parcels_status_idx   on public.parcels (status);

alter table public.parcels enable row level security;

create policy "Voyageur et expéditeur voient leur colis"
  on public.parcels for select
  using (auth.uid() = sender_id or auth.uid() = traveler_id);

create policy "Système crée le colis (service role)"
  on public.parcels for insert
  with check (auth.uid() = sender_id or auth.uid() = traveler_id);

create policy "Voyageur ou expéditeur met à jour"
  on public.parcels for update
  using (auth.uid() = sender_id or auth.uid() = traveler_id);

-- ── Parcel Events ─────────────────────────────────────────
create table public.parcel_events (
  id         uuid default gen_random_uuid() primary key,
  parcel_id  uuid references public.parcels(id) on delete cascade not null,
  status     text not null,
  note       text,
  actor_id   uuid references public.profiles(id) not null,
  photo_url  text,
  created_at timestamptz not null default now()
);

create index parcel_events_parcel_idx on public.parcel_events (parcel_id, created_at);

alter table public.parcel_events enable row level security;

create policy "Acteurs du colis voient les événements"
  on public.parcel_events for select
  using (
    exists (
      select 1 from public.parcels p
      where p.id = parcel_id
        and (p.sender_id = auth.uid() or p.traveler_id = auth.uid())
    )
  );

create policy "Acteur insère ses événements"
  on public.parcel_events for insert
  with check (auth.uid() = actor_id);
