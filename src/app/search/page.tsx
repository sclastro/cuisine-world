import { SearchBar } from '@/components/search/SearchBar'
import { BrowseResults } from '@/components/filters/BrowseResults'
import { searchMealsByNameFull } from '@/lib/api'
import { Search } from 'lucide-react'

export const dynamic = 'force-dynamic'

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

  const { total, meals, restIds } = query
    ? await searchMealsByNameFull(query)
    : { total: 0, meals: [], restIds: [] as string[] }

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
            {total > 0
              ? `${total} result${total !== 1 ? 's' : ''} for "${query}"`
              : `No results for "${query}"`}
          </p>
        )}
      </div>

      {/* Results */}
      {query ? (
        <BrowseResults meals={meals} total={total} restIds={restIds} />
      ) : (
        <div className="text-center py-20 text-gray-400">
          <Search size={40} className="mx-auto mb-3 opacity-30" />
          <p>Type something to search for recipes</p>
        </div>
      )}
    </div>
  )
}
