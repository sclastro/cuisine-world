'use client'

import { useLanguage } from '@/context/LanguageContext'

interface Props {
  flag: string
  area: string        // canonical English name
  nameZh: string
  introEn: string
  introZh: string
  recipeCount: number
}

// Region page header — shows the flag, localized region name and a
// hand-written bilingual blurb that switches with the language toggle.
export function AreaIntro({ flag, area, nameZh, introEn, introZh, recipeCount }: Props) {
  const { lang } = useLanguage()
  const zh = lang === 'zh'

  const name = zh ? nameZh : area
  const suffix = zh ? '菜' : ' Cuisine'
  const countLine = zh
    ? `${recipeCount} 道食譜`
    : `${recipeCount} recipe${recipeCount !== 1 ? 's' : ''}`

  return (
    <div className="space-y-2">
      <h1 className="text-2xl font-bold text-gray-800">
        {flag} {name}{suffix}
      </h1>
      <p className="text-sm text-gray-600 max-w-2xl leading-relaxed">
        {zh ? introZh : introEn}
      </p>
      <p className="text-xs text-gray-400">{countLine}</p>
    </div>
  )
}
