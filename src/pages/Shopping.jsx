import { useState, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import useWeekPlan from '../hooks/useWeekPlan'
import useShoppingHistory from '../hooks/useShoppingHistory'
import { getRecipeById } from '../data/recipes'
import priceData from '../data/prices.json'

const sectionOrder = ['produce', 'proteins', 'grains', 'frozen', 'dairy', 'pantry', 'other']
const sectionEmoji = { produce: '🥬', proteins: '🫘', grains: '🌾', frozen: '❄️', dairy: '🥛', pantry: '🏪', other: '📦' }

const superLogos = {
  'Mercadona': '🟢',
  'Lidl': '🔵',
  'Dia': '🔴',
  'Carrefour': '🟠',
}

function findPrice(ingredientName) {
  const name = ingredientName.toLowerCase()
  const prices = priceData.prices
  if (prices[name]) return prices[name]
  for (const [key, val] of Object.entries(prices)) {
    if (key !== 'default' && name.includes(key)) return val
  }
  for (const [key, val] of Object.entries(prices)) {
    if (key !== 'default' && key.includes(name.split(' ')[0])) return val
  }
  return prices.default
}

export default function Shopping() {
  const { t, i18n } = useTranslation()
  const lang = i18n.language
  const { plan } = useWeekPlan()
  const { history, addEntry, removeEntry, avgPerWeek } = useShoppingHistory()
  const [checked, setChecked] = useState(new Set())
  const [people, setPeople] = useState(() => {
    try { return parseInt(localStorage.getItem('veggiebudino-people')) || 2 } catch { return 2 }
  })
  const [showHistory, setShowHistory] = useState(false)
  const [actualSpent, setActualSpent] = useState('')
  const [collapsedSections, setCollapsedSections] = useState(new Set())

  const handlePeopleChange = (n) => {
    const val = Math.max(1, Math.min(8, n))
    setPeople(val)
    localStorage.setItem('veggiebudino-people', String(val))
  }

  const { shoppingList, estimatedTotal } = useMemo(() => {
    const ingredientMap = new Map()

    // Count how many times each recipe appears in the plan
    const recipeCounts = new Map()
    Object.values(plan).forEach(day => {
      ;['lunch', 'dinner'].forEach(meal => {
        if (day[meal]) {
          recipeCounts.set(day[meal], (recipeCounts.get(day[meal]) || 0) + 1)
        }
      })
    })

    // For each unique recipe, calculate ingredients scaled by people
    recipeCounts.forEach((timesInPlan, recipeId) => {
      const recipe = getRecipeById(recipeId)
      if (!recipe) return

      // Scale: we cook once in bulk for `people` persons, enough for all appearances
      // But each appearance = 1 serving per person, so total servings needed = timesInPlan * people
      // The recipe makes `recipe.servings` portions, so we need ceil(timesInPlan * people / recipe.servings) batches
      const batchesNeeded = Math.ceil((timesInPlan * people) / recipe.servings)

      recipe.ingredients.forEach(ing => {
        const key = ing.name[lang].toLowerCase()
        const baseQty = parseFloat(ing.qty) || 0
        const totalQty = baseQty * batchesNeeded

        if (ingredientMap.has(key)) {
          const existing = ingredientMap.get(key)
          existing.scaledQty += totalQty
        } else {
          const priceInfo = findPrice(ing.name.es)
          ingredientMap.set(key, {
            name: ing.name[lang],
            qty: ing.qty,
            unit: ing.unit,
            section: ing.section,
            scaledQty: totalQty,
            priceInfo,
          })
        }
      })
    })

    const grouped = {}
    sectionOrder.forEach(s => { grouped[s] = [] })

    let total = 0
    ingredientMap.forEach(item => {
      const section = item.section || 'other'
      if (!grouped[section]) grouped[section] = []

      // Estimate cost scaled: if the reference unit is 400g and we need 800g, that's 2x the price
      const refQty = parseFloat(item.priceInfo.refUnit) || 1
      const needed = item.scaledQty || refQty
      const multiplier = Math.max(1, Math.ceil(needed / refQty))
      item.estimatedCost = item.priceInfo.price * multiplier

      grouped[section].push(item)
      total += item.estimatedCost
    })

    Object.keys(grouped).forEach(key => {
      if (grouped[key].length === 0) delete grouped[key]
    })

    return { shoppingList: grouped, estimatedTotal: total }
  }, [plan, lang, people])

  const allItems = Object.values(shoppingList).flat()
  const totalItems = allItems.length
  const checkedCount = checked.size
  const hasPlan = totalItems > 0

  // Cost of unchecked items only (what you still need to buy)
  const remainingCost = allItems
    .filter(item => !checked.has(item.name))
    .reduce((sum, item) => sum + (item.estimatedCost || 0), 0)

  const toggleCheck = (name) => {
    setChecked(prev => {
      const next = new Set(prev)
      if (next.has(name)) next.delete(name)
      else next.add(name)
      return next
    })
  }

  const toggleSection = (section) => {
    setCollapsedSections(prev => {
      const next = new Set(prev)
      if (next.has(section)) next.delete(section)
      else next.add(section)
      return next
    })
  }

  const isSectionComplete = (items) => items.every(item => checked.has(item.name))

  const handleSaveSpent = () => {
    const amount = parseFloat(actualSpent)
    if (!amount || amount <= 0) return
    addEntry({ actual: amount, estimated: estimatedTotal, people, items: totalItems })
    setActualSpent('')
  }

  if (!hasPlan) {
    return (
      <div className="px-6 pt-6 pb-24">
        <h1 className="font-heading text-2xl font-bold">{t('shopping.title')}</h1>
        <div className="mt-6 bg-white rounded-2xl p-5 shadow-[0_4px_12px_rgba(199,91,60,0.08)]">
          <p className="text-charcoal-light text-sm text-center py-8">🛒 {t('shopping.empty')}</p>
        </div>
        {history.length > 0 && (
          <div className="mt-6">
            <button onClick={() => setShowHistory(!showHistory)} className="font-heading font-semibold text-sm text-terra">
              📊 {lang === 'es' ? 'Ver historial de gastos' : 'View spending history'}
            </button>
            {showHistory && <HistorySection history={history} removeEntry={removeEntry} avgPerWeek={avgPerWeek} lang={lang} />}
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="px-6 pt-6 pb-24">
      <h1 className="font-heading text-2xl font-bold">{t('shopping.title')}</h1>
      <p className="text-sm text-charcoal-light">
        {t('shopping.items', { count: totalItems })} · {t('shopping.checked', { count: checkedCount })}
      </p>

      {/* People selector */}
      <div className="mt-4 bg-white rounded-2xl p-4 shadow-[0_4px_12px_rgba(199,91,60,0.08)]">
        <p className="font-heading font-semibold text-sm">
          👥 {lang === 'es' ? '¿Para cuántas personas?' : 'How many people?'}
        </p>
        <div className="flex items-center gap-4 mt-2">
          <button
            onClick={() => handlePeopleChange(people - 1)}
            className="w-10 h-10 rounded-full bg-cream flex items-center justify-center font-heading font-bold text-lg text-terra active:scale-90 transition-transform"
          >−</button>
          <span className="font-heading text-2xl font-bold text-terra w-8 text-center">{people}</span>
          <button
            onClick={() => handlePeopleChange(people + 1)}
            className="w-10 h-10 rounded-full bg-cream flex items-center justify-center font-heading font-bold text-lg text-terra active:scale-90 transition-transform"
          >+</button>
          <p className="text-[10px] text-charcoal-light flex-1">
            {lang === 'es' ? 'Cantidades y coste se ajustan' : 'Quantities and cost adjust'}
          </p>
        </div>
      </div>

      {/* Cost estimate */}
      <div className="mt-3 bg-khaki/20 rounded-2xl p-4">
        <div className="flex items-center justify-between gap-3">
          <div className="flex-1">
            <p className="font-heading font-semibold text-sm">
              💰 {lang === 'es' ? `Coste (${people} pers.)` : `Cost (${people} ppl)`}
            </p>
            <p className="text-[10px] text-charcoal-light">
              {lang === 'es' ? 'Precios más baratos entre Mercadona, Lidl, Dia y Carrefour' : 'Cheapest prices across Mercadona, Lidl, Dia and Carrefour'}
            </p>
          </div>
          <div className="text-right">
            <p className="font-heading text-xl font-bold text-terra">{estimatedTotal.toFixed(0)}€ <span className="text-xs font-normal text-charcoal-light">total</span></p>
            {checkedCount > 0 && remainingCost < estimatedTotal && (
              <p className="font-heading text-sm font-bold text-forest">{remainingCost.toFixed(0)}€ <span className="text-[10px] font-normal text-charcoal-light">{lang === 'es' ? 'por comprar' : 'to buy'}</span></p>
            )}
          </div>
        </div>
        <div className="mt-3 flex gap-2">
          <input
            type="number" value={actualSpent} onChange={(e) => setActualSpent(e.target.value)}
            placeholder={lang === 'es' ? '¿Cuánto gastaste?' : 'How much did you spend?'}
            className="flex-1 bg-white rounded-xl px-3 py-2 text-sm border border-cream-dark focus:outline-none focus:border-terra"
          />
          <button onClick={handleSaveSpent} className="bg-terra text-white rounded-xl px-4 py-2 font-heading text-xs font-semibold">
            {lang === 'es' ? 'Guardar' : 'Save'}
          </button>
        </div>
      </div>

      {history.length > 0 && (
        <button onClick={() => setShowHistory(!showHistory)} className="mt-3 font-heading font-semibold text-sm text-terra">
          📊 {lang === 'es' ? `Historial (media: ${avgPerWeek.toFixed(0)}€/sem)` : `History (avg: ${avgPerWeek.toFixed(0)}€/wk)`}
          {showHistory ? ' ▲' : ' ▼'}
        </button>
      )}
      {showHistory && <HistorySection history={history} removeEntry={removeEntry} avgPerWeek={avgPerWeek} lang={lang} />}

      {/* Shopping list */}
      <div className="mt-5 space-y-4">
        {Object.entries(shoppingList).map(([section, items]) => {
          const complete = isSectionComplete(items)
          const collapsed = collapsedSections.has(section) || complete
          const checkedInSection = items.filter(item => checked.has(item.name)).length
          return (
            <div key={section} className={`bg-white rounded-2xl shadow-[0_4px_12px_rgba(199,91,60,0.08)] overflow-hidden ${complete ? 'opacity-60' : ''}`}>
              <button onClick={() => toggleSection(section)} className="w-full p-4 flex items-center justify-between">
                <h3 className="font-heading font-semibold text-xs text-charcoal-light uppercase tracking-wide">
                  {sectionEmoji[section] || '📦'} {t(`shopping.sections.${section}`) || section}
                  <span className="ml-2 text-[10px] normal-case">({checkedInSection}/{items.length})</span>
                </h3>
                <span className={`text-charcoal-light text-xs transition-transform ${collapsed ? '' : 'rotate-180'}`}>▼</span>
              </button>
              {!collapsed && (
                <div className="px-4 pb-4">
                  {items.map((item, i) => {
                    const isChecked = checked.has(item.name)
                    const displayQty = item.scaledQty > 0 ? Math.ceil(item.scaledQty) : item.qty
                    const cheapest = item.priceInfo?.cheapest
                    return (
                      <div
                        key={i}
                        onClick={() => toggleCheck(item.name)}
                        className={`flex items-center gap-3 py-2.5 border-b border-cream-dark last:border-0 cursor-pointer ${isChecked ? 'opacity-40' : ''}`}
                      >
                        <div className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center flex-shrink-0 ${
                          isChecked ? 'bg-forest border-forest text-white' : 'border-charcoal-light/30'
                        }`}>
                          {isChecked && <span className="text-xs">✓</span>}
                        </div>
                        <div className={`flex-1 min-w-0 ${isChecked ? 'line-through' : ''}`}>
                          <p className="text-sm truncate">{item.name}</p>
                          {cheapest && cheapest !== '—' && (
                            <p className="text-[9px] text-charcoal-light">
                              {superLogos[cheapest] || ''} {lang === 'es' ? 'Más barato en' : 'Cheapest at'} <span className="font-heading font-semibold">{cheapest}</span>
                              <span className="text-terra ml-1">({item.priceInfo.price.toFixed(2)}€/{item.priceInfo.refUnit})</span>
                            </p>
                          )}
                        </div>
                        <span className="text-xs text-charcoal-light font-heading whitespace-nowrap">
                          {displayQty ? `${displayQty} ${item.unit}` : ''}
                        </span>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          )
        })}
      </div>

      {checkedCount > 0 && (
        <button
          onClick={() => setChecked(new Set())}
          className="mt-4 w-full border border-cream-dark rounded-xl py-3 font-heading font-semibold text-sm text-charcoal-light"
        >
          {t('shopping.clearChecked')}
        </button>
      )}
    </div>
  )
}

function HistorySection({ history, removeEntry, avgPerWeek, lang }) {
  return (
    <div className="mt-3 bg-white rounded-2xl p-4 shadow-[0_4px_12px_rgba(199,91,60,0.08)]">
      <h3 className="font-heading font-bold text-sm mb-2">📊 {lang === 'es' ? 'Historial de compras' : 'Shopping history'}</h3>
      <div className="flex gap-3 mb-3">
        <div className="flex-1 bg-cream rounded-lg p-2 text-center">
          <p className="font-heading text-lg font-bold text-terra">{avgPerWeek.toFixed(0)}€</p>
          <p className="text-[9px] text-charcoal-light">{lang === 'es' ? 'media/semana' : 'avg/week'}</p>
        </div>
        <div className="flex-1 bg-cream rounded-lg p-2 text-center">
          <p className="font-heading text-lg font-bold text-terra">{history.length}</p>
          <p className="text-[9px] text-charcoal-light">{lang === 'es' ? 'compras' : 'trips'}</p>
        </div>
        <div className="flex-1 bg-cream rounded-lg p-2 text-center">
          <p className="font-heading text-lg font-bold text-terra">{history.reduce((s, e) => s + (e.actual || 0), 0).toFixed(0)}€</p>
          <p className="text-[9px] text-charcoal-light">total</p>
        </div>
      </div>
      <div className="space-y-2 max-h-48 overflow-y-auto">
        {history.map(entry => (
          <div key={entry.id} className="flex items-center justify-between py-1.5 border-b border-cream-dark last:border-0">
            <p className="text-xs font-heading">
              {new Date(entry.date).toLocaleDateString(lang === 'es' ? 'es-ES' : 'en-US', { day: 'numeric', month: 'short' })}
              <span className="text-charcoal-light"> · {entry.people} {lang === 'es' ? 'pers' : 'ppl'}</span>
            </p>
            <div className="flex items-center gap-2">
              <span className="font-heading font-bold text-sm text-terra">{entry.actual}€</span>
              {entry.estimated > 0 && <span className="text-[9px] text-charcoal-light">(est: {entry.estimated.toFixed(0)}€)</span>}
              <button onClick={() => removeEntry(entry.id)} className="text-charcoal-light text-xs">✕</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
