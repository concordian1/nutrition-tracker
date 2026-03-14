import { useState } from 'react';

export default function Settings({ goals, profile, onSaveGoals, onSaveProfile }) {
  const [g, setG]       = useState({ ...goals });
  const [p, setP]       = useState({ ...profile });
  const [saved, setSaved] = useState('');

  function saveAll() {
    onSaveGoals(g);
    onSaveProfile(p);
    setSaved('✓ Saved');
    setTimeout(() => setSaved(''), 2000);
  }

  function gField(key, label, unit, min, max, step = 1) {
    return (
      <div className="setting-row" key={key}>
        <label className="setting-label">{label}</label>
        <div className="setting-input-row">
          <input type="number" className="setting-input" value={g[key]}
            min={min} max={max} step={step}
            onChange={e => setG(prev => ({ ...prev, [key]: parseFloat(e.target.value) || 0 }))} />
          <span className="setting-unit">{unit}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="screen">
      <h2 className="screen-title">Settings</h2>

      <section className="settings-section">
        <h3>Daily Goals</h3>
        {gField('calories', 'Calories',    '',    500,  5000, 50)}
        {gField('protein',  'Protein',     'g',   20,   300,  5)}
        {gField('fiber',    'Fiber',       'g',   10,   80,   1)}
        {gField('sodium',   'Sodium',      'mg',  500,  5000, 100)}
        {gField('fat',      'Fat',         'g',   10,   200,  5)}
        {gField('carbs',    'Carbs',       'g',   20,   500,  5)}
      </section>

      <section className="settings-section">
        <h3>Profile</h3>
        <div className="setting-row">
          <label className="setting-label">Current weight</label>
          <div className="setting-input-row">
            <input type="number" className="setting-input" value={p.currentWeight} min={50} max={500} step={0.1}
              onChange={e => setP(prev => ({ ...prev, currentWeight: parseFloat(e.target.value) }))} />
            <span className="setting-unit">lbs</span>
          </div>
        </div>
        <div className="setting-row">
          <label className="setting-label">Goal weight</label>
          <div className="setting-input-row">
            <input type="number" className="setting-input" value={p.goalWeight} min={50} max={500} step={0.1}
              onChange={e => setP(prev => ({ ...prev, goalWeight: parseFloat(e.target.value) }))} />
            <span className="setting-unit">lbs</span>
          </div>
        </div>
      </section>

      <button className="btn-primary btn-full" onClick={saveAll}>Save Settings</button>
      {saved && <div className="status-msg success">{saved}</div>}

      <section className="settings-section" style={{ marginTop: '2rem' }}>
        <h3>About</h3>
        <p className="about-text">NutriTrack v1.0 · Personal nutrition tracker · Powered by USDA FoodData Central</p>
        <p className="about-text">Data stored locally on your device. Nothing is sent to any server except USDA API lookups.</p>
      </section>
    </div>
  );
}
