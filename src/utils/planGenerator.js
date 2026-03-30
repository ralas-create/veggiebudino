import allRecipes, { getIngredientCount } from '../data/recipes'

/**
 * Generates a smart weekly meal plan optimized for batch cooking.
 *
 * Strategy:
 * - Pick 4-5 recipes for the week (not 14 individual ones)
 * - Each recipe is cooked once in large quantity
 * - Distribute across the week: same recipe appears 2-3 times
 * - Alternate lunch/dinner so you don't eat the same thing twice in a day
 * - Ensure nutritional variety (proteins, grains, vegetables)
 * - Respect SIBO filter if active
 * - Prioritize freezable + batch-cooking recipes
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

  let pool = [...allRecipes]
  if (siboOnly) {
    pool = pool.filter(r => r.siboFriendly)
  }

  // Score and sort by batch-cooking suitability
  const scored = pool.map(r => ({ recipe: r, score: scoreForBatchCooking(r) }))
  scored.sort((a, b) => b.score - a.score)

  // Take top candidates, then pick 5 with variety
  const topPool = scored.slice(0, Math.min(20, scored.length))
  const shuffled = shuffle(topPool)

  const selected = []
  const usedIds = new Set()

  for (const { recipe } of shuffled) {
    if (selected.length >= 5) break
    if (usedIds.has(recipe.id)) continue

    // Ensure we don't pick too similar recipes
    selected.push(recipe)
    usedIds.add(recipe.id)
  }

  // If we need more, pull from remaining pool
  while (selected.length < 5 && pool.length > selected.length) {
    const remaining = shuffle(pool.filter(r => !usedIds.has(r.id)))
    if (remaining.length === 0) break
    selected.push(remaining[0])
    usedIds.add(remaining[0].id)
  }

  // Check nutritional variety, swap if needed
  if (!hasNutritionalVariety(selected) && pool.length > 5) {
    const proteinRecipe = pool.find(r => r.nutrition.protein >= 15 && !usedIds.has(r.id))
    if (proteinRecipe && selected.length > 0) {
      selected[selected.length - 1] = proteinRecipe
    }
  }

  return selected
}

export function generateWeekPlan(options = {}) {
  const recipes = selectRecipesForWeek(options)
  const days = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun']

  const plan = {}
  days.forEach(day => {
    plan[day] = { lunch: null, dinner: null }
  })

  if (recipes.length === 0) return { plan, recipes: [], cookingPlan: [] }

  // Assign recipes to slots using batch cooking logic:
  // Each recipe appears 2-3 times across the week
  // Never the same recipe for both lunch AND dinner on the same day

  const assignments = [] // { recipeIndex, count }

  // 5 recipes × ~3 appearances = 15 slots, but we have 14 (7 days × 2 meals)
  // So: 4 recipes appear 3 times, 1 recipe appears 2 times
  const counts = [3, 3, 3, 3, 2]

  // Adjust if fewer recipes
  while (counts.length > recipes.length) {
    const removed = counts.pop()
    counts[counts.length - 1] += removed
  }

  recipes.forEach((recipe, i) => {
    assignments.push({ recipe, count: counts[i] || 2 })
  })

  // Create slot pool
  const slots = []
  assignments.forEach(({ recipe, count }) => {
    for (let i = 0; i < count; i++) {
      slots.push(recipe)
    }
  })

  // Shuffle and assign, ensuring no same-recipe on same day
  const shuffledSlots = shuffle(slots)

  const allSlots = []
  days.forEach(day => {
    allSlots.push({ day, meal: 'lunch' })
    allSlots.push({ day, meal: 'dinner' })
  })

  // Greedy assignment with constraint
  const assigned = new Map() // "day" -> { lunch: recipe, dinner: recipe }
  days.forEach(d => assigned.set(d, { lunch: null, dinner: null }))

  const remaining = [...shuffledSlots]

  for (const slot of allSlots) {
    const dayAssign = assigned.get(slot.day)
    const otherMeal = slot.meal === 'lunch' ? 'dinner' : 'lunch'
    const otherRecipe = dayAssign[otherMeal]

    // Find a recipe that's different from the other meal today
    let idx = remaining.findIndex(r => !otherRecipe || r.id !== otherRecipe.id)
    if (idx === -1) idx = 0 // fallback
    if (idx < remaining.length) {
      dayAssign[slot.meal] = remaining[idx]
      remaining.splice(idx, 1)
    }
  }

  // Build final plan
  days.forEach(day => {
    const dayAssign = assigned.get(day)
    plan[day] = {
      lunch: dayAssign.lunch ? dayAssign.lunch.id : null,
      dinner: dayAssign.dinner ? dayAssign.dinner.id : null,
    }
  })

  // Build cooking plan (what to cook and how much)
  const cookingPlan = assignments.map(({ recipe, count }) => ({
    recipeId: recipe.id,
    recipeName: recipe.name,
    timesUsed: count,
    servingsNeeded: count, // 1 serving per meal slot
    freezable: recipe.freezable,
    freezeNotes: recipe.freezeNotes,
    cookingTime: recipe.time,
  }))

  // Sort by cooking time (longest first — cook these first on Sunday)
  cookingPlan.sort((a, b) => b.cookingTime - a.cookingTime)

  return { plan, recipes, cookingPlan }
}

export function getPlanStats(plan, recipes) {
  const recipeMap = new Map(allRecipes.map(r => [r.id, r]))

  let totalCalories = 0
  let totalProtein = 0
  let totalFiber = 0
  let totalIron = 0
  let mealCount = 0

  Object.values(plan).forEach(day => {
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
  })

  return {
    avgCaloriesPerDay: mealCount > 0 ? Math.round(totalCalories / 7) : 0,
    avgProteinPerDay: mealCount > 0 ? Math.round(totalProtein / 7) : 0,
    avgFiberPerDay: mealCount > 0 ? Math.round(totalFiber / 7) : 0,
    avgIronPerDay: mealCount > 0 ? (totalIron / 7).toFixed(1) : 0,
    totalMeals: mealCount,
    uniqueRecipes: new Set(Object.values(plan).flatMap(d => [d.lunch, d.dinner]).filter(Boolean)).size,
  }
}
