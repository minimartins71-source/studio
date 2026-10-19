import { z } from 'zod'

// Ce que le client remplit dans le formulaire
export const NETWORKS = ['Instagram', 'TikTok', 'Facebook'] as const
export const STYLES = ['Naturel', 'Élégant', 'Drôle', 'Inspirant'] as const

export const GenerateInput = z.object({
  theme: z.string().trim().min(3).max(500),
  network: z.enum(NETWORKS),
  style: z.enum(STYLES),
})
export type GenerateInput = z.infer<typeof GenerateInput>

// Ce que l'IA doit rendre : 7 publications, du lundi au dimanche
export const DAYS = [
  'Lundi',
  'Mardi',
  'Mercredi',
  'Jeudi',
  'Vendredi',
  'Samedi',
  'Dimanche',
] as const

export const Post = z.object({
  day: z.enum(DAYS),
  time: z.string().describe('Heure conseillée, format HH:MM'),
  idea: z.string().describe("L'idée de photo, 8 mots maximum"),
  shot: z.string().describe('Comment prendre la photo au téléphone, une phrase'),
  caption: z.string().describe('La légende à copier, 1 à 3 phrases'),
  hashtags: z.array(z.string()).describe('3 à 6 hashtags commençant par #'),
})
export type Post = z.infer<typeof Post>

export const WeekPlan = z.object({
  posts: z.array(Post),
})
export type WeekPlan = z.infer<typeof WeekPlan>
