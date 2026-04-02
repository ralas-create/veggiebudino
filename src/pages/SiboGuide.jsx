import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { allowedFoods, forbiddenFoods, portionRules, nutriRecipes, mealPlanTemplate } from '../data/siboRules'

const Section = ({ title, children, defaultOpen = false }) => {
  const [open, setOpen] = useState(defaultOpen)
  return (
    <div className="bg-white rounded-2xl shadow-[0_4px_12px_rgba(199,91,60,0.08)] overflow-hidden">
      <button onClick={() => setOpen(!open)} className="w-full p-4 flex items-center justify-between">
        <h3 className="font-heading font-bold text-sm text-left">{title}</h3>
        <span className={`text-charcoal-light text-xs transition-transform ${open ? 'rotate-180' : ''}`}>▼</span>
      </button>
      {open && <div className="px-4 pb-4">{children}</div>}
    </div>
  )
}

const FoodList = ({ items, color = 'forest' }) => (
  <div className="flex flex-wrap gap-1.5">
    {items.map((item, i) => (
      <span key={i} className={`text-[10px] px-2 py-1 rounded-full ${
        color === 'forest' ? 'bg-forest/10 text-forest' : 'bg-terra/10 text-terra'
      }`}>{item}</span>
    ))}
  </div>
)

export default function SiboGuide() {
  const { i18n } = useTranslation()
  const lang = i18n.language
  const navigate = useNavigate()
  const rules = portionRules[lang] || portionRules.es
  const recipes = nutriRecipes[lang] || nutriRecipes.es
  const meal = mealPlanTemplate[lang] || mealPlanTemplate.es

  return (
    <div className="px-6 pt-6 pb-24">
      <div className="flex items-center gap-3 mb-2">
        <button onClick={() => navigate(-1)} className="text-terra font-heading font-semibold text-sm">←</button>
        <h1 className="font-heading text-xl font-bold">
          {lang === 'es' ? 'Guía SIBO / Low-FODMAP' : 'SIBO / Low-FODMAP Guide'}
        </h1>
      </div>
      <p className="text-[10px] text-charcoal-light mb-4">
        Dr.ssa Barbara Ciccantelli — Plant Based Clinic — {lang === 'es' ? 'Actualizado Feb 2026' : 'Updated Feb 2026'}
      </p>

      <div className="space-y-3">

        {/* Allowed foods */}
        <Section title={`✅ ${lang === 'es' ? 'Alimentos permitidos' : 'Allowed foods'}`} defaultOpen={true}>
          <div className="space-y-3">
            <div>
              <p className="text-xs font-heading font-semibold text-charcoal-light mb-1">🍎 {lang === 'es' ? 'Frutas (max 2 porciones/día, 125g c/u)' : 'Fruits (max 2 portions/day, 125g each)'}</p>
              <FoodList items={allowedFoods.fruits} />
            </div>
            <div>
              <p className="text-xs font-heading font-semibold text-charcoal-light mb-1">🥬 {lang === 'es' ? 'Verduras y hortalizas' : 'Vegetables'}</p>
              <FoodList items={allowedFoods.vegetables} />
            </div>
            <div>
              <p className="text-xs font-heading font-semibold text-charcoal-light mb-1">🌾 {lang === 'es' ? 'Cereales (sin gluten preferible)' : 'Grains (gluten-free preferred)'}</p>
              <FoodList items={allowedFoods.grains} />
            </div>
            <div>
              <p className="text-xs font-heading font-semibold text-charcoal-light mb-1">🫘 {lang === 'es' ? 'Proteínas' : 'Proteins'}</p>
              <FoodList items={allowedFoods.proteins} />
            </div>
            <div>
              <p className="text-xs font-heading font-semibold text-charcoal-light mb-1">🥜 {lang === 'es' ? 'Frutos secos y semillas (20g/día)' : 'Nuts and seeds (20g/day)'}</p>
              <FoodList items={allowedFoods.nutsSeeds} />
            </div>
            <div>
              <p className="text-xs font-heading font-semibold text-charcoal-light mb-1">🥛 {lang === 'es' ? 'Bebidas' : 'Drinks'}</p>
              <FoodList items={allowedFoods.drinks} />
            </div>
          </div>
        </Section>

        {/* Forbidden foods */}
        <Section title={`🚫 ${lang === 'es' ? 'Alimentos a evitar / alto en fructosa' : 'Foods to avoid / high fructose'}`}>
          <div className="space-y-3">
            <div>
              <p className="text-xs font-heading font-semibold text-charcoal-light mb-1">🍎 {lang === 'es' ? 'Frutas prohibidas' : 'Forbidden fruits'}</p>
              <FoodList items={forbiddenFoods.fruits} color="terra" />
            </div>
            <div>
              <p className="text-xs font-heading font-semibold text-charcoal-light mb-1">🥬 {lang === 'es' ? 'Verduras a evitar' : 'Vegetables to avoid'}</p>
              <FoodList items={forbiddenFoods.vegetables} color="terra" />
            </div>
            <div>
              <p className="text-xs font-heading font-semibold text-charcoal-light mb-1">🌾 {lang === 'es' ? 'Cereales a evitar' : 'Grains to avoid'}</p>
              <FoodList items={forbiddenFoods.grains} color="terra" />
            </div>
            <div>
              <p className="text-xs font-heading font-semibold text-charcoal-light mb-1">🥜 {lang === 'es' ? 'Frutos secos prohibidos' : 'Forbidden nuts'}</p>
              <FoodList items={forbiddenFoods.nutsSeeds} color="terra" />
            </div>
            <div>
              <p className="text-xs font-heading font-semibold text-charcoal-light mb-1">🍬 {lang === 'es' ? 'Edulcorantes prohibidos' : 'Forbidden sweeteners'}</p>
              <FoodList items={forbiddenFoods.sweeteners} color="terra" />
            </div>
            <div>
              <p className="text-xs font-heading font-semibold text-charcoal-light mb-1">🚫 {lang === 'es' ? 'General' : 'General'}</p>
              <FoodList items={forbiddenFoods.general} color="terra" />
            </div>
          </div>
        </Section>

        {/* Portion rules */}
        <Section title={`📏 ${lang === 'es' ? 'Porciones y reglas' : 'Portions and rules'}`}>
          <div className="space-y-2">
            {Object.entries(rules).map(([key, value]) => (
              <div key={key} className="py-2 border-b border-cream-dark last:border-0">
                <p className="text-xs font-heading font-semibold capitalize text-charcoal">{key === 'omega3' ? 'Omega-3' : key}</p>
                <p className="text-[11px] text-charcoal-light mt-0.5">{value}</p>
              </div>
            ))}
          </div>
        </Section>

        {/* Daily meal plan template */}
        <Section title={`🍽️ ${lang === 'es' ? 'Plan diario tipo' : 'Daily meal plan template'}`}>
          <div className="space-y-3">
            {/* Breakfast */}
            <div className="bg-cream rounded-xl p-3">
              <p className="font-heading font-bold text-xs">{meal.breakfast.title}</p>
              {meal.breakfast.options.map((opt, i) => (
                <p key={i} className="text-[11px] text-charcoal-light mt-1">• {opt}</p>
              ))}
            </div>
            {/* Snack 1 */}
            <div className="bg-cream rounded-xl p-3">
              <p className="font-heading font-bold text-xs">{meal.snack1.title}</p>
              {meal.snack1.options.map((opt, i) => (
                <p key={i} className="text-[11px] text-charcoal-light mt-1">• {opt}</p>
              ))}
            </div>
            {/* Lunch */}
            <div className="bg-cream rounded-xl p-3">
              <p className="font-heading font-bold text-xs">{meal.lunch.title}</p>
              <p className="text-[11px] text-charcoal-light mt-1">🌾 {meal.lunch.main}</p>
              <p className="text-[11px] text-charcoal-light">🫘 {meal.lunch.protein}</p>
              <p className="text-[11px] text-charcoal-light">🥬 {meal.lunch.side}</p>
              <p className="text-[11px] text-charcoal-light">🫒 {meal.lunch.fat}</p>
            </div>
            {/* Snack 2 */}
            <div className="bg-cream rounded-xl p-3">
              <p className="font-heading font-bold text-xs">{meal.snack2.title}</p>
              {meal.snack2.options.map((opt, i) => (
                <p key={i} className="text-[11px] text-charcoal-light mt-1">• {opt}</p>
              ))}
            </div>
            {/* Dinner */}
            <div className="bg-cream rounded-xl p-3">
              <p className="font-heading font-bold text-xs">{meal.dinner.title}</p>
              <p className="text-[11px] text-charcoal-light mt-1">🌾 {meal.dinner.main}</p>
              <p className="text-[11px] text-charcoal-light">🫘 {meal.dinner.protein}</p>
              <p className="text-[11px] text-charcoal-light">🥬 {meal.dinner.side}</p>
              <p className="text-[11px] text-charcoal-light">🫒 {meal.dinner.fat}</p>
            </div>
          </div>
        </Section>

        {/* Nutritionist recipes */}
        <Section title={`👩‍🍳 ${lang === 'es' ? 'Recetas de la nutricionista' : 'Nutritionist recipes'}`}>
          <div className="space-y-2">
            {recipes.map((r, i) => (
              <div key={i} className="py-2 border-b border-cream-dark last:border-0">
                <p className="text-xs font-heading font-semibold">{r.name}</p>
                <p className="text-[10px] text-charcoal-light mt-0.5">{r.desc}</p>
              </div>
            ))}
          </div>
        </Section>

        {/* General tips */}
        <Section title={`💡 ${lang === 'es' ? 'Consejos generales (hinchazón)' : 'General tips (bloating)'}`}>
          <ul className="space-y-1.5">
            {(lang === 'es' ? [
              'Comer a horarios regulares, masticando lento',
              'Habituar el intestino a evacuar siempre a la misma hora (mañana tras desayuno)',
              'Actividad física moderada y constante',
              'Evitar alimentos muy grasos y ultraprocessados',
              'Evitar alimentos con aire (helados, cremas, mousse, batidos)',
              'No usar chicles',
              'Fruta separada de las comidas puede ayudar con la hinchazón',
              'Evitar almidones recalentados o cocidos dos veces',
              'Evitar bebidas con gas',
              'Max 3 cafés o tés al día',
              'Los cereales integrales pueden empeorar síntomas — preferir versión no integral si hay molestias'
            ] : [
              'Eat at regular times, chew slowly',
              'Train bowel to evacuate at same time (morning after breakfast)',
              'Moderate and constant physical activity',
              'Avoid very fatty and ultra-processed foods',
              'Avoid air-puffed foods (ice cream, creams, mousse, shakes)',
              'Don\'t use chewing gum',
              'Fruit away from meals may help with bloating',
              'Avoid reheated or twice-cooked starches',
              'Avoid carbonated drinks',
              'Max 3 coffees or teas per day',
              'Whole grains may worsen symptoms — prefer non-wholegrain if discomfort'
            ]).map((tip, i) => (
              <li key={i} className="text-[11px] text-charcoal-light flex gap-2">
                <span className="text-terra flex-shrink-0">•</span> {tip}
              </li>
            ))}
          </ul>
        </Section>

      </div>
    </div>
  )
}
