// Nombre de semaines qu'un client peut générer par mois calendaire
export const MONTHLY_LIMIT = 8

export function startOfMonth(now = new Date()) {
  return new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1))
}
