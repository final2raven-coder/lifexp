'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const path = require('node:path');

const root = path.join(__dirname, '..');
const engineSource = fs.readFileSync(`${root}/engine.js`, 'utf8');
const itemsSource = fs.readFileSync(`${root}/items.js`, 'utf8');
const inventorySource = fs.readFileSync(`${root}/inventory_system.js`, 'utf8');

class MemoryStorage {
  constructor(initial = {}) { this.values = new Map(Object.entries(initial)); }
  getItem(key) { return this.values.has(key) ? this.values.get(key) : null; }
  setItem(key, value) { this.values.set(String(key), String(value)); }
  removeItem(key) { this.values.delete(String(key)); }
  get length() { return this.values.size; }
  key(index) { return [...this.values.keys()][index] ?? null; }
}

function createDocument() {
  return {
    readyState: 'complete',
    body: { appendChild() {} },
    addEventListener() {},
    getElementById() { return null; },
    createElement() { return { style: {}, setAttribute() {}, textContent: '' }; }
  };
}

function createHarness(rawSave = null) {
  const storage = new MemoryStorage(rawSave === null ? {} : { lifexp_save: rawSave });
  const warnings = [];
  const context = {
    localStorage: storage,
    document: createDocument(),
    window: {},
    console: { warn(...args) { warnings.push(args.join(' ')); }, error() {}, log() {} },
    DEFAULT_TASKS: [],
    QUESTS: {},
    FREQ: {},
    STATS: { fue: true, vit: true, des: true, int: true, vol: true, pre: true },
    showToast() {}
  };
  context.globalThis = context;
  vm.createContext(context);
  vm.runInContext(itemsSource, context, { filename: 'items.js' });
  vm.runInContext(engineSource, context, { filename: 'engine.js' });
  vm.runInContext(inventorySource, context, { filename: 'inventory_system.js' });
  vm.runInContext(`globalThis.__a1 = {
    loadGame,
    state: () => gameState,
    addToContainer,
    removeFromContainer,
    moveBetweenContainers,
    interactions: window.LifeXPMaterialInteractions
  };`, context);
  assert.equal(context.__a1.loadGame(), true);
  return { context, api: context.__a1, storage, warnings };
}

function count(harness, container, itemId) {
  const entry = harness.api.state()[container].find(slot => slot.id === itemId);
  return entry ? entry.qty : 0;
}

function testStackingAndAtomicReservation() {
  const harness = createHarness();
  const { api } = harness;
  assert.equal(api.addToContainer('token_amistad', 'inventory', 2).success, true);
  assert.equal(api.addToContainer('token_amistad', 'inventory', 1).stacked, true);
  assert.equal(api.addToContainer('token_amistad', 'stash', 2).success, true);
  assert.equal(api.addToContainer('token_amistad', 'stash', 1).stacked, true);
  assert.equal(count(harness, 'inventory', 'token_amistad'), 3);
  assert.equal(count(harness, 'stash', 'token_amistad'), 3);
  assert.equal(api.moveBetweenContainers('token_amistad', 'stash', 'inventory', 1), true);
  assert.equal(count(harness, 'inventory', 'token_amistad'), 4);
  assert.equal(count(harness, 'stash', 'token_amistad'), 2);

  const reserved = api.interactions.reserve({
    id: 'test_multi_source',
    requirements: [{ itemId: 'token_amistad', quantity: 6 }],
    location: 'home'
  }, { location: 'home' }, { operationId: 'op_multi_source' });
  assert.equal(reserved.status, 'reserved');
  assert.deepEqual(JSON.parse(JSON.stringify(reserved.interaction.allocations)), [
    { itemId: 'token_amistad', container: 'inventory', quantity: 4, consume: true },
    { itemId: 'token_amistad', container: 'stash', quantity: 2, consume: true }
  ]);
  assert.equal(api.interactions.getReservedQuantity('token_amistad', 'inventory'), 4);
  assert.equal(api.interactions.getReservedQuantity('token_amistad', 'stash'), 2);
  assert.equal(api.removeFromContainer('token_amistad', 'inventory', 1).success, false);

  const second = api.interactions.reserve({
    id: 'test_insufficient',
    requirements: [{ itemId: 'token_amistad', quantity: 1 }],
    location: 'home'
  }, { location: 'home' }, { operationId: 'op_insufficient' });
  assert.equal(second.reason, 'insufficient_materials');
  assert.equal(api.interactions.getInteraction('op_insufficient'), null);
}

function testCommitAndIdempotence() {
  const harness = createHarness();
  const { api } = harness;
  api.addToContainer('token_amistad', 'inventory', 2);
  api.addToContainer('pluma_grifo', 'inventory', 1);
  const reserved = api.interactions.reserve({
    id: 'test_commit',
    requirements: [
      { itemId: 'token_amistad', quantity: 2 },
      { itemId: 'pluma_grifo', quantity: 1 }
    ],
    location: 'any'
  }, { location: 'away' }, { operationId: 'op_commit' });
  assert.equal(reserved.status, 'reserved');
  const committed = api.interactions.commit('op_commit', 'completion-1', { source: 'test' });
  assert.equal(committed.status, 'committed');
  assert.equal(count(harness, 'inventory', 'token_amistad'), 0);
  assert.equal(count(harness, 'inventory', 'pluma_grifo'), 0);
  const duplicate = api.interactions.commit('op_commit', 'completion-1');
  assert.equal(duplicate.status, 'committed');
  assert.equal(duplicate.duplicate, true);
}

function testLocationAndRetention() {
  const harness = createHarness();
  const { api } = harness;
  api.addToContainer('token_amistad', 'inventory', 1);
  api.addToContainer('token_amistad', 'stash', 1);
  const blocked = api.interactions.reserve({
    id: 'test_home_only',
    requirements: [{ itemId: 'token_amistad', quantity: 1 }],
    location: 'home'
  }, { location: 'away' }, { operationId: 'op_home_only' });
  assert.equal(blocked.reason, 'location_not_allowed');
  const retained = api.interactions.reserve({
    id: 'test_retain',
    requirements: [{ itemId: 'token_amistad', quantity: 2, consume: false }],
    location: 'home'
  }, { location: 'home' }, { operationId: 'op_retain' });
  assert.equal(retained.status, 'reserved');
  assert.equal(api.interactions.commit('op_retain', 'completion-retain').status, 'committed');
  assert.equal(count(harness, 'inventory', 'token_amistad'), 1);
  assert.equal(count(harness, 'stash', 'token_amistad'), 1);
}

function testRecoveryAndRelease() {
  const first = createHarness();
  first.api.addToContainer('token_amistad', 'inventory', 1);
  assert.equal(first.api.interactions.reserve({
    id: 'test_recovery',
    requirements: [{ itemId: 'token_amistad', quantity: 1 }],
    location: 'any'
  }, { location: 'away' }, { operationId: 'op_recovery' }).status, 'reserved');
  const persisted = first.storage.getItem('lifexp_save');
  const second = createHarness(persisted);
  const entry = second.api.interactions.getInteraction('op_recovery');
  assert.equal(entry.status, 'recoverable');
  assert.equal(entry.recoveryReason, 'previous_session_interrupted');
  assert.equal(count(second, 'inventory', 'token_amistad'), 1);
  assert.equal(second.api.interactions.release('op_recovery', 'release-1').status, 'released');
  assert.equal(second.api.interactions.release('op_recovery', 'release-1').duplicate, true);
}

function testDiscoveryAndValidation() {
  const harness = createHarness();
  const { api } = harness;
  assert.equal(api.interactions.discoverUse('token_amistad', 'future_event'), true);
  assert.equal(api.interactions.discoverUse('token_amistad', 'future_event'), false);
  assert.equal(api.interactions.reserve({
    id: 'test_invalid',
    requirements: [{ itemId: 'missing_material', quantity: 1 }]
  }, { location: 'any' }, { operationId: 'op_invalid' }).reason, 'invalid_requirement');
  assert.equal(api.interactions.getInteraction('op_invalid'), null);
}

testStackingAndAtomicReservation();
testCommitAndIdempotence();
testLocationAndRetention();
testRecoveryAndRelease();
testDiscoveryAndValidation();
console.log('Material interaction A1 tests passed.');
