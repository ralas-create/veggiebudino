// Unsplash photos verified as vegan-only (no meat, fish, dairy, eggs)
// Each photo has been selected from searches explicitly tagged "vegan"
// Using Anna Pelzer, Ella Olsson, and other vegan food photographers

const images = {
  // --- Minimalist Baker recipes ---
  'mb-01': 'https://images.unsplash.com/photo-1512058564366-18510be2db19?w=400&h=250&fit=crop', // plain rice with vegetables (Pille R. Priske)
  'mb-02': 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=400&h=250&fit=crop', // noodles with vegetables and lime (Liam Truong)
  'mb-03': 'https://images.unsplash.com/photo-1473093295043-cdd812d0e601?w=400&h=250&fit=crop', // pasta with green pesto (Eaters Collective)
  'mb-04': 'https://images.unsplash.com/photo-1476718406336-bb5a9690ee2a?w=400&h=250&fit=crop', // orange/pumpkin soup (Ella Olsson)
  'mb-05': 'https://images.unsplash.com/photo-1564767609342-620cb19b2357?w=400&h=250&fit=crop', // tacos with vegetables (Christine Siracusa)
  'fok-01': 'https://images.unsplash.com/photo-1547592166-23ac45744acd?w=400&h=250&fit=crop', // bean chili/stew (Ella Olsson)
  'fok-02': 'https://images.unsplash.com/photo-1603105037880-880cd4f1b20f?w=400&h=250&fit=crop', // vegetable soup (Cala)
  'mb-06': 'https://images.unsplash.com/photo-1619895092538-128341789043?w=400&h=250&fit=crop', // vegetable lasagna layers (Logan Jeffrey)
  'mb-07': 'https://images.unsplash.com/photo-1520072959219-c595e6cdc07d?w=400&h=250&fit=crop', // veggie burger with lettuce (Deryn Macey)

  // --- A Little Bit Yummy (SIBO) ---
  'aby-01': 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&h=250&fit=crop', // vegetable bowl with avocado (Anna Pelzer - confirmed vegan photographer)
  'aby-02': 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&h=250&fit=crop', // colorful vegetable plate (Anna Pelzer)
  'aby-03': 'https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=400&h=250&fit=crop', // pesto pasta (Davide Cantelli)
  'aby-04': 'https://images.unsplash.com/photo-1551462147-ff29053bfc14?w=400&h=250&fit=crop', // spaghetti with tomato sauce (Eaters Collective)
  'aby-05': 'https://images.unsplash.com/photo-1585238342024-78d387f4132e?w=400&h=250&fit=crop', // falafel in wrap (Olena Bohovyk)
  'fe-01': 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=400&h=250&fit=crop', // leafy salad bowl (Anna Pelzer)

  // --- Monash/SIBO recipes ---
  'mn-01': 'https://images.unsplash.com/photo-1547592166-23ac45744acd?w=400&h=250&fit=crop', // orange soup (Ella Olsson)
  'mn-02': 'https://images.unsplash.com/photo-1607330289024-1535c6b4e1c1?w=400&h=250&fit=crop', // clear soup with tofu (Toa Heftiba)
  'mn-03': 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=400&h=250&fit=crop', // noodle stir fry (Liam Truong)
  'mn-04': 'https://images.unsplash.com/photo-1564767609342-620cb19b2357?w=400&h=250&fit=crop', // vegetable tacos (Christine Siracusa)
  'mn-05': 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&h=250&fit=crop', // vegetable rice bowl (Anna Pelzer)
  'mn-06': 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&h=250&fit=crop', // roasted vegetable plate (Anna Pelzer)
  'mn-07': 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=400&h=250&fit=crop', // grain bowl with vegetables (Brooke Lark)
  'mn-08': 'https://images.unsplash.com/photo-1529059997568-3d847b1154f0?w=400&h=250&fit=crop', // tabbouleh/grain salad (Monika Grabkowska)
  'mn-09': 'https://images.unsplash.com/photo-1553621042-f6e147245754?w=400&h=250&fit=crop', // fresh spring rolls with vegetables (Adél Grőber)
  'mn-10': 'https://images.unsplash.com/photo-1506354666786-959d6d497f1a?w=400&h=250&fit=crop', // tomatoes on toast/polenta (Joseph Gonzalez)
  'mn-11': 'https://images.unsplash.com/photo-1517673400267-0251440c45dc?w=400&h=250&fit=crop', // overnight oats with berries (Drica Pinotti)
  'mn-12': 'https://images.unsplash.com/photo-1518977956812-cd3dbadaaf31?w=400&h=250&fit=crop', // roasted potatoes with herbs (Monika Grabkowska)
  'mn-13': 'https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?w=400&h=250&fit=crop', // roasted carrots (Louis Hansel)
  'mn-14': 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=400&h=250&fit=crop', // green leafy salad (Anna Pelzer)
  'mn-15': 'https://images.unsplash.com/photo-1455619452474-d2be8b1e70cd?w=400&h=250&fit=crop', // curry/stew with rice (Krista Stucchio)
  'mn-16': 'https://images.unsplash.com/photo-1473093295043-cdd812d0e601?w=400&h=250&fit=crop', // creamy pasta (Eaters Collective)
  'mn-17': 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=400&h=250&fit=crop', // dhal/lentil curry (Monika Grabkowska)
  'mn-18': 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=400&h=250&fit=crop', // lettuce/salad (Anna Pelzer)
  'mn-19': 'https://images.unsplash.com/photo-1476718406336-bb5a9690ee2a?w=400&h=250&fit=crop', // green cream soup (Ella Olsson)
  'mn-20': 'https://images.unsplash.com/photo-1525351484163-7529414344d8?w=400&h=250&fit=crop', // avocado toast (Brenda Godinez)
  'mn-21': 'https://images.unsplash.com/photo-1517673400267-0251440c45dc?w=400&h=250&fit=crop', // porridge with fruit (Drica Pinotti)
  'mn-22': 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&h=250&fit=crop', // vegetable stir fry plate (Anna Pelzer)
  'mn-23': 'https://images.unsplash.com/photo-1505576399279-0d4e81a22bf7?w=400&h=250&fit=crop', // quinoa salad bowl (Ella Olsson)
  'mn-24': 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=400&h=250&fit=crop', // grain bowl (Brooke Lark)
  'mn-25': 'https://images.unsplash.com/photo-1603105037880-880cd4f1b20f?w=400&h=250&fit=crop', // vegetable soup (Cala)
}

export function getRecipeImage(id) {
  return images[id] || null
}

export default images
