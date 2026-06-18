export interface RawMeal {
  idMeal: string
  strMeal: string
  strMealThumb: string
  strCategory: string | null
  strArea: string | null
  strInstructions: string | null
  strYoutube: string | null
  strTags: string | null
  strSource: string | null
  strIngredient1: string | null
  strIngredient2: string | null
  strIngredient3: string | null
  strIngredient4: string | null
  strIngredient5: string | null
  strIngredient6: string | null
  strIngredient7: string | null
  strIngredient8: string | null
  strIngredient9: string | null
  strIngredient10: string | null
  strIngredient11: string | null
  strIngredient12: string | null
  strIngredient13: string | null
  strIngredient14: string | null
  strIngredient15: string | null
  strIngredient16: string | null
  strIngredient17: string | null
  strIngredient18: string | null
  strIngredient19: string | null
  strIngredient20: string | null
  strMeasure1: string | null
  strMeasure2: string | null
  strMeasure3: string | null
  strMeasure4: string | null
  strMeasure5: string | null
  strMeasure6: string | null
  strMeasure7: string | null
  strMeasure8: string | null
  strMeasure9: string | null
  strMeasure10: string | null
  strMeasure11: string | null
  strMeasure12: string | null
  strMeasure13: string | null
  strMeasure14: string | null
  strMeasure15: string | null
  strMeasure16: string | null
  strMeasure17: string | null
  strMeasure18: string | null
  strMeasure19: string | null
  strMeasure20: string | null
}

export interface Ingredient {
  name: string
  measure: string
  imageUrl: string
}

export interface Meal {
  id: string
  name: string
  thumbnail: string
  category: string
  area: string
  instructions: string[]
  snippet: string
  youtubeUrl: string | null
  tags: string[]
  sourceUrl: string | null
  ingredients: Ingredient[]
  difficulty: DifficultyScore
  estTimeMinutes: number
  estServings: number
}

export interface MealSummary {
  id: string
  name: string
  thumbnail: string
  category?: string
  area?: string
}

export interface Category {
  id: string
  name: string
  thumbnail: string
  description: string
}

export interface Area {
  name: string
}

export interface DifficultyScore {
  stars: number       // 1–5
  label: 'Easy' | 'Medium-Easy' | 'Medium' | 'Medium-Hard' | 'Hard'
}

export type CourseType = 'starter' | 'soup' | 'main' | 'dessert'

export interface MenuItem {
  course: CourseType
  meal: MealSummary | null
}

export interface Menu {
  id: string
  name: string
  items: MenuItem[]
  createdAt: number
}
