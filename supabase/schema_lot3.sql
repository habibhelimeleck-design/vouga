-- ============================================================
-- VOU GA — Lot 3 : Trajets
-- ============================================================

create table public.trips (
  id               uuid default gen_random_uuid() primary key,
  traveler_id      uuid references public.profiles(id) on delete cascade not null,
  origin_city      text not null,
  destination_city text not null,
  departure_date   date not null,
  arrival_date     date,
  transport_mode   text not null default 'road'
                     check (transport_mode in ('road', 'air', 'sea')),
  max_weight_kg    numeric(6,2) not null check (max_weight_kg > 0),
  notes            text,
  whatsapp         text not null,
  status           text not null default 'active'
                     check (status in ('active', 'full', 'completed', 'cancelled')),
  created_at       timestamptz not null default now()
);

-- Index pour les recherches fréquentes
create index trips_status_departure_idx on public.trips (status, departure_date);
create index trips_origin_dest_idx      on public.trips (origin_city, destination_city);
create index trips_traveler_idx         on public.trips (traveler_id);

-- RLS
alter table public.trips enable row level security;

create policy "Trajets actifs visibles par tous les connectés"
  on public.trips for select
  using (auth.role() = 'authenticated');

create policy "Voyageur crée ses propres trajets"
  on public.trips for insert
  with check (auth.uid() = traveler_id);

create policy "Voyageur modifie ses propres trajets"
  on public.trips for update
  using (auth.uid() = traveler_id);

create policy "Voyageur supprime ses propres trajets"
  on public.trips for delete
  using (auth.uid() = traveler_id);