'use client'

import { useEffect, useRef, useState, type FormEvent, type KeyboardEvent } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { Search } from 'lucide-react'
import { useLanguage } from '@/context/LanguageContext'
import { getSearchSuggestions } from '@/app/actions'
import type { IndexEntry } from '@/lib/searchIndex'
import { cn } from '@/lib/utils'

interface Props {
  compact?: boolean
  defaultValue?: string
}

const DEBOUNCE_MS = 200
const MIN_CHARS = 2

export function SearchBar({ compact = false, defaultValue = '' }: Props) {
  const [query, setQuery] = useState(defaultValue)
  const [suggestions, setSuggestions] = useState<IndexEntry[]>([])
  const [open, setOpen] = useState(false)
  const [activeIndex, setActiveIndex] = useState(-1)
  const router = useRouter()
  const { lang } = useLanguage()
  const containerRef = useRef<HTMLDivElement>(null)
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const requestIdRef = useRef(0)

  const placeholder = lang === 'zh' ? '搜尋食譜…' : 'Search recipes…'

  // Debounced fetch of fuzzy suggestions as the user types.
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current)
    const trimmed = query.trim()
    if (trimmed.length < MIN_CHARS) {
      setSuggestions([])
      setActiveIndex(-1)
      return
    }
    const thisRequest = ++requestIdRef.current
    debounceRef.current = setTimeout(async () => {
      const results = await getSearchSuggestions(trimmed)
      // Ignore stale responses from an earlier keystroke.
      if (thisRequest === requestIdRef.current) {
        setSuggestions(results)
        setActiveIndex(-1)
      }
    }, DEBOUNCE_MS)
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current)
    }
  }, [query])

  // Close the dropdown on outside click.
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  function goToQuery(q: string) {
    const trimmed = q.trim()
    if (!trimmed) return
    setOpen(false)
    router.push(`/search?q=${encodeURIComponent(trimmed)}`)
  }

  function goToRecipe(id: string) {
    setOpen(false)
    router.push(`/recipe/${id}`)
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (activeIndex >= 0 && suggestions[activeIndex]) {
      goToRecipe(suggestions[activeIndex].id)
    } else {
      goToQuery(query)
    }
  }

  function handleKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if (!open || suggestions.length === 0) return
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setActiveIndex((i) => (i + 1) % suggestions.length)
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setActiveIndex((i) => (i <= 0 ? suggestions.length - 1 : i - 1))
    } else if (e.key === 'Escape') {
      setOpen(false)
      setActiveIndex(-1)
    }
  }

  const showDropdown = open && suggestions.length > 0

  return (
    <div ref={containerRef} className="relative w-full">
      <form onSubmit={handleSubmit} className="w-full" role="search">
        <div className={cn(
          'flex items-center gap-2 rounded-full border border-green-200 bg-green-50',
          'focus-within:border-green-400 focus-within:bg-white transition-colors',
          compact ? 'px-3 py-1.5' : 'px-4 py-2.5'
        )}>
          <Search size={compact ? 15 : 18} className="text-green-500 shrink-0" />
          <input
            type="search"
            value={query}
            onChange={(e) => { setQuery(e.target.value); setOpen(true) }}
            onFocus={() => setOpen(true)}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            aria-label={placeholder}
            role="combobox"
            aria-expanded={showDropdown}
            aria-controls="search-suggestions"
            aria-autocomplete="list"
            className={cn(
              'flex-1 bg-transparent outline-none text-gray-700 placeholder:text-gray-400',
              compact ? 'text-sm' : 'text-base'
            )}
          />
        </div>
      </form>

      {showDropdown && (
        <ul
          id="search-suggestions"
          role="listbox"
          className="absolute left-0 right-0 top-full mt-2 max-h-80 overflow-y-auto rounded-2xl border border-green-100 bg-white shadow-lg z-50 py-1.5"
        >
          {suggestions.map((s, i) => (
            <li
              key={s.id}
              role="option"
              aria-selected={i === activeIndex}
              onMouseDown={(e) => { e.preventDefault(); goToRecipe(s.id) }}
              onMouseEnter={() => setActiveIndex(i)}
              className={cn(
                'flex items-center gap-2.5 px-3 py-2 cursor-pointer text-sm',
                i === activeIndex ? 'bg-green-50 text-green-800' : 'text-gray-700 hover:bg-green-50'
              )}
            >
              <div className="relative w-8 h-8 rounded-lg overflow-hidden shrink-0 bg-green-50">
                <Image src={s.thumbnail} alt={s.name} fill sizes="32px" className="object-cover" />
              </div>
              <span className="truncate">{s.name}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
