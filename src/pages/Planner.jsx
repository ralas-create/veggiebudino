import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import useWeekPlan from '../hooks/useWeekPlan'
import usePantry from '../hooks/usePantry'
import { getRecipeById } from '../data/recipes'
import { generateWeekPlan, getPlanStats, siboBreakfastOptions, siboSnackOptions } from '../utils/planGenerator'
import { commonIngredients } from '../utils/pantryMatcher'

const days = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun']

export default function Planner() {
  const { t, i18n } = useTranslation()
  const lang = i18n.language
  const navigate = useNavigate()
  const { plan, setMeal, clearPlan, applyGeneratedPlan } = useWeekPlan()
  const { items: pantryItems, addItem, removeItem, clearAll: clearPantry } = usePantry()
  const [cookingPlan, setCookingPlan] = useState(null)
  const [showStats, setShowStats] = useState(false)
  const [showPantry, setShowPantry] = useState(false)
  const [pantryInput, setPantryInput] = useState('')

  const isSiboMode = localStorage.getItem('veggiebudino-sibo') === 'true'
  const hasPlan = Object.values(plan).some(d => d.lunch || d.dinner)

  const handleGenerate = () => {
    const result = generateWeekPlan({ siboOnly: isSiboMode, pantryItems })
    applyGeneratedPlan(result.plan)
    setCookingPlan(result.cookingPlan)
    setShowStats(true)
  }

  const handleAddPantryItem = () => {
    if (pantryInput.trim()) {
      addItem(pantryInput.trim())
      setPantryInput('')
    }
  }

  const suggestions = (commonIngredients[lang] || commonIngredients.es)
    .filter(s => !pantryItems.some(p => p.toLowerCase() === s.toLowerCase()))

  const handleClear = () => {
    clearPlan()
    setCookingPlan(null)
    setShowStats(false)
  }

  const stats = hasPlan ? getPlanStats(plan) : null

  // Helper to get breakfast/snack name
  const getBfName = (id) => {
    const bf = siboBreakfastOptions.find(b => b.id === id)
    return bf ? bf.name[lang] : ''
  }
  const getSnName = (id) => {
    const sn = siboSnackOptions.find(s => s.id === id)
    return sn ? sn.name[lang] : ''
  }

  return (
    <div className="px-6 pt-6 pb-24">
      <h1 className="font-heading text-2xl font-bold">{t('planner.title')}</h1>
      {isSiboMode && (
        <p className="text-xs text-khaki bg-khaki/20 rounded-lg px-3 py-1.5 mt-2 font-heading font-semibold inline-block">
          🌿 SIBO Fede — 5 {lang === 'es' ? 'comidas/día' : 'meals/day'}
        </p>
      )}

      {/* Pantry section */}
      <div className="mt-4">
        <button
          onClick={() => setShowPantry(!showPantry)}
          className="w-full bg-white rounded-2xl p-4 shadow-[0_4px_12px_rgba(199,91,60,0.08)] flex items-center justify-between active:scale-[0.98] transition-transform"
        >
          <div className="flex items-center gap-2">
            <span className="text-lg">🧊</span>
            <div className="text-left">
              <p className="font-heading font-semibold text-sm">
                {lang === 'es' ? 'Tengo en casa...' : 'I have at home...'}
              </p>
              <p className="text-[10px] text-charcoal-light">
                {pantryItems.length > 0
                  ? `${pantryItems.length} ${lang === 'es' ? 'ingredientes' : 'ingredients'}: ${pantryItems.slice(0, 3).join(', ')}${pantryItems.length > 3 ? '...' : ''}`
                  : (lang === 'es' ? 'Añade ingredientes para que el plan los use' : 'Add ingredients so the plan uses them')
                }
              </p>
            </div>
          </div>
          <span className={`text-charcoal-light text-xs transition-transform ${showPantry ? 'rotate-180' : ''}`}>▼</span>
        </button>

        {showPantry && (
          <div className="mt-2 bg-white rounded-2xl p-4 shadow-[0_4px_12px_rgba(199,91,60,0.08)]">
            {/* Input */}
            <div className="flex gap-2">
              <input
                value={pantryInput}
                onChange={e => setPantryInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleAddPantryItem()}
                placeholder={lang === 'es' ? 'Escribe un ingrediente...' : 'Type an ingredient...'}
                className="flex-1 bg-cream border border-cream-dark rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-terra"
              />
              <button
                onClick={handleAddPantryItem}
                className="bg-terra text-white px-4 py-2 rounded-xl font-heading text-xs font-semibold"
              >
                +
              </button>
            </div>

            {/* Quick-add suggestions */}
            <div className="flex flex-wrap gap-1.5 mt-3">
              {suggestions.slice(0, 12).map(s => (
                <button
                  key={s}
                  onClick={() => addItem(s)}
                  className="text-[10px] px-2.5 py-1 rounded-full bg-cream border border-cream-dark text-charcoal-light active:bg-terra active:text-white transition-colors"
                >
                  + {s}
                </button>
              ))}
            </div>

            {/* Current pantry items */}
            {pantryItems.length > 0 && (
              <div className="mt-3 pt-3 border-t border-cream-dark">
                <div className="flex items-center justify-between mb-2">
                  <p className="font-heading text-xs font-semibold text-charcoal-light">
                    {lang === 'es' ? 'En mi despensa/nevera:' : 'In my pantry/fridge:'}
                  </p>
                  <button onClick={clearPantry} className="text-[10px] text-terra font-heading font-semibold">
                    {lang === 'es' ? 'Limpiar' : 'Clear'}
                  </button>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {pantryItems.map(item => (
                    <span
                      key={item}
                      className="text-[11px] px-2.5 py-1 rounded-full bg-forest/10 text-forest font-heading font-medium flex items-center gap-1"
                    >
                      {item}
                      <button onClick={() => removeItem(item)} className="text-forest/50 hover:text-forest ml-0.5">✕</button>
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Generate button */}
      <button
        onClick={handleGenerate}
        className="w-full mt-4 bg-terra text-white rounded-2xl py-4 font-heading font-bold text-sm active:scale-[0.98] transition-transform shadow-[0_4px_12px_rgba(199,91,60,0.25)]"
      >
        ✨ {lang === 'es' ? 'Generar plan semanal inteligente' : 'Generate smart weekly plan'}
      </button>
      <p className="text-[10px] text-charcoal-light text-center mt-2">
        {isSiboMode
          ? (lang === 'es'
            ? 'Desayuno + tentempié + comida + merienda + cena — según protocolo Dra. Ciccantelli'
            : 'Breakfast + snack + lunch + snack + dinner — per Dr. Ciccantelli protocol')
          : (lang === 'es'
            ? 'Selecciona 4-5 recetas, las reparte por la semana optimizando para batch cooking'
            : 'Picks 4-5 recipes, distributes them across the week optimized for batch cooking')
        }
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
          {stats.targetCalories && (
            <p className="text-[10px] text-center mt-2 text-forest font-heading">
              🎯 {lang === 'es' ? `Objetivo: ${stats.targetCalories} kcal/día (Dra. Ciccantelli)` : `Target: ${stats.targetCalories} kcal/day (Dr. Ciccantelli)`}
            </p>
          )}
        </div>
      )}

      {/* Cooking plan */}
      {cookingPlan && cookingPlan.length > 0 && (
        <div className="mt-4 bg-forest/10 rounded-2xl p-4">
          <h3 className="font-heading font-bold text-sm text-forest mb-2">
            🍳 {lang === 'es' ? 'Lo que tienes que cocinar' : 'What you need to cook'}
          </h3>
          {cookingPlan.map((item, i) => (
            <div key={i} className="flex items-center gap-3 py-2 border-b border-forest/10 last:border-0">
              <span className="w-6 h-6 rounded-full bg-forest text-white flex items-center justify-center text-xs font-bold flex-shrink-0">{i + 1}</span>
              <div className="flex-1">
                <p className="text-sm font-heading font-semibold">{item.recipeName[lang]}</p>
                <p className="text-[10px] text-charcoal-light">
                  {item.cookingTime} min · {item.timesUsed}x {lang === 'es' ? 'esta semana' : 'this week'}
                  {item.freezable && ` · ❄️`}
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
          const hasBf = isSiboMode && plan[day]?.breakfast

          return (
            <div key={day} className="bg-white rounded-2xl p-4 shadow-[0_4px_12px_rgba(199,91,60,0.08)]">
              <p className="font-heading text-xs font-semibold text-charcoal-light uppercase tracking-wide">
                {t(`days.${day}`)}
              </p>
              <div className="mt-2 space-y-2">

                {/* Breakfast (SIBO only) */}
                {isSiboMode && (
                  <div className="flex items-center gap-3 border-l-4 border-khaki rounded-lg p-2.5 bg-cream">
                    <span className="text-base">☀️</span>
                    <div className="flex-1 min-w-0">
                      <p className="font-heading text-[9px] text-charcoal-light uppercase">{lang === 'es' ? 'Desayuno' : 'Breakfast'}</p>
                      <p className="text-xs font-heading font-semibold truncate">
                        {hasBf ? getBfName(plan[day].breakfast) : (lang === 'es' ? 'Toca para añadir' : 'Tap to add')}
                      </p>
                    </div>
                  </div>
                )}

                {/* Snack 1 (SIBO only) */}
                {isSiboMode && (
                  <div className="flex items-center gap-3 border-l-4 border-khaki/50 rounded-lg p-2.5 bg-cream">
                    <span className="text-base">🍎</span>
                    <div className="flex-1 min-w-0">
                      <p className="font-heading text-[9px] text-charcoal-light uppercase">{lang === 'es' ? 'Tentempié' : 'Snack'}</p>
                      <p className="text-xs font-heading font-semibold truncate">
                        {plan[day]?.snack1 ? getSnName(plan[day].snack1) : '—'}
                      </p>
                    </div>
                  </div>
                )}

                {/* Lunch */}
                <div
                  className="flex items-center gap-3 border-l-4 border-terra rounded-lg p-2.5 bg-cream cursor-pointer active:scale-[0.98] transition-transform"
                  onClick={() => lunchRecipe && navigate(`/recipes/${lunchRecipe.id}`)}
                >
                  <span className="text-base">🥗</span>
                  <div className="flex-1 min-w-0">
                    <p className="font-heading text-[9px] text-charcoal-light uppercase">{t('planner.lunch')}</p>
                    {lunchRecipe ? (
                      <>
                        <p className="text-xs font-heading font-semibold truncate">{lunchRecipe.name[lang]}</p>
                        <p className="text-[9px] text-charcoal-light">{lunchRecipe.time} min · {lunchRecipe.nutrition.calories} kcal</p>
                      </>
                    ) : (
                      <p className="text-xs text-charcoal-light">{t('home.emptySlot')}</p>
                    )}
                  </div>
                </div>

                {/* Snack 2 (SIBO only) */}
                {isSiboMode && (
                  <div className="flex items-center gap-3 border-l-4 border-khaki/50 rounded-lg p-2.5 bg-cream">
                    <span className="text-base">🍫</span>
                    <div className="flex-1 min-w-0">
                      <p className="font-heading text-[9px] text-charcoal-light uppercase">{lang === 'es' ? 'Merienda' : 'Snack'}</p>
                      <p className="text-xs font-heading font-semibold truncate">
                        {plan[day]?.snack2 ? getSnName(plan[day].snack2) : '—'}
                      </p>
                    </div>
                  </div>
                )}

                {/* Dinner */}
                <div
                  className="flex items-center gap-3 border-l-4 border-forest rounded-lg p-2.5 bg-cream cursor-pointer active:scale-[0.98] transition-transform"
                  onClick={() => dinnerRecipe && navigate(`/recipes/${dinnerRecipe.id}`)}
                >
                  <span className="text-base">🍽️</span>
                  <div className="flex-1 min-w-0">
                    <p className="font-heading text-[9px] text-charcoal-light uppercase">{t('planner.dinner')}</p>
                    {dinnerRecipe ? (
                      <>
                        <p className="text-xs font-heading font-semibold truncate">{dinnerRecipe.name[lang]}</p>
                        <p className="text-[9px] text-charcoal-light">{dinnerRecipe.time} min · {dinnerRecipe.nutrition.calories} kcal</p>
                      </>
                    ) : (
                      <p className="text-xs text-charcoal-light">{t('home.emptySlot')}</p>
                    )}
                  </div>
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

      {/* SIBO guide link */}
      {isSiboMode && (
        <button
          onClick={() => navigate('/sibo-guide')}
          className="w-full mt-4 bg-khaki/20 rounded-xl py-3 font-heading text-xs font-semibold text-[#6B5A2A]"
        >
          📋 {lang === 'es' ? 'Consultar guía de la nutricionista' : 'View nutritionist guide'}
        </button>
      )}
    </div>
  )
}
