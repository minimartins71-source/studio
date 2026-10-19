import { useState } from 'react'
import { Link, useNavigate } from '@tanstack/react-router'
import { AlertCircle } from 'lucide-react'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Spinner } from '@/components/ui/spinner'
import { supabase } from '@/lib/supabase'

const ERRORS: Record<string, string> = {
  invalid_credentials: 'Email ou mot de passe incorrect.',
  user_already_exists: 'Un compte existe déjà avec cet email. Connecte-toi.',
  weak_password: 'Mot de passe trop faible : 8 caractères minimum.',
  email_address_invalid: 'Cette adresse email n’est pas valide.',
  over_email_send_rate_limit: 'Trop de tentatives. Réessaie dans quelques minutes.',
  over_request_rate_limit: 'Trop de tentatives. Réessaie dans quelques minutes.',
}

type AuthFormProps = { mode: 'signup' | 'login' }

export function AuthForm({ mode }: AuthFormProps) {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [notice, setNotice] = useState<string | null>(null)
  const isSignup = mode === 'signup'

  async function submit(event: React.FormEvent) {
    event.preventDefault()
    setLoading(true)
    setError(null)
    const { data, error } = isSignup
      ? await supabase.auth.signUp({ email, password })
      : await supabase.auth.signInWithPassword({ email, password })
    setLoading(false)
    if (error) {
      setError(ERRORS[error.code ?? ''] ?? 'Une erreur est survenue. Réessaie.')
      return
    }
    if (data.session) {
      navigate({ to: '/app' })
    } else {
      setNotice('Compte créé. Ouvre l’email que tu viens de recevoir pour le confirmer.')
    }
  }

  return (
    <section className="mx-auto max-w-md px-4 py-10 sm:py-16">
      <h1 className="text-3xl font-semibold tracking-tight">
        {isSignup ? 'Crée ton compte' : 'Content de te revoir'}
      </h1>
      <p className="mt-2 text-muted-foreground">
        {isSignup
          ? 'Ton email et un mot de passe. C’est tout.'
          : 'Connecte-toi pour retrouver ta semaine.'}
      </p>
      <Card className="mt-8">
        <CardContent>
          {notice ? (
            <p>{notice}</p>
          ) : (
            <form className="space-y-6" onSubmit={submit}>
              <div className="space-y-2">
                <Label htmlFor="email" className="text-base">
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  autoComplete="email"
                  required
                  className="h-11 text-base"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password" className="text-base">
                  Mot de passe
                </Label>
                <Input
                  id="password"
                  type="password"
                  autoComplete={isSignup ? 'new-password' : 'current-password'}
                  required
                  minLength={8}
                  className="h-11 text-base"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                />
                {isSignup && (
                  <p className="text-sm text-muted-foreground">8 caractères minimum.</p>
                )}
              </div>
              {error && (
                <Alert variant="destructive">
                  <AlertCircle aria-hidden />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
              <Button type="submit" size="lg" className="h-12 w-full text-base" disabled={loading}>
                {loading && <Spinner />}
                {isSignup ? 'Créer mon compte' : 'Se connecter'}
              </Button>
            </form>
          )}
        </CardContent>
      </Card>
      <p className="mt-6 text-center text-sm text-muted-foreground">
        {isSignup ? 'Déjà un compte ? ' : 'Pas encore de compte ? '}
        <Link
          to={isSignup ? '/connexion' : '/inscription'}
          className="font-medium text-primary underline-offset-4 hover:underline"
        >
          {isSignup ? 'Se connecter' : 'Créer un compte'}
        </Link>
      </p>
    </section>
  )
}
