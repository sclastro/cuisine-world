import { notFound } from 'next/navigation'
import { getMealsByCategoryFull, getAllCategories } from '@/lib/api'
import { localizeMealsForList } from '@/lib/localize'
import { categoryZh } from '@/lib/categories'
import { BrowseResults } from '@/components/filters/BrowseResults'
import { FilterChips } from '@/components/filters/FilterChips'
import { LocalizedText } from '@/components/ui/LocalizedText'

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

  const [{ total, meals: rawMeals, restIds }, allCategories] = await Promise.all([
    getMealsByCategoryFull(category),
    getAllCategories(),
  ])

  if (total === 0 && allCategories.length > 0) {
    const valid = allCategories.some((c) => c.name.toLowerCase() === category.toLowerCase())
    if (!valid) notFound()
  }

  const meals = await localizeMealsForList(rawMeals)

  const chips = allCategories.map((c) => ({
    href: `/category/${encodeURIComponent(c.name)}`,
    en: c.name,
    zh: categoryZh(c.name),
  }))

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-6">
      {/* Header */}
      <div className="space-y-1">
        <h1 className="text-2xl font-bold text-gray-800">
          <LocalizedText en={`${category} Recipes`} zh={`${categoryZh(category)}食譜`} />
        </h1>
        <p className="text-sm text-gray-500">
          <LocalizedText en={`${total} recipes found`} zh={`共 ${total} 道食譜`} />
        </p>
      </div>

      {/* Category filter chips */}
      <FilterChips
        chips={chips}
        activeHref={`/category/${encodeURIComponent(category)}`}
        titleEn="Browse categories"
        titleZh="按分類瀏覽"
      />

      {/* Results with difficulty filter + sort */}
      <BrowseResults meals={meals} total={total} restIds={restIds} />
    </div>
  )
}
