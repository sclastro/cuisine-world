import Link from 'next/link'
import { ChevronRight } from 'lucide-react'

export const dynamic = 'force-dynamic'

export async function generateMetadata() {
  return {
    title: 'Home Cooking — Cuisine World',
    description: 'Simple, approachable everyday recipes for every kitchen.',
  }
}

const SECTIONS = [
  {
    type: 'quick',
    emoji: '⚡',
    en: 'Quick Meals',
    zh: '快手菜',
    descEn: 'Ready in 30 minutes or less',
    descZh: '30分鐘內上桌',
    bg: 'bg-yellow-50',
    border: 'border-yellow-200',
    badge: 'bg-yellow-100 text-yellow-800',
  },
  {
    type: 'asian',
    emoji: '🥢',
    en: 'Asian Home',
    zh: '亞洲家常',
    descEn: 'HK, Japanese, Korean, Thai & more',
    descZh: '港、日、韓、泰等亞洲家常',
    bg: 'bg-red-50',
    border: 'border-red-200',
    badge: 'bg-red-100 text-red-800',
  },
  {
    type: 'world',
    emoji: '🌍',
    en: 'World Kitchen',
    zh: '世界家常',
    descEn: 'Western & Mediterranean everyday dishes',
    descZh: '西式及地中海家常菜',
    bg: 'bg-blue-50',
    border: 'border-blue-200',
    badge: 'bg-blue-100 text-blue-800',
  },
]

export default function EverydayPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12 space-y-10">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-extrabold text-gray-900">
          🍳 Everyday Cooking
        </h1>
        <p className="text-gray-400 text-sm">Simple, approachable dishes for every day</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 stagger">
        {SECTIONS.map((s) => (
          <Link
            key={s.type}
            href={`/everyday/${s.type}`}
            className={[
              'group flex flex-col items-center gap-3 p-8 rounded-2xl border text-center',
              'hover:shadow-lg hover:-translate-y-1 transition-all duration-250',
              s.bg, s.border,
            ].join(' ')}
          >
            <span className="text-5xl group-hover:scale-110 transition-transform duration-200">
              {s.emoji}
            </span>
            <div>
              <p className="font-bold text-gray-800">{s.en}</p>
              <p className="text-xs text-gray-400 mt-1 leading-relaxed">{s.descEn}</p>
            </div>
            <span className={`text-xs px-2.5 py-0.5 rounded-full font-semibold ${s.badge}`}>
              {s.zh}
            </span>
            <span className="text-xs text-gray-400 flex items-center gap-0.5 group-hover:text-green-600 transition-colors">
              Browse <ChevronRight size={12} />
            </span>
          </Link>
        ))}
      </div>
    </div>
  )
}
