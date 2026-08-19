'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const update2Source = fs.readFileSync(path.join(__dirname, '..', 'update2_content.js'), 'utf8');

class MemoryStorage {
  constructor(initial = {}) {
    this.values = new Map(Object.entries(initial));
  }

  getItem(key) { return this.values.has(key) ? this.values.get(key) : null; }
  setItem(key, value) { this.values.set(String(key), String(value)); }
  removeItem(key) { this.values.delete(String(key)); }
}

function createDocument() {
  return {
    readyState: 'complete',
    body: { appendChild() {} },
    getElementById() { return null; },
    createElement() {
      return { style: {}, setAttribute() {}, textContent: '' };
    }
  };
}

function createContext(options = {}) {
  const storage = new MemoryStorage({ lifexp_save: options.rawSave || '{"player":"before"}' });
  const errors = [];
  const saveCalls = [];
  const context = {
    localStorage: storage,
    document: createDocument(),
    window: { LifeXPInventory: {} },
    console: { error() {}, warn() {} },
    showToast(message) { errors.push(String(message)); },
    ITEMS: { base_item: { id: 'base_item' } },
    ENEMIES: { base_enemy: { id: 'base_enemy' } },
    QUESTS: { daily_any_3: { name: 'Original quest' } },
    DEFAULT_TASKS: [{ id: 'base_task' }],
    DROP_TABLES: { base_theme: ['base_item'] },
    THEME_ENEMIES: { base_theme: ['base_enemy'] },
    EXPANSION_ITEMS_V1: { update_item: { id: 'update_item' } },
    EXPANSION_DROP_TABLES_V1: { update_theme: ['update_item'] },
    EXPANSION_ENEMIES_V1: { update_enemy: { id: 'update_enemy' } },
    EXPANSION_QUESTS_V1: { update_quest: { id: 'update_quest', name: 'Update quest' } },
    EXPANSION_TASKS_V1: [{ id: 'update_task' }],
    gameState: {
      inventory: [{ id: 'existing_item', qty: 2 }],
      stash: [],
      equipment: { weapon: null },
      customState: { preserved: true }
    }
  };
  context.globalThis = context;
  context.saveGame = () => {
    saveCalls.push(true);
    if (!options.writeSave) return;
    context.localStorage.setItem('lifexp_save', JSON.stringify(context.gameState));
  };
  context.installExpansionItems = () => {
    Object.assign(context.ITEMS, context.EXPANSION_ITEMS_V1);
    Object.assign(context.DROP_TABLES, context.EXPANSION_DROP_TABLES_V1);
  };
  context.installExpansionEnemies = () => {
    Object.assign(context.ENEMIES, context.EXPANSION_ENEMIES_V1);
    if (options.failInstaller === 'enemies') throw new Error('synthetic enemy installer failure');
  };
  context.installExpansionQuests = () => {
    Object.assign(context.QUESTS, context.EXPANSION_QUESTS_V1);
  };
  context.installExpansionTasks = () => {
    context.DEFAULT_TASKS.push(...context.EXPANSION_TASKS_V1);
  };
  context.renderQuests = () => {
    if (options.failAfterInstall === 'quests') throw new Error('synthetic quest render failure');
  };
  context.renderInventory = () => {};
  if (options.invalidRewardReference === 'task') {
    context.EXPANSION_TASKS_V1 = [{
      id: 'update_task',
      drops: { theme: 'update_theme', items: ['missing_item'] }
    }];
  }
  if (options.invalidRewardReference === 'sideQuestArray') {
    context.DEFAULT_TASKS[0].sideQuest = { drops: ['missing_item'] };
  }
  if (options.invalidRewardReference === 'sideQuestObject') {
    context.EXPANSION_TASKS_V1 = [{
      id: 'update_task',
      sideQuest: { drops: { theme: 'base_theme', items: ['missing_item'] } }
    }];
  }
  if (options.invalidRewardReference === 'enemy') {
    context.EXPANSION_ENEMIES_V1 = { update_enemy: { id: 'update_enemy', drops: [{ itemId: 'missing_item' }] } };
  }
  if (options.invalidRewardReference === 'dropTable') {
    context.EXPANSION_DROP_TABLES_V1 = { update_theme: ['missing_item'] };
  }
  if (options.invalidRewardReference === 'questReward') {
    context.EXPANSION_QUESTS_V1 = {
      update_quest: { id: 'update_quest', name: 'Update quest', reward: { items: ['missing_item'] } }
    };
  }
  if (options.invalidRewardReference === 'chapterReward') {
    context.EXPANSION_QUESTS_V1 = {
      update_quest: {
        id: 'update_quest',
        name: 'Update quest',
        chapters: [{ id: 'chapter_one', rewards: { items: ['missing_item'] } }]
      }
    };
  }
  vm.createContext(context);
  return { context, storage, errors, saveCalls };
}

function runUpdate(harness) {
  vm.runInContext(update2Source, harness.context, { filename: 'update2_content.js' });
}

function snapshot(harness) {
  const { context } = harness;
  return JSON.stringify({
    ITEMS: context.ITEMS,
    ENEMIES: context.ENEMIES,
    QUESTS: context.QUESTS,
    DEFAULT_TASKS: context.DEFAULT_TASKS,
    DROP_TABLES: context.DROP_TABLES,
    THEME_ENEMIES: context.THEME_ENEMIES,
    EXPANSION_ITEMS_V1: context.EXPANSION_ITEMS_V1,
    EXPANSION_DROP_TABLES_V1: context.EXPANSION_DROP_TABLES_V1,
    EXPANSION_ENEMIES_V1: context.EXPANSION_ENEMIES_V1,
    EXPANSION_QUESTS_V1: context.EXPANSION_QUESTS_V1,
    EXPANSION_TASKS_V1: context.EXPANSION_TASKS_V1,
    gameState: context.gameState
  });
}

function makeSuccessfulInstallers(harness) {
  const { context } = harness;
  context.installExpansionEnemies = () => {
    Object.assign(context.ENEMIES, context.EXPANSION_ENEMIES_V1);
  };
  context.renderQuests = () => {};
}

function testSuccessfulInstallationAndIdempotence() {
  const harness = createContext({ writeSave: true });
  const calls = [];
  for (const name of ['installExpansionItems', 'installExpansionEnemies', 'installExpansionQuests', 'installExpansionTasks']) {
    const original = harness.context[name];
    harness.context[name] = () => { calls.push(name); original(); };
  }

  runUpdate(harness);
  const firstState = snapshot(harness);
  const firstSave = harness.storage.getItem('lifexp_save');

  assert.deepEqual(calls, [
    'installExpansionItems',
    'installExpansionEnemies',
    'installExpansionQuests',
    'installExpansionTasks'
  ]);
  assert.equal(harness.context.gameState.__lifexpUpdate2, 'lifexp_update2_ashbrand_quests');
  assert.equal(harness.context.ITEMS.update_item.id, 'update_item');
  assert.equal(harness.context.ITEMS.cuchilla_llameante.id, 'cuchilla_llameante');
  assert.equal(harness.context.ENEMIES.update_enemy.id, 'update_enemy');
  assert.equal(harness.context.QUESTS.update_quest.setting, 'The frontier changes whenever a keeper chooses to move.');
  assert.equal(harness.context.DEFAULT_TASKS.filter(task => task.id === 'update_task').length, 1);
  assert.equal(harness.saveCalls.length, 1);
  assert.equal(firstSave, JSON.stringify(harness.context.gameState));

  runUpdate(harness);
  assert.equal(harness.saveCalls.length, 1);
  assert.equal(snapshot(harness), firstState);
  assert.equal(harness.storage.getItem('lifexp_update2_backup'), '{"player":"before"}');
}

function testInstallerFailureRollsBackAndCanRetry() {
  const harness = createContext({ writeSave: true, failInstaller: 'enemies' });
  const before = snapshot(harness);
  const rawBefore = harness.storage.getItem('lifexp_save');

  runUpdate(harness);

  assert.equal(snapshot(harness), before);
  assert.equal(harness.storage.getItem('lifexp_save'), rawBefore);
  assert.equal(harness.context.gameState.__lifexpUpdate2, undefined);
  assert.equal(harness.saveCalls.length, 0);
  assert.equal(harness.storage.getItem('lifexp_update2_backup'), rawBefore);
  assert.equal(harness.errors.length, 1);
  assert.match(harness.errors[0], /synthetic enemy installer failure/);

  makeSuccessfulInstallers(harness);
  runUpdate(harness);
  assert.equal(harness.context.gameState.__lifexpUpdate2, 'lifexp_update2_ashbrand_quests');
  assert.equal(harness.context.DEFAULT_TASKS.filter(task => task.id === 'update_task').length, 1);
  assert.equal(harness.saveCalls.length, 1);
}

function testPostInstallFailureRollsBack() {
  const harness = createContext({ writeSave: true, failAfterInstall: 'quests' });
  const before = snapshot(harness);
  const rawBefore = harness.storage.getItem('lifexp_save');

  runUpdate(harness);

  assert.equal(snapshot(harness), before);
  assert.equal(harness.storage.getItem('lifexp_save'), rawBefore);
  assert.equal(harness.context.gameState.__lifexpUpdate2, undefined);
  assert.equal(harness.saveCalls.length, 0);
  assert.equal(harness.errors.length, 1);
  assert.match(harness.errors[0], /synthetic quest render failure/);
}

function testRewardReferenceValidationRollsBackEveryDropShape() {
  const cases = [
    ['task', 'TASKS["update_task"].drops.items'],
    ['sideQuestArray', 'TASKS["base_task"].sideQuest.drops'],
    ['sideQuestObject', 'TASKS["update_task"].sideQuest.drops.items'],
    ['enemy', 'ENEMIES["update_enemy"].drops[0].itemId'],
    ['dropTable', 'DROP_TABLES["update_theme"]'],
    ['questReward', 'QUESTS["update_quest"].reward.items'],
    ['chapterReward', 'QUESTS["update_quest"].chapters[chapter_one].rewards.items']
  ];

  for (const [invalidRewardReference, contextLabel] of cases) {
    const harness = createContext({ writeSave: true, invalidRewardReference });
    const before = snapshot(harness);
    const rawBefore = harness.storage.getItem('lifexp_save');

    runUpdate(harness);

    assert.equal(snapshot(harness), before, contextLabel);
    assert.equal(harness.storage.getItem('lifexp_save'), rawBefore, contextLabel);
    assert.equal(harness.context.gameState.__lifexpUpdate2, undefined, contextLabel);
    assert.equal(harness.saveCalls.length, 0, contextLabel);
    assert.equal(harness.errors.length, 1, contextLabel);
    assert.match(harness.errors[0], /Reward reference validation failed/, contextLabel);
    assert.match(harness.errors[0], /missing_item/, contextLabel);
  }
}

testSuccessfulInstallationAndIdempotence();
testInstallerFailureRollsBackAndCanRetry();
testPostInstallFailureRollsBack();
testRewardReferenceValidationRollsBackEveryDropShape();
console.log('Update 2 transaction fixtures: PASS (success, reward reference validation, four installers, save commit, rollback, retry, idempotence)');