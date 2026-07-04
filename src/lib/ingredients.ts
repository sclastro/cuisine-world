// Curated bilingual ingredient catalog for the "Cook From Your Fridge" page.
// Mirrors the areas.ts curation pattern: pure data, hand-written ZH names.
//
// `id` is the TheMealDB filter.php?i= parameter (spaces are converted to
// underscores by getMealsByIngredient). The endpoint tolerates unknown values
// (returns empty), and the fridge search ranks across the ingredients the user
// picked, so a rare miss just contributes nothing.

export interface IngredientDef {
  id: string
  en: string
  zh: string
  emoji: string
}

export interface IngredientGroup {
  id: string
  titleEn: string
  titleZh: string
  emoji: string
  items: IngredientDef[]
}

export const INGREDIENT_GROUPS: IngredientGroup[] = [
  {
    id: 'meat',
    titleEn: 'Meat',
    titleZh: '肉類',
    emoji: '🍖',
    items: [
      { id: 'chicken',        en: 'Chicken',        zh: '雞肉',   emoji: '🍗' },
      { id: 'chicken breast', en: 'Chicken Breast', zh: '雞胸肉', emoji: '🍗' },
      { id: 'beef',           en: 'Beef',           zh: '牛肉',   emoji: '🥩' },
      { id: 'minced beef',    en: 'Minced Beef',    zh: '免治牛肉', emoji: '🥩' },
      { id: 'pork',           en: 'Pork',           zh: '豬肉',   emoji: '🥓' },
      { id: 'lamb',           en: 'Lamb',           zh: '羊肉',   emoji: '🍖' },
      { id: 'bacon',          en: 'Bacon',          zh: '煙肉',   emoji: '🥓' },
      { id: 'sausages',       en: 'Sausages',       zh: '香腸',   emoji: '🌭' },
      { id: 'duck',           en: 'Duck',           zh: '鴨肉',   emoji: '🦆' },
      { id: 'turkey',         en: 'Turkey',         zh: '火雞',   emoji: '🦃' },
      { id: 'chicken thighs', en: 'Chicken Thighs', zh: '雞髀',   emoji: '🍗' },
    ],
  },
  {
    id: 'seafood',
    titleEn: 'Seafood',
    titleZh: '海鮮',
    emoji: '🦐',
    items: [
      { id: 'salmon',   en: 'Salmon',   zh: '三文魚', emoji: '🐟' },
      { id: 'prawns',   en: 'Prawns',   zh: '蝦',     emoji: '🦐' },
      { id: 'tuna',     en: 'Tuna',     zh: '吞拿魚', emoji: '🐟' },
      { id: 'cod',      en: 'Cod',      zh: '鱈魚',   emoji: '🐟' },
      { id: 'haddock',  en: 'Haddock',  zh: '黑線鱈', emoji: '🐟' },
      { id: 'mackerel', en: 'Mackerel', zh: '鯖魚',   emoji: '🐟' },
      { id: 'squid',    en: 'Squid',    zh: '魷魚',   emoji: '🦑' },
      { id: 'crab',     en: 'Crab',     zh: '蟹',     emoji: '🦀' },
      { id: 'clams',    en: 'Clams',    zh: '蜆',     emoji: '🐚' },
      { id: 'sardines', en: 'Sardines', zh: '沙甸魚', emoji: '🐟' },
      { id: 'mussels',  en: 'Mussels',  zh: '青口',   emoji: '🦪' },
    ],
  },
  {
    id: 'vegetables',
    titleEn: 'Vegetables',
    titleZh: '蔬菜',
    emoji: '🥬',
    items: [
      { id: 'tomato',      en: 'Tomato',      zh: '番茄',   emoji: '🍅' },
      { id: 'onion',       en: 'Onion',       zh: '洋蔥',   emoji: '🧅' },
      { id: 'garlic',      en: 'Garlic',      zh: '蒜頭',   emoji: '🧄' },
      { id: 'potatoes',    en: 'Potato',      zh: '薯仔',   emoji: '🥔' },
      { id: 'carrots',     en: 'Carrot',      zh: '紅蘿蔔', emoji: '🥕' },
      { id: 'broccoli',    en: 'Broccoli',    zh: '西蘭花', emoji: '🥦' },
      { id: 'spinach',     en: 'Spinach',     zh: '菠菜',   emoji: '🥬' },
      { id: 'mushrooms',   en: 'Mushrooms',   zh: '蘑菇',   emoji: '🍄' },
      { id: 'red pepper',  en: 'Bell Pepper', zh: '燈籠椒', emoji: '🫑' },
      { id: 'cabbage',     en: 'Cabbage',     zh: '椰菜',   emoji: '🥬' },
      { id: 'aubergine',   en: 'Aubergine',   zh: '茄子',   emoji: '🍆' },
      { id: 'courgettes',  en: 'Courgette',   zh: '翠玉瓜', emoji: '🥒' },
      { id: 'cauliflower', en: 'Cauliflower', zh: '椰菜花', emoji: '🥦' },
      { id: 'peas',        en: 'Peas',        zh: '青豆',   emoji: '🫛' },
      { id: 'sweetcorn',   en: 'Sweetcorn',   zh: '粟米',   emoji: '🌽' },
      { id: 'avocado',     en: 'Avocado',     zh: '牛油果', emoji: '🥑' },
      { id: 'cucumber',    en: 'Cucumber',    zh: '青瓜',   emoji: '🥒' },
      { id: 'leek',        en: 'Leek',        zh: '大蔥',   emoji: '🥬' },
      { id: 'celery',      en: 'Celery',      zh: '西芹',   emoji: '🥬' },
      { id: 'pumpkin',     en: 'Pumpkin',     zh: '南瓜',   emoji: '🎃' },
    ],
  },
  {
    id: 'staples',
    titleEn: 'Staples',
    titleZh: '主食',
    emoji: '🍚',
    items: [
      { id: 'rice',       en: 'Rice',       zh: '米飯',   emoji: '🍚' },
      { id: 'noodles',    en: 'Noodles',    zh: '麵條',   emoji: '🍜' },
      { id: 'spaghetti',  en: 'Spaghetti',  zh: '意大利粉', emoji: '🍝' },
      { id: 'penne',      en: 'Penne',      zh: '長通粉', emoji: '🍝' },
      { id: 'bread',      en: 'Bread',      zh: '麵包',   emoji: '🍞' },
      { id: 'flour',      en: 'Flour',      zh: '麵粉',   emoji: '🌾' },
      { id: 'oats',       en: 'Oats',       zh: '燕麥',   emoji: '🌾' },
      { id: 'couscous',   en: 'Couscous',   zh: '小米',   emoji: '🍚' },
      { id: 'tortilla',   en: 'Tortilla',   zh: '墨西哥餅', emoji: '🌮' },
      { id: 'lentils',    en: 'Lentils',    zh: '扁豆',   emoji: '🫘' },
      { id: 'chickpeas',  en: 'Chickpeas',  zh: '鷹嘴豆', emoji: '🫘' },
      { id: 'black beans', en: 'Black Beans', zh: '黑豆', emoji: '🫘' },
    ],
  },
  {
    id: 'dairy',
    titleEn: 'Eggs & Dairy',
    titleZh: '蛋奶豆品',
    emoji: '🥚',
    items: [
      { id: 'eggs',           en: 'Eggs',           zh: '雞蛋',   emoji: '🥚' },
      { id: 'milk',           en: 'Milk',           zh: '牛奶',   emoji: '🥛' },
      { id: 'butter',         en: 'Butter',         zh: '牛油',   emoji: '🧈' },
      { id: 'cheese',         en: 'Cheese',         zh: '芝士',   emoji: '🧀' },
      { id: 'cheddar cheese', en: 'Cheddar',        zh: '車打芝士', emoji: '🧀' },
      { id: 'parmesan',       en: 'Parmesan',       zh: '巴馬臣芝士', emoji: '🧀' },
      { id: 'mozzarella',     en: 'Mozzarella',     zh: '水牛芝士', emoji: '🧀' },
      { id: 'double cream',   en: 'Cream',          zh: '忌廉',   emoji: '🥛' },
      { id: 'greek yogurt',   en: 'Yogurt',         zh: '乳酪',   emoji: '🥛' },
      { id: 'tofu',           en: 'Tofu',           zh: '豆腐',   emoji: '🍲' },
    ],
  },
  {
    id: 'aromatics',
    titleEn: 'Aromatics & Sauces',
    titleZh: '香料醬汁',
    emoji: '🧄',
    items: [
      { id: 'ginger',       en: 'Ginger',       zh: '薑',     emoji: '🫚' },
      { id: 'red chilli',   en: 'Chilli',       zh: '辣椒',   emoji: '🌶️' },
      { id: 'lemon',        en: 'Lemon',        zh: '檸檬',   emoji: '🍋' },
      { id: 'lime',         en: 'Lime',         zh: '青檸',   emoji: '🍋' },
      { id: 'soy sauce',    en: 'Soy Sauce',    zh: '豉油',   emoji: '🍶' },
      { id: 'honey',        en: 'Honey',        zh: '蜜糖',   emoji: '🍯' },
      { id: 'coconut milk', en: 'Coconut Milk', zh: '椰奶',   emoji: '🥥' },
      { id: 'curry powder', en: 'Curry Powder', zh: '咖喱粉', emoji: '🍛' },
      { id: 'basil',        en: 'Basil',        zh: '羅勒',   emoji: '🌿' },
      { id: 'coriander',    en: 'Coriander',    zh: '芫荽',   emoji: '🌿' },
      { id: 'cumin',        en: 'Cumin',        zh: '孜然',   emoji: '🧂' },
      { id: 'paprika',      en: 'Paprika',      zh: '紅椒粉', emoji: '🧂' },
      { id: 'oyster sauce', en: 'Oyster Sauce', zh: '蠔油',   emoji: '🍶' },
      { id: 'sesame seed oil', en: 'Sesame Oil', zh: '麻油',  emoji: '🍶' },
      { id: 'peanut butter', en: 'Peanut Butter', zh: '花生醬', emoji: '🥜' },
    ],
  },
]
