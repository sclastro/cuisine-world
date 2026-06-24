import { notFound } from 'next/navigation'
import { searchEverydayRecipes } from '@/lib/spoonacular'
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

  const { total, meals } = await searchEverydayRecipes(type as 'quick' | 'asian' | 'world')

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-6">
      {/* Header */}
      <div className="space-y-1">
        <h1 className="text-2xl font-bold text-gray-800">
          {meta.emoji} {meta.en}
          <span className="ml-2 text-base font-normal text-gray-400">{meta.zh}</span>
        </h1>
        <p className="text-sm text-gray-500">{meta.descEn}</p>
        <p className="text-xs text-gray-400">
          {meals.length > 0
            ? `Showing ${meals.length}${total > meals.length ? ` of ${total}` : ''} recipes`
            : 'No recipes found — check your API key'}
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
            {m.emoji} {m.en}
          </a>
        ))}
      </div>

      <BrowseResults meals={meals} total={total} />
    </div>
  )
}
