import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'

const STORAGE_KEY = 'veggiebudino-custom-recipes'

function getCustomRecipes() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || []
  } catch {
    return []
  }
}

function saveCustomRecipe(recipe) {
  const existing = getCustomRecipes()
  existing.push(recipe)
  localStorage.setItem(STORAGE_KEY, JSON.stringify(existing))
}

export { getCustomRecipes }

export default function AddRecipe() {
  const { i18n } = useTranslation()
  const lang = i18n.language
  const navigate = useNavigate()

  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [time, setTime] = useState('')
  const [servings, setServings] = useState('2')
  const [siboFriendly, setSiboFriendly] = useState(false)
  const [freezable, setFreezable] = useState(false)
  const [ingredients, setIngredients] = useState([{ name: '', qty: '', unit: '' }])
  const [steps, setSteps] = useState([''])
  const [saved, setSaved] = useState(false)

  const addIngredient = () => setIngredients([...ingredients, { name: '', qty: '', unit: '' }])
  const addStep = () => setSteps([...steps, ''])

  const updateIngredient = (i, field, value) => {
    const updated = [...ingredients]
    updated[i] = { ...updated[i], [field]: value }
    setIngredients(updated)
  }

  const updateStep = (i, value) => {
    const updated = [...steps]
    updated[i] = value
    setSteps(updated)
  }

  const removeIngredient = (i) => {
    if (ingredients.length <= 1) return
    setIngredients(ingredients.filter((_, idx) => idx !== i))
  }

  const removeStep = (i) => {
    if (steps.length <= 1) return
    setSteps(steps.filter((_, idx) => idx !== i))
  }

  const handleSave = () => {
    if (!name.trim()) return

    const recipe = {
      id: 'custom-' + Date.now(),
      name: { es: name, en: name },
      description: { es: description, en: description },
      time: parseInt(time) || 30,
      difficulty: 'easy',
      servings: parseInt(servings) || 2,
      meal: ['lunch', 'dinner'],
      freezable,
      freezeNotes: { es: '', en: '' },
      siboFriendly,
      tags: freezable ? ['batch-cooking'] : [],
      ingredients: ingredients.filter(i => i.name.trim()).map(i => ({
        name: { es: i.name, en: i.name },
        qty: i.qty,
        unit: i.unit,
        section: 'other',
      })),
      steps: {
        es: steps.filter(s => s.trim()),
        en: steps.filter(s => s.trim()),
      },
      nutrition: {
        calories: 0, protein: 0, carbs: 0, fat: 0, fiber: 0,
        iron: 0, calcium: 0, b12: 0, zinc: 0, omega3: 0, vitaminD: 0,
      },
      source: { name: lang === 'es' ? 'Receta personal' : 'Personal recipe', author: '', url: '' },
      isCustom: true,
    }

    saveCustomRecipe(recipe)
    setSaved(true)
    setTimeout(() => navigate('/recipes'), 1500)
  }

  if (saved) {
    return (
      <div className="px-6 pt-6 pb-24 flex flex-col items-center justify-center min-h-[60vh]">
        <div className="text-5xl mb-4">✅</div>
        <p className="font-heading font-bold text-lg">{lang === 'es' ? '¡Receta guardada!' : 'Recipe saved!'}</p>
      </div>
    )
  }

  return (
    <div className="px-6 pt-6 pb-24">
      <div className="flex items-center gap-3 mb-4">
        <button onClick={() => navigate(-1)} className="text-terra font-heading font-semibold text-sm">←</button>
        <h1 className="font-heading text-2xl font-bold">
          {lang === 'es' ? 'Nueva receta' : 'New recipe'}
        </h1>
      </div>

      {/* Name */}
      <div className="space-y-4">
        <div>
          <label className="font-heading text-xs font-semibold text-charcoal-light uppercase">
            {lang === 'es' ? 'Nombre de la receta' : 'Recipe name'} *
          </label>
          <input
            value={name} onChange={e => setName(e.target.value)}
            className="w-full mt-1 bg-white border border-cream-dark rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-terra"
            placeholder={lang === 'es' ? 'Ej: Curry de garbanzos' : 'E.g.: Chickpea Curry'}
          />
        </div>

        <div>
          <label className="font-heading text-xs font-semibold text-charcoal-light uppercase">
            {lang === 'es' ? 'Descripción breve' : 'Short description'}
          </label>
          <input
            value={description} onChange={e => setDescription(e.target.value)}
            className="w-full mt-1 bg-white border border-cream-dark rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-terra"
          />
        </div>

        <div className="flex gap-3">
          <div className="flex-1">
            <label className="font-heading text-xs font-semibold text-charcoal-light uppercase">
              {lang === 'es' ? 'Tiempo (min)' : 'Time (min)'}
            </label>
            <input
              type="number" value={time} onChange={e => setTime(e.target.value)}
              className="w-full mt-1 bg-white border border-cream-dark rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-terra"
            />
          </div>
          <div className="flex-1">
            <label className="font-heading text-xs font-semibold text-charcoal-light uppercase">
              {lang === 'es' ? 'Raciones' : 'Servings'}
            </label>
            <input
              type="number" value={servings} onChange={e => setServings(e.target.value)}
              className="w-full mt-1 bg-white border border-cream-dark rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-terra"
            />
          </div>
        </div>

        {/* Toggles */}
        <div className="flex gap-4">
          <button
            onClick={() => setSiboFriendly(!siboFriendly)}
            className={`flex-1 py-2 rounded-xl font-heading text-xs font-semibold border-2 ${siboFriendly ? 'bg-khaki border-khaki text-[#6B5A2A]' : 'border-cream-dark text-charcoal-light'}`}
          >
            SIBO {siboFriendly ? '✓' : ''}
          </button>
          <button
            onClick={() => setFreezable(!freezable)}
            className={`flex-1 py-2 rounded-xl font-heading text-xs font-semibold border-2 ${freezable ? 'bg-forest/10 border-forest text-forest' : 'border-cream-dark text-charcoal-light'}`}
          >
            ❄️ {lang === 'es' ? 'Congelable' : 'Freezable'} {freezable ? '✓' : ''}
          </button>
        </div>

        {/* Ingredients */}
        <div>
          <label className="font-heading text-xs font-semibold text-charcoal-light uppercase">
            {lang === 'es' ? 'Ingredientes' : 'Ingredients'}
          </label>
          <div className="space-y-2 mt-2">
            {ingredients.map((ing, i) => (
              <div key={i} className="flex gap-2">
                <input
                  value={ing.name} onChange={e => updateIngredient(i, 'name', e.target.value)}
                  placeholder={lang === 'es' ? 'Ingrediente' : 'Ingredient'}
                  className="flex-1 bg-white border border-cream-dark rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-terra"
                />
                <input
                  value={ing.qty} onChange={e => updateIngredient(i, 'qty', e.target.value)}
                  placeholder={lang === 'es' ? 'Cant.' : 'Qty'}
                  className="w-16 bg-white border border-cream-dark rounded-lg px-2 py-2 text-sm focus:outline-none focus:border-terra"
                />
                <input
                  value={ing.unit} onChange={e => updateIngredient(i, 'unit', e.target.value)}
                  placeholder="g/ml"
                  className="w-14 bg-white border border-cream-dark rounded-lg px-2 py-2 text-sm focus:outline-none focus:border-terra"
                />
                {ingredients.length > 1 && (
                  <button onClick={() => removeIngredient(i)} className="text-charcoal-light text-sm px-1">✕</button>
                )}
              </div>
            ))}
          </div>
          <button onClick={addIngredient} className="mt-2 text-terra font-heading text-xs font-semibold">
            + {lang === 'es' ? 'Añadir ingrediente' : 'Add ingredient'}
          </button>
        </div>

        {/* Steps */}
        <div>
          <label className="font-heading text-xs font-semibold text-charcoal-light uppercase">
            {lang === 'es' ? 'Pasos' : 'Steps'}
          </label>
          <div className="space-y-2 mt-2">
            {steps.map((step, i) => (
              <div key={i} className="flex gap-2 items-start">
                <span className="w-6 h-6 rounded-full bg-terra text-white flex items-center justify-center text-[10px] font-bold mt-2 flex-shrink-0">
                  {i + 1}
                </span>
                <textarea
                  value={step} onChange={e => updateStep(i, e.target.value)}
                  rows={2}
                  className="flex-1 bg-white border border-cream-dark rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-terra resize-none"
                />
                {steps.length > 1 && (
                  <button onClick={() => removeStep(i)} className="text-charcoal-light text-sm mt-2">✕</button>
                )}
              </div>
            ))}
          </div>
          <button onClick={addStep} className="mt-2 text-terra font-heading text-xs font-semibold">
            + {lang === 'es' ? 'Añadir paso' : 'Add step'}
          </button>
        </div>

        {/* Save */}
        <button
          onClick={handleSave}
          disabled={!name.trim()}
          className={`w-full py-4 rounded-2xl font-heading font-bold text-sm transition-colors ${
            name.trim() ? 'bg-terra text-white active:scale-[0.98]' : 'bg-cream-dark text-charcoal-light'
          }`}
        >
          💾 {lang === 'es' ? 'Guardar receta' : 'Save recipe'}
        </button>
      </div>
    </div>
  )
}
