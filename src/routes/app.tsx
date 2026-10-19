import { useState } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { AlertCircle, RotateCcw } from 'lucide-react'
import { WeekForm } from '@/components/engine/week-form'
import { WeekResult } from '@/components/engine/week-result'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import type { GenerateInput, WeekPlan } from '@/lib/week-plan'

export const Route = createFileRoute('/app')({
  component: AppPage,
})

const EMPTY: GenerateInput = { theme: '', network: 'Instagram', style: 'Naturel' }

function AppPage() {
  const [input, setInput] = useState<GenerateInput>(EMPTY)
  const [plan, setPlan] = useState<WeekPlan | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function generate(values: GenerateInput) {
    setInput(values)
    setLoading(true)
    setError(null)
    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      })
      const data = await response.json().catch(() => ({}))
      if (!response.ok) throw new Error(data.error ?? 'Une erreur est survenue. Réessaie.')
      setPlan(data.plan)
      window.scrollTo({ top: 0 })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue. Réessaie.')
    } finally {
      setLoading(false)
    }
  }

  const errorAlert = error && (
    <Alert variant="destructive">
      <AlertCircle aria-hidden />
      <AlertTitle>Ta semaine n’a pas pu être préparée</AlertTitle>
      <AlertDescription>{error}</AlertDescription>
    </Alert>
  )

  if (plan) {
    return (
      <section className="mx-auto max-w-6xl px-4 py-8 sm:py-12">
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight">Ta semaine est prête</h1>
            <p className="mt-1 text-muted-foreground">
              {input.network} · Style {input.style.toLowerCase()}
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => setPlan(null)} disabled={loading}>
              Modifier mes réponses
            </Button>
            <Button onClick={() => generate(input)} disabled={loading}>
              <RotateCcw aria-hidden className={loading ? 'animate-spin' : undefined} />
              Refaire
            </Button>
          </div>
        </div>
        {errorAlert && <div className="mb-6">{errorAlert}</div>}
        <WeekResult plan={plan} />
      </section>
    )
  }

  return (
    <section className="mx-auto max-w-xl px-4 py-10 sm:py-16">
      <h1 className="text-3xl font-semibold tracking-tight">Prépare ta semaine</h1>
      <p className="mt-2 text-muted-foreground">
        Réponds à 3 questions. Studio s’occupe du reste.
      </p>
      <Card className="mt-8">
        <CardContent>
          <WeekForm initial={input} loading={loading} onSubmit={generate} />
        </CardContent>
      </Card>
      {errorAlert && <div className="mt-6">{errorAlert}</div>}
    </section>
  )
}
