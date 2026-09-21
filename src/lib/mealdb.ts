// TheMealDB puts the API key in the URL path itself: /api/json/v1/<key>.
//
// "1" is the public developer test key. It serves every endpoint this app
// uses, but it is rate limited and the supporter-only endpoints answer it with
// a "Only For Patreon supporters sorry" placeholder rather than data. Keeping
// the key in an env var means upgrading to a Patreon key is a config change
// rather than a code change.
//
// Deliberately not NEXT_PUBLIC_: Next.js only inlines NEXT_PUBLIC_* values into
// client bundles, so a paid key never reaches the browser.
//
// This module does get bundled for the client, because MenuBuilder is a client
// component that imports the data layer to resolve shared-menu links. There
// process.env is empty and the key falls back to "1" — no key is exposed, but
// that one browser-side path keeps using the free key even when a paid key is
// configured. Moving that fetch to a server action would close the gap.
const MEALDB_API_KEY = process.env.MEALDB_API_KEY?.trim() || '1'

export const MEALDB_BASE_URL = `https://www.themealdb.com/api/json/v1/${MEALDB_API_KEY}`
