import { notFound } from 'next/navigation'
import { getMealsByCategory, getAllCategories } from '@/lib/api'
import { RecipeGrid } from '@/components/recipe/RecipeGrid'
import { FilterChips } from '@/components/filters/FilterChips'

interface Props {
  params: Promise<{ name: string }>
}

export async function generateMetadata({ params }: Props) {
  const { name } = await params
  const category = decodeURIComponent(name)
  return {
    title: `${category} Recipes — Cuisine World`,
    description: `Browse ${category} recipes from around the world.`,
  }
}

export default async function CategoryPage({ params }: Props) {
  const { name } = await params
  const category = decodeURIComponent(name)

  const [meals, allCategories] = await Promise.all([
    getMealsByCategory(category),
    getAllCategories(),
  ])

  if (meals.length === 0 && allCategories.length > 0) {
    const valid = allCategories.some((c) => c.name.toLowerCase() === category.toLowerCase())
    if (!valid) notFound()
  }

  const chips = allCategories.map((c) => ({
    label: c.name,
    href: `/category/${encodeURIComponent(c.name)}`,
  }))

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-6">
      {/* Header */}
      <div className="space-y-1">
        <h1 className="text-2xl font-bold text-gray-800">{category} Recipes</h1>
        <p className="text-sm text-gray-500">{meals.length} recipes found</p>
      </div>

      {/* Category filter chips */}
      <FilterChips chips={chips} activeLabel={category} title="Browse categories" />

      {/* Results */}
      <RecipeGrid meals={meals} emptyMessage={`No recipes found for "${category}".`} />
    </div>
  )
}
