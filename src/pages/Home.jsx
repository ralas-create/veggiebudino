import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import allRecipes, { getRecipeById } from '../data/recipes'
import useWeekPlan from '../hooks/useWeekPlan'
import RecipeCard from '../components/recipes/RecipeCard'

export default function Home() {
  const { t, i18n } = useTranslation()
  const lang = i18n.language
  const navigate = useNavigate()
  const { plan } = useWeekPlan()

  const hasPlan = Object.values(plan).some(d => d.lunch || d.dinner)

  // Today's meals
  const dayNames = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat']
  const today = dayNames[new Date().getDay()]
  const todayLunch = plan[today]?.lunch ? getRecipeById(plan[today].lunch) : null
  const todayDinner = plan[today]?.dinner ? getRecipeById(plan[today].dinner) : null

  const quickRecipes = allRecipes.filter(r => r.time <= 20).slice(0, 3)
  const siboRecipes = allRecipes.filter(r => r.siboFriendly).slice(0, 3)

  return (
    <div className="px-6 pt-6 pb-24">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-charcoal-light">{t('home.greeting')} 👋</p>
          <h1 className="font-heading text-2xl font-bold mt-1">
            Veggie<span className="text-terra">Budino</span>
          </h1>
        </div>
        <button
          onClick={() => navigate('/settings')}
          className="w-10 h-10 rounded-full bg-white shadow-[0_2px_8px_rgba(199,91,60,0.08)] flex items-center justify-center text-lg"
        >
          ⚙️
        </button>
      </div>

      {/* Quick access */}
      <div className="grid grid-cols-4 gap-3 mt-6">
        {[
          { icon: '📖', label: t('nav.recipes'), path: '/recipes' },
          { icon: '📅', label: t('nav.planner'), path: '/planner' },
          { icon: '🛒', label: t('nav.shopping'), path: '/shopping' },
          { icon: '🍳', label: t('nav.cooking'), path: '/cooking' },
        ].map(({ icon, label, path }) => (
          <button
            key={path}
            onClick={() => navigate(path)}
            className="bg-white rounded-2xl py-4 flex flex-col items-center gap-2 shadow-[0_4px_12px_rgba(199,91,60,0.08)] active:scale-95 transition-transform"
          >
            <span className="text-2xl">{icon}</span>
            <span className="text-[10px] font-heading font-semibold text-charcoal-light">{label}</span>
          </button>
        ))}
      </div>

      {/* Today's plan */}
      {hasPlan && (
        <section className="mt-8">
          <div className="flex items-center justify-between">
            <h2 className="font-heading text-lg font-bold">
              📅 {lang === 'es' ? 'Hoy' : 'Today'}
            </h2>
            <button onClick={() => navigate('/planner')} className="text-xs text-terra font-heading font-semibold">
              {lang === 'es' ? 'Ver semana →' : 'View week →'}
            </button>
          </div>
          <div className="mt-3 space-y-2">
            {todayLunch && (
              <div
                onClick={() => navigate(`/recipes/${todayLunch.id}`)}
                className="bg-white rounded-2xl p-4 shadow-[0_4px_12px_rgba(199,91,60,0.08)] flex items-center gap-3 border-l-4 border-terra cursor-pointer active:scale-[0.98] transition-transform"
              >
                <span className="text-2xl">🥗</span>
                <div className="flex-1 min-w-0">
                  <p className="font-heading text-[10px] text-charcoal-light uppercase">{t('home.lunch')}</p>
                  <p className="font-heading font-semibold text-sm truncate">{todayLunch.name[lang]}</p>
                  <p className="text-[10px] text-charcoal-light">{todayLunch.time} min · {todayLunch.nutrition.calories} kcal</p>
                </div>
              </div>
            )}
            {todayDinner && (
              <div
                onClick={() => navigate(`/recipes/${todayDinner.id}`)}
                className="bg-white rounded-2xl p-4 shadow-[0_4px_12px_rgba(199,91,60,0.08)] flex items-center gap-3 border-l-4 border-forest cursor-pointer active:scale-[0.98] transition-transform"
              >
                <span className="text-2xl">🍽️</span>
                <div className="flex-1 min-w-0">
                  <p className="font-heading text-[10px] text-charcoal-light uppercase">{t('home.dinner')}</p>
                  <p className="font-heading font-semibold text-sm truncate">{todayDinner.name[lang]}</p>
                  <p className="text-[10px] text-charcoal-light">{todayDinner.time} min · {todayDinner.nutrition.calories} kcal</p>
                </div>
              </div>
            )}
            {!todayLunch && !todayDinner && (
              <div className="bg-white rounded-2xl p-4 shadow-[0_4px_12px_rgba(199,91,60,0.08)] text-center">
                <p className="text-charcoal-light text-sm py-2">{lang === 'es' ? 'Hoy no tienes plan' : "No plan for today"}</p>
              </div>
            )}
          </div>
        </section>
      )}

      {/* No plan yet */}
      {!hasPlan && (
        <section className="mt-8">
          <h2 className="font-heading text-lg font-bold flex items-center gap-2">
            📅 {t('home.yourWeek')}
          </h2>
          <div className="mt-3 bg-white rounded-2xl p-5 shadow-[0_4px_12px_rgba(199,91,60,0.08)] text-center">
            <p className="text-charcoal-light text-sm py-2">{t('home.emptySlot')}</p>
            <button
              onClick={() => navigate('/planner')}
              className="mt-2 bg-terra text-white rounded-xl px-6 py-2.5 font-heading font-semibold text-sm"
            >
              ✨ {lang === 'es' ? 'Generar plan semanal' : 'Generate weekly plan'}
            </button>
          </div>
        </section>
      )}

      {/* Quick recipes */}
      <section className="mt-8">
        <div className="flex items-center justify-between">
          <h2 className="font-heading text-lg font-bold">⚡ {t('recipes.quick')}</h2>
          <button onClick={() => navigate('/recipes')} className="text-xs text-terra font-heading font-semibold">
            {lang === 'es' ? 'Ver todas →' : 'See all →'}
          </button>
        </div>
        <div className="mt-3 grid grid-cols-1 gap-4">
          {quickRecipes.map(recipe => (
            <RecipeCard key={recipe.id} recipe={recipe} />
          ))}
        </div>
      </section>

      {/* SIBO recipes */}
      <section className="mt-8">
        <div className="flex items-center justify-between">
          <h2 className="font-heading text-lg font-bold">🌿 SIBO-friendly</h2>
          <button onClick={() => navigate('/recipes')} className="text-xs text-terra font-heading font-semibold">
            {lang === 'es' ? 'Ver todas →' : 'See all →'}
          </button>
        </div>
        <div className="mt-3 grid grid-cols-1 gap-4">
          {siboRecipes.map(recipe => (
            <RecipeCard key={recipe.id} recipe={recipe} />
          ))}
        </div>
      </section>
    </div>
  )
}
