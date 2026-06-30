// Unified region/area data — the single source of truth for browsing by region.
//
// TheMealDB and Spoonacular each cover a *different* slice of the world's
// cuisines.  This module merges them so every region in the UI is clickable
// and meaningful: it knows each area's flag, its Chinese name, a hand-written
// bilingual blurb (no generic filler), and — where one exists — the matching
// Spoonacular cuisine so an area page can pull home-cooking recipes from both
// sources at once.

export interface AreaInfo {
  flag: string
  nameZh: string
  // Hand-written intros — deliberately specific, never "explore X recipes".
  introEn: string
  introZh: string
  // Spoonacular cuisine param, if that cuisine is supported there.
  spoonacular?: string
}

// Keyed by the canonical English area name (as TheMealDB spells it).
export const AREA_INFO: Record<string, AreaInfo> = {
  American: {
    flag: '🇺🇸', nameZh: '美國',
    introEn: 'Diner classics, smoky barbecue and big-batch comfort food — the melting-pot cooking of a whole continent.',
    introZh: '美式餐館經典、煙燻燒烤同大份量療癒美食，匯聚整個大陸嘅大熔爐風味。',
    spoonacular: 'american',
  },
  British: {
    flag: '🇬🇧', nameZh: '英國',
    introEn: 'Sunday roasts, flaky pies and proper puddings — hearty, unfussy cooking made for grey afternoons.',
    introZh: '星期日烤肉、酥皮餡餅同地道布丁，樸實豐盛，最啱陰天午後。',
    spoonacular: 'british',
  },
  Canadian: {
    flag: '🇨🇦', nameZh: '加拿大',
    introEn: 'Maple, poutine and lumberjack breakfasts — North American comfort with its own cosy accent.',
    introZh: '楓糖、肉汁芝士薯條同伐木工早餐，北美療癒風味嘅獨特版本。',
  },
  Chinese: {
    flag: '🇨🇳', nameZh: '中國',
    introEn: 'From wok-fired stir-fries to slow-simmered braises — the everyday home cooking behind the world\'s deepest food culture.',
    introZh: '由鑊氣小炒到慢火炆煮，呈現世界最深厚飲食文化背後嘅家常滋味。',
    spoonacular: 'chinese',
  },
  Croatian: {
    flag: '🇭🇷', nameZh: '克羅地亞',
    introEn: 'Adriatic seafood, grilled meats and Mediterranean-meets-Balkan flavours along a sun-soaked coast.',
    introZh: '亞得里亞海海鮮、炭燒肉類，地中海撞巴爾幹嘅陽光海岸風味。',
  },
  Dutch: {
    flag: '🇳🇱', nameZh: '荷蘭',
    introEn: 'Stamppot, fresh herring and syrup-filled stroopwafels — thrifty, warming food from the lowlands.',
    introZh: '薯仔燴菜、新鮮鯡魚同糖漿夾餅，低地國家節儉又暖心嘅料理。',
  },
  Egyptian: {
    flag: '🇪🇬', nameZh: '埃及',
    introEn: 'Koshari, fava beans and fragrant spice — filling, ancient street food along the Nile.',
    introZh: '雜豆飯、蠶豆同香料飄香，尼羅河畔飽肚嘅古老街頭美食。',
  },
  Filipino: {
    flag: '🇵🇭', nameZh: '菲律賓',
    introEn: 'Tangy adobo, sweet-savoury stews and a fearless love of vinegar, garlic and soy.',
    introZh: '惹味 adobo、甜鹹燉菜，大膽運用醋、蒜同豉油嘅島國風味。',
  },
  French: {
    flag: '🇫🇷', nameZh: '法國',
    introEn: 'Butter, technique and patience — from rustic bistro plates to the pastry that made France famous.',
    introZh: '牛油、技巧同耐性，由鄉村小酒館到令法國聞名嘅糕點。',
    spoonacular: 'french',
  },
  Greek: {
    flag: '🇬🇷', nameZh: '希臘',
    introEn: 'Olive oil, lemon and oregano — bright Mediterranean cooking meant to be shared slowly.',
    introZh: '橄欖油、檸檬同牛至，明亮嘅地中海菜式，最啱慢慢分享。',
    spoonacular: 'greek',
  },
  Indian: {
    flag: '🇮🇳', nameZh: '印度',
    introEn: 'Layered spice, slow-built curries and breads worth the wait — a different recipe in every region.',
    introZh: '層層香料、慢煮咖喱同值得等待嘅烤餅，每個地區都有自己嘅配方。',
    spoonacular: 'indian',
  },
  Irish: {
    flag: '🇮🇪', nameZh: '愛爾蘭',
    introEn: 'Soda bread, lamb stew and buttery potatoes — honest farmhouse food with a warm heart.',
    introZh: '梳打麵包、燉羊肉同牛油薯仔，實在又暖心嘅農家料理。',
    spoonacular: 'irish',
  },
  Italian: {
    flag: '🇮🇹', nameZh: '意大利',
    introEn: 'Fresh pasta, slow ragù and a handful of perfect ingredients — proof that simple done well beats everything.',
    introZh: '新鮮意粉、慢煮肉醬同幾樣完美食材，證明簡單做得好就勝過一切。',
    spoonacular: 'italian',
  },
  Jamaican: {
    flag: '🇯🇲', nameZh: '牙買加',
    introEn: 'Jerk spice, scotch bonnet heat and slow-smoked island flavour you can taste from across the yard.',
    introZh: 'Jerk 香料、辣椒嘅火辣同慢燻島嶼風味，隔籬都聞到香。',
  },
  Japanese: {
    flag: '🇯🇵', nameZh: '日本',
    introEn: 'Dashi, rice and restraint — precise, seasonal cooking where less is almost always more.',
    introZh: '高湯、白飯同節制，講求精準同時令，少即是多嘅料理哲學。',
    spoonacular: 'japanese',
  },
  Kenyan: {
    flag: '🇰🇪', nameZh: '肯雅',
    introEn: 'Nyama choma, ugali and slow stews — generous, fire-cooked food made for big tables.',
    introZh: '炭烤肉、玉米糊同慢燉菜，豪邁嘅柴火料理，最啱大圍枱。',
  },
  Malaysian: {
    flag: '🇲🇾', nameZh: '馬來西亞',
    introEn: 'Laksa, sambal and coconut-rich curries — a delicious crossroads of Malay, Chinese and Indian cooking.',
    introZh: '叻沙、參巴醬同椰香咖喱，馬來、華人同印度料理嘅美味交匯點。',
  },
  Mexican: {
    flag: '🇲🇽', nameZh: '墨西哥',
    introEn: 'Corn, chilli and lime — bold, layered flavours from street tacos to slow-cooked moles.',
    introZh: '粟米、辣椒同青檸，由街頭墨西哥卷到慢煮 mole 嘅濃烈層次。',
    spoonacular: 'mexican',
  },
  Moroccan: {
    flag: '🇲🇦', nameZh: '摩洛哥',
    introEn: 'Tagines, preserved lemon and warm spice — sweet-and-savoury cooking from the edge of the Sahara.',
    introZh: 'Tagine 燉鍋、醃檸檬同暖香料，撒哈拉邊緣嘅甜鹹料理。',
  },
  Norwegian: {
    flag: '🇳🇴', nameZh: '挪威',
    introEn: 'Cured salmon, dark bread and berries — clean, cold-climate cooking from fjord to table.',
    introZh: '醃三文魚、黑麵包同野莓，由峽灣到餐桌嘅清爽寒地料理。',
  },
  Polish: {
    flag: '🇵🇱', nameZh: '波蘭',
    introEn: 'Pierogi, hearty soups and slow-cooked cabbage — generous, warming food for long winters.',
    introZh: '波蘭餃子、濃湯同慢煮椰菜，豐盛暖心，最啱漫長寒冬。',
  },
  Portuguese: {
    flag: '🇵🇹', nameZh: '葡萄牙',
    introEn: 'Salt cod, charcoal-grilled sardines and custard tarts — seafaring flavours and a serious sweet tooth.',
    introZh: '馬介休、炭燒沙甸魚同葡撻，航海風味加上對甜品嘅執著。',
  },
  Russian: {
    flag: '🇷🇺', nameZh: '俄羅斯',
    introEn: 'Borscht, dumplings and rich, sour-cream comfort built to outlast the cold.',
    introZh: '羅宋湯、餃子同酸忌廉嘅濃郁療癒，足以抵禦嚴寒。',
  },
  Spanish: {
    flag: '🇪🇸', nameZh: '西班牙',
    introEn: 'Tapas, saffron rice and slow-cured ham — food that turns every meal into a gathering.',
    introZh: 'Tapas 小食、藏紅花飯同風乾火腿，令每餐都變成一場聚會。',
    spoonacular: 'spanish',
  },
  Thai: {
    flag: '🇹🇭', nameZh: '泰國',
    introEn: 'Hot, sour, salty, sweet — punchy curries and fresh herbs balanced in a single perfect bite.',
    introZh: '酸辣鹹甜，濃烈咖喱同新鮮香草，喺一啖之間完美平衡。',
    spoonacular: 'thai',
  },
  Tunisian: {
    flag: '🇹🇳', nameZh: '突尼西亞',
    introEn: 'Harissa heat, couscous and Mediterranean spice along the North African coast.',
    introZh: 'Harissa 辣醬、北非小米同地中海香料，北非海岸嘅風味。',
  },
  Turkish: {
    flag: '🇹🇷', nameZh: '土耳其',
    introEn: 'Kebabs, mezze and syrup-soaked sweets — where Europe and Asia meet on one table.',
    introZh: '烤肉串、mezze 前菜同糖漿甜點，歐亞喺同一張餐桌相遇。',
  },
  Ukrainian: {
    flag: '🇺🇦', nameZh: '烏克蘭',
    introEn: 'Borscht, varenyky and garden vegetables — generous, home-grown cooking with deep roots.',
    introZh: '羅宋湯、烏克蘭餃子同田園蔬菜，根深蒂固嘅豐盛家常菜。',
  },
  Vietnamese: {
    flag: '🇻🇳', nameZh: '越南',
    introEn: 'Pho, fresh herbs and bright fish sauce — light, fragrant cooking with a perfect balance of textures.',
    introZh: '河粉、新鮮香草同明亮魚露，清爽芳香、口感平衡嘅料理。',
    spoonacular: 'vietnamese',
  },

  // ── Spoonacular-only regions (not in TheMealDB) ──────────────────────────
  Korean: {
    flag: '🇰🇷', nameZh: '韓國',
    introEn: 'Kimchi, sizzling barbecue and bubbling stews — bold, fermented flavours and a banchan for every bite.',
    introZh: '泡菜、滋滋作響嘅燒烤同滾燙鍋物，濃烈發酵風味，配上各式小菜。',
    spoonacular: 'korean',
  },
}

// Regions we surface even though TheMealDB doesn't list them (filled by Spoonacular).
export const SPOONACULAR_ONLY_AREAS = ['Korean']

// A focused, curated set of popular cuisines for the region browser. TheMealDB
// lists ~30 areas including many obscure ones (Croatian, Kenyan, Tunisian…);
// surfacing every one makes the selector noisy. We narrow it to the cuisines
// people actually look for, in a sensible order.
export const CURATED_AREAS = [
  'Chinese', 'Japanese', 'Korean', 'Thai', 'Vietnamese', 'Malaysian',
  'Indian', 'Italian', 'French', 'Greek', 'Spanish',
  'American', 'British', 'Mexican',
]

// Intersect the curated list with what's actually available (keeps order), and
// guarantee `current` is present so the active region always shows as a chip.
export function curatedAreaList(available: string[], current?: string): string[] {
  const have = new Set(available)
  const list = CURATED_AREAS.filter((a) => have.has(a))
  if (current && !list.includes(current) && have.has(current)) list.push(current)
  return list
}

// Look up display metadata with a graceful fallback for unknown areas.
export function getAreaInfo(area: string): AreaInfo {
  return (
    AREA_INFO[area] ?? {
      flag: '🌍',
      nameZh: area,
      introEn: `Home-style recipes and regional favourites from ${area}.`,
      introZh: `來自${area}嘅家常食譜同地道菜式。`,
    }
  )
}

// The Spoonacular cuisine param for an area, or null if unsupported.
export function spoonacularCuisineFor(area: string): string | null {
  return AREA_INFO[area]?.spoonacular ?? null
}
