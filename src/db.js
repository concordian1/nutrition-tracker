// db.js — IndexedDB wrapper for NutriTrack
const DB_NAME = 'nutritrack';
const DB_VERSION = 1;

let _db = null;

function openDB() {
  if (_db) return Promise.resolve(_db);
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, DB_VERSION);
    req.onupgradeneeded = (e) => {
      const db = e.target.result;
      // Food database
      if (!db.objectStoreNames.contains('foods')) {
        const foods = db.createObjectStore('foods', { keyPath: 'id', autoIncrement: true });
        foods.createIndex('upc', 'upc', { unique: false });
        foods.createIndex('name', 'name', { unique: false });
      }
      // Daily food log
      if (!db.objectStoreNames.contains('log')) {
        const log = db.createObjectStore('log', { keyPath: 'id', autoIncrement: true });
        log.createIndex('date', 'date', { unique: false });
        log.createIndex('date_meal', ['date', 'meal'], { unique: false });
      }
      // Weight log
      if (!db.objectStoreNames.contains('weight')) {
        const weight = db.createObjectStore('weight', { keyPath: 'id', autoIncrement: true });
        weight.createIndex('date', 'date', { unique: true });
      }
      // Settings
      if (!db.objectStoreNames.contains('settings')) {
        db.createObjectStore('settings', { keyPath: 'key' });
      }
    };
    req.onsuccess = (e) => { _db = e.target.result; resolve(_db); };
    req.onerror = (e) => reject(e.target.error);
  });
}

// ── Generic helpers ──────────────────────────────────────────────────────────
async function getAll(store, indexName, indexValue) {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(store, 'readonly');
    const s = tx.objectStore(store);
    const req = indexName
      ? s.index(indexName).getAll(indexValue)
      : s.getAll();
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

async function put(store, item) {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(store, 'readwrite');
    const req = tx.objectStore(store).put(item);
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

async function del(store, id) {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(store, 'readwrite');
    const req = tx.objectStore(store).delete(id);
    req.onsuccess = () => resolve();
    req.onerror = () => reject(req.error);
  });
}

async function getOne(store, id) {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(store, 'readonly');
    const req = tx.objectStore(store).get(id);
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

// ── Foods ────────────────────────────────────────────────────────────────────
export async function getAllFoods() { return getAll('foods'); }
export async function addFood(food) { return put('foods', food); }
export async function updateFood(food) { return put('foods', food); }
export async function deleteFood(id) { return del('foods', id); }
export async function getFoodByUpc(upc) {
  const all = await getAll('foods', 'upc', upc);
  return all[0] || null;
}
export async function searchFoods(query) {
  const all = await getAll('foods');
  const q = query.toLowerCase();
  return all.filter(f =>
    f.name?.toLowerCase().includes(q) ||
    f.brand?.toLowerCase().includes(q) ||
    f.upc?.includes(q)
  );
}

// ── Log ──────────────────────────────────────────────────────────────────────
export async function getLogByDate(date) { return getAll('log', 'date', date); }
export async function addLogEntry(entry) { return put('log', { ...entry, loggedAt: Date.now() }); }
export async function updateLogEntry(entry) { return put('log', entry); }
export async function deleteLogEntry(id) { return del('log', id); }

// ── Weight ───────────────────────────────────────────────────────────────────
export async function getAllWeights() {
  const all = await getAll('weight');
  return all.sort((a, b) => a.date.localeCompare(b.date));
}
export async function logWeight(date, weight) {
  const existing = await getAll('weight', 'date', date);
  if (existing.length > 0) {
    return put('weight', { ...existing[0], weight });
  }
  return put('weight', { date, weight });
}
export async function deleteWeight(id) { return del('weight', id); }

// ── Settings ─────────────────────────────────────────────────────────────────
export async function getSetting(key) {
  const item = await getOne('settings', key);
  return item?.value ?? null;
}
export async function setSetting(key, value) {
  return put('settings', { key, value });
}

// ── Copy log entries from one date to another ────────────────────────────────
export async function copyLogFromDate(fromDate, toDate, mealFilter = null, excludeIds = []) {
  const entries = await getLogByDate(fromDate);
  const toCopy = entries.filter(e => {
    if (mealFilter && e.meal !== mealFilter) return false;
    if (excludeIds.includes(e.id)) return false;
    return true;
  });
  for (const entry of toCopy) {
    const { id, loggedAt, ...rest } = entry;
    await addLogEntry({ ...rest, date: toDate });
  }
  return toCopy.length;
}
