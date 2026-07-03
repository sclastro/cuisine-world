// Curated thematic collections — hand-authored entry points that group recipes
// by mood/occasion rather than raw taxonomy. Pure data (safe to import from
// client components for titles/nav); the actual meal fetching lives in
// api.ts::getCollectionMeals, which resolves these category/area specs.
//
// Every collection maps to REAL TheMealDB categories/areas so it always fills,
// with or without a Spoonacular key.

export type Accent = 'orange' | 'amber' | 'lime' | 'red' | 'blue' | 'green' | 'pink'

export interface CollectionDef {
  id: string
  emoji: string
  accent: Accent
  titleEn: string
  titleZh: string
  blurbEn: string
  blurbZh: string
  categories?: string[]
  areas?: string[]
  maxTime?: number
}

export const COLLECTIONS: CollectionDef[] = [
  {
    id: 'weeknight-30',
    emoji: '⚡',
    accent: 'orange',
    titleEn: '30-Minute Weeknights',
    titleZh: '快手晚餐',
    blurbEn: 'Fuss-free dinners on the table before you can say "what\'s for dinner?"',
    blurbZh: '免煩惱嘅平日晚餐，未問完「今晚食咩」就已經上枱。',
    categories: ['Breakfast', 'Side', 'Starter', 'Pasta', 'Miscellaneous'],
    maxTime: 45,
  },
  {
    id: 'comfort-classics',
    emoji: '🍲',
    accent: 'amber',
    titleEn: 'Comfort Classics',
    titleZh: '暖心經典',
    blurbEn: 'Rich, hearty dishes that taste like a warm hug on a cold day.',
    blurbZh: '濃郁飽足嘅菜式，凍天食落好似畀人攬實一樣暖。',
    categories: ['Beef', 'Pasta', 'Pork'],
  },
  {
    id: 'vegetarian',
    emoji: '🥗',
    accent: 'lime',
    titleEn: 'Vegetarian Favourites',
    titleZh: '素食精選',
    blurbEn: 'Bright, satisfying meat-free plates that never feel like a compromise.',
    blurbZh: '清新滿足嘅無肉料理，食落絕唔覺得將就。',
    categories: ['Vegetarian', 'Vegan'],
  },
  {
    id: 'spicy-bold',
    emoji: '🌶️',
    accent: 'red',
    titleEn: 'Spicy & Bold',
    titleZh: '惹味香辣',
    blurbEn: 'Turn up the heat with fragrant, fiery dishes from around the world.',
    blurbZh: '加大火力，環遊世界嘅香辣惹味菜式。',
    areas: ['Indian', 'Thai', 'Mexican'],
  },
  {
    id: 'seafood',
    emoji: '🦐',
    accent: 'blue',
    titleEn: 'From the Sea',
    titleZh: '海鮮盛宴',
    blurbEn: 'Fresh, light and elegant — the best of what the ocean has to offer.',
    blurbZh: '鮮味清爽又優雅，盡享大海嘅精華。',
    categories: ['Seafood'],
  },
  {
    id: 'asian-home',
    emoji: '🥢',
    accent: 'green',
    titleEn: 'Asian Home Cooking',
    titleZh: '亞洲家常',
    blurbEn: 'Everyday favourites from kitchens across East and Southeast Asia.',
    blurbZh: '嚟自東亞同東南亞廚房嘅日常好味。',
    areas: ['Chinese', 'Japanese', 'Thai', 'Vietnamese', 'Malaysian'],
  },
  {
    id: 'sweet-treats',
    emoji: '🍰',
    accent: 'pink',
    titleEn: 'Sweet Treats',
    titleZh: '甜品時光',
    blurbEn: 'Cakes, tarts and puddings for when only something sweet will do.',
    blurbZh: '蛋糕、撻同布甸，總有一款滿足你嘅甜蜜渴望。',
    categories: ['Dessert'],
  },
]

export function getCollection(id: string): CollectionDef | undefined {
  return COLLECTIONS.find((c) => c.id === id)
}

// Tailwind class fragments per accent — kept here so cards/headers stay
// consistent. Static strings (not interpolated) so Tailwind keeps them.
export const ACCENT_CLASSES: Record<Accent, { bg: string; border: string; badge: string; text: string }> = {
  orange: { bg: 'bg-orange-50', border: 'border-orange-200', badge: 'bg-orange-100 text-orange-700', text: 'text-orange-700' },
  amber:  { bg: 'bg-amber-50',  border: 'border-amber-200',  badge: 'bg-amber-100 text-amber-700',  text: 'text-amber-700' },
  lime:   { bg: 'bg-lime-50',   border: 'border-lime-200',   badge: 'bg-lime-100 text-lime-700',    text: 'text-lime-700' },
  red:    { bg: 'bg-red-50',    border: 'border-red-200',    badge: 'bg-red-100 text-red-700',      text: 'text-red-700' },
  blue:   { bg: 'bg-blue-50',   border: 'border-blue-200',   badge: 'bg-blue-100 text-blue-700',    text: 'text-blue-700' },
  green:  { bg: 'bg-green-50',  border: 'border-green-200',  badge: 'bg-green-100 text-green-700',   text: 'text-green-700' },
  pink:   { bg: 'bg-pink-50',   border: 'border-pink-200',   badge: 'bg-pink-100 text-pink-700',     text: 'text-pink-700' },
}
