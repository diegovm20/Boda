-- Hay dos invitaciones que escriben en esta misma tabla:
--   'pareja' → la de siempre (/), invitado + acompañante, 2 lugares.
--   'solo'   → la individual (/individual), un solo invitado, 1 lugar.
-- El default backfillea las filas existentes, que todas vienen de la de pareja.
alter table confirmaciones
  add column if not exists origen text not null default 'pareja';

alter table confirmaciones
  drop constraint if exists confirmaciones_origen_check;

alter table confirmaciones
  add constraint confirmaciones_origen_check
  check (origen in ('pareja', 'solo'));
