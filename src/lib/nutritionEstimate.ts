import type { Meal, NutritionData } from './types'

// Last-resort nutrition estimator, used when neither Spoonacular nor Open Food
// Facts has data. A pure, deterministic function of the meal's real fields
// (category + ingredients + instructions), so the same recipe always shows the
// same numbers (SSR === client, refresh-stable). Clearly labelled "estimate"
// in the UI — a sensible guide, not a measurement.

interface Profile { cal: number; p: number; f: number; c: number }

// Base per-serving profile by category.
const CATEGORY_PROFILES: Record<string, Profile> = {
  Beef:       { cal: 550, p: 38, f: 30, c: 25 },
  Chicken:    { cal: 480, p: 36, f: 22, c: 25 },
  Lamb:       { cal: 560, p: 36, f: 32, c: 22 },
  Pork:       { cal: 540, p: 34, f: 30, c: 24 },
  Goat:       { cal: 500, p: 36, f: 24, c: 20 },
  Seafood:    { cal: 380, p: 32, f: 16, c: 20 },
  Pasta:      { cal: 480, p: 18, f: 16, c: 62 },
  Vegetarian: { cal: 350, p: 12, f: 14, c: 45 },
  Vegan:      { cal: 330, p: 11, f: 12, c: 46 },
  Dessert:    { cal: 420, p: 6,  f: 18, c: 60 },
  Breakfast:  { cal: 400, p: 18, f: 18, c: 40 },
  Starter:    { cal: 280, p: 12, f: 14, c: 26 },
  Side:       { cal: 250, p: 8,  f: 10, c: 32 },
  Soup:       { cal: 260, p: 14, f: 10, c: 24 },
}
const DEFAULT_PROFILE: Profile = { cal: 450, p: 25, f: 20, c: 40 }

// Keyword nudges applied per matching ingredient (each keyword counts once).
const FAT_WORDS = ['cream', 'cheese', 'butter', 'coconut milk', 'coconut cream', 'mayonnaise', 'lard', 'ghee']
const CARB_WORDS = ['sugar', 'honey', 'flour', 'rice', 'noodle', 'pasta', 'spaghetti', 'potato', 'bread', 'syrup', 'oats', 'tortilla']
const PROTEIN_WORDS = ['chicken', 'beef', 'pork', 'lamb', 'fish', 'salmon', 'tuna', 'prawn', 'shrimp', 'tofu', 'egg', 'lentil', 'chickpea', 'bean', 'turkey', 'duck']
const FRY_WORDS = ['deep fry', 'deep-fry', 'fried', 'fry until']

const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v))

export function estimateNutrition(meal: Meal): NutritionData {
  const base = CATEGORY_PROFILES[meal.category] ?? DEFAULT_PROFILE
  let { cal, p, f, c } = base

  const ingText = meal.ingredients.map((i) => i.name.toLowerCase()).join(' | ')
  const count = (words: string[]) => words.filter((w) => ingText.includes(w)).length

  const fatHits = count(FAT_WORDS)
  const carbHits = count(CARB_WORDS)
  const proteinHits = count(PROTEIN_WORDS)

  f += fatHits * 6
  cal += fatHits * 55
  c += carbHits * 8
  cal += carbHits * 35
  p += proteinHits * 5
  cal += proteinHits * 25

  // Frying technique adds fat.
  const instrText = meal.instructions.join(' ').toLowerCase()
  if (FRY_WORDS.some((w) => instrText.includes(w))) {
    f += 8
    cal += 70
  }

  // Mild scale by richness of the ingredient list (8 ingredients = neutral).
  const scale = clamp(1 + (meal.ingredients.length - 8) * 0.02, 0.85, 1.25)
  cal *= scale
  p *= scale
  f *= scale
  c *= scale

  return {
    calories: Math.round(clamp(cal, 150, 900)),
    protein: Math.round(clamp(p, 5, 60)),
    fat: Math.round(clamp(f, 5, 50)),
    carbs: Math.round(clamp(c, 5, 90)),
    source: 'estimate',
  }
}
