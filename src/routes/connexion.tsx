import { createFileRoute } from '@tanstack/react-router'
import { AuthForm } from '@/components/auth/auth-form'

export const Route = createFileRoute('/connexion')({
  component: () => <AuthForm mode="login" />,
})
