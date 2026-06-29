'use client'

import { useMemo, useState, useTransition } from 'react'
import type { Meal } from '@/lib/types'
import { applyFilterSort, type SortKey } from '@/lib/utils'
import { loadMoreMeals } from '@/app/actions'
import { RecipeGrid } from '@/components/recipe/RecipeGrid'
import { RecipeFilterBar } from './RecipeFilterBar'
import { useT } from '@/hooks/useT'

interface Props {
  meals: Meal[]
  total: number
  restIds?: string[]
}

const BATCH = 12

// Client wrapper that adds difficulty filtering + sorting over a set of full
// meals, plus on-demand "load more" of any remaining recipes.
export function BrowseResults({ meals, total, restIds = [] }: Props) {
  const t = useT()
  const [difficulties, setDifficulties] = useState<number[]>([])
  const [sort, setSort] = useState<SortKey>('name-asc')

  const [loaded, setLoaded] = useState<Meal[]>(meals)
  const [pendingIds, setPendingIds] = useState<string[]>(restIds)
  const [isLoading, startTransition] = useTransition()

  const visible = useMemo(
    () => applyFilterSort(loaded, difficulties, sort),
    [loaded, difficulties, sort]
  )

  function toggleDifficulty(stars: number) {
    setDifficulties((prev) =>
      prev.includes(stars) ? prev.filter((s) => s !== stars) : [...prev, stars]
    )
  }

  function clear() {
    setDifficulties([])
    setSort('name-asc')
  }

  function loadMore() {
    const next = pendingIds.slice(0, BATCH)
    startTransition(async () => {
      const more = await loadMoreMeals(next)
      setLoaded((prev) => [...prev, ...more])
      setPendingIds((prev) => prev.slice(BATCH))
    })
  }

  const countLine = difficulties.length > 0
    ? `${t('filter.showing')} ${visible.length} ${t('filter.of')} ${loaded.length} ${t('filter.recipes')}`
    : loaded.length < total
      ? `${t('filter.showing')} ${loaded.length} ${t('filter.of')} ${total} ${t('filter.recipes')}`
      : null

  return (
    <div className="space-y-4">
      {loaded.length > 0 && (
        <RecipeFilterBar
          difficulties={difficulties}
          onToggleDifficulty={toggleDifficulty}
          sort={sort}
          onSortChange={setSort}
          onClear={clear}
        />
      )}

      {countLine && <p className="text-xs text-gray-400">{countLine}</p>}

      <RecipeGrid
        meals={visible}
        showSnippet
        emptyMessage={difficulties.length > 0 ? t('filter.noneMatch') : t('filter.empty')}
      />

      {pendingIds.length > 0 && (
        <div className="flex justify-center pt-2">
          <button
            onClick={loadMore}
            disabled={isLoading}
            className="px-6 py-2.5 rounded-full border border-green-200 bg-white text-sm font-medium text-green-700 hover:bg-green-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm"
          >
            {isLoading ? t('filter.loading') : t('filter.loadMore')}
          </button>
        </div>
      )}
    </div>
  )
}
