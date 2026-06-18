'use server'

import { getMealsByIdsFull } from '@/lib/api'
import type { Meal } from '@/lib/types'

// Server action used by "Load more" on browse/search pages to hydrate the next
// batch of recipe ids into full Meal objects (kept server-side).
export async function loadMoreMeals(ids: string[]): Promise<Meal[]> {
  if (ids.length === 0) return []
  return getMealsByIdsFull(ids)
}
