import { notFound } from 'next/navigation'
import { getMealsByAreaFull, getAllAreas } from '@/lib/api'
import { BrowseResults } from '@/components/filters/BrowseResults'
import { FilterChips } from '@/components/filters/FilterChips'

export const dynamic = 'force-dynamic'

interface Props {
  params: Promise<{ name: string }>
}

export async function generateMetadata({ params }: Props) {
  const { name } = await params
  const area = decodeURIComponent(name)
  return {
    title: `${area} Cuisine — Cuisine World`,
    description: `Explore traditional ${area} recipes and dishes.`,
  }
}

// Map area names to flag emojis for display
const AREA_FLAGS: Record<string, string> = {
  American: '🇺🇸', British: '🇬🇧', Canadian: '🇨🇦', Chinese: '🇨🇳',
  Croatian: '🇭🇷', Dutch: '🇳🇱', Egyptian: '🇪🇬', Filipino: '🇵🇭',
  French: '🇫🇷', Greek: '🇬🇷', Indian: '🇮🇳', Irish: '🇮🇪',
  Italian: '🇮🇹', Jamaican: '🇯🇲', Japanese: '🇯🇵', Kenyan: '🇰🇪',
  Malaysian: '🇲🇾', Mexican: '🇲🇽', Moroccan: '🇲🇦', Norwegian: '🇳🇴',
  Polish: '🇵🇱', Portuguese: '🇵🇹', Russian: '🇷🇺', Spanish: '🇪🇸',
  Thai: '🇹🇭', Tunisian: '🇹🇳', Turkish: '🇹🇷', Ukrainian: '🇺🇦',
  Vietnamese: '🇻🇳',
}

export default async function AreaPage({ params }: Props) {
  const { name } = await params
  const area = decodeURIComponent(name)

  const [{ total, meals, restIds }, allAreas] = await Promise.all([
    getMealsByAreaFull(area),
    getAllAreas(),
  ])

  if (total === 0 && allAreas.length > 0) {
    const valid = allAreas.some((a) => a.name.toLowerCase() === area.toLowerCase())
    if (!valid) notFound()
  }

  const chips = allAreas.map((a) => ({
    label: `${AREA_FLAGS[a.name] ?? '🌍'} ${a.name}`,
    href: `/area/${encodeURIComponent(a.name)}`,
  }))

  const activeChipLabel = `${AREA_FLAGS[area] ?? '🌍'} ${area}`
  const flag = AREA_FLAGS[area] ?? '🌍'

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-6">
      {/* Header */}
      <div className="space-y-1">
        <h1 className="text-2xl font-bold text-gray-800">
          {flag} {area} Cuisine
        </h1>
        <p className="text-sm text-gray-500">{total} recipes found</p>
      </div>

      {/* Area filter chips */}
      <FilterChips chips={chips} activeLabel={activeChipLabel} title="Browse by region" />

      {/* Results with difficulty filter + sort */}
      <BrowseResults meals={meals} total={total} restIds={restIds} />
    </div>
  )
}
