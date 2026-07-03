import type { Metadata, Viewport } from 'next'
import { Geist } from 'next/font/google'
import './globals.css'
import { FavoritesProvider } from '@/context/FavoritesContext'
import { LanguageProvider } from '@/context/LanguageContext'
import { MenuProvider } from '@/context/MenuContext'
import { ThemeProvider } from '@/context/ThemeContext'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'

// Applies the persisted theme before first paint to avoid a light→dark flash.
const themeScript = `(function(){try{var t=localStorage.getItem('cuisine-world-theme');if(t==='dark')document.documentElement.classList.add('dark')}catch(e){}})()`

const geist = Geist({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: {
    default: 'Cuisine World — Explore Recipes',
    template: '%s — Cuisine World',
  },
  description: 'Discover thousands of recipes from around the world. Browse by course, cuisine, or difficulty.',
  keywords: ['recipes', 'cooking', 'cuisine', 'food', 'meal planner'],
  openGraph: {
    title: 'Cuisine World',
    description: 'Discover thousands of recipes from around the world.',
    type: 'website',
  },
}

export const viewport: Viewport = {
  themeColor: '#16a34a',
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={geist.className} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className="min-h-screen bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100 antialiased transition-colors">
        <ThemeProvider>
          <LanguageProvider>
            <FavoritesProvider>
              <MenuProvider>
                <Header />
                <main className="min-h-[calc(100vh-4rem)]">
                  {children}
                </main>
                <Footer />
              </MenuProvider>
            </FavoritesProvider>
          </LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
