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
  assert.equal(state.saveVersion, 3);
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
  assert.match(loaded.api.getSave(), /"saveVersion":3/);
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
console.log('Save migration fixtures: PASS (v0, v1, v2 legacy quests, v2 canonical quests, partial quests with legacy recovery, partial quests rollback, unknown canonical quest recovery, v3, legacy equipment id, corruption, snapshot retention, DT-17 static assertion)');
