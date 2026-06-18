import type { Metadata } from 'next'
import { Geist } from 'next/font/google'
import './globals.css'
import { FavoritesProvider } from '@/context/FavoritesContext'
import { LanguageProvider } from '@/context/LanguageContext'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'

const geist = Geist({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Cuisine World — Explore Recipes',
  description: 'Discover thousands of recipes from around the world. Browse by course, cuisine, or difficulty.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={geist.className}>
      <body className="min-h-screen bg-gray-50 text-gray-900 antialiased">
        <LanguageProvider>
          <FavoritesProvider>
            <Header />
            <main className="min-h-[calc(100vh-4rem)]">
              {children}
            </main>
            <Footer />
          </FavoritesProvider>
        </LanguageProvider>
      </body>
    </html>
  )
}
