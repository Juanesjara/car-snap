create table car_sightings (
  id           uuid primary key default gen_random_uuid(),
  created_at   timestamptz default now(),
  photo_url    text not null,
  marca        text,
  modelo       text,
  año          integer,
  specs        jsonb,
  latitude     double precision,
  longitude    double precision,
  taken_at     timestamptz,
  source       text check (source in ('camera', 'gallery'))
);

-- Enable public read access (adjust RLS to your needs)
alter table car_sightings enable row level security;
create policy "Public read" on car_sightings for select using (true);
create policy "Public insert" on car_sightings for insert with check (true);

-- Storage bucket (run in Supabase dashboard or via CLI)
-- insert into storage.buckets (id, name, public) values ('car-photos', 'car-photos', true);
