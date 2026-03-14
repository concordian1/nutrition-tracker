import { useState, useEffect } from 'react';
import { getAllWeights, logWeight, deleteWeight } from '../db.js';

const todayStr = () => new Date().toISOString().slice(0, 10);

export default function WeightLog({ profile, onSaveProfile }) {
  const [weights, setWeights]     = useState([]);
  const [input, setInput]         = useState('');
  const [date, setDate]           = useState(todayStr());
  const [status, setStatus]       = useState('');

  useEffect(() => { loadWeights(); }, []);

  async function loadWeights() {
    const data = await getAllWeights();
    setWeights(data.reverse()); // newest first for display
  }

  async function handleLog() {
    const w = parseFloat(input);
    if (!w || w < 50 || w > 500) { setStatus('Enter a valid weight.'); return; }
    await logWeight(date, w);
    // Update current weight in profile
    if (date === todayStr()) {
      await onSaveProfile({ ...profile, currentWeight: w });
    }
    setInput('');
    setStatus('✓ Logged');
    loadWeights();
    setTimeout(() => setStatus(''), 2000);
  }

  async function handleDelete(id) {
    if (!confirm('Remove this entry?')) return;
    await deleteWeight(id);
    loadWeights();
  }

  const sorted   = [...weights].sort((a, b) => a.date.localeCompare(b.date));
  const latest   = sorted[sorted.length - 1]?.weight;
  const goal     = profile.goalWeight;
  const toGo     = latest ? Math.round((latest - goal) * 10) / 10 : null;
  const progress = latest && goal ? Math.max(0, Math.min(100,
    Math.round(((profile.currentWeight - latest) / (profile.currentWeight - goal)) * 100)
  )) : 0;

  return (
    <div className="screen">
      <h2 className="screen-title">Weight Log</h2>

      {/* Stats row */}
      <div className="weight-stats">
        <div className="wstat">
          <div className="wstat-val">{latest ?? '—'}</div>
          <div className="wstat-label">Current (lbs)</div>
        </div>
        <div className="wstat">
          <div className="wstat-val">{goal}</div>
          <div className="wstat-label">Goal (lbs)</div>
        </div>
        <div className="wstat">
          <div className="wstat-val wstat-togo">{toGo !== null ? (toGo > 0 ? `−${toGo}` : '✓') : '—'}</div>
          <div className="wstat-label">To go</div>
        </div>
      </div>

      {/* Progress bar */}
      {progress > 0 && (
        <div className="progress-wrap">
          <div className="progress-track">
            <div className="progress-fill" style={{ width: `${progress}%` }} />
          </div>
          <div className="progress-label">{progress}% to goal</div>
        </div>
      )}

      {/* Mini chart */}
      {sorted.length >= 2 && <WeightChart data={sorted} goal={goal} />}

      {/* Log entry */}
      <div className="weight-entry">
        <h3>Log Weight</h3>
        <div className="weight-entry-row">
          <input type="date" className="date-input" value={date}
            onChange={e => setDate(e.target.value)} max={todayStr()} />
          <input type="number" className="weight-input" placeholder="lbs"
            value={input} onChange={e => setInput(e.target.value)}
            min="50" max="500" step="0.1"
            onKeyDown={e => e.key === 'Enter' && handleLog()} />
          <button className="btn-primary" onClick={handleLog}>Log</button>
        </div>
        {status && <div className={`status-msg ${status.startsWith('✓') ? 'success' : 'error'}`}>{status}</div>}
      </div>

      {/* History */}
      <div className="weight-history">
        <h3>History</h3>
        {weights.length === 0 ? (
          <p className="empty-hint">No entries yet.</p>
        ) : (
          weights.slice(0, 30).map(w => (
            <div key={w.id} className="weight-row">
              <span className="wr-date">{w.date}</span>
              <span className="wr-val">{w.weight} lbs</span>
              <button className="wr-del" onClick={() => handleDelete(w.id)}>×</button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

function WeightChart({ data, goal }) {
  const vals   = data.map(d => d.weight);
  const minV   = Math.min(...vals, goal) - 2;
  const maxV   = Math.max(...vals, goal) + 2;
  const range  = maxV - minV;
  const W = 320; const H = 100;
  const pad = { l: 8, r: 8, t: 10, b: 10 };
  const iW = W - pad.l - pad.r;
  const iH = H - pad.t - pad.b;

  function x(i) { return pad.l + (i / (data.length - 1)) * iW; }
  function y(v) { return pad.t + (1 - (v - minV) / range) * iH; }

  const goalY = y(goal);
  const pts   = data.map((d, i) => `${x(i)},${y(d.weight)}`).join(' ');

  return (
    <div className="weight-chart">
      <svg viewBox={`0 0 ${W} ${H}`} width="100%" style={{ display: 'block' }}>
        {/* Goal line */}
        <line x1={pad.l} y1={goalY} x2={W - pad.r} y2={goalY}
          stroke="#2d8f4e" strokeWidth="1" strokeDasharray="4 3" opacity="0.6" />
        {/* Weight line */}
        <polyline fill="none" stroke="#1a3a5c" strokeWidth="2" strokeLinejoin="round" points={pts} />
        {/* Dots */}
        {data.map((d, i) => (
          <circle key={i} cx={x(i)} cy={y(d.weight)} r="3"
            fill={d.weight <= goal ? '#2d8f4e' : '#1a3a5c'} />
        ))}
        {/* Goal label */}
        <text x={W - pad.r + 2} y={goalY + 4} fontSize="9" fill="#2d8f4e">Goal</text>
      </svg>
    </div>
  );
}
