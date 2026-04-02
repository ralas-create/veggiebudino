/**
 * SIBO/FODMAP/Low-Fructose restrictions based on
 * Dr. Barbara Ciccantelli (Plant Based Clinic)
 * Document: "Testa aggiornamento" - Sept 2025 / Feb 2026 update
 *
 * Three layers:
 * 1. FODMAP light: don't accumulate high-FODMAP foods in same meal
 * 2. Low fructose: specific allowed/forbidden foods (fructose breath test positive)
 * 3. General rules: portions, frequencies, supplements
 */

// === ALLOWED FOODS (Low-FODMAP + Low-Fructose combined) ===

export const allowedFoods = {
  fruits: [
    'banane (non mature)', 'mirtilli', 'lamponi', 'fragole', 'uva',
    'meloni', 'kiwi', 'limoni', 'arance', 'mandarini',
    'frutti della passione', 'papaya', 'rabarbaro', 'lime',
    'ananas', 'cocco', 'mapo'
  ],
  vegetables: [
    'zucchine', 'carote', 'melanzane', 'fagiolini', 'peperoni verdi',
    'cavolo riccio', 'sedano', 'indivia belga', 'pomodori (max 65g)',
    'lattuga romana', 'rucola', 'zucca', 'patate', 'spinaci',
    'rapa', 'fagioli verdi', 'germogli di bamboo', 'germogli di fagioli',
    'bok choi', 'barbabietole', 'erba cipollina', 'pastinaca',
    'ravanelli', 'patate dolci/boniato', 'cime di rapa', 'cavolo rosso',
    'finocchio', 'zenzero', 'bietole (parte verde)'
  ],
  grains: [
    'riso (tutte le varietà)', 'avena', 'mais', 'miglio',
    'quinoa', 'grano saraceno', 'sorgo', 'tapioca', 'teff',
    'polenta', 'pasta di mais', 'pasta di legumi', 'piadina di mais'
  ],
  proteins: [
    'tofu (150g)', 'tempeh (80g)',
    'legumi in scatola (50-60g cotti)',
    'seitan (150g)'
  ],
  nutsSeeds: [
    'mandorle (max 10 unità)', 'macadamia', 'arachidi',
    'noci pecan', 'noci brasiliane', 'noci',
    'semi di girasole', 'semi di zucca', 'semi di sesamo',
    'tahini (max 10g)', 'crema di mandorle'
  ],
  drinks: [
    'bevanda di mandorla (senza zuccheri)',
    'bevanda di canapa', 'bevanda di riso',
    'bevanda di macadamia', 'bevanda di cocco',
    'latte di soia (da proteine, non fagiolo intero)',
    'caffè (max 3/die)', 'tè (max 3/die)'
  ],
  fats: [
    'olio di oliva extravergine (20-30g/die = 2-3 cucchiai)',
    'olio di lino spremuto a freddo (1 cucchiaio/die per omega-3)'
  ],
  sweeteners: [
    'stevia', 'zucchero di canna (piccole quantità)'
  ]
}

// === FORBIDDEN / HIGH-CAUTION FOODS ===

export const forbiddenFoods = {
  fruits: [
    'mele', 'pere', 'cachi', 'mango', 'fichi',
    'banana matura', 'anguria', 'pompelmo', 'melograno',
    'ciliegie', 'prugne', 'pesche bianche',
    'frutta essiccata (prugne, uvetta, datteri)',
    'frutta sciroppata', 'succhi di frutta (tutti)'
  ],
  vegetables: [
    'carciofi', 'asparagi', 'broccoli', 'porri (parte bianca)',
    'funghi', 'okra', 'cipolle', 'aglio',
    'pisellini', 'peperoni rossi', 'scalogni',
    'concentrato di pomodoro', 'pomodori pelati/ketchup', 'taccole'
  ],
  grains: [
    'grano/frumento e derivati (pasta di grano, pane di grano)',
    'segale', 'orzo', 'farro',
    'cereali dolcificati con sciroppo di fruttosio'
  ],
  nutsSeeds: [
    'anacardi', 'pistacchi'
  ],
  sweeteners: [
    'sciroppo d\'agave', 'miele', 'fruttosio',
    'sciroppo di mais', 'sorbitolo E420',
    'mannitolo E421', 'isomalto E953',
    'maltitolo E965', 'xilitolo E967'
  ],
  drinks: [
    'succhi di frutta', 'bevande con sciroppo di fruttosio',
    'bevande gassate', 'bevande alcoliche (eccetto vino/birra moderati)',
    'vini dolci', 'rum', 'orzo (bevanda)', 'cicoria'
  ],
  general: [
    'alimenti ultraprocessati (max 1/settimana)',
    'cibi molto speziati',
    'gomme da masticare',
    'alimenti insufflati d\'aria (gelati, creme, mousse, frappè)',
    'cibi amidacei ricotti o raffreddati'
  ]
}

// === PORTION RULES ===

export const portionRules = {
  es: {
    cereals: 'Pranzo: 60g cereale seco / Cena: 70g pasta o cereale. Equivalencias: 100g pasta = 350g patatas = 220g ñoquis = 90-100g pan',
    protein: 'Tofu: 150g | Tempeh: 80g | Legumbres cocidas: 120g (en conserva, bien escurridas) | Seitan: 150g. Legumbres idealmente 1x/día, derivados soja max 2x/día',
    vegetables: 'Verduras cocidas: 200g | Crudas: 100g. Adaptar según tolerancia individual. Alternar crudas y cocidas.',
    fruit: 'Max 2 porciones/día (125g cada una). Elegir de la lista baja en fructosa.',
    nuts: '20g/día total. Repartir entre comidas. Evitar anacardos y pistachos.',
    omega3: 'Aceite de lino prensado en frío: 1 cucharada/día. O semillas de lino/chía molidas: 2 cucharadas (15g).',
    calcium: 'Incluir fuentes de calcio varias veces al día: bebidas vegetales con calcio, tofu, tempeh, sésamo, almendras, verduras verdes.',
    oil: 'Aceite de oliva: 20-30g/día (2-3 cucharadas). Se puede usar en cocción y en crudo.',
    water: 'Mínimo 1.5L agua/día. Evitar bebidas gassosas.',
    coffee: 'Max 3 cafés o tés al día. Intentar reducir el azúcar añadido.',
    supplements: 'B12: 1000mcg/día (1 mes) luego 2x/semana. Vitamina D: 2000 UI/día.',
    exercise: 'Objetivo: 3 entrenamientos/semana (cardio + pesas). Yoga recomendado.',
    calories: '1500-1600 kcal/día. Proteínas: 60-70g/día.'
  },
  en: {
    cereals: 'Lunch: 60g dry cereal / Dinner: 70g pasta or cereal. Equivalences: 100g pasta = 350g potatoes = 220g gnocchi = 90-100g bread',
    protein: 'Tofu: 150g | Tempeh: 80g | Cooked legumes: 120g (canned, well drained) | Seitan: 150g. Legumes ideally 1x/day, soy derivatives max 2x/day',
    vegetables: 'Cooked vegetables: 200g | Raw: 100g. Adjust to individual tolerance. Alternate raw and cooked.',
    fruit: 'Max 2 portions/day (125g each). Choose from low-fructose list.',
    nuts: '20g/day total. Spread across meals. Avoid cashews and pistachios.',
    omega3: 'Cold-pressed flax oil: 1 tbsp/day. Or ground flax/chia seeds: 2 tbsp (15g).',
    calcium: 'Include calcium sources multiple times daily: calcium-fortified plant milks, tofu, tempeh, sesame, almonds, green vegetables.',
    oil: 'Olive oil: 20-30g/day (2-3 tbsp). Can be used for cooking and raw.',
    water: 'Minimum 1.5L water/day. Avoid carbonated drinks.',
    coffee: 'Max 3 coffees or teas per day. Try to reduce added sugar.',
    supplements: 'B12: 1000mcg/day (1 month) then 2x/week. Vitamin D: 2000 IU/day.',
    exercise: 'Goal: 3 workouts/week (cardio + weights). Yoga recommended.',
    calories: '1500-1600 kcal/day. Protein: 60-70g/day.'
  }
}

// === NUTRITIONIST RECIPES (from the document) ===

export const nutriRecipes = {
  es: [
    { name: 'Pasta con pesto de edamame y calabacín', desc: 'Pasta de maíz o legumbres con pesto de edamame (120g, triturados con ½ cucharada de AOVE) y calabacines salteados.' },
    { name: 'Fagiolini al vapor con tofu', desc: 'Judías verdes al vapor, tofu salteado en sartén y pan.' },
    { name: 'Crema de calabaza con lentejas', desc: 'Crema de calabaza (150-200g) con lentejas decorticadas (cocer todo junto y triturar). Añadir mijo, trigo sarraceno o quinoa cocidos.' },
    { name: 'Piadina de maíz con hummus', desc: 'Piadina de maíz con hummus de garbanzos (triturar con limón y tahini ~10g), rúcula (30g) y tomates cherry (60g) o calabacines cocidos.' },
    { name: 'Pasta de maíz/legumbres con calabacín y rúcula', desc: 'Pasta de maíz o de legumbres (porción equivalente a secos) con calabacines y rúcula.' },
    { name: 'Crema de zanahorias y jengibre', desc: 'Dorar aceite con jengibre rallado, añadir 200g zanahorias y 150g patatas. Cubrir con agua/caldo, cocer y triturar. Añadir garbanzos cocidos y AOVE crudo.' },
    { name: 'Sopa de mijo con acelgas y garbanzos', desc: 'Sofrito con aceite y zanahorias (+ parte verde de cebolleta). Añadir parte verde de acelgas y garbanzos cocidos (120g). Cubrir con agua/caldo. Cuando tierno, añadir mijo cocido.' },
    { name: 'Piadina de maíz con hummus, hinojo y zanahoria', desc: 'Piadina con hummus, hinojo crudo (75g) y zanahorias crudas (100g). 1 cucharada AOVE.' },
    { name: 'Ensalada templada de trigo sarraceno', desc: 'Trigo sarraceno cocido con calabacines a la plancha, garbanzos (120g) y AOVE (también en citronette). Se puede sustituir por mijo o quinoa.' },
    { name: 'Bowl caliente de tofu, arroz y verduras', desc: 'Marinar tofu (jengibre, miso, salsa de soja, cúrcuma). Dorar parte verde de cebolleta/puerro con zanahoria y acelgas (100g). Añadir arroz, agua (2x volumen) y cocer 10 min. Añadir tofu marinado los últimos 2 min.' },
  ],
  en: [
    { name: 'Pasta with edamame pesto and zucchini', desc: 'Corn or legume pasta with edamame pesto (120g, blended with ½ tbsp EVOO) and sautéed zucchini.' },
    { name: 'Steamed green beans with tofu', desc: 'Steamed green beans, pan-fried tofu and bread.' },
    { name: 'Pumpkin cream with lentils', desc: 'Pumpkin cream (150-200g) with hulled lentils (cook together and blend). Add cooked millet, buckwheat or quinoa.' },
    { name: 'Corn flatbread with hummus', desc: 'Corn flatbread with chickpea hummus (blend with lemon and tahini ~10g), arugula (30g) and cherry tomatoes (60g) or cooked zucchini.' },
    { name: 'Corn/legume pasta with zucchini and arugula', desc: 'Corn or legume pasta (equivalent portion) with zucchini and arugula.' },
    { name: 'Carrot and ginger soup', desc: 'Brown oil with grated ginger, add 200g carrots and 150g potatoes. Cover with water/broth, cook and blend. Add cooked chickpeas and raw EVOO.' },
    { name: 'Millet soup with chard and chickpeas', desc: 'Sauté with oil and carrots (+ green part of scallion). Add green chard and cooked chickpeas (120g). Cover with broth. When tender, add cooked millet.' },
    { name: 'Corn flatbread with hummus, fennel and carrot', desc: 'Flatbread with hummus, raw fennel (75g) and raw carrots (100g). 1 tbsp EVOO.' },
    { name: 'Warm buckwheat salad', desc: 'Cooked buckwheat with grilled zucchini, chickpeas (120g) and EVOO citronette. Can sub with millet or quinoa.' },
    { name: 'Warm tofu, rice and vegetable bowl', desc: 'Marinate tofu (ginger, miso, soy sauce, turmeric). Sauté green scallion/leek with carrot and chard (100g). Add rice, water (2x volume), cook 10 min. Add marinated tofu last 2 min.' },
  ]
}

// === MEAL PLAN TEMPLATE (from nutritionist) ===

export const mealPlanTemplate = {
  es: {
    breakfast: {
      title: 'Desayuno',
      options: [
        'Porridge de avena (30g) con bebida de soja con calcio, 1 cucharadita de crema de almendras y mirtilli/lamponi/banana',
        'Yogur de soja con calcio + granola de trigo sarraceno o mijo inflado o copos de maíz (sin azúcares). Añadir kiwi o naranja.',
      ]
    },
    snack1: {
      title: 'Tentempié mañana',
      options: ['1 fruta (de la lista baja en fructosa) + 10g almendras (10 unidades) o frutos secos (sin anacardos ni pistachos)']
    },
    lunch: {
      title: 'Comida',
      main: 'Arroz basmati blanco u otro cereal sin gluten: 60g',
      protein: 'Tofu 150g / Legumbres en conserva ~120g cocidas / Tempeh 80g / Seitan 150g',
      side: 'Verduras según tolerancia',
      fat: '1 cucharada AOVE o aceite de lino (~10g)'
    },
    snack2: {
      title: 'Merienda',
      options: [
        '1 fruta + frutos secos',
        'Yogur de soja con fruta y semillas',
        '10g chocolate negro fondant'
      ]
    },
    dinner: {
      title: 'Cena',
      main: 'Pasta o cereal en grano: 70g / Pan: 100g / Cuscús, bulgur: 70g / Patatas: 250g (max 2x/semana)',
      protein: 'Legumbres 120g cocidas o alternativa proteica como comida',
      side: 'Verduras según tolerancia',
      fat: '1 cucharada AOVE o aceite de lino (~10g)'
    }
  },
  en: {
    breakfast: {
      title: 'Breakfast',
      options: [
        'Oat porridge (30g) with calcium soy milk, 1 tsp almond butter and blueberries/raspberries/banana',
        'Soy yogurt with calcium + buckwheat granola or puffed millet or corn flakes (no added sugar). Add kiwi or orange.',
      ]
    },
    snack1: {
      title: 'Morning snack',
      options: ['1 fruit (from low-fructose list) + 10g almonds (10 units) or nuts (no cashews or pistachios)']
    },
    lunch: {
      title: 'Lunch',
      main: 'White basmati rice or other GF cereal: 60g',
      protein: 'Tofu 150g / Canned legumes ~120g cooked / Tempeh 80g / Seitan 150g',
      side: 'Vegetables per tolerance',
      fat: '1 tbsp EVOO or flax oil (~10g)'
    },
    snack2: {
      title: 'Afternoon snack',
      options: [
        '1 fruit + nuts',
        'Soy yogurt with fruit and seeds',
        '10g dark chocolate'
      ]
    },
    dinner: {
      title: 'Dinner',
      main: 'Pasta or grain: 70g / Bread: 100g / Couscous, bulgur: 70g / Potatoes: 250g (max 2x/week)',
      protein: 'Legumes 120g cooked or protein alternative as lunch',
      side: 'Vegetables per tolerance',
      fat: '1 tbsp EVOO or flax oil (~10g)'
    }
  }
}

// === INGREDIENT CHECKER ===
// Returns { allowed: bool, warning: string|null } for a given ingredient name

// Words that ALLOW an ingredient even if it contains a forbidden keyword
const allowedExceptions = [
  'ajo infusionado', 'garlic-infused', 'garlic infused', 'infused oil',
  'harina de garbanzo', 'chickpea flour', 'harina de garbanzos',
  'parte verde', 'green part', 'green tops', 'green only',
  'cebolleta', 'cebollino', 'scallion', 'green onion', 'chive',
  'bajo en fodmap', 'low-fodmap', 'low fodmap',
  'tomates cherry', 'cherry tomato', 'pomodorini', 'tomate cherry',
]

const forbiddenKeywords = [
  'cebolla', 'onion', 'cipolla',
  'ajo', 'garlic', 'aglio',
  'brócoli', 'broccoli',
  'champiñón', 'seta', 'mushroom', 'funghi',
  'puerro', 'leek', 'porro',
  'manzana', 'apple', 'mela',
  'pera', 'pear',
  'mango',
  'higo', 'fig', 'fico',
  'cereza', 'cherry', 'ciliegia',
  'melocotón', 'peach', 'pesca',
  'ciruela', 'plum', 'prugna',
  'anacardo', 'cashew',
  'pistacho', 'pistachio',
  'miel', 'honey', 'miele',
  'agave',
  'trigo', 'wheat', 'grano', 'frumento',
  'centeno', 'rye', 'segale',
  'cebada', 'barley', 'orzo',
  'espelta', 'spelt', 'farro',
  'alcachofa', 'artichoke', 'carciofo',
  'espárrago', 'asparagus', 'asparago',
  'guisante', 'pea ', 'pisell',
  'pimiento rojo', 'red pepper', 'peperone rosso',
  'concentrado de tomate', 'tomato paste', 'concentrato di pomodoro',
  'ketchup',
]

const warningKeywords = [
  { keyword: 'tomate', warning: 'Max 65g tomate / Max 65g tomato' },
  { keyword: 'tomato', warning: 'Max 65g tomato' },
  { keyword: 'legumbre', warning: 'Solo en conserva, max 50-60g cotti / Only canned, max 50-60g cooked' },
  { keyword: 'garbanzo', warning: 'Solo en conserva y bien escurridos / Only canned and well drained' },
  { keyword: 'chickpea', warning: 'Only canned and well drained' },
  { keyword: 'lenteja', warning: 'Preferir decorticadas o en conserva / Prefer hulled or canned' },
  { keyword: 'lentil', warning: 'Prefer hulled or canned' },
  { keyword: 'alubia', warning: 'Solo en conserva / Only canned' },
  { keyword: 'bean', warning: 'Only canned' },
  { keyword: 'avena', warning: 'Max 30g / preferir no integral si hay molestias' },
  { keyword: 'oat', warning: 'Max 30g / prefer non-wholegrain if discomfort' },
]

export function checkIngredient(name) {
  const lower = name.toLowerCase()

  // Check exceptions first — these override forbidden keywords
  for (const exc of allowedExceptions) {
    if (lower.includes(exc)) {
      return { allowed: true, warning: null }
    }
  }

  for (const kw of forbiddenKeywords) {
    if (lower.includes(kw)) {
      return { allowed: false, warning: `Evitar: ${name}` }
    }
  }

  for (const { keyword, warning } of warningKeywords) {
    if (lower.includes(keyword)) {
      return { allowed: true, warning }
    }
  }

  return { allowed: true, warning: null }
}

// Check a full recipe against SIBO rules
export function checkRecipeSIBO(recipe) {
  const issues = []
  let hasForbidden = false

  for (const ing of recipe.ingredients) {
    const nameEs = ing.name.es || ''
    const nameEn = ing.name.en || ''
    const resultEs = checkIngredient(nameEs)
    const resultEn = checkIngredient(nameEn)

    if (!resultEs.allowed || !resultEn.allowed) {
      hasForbidden = true
      issues.push({ ingredient: nameEs, type: 'forbidden', warning: resultEs.warning || resultEn.warning })
    } else if (resultEs.warning || resultEn.warning) {
      issues.push({ ingredient: nameEs, type: 'caution', warning: resultEs.warning || resultEn.warning })
    }
  }

  return {
    siboSafe: !hasForbidden,
    issues
  }
}
