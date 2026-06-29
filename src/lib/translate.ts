import { unstable_cache } from 'next/cache'

// Server-side EN→ZH translation with a durable cache.
//
// Why server-side: the previous client-side approach hit Google's unofficial
// endpoint straight from the browser, where it gets CORS-blocked / rate-limited
// and so basically never ran. Doing it on the server avoids CORS, lets us cache
// each result in Next's data cache (shared across requests *and* deployments),
// and means the page ships with the Chinese text already attached — instant,
// complete, no client flicker.
//
// Translations are stable, so we cache indefinitely (revalidate: false).

const ENDPOINT = 'https://translate.googleapis.com/translate_a/single'

// Throws on any failure. This is deliberate: it's wrapped in unstable_cache,
// and a thrown error is NOT cached — so a transient rate-limit (429) or timeout
// won't poison the cache with an English fallback forever. The caller catches
// and falls back to English for that one render; the next view retries.
async function fetchTranslationOrThrow(text: string): Promise<string> {
  const url =
    `${ENDPOINT}?client=gtx&sl=en&tl=zh-TW&dt=t&q=${encodeURIComponent(text)}`
  const res = await fetch(url, { signal: AbortSignal.timeout(6000) })
  if (!res.ok) throw new Error(`translate HTTP ${res.status}`)
  const json = (await res.json()) as [[[string, ...unknown[]]], ...unknown[]]
  const segments = json[0]
  if (!Array.isArray(segments)) throw new Error('translate: unexpected shape')
  const out = segments.map((seg) => seg[0]).join('')
  if (!out) throw new Error('translate: empty result')
  return out
}

// Cached single-string translator. unstable_cache keys on the argument, so each
// distinct phrase is translated once on success and reused indefinitely.
const cachedTranslate = unstable_cache(
  fetchTranslationOrThrow,
  ['en-zh-translate-v1'],
  { revalidate: false }
)

export async function translateToZh(text: string): Promise<string> {
  const trimmed = text?.trim()
  if (!trimmed) return text
  try {
    return await cachedTranslate(trimmed)
  } catch {
    // Network error / timeout / blocked → fall back to English for now.
    return text
  }
}

// Translate many strings at once (each individually cached). Order is preserved.
export async function translateManyToZh(texts: string[]): Promise<string[]> {
  return Promise.all(texts.map((t) => translateToZh(t)))
}
