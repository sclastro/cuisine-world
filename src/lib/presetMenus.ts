// Preset menus are resolved dynamically from each menu's cuisine at request
// time (see api.ts::resolvePresetMenu) rather than hard-coded meal IDs. The
// old fixed-ID approach drifted out of sync (an "Italian" menu could show an
// Indian starter); resolving by area/category guarantees every slot is a real,
// on-theme, complete dish.

export interface PresetMenuDef {
  id: string
  name: string
  nameZh: string
  description: string
  descriptionZh: string
  emoji: string
  theme: string
  // TheMealDB area used to source the starter/soup/main slots.
  area: string
}

export const PRESET_MENUS: PresetMenuDef[] = [
  {
    id: 'italian-evening',
    name: 'Italian Evening',
    nameZh: '意式晚宴',
    description: 'A romantic dinner straight from Italy',
    descriptionZh: '一頓浪漫嘅意大利晚餐',
    emoji: '🇮🇹',
    theme: 'from-orange-50 to-red-50 border-orange-200',
    area: 'Italian',
  },
  {
    id: 'asian-feast',
    name: 'Asian Feast',
    nameZh: '亞洲盛宴',
    description: 'Bold flavours from across Asia',
    descriptionZh: '橫跨亞洲嘅濃烈風味',
    emoji: '🥢',
    theme: 'from-red-50 to-rose-50 border-red-200',
    area: 'Chinese',
  },
  {
    id: 'british-classic',
    name: 'British Classic',
    nameZh: '英式經典',
    description: 'Hearty comfort food from the British Isles',
    descriptionZh: '嚟自英倫嘅暖心住家菜',
    emoji: '🇬🇧',
    theme: 'from-blue-50 to-indigo-50 border-blue-200',
    area: 'British',
  },
]
