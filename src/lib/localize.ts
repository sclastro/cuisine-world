import type { Meal } from './types'
import { translateToZh, translateManyToZh } from './translate'
import { getAreaInfo } from './areas'
import { categoryZh } from './categories'
import { getNutrition } from './openFoodFacts'
import { resolveDescription } from './recipeDescriptions'

// Attaches Chinese translations to meals, server-side.
//
// Structural fields (area, category) use hand-checked static dictionaries for
// perfect quality and zero API cost. Free-text fields (name, snippet,
// instructions, ingredients) use the cached machine translator. Everything is
// computed once and cached, so repeat views are instant.

// List view: only the fields a card shows (name + snippet + area/category).
// Kept lean so a grid of cards doesn't translate full instructions it never renders.
export async function localizeMealsForList(meals: Meal[]): Promise<Meal[]> {
  const namesZh = await translateManyToZh(meals.map((m) => m.name))
  const snippetsZh = await translateManyToZh(meals.map((m) => m.snippet ?? ''))
  return meals.map((m, i) => {
    const withZh: Meal = {
      ...m,
      nameZh: namesZh[i],
      snippetZh: snippetsZh[i],
      areaZh: m.area ? getAreaInfo(m.area).nameZh : '',
      categoryZh: m.category ? categoryZh(m.category) : '',
    }
    const desc = resolveDescription(withZh)
    return { ...withZh, description: desc.en, descriptionZh: desc.zh }
  })
}

// Detail view: everything, including ingredients and step-by-step instructions.
export async function localizeMealFull(meal: Meal): Promise<Meal> {
  // Spoonacular meals already carry nutrition; for the rest, try Open Food Facts.
  const nutritionPromise = meal.nutrition
    ? Promise.resolve(meal.nutrition)
    : getNutrition(meal.name)

  const [nameZh, snippetZh, instructionsZh, ingredientsZh, tagsZh, nutrition] =
    await Promise.all([
      translateToZh(meal.name),
      translateToZh(meal.snippet ?? ''),
      translateManyToZh(meal.instructions),
      translateManyToZh(meal.ingredients.map((ing) => ing.name)),
      translateManyToZh(meal.tags),
      nutritionPromise,
    ])

  const withZh: Meal = {
    ...meal,
    nameZh,
    snippetZh,
    areaZh: meal.area ? getAreaInfo(meal.area).nameZh : '',
    categoryZh: meal.category ? categoryZh(meal.category) : '',
    instructionsZh,
    ingredientsZh,
    tagsZh,
    nutrition: nutrition ?? undefined,
  }
  const desc = resolveDescription(withZh)
  return { ...withZh, description: desc.en, descriptionZh: desc.zh }
}
