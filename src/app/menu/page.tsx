import type { Metadata } from 'next'
import { resolvePresetMenu } from '@/lib/api'
import { PRESET_MENUS } from '@/lib/presetMenus'
import { MenuBuilder } from '@/components/menu/MenuBuilder'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'My Menu — Cuisine World',
  description: 'Build your perfect meal with starters, mains, and desserts.',
}

export default async function MenuPage() {
  // Resolve each preset menu's slots from its cuisine at request time, so every
  // dish is real, complete and on-theme (no drifting hard-coded IDs).
  const presetsWithMeals = await Promise.all(
    PRESET_MENUS.map(async (preset) => ({
      preset,
      meals: await resolvePresetMenu(preset),
    }))
  )

  return <MenuBuilder presetsWithMeals={presetsWithMeals} />
}
