import type { Metadata } from 'next'
import { Fredoka } from 'next/font/google'
import './globals.css'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { AuthProvider } from '@/lib/auth'
import { ProtectedRoute } from '@/components/ProtectedRoute'
import { StructuredData } from '@/components/StructuredData'
import { bungee } from './fonts'

const fredoka = Fredoka({ 
  subsets: ['latin'], 
  weight: ['400', '500', '600', '700'],
  variable: '--font-fredoka'
})

export const metadata: Metadata = {
  title: {
    default: 'Regret Archive - Share Your Regrets Anonymously',
    template: '%s | Regret Archive'
  },
  description: 'A safe, anonymous platform for sharing regrets and life lessons. Connect with others who understand your experiences. Find support, wisdom, and community in shared stories of growth.',
  keywords: [
    'regrets',
    'life lessons',
    'anonymous sharing',
    'community support',
    'personal growth',
    'life experiences',
    'emotional support',
    'wisdom sharing',
    'regret stories',
    'life advice',
    'anonymous stories',
    'personal development'
  ],
  authors: [{ name: 'Adaeze Ndupu' }],
  creator: 'Adaeze Ndupu',
  publisher: 'Adaeze Ndupu',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://regret-archive.appwrite.network'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'Regret Archive - Share Your Regrets Anonymously',
    description: 'A safe, anonymous platform for sharing regrets and life lessons. Connect with others who understand your experiences.',
    url: 'https://regret-archive.appwrite.network',
    siteName: 'Regret Archive',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Regret Archive - Share Your Regrets Anonymously',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Regret Archive - Share Your Regrets Anonymously',
    description: 'A safe, anonymous platform for sharing regrets and life lessons. Connect with others who understand your experiences.',
    images: ['/og-image.png'],
    creator: '@adaezendupu',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  other: {
    'theme-color': '#3b82f6',
    'msapplication-TileColor': '#3b82f6',
    'apple-mobile-web-app-capable': 'yes',
    'apple-mobile-web-app-status-bar-style': 'default',
    'apple-mobile-web-app-title': 'Regret Archive',
    'mobile-web-app-capable': 'yes',
    'format-detection': 'telephone=no',
  },
  verification: {
    google: 'your-google-verification-code',
    yandex: 'your-yandex-verification-code',
    yahoo: 'your-yahoo-verification-code',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
        <meta name="format-detection" content="telephone=no" />
        <meta name="theme-color" content="#3b82f6" />
        <meta name="msapplication-TileColor" content="#3b82f6" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Regret Archive" />
        <meta name="mobile-web-app-capable" content="yes" />
        <link rel="manifest" href="/manifest.json" />
        
        {/* Facebook Open Graph */}
        <meta property="fb:app_id" content="your-facebook-app-id" />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://regret-archive.appwrite.network" />
        <meta property="og:title" content="Regret Archive - Share Your Regrets Anonymously" />
        <meta property="og:description" content="A safe, anonymous platform for sharing regrets and life lessons. Connect with others who understand your experiences." />
        <meta property="og:image" content="https://regret-archive.appwrite.network/og-image.png" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:site_name" content="Regret Archive" />
        <meta property="og:locale" content="en_US" />
        
        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="@adaezendupu" />
        <meta name="twitter:creator" content="@adaezendupu" />
        <meta name="twitter:title" content="Regret Archive - Share Your Regrets Anonymously" />
        <meta name="twitter:description" content="A safe, anonymous platform for sharing regrets and life lessons. Connect with others who understand your experiences." />
        <meta name="twitter:image" content="https://regret-archive.appwrite.network/og-image.png" />
        
        <StructuredData 
          type="website" 
          data={{}} 
        />
        <StructuredData 
          type="organization" 
          data={{}} 
        />
      </head>
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
