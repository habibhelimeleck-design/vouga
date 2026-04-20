-- ============================================================
-- VOU GA — Lot 4 : Demandes colis
-- ============================================================

create table public.parcel_requests (
  id                   uuid default gen_random_uuid() primary key,
  sender_id            uuid references public.profiles(id) on delete cascade not null,
  origin_city          text not null,
  destination_city     text not null,
  weight_kg            numeric(6,2) not null check (weight_kg > 0),
  description          text not null,
  photo_urls           text[] not null default '{}',
  special_instructions text,
  whatsapp             text not null,
  status               text not null default 'open'
                         check (status in ('open', 'matched', 'closed')),
  created_at           timestamptz not null default now()
);

create index parcel_requests_status_idx      on public.parcel_requests (status, created_at desc);
create index parcel_requests_origin_dest_idx on public.parcel_requests (origin_city, destination_city);
create index parcel_requests_sender_idx      on public.parcel_requests (sender_id);

alter table public.parcel_requests enable row level security;

create policy "Demandes visibles par tous les connectés"
  on public.parcel_requests for select
  using (auth.role() = 'authenticated');

create policy "Expéditeur crée ses propres demandes"
  on public.parcel_requests for insert
  with check (auth.uid() = sender_id);

create policy "Expéditeur modifie ses propres demandes"
  on public.parcel_requests for update
  using (auth.uid() = sender_id);

create policy "Expéditeur supprime ses propres demandes"
  on public.parcel_requests for delete
  using (auth.uid() = sender_id);
