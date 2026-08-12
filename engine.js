// ===========================================================================
// LifeXP RPG - engine.js
// Nucleo del motor: gameState, variables de UI, utilidades, persistencia,
// migracion de save, updateStreak y showScreen.
// Depende de: classes.js, quests.js (globals), data_tasks.js.
// ===========================================================================

// ===========================================================================
// GAME STATE
// ===========================================================================

const DEFAULT_GAME_STATE = {
  // Player
  name: 'Aventurero',
  level: 1,
  xp: 0,
  gold: 0,
  streak: 0,
  lastActiveDate: null,
  
  // Stats
  stats: {
    fue: 10,
    vit: 10,
    des: 10,
    int: 10,
    vol: 10,
    pre: 10
  },
  
  // Tasks
  tasks: [],
  savedTasks: [], // IDs of saved for later
  taskHistory: [], // { taskId, date, xp, sideQuest }
  
  // Inventory (placeholder for next block)
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
  pendingLoot: null,
  saveVersion: 3, // v3 is the current canonical version (migration in loadGame handles v<3 saves)
  
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
  const d1 = new Date(date1);
  const d2 = new Date(date2);
  return Math.floor((d2 - d1) / (1000 * 60 * 60 * 24));
}

function xpForLevel(level) {
  return Math.floor(100 * Math.pow(1.4, level - 1));
}

function getXpProgress() {
  const needed = xpForLevel(gameState.level);
  const pct = Math.min(100, Math.round((gameState.xp / needed) * 100));
  return { current: gameState.xp, needed, pct };
}

function addXp(amount) {
  gameState.xp += amount;
  let leveledUp = false;
  while (gameState.xp >= xpForLevel(gameState.level)) {
    gameState.xp -= xpForLevel(gameState.level);
    gameState.level++;
    leveledUp = true;
  }
  if (leveledUp) {
    // Trigger level up effects
    if (typeof showLevelUpEffect === 'function') showLevelUpEffect();
    if (typeof triggerHaptic === 'function') triggerHaptic();
    if (typeof showToast === 'function') showToast(`¡Nivel ${gameState.level}!`, 'gold');
  }
  return leveledUp;
}

function addStats(statsObj) {
  // statsObj is like { fue: 50, vit: 30 } where values are percentages
  // We convert to actual stat points (simplified: 1 point per 10%)
  for (const [stat, pct] of Object.entries(statsObj)) {
    if (STATS[stat]) {
      const points = Math.max(1, Math.floor(pct / 10));
      gameState.stats[stat] += points;
    }
  }
}

function getMaxStat() {
  return Math.max(...Object.values(gameState.stats));
}

// ===========================================================================
// TASK LOGIC
// ===========================================================================

function getTaskById(id) {
  return gameState.tasks.find(t => t.id === id);
}

function isTaskDue(task) {
  if (!task.lastDone) return true;
  const daysSince = daysBetween(task.lastDone, todayStr());
  return daysSince >= FREQ[task.freq].days;
}

function isTaskOverdue(task) {
  if (!task.lastDone) return false;
  const daysSince = daysBetween(task.lastDone, todayStr());
  return daysSince > FREQ[task.freq].days * 1.5;
}

function getOverflowTasks() {
  return gameState.tasks.filter(t => isTaskOverdue(t));
}

function getAvailableTasks(cat = null) {
  let tasks = gameState.tasks;
  if (cat) tasks = tasks.filter(t => t.cat === cat);
  
  const overflow = tasks.filter(t => isTaskOverdue(t));
  if (overflow.length > 0) return { tasks: overflow, isOverflow: true };
  
  const due = tasks.filter(t => isTaskDue(t));
  if (due.length > 0) return { tasks: due, isOverflow: false };
  
  return { tasks, isOverflow: false };
}

function pickRandomTask(tasks) {
  return tasks[Math.floor(Math.random() * tasks.length)];
}

function getPendingCount(cat) {
  const tasks = gameState.tasks.filter(t => t.cat === cat);
  return tasks.filter(t => isTaskDue(t)).length;
}

function getOverflowCount(cat) {
  const tasks = gameState.tasks.filter(t => t.cat === cat);
  return tasks.filter(t => isTaskOverdue(t)).length;
}

// ===========================================================================
// DROP SYSTEM
// ===========================================================================



// ===========================================================================
// SAVE/LOAD
// ===========================================================================

const CURRENT_SAVE_VERSION = 3;
const PREMIGRATION_SNAPSHOT_PREFIX = 'lifexp_premigration_';
const MAX_PREMIGRATION_SNAPSHOTS = 3;

function cloneSaveState(value) {
  return JSON.parse(JSON.stringify(value));
}

function isPlainObject(value) {
  return value !== null && typeof value === 'object' && !Array.isArray(value);
}

function isFiniteNumber(value) {
  return typeof value === 'number' && Number.isFinite(value);
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
    return;
  }
  if (typeof document !== 'undefined' && document.body) {
    let banner = document.getElementById('lifexp-save-load-error');
    if (!banner) {
      banner = document.createElement('div');
      banner.id = 'lifexp-save-load-error';
      banner.setAttribute('role', 'alert');
      banner.style.cssText = 'position:fixed;left:16px;right:16px;bottom:16px;z-index:99999;padding:14px 16px;background:#7f1d1d;color:#fff;border:2px solid #fecaca;border-radius:8px;font:600 14px/1.4 sans-serif;';
      document.body.appendChild(banner);
    }
    banner.textContent = text;
  }
}

function recordSchemaDefault(warnings, path) {
  warnings.push(`Defaulted missing or invalid save field: ${path}`);
}

function applySchemaDefaults(input, warnings = []) {
  const state = isPlainObject(input) ? { ...input } : {};
  const defaults = DEFAULT_GAME_STATE;
  const hasOwn = key => Object.prototype.hasOwnProperty.call(state, key);

  if (!hasOwn('name') || typeof state.name !== 'string') { state.name = defaults.name; recordSchemaDefault(warnings, 'name'); }
  if (!hasOwn('level') || !isFiniteNumber(state.level) || state.level < 1) { state.level = defaults.level; recordSchemaDefault(warnings, 'level'); }
  if (!hasOwn('xp') || !isFiniteNumber(state.xp) || state.xp < 0) { state.xp = defaults.xp; recordSchemaDefault(warnings, 'xp'); }
  if (!hasOwn('gold') || !isFiniteNumber(state.gold) || state.gold < 0) { state.gold = defaults.gold; recordSchemaDefault(warnings, 'gold'); }
  if (!hasOwn('streak') || !isFiniteNumber(state.streak) || state.streak < 0) { state.streak = defaults.streak; recordSchemaDefault(warnings, 'streak'); }
  if (!hasOwn('lastActiveDate') || (state.lastActiveDate !== null && typeof state.lastActiveDate !== 'string')) { state.lastActiveDate = defaults.lastActiveDate; recordSchemaDefault(warnings, 'lastActiveDate'); }

  state.stats = isPlainObject(state.stats) ? { ...defaults.stats, ...state.stats } : { ...defaults.stats };
  for (const stat of Object.keys(defaults.stats)) {
    if (!isFiniteNumber(state.stats[stat])) { state.stats[stat] = defaults.stats[stat]; recordSchemaDefault(warnings, `stats.${stat}`); }
  }

  if (!Array.isArray(state.tasks)) { state.tasks = []; recordSchemaDefault(warnings, 'tasks'); }
  if (!Array.isArray(state.savedTasks)) { state.savedTasks = []; recordSchemaDefault(warnings, 'savedTasks'); }
  if (!Array.isArray(state.taskHistory)) { state.taskHistory = []; recordSchemaDefault(warnings, 'taskHistory'); }
  if (!Array.isArray(state.inventory)) { state.inventory = []; recordSchemaDefault(warnings, 'inventory'); }
  state.equipment = isPlainObject(state.equipment) ? { ...defaults.equipment, ...state.equipment } : { ...defaults.equipment };
  for (const slot of Object.keys(defaults.equipment)) {
    if (!Object.prototype.hasOwnProperty.call(state.equipment, slot)) {
      state.equipment[slot] = defaults.equipment[slot];
      recordSchemaDefault(warnings, `equipment.${slot}`);
    }
  }
  if (!Array.isArray(state.stash)) { state.stash = []; recordSchemaDefault(warnings, 'stash'); }
  if (!isFiniteNumber(state.stashCapacity) || state.stashCapacity < 0) { state.stashCapacity = defaults.stashCapacity; recordSchemaDefault(warnings, 'stashCapacity'); }
  if (!isFiniteNumber(state.inventoryCapacityBonus) || state.inventoryCapacityBonus < 0) { state.inventoryCapacityBonus = defaults.inventoryCapacityBonus; recordSchemaDefault(warnings, 'inventoryCapacityBonus'); }
  if (!Object.prototype.hasOwnProperty.call(state, 'pendingLoot')) { state.pendingLoot = defaults.pendingLoot; recordSchemaDefault(warnings, 'pendingLoot'); }

  if (!hasOwn('classId') || typeof state.classId !== 'string') { state.classId = defaults.classId; recordSchemaDefault(warnings, 'classId'); }
  if (!isFiniteNumber(state.classLevel) || state.classLevel < 1) { state.classLevel = defaults.classLevel; recordSchemaDefault(warnings, 'classLevel'); }
  if (!Array.isArray(state.activeQuests)) { state.activeQuests = []; recordSchemaDefault(warnings, 'activeQuests'); }
  if (!Array.isArray(state.completedQuests)) { state.completedQuests = []; recordSchemaDefault(warnings, 'completedQuests'); }

  state.quests = isPlainObject(state.quests) ? { ...defaults.quests, ...state.quests } : cloneSaveState(defaults.quests);
  if (!Array.isArray(state.quests.active)) { state.quests.active = []; recordSchemaDefault(warnings, 'quests.active'); }
  if (!Array.isArray(state.quests.completed)) { state.quests.completed = []; recordSchemaDefault(warnings, 'quests.completed'); }
  if (!Array.isArray(state.quests.failed)) { state.quests.failed = []; recordSchemaDefault(warnings, 'quests.failed'); }
  if (state.quests.dailyReset !== null && typeof state.quests.dailyReset !== 'string') { state.quests.dailyReset = null; recordSchemaDefault(warnings, 'quests.dailyReset'); }

  state.itemSystem = isPlainObject(state.itemSystem) ? { ...defaults.itemSystem, ...state.itemSystem } : cloneSaveState(defaults.itemSystem);
  if (!isFiniteNumber(state.itemSystem.version) || state.itemSystem.version < 1) { state.itemSystem.version = defaults.itemSystem.version; recordSchemaDefault(warnings, 'itemSystem.version'); }
  if (!isPlainObject(state.itemSystem.attunement)) { state.itemSystem.attunement = {}; recordSchemaDefault(warnings, 'itemSystem.attunement'); }
  if (!isPlainObject(state.itemSystem.rituals)) { state.itemSystem.rituals = {}; recordSchemaDefault(warnings, 'itemSystem.rituals'); }
  if (!isPlainObject(state.itemSystem.curses)) { state.itemSystem.curses = {}; recordSchemaDefault(warnings, 'itemSystem.curses'); }
  if (!Array.isArray(state.loreUnlocked)) { state.loreUnlocked = []; recordSchemaDefault(warnings, 'loreUnlocked'); }
  if (!isPlainObject(state.acclimation)) { state.acclimation = {}; recordSchemaDefault(warnings, 'acclimation'); }

  if (!hasOwn('guildId') || (state.guildId !== null && typeof state.guildId !== 'string')) { state.guildId = defaults.guildId; recordSchemaDefault(warnings, 'guildId'); }
  if (!hasOwn('guildName') || (state.guildName !== null && typeof state.guildName !== 'string')) { state.guildName = defaults.guildName; recordSchemaDefault(warnings, 'guildName'); }
  if (!Array.isArray(state.guildMembers)) { state.guildMembers = []; recordSchemaDefault(warnings, 'guildMembers'); }
  if (!Array.isArray(state.pendingReceipts)) { state.pendingReceipts = []; recordSchemaDefault(warnings, 'pendingReceipts'); }
  if (!Array.isArray(state.receivedReceipts)) { state.receivedReceipts = []; recordSchemaDefault(warnings, 'receivedReceipts'); }
  if (!isFiniteNumber(state.lastReceiptId) || state.lastReceiptId < 0) { state.lastReceiptId = defaults.lastReceiptId; recordSchemaDefault(warnings, 'lastReceiptId'); }

  if (!isFiniteNumber(state.saveVersion) || !Number.isInteger(state.saveVersion)) { state.saveVersion = defaults.saveVersion; recordSchemaDefault(warnings, 'saveVersion'); }
  return state;
}

function parseSaveVersion(parsed) {
  if (!Object.prototype.hasOwnProperty.call(parsed, 'saveVersion')) return 0;
  if (!isFiniteNumber(parsed.saveVersion) || !Number.isInteger(parsed.saveVersion)) {
    throw new Error('saveVersion must be an integer.');
  }
  if (parsed.saveVersion < 0 || parsed.saveVersion > CURRENT_SAVE_VERSION) {
    throw new Error(`Unsupported saveVersion ${parsed.saveVersion}.`);
  }
  return parsed.saveVersion;
}

function inferRawSaveVersion(raw) {
  try {
    const parsed = JSON.parse(raw);
    return isPlainObject(parsed) && isFiniteNumber(parsed.saveVersion) && Number.isInteger(parsed.saveVersion) ? parsed.saveVersion : 0;
  } catch (error) {
    return 'unknown';
  }
}

function createPremigrationSnapshot(raw, from) {
  const versionLabel = typeof from === 'number' ? from : 'unknown';
  let timestamp = Date.now();
  let key = `${PREMIGRATION_SNAPSHOT_PREFIX}v${versionLabel}_${timestamp}`;
  while (localStorage.getItem(key) !== null) {
    timestamp += 1;
    key = `${PREMIGRATION_SNAPSHOT_PREFIX}v${versionLabel}_${timestamp}`;
  }
  localStorage.setItem(key, raw);

  const snapshotKeys = getStorageKeys()
    .filter(candidate => candidate.startsWith(PREMIGRATION_SNAPSHOT_PREFIX))
    .sort((left, right) => {
      const leftTime = Number(left.match(/_(\d+)$/)?.[1] || 0);
      const rightTime = Number(right.match(/_(\d+)$/)?.[1] || 0);
      return rightTime - leftTime;
    });
  snapshotKeys.slice(MAX_PREMIGRATION_SNAPSHOTS).forEach(snapshotKey => localStorage.removeItem(snapshotKey));
  return key;
}

function logObjectiveReset(questId, objectiveId, reason) {
  console.warn(`Quest objective progress reset: ${questId}/${objectiveId} (${reason}).`);
}

function migrateObjectiveList(questId, templates, previousObjectives) {
  const previous = Array.isArray(previousObjectives) ? previousObjectives : [];
  const previousById = new Map(previous.filter(objective => objective && typeof objective.id === 'string').map(objective => [objective.id, objective]));
  const usedIds = new Set();
  const migrated = templates.map(template => {
    const previousObjective = previousById.get(template.id);
    if (!previousObjective) {
      logObjectiveReset(questId, template.id, 'objective did not exist in the legacy save');
      return { ...template, progress: 0, completed: false };
    }
    usedIds.add(template.id);
    const count = isFiniteNumber(template.count) ? Math.max(0, template.count) : Infinity;
    const previousProgress = isFiniteNumber(previousObjective.progress) ? previousObjective.progress : (previousObjective.completed ? count : 0);
    const progress = Number.isFinite(count) ? Math.max(0, Math.min(count, previousProgress)) : Math.max(0, previousProgress);
    return { ...previousObjective, ...template, id: template.id, progress, completed: Boolean(previousObjective.completed) || progress >= count };
  });
  previous.forEach(previousObjective => {
    if (previousObjective && typeof previousObjective.id === 'string' && !usedIds.has(previousObjective.id)) {
      logObjectiveReset(questId, previousObjective.id, 'objective no longer exists in the current quest definition');
    }
  });
  return migrated;
}

function getQuestObjectiveTemplates(quest, questState) {
  if (Array.isArray(quest.objectives)) return quest.objectives;
  if (Array.isArray(quest.chapters)) {
    const currentChapter = Number.isInteger(questState.currentChapter) ? questState.currentChapter : 0;
    return quest.chapters[currentChapter]?.objectives || [];
  }
  return [];
}

function migrateQuestState(state, force = false) {
  if (!force && state.quests && Array.isArray(state.quests.active)) return state;
  if (typeof QUESTS === 'undefined') throw new Error('Quest catalog is unavailable during save migration.');

  const canonical = {
    active: [],
    completed: Array.isArray(state.completedQuests) ? [...state.completedQuests] : [],
    failed: [],
    dailyReset: null
  };
  const legacy = Array.isArray(state.activeQuests) ? state.activeQuests : [];

  for (const entry of legacy) {
    const source = isPlainObject(entry) ? entry : {};
    const questId = typeof entry === 'string' ? entry : source.questId || source.id;
    if (!questId) {
      console.warn('Skipped a legacy active quest without an id.');
      continue;
    }
    const quest = QUESTS[questId];
    if (!quest) {
      console.warn(`Legacy active quest '${questId}' was preserved without objective migration because its definition is unavailable.`);
      canonical.active.push(questId);
      canonical[questId] = { ...source };
      continue;
    }
    const questState = {
      ...source,
      startedAt: typeof source.startedAt === 'string' ? source.startedAt : todayStr(),
      currentChapter: Number.isInteger(source.currentChapter) ? source.currentChapter : 0
    };
    const templates = getQuestObjectiveTemplates(quest, questState);
    const previousObjectives = source.objectives || source.chapterObjectives?.[questState.currentChapter];
    questState.objectives = migrateObjectiveList(questId, templates, previousObjectives);
    canonical.active.push(questId);
    canonical[questId] = questState;
  }

  state.quests = canonical;
  return state;
}

function migrateV0ToV1(state) {
  state.inventory = Array.isArray(state.inventory) ? state.inventory : [];
  state.equipment = isPlainObject(state.equipment) ? { ...DEFAULT_GAME_STATE.equipment, ...state.equipment } : cloneSaveState(DEFAULT_GAME_STATE.equipment);
  state.stash = Array.isArray(state.stash) ? state.stash : [];
  state.stashCapacity = isFiniteNumber(state.stashCapacity) ? state.stashCapacity : DEFAULT_GAME_STATE.stashCapacity;
  state.inventoryCapacityBonus = isFiniteNumber(state.inventoryCapacityBonus) ? state.inventoryCapacityBonus : DEFAULT_GAME_STATE.inventoryCapacityBonus;
  state.pendingLoot = Object.prototype.hasOwnProperty.call(state, 'pendingLoot') ? state.pendingLoot : null;
  return state;
}

function migrateV1ToV2(state) {
  state.itemSystem = isPlainObject(state.itemSystem) ? {
    ...cloneSaveState(DEFAULT_GAME_STATE.itemSystem),
    ...state.itemSystem,
    attunement: isPlainObject(state.itemSystem.attunement) ? state.itemSystem.attunement : {},
    rituals: isPlainObject(state.itemSystem.rituals) ? state.itemSystem.rituals : {},
    curses: isPlainObject(state.itemSystem.curses) ? state.itemSystem.curses : {}
  } : cloneSaveState(DEFAULT_GAME_STATE.itemSystem);
  return state;
}

function migrateV2ToV3(state, context = {}) {
  if (!context.hasCanonicalQuestState) migrateQuestState(state, true);
  state.guildId = state.guildId ?? null;
  state.guildName = state.guildName ?? null;
  state.guildMembers = Array.isArray(state.guildMembers) ? state.guildMembers : [];
  state.pendingReceipts = Array.isArray(state.pendingReceipts) ? state.pendingReceipts : [];
  state.receivedReceipts = Array.isArray(state.receivedReceipts) ? state.receivedReceipts : [];
  state.lastReceiptId = isFiniteNumber(state.lastReceiptId) ? state.lastReceiptId : 0;
  migrateQuestState(state);
  return state;
}

const MIGRATIONS = [
  { from: 0, to: 1, fn: migrateV0ToV1 },
  { from: 1, to: 2, fn: migrateV1ToV2 },
  { from: 2, to: 3, fn: migrateV2ToV3 }
];

function runMigrations(parsed, from, warnings) {
  let candidate = applySchemaDefaults({ ...parsed, saveVersion: from }, warnings);
  candidate.saveVersion = from;
  let version = from;
  while (version < CURRENT_SAVE_VERSION) {
    const migration = MIGRATIONS.find(step => step.from === version);
    if (!migration) throw new Error(`No migration exists from saveVersion ${version}.`);
    const beforeVersion = candidate.saveVersion;
    migration.fn(candidate, { hasCanonicalQuestState: Object.prototype.hasOwnProperty.call(parsed, 'quests') });
    if (candidate.saveVersion !== beforeVersion) {
      throw new Error(`Migration ${migration.from}->${migration.to} changed saveVersion before it completed.`);
    }
    candidate.saveVersion = migration.to;
    version = migration.to;
  }
  candidate = applySchemaDefaults(candidate, warnings);
  candidate.saveVersion = CURRENT_SAVE_VERSION;
  return candidate;
}

function saveGame() {
  try {
    localStorage.setItem('lifexp_save', JSON.stringify(gameState));
  } catch (e) {
    console.warn('Could not save game:', e);
  }
}

function finalizeLoadedState() {
  if (!gameState.tasks || gameState.tasks.length === 0) {
    gameState.tasks = JSON.parse(JSON.stringify(DEFAULT_TASKS));
  }

  // Recover legacy item entries before rendering the inventory.
  if (typeof migrateLegacyInventory === 'function') migrateLegacyInventory();
  if (typeof initializeItemSystem === 'function') initializeItemSystem();
  if (typeof repairInventoryIdentities === 'function') repairInventoryIdentities();

  // Merge official content added in later versions without touching custom task data.
  const existingTaskIds = new Set((gameState.tasks || []).map(task => task.id));
  for (const officialTask of DEFAULT_TASKS) {
    if (!existingTaskIds.has(officialTask.id)) {
      gameState.tasks.push(JSON.parse(JSON.stringify(officialTask)));
    }
  }

  updateStreak();
}

function loadGame() {
  const raw = localStorage.getItem('lifexp_save');
  if (!raw) {
    gameState = cloneSaveState(DEFAULT_GAME_STATE);
    finalizeLoadedState();
    return true;
  }

  const warnings = [];
  const inferredVersion = inferRawSaveVersion(raw);
  const previousState = gameState;
  let saveWasCommitted = false;
  try {
    // Snapshot the exact bytes before parsing or mutating anything.
    createPremigrationSnapshot(raw, inferredVersion);
    const parsed = JSON.parse(raw);
    if (!isPlainObject(parsed)) throw new Error('Save root must be an object.');
    const from = parseSaveVersion(parsed);
    const migrated = runMigrations(parsed, from, warnings);
    if (warnings.length > 0) console.warn('Save schema defaults applied:', warnings);

    // Persist only after every migration and schema check has succeeded.
    localStorage.setItem('lifexp_save', JSON.stringify(migrated));
    saveWasCommitted = true;
    gameState = migrated;
    finalizeLoadedState();
    return true;
  } catch (error) {
    // A failure after the commit is still recoverable: restore the exact raw save.
    gameState = previousState;
    if (saveWasCommitted) {
      try { localStorage.setItem('lifexp_save', raw); }
      catch (restoreError) { console.error('Could not restore the original save:', restoreError); }
    }
    showSaveLoadError(error instanceof Error ? error.message : String(error));
    return false;
  }
}

function updateStreak() {
  const today = todayStr();
  if (gameState.lastActiveDate === today) return;
  
  if (gameState.lastActiveDate) {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().slice(0, 10);
    
    if (gameState.lastActiveDate < yesterdayStr) {
      gameState.streak = 0;
    }
  }
}

// ===========================================================================
// UI RENDERING
// ===========================================================================

function showScreen(screenId) {
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  document.getElementById(`screen-${screenId}`).classList.add('active');
  
  document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
  document.querySelector(`.nav-item[data-screen="${screenId}"]`)?.classList.add('active');
  
  // Render screen content
  if (screenId === 'hub') renderHub();
  else if (screenId === 'character') renderCharacter();
  else if (screenId === 'inventory') renderInventory();
  else if (screenId === 'quests') renderQuests();
  else if (screenId === 'guild') renderGuild();
  else if (screenId === 'settings') renderSettings();
}

