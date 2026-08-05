-- El RSVP recoge también el nombre del acompañante (invitación para 2 personas).
alter table confirmaciones
  add column if not exists acompanante text;
