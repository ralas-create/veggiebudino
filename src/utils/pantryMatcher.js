/**
 * Scores a recipe based on how many of the user's pantry items it uses.
 * Fuzzy matching: "tofu" matches "Tofu firme", "calabacin" matches "Calabacín", etc.
 */

function normalize(str) {
  return str.toLowerCase()
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '') // remove accents
    .replace(/[^a-z0-9 ]/g, '') // remove special chars
    .trim()
}

export function scoreRecipeByPantry(recipe, pantryItems) {
  if (!pantryItems || pantryItems.length === 0) return 0

  const normalizedPantry = pantryItems.map(normalize)

  let matches = 0
  for (const ing of recipe.ingredients) {
    const ingNameEs = normalize(ing.name.es || '')
    const ingNameEn = normalize(ing.name.en || '')

    for (const pantryItem of normalizedPantry) {
      if (pantryItem.length < 2) continue
      if (ingNameEs.includes(pantryItem) || pantryItem.includes(ingNameEs.split(' ')[0]) ||
          ingNameEn.includes(pantryItem) || pantryItem.includes(ingNameEn.split(' ')[0])) {
        matches++
        break // count each ingredient only once
      }
    }
  }

  return matches
}

// Common ingredients for quick-add suggestions
export const commonIngredients = {
  es: [
    // Proteins
    'Tofu', 'Tempeh', 'Seitan', 'Garbanzos', 'Lentejas', 'Alubias', 'Edamame',
    // Grains
    'Arroz', 'Pasta', 'Quinoa', 'Mijo', 'Trigo sarraceno', 'Avena', 'Pan', 'Polenta', 'Cuscús',
    // Vegetables
    'Calabacín', 'Zanahoria', 'Espinacas', 'Patata', 'Boniato', 'Calabaza', 'Berenjena',
    'Judías verdes', 'Rúcula', 'Lechuga', 'Tomates cherry', 'Pimiento verde', 'Bok choy',
    'Brócoli', 'Acelgas', 'Kale', 'Hinojo', 'Pepino',
    // Pantry
    'Aceite de oliva', 'Tamari', 'Tahini', 'Mantequilla de cacahuete', 'Leche de coco',
    'Levadura nutricional', 'Miso', 'Salsa de soja', 'Sirope de arce',
    // Nuts/seeds
    'Almendras', 'Nueces', 'Semillas de calabaza', 'Semillas de sésamo', 'Cacahuetes',
    // Fruits
    'Plátano', 'Limón', 'Lima', 'Kiwi', 'Naranja',
  ],
  en: [
    'Tofu', 'Tempeh', 'Seitan', 'Chickpeas', 'Lentils', 'Beans', 'Edamame',
    'Rice', 'Pasta', 'Quinoa', 'Millet', 'Buckwheat', 'Oats', 'Bread', 'Polenta', 'Couscous',
    'Zucchini', 'Carrot', 'Spinach', 'Potato', 'Sweet potato', 'Pumpkin', 'Eggplant',
    'Green beans', 'Arugula', 'Lettuce', 'Cherry tomatoes', 'Green pepper', 'Bok choy',
    'Broccoli', 'Chard', 'Kale', 'Fennel', 'Cucumber',
    'Olive oil', 'Tamari', 'Tahini', 'Peanut butter', 'Coconut milk',
    'Nutritional yeast', 'Miso', 'Soy sauce', 'Maple syrup',
    'Almonds', 'Walnuts', 'Pumpkin seeds', 'Sesame seeds', 'Peanuts',
    'Banana', 'Lemon', 'Lime', 'Kiwi', 'Orange',
  ]
}
