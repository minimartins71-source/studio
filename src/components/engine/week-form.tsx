import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { NativeSelect, NativeSelectOption } from '@/components/ui/native-select'
import { Spinner } from '@/components/ui/spinner'
import { Textarea } from '@/components/ui/textarea'
import { NETWORKS, STYLES, type GenerateInput } from '@/lib/week-plan'

type WeekFormProps = {
  initial: GenerateInput
  loading: boolean
  onSubmit: (input: GenerateInput) => void
}

export function WeekForm({ initial, loading, onSubmit }: WeekFormProps) {
  const [values, setValues] = useState(initial)

  return (
    <form
      className="space-y-6"
      onSubmit={(event) => {
        event.preventDefault()
        onSubmit(values)
      }}
    >
      <div className="space-y-2">
        <Label htmlFor="theme" className="text-base">
          De quoi parle ton compte ?
        </Label>
        <Textarea
          id="theme"
          required
          minLength={3}
          maxLength={500}
          rows={4}
          className="text-base"
          placeholder="Ex. : je cuisine des recettes végétariennes simples, chez moi, pour les gens pressés."
          value={values.theme}
          onChange={(event) => setValues({ ...values, theme: event.target.value })}
        />
        <p className="text-right text-sm text-muted-foreground">
          {values.theme.length}/500
        </p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="network" className="text-base">
            Réseau
          </Label>
          <NativeSelect
            id="network"
            className="w-full [&_select]:h-11 [&_select]:text-base"
            value={values.network}
            onChange={(event) =>
              setValues({ ...values, network: event.target.value as GenerateInput['network'] })
            }
          >
            {NETWORKS.map((network) => (
              <NativeSelectOption key={network} value={network}>
                {network}
              </NativeSelectOption>
            ))}
          </NativeSelect>
        </div>

        <div className="space-y-2">
          <Label htmlFor="style" className="text-base">
            Ton style
          </Label>
          <NativeSelect
            id="style"
            className="w-full [&_select]:h-11 [&_select]:text-base"
            value={values.style}
            onChange={(event) =>
              setValues({ ...values, style: event.target.value as GenerateInput['style'] })
            }
          >
            {STYLES.map((style) => (
              <NativeSelectOption key={style} value={style}>
                {style}
              </NativeSelectOption>
            ))}
          </NativeSelect>
        </div>
      </div>

      <Button type="submit" size="lg" className="h-12 w-full text-base" disabled={loading}>
        {loading ? (
          <>
            <Spinner /> Studio prépare ta semaine…
          </>
        ) : (
          'Préparer ma semaine'
        )}
      </Button>
    </form>
  )
}
