'use strict';

const assert = require('node:assert/strict');
const { test } = require('node:test');
const fs = require('node:fs');
const vm = require('node:vm');
const path = require('node:path');

const root = path.join(__dirname, '..');
const engineSource = fs.readFileSync(path.join(root, 'engine.js'), 'utf8');
const questsSource = fs.readFileSync(path.join(root, 'quests.js'), 'utf8');
const combatSource = fs.readFileSync(path.join(root, 'combat.js'), 'utf8');
const itemSystemSource = fs.readFileSync(path.join(root, 'item_system.js'), 'utf8');

function createBaseContext(overrides = {}) {
  const storage = {
    values: new Map(),
    getItem(key) { return this.values.get(String(key)) ?? null; },
    setItem(key, value) { this.values.set(String(key), String(value)); },
    removeItem(key) { this.values.delete(String(key)); },
    get length() { return this.values.size; },
    key(index) { return [...this.values.keys()][index] ?? null; }
  };
  const context = {
    localStorage: storage,
    document: {
      readyState: 'complete',
      body: { appendChild() {} },
      addEventListener() {},
      getElementById() { return null; },
      createElement() { return { style: {}, setAttribute() {}, textContent: '' }; }
    },
    window: {},
    console: { log() {}, warn() {}, error() {} },
    DEFAULT_TASKS: [],
    FREQ: {},
    QUESTS: {},
    STATS: {
      fue: { abbr: 'FUE' }, vit: { abbr: 'VIT' }, des: { abbr: 'DES' },
      int: { abbr: 'INT' }, vol: { abbr: 'VOL' }, pre: { abbr: 'PRE' }
    },
    ...overrides
  };
  vm.createContext(context);
  return context;
}

function run(context, source) {
  return vm.runInContext(source, context);
}

test('addXp emits one deterministic level event for every level crossed', () => {
  const events = [];
  const context = createBaseContext({
    gameState: { level: 1, xp: 0, stats: {}, classId: null, classLevel: 0 },
    updateQuestProgress(eventType, data) { events.push({ eventType, data }); }
  });
  run(context, engineSource);

  run(context, 'addXp(250)');

  assert.equal(events.length, 2);
  assert.deepEqual(events.map(event => event.eventType), ['level_up', 'level_up']);
  assert.equal(JSON.stringify(events.map(event => event.data)), JSON.stringify([
    { level: 2, completionId: 'level:2' },
    { level: 3, completionId: 'level:3' }
  ]));
});

test('successful equipment emits one deterministic item event after the transaction', () => {
  const events = [];
  const context = createBaseContext({
    ITEMS: {
      test_blade: {
        id: 'test_blade', type: 'weapon', requirements: {}, attunement: { required: false }
      }
    },
    ITEM_TYPE: { weapon: { slot: 'weapon' } },
    gameState: {
      equipment: { weapon: null, armor: null, accessory1: null, accessory2: null },
      inventory: [{ id: 'test_blade', qty: 1 }],
      itemSystem: {}
    },
    getEquipmentStats() { return {}; },
    removeFromInventory(itemId) {
      const index = context.gameState.inventory.findIndex(slot => slot.id === itemId);
      if (index < 0) return false;
      context.gameState.inventory.splice(index, 1);
      return true;
    },
    addToInventory() { return true; },
    saveGame() {},
    updateQuestProgress(eventType, data) { events.push({ eventType, data }); }
  });
  run(context, itemSystemSource);

  assert.equal(run(context, "equipItem('test_blade')"), true);
  assert.equal(JSON.stringify(events), JSON.stringify([{
    eventType: 'item_equipped',
    data: { itemId: 'test_blade', slot: 'weapon', completionId: 'equipment:test_blade:weapon' }
  }]));
  assert.equal(context.gameState.equipment.weapon, 'test_blade');
});

test('combat victory emits enemy and boss events with stable instance claims', () => {
  const events = [];
  const context = createBaseContext({
    gameState: {
      level: 1,
      xp: 0,
      gold: 0,
      stats: { fue: 10, vit: 10, des: 10, int: 10, vol: 10, pre: 10 },
      equipment: {}
    },
    getDerivedStats() { return { fue: 10, vit: 10, des: 10, int: 10, vol: 10, pre: 10 }; },
    updateQuestProgress(eventType, data) { events.push({ eventType, data }); }
  });
  run(context, combatSource);

  run(context, `
    initCombat([
      { id: 'enemy_a', name: 'Enemy A', type: 'common', level: 1, hp: 1, xp: 1, gold: 1, drops: [] },
      { id: 'boss_a', name: 'Boss A', type: 'boss', level: 1, hp: 1, xp: 1, gold: 1, drops: [] }
    ]);
    combatState.formation.members.forEach(member => { member.hp = 0; });
    combatState.phase = 'victory';
    calculateCombatRewards();
  `);

  assert.deepEqual(events.map(event => event.eventType), ['enemy_defeated', 'boss_defeated']);
  assert.equal(events[0].data.enemyId, 'enemy_a');
  assert.match(events[0].data.completionId, /^combat:encounter:\d+:1:defeat:enemy_a:1$/);
  assert.equal(events[1].data.enemyId, 'boss_a');
  assert.equal(events[1].data.completionId, events[0].data.completionId.replace('defeat:enemy_a:1', 'defeat:boss_a:2'));
});

test('all five staged objective types accept their canonical event contract', () => {
  const context = createBaseContext();
  run(context, questsSource);
  run(context, engineSource);
  run(context, `
    gameState = migrateState({
      saveVersion: 4,
      quests: {
        active: ['quest_all_events'], completed: [], failed: [], dailyReset: null,
        quest_all_events: {
          status: 'active', currentStage: 0,
          stages: [{ id: 'stage_1', status: 'active', objectives: [
            { id: 'task', type: 'complete_tasks', category: 'casa', count: 1, progress: 0, consumedCompletionIds: [] },
            { id: 'enemy', type: 'defeat_enemy', enemyId: 'enemy_a', count: 1, progress: 0, consumedCompletionIds: [] },
            { id: 'boss', type: 'defeat_boss', enemyId: 'boss_a', count: 1, progress: 0, consumedCompletionIds: [] },
            { id: 'level', type: 'reach_level', level: 4, progress: 0, consumedCompletionIds: [] },
            { id: 'item', type: 'equip_item', itemId: 'blade_a', count: 1, progress: 0, consumedCompletionIds: [] }
          ] }]
        }
      }
    });
    initQuestState();
    updateQuestProgress('task_completed', { category: 'casa', completionId: 'task:1' });
    updateQuestProgress('enemy_defeated', { enemyId: 'enemy_a', completionId: 'combat:1' });
    updateQuestProgress('boss_defeated', { enemyId: 'boss_a', completionId: 'combat:2' });
    updateQuestProgress('level_up', { level: 4, completionId: 'level:4' });
    updateQuestProgress('item_equipped', { itemId: 'blade_a', completionId: 'equipment:blade_a:weapon' });
  `);

  const quest = JSON.parse(run(context, 'JSON.stringify(gameState.quests.quest_all_events)'));
  assert.equal(quest.status, 'completed');
  assert.equal(quest.currentStage, null);
  assert.deepEqual(quest.stages[0].objectives.map(objective => objective.completed), [true, true, true, true, true]);
});
