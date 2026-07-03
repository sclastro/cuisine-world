import Link from 'next/link'
import { SearchX, Compass } from 'lucide-react'
import { LocalizedText } from './LocalizedText'

interface Props {
  // Already-localized message string (callers resolve via useT).
  message: string
}

// Friendly, designed empty state shared by the browse / search / explore grids
// so a no-results view is never a bare grey line. Offers a way forward.
export function EmptyState({ message }: Props) {
  return (
    <div className="text-center py-16 space-y-4">
      <div className="w-16 h-16 rounded-full bg-green-50 dark:bg-green-950/40 flex items-center justify-center mx-auto">
        <SearchX className="text-green-300 dark:text-green-700" size={28} />
      </div>
      <p className="text-gray-400 text-sm max-w-xs mx-auto leading-relaxed">{message}</p>
      <Link
        href="/collections"
        className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-green-600 text-white text-sm font-medium hover:bg-green-700 transition-colors shadow-sm"
      >
        <Compass size={15} />
        <LocalizedText en="Browse collections" zh="睇下精選合集" />
      </Link>
    </div>
  )
}
