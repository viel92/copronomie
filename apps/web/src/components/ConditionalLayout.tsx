'use client'

import { usePathname } from 'next/navigation'
import { Layout } from './Layout'

interface ConditionalLayoutProps {
  children: React.ReactNode
}

// Pages qui ne doivent PAS avoir la sidebar/navbar
const AUTH_ROUTES = [
  '/auth/login',
  '/auth/register', 
  '/auth/forgot-password',
  '/auth/reset-password',
  '/auth/verify-email'
]

export function ConditionalLayout({ children }: ConditionalLayoutProps) {
  const pathname = usePathname()
  
  // Si on est sur une page d'authentification, pas de Layout
  if (AUTH_ROUTES.some(route => pathname.startsWith(route))) {
    return <>{children}</>
  }
  
  // Sinon, on utilise le Layout complet
  return <Layout>{children}</Layout>
}