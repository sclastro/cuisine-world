import type { Lang } from '@/context/LanguageContext'

// Lightweight static UI string table for client components.
// Dynamic recipe content (names, steps, ingredients) is handled separately
// by the useTranslation hook (Google Translate).
const STRINGS = {
  // Recipe metadata (estimates)
  'recipe.min':       { en: 'min',       zh: '分鐘' },
  'recipe.serves':    { en: 'Serves',    zh: '份量' },
  'recipe.estimated': { en: 'estimated', zh: '估算' },

  // Cooking mode
  'cook.start': { en: 'Cooking Mode', zh: '烹飪模式' },
  'cook.step':  { en: 'Step',         zh: '步驟' },
  'cook.of':    { en: 'of',           zh: '/' },
  'cook.next':  { en: 'Next',         zh: '下一步' },
  'cook.back':  { en: 'Back',         zh: '上一步' },
  'cook.exit':  { en: 'Exit',         zh: '離開' },
  'cook.done':  { en: 'All done!',    zh: '完成！' },

  // Filter & sort
  'filter.difficulty': { en: 'Difficulty', zh: '難度' },
  'filter.sortBy':     { en: 'Sort',       zh: '排序' },
  'filter.clear':      { en: 'Clear',      zh: '清除' },
  'filter.noneMatch':  { en: 'No recipes match these filters.', zh: '沒有符合篩選條件的食譜。' },
  'filter.showing':    { en: 'Showing',    zh: '顯示' },
  'filter.of':         { en: 'of',         zh: '/' },
  'filter.recipes':    { en: 'recipes',    zh: '道食譜' },

  'sort.name':     { en: 'Name A–Z',      zh: '名稱 A–Z' },
  'sort.diffAsc':  { en: 'Easiest first', zh: '由易到難' },
  'sort.diffDesc': { en: 'Hardest first', zh: '由難到易' },

  // Difficulty labels
  'diff.easy':    { en: 'Easy',        zh: '初級' },
  'diff.medEasy': { en: 'Medium-Easy', zh: '初中級' },
  'diff.medium':  { en: 'Medium',      zh: '中級' },
  'diff.medHard': { en: 'Medium-Hard', zh: '中高級' },
  'diff.hard':    { en: 'Hard',        zh: '高級' },
} as const

export type TranslationKey = keyof typeof STRINGS

export function t(key: TranslationKey, lang: Lang): string {
  return STRINGS[key][lang]
}

// Maps the difficulty score (1–5 stars) to its translation key.
export const DIFF_KEY: Record<number, TranslationKey> = {
  1: 'diff.easy',
  2: 'diff.medEasy',
  3: 'diff.medium',
  4: 'diff.medHard',
  5: 'diff.hard',
}
