'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { Search, Sparkles, RotateCcw } from 'lucide-react'
import { EXPLORE_OPTIONS, type ExploreDim } from '@/lib/exploreQuery'
import { exploreRecipes } from '@/app/actions'
import { useLanguage } from '@/context/LanguageContext'
import { useT } from '@/hooks/useT'
import { cn } from '@/lib/utils'
import type { Meal } from '@/lib/types'
import { ExploreResults } from './ExploreResults'

interface Props {
  initialMeals: Meal[]
}

const DIMENSIONS: { key: ExploreDim; labelKey: 'explore.dietary' | 'explore.health' | 'explore.style' }[] = [
  { key: 'dietary', labelKey: 'explore.dietary' },
  { key: 'health',  labelKey: 'explore.health' },
  { key: 'style',   labelKey: 'explore.style' },
]

export function ExploreWizard({ initialMeals }: Props) {
  const t = useT()
  const { lang } = useLanguage()
  const router = useRouter()
  const [selected, setSelected] = useState<Set<string>>(new Set())
  const [meals, setMeals] = useState<Meal[]>(initialMeals)
  const [searched, setSearched] = useState(false)
  const [isPending, startTransition] = useTransition()

  function toggle(id: string) {
    setSelected((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  function find() {
    startTransition(async () => {
      const results = await exploreRecipes([...selected])
      setMeals(results)
      setSearched(true)
    })
  }

  function reset() {
    setSelected(new Set())
    setMeals(initialMeals)
    setSearched(false)
  }

  function surprise() {
    const pool = searched ? meals : initialMeals
    if (pool.length === 0) return
    const pick = pool[Math.floor(Math.random() * pool.length)]
    router.push(`/recipe/${pick.id}`)
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-8">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold text-gray-900">{t('explore.title')} 🧭</h1>
        <p className="text-gray-400 text-sm max-w-xl mx-auto">{t('explore.subtitle')}</p>
      </div>

      {/* Filter dimensions */}
      <div className="space-y-5">
        {DIMENSIONS.map(({ key, labelKey }) => (
          <div key={key} className="space-y-2">
            <h2 className="text-xs font-semibold uppercase tracking-wide text-gray-400">
              {t(labelKey)}
            </h2>
            <div className="flex flex-wrap gap-2">
              {EXPLORE_OPTIONS.filter((o) => o.dim === key).map((o) => {
                const active = selected.has(o.id)
                return (
                  <button
                    key={o.id}
                    onClick={() => toggle(o.id)}
                    className={cn(
                      'flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-sm border transition-colors',
                      active
                        ? 'bg-green-600 text-white border-green-600 shadow-sm'
                        : 'bg-white text-gray-600 border-green-100 hover:border-green-400 hover:bg-green-50'
                    )}
                  >
                    <span>{o.emoji}</span>
                    {lang === 'zh' ? o.zh : o.en}
                  </button>
                )
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Actions */}
      <div className="flex flex-wrap items-center gap-3">
        <button
          onClick={find}
          disabled={isPending}
          className="flex items-center gap-2 px-6 py-2.5 rounded-full bg-green-600 text-white text-sm font-medium hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm"
        >
          <Search size={16} />
          {isPending ? t('explore.finding') : t('explore.find')}
        </button>
        <button
          onClick={surprise}
          className="flex items-center gap-1.5 px-4 py-2.5 rounded-full text-sm font-medium text-white bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 shadow-sm transition-colors"
        >
          <Sparkles size={15} />
          {t('explore.surprise')}
        </button>
        {selected.size > 0 && (
          <button
            onClick={reset}
            className="flex items-center gap-1.5 px-3 py-2.5 rounded-full text-sm text-gray-400 hover:text-red-500 transition-colors"
          >
            <RotateCcw size={14} />
            {t('explore.reset')}
          </button>
        )}
      </div>

      {/* Results */}
      <ExploreResults meals={meals} loading={isPending} searched={searched} />
    </div>
  )
}
