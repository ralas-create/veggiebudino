import { useState, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import useWeekPlan from '../hooks/useWeekPlan'
import { getRecipeById } from '../data/recipes'

export default function CookingMode() {
  const { t, i18n } = useTranslation()
  const lang = i18n.language
  const navigate = useNavigate()
  const { plan } = useWeekPlan()
  const [completed, setCompleted] = useState(new Set())

  // Figure out what to cook — unique recipes with their frequency
  const cookingTasks = useMemo(() => {
    const recipeCount = new Map()
    const days = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun']
    const dayNames = { mon: 'Lunes', tue: 'Martes', wed: 'Miércoles', thu: 'Jueves', fri: 'Viernes', sat: 'Sábado', sun: 'Domingo' }
    const dayNamesEn = { mon: 'Monday', tue: 'Tuesday', wed: 'Wednesday', thu: 'Thursday', fri: 'Friday', sat: 'Saturday', sun: 'Sunday' }

    days.forEach(day => {
      ;['lunch', 'dinner'].forEach(meal => {
        const id = plan[day]?.[meal]
        if (id) {
          if (!recipeCount.has(id)) {
            recipeCount.set(id, { recipe: getRecipeById(id), appearances: [] })
          }
          recipeCount.get(id).appearances.push({
            day: lang === 'es' ? dayNames[day] : dayNamesEn[day],
            meal: lang === 'es' ? (meal === 'lunch' ? 'Comida' : 'Cena') : (meal === 'lunch' ? 'Lunch' : 'Dinner')
          })
        }
      })
    })

    const tasks = []
    recipeCount.forEach(({ recipe, appearances }) => {
      if (recipe) {
        tasks.push({ recipe, appearances, count: appearances.length })
      }
    })

    // Sort by cooking time descending (longest first)
    tasks.sort((a, b) => b.recipe.time - a.recipe.time)
    return tasks
  }, [plan, lang])

  const totalTasks = cookingTasks.length
  const completedCount = completed.size
  const allDone = totalTasks > 0 && completedCount === totalTasks

  const toggleCompleted = (id) => {
    setCompleted(prev => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  if (cookingTasks.length === 0) {
    return (
      <div className="px-6 pt-6 pb-24">
        <h1 className="font-heading text-2xl font-bold">{t('cooking.title')}</h1>
        <p className="text-charcoal-light text-sm mt-1">{t('cooking.subtitle')}</p>
        <div className="mt-6 bg-white rounded-2xl p-5 shadow-[0_4px_12px_rgba(199,91,60,0.08)]">
          <p className="text-charcoal-light text-sm text-center py-8">
            🍳 {t('cooking.noPlan')}
          </p>
          <button
            onClick={() => navigate('/planner')}
            className="w-full bg-terra text-white rounded-xl py-3 font-heading font-semibold text-sm mt-2"
          >
            📅 {lang === 'es' ? 'Ir al planificador' : 'Go to planner'}
          </button>
        </div>
      </div>
    )
  }

  const totalCookingTime = cookingTasks.reduce((sum, t) => sum + t.recipe.time, 0)

  return (
    <div className="px-6 pt-6 pb-24">
      <h1 className="font-heading text-2xl font-bold">{t('cooking.title')}</h1>
      <p className="text-charcoal-light text-sm mt-1">{t('cooking.subtitle')}</p>

      {/* Summary */}
      <div className="mt-4 bg-white rounded-2xl p-4 shadow-[0_4px_12px_rgba(199,91,60,0.08)]">
        <div className="flex justify-between items-center">
          <div>
            <p className="font-heading font-bold text-sm">
              {totalTasks} {lang === 'es' ? 'platos que cocinar' : 'dishes to cook'}
            </p>
            <p className="text-xs text-charcoal-light">
              ~{totalCookingTime} min {lang === 'es' ? 'en total' : 'total'}
              {completedCount > 0 && ` · ${completedCount}/${totalTasks} ✓`}
            </p>
          </div>
          {allDone && (
            <span className="bg-forest text-white rounded-full px-3 py-1 text-xs font-heading font-bold">
              {t('cooking.done')} 🎉
            </span>
          )}
        </div>

        {/* Progress bar */}
        <div className="mt-3 h-2 bg-cream-dark rounded-full overflow-hidden">
          <div
            className="h-full bg-forest rounded-full transition-all duration-500"
            style={{ width: `${totalTasks > 0 ? (completedCount / totalTasks) * 100 : 0}%` }}
          />
        </div>
      </div>

      <p className="text-[10px] text-charcoal-light mt-3 px-1">
        💡 {lang === 'es'
          ? 'Empieza por el plato que más tarde. Mientras se cocina, prepara los más rápidos.'
          : 'Start with the longest dish. While it cooks, prepare the quicker ones.'}
      </p>

      {/* Cooking tasks */}
      <div className="mt-4 space-y-3">
        {cookingTasks.map((task, i) => {
          const isDone = completed.has(task.recipe.id)
          return (
            <div
              key={task.recipe.id}
              className={`bg-white rounded-2xl p-4 shadow-[0_4px_12px_rgba(199,91,60,0.08)] transition-opacity ${isDone ? 'opacity-50' : ''}`}
            >
              <div className="flex items-start gap-3">
                <button
                  onClick={() => toggleCompleted(task.recipe.id)}
                  className={`w-7 h-7 rounded-lg border-2 flex items-center justify-center flex-shrink-0 mt-0.5 ${
                    isDone ? 'bg-forest border-forest text-white' : 'border-terra'
                  }`}
                >
                  {isDone && <span className="text-sm">✓</span>}
                </button>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-terra text-white flex items-center justify-center text-[10px] font-bold">
                      {i + 1}
                    </span>
                    <h3 className={`font-heading font-bold text-sm ${isDone ? 'line-through' : ''}`}>
                      {task.recipe.name[lang]}
                    </h3>
                  </div>
                  <p className="text-[10px] text-charcoal-light mt-1">
                    ⏱ {task.recipe.time} min · {task.count}x {lang === 'es' ? 'esta semana' : 'this week'}
                  </p>

                  {/* When it's eaten */}
                  <div className="flex flex-wrap gap-1 mt-2">
                    {task.appearances.map((app, j) => (
                      <span key={j} className="bg-cream rounded-md px-2 py-0.5 text-[9px] text-charcoal-light font-heading">
                        {app.day} — {app.meal}
                      </span>
                    ))}
                  </div>

                  {/* Freeze info */}
                  {task.recipe.freezable && task.recipe.freezeNotes[lang] && (
                    <p className="text-[10px] text-forest mt-2">
                      ❄️ {task.recipe.freezeNotes[lang]}
                    </p>
                  )}

                  {/* Quick link to recipe */}
                  <button
                    onClick={() => navigate(`/recipes/${task.recipe.id}`)}
                    className="text-[10px] text-terra font-heading font-semibold mt-2"
                  >
                    {lang === 'es' ? 'Ver receta completa →' : 'See full recipe →'}
                  </button>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
