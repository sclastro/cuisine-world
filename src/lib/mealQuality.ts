import type { Meal } from './types'

// Shared quality gate + cross-source dedupe for every place that merges or
// lists meals. Two jobs:
//  1. isCompleteMeal — a card the user taps must never lead to a broken page:
//     no thumbnail, no instructions, or no ingredients → drop it.
//  2. dedupeMeals — TheMealDB and Spoonacular often carry the same dish under
//     near-identical names ("Pad Thai" vs "Pad thai"). Compare by a normalized
//     name key (plus id) so a dish only ever appears once. First occurrence
//     wins, so callers should put their preferred source first.

export function isCompleteMeal(meal: Meal): boolean {
  return Boolean(
    meal.thumbnail &&
    meal.name?.trim() &&
    meal.instructions.length > 0 &&
    meal.ingredients.length > 0
  )
}

// "Thai Green Curry!" / "thai  green curry" → "thai green curry"
function nameKey(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, '')
    .replace(/\s+/g, ' ')
    .trim()
}

export function dedupeMeals(meals: Meal[]): Meal[] {
  const seenIds = new Set<string>()
  const seenNames = new Set<string>()
  const out: Meal[] = []
  for (const m of meals) {
    const key = nameKey(m.name)
    if (seenIds.has(m.id) || (key && seenNames.has(key))) continue
    seenIds.add(m.id)
    if (key) seenNames.add(key)
    out.push(m)
  }
  return out
}

// Convenience: quality-filter then dedupe, in one pass order.
export function cleanMeals(meals: Meal[]): Meal[] {
  return dedupeMeals(meals.filter(isCompleteMeal))
}
