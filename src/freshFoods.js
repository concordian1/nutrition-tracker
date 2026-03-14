// freshFoods.js — USDA standard values for common whole foods
// These are pre-loaded into the food database on first run
// Values per listed serving size

export const FRESH_FOODS = [
  // Fruits
  { brand: '', name: 'Banana, medium', type: 'Fresh', upc: '', serving: '1 medium (118g)', calories: 105, protein: 1.3, carbs: 27, fat: 0.4, sugar: 14, fiber: 3.1, sodium: 1, satFat: 0.1, cholesterol: 0, potassium: 422, calcium: 6, iron: 0.3, vitaminD: 0, notes: 'Fresh produce' },
  { brand: '', name: 'Blackberries, fresh', type: 'Fresh', upc: '', serving: '6 oz (170g)', calories: 73, protein: 2.1, carbs: 17.5, fat: 0.9, sugar: 7.1, fiber: 9.1, sodium: 1, satFat: 0, cholesterol: 0, potassium: 233, calcium: 41, iron: 1.1, vitaminD: 0, notes: 'Fresh produce; 1 clamshell = 1 serving' },
  { brand: '', name: 'Blueberries, fresh', type: 'Fresh', upc: '', serving: '1 cup (148g)', calories: 84, protein: 1.1, carbs: 21, fat: 0.5, sugar: 14.7, fiber: 3.6, sodium: 1, satFat: 0, cholesterol: 0, potassium: 114, calcium: 9, iron: 0.4, vitaminD: 0, notes: 'Fresh produce' },
  { brand: '', name: 'Strawberries, fresh', type: 'Fresh', upc: '', serving: '1 cup (152g)', calories: 49, protein: 1, carbs: 12, fat: 0.5, sugar: 7.4, fiber: 3, sodium: 2, satFat: 0, cholesterol: 0, potassium: 233, calcium: 23, iron: 0.6, vitaminD: 0, notes: 'Fresh produce' },
  { brand: '', name: 'Apple, medium', type: 'Fresh', upc: '', serving: '1 medium (182g)', calories: 95, protein: 0.5, carbs: 25, fat: 0.3, sugar: 19, fiber: 4.4, sodium: 2, satFat: 0, cholesterol: 0, potassium: 195, calcium: 11, iron: 0.2, vitaminD: 0, notes: 'Fresh produce' },
  { brand: '', name: 'Orange, medium', type: 'Fresh', upc: '', serving: '1 medium (131g)', calories: 62, protein: 1.2, carbs: 15.4, fat: 0.2, sugar: 12.2, fiber: 3.1, sodium: 0, satFat: 0, cholesterol: 0, potassium: 237, calcium: 52, iron: 0.1, vitaminD: 0, notes: 'Fresh produce' },
  { brand: '', name: 'Grapefruit, red, half', type: 'Fresh', upc: '', serving: 'half (123g)', calories: 52, protein: 0.9, carbs: 13.2, fat: 0.2, sugar: 8.5, fiber: 2, sodium: 0, satFat: 0, cholesterol: 0, potassium: 166, calcium: 27, iron: 0.1, vitaminD: 0, notes: 'Fresh produce' },
  { brand: '', name: 'Avocado, half', type: 'Fresh', upc: '', serving: 'half (68g)', calories: 114, protein: 1.3, carbs: 6, fat: 10.5, sugar: 0.2, fiber: 4.6, sodium: 5, satFat: 1.5, cholesterol: 0, potassium: 345, calcium: 8, iron: 0.3, vitaminD: 0, notes: 'Fresh produce' },

  // Vegetables
  { brand: '', name: 'Broccoli, raw', type: 'Fresh', upc: '', serving: '1 cup chopped (91g)', calories: 31, protein: 2.5, carbs: 6, fat: 0.3, sugar: 1.5, fiber: 2.4, sodium: 30, satFat: 0, cholesterol: 0, potassium: 288, calcium: 43, iron: 0.7, vitaminD: 0, notes: 'Fresh produce' },
  { brand: '', name: 'Spinach, raw', type: 'Fresh', upc: '', serving: '2 cups (60g)', calories: 14, protein: 1.7, carbs: 2.2, fat: 0.2, sugar: 0.2, fiber: 1.3, sodium: 48, satFat: 0, cholesterol: 0, potassium: 334, calcium: 60, iron: 1.6, vitaminD: 0, notes: 'Fresh produce' },
  { brand: '', name: 'Kale, raw', type: 'Fresh', upc: '', serving: '1 cup (21g)', calories: 8, protein: 0.7, carbs: 1, fat: 0.1, sugar: 0.3, fiber: 0.9, sodium: 11, satFat: 0, cholesterol: 0, potassium: 71, calcium: 52, iron: 0.3, vitaminD: 0, notes: 'Fresh produce' },
  { brand: '', name: 'Sweet potato, medium', type: 'Fresh', upc: '', serving: '1 medium (130g)', calories: 112, protein: 2, carbs: 26, fat: 0.1, sugar: 5.4, fiber: 3.9, sodium: 72, satFat: 0, cholesterol: 0, potassium: 541, calcium: 39, iron: 0.8, vitaminD: 0, notes: 'Fresh produce, baked' },
  { brand: '', name: 'Carrot, medium', type: 'Fresh', upc: '', serving: '1 medium (61g)', calories: 25, protein: 0.6, carbs: 6, fat: 0.1, sugar: 2.9, fiber: 1.7, sodium: 42, satFat: 0, cholesterol: 0, potassium: 195, calcium: 20, iron: 0.2, vitaminD: 0, notes: 'Fresh produce' },
  { brand: '', name: 'Bell pepper, red, medium', type: 'Fresh', upc: '', serving: '1 medium (119g)', calories: 37, protein: 1.2, carbs: 7.2, fat: 0.4, sugar: 5, fiber: 2.5, sodium: 6, satFat: 0, cholesterol: 0, potassium: 251, calcium: 8, iron: 0.5, vitaminD: 0, notes: 'Fresh produce' },
  { brand: '', name: 'Cucumber, medium', type: 'Fresh', upc: '', serving: 'half (150g)', calories: 22, protein: 1, carbs: 3.8, fat: 0.2, sugar: 2, fiber: 0.9, sodium: 3, satFat: 0, cholesterol: 0, potassium: 193, calcium: 21, iron: 0.3, vitaminD: 0, notes: 'Fresh produce' },
  { brand: '', name: 'Tomato, medium', type: 'Fresh', upc: '', serving: '1 medium (123g)', calories: 22, protein: 1.1, carbs: 4.8, fat: 0.2, sugar: 3.2, fiber: 1.5, sodium: 6, satFat: 0, cholesterol: 0, potassium: 292, calcium: 12, iron: 0.3, vitaminD: 0, notes: 'Fresh produce' },
  { brand: '', name: 'Zucchini, medium', type: 'Fresh', upc: '', serving: '1 medium (196g)', calories: 33, protein: 2.4, carbs: 6.1, fat: 0.6, sugar: 4.9, fiber: 2, sodium: 16, satFat: 0.1, cholesterol: 0, potassium: 512, calcium: 36, iron: 0.8, vitaminD: 0, notes: 'Fresh produce' },

  // Proteins
  { brand: '', name: 'Salmon, wild, grilled', type: 'Fresh', upc: '', serving: '6 oz (170g)', calories: 280, protein: 38.6, carbs: 0, fat: 13.4, sugar: 0, fiber: 0, sodium: 115, satFat: 2.6, cholesterol: 109, potassium: 628, calcium: 17, iron: 1, vitaminD: 18.2, notes: 'Wild-caught; cooked weight' },
  { brand: '', name: 'Chicken breast, grilled', type: 'Fresh', upc: '', serving: '6 oz (170g)', calories: 280, protein: 53, carbs: 0, fat: 6, sugar: 0, fiber: 0, sodium: 130, satFat: 1.5, cholesterol: 143, potassium: 440, calcium: 15, iron: 1, vitaminD: 0.1, notes: 'Boneless, skinless; cooked weight' },
  { brand: '', name: 'Chicken breast, grilled', type: 'Fresh', upc: '', serving: '4 oz (113g)', calories: 187, protein: 35, carbs: 0, fat: 4, sugar: 0, fiber: 0, sodium: 87, satFat: 1, cholesterol: 95, potassium: 294, calcium: 10, iron: 0.7, vitaminD: 0.1, notes: 'Boneless, skinless; cooked weight' },
  { brand: '', name: 'Shrimp, cooked', type: 'Fresh', upc: '', serving: '4 oz (113g)', calories: 112, protein: 22, carbs: 1, fat: 1.5, sugar: 0, fiber: 0, sodium: 253, satFat: 0.3, cholesterol: 221, potassium: 162, calcium: 52, iron: 0.4, vitaminD: 0, notes: 'Peeled, deveined; cooked weight' },
  { brand: '', name: 'Tilapia, baked', type: 'Fresh', upc: '', serving: '6 oz (170g)', calories: 218, protein: 43.6, carbs: 0, fat: 4.6, sugar: 0, fiber: 0, sodium: 90, satFat: 1.5, cholesterol: 113, potassium: 680, calcium: 17, iron: 0.8, vitaminD: 4, notes: 'Cooked weight' },
  { brand: '', name: 'Turkey breast, sliced', type: 'Fresh', upc: '', serving: '4 oz (113g)', calories: 160, protein: 34, carbs: 0, fat: 2, sugar: 0, fiber: 0, sodium: 70, satFat: 0.5, cholesterol: 95, potassium: 390, calcium: 15, iron: 1.2, vitaminD: 0, notes: 'Roasted, cooked weight' },

  // Grains / Legumes
  { brand: '', name: 'Lentils, cooked', type: 'Fresh', upc: '', serving: '1 cup (198g)', calories: 230, protein: 18, carbs: 40, fat: 0.8, sugar: 3.6, fiber: 15.6, sodium: 4, satFat: 0.1, cholesterol: 0, potassium: 731, calcium: 37, iron: 6.6, vitaminD: 0, notes: 'Green or brown lentils' },
  { brand: '', name: 'Black beans, cooked', type: 'Fresh', upc: '', serving: '1/2 cup (86g)', calories: 114, protein: 7.6, carbs: 20.4, fat: 0.5, sugar: 0.3, fiber: 7.5, sodium: 1, satFat: 0.1, cholesterol: 0, potassium: 305, calcium: 23, iron: 1.8, vitaminD: 0, notes: 'Cooked from dry or canned (drained/rinsed)' },
  { brand: '', name: 'Chickpeas, cooked', type: 'Fresh', upc: '', serving: '1/2 cup (82g)', calories: 134, protein: 7.3, carbs: 22.5, fat: 2.1, sugar: 3.9, fiber: 6.2, sodium: 6, satFat: 0.2, cholesterol: 0, potassium: 239, calcium: 40, iron: 2.4, vitaminD: 0, notes: 'Also called garbanzo beans' },
  { brand: '', name: 'Brown rice, cooked', type: 'Fresh', upc: '', serving: '1 cup (195g)', calories: 216, protein: 5, carbs: 44.8, fat: 1.8, sugar: 0.7, fiber: 3.5, sodium: 10, satFat: 0.4, cholesterol: 0, potassium: 84, calcium: 20, iron: 1, vitaminD: 0, notes: 'Long grain' },
  { brand: '', name: 'Quinoa, cooked', type: 'Fresh', upc: '', serving: '1 cup (185g)', calories: 222, protein: 8.1, carbs: 39.4, fat: 3.6, sugar: 1.6, fiber: 5.2, sodium: 13, satFat: 0.4, cholesterol: 0, potassium: 318, calcium: 31, iron: 2.8, vitaminD: 0, notes: '' },
  { brand: '', name: 'Tofu, firm', type: 'Fresh', upc: '', serving: '4 oz (113g)', calories: 86, protein: 10, carbs: 2, fat: 5, sugar: 0.4, fiber: 0.3, sodium: 8, satFat: 0.7, cholesterol: 0, potassium: 134, calcium: 131, iron: 1.5, vitaminD: 0, notes: 'Raw, packed in water' },

  // Dairy / Eggs
  { brand: '', name: 'Egg, large', type: 'Fresh', upc: '', serving: '1 large (50g)', calories: 70, protein: 6, carbs: 0.6, fat: 5, sugar: 0.6, fiber: 0, sodium: 70, satFat: 1.5, cholesterol: 185, potassium: 69, calcium: 28, iron: 0.9, vitaminD: 1.1, notes: 'Whole egg, any preparation' },
  { brand: '', name: 'Greek yogurt, plain nonfat', type: 'Fresh', upc: '', serving: '3/4 cup (170g)', calories: 90, protein: 16, carbs: 6, fat: 0, sugar: 4, fiber: 0, sodium: 65, satFat: 0, cholesterol: 5, potassium: 240, calcium: 190, iron: 0, vitaminD: 0, notes: 'Generic nonfat plain' },

  // Nuts / Seeds
  { brand: '', name: 'Almonds', type: 'Fresh', upc: '', serving: '1 oz (28g)', calories: 164, protein: 6, carbs: 6.1, fat: 14.2, sugar: 1.2, fiber: 3.5, sodium: 0, satFat: 1.1, cholesterol: 0, potassium: 208, calcium: 76, iron: 1.1, vitaminD: 0, notes: 'Raw, unsalted' },
  { brand: '', name: 'Walnuts', type: 'Fresh', upc: '', serving: '1 oz (28g)', calories: 185, protein: 4.3, carbs: 3.9, fat: 18.5, sugar: 0.7, fiber: 1.9, sodium: 1, satFat: 1.7, cholesterol: 0, potassium: 125, calcium: 28, iron: 0.8, vitaminD: 0, notes: 'Raw, unsalted' },
  { brand: '', name: 'Peanut butter, natural', type: 'Fresh', upc: '', serving: '2 tbsp (32g)', calories: 188, protein: 8, carbs: 7, fat: 16, sugar: 3, fiber: 2, sodium: 5, satFat: 2.3, cholesterol: 0, potassium: 238, calcium: 17, iron: 0.6, vitaminD: 0, notes: 'Just peanuts; no added oil/sugar' },

  // Beverages
  { brand: '', name: 'Coffee, black', type: 'Fresh', upc: '', serving: '12 oz (355ml)', calories: 5, protein: 0.3, carbs: 0, fat: 0, sugar: 0, fiber: 0, sodium: 5, satFat: 0, cholesterol: 0, potassium: 116, calcium: 7, iron: 0.1, vitaminD: 0, notes: 'Brewed, no additions' },
];
