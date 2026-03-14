import { useState, useEffect, useRef } from 'react';
import { searchFoods, addFood, addLogEntry, getFoodByUpc } from '../db.js';
import { lookupUpc, searchUsda } from '../usda.js';
import BarcodeScanner from './BarcodeScanner.jsx';

const MEALS = ['Breakfast', 'Lunch', 'Dinner', 'Snack'];
const todayStr = () => new Date().toISOString().slice(0, 10);

export default function FoodSearch({ onDone, selectedDate }) {
  const [mode, setMode]           = useState('search');
  const [query, setQuery]         = useState('');
  const [upcInput, setUpcInput]   = useState('');
  const [results, setResults]     = useState([]);
  const [loading, setLoading]     = useState(false);
  const [selected, setSelected]   = useState(null);
  const [meal, setMeal]           = useState('Breakfast');
  const [servings, setServings]   = useState(1);
  const [status, setStatus]       = useState('');
  const [showScanner, setShowScanner] = useState(false);
  const fileRef = useRef();

  useEffect(() => {
    const h = new Date().getHours();
    if (h < 10) setMeal('Breakfast');
    else if (h < 14) setMeal('Lunch');
    else if (h < 19) setMeal('Dinner');
    else setMeal('Snack');
  }, []);

  async function handleSearch() {
    if (!query.trim()) return;
    setLoading(true); setResults([]); setSelected(null);
    try {
      const local = await searchFoods(query);
      let usda = [];
      try { usda = await searchUsda(query); } catch (_) {}
      const localUpcs = new Set(local.map(f => f.upc).filter(Boolean));
      const usdaNew = usda.filter(f => !f.upc || !localUpcs.has(f.upc));
      setResults([...local.map(f => ({ ...f, _local: true })), ...usdaNew.slice(0, 8)]);
    } finally {
      setLoading(false);
    }
  }

  async function handleUpcLookup(upc) {
    const code = (upc || upcInput).trim();
    if (!code) return;
    setLoading(true); setStatus('Looking up ' + code + '…'); setSelected(null);
    try {
      let food = await getFoodByUpc(code);
      if (!food) {
        const item = await lookupUpc(code);
        if (!item) { setStatus('UPC not found in USDA database.'); return; }
        food = { ...item, _needsSave: true };
      }
      setSelected(food); setStatus('');
    } catch (e) {
      setStatus('Lookup failed: ' + e.message);
    } finally {
      setLoading(false);
    }
  }

  function handleScanDetected(upc) {
    setShowScanner(false);
    setUpcInput(upc);
    setMode('upc');
    handleUpcLookup(upc);
  }

  function handlePhotoChange(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    setStatus('Photo selected — enter the UPC code visible on the label below.');
  }

  async function handleAdd() {
    if (!selected) return;
    let food = selected;
    if (!food.id) {
      const { _needsSave, _local, ...toSave } = food;
      const newId = await addFood(toSave);
      food = { ...toSave, id: newId };
    }
    const numServings = parseFloat(servings) || 1;
    await addLogEntry({
      date: selectedDate || todayStr(), meal,
      foodId: food.id, foodName: food.name, brand: food.brand || '',
      serving: food.serving, servingLabel: food.serving, servings: numServings,
      calories: food.calories || 0, protein: food.protein || 0,
      carbs: food.carbs || 0, fat: food.fat || 0,
      sugar: food.sugar || 0, fiber: food.fiber || 0,
      sodium: food.sodium || 0, satFat: food.satFat || 0,
      cholesterol: food.cholesterol || 0, potassium: food.potassium || 0,
      calcium: food.calcium || 0, iron: food.iron || 0, vitaminD: food.vitaminD || 0,
    });
    setStatus('Added to ' + meal);
    setSelected(null); setQuery(''); setUpcInput(''); setResults([]);
    setTimeout(() => { setStatus(''); onDone(); }, 1000);
  }

  function switchMode(m) { setMode(m); setSelected(null); setStatus(''); setResults([]); }

  return (
    <div className="screen">
      {showScanner && (
        <BarcodeScanner onDetected={handleScanDetected} onClose={() => setShowScanner(false)} />
      )}

      <h2 className="screen-title">Add Food</h2>

      <div className="mode-toggle">
        <button className={mode === 'search' ? 'active' : ''} onClick={() => switchMode('search')}>Search</button>
        <button className={mode === 'upc'    ? 'active' : ''} onClick={() => switchMode('upc')}>UPC</button>
        <button className={mode === 'photo'  ? 'active' : ''} onClick={() => switchMode('photo')}>Photo</button>
      </div>

      {mode === 'search' && (
        <div className="search-area">
          <div className="search-row">
            <input className="search-input" type="text" placeholder="Search foods…"
              value={query} onChange={e => setQuery(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSearch()} autoFocus />
            <button className="btn-primary" onClick={handleSearch} disabled={loading || !query.trim()}>
              {loading ? '…' : 'Search'}
            </button>
          </div>
          <div className="results-list">
            {results.map((food, i) => (
              <FoodResult key={i} food={food}
                selected={selected?.name === food.name && selected?.brand === food.brand}
                onSelect={() => { setSelected(food); setResults([]); }} />
            ))}
          </div>
        </div>
      )}

      {mode === 'upc' && (
        <div className="search-area">
          <button className="scan-btn" onClick={() => setShowScanner(true)}>
            <span className="scan-icon">▦</span>
            <span>Scan Barcode</span>
            <span className="scan-sub">Tap to open camera viewfinder</span>
          </button>
          <div className="upc-divider"><span>or enter UPC manually</span></div>
          <div className="search-row">
            <input className="search-input" type="text" inputMode="numeric"
              placeholder="e.g. 003000056231"
              value={upcInput} onChange={e => setUpcInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleUpcLookup()} />
            <button className="btn-primary" onClick={() => handleUpcLookup()}
              disabled={loading || !upcInput.trim()}>
              {loading ? '…' : 'Look Up'}
            </button>
          </div>
        </div>
      )}

      {mode === 'photo' && (
        <div className="search-area">
          <div className="photo-hint">
            <p>Upload a photo of the barcode label. Works best when the UPC number is clearly visible. You may need to type the number manually.</p>
          </div>
          <input ref={fileRef} type="file" accept="image/*"
            style={{ display: 'none' }} onChange={handlePhotoChange} />
          <button className="scan-btn" onClick={() => fileRef.current?.click()}>
            <span className="scan-icon">📷</span>
            <span>Choose Photo</span>
            <span className="scan-sub">Camera roll or take new photo</span>
          </button>
          {status && (
            <>
              <p style={{ fontSize: 13, color: 'var(--muted)', marginTop: 8 }}>{status}</p>
              <div className="search-row" style={{ marginTop: 8 }}>
                <input className="search-input" type="text" inputMode="numeric"
                  placeholder="UPC from label"
                  value={upcInput} onChange={e => setUpcInput(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleUpcLookup()} />
                <button className="btn-primary" onClick={() => handleUpcLookup()}
                  disabled={loading || !upcInput.trim()}>
                  {loading ? '…' : 'Look Up'}
                </button>
              </div>
            </>
          )}
        </div>
      )}

      {status && !status.includes('Photo') && !status.includes('selected') && (
        <div className={`status-msg ${status.startsWith('Added') ? 'success' : 'error'}`}>
          {status}
        </div>
      )}

      {selected && (
        <div className="add-panel">
          <div className="add-panel-name">{selected.name}</div>
          {selected.brand && <div className="add-panel-brand">{selected.brand}</div>}
          <div className="add-panel-row">
            <label>Meal</label>
            <div className="meal-chips">
              {MEALS.map(m => (
                <button key={m} className={`chip ${meal === m ? 'active' : ''}`}
                  onClick={() => setMeal(m)}>{m}</button>
              ))}
            </div>
          </div>
          <div className="add-panel-row">
            <label>Servings</label>
            <div className="servings-row">
              <button className="srv-btn"
                onClick={() => setServings(s => Math.max(0.25, parseFloat(s) - 0.25))}>−</button>
              <input className="srv-input" type="number" min="0.25" step="0.25"
                value={servings} onChange={e => setServings(e.target.value)} />
              <button className="srv-btn"
                onClick={() => setServings(s => parseFloat(s) + 0.25)}>+</button>
              <span className="srv-label">{selected.serving}</span>
            </div>
          </div>
          <div className="add-panel-macros">
            {[['Cal','',selected.calories],['Pro','g',selected.protein],['Carb','g',selected.carbs],['Fat','g',selected.fat]].map(([l,u,v]) => (
              <div key={l} className="add-macro">
                <div className="add-macro-val">{Math.round((parseFloat(v)||0)*(parseFloat(servings)||1))}{u}</div>
                <div className="add-macro-label">{l}</div>
              </div>
            ))}
          </div>
          <button className="btn-primary btn-full" onClick={handleAdd}>Add to {meal}</button>
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
