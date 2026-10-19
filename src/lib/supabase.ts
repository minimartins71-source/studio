import { createClient } from '@supabase/supabase-js'

// Clé « publishable » : prévue pour le navigateur. Les données restent
// protégées par les règles de sécurité (RLS) de la base.
// On ne garde que https://xxxx.supabase.co, même si l'adresse copiée finit par /rest/v1/
export const supabase = createClient(
  new URL(import.meta.env.VITE_SUPABASE_URL).origin,
  import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
)
