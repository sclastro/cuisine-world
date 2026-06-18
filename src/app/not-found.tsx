import Link from 'next/link'
import { UtensilsCrossed, Search } from 'lucide-react'

export default function GlobalNotFound() {
  return (
    <div className="max-w-md mx-auto px-4 py-24 text-center space-y-6 animate-fade-up">
      <div className="relative w-24 h-24 mx-auto">
        <div className="w-24 h-24 rounded-full bg-green-50 flex items-center justify-center">
          <UtensilsCrossed size={40} className="text-green-300" />
        </div>
        <div className="absolute -bottom-1 -right-1 w-9 h-9 rounded-full bg-amber-100 flex items-center justify-center border-2 border-white">
          <span className="text-lg">404</span>
        </div>
      </div>
      <div className="space-y-2">
        <h1 className="text-xl font-bold text-gray-700">Page not found</h1>
        <p className="text-gray-400 text-sm leading-relaxed">
          Looks like this dish isn&apos;t on the menu.<br />
          Try searching for something else.
        </p>
      </div>
      <div className="flex items-center justify-center gap-3">
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-green-600 text-white text-sm font-medium hover:bg-green-700 transition-colors"
        >
          Back to Home
        </Link>
        <Link
          href="/search"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-gray-200 text-gray-600 text-sm font-medium hover:border-green-300 hover:text-green-700 transition-colors"
        >
          <Search size={14} />
          Search Recipes
        </Link>
      </div>
    </div>
  )
}
