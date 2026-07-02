import type { RawMeal, Meal, MealSummary, Category, Area } from './types'
import { extractIngredients, parseInstructions, calculateDifficulty, extractSnippet, estimateMealMeta } from './utils'
import { getSpoonacularMealById, searchSpoonacularByCuisine, searchEverydayRecipes } from './spoonacular'
import { SPOONACULAR_ONLY_AREAS, spoonacularCuisineFor } from './areas'
import { fuzzySearchIndex } from './searchIndex'

const BASE_URL = 'https://www.themealdb.com/api/json/v1/1'

async function apiFetch<T>(path: string, revalidate = 3600): Promise<T | null> {
  try {
    const res = await fetch(`${BASE_URL}${path}`, {
      next: { revalidate },
    })
    if (!res.ok) return null
    return res.json() as Promise<T>
  } catch {
    return null
  }
}

function transformMeal(raw: RawMeal): Meal {
  const ingredients = extractIngredients(raw)
  const instructions = parseInstructions(raw.strInstructions)
  const difficulty = calculateDifficulty(ingredients, instructions, raw.strInstructions)
  const est = estimateMealMeta(ingredients, instructions, raw.strInstructions)

  return {
    id: raw.idMeal,
    name: raw.strMeal,
    thumbnail: raw.strMealThumb,
    category: raw.strCategory ?? '',
    area: raw.strArea ?? '',
    instructions,
    snippet: extractSnippet(instructions),
    youtubeUrl: raw.strYoutube ?? null,
    tags: raw.strTags ? raw.strTags.split(',').map((t) => t.trim()).filter(Boolean) : [],
    sourceUrl: raw.strSource ?? null,
    ingredients,
    difficulty,
    estTimeMinutes: est.minutes,
    estServings: est.servings,
  }
}

function toSummary(raw: RawMeal): MealSummary {
  return {
    id: raw.idMeal,
    name: raw.strMeal,
    thumbnail: raw.strMealThumb,
    category: raw.strCategory ?? undefined,
    area: raw.strArea ?? undefined,
  }
}

export async function searchMealsByName(query: string): Promise<MealSummary[]> {
  const data = await apiFetch<{ meals: RawMeal[] | null }>(`/search.php?s=${encodeURIComponent(query)}`)
  return (data?.meals ?? []).map(toSummary)
}

export async function getMealById(id: string): Promise<Meal | null> {
  if (id.startsWith('sp_')) {
    return getSpoonacularMealById(parseInt(id.slice(3), 10))
  }
  const data = await apiFetch<{ meals: RawMeal[] | null }>(`/lookup.php?i=${id}`)
  const raw = data?.meals?.[0]
  if (!raw) return null
  return transformMeal(raw)
}

export async function getMealsByCategory(category: string): Promise<MealSummary[]> {
  const data = await apiFetch<{ meals: RawMeal[] | null }>(`/filter.php?c=${encodeURIComponent(category)}`)
  return (data?.meals ?? []).map(toSummary)
}

export async function getMealsByArea(area: string): Promise<MealSummary[]> {
  const data = await apiFetch<{ meals: RawMeal[] | null }>(`/filter.php?a=${encodeURIComponent(area)}`)
  return (data?.meals ?? []).map(toSummary)
}

// Resolves full Meal objects for a list of ids (so cards/filters have
// difficulty, estimates, etc.). Used both for the initial batch and "load more".
export async function getMealsByIdsFull(ids: string[]): Promise<Meal[]> {
  const meals = (await Promise.all(ids.map((id) => getMealById(id)))).filter(
    (m): m is Meal => m !== null
  )
  return meals
}

// Resolves the first `limit` summaries into full meals, returning the leftover
// ids so the client can fetch further batches on demand ("load more").
async function hydrateSummaries(
  summaries: MealSummary[],
  limit: number
): Promise<{ total: number; meals: Meal[]; restIds: string[] }> {
  const ids = summaries.map((s) => s.id)
  const meals = await getMealsByIdsFull(ids.slice(0, limit))
  return { total: summaries.length, meals, restIds: ids.slice(limit) }
}

// How many recipes to hydrate (individual lookups) for the first render.
// TheMealDB's free key rate-limits hard, so a big initial batch of parallel
// lookups was timing out and leaving region/category pages empty. A small,
// reliable first page plus on-demand "load more" is far more robust.
export const INITIAL_BATCH = 12

// Full-meal variants for browse/search pages that need difficulty for filtering.
export async function getMealsByCategoryFull(category: string, limit = INITIAL_BATCH) {
  return hydrateSummaries(await getMealsByCategory(category), limit)
}

export async function getMealsByAreaFull(area: string, limit = INITIAL_BATCH) {
  return hydrateSummaries(await getMealsByArea(area), limit)
}

// Search returns FULL raw meals from /search.php, so we transform them directly
// instead of re-fetching each by id (avoids an N+1 round-trip that could drop
// recipes on a flaky network and strip their difficulty/time data).
//
// If the literal TheMealDB search comes back empty (typo, near-miss), fall
// back to the fuzzy name index so a misspelled query still finds something
// instead of a bare "no results" page.
export async function searchMealsByNameFull(
  query: string
): Promise<{ total: number; meals: Meal[]; restIds: string[]; fuzzy: boolean }> {
  const data = await apiFetch<{ meals: RawMeal[] | null }>(
    `/search.php?s=${encodeURIComponent(query)}`
  )
  const rawMeals = data?.meals ?? []

  if (rawMeals.length > 0) {
    const meals = rawMeals.map(transformMeal)
    return { total: meals.length, meals, restIds: [], fuzzy: false }
  }

  const fuzzyMatches = await fuzzySearchIndex(query, 12)
  const meals = await getMealsByIdsFull(fuzzyMatches.map((m) => m.id))
  return { total: meals.length, meals, restIds: [], fuzzy: meals.length > 0 }
}

export async function getAllCategories(): Promise<Category[]> {
  const data = await apiFetch<{
    categories: { idCategory: string; strCategory: string; strCategoryThumb: string; strCategoryDescription: string }[]
  }>('/categories.php')
  return (data?.categories ?? []).map((c) => ({
    id: c.idCategory,
    name: c.strCategory,
    thumbnail: c.strCategoryThumb,
    description: c.strCategoryDescription,
  }))
}

export async function getAllAreas(): Promise<Area[]> {
  const data = await apiFetch<{ meals: { strArea: string }[] }>('/list.php?a=list')
  const fromDb = (data?.meals ?? []).map((m) => m.strArea)
  // Only surface Spoonacular-only regions (e.g. Korean) when a Spoonacular key
  // is configured — otherwise those pages would be empty. Without a key the
  // region list is exactly TheMealDB's, so every listed region works.
  const extra = process.env.SPOONACULAR_API_KEY ? SPOONACULAR_ONLY_AREAS : []
  const merged = Array.from(new Set([...fromDb, ...extra]))
  merged.sort((a, b) => a.localeCompare(b))
  return merged.map((name) => ({ name }))
}

// Fetches recipes for a region from BOTH sources and merges them, so a region
// page shows TheMealDB's traditional dishes together with Spoonacular's
// home-cooking recipes. Spoonacular results are loaded up front (all shown);
// TheMealDB's remainder is paged via restIds ("load more").
export async function getAreaMealsCombined(
  area: string,
  limit = INITIAL_BATCH
): Promise<{ total: number; meals: Meal[]; restIds: string[] }> {
  const cuisine = spoonacularCuisineFor(area)
  const [dbResult, spoon] = await Promise.all([
    getMealsByAreaFull(area, limit),
    cuisine
      ? searchSpoonacularByCuisine(cuisine)
      : Promise.resolve({ total: 0, meals: [] as Meal[] }),
  ])

  // Spoonacular home-cooking first, then TheMealDB's traditional dishes.
  const meals = [...spoon.meals, ...dbResult.meals]
  const total = dbResult.total + spoon.meals.length
  return { total, meals, restIds: dbResult.restIds }
}

export async function getRandomMeal(): Promise<Meal | null> {
  const data = await apiFetch<{ meals: RawMeal[] | null }>('/random.php', 0)
  const raw = data?.meals?.[0]
  if (!raw) return null
  return transformMeal(raw)
}

// Returns `count` DISTINCT random meals.
//
// /random.php is the same URL every time, and Next.js de-duplicates identical
// fetches within a single render — so the old Promise.all of N identical calls
// resolved to the SAME meal N times (the homepage showed one dish repeated).
// We give each call a unique cache-busting query param to defeat that dedup,
// over-fetch a little, then de-duplicate by id to guarantee variety.
export async function getRandomMeals(count: number): Promise<Meal[]> {
  const attempts = count * 3
  const results = await Promise.all(
    Array.from({ length: attempts }, async (_, i) => {
      const data = await apiFetch<{ meals: RawMeal[] | null }>(`/random.php?_=${i}`, 0)
      const raw = data?.meals?.[0]
      return raw ? transformMeal(raw) : null
    })
  )

  const seen = new Set<string>()
  const distinct: Meal[] = []
  for (const meal of results) {
    if (meal && !seen.has(meal.id)) {
      seen.add(meal.id)
      distinct.push(meal)
      if (distinct.length === count) break
    }
  }
  return distinct
}

export async function getMealsByIds(ids: string[]): Promise<MealSummary[]> {
  const results = await Promise.all(ids.map((id) => getMealById(id)))
  return results
    .filter((m): m is Meal => m !== null)
    .map((m) => ({ id: m.id, name: m.name, thumbnail: m.thumbnail, category: m.category, area: m.area }))
}

// Maps TheMealDB categories to course types for the section browsing
export const COURSE_CATEGORY_MAP: Record<string, string[]> = {
  starter: ['Starter', 'Side', 'Miscellaneous'],
  soup: ['Soup'],
  main: ['Beef', 'Chicken', 'Lamb', 'Pork', 'Seafood', 'Pasta', 'Vegan', 'Vegetarian', 'Goat', 'Breakfast'],
  dessert: ['Dessert'],
}

// ── Everyday / home cooking, built on TheMealDB (always free, no API key) ────
// Each type maps to a set of reliable TheMealDB filters. Spoonacular, when a key
// is present, is merged in as a bonus — but the page is never empty without it.
type EverydayKind = 'quick' | 'asian' | 'world'

const EVERYDAY_SOURCES: Record<
  EverydayKind,
  { areas?: string[]; categories?: string[]; spoonacular?: 'quick' }
> = {
  // Quick: lighter courses that tend to be fast; the difficulty filter + the
  // ≤40-min estimate further narrow it to genuinely quick dishes.
  quick: { categories: ['Breakfast', 'Side', 'Starter', 'Miscellaneous'], spoonacular: 'quick' },
  asian: { areas: ['Chinese', 'Japanese', 'Thai', 'Malaysian', 'Vietnamese', 'Filipino'] },
  world: { areas: ['American', 'Italian', 'French', 'Spanish', 'British', 'Greek', 'Mexican'] },
}

// Gathers a de-duplicated summary pool for an everyday type from TheMealDB.
async function everydaySummaryPool(kind: EverydayKind): Promise<MealSummary[]> {
  const src = EVERYDAY_SOURCES[kind]
  const lists = await Promise.all([
    ...(src.areas ?? []).map((a) => getMealsByArea(a)),
    ...(src.categories ?? []).map((c) => getMealsByCategory(c)),
  ])
  const seen = new Set<string>()
  const pool: MealSummary[] = []
  for (const list of lists) {
    for (const m of list) {
      if (!seen.has(m.id)) {
        seen.add(m.id)
        pool.push(m)
      }
    }
  }
  return pool
}

// Reliable everyday recipes: hydrate a small batch from TheMealDB, optionally
// fold in Spoonacular quick recipes (bonus, only with a key). Never empty.
export async function getEverydayMeals(
  kind: EverydayKind
): Promise<{ total: number; meals: Meal[]; restIds: string[] }> {
  const pool = await everydaySummaryPool(kind)
  const ids = pool.map((s) => s.id)

  // Hydrate a slightly larger batch for 'quick' so the ≤40-min filter still
  // leaves a full first page.
  const hydrateCount = kind === 'quick' ? INITIAL_BATCH + 6 : INITIAL_BATCH
  let meals = await getMealsByIdsFull(ids.slice(0, hydrateCount))
  let usedIds = hydrateCount

  if (kind === 'quick') {
    meals = meals.filter((m) => m.estTimeMinutes <= 40)
  }

  // Optional Spoonacular bonus (quick = ≤30 min), merged in front when available.
  const spoon = await searchEverydayBonus(kind)
  meals = [...spoon, ...meals]

  return {
    total: pool.length + spoon.length,
    meals,
    restIds: ids.slice(usedIds),
  }
}

// Thin wrapper around Spoonacular's everyday search; returns [] without a key.
async function searchEverydayBonus(kind: EverydayKind): Promise<Meal[]> {
  try {
    const { meals } = await searchEverydayRecipes(kind, 12)
    return meals
  } catch {
    return []
  }
}
