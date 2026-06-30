import { notFound } from 'next/navigation'
import { getAreaMealsCombined, getAllAreas } from '@/lib/api'
import { localizeMealsForList } from '@/lib/localize'
import { getAreaInfo, AREA_INFO, curatedAreaList } from '@/lib/areas'
import { BrowseResults } from '@/components/filters/BrowseResults'
import { FilterChips } from '@/components/filters/FilterChips'
import { AreaIntro } from '@/components/recipe/AreaIntro'

export const dynamic = 'force-dynamic'

interface Props {
  params: Promise<{ name: string }>
}

export async function generateMetadata({ params }: Props) {
  const { name } = await params
  const area = decodeURIComponent(name)
  const info = getAreaInfo(area)
  return {
    title: `${area} Cuisine — Cuisine World`,
    description: info.introEn,
  }
}

export default async function AreaPage({ params }: Props) {
  const { name } = await params
  const area = decodeURIComponent(name)

  const [{ total, meals: rawMeals, restIds }, allAreas] = await Promise.all([
    getAreaMealsCombined(area),
    getAllAreas(),
  ])

  // 404 only if the area isn't a known region AND has no recipes from either source.
  const known = area in AREA_INFO || allAreas.some((a) => a.name.toLowerCase() === area.toLowerCase())
  if (total === 0 && !known) notFound()

  const meals = await localizeMealsForList(rawMeals)
  const info = getAreaInfo(area)

  const chips = curatedAreaList(allAreas.map((a) => a.name), area).map((name) => {
    const ai = getAreaInfo(name)
    return {
      href: `/area/${encodeURIComponent(name)}`,
      en: name,
      zh: ai.nameZh,
      prefix: ai.flag,
    }
  })

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-6">
      {/* Bilingual header + hand-written intro */}
      <AreaIntro
        flag={info.flag}
        area={area}
        nameZh={info.nameZh}
        introEn={info.introEn}
        introZh={info.introZh}
        recipeCount={total}
      />

      {/* Area filter chips */}
      <FilterChips
        chips={chips}
        activeHref={`/area/${encodeURIComponent(area)}`}
        titleEn="Browse by region"
        titleZh="按地區瀏覽"
      />

      {/* Results with difficulty filter + sort (TheMealDB + Spoonacular merged) */}
      <BrowseResults meals={meals} total={total} restIds={restIds} />
    </div>
  )
}
