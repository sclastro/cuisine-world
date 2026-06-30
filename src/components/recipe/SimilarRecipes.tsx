import { getMealsByCategory, getMealsByIdsFull } from '@/lib/api'
import { localizeMealsForList } from '@/lib/localize'
import { categoryZh } from '@/lib/categories'
import { RecipeGrid } from './RecipeGrid'
import { LocalizedText } from '@/components/ui/LocalizedText'

interface Props {
  category: string
  excludeId: string
}

export async function SimilarRecipes({ category, excludeId }: Props) {
  const summaries = await getMealsByCategory(category)
  const ids = summaries.filter((m) => m.id !== excludeId).slice(0, 4).map((m) => m.id)
  if (ids.length === 0) return null

  // Hydrate + localize so the related cards show difficulty/time and translate.
  const similar = await localizeMealsForList(await getMealsByIdsFull(ids))
  if (similar.length === 0) return null

  return (
    <section className="max-w-3xl mx-auto px-4 pb-12 space-y-4">
      <h2 className="text-lg font-bold text-gray-800">
        <LocalizedText en={`More ${category} Recipes`} zh={`更多${categoryZh(category)}食譜`} />
      </h2>
      <RecipeGrid meals={similar} />
    </section>
  )
}
