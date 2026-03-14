import { useState, useEffect, useRef } from 'react';
import { searchFoods, addFood, addLogEntry, getFoodByUpc } from '../db.js';
import { lookupUpc, searchUsda, usdaItemToFood } from '../usda.js';

const MEALS = ['Breakfast', 'Lunch', 'Dinner', 'Snack'];
const todayStr = () => new Date().toISOString().slice(0, 10);

export default function FoodSearch({ onDone, selectedDate }) {
  const [query, setQuery]         = useState('');
  const [results, setResults]     = useState([]);
  const [loading, setLoading]     = useState(false);
  const [mode, setMode]           = useState('search'); // 'search' | 'upc'
  const [upcInput, setUpcInput]   = useState('');
  const [selected, setSelected]   = useState(null);
  const [meal, setMeal]           = useState('Breakfast');
  const [servings, setServings]   = useState(1);
  const [status, setStatus]       = useState('');
  const searchRef = useRef();

  // Auto-detect meal based on time of day
  useEffect(() => {
    const h = new Date().getHours();
    if (h < 10)      setMeal('Breakfast');
    else if (h < 14) setMeal('Lunch');
    else if (h < 19) setMeal('Dinner');
    else             setMeal('Snack');
  }, []);

  async function handleSearch() {
    if (!query.trim()) return;
    setLoading(true);
    setResults([]);
    try {
      // Search local DB first
      const local = await searchFoods(query);
      // Also search USDA
      let usda = [];
      try { usda = await searchUsda(query); } catch (e) { /* offline */ }
      // Merge — local first, then USDA items not already in local
      const localUpcs = new Set(local.map(f => f.upc).filter(Boolean));
      const usdaNew   = usda.filter(f => !f.upc || !localUpcs.has(f.upc));
      setResults([...local.map(f => ({ ...f, _local: true })), ...usdaNew.slice(0, 8)]);
    } finally {
      setLoading(false);
    }
  }

  async function handleUpcLookup() {
    const upc = upcInput.trim();
    if (!upc) return;
    setLoading(true);
    setStatus('');
    try {
      // Check local first
      let food = await getFoodByUpc(upc);
      if (!food) {
        const item = await lookupUpc(upc);
        if (!item) { setStatus('UPC not found in USDA database.'); return; }
        food = item;
        food._needsSave = true;
      }
      setSelected({ ...food, _local: !!food.id });
    } catch (e) {
      setStatus(`Lookup failed: ${e.message}`);
    } finally {
      setLoading(false);
    }
  }

  async function handleAdd() {
    if (!selected) return;
    let food = selected;

    // Save to local DB if new
    if (!food.id) {
      const { _needsSave, _local, ...toSave } = food;
      const newId = await addFood(toSave);
      food = { ...toSave, id: newId };
    }

    const numServings = parseFloat(servings) || 1;
    await addLogEntry({
      date:         selectedDate || todayStr(),
      meal,
      foodId:       food.id,
      foodName:     food.name,
      brand:        food.brand || '',
      serving:      food.serving,
      servingLabel: food.serving,
      servings:     numServings,
      // Store per-serving nutrients; DailyLog multiplies by servings
      calories:     food.calories  || 0,
      protein:      food.protein   || 0,
      carbs:        food.carbs     || 0,
      fat:          food.fat       || 0,
      sugar:        food.sugar     || 0,
      fiber:        food.fiber     || 0,
      sodium:       food.sodium    || 0,
      satFat:       food.satFat    || 0,
      cholesterol:  food.cholesterol || 0,
      potassium:    food.potassium || 0,
      calcium:      food.calcium   || 0,
      iron:         food.iron      || 0,
      vitaminD:     food.vitaminD  || 0,
    });

    setStatus(`✓ Added ${food.name} to ${meal}`);
    setSelected(null);
    setQuery('');
    setUpcInput('');
    setResults([]);
    setTimeout(() => { setStatus(''); onDone(); }, 1200);
  }

  return (
    <div className="screen">
      <h2 className="screen-title">Add Food</h2>

      {/* Mode toggle */}
      <div className="mode-toggle">
        <button className={mode === 'search' ? 'active' : ''} onClick={() => setMode('search')}>Search</button>
        <button className={mode === 'upc'    ? 'active' : ''} onClick={() => setMode('upc')}>UPC Code</button>
      </div>

      {/* Search mode */}
      {mode === 'search' && (
        <div className="search-area">
          <div className="search-row">
            <input
              ref={searchRef}
              className="search-input"
              type="text"
              placeholder="Search foods…"
              value={query}
              onChange={e => setQuery(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSearch()}
            />
            <button className="btn-primary" onClick={handleSearch} disabled={loading}>
              {loading ? '…' : 'Search'}
            </button>
          </div>
          <div className="results-list">
            {results.map((food, i) => (
              <FoodResult
                key={i}
                food={food}
                onSelect={() => setSelected(food)}
                selected={selected?.name === food.name && selected?.brand === food.brand}
              />
            ))}
          </div>
        </div>
      )}

      {/* UPC mode */}
      {mode === 'upc' && (
        <div className="search-area">
          <p className="upc-hint">Type or paste a UPC code. (To scan with camera, use the Claude chat → upload barcode photo → I'll give you the code.)</p>
          <div className="search-row">
            <input
              className="search-input"
              type="text"
              inputMode="numeric"
              placeholder="e.g. 003000056231"
              value={upcInput}
              onChange={e => setUpcInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleUpcLookup()}
            />
            <button className="btn-primary" onClick={handleUpcLookup} disabled={loading || !upcInput.trim()}>
              {loading ? '…' : 'Look Up'}
            </button>
          </div>
          {selected && mode === 'upc' && (
            <FoodResult food={selected} selected={true} onSelect={() => {}} />
          )}
        </div>
      )}

      {status && <div className={`status-msg ${status.startsWith('✓') ? 'success' : 'error'}`}>{status}</div>}

      {/* Add panel */}
      {selected && (
        <div className="add-panel">
          <div className="add-panel-name">{selected.name}</div>
          {selected.brand && <div className="add-panel-brand">{selected.brand}</div>}

          <div className="add-panel-row">
            <label>Meal</label>
            <div className="meal-chips">
              {MEALS.map(m => (
                <button key={m} className={`chip ${meal === m ? 'active' : ''}`} onClick={() => setMeal(m)}>{m}</button>
              ))}
            </div>
          </div>

          <div className="add-panel-row">
            <label>Servings</label>
            <div className="servings-row">
              <button className="srv-btn" onClick={() => setServings(s => Math.max(0.25, parseFloat(s) - 0.25))}>−</button>
              <input className="srv-input" type="number" min="0.25" step="0.25" value={servings}
                onChange={e => setServings(e.target.value)} />
              <button className="srv-btn" onClick={() => setServings(s => parseFloat(s) + 0.25)}>+</button>
              <span className="srv-label">{selected.serving}</span>
            </div>
          </div>

          <div className="add-panel-macros">
            {[['Cal', selected.calories], ['Pro', selected.protein + 'g'], ['Carb', selected.carbs + 'g'], ['Fat', selected.fat + 'g']].map(([l, v]) => (
              <div key={l} className="add-macro">
                <div className="add-macro-val">{Math.round((parseFloat(v) || 0) * (parseFloat(servings) || 1))}{typeof v === 'string' && v.includes('g') ? 'g' : ''}</div>
                <div className="add-macro-label">{l}</div>
              </div>
            ))}
          </div>

          <button className="btn-primary btn-full" onClick={handleAdd}>
            Add to {meal}
          </button>
        </div>
      )}
    </div>
  );
}

function FoodResult({ food, onSelect, selected }) {
  return (
    <button className={`food-result ${selected ? 'selected' : ''}`} onClick={onSelect}>
      <div className="fr-left">
        <span className="fr-name">{food.name}</span>
        {food.brand && <span className="fr-brand">{food.brand}</span>}
        <span className="fr-serving">{food.serving}</span>
      </div>
      <div className="fr-right">
        <span className="fr-cal">{food.calories}</span>
        <span className="fr-cal-label">cal</span>
      </div>
    </button>
  );
}
