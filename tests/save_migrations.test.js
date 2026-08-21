'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const engineSource = fs.readFileSync(path.join(__dirname, '..', 'engine.js'), 'utf8');
const update2Source = fs.readFileSync(path.join(__dirname, '..', 'update2_content.js'), 'utf8');

class MemoryStorage {
  constructor(initial = {}) {
    this.values = new Map(Object.entries(initial));
  }

  get length() { return this.values.size; }
  key(index) { return [...this.values.keys()][index] ?? null; }
  getItem(key) { return this.values.has(key) ? this.values.get(key) : null; }
  setItem(key, value) { this.values.set(String(key), String(value)); }
  removeItem(key) { this.values.delete(String(key)); }
}

function createDocument() {
  const body = {
    appendChild() {}
  };
  return {
    body,
    readyState: 'complete',
    getElementById() { return null; },
    createElement() {
      return {
        style: { cssText: '' },
        setAttribute() {},
        textContent: ''
      };
    }
  };
}

function createHarness(rawSave, storageEntries = {}) {
  const storage = new MemoryStorage({ lifexp_save: rawSave, ...storageEntries });
  const warnings = [];
  const visibleErrors = [];
  const context = {
    localStorage: storage,
    document: createDocument(),
    DEFAULT_TASKS: [],
    FREQ: {
      daily: { name: 'Diaria', days: 1, availability: { type: 'periodic', intervalDays: 1, limit: 1, repeatable: true } },
      weekly: { name: 'Semanal', days: 7, availability: { type: 'periodic', intervalDays: 7, limit: 1, repeatable: true } },
      biweekly: { name: 'Quincenal', days: 14, availability: { type: 'periodic', intervalDays: 14, limit: 1, repeatable: true } },
      monthly: { name: 'Mensual', days: 30, availability: { type: 'periodic', intervalDays: 30, limit: 1, repeatable: true } },
      once: { name: 'Una sola vez', days: null, availability: { type: 'once', intervalDays: null, limit: 1, repeatable: false } }
    },
    QUESTS: {
      quest_progress: {
        id: 'quest_progress',
        type: 'simple',
        objectives: [
          { id: 'obj_1', type: 'complete_tasks', count: 3, category: null, progress: 0 },
          { id: 'obj_2', type: 'complete_tasks', count: 2, category: 'casa', progress: 0 }
        ]
      }
    },
    console: {
      log() {},
      info() {},
      warn(...args) { warnings.push(args.join(' ')); },
      error(...args) { warnings.push(args.join(' ')); }
    },
    showToast(message) { visibleErrors.push(String(message)); }
  };
  context.globalThis = context;
  vm.createContext(context);
  vm.runInContext(engineSource, context, { filename: 'engine.js' });
  vm.runInContext(`globalThis.__lifexp = {
    loadGame,
    getState: () => gameState,
    getDefaultState: () => DEFAULT_GAME_STATE,
    getTaskAvailability,
    isTaskDue,
    isTaskOverdue,
    createTaskHistoryEntry,
    getWarnings: () => [],
    getSave: () => localStorage.getItem('lifexp_save'),
    getSnapshotKeys: () => Array.from({ length: localStorage.length }, (_, index) => localStorage.key(index)).filter(key => key && key.startsWith('lifexp_premigration_'))
  };`, context);
  return { api: context.__lifexp, storage, warnings, visibleErrors };
}

function loadFixture(fixture, storageEntries) {
  const raw = typeof fixture === 'string' ? fixture : JSON.stringify(fixture);
  const harness = createHarness(raw, storageEntries);
  const result = harness.api.loadGame();
  return { ...harness, result, state: harness.api.getState(), rawBefore: raw };
}

function assertCanonicalState(state) {
  assert.equal(state.saveVersion, 4);
  assert.ok(Array.isArray(state.inventory));
  assert.ok(state.equipment && Object.prototype.hasOwnProperty.call(state.equipment, 'weapon'));
  assert.ok(state.itemSystem && state.itemSystem.attunement);
  assert.ok(Array.isArray(state.guildMembers));
  assert.ok(state.quests && Array.isArray(state.quests.active));
}

function getPersistedState(loaded) {
  return JSON.parse(loaded.api.getSave());
}

function testV0Migration() {
  const fixture = {
    name: 'V0 hero',
    level: 2,
    xp: 17,
    customMarker: { preserved: true },
    tasks: [],
    activeQuests: [],
    completedQuests: []
  };
  const loaded = loadFixture(fixture);
  assert.equal(loaded.result, true);
  assertCanonicalState(loaded.state);
  assert.equal(JSON.stringify(loaded.state.customMarker), JSON.stringify({ preserved: true }));
  assert.equal(loaded.state.inventory.length, 0);
  assert.match(loaded.api.getSave(), /"saveVersion":4/);
  assert.equal(loaded.api.getSnapshotKeys().length, 1);
}

function testV1Migration() {
  const fixture = {
    saveVersion: 1,
    name: 'V1 hero',
    inventory: [{ id: 'known_item', qty: 1 }],
    equipment: { weapon: { id: 'known_item' } },
    tasks: [],
    activeQuests: [],
    completedQuests: [],
    extraField: 'kept'
  };
  const loaded = loadFixture(fixture);
  assert.equal(loaded.result, true);
  assertCanonicalState(loaded.state);
  assert.equal(JSON.stringify(loaded.state.inventory), JSON.stringify([{ id: 'known_item', qty: 1 }]));
  assert.equal(loaded.state.extraField, 'kept');
  assert.equal(JSON.stringify(loaded.state.itemSystem.rituals), JSON.stringify({}));
}

function testV2ActiveQuestProgressMigration() {
  const fixture = {
    saveVersion: 2,
    name: 'V2 quest hero',
    tasks: [],
    activeQuests: [{
      questId: 'quest_progress',
      startedAt: '2026-08-01',
      objectives: [
        { id: 'obj_1', type: 'complete_tasks', count: 3, progress: 2, completed: false },
        { id: 'legacy_obj', type: 'complete_tasks', count: 99, progress: 8, completed: false }
      ]
    }],
    completedQuests: [],
    migrationMarker: 'preserve-me'
  };
  const loaded = loadFixture(fixture);
  assert.equal(loaded.result, true);
  assertCanonicalState(loaded.state);
  assert.equal(JSON.stringify(loaded.state.quests.active), JSON.stringify(['quest_progress']));
  assert.equal(loaded.state.quests.quest_progress.objectives.length, 2);
  assert.equal(loaded.state.quests.quest_progress.objectives.find(objective => objective.id === 'obj_1').progress, 2);
  assert.equal(loaded.state.quests.quest_progress.objectives.find(objective => objective.id === 'obj_2').progress, 0);
  assert.equal(loaded.state.quests.quest_progress.objectives.some(objective => objective.id === 'legacy_obj'), false);
  assert.equal(loaded.state.migrationMarker, 'preserve-me');
  assert.ok(loaded.warnings.some(message => message.includes('legacy_obj')));
}

function testV2WithCanonicalQuestState() {
  const fixture = {
    saveVersion: 2,
    tasks: [],
    activeQuests: [{ questId: 'quest_progress', objectives: [{ id: 'obj_1', progress: 99 }] }],
    quests: {
      active: ['quest_progress'],
      completed: [],
      failed: [],
      dailyReset: null,
      quest_progress: {
        startedAt: '2026-08-02',
        objectives: [{ id: 'obj_1', progress: 1, completed: false }, { id: 'obj_2', progress: 1, completed: false }]
      }
    }
  };
  const loaded = loadFixture(fixture);
  assert.equal(loaded.result, true);
  assertCanonicalState(loaded.state);
  assert.equal(loaded.state.quests.quest_progress.objectives.find(objective => objective.id === 'obj_1').progress, 1);
  assert.equal(loaded.state.quests.quest_progress.objectives.find(objective => objective.id === 'obj_2').progress, 1);
  const persisted = getPersistedState(loaded);
  assert.equal(persisted.quests.quest_progress.objectives.find(objective => objective.id === 'obj_1').progress, 1);
}

function testV2PartialCanonicalStateUsesLegacyProgress() {
  const fixture = {
    saveVersion: 2,
    tasks: [],
    quests: {
      active: ['quest_progress']
    },
    activeQuests: [{
      questId: 'quest_progress',
      startedAt: '2026-08-03',
      objectives: [{ id: 'obj_1', progress: 2, completed: false }, { id: 'legacy_obj', progress: 8 }]
    }],
    partialQuestMarker: 'preserve-me'
  };
  const loaded = loadFixture(fixture);
  assert.equal(loaded.result, true);
  assertCanonicalState(loaded.state);
  assert.equal(loaded.state.quests.quest_progress.objectives.find(objective => objective.id === 'obj_1').progress, 2);
  assert.equal(loaded.state.quests.quest_progress.objectives.find(objective => objective.id === 'obj_2').progress, 0);
  assert.ok(loaded.warnings.some(message => message.includes('legacy_obj')));
  const persisted = getPersistedState(loaded);
  assert.equal(persisted.partialQuestMarker, 'preserve-me');
  assert.equal(persisted.quests.quest_progress.objectives.find(objective => objective.id === 'obj_1').progress, 2);
}

function testV2PartialCanonicalStateWithoutLegacyRollsBack() {
  const fixture = {
    saveVersion: 2,
    tasks: [],
    quests: { active: ['quest_progress'] },
    activeQuests: [],
    preserveExactBytes: { value: 'yes' }
  };
  const raw = JSON.stringify(fixture);
  const loaded = loadFixture(raw);
  assert.equal(loaded.result, false);
  assert.equal(loaded.api.getSave(), raw);
  assert.equal(loaded.visibleErrors.length, 1);
  assert.match(loaded.visibleErrors[0], /original save was not modified/i);
  assert.equal(loaded.api.getSnapshotKeys().length, 1);
}

function testUnknownCanonicalQuestRemainsRecoverable() {
  const fixture = {
    saveVersion: 2,
    tasks: [],
    activeQuests: [],
    quests: {
      active: ['future_quest'],
      completed: [],
      failed: [],
      dailyReset: null,
      future_quest: { opaqueProgress: { stage: 4 } }
    }
  };
  const loaded = loadFixture(fixture);
  assert.equal(loaded.result, true);
  assert.equal(loaded.state.quests.active[0], 'future_quest');
  assert.equal(JSON.stringify(loaded.state.quests.future_quest.opaqueProgress), JSON.stringify({ stage: 4 }));
  const persisted = getPersistedState(loaded);
  assert.equal(JSON.stringify(persisted.quests.future_quest.opaqueProgress), JSON.stringify({ stage: 4 }));
}

function testV3AndLegacyEquipmentId() {
  const fixture = {
    saveVersion: 3,
    tasks: [],
    equipment: {
      weapon: 'Legacy Display Sword',
      armor: null,
      accessory1: null,
      accessory2: null,
      artifact: null
    },
    quests: { active: [], completed: [], failed: [], dailyReset: null },
    unknownFutureField: { value: 42 }
  };
  const loaded = loadFixture(fixture);
  assert.equal(loaded.result, true);
  assertCanonicalState(loaded.state);
  assert.equal(loaded.state.equipment.weapon, 'Legacy Display Sword');
  assert.equal(JSON.stringify(loaded.state.unknownFutureField), JSON.stringify({ value: 42 }));
}

function testCorruptedSaveDoesNotChangeOriginal() {
  const corrupted = '{"saveVersion":2,"tasks":[';
  const loaded = loadFixture(corrupted);
  assert.equal(loaded.result, false);
  assert.equal(loaded.api.getSave(), corrupted);
  assert.equal(loaded.visibleErrors.length, 1);
  assert.match(loaded.visibleErrors[0], /original save was not modified/i);
}

function testSnapshotRetention() {
  const fixture = { saveVersion: 3, tasks: [] };
  const storageEntries = {
    lifexp_premigration_v3_100: 'old-1',
    lifexp_premigration_v3_200: 'old-2',
    lifexp_premigration_v3_300: 'old-3'
  };
  const loaded = loadFixture(fixture, storageEntries);
  assert.equal(loaded.result, true);
  assert.equal(loaded.api.getSnapshotKeys().length, 3);
  assert.equal(loaded.storage.getItem('lifexp_premigration_v3_100'), null);
}

function testNoUndefinedExpansionInstallerCalls() {
  assert.equal(/if\s*\(\s*typeof\s+installExpansion[A-Za-z]+\s*===\s*'function'\s*\)/.test(update2Source), false);
  assert.match(update2Source, /assertExpansionLoadOrder/);
  assert.match(update2Source, /assertExpansionInstalled/);
  for (const installer of ['installExpansionItems', 'installExpansionEnemies', 'installExpansionQuests', 'installExpansionTasks']) {
    assert.match(update2Source, new RegExp(`${installer}\\(\\)`));
  }
}


function testTaskModelMigrationAndIdempotence() {
  const fixture = {
    saveVersion: 3,
    tasks: [
      { id: 'legacy_daily', freq: 'daily', lastDone: '2026-08-20' },
      { id: 'legacy_without_frequency', name: 'Legacy task', lastDone: null },
      { id: 'archived_task', freq: 'weekly', archived: true, lastDone: '2026-08-01' }
    ],
    taskHistory: [
      { taskId: 'legacy_daily', date: '2026-08-20', xp: 10, sideQuest: false },
      { taskId: 'legacy_daily', date: '2026-08-19', xp: 8, sideQuest: true },
      { taskId: 'legacy_daily', date: '2026-08-18', xp: 6, sideQuest: false, completionId: 'stable-history-id' }
    ],
    quests: { active: [], completed: [], failed: [], dailyReset: null }
  };
  const loaded = loadFixture(fixture);
  assert.equal(loaded.result, true);
  assert.equal(loaded.state.saveVersion, 4);
  assert.equal(loaded.state.taskModelVersion, 1);
  assert.equal(loaded.state.taskHistory.length, 3);
  assert.equal(loaded.state.taskHistory[2].completionId, 'stable-history-id');
  assert.ok(loaded.state.tasks.find(task => task.id === 'legacy_without_frequency').reviewStatus === 'needs_review');
  assert.equal(loaded.state.tasks.find(task => task.id === 'archived_task').archived, true);

  const persistedBeforeSecondLoad = loaded.api.getSave();
  assert.equal(loaded.api.loadGame(), true);
  assert.equal(loaded.api.getSave(), persistedBeforeSecondLoad);
}

function loadTaskAvailabilityFixture(task, taskHistory = []) {
  const loaded = loadFixture({
    saveVersion: 4,
    tasks: [task],
    taskHistory,
    quests: { active: [], completed: [], failed: [], dailyReset: null }
  });
  assert.equal(loaded.result, true);
  return loaded;
}

function testTaskAvailabilityFrequencies() {
  const daily = loadTaskAvailabilityFixture({ id: 'daily', freq: 'daily' });
  assert.equal(daily.api.getTaskAvailability(daily.state.tasks[0], '2026-08-21').status, 'available');
  daily.state.taskHistory.push({ taskId: 'daily', date: '2026-08-20', xp: 1, sideQuest: false });
  assert.equal(daily.api.getTaskAvailability(daily.state.tasks[0], '2026-08-21').status, 'available');
  assert.equal(daily.api.getTaskAvailability(daily.state.tasks[0], '2026-08-20').status, 'cooldown');

  const weekly = loadTaskAvailabilityFixture(
    { id: 'weekly', freq: 'weekly' },
    [{ taskId: 'weekly', date: '2026-08-14', xp: 1, sideQuest: false }]
  );
  assert.equal(weekly.api.getTaskAvailability(weekly.state.tasks[0], '2026-08-20').status, 'cooldown');
  assert.equal(weekly.api.getTaskAvailability(weekly.state.tasks[0], '2026-08-21').status, 'available');

  const biweekly = loadTaskAvailabilityFixture(
    { id: 'biweekly', freq: 'biweekly' },
    [{ taskId: 'biweekly', date: '2026-08-07', xp: 1, sideQuest: false }]
  );
  assert.equal(biweekly.api.getTaskAvailability(biweekly.state.tasks[0], '2026-08-20').status, 'cooldown');
  assert.equal(biweekly.api.getTaskAvailability(biweekly.state.tasks[0], '2026-08-21').status, 'available');

  const monthly = loadTaskAvailabilityFixture(
    { id: 'monthly', freq: 'monthly' },
    [{ taskId: 'monthly', date: '2026-07-22', xp: 1, sideQuest: false }]
  );
  assert.equal(monthly.api.getTaskAvailability(monthly.state.tasks[0], '2026-08-20').status, 'cooldown');
  assert.equal(monthly.api.getTaskAvailability(monthly.state.tasks[0], '2026-08-21').status, 'available');
}

function testRepeatableAndNonRepeatablePolicies() {
  const repeatable = loadTaskAvailabilityFixture(
    {
      id: 'repeatable',
      availability: { type: 'periodic', intervalDays: 7, limit: 2, repeatable: true }
    },
    [
      { taskId: 'repeatable', date: '2026-08-20', xp: 1, sideQuest: false },
      { taskId: 'repeatable', date: '2026-08-21', xp: 1, sideQuest: false }
    ]
  );
  assert.equal(repeatable.api.getTaskAvailability(repeatable.state.tasks[0], '2026-08-22').status, 'cooldown');
  assert.equal(repeatable.api.getTaskAvailability(repeatable.state.tasks[0], '2026-08-28').status, 'available');

  const nonRepeatable = loadTaskAvailabilityFixture({ id: 'once', freq: 'once' });
  assert.equal(nonRepeatable.api.getTaskAvailability(nonRepeatable.state.tasks[0], '2026-08-21').status, 'available');
  nonRepeatable.state.taskHistory.push({ taskId: 'once', date: '2026-08-21', xp: 1, sideQuest: false });
  assert.equal(nonRepeatable.api.getTaskAvailability(nonRepeatable.state.tasks[0], '2026-08-22').status, 'completed');

  const archived = loadTaskAvailabilityFixture({ id: 'archived', freq: 'daily', archived: true });
  assert.equal(archived.api.getTaskAvailability(archived.state.tasks[0], '2026-08-21').status, 'archived');
  assert.equal(archived.api.isTaskDue(archived.state.tasks[0], '2026-08-21'), false);
}

function testLegacyTaskWithoutFrequencyNeedsReview() {
  const legacy = loadTaskAvailabilityFixture({ id: 'legacy', name: 'No frequency' });
  const availability = legacy.api.getTaskAvailability(legacy.state.tasks[0], '2026-08-21');
  assert.equal(availability.status, 'needs_review');
  assert.equal(availability.available, true);
  legacy.state.tasks[0].lastDone = '2026-08-20';
  const afterCompletion = legacy.api.getTaskAvailability(legacy.state.tasks[0], '2026-08-21');
  assert.equal(afterCompletion.status, 'needs_review');
  assert.equal(afterCompletion.available, false);
}

function testHistoryEntryCapturesScheduleSnapshot() {
  const loaded = loadTaskAvailabilityFixture({ id: 'snapshot', freq: 'weekly' });
  const entry = loaded.api.createTaskHistoryEntry(loaded.state.tasks[0], { date: '2026-08-21', xp: 12, sequence: 0 });
  assert.deepEqual(entry, {
    taskId: 'snapshot',
    date: '2026-08-21',
    xp: 12,
    sideQuest: false,
    completionId: 'task:snapshot:2026-08-21:base:0',
    frequency: 'weekly',
    availability: 'periodic',
    intervalDays: 7,
    limit: 1,
    repeatable: true
  });
}

testV0Migration();
testV1Migration();
testV2ActiveQuestProgressMigration();
testV2WithCanonicalQuestState();
testV2PartialCanonicalStateUsesLegacyProgress();
testV2PartialCanonicalStateWithoutLegacyRollsBack();
testUnknownCanonicalQuestRemainsRecoverable();
testV3AndLegacyEquipmentId();
testCorruptedSaveDoesNotChangeOriginal();
testSnapshotRetention();
testNoUndefinedExpansionInstallerCalls();
testTaskModelMigrationAndIdempotence();
testTaskAvailabilityFrequencies();
testRepeatableAndNonRepeatablePolicies();
testLegacyTaskWithoutFrequencyNeedsReview();
testHistoryEntryCapturesScheduleSnapshot();
console.log('Save migration fixtures: PASS (v0-v4, quest recovery, task history preservation, periodic availability, repeatable/non-repeatable policies, archived tasks, legacy task review, idempotence, corruption, snapshots, DT-17 static assertion)');