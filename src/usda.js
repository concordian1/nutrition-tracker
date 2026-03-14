// usda.js — USDA FoodData Central API
const API_KEY = 'Y7uH1bLGUgVCHas5iQ2SJRV4PG1iibibjoAzFvho';
const BASE = 'https://api.nal.usda.gov/fdc/v1';

const NUTRIENT_IDS = {
  calories:     1008,
  protein:      1003,
  carbs:        1005,
  fat:          1004,
  sugar:        2000,
  fiber:        1079,
  sodium:       1093,
  satFat:       1258,
  cholesterol:  1253,
  potassium:    1092,
  calcium:      1087,
  iron:         1089,
  vitaminD:     1114,
};

const ID_TO_KEY = Object.fromEntries(
  Object.entries(NUTRIENT_IDS).map(([k, v]) => [v, k])
);

function parseNutrients(foodNutrients = []) {
  const out = Object.fromEntries(Object.keys(NUTRIENT_IDS).map(k => [k, 0]));
  for (const n of foodNutrients) {
    const key = ID_TO_KEY[n.nutrientId];
    if (key) out[key] = Math.round(n.value * 10) / 10;
  }
  return out;
}

export function usdaItemToFood(item) {
  const nutrients = parseNutrients(item.foodNutrients);
  const serving = item.servingSize
    ? `${item.servingSize}${item.servingSizeUnit || 'g'}`
    : '1 serving';
  return {
    brand:  item.brandOwner || item.brandName || '',
    name:   item.description || 'Unknown',
    type:   'Staple',
    upc:    item.gtinUpc || '',
    serving,
    ...nutrients,
    notes:  item.brandedFoodCategory || '',
    source: 'usda',
  };
}

export async function lookupUpc(upc) {
  const url = `${BASE}/foods/search?query=${encodeURIComponent(upc)}&dataType=Branded&pageSize=1&api_key=${API_KEY}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`USDA API error: ${res.status}`);
  const data = await res.json();
  if (!data.foods?.length) return null;
  return usdaItemToFood(data.foods[0]);
}

export async function searchUsda(query) {
  const url = `${BASE}/foods/search?query=${encodeURIComponent(query)}&dataType=Branded,SR Legacy&pageSize=10&api_key=${API_KEY}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`USDA API error: ${res.status}`);
  const data = await res.json();
  return (data.foods || []).map(usdaItemToFood);
}
