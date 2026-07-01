import type { Meal } from './types'

// The Explore page lets users pick options across three dimensions. Each option
// knows three things:
//  • which TheMealDB categories/areas seed its candidate pool,
//  • an optional Spoonacular complexSearch param set (rich filtering, key only),
//  • a predicate to post-filter hydrated meals.
//
// Semantics: within a dimension selections are OR'd (Chicken OR Seafood);
// across dimensions they're AND'd (Chicken AND Quick).

export type ExploreDim = 'dietary' | 'health' | 'style'

export interface ExploreOption {
  id: string
  dim: ExploreDim
  en: string
  zh: string
  emoji: string
  categories?: string[]
  areas?: string[]
  spoon?: Record<string, string>
  match: (m: Meal) => boolean
}

// Helpers for predicates.
const text = (m: Meal) =>
  `${m.name} ${m.category} ${m.instructions.join(' ')} ${m.ingredients
    .map((i) => i.name)
    .join(' ')}`.toLowerCase()
const hasWord = (m: Meal, ...words: string[]) => {
  const t = text(m)
  return words.some((w) => t.includes(w))
}
const inCat = (m: Meal, ...cats: string[]) =>
  cats.some((c) => m.category.toLowerCase() === c.toLowerCase())

export const EXPLORE_OPTIONS: ExploreOption[] = [
  // ── Dietary ────────────────────────────────────────────────────────────
  {
    id: 'vegetarian', dim: 'dietary', en: 'Vegetarian', zh: '素食', emoji: '🥗',
    categories: ['Vegetarian', 'Vegan'], spoon: { diet: 'vegetarian' },
    match: (m) => inCat(m, 'Vegetarian', 'Vegan') || (m.tags ?? []).some((t) => /veg/i.test(t)),
  },
  {
    id: 'seafood', dim: 'dietary', en: 'Seafood', zh: '海鮮', emoji: '🦐',
    categories: ['Seafood'],
    match: (m) => inCat(m, 'Seafood') || hasWord(m, 'fish', 'prawn', 'shrimp', 'salmon', 'squid', 'crab', 'seafood'),
  },
  {
    id: 'chicken', dim: 'dietary', en: 'Chicken', zh: '雞肉', emoji: '🍗',
    categories: ['Chicken'], spoon: { includeIngredients: 'chicken' },
    match: (m) => inCat(m, 'Chicken') || hasWord(m, 'chicken'),
  },
  {
    id: 'pork', dim: 'dietary', en: 'Pork', zh: '豬肉', emoji: '🥓',
    categories: ['Pork'], spoon: { includeIngredients: 'pork' },
    match: (m) => inCat(m, 'Pork') || hasWord(m, 'pork', 'bacon', 'ham'),
  },
  {
    id: 'lamb', dim: 'dietary', en: 'Lamb', zh: '羊肉', emoji: '🍖',
    categories: ['Lamb'], spoon: { includeIngredients: 'lamb' },
    match: (m) => inCat(m, 'Lamb') || hasWord(m, 'lamb', 'mutton'),
  },
  {
    id: 'no-pork', dim: 'dietary', en: 'No Pork', zh: '無豬肉', emoji: '🚫',
    spoon: { excludeIngredients: 'pork,bacon,ham' },
    match: (m) => !inCat(m, 'Pork') && !hasWord(m, 'pork', 'bacon', 'ham'),
  },

  // ── Health goal ────────────────────────────────────────────────────────
  {
    id: 'low-cal', dim: 'health', en: 'Low Calorie', zh: '低卡', emoji: '🌿',
    categories: ['Vegetarian', 'Seafood', 'Starter', 'Side'], spoon: { maxCalories: '450' },
    match: (m) => (m.nutrition ? m.nutrition.calories <= 450 : inCat(m, 'Vegetarian', 'Vegan', 'Seafood', 'Starter', 'Side')),
  },
  {
    id: 'high-protein', dim: 'health', en: 'High Protein', zh: '高蛋白', emoji: '💪',
    categories: ['Chicken', 'Beef', 'Lamb', 'Seafood', 'Pork'], spoon: { minProtein: '20' },
    match: (m) => (m.nutrition ? m.nutrition.protein >= 20 : inCat(m, 'Chicken', 'Beef', 'Lamb', 'Seafood', 'Pork')),
  },
  {
    id: 'light', dim: 'health', en: 'Light & Easy', zh: '清淡', emoji: '🍃',
    categories: ['Seafood', 'Vegetarian', 'Starter', 'Side'], spoon: { maxCalories: '550' },
    match: (m) => (m.nutrition ? m.nutrition.calories <= 550 : inCat(m, 'Seafood', 'Vegetarian', 'Vegan', 'Starter', 'Side')),
  },
  {
    id: 'balanced', dim: 'health', en: 'Balanced', zh: '均衡', emoji: '⚖️',
    // A broadly sensible everyday meal — no hard cutoff.
    match: () => true,
  },
  {
    id: 'filling', dim: 'health', en: 'Filling', zh: '飽肚', emoji: '🍛',
    categories: ['Beef', 'Pasta', 'Pork', 'Lamb'], spoon: { minCalories: '600' },
    match: (m) => (m.nutrition ? m.nutrition.calories >= 600 : inCat(m, 'Beef', 'Pasta', 'Pork', 'Lamb')),
  },

  // ── Cooking style ──────────────────────────────────────────────────────
  {
    id: 'steamed', dim: 'style', en: 'Steamed', zh: '蒸', emoji: '♨️',
    areas: ['Chinese', 'Japanese'],
    match: (m) => hasWord(m, 'steam'),
  },
  {
    id: 'stir-fried', dim: 'style', en: 'Stir-fried', zh: '炒', emoji: '🥘',
    areas: ['Chinese', 'Thai', 'Japanese'],
    match: (m) => hasWord(m, 'stir', 'stir-fry', 'wok', 'stir fry'),
  },
  {
    id: 'fried', dim: 'style', en: 'Fried', zh: '炸', emoji: '🍤',
    match: (m) => hasWord(m, 'deep fry', 'deep-fry', 'fried', 'fry until', 'batter'),
  },
  {
    id: 'baked', dim: 'style', en: 'Baked / Roasted', zh: '焗／烤', emoji: '🔥',
    match: (m) => hasWord(m, 'bake', 'baking', 'oven', 'roast'),
  },
  {
    id: 'quick', dim: 'style', en: 'Quick (<30 min)', zh: '快手', emoji: '⚡',
    spoon: { maxReadyTime: '30' },
    match: (m) => m.estTimeMinutes <= 30,
  },
]

const OPTION_BY_ID = new Map(EXPLORE_OPTIONS.map((o) => [o.id, o]))

// Default pool when no dimension seeds categories/areas (e.g. only "Balanced").
const DEFAULT_CATEGORIES = ['Chicken', 'Beef', 'Seafood', 'Vegetarian', 'Pasta', 'Pork', 'Side']

export interface ExplorePlan {
  categories: string[]
  areas: string[]
  spoon: Record<string, string>
  // Predicates grouped by dimension; a meal must satisfy ANY within each group.
  groups: ((m: Meal) => boolean)[][]
}

// Merge Spoonacular params across options: comma-join list params, min/max the
// numeric bounds so combined filters stay coherent.
function mergeSpoon(into: Record<string, string>, from?: Record<string, string>) {
  if (!from) return
  for (const [k, v] of Object.entries(from)) {
    if (k === 'maxCalories' || k === 'maxReadyTime') {
      into[k] = into[k] ? String(Math.min(+into[k], +v)) : v
    } else if (k === 'minProtein' || k === 'minCalories') {
      into[k] = into[k] ? String(Math.max(+into[k], +v)) : v
    } else if (k === 'diet' || k === 'cuisine' || k === 'includeIngredients' || k === 'excludeIngredients') {
      into[k] = into[k] ? Array.from(new Set([...into[k].split(','), ...v.split(',')])).join(',') : v
    } else {
      into[k] = v
    }
  }
}

export function buildPlan(selectedIds: string[]): ExplorePlan {
  const selected = selectedIds.map((id) => OPTION_BY_ID.get(id)).filter(Boolean) as ExploreOption[]
  const categories = new Set<string>()
  const areas = new Set<string>()
  const spoon: Record<string, string> = {}
  const byDim = new Map<ExploreDim, ((m: Meal) => boolean)[]>()

  for (const o of selected) {
    o.categories?.forEach((c) => categories.add(c))
    o.areas?.forEach((a) => areas.add(a))
    mergeSpoon(spoon, o.spoon)
    const arr = byDim.get(o.dim) ?? []
    arr.push(o.match)
    byDim.set(o.dim, arr)
  }

  const cats = categories.size > 0 || areas.size > 0 ? [...categories] : DEFAULT_CATEGORIES

  return {
    categories: cats,
    areas: [...areas],
    spoon,
    groups: [...byDim.values()],
  }
}

// A meal passes when it satisfies at least one predicate in every group.
export function matchesPlan(meal: Meal, plan: ExplorePlan): boolean {
  return plan.groups.every((group) => group.some((pred) => pred(meal)))
}
