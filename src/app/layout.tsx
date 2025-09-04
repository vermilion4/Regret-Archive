import type { Metadata } from 'next'
import { Fredoka } from 'next/font/google'
import './globals.css'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { AuthProvider } from '@/lib/auth'
import { ProtectedRoute } from '@/components/ProtectedRoute'
import { bungee } from './fonts'

const fredoka = Fredoka({ 
  subsets: ['latin'], 
  weight: ['400', '500', '600', '700'],
  variable: '--font-fredoka'
})

export const metadata: Metadata = {
  title: 'Regret Archive - Share Your Regrets Anonymously',
  description: 'A safe, anonymous platform for sharing regrets and life lessons. Connect with others who understand your experiences.',
  keywords: 'regrets, life lessons, anonymous, community, personal growth',
  authors: [{ name: 'Regret Archive' }],
  openGraph: {
    title: 'Regret Archive - Share Your Regrets Anonymously',
    description: 'A safe, anonymous platform for sharing regrets and life lessons.',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body className={`${fredoka.variable} ${bungee.variable} min-h-screen bg-background text-foreground checker-background`}>
        <AuthProvider>
          <ProtectedRoute>
            <div className="flex min-h-screen flex-col">
              <Header />
              <main className="flex-1">
                {children}
              </main>
              <Footer />
            </div>
          </ProtectedRoute>
        </AuthProvider>
      </body>
    </html>
  )
}
