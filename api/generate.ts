import OpenAI from 'openai'
import { zodTextFormat } from 'openai/helpers/zod'
import { DAYS, GenerateInput, WeekPlan } from '../src/lib/week-plan'

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
  if (!apiKey) {
    console.error('OPENAI_API_KEY manquante')
    return json({ error: 'Le service est mal configuré. Réessaie plus tard.' }, 500)
  }

  const parsed = GenerateInput.safeParse(await request.json().catch(() => null))
  if (!parsed.success) {
    return json({ error: 'Décris ton compte en quelques mots (3 caractères minimum).' }, 400)
  }
  const { theme, network, style } = parsed.data

  // La limite de 8 semaines par mois et par client sera vérifiée ici à l'étape 4,
  // quand les comptes clients existeront.

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
      return json({ error: "La semaine n'est pas complète. Réessaie." }, 502)
    }

    // Remet les jours dans l'ordre et nettoie les hashtags
    plan.posts.sort((a, b) => DAYS.indexOf(a.day) - DAYS.indexOf(b.day))
    for (const post of plan.posts) {
      post.hashtags = post.hashtags.map((tag) => '#' + tag.replace(/^#+/, '').replace(/\s+/g, ''))
    }

    return json({ plan })
  } catch (error) {
    console.error('Erreur OpenAI', error)
    return json({ error: 'Le service IA ne répond pas. Réessaie dans un instant.' }, 502)
  }
}
