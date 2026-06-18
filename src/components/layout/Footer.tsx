import Link from 'next/link'
import { UtensilsCrossed } from 'lucide-react'

export function Footer() {
  return (
    <footer className="border-t border-green-100 bg-white mt-16">
      <div className="max-w-6xl mx-auto px-4 py-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-gray-500">
        <div className="flex items-center gap-2">
          <UtensilsCrossed size={18} className="text-green-600" />
          <span className="font-semibold text-green-800">Cuisine World</span>
        </div>
        <p>
          Recipe data provided by{' '}
          <a
            href="https://www.themealdb.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-green-600 hover:underline"
          >
            TheMealDB
          </a>
        </p>
        <nav className="flex gap-4">
          <Link href="/favorites" className="hover:text-green-700 transition-colors">Favorites</Link>
          <Link href="/menu" className="hover:text-green-700 transition-colors">My Menu</Link>
        </nav>
      </div>
    </footer>
  )
}
