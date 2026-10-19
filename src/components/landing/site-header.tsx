import { Link, useNavigate } from '@tanstack/react-router'
import { Button } from '@/components/ui/button'
import { supabase } from '@/lib/supabase'
import { useSession } from '@/lib/use-session'

export function SiteHeader() {
  const session = useSession()
  const navigate = useNavigate()

  async function signOut() {
    await supabase.auth.signOut()
    navigate({ to: '/' })
  }

  return (
    <header className="sticky top-0 z-10 border-b bg-background/90 backdrop-blur">
      <div className="mx-auto flex h-14 max-w-5xl items-center justify-between gap-2 px-4">
        <Link to="/" className="text-lg font-semibold tracking-tight">
          Studio
        </Link>
        <nav className="flex items-center gap-1">
          {session ? (
            <>
              <Button variant="ghost" onClick={signOut}>
                Se déconnecter
              </Button>
              <Button asChild>
                <Link to="/app">Mon espace</Link>
              </Button>
            </>
          ) : (
            <>
              <Button variant="ghost" asChild>
                <Link to="/connexion">Se connecter</Link>
              </Button>
              <Button asChild>
                <Link to="/inscription">Commencer</Link>
              </Button>
            </>
          )}
        </nav>
      </div>
    </header>
  )
}
