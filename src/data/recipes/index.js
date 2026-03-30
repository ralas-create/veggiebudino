import recipes from './all-recipes.json'

function getCustomRecipes() {
  try {
    return JSON.parse(localStorage.getItem('veggiebudino-custom-recipes')) || []
  } catch {
    return []
  }
}

function getAllRecipes() {
  return [...recipes, ...getCustomRecipes()]
}

const allRecipes = recipes // static export for imports that need the array

export default allRecipes

export function getAllRecipesWithCustom() {
  return getAllRecipes()
}

export function getRecipeById(id) {
  return getAllRecipes().find(r => r.id === id)
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
