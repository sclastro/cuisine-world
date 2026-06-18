'use client'

import { SlidersHorizontal } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useT } from '@/hooks/useT'
import { DIFF_KEY, type TranslationKey } from '@/lib/i18n'
import type { SortKey } from '@/lib/utils'

interface Props {
  difficulties: number[]
  onToggleDifficulty: (stars: number) => void
  sort: SortKey
  onSortChange: (s: SortKey) => void
  onClear: () => void
}

const SORTS: { key: SortKey; label: TranslationKey }[] = [
  { key: 'name-asc', label: 'sort.name' },
  { key: 'diff-asc', label: 'sort.diffAsc' },
  { key: 'diff-desc', label: 'sort.diffDesc' },
]

export function RecipeFilterBar({ difficulties, onToggleDifficulty, sort, onSortChange, onClear }: Props) {
  const t = useT()
  const hasFilters = difficulties.length > 0 || sort !== 'name-asc'

  return (
    <div className="flex flex-wrap items-center gap-x-4 gap-y-2 rounded-xl border border-green-100 bg-white px-3 py-2.5 shadow-sm">
      <span className="flex items-center gap-1.5 text-xs font-semibold text-gray-400 uppercase tracking-wide">
        <SlidersHorizontal size={13} />
        {t('filter.difficulty')}
      </span>

      {/* Difficulty toggle chips */}
      <div className="flex flex-wrap gap-1.5">
        {[1, 2, 3, 4, 5].map((stars) => {
          const active = difficulties.includes(stars)
          return (
            <button
              key={stars}
              onClick={() => onToggleDifficulty(stars)}
              className={cn(
                'px-2.5 py-1 rounded-full text-xs border transition-colors',
                active
                  ? 'bg-green-600 text-white border-green-600'
                  : 'bg-white text-gray-600 border-green-100 hover:border-green-400 hover:bg-green-50'
              )}
            >
              {t(DIFF_KEY[stars])}
            </button>
          )
        })}
      </div>

      {/* Sort */}
      <label className="flex items-center gap-1.5 ml-auto text-xs text-gray-500">
        <span className="font-semibold uppercase tracking-wide text-gray-400">{t('filter.sortBy')}</span>
        <select
          value={sort}
          onChange={(e) => onSortChange(e.target.value as SortKey)}
          className="rounded-full border border-green-100 bg-white px-3 py-1 text-xs text-gray-700 focus:border-green-400 focus:outline-none"
        >
          {SORTS.map((s) => (
            <option key={s.key} value={s.key}>{t(s.label)}</option>
          ))}
        </select>
      </label>

      {hasFilters && (
        <button
          onClick={onClear}
          className="text-xs text-green-700 hover:underline"
        >
          {t('filter.clear')}
        </button>
      )}
    </div>
  )
}
