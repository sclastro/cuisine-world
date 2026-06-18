'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import type { MealSummary, CourseType } from '@/lib/types'

interface MenuState {
  name: string
  starter: MealSummary | null
  soup: MealSummary | null
  main: MealSummary | null
  dessert: MealSummary | null
}

interface MenuContextValue {
  menu: MenuState
  setSlot: (course: CourseType, meal: MealSummary | null) => void
  setMenuName: (name: string) => void
  loadPreset: (preset: MenuState) => void
  clearMenu: () => void
  mounted: boolean
}

const DEFAULT_MENU: MenuState = {
  name: 'My Menu',
  starter: null,
  soup: null,
  main: null,
  dessert: null,
}

const MenuContext = createContext<MenuContextValue>({
  menu: DEFAULT_MENU,
  setSlot: () => {},
  setMenuName: () => {},
  loadPreset: () => {},
  clearMenu: () => {},
  mounted: false,
})

const STORAGE_KEY = 'cuisine-world-menu'

export function MenuProvider({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false)
  const [menu, setMenu] = useState<MenuState>(DEFAULT_MENU)

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) setMenu(JSON.parse(stored) as MenuState)
    } catch { /* ignore */ }
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!mounted) return
    localStorage.setItem(STORAGE_KEY, JSON.stringify(menu))
  }, [menu, mounted])

  function setSlot(course: CourseType, meal: MealSummary | null) {
    setMenu((prev) => ({ ...prev, [course]: meal }))
  }

  function setMenuName(name: string) {
    setMenu((prev) => ({ ...prev, name }))
  }

  function loadPreset(preset: MenuState) {
    setMenu(preset)
  }

  function clearMenu() {
    setMenu({ ...DEFAULT_MENU })
  }

  return (
    <MenuContext.Provider value={{ menu, setSlot, setMenuName, loadPreset, clearMenu, mounted }}>
      {children}
    </MenuContext.Provider>
  )
}

export function useMenu() {
  return useContext(MenuContext)
}
