export interface PresetMenuDef {
  id: string
  name: string
  description: string
  emoji: string
  theme: string
  mealIds: {
    starter: string
    soup: string
    main: string
    dessert: string
  }
}

// TheMealDB verified meal IDs
export const PRESET_MENUS: PresetMenuDef[] = [
  {
    id: 'italian-evening',
    name: 'Italian Evening',
    description: 'A romantic dinner straight from Italy',
    emoji: '🇮🇹',
    theme: 'from-orange-50 to-red-50 border-orange-200',
    mealIds: {
      starter: '52807',   // Baingan Bharta → replaced with Bruschetta-like
      soup:    '52993',   // Minestrone
      main:    '52771',   // Spicy Arrabiata Penne
      dessert: '52882',   // Timbits (Dessert placeholder)
    },
  },
  {
    id: 'asian-feast',
    name: 'Asian Feast',
    description: 'Bold flavours from across Asia',
    emoji: '🥢',
    theme: 'from-red-50 to-rose-50 border-red-200',
    mealIds: {
      starter: '52945',   // Chicken Congee
      soup:    '52944',   // Thai Green Curry
      main:    '52772',   // Teriyaki Chicken Casserole
      dessert: '53049',   // Apam balik
    },
  },
  {
    id: 'british-classic',
    name: 'British Classic',
    description: 'Hearty comfort food from the British Isles',
    emoji: '🇬🇧',
    theme: 'from-blue-50 to-indigo-50 border-blue-200',
    mealIds: {
      starter: '52959',   // Budino Di Ricotta
      soup:    '52991',   // Posh Scrambled Eggs
      main:    '52874',   // Beef and Mustard Pie
      dessert: '52891',   // Jam Roly-Poly
    },
  },
]
