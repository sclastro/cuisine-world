'use server'

import { getMealsByIdsFull, getMealsByCategory, getMealsByArea } from '@/lib/api'
import { searchSpoonacularRecipes } from '@/lib/spoonacular'
import { localizeMealsForList } from '@/lib/localize'
import { buildPlan, matchesPlan } from '@/lib/exploreQuery'
import { fuzzySearchIndex, type IndexEntry } from '@/lib/searchIndex'
import { cleanMeals } from '@/lib/mealQuality'
import type { Meal, MealSummary } from '@/lib/types'

// Server action used by "Load more" on browse/search pages to hydrate the next
// batch of recipe ids into full Meal objects (kept server-side), with Chinese
// translations attached so newly-loaded cards localize like the initial ones.
export async function loadMoreMeals(ids: string[]): Promise<Meal[]> {
  if (ids.length === 0) return []
  return localizeMealsForList(await getMealsByIdsFull(ids))
}

// Live-typing suggestions for the search bar. Fuzzy-matched against a cached
// name index (see searchIndex.ts) — instant and typo-tolerant, no per-keystroke
// hit against TheMealDB's rate-limited API.
export async function getSearchSuggestions(query: string): Promise<IndexEntry[]> {
  if (query.trim().length < 2) return []
  return fuzzySearchIndex(query, 8)
}

// "Because you liked…" — heuristic recommendations from a user's favorites.
// Infers their most-favorited categories/areas, pulls related dishes, drops
// anything already favorited, and returns localized, de-duplicated meals.
export async function recommendFromFavorites(favoriteIds: string[]): Promise<Meal[]> {
  if (favoriteIds.length === 0) return []

  const favs = await getMealsByIdsFull(favoriteIds.slice(0, 12))
  const catCount = new Map<string, number>()
  const areaCount = new Map<string, number>()
  for (const m of favs) {
    if (m.category) catCount.set(m.category, (catCount.get(m.category) ?? 0) + 1)
    if (m.area) areaCount.set(m.area, (areaCount.get(m.area) ?? 0) + 1)
  }
  const top = (map: Map<string, number>, n: number) =>
    [...map.entries()].sort((a, b) => b[1] - a[1]).slice(0, n).map((e) => e[0])

  const topCats = top(catCount, 2)
  const topAreas = top(areaCount, 1)
  if (topCats.length === 0 && topAreas.length === 0) return []

  const lists = await Promise.all([
    ...topCats.map((c) => getMealsByCategory(c)),
    ...topAreas.map((a) => getMealsByArea(a)),
  ])

  const favSet = new Set(favoriteIds)
  const seen = new Set<string>()
  const candidateIds: string[] = []
  let idx = 0
  let added = true
  while (added && candidateIds.length < 18) {
    added = false
    for (const list of lists) {
      const item = list[idx]
      if (item) {
        added = true
        if (!favSet.has(item.id) && !seen.has(item.id)) {
          seen.add(item.id)
          candidateIds.push(item.id)
        }
      }
    }
    idx++
  }

  const meals = cleanMeals(await getMealsByIdsFull(candidateIds.slice(0, 12)))
  return localizeMealsForList(meals)
}

// How many TheMealDB summaries to hydrate for an Explore query. Kept modest
// because each is an individual (rate-limited) lookup; Spoonacular fills the
// rest richly when a key is present.
const EXPLORE_HYDRATE = 30
const EXPLORE_MAX = 48

// Explore page: resolve recipes matching the selected filter options across the
// dietary / health / style dimensions. Combines a predicate-filtered TheMealDB
// pool with Spoonacular's param-filtered results (bonus, only with a key).
export async function exploreRecipes(selectedIds: string[]): Promise<Meal[]> {
  const plan = buildPlan(selectedIds)

  // 1. Seed a candidate pool from TheMealDB categories + areas, round-robin
  //    interleaved so the hydrated batch spans sources rather than one category.
  const lists = await Promise.all([
    ...plan.categories.map((c) => getMealsByCategory(c)),
    ...plan.areas.map((a) => getMealsByArea(a)),
  ])
  const seen = new Set<string>()
  const pool: MealSummary[] = []
  let idx = 0
  let added = true
  while (added) {
    added = false
    for (const list of lists) {
      const item = list[idx]
      if (item) {
        added = true
        if (!seen.has(item.id)) {
          seen.add(item.id)
          pool.push(item)
        }
      }
    }
    idx++
  }

  // 2. Hydrate a capped batch and keep the ones that satisfy the plan.
  const dbMeals = (await getMealsByIdsFull(pool.slice(0, EXPLORE_HYDRATE).map((s) => s.id)))
    .filter((m) => matchesPlan(m, plan))

  // 3. Spoonacular bonus (rich param filtering); still verified against the plan
  //    so style/text predicates apply consistently.
  const spoon = (await searchSpoonacularRecipes(plan.spoon, 24))
    .filter((m) => matchesPlan(m, plan))

  // 4. Merge (Spoonacular first for its richer data), quality-filter and
  //    de-dupe by id AND normalized name (cross-source same-dish), cap, localize.
  const merged = cleanMeals([...spoon, ...dbMeals]).slice(0, EXPLORE_MAX)

  return localizeMealsForList(merged)
}
