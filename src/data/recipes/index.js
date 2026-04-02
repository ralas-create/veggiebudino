import recipes from './all-recipes.json'
import siboRecipes from './sibo-recipes.json'

function getCustomRecipes() {
  try {
    return JSON.parse(localStorage.getItem('veggiebudino-custom-recipes')) || []
  } catch {
    return []
  }
}

// Normal mode: all recipes (non-SIBO) + custom
// SIBO mode: only SIBO-Fede recipes + custom SIBO ones
const normalRecipes = recipes.map(r => ({ ...r, siboFriendly: false }))

export default normalRecipes

export function getAllRecipesWithCustom() {
  return [...normalRecipes, ...getCustomRecipes()]
}

export function getSiboRecipes() {
  return [...siboRecipes, ...getCustomRecipes().filter(r => r.siboFriendly)]
}

export function getRecipeById(id) {
  return [...normalRecipes, ...siboRecipes, ...getCustomRecipes()].find(r => r.id === id)
}

export function getIngredientCount(recipe) {
  return recipe.ingredients.filter(i => {
    const name = (i.name.es || i.name.en || '').toLowerCase()
    return !name.startsWith('sal') && name !== 'agua' && name !== 'water' && name !== 'pimienta'
  }).length
}

export function getIngredientLevel(recipe) {
  const count = getIngredientCount(recipe)
  if (count <= 7) return 'few'
  if (count <= 10) return 'normal'
  return 'many'
}

export function filterRecipes(recipeList, filters = {}) {
  return recipeList.filter(recipe => {
    if (filters.siboOnly && !recipe.siboFriendly) return false
    if (filters.quick && recipe.time > 30) return false
    if (filters.fewIngredients && getIngredientLevel(recipe) !== 'few') return false
    if (filters.batchCooking && !recipe.tags.includes('batch-cooking')) return false
    if (filters.freezable && !recipe.freezable) return false
    if (filters.highProtein && !recipe.tags.includes('high-protein')) return false
    if (filters.search) {
      const term = filters.search.toLowerCase()
      const name = ((recipe.name.es || '') + ' ' + (recipe.name.en || '') + ' ' + (recipe.description.es || '') + ' ' + (recipe.description.en || '')).toLowerCase()
      if (!name.includes(term)) return false
    }
    return true
  })
}
