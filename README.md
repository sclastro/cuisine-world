# cuisine-world

Recipe browser built on [TheMealDB](https://www.themealdb.com), with Chinese
localisation, favourites, and a menu builder.

## Getting started

```bash
npm install
npm run dev
```

## Environment variables

All of them are optional — the app runs with none set. Copy `.env.example` to
`.env.local` to override any of them.

| Variable | Effect when unset |
| --- | --- |
| `MEALDB_API_KEY` | Falls back to TheMealDB's public test key `1`, which serves every endpoint the app uses. A Patreon supporter key raises the rate limit and unlocks the supporter-only endpoints. |
| `SPOONACULAR_API_KEY` | The Spoonacular-only cuisines stay hidden, and nutrition falls back to Open Food Facts and then to an ingredient-based estimate. |
| `YOUTUBE_API_KEY` | "Watch & Cook" still embeds the video from TheMealDB; only the richer metadata lookup is skipped. |

No key value reaches the browser: Next.js inlines only `NEXT_PUBLIC_*`
variables, and none of these are. Note that `MenuBuilder` resolves shared-menu
links from the client, and that one path falls back to the free `1` key even
when `MEALDB_API_KEY` is set.
