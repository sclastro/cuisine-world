import type { RawMeal, Meal, MealSummary, Category, Area } from './types'
import { extractIngredients, parseInstructions, calculateDifficulty, extractSnippet } from './utils'

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
  return (data?.meals ?? []).map((m) => ({ name: m.strArea }))
}

export async function getRandomMeal(): Promise<Meal | null> {
  const data = await apiFetch<{ meals: RawMeal[] | null }>('/random.php', 0)
  const raw = data?.meals?.[0]
  if (!raw) return null
  return transformMeal(raw)
}

export async function getRandomMeals(count: number): Promise<Meal[]> {
  const results = await Promise.all(Array.from({ length: count }, () => getRandomMeal()))
  return results.filter((m): m is Meal => m !== null)
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
