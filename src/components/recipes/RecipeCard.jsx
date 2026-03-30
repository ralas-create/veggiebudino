import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { getIngredientCount } from '../../data/recipes'
import { getRecipeImage } from '../../data/recipeImages'

export default function RecipeCard({ recipe }) {
  const { t, i18n } = useTranslation()
  const navigate = useNavigate()
  const lang = i18n.language

  const ingredientCount = getIngredientCount(recipe)
  const image = getRecipeImage(recipe.id)

  return (
    <div
      onClick={() => navigate(`/recipes/${recipe.id}`)}
      className="bg-white rounded-2xl overflow-hidden shadow-[0_4px_12px_rgba(199,91,60,0.08)] cursor-pointer active:scale-[0.98] transition-transform"
    >
      {/* Image or gradient header */}
      <div className="h-36 bg-gradient-to-br from-terra to-terra-light flex items-center justify-center text-5xl relative overflow-hidden">
        {image ? (
          <img src={image} alt={recipe.name[lang]} className="w-full h-full object-cover" loading="lazy" />
        ) : (
          <span>🌱</span>
        )}

        {/* Time badge */}
        <span className="absolute top-3 left-3 bg-white/95 rounded-full px-2.5 py-1 text-[11px] font-heading font-semibold text-terra">
          ⏱ {recipe.time} min
        </span>

        {/* SIBO badge */}
        {recipe.siboFriendly && (
          <span className="absolute top-3 right-3 bg-khaki rounded-full px-2.5 py-1 text-[10px] font-heading font-semibold text-[#6B5A2A]">
            SIBO ✓
          </span>
        )}

        {/* Freezable badge */}
        {recipe.freezable && (
          <span className="absolute bottom-3 right-3 bg-forest/90 rounded-full px-2.5 py-1 text-[10px] font-heading font-semibold text-white">
            ❄️ {t('recipes.freezable')}
          </span>
        )}
      </div>

      {/* Body */}
      <div className="p-4">
        <h3 className="font-heading font-bold text-[15px] leading-tight">
          {recipe.name[lang]}
        </h3>
        <p className="text-xs text-charcoal-light mt-1 line-clamp-2 font-accent italic">
          {recipe.description[lang]}
        </p>

        {/* Tags */}
        <div className="flex gap-1.5 mt-3 flex-wrap">
          {recipe.time <= 30 && (
            <span className="bg-forest/10 text-forest rounded-full px-2.5 py-0.5 text-[10px] font-heading font-medium">
              {t('recipes.quick')}
            </span>
          )}
          {ingredientCount <= 7 && (
            <span className="bg-khaki/30 text-[#6B5A2A] rounded-full px-2.5 py-0.5 text-[10px] font-heading font-medium">
              {ingredientCount} ingr.
            </span>
          )}
          {recipe.tags.includes('batch-cooking') && (
            <span className="bg-terra/10 text-terra rounded-full px-2.5 py-0.5 text-[10px] font-heading font-medium">
              Batch cooking
            </span>
          )}
          {recipe.tags.includes('high-protein') && (
            <span className="bg-forest/10 text-forest rounded-full px-2.5 py-0.5 text-[10px] font-heading font-medium">
              {lang === 'es' ? 'Alta en proteína' : 'High protein'}
            </span>
          )}
        </div>

        {/* Source */}
        {recipe.source && (
          <p className="text-[9px] text-charcoal-light mt-2 truncate">
            📖 {recipe.source.name}
          </p>
        )}

        {/* Nutrition bar */}
        <div className="flex justify-between mt-3 pt-3 border-t border-cream-dark">
          <div className="text-center">
            <p className="font-heading text-sm font-bold text-terra">{recipe.nutrition.calories}</p>
            <p className="text-[9px] text-charcoal-light">{t('nutrition.calories')}</p>
          </div>
          <div className="text-center">
            <p className="font-heading text-sm font-bold text-terra">{recipe.nutrition.protein}g</p>
            <p className="text-[9px] text-charcoal-light">{t('nutrition.protein')}</p>
          </div>
          <div className="text-center">
            <p className="font-heading text-sm font-bold text-terra">{recipe.nutrition.fiber}g</p>
            <p className="text-[9px] text-charcoal-light">{t('nutrition.fiber')}</p>
          </div>
          <div className="text-center">
            <p className="font-heading text-sm font-bold text-terra">{recipe.nutrition.iron}mg</p>
            <p className="text-[9px] text-charcoal-light">{t('nutrition.iron')}</p>
          </div>
        </div>
      </div>
    </div>
  )
}
