'use client'

import { useEffect } from 'react'
import { useRecentlyViewed } from '@/context/RecentlyViewedContext'

// Invisible client helper: records a recipe id into "recently viewed" once the
// detail page mounts. Kept as its own component so RecipeDetail can stay a
// server component.
export function RecordRecentView({ mealId }: { mealId: string }) {
  const { recordView, mounted } = useRecentlyViewed()

  useEffect(() => {
    if (mounted) recordView(mealId)
  }, [mealId, mounted, recordView])

  return null
}
