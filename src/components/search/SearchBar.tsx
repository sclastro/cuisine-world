'use client'

import { useState, type FormEvent } from 'react'
import { useRouter } from 'next/navigation'
import { Search } from 'lucide-react'
import { useLanguage } from '@/context/LanguageContext'
import { cn } from '@/lib/utils'

interface Props {
  compact?: boolean
  defaultValue?: string
}

export function SearchBar({ compact = false, defaultValue = '' }: Props) {
  const [query, setQuery] = useState(defaultValue)
  const router = useRouter()
  const { lang } = useLanguage()

  const placeholder = lang === 'zh' ? '搜尋食譜…' : 'Search recipes…'

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    const q = query.trim()
    if (!q) return
    router.push(`/search?q=${encodeURIComponent(q)}`)
  }

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <div className={cn(
        'flex items-center gap-2 rounded-full border border-green-200 bg-green-50',
        'focus-within:border-green-400 focus-within:bg-white transition-colors',
        compact ? 'px-3 py-1.5' : 'px-4 py-2.5'
      )}>
        <Search size={compact ? 15 : 18} className="text-green-500 shrink-0" />
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={placeholder}
          className={cn(
            'flex-1 bg-transparent outline-none text-gray-700 placeholder:text-gray-400',
            compact ? 'text-sm' : 'text-base'
          )}
        />
      </div>
    </form>
  )
}
