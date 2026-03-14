import { useState, useEffect } from 'react';
import { getSetting, setSetting, getAllFoods, addFood } from './db.js';
import { FRESH_FOODS } from './freshFoods.js';
import DailyLog from './components/DailyLog.jsx';
import FoodSearch from './components/FoodSearch.jsx';
import WeightLog from './components/WeightLog.jsx';
import Settings from './components/Settings.jsx';
import './app.css';

const TABS = [
  { id: 'log',     label: 'Today',    icon: '📋' },
  { id: 'add',     label: 'Add Food', icon: '＋' },
  { id: 'weight',  label: 'Weight',   icon: '⚖️' },
  { id: 'settings',label: 'Settings', icon: '⚙️' },
];

const DEFAULT_GOALS = {
  calories: 1800,
  protein:  120,
  fiber:    35,
  sodium:   2300,
  fat:      65,
  carbs:    225,
};

export default function App() {
  const [tab, setTab]         = useState('log');
  const [goals, setGoals]     = useState(DEFAULT_GOALS);
  const [profile, setProfile] = useState({ currentWeight: 184, goalWeight: 174, weightUnit: 'lbs' });
  const [ready, setReady]     = useState(false);
  const [selectedDate, setSelectedDate] = useState(todayStr());

  useEffect(() => {
    async function init() {
      // Load saved goals
      const savedGoals   = await getSetting('goals');
      const savedProfile = await getSetting('profile');
      if (savedGoals)   setGoals(savedGoals);
      if (savedProfile) setProfile(savedProfile);

      // Seed fresh foods on first run
      const seeded = await getSetting('freshFoodsSeeded');
      if (!seeded) {
        const existing = await getAllFoods();
        if (existing.length === 0) {
          for (const food of FRESH_FOODS) {
            await addFood(food);
          }
          await setSetting('freshFoodsSeeded', true);
        }
      }
      setReady(true);
    }
    init();
  }, []);

  async function saveGoals(newGoals) {
    setGoals(newGoals);
    await setSetting('goals', newGoals);
  }

  async function saveProfile(newProfile) {
    setProfile(newProfile);
    await setSetting('profile', newProfile);
  }

  if (!ready) {
    return (
      <div className="splash">
        <div className="splash-inner">
          <div className="splash-logo">NT</div>
          <p>Loading…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="app">
      <div className="content">
        {tab === 'log'      && <DailyLog goals={goals} selectedDate={selectedDate} setSelectedDate={setSelectedDate} />}
        {tab === 'add'      && <FoodSearch onDone={() => setTab('log')} selectedDate={selectedDate} />}
        {tab === 'weight'   && <WeightLog profile={profile} onSaveProfile={saveProfile} />}
        {tab === 'settings' && <Settings goals={goals} profile={profile} onSaveGoals={saveGoals} onSaveProfile={saveProfile} />}
      </div>

      <nav className="tab-bar">
        {TABS.map(t => (
          <button
            key={t.id}
            className={`tab-btn ${tab === t.id ? 'active' : ''}`}
            onClick={() => setTab(t.id)}
          >
            <span className="tab-icon">{t.icon}</span>
            <span className="tab-label">{t.label}</span>
          </button>
        ))}
      </nav>
    </div>
  );
}

export function todayStr() {
  return new Date().toISOString().slice(0, 10);
}
