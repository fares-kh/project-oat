export interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
  image: string;
  monthlySpecial?: boolean;
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
    price: 0.3,
    description: "Blueberry soaked oats. Topped with a cheesecake drizzle, blueberry compote & biscuit crumble",
    image: '/blueberry.png',
    isSignature: true,
    ingredients: 'Reduced fat soft cheese (26%) (MILK, Salt, Stabilisers: Guar Gum, Carrageenan; Citrus Fibre.), Frozen blueberries (22%), Greek yoghurt (18%) (MILK), OAT milk (13%) (Water, wholegrain OAT flakes, Sunflower Oil, Calcium Carbonate, Sea Salt, Ribofavin (Vitamin B2), Vitamin B12, Vitamin D), OATS (12%), digestive biscuit (4%) (WHEAT Flour, Calcium Carbonate, Iron, Niacin, Thiamin, Palm Oil, Wholemeal WHEAT Four, Sugar, Raising Agents: Sodium Carbonates, Ammonium Carbonates, Partially Inverted Sugar Syrup, Salt), honey (3%), vanilla extract (invert sugar syrup, vanilla extract, water, partially inverted sugar syrup). Made in a kitchen that also handles: gluten, eggs, fish, lupin, milk, peanuts, sesame, soya, sulphur dioxide/sulphites, and tree nuts.'
  },
  {
    id: 'sticky-toffee',
    name: 'Sticky Toffee',
    price: 0.3,
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
    id: 'monthly-special',
    name: 'Fruit & Nut',
    price: 5.95,
    description: "Our monthly special.",
    image: '/monthly-special.png',
    monthlySpecial: true,
    isSignature: true,
    ingredients: 'Chocolate OAT milk (46%) (water, wholegrain OAT, sugar, fat reduced cocoa powder, stabiliser: glean gum; sea salt, acidity regulator: calcium citrates), OATS (18%), Greek yoghurt (18%) (MILK), Trial mix (13%) (Raisins, Sunflower Oil, ALMONDS, Apricot, Rice Flour, Preservative (SULPHUR DIOXIDE), Banana, Coconut Oil, Sucrose, Flavouring, Papaya, Sugar, Preservative (Sodium METABISULPHITE), Desiccated Coconut), mixed nuts (4%) (ALMONDS, CASHEWS, HAZELNUTS, WALNUTS), chocolate sauce (Sweet Freedom® Natural Fruit Extracts (Carob & Apple), Water, Cocoa, Rapeseed Oil, Natural Flavour) May contain: Brazil nuts, macadamia nuts, pecan nuts, pistachio nuts, peanuts, sesame, barley, rye, soya, spelt, wheat & other nuts. Made in a kitchen that also handles: gluten, eggs, fish, lupin, milk, peanuts, sesame, soya, sulphur dioxide/sulphites, and tree nuts.'
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
