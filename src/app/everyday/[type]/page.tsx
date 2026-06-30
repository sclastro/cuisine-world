import { notFound } from 'next/navigation'
import { getEverydayMeals } from '@/lib/api'
import { localizeMealsForList } from '@/lib/localize'
import { LocalizedText } from '@/components/ui/LocalizedText'
import { BrowseResults } from '@/components/filters/BrowseResults'

export const dynamic = 'force-dynamic'

interface Props {
  params: Promise<{ type: string }>
}

const META: Record<string, { en: string; zh: string; emoji: string; descEn: string; descZh: string }> = {
  quick: {
    en: 'Quick Meals',  zh: '快手菜',
    emoji: '⚡',
    descEn: 'Ready in 30 minutes or less',
    descZh: '30分鐘內上桌',
  },
  asian: {
    en: 'Asian Home',  zh: '亞洲家常',
    emoji: '🥢',
    descEn: 'HK, Japanese, Korean, Thai & more',
    descZh: '港、日、韓、泰等亞洲家常',
  },
  world: {
    en: 'World Kitchen', zh: '世界家常',
    emoji: '🌍',
    descEn: 'Western & Mediterranean everyday dishes',
    descZh: '西式及地中海家常菜',
  },
}

export async function generateMetadata({ params }: Props) {
  const { type } = await params
  const meta = META[type]
  if (!meta) return { title: 'Cuisine World' }
  return { title: `${meta.en} — Cuisine World`, description: meta.descEn }
}

export default async function EverydayTypePage({ params }: Props) {
  const { type } = await params
  const meta = META[type]
  if (!meta) notFound()

  const raw = await getEverydayMeals(type as 'quick' | 'asian' | 'world')
  const meals = await localizeMealsForList(raw.meals)
  const { total, restIds } = raw

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-6">
      {/* Header */}
      <div className="space-y-1">
        <h1 className="text-2xl font-bold text-gray-800">
          {meta.emoji} <LocalizedText en={meta.en} zh={meta.zh} />
        </h1>
        <p className="text-sm text-gray-500">
          <LocalizedText en={meta.descEn} zh={meta.descZh} />
        </p>
        <p className="text-xs text-gray-400">
          <LocalizedText
            en={`Showing ${meals.length}${total > meals.length ? ` of ${total}` : ''} recipes`}
            zh={`顯示 ${meals.length}${total > meals.length ? ` / ${total}` : ''} 道食譜`}
          />
        </p>
      </div>

      {/* Sub-nav */}
      <div className="flex flex-wrap gap-2">
        {Object.entries(META).map(([t, m]) => (
          <a
            key={t}
            href={`/everyday/${t}`}
            className={[
              'text-xs px-3 py-1.5 rounded-full border transition-colors',
              t === type
                ? 'bg-green-600 text-white border-green-600'
                : 'bg-white text-gray-600 border-green-100 hover:border-green-400 hover:text-green-700',
            ].join(' ')}
          >
            {m.emoji} <LocalizedText en={m.en} zh={m.zh} />
          </a>
        ))}
      </div>

      <BrowseResults meals={meals} total={total} restIds={restIds} />
    </div>
  )
}
