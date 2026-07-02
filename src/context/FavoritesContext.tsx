'use client'

import { createContext, useContext, useEffect, useState } from 'react'

interface FavoritesContextValue {
  favorites: Set<string>
  isFavorite: (id: string) => boolean
  toggleFavorite: (id: string) => void
  importFavorites: (ids: string[]) => void
  mounted: boolean
}

const FavoritesContext = createContext<FavoritesContextValue>({
  favorites: new Set(),
  isFavorite: () => false,
  toggleFavorite: () => {},
  importFavorites: () => {},
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

  // Merges incoming ids into the existing set (used by shared favorites
  // links) — never wipes what the visitor already has saved.
  function importFavorites(ids: string[]) {
    if (ids.length === 0) return
    setFavorites((prev) => new Set([...prev, ...ids]))
  }

  return (
    <FavoritesContext.Provider value={{ favorites, isFavorite, toggleFavorite, importFavorites, mounted }}>
      {children}
    </FavoritesContext.Provider>
  )
}

export function useFavorites() {
  return useContext(FavoritesContext)
}
