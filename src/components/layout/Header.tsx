'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { Menu, X, Heart, UtensilsCrossed } from 'lucide-react'
import { LanguageToggle } from '@/components/ui/LanguageToggle'
import { SearchBar } from '@/components/search/SearchBar'
import { useFavorites } from '@/context/FavoritesContext'
import { useLanguage } from '@/context/LanguageContext'
import { cn } from '@/lib/utils'

const NAV_LABELS: Record<string, { en: string; zh: string }> = {
  starters:  { en: 'Starters',     zh: '前菜' },
  everyday:  { en: 'Home Cooking', zh: '家常菜' },
  mains:     { en: 'Mains',        zh: '主菜' },
  desserts:  { en: 'Desserts',     zh: '甜品' },
  regions:   { en: 'Regions',      zh: '地區' },
  favorites: { en: 'Favorites',    zh: '收藏' },
  menu:      { en: 'My Menu',      zh: '我的菜單' },
}

export function Header() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const { favorites, mounted } = useFavorites()
  const { lang } = useLanguage()

  useEffect(() => {
    function onScroll() { setScrolled(window.scrollY > 8) }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const label = (key: string) =>
    lang === 'zh' ? NAV_LABELS[key].zh : NAV_LABELS[key].en

  const navLinks = [
    { href: '/category/Starter', label: label('starters') },
    { href: '/everyday',         label: label('everyday') },
    { href: '/category/Beef',    label: label('mains') },
    { href: '/category/Dessert', label: label('desserts') },
    { href: '/area',             label: label('regions') },
    { href: '/menu',             label: label('menu') },
  ]

  return (
    <header className={cn(
      'sticky top-0 z-50 bg-white/90 backdrop-blur border-b border-green-100 transition-shadow duration-300',
      scrolled ? 'shadow-md' : 'shadow-sm'
    )}>
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center gap-4">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 shrink-0">
          <UtensilsCrossed size={24} className="text-green-600" />
          <span className="font-bold text-lg text-green-800 hidden sm:block">
            Cuisine World
          </span>
        </Link>

        {/* Search */}
        <div className="flex-1 max-w-sm">
          <SearchBar compact />
        </div>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="px-3 py-1.5 rounded-lg text-sm text-gray-600 hover:text-green-700 hover:bg-green-50 transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Favorites icon */}
        <Link
          href="/favorites"
          className="relative hidden md:flex items-center justify-center w-9 h-9 rounded-full hover:bg-green-50 transition-colors"
          aria-label="Favorites"
        >
          <Heart size={20} className="text-green-700" />
          {mounted && favorites.size > 0 && (
            <span className="absolute -top-0.5 -right-0.5 bg-green-600 text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
              {favorites.size > 9 ? '9+' : favorites.size}
            </span>
          )}
        </Link>

        <LanguageToggle />

        {/* Mobile menu button */}
        <button
          className="md:hidden p-2 rounded-lg hover:bg-green-50 transition-colors"
          onClick={() => setOpen((v) => !v)}
          aria-label="Toggle menu"
        >
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile nav drawer */}
      {open && (
        <nav className="md:hidden border-t border-green-100 bg-white px-4 py-3 flex flex-col gap-1">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className="px-3 py-2 rounded-lg text-sm text-gray-700 hover:bg-green-50 hover:text-green-700 transition-colors"
            >
              {link.label}
            </Link>
          ))}
          <Link
            href="/favorites"
            onClick={() => setOpen(false)}
            className="px-3 py-2 rounded-lg text-sm text-gray-700 hover:bg-green-50 hover:text-green-700 transition-colors flex items-center gap-2"
          >
            <Heart size={16} />
            {label('favorites')}
            {mounted && favorites.size > 0 && (
              <span className="bg-green-600 text-white text-[10px] font-bold rounded-full px-1.5 py-0.5">
                {favorites.size}
              </span>
            )}
          </Link>
        </nav>
      )}
    </header>
  )
}
