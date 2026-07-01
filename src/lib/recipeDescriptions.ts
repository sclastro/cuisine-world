import type { Meal } from './types'

// Appealing, original recipe blurbs — never scraped from the source site.
//
// Two tiers:
//  1. CURATED — hand-written EN/ZH copy for iconic, unambiguously-named dishes,
//     keyed by normalised name. A miss simply falls through (never wrong data).
//  2. buildAuto — a deterministic generator that composes a distinct, on-brand
//     blurb for EVERY other recipe from its real fields (area, category, time,
//     difficulty). Seeded by the meal id, so the same dish always reads the same
//     (SSR === client) and neighbouring cards don't repeat the same sentence.

export interface Blurb {
  en: string
  zh: string
}

function normalizeName(name: string): string {
  return name.trim().toLowerCase().replace(/\s+/g, ' ')
}

// --- Tier 1: curated copy for well-known dishes -----------------------------
// Keyed by normalised name. Unmatched entries are simply unused (fail-safe).
const CURATED: Record<string, Blurb> = {
  'spicy arrabiata penne': {
    en: 'Fiery garlic, chilli and tomato clinging to every quill of penne — this Roman classic proves a handful of pantry staples can taste like a night out in Italy.',
    zh: '蒜香、辣椒同番茄裹住每一條長通粉——呢道羅馬經典證明，幾樣廚櫃常備材料都可以食出意大利小館嘅風味。',
  },
  'teriyaki chicken casserole': {
    en: 'Glossy, sweet-savoury teriyaki soaking into tender chicken and rice — a one-dish weeknight hero that tastes like far more effort than it takes.',
    zh: '油亮鹹甜嘅照燒汁滲入嫩雞同白飯——一鑊搞掂嘅平日救星，味道靚得好似花咗好多功夫。',
  },
  'beef wellington': {
    en: 'Buttery pastry, a whisper of mushroom and a blushing pink fillet at the centre — the showstopper worth clearing an afternoon for.',
    zh: '酥化牛油酥皮、細膩菇香，中心一抹粉嫩牛柳——值得你騰出一個下午嘅壓場大菜。',
  },
  'katsu chicken curry': {
    en: 'Shatteringly crisp panko chicken over a mellow, golden Japanese curry — comfort food with a satisfying crunch in every bite.',
    zh: '酥脆麵包糠炸雞，鋪喺溫潤金黃嘅日式咖喱上——每一啖都有滿足脆感嘅療癒美食。',
  },
  'kung po prawns': {
    en: 'Plump prawns tossed with peanuts, chilli and a glossy sweet-sour sauce — a fast, fiery stir-fry straight from the Sichuan playbook.',
    zh: '飽滿蝦球配花生、辣椒同油亮酸甜醬——一鑊快炒，辣得夠喉，正宗川菜手勢。',
  },
  'beef lo mein': {
    en: 'Springy noodles, seared beef and crisp veg in a savoury toss — the takeaway favourite you can make better at home in minutes.',
    zh: '彈牙麵條、香煎牛肉同爽脆蔬菜炒埋一碟——你喺屋企幾分鐘就整得仲好食過外賣。',
  },
  'general tsos chicken': {
    en: 'Crunchy nuggets lacquered in a sticky sweet-heat glaze — the beloved sweet-and-spicy classic that disappears fast off the plate.',
    zh: '香脆雞粒裹上黏糯甜辣醬——甜中帶辣嘅人氣經典，上枱冇幾耐就會清碟。',
  },
  'thai green curry': {
    en: 'Fragrant coconut, green chilli and basil simmered into a silky, aromatic bowl — Thailand\'s comfort in a single spoonful.',
    zh: '椰香、青辣椒同羅勒煮成順滑芳香嘅一碗——一勺就食到泰國嘅療癒滋味。',
  },
  'sushi': {
    en: 'Cool vinegared rice and pristine toppings, cut clean and simple — a quiet lesson in how few ingredients can say so much.',
    zh: '清爽壽司飯配上乘餡料，切得俐落——少少材料都可以講好多故事嘅一課。',
  },
  'pad see ew': {
    en: 'Smoky wide rice noodles charred in a hot wok with egg and greens — Bangkok street food you can smell before you taste.',
    zh: '寬河粉喺猛火鑊度炒出鑊氣，配蛋同青菜——未食到已經聞到嘅曼谷街頭味。',
  },
  'massaman beef curry': {
    en: 'Slow-braised beef in a rich, gently spiced peanut-and-coconut curry — deep, warming and worth every patient minute.',
    zh: '慢燉牛肉浸喺濃郁微辣嘅花生椰香咖喱——醇厚暖胃，每一分鐘等待都值得。',
  },
  'honey teriyaki salmon': {
    en: 'Flaky salmon glazed in honeyed teriyaki until the edges caramelise — elegant enough for guests, quick enough for a Tuesday.',
    zh: '三文魚裹上蜜糖照燒汁，邊位微微焦糖化——宴客夠體面，平日又夠快。',
  },
  'chicken handi': {
    en: 'Tender chicken simmered in a spiced tomato-and-yoghurt gravy — a North Indian restaurant favourite made for scooping up with warm bread.',
    zh: '嫩雞煮喺香料番茄乳酪汁中——北印度餐廳嘅人氣菜，最啱用暖笠笠嘅烤餅蘸住食。',
  },
  'dal fry': {
    en: 'Golden lentils tempered with cumin, garlic and a sizzle of spice — humble, nourishing and endlessly comforting.',
    zh: '金黃扁豆用孜然、蒜同香料熗鑊——樸實、滋養，療癒到停唔到口。',
  },
  'egg drop soup': {
    en: 'Silky ribbons of egg swirled through a clear, savoury broth — a five-minute bowl of pure comfort.',
    zh: '絲滑蛋花喺清鮮湯底中打圈——五分鐘一碗，全是療癒。',
  },
  'french onion soup': {
    en: 'Deeply caramelised onions under a raft of molten, bubbling cheese — the bistro classic that turns patience into gold.',
    zh: '深度焦糖化嘅洋蔥，蓋上一層溶化冒泡嘅芝士——將耐性化成黃金嘅法式小館經典。',
  },
  'beef bourguignon': {
    en: 'Beef braised low and slow in red wine with mushrooms and onions — rustic French cooking at its most soul-warming.',
    zh: '牛肉用紅酒配菇同洋蔥慢火細燉——最暖心嘅法式鄉村菜。',
  },
  'ratatouille': {
    en: 'Summer vegetables stewed into a glossy, herb-scented tangle — Provence on a plate, as good warm as it is cold.',
    zh: '夏日蔬菜燉成油亮惹味、香草四溢嘅一碟——普羅旺斯風情，凍食熱食一樣好味。',
  },
  'moussaka': {
    en: 'Layered aubergine, spiced meat and a blanket of golden béchamel — the Greek Sunday-table centrepiece.',
    zh: '茄子、香料肉醬層層疊起，鋪上金黃白汁——希臘周日餐桌嘅主角。',
  },
  'full english breakfast': {
    en: 'Everything on one plate and no apologies — the hearty morning spread built to set you up for the whole day.',
    zh: '一碟盛滿、豪邁到底——足以撐起一整日嘅豐盛英式早餐。',
  },
  'pancakes': {
    en: 'Golden, fluffy and stacked high — the weekend breakfast that makes everyone show up on time.',
    zh: '金黃鬆軟、疊得高高——令全家都準時起身嘅周末早餐。',
  },
  'chocolate gateau': {
    en: 'Dense, dark and unapologetically rich — a celebration cake for serious chocolate lovers.',
    zh: '濃郁深邃、毫不客氣咁邪惡——為認真嘅朱古力控而設嘅慶祝蛋糕。',
  },
  'apple frangipan tart': {
    en: 'Almond cream and thin apple slices baked into buttery pastry — a patisserie-window classic you can pull off at home.',
    zh: '杏仁忌廉同薄切蘋果焗入牛油酥皮——餅店櫥窗嘅經典，你喺屋企都整到。',
  },
  'tiramisu': {
    en: 'Espresso-soaked sponge folded through cloud-soft mascarpone — the Italian pick-me-up worth every indulgent spoonful.',
    zh: '濃縮咖啡浸透嘅手指餅，夾住雲朵般柔軟嘅馬斯卡彭——每一勺都值得放縱嘅意式提神甜品。',
  },
}

// --- Tier 2: deterministic generator ----------------------------------------

// Stable seed from the meal id so a dish always reads the same way.
function seedFrom(id: string): number {
  let h = 0
  for (let i = 0; i < id.length; i++) h = (h * 31 + id.charCodeAt(i)) & 0x7fffffff
  return h
}

function pick<T>(arr: T[], seed: number): T {
  return arr[seed % arr.length]
}

function buildAuto(meal: Meal): Blurb {
  const seed = seedFrom(meal.id)
  const mins = meal.estTimeMinutes
  const stars = meal.difficulty?.stars ?? 3
  const area = meal.area || ''
  const areaZh = meal.areaZh || ''
  const catLc = (meal.category || 'dish').toLowerCase()
  const catZh = meal.categoryZh || '菜式'
  const name = meal.name
  const nameZh = meal.nameZh || meal.name

  const diffEn = stars <= 2 ? 'beginner-friendly' : stars === 3 ? 'a satisfying cook' : 'a rewarding project'
  const diffZh = stars <= 2 ? '新手都易上手' : stars === 3 ? '煮起上嚟好有滿足感' : '值得挑戰嘅一道菜'
  const originEn = area || 'home-kitchen'
  const originZh = areaZh || '家常'

  const en = [
    `${area ? area + ' ' : ''}comfort at its best — ${name} is ${diffEn} and comes together in about ${mins} minutes.`,
    `Warm, moreish and full of ${originEn} character, ${name} is the kind of ${catLc} people ask for again.`,
    `A ${originEn} favourite worth making from scratch: ${name} is ${diffEn}, ready in around ${mins} minutes.`,
    `Bright, satisfying and easy to love, ${name} brings a real taste of ${originEn} cooking to your table.`,
    `${name} turns everyday ingredients into something special — ${diffEn}, and on the plate in about ${mins} minutes.`,
    `If you're craving proper ${originEn} flavour, ${name} delivers: honest ${catLc}, made to share.`,
  ]

  const zh = [
    `${areaZh}嘅療癒滋味——${nameZh}${diffZh}，大約 ${mins} 分鐘就上到枱。`,
    `暖胃惹味、充滿${originZh}風味，${nameZh}就係嗰種食完會令人想再嗌嘅${catZh}。`,
    `值得由頭整起嘅${originZh}心水之選：${nameZh}${diffZh}，約 ${mins} 分鐘搞掂。`,
    `清新滿足、易人鍾意，${nameZh}將${originZh}菜嘅真味帶上你嘅餐桌。`,
    `${nameZh}將平凡食材化成驚喜——${diffZh}，大約 ${mins} 分鐘上碟。`,
    `想食到地道${originZh}風味，${nameZh}一定唔會令你失望：實實在在嘅${catZh}，最啱同人分享。`,
  ]

  return { en: pick(en, seed), zh: pick(zh, seed >> 3) }
}

// Resolve a blurb for a meal: curated copy if the name matches, else generated.
// Call this AFTER nameZh / areaZh / categoryZh are attached so the ZH copy reads
// naturally.
export function resolveDescription(meal: Meal): Blurb {
  const curated = CURATED[normalizeName(meal.name)]
  if (curated) return curated
  return buildAuto(meal)
}
