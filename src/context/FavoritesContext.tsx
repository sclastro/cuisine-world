'use client'

import { createContext, useContext, useEffect, useState } from 'react'

interface FavoritesContextValue {
  favorites: Set<string>
  isFavorite: (id: string) => boolean
  toggleFavorite: (id: string) => void
  mounted: boolean
}

const FavoritesContext = createContext<FavoritesContextValue>({
  favorites: new Set(),
  isFavorite: () => false,
  toggleFavorite: () => {},
  mounted: false,
})

const STORAGE_KEY = 'cuisine-world-favorites'

export function FavoritesProvider({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false)
  const [favorites, setFavorites] = useState<Set<string>>(new Set())

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) setFavorites(new Set(JSON.parse(stored) as string[]))
    } catch {
      // ignore corrupt storage
    }
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!mounted) return
    localStorage.setItem(STORAGE_KEY, JSON.stringify([...favorites]))
  }, [favorites, mounted])

  function isFavorite(id: string) {
    return favorites.has(id)
  }

  function toggleFavorite(id: string) {
    setFavorites((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  return (
    <FavoritesContext.Provider value={{ favorites, isFavorite, toggleFavorite, mounted }}>
      {children}
    </FavoritesContext.Provider>
  )
}

export function useFavorites() {
  return useContext(FavoritesContext)
}
