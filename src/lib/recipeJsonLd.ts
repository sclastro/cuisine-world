import type { Meal } from './types'

// Serializes an already-loaded Meal into schema.org/Recipe JSON-LD. Purely a
// reformat of data we already fetched — no new API calls. Lets Google show
// rich results (cook time, servings, calories) for recipe pages.

function isoDuration(minutes: number): string {
  const h = Math.floor(minutes / 60)
  const m = minutes % 60
  return `PT${h > 0 ? `${h}H` : ''}${m > 0 ? `${m}M` : ''}` || 'PT0M'
}

export function buildRecipeJsonLd(meal: Meal) {
  const jsonLd: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'Recipe',
    name: meal.name,
    image: meal.thumbnail ? [meal.thumbnail] : undefined,
    description: meal.description || meal.snippet || undefined,
    recipeCategory: meal.category || undefined,
    recipeCuisine: meal.area || undefined,
    totalTime: isoDuration(meal.estTimeMinutes),
    recipeYield: `${meal.estServings}`,
    recipeIngredient: meal.ingredients.map((i) =>
      i.measure ? `${i.measure} ${i.name}` : i.name
    ),
    recipeInstructions: meal.instructions.map((step, i) => ({
      '@type': 'HowToStep',
      position: i + 1,
      text: step,
    })),
  }

  if (meal.nutrition) {
    jsonLd.nutrition = {
      '@type': 'NutritionInformation',
      calories: `${meal.nutrition.calories} kcal`,
      proteinContent: `${meal.nutrition.protein} g`,
      fatContent: `${meal.nutrition.fat} g`,
      carbohydrateContent: `${meal.nutrition.carbs} g`,
    }
  }

  if (meal.sourceUrl) {
    jsonLd.url = meal.sourceUrl
  }

  return jsonLd
}
