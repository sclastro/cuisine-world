import Link from 'next/link'
import Image from 'next/image'
import { ChevronRight, Shuffle, Globe } from 'lucide-react'
import { getAllCategories, getRandomMeals } from '@/lib/api'
import { localizeMealsForList } from '@/lib/localize'
import { RecipeGrid } from '@/components/recipe/RecipeGrid'
import { SearchBar } from '@/components/search/SearchBar'
import { EverydayCookingSection } from '@/components/layout/EverydayCookingSection'

const COURSE_SECTIONS = [
  {
    key: 'starter',
    title: 'Starters',
    titleZh: '前菜',
    emoji: '🥗',
    description: 'Light bites to open your appetite',
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
    description: 'Warm, comforting bowls',
    href: '/search?q=soup',
    bgColor: 'bg-orange-50',
    borderColor: 'border-orange-200',
    badgeColor: 'bg-orange-100 text-orange-800',
  },
  {
    key: 'main',
    title: 'Mains',
    titleZh: '主菜',
    emoji: '🍽️',
    description: 'Hearty dishes from the world',
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
  const [randomMeals, categories] = await Promise.all([
    getRandomMeals(3),
    getAllCategories(),
  ])
  const featuredMeals = await localizeMealsForList(randomMeals)

  return (
    <div className="max-w-6xl mx-auto px-4 py-10 space-y-16">

      {/* ── Hero ──────────────────────────────────────── */}
      <section className="text-center py-10 space-y-6 animate-fade-up">
        {/* Decorative pill */}
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-green-100 text-green-700 text-xs font-semibold tracking-wide">
          🌍 Thousands of recipes · Free forever
        </span>

        <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 leading-tight tracking-tight">
          Explore the World&apos;s<br />
          <span className="text-green-600">Cuisines</span>
        </h1>

        <p className="text-gray-400 text-base sm:text-lg max-w-md mx-auto leading-relaxed">
          From Thai street food to Italian classics —<br className="hidden sm:block" />
          find your next favourite dish.
        </p>

        <div className="max-w-md mx-auto">
          <SearchBar />
        </div>

        {/* Quick region links */}
        <div className="chips-scroll justify-center max-w-lg mx-auto pt-1">
          {['Thai', 'Italian', 'Japanese', 'Indian', 'Mexican', 'French'].map((area) => (
            <Link
              key={area}
              href={`/area/${area}`}
              className="shrink-0 px-3 py-1 rounded-full bg-white border border-gray-200 text-xs text-gray-500 hover:border-green-400 hover:text-green-700 transition-colors"
            >
              {area}
            </Link>
          ))}
        </div>
      </section>

      {/* ── Browse by Course ──────────────────────────── */}
      <section className="space-y-5">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-800">Browse by Course</h2>
          <span className="text-xs text-gray-400">4 categories</span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 stagger">
          {COURSE_SECTIONS.map((section) => (
            <Link
              key={section.key}
              href={section.href}
              className={[
                'group flex flex-col items-center gap-3 p-5 rounded-2xl border text-center',
                'hover:shadow-lg hover:-translate-y-1 transition-all duration-250',
                section.bgColor, section.borderColor,
              ].join(' ')}
            >
              <span className="text-4xl group-hover:scale-110 transition-transform duration-200">
                {section.emoji}
              </span>
              <div>
                <p className="font-bold text-gray-800 text-sm">{section.title}</p>
                <p className="text-[11px] text-gray-400 mt-0.5 leading-relaxed">{section.description}</p>
              </div>
              <span className={`text-[11px] px-2.5 py-0.5 rounded-full font-semibold ${section.badgeColor}`}>
                {section.titleZh}
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* ── Everyday Cooking ──────────────────────────── */}
      <EverydayCookingSection />

      {/* ── Today's Picks ─────────────────────────────── */}
      <section className="space-y-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full bg-green-100 flex items-center justify-center">
              <Shuffle size={14} className="text-green-600" />
            </div>
            <h2 className="text-xl font-bold text-gray-800">Today&apos;s Picks</h2>
          </div>
          <span className="text-xs text-gray-400 bg-gray-100 px-2.5 py-1 rounded-full">
            Refreshed daily
          </span>
        </div>
        <RecipeGrid meals={featuredMeals} showSnippet />
      </section>

      {/* ── Explore by Region ─────────────────────────── */}
      <section className="rounded-2xl bg-gradient-to-br from-green-600 to-emerald-700 p-8 text-white text-center space-y-4">
        <Globe size={32} className="mx-auto opacity-80" />
        <div className="space-y-1">
          <h2 className="text-xl font-bold">Explore by Region</h2>
          <p className="text-green-100 text-sm">
            Discover authentic dishes from over 25 cuisines worldwide
          </p>
        </div>
        <Link
          href="/area"
          className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-white text-green-700 text-sm font-semibold hover:bg-green-50 transition-colors shadow-md"
        >
          Browse all regions <ChevronRight size={15} />
        </Link>
      </section>

      {/* ── All Categories ────────────────────────────── */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-800">All Categories</h2>
          <Link
            href="/category/Beef"
            className="text-sm text-green-600 hover:underline flex items-center gap-0.5"
          >
            View all <ChevronRight size={14} />
          </Link>
        </div>
        <div className="chips-scroll">
          {categories.map((cat) => (
            <Link
              key={cat.id}
              href={`/category/${encodeURIComponent(cat.name)}`}
              className="shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white border border-green-100 hover:border-green-400 hover:bg-green-50 transition-colors text-sm text-gray-700 shadow-sm"
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
