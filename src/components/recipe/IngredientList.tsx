import Image from 'next/image'
import type { Ingredient } from '@/lib/types'

interface Props {
  ingredients: Ingredient[]
}

export function IngredientList({ ingredients }: Props) {
  return (
    <ul className="grid grid-cols-2 sm:grid-cols-3 gap-2">
      {ingredients.map((ing) => (
        <li
          key={ing.name}
          className="flex items-center gap-2 p-2 rounded-xl bg-green-50 border border-green-100"
        >
          <div className="relative w-8 h-8 shrink-0">
            <Image
              src={ing.imageUrl}
              alt={ing.name}
              fill
              sizes="32px"
              className="object-contain rounded"
              onError={undefined}
            />
          </div>
          <div className="min-w-0">
            <p className="text-xs font-medium text-gray-800 truncate">{ing.name}</p>
            {ing.measure && (
              <p className="text-[11px] text-gray-400 truncate">{ing.measure}</p>
            )}
          </div>
        </li>
      ))}
    </ul>
  )
}
