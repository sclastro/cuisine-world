'use client'

import { useMemo, useState } from 'react'
import type { Meal } from '@/lib/types'
import { applyFilterSort, type SortKey } from '@/lib/utils'
import { RecipeGrid } from '@/components/recipe/RecipeGrid'
import { RecipeFilterBar } from './RecipeFilterBar'
import { useT } from '@/hooks/useT'

interface Props {
  meals: Meal[]
  total: number
}

// Client wrapper that adds difficulty filtering + sorting over a set of full
// meals, then renders the recipe grid.
export function BrowseResults({ meals, total }: Props) {
  const t = useT()
  const [difficulties, setDifficulties] = useState<number[]>([])
  const [sort, setSort] = useState<SortKey>('name-asc')

  const visible = useMemo(
    () => applyFilterSort(meals, difficulties, sort),
    [meals, difficulties, sort]
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

  const showingTruncated = total > meals.length
  const countLine = difficulties.length > 0
    ? `${t('filter.showing')} ${visible.length} ${t('filter.of')} ${meals.length} ${t('filter.recipes')}`
    : showingTruncated
      ? `${t('filter.showing')} ${meals.length} ${t('filter.of')} ${total} ${t('filter.recipes')}`
      : null

  return (
    <div className="space-y-4">
      {meals.length > 0 && (
        <RecipeFilterBar
          difficulties={difficulties}
          onToggleDifficulty={toggleDifficulty}
          sort={sort}
          onSortChange={setSort}
          onClear={clear}
        />
      )}

      {countLine && <p className="text-xs text-gray-400">{countLine}</p>}

      <RecipeGrid meals={visible} showSnippet emptyMessage={t('filter.noneMatch')} />
    </div>
  )
}
