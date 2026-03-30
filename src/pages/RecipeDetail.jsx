import { useTranslation } from 'react-i18next'
import { useParams, useNavigate } from 'react-router-dom'
import { getRecipeById, getIngredientCount } from '../data/recipes'
import { getRecipeImage } from '../data/recipeImages'

export default function RecipeDetail() {
  const { t, i18n } = useTranslation()
  const { id } = useParams()
  const navigate = useNavigate()
  const lang = i18n.language

  const recipe = getRecipeById(id)

  if (!recipe) {
    return (
      <div className="px-6 pt-6 pb-24">
        <button onClick={() => navigate(-1)} className="text-terra font-heading font-semibold text-sm">← {lang === 'es' ? 'Volver' : 'Back'}</button>
        <p className="mt-8 text-center text-charcoal-light">{lang === 'es' ? 'Receta no encontrada' : 'Recipe not found'}</p>
      </div>
    )
  }

  const ingredientCount = getIngredientCount(recipe)
  const image = getRecipeImage(recipe.id)

  return (
    <div className="pb-24">
      {/* Hero */}
      <div className="h-56 bg-gradient-to-br from-terra to-terra-light flex items-center justify-center text-7xl relative overflow-hidden">
        {image ? (
          <img src={image} alt={recipe.name[lang]} className="w-full h-full object-cover" loading="lazy" />
        ) : (
          <span>🌱</span>
        )}
        <button
          onClick={() => navigate(-1)}
          className="absolute top-4 left-4 bg-white/90 rounded-full w-9 h-9 flex items-center justify-center text-terra font-bold text-lg"
        >
          ←
        </button>
        {recipe.siboFriendly && (
          <span className="absolute top-4 right-4 bg-khaki rounded-full px-3 py-1.5 text-xs font-heading font-semibold text-[#6B5A2A]">
            SIBO ✓
          </span>
        )}
      </div>

      <div className="px-6 -mt-6">
        {/* Title card */}
        <div className="bg-white rounded-2xl p-5 shadow-[0_4px_12px_rgba(199,91,60,0.08)]">
          <h1 className="font-heading text-xl font-bold">{recipe.name[lang]}</h1>
          <p className="text-sm text-charcoal-light mt-1 font-accent italic">{recipe.description[lang]}</p>

          <div className="flex gap-3 mt-4 flex-wrap">
            <div className="flex items-center gap-1.5 text-xs text-charcoal-light">
              <span>⏱</span> {recipe.time} min
            </div>
            <div className="flex items-center gap-1.5 text-xs text-charcoal-light">
              <span>👥</span> {t('recipes.servings', { count: recipe.servings })}
            </div>
            <div className="flex items-center gap-1.5 text-xs text-charcoal-light">
              <span>🥕</span> {ingredientCount} ingr.
            </div>
            {recipe.freezable && (
              <div className="flex items-center gap-1.5 text-xs text-forest">
                <span>❄️</span> {t('recipes.freezable')}
              </div>
            )}
          </div>

          {/* Tags */}
          <div className="flex gap-1.5 mt-3 flex-wrap">
            {recipe.tags.map(tag => (
              <span key={tag} className="bg-forest/10 text-forest rounded-full px-2.5 py-0.5 text-[10px] font-heading font-medium">
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* Nutrition */}
        <div className="bg-white rounded-2xl p-5 shadow-[0_4px_12px_rgba(199,91,60,0.08)] mt-4">
          <h2 className="font-heading font-bold text-sm mb-3">
            {lang === 'es' ? 'Info nutricional (por ración)' : 'Nutrition info (per serving)'}
          </h2>
          <div className="grid grid-cols-3 gap-3">
            {[
              { label: t('nutrition.calories'), value: recipe.nutrition.calories, unit: '' },
              { label: t('nutrition.protein'), value: recipe.nutrition.protein, unit: 'g' },
              { label: lang === 'es' ? 'Carbos' : 'Carbs', value: recipe.nutrition.carbs, unit: 'g' },
              { label: lang === 'es' ? 'Grasa' : 'Fat', value: recipe.nutrition.fat, unit: 'g' },
              { label: t('nutrition.fiber'), value: recipe.nutrition.fiber, unit: 'g' },
              { label: t('nutrition.iron'), value: recipe.nutrition.iron, unit: 'mg' },
              { label: t('nutrition.calcium'), value: recipe.nutrition.calcium, unit: 'mg' },
              { label: 'B12', value: recipe.nutrition.b12, unit: 'µg' },
              { label: 'Zinc', value: recipe.nutrition.zinc, unit: 'mg' },
            ].map(({ label, value, unit }) => (
              <div key={label} className="text-center py-2 bg-cream rounded-lg">
                <p className="font-heading text-sm font-bold text-terra">{value}{unit}</p>
                <p className="text-[10px] text-charcoal-light">{label}</p>
              </div>
            ))}
          </div>
          <p className="text-[9px] text-charcoal-light mt-2 text-center">
            {lang === 'es' ? 'Datos calculados con USDA FoodData Central' : 'Data calculated with USDA FoodData Central'}
          </p>
        </div>

        {/* Ingredients */}
        <div className="bg-white rounded-2xl p-5 shadow-[0_4px_12px_rgba(199,91,60,0.08)] mt-4">
          <h2 className="font-heading font-bold text-sm mb-3">
            {lang === 'es' ? 'Ingredientes' : 'Ingredients'} ({recipe.servings} {lang === 'es' ? 'raciones' : 'servings'})
          </h2>
          <ul className="space-y-2">
            {recipe.ingredients.map((ing, i) => (
              <li key={i} className="flex items-center gap-3 py-1.5 border-b border-cream-dark last:border-0">
                <div className="w-5 h-5 rounded-md border-2 border-terra/30 flex-shrink-0" />
                <span className="text-sm flex-1">{ing.name[lang]}</span>
                {ing.qty && (
                  <span className="text-xs text-charcoal-light font-heading">
                    {ing.qty} {ing.unit}
                  </span>
                )}
              </li>
            ))}
          </ul>
        </div>

        {/* Steps */}
        <div className="bg-white rounded-2xl p-5 shadow-[0_4px_12px_rgba(199,91,60,0.08)] mt-4">
          <h2 className="font-heading font-bold text-sm mb-3">
            {lang === 'es' ? 'Preparación' : 'Instructions'}
          </h2>
          <ol className="space-y-4">
            {recipe.steps[lang].map((step, i) => (
              <li key={i} className="flex gap-3">
                <span className="w-7 h-7 rounded-full bg-terra text-white flex items-center justify-center text-xs font-heading font-bold flex-shrink-0 mt-0.5">
                  {i + 1}
                </span>
                <p className="text-sm leading-relaxed">{step}</p>
              </li>
            ))}
          </ol>
        </div>

        {/* Freeze notes */}
        {recipe.freezable && recipe.freezeNotes && recipe.freezeNotes[lang] && (
          <div className="bg-forest/10 rounded-2xl p-4 mt-4">
            <p className="text-sm text-forest">
              <span className="font-heading font-semibold">❄️ {lang === 'es' ? 'Congelación' : 'Freezing'}:</span>{' '}
              {recipe.freezeNotes[lang]}
            </p>
          </div>
        )}

        {/* Source attribution */}
        {recipe.source && (
          <div className="bg-cream-dark rounded-2xl p-4 mt-4">
            <p className="text-xs text-charcoal-light">
              <span className="font-heading font-semibold">📖 {lang === 'es' ? 'Fuente' : 'Source'}:</span>{' '}
              {recipe.source.name}
              {recipe.source.author && ` — ${recipe.source.author}`}
            </p>
            {recipe.source.url && (
              <p className="text-[10px] text-terra mt-1 truncate">{recipe.source.url}</p>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
