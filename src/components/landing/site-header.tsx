import { Link } from '@tanstack/react-router'
import { Button } from '@/components/ui/button'

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-10 border-b bg-background/90 backdrop-blur">
      <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-4">
        <Link to="/" className="text-lg font-semibold tracking-tight">
          Studio
        </Link>
        <Button asChild>
          <a href="#prix">Commencer</a>
        </Button>
      </div>
    </header>
  )
}
