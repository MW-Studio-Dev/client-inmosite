// app/(auth)/layout.tsx
'use client'

import { AuthProvider } from '@/providers/AuthProvider'

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <AuthProvider>
      {children}
    </AuthProvider>
  )
}