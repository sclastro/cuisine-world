'use client'

import { createContext, useContext, useCallback, useEffect, useState } from 'react'

interface RecentlyViewedContextValue {
  recent: string[] // meal ids, most-recent first
  recordView: (id: string) => void
  mounted: boolean
}

const RecentlyViewedContext = createContext<RecentlyViewedContextValue>({
  recent: [],
  recordView: () => {},
  mounted: false,
})

const STORAGE_KEY = 'cuisine-world-recent'
const MAX_RECENT = 20

export function RecentlyViewedProvider({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false)
  const [recent, setRecent] = useState<string[]>([])

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) setRecent(JSON.parse(stored) as string[])
    } catch {
      // ignore corrupt storage
    }
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!mounted) return
    localStorage.setItem(STORAGE_KEY, JSON.stringify(recent))
  }, [recent, mounted])

  // Move id to the front, de-duplicated, capped. Stable identity so effects
  // that call it once on mount don't re-fire.
  const recordView = useCallback((id: string) => {
    setRecent((prev) => [id, ...prev.filter((x) => x !== id)].slice(0, MAX_RECENT))
  }, [])

  return (
    <RecentlyViewedContext.Provider value={{ recent, recordView, mounted }}>
      {children}
    </RecentlyViewedContext.Provider>
  )
}

export function useRecentlyViewed() {
  return useContext(RecentlyViewedContext)
}
