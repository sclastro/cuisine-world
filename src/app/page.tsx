import Link from 'next/link'
import Image from 'next/image'
import { ChevronRight, Shuffle } from 'lucide-react'
import { getAllCategories, getRandomMeals, COURSE_CATEGORY_MAP } from '@/lib/api'
import { RecipeGrid } from '@/components/recipe/RecipeGrid'
import { SearchBar } from '@/components/search/SearchBar'

const COURSE_SECTIONS = [
  {
    key: 'starter',
    title: 'Starters',
    titleZh: '前菜',
    emoji: '🥗',
    description: 'Light bites to begin your meal',
    href: '/category/Starter',
    bgColor: 'bg-lime-50',
    borderColor: 'border-lime-200',
    badgeColor: 'bg-lime-100 text-lime-800',
  },
  {
    key: 'soup',
    title: 'Soups',
    titleZh: '湯品',
    emoji: '🍲',
    description: 'Warm and comforting soups',
    href: '/category/Soup',
    bgColor: 'bg-orange-50',
    borderColor: 'border-orange-200',
    badgeColor: 'bg-orange-100 text-orange-800',
  },
  {
    key: 'main',
    title: 'Mains',
    titleZh: '主菜',
    emoji: '🍽️',
    description: 'Hearty dishes from around the world',
    href: '/category/Beef',
    bgColor: 'bg-green-50',
    borderColor: 'border-green-200',
    badgeColor: 'bg-green-100 text-green-800',
  },
  {
    key: 'dessert',
    title: 'Desserts',
    titleZh: '甜品',
    emoji: '🍰',
    description: 'Sweet endings to every meal',
    href: '/category/Dessert',
    bgColor: 'bg-pink-50',
    borderColor: 'border-pink-200',
    badgeColor: 'bg-pink-100 text-pink-800',
  },
]

export default async function HomePage() {
  const [featuredMeals, categories] = await Promise.all([
    getRandomMeals(8),
    getAllCategories(),
  ])

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-14">

      {/* Hero */}
      <section className="text-center py-10 space-y-5">
        <h1 className="text-4xl sm:text-5xl font-bold text-green-900 leading-tight">
          Explore the World&apos;s<br />
          <span className="text-green-600">Cuisines</span>
        </h1>
        <p className="text-gray-500 text-lg max-w-xl mx-auto">
          Discover thousands of recipes from every corner of the globe.
        </p>
        <div className="max-w-md mx-auto">
          <SearchBar />
        </div>
      </section>

      {/* Course Sections */}
      <section>
        <h2 className="text-xl font-bold text-gray-800 mb-5">Browse by Course</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {COURSE_SECTIONS.map((section) => (
            <Link
              key={section.key}
              href={section.href}
              className={`flex flex-col items-center gap-3 p-5 rounded-2xl border ${section.bgColor} ${section.borderColor} hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 text-center`}
            >
              <span className="text-4xl">{section.emoji}</span>
              <div>
                <p className="font-semibold text-gray-800">{section.title}</p>
                <p className="text-xs text-gray-500 mt-0.5">{section.description}</p>
              </div>
              <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${section.badgeColor}`}>
                {section.titleZh}
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* Today's Pick */}
      <section>
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2">
            <Shuffle size={20} className="text-green-600" />
            <h2 className="text-xl font-bold text-gray-800">Today&apos;s Picks</h2>
          </div>
          <span className="text-sm text-gray-400">Refreshed daily</span>
        </div>
        <RecipeGrid meals={featuredMeals} showSnippet />
      </section>

      {/* Category chips */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-800">All Categories</h2>
          <Link href="/category/Beef" className="text-sm text-green-600 hover:underline flex items-center gap-1">
            View all <ChevronRight size={14} />
          </Link>
        </div>
        <div className="flex flex-wrap gap-2">
          {categories.map((cat) => (
            <Link
              key={cat.id}
              href={`/category/${encodeURIComponent(cat.name)}`}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white border border-green-100 hover:border-green-400 hover:bg-green-50 transition-colors text-sm text-gray-700"
            >
              <Image
                src={cat.thumbnail}
                alt={cat.name}
                width={20}
                height={20}
                className="rounded-full object-cover w-5 h-5"
              />
              {cat.name}
            </Link>
          ))}
        </div>
      </section>

    </div>
  )
}
