'use client'

import { useSearchParams } from 'next/navigation'
import { useEffect } from 'react'
import { Trash2 } from 'lucide-react'
import { useMenu } from '@/context/MenuContext'
import { getMealsByIds } from '@/lib/api'
import { MenuSlot } from './MenuSlot'
import { PresetMenuCard } from './PresetMenuCard'
import { ShareMenuButton } from './ShareMenuButton'
import type { PresetMenuDef } from '@/lib/presetMenus'
import type { MealSummary } from '@/lib/types'
import { Suspense } from 'react'

interface PresetsWithMeals {
  preset: PresetMenuDef
  meals: {
    starter: MealSummary | null
    soup:    MealSummary | null
    main:    MealSummary | null
    dessert: MealSummary | null
  }
}

interface Props {
  presetsWithMeals: PresetsWithMeals[]
}

// Inner component that uses useSearchParams (must be inside Suspense)
function MenuBuilderInner({ presetsWithMeals }: Props) {
  const searchParams = useSearchParams()
  const { menu, clearMenu, loadPreset, mounted } = useMenu()

  // Load shared menu from URL params on first mount
  useEffect(() => {
    const s = searchParams.get('s')
    const w = searchParams.get('w')
    const m = searchParams.get('m')
    const d = searchParams.get('d')
    const name = searchParams.get('name')

    const ids = [s, w, m, d].filter((id): id is string => Boolean(id))
    if (ids.length === 0) return

    getMealsByIds(ids).then((meals) => {
      const byId = Object.fromEntries(meals.map((meal) => [meal.id, meal]))
      loadPreset({
        name: name ?? 'Shared Menu',
        starter: s ? (byId[s] ?? null) : null,
        soup:    w ? (byId[w] ?? null) : null,
        main:    m ? (byId[m] ?? null) : null,
        dessert: d ? (byId[d] ?? null) : null,
      })
    })
  // Run once on mount only
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const filledCount = [menu.starter, menu.soup, menu.main, menu.dessert].filter(Boolean).length

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-12">

      {/* Page header */}
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold text-gray-900">
          Build Your Perfect Meal 🍽️
        </h1>
        <p className="text-gray-400 text-sm">
          Curate your ideal dining experience — one course at a time
        </p>
      </div>

      {/* Menu name + actions */}
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-400 font-medium">Menu:</span>
          {mounted ? (
            <span className="text-sm font-semibold text-gray-800 bg-green-50 px-3 py-1 rounded-full border border-green-100">
              {menu.name}
            </span>
          ) : (
            <div className="w-24 h-6 bg-gray-100 rounded-full animate-pulse" />
          )}
        </div>
        <div className="flex items-center gap-2">
          <ShareMenuButton />
          {filledCount > 0 && (
            <button
              onClick={clearMenu}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors border border-transparent hover:border-red-100"
            >
              <Trash2 size={13} />
              Clear
            </button>
          )}
        </div>
      </div>

      {/* 4 Menu slots */}
      <div className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <MenuSlot course="starter" />
          <MenuSlot course="soup" />
          <MenuSlot course="main" />
          <MenuSlot course="dessert" />
        </div>

        {filledCount > 0 && (
          <p className="text-center text-xs text-gray-400">
            {filledCount} of 4 courses selected
            {filledCount === 4 && ' — Your menu is complete! 🎉'}
          </p>
        )}
      </div>

      {/* Preset menus */}
      <section className="space-y-4">
        <div className="text-center space-y-1">
          <h2 className="text-lg font-bold text-gray-800">Need Inspiration?</h2>
          <p className="text-sm text-gray-400">
            Start with one of our curated menus and make it yours
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {presetsWithMeals.map(({ preset, meals }) => (
            <PresetMenuCard key={preset.id} preset={preset} meals={meals} />
          ))}
        </div>
      </section>

    </div>
  )
}

export function MenuBuilder({ presetsWithMeals }: Props) {
  return (
    <Suspense fallback={
      <div className="max-w-4xl mx-auto px-4 py-8 space-y-6 animate-pulse">
        <div className="h-9 bg-gray-100 rounded w-64 mx-auto" />
        <div className="grid grid-cols-2 gap-4">
          {Array.from({ length: 4 }, (_, i) => (
            <div key={i} className="h-48 bg-gray-100 rounded-2xl" />
          ))}
        </div>
      </div>
    }>
      <MenuBuilderInner presetsWithMeals={presetsWithMeals} />
    </Suspense>
  )
}
