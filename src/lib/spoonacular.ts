import type { Meal, Ingredient, DifficultyScore } from './types'
import { calculateDifficulty, extractSnippet } from './utils'
import { searchCookingVideo } from './youtube'

const BASE = 'https://api.spoonacular.com'

// --- Raw Spoonacular types ---------------------------------------------------

interface SpoonacularIngredient {
  id: number
  name: string
  amount: number
  unit: string
  image: string
}

interface SpoonacularStep {
  number: number
  step: string
}

interface SpoonacularInstructionGroup {
  name: string
  steps: SpoonacularStep[]
}

interface SpoonacularRecipe {
  id: number
  title: string
  image: string
  readyInMinutes: number
  servings: number
  cuisines: string[]
  dishTypes: string[]
  diets: string[]
  sourceUrl: string
  spoonacularSourceUrl?: string
  analyzedInstructions: SpoonacularInstructionGroup[]
  extendedIngredients: SpoonacularIngredient[]
}

interface ComplexSearchResponse {
  results: SpoonacularRecipe[]
  totalResults: number
}

// --- Fetch helper ------------------------------------------------------------

async function spFetch<T>(
  path: string,
  extraParams: Record<string, string> = {},
  revalidate = 3600
): Promise<T | null> {
  const API_KEY = process.env.SPOONACULAR_API_KEY
  if (!API_KEY) return null

  try {
    const params = new URLSearchParams({ apiKey: API_KEY, ...extraParams })
    const res = await fetch(`${BASE}${path}?${params}`, {
      next: { revalidate },
    })
    if (!res.ok) return null
    return res.json() as Promise<T>
  } catch {
    return null
  }
}

// --- Transform helpers -------------------------------------------------------

function toIngredients(raw: SpoonacularIngredient[]): Ingredient[] {
  return raw.map((i) => ({
    name: i.name,
    measure: `${i.amount} ${i.unit}`.trim(),
    imageUrl: `https://spoonacular.com/cdn/ingredients_100x100/${i.image}`,
  }))
}

function toInstructions(groups: SpoonacularInstructionGroup[]): string[] {
  const primary = groups[0]
  if (!primary?.steps?.length) return []
  return primary.steps.map((s) => s.step).filter((s) => s.trim().length > 0)
}

function toDifficulty(
  ingredients: Ingredient[],
  instructions: string[]
): DifficultyScore {
  const joined = instructions.join(' ')
  return calculateDifficulty(ingredients, instructions, joined)
}

// Map Spoonacular cuisine names to our standard area labels (TheMealDB style)
const CUISINE_MAP: Record<string, string> = {
  chinese:       'Chinese',
  japanese:      'Japanese',
  korean:        'Korean',
  thai:          'Thai',
  vietnamese:    'Vietnamese',
  american:      'American',
  italian:       'Italian',
  french:        'French',
  mexican:       'Mexican',
  mediterranean: 'Greek',
  greek:         'Greek',
  spanish:       'Spanish',
  indian:        'Indian',
}

function mapCuisine(cuisines: string[]): string {
  for (const c of cuisines) {
    const mapped = CUISINE_MAP[c.toLowerCase()]
    if (mapped) return mapped
  }
  return cuisines[0] ?? ''
}

// Map Spoonacular dishTypes to a single category label
function mapDishType(dishTypes: string[]): string {
  const first = dishTypes[0] ?? ''
  return first.split(' ').map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')
}

// Full transform — youtubeUrl passed in separately so callers control whether
// to spend YouTube quota (individual lookups) or skip it (batch browse pages).
function transformRecipe(raw: SpoonacularRecipe, youtubeUrl: string | null): Meal {
  const ingredients = toIngredients(raw.extendedIngredients ?? [])
  const instructions = toInstructions(raw.analyzedInstructions ?? [])
  const difficulty = toDifficulty(ingredients, instructions)

  return {
    id: `sp_${raw.id}`,
    name: raw.title,
    thumbnail: raw.image,
    category: mapDishType(raw.dishTypes ?? []),
    area: mapCuisine(raw.cuisines ?? []),
    instructions,
    snippet: extractSnippet(instructions),
    youtubeUrl,
    tags: raw.diets ?? [],
    sourceUrl: raw.sourceUrl ?? raw.spoonacularSourceUrl ?? null,
    ingredients,
    difficulty,
    estTimeMinutes: raw.readyInMinutes ?? 30,
    estServings: raw.servings ?? 4,
    source: 'spoonacular',
  }
}

// --- Public API functions ----------------------------------------------------

// Fetch a single Spoonacular recipe by its numeric ID, including a YouTube video search.
export async function getSpoonacularMealById(id: number): Promise<Meal | null> {
  const raw = await spFetch<SpoonacularRecipe>(
    `/recipes/${id}/information`,
    { includeNutrition: 'false', addRecipeInformation: 'true', fillIngredients: 'true' },
    86400
  )
  if (!raw) return null

  const videoId = await searchCookingVideo(raw.title)
  const youtubeUrl = videoId ? `https://www.youtube.com/watch?v=${videoId}` : null

  return transformRecipe(raw, youtubeUrl)
}

type EverydayType = 'quick' | 'asian' | 'world'

const TYPE_PARAMS: Record<EverydayType, Record<string, string>> = {
  quick: { maxReadyTime: '30', type: 'main course,side dish' },
  asian: { cuisine: 'chinese,japanese,korean,thai,vietnamese' },
  world: { cuisine: 'american,italian,french,mediterranean,mexican' },
}

// Search Spoonacular for everyday recipes of a given type.
// Returns full Meal objects (without YouTube — saves quota on browse pages).
export async function searchEverydayRecipes(
  type: EverydayType,
  number = 48
): Promise<{ total: number; meals: Meal[] }> {
  const extra = TYPE_PARAMS[type] ?? {}
  const data = await spFetch<ComplexSearchResponse>(
    '/recipes/complexSearch',
    {
      addRecipeInformation: 'true',
      fillIngredients: 'true',
      number: String(number),
      sort: 'popularity',
      ...extra,
    }
  )

  if (!data) return { total: 0, meals: [] }

  const meals = data.results.map((r) => transformRecipe(r, null))
  return { total: data.totalResults, meals }
}

// Search Spoonacular by a single cuisine param (e.g. 'korean', 'thai').
// Used by the region pages to merge home-cooking recipes alongside TheMealDB.
// Returns full Meal objects without YouTube (saves quota on browse pages).
export async function searchSpoonacularByCuisine(
  cuisine: string,
  number = 24
): Promise<{ total: number; meals: Meal[] }> {
  const data = await spFetch<ComplexSearchResponse>(
    '/recipes/complexSearch',
    {
      cuisine,
      addRecipeInformation: 'true',
      fillIngredients: 'true',
      number: String(number),
      sort: 'popularity',
    }
  )

  if (!data) return { total: 0, meals: [] }

  const meals = data.results.map((r) => transformRecipe(r, null))
  return { total: data.totalResults, meals }
}
