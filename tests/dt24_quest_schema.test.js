'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const test = require('node:test');
const vm = require('node:vm');

const engineSource = fs.readFileSync(require('node:path').join(__dirname, '..', 'engine.js'), 'utf8');

function createContext() {
  const storage = {
    values: new Map(),
    get length() { return this.values.size; },
    key(index) { return [...this.values.keys()][index] ?? null; },
    getItem(key) { return this.values.get(key) ?? null; },
    setItem(key, value) { this.values.set(String(key), String(value)); }
  };
  const context = {
    localStorage: storage,
    document: {
      readyState: 'complete',
      body: { appendChild() {} },
      getElementById() { return null; },
      createElement() { return { style: {}, setAttribute() {} }; }
    },
    console: { log() {}, warn() {}, error() {} },
    DEFAULT_TASKS: [],
    FREQ: {},
    QUESTS: {},
    window: {}
  };
  vm.createContext(context);
  vm.runInContext(engineSource, context, { filename: 'engine.js' });
  return context;
}

test('migrates a v4 save to the DT-24 quest schema without changing saveVersion', () => {
  const context = createContext();
  const state = context.migrateState({
    saveVersion: 4,
    name: 'Adventurer',
    quests: { active: [], completed: [], failed: [], dailyReset: null }
  });

  assert.equal(state.saveVersion, 4);
  assert.equal(state.questModelVersion, 2);
  assert.deepEqual({ ...state.quests.slotLimits }, { personal_project: 3, guild_order: 1 });
  assert.deepEqual([...state.quests.availableFollowUps], []);
  assert.deepEqual([...state.quests.derivedTasks], []);
});

test('normalization is idempotent and preserves valid quest progress data', () => {
  const context = createContext();
  const state = context.migrateState({ saveVersion: 4, quests: { active: [], completed: [], failed: [], dailyReset: null } });
  state.quests.active.push('quest_alpha');
  state.quests.quest_alpha = {
    currentStage: 0,
    stages: [{ id: 'stage_1', status: 'active', objectives: [{ id: 'objective_1', consumedCompletionIds: ['completion-1', 'completion-1'] }] }],
    derivedTaskIds: ['derived-1', 'derived-1']
  };
  state.quests.availableFollowUps = ['follow-up-alpha', 'follow-up-alpha'];
  state.quests.derivedTasks = [{ id: 'derived-1', sourceQuestId: 'quest_alpha', templateId: 'template-alpha', status: 'pending', taskHistory: [] }];

  const once = context.normalizeQuestPersistence(state);
  const snapshot = JSON.stringify(once);
  const twice = context.normalizeQuestPersistence(once);

  assert.equal(JSON.stringify(twice), snapshot);
  assert.deepEqual([...twice.quests.availableFollowUps], ['follow-up-alpha']);
  assert.deepEqual([...twice.quests.quest_alpha.stages[0].objectives[0].consumedCompletionIds], ['completion-1']);
  assert.deepEqual([...twice.quests.quest_alpha.derivedTaskIds], ['derived-1']);
});

test('invalid DT-24 collections receive safe defaults and remain recoverable', () => {
  const context = createContext();
  const state = context.migrateState({
    saveVersion: 4,
    quests: {
      active: [],
      completed: [],
      failed: [],
      dailyReset: null,
      slotLimits: { personal_project: -1, guild_order: 'invalid' },
      availableFollowUps: 'invalid',
      derivedTasks: [{ sourceQuestId: 'quest_alpha' }, 'unresolvable-entry']
    }
  });

  assert.deepEqual({ ...state.quests.slotLimits }, { personal_project: 3, guild_order: 1 });
  assert.deepEqual([...state.quests.availableFollowUps], []);
  assert.equal(state.quests.derivedTasks.length, 2);
  assert.equal(state.quests.derivedTasks[0].status, 'needs_review');
  assert.equal(state.quests.derivedTasks[1].status, 'needs_review');
  assert.ok(Object.prototype.hasOwnProperty.call(state.quests.derivedTasks[1], 'rawValue'));
});
