import { notFound } from 'next/navigation'
import { getMealsByCategoryFull, getAllCategories } from '@/lib/api'
import { BrowseResults } from '@/components/filters/BrowseResults'
import { FilterChips } from '@/components/filters/FilterChips'

export const dynamic = 'force-dynamic'

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

  const [{ total, meals, restIds }, allCategories] = await Promise.all([
    getMealsByCategoryFull(category),
    getAllCategories(),
  ])

  if (total === 0 && allCategories.length > 0) {
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
        <p className="text-sm text-gray-500">{total} recipes found</p>
      </div>

      {/* Category filter chips */}
      <FilterChips chips={chips} activeLabel={category} title="Browse categories" />

      {/* Results with difficulty filter + sort */}
      <BrowseResults meals={meals} total={total} restIds={restIds} />
    </div>
  )
}
