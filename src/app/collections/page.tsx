import Link from 'next/link'
import { ChevronRight } from 'lucide-react'
import { COLLECTIONS, ACCENT_CLASSES } from '@/lib/collections'
import { LocalizedText } from '@/components/ui/LocalizedText'

export const dynamic = 'force-dynamic'

export async function generateMetadata() {
  return {
    title: 'Collections — Cuisine World',
    description: 'Curated recipe collections grouped by mood and occasion.',
  }
}

export default function CollectionsPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-8">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold font-display text-gray-900 dark:text-gray-50">
          <LocalizedText en="Collections" zh="精選合集" /> ✨
        </h1>
        <p className="text-gray-400 dark:text-gray-500 text-sm max-w-xl mx-auto">
          <LocalizedText
            en="Hand-picked recipe sets for every mood and moment."
            zh="為每種心情同時刻精心挑選嘅食譜合集。"
          />
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {COLLECTIONS.map((c) => {
          const accent = ACCENT_CLASSES[c.accent]
          return (
            <Link
              key={c.id}
              href={`/collections/${c.id}`}
              className={`group flex items-center gap-4 rounded-2xl border ${accent.border} ${accent.bg} p-5 hover:shadow-md transition-all hover:-translate-y-0.5`}
            >
              <span className="text-4xl shrink-0">{c.emoji}</span>
              <div className="flex-1 min-w-0">
                <h2 className="font-bold text-gray-800">
                  <LocalizedText en={c.titleEn} zh={c.titleZh} />
                </h2>
                <p className="text-xs text-gray-500 line-clamp-2 mt-0.5 leading-relaxed">
                  <LocalizedText en={c.blurbEn} zh={c.blurbZh} />
                </p>
              </div>
              <ChevronRight size={18} className={`shrink-0 ${accent.text} opacity-0 group-hover:opacity-100 transition-opacity`} />
            </Link>
          )
        })}
      </div>
    </div>
  )
}
