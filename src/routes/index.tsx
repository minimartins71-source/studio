import { createFileRoute, Link } from '@tanstack/react-router'
import { Check } from 'lucide-react'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

export const Route = createFileRoute('/')({
  component: HomePage,
})

const steps = [
  {
    title: 'Décris ton compte.',
    text: 'Ton thème, ton style, ce que tu veux montrer. Une minute suffit.',
  },
  {
    title: 'Studio prépare ta semaine.',
    text: 'Sept publications, une par jour, avec la photo à faire et le texte à copier.',
  },
  {
    title: 'Publie.',
    text: 'Suis ton calendrier, jour après jour. Plus besoin de chercher.',
  },
]

const included = [
  '8 semaines de publications par mois',
  "Pour chaque publication : l'idée de photo, la légende et les hashtags",
  "L'heure conseillée pour publier",
  'Sans engagement : tu annules en un clic',
]

const faq = [
  {
    q: 'Pour quels réseaux ?',
    a: 'Instagram, TikTok et Facebook. Les idées marchent partout où l’on poste des photos.',
  },
  {
    q: 'Je dois savoir faire de belles photos ?',
    a: 'Non. Chaque idée t’explique quoi photographier avec ton téléphone, et comment.',
  },
  {
    q: 'Je peux annuler quand je veux ?',
    a: 'Oui, depuis ton espace client. Tu gardes l’accès jusqu’à la fin du mois payé.',
  },
  {
    q: 'Et si une idée ne me plaît pas ?',
    a: 'Tu régénères ta semaine. Tu as 8 semaines par mois, de quoi refaire sans compter.',
  },
]

function HomePage() {
  return (
    <>
      <section className="mx-auto max-w-3xl px-4 pt-16 pb-20 text-center sm:pt-24 sm:pb-28">
        <h1 className="text-4xl font-semibold tracking-tight text-balance sm:text-6xl">
          Tes publications prêtes pour la semaine,{' '}
          <span className="text-primary">en 2 minutes.</span>
        </h1>
        <p className="mx-auto mt-6 max-w-xl text-lg text-pretty text-muted-foreground">
          Tu ne sais jamais quoi poster ? Décris ton compte. Studio te prépare 7
          publications : la photo à prendre, la légende et l’heure idéale pour
          publier.
        </p>
        <Button asChild size="lg" className="mt-8 h-12 w-full px-6 text-base sm:w-auto">
          <Link to="/inscription">Commencer · 9,99 €/mois</Link>
        </Button>
      </section>

      <section id="comment" className="border-t bg-muted/40">
        <div className="mx-auto max-w-5xl px-4 py-16 sm:py-24">
          <h2 className="text-center text-3xl font-semibold tracking-tight">
            Comment ça marche
          </h2>
          <ol className="mt-10 grid gap-4 sm:grid-cols-3">
            {steps.map((step, i) => (
              <li key={step.title}>
                <Card className="h-full">
                  <CardHeader>
                    <span className="flex size-9 items-center justify-center rounded-full bg-primary text-sm font-semibold text-primary-foreground">
                      {i + 1}
                    </span>
                    <CardTitle className="mt-3 text-lg">{step.title}</CardTitle>
                    <CardDescription className="text-base">
                      {step.text}
                    </CardDescription>
                  </CardHeader>
                </Card>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section id="prix" className="scroll-mt-14 border-t">
        <div className="mx-auto max-w-md px-4 py-16 sm:py-24">
          <h2 className="text-center text-3xl font-semibold tracking-tight">
            Un seul prix, tout compris
          </h2>
          <Card className="mt-10 ring-2 ring-primary">
            <CardHeader>
              <CardTitle className="text-xl">Studio</CardTitle>
              <p className="mt-2">
                <span className="text-4xl font-semibold tracking-tight">9,99 €</span>
                <span className="text-muted-foreground"> par mois</span>
              </p>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {included.map((item) => (
                  <li key={item} className="flex gap-3">
                    <Check className="mt-0.5 size-5 shrink-0 text-primary" aria-hidden />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
            <CardFooter>
              <Button asChild size="lg" className="h-12 w-full text-base">
                <Link to="/inscription">Commencer</Link>
              </Button>
            </CardFooter>
          </Card>
        </div>
      </section>

      <section id="faq" className="border-t bg-muted/40">
        <div className="mx-auto max-w-2xl px-4 py-16 sm:py-24">
          <h2 className="text-center text-3xl font-semibold tracking-tight">
            Questions fréquentes
          </h2>
          <Accordion type="single" collapsible className="mt-10">
            {faq.map((item) => (
              <AccordionItem key={item.q} value={item.q}>
                <AccordionTrigger className="text-base">{item.q}</AccordionTrigger>
                <AccordionContent className="text-base text-muted-foreground">
                  {item.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>
    </>
  )
}
