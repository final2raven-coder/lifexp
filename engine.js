// ===========================================================================
// LifeXP RPG - engine.js
// Motor central: estado, tareas, progreso, guardado y carga.
// ===========================================================================

const DEFAULT_GAME_STATE = {
  version: 1,
  player: {
    name: 'Àngel',
    level: 1,
    xp: 0,
    xpToNext: 100,
    stats: {
      str: 10,
      int: 10,
      dex: 10,
      vit: 10,
      wis: 10,
      cha: 10
    }
  },
  gold: 0,
  tasks: [],
  taskHistory: [],
  savedTasks: [],
  inventory: [],
  equipment: {
    weapon: null,
    armor: null,
    accessory1: null,
    accessory2: null,
    artifact: null
  },
  stash: [],
  stashCapacity: 30,
  inventoryCapacityBonus: 0,
  pendingLoot: { version: 1, entries: [] },
  rewardLedger: {},
  pendingTaskResult: null,
  saveVersion: 4, // v4 is the current canonical version (migration in loadGame handles v<4 saves)
  
  // Class (placeholder for next block)
  classId: 'novato',
  classLevel: 1,
  
  // Quests (placeholder)
  activeQuests: [],
  completedQuests: [],
  
  // Canonical quest state
  quests: {
    active: [],
    completed: [],
    failed: [],
    dailyReset: null
  },

  // Item system
  itemSystem: {
    version: 1,
    attunement: {},
    rituals: {},
    curses: {}
  },
  loreUnlocked: [],
  acclimation: {},

  // Guild / Coop
  guildId: null,
  guildName: null,
  guildMembers: [], // { odeName, oderId, lastSync }
  pendingReceipts: [], // receipts generated but not yet shared
  receivedReceipts: [], // receipts received from others
  lastReceiptId: 0
};

let gameState = cloneSaveState(DEFAULT_GAME_STATE);

// Current task being viewed
let currentTask = null;
let currentIsOverflow = false;
let currentCatFilter = null;

// Timer state
let timerInterval = null;
let timerSeconds = 0;
let timerRunning = false;

// ===========================================================================
// UTILITY FUNCTIONS
// ===========================================================================

function todayStr() {
  return new Date().toISOString().slice(0, 10);
}

function daysBetween(date1, date2) {
  const d1 = new Date(`${date1}T00:00:00Z`);
  const d2 = new Date(`${date2}T00:00:00Z`);
  return Math.floor((d2 - d1) / (1000 * 60 * 60 * 24));
}

function addDaysToDate(dateValue, days) {
  if (!isValidTaskDate(dateValue)) return null;
  const date = new Date(`${dateValue}T00:00:00Z`);
  date.setUTCDate(date.getUTCDate() + days);
  return date.toISOString().slice(0, 10);
}

function isValidTaskDate(value) {
  if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const date = new Date(`${value}T00:00:00Z`);
  return !Number.isNaN(date.getTime()) && date.toISOString().slice(0, 10) === value;
}

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

function getTaskDefinition(task) {
  if (!task || typeof task !== 'object') return null;
  return task.schedule || task.frequency || null;
}

function normalizeTaskLimit(value) {
  if (value === null || value === undefined) return null;
  if (value === 'unlimited') return null;
  const numeric = Number(value);
  return Number.isFinite(numeric) ? Math.max(0, Math.floor(numeric)) : null;
}

function normalizeTaskInterval(value) {
  const numeric = Number(value);
  return Number.isFinite(numeric) ? Math.max(1, Math.floor(numeric)) : 1;
}

function isTaskArchived(task) {
  return Boolean(task && (task.archived === true || task.status === 'archived'));
}

function getTaskHistory(task) {
  if (!task || !Array.isArray(gameState.taskHistory)) return [];
  return gameState.taskHistory.filter(entry => entry && entry.taskId === task.id);
}

function getLatestTaskCompletionDate(task) {
  const dates = getTaskHistory(task)
    .map(entry => entry.date)
    .filter(isValidTaskDate)
    .sort();
  return dates.length > 0 ? dates[dates.length - 1] : null;
}

function getTaskAvailability(task, referenceDate = todayStr()) {
  if (!task || isTaskArchived(task)) {
    return { status: 'archived', available: false, completionCount: 0, nextAvailableDate: null };
  }

  const definition = getTaskDefinition(task) || {};
  const limit = normalizeTaskLimit(definition.limit ?? definition.maxPerInterval ?? definition.maxPerDay);
  const intervalDays = normalizeTaskInterval(definition.intervalDays ?? definition.interval ?? 1);
  const history = getTaskHistory(task);
  const completionCount = history.length;
  const base = { completionCount, nextAvailableDate: null };

  if (task.lastDone && !isValidTaskDate(task.lastDone)) {
    return { ...base, status: 'needs_review', available: false, nextAvailableDate: null };
  }
  if (limit === 0) return { ...base, status: 'completed', available: false, nextAvailableDate: null };
  if (limit === null) return { ...base, status: 'available', available: true };

  // A one-per-interval task uses the latest completion as its cooldown anchor.
  // A manual catalog completion can therefore restart the interval from today.
  if (definition.limit === 1) {
    const latestCompletion = getLatestTaskCompletionDate(task);
    if (!latestCompletion) return { ...base, status: 'available', available: true };
    const nextAvailableDate = addDaysToDate(latestCompletion, definition.intervalDays);
    const daysSinceLatest = daysBetween(latestCompletion, referenceDate);
    if (daysSinceLatest < definition.intervalDays) {
      return {
        ...base,
        status: 'cooldown',
        available: false,
        nextAvailableDate
      };
    }
    return { ...base, status: 'available', available: true, nextAvailableDate };
  }

  const recent = history.filter(entry => {
    if (!isValidTaskDate(entry.date)) return false;
    const age = daysBetween(entry.date, referenceDate);
    return age >= 0 && age < intervalDays;
  });
  if (recent.length < limit) return { ...base, status: 'available', available: true };

  const dates = recent.map(entry => entry.date).sort();
  const nextAvailableDate = addDaysToDate(dates[0], intervalDays);
  return { ...base, status: 'cooldown', available: false, nextAvailableDate };
}

function isTaskDue(task, referenceDate = todayStr()) {
  return getTaskAvailability(task, referenceDate).available;
}

function isTaskOverdue(task, referenceDate = todayStr()) {
  if (!task || isTaskArchived(task)) return false;
  if (!task.lastDone || !isValidTaskDate(task.lastDone)) return false;
  const definition = getTaskDefinition(task) || {};
  const intervalDays = normalizeTaskInterval(definition.intervalDays ?? definition.interval ?? 1);
  return daysBetween(task.lastDone, referenceDate) > intervalDays;
}

function getTaskCooldown(task, referenceDate = todayStr()) {
  const availability = getTaskAvailability(task, referenceDate);
  return availability.nextAvailableDate;
}

function getAvailableTasks(cat = null) {
  let tasks = gameState.tasks.filter(task => !isTaskArchived(task));
  if (cat) tasks = tasks.filter(task => task.cat === cat);

  const overflow = tasks.filter(task => isTaskOverdue(task));
  if (overflow.length > 0) return { tasks: overflow, isOverflow: true };

  const due = tasks.filter(t => isTaskDue(t));
  if (due.length > 0) return { tasks: due, isOverflow: false };
  
  return { tasks: [], isOverflow: false };
}

function pickRandomTask(tasks) {
  if (!tasks || tasks.length === 0) return null;
  return tasks[Math.floor(Math.random() * tasks.length)];
}

function getCategoryTasks(catId) {
  return gameState.tasks.filter(task => task.cat === catId && !isTaskArchived(task));
}

function ensureTaskDefaults(task) {
  if (!task || typeof task !== 'object') return task;
  if (!Array.isArray(task.stats)) task.stats = task.stats || {};
  if (!task.lastDone) task.lastDone = null;
  return task;
}

function addXp(amount) {
  const numericAmount = Number(amount);
  if (!Number.isFinite(numericAmount) || numericAmount <= 0) return false;
  gameState.player.xp += numericAmount;
  let leveledUp = false;
  while (gameState.player.xp >= gameState.player.xpToNext) {
    gameState.player.xp -= gameState.player.xpToNext;
    gameState.player.level += 1;
    gameState.player.xpToNext = Math.floor(gameState.player.xpToNext * 1.25);
    leveledUp = true;
  }
  return leveledUp;
}

function addStats(stats) {
  if (!stats || typeof stats !== 'object') return;
  for (const [stat, value] of Object.entries(stats)) {
    if (!Object.prototype.hasOwnProperty.call(gameState.player.stats, stat)) continue;
    const numeric = Number(value);
    if (Number.isFinite(numeric)) gameState.player.stats[stat] += numeric;
  }
}

function getStorageKeys() {
  const keys = [];
  for (let index = 0; index < localStorage.length; index++) {
    const key = localStorage.key(index);
    if (key !== null) keys.push(key);
  }
  return keys;
}

function showSaveLoadError(message) {
  const text = `Could not load your save. The original save was not modified. ${message}`;
  console.error(text);
  if (typeof showToast === 'function') {
    showToast(text, 'error');
  }
}

function saveGame() {
  try {
    localStorage.setItem('lifexp_save', JSON.stringify(gameState));
    return true;
  } catch (error) {
    console.error('Could not save game.', error);
    return false;
  }
}

function loadGame() {
  try {
    const raw = localStorage.getItem('lifexp_save');
    if (!raw) return false;
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== 'object') {
      showSaveLoadError('The save format is invalid.');
      return false;
    }
    gameState = { ...cloneSaveState(DEFAULT_GAME_STATE), ...parsed };
    gameState.player = { ...cloneSaveState(DEFAULT_GAME_STATE).player, ...(parsed.player || {}) };
    gameState.player.stats = { ...cloneSaveState(DEFAULT_GAME_STATE).player.stats, ...(parsed.player?.stats || {}) };
    gameState.tasks = Array.isArray(parsed.tasks) ? parsed.tasks.map(ensureTaskDefaults) : [];
    gameState.taskHistory = Array.isArray(parsed.taskHistory) ? parsed.taskHistory : [];
    gameState.savedTasks = Array.isArray(parsed.savedTasks) ? parsed.savedTasks : [];
    gameState.inventory = Array.isArray(parsed.inventory) ? parsed.inventory : [];
    gameState.stash = Array.isArray(parsed.stash) ? parsed.stash : [];
    gameState.pendingLoot = parsed.pendingLoot || { version: 1, entries: [] };
    gameState.rewardLedger = parsed.rewardLedger || {};
    gameState.pendingTaskResult = parsed.pendingTaskResult || null;
    gameState.saveVersion = Math.max(Number(parsed.saveVersion) || 0, CURRENT_SAVE_VERSION);
    return true;
  } catch (error) {
    showSaveLoadError(error.message || 'Unknown load error.');
    return false;
  }
}

function cloneSaveState(value) {
  return JSON.parse(JSON.stringify(value));
}

function isPlainObject(value) {
  return value !== null && typeof value === 'object' && !Array.isArray(value);
}

const PENDING_LOOT_SCHEMA_VERSION = 1;

function getPendingLootMetadata(entry) {
  if (!isPlainObject(entry)) return {};
  const knownKeys = new Set([
    'claimId', 'itemId', 'id', 'requestedItem', 'quantity', 'qty', 'displayName',
    'name', 'source', 'reason', 'status', 'createdAt', 'metadata'
  ]);
  const metadata = isPlainObject(entry.metadata) ? cloneSaveState(entry.metadata) : {};
  for (const [key, value] of Object.entries(entry)) {
    if (!knownKeys.has(key)) metadata[key] = cloneSaveState(value);
  }
  return metadata;
}

function normalizePendingLootEntry(entry, index) {
  const source = isPlainObject(entry) ? entry : {};
  const rawItemId = isPlainObject(entry)
    ? (typeof entry.itemId === 'string' ? entry.itemId : (typeof entry.id === 'string' ? entry.id : null))
    : (typeof entry === 'string' ? entry : null);
  const requestedItem = isPlainObject(entry)
    ? (typeof entry.requestedItem === 'string' ? entry.requestedItem : rawItemId || (typeof entry.name === 'string' ? entry.name : null))
    : rawItemId;
  const quantityValue = isPlainObject(entry) ? (entry.quantity ?? entry.qty ?? 1) : 1;
  const quantity = Number.isFinite(Number(quantityValue)) ? Math.max(1, Math.floor(Number(quantityValue))) : 1;
  return {
    claimId: typeof source.claimId === 'string' && source.claimId ? source.claimId : `legacy-pending-${index}`,
    itemId: rawItemId,
    requestedItem,
    quantity,
    displayName: typeof source.displayName === 'string' ? source.displayName : (typeof source.name === 'string' ? source.name : null),
    source: typeof source.source === 'string' && source.source ? source.source : 'legacy',
    reason: typeof source.reason === 'string' && source.reason ? source.reason : 'legacy',
    status: source.status === 'rejected' ? 'rejected' : 'pending',
    createdAt: typeof source.createdAt === 'string' ? source.createdAt : null,
    metadata: getPendingLootMetadata(entry)
  };
}

function normalizePendingLootState(value, warnings = []) {
  if (value === null || value === undefined) return { version: PENDING_LOOT_SCHEMA_VERSION, entries: [] };
  let rawEntries;
  if (Array.isArray(value)) rawEntries = value;
  else if (isPlainObject(value) && Array.isArray(value.entries)) rawEntries = value.entries;
  else rawEntries = [value];
  if (isPlainObject(value) && value.version !== undefined && value.version !== PENDING_LOOT_SCHEMA_VERSION) {
    warnings.push(`Normalized pendingLoot schema version ${String(value.version)} to ${PENDING_LOOT_SCHEMA_VERSION}.`);
  }
  return {
    version: PENDING_LOOT_SCHEMA_VERSION,
    entries: rawEntries.map((entry, index) => normalizePendingLootEntry(entry, index))
  };
}

function isFiniteNumber(value) {
  return typeof value === 'number' && Number.isFinite(value);
}

function migrateSaveState(parsed) {
  const migrated = cloneSaveState(DEFAULT_GAME_STATE);
  Object.assign(migrated, parsed);
  migrated.player = { ...cloneSaveState(DEFAULT_GAME_STATE).player, ...(parsed.player || {}) };
  migrated.player.stats = { ...cloneSaveState(DEFAULT_GAME_STATE).player.stats, ...(parsed.player?.stats || {}) };
  migrated.tasks = Array.isArray(parsed.tasks) ? parsed.tasks.map(ensureTaskDefaults) : [];
  migrated.taskHistory = Array.isArray(parsed.taskHistory) ? parsed.taskHistory : [];
  migrated.savedTasks = Array.isArray(parsed.savedTasks) ? parsed.savedTasks : [];
  migrated.inventory = Array.isArray(parsed.inventory) ? parsed.inventory : [];
  migrated.stash = Array.isArray(parsed.stash) ? parsed.stash : [];
  migrated.pendingLoot = normalizePendingLootState(parsed.pendingLoot);
  migrated.rewardLedger = isPlainObject(parsed.rewardLedger) ? parsed.rewardLedger : {};
  migrated.pendingTaskResult = parsed.pendingTaskResult || null;
  migrated.saveVersion = CURRENT_SAVE_VERSION;
  return migrated;
}

function normalizeSaveState(parsed) {
  const warnings = [];
  const normalized = migrateSaveState(parsed);
  normalized.pendingLoot = normalizePendingLootState(normalized.pendingLoot, warnings);
  if (!isPlainObject(normalized.rewardLedger)) normalized.rewardLedger = {};
  return { state: normalized, warnings };
}

function createPremigrationSnapshot(raw) {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const key = `${PREMIGRATION_SNAPSHOT_PREFIX}${timestamp}`;
  try {
    localStorage.setItem(key, raw);
    const snapshotKeys = getStorageKeys()
      .filter(storageKey => storageKey.startsWith(PREMIGRATION_SNAPSHOT_PREFIX))
      .sort();
    while (snapshotKeys.length > MAX_PREMIGRATION_SNAPSHOTS) {
      localStorage.removeItem(snapshotKeys.shift());
    }
    return key;
  } catch (error) {
    console.error('Could not create premigration snapshot.', error);
    return null;
  }
}

function loadGameSafely() {
  const raw = localStorage.getItem('lifexp_save');
  if (!raw) {
    gameState = cloneSaveState(DEFAULT_GAME_STATE);
    return { ok: true, migrated: false, warnings: [] };
  }
  try {
    const parsed = JSON.parse(raw);
    if (!isPlainObject(parsed)) throw new Error('Save root must be an object.');
    const { state, warnings } = normalizeSaveState(parsed);
    const requiresMigration = Number(parsed.saveVersion) !== CURRENT_SAVE_VERSION;
    if (requiresMigration) createPremigrationSnapshot(raw);
    gameState = state;
    if (requiresMigration) saveGame();
    return { ok: true, migrated: requiresMigration, warnings };
  } catch (error) {
    showSaveLoadError(error.message || 'Unknown load error.');
    return { ok: false, migrated: false, warnings: [error.message] };
  }
}

function createTaskHistoryEntry(task, { date = todayStr(), xp = 0, sideQuest = false, completionId = null } = {}) {
  const priorCount = gameState.taskHistory.filter(entry => entry && entry.taskId === task.id).length;
  return {
    taskId: task.id,
    date,
    xp,
    sideQuest: Boolean(sideQuest),
    completionId: completionId || `task:${task.id}:${date}:${sideQuest ? 'side' : 'base'}:${priorCount}`
  };
}

function initializeGame() {
  const loadResult = loadGameSafely();
  if (!loadResult.ok) return false;
  if (typeof initializeTasks === 'function') initializeTasks();
  if (typeof initializeItems === 'function') initializeItems();
  if (typeof initializeQuests === 'function') initializeQuests();
  if (typeof renderHub === 'function') renderHub();
  return true;
}

const CURRENT_SAVE_VERSION = 4;
const PREMIGRATION_SNAPSHOT_PREFIX = 'lifexp_premigration_';
const MAX_PREMIGRATION_SNAPSHOTS = 3;

// ===========================================================================
// End of engine
// ===========================================================================
