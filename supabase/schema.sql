-- Studio : une ligne par semaine générée, pour compter la limite mensuelle.
create table public.generations (
  id bigint generated always as identity primary key,
  user_id uuid not null references auth.users (id) on delete cascade,
  created_at timestamptz not null default now()
);

create index generations_user_created_idx
  on public.generations (user_id, created_at);

-- Sécurité : chaque client ne voit que ses propres lignes.
-- Aucune règle d'écriture : seul le serveur (clé secrète) peut ajouter ou supprimer.
alter table public.generations enable row level security;

create policy "Chaque client voit ses propres générations"
  on public.generations for select
  to authenticated
  using ((select auth.uid()) = user_id);
