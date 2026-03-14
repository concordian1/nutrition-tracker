import { useState, useEffect, useCallback } from 'react';
import { getLogByDate, deleteLogEntry, copyLogFromDate } from '../db.js';

const MEALS = ['Breakfast', 'Lunch', 'Dinner', 'Snack'];
const NUTRIENT_KEYS = ['calories', 'protein', 'carbs', 'fat', 'fiber', 'sodium'];
const NUTRIENT_LABELS = { calories: 'Cal', protein: 'Protein', carbs: 'Carbs', fat: 'Fat', fiber: 'Fiber', sodium: 'Sodium' };
const NUTRIENT_UNITS  = { calories: '', protein: 'g', carbs: 'g', fat: 'g', fiber: 'g', sodium: 'mg' };

function fmt(date) {
  const d = new Date(date + 'T12:00:00');
  const today = new Date(); today.setHours(12,0,0,0);
  const diff  = Math.round((d - today) / 86400000);
  if (diff === 0)  return 'Today';
  if (diff === -1) return 'Yesterday';
  if (diff === 1)  return 'Tomorrow';
  return d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
}

function prevDay(date) {
  const d = new Date(date + 'T12:00:00');
  d.setDate(d.getDate() - 1);
  return d.toISOString().slice(0, 10);
}
function nextDay(date) {
  const d = new Date(date + 'T12:00:00');
  d.setDate(d.getDate() + 1);
  return d.toISOString().slice(0, 10);
}

function sumNutrients(entries) {
  const totals = Object.fromEntries(NUTRIENT_KEYS.map(k => [k, 0]));
  for (const e of entries) {
    for (const k of NUTRIENT_KEYS) {
      totals[k] += (e[k] || 0) * (e.servings || 1);
    }
  }
  return totals;
}

function round1(n) { return Math.round(n * 10) / 10; }

export default function DailyLog({ goals, selectedDate, setSelectedDate }) {
  const [entries, setEntries]     = useState([]);
  const [loading, setLoading]     = useState(true);
  const [expanded, setExpanded]   = useState({});
  const [copyMsg, setCopyMsg]     = useState('');

  const load = useCallback(async () => {
    setLoading(true);
    const data = await getLogByDate(selectedDate);
    setEntries(data.sort((a, b) => {
      const mi = MEALS.indexOf(a.meal) - MEALS.indexOf(b.meal);
      return mi !== 0 ? mi : (a.loggedAt || 0) - (b.loggedAt || 0);
    }));
    setLoading(false);
  }, [selectedDate]);

  useEffect(() => { load(); }, [load]);

  async function handleDelete(id) {
    if (!confirm('Remove this entry?')) return;
    await deleteLogEntry(id);
    load();
  }

  async function handleCopyFromYesterday() {
    const from = prevDay(selectedDate);
    const count = await copyLogFromDate(from, selectedDate);
    if (count === 0) {
      setCopyMsg('Nothing logged yesterday.');
    } else {
      setCopyMsg(`Copied ${count} entries from yesterday.`);
      load();
    }
    setTimeout(() => setCopyMsg(''), 3000);
  }

  const totals = sumNutrients(entries);
  const today  = new Date().toISOString().slice(0, 10);
  const isToday = selectedDate === today;

  const byMeal = {};
  for (const m of MEALS) byMeal[m] = entries.filter(e => e.meal === m);

  return (
    <div className="screen">
      {/* Date nav */}
      <div className="date-nav">
        <button className="date-arrow" onClick={() => setSelectedDate(prevDay(selectedDate))}>‹</button>
        <span className="date-label">{fmt(selectedDate)}</span>
        <button className="date-arrow" onClick={() => setSelectedDate(nextDay(selectedDate))} disabled={isToday}>›</button>
      </div>

      {/* Macro summary bar */}
      <div className="macro-bar">
        {NUTRIENT_KEYS.map(k => {
          const val  = round1(totals[k]);
          const goal = goals[k] || 0;
          const pct  = goal ? Math.min(100, Math.round((val / goal) * 100)) : 0;
          const over = goal && val > goal;
          return (
            <div key={k} className="macro-cell">
              <div className={`macro-val ${over ? 'over' : ''}`}>{val}{NUTRIENT_UNITS[k]}</div>
              <div className="macro-goal">/ {goal}{NUTRIENT_UNITS[k]}</div>
              <div className="macro-bar-track">
                <div className={`macro-bar-fill ${over ? 'over' : ''}`} style={{ width: `${pct}%` }} />
              </div>
              <div className="macro-label">{NUTRIENT_LABELS[k]}</div>
            </div>
          );
        })}
      </div>

      {/* Calorie ring summary */}
      <div className="cal-summary">
        <CalRing consumed={round1(totals.calories)} goal={goals.calories} />
        <div className="cal-detail">
          <div className="cal-remaining">
            {Math.max(0, goals.calories - round1(totals.calories))} cal remaining
          </div>
          <div className="cal-sub">{round1(totals.calories)} consumed · {goals.calories} goal</div>
        </div>
      </div>

      {/* Meal sections */}
      {loading ? (
        <div className="loading">Loading…</div>
      ) : (
        <div className="meals">
          {MEALS.map(meal => (
            <MealSection
              key={meal}
              meal={meal}
              entries={byMeal[meal]}
              expanded={expanded[meal]}
              onToggle={() => setExpanded(p => ({ ...p, [meal]: !p[meal] }))}
              onDelete={handleDelete}
            />
          ))}

          {entries.length === 0 && (
            <div className="empty-log">
              <p>Nothing logged yet.</p>
              {isToday && (
                <button className="btn-ghost" onClick={handleCopyFromYesterday}>
                  Copy from yesterday
                </button>
              )}
            </div>
          )}

          {copyMsg && <div className="copy-msg">{copyMsg}</div>}
        </div>
      )}
    </div>
  );
}

function MealSection({ meal, entries, expanded, onToggle, onDelete }) {
  const totals = sumNutrients(entries);
  if (entries.length === 0) return null;

  return (
    <div className="meal-section">
      <button className="meal-header" onClick={onToggle}>
        <span className="meal-name">{meal}</span>
        <span className="meal-cal">{round1(totals.calories)} cal</span>
        <span className="meal-chevron">{expanded ? '▲' : '▼'}</span>
      </button>
      {expanded && (
        <div className="meal-entries">
          {entries.map(e => (
            <EntryRow key={e.id} entry={e} onDelete={onDelete} />
          ))}
          {entries.length > 1 && (
            <div className="meal-subtotals">
              <span>Subtotal</span>
              <span>{round1(totals.protein)}g pro</span>
              <span>{round1(totals.carbs)}g carb</span>
              <span>{round1(totals.fat)}g fat</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function EntryRow({ entry, onDelete }) {
  const cal = round1((entry.calories || 0) * (entry.servings || 1));
  const servingText = entry.servings === 1
    ? entry.servingLabel || entry.serving || ''
    : `${entry.servings}x ${entry.servingLabel || entry.serving || ''}`;

  return (
    <div className="entry-row">
      <div className="entry-info">
        <span className="entry-name">{entry.foodName}</span>
        {servingText && <span className="entry-serving">{servingText}</span>}
      </div>
      <div className="entry-right">
        <span className="entry-cal">{cal}</span>
        <button className="entry-del" onClick={() => onDelete(entry.id)}>×</button>
      </div>
    </div>
  );
}

function CalRing({ consumed, goal }) {
  const pct   = goal ? Math.min(1, consumed / goal) : 0;
  const over  = consumed > goal;
  const r     = 28;
  const circ  = 2 * Math.PI * r;
  const dash  = pct * circ;
  const color = over ? '#e05050' : '#2d8f4e';

  return (
    <svg width="72" height="72" viewBox="0 0 72 72">
      <circle cx="36" cy="36" r={r} fill="none" stroke="#e8e0d0" strokeWidth="6" />
      <circle cx="36" cy="36" r={r} fill="none" stroke={color} strokeWidth="6"
        strokeDasharray={`${dash} ${circ}`} strokeDashoffset={circ / 4}
        strokeLinecap="round" transform="rotate(-90 36 36)" style={{ transition: 'stroke-dasharray 0.4s ease' }} />
      <text x="36" y="40" textAnchor="middle" fontSize="13" fontWeight="600" fill={color}>
        {Math.round(pct * 100)}%
      </text>
    </svg>
  );
}
