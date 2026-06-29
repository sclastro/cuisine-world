// Static EN→ZH dictionary for TheMealDB categories. These are a small, fixed
// set, so a hand-checked map gives perfect translations with zero API calls.

export const CATEGORY_ZH: Record<string, string> = {
  Beef: '牛肉',
  Chicken: '雞肉',
  Dessert: '甜品',
  Lamb: '羊肉',
  Miscellaneous: '其他',
  Pasta: '意粉',
  Pork: '豬肉',
  Seafood: '海鮮',
  Side: '配菜',
  Starter: '前菜',
  Vegan: '純素',
  Vegetarian: '素食',
  Breakfast: '早餐',
  Goat: '羊肉',
  Soup: '湯品',
  // Common Spoonacular dish types that may surface as a category label
  'Main Course': '主菜',
  'Side Dish': '配菜',
  Appetizer: '前菜',
  Salad: '沙律',
  Bread: '麵包',
  Snack: '小食',
  Drink: '飲品',
  Beverage: '飲品',
  Sauce: '醬汁',
  Fingerfood: '小食',
}

export function categoryZh(name: string): string {
  return CATEGORY_ZH[name] ?? name
}
