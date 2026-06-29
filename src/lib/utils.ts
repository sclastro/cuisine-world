import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'
import type { RawMeal, Ingredient, DifficultyScore, Meal } from './types'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function extractIngredients(meal: RawMeal): Ingredient[] {
  const ingredients: Ingredient[] = []
  for (let i = 1; i <= 20; i++) {
    const name = meal[`strIngredient${i}` as keyof RawMeal] as string | null
    const measure = meal[`strMeasure${i}` as keyof RawMeal] as string | null
    if (name && name.trim()) {
      ingredients.push({
        name: name.trim(),
        measure: measure?.trim() || '',
        imageUrl: `https://www.themealdb.com/images/ingredients/${encodeURIComponent(name.trim())}-Small.png`,
      })
    }
  }
  return ingredients
}

export function parseInstructions(raw: string | null): string[] {
  if (!raw) return []
  return raw
    .split(/\r\n|\n/)
    .map((line) => line.trim())
    .filter((line) => line.length > 0)
}

const COMPLEX_TECHNIQUES = [
  'deep fry', 'deep-fry', 'frying', 'flambe', 'flambé', 'braise',
  'smoke', 'smoking', 'cure', 'curing', 'ferment', 'marinate',
  'julienne', 'deglaze', 'caramelize', 'tempering', 'souffle',
]

export function calculateDifficulty(
  ingredients: Ingredient[],
  instructions: string[],
  rawInstructions: string | null
): DifficultyScore {
  let score = 0

  // ingredient count (0–2 pts)
  const count = ingredients.length
  if (count >= 15) score += 2
  else if (count >= 8) score += 1

  // instruction length proxy for time (0–2 pts)
  const totalChars = rawInstructions?.length ?? 0
  if (totalChars >= 1500) score += 2
  else if (totalChars >= 700) score += 1

  // complex technique detection (0–1 pt)
  const lowerInstructions = rawInstructions?.toLowerCase() ?? ''
  const hasComplex = COMPLEX_TECHNIQUES.some((t) => lowerInstructions.includes(t))
  if (hasComplex) score += 1

  // map 0–5 → 1–5 stars
  const stars = Math.min(5, Math.max(1, score + 1)) as 1 | 2 | 3 | 4 | 5
  const labels: Record<number, DifficultyScore['label']> = {
    1: 'Easy',
    2: 'Medium-Easy',
    3: 'Medium',
    4: 'Medium-Hard',
    5: 'Hard',
  }

  return { stars, label: labels[stars] }
}

export function extractSnippet(instructions: string[], maxLength = 110): string {
  const first = instructions.find((line) => line.length > 20) ?? ''
  if (!first) return ''
  return first.length <= maxLength ? first : first.slice(0, maxLength).trimEnd() + '…'
}

// Techniques that imply a long, mostly-passive cooking time.
const LONG_COOK_TECHNIQUES = [
  'braise', 'marinate', 'marinade', 'ferment', 'smoke', 'smoking', 'cure', 'curing',
  'slow cook', 'slow-cook', 'roast', 'simmer', 'stew', 'overnight', 'proof', 'rise', 'rest',
]

// Derives a *deterministic* estimated cook time (minutes) and servings from a
// recipe's data. TheMealDB provides neither, so these are honest estimates —
// always computed the same way for the same input (SSR === client).
export function estimateMealMeta(
  ingredients: Ingredient[],
  instructions: string[],
  rawInstructions: string | null
): { minutes: number; servings: number } {
  const totalChars = rawInstructions?.length ?? 0

  // Base time scales with how much instruction text there is.
  let minutes = 15 + Math.round(totalChars / 40)
  // More ingredients → more prep.
  minutes += Math.min(ingredients.length, 20)
  // Long, passive techniques add a chunk of time.
  const lower = rawInstructions?.toLowerCase() ?? ''
  if (LONG_COOK_TECHNIQUES.some((tch) => lower.includes(tch))) minutes += 40
  // Clamp and round to the nearest 5 for an honest "~" feel.
  minutes = Math.min(180, Math.max(10, minutes))
  minutes = Math.round(minutes / 5) * 5

  // Servings: deterministic from ingredient count.
  const n = ingredients.length
  const servings = n <= 5 ? 2 : n <= 10 ? 4 : 6

  return { minutes, servings }
}

export type SortKey = 'name-asc' | 'diff-asc' | 'diff-desc'

// Client-side filter + sort over already-fetched full meals.
// `difficulties` is a set of star tiers (1–5); empty means "all".
export function applyFilterSort(
  meals: Meal[],
  difficulties: number[],
  sort: SortKey
): Meal[] {
  let list = meals
  if (difficulties.length > 0) {
    list = list.filter((m) => difficulties.includes(m.difficulty.stars))
  }
  const sorted = [...list]
  switch (sort) {
    case 'name-asc':
      sorted.sort((a, b) => a.name.localeCompare(b.name))
      break
    case 'diff-asc':
      sorted.sort((a, b) => a.difficulty.stars - b.difficulty.stars || a.name.localeCompare(b.name))
      break
    case 'diff-desc':
      sorted.sort((a, b) => b.difficulty.stars - a.difficulty.stars || a.name.localeCompare(b.name))
      break
  }
  return sorted
}

// Pulls the 11-char video id out of any common YouTube URL shape
// (watch?v=, youtu.be/, /embed/). Returns null if none found.
export function getYoutubeId(url: string | null): string | null {
  if (!url) return null
  const patterns = [
    /[?&]v=([A-Za-z0-9_-]{11})/,      // watch?v=ID
    /youtu\.be\/([A-Za-z0-9_-]{11})/, // youtu.be/ID
    /\/embed\/([A-Za-z0-9_-]{11})/,   // /embed/ID
  ]
  for (const p of patterns) {
    const m = url.match(p)
    if (m) return m[1]
  }
  return null
}

export function getYoutubeWatchUrl(url: string | null): string | null {
  const id = getYoutubeId(url)
  return id ? `https://www.youtube.com/watch?v=${id}` : null
}

export function getYoutubeEmbedUrl(url: string | null): string | null {
  const id = getYoutubeId(url)
  return id ? `https://www.youtube.com/embed/${id}` : null
}

export function menuToShareUrl(menuId: string, baseUrl: string): string {
  return `${baseUrl}/menu/shared?id=${menuId}`
}
