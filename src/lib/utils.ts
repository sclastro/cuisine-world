import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'
import type { RawMeal, Ingredient, DifficultyScore, Meal } from './types'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function extractIngredients(meal: RawMeal): Ingredient[] {
  const ingredients: Ingredient[] = []
  for (let i = 1; i <= 20; i++) {
    const name = meal[`strIngredient${i}` as keyof RawMeal] as string | null
    const measure = meal[`strMeasure${i}` as keyof RawMeal] as string | null
    if (name && name.trim()) {
      ingredients.push({
        name: name.trim(),
        measure: measure?.trim() || '',
        imageUrl: `https://www.themealdb.com/images/ingredients/${encodeURIComponent(name.trim())}-Small.png`,
      })
    }
  }
  return ingredients
}

// TheMealDB instruction text is inconsistent: some entries are a single
// unbroken blob, others use newlines but pack three or four distinct actions
// into one paragraph, and a few number their own steps ("2. Brown the meat").
// Rendering those verbatim gives cooks steps they can't follow at the stove.
//
// parseInstructions normalises all of that into one action per step: it splits
// on newlines first, then on sentence boundaries within each paragraph, and
// finally stitches back fragments too small to stand alone.

// A line that is nothing but a step header — we number steps ourselves.
const STEP_HEADER_RE = /^step\s*\d+\s*[:.]?$/i

// Leading enumeration the source added itself ("2.", "3)", "Step 4:").
// The separator may be missing after the dot ("1.Boil the eggs"), so a letter
// is accepted in place of the space — but a digit is not, or the quantity in
// "1.5 litres of water" would lose its leading number.
const LEADING_NUM_RE = /^\s*(?:step\s*)?\d+\s*[.):](?:\s+|(?=[A-Za-z]))/i

// Words whose trailing dot is an abbreviation, not the end of a sentence.
// Without this, "add 2 tbsp. Olive oil" would split mid-instruction.
//
// Time units (min/hr/sec) are deliberately absent: in this corpus they almost
// always close a sentence ("bake for 10 mins. Remove from the oven"), so
// treating them as abbreviations would keep those instructions fused instead.
const ABBREVIATIONS = new Set([
  'approx', 'approximately', 'tbsp', 'tbs', 'tsp', 'oz', 'lb', 'lbs', 'pt',
  'qt', 'gal', 'ml', 'cl', 'dl', 'cm', 'mm', 'kg', 'gr', 'gm', 'temp', 'deg',
  'pkg', 'pkt', 'no', 'vs', 'etc', 'ie', 'eg', 'mr', 'mrs', 'ms', 'dr', 'ca',
])

// Below this, a fragment is treated as a tail of the previous step rather than
// an instruction in its own right. Deliberately low: it should catch a bare
// sign-off ("Serve.", "Enjoy!") without swallowing genuinely short but real
// instructions like "Heat the oil." or "Drain the pasta."
const MIN_STEP_CHARS = 10

// Some entries are hard-wrapped at a fixed column, so a newline can land in the
// middle of a sentence ("...spread the oil all over and\nkeep it for roasting").
// A break is treated as wrapping — not a new step — only when the previous line
// looks like it ran into a margin: no terminating punctuation, already long, and
// the next line continues in lower case. Entries whose steps merely start in
// lower case (each one short and self-contained) are left alone.
const WRAP_MIN_CHARS = 60

function unwrapHardBreaks(lines: string[]): string[] {
  const out: string[] = []
  for (const line of lines) {
    const prev = out[out.length - 1]
    const isContinuation =
      prev !== undefined &&
      prev.length >= WRAP_MIN_CHARS &&
      !/[.!?:;]$/.test(prev) &&
      /^[a-z]/.test(line)
    if (isContinuation) {
      out[out.length - 1] = `${prev} ${line}`
    } else {
      out.push(line)
    }
  }
  return out
}

function splitIntoSentences(text: string): string[] {
  const out: string[] = []
  let start = 0
  // Candidate boundary: terminator, optional closing quote/bracket, whitespace.
  const boundary = /([.!?]+)(["')\]]?)\s+/g
  let m: RegExpExecArray | null
  while ((m = boundary.exec(text)) !== null) {
    const before = text.slice(start, m.index)
    const after = text.slice(boundary.lastIndex)
    if (!after) break

    // Only a single dot can be an abbreviation ("etc." but not "wait...").
    if (m[1] === '.') {
      const lastWord = before.match(/([A-Za-z]+)$/)?.[1]?.toLowerCase()
      if (lastWord && ABBREVIATIONS.has(lastWord)) continue
      // A single capital letter before the dot is an initial or a unit
      // ("180 C. " / "gas mark F. ") — keep it attached.
      if (/(?:^|\s)[A-Za-z]$/.test(before)) continue
    }

    // A new sentence starts with a capital, or with its own step number.
    const startsNew = /^[A-Z]/.test(after) || /^\d+\s*[.)]\s/.test(after)
    if (!startsNew) continue

    out.push(text.slice(start, boundary.lastIndex).trim())
    start = boundary.lastIndex
  }
  const tail = text.slice(start).trim()
  if (tail) out.push(tail)
  return out
}

export function parseInstructions(raw: string | null): string[] {
  if (!raw) return []

  const paragraphs = unwrapHardBreaks(
    raw
      .split(/\r\n|\n/)
      .map((line) => line.trim())
      .filter((line) => line.length > 0 && !STEP_HEADER_RE.test(line))
  )

  const steps: string[] = []
  for (const paragraph of paragraphs) {
    // Strip the source's own numbering before splitting, or the bare "2."
    // separates into a fragment of its own.
    const body = paragraph.replace(LEADING_NUM_RE, '')
    for (const sentence of splitIntoSentences(body)) {
      const step = sentence
        .replace(LEADING_NUM_RE, '')
        // A leading "*" marks an aside ("*Meanwhile, steam the vegetables");
        // the marker means nothing once each action is its own step.
        .replace(/^\*+\s*/, '')
        .trim()
      // Dropped entirely: leftover enumeration ("4.") carries no instruction,
      // so it must not be glued onto the end of the previous step either.
      if (!step || /^\d+\s*[.)]?$/.test(step)) continue

      // Too short to be an instruction on its own — append to the previous
      // step rather than leaving a stray "Serve." sitting on its own line.
      if (steps.length > 0 && step.length < MIN_STEP_CHARS) {
        steps[steps.length - 1] = `${steps[steps.length - 1]} ${step}`
        continue
      }
      steps.push(step)
    }
  }
  return steps
}

const COMPLEX_TECHNIQUES = [
  'deep fry', 'deep-fry', 'frying', 'flambe', 'flambé', 'braise',
  'smoke', 'smoking', 'cure', 'curing', 'ferment', 'marinate',
  'julienne', 'deglaze', 'caramelize', 'tempering', 'souffle',
]

export function calculateDifficulty(
  ingredients: Ingredient[],
  instructions: string[],
  rawInstructions: string | null
): DifficultyScore {
  let score = 0

  // ingredient count (0–2 pts)
  const count = ingredients.length
  if (count >= 15) score += 2
  else if (count >= 8) score += 1

  // instruction length proxy for time (0–2 pts)
  const totalChars = rawInstructions?.length ?? 0
  if (totalChars >= 1500) score += 2
  else if (totalChars >= 700) score += 1

  // complex technique detection (0–1 pt)
  const lowerInstructions = rawInstructions?.toLowerCase() ?? ''
  const hasComplex = COMPLEX_TECHNIQUES.some((t) => lowerInstructions.includes(t))
  if (hasComplex) score += 1

  // map 0–5 → 1–5 stars
  const stars = Math.min(5, Math.max(1, score + 1)) as 1 | 2 | 3 | 4 | 5
  const labels: Record<number, DifficultyScore['label']> = {
    1: 'Easy',
    2: 'Medium-Easy',
    3: 'Medium',
    4: 'Medium-Hard',
    5: 'Hard',
  }

  return { stars, label: labels[stars] }
}

export function extractSnippet(instructions: string[], maxLength = 110): string {
  const first = instructions.find((line) => line.length > 20) ?? ''
  if (!first) return ''
  return first.length <= maxLength ? first : first.slice(0, maxLength).trimEnd() + '…'
}

// Techniques that imply a long, mostly-passive cooking time.
const LONG_COOK_TECHNIQUES = [
  'braise', 'marinate', 'marinade', 'ferment', 'smoke', 'smoking', 'cure', 'curing',
  'slow cook', 'slow-cook', 'roast', 'simmer', 'stew', 'overnight', 'proof', 'rise', 'rest',
]

// Derives a *deterministic* estimated cook time (minutes) and servings from a
// recipe's data. TheMealDB provides neither, so these are honest estimates —
// always computed the same way for the same input (SSR === client).
export function estimateMealMeta(
  ingredients: Ingredient[],
  instructions: string[],
  rawInstructions: string | null
): { minutes: number; servings: number } {
  const totalChars = rawInstructions?.length ?? 0

  // Base time scales with how much instruction text there is.
  let minutes = 15 + Math.round(totalChars / 40)
  // More ingredients → more prep.
  minutes += Math.min(ingredients.length, 20)
  // Long, passive techniques add a chunk of time.
  const lower = rawInstructions?.toLowerCase() ?? ''
  if (LONG_COOK_TECHNIQUES.some((tch) => lower.includes(tch))) minutes += 40
  // Clamp and round to the nearest 5 for an honest "~" feel.
  minutes = Math.min(180, Math.max(10, minutes))
  minutes = Math.round(minutes / 5) * 5

  // Servings: deterministic from ingredient count.
  const n = ingredients.length
  const servings = n <= 5 ? 2 : n <= 10 ? 4 : 6

  return { minutes, servings }
}

export type SortKey = 'name-asc' | 'diff-asc' | 'diff-desc' | 'shuffle'

// Client-side filter + sort over already-fetched full meals.
// `difficulties` is a set of star tiers (1–5); empty means "all".
export function applyFilterSort(
  meals: Meal[],
  difficulties: number[],
  sort: SortKey
): Meal[] {
  let list = meals
  if (difficulties.length > 0) {
    list = list.filter((m) => difficulties.includes(m.difficulty.stars))
  }
  const sorted = [...list]
  switch (sort) {
    case 'name-asc':
      sorted.sort((a, b) => a.name.localeCompare(b.name))
      break
    case 'diff-asc':
      sorted.sort((a, b) => a.difficulty.stars - b.difficulty.stars || a.name.localeCompare(b.name))
      break
    case 'diff-desc':
      sorted.sort((a, b) => b.difficulty.stars - a.difficulty.stars || a.name.localeCompare(b.name))
      break
    case 'shuffle':
      // Passthrough: preserve the caller's current order. The random reshuffle
      // is applied to the source array itself (see BrowseResults.shuffle), so
      // "load more" appends without disturbing the already-shuffled order.
      break
  }
  return sorted
}

// Returns a new Fisher-Yates–shuffled copy. Client-only (uses Math.random),
// so callers must invoke it on user action / in an effect — never during SSR.
export function shuffleArray<T>(arr: T[]): T[] {
  const out = [...arr]
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[out[i], out[j]] = [out[j], out[i]]
  }
  return out
}

// Pulls the 11-char video id out of any common YouTube URL shape
// (watch?v=, youtu.be/, /embed/). Returns null if none found.
export function getYoutubeId(url: string | null): string | null {
  if (!url) return null
  const patterns = [
    /[?&]v=([A-Za-z0-9_-]{11})/,      // watch?v=ID
    /youtu\.be\/([A-Za-z0-9_-]{11})/, // youtu.be/ID
    /\/embed\/([A-Za-z0-9_-]{11})/,   // /embed/ID
  ]
  for (const p of patterns) {
    const m = url.match(p)
    if (m) return m[1]
  }
  return null
}

export function getYoutubeWatchUrl(url: string | null): string | null {
  const id = getYoutubeId(url)
  return id ? `https://www.youtube.com/watch?v=${id}` : null
}

export function getYoutubeEmbedUrl(url: string | null): string | null {
  const id = getYoutubeId(url)
  return id ? `https://www.youtube.com/embed/${id}` : null
}

export function menuToShareUrl(menuId: string, baseUrl: string): string {
  return `${baseUrl}/menu/shared?id=${menuId}`
}

// Encodes a favorites list as a shareable URL. Ids are already alphanumeric
// (TheMealDB numeric ids or `sp_12345`), so a plain comma-join is URL-safe.
export function favoritesToShareUrl(ids: string[], baseUrl: string): string {
  return `${baseUrl}/favorites?ids=${ids.join(',')}`
}
