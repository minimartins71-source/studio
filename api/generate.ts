import { createClient } from '@supabase/supabase-js'
import OpenAI from 'openai'
import { zodTextFormat } from 'openai/helpers/zod'
import { MONTHLY_LIMIT, startOfMonth } from '../src/lib/limits.js'
import { DAYS, GenerateInput, WeekPlan } from '../src/lib/week-plan.js'

// Modèle le moins cher d'OpenAI : environ 0,2 centime par semaine générée
const MODEL = 'gpt-6-luna'

const INSTRUCTIONS = `Tu es un expert des réseaux sociaux pour les particuliers.
Tu prépares un calendrier de 7 publications photo, une par jour du lundi au dimanche, pour quelqu'un qui ne sait jamais quoi poster.
Règles :
- Chaque photo se fait seul, avec un smartphone, sans matériel, en moins de 15 minutes.
- Varie les types de photo : portrait, détail, ambiance, coulisses, objet, lieu, avant/après.
- La légende est en français, au style demandé, adaptée au réseau, 1 à 3 phrases, et se termine par une question ou une invitation à réagir.
- 3 à 6 hashtags pertinents, chacun commençant par #.
- L'heure conseillée suit les habitudes du réseau en France, au format HH:MM.
- Ne promets jamais de résultat chiffré (abonnés, vues, likes).`

function json(data: unknown, status = 200) {
  return Response.json(data, { status })
}

export async function POST(request: Request) {
  const apiKey = process.env.OPENAI_API_KEY
  const supabaseUrl = process.env.VITE_SUPABASE_URL
  const secretKey = process.env.SUPABASE_SECRET_KEY
  if (!apiKey || !supabaseUrl || !secretKey) {
    console.error('Variable d’environnement manquante')
    return json({ error: 'Le service est mal configuré. Réessaie plus tard.' }, 500)
  }

  // 1. Qui demande ? Le navigateur envoie le jeton de connexion du client.
  const token = request.headers.get('authorization')?.replace(/^Bearer /, '')
  // On ne garde que https://xxxx.supabase.co, même si l'adresse copiée finit par /rest/v1/
  const supabase = createClient(new URL(supabaseUrl).origin, secretKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  })
  const { data: auth } = token ? await supabase.auth.getUser(token) : { data: null }
  const userId = auth?.user?.id
  if (!userId) {
    return json({ error: 'Connecte-toi pour préparer ta semaine.' }, 401)
  }

  const parsed = GenerateInput.safeParse(await request.json().catch(() => null))
  if (!parsed.success) {
    return json({ error: 'Décris ton compte en quelques mots (3 caractères minimum).' }, 400)
  }
  const { theme, network, style } = parsed.data

  // 2. Limite mensuelle : on compte les semaines déjà générées ce mois-ci.
  const { count, error: countError } = await supabase
    .from('generations')
    .select('id', { count: 'exact', head: true })
    .eq('user_id', userId)
    .gte('created_at', startOfMonth().toISOString())
  if (countError) {
    console.error('Erreur Supabase (comptage)', countError)
    return json({ error: 'Le service est indisponible. Réessaie dans un instant.' }, 500)
  }
  const used = count ?? 0
  if (used >= MONTHLY_LIMIT) {
    return json(
      { error: `Tu as utilisé tes ${MONTHLY_LIMIT} semaines ce mois-ci. Rendez-vous le 1er du mois prochain.` },
      429,
    )
  }

  // 3. On réserve la génération avant d'appeler l'IA, et on l'annule en cas d'échec.
  const { data: reservation, error: insertError } = await supabase
    .from('generations')
    .insert({ user_id: userId })
    .select('id')
    .single()
  if (insertError) {
    console.error('Erreur Supabase (réservation)', insertError)
    return json({ error: 'Le service est indisponible. Réessaie dans un instant.' }, 500)
  }
  const cancel = () => supabase.from('generations').delete().eq('id', reservation.id)

  try {
    const openai = new OpenAI({ apiKey })
    const response = await openai.responses.parse({
      model: MODEL,
      instructions: INSTRUCTIONS,
      input: `Réseau : ${network}\nStyle : ${style}\nMon compte : ${theme}`,
      text: { format: zodTextFormat(WeekPlan, 'week_plan') },
      max_output_tokens: 6000,
    })

    const plan = response.output_parsed
    if (!plan || plan.posts.length !== DAYS.length) {
      await cancel()
      return json({ error: "La semaine n'est pas complète. Réessaie." }, 502)
    }

    // Remet les jours dans l'ordre et nettoie les hashtags
    plan.posts.sort((a, b) => DAYS.indexOf(a.day) - DAYS.indexOf(b.day))
    for (const post of plan.posts) {
      post.hashtags = post.hashtags.map((tag) => '#' + tag.replace(/^#+/, '').replace(/\s+/g, ''))
    }

    return json({ plan, used: used + 1, limit: MONTHLY_LIMIT })
  } catch (error) {
    console.error('Erreur OpenAI', error)
    await cancel()
    return json({ error: 'Le service IA ne répond pas. Réessaie dans un instant.' }, 502)
  }
}
