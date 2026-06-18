import Link from 'next/link'
import { UtensilsCrossed } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="max-w-md mx-auto px-4 py-24 text-center space-y-4">
      <UtensilsCrossed size={40} className="mx-auto text-green-300" />
      <h1 className="text-xl font-bold text-gray-700">Recipe not found</h1>
      <p className="text-gray-400 text-sm">
        This recipe doesn&apos;t exist or may have been removed.
      </p>
      <Link
        href="/"
        className="inline-block px-5 py-2 rounded-full bg-green-600 text-white text-sm font-medium hover:bg-green-700 transition-colors"
      >
        Back to Home
      </Link>
    </div>
  )
}
