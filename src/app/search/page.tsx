import { SearchBar } from '@/components/search/SearchBar'
import { RecipeGrid } from '@/components/recipe/RecipeGrid'
import { searchMealsByName } from '@/lib/api'
import { Search } from 'lucide-react'

interface Props {
  searchParams: Promise<{ q?: string }>
}

export async function generateMetadata({ searchParams }: Props) {
  const { q } = await searchParams
  return {
    title: q ? `"${q}" — Cuisine World` : 'Search — Cuisine World',
  }
}

export default async function SearchPage({ searchParams }: Props) {
  const { q } = await searchParams
  const query = q?.trim() ?? ''

  const meals = query ? await searchMealsByName(query) : []

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-6">
      {/* Search header */}
      <div className="space-y-3">
        <div className="max-w-lg">
          <SearchBar defaultValue={query} />
        </div>
        {query && (
          <p className="text-sm text-gray-500 flex items-center gap-1.5">
            <Search size={14} />
            {meals.length > 0
              ? `${meals.length} result${meals.length !== 1 ? 's' : ''} for "${query}"`
              : `No results for "${query}"`}
          </p>
        )}
      </div>

      {/* Results */}
      {query ? (
        <RecipeGrid
          meals={meals}
          emptyMessage={`No recipes found for "${query}". Try a different keyword.`}
        />
      ) : (
        <div className="text-center py-20 text-gray-400">
          <Search size={40} className="mx-auto mb-3 opacity-30" />
          <p>Type something to search for recipes</p>
        </div>
      )}
    </div>
  )
}
