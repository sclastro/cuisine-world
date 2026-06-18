'use client'

import { useEffect, useState } from 'react'
import { useLanguage } from '@/context/LanguageContext'

// In-memory cache (fast path) backed by localStorage (survives reloads, so
// revisiting translated content is instant with no flicker or re-fetch).
const cache = new Map<string, string>()
const STORAGE_KEY = 'cuisine-world-tr-cache'
let hydrated = false

function hydrateCache() {
  if (hydrated || typeof window === 'undefined') return
  hydrated = true
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (raw) {
      for (const [k, v] of Object.entries(JSON.parse(raw) as Record<string, string>)) {
        cache.set(k, v)
      }
    }
  } catch {
    // ignore corrupt cache
  }
}

function persistCache() {
  if (typeof window === 'undefined') return
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(Object.fromEntries(cache)))
  } catch {
    // ignore quota / serialization errors
  }
}

async function translateText(text: string): Promise<string> {
  const res = await fetch(
    `https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=zh-TW&dt=t&q=${encodeURIComponent(text)}`
  )
  const json = await res.json()
  return (json[0] as [string, ...unknown[]][]).map((seg) => seg[0]).join('')
}

export function useTranslation(text: string): string {
  const { lang } = useLanguage()
  // Initialize from cache so a known translation renders immediately (no flicker).
  const [translated, setTranslated] = useState(text)

  useEffect(() => {
    if (lang === 'en' || !text) {
      setTranslated(text)
      return
    }
    hydrateCache()
    const cacheKey = `zh:${text}`
    if (cache.has(cacheKey)) {
      setTranslated(cache.get(cacheKey)!)
      return
    }
    let cancelled = false
    translateText(text)
      .then((result) => {
        cache.set(cacheKey, result)
        persistCache()
        if (!cancelled) setTranslated(result)
      })
      .catch(() => {
        // fall back to original text on error
      })
    return () => { cancelled = true }
  }, [text, lang])

  return lang === 'en' ? text : translated
}

// Translate multiple strings at once (batched).
export function useTranslations(texts: string[]): string[] {
  const { lang } = useLanguage()
  const [results, setResults] = useState<string[]>(texts)

  useEffect(() => {
    if (lang === 'en') {
      setResults(texts)
      return
    }
    hydrateCache()
    let cancelled = false
    async function translateAll() {
      let touched = false
      const translated = await Promise.all(
        texts.map(async (text) => {
          if (!text) return text
          const cacheKey = `zh:${text}`
          if (cache.has(cacheKey)) return cache.get(cacheKey)!
          try {
            const result = await translateText(text)
            cache.set(cacheKey, result)
            touched = true
            return result
          } catch {
            return text
          }
        })
      )
      if (touched) persistCache()
      if (!cancelled) setResults(translated)
    }
    translateAll()
    return () => { cancelled = true }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lang, texts.join('||')])

  return lang === 'en' ? texts : results
}
