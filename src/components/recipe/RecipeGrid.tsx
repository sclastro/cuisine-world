import type { Meal, MealSummary } from '@/lib/types'
import { RecipeCard } from './RecipeCard'

interface Props {
  meals: (Meal | MealSummary)[]
  emptyMessage?: string
}

export function RecipeGrid({ meals, emptyMessage = 'No recipes found.' }: Props) {
  if (meals.length === 0) {
    return (
      <p className="text-center text-gray-400 py-16">{emptyMessage}</p>
    )
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
      {meals.map((meal) => (
        <RecipeCard
          key={meal.id}
          meal={meal}
          difficulty={'difficulty' in meal ? meal.difficulty : undefined}
        />
      ))}
    </div>
  )
}
