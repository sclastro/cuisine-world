'use server'

import { getMealsByIdsFull } from '@/lib/api'
import { localizeMealsForList } from '@/lib/localize'
import type { Meal } from '@/lib/types'

// Server action used by "Load more" on browse/search pages to hydrate the next
// batch of recipe ids into full Meal objects (kept server-side), with Chinese
// translations attached so newly-loaded cards localize like the initial ones.
export async function loadMoreMeals(ids: string[]): Promise<Meal[]> {
  if (ids.length === 0) return []
  return localizeMealsForList(await getMealsByIdsFull(ids))
}
