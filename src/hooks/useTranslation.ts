'use client'

import { useEffect, useState } from 'react'
import { useLanguage } from '@/context/LanguageContext'

// Simple in-memory cache to avoid re-translating the same text
const cache = new Map<string, string>()

export function useTranslation(text: string): string {
  const { lang } = useLanguage()
  const [translated, setTranslated] = useState(text)

  useEffect(() => {
    if (lang === 'en' || !text) {
      setTranslated(text)
      return
    }
    const cacheKey = `zh:${text}`
    if (cache.has(cacheKey)) {
      setTranslated(cache.get(cacheKey)!)
      return
    }
    let cancelled = false
    async function translate() {
      try {
        const res = await fetch(
          `https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=zh-TW&dt=t&q=${encodeURIComponent(text)}`
        )
        const json = await res.json()
        const result = (json[0] as [string, ...unknown[]][]).map((seg) => seg[0]).join('')
        if (!cancelled) {
          cache.set(cacheKey, result)
          setTranslated(result)
        }
      } catch {
        // fall back to original text on error
      }
    }
    translate()
    return () => { cancelled = true }
  }, [text, lang])

  return lang === 'en' ? text : translated
}

// Translate multiple strings at once
export function useTranslations(texts: string[]): string[] {
  const { lang } = useLanguage()
  const [results, setResults] = useState<string[]>(texts)

  useEffect(() => {
    if (lang === 'en') {
      setResults(texts)
      return
    }
    let cancelled = false
    async function translateAll() {
      const translated = await Promise.all(
        texts.map(async (text) => {
          if (!text) return text
          const cacheKey = `zh:${text}`
          if (cache.has(cacheKey)) return cache.get(cacheKey)!
          try {
            const res = await fetch(
              `https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=zh-TW&dt=t&q=${encodeURIComponent(text)}`
            )
            const json = await res.json()
            const result = (json[0] as [string, ...unknown[]][]).map((seg) => seg[0]).join('')
            cache.set(cacheKey, result)
            return result
          } catch {
            return text
          }
        })
      )
      if (!cancelled) setResults(translated)
    }
    translateAll()
    return () => { cancelled = true }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lang, texts.join('||')])

  return lang === 'en' ? texts : results
}
