import { unstable_cache } from 'next/cache'
import type { NutritionData } from './types'

// Nutrition fallback for TheMealDB recipes (which carry no nutrition data).
//
// Open Food Facts is a free, key-less crowd database. We search it by the meal
// name and read the best match's per-100g macros. This is an *approximation*
// (per 100g, and matched by name), so the UI labels it "estimated" and cites
// the source. Same durable-cache approach as translate.ts: the fetch throws on
// any failure so a transient error is never cached, while a successful lookup
// is cached indefinitely.

const ENDPOINT = 'https://world.openfoodfacts.org/cgi/search.pl'

interface OFFProduct {
  nutriments?: Record<string, number | string | undefined>
}

interface OFFResponse {
  products?: OFFProduct[]
}

function num(v: number | string | undefined): number | null {
  if (v == null) return null
  const n = typeof v === 'string' ? parseFloat(v) : v
  return Number.isFinite(n) ? n : null
}

// Throws on any failure (see file header for why). Returns per-100g macros.
async function fetchNutritionOrThrow(mealName: string): Promise<NutritionData> {
  const params = new URLSearchParams({
    search_terms: mealName,
    search_simple: '1',
    action: 'process',
    json: '1',
    page_size: '1',
    fields: 'nutriments',
  })
  const res = await fetch(`${ENDPOINT}?${params}`, {
    signal: AbortSignal.timeout(6000),
  })
  if (!res.ok) throw new Error(`openfoodfacts HTTP ${res.status}`)

  const json = (await res.json()) as OFFResponse
  const nutriments = json.products?.[0]?.nutriments
  if (!nutriments) throw new Error('openfoodfacts: no product match')

  const calories = num(nutriments['energy-kcal_100g'])
  if (calories == null) throw new Error('openfoodfacts: no calorie data')

  return {
    calories: Math.round(calories),
    protein: Math.round(num(nutriments['proteins_100g']) ?? 0),
    fat: Math.round(num(nutriments['fat_100g']) ?? 0),
    carbs: Math.round(num(nutriments['carbohydrates_100g']) ?? 0),
    source: 'openfoodfacts',
  }
}

const cachedNutrition = unstable_cache(
  fetchNutritionOrThrow,
  ['open-food-facts-nutrition-v1'],
  { revalidate: false }
)

// Returns per-serving-ish nutrition for a meal name, or null if unavailable.
// Never throws — callers can attach the result directly to a Meal.
export async function getNutrition(mealName: string): Promise<NutritionData | null> {
  const trimmed = mealName?.trim()
  if (!trimmed) return null
  try {
    return await cachedNutrition(trimmed)
  } catch {
    return null
  }
}
