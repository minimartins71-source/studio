import { Link } from '@tanstack/react-router'

export function SiteFooter() {
  return (
    <footer className="border-t">
      <div className="mx-auto flex max-w-5xl flex-col gap-3 px-4 py-8 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
        <p>© 2026 Studio</p>
        <nav className="flex flex-wrap gap-x-6 gap-y-2">
          <Link to="/mentions-legales" className="hover:text-foreground">
            Mentions légales
          </Link>
          <Link to="/remboursement" className="hover:text-foreground">
            Conditions de remboursement
          </Link>
        </nav>
      </div>
    </footer>
  )
}
