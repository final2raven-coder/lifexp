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
  questModelVersion: 2,
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
    derivedTasks: []
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

// Save loading is a mandatory barrier before content installers may persist.
let lifeXPSaveLoadState = 'not_started';
const lifeXPContentInstallers = [];
let lifeXPContentInstallersRun = false;

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
    nextAvailableDate: null
  };

  if (isTaskArchived(task)) return { ...base, status: 'archived', available: false };
  if (definition.type === 'needs_review') {
    return {
      ...base,
      status: 'needs_review',
      available: !isValidTaskDate(task?.lastDone),
      reason: definition.reason
    };
  }
  if (definition.type === 'once' || definition.repeatable === false) {
    return {
      ...base,
      status: history.length > 0 ? 'completed' : 'available',
      available: history.length === 0,
      nextAvailableDate: null
    };
  }
  if (!isValidTaskDate(referenceDate)) {
    return { ...base, status: 'needs_review', available: false, reason: 'invalid_reference_date' };
  }
  if (definition.limit === null) return { ...base, status: 'available', available: true };

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
      nextAvailableDate: addDaysToDate(oldestRecent, definition.intervalDays)
    };
  }
  return { ...base, status: 'available', available: true };
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
const CURRENT_QUEST_MODEL_VERSION = 2;
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

function normalizeQuestObjectiveState(objective) {
  if (!isPlainObject(objective)) return objective;
  const normalized = { ...objective };
  normalized.consumedCompletionIds = normalizeCompletionIds(normalized.consumedCompletionIds);
  return normalized;
}

function normalizeQuestStageState(stage, index) {
  if (!isPlainObject(stage)) {
    return {
      id: `stage_${index + 1}`,
      status: index === 0 ? 'active' : 'locked',
      objectives: []
    };
  }
  const normalized = { ...stage };
  normalized.id = typeof normalized.id === 'string' && normalized.id ? normalized.id : `stage_${index + 1}`;
  normalized.status = ['locked', 'active', 'completed'].includes(normalized.status)
    ? normalized.status
    : (index === 0 ? 'active' : 'locked');
  normalized.objectives = Array.isArray(normalized.objectives)
    ? normalized.objectives.map(normalizeQuestObjectiveState)
    : [];
  return normalized;
}

const QUEST_INSTANCE_STATUS = Object.freeze({
  active: 'active',
  completed: 'completed',
  failed: 'failed',
  needsReview: 'needs_review'
});

function normalizeQuestInstanceState(value, context = {}) {
  if (!isPlainObject(value)) return value;
  const normalized = { ...value };
  if (Array.isArray(normalized.objectives)) {
    normalized.objectives = normalized.objectives.map(normalizeQuestObjectiveState);
  }

  const hasStages = Array.isArray(normalized.stages);
  if (hasStages) {
    normalized.stages = normalized.stages.map(normalizeQuestStageState);
  }

  const statusWasCompleted = normalized.status === QUEST_INSTANCE_STATUS.completed;
  const statusWasFailed = normalized.status === QUEST_INSTANCE_STATUS.failed;
  const stagesAreComplete = hasStages && normalized.stages.length > 0
    && normalized.stages.every(stage => stage.status === QUEST_INSTANCE_STATUS.completed);
  const isTerminal = context.completed === true || statusWasCompleted || stagesAreComplete;

  if (isTerminal) {
    // Terminal state is explicit and self-contained. Collection membership is
    // reconciled by normalizeQuestPersistence, while this object guarantees
    // that no stage index can point back into a completed quest.
    normalized.status = QUEST_INSTANCE_STATUS.completed;
    normalized.currentStage = null;
    if (hasStages) {
      normalized.stages = normalized.stages.map(stage => ({
        ...stage,
        status: QUEST_INSTANCE_STATUS.completed
      }));
    }
  } else if (statusWasFailed || context.failed === true) {
    normalized.status = QUEST_INSTANCE_STATUS.failed;
    normalized.currentStage = null;
  } else if (context.active === true || normalized.status === QUEST_INSTANCE_STATUS.active || hasStages) {
    normalized.status = QUEST_INSTANCE_STATUS.active;
    if (hasStages && normalized.stages.length > 0) {
      const declaredStage = Number.isInteger(normalized.currentStage) ? normalized.currentStage : -1;
      const firstActiveStage = normalized.stages.findIndex(stage => stage.status === QUEST_INSTANCE_STATUS.active);
      const fallbackStage = firstActiveStage >= 0 ? firstActiveStage : 0;
      const currentStage = Math.min(
        normalized.stages.length - 1,
        Math.max(0, declaredStage >= 0 ? declaredStage : fallbackStage)
      );
      normalized.currentStage = currentStage;
      normalized.stages = normalized.stages.map((stage, index) => ({
        ...stage,
        status: index < currentStage
          ? QUEST_INSTANCE_STATUS.completed
          : index === currentStage
            ? QUEST_INSTANCE_STATUS.active
            : 'locked'
      }));
    } else if (!Number.isInteger(normalized.currentStage) || normalized.currentStage < 0) {
      normalized.currentStage = 0;
    }
  }

  normalized.derivedTaskIds = Array.isArray(normalized.derivedTaskIds)
    ? [...new Set(normalized.derivedTaskIds.filter(id => typeof id === 'string' && id))]
    : [];
  return normalized;
}

function normalizeDerivedTaskState(value) {
  if (!isPlainObject(value)) {
    return {
      status: 'needs_review',
      rawValue: value === undefined ? null : cloneSaveState(value),
      taskHistory: []
    };
  }
  const normalized = { ...value };
  if (typeof normalized.id !== 'string' || !normalized.id) normalized.status = 'needs_review';
  if (!['pending', 'accepted', 'completed', 'expired', 'needs_review'].includes(normalized.status)) {
    normalized.status = 'pending';
  }
  if (typeof normalized.sourceQuestId !== 'string' || !normalized.sourceQuestId) normalized.status = 'needs_review';
  if (typeof normalized.templateId !== 'string' || !normalized.templateId) normalized.status = 'needs_review';
  if (!Array.isArray(normalized.taskHistory)) normalized.taskHistory = [];
  return normalized;
}

function normalizeQuestPersistence(state, warnings = []) {
  if (!isPlainObject(state.quests)) state.quests = cloneSaveState(DEFAULT_GAME_STATE.quests);
  const questState = state.quests;
  if (!Array.isArray(questState.active)) questState.active = [];
  if (!Array.isArray(questState.completed)) questState.completed = [];
  if (!Array.isArray(questState.failed)) questState.failed = [];
  if (questState.dailyReset !== null && typeof questState.dailyReset !== 'string') questState.dailyReset = null;
  questState.slotLimits = normalizeQuestSlotLimits(questState.slotLimits, warnings);
  questState.availableFollowUps = Array.isArray(questState.availableFollowUps)
    ? [...new Set(questState.availableFollowUps.filter(id => typeof id === 'string' && id))]
    : [];
  questState.derivedTasks = Array.isArray(questState.derivedTasks)
    ? questState.derivedTasks.map(normalizeDerivedTaskState)
    : [];
  const questIds = new Set([...questState.active, ...questState.completed, ...questState.failed]);
  for (const questId of questIds) {
    if (typeof questId !== 'string' || !isPlainObject(questState[questId])) continue;
    const normalized = normalizeQuestInstanceState(questState[questId], {
      active: questState.active.includes(questId),
      completed: questState.completed.includes(questId),
      failed: questState.failed.includes(questId)
    });
    questState[questId] = normalized;

    // Keep the collection indexes and the instance status as one canonical
    // state. In particular, a terminal staged instance cannot remain active.
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
    return !currentDefinition || Array.isArray(questState.objectives);
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
  if (!context.hasCanonicalQuestState) migrateQuestState(state, true);
  state.guildId = state.guildId ?? null;
  state.guildName = state.guildName ?? null;
  state.guildMembers = Array.isArray(state.guildMembers) ? state.guildMembers : [];
  state.pendingReceipts = Array.isArray(state.pendingReceipts) ? state.pendingReceipts : [];
  state.receivedReceipts = Array.isArray(state.receivedReceipts) ? state.receivedReceipts : [];
  state.lastReceiptId = isFiniteNumber(state.lastReceiptId) ? state.lastReceiptId : 0;
  return state;
}

function migrateV4ToCurrent(state) {
  if (state.name === 'Aventurero') state.name = 'Adventurer';
  normalizeQuestPersistence(state);
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
  const hasPartialCanonicalQuestState = Object.prototype.hasOwnProperty.call(parsed, 'quests') && !hasCanonicalQuestState;
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

function saveGame() {
  if (!isLifeXPSaveReady()) {
    console.warn('Save blocked until the current save has finished loading.');
    return false;
  }
  try {
    localStorage.setItem('lifexp_save', JSON.stringify(gameState));
    return localStorage.getItem('lifexp_save') === JSON.stringify(gameState);
  } catch (e) {
    console.warn('Could not save game:', e);
    return false;
  }
}

function finalizeLoadedState() {
  let changed = false;
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
      gameState.tasks.push(normalizeTaskDefinition(JSON.parse(JSON.stringify(officialTask))));
    }
  }

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

  if (typeof syncLifeXPScreenHistory === 'function') {
    syncLifeXPScreenHistory(screenId, options);
  }
}