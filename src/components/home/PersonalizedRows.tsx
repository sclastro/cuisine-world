'use client'

import { useEffect, useState } from 'react'
import { Clock, Heart } from 'lucide-react'
import { useRecentlyViewed } from '@/context/RecentlyViewedContext'
import { useFavorites } from '@/context/FavoritesContext'
import { loadMoreMeals, recommendFromFavorites } from '@/app/actions'
import { useT } from '@/hooks/useT'
import type { Meal } from '@/lib/types'
import { RecipeGrid } from '@/components/recipe/RecipeGrid'

// Client-only personalized rows for the homepage. Both render nothing until
// there's data, so new visitors see no empty gaps; returning visitors get
// "Recently viewed" and "Because you liked" driven by their local history.
export function PersonalizedRows() {
  const t = useT()
  const { recent, mounted: recentMounted } = useRecentlyViewed()
  const { favorites, mounted: favMounted } = useFavorites()
  const [recentMeals, setRecentMeals] = useState<Meal[]>([])
  const [recs, setRecs] = useState<Meal[]>([])

  useEffect(() => {
    if (!recentMounted) return
    if (recent.length === 0) { setRecentMeals([]); return }
    loadMoreMeals(recent.slice(0, 6)).then(setRecentMeals)
  }, [recent, recentMounted])

  useEffect(() => {
    if (!favMounted) return
    if (favorites.size === 0) { setRecs([]); return }
    recommendFromFavorites([...favorites]).then(setRecs)
  }, [favorites, favMounted])

  if (recentMeals.length === 0 && recs.length === 0) return null

  return (
    <div className="space-y-12">
      {recentMeals.length > 0 && (
        <section className="space-y-5">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full bg-green-100 dark:bg-green-900/60 flex items-center justify-center">
              <Clock size={14} className="text-green-600 dark:text-green-400" />
            </div>
            <h2 className="text-xl font-bold font-display text-gray-800 dark:text-gray-100">{t('home.recent')}</h2>
          </div>
          <RecipeGrid meals={recentMeals} showSnippet />
        </section>
      )}

      {recs.length > 0 && (
        <section className="space-y-5">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full bg-red-100 dark:bg-red-900/50 flex items-center justify-center">
              <Heart size={14} className="text-red-500 fill-red-400" />
            </div>
            <div>
              <h2 className="text-xl font-bold font-display text-gray-800 dark:text-gray-100">{t('home.recommended')}</h2>
              <p className="text-xs text-gray-400 dark:text-gray-500">{t('home.recommendedSub')}</p>
            </div>
          </div>
          <RecipeGrid meals={recs} showSnippet />
        </section>
      )}
    </div>
  )
}
