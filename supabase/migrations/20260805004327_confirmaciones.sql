-- Esquema de Supabase para el RSVP. Ejecútalo en el SQL Editor del proyecto.

create table if not exists confirmaciones (
  id            uuid primary key default gen_random_uuid(),
  nombre        text not null,
  asiste        boolean not null default true,
  asistentes    int not null default 1 check (asistentes >= 0 and asistentes <= 20),
  restriccion   text,
  mensaje       text,
  confirmado_at timestamptz not null default now()
);

-- RLS: los invitados solo pueden INSERTAR su confirmación, nunca leer las de otros.
alter table confirmaciones enable row level security;

drop policy if exists "insert publico" on confirmaciones;
create policy "insert publico"
  on confirmaciones
  for insert
  to anon
  with check (true);

-- (Opcional) Para leer las confirmaciones desde el panel, usa la service key
-- o crea una política de select restringida a usuarios autenticados.
