import type { Metadata } from 'next'
import { getMealsByIds } from '@/lib/api'
import { PRESET_MENUS } from '@/lib/presetMenus'
import { MenuBuilder } from '@/components/menu/MenuBuilder'

export const metadata: Metadata = {
  title: 'My Menu — Cuisine World',
  description: 'Build your perfect meal with starters, mains, and desserts.',
}

export default async function MenuPage() {
  // Pre-fetch all preset meal data server-side
  const allIds = PRESET_MENUS.flatMap((p) => Object.values(p.mealIds))
  const uniqueIds = [...new Set(allIds)]
  const allMeals = await getMealsByIds(uniqueIds)
  const mealMap = Object.fromEntries(allMeals.map((m) => [m.id, m]))

  const presetsWithMeals = PRESET_MENUS.map((preset) => ({
    preset,
    meals: {
      starter: mealMap[preset.mealIds.starter] ?? null,
      soup:    mealMap[preset.mealIds.soup]    ?? null,
      main:    mealMap[preset.mealIds.main]    ?? null,
      dessert: mealMap[preset.mealIds.dessert] ?? null,
    },
  }))

  return <MenuBuilder presetsWithMeals={presetsWithMeals} />
}
