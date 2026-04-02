import allRecipes, { getIngredientCount, getSiboRecipes, getRecipeById } from '../data/recipes'

/**
 * Generates a smart weekly meal plan optimized for batch cooking.
 *
 * Normal mode: lunch + dinner (4-5 recipes, batch cooking)
 * SIBO Fede mode: breakfast + snack1 + lunch + snack2 + dinner (5 meals/day per nutritionist)
 */

function shuffle(arr) {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

function scoreForBatchCooking(recipe) {
  let score = 0
  if (recipe.freezable) score += 3
  if (recipe.tags.includes('batch-cooking')) score += 3
  if (recipe.servings >= 4) score += 2
  if (recipe.time <= 30) score += 1
  if (recipe.tags.includes('high-protein')) score += 1
  return score
}

function hasNutritionalVariety(recipes) {
  const hasProtein = recipes.some(r => r.nutrition.protein >= 15)
  const hasHighFiber = recipes.some(r => r.nutrition.fiber >= 8)
  const hasIron = recipes.some(r => r.nutrition.iron >= 4)
  return hasProtein && hasHighFiber && hasIron
}

function selectRecipesForWeek(options = {}) {
  const { siboOnly = false } = options
  let pool = siboOnly ? [...getSiboRecipes()] : [...allRecipes]

  const scored = pool.map(r => ({ recipe: r, score: scoreForBatchCooking(r) }))
  scored.sort((a, b) => b.score - a.score)

  const topPool = scored.slice(0, Math.min(20, scored.length))
  const shuffled = shuffle(topPool)

  const selected = []
  const usedIds = new Set()

  for (const { recipe } of shuffled) {
    if (selected.length >= 5) break
    if (usedIds.has(recipe.id)) continue
    selected.push(recipe)
    usedIds.add(recipe.id)
  }

  while (selected.length < 5 && pool.length > selected.length) {
    const remaining = shuffle(pool.filter(r => !usedIds.has(r.id)))
    if (remaining.length === 0) break
    selected.push(remaining[0])
    usedIds.add(remaining[0].id)
  }

  if (!hasNutritionalVariety(selected) && pool.length > 5) {
    const proteinRecipe = pool.find(r => r.nutrition.protein >= 15 && !usedIds.has(r.id))
    if (proteinRecipe && selected.length > 0) {
      selected[selected.length - 1] = proteinRecipe
    }
  }

  return selected
}

// === SIBO FEDE: breakfast and snack options per nutritionist ===

const siboBreakfastOptions = [
  { id: 'bf-porridge', name: { es: 'Porridge de avena con leche de soja, crema de almendras y fruta', en: 'Oat porridge with soy milk, almond butter and fruit' }, calories: 320 },
  { id: 'bf-yogurt', name: { es: 'Yogur de soja con granola de trigo sarraceno y kiwi', en: 'Soy yogurt with buckwheat granola and kiwi' }, calories: 300 },
  { id: 'bf-toast', name: { es: 'Tostadas con aceite y sal + café + fruta', en: 'Toast with oil and salt + coffee + fruit' }, calories: 280 },
]

const siboSnackOptions = [
  { id: 'sn-fruit-nuts', name: { es: 'Fruta (baja en fructosa) + 10g almendras', en: 'Fruit (low fructose) + 10g almonds' }, calories: 120 },
  { id: 'sn-yogurt', name: { es: 'Yogur de soja con fruta y semillas', en: 'Soy yogurt with fruit and seeds' }, calories: 150 },
  { id: 'sn-chocolate', name: { es: 'Fruta + 10g chocolate negro fondant', en: 'Fruit + 10g dark chocolate' }, calories: 130 },
]

export function generateWeekPlan(options = {}) {
  const { siboOnly = false } = options
  const recipes = selectRecipesForWeek(options)
  const days = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun']

  const plan = {}

  if (siboOnly) {
    // SIBO mode: 5 meals per day
    days.forEach(day => {
      plan[day] = { breakfast: null, snack1: null, lunch: null, snack2: null, dinner: null }
    })
  } else {
    // Normal mode: lunch + dinner
    days.forEach(day => {
      plan[day] = { lunch: null, dinner: null }
    })
  }

  if (recipes.length === 0) return { plan, recipes: [], cookingPlan: [] }

  // Assign lunch/dinner recipes using batch cooking logic
  const assignments = []
  const counts = [3, 3, 3, 3, 2]
  while (counts.length > recipes.length) {
    const removed = counts.pop()
    counts[counts.length - 1] += removed
  }

  recipes.forEach((recipe, i) => {
    assignments.push({ recipe, count: counts[i] || 2 })
  })

  const slots = []
  assignments.forEach(({ recipe, count }) => {
    for (let i = 0; i < count; i++) slots.push(recipe)
  })

  const shuffledSlots = shuffle(slots)

  const allSlots = []
  days.forEach(day => {
    allSlots.push({ day, meal: 'lunch' })
    allSlots.push({ day, meal: 'dinner' })
  })

  const assigned = new Map()
  days.forEach(d => assigned.set(d, { lunch: null, dinner: null }))

  const remaining = [...shuffledSlots]

  for (const slot of allSlots) {
    const dayAssign = assigned.get(slot.day)
    const otherMeal = slot.meal === 'lunch' ? 'dinner' : 'lunch'
    const otherRecipe = dayAssign[otherMeal]

    let idx = remaining.findIndex(r => !otherRecipe || r.id !== otherRecipe.id)
    if (idx === -1) idx = 0
    if (idx < remaining.length) {
      dayAssign[slot.meal] = remaining[idx]
      remaining.splice(idx, 1)
    }
  }

  // Build final plan
  days.forEach(day => {
    const dayAssign = assigned.get(day)
    plan[day].lunch = dayAssign.lunch ? dayAssign.lunch.id : null
    plan[day].dinner = dayAssign.dinner ? dayAssign.dinner.id : null

    // SIBO mode: assign breakfast and snacks
    if (siboOnly) {
      const bfOptions = shuffle(siboBreakfastOptions)
      const snOptions = shuffle(siboSnackOptions)
      plan[day].breakfast = bfOptions[0].id
      plan[day].snack1 = snOptions[0].id
      plan[day].snack2 = snOptions[1 % snOptions.length].id
    }
  })

  // Build cooking plan
  const cookingPlan = assignments.map(({ recipe, count }) => ({
    recipeId: recipe.id,
    recipeName: recipe.name,
    timesUsed: count,
    servingsNeeded: count,
    freezable: recipe.freezable,
    freezeNotes: recipe.freezeNotes,
    cookingTime: recipe.time,
  }))

  cookingPlan.sort((a, b) => b.cookingTime - a.cookingTime)

  return { plan, recipes, cookingPlan }
}

export { siboBreakfastOptions, siboSnackOptions }

export function getPlanStats(plan) {
  const allKnown = [...allRecipes, ...getSiboRecipes()]
  const recipeMap = new Map(allKnown.map(r => [r.id, r]))

  let totalCalories = 0
  let totalProtein = 0
  let totalFiber = 0
  let totalIron = 0
  let mealCount = 0
  const isSibo = Object.values(plan).some(d => d.breakfast !== undefined)

  Object.values(plan).forEach(day => {
    // Count lunch + dinner from recipes
    ;['lunch', 'dinner'].forEach(meal => {
      if (day[meal]) {
        const recipe = recipeMap.get(day[meal])
        if (recipe) {
          totalCalories += recipe.nutrition.calories
          totalProtein += recipe.nutrition.protein
          totalFiber += recipe.nutrition.fiber
          totalIron += recipe.nutrition.iron
          mealCount++
        }
      }
    })

    // SIBO: add breakfast + snacks calories
    if (isSibo) {
      if (day.breakfast) {
        const bf = siboBreakfastOptions.find(b => b.id === day.breakfast)
        if (bf) totalCalories += bf.calories
      }
      if (day.snack1) {
        const sn = siboSnackOptions.find(s => s.id === day.snack1)
        if (sn) totalCalories += sn.calories
      }
      if (day.snack2) {
        const sn = siboSnackOptions.find(s => s.id === day.snack2)
        if (sn) totalCalories += sn.calories
      }
    }
  })

  return {
    avgCaloriesPerDay: Math.round(totalCalories / 7),
    avgProteinPerDay: mealCount > 0 ? Math.round(totalProtein / 7) : 0,
    avgFiberPerDay: mealCount > 0 ? Math.round(totalFiber / 7) : 0,
    avgIronPerDay: mealCount > 0 ? (totalIron / 7).toFixed(1) : 0,
    totalMeals: mealCount,
    uniqueRecipes: new Set(Object.values(plan).flatMap(d => [d.lunch, d.dinner]).filter(Boolean)).size,
    isSibo,
    targetCalories: isSibo ? '1500-1600' : null,
  }
}
