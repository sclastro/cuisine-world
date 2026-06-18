'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { ChefHat, X, ChevronLeft, ChevronRight } from 'lucide-react'
import { useT } from '@/hooks/useT'
import { useTranslation, useTranslations } from '@/hooks/useTranslation'

interface Props {
  steps: string[]
  title: string
}

// Minimal Wake Lock typing (not yet in the standard lib DOM types).
interface WakeLockSentinel {
  release: () => Promise<void>
}
interface WakeLockNavigator {
  wakeLock?: { request: (type: 'screen') => Promise<WakeLockSentinel> }
}

export function CookingMode({ steps, title }: Props) {
  const t = useT()
  const [open, setOpen] = useState(false)
  const [i, setI] = useState(0)

  const translatedSteps = useTranslations(steps)
  const translatedTitle = useTranslation(title)
  const wakeRef = useRef<WakeLockSentinel | null>(null)

  const total = translatedSteps.length
  const close = useCallback(() => setOpen(false), [])

  // Keyboard navigation + wake lock, only while the overlay is open.
  useEffect(() => {
    if (!open) return

    async function acquireWakeLock() {
      try {
        const nav = navigator as Navigator & WakeLockNavigator
        if ('wakeLock' in nav && nav.wakeLock) {
          wakeRef.current = await nav.wakeLock.request('screen')
        }
      } catch {
        // graceful fallback — screen may dim, that's fine
      }
    }
    acquireWakeLock()

    function onVisibility() {
      if (document.visibilityState === 'visible') acquireWakeLock()
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === 'ArrowRight') setI((n) => Math.min(total - 1, n + 1))
      else if (e.key === 'ArrowLeft') setI((n) => Math.max(0, n - 1))
      else if (e.key === 'Escape') close()
    }

    document.addEventListener('visibilitychange', onVisibility)
    window.addEventListener('keydown', onKey)
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    return () => {
      document.removeEventListener('visibilitychange', onVisibility)
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = prevOverflow
      wakeRef.current?.release().catch(() => {})
      wakeRef.current = null
    }
  }, [open, total, close])

  if (steps.length === 0) return null

  return (
    <>
      <button
        onClick={() => { setI(0); setOpen(true) }}
        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-green-600 text-white text-sm font-medium hover:bg-green-700 transition-colors shadow-sm"
      >
        <ChefHat size={16} />
        {t('cook.start')}
      </button>

      {open && (
        <div className="fixed inset-0 z-50 bg-white flex flex-col">
          {/* Top bar */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-green-100">
            <span className="text-sm font-semibold text-gray-700 line-clamp-1 pr-3">
              {translatedTitle}
            </span>
            <button
              onClick={close}
              className="inline-flex items-center gap-1 text-gray-500 hover:text-gray-800 text-sm"
            >
              <X size={18} />
              <span className="hidden sm:inline">{t('cook.exit')}</span>
            </button>
          </div>

          {/* Progress bar */}
          <div className="h-1 bg-green-50">
            <div
              className="h-full bg-green-500 transition-all duration-300"
              style={{ width: `${((i + 1) / total) * 100}%` }}
            />
          </div>

          {/* Step content */}
          <div className="flex-1 flex flex-col items-center justify-center px-6 py-8 max-w-2xl mx-auto w-full">
            <p className="text-sm font-semibold text-green-600 mb-4">
              {t('cook.step')} {i + 1} {t('cook.of')} {total}
            </p>
            <p className="text-xl sm:text-2xl leading-relaxed text-gray-800 text-center">
              {translatedSteps[i]}
            </p>
          </div>

          {/* Controls */}
          <div className="flex items-center justify-between gap-3 px-6 py-5 border-t border-green-100">
            <button
              onClick={() => setI((n) => Math.max(0, n - 1))}
              disabled={i === 0}
              className="inline-flex items-center gap-1 px-4 py-2.5 rounded-full border border-green-200 text-gray-700 text-sm font-medium hover:bg-green-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft size={18} />
              {t('cook.back')}
            </button>

            {i < total - 1 ? (
              <button
                onClick={() => setI((n) => Math.min(total - 1, n + 1))}
                className="inline-flex items-center gap-1 px-5 py-2.5 rounded-full bg-green-600 text-white text-sm font-medium hover:bg-green-700 transition-colors shadow-sm"
              >
                {t('cook.next')}
                <ChevronRight size={18} />
              </button>
            ) : (
              <button
                onClick={close}
                className="inline-flex items-center gap-1 px-5 py-2.5 rounded-full bg-green-600 text-white text-sm font-medium hover:bg-green-700 transition-colors shadow-sm"
              >
                {t('cook.done')}
              </button>
            )}
          </div>
        </div>
      )}
    </>
  )
}
