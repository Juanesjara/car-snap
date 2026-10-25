create table car_sightings (
  id           uuid primary key default gen_random_uuid(),
  created_at   timestamptz default now(),
  photo_url    text not null,  -- ruta dentro del bucket car-photos
  marca        text,
  modelo       text,
  año          integer,
  specs        jsonb,
  latitude     double precision,
  longitude    double precision,
  taken_at     timestamptz,
  source       text check (source in ('camera', 'gallery'))
);

-- RLS activo y SIN políticas: la anon key no puede leer ni escribir nada.
-- Solo el servidor (/api, con la service role key) accede a los datos.
alter table car_sightings enable row level security;

-- Bucket privado: las fotos se sirven con URLs firmadas que expiran.
insert into storage.buckets (id, name, public) values ('car-photos', 'car-photos', false);

-- ── Migración para un proyecto existente ──────────────────────────────
-- drop policy if exists "Public read" on car_sightings;
-- drop policy if exists "Public insert" on car_sightings;
-- update storage.buckets set public = false where id = 'car-photos';
-- Y borra en Storage → Policies cualquier política sobre car-photos.
