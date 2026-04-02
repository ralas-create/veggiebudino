import allRecipes, { getIngredientCount, getSiboRecipes, getRecipeById } from '../data/recipes'
import { scoreRecipeByPantry } from './pantryMatcher'

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
  const { siboOnly = false, pantryItems = [] } = options
  let pool = siboOnly ? [...getSiboRecipes()] : [...allRecipes]

  // Score: batch cooking suitability + pantry match bonus (pantry items weight heavily)
  const scored = pool.map(r => {
    const batchScore = scoreForBatchCooking(r)
    const pantryScore = scoreRecipeByPantry(r, pantryItems) * 5 // pantry match is very important
    return { recipe: r, score: batchScore + pantryScore, pantryMatches: scoreRecipeByPantry(r, pantryItems) }
  })
  scored.sort((a, b) => b.score - a.score)

  const topPool = scored.slice(0, Math.min(20, scored.length))
  // If pantry items exist, don't shuffle — keep pantry-matched recipes at the top
  const sorted = pantryItems.length > 0 ? topPool : shuffle(topPool)

  const selected = []
  const usedIds = new Set()

  for (const { recipe } of sorted) {
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
  { id: 'bf-porridge-berries', name: { es: 'Porridge de avena (30g) con leche de soja con calcio, crema de almendras y mirtillos/lampones', en: 'Oat porridge (30g) with calcium soy milk, almond butter and blueberries/raspberries' }, calories: 320 },
  { id: 'bf-porridge-banana', name: { es: 'Porridge de avena (30g) con leche de soja con calcio, crema de almendras y banana (no madura)', en: 'Oat porridge (30g) with calcium soy milk, almond butter and banana (not ripe)' }, calories: 330 },
  { id: 'bf-yogurt-kiwi', name: { es: 'Yogur de soja con calcio + granola de trigo sarraceno + 1 kiwi', en: 'Calcium soy yogurt + buckwheat granola + 1 kiwi' }, calories: 300 },
  { id: 'bf-yogurt-orange', name: { es: 'Yogur de soja con calcio + copos de maíz (sin azúcar) + 1 naranja mediana', en: 'Calcium soy yogurt + corn flakes (no sugar) + 1 medium orange' }, calories: 290 },
  { id: 'bf-yogurt-berries', name: { es: 'Yogur de soja con calcio + mijo inflado + fresas (125g)', en: 'Calcium soy yogurt + puffed millet + strawberries (125g)' }, calories: 280 },
  { id: 'bf-toast-tomato', name: { es: '2 tostadas con AOVE y sal + café + 1 mandarina', en: '2 toasts with EVOO and salt + coffee + 1 tangerine' }, calories: 280 },
]

const siboSnackOptions = [
  { id: 'sn-kiwi-almonds', name: { es: '1 kiwi + 10 almendras (10g)', en: '1 kiwi + 10 almonds (10g)' }, calories: 120 },
  { id: 'sn-orange-walnuts', name: { es: '1 naranja mediana + 10g nueces', en: '1 medium orange + 10g walnuts' }, calories: 115 },
  { id: 'sn-banana-almonds', name: { es: '1 banana (no madura) + 10 almendras', en: '1 banana (not ripe) + 10 almonds' }, calories: 140 },
  { id: 'sn-strawberries-nuts', name: { es: 'Fresas (125g) + 10g nueces de macadamia', en: 'Strawberries (125g) + 10g macadamia nuts' }, calories: 110 },
  { id: 'sn-tangerine-seeds', name: { es: '2 mandarinas + 10g semillas de calabaza', en: '2 tangerines + 10g pumpkin seeds' }, calories: 120 },
  { id: 'sn-yogurt-berries-choc', name: { es: 'Yogur de soja + mirtillos + 10g chocolate negro fondant', en: 'Soy yogurt + blueberries + 10g dark chocolate' }, calories: 170 },
  { id: 'sn-grapes-almonds', name: { es: 'Uva (125g) + 10 almendras', en: 'Grapes (125g) + 10 almonds' }, calories: 130 },
  { id: 'sn-melon-seeds', name: { es: 'Melón (125g) + 10g semillas de girasol', en: 'Melon (125g) + 10g sunflower seeds' }, calories: 100 },
  { id: 'sn-raspberries-choc', name: { es: 'Lampones (125g) + 10g chocolate negro fondant', en: 'Raspberries (125g) + 10g dark chocolate' }, calories: 115 },
  { id: 'sn-pineapple-nuts', name: { es: 'Piña (125g) + 10g nueces pecan', en: 'Pineapple (125g) + 10g pecan nuts' }, calories: 120 },
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

    // SIBO mode: assign breakfast and snacks — different each day
    if (siboOnly) {
      const dayIndex = days.indexOf(day)
      plan[day].breakfast = siboBreakfastOptions[dayIndex % siboBreakfastOptions.length].id
      // Snacks: pick two different ones, rotating through the week
      const sn1Index = (dayIndex * 2) % siboSnackOptions.length
      let sn2Index = (dayIndex * 2 + 1) % siboSnackOptions.length
      if (sn2Index === sn1Index) sn2Index = (sn2Index + 1) % siboSnackOptions.length
      plan[day].snack1 = siboSnackOptions[sn1Index].id
      plan[day].snack2 = siboSnackOptions[sn2Index].id
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
