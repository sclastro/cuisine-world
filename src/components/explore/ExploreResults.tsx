'use client'

import type { Meal } from '@/lib/types'
import { RecipeGrid } from '@/components/recipe/RecipeGrid'
import { SkeletonGrid } from '@/components/ui/SkeletonCard'
import { useT } from '@/hooks/useT'

interface Props {
  meals: Meal[]
  loading: boolean
  searched: boolean
}

// Presentational results block for the Explore wizard: count header, grid, and
// distinct empty / not-yet-searched states.
export function ExploreResults({ meals, loading, searched }: Props) {
  const t = useT()

  if (loading) return <SkeletonGrid />

  if (!searched) {
    return (
      <p className="text-center text-gray-400 py-16 text-sm">{t('explore.startHint')}</p>
    )
  }

  return (
    <div className="space-y-4">
      {meals.length > 0 && (
        <p className="text-xs text-gray-400">
          {meals.length} {t('explore.results')}
        </p>
      )}
      <RecipeGrid meals={meals} showSnippet emptyMessage={t('explore.noResults')} />
    </div>
  )
}
