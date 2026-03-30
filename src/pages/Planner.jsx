import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import useWeekPlan from '../hooks/useWeekPlan'
import { getRecipeById } from '../data/recipes'
import { generateWeekPlan, getPlanStats } from '../utils/planGenerator'

const days = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun']

export default function Planner() {
  const { t, i18n } = useTranslation()
  const lang = i18n.language
  const navigate = useNavigate()
  const { plan, setMeal, clearPlan, applyGeneratedPlan } = useWeekPlan()
  const [cookingPlan, setCookingPlan] = useState(null)
  const [showStats, setShowStats] = useState(false)

  const hasPlan = Object.values(plan).some(d => d.lunch || d.dinner)

  const handleGenerate = () => {
    const siboOnly = localStorage.getItem('veggiebudino-sibo') === 'true'
    const result = generateWeekPlan({ siboOnly })
    applyGeneratedPlan(result.plan)
    setCookingPlan(result.cookingPlan)
    setShowStats(true)
  }

  const handleClear = () => {
    clearPlan()
    setCookingPlan(null)
    setShowStats(false)
  }

  const stats = hasPlan ? getPlanStats(plan) : null

  return (
    <div className="px-6 pt-6 pb-24">
      <h1 className="font-heading text-2xl font-bold">{t('planner.title')}</h1>

      {/* Generate button */}
      <button
        onClick={handleGenerate}
        className="w-full mt-4 bg-terra text-white rounded-2xl py-4 font-heading font-bold text-sm active:scale-[0.98] transition-transform shadow-[0_4px_12px_rgba(199,91,60,0.25)]"
      >
        ✨ {lang === 'es' ? 'Generar plan semanal inteligente' : 'Generate smart weekly plan'}
      </button>
      <p className="text-[10px] text-charcoal-light text-center mt-2">
        {lang === 'es'
          ? 'Selecciona 4-5 recetas, las reparte por la semana optimizando para batch cooking'
          : 'Picks 4-5 recipes, distributes them across the week optimized for batch cooking'}
      </p>

      {/* Stats summary */}
      {showStats && stats && (
        <div className="mt-4 bg-white rounded-2xl p-4 shadow-[0_4px_12px_rgba(199,91,60,0.08)]">
          <h3 className="font-heading font-bold text-sm mb-2">
            {lang === 'es' ? '📊 Resumen del plan' : '📊 Plan summary'}
          </h3>
          <div className="grid grid-cols-3 gap-2 text-center">
            <div className="bg-cream rounded-lg py-2">
              <p className="font-heading text-lg font-bold text-terra">{stats.uniqueRecipes}</p>
              <p className="text-[9px] text-charcoal-light">{lang === 'es' ? 'platos a cocinar' : 'dishes to cook'}</p>
            </div>
            <div className="bg-cream rounded-lg py-2">
              <p className="font-heading text-lg font-bold text-terra">{stats.avgCaloriesPerDay}</p>
              <p className="text-[9px] text-charcoal-light">kcal/{lang === 'es' ? 'día' : 'day'}</p>
            </div>
            <div className="bg-cream rounded-lg py-2">
              <p className="font-heading text-lg font-bold text-terra">{stats.avgProteinPerDay}g</p>
              <p className="text-[9px] text-charcoal-light">{lang === 'es' ? 'proteína/día' : 'protein/day'}</p>
            </div>
          </div>
        </div>
      )}

      {/* Cooking plan (batch cooking summary) */}
      {cookingPlan && cookingPlan.length > 0 && (
        <div className="mt-4 bg-forest/10 rounded-2xl p-4">
          <h3 className="font-heading font-bold text-sm text-forest mb-2">
            🍳 {lang === 'es' ? 'Lo que tienes que cocinar (modo domingo)' : 'What you need to cook (Sunday mode)'}
          </h3>
          <p className="text-[10px] text-charcoal-light mb-3">
            {lang === 'es'
              ? 'Cocina estos platos en cantidad y repártelos por la semana'
              : 'Cook these dishes in bulk and spread them across the week'}
          </p>
          {cookingPlan.map((item, i) => (
            <div key={i} className="flex items-center gap-3 py-2 border-b border-forest/10 last:border-0">
              <span className="w-6 h-6 rounded-full bg-forest text-white flex items-center justify-center text-xs font-bold flex-shrink-0">
                {i + 1}
              </span>
              <div className="flex-1">
                <p className="text-sm font-heading font-semibold">{item.recipeName[lang]}</p>
                <p className="text-[10px] text-charcoal-light">
                  {item.cookingTime} min · {item.timesUsed}x {lang === 'es' ? 'esta semana' : 'this week'}
                  {item.freezable && ` · ❄️ ${lang === 'es' ? 'congelable' : 'freezable'}`}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Weekly grid */}
      <div className="mt-6 space-y-3">
        {days.map(day => {
          const lunchRecipe = plan[day]?.lunch ? getRecipeById(plan[day].lunch) : null
          const dinnerRecipe = plan[day]?.dinner ? getRecipeById(plan[day].dinner) : null

          return (
            <div key={day} className="bg-white rounded-2xl p-4 shadow-[0_4px_12px_rgba(199,91,60,0.08)]">
              <p className="font-heading text-xs font-semibold text-charcoal-light uppercase tracking-wide">
                {t(`days.${day}`)}
              </p>
              <div className="mt-2 space-y-2">
                {/* Lunch */}
                <div
                  className="flex items-center gap-3 border-l-4 border-terra rounded-lg p-3 bg-cream cursor-pointer active:scale-[0.98] transition-transform"
                  onClick={() => lunchRecipe && navigate(`/recipes/${lunchRecipe.id}`)}
                >
                  <span className="text-lg">🥗</span>
                  <div className="flex-1 min-w-0">
                    <p className="font-heading text-[10px] text-charcoal-light uppercase">{t('planner.lunch')}</p>
                    {lunchRecipe ? (
                      <>
                        <p className="text-sm font-heading font-semibold truncate">{lunchRecipe.name[lang]}</p>
                        <p className="text-[10px] text-charcoal-light">{lunchRecipe.time} min · {lunchRecipe.nutrition.calories} kcal</p>
                      </>
                    ) : (
                      <p className="text-sm text-charcoal-light">{t('home.emptySlot')}</p>
                    )}
                  </div>
                  {lunchRecipe?.siboFriendly && (
                    <span className="bg-khaki rounded-full px-2 py-0.5 text-[8px] font-heading font-semibold text-[#6B5A2A]">SIBO</span>
                  )}
                </div>
                {/* Dinner */}
                <div
                  className="flex items-center gap-3 border-l-4 border-forest rounded-lg p-3 bg-cream cursor-pointer active:scale-[0.98] transition-transform"
                  onClick={() => dinnerRecipe && navigate(`/recipes/${dinnerRecipe.id}`)}
                >
                  <span className="text-lg">🍽️</span>
                  <div className="flex-1 min-w-0">
                    <p className="font-heading text-[10px] text-charcoal-light uppercase">{t('planner.dinner')}</p>
                    {dinnerRecipe ? (
                      <>
                        <p className="text-sm font-heading font-semibold truncate">{dinnerRecipe.name[lang]}</p>
                        <p className="text-[10px] text-charcoal-light">{dinnerRecipe.time} min · {dinnerRecipe.nutrition.calories} kcal</p>
                      </>
                    ) : (
                      <p className="text-sm text-charcoal-light">{t('home.emptySlot')}</p>
                    )}
                  </div>
                  {dinnerRecipe?.siboFriendly && (
                    <span className="bg-khaki rounded-full px-2 py-0.5 text-[8px] font-heading font-semibold text-[#6B5A2A]">SIBO</span>
                  )}
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Action buttons */}
      {hasPlan && (
        <div className="mt-4 flex gap-3">
          <button
            onClick={() => navigate('/shopping')}
            className="flex-1 bg-forest text-white rounded-xl py-3 font-heading font-semibold text-sm"
          >
            🛒 {t('planner.generateList')}
          </button>
          <button
            onClick={handleClear}
            className="px-4 border border-cream-dark rounded-xl py-3 font-heading font-semibold text-sm text-charcoal-light"
          >
            {t('planner.clearWeek')}
          </button>
        </div>
      )}
    </div>
  )
}
