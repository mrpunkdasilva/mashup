import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Agora vai versao final 2.2.2',
  description: 'Created with v0',
  generator: 'v0.dev',
}

import { ErrorBoundary } from '@/components/error-boundary'
import { ThemeProvider } from '@/components/theme-provider'
import { Toaster } from '@/components/ui/toaster'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning>
        <ThemeProvider attribute="class" defaultTheme="dark">
          <ErrorBoundary>
            {children}
            <Toaster />
          </ErrorBoundary>
        </ThemeProvider>
      </body>
    </html>
  )
}
