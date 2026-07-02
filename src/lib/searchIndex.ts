import { unstable_cache } from 'next/cache'
import Fuse from 'fuse.js'

// A lightweight, cached index of every meal name (id + name only — no full
// recipe data) used for both live search suggestions and typo-tolerant
// fallback matching. One cheap call instead of per-keystroke round trips.

export interface IndexEntry {
  id: string
  name: string
  thumbnail: string
}

const BASE_URL = 'https://www.themealdb.com/api/json/v1/1'

interface RawIndexMeal {
  idMeal: string
  strMeal: string
  strMealThumb: string
}

async function fetchIndex(): Promise<IndexEntry[]> {
  // TheMealDB's list.php only supports listing by first letter, so we sweep
  // a-z. Still a handful of small requests, done once and cached for an hour.
  const letters = 'abcdefghijklmnopqrstuvwxyz'.split('')
  const results = await Promise.all(
    letters.map(async (letter) => {
      try {
        const res = await fetch(`${BASE_URL}/search.php?f=${letter}`, {
          next: { revalidate: 3600 },
          signal: AbortSignal.timeout(6000),
        })
        if (!res.ok) return []
        const data = (await res.json()) as { meals: RawIndexMeal[] | null }
        return data.meals ?? []
      } catch {
        return []
      }
    })
  )
  return results.flat().map((m) => ({
    id: m.idMeal,
    name: m.strMeal,
    thumbnail: m.strMealThumb,
  }))
}

const cachedIndex = unstable_cache(fetchIndex, ['themealdb-name-index-v1'], {
  revalidate: 3600,
})

export async function getSearchIndex(): Promise<IndexEntry[]> {
  try {
    return await cachedIndex()
  } catch {
    return []
  }
}

let fuseInstance: Fuse<IndexEntry> | null = null
let fuseIndexSize = 0

async function getFuse(): Promise<Fuse<IndexEntry>> {
  const index = await getSearchIndex()
  // Rebuild only if the underlying data actually changed size (cheap guard;
  // the index itself is cached upstream so this rarely re-fetches).
  if (!fuseInstance || fuseIndexSize !== index.length) {
    fuseInstance = new Fuse(index, { keys: ['name'], threshold: 0.35, ignoreLocation: true })
    fuseIndexSize = index.length
  }
  return fuseInstance
}

// Fuzzy-matches a query against the cached name index. Used both for the
// live-suggestion dropdown and as a fallback when TheMealDB's literal search
// returns nothing.
export async function fuzzySearchIndex(query: string, limit = 8): Promise<IndexEntry[]> {
  const trimmed = query.trim()
  if (!trimmed) return []
  const fuse = await getFuse()
  return fuse.search(trimmed, { limit }).map((r) => r.item)
}
