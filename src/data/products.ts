export interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
  image: string;
  monthlySpecial?: boolean;
  exclusiveDelivery?: boolean;
  availableFrom?: string;
  availableUntil?: string;
  isSignature?: boolean; // If true, pre-made bowl with optional extras only
  ingredients: string;
}

export interface OatSoaking {
  id: string;
  name: string;
  isGlutenFree?: boolean;
}

export interface Topping {
  id: string;
  name: string;
  category: 'fresh-fruit' | 'spreads' | 'crunch-factor' | 'fibre-boost' | 'sweet-touch' | 'extras';
  price?: number; // Optional price, for extras
}

export const oatSoakingOptions: OatSoaking[] = [
  { id: 'dairy-yoghurt', name: 'Dairy Greek yoghurt' },
  { id: 'coconut-yoghurt', name: 'Plant-based coconut yoghurt', isGlutenFree: true }
];

export const toppingOptions: Topping[] = [
  { id: 'banana', name: 'Banana', category: 'fresh-fruit' },
  { id: 'strawberry', name: 'Strawberry', category: 'fresh-fruit' },
  { id: 'apple', name: 'Apple', category: 'fresh-fruit' },
  { id: 'raspberry', name: 'Raspberry', category: 'fresh-fruit' },
  
  { id: 'peanut-butter', name: 'Peanut butter', category: 'spreads' },
  { id: 'almond-butter', name: 'Almond butter', category: 'spreads' },
  { id: 'nutella', name: 'Nutella', category: 'spreads' },
  
  { id: 'cacao-nibs', name: 'Cacao nibs', category: 'crunch-factor' },
  { id: 'granola', name: 'Homemade granola', category: 'crunch-factor' },
  
  { id: 'chia-seeds', name: 'Chia seeds', category: 'fibre-boost' },
  { id: 'goji-berries', name: 'Goji berries', category: 'fibre-boost' },
  { id: 'mixed-seeds', name: 'Mixed seeds', category: 'fibre-boost' },
  
  { id: 'honey', name: 'Honey', category: 'sweet-touch' },
  { id: 'cinnamon', name: 'Cinnamon', category: 'sweet-touch' },
  { id: 'dark-choc-chips', name: 'Dark Choc Chips', category: 'sweet-touch' },
  
  { id: 'protein-vanilla', name: 'Protein powder (vanilla)', category: 'extras', price: 1.00 },
  { id: 'protein-chocolate', name: 'Protein powder (chocolate)', category: 'extras', price: 1.00 },
  { id: 'matcha-powder', name: 'Matcha powder', category: 'extras', price: 1.00 }
];

export const toppingCategories = [
  { id: 'fresh-fruit', name: 'Fresh Fruit' },
  { id: 'spreads', name: 'Spreads' },
  { id: 'crunch-factor', name: 'Crunch Factor' },
  { id: 'fibre-boost', name: 'Fibre Boost' },
  { id: 'sweet-touch', name: 'Sweet Touch' },
  { id: 'extras', name: 'Extras - £1' }
];

export const products: Product[] = [
  {
    id: 'blueberry-cheesecake',
    name: 'Blueberry Cheesecake',
    price: 5.95,
    description: "Blueberry soaked oats. Topped with a cheesecake drizzle, blueberry compote & biscuit crumble",
    image: '/blueberry.png',
    isSignature: true,
    ingredients: 'Reduced fat soft cheese (26%) (MILK, Salt, Stabilisers: Guar Gum, Carrageenan; Citrus Fibre.), Frozen blueberries (22%), Greek yoghurt (18%) (MILK), OAT milk (13%) (Water, wholegrain OAT flakes, Sunflower Oil, Calcium Carbonate, Sea Salt, Ribofavin (Vitamin B2), Vitamin B12, Vitamin D), OATS (12%), digestive biscuit (4%) (WHEAT Flour, Calcium Carbonate, Iron, Niacin, Thiamin, Palm Oil, Wholemeal WHEAT Four, Sugar, Raising Agents: Sodium Carbonates, Ammonium Carbonates, Partially Inverted Sugar Syrup, Salt), honey (3%), vanilla extract (invert sugar syrup, vanilla extract, water, partially inverted sugar syrup). Made in a kitchen that also handles: gluten, eggs, fish, lupin, milk, peanuts, sesame, soya, sulphur dioxide/sulphites, and tree nuts.'
  },
  {
    id: 'sticky-toffee',
    name: 'Sticky Toffee',
    price: 5.95,
    description: "Date soaked oats, made with oat milk & Greek yoghurt. Topped with banana, cacao nibs, greek yoghurt & chopped dates.",
    image: '/sticky-toffee.png',
    isSignature: true,
    ingredients: 'OAT milk (37%) (Water, wholegrain OAT flakes, Sunflower Oil, Calcium Carbonate, Sea Salt, Ribofavin (Vitamin B2), Vitamin B12, Vitamin D), Greek yoghurt (19%) (MILK), OATS (16%), Pitted dogleg nour dates (12%), Banana (11%), chia [salvia hispanica] seeds, cocoa nibs [theobroma cacao], lemon juice (lemon Juice from Concentrate [Water, Concentrated Lemon Juice], Lemon Oil, Preservative (Potassium METABISULPHITE)). May contain: Almonds, Brazil nuts, cashews, hazelnuts, macadamia nuts, pecan nuts, pistachio nuts, walnuts, peanuts & sesame. Made in a kitchen that also handles: gluten, eggs, fish, lupin, milk, peanuts, sesame, soya, sulphur dioxide/sulphites, and tree nuts.'
  },
  {
    id: 'apple-of-my-eye',
    name: 'Apple of My Eye',
    price: 5.95,
    description: "Apple & cinnamon soaked oats made with oat milk & Greek yoghurt. Topped with sliced apple, peanut butter, homemade granola & mixed seeds.",
    image: '/apple-of-my-eye.png',
    isSignature: true,
    ingredients: 'Greek yoghurt (24%) (MILK), Apple (22%), Apple juice (18%), OAT milk (14%) (Water, wholegrain OAT flakes, Sunflower Oil, Calcium Carbonate, Sea Salt, Ribofavin (Vitamin B2), Vitamin B12, Vitamin D), OATS (9%), Granola (4%) (OAT Flakes, ALMONDS, CASHEWS, HAZELNUTS, WALNUTS, pumpkin seeds, sunflower seeds, golden linseeds, hemp seeds, pumpkin seeds, partially inverted sugar syrup, pink rock salt crystals & ground cinnamon (cassia)), PEANUT butter (5%) (roasted PEANUTS), honey, cinnamon (cassia), salt, chia [salvia hispanica] seeds, lemon juice (lemon Juice from Concentrate [Water, Concentrated Lemon Juice], Lemon Oil, Preservative (Potassium METABISULPHITE)). May contain: Brazil nuts, macadamia nuts, pecan nuts, pistachio nuts & sesame. Made in a kitchen that also handles: gluten, eggs, fish, lupin, milk, peanuts, sesame, soya, sulphur dioxide/sulphites, and tree nuts.'
  },
  {
    id: 'jam-dodger',
    name: 'Jam Dodger',
    price: 5.95,
    description: "Raspberry-soaked oats. Topped with raspberry jam, shortbread crumble and a min jam dodger biscuit",
    image: '/jam-dodger.png',
    availableFrom: '2026-05-08',
    isSignature: true,
    ingredients: 'Soft cheese (19.2%) (Reduced Fat Soft Cheese (MILK), Salt, Stabilisers: Guar Gum, Carrageenan; Citrus Fibre), OAT milk (17.4%) (Water, fermented wholegrain OAT flakes, sunflower oil, calcium citrates, sea salt, riboflavin, vitamin D, vitamin B12, calcium carbonate, vitamin B2, rapeseed oil, acidity regulators: potassium phosphates, diphosphates, triphosphates), Greek yoghurt (17.4%) (Natural yoghurt (MILK), yoghurt cultures (l. bulgarians, s. thermophiles)), OATS (15.7%), Raspberry jam (17.4%) (Ammonium Carbonates, Sodium Carbonates; Salt, Flavouring), Frozen raspberries (7%), shortbread (WHEAT Flour, Calcium Carbonate, Iron, Niacin, Thiamin, butter (MILK), Sugar, Confour, Salt), jam biscuit (WHEAT Flour, Calcium Carbonate, Iron. Niacin, Thiamin, Glucose-Fructose Syrup, Apple Extract (contains SULPHITES), Sugar, Concentrated Apple Puree, Humectant: Glycerol; gelling Agent: Pectins; Acidity Regulator: Sodium Citrates; Flavouring, Colour: Anthocyanins; Acid: Citric Acid, Sugar, Palm Oil, Rapseed Oil, Partially Inverted Sugar Syrup, Raising Agents: Ammonium Carbonates, Sodium Carbonates; Salt, Flavouring), vanilla extract (invert sugar syrup, vanilla extract, water, partially inverted sugar syrup). '
  },
  {
    id: 'monthly-special',
    name: 'Mini Egg Protein Bowl',
    price: 5.95,
    description: "White chocolate flavoured oats soaked in Greek yoghurt, oat milk & crushed mini eggs. Topped with a white chocolate protein layer and a sprinkle of mini eggs.",
    image: '/monthly-special.png',
    monthlySpecial: true,
    availableFrom: '2026-04-01',
    availableUntil: '2026-04-30',
    isSignature: true,
    ingredients: 'OATS (13.2%), OAT milk (17.6%) (water, organic gluten free OATS, organic rapeseed oil, potassium carbonate, salt), 0% fat natural Greek yogurt (26.5%) (MILK), Reduced Fat Soft Cheese (23.5%) (MILK, Salt, Stabilisers: Guar Gum, Carrageenan; Citrus Fibre), chocolate eggs (17.7%) (Sugar, Cocoa Butter, Dried Skimmed MILK, Cocoa Mass, Dried Whey (MILK), Lactose (MILK), Butter Oil (MILK), Tapioca Starch; Plant and Vegetable Extracts (Carrot Concentrate, Safflower Concentrate, Spirulina Concentrate, Beetroot Concentrate), Emulsifier (SOYA Lecithin), Vanilla Flavouring, Colours (Titanium Dioxide, Curcumin), Caramelised Sugar), protein powder (WHEY protein concentrate (MILK), flavouring, thickener (xanthan gum), emulsifier (sunflower lecithin), sweetener (sucralose)), flavouring (Water, Sweetener (Sucralose), Flavouring, Colour (Plain Caramel)). Made in a kitchen that also handles: gluten, eggs, fish, lupin, milk, peanuts, sesame, soya, sulphur dioxide/sulphites, and tree nuts.'
  },
  {
    id: 'monthly-special-may',
    name: 'Biscoff Protein Oat Bowl',
    price: 5.95,
    description: "Packed with 24g of protein - Biscoff soaked oats topped with yoghurt, a Biscoff drizzle & crumbled caramelised biscuit.",
    image: '/monthly-special-may.png',
    monthlySpecial: true,
    availableFrom: '2026-05-01',
    availableUntil: '2026-05-31',
    isSignature: true,
    ingredients: 'Greek yoghurt (30.82%) (MILK), reduced fat soft cheese (23.97%) (MILK, Salt, Stabilisers: Guar Gum, Carrageenan; Citrus Fibre.), OAT milk (20.55%) (water, organic OATS, organic rapeseed oil, potassium carbonate, salt), OATS (15.41%), caramelised biscuit spread (5.14%) (Caramelised Biscuit (58%) [WHEAT Flour, Sugar, Palm Oil, Sugar Syrup, Rapeseed Oil, Raising Agent (Sodium Bicarbonate), Salt, Cinnamon], Emulsifier (Sunflower Lecithins), WHEAT Protein, OAT Flour, Acidity Regulator (Citric Acid), Antioxidant (Tocopherol-Rich Extract)), caramelised biscuit protein powder (1.71%) (Protein Blend (Whey Protein Concentrate (MILK) (contains Emulsifiers (SOYA Lecithin, Sunflower Lecithin)), Micellar Casein (MILK)), Creatine Monohydrate, Flavourings, Thickener (Xanthan Gum), Sweeteners (Sucralose, Acesulfame K)), caramelised biscuit (WHEAT Flour, Sugar, Palm Oil, Icing Sugar, Rapeseed Oil, Caramelised Sugar Syrup, Salt, Raising Agent (Sodium Bicarbonate), Emulsifier (Lecithins), Potato Starch, Caramelised Sugar, Cinnamon), caramelised biscuit sugar-free syrup (Water, Flavouring, Salt, Acid (Lactic Acid), Colour (Caramel), Sweetener (Sucralose), Preservatives (Potassium Sorbate, Sodium benzoate). May contain: egg, peanuts & nuts. Made in a kitchen that also handles: gluten, eggs, fish, lupin, milk, peanuts, sesame, soya, sulphur dioxide/sulphites, and tree nuts.'
  },
  {
    id: 'exclusive-delivery',
    name: 'Raspberry Cheesecake',
    price: 5.95,
    description: "Raspberry soaked oats. Topped with a cheesecake drizzle, raspberries & biscuit crumble.",
    image: '/exclusive-april.png',
    isSignature: true,
    exclusiveDelivery: true,
    availableFrom: '2026-04-01',
    availableUntil: '2026-04-30',
    ingredients: 'Reduced fat soft cheese (26%) (MILK, Salt, Stabilisers: Guar Gum, Carrageenan; Citrus Fibre.), Frozen raspberries (22%), Greek yoghurt (18%) (MILK), OAT milk (13%) (water, organic OATS, organic rapeseed oil, potassium carbonate, salt), OATS (12%), digestive biscuit (4%) (WHEAT Flour, Calcium Carbonate, Iron, Niacin, Thiamin, Palm Oil, Wholemeal WHEAT Four, Sugar, Raising Agents: Sodium Carbonates, Ammonium Carbonates, Partially Inverted Sugar Syrup, Salt), honey (3%), vanilla extract (invert sugar syrup, vanilla extract, water, partially inverted sugar syrup). Made in a kitchen that also handles: gluten, eggs, fish, lupin, milk, peanuts, sesame, soya, sulphur dioxide/sulphites, and tree nuts.'
  },
  {
    id: 'exclusive-delivery-may',
    name: 'Raspberry & White Chocolate Cheesecake',
    price: 5.95,
    description: "Fuelling your day with 24g of protein - oats soaked in Greek yoghurt, raspberries, white chocolate flavouring & low-fat soft cheese. Topped with a biscuit crumble.",
    image: '/exclusive-april.png',
    isSignature: true,
    exclusiveDelivery: true,
    availableFrom: '2026-05-01',
    availableUntil: '2026-05-31',
    ingredients: 'Reduced fat soft cheese (26%) (MILK, Salt, Stabilisers: Guar Gum, Carrageenan; Citrus Fibre.), frozen raspberries (22%), Greek yoghurt (18%) (MILK), OAT milk (13%) (water, organic OATS, organic rapeseed oil, potassium carbonate, salt), OATS (12%), digestive biscuit (4%) (WHEAT Flour, Calcium Carbonate, Iron, Niacin, Thiamin, Palm Oil, Wholemeal WHEAT Four, Sugar, Raising Agents: Sodium Carbonates, Ammonium Carbonates, Partially Inverted Sugar Syrup, Salt), honey (3%), vanilla extract (invert sugar syrup, vanilla extract, water, partially inverted sugar syrup), flavouring (Water, Sweetener (Sucralose), Flavouring, Colour (Plain Caramel)). Allergy advice: For allergens, see ingredients in BOLD CAPITALS. Made in a kitchen that also handles, eggs, fish, lupin, peanuts, sesame, soya, sulphur dioxide/sulphites and tree nuts.'
  },
  {
    id: 'build-your-own',
    name: 'Build Your Own',
    price: 5.95,
    description: "Create your perfect bowl! Choose your base and pick 4 toppings. Extra toppings available for £1 each.",
    image: '/byob.png',
    isSignature: false,
    ingredients: 'Dairy (base only): OAT milk (42%) (Water, wholegrain OAT flakes, Sunflower Oil, Calcium Carbonate, Sea Salt, Ribofavin (Vitamin B2), Vitamin B12, Vitamin D), Greek yoghurt (38%) (MILK), OATS (19%), vanilla extract (invert sugar syrup, vanilla extract, water, partially inverted sugar syrup). Plant-based coconut (base only): OAT milk (40%) (Water, wholegrain OAT flakes, Sunflower Oil, Calcium Carbonate, Sea Salt, Ribofavin (Vitamin B2), Vitamin B12, Vitamin D), coconut yoghurt (40%) (Water, Hulled SOYA beans, Coconut milk (Water, Coconut cream) Sugar Calcium (Tri-calcium citrate) Stabiliser (Pectins) Acidity regulators (Sodium citrates, Citric acid) Natural flavourings Sea salt Antioxidants (Tocopherol-rich extract, Fatty acid esters of ascorbic acid) Vitamins B6 B12 D2 Live cultures (S. thermophilus, L. bulgaricus), OATS (20%). May contain traces of nuts. Made in a kitchen that also handles: gluten, eggs, fish, lupin, milk, peanuts, sesame, soya, sulphur dioxide/sulphites, and tree nuts.'
  }
];
