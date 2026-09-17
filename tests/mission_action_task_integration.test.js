'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');
const vm = require('node:vm');

const engineSource = fs.readFileSync(path.join(__dirname, '..', 'engine.js'), 'utf8');

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
    document: { readyState: 'complete', body: { appendChild() {} }, getElementById() { return null; }, createElement() { return { style: {}, setAttribute() {} }; } },
    console: { log() {}, warn() {}, error() {} },
    DEFAULT_TASKS: [],
    FREQ: { once: { days: null, availability: { type: 'once', intervalDays: null, limit: 1, repeatable: false } } },
    QUESTS: {},
    window: {}
  };
  vm.createContext(context);
  vm.runInContext(engineSource, context, { filename: 'engine.js' });
  vm.runInContext(`
    lifeXPSaveLoadState = 'ready';
    gameState = cloneSaveState(DEFAULT_GAME_STATE);
    gameState.tasks = [];
    gameState.quests = {
      active: ['mission_alpha'], completed: [], failed: [],
      slotLimits: { personal_project: 3, guild_order: 1 },
      availableFollowUps: [], derivedTasks: [],
      mission_alpha: {
        status: 'active', currentNodeId: 'root', activeActionId: 'inspect_task',
        actions: [{ id: 'inspect_task', nodeId: 'root', status: 'in_progress', progress: 0, target: 1,
          criterion: { eventType: 'task_completed', derivedTaskId: 'derived_mission_alpha_inspect_task_template_clue' },
          consumedEventIds: [] }],
        routeNodes: [{ id: 'root', status: 'active', actionIds: ['inspect_task'] }],
        consumedEventIds: [], completedActionIds: [], discoveredRevealIds: [], consequenceClaims: {},
        recovery: { status: 'none', reason: null, options: [] }
      }
    };
    QUESTS.mission_alpha = { id: 'mission_alpha', rewards: {} };
    saveGame = ((original) => (options = {}) => original(options))(saveGame);
  `, context);
  return { context, storage };
}

test('accepted derived tasks materialize and advance through the canonical event resolver', () => {
  const { context } = createContext();
  const record = vm.runInContext(`createDerivedTask({
    id: 'template_clue', name: 'Inspect the clue', desc: 'Inspect the discovered clue in person.',
    cat: 'personal', freq: 'once', stats: { int: 10 }, xp: 20
  }, { sourceQuestId: 'mission_alpha', sourceActionId: 'inspect_task' })`, context);
  assert.equal(record.status, 'accepted');
  assert.equal(vm.runInContext("gameState.tasks.find(task => task.derivedTaskId === 'derived_mission_alpha_inspect_task_template_clue') !== undefined", context), true);

  assert.equal(vm.runInContext("updateMissionProgress('task_complete', { completionId: 'task:derived:1', taskId: 'derived_mission_alpha_inspect_task_template_clue', category: 'personal', derivedTaskId: 'derived_mission_alpha_inspect_task_template_clue', date: '2026-09-17' })", context), true);
  assert.equal(vm.runInContext("gameState.quests.mission_alpha.actions[0].status", context), 'completed');
  assert.equal(vm.runInContext("gameState.quests.derivedTasks[0].status", context), 'completed');
  assert.equal(vm.runInContext("gameState.quests.derivedTasks[0].taskHistory[0].completionId", context), 'task:derived:1');
  assert.equal(vm.runInContext("updateMissionProgress('task_completed', { completionId: 'task:derived:1', derivedTaskId: 'derived_mission_alpha_inspect_task_template_clue' })", context), false);
});

test('derived task reconciliation preserves unresolved records visibly', () => {
  const { context } = createContext();
  vm.runInContext(`gameState.quests.derivedTasks.push({
    id: 'derived_invalid', sourceQuestId: 'mission_alpha', sourceActionId: 'inspect_task',
    templateId: 'missing_template', status: 'accepted', taskHistory: []
  }); reconcileDerivedTasks();`, context);
  assert.equal(vm.runInContext("gameState.quests.derivedTasks[0].status", context), 'needs_review');
  assert.equal(vm.runInContext("gameState.quests.derivedTasks[0].reviewReason", context), 'invalid_task_definition');
  assert.equal(vm.runInContext("gameState.tasks.some(task => task.id === 'derived_invalid')", context), false);
});

test('transaction defers intermediate saves until forced commit', () => {
  const { context, storage } = createContext();
  vm.runInContext("localStorage.setItem('lifexp_save', 'before'); beginLifeXPTransaction(); saveGame();", context);
  assert.equal(storage.getItem('lifexp_save'), 'before');
  vm.runInContext("saveGame({ force: true }); endLifeXPTransaction();", context);
  assert.notEqual(storage.getItem('lifexp_save'), 'before');
});

console.log('Mission action task integration: PASS');
