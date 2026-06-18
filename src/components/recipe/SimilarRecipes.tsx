import { getMealsByCategory } from '@/lib/api'
import { RecipeCard } from './RecipeCard'

interface Props {
  category: string
  excludeId: string
}

export async function SimilarRecipes({ category, excludeId }: Props) {
  const meals = await getMealsByCategory(category)
  const similar = meals.filter((m) => m.id !== excludeId).slice(0, 4)

  if (similar.length === 0) return null

  return (
    <section className="max-w-3xl mx-auto px-4 pb-12 space-y-4">
      <h2 className="text-lg font-bold text-gray-800">
        More {category} Recipes
      </h2>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {similar.map((meal) => (
          <RecipeCard key={meal.id} meal={meal} />
        ))}
      </div>
    </section>
  )
}
