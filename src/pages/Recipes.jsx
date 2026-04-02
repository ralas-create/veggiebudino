import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { getAllRecipesWithCustom, getSiboRecipes, filterRecipes } from '../data/recipes'
import RecipeCard from '../components/recipes/RecipeCard'

const filterButtons = [
  { key: 'all', filter: {} },
  { key: 'quick', filter: { quick: true } },
  { key: 'fewIngredients', filter: { fewIngredients: true } },
  { key: 'batchCooking', filter: { batchCooking: true } },
  { key: 'siboFriendly', filter: { siboOnly: true } },
  { key: 'freezable', filter: { freezable: true } },
]

export default function Recipes() {
  const { t, i18n } = useTranslation()
  const navigate = useNavigate()
  const [activeFilter, setActiveFilter] = useState('all')
  const [search, setSearch] = useState('')

  const isSiboMode = localStorage.getItem('veggiebudino-sibo') === 'true'
  const allRecipes = isSiboMode ? getSiboRecipes() : getAllRecipesWithCustom()
  const currentFilterObj = filterButtons.find(f => f.key === activeFilter)?.filter || {}
  const finalFilter = {
    ...currentFilterObj,
    ...(search ? { search } : {}),
  }
  const recipes = filterRecipes(allRecipes, finalFilter)

  return (
    <div className="px-6 pt-6 pb-24">
      <div className="flex items-center justify-between">
        <h1 className="font-heading text-2xl font-bold">{t('recipes.title')}</h1>
        <button
          onClick={() => navigate('/recipes/new')}
          className="bg-terra text-white rounded-xl px-3 py-2 font-heading text-xs font-semibold active:scale-95 transition-transform"
        >
          + {i18n.language === 'es' ? 'Nueva' : 'New'}
        </button>
      </div>
      <p className="text-sm text-charcoal-light mt-1">{recipes.length} {i18n.language === 'es' ? 'recetas' : 'recipes'}</p>

      {/* Search */}
      <div className="mt-4">
        <input
          type="text"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder={t('recipes.search')}
          className="w-full bg-white border border-cream-dark rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-terra"
        />
      </div>

      {/* Filters */}
      <div className="flex gap-2 mt-4 overflow-x-auto pb-2 scrollbar-none">
        {filterButtons.map(({ key }) => (
          <button
            key={key}
            onClick={() => setActiveFilter(key)}
            className={`whitespace-nowrap px-4 py-2 rounded-full text-xs font-heading font-semibold transition-colors ${
              activeFilter === key
                ? 'bg-terra text-white'
                : 'bg-white border border-cream-dark text-charcoal-light'
            }`}
          >
            {t(`recipes.${key}`)}
          </button>
        ))}
      </div>

      {/* Recipe grid */}
      <div className="mt-5 grid grid-cols-1 gap-4">
        {recipes.map(recipe => (
          <RecipeCard key={recipe.id} recipe={recipe} />
        ))}
        {recipes.length === 0 && (
          <div className="bg-white rounded-2xl p-5 shadow-[0_4px_12px_rgba(199,91,60,0.08)] text-center">
            <p className="text-charcoal-light text-sm py-4">
              {i18n.language === 'es' ? 'No se encontraron recetas con esos filtros' : 'No recipes found with those filters'}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
