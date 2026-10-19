import { createClient } from '@supabase/supabase-js'

// Clé « publishable » : prévue pour le navigateur. Les données restent
// protégées par les règles de sécurité (RLS) de la base.
export const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
)
