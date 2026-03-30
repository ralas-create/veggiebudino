// Free images from Unsplash for recipe cards
// Using Unsplash Source API with food-related keywords
// Format: https://images.unsplash.com/photo-ID?w=400&h=300&fit=crop

const images = {
  'mb-01': 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=400&h=250&fit=crop', // fried rice
  'mb-02': 'https://images.unsplash.com/photo-1559314809-0d155014e29e?w=400&h=250&fit=crop', // pad thai
  'mb-03': 'https://images.unsplash.com/photo-1592007354459-4932c54b1a48?w=400&h=250&fit=crop', // pesto
  'mb-04': 'https://images.unsplash.com/photo-1547592166-23ac45744acd?w=400&h=250&fit=crop', // butternut squash soup
  'mb-05': 'https://images.unsplash.com/photo-1551326844-4df70f78d0e9?w=400&h=250&fit=crop', // tacos
  'fok-01': 'https://images.unsplash.com/photo-1455619452474-d2be8b1e70cd?w=400&h=250&fit=crop', // chili
  'fok-02': 'https://images.unsplash.com/photo-1547592180-85f173990554?w=400&h=250&fit=crop', // minestrone
  'mb-06': 'https://images.unsplash.com/photo-1574894709920-11b28e7367e3?w=400&h=250&fit=crop', // lasagna
  'mb-07': 'https://images.unsplash.com/photo-1550317138-10000687a72b?w=400&h=250&fit=crop', // veggie burger
  'aby-01': 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&h=250&fit=crop', // nourishing bowl
  'aby-02': 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&h=250&fit=crop', // tofu plate
  'aby-03': 'https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=400&h=250&fit=crop', // pasta pesto
  'aby-04': 'https://images.unsplash.com/photo-1622973536968-3ead9e780960?w=400&h=250&fit=crop', // spaghetti bolognese
  'aby-05': 'https://images.unsplash.com/photo-1529006557810-274b9b2fc783?w=400&h=250&fit=crop', // falafel wrap
  'fe-01': 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=400&h=250&fit=crop', // taco salad
  'mn-01': 'https://images.unsplash.com/photo-1476718406336-bb5a9690ee2a?w=400&h=250&fit=crop', // carrot soup
  'mn-02': 'https://images.unsplash.com/photo-1607330289024-1535c6b4e1c1?w=400&h=250&fit=crop', // miso soup
  'mn-03': 'https://images.unsplash.com/photo-1569058242567-93de6f36f8e6?w=400&h=250&fit=crop', // stir fry noodles
  'mn-04': 'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=400&h=250&fit=crop', // tacos
  'mn-05': 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&h=250&fit=crop', // rice bowl
  'mn-06': 'https://images.unsplash.com/photo-1543339308-d595c4974584?w=400&h=250&fit=crop', // roasted tempeh
  'mn-07': 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=400&h=250&fit=crop', // quinoa bowl
  'mn-08': 'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=400&h=250&fit=crop', // tabbouleh
  'mn-09': 'https://images.unsplash.com/photo-1553621042-f6e147245754?w=400&h=250&fit=crop', // summer rolls
  'mn-10': 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400&h=250&fit=crop', // polenta
  'mn-11': 'https://images.unsplash.com/photo-1517673400267-0251440c45dc?w=400&h=250&fit=crop', // overnight oats
  'mn-12': 'https://images.unsplash.com/photo-1518977956812-cd3dbadaaf31?w=400&h=250&fit=crop', // smashed potatoes
  'mn-13': 'https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?w=400&h=250&fit=crop', // roasted carrots
  'mn-14': 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&h=250&fit=crop', // salad
  'mn-15': 'https://images.unsplash.com/photo-1455619452474-d2be8b1e70cd?w=400&h=250&fit=crop', // curry
  'mn-16': 'https://images.unsplash.com/photo-1563379926898-05f4575a45d8?w=400&h=250&fit=crop', // creamy pasta
  'mn-17': 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=400&h=250&fit=crop', // dhal
  'mn-18': 'https://images.unsplash.com/photo-1512852939750-1305098529bf?w=400&h=250&fit=crop', // lettuce wraps
  'mn-19': 'https://images.unsplash.com/photo-1547592166-23ac45744acd?w=400&h=250&fit=crop', // zucchini soup
  'mn-20': 'https://images.unsplash.com/photo-1525351484163-7529414344d8?w=400&h=250&fit=crop', // avocado toast
  'mn-21': 'https://images.unsplash.com/photo-1517673400267-0251440c45dc?w=400&h=250&fit=crop', // porridge
  'mn-22': 'https://images.unsplash.com/photo-1543339308-d595c4974584?w=400&h=250&fit=crop', // tempeh stir fry
  'mn-23': 'https://images.unsplash.com/photo-1505576399279-0d4e81a22bf7?w=400&h=250&fit=crop', // quinoa salad
  'mn-24': 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&h=250&fit=crop', // chickpea couscous
  'mn-25': 'https://images.unsplash.com/photo-1476718406336-bb5a9690ee2a?w=400&h=250&fit=crop', // potato leek soup
}

export function getRecipeImage(id) {
  return images[id] || null
}

export default images
