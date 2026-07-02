'use client'

import { Suspense, useEffect, useState } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { Heart, Compass } from 'lucide-react'
import { useFavorites } from '@/context/FavoritesContext'
import { loadMoreMeals } from '@/app/actions'
import { useT } from '@/hooks/useT'
import type { Meal } from '@/lib/types'
import { RecipeGrid } from '@/components/recipe/RecipeGrid'
import { SkeletonGrid } from '@/components/ui/SkeletonCard'
import { ShareFavoritesButton } from './ShareFavoritesButton'

// Inner component that uses useSearchParams (must be inside Suspense).
function FavoritesViewInner() {
  const { favorites, mounted, importFavorites } = useFavorites()
  const t = useT()
  const searchParams = useSearchParams()
  const [meals, setMeals] = useState<Meal[]>([])
  const [loading, setLoading] = useState(true)

  // Import ids from a shared favorites link (?ids=52772,sp_12345,...) once on
  // mount. Merges into whatever's already saved — never replaces it.
  useEffect(() => {
    const raw = searchParams.get('ids')
    if (!raw) return
    const ids = raw.split(',').map((s) => s.trim()).filter(Boolean)
    if (ids.length > 0) importFavorites(ids)
  // Only ever run once per page load — importFavorites is stable enough here.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (!mounted) return
    if (favorites.size === 0) {
      setMeals([])
      setLoading(false)
      return
    }
    setLoading(true)
    // Reuse the localized server action so favorite cards get translations + stars.
    loadMoreMeals([...favorites]).then((results) => {
      setMeals(results)
      setLoading(false)
    })
  }, [favorites, mounted])

  if (!mounted || loading) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-8 space-y-6">
        <div className="h-8 bg-gray-100 rounded w-40 animate-pulse" />
        <SkeletonGrid />
      </div>
    )
  }

  if (meals.length === 0) {
    return (
      <div className="max-w-md mx-auto px-4 py-24 text-center space-y-5">
        <div className="w-20 h-20 rounded-full bg-red-50 flex items-center justify-center mx-auto">
          <Heart size={36} className="text-red-300" />
        </div>
        <div className="space-y-2">
          <h1 className="text-xl font-bold text-gray-700">{t('fav.emptyTitle')}</h1>
          <p className="text-gray-400 text-sm leading-relaxed">
            {t('fav.emptyDesc')}
          </p>
        </div>
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-green-600 text-white text-sm font-medium hover:bg-green-700 transition-colors"
        >
          <Compass size={16} />
          {t('fav.explore')}
        </Link>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-6">
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-red-50 flex items-center justify-center">
            <Heart size={18} className="fill-red-400 text-red-400" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-800">{t('fav.title')}</h1>
            <p className="text-sm text-gray-400">
              {meals.length} {t('fav.saved')}
            </p>
          </div>
        </div>
        <ShareFavoritesButton />
      </div>

      <RecipeGrid meals={meals} />
    </div>
  )
}

export function FavoritesView() {
  return (
    <Suspense fallback={
      <div className="max-w-6xl mx-auto px-4 py-8 space-y-6">
        <div className="h-8 bg-gray-100 rounded w-40 animate-pulse" />
        <SkeletonGrid />
      </div>
    }>
      <FavoritesViewInner />
    </Suspense>
  )
}
