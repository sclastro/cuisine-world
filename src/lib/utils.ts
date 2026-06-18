import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'
import type { RawMeal, Ingredient, DifficultyScore } from './types'

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

export function getYoutubeWatchUrl(url: string | null): string | null {
  if (!url) return null
  const match = url.match(/[?&]v=([^&]+)/)
  if (!match) return null
  return `https://www.youtube.com/watch?v=${match[1]}`
}

export function menuToShareUrl(menuId: string, baseUrl: string): string {
  return `${baseUrl}/menu/shared?id=${menuId}`
}
