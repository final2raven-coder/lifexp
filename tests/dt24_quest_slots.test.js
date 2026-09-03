'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const test = require('node:test');
const vm = require('node:vm');
const path = require('node:path');

const projectRoot = path.join(__dirname, '..');
const questsSource = fs.readFileSync(path.join(projectRoot, 'quests.js'), 'utf8');
const engineSource = fs.readFileSync(path.join(projectRoot, 'engine.js'), 'utf8');

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
    window: {}
  };
  vm.createContext(context);
  vm.runInContext(questsSource, context, { filename: 'quests.js' });
  vm.runInContext(engineSource, context, { filename: 'engine.js' });
  vm.runInContext(`
    saveGame = () => true;
    gameState = JSON.parse(JSON.stringify(DEFAULT_GAME_STATE));
    gameState.quests = {
      active: [], completed: [], failed: [], dailyReset: null,
      slotLimits: { personal_project: 3, guild_order: 1 },
      availableFollowUps: [], derivedTasks: []
    };
    QUESTS.test_personal_1 = { id: 'test_personal_1', name: 'Personal 1', repeatable: false };
    QUESTS.test_personal_2 = { id: 'test_personal_2', name: 'Personal 2', repeatable: false };
    QUESTS.test_personal_3 = { id: 'test_personal_3', name: 'Personal 3', repeatable: false };
    QUESTS.test_personal_4 = { id: 'test_personal_4', name: 'Personal 4', repeatable: false };
    QUESTS.test_guild_1 = { id: 'test_guild_1', name: 'Guild 1', origin: 'guild', repeatable: false };
    QUESTS.test_guild_2 = { id: 'test_guild_2', name: 'Guild 2', origin: 'guild', repeatable: false };
  `, context);
  return context;
}

test('accepts three personal projects and rejects a fourth', () => {
  const context = createContext();
  for (const questId of ['test_personal_1', 'test_personal_2', 'test_personal_3']) {
    assert.equal(vm.runInContext(`acceptQuest('${questId}').success`, context), true);
  }

  const result = vm.runInContext("acceptQuest('test_personal_4')", context);
  assert.equal(result.success, false);
  assert.equal(result.reason, 'slot_limit_reached');
  assert.equal(result.slotGroup, 'personal_project');
  assert.equal(vm.runInContext('gameState.quests.active.length', context), 3);
});

test('guild order has an independent single slot', () => {
  const context = createContext();
  for (const questId of ['test_personal_1', 'test_personal_2', 'test_personal_3']) {
    assert.equal(vm.runInContext(`acceptQuest('${questId}').success`, context), true);
  }

  const firstGuild = vm.runInContext("acceptQuest('test_guild_1')", context);
  assert.equal(firstGuild.success, true);
  assert.equal(vm.runInContext('gameState.quests.active.length', context), 4);
  assert.equal(vm.runInContext("getActiveQuestCountBySlotGroup('personal_project')", context), 3);
  assert.equal(vm.runInContext("getActiveQuestCountBySlotGroup('guild_order')", context), 1);

  const secondGuild = vm.runInContext("acceptQuest('test_guild_2')", context);
  assert.equal(secondGuild.success, false);
  assert.equal(secondGuild.reason, 'slot_limit_reached');
  assert.equal(secondGuild.slotGroup, 'guild_order');
  assert.equal(vm.runInContext('gameState.quests.active.length', context), 4);
});
