import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/remboursement')({
  component: RefundPage,
})

function RefundPage() {
  return (
    <section className="mx-auto max-w-2xl px-4 py-16">
      <h1 className="text-3xl font-semibold tracking-tight">
        Conditions de remboursement
      </h1>
      <p className="mt-6 text-muted-foreground">Page en cours de rédaction.</p>
    </section>
  )
}
