// ===========================================================================
// LifeXP RPG - engine.js
// Nucleo del motor: gameState, variables de UI, utilidades, persistencia,
// migracion de save, updateStreak y showScreen.
// Depende de: classes.js, quests.js (globals), data_tasks.js y expansion_tasks.js.
// ===========================================================================

// ===========================================================================
// GAME STATE
// ===========================================================================

const DEFAULT_GAME_STATE = {
  // Player
  name: 'Adventurer',
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
  taskHistory: [], // append-only: { taskId, date, xp, sideQuest, completionId, schedule snapshot }
  taskModelVersion: 1,
  
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
  pendingLoot: { version: 1, entries: [] },
  rewardLedger: {},
  worldState: {},
  materialInteractions: { version: 1, ledger: {}, discoveredUses: {} },
  pendingTaskResult: null,
  saveVersion: 4, // v4 is the current canonical version (migration in loadGame handles v<4 saves)
  
  // Class (placeholder for next block)
  classId: 'novato',
  classLevel: 1,

  // Skills: known, equipped and source are explicit persisted data.
  skills: {
    version: 1,
    known: ['basic_attack', 'defend'],
    equipped: ['basic_attack', 'defend'],
    sources: {
      basic_attack: [{ type: 'initial', id: 'starter' }],
      defend: [{ type: 'initial', id: 'starter' }]
    }
  },
  
  // Quests (placeholder)
  activeQuests: [],
  completedQuests: [],
  
  // Canonical quest state
  // questModelVersion is independent from saveVersion so DT-24 can evolve
  // without rewriting the global save migration chain.
  questModelVersion: 3,
  quests: {
    active: [],
    completed: [],
    failed: [],
    dailyReset: null,
    slotLimits: {
      personal_project: 3,
      guild_order: 1
    },
    availableFollowUps: [],
    derivedTasks: [],
    journalEntries: [],
    missionSources: {
      version: 1,
      states: {},
      claims: {}
    }
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
let pendingMissionRevealNotices = [];
let pendingMissionFollowUpNotices = [];

// Save loading is a mandatory barrier before content installers may persist.
let lifeXPSaveLoadState = 'not_started';
const lifeXPContentInstallers = [];
let lifeXPContentInstallersRun = false;
let lifeXPSaveDeferred = 0;

function beginLifeXPTransaction() {
  lifeXPSaveDeferred += 1;
}

function endLifeXPTransaction() {
  lifeXPSaveDeferred = Math.max(0, lifeXPSaveDeferred - 1);
}

function isLifeXPTransactionDeferred() {
  return lifeXPSaveDeferred > 0;
}

function isLifeXPSaveReady() {
  return lifeXPSaveLoadState === 'ready';
}

function registerLifeXPContentInstaller(installer) {
  if (typeof installer !== 'function') throw new Error('Content installer must be a function.');
  if (lifeXPContentInstallersRun) throw new Error('Content installer registered after the installation phase.');
  lifeXPContentInstallers.push(installer);
}

function runLifeXPContentInstallers() {
  if (!isLifeXPSaveReady()) throw new Error('Cannot install content before the save is loaded successfully.');
  if (lifeXPContentInstallersRun) return;
  lifeXPContentInstallersRun = true;
  for (const installer of lifeXPContentInstallers) installer();
}

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
  const reachedLevels = [];
  while (gameState.xp >= xpForLevel(gameState.level)) {
    gameState.xp -= xpForLevel(gameState.level);
    gameState.level++;
    reachedLevels.push(gameState.level);
    leveledUp = true;
  }
  if (leveledUp) {
    // Trigger level up effects
    if (typeof showLevelUpEffect === 'function') showLevelUpEffect();
    if (typeof triggerHaptic === 'function') triggerHaptic();
    if (typeof showToast === 'function') showToast(`Level ${gameState.level}!`, 'gold');
    if (typeof updateQuestProgress === 'function') {
      reachedLevels.forEach(level => updateQuestProgress('level_up', {
        level,
        completionId: `level:${level}`
      }));
    }
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

function isTaskArchived(task) {
  return Boolean(task && (task.archived === true || task.status === 'archived'));
}

function normalizeTaskLimit(value, fallback = 1) {
  if (value === null) return null;
  if (Number.isInteger(value) && value >= 1) return value;
  return fallback;
}

function getTaskAvailabilityDefinition(task) {
  if (!task || typeof task !== 'object') {
    return {
      type: 'needs_review',
      frequency: null,
      intervalDays: null,
      limit: null,
      repeatable: null,
      reason: 'task_definition_unavailable'
    };
  }
  if (task.reviewStatus === 'needs_review') {
    return {
      type: 'needs_review',
      frequency: typeof task.freq === 'string' ? task.freq : null,
      intervalDays: null,
      limit: null,
      repeatable: null,
      reason: 'task_marked_for_review'
    };
  }

  const declared = isPlainObject(task.availability) ? task.availability : null;
  if (declared) {
    const type = declared.type === 'once' || declared.type === 'periodic' ? declared.type : null;
    const intervalDays = type === 'once'
      ? null
      : Number(declared.intervalDays ?? declared.days);
    const intervalIsValid = type === 'once' || (Number.isFinite(intervalDays) && intervalDays > 0);
    const repeatable = type === 'once' ? false : declared.repeatable === true;
    const limit = type === 'once' ? 1 : normalizeTaskLimit(declared.limit, 1);
    if (type && intervalIsValid && (type === 'once' || typeof declared.repeatable === 'boolean')) {
      return {
        type,
        frequency: typeof task.freq === 'string' ? task.freq : null,
        intervalDays,
        limit,
        repeatable,
        reason: null
      };
    }
    return {
      type: 'needs_review',
      frequency: typeof task.freq === 'string' ? task.freq : null,
      intervalDays: null,
      limit: null,
      repeatable: null,
      reason: 'invalid_task_availability'
    };
  }

  const frequency = typeof task.freq === 'string' ? task.freq : null;
  const definition = typeof FREQ !== 'undefined' && frequency ? FREQ[frequency] : null;
  if (!definition || !isPlainObject(definition.availability)) {
    return {
      type: 'needs_review',
      frequency,
      intervalDays: null,
      limit: null,
      repeatable: null,
      reason: 'missing_or_unknown_frequency'
    };
  }
  const availability = definition.availability;
  const type = availability.type === 'once' ? 'once' : availability.type === 'periodic' ? 'periodic' : null;
  const intervalDays = type === 'once' ? null : Number(availability.intervalDays ?? definition.days);
  if (!type || (type !== 'once' && (!Number.isFinite(intervalDays) || intervalDays <= 0))) {
    return {
      type: 'needs_review',
      frequency,
      intervalDays: null,
      limit: null,
      repeatable: null,
      reason: 'invalid_frequency_definition'
    };
  }
  return {
    type,
    frequency,
    intervalDays,
    limit: type === 'once' ? 1 : normalizeTaskLimit(availability.limit, 1),
    repeatable: type === 'once' ? false : availability.repeatable === true,
    reason: null
  };
}

function getTaskScheduleSettings(task) {
  const definition = getTaskAvailabilityDefinition(task);
  return {
    frequency: definition.frequency,
    availability: definition.type,
    intervalDays: definition.intervalDays,
    limit: definition.limit,
    repeatable: definition.repeatable,
    editable: definition.type === 'periodic',
    overridden: Boolean(task && isPlainObject(task.availability))
  };
}

function setTaskRepeatLimit(task, value) {
  if (!task || typeof task !== 'object') return false;
  if (value === null || value === undefined || value === '') {
    delete task.availability;
    return true;
  }
  const limit = Number(value);
  const current = getTaskAvailabilityDefinition(task);
  if (!Number.isInteger(limit) || limit < 1 || current.type !== 'periodic' || !Number.isFinite(current.intervalDays) || current.intervalDays <= 0) {
    return false;
  }
  task.availability = {
    type: 'periodic',
    intervalDays: current.intervalDays,
    limit,
    repeatable: true
  };
  return true;
}

function isValidTaskDate(value) {
  return typeof value === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(value) && !Number.isNaN(new Date(`${value}T00:00:00Z`).getTime());
}

function addDaysToDate(dateValue, days) {
  if (!isValidTaskDate(dateValue) || !Number.isFinite(days)) return null;
  const result = new Date(`${dateValue}T00:00:00Z`);
  result.setUTCDate(result.getUTCDate() + days);
  return result.toISOString().slice(0, 10);
}

function getTaskHistoryEntries(task) {
  if (!task || typeof task.id !== 'string') return [];
  const entries = Array.isArray(gameState.taskHistory)
    ? gameState.taskHistory.filter(entry => entry && entry.taskId === task.id)
    : [];
  if (isValidTaskDate(task.lastDone) && !entries.some(entry => entry.date === task.lastDone)) {
    entries.push({
      taskId: task.id,
      date: task.lastDone,
      completionId: `legacy-last-done:${task.id}:${task.lastDone}`,
      legacyLastDone: true
    });
  }
  return entries;
}

function getLatestTaskCompletionDate(task) {
  const dates = getTaskHistoryEntries(task)
    .map(entry => entry.date)
    .filter(isValidTaskDate)
    .sort();
  return dates.length > 0 ? dates[dates.length - 1] : null;
}

function getTaskAvailability(task, referenceDate = todayStr()) {
  const definition = getTaskAvailabilityDefinition(task);
  const history = getTaskHistoryEntries(task);
  const base = {
    taskId: task?.id || null,
    frequency: definition.frequency,
    availability: definition.type,
    intervalDays: definition.intervalDays,
    limit: definition.limit,
    repeatable: definition.repeatable,
    completionCount: history.length,
    periodCompletionCount: 0,
    remainingInPeriod: definition.limit === null ? null : definition.limit,
    nextAvailableDate: null
  };

  if (isTaskArchived(task)) return { ...base, status: 'archived', available: false };
  if (definition.type === 'needs_review') {
    return {
      ...base,
      status: 'needs_review',
      available: !isValidTaskDate(task?.lastDone),
      periodCompletionCount: 0,
      remainingInPeriod: null,
      reason: definition.reason
    };
  }
  if (definition.type === 'once' || definition.repeatable === false) {
    return {
      ...base,
      status: history.length > 0 ? 'completed' : 'available',
      available: history.length === 0,
      periodCompletionCount: Math.min(history.length, 1),
      remainingInPeriod: history.length > 0 ? 0 : 1,
      nextAvailableDate: null
    };
  }
  if (!isValidTaskDate(referenceDate)) {
    return { ...base, status: 'needs_review', available: false, reason: 'invalid_reference_date' };
  }
  if (definition.limit === null) return { ...base, status: 'available', available: true, periodCompletionCount: 0, remainingInPeriod: null };

  const recent = history.filter(entry => {
    if (!isValidTaskDate(entry.date)) return false;
    const age = daysBetween(entry.date, referenceDate);
    return age >= 0 && age < definition.intervalDays;
  });
  if (recent.length >= definition.limit) {
    const oldestRecent = recent
      .map(entry => entry.date)
      .sort()[0];
    return {
      ...base,
      status: 'cooldown',
      available: false,
      periodCompletionCount: recent.length,
      remainingInPeriod: 0,
      nextAvailableDate: addDaysToDate(oldestRecent, definition.intervalDays)
    };
  }
  return {
    ...base,
    status: 'available',
    available: true,
    periodCompletionCount: recent.length,
    remainingInPeriod: Math.max(0, definition.limit - recent.length)
  };
}

function createTaskHistoryEntry(task, values = {}) {
  const definition = getTaskAvailabilityDefinition(task);
  const date = isValidTaskDate(values.date) ? values.date : todayStr();
  const sideQuest = Boolean(values.sideQuest);
  const sequence = Number.isInteger(values.sequence) && values.sequence >= 0
    ? values.sequence
    : getTaskHistoryEntries(task).filter(entry => entry.date === date).length;
  const taskId = task?.id || null;
  return {
    taskId,
    date,
    xp: isFiniteNumber(values.xp) ? values.xp : 0,
    sideQuest,
    completionId: typeof values.completionId === 'string' && values.completionId
      ? values.completionId
      : `task:${taskId}:${date}:${sideQuest ? 'side' : 'base'}:${sequence}`,
    frequency: definition.frequency,
    availability: definition.type,
    intervalDays: definition.intervalDays,
    limit: definition.limit,
    repeatable: definition.repeatable
  };
}

function createTaskCompletionId(task, date = todayStr(), sequence = null) {
  const taskId = task && typeof task.id === 'string' && task.id ? task.id : null;
  const completionDate = isValidTaskDate(date) ? date : todayStr();
  if (!taskId) throw new Error('Cannot create a completion ID without a task ID.');

  const history = Array.isArray(gameState.taskHistory) ? gameState.taskHistory : [];
  const nextSequence = Number.isInteger(sequence) && sequence >= 0
    ? sequence
    : history.filter(entry => entry && entry.taskId === taskId && entry.date === completionDate).length;

  return `task:${taskId}:${completionDate}:${nextSequence}`;
}

function isTaskDue(task, referenceDate = todayStr()) {
  return getTaskAvailability(task, referenceDate).available;
}

function isTaskOverdue(task, referenceDate = todayStr()) {
  const definition = getTaskAvailabilityDefinition(task);
  const lastDone = getLatestTaskCompletionDate(task);
  if (isTaskArchived(task) || definition.type !== 'periodic' || !lastDone || !isValidTaskDate(referenceDate)) return false;
  const daysSince = daysBetween(lastDone, referenceDate);
  return daysSince > definition.intervalDays * 1.5;
}

function getOverflowTasks() {
  return gameState.tasks.filter(t => isTaskOverdue(t));
}

function getAvailableTasks(cat = null) {
  let tasks = gameState.tasks.filter(task => !isTaskArchived(task));
  if (cat) tasks = tasks.filter(t => t.cat === cat);
  
  const overflow = tasks.filter(t => isTaskOverdue(t));
  if (overflow.length > 0) return { tasks: overflow, isOverflow: true };
  
  const due = tasks.filter(t => isTaskDue(t));
  if (due.length > 0) return { tasks: due, isOverflow: false };
  
  return { tasks: [], isOverflow: false };
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

const CURRENT_SAVE_VERSION = 4;
const CURRENT_QUEST_MODEL_VERSION = 3;
const DEFAULT_QUEST_SLOT_LIMITS = Object.freeze({
  personal_project: 3,
  guild_order: 1
});
const PREMIGRATION_SNAPSHOT_PREFIX = 'lifexp_premigration_';
const MAX_PREMIGRATION_SNAPSHOTS = 3;

function cloneSaveState(value) {
  return JSON.parse(JSON.stringify(value));
}

function isPlainObject(value) {
  return value !== null && typeof value === 'object' && !Array.isArray(value);
}

function normalizeQuestSlotLimits(value, warnings = [], path = 'quests.slotLimits') {
  const source = isPlainObject(value) ? value : {};
  const normalized = { ...DEFAULT_QUEST_SLOT_LIMITS };
  for (const [group, defaultLimit] of Object.entries(DEFAULT_QUEST_SLOT_LIMITS)) {
    const limit = source[group];
    if (Number.isInteger(limit) && limit >= 0) {
      normalized[group] = limit;
    } else if (Object.prototype.hasOwnProperty.call(source, group)) {
      recordSchemaDefault(warnings, `${path}.${group}`);
    }
  }
  return normalized;
}

function normalizeCompletionIds(value) {
  if (!Array.isArray(value)) return [];
  return [...new Set(value.filter(id => typeof id === 'string' && id.length > 0))];
}

function normalizeWorldState(value) {
  return isPlainObject(value) ? cloneSaveState(value) : {};
}

function normalizeMissionConsequenceClaims(value) {
  if (!isPlainObject(value)) return {};
  const normalized = {};
  for (const [claimId, rawClaim] of Object.entries(value)) {
    if (!isPlainObject(rawClaim)) continue;
    const status = ['granted', 'pending', 'rejected'].includes(rawClaim.status) ? rawClaim.status : 'rejected';
    normalized[claimId] = {
      ...rawClaim,
      status,
      claimId: typeof rawClaim.claimId === 'string' && rawClaim.claimId ? rawClaim.claimId : claimId
    };
  }
  return normalized;
}

const QUEST_INSTANCE_STATUS = Object.freeze({
  active: 'active',
  completed: 'completed',
  failed: 'failed',
  needsReview: 'needs_review'
});


const MISSION_SOURCE_TYPES = Object.freeze({
  recovery: 'recovery',
  passive: 'passive',
  guild: 'guild'
});

const MISSION_SOURCE_STATUSES = Object.freeze({
  available: 'available',
  accepted: 'accepted',
  consumed: 'consumed',
  expired: 'expired',
  needsReview: 'needs_review'
});

function normalizeMissionSourceClaim(value, sourceId) {
  const source = isPlainObject(value) ? { ...value } : {};
  const status = ['granted', 'pending', 'rejected'].includes(source.status) ? source.status : 'rejected';
  return {
    ...source,
    sourceId: typeof source.sourceId === 'string' && source.sourceId ? source.sourceId : sourceId,
    status,
    claimId: typeof source.claimId === 'string' && source.claimId ? source.claimId : `source:${sourceId}`
  };
}

function normalizeMissionSourceState(value, sourceId) {
  const source = isPlainObject(value) ? { ...value } : {};
  const status = Object.values(MISSION_SOURCE_STATUSES).includes(source.status)
    ? source.status
    : MISSION_SOURCE_STATUSES.available;
  return {
    ...source,
    sourceId: typeof source.sourceId === 'string' && source.sourceId ? source.sourceId : sourceId,
    status,
    claimId: typeof source.claimId === 'string' && source.claimId ? source.claimId : null,
    options: Array.isArray(source.options) ? source.options : [],
    rewardApplication: isPlainObject(source.rewardApplication) ? source.rewardApplication : null,
    costApplication: isPlainObject(source.costApplication) ? source.costApplication : null
  };
}

function normalizeMissionSourcePersistence(value) {
  const source = isPlainObject(value) ? value : {};
  const states = {};
  if (isPlainObject(source.states)) {
    Object.entries(source.states).forEach(([sourceId, state]) => {
      if (typeof sourceId === 'string' && sourceId) states[sourceId] = normalizeMissionSourceState(state, sourceId);
    });
  }
  const claims = {};
  if (isPlainObject(source.claims)) {
    Object.entries(source.claims).forEach(([claimId, claim]) => {
      if (typeof claimId === 'string' && claimId) claims[claimId] = normalizeMissionSourceClaim(claim, claim?.sourceId || claimId);
    });
  }
  return {
    version: Number.isInteger(source.version) && source.version >= 1 ? source.version : 1,
    states,
    claims
  };
}

const MISSION_ACTION_STATUSES = Object.freeze({
  available: 'available',
  inProgress: 'in_progress',
  awaitingTask: 'awaiting_task',
  completed: 'completed',
  blocked: 'blocked',
  needsRecovery: 'needs_recovery'
});

const MISSION_ROUTE_NODE_STATUSES = Object.freeze({
  locked: 'locked',
  available: 'available',
  active: 'active',
  completed: 'completed',
  blocked: 'blocked',
  needsRecovery: 'needs_recovery'
});

function normalizeMissionActionCriterion(value, fallback = {}) {
  const source = isPlainObject(value) ? value : {};
  const criterion = { ...source, ...fallback };
  if (criterion.eventType === 'task_complete') criterion.eventType = 'task_completed';
  if (typeof criterion.eventType !== 'string' || !criterion.eventType) criterion.eventType = 'task_completed';
  if (criterion.category !== undefined && criterion.category !== null && typeof criterion.category !== 'string') delete criterion.category;
  if (criterion.taskId !== undefined && criterion.taskId !== null && typeof criterion.taskId !== 'string') delete criterion.taskId;
  if (criterion.theme !== undefined && criterion.theme !== null && typeof criterion.theme !== 'string') delete criterion.theme;
  if (criterion.derivedTaskId !== undefined && criterion.derivedTaskId !== null && typeof criterion.derivedTaskId !== 'string') delete criterion.derivedTaskId;
  if (criterion.enemyId !== undefined && criterion.enemyId !== null && typeof criterion.enemyId !== 'string') delete criterion.enemyId;
  if (criterion.level !== undefined && !Number.isFinite(Number(criterion.level))) delete criterion.level;
  return criterion;
}

function getMissionActionTarget(action) {
  if (action?.criterion?.eventType === 'level_up' && Number.isFinite(Number(action.criterion.level))) {
    return Math.max(1, Number(action.criterion.level));
  }
  return Number.isFinite(Number(action?.target)) ? Math.max(1, Number(action.target)) : 1;
}

function syncMissionActionPresentationState(action) {
  if (!isPlainObject(action)) return action;
  // These fields are persisted only as stable presentation aliases. Their
  // values must always be derived from the canonical action state.
  action.type = action.legacyType || action.type || null;
  action.category = action.criterion?.category ?? null;
  action.taskId = action.criterion?.taskId ?? null;
  action.enemyId = action.criterion?.enemyId ?? null;
  action.level = action.criterion?.level ?? null;
  action.count = action.target;
  action.completed = action.status === MISSION_ACTION_STATUSES.completed;
  action.consumedCompletionIds = [...(Array.isArray(action.consumedEventIds) ? action.consumedEventIds : [])];
  return action;
}

function normalizeMissionActionState(value, index = 0) {
  const source = isPlainObject(value) ? value : {};
  const action = { ...source };
  action.id = typeof action.id === 'string' && action.id ? action.id : `action_${index + 1}`;
  action.nodeId = typeof action.nodeId === 'string' && action.nodeId ? action.nodeId : 'root';
  action.criterion = normalizeMissionActionCriterion(action.criterion, {});
  action.target = getMissionActionTarget({ ...action, criterion: action.criterion });
  const rawProgress = Number.isFinite(Number(action.progress)) ? Math.max(0, Number(action.progress)) : 0;
  action.progress = Math.min(action.target, rawProgress);
  action.consumedEventIds = normalizeCompletionIds(action.consumedEventIds);
  const validStatuses = Object.values(MISSION_ACTION_STATUSES);
  action.status = validStatuses.includes(action.status) ? action.status : MISSION_ACTION_STATUSES.available;
  if (action.progress >= action.target) action.status = MISSION_ACTION_STATUSES.completed;
  if (!isPlainObject(action.requirements)) action.requirements = {};
  syncMissionActionPresentationState(action);
  return action;
}

function normalizeMissionRouteNode(value, index = 0) {
  const source = isPlainObject(value) ? value : {};
  const node = { ...source };
  node.id = typeof node.id === 'string' && node.id ? node.id : `node_${index + 1}`;
  node.actionIds = normalizeCompletionIds(node.actionIds);
  const validStatuses = Object.values(MISSION_ROUTE_NODE_STATUSES);
  node.status = validStatuses.includes(node.status) ? node.status : (index === 0 ? MISSION_ROUTE_NODE_STATUSES.active : MISSION_ROUTE_NODE_STATUSES.locked);
  return node;
}

function getQuestCatalogDefinition(questId) {
  if (typeof QUESTS === 'undefined' || !isPlainObject(QUESTS)) return null;
  return isPlainObject(QUESTS[questId]) ? QUESTS[questId] : null;
}

function getObjectiveCriterion(objective) {
  const source = isPlainObject(objective) ? objective : {};
  const eventByType = {
    complete_tasks: 'task_completed',
    defeat_enemy: 'enemy_defeated',
    defeat_boss: 'boss_defeated',
    reach_level: 'level_up',
    equip_item: 'item_equipped'
  };
  const criterion = {
    eventType: eventByType[source.type] || source.eventType || 'task_completed'
  };
  for (const key of ['category', 'taskId', 'theme', 'derivedTaskId', 'enemyId']) {
    if (source[key] !== undefined) criterion[key] = source[key];
  }
  if (source.level !== undefined) criterion.level = source.level;
  return normalizeMissionActionCriterion(criterion);
}

function createTranslatedAction(objective, previous, nodeId, nodeStatus, index, terminal = false) {
  const source = isPlainObject(objective) ? objective : {};
  const old = isPlainObject(previous) ? previous : {};
  const criterion = getObjectiveCriterion(source);
  const target = criterion.eventType === 'level_up' && Number.isFinite(Number(source.level))
    ? Math.max(1, Number(source.level))
    : (Number.isFinite(Number(source.count)) ? Math.max(1, Number(source.count)) : 1);
  const progress = terminal
    ? target
    : Math.min(target, Number.isFinite(Number(old.progress)) ? Math.max(0, Number(old.progress)) : (Number.isFinite(Number(source.progress)) ? Math.max(0, Number(source.progress)) : 0));
  const completed = terminal || old.completed === true || source.completed === true || progress >= target;
  let status;
  if (completed) status = MISSION_ACTION_STATUSES.completed;
  else if (nodeStatus === MISSION_ROUTE_NODE_STATUSES.locked) status = MISSION_ACTION_STATUSES.blocked;
  else if (nodeStatus === MISSION_ROUTE_NODE_STATUSES.needsRecovery) status = MISSION_ACTION_STATUSES.needsRecovery;
  else status = MISSION_ACTION_STATUSES.inProgress;
  return normalizeMissionActionState({
    id: typeof source.id === 'string' && source.id ? source.id : `objective_${index + 1}`,
    nodeId,
    status,
    progress,
    target,
    criterion,
    requirements: {},
    consumedEventIds: old.consumedCompletionIds || old.consumedEventIds || [],
    legacyType: typeof source.type === 'string' ? source.type : null
  }, index);
}

function getDefinitionStage(quest, stageId, index) {
  const stages = Array.isArray(quest?.stages) ? quest.stages : (Array.isArray(quest?.chapters) ? quest.chapters : []);
  return stages.find(stage => stage && stage.id === stageId) || stages[index] || null;
}

function getLegacyStageSources(value, quest) {
  if (Array.isArray(value.stages)) {
    return value.stages.map((stage, index) => ({
      id: isPlainObject(stage) && typeof stage.id === 'string' ? stage.id : `stage_${index + 1}`,
      state: isPlainObject(stage) ? stage : {},
      definition: getDefinitionStage(quest, stage?.id, index),
      index
    }));
  }
  if (Array.isArray(quest?.chapters)) {
    const currentChapter = Number.isInteger(value.currentChapter) ? Math.max(0, value.currentChapter) : 0;
    const chapterObjectives = isPlainObject(value.chapterObjectives) ? value.chapterObjectives : {};
    return quest.chapters.map((chapter, index) => ({
      id: typeof chapter.id === 'string' ? chapter.id : `chapter_${index + 1}`,
      state: {
        id: chapter.id,
        status: index < currentChapter ? 'completed' : index === currentChapter ? 'active' : 'locked',
        objectives: index === currentChapter
          ? (Array.isArray(value.objectives) && value.objectives.length > 0 ? value.objectives : chapterObjectives[String(index)] || chapter.objectives || [])
          : (chapterObjectives[String(index)] || chapter.objectives || [])
      },
      definition: chapter,
      index
    }));
  }
  return [];
}

function translateQuestInstanceToActions(value, questId, context = {}) {
  if (!isPlainObject(value)) return value;
  const quest = getQuestCatalogDefinition(questId);
  const source = { ...value };
  const hasActions = Array.isArray(source.actions);
  if (hasActions) return normalizeMissionActionInstance(source, context);

  const actions = [];
  const routeNodes = [];
  const stageSources = getLegacyStageSources(source, quest);
  const hasStages = stageSources.length > 0;
  const terminal = context.completed === true || source.status === QUEST_INSTANCE_STATUS.completed;
  let migrationSource;

  if (hasStages) {
    for (const stageSource of stageSources) {
      const stageState = stageSource.state;
      const definition = stageSource.definition;
      const templates = Array.isArray(stageState.objectives) && stageState.objectives.length > 0
        ? stageState.objectives
        : (Array.isArray(definition?.objectives) ? definition.objectives : []);
      const previousById = new Map((Array.isArray(stageState.objectives) ? stageState.objectives : []).filter(item => item && typeof item.id === 'string').map(item => [item.id, item]));
      const nodeStatus = terminal || stageState.status === 'completed'
        ? MISSION_ROUTE_NODE_STATUSES.completed
        : stageState.status === 'active'
          ? MISSION_ROUTE_NODE_STATUSES.active
          : stageState.status === 'needs_recovery'
            ? MISSION_ROUTE_NODE_STATUSES.needsRecovery
            : MISSION_ROUTE_NODE_STATUSES.locked;
      const node = normalizeMissionRouteNode({ id: stageSource.id, status: nodeStatus, actionIds: [] }, stageSource.index);
      templates.forEach((objective, index) => {
        const action = createTranslatedAction(objective, previousById.get(objective?.id), node.id, node.status, actions.length, terminal || node.status === MISSION_ROUTE_NODE_STATUSES.completed);
        actions.push(action);
        node.actionIds.push(action.id);
      });
      routeNodes.push(node);
    }
    migrationSource = {
      model: Array.isArray(source.stages) ? 'dt24_stages' : 'legacy_chapters',
      questModelVersion: 2,
      stages: Array.isArray(source.stages) ? cloneSaveState(source.stages) : null,
      objectives: Array.isArray(source.objectives) ? cloneSaveState(source.objectives) : null,
      chapterObjectives: isPlainObject(source.chapterObjectives) ? cloneSaveState(source.chapterObjectives) : null,
      currentStage: Number.isInteger(source.currentStage) ? source.currentStage : null,
      currentChapter: Number.isInteger(source.currentChapter) ? source.currentChapter : null
    };
  } else {
    const templates = Array.isArray(source.objectives) && source.objectives.length > 0
      ? source.objectives
      : (Array.isArray(quest?.objectives) ? quest.objectives : []);
    const previousById = new Map((Array.isArray(source.objectives) ? source.objectives : []).filter(item => item && typeof item.id === 'string').map(item => [item.id, item]));
    const node = normalizeMissionRouteNode({ id: 'root', status: terminal ? 'completed' : MISSION_ROUTE_NODE_STATUSES.active, actionIds: [] }, 0);
    templates.forEach((objective, index) => {
      const action = createTranslatedAction(objective, previousById.get(objective?.id), node.id, node.status, actions.length, terminal || node.status === MISSION_ROUTE_NODE_STATUSES.completed);
      actions.push(action);
      node.actionIds.push(action.id);
    });
    routeNodes.push(node);
    migrationSource = {
      model: 'legacy_objectives',
      questModelVersion: 2,
      objectives: Array.isArray(source.objectives) ? cloneSaveState(source.objectives) : null,
      currentChapter: Number.isInteger(source.currentChapter) ? source.currentChapter : null
    };
  }

  const translated = { ...source };
  translated.actions = actions;
  translated.routeNodes = routeNodes;
  translated.currentNodeId = routeNodes.find(node => node.status === MISSION_ROUTE_NODE_STATUSES.active)?.id || null;
  translated.activeActionId = actions.find(action => action.status === MISSION_ACTION_STATUSES.inProgress || action.status === MISSION_ACTION_STATUSES.awaitingTask)?.id || null;
  translated.completedActionIds = actions.filter(action => action.status === MISSION_ACTION_STATUSES.completed).map(action => action.id);
  translated.consumedEventIds = normalizeCompletionIds(source.consumedEventIds);
  translated.discoveredRevealIds = normalizeCompletionIds(source.discoveredRevealIds);
  translated.revealClaims = isPlainObject(source.revealClaims) ? cloneSaveState(source.revealClaims) : {};
  translated.consequenceClaims = isPlainObject(source.consequenceClaims) ? cloneSaveState(source.consequenceClaims) : {};
  translated.recovery = isPlainObject(source.recovery)
    ? { ...source.recovery }
    : { status: 'none', reason: null, options: [] };
  translated.actionModelVersion = 1;
  translated.migrationSource = migrationSource;
  translated.status = terminal ? QUEST_INSTANCE_STATUS.completed : (source.status === QUEST_INSTANCE_STATUS.failed ? QUEST_INSTANCE_STATUS.failed : QUEST_INSTANCE_STATUS.active);
  translated.currentStage = translated.currentNodeId ? routeNodes.findIndex(node => node.id === translated.currentNodeId) : null;
  delete translated.objectives;
  delete translated.stages;
  delete translated.chapterObjectives;
  return translated;
}

function normalizeMissionActionInstance(value, context = {}) {
  const normalized = { ...value };
  normalized.actions = Array.isArray(normalized.actions) ? normalized.actions.map(normalizeMissionActionState) : [];
  normalized.routeNodes = Array.isArray(normalized.routeNodes)
    ? normalized.routeNodes.map(normalizeMissionRouteNode)
    : [normalizeMissionRouteNode({ id: 'root', status: 'active', actionIds: normalized.actions.map(action => action.id) }, 0)];
  const actionIds = new Set(normalized.actions.map(action => action.id));
  normalized.routeNodes = normalized.routeNodes.map(node => ({
    ...node,
    actionIds: node.actionIds.filter(id => actionIds.has(id))
  }));
  if (normalized.actions.length === 0 && normalized.status !== QUEST_INSTANCE_STATUS.completed) {
    normalized.recovery = { status: 'needs_review', reason: 'no_translatable_actions', options: [] };
  }
  normalized.consumedEventIds = normalizeCompletionIds(normalized.consumedEventIds);
  normalized.completedActionIds = normalizeCompletionIds(normalized.completedActionIds).filter(id => actionIds.has(id));
  normalized.derivedTaskIds = normalizeCompletionIds(normalized.derivedTaskIds);
  normalized.discoveredRevealIds = normalizeCompletionIds(normalized.discoveredRevealIds);
  normalized.revealClaims = isPlainObject(normalized.revealClaims) ? normalized.revealClaims : {};
  normalized.consequenceClaims = normalizeMissionConsequenceClaims(normalized.consequenceClaims);
  normalized.recovery = isPlainObject(normalized.recovery)
    ? { status: typeof normalized.recovery.status === 'string' ? normalized.recovery.status : 'none', ...normalized.recovery }
    : { status: 'none', reason: null, options: [] };
  normalized.actionModelVersion = 1;
  const activeNode = normalized.routeNodes.find(node => node.status === MISSION_ROUTE_NODE_STATUSES.active);
  normalized.currentNodeId = typeof normalized.currentNodeId === 'string' && normalized.routeNodes.some(node => node.id === normalized.currentNodeId)
    ? normalized.currentNodeId
    : (activeNode?.id || null);
  const currentNode = normalized.routeNodes.find(node => node.id === normalized.currentNodeId);
  if (currentNode && currentNode.status === MISSION_ROUTE_NODE_STATUSES.active) {
    normalized.actions = normalized.actions.map(action => {
      if (action.status === MISSION_ACTION_STATUSES.completed) return action;
      if (action.nodeId !== currentNode.id) return { ...action, status: MISSION_ACTION_STATUSES.blocked };
      if (action.status === MISSION_ACTION_STATUSES.blocked || action.status === MISSION_ACTION_STATUSES.available) return { ...action, status: MISSION_ACTION_STATUSES.inProgress };
      return action;
    });
  }
  normalized.completedActionIds = normalized.actions.filter(action => action.status === MISSION_ACTION_STATUSES.completed).map(action => action.id);
  normalized.activeActionId = normalized.actions.find(action => action.status === MISSION_ACTION_STATUSES.inProgress || action.status === MISSION_ACTION_STATUSES.awaitingTask)?.id || null;
  if (context.completed === true || normalized.status === QUEST_INSTANCE_STATUS.completed) {
    normalized.status = QUEST_INSTANCE_STATUS.completed;
    normalized.currentNodeId = null;
    normalized.currentStage = null;
    normalized.routeNodes = normalized.routeNodes.map(node => ({ ...node, status: MISSION_ROUTE_NODE_STATUSES.completed }));
    normalized.actions = normalized.actions.map(action => ({ ...action, status: MISSION_ACTION_STATUSES.completed, progress: action.target }));
    normalized.completedActionIds = normalized.actions.map(action => action.id);
    normalized.activeActionId = null;
  } else if (normalized.status !== QUEST_INSTANCE_STATUS.failed) {
    normalized.status = QUEST_INSTANCE_STATUS.active;
  }
  return normalized;
}

function normalizeQuestInstanceState(value, context = {}) {
  if (!isPlainObject(value)) return value;
  const translated = translateQuestInstanceToActions(value, context.questId, context);
  return normalizeMissionActionInstance(translated, context);
}

const DERIVED_TASK_STATUSES = Object.freeze({
  pending: 'pending',
  accepted: 'accepted',
  completed: 'completed',
  expired: 'expired',
  needsReview: 'needs_review'
});

function normalizeDerivedTaskDefinition(value) {
  if (!isPlainObject(value)) return null;
  const definition = cloneSaveState(value);
  if (typeof definition.name !== 'string' || !definition.name.trim()) return null;
  if (typeof definition.desc !== 'string' || !definition.desc.trim()) return null;
  if (typeof definition.cat !== 'string' || !definition.cat.trim()) return null;
  if (!isPlainObject(definition.stats)) return null;
  if (!isFiniteNumber(Number(definition.xp)) || Number(definition.xp) < 0) return null;
  definition.xp = Number(definition.xp);
  definition.availability = isPlainObject(definition.availability)
    ? definition.availability
    : { type: 'once', intervalDays: null, limit: 1, repeatable: false };
  definition.freq = typeof definition.freq === 'string' && definition.freq ? definition.freq : 'once';
  return definition;
}

function normalizeDerivedTaskState(value) {
  if (!isPlainObject(value)) {
    return { status: DERIVED_TASK_STATUSES.needsReview, rawValue: value === undefined ? null : cloneSaveState(value), taskHistory: [] };
  }
  const normalized = { ...value };
  if (typeof normalized.id !== 'string' || !normalized.id) normalized.status = DERIVED_TASK_STATUSES.needsReview;
  if (!Object.values(DERIVED_TASK_STATUSES).includes(normalized.status)) normalized.status = DERIVED_TASK_STATUSES.pending;
  if (typeof normalized.sourceQuestId !== 'string' || !normalized.sourceQuestId) normalized.status = DERIVED_TASK_STATUSES.needsReview;
  if (typeof normalized.sourceActionId !== 'string' || !normalized.sourceActionId) normalized.status = DERIVED_TASK_STATUSES.needsReview;
  if (typeof normalized.templateId !== 'string' || !normalized.templateId) normalized.status = DERIVED_TASK_STATUSES.needsReview;
  if (!Array.isArray(normalized.taskHistory)) normalized.taskHistory = [];
  if (normalized.taskDefinition !== undefined && !normalizeDerivedTaskDefinition(normalized.taskDefinition)) {
    normalized.status = DERIVED_TASK_STATUSES.needsReview;
  }
  return normalized;
}

function getDerivedTaskById(derivedTaskId) {
  if (typeof derivedTaskId !== 'string' || !derivedTaskId || !Array.isArray(gameState.quests?.derivedTasks)) return null;
  return gameState.quests.derivedTasks.find(task => task && task.id === derivedTaskId) || null;
}

function createDerivedTaskId(sourceQuestId, sourceActionId, templateId) {
  return ['derived', sourceQuestId, sourceActionId, templateId]
    .map(value => String(value || '').trim().toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/^_+|_+$/g, ''))
    .join('_');
}

function materializeDerivedTask(derivedTask) {
  if (!isPlainObject(derivedTask)) return false;
  if (![DERIVED_TASK_STATUSES.accepted, DERIVED_TASK_STATUSES.completed].includes(derivedTask.status)) return false;
  const definition = normalizeDerivedTaskDefinition(derivedTask.taskDefinition);
  if (!definition) {
    derivedTask.status = DERIVED_TASK_STATUSES.needsReview;
    derivedTask.reviewReason = 'invalid_task_definition';
    return true;
  }
  const existing = getTaskById(derivedTask.id);
  if (existing) {
    if (existing.derivedTaskId === derivedTask.id) return false;
    derivedTask.status = DERIVED_TASK_STATUSES.needsReview;
    derivedTask.reviewReason = 'task_id_collision';
    return true;
  }
  gameState.tasks.push({
    ...definition,
    id: derivedTask.id,
    source: 'derived_task',
    derivedTaskId: derivedTask.id,
    sourceQuestId: derivedTask.sourceQuestId,
    sourceActionId: derivedTask.sourceActionId,
    templateId: derivedTask.templateId,
    derivedTaskStatus: derivedTask.status,
    availability: definition.availability
  });
  return true;
}

function reconcileDerivedTasks() {
  if (!gameState.quests || !Array.isArray(gameState.quests.derivedTasks)) return false;
  let changed = false;
  for (const derivedTask of gameState.quests.derivedTasks) {
    changed = materializeDerivedTask(derivedTask) || changed;
  }
  return changed;
}

function createDerivedTask(template, options = {}) {
  const sourceQuestId = typeof options.sourceQuestId === 'string' ? options.sourceQuestId : null;
  const sourceActionId = typeof options.sourceActionId === 'string' ? options.sourceActionId : null;
  const templateId = typeof options.templateId === 'string' ? options.templateId : (template?.id || null);
  const definition = normalizeDerivedTaskDefinition(template);
  if (!sourceQuestId || !sourceActionId || !templateId || !definition) return null;
  if (!gameState.quests || !Array.isArray(gameState.quests.derivedTasks)) return null;
  const id = typeof options.id === 'string' && options.id ? options.id : createDerivedTaskId(sourceQuestId, sourceActionId, templateId);
  const existing = getDerivedTaskById(id);
  if (existing) return existing;
  const derivedTask = normalizeDerivedTaskState({
    id,
    sourceQuestId,
    sourceActionId,
    templateId,
    status: options.status === DERIVED_TASK_STATUSES.pending ? DERIVED_TASK_STATUSES.pending : DERIVED_TASK_STATUSES.accepted,
    createdAt: typeof options.createdAt === 'string' ? options.createdAt : new Date().toISOString(),
    taskDefinition: definition,
    taskHistory: []
  });
  gameState.quests.derivedTasks.push(derivedTask);
  materializeDerivedTask(derivedTask);
  return derivedTask;
}

function markDerivedTaskCompleted(derivedTaskId, completionId, data = {}) {
  const derivedTask = getDerivedTaskById(derivedTaskId);
  if (!derivedTask || !completionId || derivedTask.status === DERIVED_TASK_STATUSES.completed) return false;
  if (derivedTask.taskHistory.some(entry => entry && entry.completionId === completionId)) return false;
  derivedTask.status = DERIVED_TASK_STATUSES.completed;
  derivedTask.completedAt = typeof data.date === 'string' ? data.date : todayStr();
  derivedTask.completionId = completionId;
  derivedTask.taskHistory.push({
    completionId,
    taskId: derivedTask.id,
    date: derivedTask.completedAt
  });
  const task = getTaskById(derivedTask.id);
  if (task) {
    task.derivedTaskStatus = DERIVED_TASK_STATUSES.completed;
    task.lastDone = derivedTask.completedAt;
  }
  return true;
}

function normalizeQuestPersistence(state, warnings = []) {
  if (!isPlainObject(state.quests)) state.quests = cloneSaveState(DEFAULT_GAME_STATE.quests);
  const questState = state.quests;
  if (!Array.isArray(questState.active)) questState.active = [];
  if (!Array.isArray(questState.completed)) questState.completed = [];
  if (!Array.isArray(questState.failed)) questState.failed = [];
  if (questState.dailyReset !== null && typeof questState.dailyReset !== 'string') questState.dailyReset = null;
  questState.slotLimits = normalizeQuestSlotLimits(questState.slotLimits, warnings);
  questState.availableFollowUps = Array.isArray(questState.availableFollowUps) ? [...new Set(questState.availableFollowUps.filter(id => typeof id === 'string' && id))] : [];
  questState.derivedTasks = Array.isArray(questState.derivedTasks) ? questState.derivedTasks.map(normalizeDerivedTaskState) : [];
  questState.missionSources = normalizeMissionSourcePersistence(questState.missionSources);
  questState.journalEntries = Array.isArray(questState.journalEntries)
    ? questState.journalEntries.filter(entry => isPlainObject(entry) && typeof entry.id === 'string' && entry.id)
      .map(entry => ({ ...entry, title: typeof entry.title === 'string' ? entry.title : '', body: typeof entry.body === 'string' ? entry.body : '' }))
    : [];
  const journalIds = new Set();
  questState.journalEntries = questState.journalEntries.filter(entry => {
    if (journalIds.has(entry.id)) return false;
    journalIds.add(entry.id);
    return true;
  });
  const questIds = new Set([...questState.active, ...questState.completed, ...questState.failed]);
  for (const questId of questIds) {
    if (typeof questId !== 'string' || !isPlainObject(questState[questId])) continue;
    const normalized = normalizeQuestInstanceState(questState[questId], {
      questId,
      active: questState.active.includes(questId),
      completed: questState.completed.includes(questId),
      failed: questState.failed.includes(questId)
    });
    normalized.journalEntryIds = normalizeCompletionIds(normalized.journalEntryIds);
    normalized.revealClaims = isPlainObject(normalized.revealClaims) ? normalized.revealClaims : {};
    questState[questId] = normalized;
    if (normalized.status === QUEST_INSTANCE_STATUS.completed) {
      questState.active = questState.active.filter(id => id !== questId);
      questState.failed = questState.failed.filter(id => id !== questId);
      if (!questState.completed.includes(questId)) questState.completed.push(questId);
    } else if (normalized.status === QUEST_INSTANCE_STATUS.failed) {
      questState.active = questState.active.filter(id => id !== questId);
      questState.completed = questState.completed.filter(id => id !== questId);
      if (!questState.failed.includes(questId)) questState.failed.push(questId);
    }
  }
  state.questModelVersion = CURRENT_QUEST_MODEL_VERSION;
  return state;
}

function completeMissionInstanceState(questState) {
  if (!isPlainObject(questState)) return false;
  questState.status = QUEST_INSTANCE_STATUS.completed;
  questState.currentNodeId = null;
  questState.currentStage = null;
  questState.activeActionId = null;
  questState.actions = (Array.isArray(questState.actions) ? questState.actions : []).map(action => syncMissionActionPresentationState({ ...action, status: MISSION_ACTION_STATUSES.completed, progress: action.target }));
  questState.completedActionIds = questState.actions.map(action => action.id);
  questState.routeNodes = (Array.isArray(questState.routeNodes) ? questState.routeNodes : []).map(node => ({ ...node, status: MISSION_ROUTE_NODE_STATUSES.completed }));
  return true;
}

function getMissionEventCompletionId(data = {}) {
  return [data.completionId, data.claimId, data.eventId].find(value => typeof value === 'string' && value.length > 0) || null;
}


function normalizeMissionRevealDefinition(value, index = 0) {
  if (!isPlainObject(value)) return null;
  const reveal = { ...value };
  reveal.id = typeof reveal.id === 'string' && reveal.id.trim() ? reveal.id.trim() : `reveal_${index + 1}`;
  reveal.title = typeof reveal.title === 'string' ? reveal.title.trim() : '';
  reveal.body = typeof reveal.body === 'string'
    ? reveal.body.trim()
    : (typeof reveal.description === 'string' ? reveal.description.trim() : '');
  if (!reveal.title || !reveal.body) return null;
  const when = reveal.when || reveal.trigger || 'action_completed';
  reveal.when = ['action_completed', 'node_completed'].includes(when) ? when : 'action_completed';
  if (reveal.relatedReference !== undefined && !isPlainObject(reveal.relatedReference)) {
    delete reveal.relatedReference;
  }
  return reveal;
}

function getMissionActionCatalogDefinition(quest, action) {
  if (!isPlainObject(quest) || !isPlainObject(action)) return null;
  const candidates = [];
  if (Array.isArray(quest.actions)) candidates.push(...quest.actions);
  if (Array.isArray(quest.chapters)) {
    quest.chapters.forEach(chapter => {
      if (Array.isArray(chapter?.actions)) candidates.push(...chapter.actions);
    });
  }
  return candidates.find(candidate => candidate && candidate.id === action.id) || null;
}

function getMissionNodeCatalogDefinition(quest, node) {
  if (!isPlainObject(quest) || !isPlainObject(node)) return null;
  const candidates = Array.isArray(quest.routeNodes) ? quest.routeNodes : [];
  return candidates.find(candidate => candidate && candidate.id === node.id) || null;
}

function getMissionRevealDefinitionsForAction(quest, action) {
  const catalogAction = getMissionActionCatalogDefinition(quest, action);
  const declared = [
    ...(Array.isArray(catalogAction?.reveals) ? catalogAction.reveals : []),
    ...(Array.isArray(action?.reveals) ? action.reveals : [])
  ];
  const seen = new Set();
  return declared.map(normalizeMissionRevealDefinition).filter(reveal => {
    if (!reveal || seen.has(reveal.id)) return false;
    seen.add(reveal.id);
    return true;
  });
}

function getMissionRevealDefinitionsForNode(quest, node) {
  const catalogNode = getMissionNodeCatalogDefinition(quest, node);
  const declared = [
    ...(Array.isArray(catalogNode?.reveals) ? catalogNode.reveals : []),
    ...(Array.isArray(node?.reveals) ? node.reveals : [])
  ];
  const seen = new Set();
  return declared.map(normalizeMissionRevealDefinition).filter(reveal => {
    if (!reveal || reveal.when !== 'node_completed' || seen.has(reveal.id)) return false;
    seen.add(reveal.id);
    return true;
  });
}

function getMissionRevealDiscoveryId(questId, reveal) {
  return `${questId}:${reveal.id}`;
}

function getMissionJournalEntries(questId = null) {
  const entries = Array.isArray(gameState.quests?.journalEntries) ? gameState.quests.journalEntries : [];
  return entries
    .filter(entry => entry && (questId === null || entry.missionId === questId))
    .map(entry => ({ ...entry, relatedReference: isPlainObject(entry.relatedReference) ? cloneSaveState(entry.relatedReference) : undefined }))
    .sort((left, right) => String(left.discoveredAt || '').localeCompare(String(right.discoveredAt || '')));
}

function getMissionJournalEntryById(entryId) {
  if (typeof entryId !== 'string' || !entryId) return null;
  return getMissionJournalEntries().find(entry => entry.id === entryId) || null;
}

function applyMissionReveal(questId, questState, reveal, source = {}) {
  if (!isPlainObject(questState) || !isPlainObject(reveal)) return null;
  const normalized = normalizeMissionRevealDefinition(reveal);
  if (!normalized || !gameState.quests) return null;
  const discoveryId = getMissionRevealDiscoveryId(questId, normalized);
  if (!Array.isArray(questState.discoveredRevealIds)) questState.discoveredRevealIds = [];
  if (!isPlainObject(questState.revealClaims)) questState.revealClaims = {};
  const claimId = `${questState.instanceId || `quest:${questId}`}:reveal:${normalized.id}`;
  const existingEntry = getMissionJournalEntryById(discoveryId);
  const alreadyDiscovered = questState.discoveredRevealIds.includes(discoveryId);
  if (alreadyDiscovered && existingEntry) return existingEntry;

  const entry = existingEntry || {
    id: discoveryId,
    revealId: normalized.id,
    missionId: questId,
    instanceId: typeof questState.instanceId === 'string' ? questState.instanceId : null,
    sourceActionId: typeof source.actionId === 'string' ? source.actionId : null,
    sourceNodeId: typeof source.nodeId === 'string' ? source.nodeId : null,
    title: normalized.title,
    body: normalized.body,
    relatedReference: normalized.relatedReference ? cloneSaveState(normalized.relatedReference) : undefined,
    discoveredAt: new Date().toISOString()
  };

  if (!alreadyDiscovered) questState.discoveredRevealIds.push(discoveryId);
  questState.revealClaims[claimId] = {
    status: 'granted',
    discoveryId,
    revealId: normalized.id,
    missionId: questId,
    updatedAt: entry.discoveredAt
  };
  if (!Array.isArray(gameState.quests.journalEntries)) gameState.quests.journalEntries = [];
  if (!existingEntry) gameState.quests.journalEntries.push(entry);
  if (!Array.isArray(questState.journalEntryIds)) questState.journalEntryIds = [];
  if (!questState.journalEntryIds.includes(discoveryId)) questState.journalEntryIds.push(discoveryId);
  return entry;
}

function applyMissionRevealsForAction(questId, questState, action) {
  const quest = getQuestCatalogDefinition(questId);
  if (!quest || !action || action.status !== MISSION_ACTION_STATUSES.completed) return [];
  const entries = [];
  for (const reveal of getMissionRevealDefinitionsForAction(quest, action)) {
    const entry = applyMissionReveal(questId, questState, reveal, { actionId: action.id, nodeId: action.nodeId });
    if (entry) entries.push(entry);
  }
  return entries;
}

function applyMissionRevealsForNode(questId, questState, node) {
  const quest = getQuestCatalogDefinition(questId);
  if (!quest || !node || node.status !== MISSION_ROUTE_NODE_STATUSES.completed) return [];
  const entries = [];
  for (const reveal of getMissionRevealDefinitionsForNode(quest, node)) {
    const entry = applyMissionReveal(questId, questState, reveal, { nodeId: node.id });
    if (entry) entries.push(entry);
  }
  return entries;
}

function announceMissionReveals(entries) {
  if (!Array.isArray(entries) || entries.length === 0) return;
  const uniqueEntries = entries.filter((entry, index, list) => entry && list.findIndex(candidate => candidate?.id === entry.id) === index);
  if (typeof showMissionRevealNotice === 'function') {
    uniqueEntries.forEach(entry => showMissionRevealNotice(entry));
  }
}

function announceMissionFollowUps(notices) {
  if (!Array.isArray(notices) || notices.length === 0) return;
  const uniqueNotices = notices.filter((notice, index, list) => {
    const questId = notice?.questId;
    return typeof questId === 'string'
      && questId
      && list.findIndex(candidate => candidate?.questId === questId) === index;
  });
  if (typeof showMissionFollowUpNotice === 'function') {
    uniqueNotices.forEach(notice => showMissionFollowUpNotice(notice));
  }
}

const MISSION_CONSEQUENCE_TYPES = Object.freeze({
  grantReward: 'grant_reward',
  unlockItemUse: 'unlock_item_use',
  makeFollowUpAvailable: 'make_follow_up_available',
  createDerivedTask: 'create_derived_task',
  setWorldState: 'set_world_state'
});

function getMissionConsequenceRewardPackage(consequence) {
  if (!isPlainObject(consequence)) return {};
  if (isPlainObject(consequence.reward)) return cloneSaveState(consequence.reward);
  if (isPlainObject(consequence.rewards)) return cloneSaveState(consequence.rewards);
  const direct = {};
  for (const key of ['xp', 'gold', 'items']) {
    if (consequence[key] !== undefined) direct[key] = cloneSaveState(consequence[key]);
  }
  return direct;
}

function getMissionConsequenceTaskTemplate(consequence) {
  if (!isPlainObject(consequence)) return null;
  return isPlainObject(consequence.taskTemplate)
    ? consequence.taskTemplate
    : (isPlainObject(consequence.template) ? consequence.template : null);
}

function validateMissionConsequenceDefinition(consequence, context = {}) {
  const errors = [];
  const prefix = context.path || 'mission consequence';
  if (!isPlainObject(consequence)) return [`${prefix}: consequence must be an object`];
  if (typeof consequence.id !== 'string' || !consequence.id.trim()) errors.push(`${prefix}: stable id is required`);
  if (!Object.values(MISSION_CONSEQUENCE_TYPES).includes(consequence.type)) {
    errors.push(`${prefix}: unsupported consequence type`);
    return errors;
  }

  if (consequence.type === MISSION_CONSEQUENCE_TYPES.grantReward) {
    const reward = getMissionConsequenceRewardPackage(consequence);
    const hasRewardField = ['xp', 'gold', 'items'].some(key => reward[key] !== undefined);
    if (!hasRewardField) errors.push(`${prefix}: reward package is required`);
    for (const key of ['xp', 'gold']) {
      if (reward[key] !== undefined && (!Number.isFinite(Number(reward[key])) || Number(reward[key]) < 0)) {
        errors.push(`${prefix}: ${key} must be a non-negative number`);
      }
    }
    if (reward.items !== undefined) {
      if (!Array.isArray(reward.items)) errors.push(`${prefix}: reward items must be an array`);
      else reward.items.forEach((itemId, index) => {
        if (typeof itemId !== 'string' || !itemId || typeof ITEMS === 'undefined' || !ITEMS[itemId]) {
          errors.push(`${prefix}: reward item ${index + 1} is not resolvable`);
        }
      });
    }
  }

  if (consequence.type === MISSION_CONSEQUENCE_TYPES.unlockItemUse) {
    const itemId = consequence.materialId || consequence.itemId;
    if (typeof itemId !== 'string' || !itemId) errors.push(`${prefix}: materialId is required`);
    else if (typeof ITEMS === 'undefined' || !ITEMS[itemId]) errors.push(`${prefix}: material reference is not resolvable`);
    else if (ITEMS[itemId].type !== 'material') errors.push(`${prefix}: item use requires a material reference`);
    if (typeof consequence.useId !== 'string' || !consequence.useId) errors.push(`${prefix}: useId is required`);
  }

  if (consequence.type === MISSION_CONSEQUENCE_TYPES.makeFollowUpAvailable) {
    const questId = consequence.questId || consequence.followUpQuestId;
    if (typeof questId !== 'string' || !questId) errors.push(`${prefix}: questId is required`);
    else if (typeof QUESTS === 'undefined' || !isPlainObject(QUESTS[questId])) errors.push(`${prefix}: follow-up quest is not resolvable`);
    else if (QUESTS[questId].archived === true || QUESTS[questId].catalogStatus === 'retired') errors.push(`${prefix}: follow-up quest is retired`);
  }

  if (consequence.type === MISSION_CONSEQUENCE_TYPES.createDerivedTask) {
    const template = getMissionConsequenceTaskTemplate(consequence);
    if (!template || !normalizeDerivedTaskDefinition(template)) errors.push(`${prefix}: derived task template is invalid`);
    const templateId = consequence.templateId || template?.id || consequence.id;
    if (typeof templateId !== 'string' || !templateId) errors.push(`${prefix}: templateId is required`);
    if (consequence.status !== undefined && !['accepted', 'pending'].includes(consequence.status)) errors.push(`${prefix}: derived task status is invalid`);
  }

  if (consequence.type === MISSION_CONSEQUENCE_TYPES.setWorldState) {
    const key = consequence.path || consequence.key;
    if (typeof key !== 'string' || !key || !/^[A-Za-z0-9_.-]+$/.test(key)) errors.push(`${prefix}: world state path is invalid`);
    if (!Object.prototype.hasOwnProperty.call(consequence, 'value')) errors.push(`${prefix}: world state value is required`);
    else {
      try { JSON.stringify(consequence.value); } catch (error) { errors.push(`${prefix}: world state value is not serializable`); }
    }
  }
  return errors;
}

function getMissionConsequenceDefinitionsForAction(quest, action) {
  const catalogAction = getMissionActionCatalogDefinition(quest, action);
  return Array.isArray(catalogAction?.consequences) ? catalogAction.consequences : [];
}

function getMissionConsequenceDefinitionsForNode(quest, node) {
  const catalogNode = getMissionNodeCatalogDefinition(quest, node);
  return Array.isArray(catalogNode?.consequences) ? catalogNode.consequences : [];
}

function getMissionConsequenceDefinitionsForQuest(quest) {
  return Array.isArray(quest?.consequences) ? quest.consequences : [];
}

function getMissionConsequenceClaimId(questId, questState, sourceType, sourceId, consequence) {
  const instanceId = typeof questState?.instanceId === 'string' && questState.instanceId
    ? questState.instanceId
    : `quest:${questId}`;
  return `${instanceId}:consequence:${sourceType}:${sourceId}:${consequence.id}`;
}

function getMissionConsequenceStatus(results) {
  if (results.some(result => result.status === 'rejected')) return 'rejected';
  if (results.some(result => result.status === 'pending')) return 'pending';
  return 'granted';
}

function getMissionItemId(itemId) {
  if (typeof LifeXPInventory !== 'undefined' && typeof LifeXPInventory.resolve === 'function') {
    return LifeXPInventory.resolve(itemId);
  }
  return typeof itemId === 'string' && typeof ITEMS !== 'undefined' && ITEMS[itemId] ? itemId : null;
}

function isMissionMaterialDiscovered(itemId) {
  const resolvedId = getMissionItemId(itemId);
  if (!resolvedId) return false;
  const ownedInContainer = container => Array.isArray(container)
    && container.some(entry => getMissionItemId(entry) === resolvedId);
  if (ownedInContainer(gameState.inventory) || ownedInContainer(gameState.stash)) return true;
  if (Object.values(gameState.equipment || {}).some(entry => getMissionItemId(entry) === resolvedId)) return true;
  const grantedReward = Object.values(gameState.rewardLedger || {}).some(entry => entry
    && entry.status === 'granted'
    && getMissionItemId(entry.itemId) === resolvedId);
  if (grantedReward) return true;
  const pendingReward = Array.isArray(gameState.pendingLoot?.entries)
    && gameState.pendingLoot.entries.some(entry => entry
      && ['pending', 'rejected'].includes(entry.status)
      && getMissionItemId(entry.itemId) === resolvedId);
  return pendingReward;
}

function getExistingMaterialUseState(itemId, useId) {
  const resolvedId = getMissionItemId(itemId) || itemId;
  return Boolean(gameState.materialInteractions?.discoveredUses?.[resolvedId]?.[useId]);
}

function getMissionConsequenceDerivedTaskId(questId, actionId, consequence) {
  const template = getMissionConsequenceTaskTemplate(consequence) || {};
  const templateId = consequence.templateId || template.id || consequence.id;
  return typeof createDerivedTaskId === 'function'
    ? createDerivedTaskId(questId, actionId, templateId)
    : ['derived', questId, actionId, templateId].join('_');
}

function validateMissionConsequenceRuntimeCollision(questId, questState, consequence, source) {
  const errors = [];
  if (consequence.type !== MISSION_CONSEQUENCE_TYPES.createDerivedTask) return errors;
  const derivedTaskId = getMissionConsequenceDerivedTaskId(questId, source.sourceId, consequence);
  const existing = typeof getDerivedTaskById === 'function' ? getDerivedTaskById(derivedTaskId) : null;
  if (existing && (existing.sourceQuestId !== questId || existing.sourceActionId !== source.sourceId || existing.templateId !== (consequence.templateId || getMissionConsequenceTaskTemplate(consequence)?.id || consequence.id))) {
    errors.push(`${source.path}: derived task id collides with another source`);
  }
  const existingTask = typeof getTaskById === 'function' ? getTaskById(derivedTaskId) : null;
  if (existingTask && existingTask.derivedTaskId !== derivedTaskId) errors.push(`${source.path}: task id collides with another task`);
  return errors;
}

function applyMissionConsequence(consequence, questId, questState, source, options = {}) {
  const claimId = getMissionConsequenceClaimId(questId, questState, source.sourceType, source.sourceId, consequence);
  if (!isPlainObject(questState.consequenceClaims)) questState.consequenceClaims = {};
  const previous = questState.consequenceClaims[claimId];
  if (previous && previous.status === 'granted') return { status: 'granted', claimId, duplicate: true, result: previous.result || null };
  if (previous && ['pending', 'rejected'].includes(previous.status) && options.retry !== true) {
    return { status: previous.status, claimId, duplicate: true, result: previous.result || null };
  }

  let result;
  if (consequence.type === MISSION_CONSEQUENCE_TYPES.grantReward) {
    const rewardPackage = getMissionConsequenceRewardPackage(consequence);
    result = typeof grantQuestRewards === 'function'
      ? grantQuestRewards(rewardPackage, {
          questId,
          questState,
          rewardKey: `consequence_${source.sourceId}_${consequence.id}`,
          claimId: `${claimId}:reward`,
          source: 'mission_consequence',
          retryRejected: options.retry === true
        })
      : { status: 'rejected', reason: 'reward_boundary_unavailable', recoverable: false };
  } else if (consequence.type === MISSION_CONSEQUENCE_TYPES.unlockItemUse) {
    const itemId = consequence.materialId || consequence.itemId;
    const resolvedItemId = getMissionItemId(itemId) || itemId;
    if (getExistingMaterialUseState(resolvedItemId, consequence.useId)) {
      result = { status: 'granted', duplicate: true, itemId: resolvedItemId, useId: consequence.useId };
    } else if (!isMissionMaterialDiscovered(resolvedItemId)) {
      result = { status: 'rejected', reason: 'material_not_discovered', recoverable: true, itemId: resolvedItemId, useId: consequence.useId };
    } else if (typeof LifeXPMaterialInteractions === 'undefined' || typeof LifeXPMaterialInteractions.discoverUse !== 'function') {
      result = { status: 'rejected', reason: 'material_use_boundary_unavailable', recoverable: true, itemId: resolvedItemId, useId: consequence.useId };
    } else if (LifeXPMaterialInteractions.discoverUse(resolvedItemId, consequence.useId)) {
      result = { status: 'granted', duplicate: false, itemId: resolvedItemId, useId: consequence.useId };
    } else if (getExistingMaterialUseState(resolvedItemId, consequence.useId)) {
      result = { status: 'granted', duplicate: true, itemId: resolvedItemId, useId: consequence.useId };
    } else {
      result = { status: 'rejected', reason: 'material_use_rejected', recoverable: true, itemId: resolvedItemId, useId: consequence.useId };
    }
  } else if (consequence.type === MISSION_CONSEQUENCE_TYPES.makeFollowUpAvailable) {
    const followUpId = consequence.questId || consequence.followUpQuestId;
    if (!Array.isArray(gameState.quests.availableFollowUps)) gameState.quests.availableFollowUps = [];
    const duplicate = gameState.quests.availableFollowUps.includes(followUpId);
    if (!duplicate) {
      gameState.quests.availableFollowUps.push(followUpId);
      pendingMissionFollowUpNotices.push({ questId: followUpId });
    }
    result = { status: 'granted', duplicate, questId: followUpId };
  } else if (consequence.type === MISSION_CONSEQUENCE_TYPES.createDerivedTask) {
    const template = cloneSaveState(getMissionConsequenceTaskTemplate(consequence));
    const derivedTaskId = getMissionConsequenceDerivedTaskId(questId, source.sourceId, consequence);
    const existingDerivedTask = typeof getDerivedTaskById === 'function' ? getDerivedTaskById(derivedTaskId) : null;
    const derivedTask = typeof createDerivedTask === 'function'
      ? createDerivedTask(template, {
          sourceQuestId: questId,
          sourceActionId: source.sourceId,
          templateId: consequence.templateId || template.id || consequence.id,
          id: derivedTaskId,
          status: consequence.status === 'pending' ? 'pending' : 'accepted'
        })
      : null;
    result = derivedTask
      ? { status: 'granted', duplicate: Boolean(existingDerivedTask), derivedTaskId: derivedTask.id }
      : { status: 'rejected', reason: 'derived_task_boundary_unavailable', recoverable: true };
  } else if (consequence.type === MISSION_CONSEQUENCE_TYPES.setWorldState) {
    const key = consequence.path || consequence.key;
    if (!isPlainObject(gameState.worldState)) gameState.worldState = {};
    const previousValue = gameState.worldState[key];
    gameState.worldState[key] = cloneSaveState(consequence.value);
    result = { status: 'granted', duplicate: JSON.stringify(previousValue) === JSON.stringify(consequence.value), key };
  } else {
    result = { status: 'rejected', reason: 'unsupported_consequence_type', recoverable: false };
  }

  const status = result.status === 'pending' ? 'pending' : result.status === 'granted' ? 'granted' : 'rejected';
  questState.consequenceClaims[claimId] = {
    claimId,
    type: consequence.type,
    status,
    sourceType: source.sourceType,
    sourceId: source.sourceId,
    definition: cloneSaveState(consequence),
    result: cloneSaveState(result),
    updatedAt: new Date().toISOString()
  };
  return { status, claimId, duplicate: result.duplicate === true, result };
}

function applyMissionConsequenceDefinitions(questId, questState, definitions, source, options = {}) {
  const list = Array.isArray(definitions) ? definitions : [];
  if (list.length === 0) return { status: 'granted', applied: false, results: [], claims: [] };
  const validationErrors = [];
  list.forEach((consequence, index) => {
    const path = `${source.path || 'mission'} consequence ${index + 1}`;
    validationErrors.push(...validateMissionConsequenceDefinition(consequence, { path }));
    if (isPlainObject(consequence)) validationErrors.push(...validateMissionConsequenceRuntimeCollision(questId, questState, consequence, { ...source, path }));
  });
  if (validationErrors.length > 0) return { status: 'rejected', applied: false, results: [], claims: [], validationErrors };
  const results = list.map(consequence => applyMissionConsequence(consequence, questId, questState, source, options));
  return {
    status: getMissionConsequenceStatus(results),
    applied: results.some(result => result.duplicate !== true),
    results,
    claims: results.map(result => result.claimId)
  };
}

function runMissionConsequenceTransaction(callback) {
  const deferred = isLifeXPTransactionDeferred();
  const previousState = cloneSaveState(gameState);
  const previousRawSave = typeof localStorage === 'undefined' ? null : localStorage.getItem('lifexp_save');
  const previousRevealNotices = pendingMissionRevealNotices.slice();
  const previousFollowUpNotices = pendingMissionFollowUpNotices.slice();
  if (!deferred) beginLifeXPTransaction();
  try {
    const result = callback();
    if (result?.validationErrors?.length) return result;
    if (!deferred && !saveGame({ force: true })) throw new Error('save_failed');
    return result;
  } catch (error) {
    gameState = previousState;
    pendingMissionRevealNotices = previousRevealNotices;
    pendingMissionFollowUpNotices = previousFollowUpNotices;
    if (typeof localStorage !== 'undefined') {
      try {
        if (previousRawSave === null) localStorage.removeItem('lifexp_save');
        else localStorage.setItem('lifexp_save', previousRawSave);
      } catch (restoreError) { console.warn('Could not restore consequence save bytes:', restoreError); }
    }
    return { status: 'rejected', applied: false, results: [], claims: [], reason: error.message || 'consequence_transaction_failed', recoverable: false };
  } finally {
    if (!deferred) endLifeXPTransaction();
  }
}

function resolveMissionConsequences(questId, questState, definitions, source = {}, options = {}) {
  if (!questState || !gameState?.quests) return { status: 'rejected', applied: false, results: [], claims: [], reason: 'quest_state_unavailable' };
  const normalizedSource = {
    sourceType: typeof source.sourceType === 'string' && source.sourceType ? source.sourceType : 'action',
    sourceId: typeof source.sourceId === 'string' && source.sourceId ? source.sourceId : 'root',
    path: source.path || `quest ${questId}`
  };
  return runMissionConsequenceTransaction(() => applyMissionConsequenceDefinitions(questId, questState, definitions, normalizedSource, options));
}

function applyMissionConsequencesForAction(questId, questState, action) {
  const quest = getQuestCatalogDefinition(questId);
  return resolveMissionConsequences(questId, questState, getMissionConsequenceDefinitionsForAction(quest, action), {
    sourceType: 'action', sourceId: action.id, path: `quest ${questId} action ${action.id}`
  });
}

function applyMissionConsequencesForNode(questId, questState, node) {
  const quest = getQuestCatalogDefinition(questId);
  return resolveMissionConsequences(questId, questState, getMissionConsequenceDefinitionsForNode(quest, node), {
    sourceType: 'node', sourceId: node.id, path: `quest ${questId} route node ${node.id}`
  });
}

function applyMissionConsequencesForQuest(questId, questState) {
  const quest = getQuestCatalogDefinition(questId);
  return resolveMissionConsequences(questId, questState, getMissionConsequenceDefinitionsForQuest(quest), {
    sourceType: 'quest', sourceId: questId, path: `quest ${questId}`
  });
}

function retryMissionConsequences(questId) {
  const questState = gameState.quests?.[questId];
  const quest = getQuestCatalogDefinition(questId);
  if (!questState || !quest) return { status: 'rejected', reason: 'quest_state_unavailable', results: [] };
  return runMissionConsequenceTransaction(() => {
    const results = [];
    const activeActions = Array.isArray(questState.actions) ? questState.actions : [];
    activeActions.forEach(action => results.push(applyMissionConsequenceDefinitions(questId, questState, getMissionConsequenceDefinitionsForAction(quest, action), {
      sourceType: 'action', sourceId: action.id, path: `quest ${questId} action ${action.id}`
    }, { retry: true })));
    const nodes = Array.isArray(questState.routeNodes) ? questState.routeNodes : [];
    nodes.forEach(node => results.push(applyMissionConsequenceDefinitions(questId, questState, getMissionConsequenceDefinitionsForNode(quest, node), {
      sourceType: 'node', sourceId: node.id, path: `quest ${questId} route node ${node.id}`
    }, { retry: true })));
    if (questState.status === QUEST_INSTANCE_STATUS.completed) results.push(applyMissionConsequenceDefinitions(questId, questState, getMissionConsequenceDefinitionsForQuest(quest), {
      sourceType: 'quest', sourceId: questId, path: `quest ${questId}`
    }, { retry: true }));
    const flattened = results.flatMap(result => result.results || []);
    return { status: getMissionConsequenceStatus(flattened), applied: flattened.length > 0, results, claims: flattened.map(result => result.claimId) };
  });
}



function getMissionSourceCatalog() {
  return typeof MISSION_SOURCES !== 'undefined' && isPlainObject(MISSION_SOURCES) ? MISSION_SOURCES : {};
}

function getMissionSourceDefinition(sourceId) {
  if (typeof sourceId !== 'string' || !sourceId) return null;
  const source = getMissionSourceCatalog()[sourceId];
  return isPlainObject(source) ? source : null;
}

function getMissionSourceMissionId(source) {
  if (!isPlainObject(source)) return null;
  const missionId = source.questId || source.missionId || source.followUpQuestId;
  return typeof missionId === 'string' && missionId ? missionId : null;
}

function getMissionSourceState(sourceId, create = false) {
  if (!gameState.quests) return null;
  gameState.quests.missionSources = normalizeMissionSourcePersistence(gameState.quests.missionSources);
  if (!gameState.quests.missionSources.states[sourceId] && create) {
    gameState.quests.missionSources.states[sourceId] = normalizeMissionSourceState({}, sourceId);
  }
  return gameState.quests.missionSources.states[sourceId] || null;
}

function getMissionSourceRequirementValue(source, key) {
  if (!isPlainObject(source)) return undefined;
  if (source[key] !== undefined) return source[key];
  return isPlainObject(source.requirements) ? source.requirements[key] : undefined;
}

function getWorldStatePathValue(path) {
  if (typeof path !== 'string' || !path) return undefined;
  return path.split('.').reduce((value, key) => value === undefined || value === null ? undefined : value[key], gameState.worldState || {});
}

function missionSourceValueMatches(actual, expected) {
  return JSON.stringify(actual) === JSON.stringify(expected);
}

function isMissionSourceConditionMet(source) {
  if (!isPlainObject(source)) return false;
  if (source.type === MISSION_SOURCE_TYPES.guild && !gameState.guildId) return false;
  const minLevel = getMissionSourceRequirementValue(source, 'minLevel');
  if (minLevel !== undefined && (!Number.isFinite(Number(minLevel)) || gameState.level < Number(minLevel))) return false;
  const requiresGuild = getMissionSourceRequirementValue(source, 'requiresGuild');
  if (requiresGuild === true && !gameState.guildId) return false;
  const completedQuest = getMissionSourceRequirementValue(source, 'completedQuest');
  const completedQuests = getMissionSourceRequirementValue(source, 'completedQuests');
  const requiredCompleted = completedQuests !== undefined ? completedQuests : completedQuest;
  if (requiredCompleted !== undefined) {
    const ids = Array.isArray(requiredCompleted) ? requiredCompleted : [requiredCompleted];
    if (ids.some(id => typeof id !== 'string' || !gameState.quests.completed.includes(id))) return false;
  }
  const worldRequirement = getMissionSourceRequirementValue(source, 'worldState');
  if (isPlainObject(worldRequirement)) {
    for (const [path, expected] of Object.entries(worldRequirement)) {
      if (!missionSourceValueMatches(getWorldStatePathValue(path), expected)) return false;
    }
  }
  const discoveryRequirement = getMissionSourceRequirementValue(source, 'discovery');
  if (discoveryRequirement !== undefined) {
    const discoveries = Array.isArray(gameState.quests.journalEntries) ? gameState.quests.journalEntries : [];
    const ids = Array.isArray(discoveryRequirement) ? discoveryRequirement : [discoveryRequirement];
    if (ids.some(id => !discoveries.some(entry => entry && (entry.id === id || entry.revealId === id)))) return false;
  }
  return true;
}

function validateMissionSourceReward(reward, path) {
  const errors = [];
  if (reward === undefined) return errors;
  if (!isPlainObject(reward)) return [`${path}: reward must be an object`];
  for (const key of ['xp', 'gold']) {
    if (reward[key] !== undefined && (!Number.isFinite(Number(reward[key])) || Number(reward[key]) < 0)) {
      errors.push(`${path}: ${key} must be a non-negative number`);
    }
  }
  if (reward.items !== undefined) {
    if (!Array.isArray(reward.items)) errors.push(`${path}: items must be an array`);
    else reward.items.forEach((itemId, index) => {
      if (typeof itemId !== 'string' || !itemId || typeof ITEMS === 'undefined' || !ITEMS[itemId]) {
        errors.push(`${path}: item ${index + 1} is not resolvable`);
      }
    });
  }
  return errors;
}

function validateMissionSourceDefinition(source, context = {}) {
  const path = context.path || 'mission source';
  const errors = [];
  if (!isPlainObject(source)) return [`${path}: source must be an object`];
  if (typeof source.id !== 'string' || !source.id.trim()) errors.push(`${path}: stable id is required`);
  if (!Object.values(MISSION_SOURCE_TYPES).includes(source.type)) errors.push(`${path}: unsupported source type`);
  const missionId = getMissionSourceMissionId(source);
  if (typeof missionId !== 'string' || !missionId) errors.push(`${path}: mission id is required`);
  else if (typeof QUESTS === 'undefined' || !isPlainObject(QUESTS[missionId])) errors.push(`${path}: mission is not resolvable`);
  else if (QUESTS[missionId].archived === true || QUESTS[missionId].catalogStatus === 'retired') errors.push(`${path}: mission is retired`);
  if (source.delivery !== undefined && !['available', 'automatic'].includes(source.delivery)) errors.push(`${path}: delivery must be available or automatic`);
  if (source.expiresAfterDays !== undefined && (!Number.isInteger(source.expiresAfterDays) || source.expiresAfterDays <= 0)) errors.push(`${path}: expiresAfterDays must be a positive integer`);
  if (source.cost !== undefined) {
    if (!isPlainObject(source.cost)) errors.push(`${path}: cost must be an object`);
    else {
      if (source.cost.gold !== undefined && (!Number.isFinite(Number(source.cost.gold)) || Number(source.cost.gold) < 0)) errors.push(`${path}: cost.gold must be non-negative`);
      if (source.cost.items !== undefined && (!Array.isArray(source.cost.items) || source.cost.items.some(itemId => typeof itemId !== 'string' || !itemId || typeof ITEMS === 'undefined' || !ITEMS[itemId]))) errors.push(`${path}: cost.items contains an invalid item`);
    }
  }
  errors.push(...validateMissionSourceReward(source.reward || source.rewards, `${path} reward`));
  if (source.type === MISSION_SOURCE_TYPES.recovery) {
    if (typeof source.questId !== 'string' || !source.questId) errors.push(`${path}: recovery questId is required`);
    if (typeof source.message !== 'string' || !source.message.trim()) errors.push(`${path}: recovery message is required`);
    if (source.targetActionId !== undefined && (typeof source.targetActionId !== 'string' || !source.targetActionId)) errors.push(`${path}: targetActionId must be a string`);
  }
  if (source.type === MISSION_SOURCE_TYPES.guild) {
    if (source.requiresGuild === false) errors.push(`${path}: guild sources require guild membership`);
    if (source.slotGroup !== undefined && source.slotGroup !== 'guild_order') errors.push(`${path}: guild sources must use the guild_order slot group`);
  }
  return errors;
}

function getMissionSourceAvailability(source) {
  const errors = validateMissionSourceDefinition(source, { path: `mission source ${source?.id || 'unknown'}` });
  if (errors.length > 0) return { available: false, status: MISSION_SOURCE_STATUSES.needsReview, errors };
  const sourceState = getMissionSourceState(source.id, false);
  const missionId = getMissionSourceMissionId(source);
  const repeatable = source.repeatable === true;
  if (sourceState?.status === MISSION_SOURCE_STATUSES.accepted && !repeatable) return { available: false, status: sourceState.status, reason: 'already_accepted' };
  if (sourceState?.status === MISSION_SOURCE_STATUSES.consumed && !repeatable) return { available: false, status: sourceState.status, reason: 'already_consumed' };
  if (sourceState?.expiresAt && todayStr() > sourceState.expiresAt) return { available: false, status: MISSION_SOURCE_STATUSES.expired, reason: 'source_expired' };
  if (!isMissionSourceConditionMet(source)) return { available: false, status: 'locked', reason: 'requirements_not_met' };
  if (gameState.quests.active.includes(missionId)) return { available: false, status: 'active', reason: 'mission_already_active' };
  if (gameState.quests.completed.includes(missionId) && !repeatable) return { available: false, status: 'completed', reason: 'mission_already_completed' };
  return { available: true, status: MISSION_SOURCE_STATUSES.available, reason: null };
}

function getAvailableMissionSources(type = null) {
  return Object.values(getMissionSourceCatalog()).filter(source => {
    if (type && source?.type !== type) return false;
    return getMissionSourceAvailability(source).available;
  });
}

function getMissionSourceCost(source) {
  const cost = isPlainObject(source?.cost) ? source.cost : {};
  return {
    gold: Number.isFinite(Number(cost.gold)) ? Math.max(0, Number(cost.gold)) : 0,
    items: Array.isArray(cost.items) ? [...cost.items] : []
  };
}

function getContainerEntryItemId(entry) {
  if (typeof entry === 'string') return getMissionItemId(entry) || entry;
  if (!isPlainObject(entry)) return null;
  return getMissionItemId(entry.itemId || entry.id) || entry.itemId || entry.id || null;
}

function applyMissionSourceCost(source) {
  const cost = getMissionSourceCost(source);
  if (!Number.isFinite(Number(gameState.gold)) || Number(gameState.gold) < cost.gold) return { status: 'rejected', reason: 'insufficient_gold', recoverable: true };
  const inventory = Array.isArray(gameState.inventory) ? gameState.inventory : [];
  const usedIndexes = new Set();
  for (const itemId of cost.items) {
    const resolved = getMissionItemId(itemId) || itemId;
    const index = inventory.findIndex((entry, entryIndex) => !usedIndexes.has(entryIndex) && getContainerEntryItemId(entry) === resolved);
    if (index < 0) return { status: 'rejected', reason: 'missing_cost_item', itemId, recoverable: true };
    usedIndexes.add(index);
  }
  gameState.gold -= cost.gold;
  [...usedIndexes].sort((a, b) => b - a).forEach(index => inventory.splice(index, 1));
  gameState.inventory = inventory;
  return { status: 'granted', cost, consumedItems: [...usedIndexes].map(index => cost.items[index] || null) };
}

function recordMissionSourceAcceptance(source, questId, costResult, rewardResult) {
  const state = getMissionSourceState(source.id, true);
  const claimId = `source:${source.id}`;
  const rewardStatus = rewardResult?.status || 'granted';
  state.status = rewardStatus === 'pending' ? MISSION_SOURCE_STATUSES.accepted : MISSION_SOURCE_STATUSES.consumed;
  state.sourceType = source.type;
  state.missionId = questId;
  state.claimId = claimId;
  state.acceptedAt = new Date().toISOString();
  state.costApplication = { status: 'granted', cost: getMissionSourceCost(source) };
  state.rewardApplication = rewardResult || null;
  if (source.expiresAfterDays) state.expiresAt = addDaysToDate(todayStr(), source.expiresAfterDays);
  gameState.quests.missionSources.claims[claimId] = normalizeMissionSourceClaim({
    claimId,
    sourceId: source.id,
    sourceType: source.type,
    missionId: questId,
    status: rewardStatus,
    cost: getMissionSourceCost(source),
    reward: rewardResult || null,
    updatedAt: state.acceptedAt
  }, source.id);
  return state;
}

function runMissionSourceTransaction(callback) {
  const deferred = isLifeXPTransactionDeferred();
  const previousState = cloneSaveState(gameState);
  const previousRawSave = typeof localStorage === 'undefined' ? null : localStorage.getItem('lifexp_save');
  if (!deferred) beginLifeXPTransaction();
  try {
    const result = callback();
    if (result?.commit === false) {
      gameState = previousState;
      return result;
    }
    if (!deferred && !saveGame({ force: true })) throw new Error('save_failed');
    return result;
  } catch (error) {
    gameState = previousState;
    if (typeof localStorage !== 'undefined') {
      try {
        if (previousRawSave === null) localStorage.removeItem('lifexp_save');
        else localStorage.setItem('lifexp_save', previousRawSave);
      } catch (restoreError) { console.warn('Could not restore mission source save bytes:', restoreError); }
    }
    return { success: false, commit: false, reason: error.message || 'mission_source_transaction_failed', recoverable: false };
  } finally {
    if (!deferred) endLifeXPTransaction();
  }
}

function getMissionRecoverySourceDefinitions(questId) {
  return Object.values(getMissionSourceCatalog()).filter(source => source?.type === MISSION_SOURCE_TYPES.recovery && source.questId === questId);
}

function getMissionRecoveryOptions(questId, questState = null) {
  const options = [];
  const persisted = Array.isArray(questState?.recovery?.options) ? questState.recovery.options : [];
  persisted.forEach(option => {
    if (isPlainObject(option) && typeof option.id === 'string' && option.id) options.push(option);
  });
  getMissionRecoverySourceDefinitions(questId).forEach(source => {
    if (getMissionSourceAvailability(source).available) options.push(source);
  });
  const seen = new Set();
  return options.filter(option => {
    if (seen.has(option.id)) return false;
    seen.add(option.id);
    return true;
  });
}

function startMissionRecovery(questId, sourceId) {
  const questState = gameState.quests?.[questId];
  if (!questState || !gameState.quests.active.includes(questId)) return { success: false, reason: 'mission_not_active' };
  const options = getMissionRecoveryOptions(questId, questState);
  const source = options.find(option => option.id === sourceId);
  if (!source) return { success: false, reason: 'recovery_source_unavailable' };
  if (source.type === MISSION_SOURCE_TYPES.recovery) {
    const availability = getMissionSourceAvailability(source);
    if (!availability.available) return { success: false, reason: availability.reason || 'recovery_source_locked' };
  }
  return runMissionSourceTransaction(() => {
    const currentState = gameState.quests[questId];
    const message = typeof source.message === 'string' && source.message.trim() ? source.message : (source.description || 'A new investigative direction is available.');
    currentState.recovery = {
      ...(isPlainObject(currentState.recovery) ? currentState.recovery : {}),
      status: 'available',
      sourceId: source.id,
      message,
      startedAt: new Date().toISOString(),
      options: options.map(option => ({ id: option.id, title: option.title, description: option.description, message: option.message, type: option.type, targetActionId: option.targetActionId }))
    };
    if (source.targetActionId) {
      const target = currentState.actions.find(action => action.id === source.targetActionId);
      if (!target) return { success: false, commit: false, reason: 'recovery_target_unavailable' };
      target.status = MISSION_ACTION_STATUSES.inProgress;
      currentState.activeActionId = target.id;
      const node = currentState.routeNodes.find(candidate => candidate.id === target.nodeId);
      if (node && node.status === MISSION_ROUTE_NODE_STATUSES.blocked) node.status = MISSION_ROUTE_NODE_STATUSES.active;
    }
    return { success: true, sourceId: source.id, questId };
  });
}

function normalizeMissionEvent(eventType, data = {}) {
  const normalizedType = eventType === 'task_complete' ? 'task_completed' : eventType;
  const event = { ...data, type: normalizedType };
  if (normalizedType === 'task_completed') {
    event.source = event.source === 'derived_task' ? 'derived_task' : 'standard_task';
    event.derivedTaskId = typeof event.derivedTaskId === 'string' && event.derivedTaskId ? event.derivedTaskId : null;
    event.themes = Array.isArray(event.themes) ? [...new Set(event.themes.filter(theme => typeof theme === 'string' && theme))] : [];
  }
  return event;
}

function missionActionMatchesEvent(action, eventType, data = {}) {
  if (!action || action.status === MISSION_ACTION_STATUSES.completed || action.status === MISSION_ACTION_STATUSES.blocked) return false;
  const criterion = action.criterion || {};
  const normalizedType = eventType === 'task_complete' ? 'task_completed' : eventType;
  if (criterion.eventType !== normalizedType) return false;
  if (criterion.category && criterion.category !== data.category) return false;
  if (criterion.taskId && criterion.taskId !== data.taskId) return false;
  if (criterion.derivedTaskId && criterion.derivedTaskId !== data.derivedTaskId) return false;
  if (criterion.theme && !(Array.isArray(data.themes) && data.themes.includes(criterion.theme))) return false;
  if (criterion.enemyId && criterion.enemyId !== data.enemyId) return false;
  if (normalizedType === 'level_up' && Number(data.level) < Number(criterion.level)) return false;
  return true;
}

function applyMissionEventToAction(action, eventType, data = {}, completionId) {
  if (!missionActionMatchesEvent(action, eventType, data) || !completionId) return false;
  if (!Array.isArray(action.consumedEventIds)) action.consumedEventIds = [];
  if (action.consumedEventIds.includes(completionId)) return false;
  action.consumedEventIds.push(completionId);
  action.consumedCompletionIds = [...action.consumedEventIds];
  if (action.criterion.eventType === 'level_up') action.progress = Math.max(action.progress, Number(data.level) || 0);
  else if (action.criterion.eventType === 'defeat_boss' || action.criterion.eventType === 'item_equipped') action.progress = action.target;
  else action.progress = Math.min(action.target, action.progress + 1);
  if (action.progress >= action.target) action.status = MISSION_ACTION_STATUSES.completed;
  syncMissionActionPresentationState(action);
  return true;
}

function advanceMissionActionInstance(questId, questState, eventType, data = {}) {
  if (!questState || questState.status === QUEST_INSTANCE_STATUS.completed || !Array.isArray(questState.actions)) return false;
  const completionId = getMissionEventCompletionId(data);
  if (!Array.isArray(questState.consumedEventIds)) questState.consumedEventIds = [];
  if (!completionId || questState.consumedEventIds.includes(completionId)) return false;
  const nodeId = questState.currentNodeId;
  const candidates = questState.actions.filter(action => action.nodeId === nodeId);
  const previouslyCompleted = new Set(candidates.filter(action => action.status === MISSION_ACTION_STATUSES.completed).map(action => action.id));
  let updated = false;
  for (const action of candidates) updated = applyMissionEventToAction(action, eventType, data, completionId) || updated;
  if (!updated) return false;
  const newlyCompletedActionIds = candidates
    .filter(action => action.status === MISSION_ACTION_STATUSES.completed && !previouslyCompleted.has(action.id))
    .map(action => action.id);
  const revealEntries = [];
  newlyCompletedActionIds.forEach(actionId => {
    const action = questState.actions.find(candidate => candidate.id === actionId);
    revealEntries.push(...applyMissionRevealsForAction(questId, questState, action));
    const consequenceResult = applyMissionConsequencesForAction(questId, questState, action);
    if (consequenceResult.validationErrors?.length) {
      const error = new Error('Invalid mission consequence definition.');
      error.missionConsequenceResult = consequenceResult;
      throw error;
    }
  });
  questState.consumedEventIds.push(completionId);
  questState.completedActionIds = questState.actions.filter(action => action.status === MISSION_ACTION_STATUSES.completed).map(action => action.id);
  const currentNode = questState.routeNodes.find(node => node.id === nodeId);
  const nodeComplete = currentNode && currentNode.actionIds.length > 0 && currentNode.actionIds.every(actionId => questState.completedActionIds.includes(actionId));
  if (nodeComplete) {
    currentNode.status = MISSION_ROUTE_NODE_STATUSES.completed;
    revealEntries.push(...applyMissionRevealsForNode(questId, questState, currentNode));
    const nodeConsequenceResult = applyMissionConsequencesForNode(questId, questState, currentNode);
    if (nodeConsequenceResult.validationErrors?.length) {
      const error = new Error('Invalid mission consequence definition.');
      error.missionConsequenceResult = nodeConsequenceResult;
      throw error;
    }
    const currentIndex = questState.routeNodes.findIndex(node => node.id === currentNode.id);
    const nextNode = questState.routeNodes[currentIndex + 1];
    if (nextNode) {
      nextNode.status = MISSION_ROUTE_NODE_STATUSES.active;
      questState.currentNodeId = nextNode.id;
      questState.actions = questState.actions.map(action => {
        if (action.status === MISSION_ACTION_STATUSES.completed) return action;
        return action.nodeId === nextNode.id
          ? syncMissionActionPresentationState({ ...action, status: MISSION_ACTION_STATUSES.inProgress })
          : syncMissionActionPresentationState({ ...action, status: MISSION_ACTION_STATUSES.blocked });
      });
    } else {
      const questConsequenceResult = applyMissionConsequencesForQuest(questId, questState);
      if (questConsequenceResult.validationErrors?.length) {
        const error = new Error('Invalid mission consequence definition.');
        error.missionConsequenceResult = questConsequenceResult;
        throw error;
      }
      completeMissionInstanceState(questState);
      if (typeof completeQuest === 'function') completeQuest(questId);
    }
  }
  questState.activeActionId = questState.actions.find(action => action.status === MISSION_ACTION_STATUSES.inProgress || action.status === MISSION_ACTION_STATUSES.awaitingTask)?.id || null;
  const uniqueRevealEntries = revealEntries.filter((entry, index, list) => entry && list.findIndex(candidate => candidate?.id === entry.id) === index);
  pendingMissionRevealNotices.push(...uniqueRevealEntries);
  return true;
}

function updateMissionProgress(eventType, data = {}) {
  const event = normalizeMissionEvent(eventType, data);
  const deferred = isLifeXPTransactionDeferred();
  const previousState = cloneSaveState(gameState);
  const previousRawSave = typeof localStorage === 'undefined' ? null : localStorage.getItem('lifexp_save');
  const previousNotices = pendingMissionRevealNotices.slice();
  const previousFollowUpNotices = pendingMissionFollowUpNotices.slice();
  const completionId = getMissionEventCompletionId(event);
  let updated = false;
  let saveAttempted = false;
  if (!deferred) beginLifeXPTransaction();
  try {
    if (event.type === 'task_completed' && event.derivedTaskId && completionId) {
      updated = markDerivedTaskCompleted(event.derivedTaskId, completionId, event) || updated;
    }
    if (gameState.quests && Array.isArray(gameState.quests.active)) {
      [...gameState.quests.active].forEach(questId => {
        const questState = gameState.quests[questId];
        if (!questState) return;
        updated = advanceMissionActionInstance(questId, questState, event.type, event) || updated;
      });
    }
    if (updated && !deferred) {
      saveAttempted = true;
      if (!saveGame({ force: true })) throw new Error('save_failed');
    }
    return updated;
  } catch (error) {
    gameState = previousState;
    pendingMissionRevealNotices = previousNotices;
    pendingMissionFollowUpNotices = previousFollowUpNotices;
    if (saveAttempted && typeof localStorage !== 'undefined') {
      try {
        if (previousRawSave === null) localStorage.removeItem('lifexp_save');
        else localStorage.setItem('lifexp_save', previousRawSave);
      } catch (restoreError) { console.error('Could not restore the mission state:', restoreError); }
    }
    if (error?.missionConsequenceResult?.validationErrors?.length) {
      console.warn('Mission consequences rejected before save:', error.missionConsequenceResult.validationErrors);
    } else {
      console.warn('Mission progress transaction rolled back:', error);
    }
    return false;
  } finally {
    if (!deferred) endLifeXPTransaction();
  }
}

// ===========================================================================
// PLAYER SKILL CONTRACT
// ===========================================================================

const SKILL_SOURCE_TYPES = Object.freeze({
  initial: 'initial',
  class: 'class',
  equipment: 'equipment',
  unlock: 'unlock',
  progression: 'progression'
});

function getDefaultSkillState() {
  return cloneSaveState(DEFAULT_GAME_STATE.skills);
}

function normalizeSkillIds(value) {
  if (!Array.isArray(value)) return [];
  return [...new Set(value.filter(id => typeof id === 'string' && id.length > 0))];
}

function normalizeSkillSource(source) {
  if (!isPlainObject(source)) return null;
  if (!Object.values(SKILL_SOURCE_TYPES).includes(source.type)) return null;
  if (typeof source.id !== 'string' || source.id.length === 0) return null;
  return cloneSaveState(source);
}

function normalizeSkillSources(value) {
  if (!isPlainObject(value)) return {};
  const normalized = {};
  for (const [skillId, rawSources] of Object.entries(value)) {
    const sources = Array.isArray(rawSources) ? rawSources : [rawSources];
    const validSources = sources.map(normalizeSkillSource).filter(Boolean);
    if (validSources.length > 0) normalized[skillId] = validSources;
  }
  return normalized;
}

function normalizeSkillState(value) {
  const source = isPlainObject(value) ? value : {};
  const defaults = getDefaultSkillState();
  return {
    version: Number.isInteger(source.version) && source.version >= 1 ? source.version : defaults.version,
    known: source.known === undefined ? [...defaults.known] : normalizeSkillIds(source.known),
    equipped: source.equipped === undefined ? [...defaults.equipped] : normalizeSkillIds(source.equipped),
    sources: source.sources === undefined ? cloneSaveState(defaults.sources) : normalizeSkillSources(source.sources)
  };
}

function getPlayerSkillCatalog() {
  return typeof PLAYER_SKILLS !== 'undefined' && isPlainObject(PLAYER_SKILLS) ? PLAYER_SKILLS : {};
}

function getPlayerSkillDefinition(skillId) {
  const definition = getPlayerSkillCatalog()[skillId];
  return isPlainObject(definition) ? definition : null;
}

function getPlayerSkillSources(skillId, definition = null) {
  const stateSources = gameState.skills?.sources?.[skillId];
  const declaredSources = definition?.sources ?? definition?.source;
  const allSources = [];
  if (Array.isArray(stateSources)) allSources.push(...stateSources);
  if (declaredSources !== undefined) {
    allSources.push(...(Array.isArray(declaredSources) ? declaredSources : [declaredSources]));
  }
  const seen = new Set();
  return allSources.map(normalizeSkillSource).filter(source => {
    if (!source) return false;
    const key = JSON.stringify(source);
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

function getPlayerSkillContext(player = null) {
  const actor = isPlainObject(player) ? player : {};
  return {
    player: {
      ...gameState,
      ...actor,
      level: gameState.level,
      classId: gameState.classId,
      classLevel: gameState.classLevel
    }
  };
}

function checkPlayerSkillRequirements(definition, context = {}) {
  const requirements = isPlainObject(definition?.requirements) ? definition.requirements : {};
  const actor = isPlainObject(context.player) ? context.player : context;
  const unmet = [];
  const level = Number(actor.level ?? gameState.level);
  const classLevel = Number(actor.classLevel ?? gameState.classLevel);
  const classId = actor.classId ?? gameState.classId;

  const requiredLevel = requirements.level ?? requirements.minLevel;
  if (requiredLevel !== undefined && Number.isFinite(Number(requiredLevel)) && level < Number(requiredLevel)) unmet.push('level');
  if (requirements.classLevel !== undefined && Number.isFinite(Number(requirements.classLevel)) && classLevel < Number(requirements.classLevel)) unmet.push('classLevel');
  if (typeof requirements.classId === 'string' && classId !== requirements.classId) unmet.push('class');
  if (Array.isArray(requirements.classIds) && requirements.classIds.length > 0 && !requirements.classIds.includes(classId)) unmet.push('class');

  let resourceAvailable = null;
  const costType = definition?.costType;
  const cost = Number(definition?.cost || 0);
  if (costType && cost > 0) {
    resourceAvailable = Number(actor[costType]) >= cost;
    if (!resourceAvailable) unmet.push(costType);
  }
  if (definition?.type === 'heal' && Number.isFinite(Number(actor.hp)) && Number.isFinite(Number(actor.maxHp)) && actor.hp >= actor.maxHp) {
    unmet.push('fullHealth');
  }

  return { met: unmet.length === 0, unmet, resourceAvailable };
}

function resolvePlayerSkill(skillId, context = {}) {
  const id = typeof skillId === 'string' ? skillId : '';
  const state = isPlainObject(gameState.skills) ? gameState.skills : getDefaultSkillState();
  const definition = getPlayerSkillDefinition(id);
  const sources = getPlayerSkillSources(id, definition);
  const known = state.known.includes(id);
  const equipped = state.equipped.includes(id);
  const requirements = checkPlayerSkillRequirements(definition, context);
  const hasSource = sources.length > 0;
  const authorized = Boolean(definition && known && equipped && hasSource);
  const usable = Boolean(authorized && requirements.met);

  let reason = null;
  if (!definition) reason = 'definition_unavailable';
  else if (!known) reason = 'unknown';
  else if (!equipped) reason = 'not_equipped';
  else if (!hasSource) reason = 'source_missing';
  else if (!requirements.met) reason = requirements.unmet[0];

  return {
    id,
    definition,
    known,
    equipped,
    authorized,
    usable,
    sources,
    resourceAvailable: requirements.resourceAvailable,
    unmetRequirements: requirements.unmet,
    reason
  };
}

function getResolvedPlayerSkills(context = {}) {
  const state = isPlainObject(gameState.skills) ? gameState.skills : getDefaultSkillState();
  const ids = [...new Set([...state.known, ...state.equipped])];
  return ids.map(skillId => resolvePlayerSkill(skillId, context));
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
  if (!isFiniteNumber(state.taskModelVersion) || state.taskModelVersion < 1) { state.taskModelVersion = 1; recordSchemaDefault(warnings, 'taskModelVersion'); }
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
  if (!hasOwn('pendingLoot')) {
    state.pendingLoot = normalizePendingLootState(defaults.pendingLoot, warnings);
    recordSchemaDefault(warnings, 'pendingLoot');
  } else {
    const normalizedPendingLoot = normalizePendingLootState(state.pendingLoot, warnings);
    if (JSON.stringify(normalizedPendingLoot) !== JSON.stringify(state.pendingLoot)) {
      state.pendingLoot = normalizedPendingLoot;
      recordSchemaDefault(warnings, 'pendingLoot');
    }
  }
  if (!isPlainObject(state.rewardLedger)) { state.rewardLedger = {}; recordSchemaDefault(warnings, 'rewardLedger'); }
  if (!isPlainObject(state.worldState)) { state.worldState = {}; recordSchemaDefault(warnings, 'worldState'); } else state.worldState = normalizeWorldState(state.worldState);
  if (!isPlainObject(state.materialInteractions)) {
    state.materialInteractions = cloneSaveState(defaults.materialInteractions);
    recordSchemaDefault(warnings, 'materialInteractions');
  } else {
    if (!Number.isInteger(state.materialInteractions.version) || state.materialInteractions.version < 1) {
      state.materialInteractions.version = defaults.materialInteractions.version;
      recordSchemaDefault(warnings, 'materialInteractions.version');
    }
    if (!isPlainObject(state.materialInteractions.ledger)) {
      state.materialInteractions.ledger = {};
      recordSchemaDefault(warnings, 'materialInteractions.ledger');
    }
    if (!isPlainObject(state.materialInteractions.discoveredUses)) {
      state.materialInteractions.discoveredUses = {};
      recordSchemaDefault(warnings, 'materialInteractions.discoveredUses');
    }
  }

  if (!hasOwn('pendingTaskResult') || (state.pendingTaskResult !== null && !isPlainObject(state.pendingTaskResult))) { state.pendingTaskResult = null; recordSchemaDefault(warnings, 'pendingTaskResult'); }

  if (!hasOwn('classId') || typeof state.classId !== 'string') { state.classId = defaults.classId; recordSchemaDefault(warnings, 'classId'); }
  if (!isFiniteNumber(state.classLevel) || state.classLevel < 1) { state.classLevel = defaults.classLevel; recordSchemaDefault(warnings, 'classLevel'); }
  if (!Array.isArray(state.activeQuests)) { state.activeQuests = []; recordSchemaDefault(warnings, 'activeQuests'); }
  if (!Array.isArray(state.completedQuests)) { state.completedQuests = []; recordSchemaDefault(warnings, 'completedQuests'); }

  if (!isFiniteNumber(state.questModelVersion) || !Number.isInteger(state.questModelVersion) || state.questModelVersion < 1) {
    state.questModelVersion = 1;
    recordSchemaDefault(warnings, 'questModelVersion');
  }
  state.quests = isPlainObject(state.quests) ? { ...defaults.quests, ...state.quests } : cloneSaveState(defaults.quests);
  if (!Array.isArray(state.quests.active)) { state.quests.active = []; recordSchemaDefault(warnings, 'quests.active'); }
  if (!Array.isArray(state.quests.completed)) { state.quests.completed = []; recordSchemaDefault(warnings, 'quests.completed'); }
  if (!Array.isArray(state.quests.failed)) { state.quests.failed = []; recordSchemaDefault(warnings, 'quests.failed'); }
  if (state.quests.dailyReset !== null && typeof state.quests.dailyReset !== 'string') { state.quests.dailyReset = null; recordSchemaDefault(warnings, 'quests.dailyReset'); }
  if (!isPlainObject(state.quests.slotLimits)) { recordSchemaDefault(warnings, 'quests.slotLimits'); }
  if (!Array.isArray(state.quests.availableFollowUps)) { recordSchemaDefault(warnings, 'quests.availableFollowUps'); }
  if (!Array.isArray(state.quests.derivedTasks)) { recordSchemaDefault(warnings, 'quests.derivedTasks'); }
  normalizeQuestPersistence(state, warnings);

  const rawSkills = isPlainObject(state.skills) ? state.skills : null;
  state.skills = normalizeSkillState(rawSkills);
  if (!rawSkills) recordSchemaDefault(warnings, 'skills');
  if (rawSkills && !Array.isArray(rawSkills.known)) recordSchemaDefault(warnings, 'skills.known');
  if (rawSkills && !Array.isArray(rawSkills.equipped)) recordSchemaDefault(warnings, 'skills.equipped');
  if (rawSkills && !isPlainObject(rawSkills.sources)) recordSchemaDefault(warnings, 'skills.sources');

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

function isQuestIdList(value) {
  return Array.isArray(value) && value.every(id => typeof id === 'string' && id.length > 0);
}

function isCanonicalQuestState(value) {
  if (!isPlainObject(value)) return false;
  if (!isQuestIdList(value.active) || !isQuestIdList(value.completed) || !isQuestIdList(value.failed)) return false;
  if (value.dailyReset !== null && typeof value.dailyReset !== 'string') return false;
  return value.active.every(questId => {
    const questState = value[questId];
    if (!isPlainObject(questState)) return false;
    const currentDefinition = typeof QUESTS !== 'undefined' ? QUESTS[questId] : null;
    // Only actions are canonical. Legacy objectives and stages are accepted
    // by the migration boundary, never by the execution model.
    return !currentDefinition || Array.isArray(questState.actions);
  });
}

function isLegacyQuestEntry(value) {
  if (typeof value === 'string') return value.length > 0;
  if (!isPlainObject(value)) return false;
  const questId = value.questId || value.id;
  return typeof questId === 'string' && questId.length > 0;
}

function isUsableLegacyQuestState(value) {
  return Array.isArray(value) && value.length > 0 && value.every(isLegacyQuestEntry);
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
  state.pendingLoot = normalizePendingLootState(state.pendingLoot, []);
  state.rewardLedger = isPlainObject(state.rewardLedger) ? state.rewardLedger : {};
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

function getOfficialTaskDefinitions() {
  const catalogs = [];
  if (typeof DEFAULT_TASKS !== 'undefined' && Array.isArray(DEFAULT_TASKS)) catalogs.push(DEFAULT_TASKS);
  if (typeof EXPANSION_TASKS_V1 !== 'undefined' && Array.isArray(EXPANSION_TASKS_V1)) catalogs.push(EXPANSION_TASKS_V1);
  const definitions = new Map();
  for (const catalog of catalogs) {
    for (const task of catalog) {
      if (!isPlainObject(task) || typeof task.id !== 'string' || definitions.has(task.id)) continue;
      definitions.set(task.id, task);
    }
  }
  return definitions;
}

function migrateOfficialTaskText(state) {
  if (!isPlainObject(state) || !Array.isArray(state.tasks)) return false;
  const definitions = getOfficialTaskDefinitions();
  let changed = false;
  state.tasks = state.tasks.map(task => {
    if (!isPlainObject(task)) return task;
    const official = definitions.get(task.id);
    if (!official) return task;
    const migrated = { ...task };
    if (typeof official.name === 'string' && migrated.name !== official.name) {
      migrated.name = official.name;
      changed = true;
    }
    if (typeof official.desc === 'string' && migrated.desc !== official.desc) {
      migrated.desc = official.desc;
      changed = true;
    }
    if (isPlainObject(migrated.sideQuest) && isPlainObject(official.sideQuest)
      && typeof official.sideQuest.desc === 'string'
      && migrated.sideQuest.desc !== official.sideQuest.desc) {
      migrated.sideQuest = { ...migrated.sideQuest, desc: official.sideQuest.desc };
      changed = true;
    }
    return migrated;
  });
  return changed;
}

function normalizeTaskDefinition(task) {
  if (!isPlainObject(task)) return task;
  const normalized = { ...task };
  const definition = getTaskAvailabilityDefinition(normalized);
  if (definition.type === 'needs_review' && normalized.reviewStatus !== 'needs_review') {
    normalized.reviewStatus = 'needs_review';
  }
  return normalized;
}

function normalizeTaskHistory(history) {
  if (!Array.isArray(history)) return [];
  return history.map((entry, index) => {
    const normalized = isPlainObject(entry)
      ? { ...entry }
      : { rawEntry: entry === undefined ? null : cloneSaveState(entry) };
    const taskId = typeof normalized.taskId === 'string' && normalized.taskId ? normalized.taskId : null;
    const date = isValidTaskDate(normalized.date) ? normalized.date : null;
    const sideQuest = Boolean(normalized.sideQuest);
    if (!Object.prototype.hasOwnProperty.call(normalized, 'taskId')) normalized.taskId = taskId;
    if (!Object.prototype.hasOwnProperty.call(normalized, 'date')) normalized.date = date;
    if (!Object.prototype.hasOwnProperty.call(normalized, 'sideQuest')) normalized.sideQuest = sideQuest;
    if (!Object.prototype.hasOwnProperty.call(normalized, 'xp')) normalized.xp = 0;
    if (typeof normalized.completionId !== 'string' || !normalized.completionId) {
      normalized.completionId = taskId && date
        ? `task:${taskId}:${date}:${sideQuest ? 'side' : 'base'}:${index}`
        : `legacy-task-history-${index}`;
    }
    if (!taskId || !date) normalized.historyStatus = 'needs_review';
    return normalized;
  });
}

function migrateV3ToV4(state) {
  state.tasks = Array.isArray(state.tasks) ? state.tasks.map(normalizeTaskDefinition) : [];
  state.taskHistory = normalizeTaskHistory(state.taskHistory);
  state.taskModelVersion = 1;
  return state;
}

function migrateV2ToV3(state, context = {}) {
  if (context.hasPartialCanonicalQuestState && !context.hasUsableLegacyQuestState) {
    throw new Error('Partial canonical quest state cannot be reconstructed safely without usable legacy activeQuests.');
  }
  const hasTranslatedActionState = isPlainObject(state.quests)
    && Array.isArray(state.quests.active)
    && state.quests.active.length > 0
    && state.quests.active.every(questId => isPlainObject(state.quests[questId]) && Array.isArray(state.quests[questId].actions));
  if (!context.hasCanonicalQuestState && !hasTranslatedActionState) migrateQuestState(state, true);
  state.guildId = state.guildId ?? null;
  state.guildName = state.guildName ?? null;
  state.guildMembers = Array.isArray(state.guildMembers) ? state.guildMembers : [];
  state.pendingReceipts = Array.isArray(state.pendingReceipts) ? state.pendingReceipts : [];
  state.receivedReceipts = Array.isArray(state.receivedReceipts) ? state.receivedReceipts : [];
  state.lastReceiptId = isFiniteNumber(state.lastReceiptId) ? state.lastReceiptId : 0;
  return state;
}

function migrateQuestModelV2ToV3(state) {
  normalizeQuestPersistence(state);
  state.questModelVersion = CURRENT_QUEST_MODEL_VERSION;
  return state;
}

function migrateV4ToCurrent(state) {
  if (state.name === 'Aventurero') state.name = 'Adventurer';
  migrateOfficialTaskText(state);
  migrateQuestModelV2ToV3(state);
  return state;
}

function migrateState(parsed) {
  const from = parseSaveVersion(parsed);
  const warnings = [];
  return runMigrations(parsed, from, warnings);
}

const MIGRATIONS = [
  { from: 0, to: 1, fn: migrateV0ToV1 },
  { from: 1, to: 2, fn: migrateV1ToV2 },
  { from: 2, to: 3, fn: migrateV2ToV3 },
  { from: 3, to: 4, fn: migrateV3ToV4 }
];

function runMigrations(parsed, from, warnings) {
  const hasCanonicalQuestState = Object.prototype.hasOwnProperty.call(parsed, 'quests') && isCanonicalQuestState(parsed.quests);
  const hasLegacyQuestModel = Number(parsed.questModelVersion) < CURRENT_QUEST_MODEL_VERSION;
  const hasPartialCanonicalQuestState = Object.prototype.hasOwnProperty.call(parsed, 'quests')
    && !hasCanonicalQuestState
    && !hasLegacyQuestModel;
  const hasUsableLegacyQuestState = isUsableLegacyQuestState(parsed.activeQuests);
  let candidate = applySchemaDefaults({ ...parsed, saveVersion: from }, warnings);
  candidate.saveVersion = from;
  if (from === CURRENT_SAVE_VERSION && hasPartialCanonicalQuestState) {
    if (!hasUsableLegacyQuestState) {
      throw new Error('Partial canonical quest state cannot be reconstructed safely without usable legacy activeQuests.');
    }
    migrateQuestState(candidate, true);
  }
  let version = from;
  while (version < CURRENT_SAVE_VERSION) {
    const migration = MIGRATIONS.find(step => step.from === version);
    if (!migration) throw new Error(`No migration exists from saveVersion ${version}.`);
    const beforeVersion = candidate.saveVersion;
    migration.fn(candidate, {
      hasCanonicalQuestState,
      hasPartialCanonicalQuestState,
      hasUsableLegacyQuestState
    });
    if (candidate.saveVersion !== beforeVersion) {
      throw new Error(`Migration ${migration.from}->${migration.to} changed saveVersion before it completed.`);
    }
    candidate.saveVersion = migration.to;
    version = migration.to;
  }
  candidate = applySchemaDefaults(candidate, warnings);
  candidate = migrateV4ToCurrent(candidate);
  candidate.saveVersion = CURRENT_SAVE_VERSION;
  return candidate;
}

function saveGame(options = {}) {
  if (!isLifeXPSaveReady()) {
    console.warn('Save blocked until the current save has finished loading.');
    return false;
  }
  if (lifeXPSaveDeferred > 0 && options.force !== true) return true;
  try {
    localStorage.setItem('lifexp_save', JSON.stringify(gameState));
    const saved = localStorage.getItem('lifexp_save') === JSON.stringify(gameState);
    if (saved && pendingMissionRevealNotices.length > 0) {
      const notices = pendingMissionRevealNotices;
      pendingMissionRevealNotices = [];
      announceMissionReveals(notices);
    }
    if (saved && pendingMissionFollowUpNotices.length > 0) {
      const notices = pendingMissionFollowUpNotices;
      pendingMissionFollowUpNotices = [];
      announceMissionFollowUps(notices);
    }
    return saved;
  } catch (e) {
    console.warn('Could not save game:', e);
    return false;
  }
}

function finalizeLoadedState() {
  let changed = migrateOfficialTaskText(gameState);
  if (!gameState.tasks || gameState.tasks.length === 0) {
    gameState.tasks = JSON.parse(JSON.stringify(DEFAULT_TASKS));
    changed = true;
  }

  // Recover legacy item entries before rendering the inventory.
  if (typeof migrateLegacyInventory === 'function') migrateLegacyInventory();
  if (typeof initializeItemSystem === 'function') initializeItemSystem();
  if (typeof repairInventoryIdentities === 'function') repairInventoryIdentities();

  // Merge official content added in later versions without touching custom task data.
  const existingTaskIds = new Set((gameState.tasks || []).map(task => task.id));
  for (const officialTask of DEFAULT_TASKS) {
    if (!existingTaskIds.has(officialTask.id)) {
      gameState.tasks.push(normalizeTaskDefinition(JSON.parse(JSON.stringify(officialTask))));
    }
  }

  changed = reconcileDerivedTasks() || changed;
  updateStreak();
  if (typeof window !== 'undefined' && window.LifeXPMaterialInteractions && typeof window.LifeXPMaterialInteractions.reconcile === 'function') {
    changed = window.LifeXPMaterialInteractions.reconcile() || changed;
  }
  return changed;
}

function loadGame() {
  lifeXPSaveLoadState = 'loading';
  const raw = localStorage.getItem('lifexp_save');
  if (!raw) {
    try {
      gameState = cloneSaveState(DEFAULT_GAME_STATE);
      const finalizeChanged = finalizeLoadedState();
      lifeXPSaveLoadState = 'ready';
      if (finalizeChanged) saveGame();
      return true;
    } catch (error) {
      lifeXPSaveLoadState = 'failed';
      showSaveLoadError(error instanceof Error ? error.message : String(error));
      return false;
    }
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
    const finalizeChanged = finalizeLoadedState();
    lifeXPSaveLoadState = 'ready';
    if (finalizeChanged) saveGame();
    return true;
  } catch (error) {
    // A failure after the commit is still recoverable: restore the exact raw save.
    gameState = previousState;
    if (saveWasCommitted) {
      try { localStorage.setItem('lifexp_save', raw); }
      catch (restoreError) { console.error('Could not restore the original save:', restoreError); }
    }
    lifeXPSaveLoadState = 'failed';
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

function showScreen(screenId, options = {}) {
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  const targetScreen = document.getElementById(`screen-${screenId}`);
  if (!targetScreen && screenId === 'task-history' && typeof renderTaskHistory === 'function') {
    renderTaskHistory();
  }
  const resolvedScreen = document.getElementById(`screen-${screenId}`);
  if (!resolvedScreen) {
    console.warn(`Unknown LifeXP screen: ${screenId}`);
    return;
  }
  resolvedScreen.classList.add('active');
  
  document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
  document.querySelector(`.nav-item[data-screen="${screenId}"]`)?.classList.add('active');
  
  // Render screen content
  if (screenId === 'hub') renderHub();
  else if (screenId === 'character') renderCharacter();
  else if (screenId === 'inventory') renderInventory();
  else if (screenId === 'quests') renderQuests();
  else if (screenId === 'guild') renderGuild();
  else if (screenId === 'settings') renderSettings();
  else if (screenId === 'task-history' && typeof renderTaskHistory === 'function') renderTaskHistory();

  if (typeof syncLifeXPScreenHistory === 'function') {
    syncLifeXPScreenHistory(screenId, options);
  }
}