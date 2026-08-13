// LifeXP Update 2 - additive, idempotent content installation.
(function () {
  'use strict';

  const UPDATE_ID = 'lifexp_update2_ashbrand_quests';
  const ASHBRAND_ID = 'cuchilla_llameante';

  const ASHBRAND = {
    id: ASHBRAND_ID,
    name: 'Ashbrand',
    type: 'weapon',
    rarity: 'rare',
    icon: 'FIRE',
    desc: 'A short sword taken from a shrine after the fire had gone out. The blade is warm. It does not glow.',
    lore: 'Ashbrand remembers a fire that refused to become a ruin.',
    stats: {},
    value: 120,
    themes: ['fuego', 'fuego_comida', 'ash'],
    effects: [
      { id: 'burning_edge', name: 'Burning Edge', trigger: 'passive', unlockStage: 1, description: 'Attacks can apply Burn for 3 turns.' },
      { id: 'pressure', name: 'Pressure', trigger: 'passive', unlockStage: 3, activationRequired: true, description: 'A burning target can receive another, shorter Burn.' }
    ],
    attunement: {
      required: true,
      max: 3,
      minimumStage: 1,
      themes: ['fuego', 'fuego_comida', 'ash'],
      stages: ['The grip is cold.', 'The edge holds its heat.', 'The old fire answers your hand.']
    }
  };

  const QUEST_PATCHES = {
    daily_any_3: { name: 'The Threefold Ember', desc: 'Three small flames must answer before the watch can begin.', setting: 'The refuge keeps one ember alive for every path you tend.', lore: 'Old wardens never spoke of grand victories. They counted the lights that remained lit.' },
    daily_casa_2: { name: 'The Quiet Hearth', desc: 'Restore two corners of the refuge before the evening bell.', setting: 'Dust gathers where the refuge walls meet, hiding marks left by former keepers.', lore: 'A clean hearth is not empty. It is a promise that someone intends to return.' },
    daily_cuerpo_2: { name: 'The Travellers Readiness', desc: 'Strengthen the body before the road asks for its price.', setting: 'Beyond the last gate, the old road climbs without shelter or easy ground.', lore: 'The road does not care how strong you meant to become. It remembers only what you carried.' },
    quest_first_steps: { name: 'The First Watch', desc: 'Take your place at the refuge wall and answer the first sign.', setting: 'The refuge stands at the edge of a road no map records twice.', lore: 'The first watch is rarely remembered for what it reveals. It is remembered because someone stayed.' },
    quest_home_master: { name: 'Keeper of the Refuge', desc: 'Restore the refuge until every neglected corner can hold a light.', setting: 'The refuge has survived many hands, but none of them left the same marks.', lore: 'Shelter is an active spell. Its strength is renewed by hands that notice what others miss.' },
    quest_body_temple: { name: 'The Body as a Compass', desc: 'Prepare the vessel that will carry you beyond the familiar roads.', setting: 'The northern passes measure every traveller by breath, balance and endurance.', lore: 'A compass can point the way. Only a prepared body can follow it.' },
    bounty_slimes: { name: 'The Pipe Mire Brood', desc: 'Drive the hungry things from the channels beneath the refuge.', setting: 'Something soft and bright has begun moving through the pipes at night.', lore: 'The mire feeds on what is ignored. It grows quiet whenever a lantern approaches.' },
    bounty_bandits: { name: 'Knives on the Old Road', desc: 'Break the hold of the road thieves before the next caravan arrives.', setting: 'The old road narrows between broken markers where travellers vanish from sight.', lore: 'Every toll begins as a request made by someone who believes no one will answer.' },
    story_wolf_hills: { name: 'The Wolf Above the Hills', desc: 'Follow the night borne signs and face what has claimed the high ground.', setting: 'The hills have gone silent after dusk, as though the wind itself is listening.', lore: 'The oldest tracks are not always the largest. Some creatures learn to make fear walk ahead of them.' },
    class_warrior_berserker: { name: 'The Red Path', desc: 'Prove that force can be guided without being extinguished.', setting: 'The Red Path opens only where discipline and fury meet without either yielding.', lore: 'A berserker is not a storm without a sky. The hardest lesson is choosing where the lightning lands.' }
  };

  function assertExpansionLoadOrder() {
    const requiredGlobals = [
      ['localStorage', typeof localStorage !== 'undefined' && localStorage && typeof localStorage.getItem === 'function'],
      ['gameState', typeof gameState !== 'undefined' && gameState && typeof gameState === 'object'],
      ['ITEMS', typeof ITEMS !== 'undefined' && ITEMS && typeof ITEMS === 'object' && !Array.isArray(ITEMS)],
      ['ENEMIES', typeof ENEMIES !== 'undefined' && ENEMIES && typeof ENEMIES === 'object' && !Array.isArray(ENEMIES)],
      ['QUESTS', typeof QUESTS !== 'undefined' && QUESTS && typeof QUESTS === 'object' && !Array.isArray(QUESTS)],
      ['DEFAULT_TASKS', typeof DEFAULT_TASKS !== 'undefined' && Array.isArray(DEFAULT_TASKS)],
      ['DROP_TABLES', typeof DROP_TABLES !== 'undefined' && DROP_TABLES && typeof DROP_TABLES === 'object'],
      ['THEME_ENEMIES', typeof THEME_ENEMIES !== 'undefined' && THEME_ENEMIES && typeof THEME_ENEMIES === 'object'],
      ['EXPANSION_ITEMS_V1', typeof EXPANSION_ITEMS_V1 !== 'undefined' && EXPANSION_ITEMS_V1 && typeof EXPANSION_ITEMS_V1 === 'object'],
      ['EXPANSION_ENEMIES_V1', typeof EXPANSION_ENEMIES_V1 !== 'undefined' && EXPANSION_ENEMIES_V1 && typeof EXPANSION_ENEMIES_V1 === 'object'],
      ['EXPANSION_QUESTS_V1', typeof EXPANSION_QUESTS_V1 !== 'undefined' && EXPANSION_QUESTS_V1 && typeof EXPANSION_QUESTS_V1 === 'object'],
      ['EXPANSION_TASKS_V1', typeof EXPANSION_TASKS_V1 !== 'undefined' && Array.isArray(EXPANSION_TASKS_V1)],
      ['installExpansionItems', typeof installExpansionItems === 'function'],
      ['installExpansionEnemies', typeof installExpansionEnemies === 'function'],
      ['installExpansionQuests', typeof installExpansionQuests === 'function'],
      ['installExpansionTasks', typeof installExpansionTasks === 'function'],
      ['saveGame', typeof saveGame === 'function']
    ];
    const missing = requiredGlobals.filter(([, present]) => !present).map(([name]) => name);
    if (missing.length > 0) {
      throw new Error(`Update 2 load-order assertion failed; missing globals: ${missing.join(', ')}.`);
    }
  }

  function assertExpansionInstalled() {
    const missingItems = Object.keys(EXPANSION_ITEMS_V1).filter(id => !Object.prototype.hasOwnProperty.call(ITEMS, id));
    const missingEnemies = Object.keys(EXPANSION_ENEMIES_V1).filter(id => !Object.prototype.hasOwnProperty.call(ENEMIES, id));
    const missingQuests = Object.keys(EXPANSION_QUESTS_V1).filter(id => !Object.prototype.hasOwnProperty.call(QUESTS, id));
    const installedTaskIds = new Set(DEFAULT_TASKS.map(task => task && task.id));
    const missingTasks = EXPANSION_TASKS_V1.filter(task => task && !installedTaskIds.has(task.id)).map(task => task.id || '<unknown>');
    const missingInstallations = [
      missingItems.length > 0 ? `items: ${missingItems.join(', ')}` : '',
      missingEnemies.length > 0 ? `enemies: ${missingEnemies.join(', ')}` : '',
      missingQuests.length > 0 ? `quests: ${missingQuests.join(', ')}` : '',
      missingTasks.length > 0 ? `tasks: ${missingTasks.join(', ')}` : ''
    ].filter(Boolean);
    if (missingInstallations.length > 0) {
      throw new Error(`Expansion installers did not install all declared content: ${missingInstallations.join('; ')}.`);
    }
  }

  function reportInstallFailure(error) {
    const message = `Official content could not be loaded safely. ${error instanceof Error ? error.message : String(error)}`;
    console.error(message);
    if (typeof showToast === 'function') {
      showToast(message, 'error');
      return;
    }
    if (typeof document !== 'undefined' && document.body) {
      let banner = document.getElementById('lifexp-content-load-error');
      if (!banner) {
        banner = document.createElement('div');
        banner.id = 'lifexp-content-load-error';
        banner.setAttribute('role', 'alert');
        banner.style.cssText = 'position:fixed;left:16px;right:16px;bottom:16px;z-index:99999;padding:14px 16px;background:#7f1d1d;color:#fff;border:2px solid #fecaca;border-radius:8px;font:600 14px/1.4 sans-serif;';
        document.body.appendChild(banner);
      }
      banner.textContent = message;
    }
  }

  function backupBeforeMutation(raw) {
    if (!raw) return;
    try {
      if (!localStorage.getItem('lifexp_update2_backup')) {
        localStorage.setItem('lifexp_update2_backup', raw);
        localStorage.setItem('lifexp_update2_backup_time', new Date().toISOString());
      }
    } catch (error) {
      throw new Error(`Update 2 backup unavailable: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  function cloneValue(value) {
    if (value === undefined) return undefined;
    return JSON.parse(JSON.stringify(value));
  }

  function captureMutableTarget(snapshots, name, target) {
    if (target && typeof target === 'object') snapshots.push({ name, target, value: cloneValue(target) });
  }

  function captureTransactionSnapshot() {
    const snapshots = [];
    if (typeof ITEMS !== 'undefined') captureMutableTarget(snapshots, 'ITEMS', ITEMS);
    if (typeof ENEMIES !== 'undefined') captureMutableTarget(snapshots, 'ENEMIES', ENEMIES);
    if (typeof QUESTS !== 'undefined') captureMutableTarget(snapshots, 'QUESTS', QUESTS);
    if (typeof DEFAULT_TASKS !== 'undefined') captureMutableTarget(snapshots, 'DEFAULT_TASKS', DEFAULT_TASKS);
    if (typeof DROP_TABLES !== 'undefined') captureMutableTarget(snapshots, 'DROP_TABLES', DROP_TABLES);
    if (typeof THEME_ENEMIES !== 'undefined') captureMutableTarget(snapshots, 'THEME_ENEMIES', THEME_ENEMIES);
    if (typeof EXPANSION_ITEMS_V1 !== 'undefined') captureMutableTarget(snapshots, 'EXPANSION_ITEMS_V1', EXPANSION_ITEMS_V1);
    if (typeof EXPANSION_DROP_TABLES_V1 !== 'undefined') captureMutableTarget(snapshots, 'EXPANSION_DROP_TABLES_V1', EXPANSION_DROP_TABLES_V1);
    if (typeof EXPANSION_ENEMIES_V1 !== 'undefined') captureMutableTarget(snapshots, 'EXPANSION_ENEMIES_V1', EXPANSION_ENEMIES_V1);
    if (typeof EXPANSION_QUESTS_V1 !== 'undefined') captureMutableTarget(snapshots, 'EXPANSION_QUESTS_V1', EXPANSION_QUESTS_V1);
    if (typeof EXPANSION_TASKS_V1 !== 'undefined') captureMutableTarget(snapshots, 'EXPANSION_TASKS_V1', EXPANSION_TASKS_V1);
    return {
      rawSave: localStorage.getItem('lifexp_save'),
      stateTarget: typeof gameState !== 'undefined' && gameState && typeof gameState === 'object' ? gameState : null,
      state: typeof gameState !== 'undefined' && gameState && typeof gameState === 'object' ? cloneValue(gameState) : null,
      catalogs: snapshots
    };
  }

  function restoreMutableTarget(snapshot) {
    const target = snapshot.target;
    const value = cloneValue(snapshot.value);
    if (Array.isArray(target)) {
      target.splice(0, target.length, ...value);
      return;
    }
    Object.keys(target).forEach(key => delete target[key]);
    Object.assign(target, value);
  }

  function rollbackTransaction(snapshot) {
    const errors = [];
    for (const catalog of snapshot.catalogs) {
      try { restoreMutableTarget(catalog); } catch (error) { errors.push(`${catalog.name}: ${error.message}`); }
    }
    if (snapshot.stateTarget && snapshot.state) {
      try { restoreMutableTarget({ target: snapshot.stateTarget, value: snapshot.state }); } catch (error) { errors.push(`gameState: ${error.message}`); }
    }
    try {
      if (snapshot.rawSave === null) localStorage.removeItem('lifexp_save');
      else localStorage.setItem('lifexp_save', snapshot.rawSave);
    } catch (error) {
      errors.push(`lifexp_save: ${error instanceof Error ? error.message : String(error)}`);
    }
    return errors.length > 0 ? new Error(`Update 2 rollback failed (${errors.join('; ')}).`) : null;
  }

  function ensureContainer(container, id, qty) {
    if (!Array.isArray(container)) return false;
    const found = container.find(slot => slot && slot.id === id);
    if (found) { found.qty = Math.max(1, Number(found.qty || 1)); return false; }
    container.push({ id, qty: qty || 1, obtainedAt: new Date().toISOString().slice(0, 10) });
    return true;
  }

  function restoreAshbrand() {
    if (typeof ITEMS === 'undefined' || typeof gameState === 'undefined') return false;
    Object.assign(ITEMS, { [ASHBRAND_ID]: { ...(ITEMS[ASHBRAND_ID] || {}), ...ASHBRAND, stats: {}, rarity: ASHBRAND.rarity } });
    gameState.inventory = Array.isArray(gameState.inventory) ? gameState.inventory : [];
    gameState.stash = Array.isArray(gameState.stash) ? gameState.stash : [];
    if (typeof window.LifeXPInventory?.recoverItemIfLost === 'function') {
      window.LifeXPInventory.recoverItemIfLost(ASHBRAND_ID, { legacyIds: ['ashbrand', 'Ashbrand'], alwaysRestore: true });
    }
    if (gameState.equipment) Object.keys(gameState.equipment).forEach(slot => { if (['ashbrand', 'Ashbrand'].includes(gameState.equipment[slot])) gameState.equipment[slot] = ASHBRAND_ID; });
    return true;
  }

  function patchQuests() {
    if (typeof QUESTS === 'undefined') return;
    for (const [id, patch] of Object.entries(QUEST_PATCHES)) if (QUESTS[id]) Object.assign(QUESTS[id], patch);
    if (typeof EXPANSION_QUESTS_V1 !== 'undefined') for (const [id, quest] of Object.entries(EXPANSION_QUESTS_V1)) {
      if (!QUESTS[id]) QUESTS[id] = quest;
      if (QUESTS[id] && !QUESTS[id].setting) {
        QUESTS[id].setting = 'The frontier changes whenever a keeper chooses to move.';
        QUESTS[id].lore = 'Small acts leave marks that remain after the traveller has gone.';
      }
    }
  }

  function commitSave() {
    const expectedSave = JSON.stringify(gameState);
    saveGame();
    if (localStorage.getItem('lifexp_save') !== expectedSave) {
      throw new Error('Update 2 save commit could not be verified.');
    }
  }

  function install() {
    if (typeof gameState !== 'undefined' && gameState.__lifexpUpdate2 === UPDATE_ID) return;
    const transaction = captureTransactionSnapshot();
    try {
      assertExpansionLoadOrder();
      backupBeforeMutation(transaction.rawSave);
      installExpansionItems();
      installExpansionEnemies();
      installExpansionQuests();
      installExpansionTasks();
      assertExpansionInstalled();
      restoreAshbrand();
      patchQuests();
      gameState.__lifexpUpdate2 = UPDATE_ID;
      if (typeof renderQuests === 'function') renderQuests();
      if (typeof renderInventory === 'function') renderInventory();
      commitSave();
    } catch (error) {
      const rollbackError = rollbackTransaction(transaction);
      if (rollbackError) reportInstallFailure(new Error(`${error instanceof Error ? error.message : String(error)} ${rollbackError.message}`));
      else reportInstallFailure(error);
    }
  }

  // DT-11 resolved: window.LifeXPUpdate2 global removed. install() auto-runs via DOMContentLoaded.
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', install, { once: true });
  else install();
})();