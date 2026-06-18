'use client'

import { Sparkles } from 'lucide-react'
import type { PresetMenuDef } from '@/lib/presetMenus'
import type { MealSummary } from '@/lib/types'
import { useMenu } from '@/context/MenuContext'
import { cn } from '@/lib/utils'

interface Props {
  preset: PresetMenuDef
  meals: {
    starter: MealSummary | null
    soup: MealSummary | null
    main: MealSummary | null
    dessert: MealSummary | null
  }
}

export function PresetMenuCard({ preset, meals }: Props) {
  const { loadPreset } = useMenu()

  function handleLoad() {
    loadPreset({
      name: preset.name,
      starter: meals.starter,
      soup: meals.soup,
      main: meals.main,
      dessert: meals.dessert,
    })
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const previewMeals = [meals.starter, meals.soup, meals.main, meals.dessert].filter(Boolean)

  return (
    <div className={cn(
      'rounded-2xl border bg-gradient-to-br p-5 space-y-3 hover:shadow-md transition-shadow',
      preset.theme
    )}>
      <div className="flex items-start justify-between gap-2">
        <div>
          <p className="text-2xl mb-1">{preset.emoji}</p>
          <h3 className="font-bold text-gray-800">{preset.name}</h3>
          <p className="text-xs text-gray-500 mt-0.5">{preset.description}</p>
        </div>
      </div>

      {/* Preview meal names */}
      <ul className="space-y-1">
        {[
          { label: '🥗', meal: meals.starter },
          { label: '🍲', meal: meals.soup },
          { label: '🍽️', meal: meals.main },
          { label: '🍰', meal: meals.dessert },
        ].map(({ label, meal }, i) => (
          <li key={i} className="flex items-center gap-2 text-xs text-gray-600">
            <span>{label}</span>
            <span className="truncate">{meal?.name ?? <span className="text-gray-300 italic">Loading…</span>}</span>
          </li>
        ))}
      </ul>

      <button
        onClick={handleLoad}
        disabled={previewMeals.length < 4}
        className={cn(
          'w-full flex items-center justify-center gap-1.5 py-2 rounded-xl text-sm font-semibold transition-colors',
          previewMeals.length >= 4
            ? 'bg-white text-gray-800 hover:bg-green-600 hover:text-white shadow-sm'
            : 'bg-white/50 text-gray-400 cursor-not-allowed'
        )}
      >
        <Sparkles size={14} />
        Use this menu
      </button>
    </div>
  )
}
