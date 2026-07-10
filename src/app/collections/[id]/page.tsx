import { notFound } from 'next/navigation'
import { getCollectionMeals } from '@/lib/api'
import { localizeMealsForList } from '@/lib/localize'
import { getCollection, COLLECTIONS, ACCENT_CLASSES } from '@/lib/collections'
import { BrowseResults } from '@/components/filters/BrowseResults'
import { FilterChips } from '@/components/filters/FilterChips'
import { LocalizedText } from '@/components/ui/LocalizedText'

export const dynamic = 'force-dynamic'

interface Props {
  params: Promise<{ id: string }>
}

export async function generateMetadata({ params }: Props) {
  const { id } = await params
  const def = getCollection(id)
  if (!def) return { title: 'Collection — Cuisine World' }
  return { title: `${def.titleEn} — Cuisine World`, description: def.blurbEn }
}

export default async function CollectionPage({ params }: Props) {
  const { id } = await params
  const def = getCollection(id)
  if (!def) notFound()

  const result = await getCollectionMeals(id)
  if (!result) notFound()

  const meals = await localizeMealsForList(result.meals)
  const accent = ACCENT_CLASSES[def.accent]

  const chips = COLLECTIONS.map((c) => ({
    href: `/collections/${c.id}`,
    en: c.titleEn,
    zh: c.titleZh,
    prefix: c.emoji,
  }))

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-6">
      {/* Collection header */}
      <div className={`rounded-2xl border ${accent.border} ${accent.bg} p-6 space-y-2`}>
        <div className="flex items-center gap-3">
          <span className="text-4xl">{def.emoji}</span>
          <div>
            <h1 className="text-2xl font-bold font-display text-gray-900">
              <LocalizedText en={def.titleEn} zh={def.titleZh} />
            </h1>
            <p className={`text-sm ${accent.text}`}>
              {result.total} <LocalizedText en="recipes" zh="道食譜" />
            </p>
          </div>
        </div>
        <p className="text-sm text-gray-600 leading-relaxed max-w-2xl">
          <LocalizedText en={def.blurbEn} zh={def.blurbZh} />
        </p>
      </div>

      {/* Jump to other collections */}
      <FilterChips
        chips={chips}
        activeHref={`/collections/${id}`}
        titleEn="More collections"
        titleZh="更多合集"
      />

      <BrowseResults meals={meals} total={result.total} restIds={result.restIds} />
    </div>
  )
}
