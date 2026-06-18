import Link from 'next/link'
import { cn } from '@/lib/utils'

interface Chip {
  label: string
  href: string
}

interface Props {
  chips: Chip[]
  activeLabel?: string
  title?: string
}

export function FilterChips({ chips, activeLabel, title }: Props) {
  return (
    <div className="space-y-2">
      {title && (
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide">{title}</p>
      )}
      {/* chips-scroll enables no-scrollbar horizontal scroll on mobile */}
      <div className="chips-scroll">
        {chips.map((chip) => (
          <Link
            key={chip.label}
            href={chip.href}
            className={cn(
              'shrink-0 px-3 py-1.5 rounded-full text-sm border transition-colors shadow-sm',
              chip.label === activeLabel
                ? 'bg-green-600 text-white border-green-600 shadow-green-200'
                : 'bg-white text-gray-700 border-green-100 hover:border-green-400 hover:bg-green-50'
            )}
          >
            {chip.label}
          </Link>
        ))}
      </div>
    </div>
  )
}
