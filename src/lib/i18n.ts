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
  'filter.empty':      { en: 'No recipes here yet — try another section.', zh: '這裡暫時未有食譜，試下其他分類。' },
  'filter.showing':    { en: 'Showing',    zh: '顯示' },
  'filter.of':         { en: 'of',         zh: '/' },
  'filter.recipes':    { en: 'recipes',    zh: '道食譜' },
  'filter.loadMore':   { en: 'Load more',  zh: '載入更多' },
  'filter.loading':    { en: 'Loading…',   zh: '載入中…' },
  'filter.shuffle':    { en: 'Shuffle',     zh: '隨機排列' },
  'filter.surprise':   { en: 'Surprise Me', zh: '今日試下呢個？' },

  // Nutrition
  'nutrition.title':   { en: 'Nutrition (per serving)', zh: '營養資訊（每份）' },
  'nutrition.cal':     { en: 'Calories', zh: '卡路里' },
  'nutrition.protein': { en: 'Protein',  zh: '蛋白質' },
  'nutrition.fat':     { en: 'Fat',      zh: '脂肪' },
  'nutrition.carbs':   { en: 'Carbs',    zh: '碳水化合物' },
  'nutrition.est':     { en: 'estimated', zh: '估算' },
  'nutrition.g':       { en: 'g',        zh: '克' },
  'nutrition.kcal':    { en: 'kcal',     zh: '千卡' },
  'nutrition.source':  { en: 'Source: Open Food Facts', zh: '資料來源：Open Food Facts' },

  'sort.name':     { en: 'Name A–Z',      zh: '名稱 A–Z' },
  'sort.diffAsc':  { en: 'Easiest first', zh: '由易到難' },
  'sort.diffDesc': { en: 'Hardest first', zh: '由難到易' },

  // Everyday / Home cooking
  'nav.everyday':        { en: 'Home Cooking',  zh: '家常菜' },
  'everyday.title':      { en: 'Everyday Cooking', zh: '家常煮意' },
  'everyday.subtitle':   { en: 'Simple, approachable dishes for every day', zh: '簡單易做，天天都好味' },
  'everyday.quick':      { en: 'Quick Meals',   zh: '快手菜' },
  'everyday.quickDesc':  { en: 'Ready in 30 minutes or less', zh: '30分鐘內上桌' },
  'everyday.asian':      { en: 'Asian Home',    zh: '亞洲家常' },
  'everyday.asianDesc':  { en: 'HK, Japanese, Korean, Thai & more', zh: '港、日、韓、泰等亞洲家常' },
  'everyday.world':      { en: 'World Kitchen', zh: '世界家常' },
  'everyday.worldDesc':  { en: 'Western & Mediterranean everyday dishes', zh: '西式及地中海家常菜' },
  'everyday.browse':     { en: 'Browse all →',  zh: '瀏覽全部 →' },

  // Favorites
  'fav.title':      { en: 'My Favorites',     zh: '我的收藏' },
  'fav.saved':      { en: 'saved recipes',    zh: '個已收藏食譜' },
  'fav.emptyTitle': { en: 'No favorites yet', zh: '仲未有收藏' },
  'fav.emptyDesc':  { en: 'Tap the heart on any recipe to save it here.', zh: '㩒任何食譜上嘅心心，就會收藏喺呢度。' },
  'fav.explore':    { en: 'Start Exploring',  zh: '開始探索' },
  'fav.share':       { en: 'Share favorites', zh: '分享收藏' },
  'fav.linkCopied':  { en: 'Link copied!',    zh: '連結已複製！' },

  // Menu builder
  'menu.buildTitle':     { en: 'Build Your Perfect Meal', zh: '砌出你嘅完美一餐' },
  'menu.buildSubtitle':  { en: 'Curate your ideal dining experience — one course at a time', zh: '逐道菜，砌出你理想嘅一餐' },
  'menu.label':          { en: 'Menu:',   zh: '菜單：' },
  'menu.clear':          { en: 'Clear',   zh: '清除' },
  'menu.coursesPart':    { en: 'of 4 courses selected', zh: '/ 4 道菜已選' },
  'menu.complete':       { en: ' — Your menu is complete! 🎉', zh: ' — 你嘅菜單完成喇！🎉' },
  'menu.inspireTitle':   { en: 'Need Inspiration?', zh: '需要靈感？' },
  'menu.inspireSubtitle':{ en: 'Start with one of our curated menus and make it yours', zh: '由我哋精選嘅菜單開始，再改成你嘅版本' },

  // Explore
  'nav.explore':       { en: 'Explore',            zh: '探索' },
  'explore.title':     { en: 'Find Your Recipe',   zh: '搵到你嘅食譜' },
  'explore.subtitle':  { en: "Tell us what you're in the mood for — pick as many or as few as you like.", zh: '話俾我哋知你想食咩 — 揀幾多個都得。' },
  'explore.dietary':   { en: 'Dietary Preference', zh: '飲食偏好' },
  'explore.health':    { en: 'Health Goal',        zh: '健康目標' },
  'explore.style':     { en: 'Cooking Style',      zh: '烹飪風格' },
  'explore.find':      { en: 'Find Recipes',       zh: '搵食譜' },
  'explore.finding':   { en: 'Finding…',           zh: '搵緊…' },
  'explore.reset':     { en: 'Reset',              zh: '重設' },
  'explore.surprise':  { en: 'Surprise Me',        zh: '今日試下呢個？' },
  'explore.results':   { en: 'Matching recipes',   zh: '符合嘅食譜' },
  'explore.noResults': { en: 'No matches — try fewer or different filters.', zh: '冇符合嘅食譜 — 試下少啲或者唔同嘅選項。' },
  'explore.startHint': { en: 'Pick a few options above, then hit Find Recipes.', zh: '喺上面揀幾個選項，再撳「搵食譜」。' },

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
