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
    daily_cuerpo_2: { name: 'The Travellers Readiness', desc: 'Strengthen the body before the road asks for its price.', setting: 'Beyond the refuge, the road begins with the body you bring to it.', lore: 'The old route-makers measured readiness by what could be carried without complaint.' }
  };

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
      snapshots,
      gameState: typeof gameState !== 'undefined' ? cloneValue(gameState) : undefined
    };
  }

  function restoreMutableTarget(snapshot) {
    const target = snapshot.target;
    for (const key of Object.keys(target)) delete target[key];
    Object.assign(target, cloneValue(snapshot.value));
  }

  function restoreTransactionSnapshot(snapshot) {
    snapshot.snapshots.forEach(restoreMutableTarget);
    if (snapshot.gameState !== undefined && typeof gameState !== 'undefined') {
      for (const key of Object.keys(gameState)) delete gameState[key];
      Object.assign(gameState, cloneValue(snapshot.gameState));
    }
    if (snapshot.rawSave === null || snapshot.rawSave === undefined) localStorage.removeItem('lifexp_save');
    else localStorage.setItem('lifexp_save', snapshot.rawSave);
  }

  function writeBackup(rawSave) {
    if (rawSave !== null && rawSave !== undefined) localStorage.setItem('lifexp_update2_backup', rawSave);
  }

  function assertExpansionLoadOrder() {
    const missing = [
      ['EXPANSION_ITEMS_V1', typeof EXPANSION_ITEMS_V1 !== 'undefined' && EXPANSION_ITEMS_V1 && typeof EXPANSION_ITEMS_V1 === 'object'],
      ['EXPANSION_DROP_TABLES_V1', typeof EXPANSION_DROP_TABLES_V1 !== 'undefined' && EXPANSION_DROP_TABLES_V1 && typeof EXPANSION_DROP_TABLES_V1 === 'object'],
      ['EXPANSION_ENEMIES_V1', typeof EXPANSION_ENEMIES_V1 !== 'undefined' && EXPANSION_ENEMIES_V1 && typeof EXPANSION_ENEMIES_V1 === 'object'],
      ['EXPANSION_QUESTS_V1', typeof EXPANSION_QUESTS_V1 !== 'undefined' && EXPANSION_QUESTS_V1 && typeof EXPANSION_QUESTS_V1 === 'object'],
      ['EXPANSION_TASKS_V1', typeof EXPANSION_TASKS_V1 !== 'undefined' && Array.isArray(EXPANSION_TASKS_V1)]
    ].filter(([, available]) => !available);

    if (missing.length > 0) throw new Error(`Expansion load order incomplete: ${missing.map(([name]) => name).join(', ')}`);
  }

  function assertExpansionInstalled() {
    const missing = [
      ['ITEMS', ASHBRAND_ID, typeof ITEMS !== 'undefined' && ITEMS],
      ['QUESTS', 'daily_any_3', typeof QUESTS !== 'undefined' && QUESTS]
    ].filter(([, id, catalog]) => !catalog || !Object.prototype.hasOwnProperty.call(catalog, id));

    const missingItems = Object.keys(EXPANSION_ITEMS_V1).filter(id => !Object.prototype.hasOwnProperty.call(ITEMS, id));
    const missingDropTables = Object.keys(EXPANSION_DROP_TABLES_V1).filter(theme => !Object.prototype.hasOwnProperty.call(DROP_TABLES, theme));
    const missingEnemies = Object.keys(EXPANSION_ENEMIES_V1).filter(id => !Object.prototype.hasOwnProperty.call(ENEMIES, id));
    const missingQuests = Object.keys(EXPANSION_QUESTS_V1).filter(id => !Object.prototype.hasOwnProperty.call(QUESTS, id));
    const missingTasks = EXPANSION_TASKS_V1.filter(task => !DEFAULT_TASKS.some(existing => existing.id === task.id));

    if (missing.length || missingItems.length || missingDropTables.length || missingEnemies.length || missingQuests.length || missingTasks.length) {
      throw new Error([
        ...missing.map(([catalog, id]) => `${catalog}: ${id}`),
        missingItems.length > 0 ? `items: ${missingItems.join(', ')}` : '',
        missingDropTables.length > 0 ? `drop tables: ${missingDropTables.join(', ')}` : '',
        missingEnemies.length > 0 ? `enemies: ${missingEnemies.join(', ')}` : '',
        missingQuests.length > 0 ? `quests: ${missingQuests.join(', ')}` : '',
        missingTasks.length > 0 ? `tasks: ${missingTasks.map(task => task.id).join(', ')}` : ''
      ].filter(Boolean).join('; '));
    }
  }

  const CANONICAL_ITEM_ID_RE = /^[a-z0-9_]+$/;

  function hasCanonicalItem(itemId) {
    return typeof itemId === 'string'
      && CANONICAL_ITEM_ID_RE.test(itemId)
      && Object.prototype.hasOwnProperty.call(ITEMS, itemId);
  }

  function inspectItemReference(errors, context, itemId) {
    if (typeof itemId !== 'string' || !CANONICAL_ITEM_ID_RE.test(itemId)) {
      errors.push(`${context}: "${String(itemId)}" is not a canonical item ID.`);
      return;
    }
    if (!hasCanonicalItem(itemId)) errors.push(`${context}: item ID "${itemId}" is not declared in ITEMS.`);
  }

  function inspectItemList(errors, context, items) {
    if (!Array.isArray(items)) {
      errors.push(`${context} must be an array of canonical item IDs.`);
      return;
    }
    items.forEach((itemId, index) => inspectItemReference(errors, `${context}[${index}]`, itemId));
  }

  function inspectDropPayload(errors, context, payload) {
    if (payload === null || payload === undefined) return;
    if (Array.isArray(payload)) {
      inspectItemList(errors, context, payload);
      return;
    }
    if (typeof payload !== 'object') {
      errors.push(`${context} must be an array or an object with an items array.`);
      return;
    }
    inspectItemList(errors, `${context}.items`, payload.items);
  }

  function inspectEnemyDrops(errors, enemyId, drops) {
    if (drops === null || drops === undefined) return;
    if (!Array.isArray(drops)) {
      errors.push(`ENEMIES["${enemyId}"].drops must be an array.`);
      return;
    }
    drops.forEach((drop, index) => {
      const itemId = typeof drop === 'string' ? drop : drop && drop.itemId;
      if (itemId === undefined) {
        errors.push(`ENEMIES["${enemyId}"].drops[${index}] must declare itemId.`);
        return;
      }
      inspectItemReference(errors, `ENEMIES["${enemyId}"].drops[${index}].itemId`, itemId);
    });
  }

  function inspectQuestReward(errors, context, reward) {
    if (reward === undefined || reward === null) return;
    if (Array.isArray(reward)) {
      inspectItemList(errors, `${context}.items`, reward);
      return;
    }
    if (typeof reward !== 'object') {
      errors.push(`${context} must be an object or an array.`);
      return;
    }
    if (reward.items !== undefined) inspectItemList(errors, `${context}.items`, reward.items);
    if (reward.itemId !== undefined) inspectItemReference(errors, `${context}.itemId`, reward.itemId);
  }

  function assertRewardReferences() {
    const errors = [];

    for (const [theme, pool] of Object.entries(DROP_TABLES)) {
      if (Array.isArray(pool)) inspectItemList(errors, `DROP_TABLES["${theme}"]`, pool);
    }

    for (const [enemyId, enemy] of Object.entries(ENEMIES)) {
      inspectEnemyDrops(errors, enemyId, enemy && enemy.drops);
    }

    for (const task of DEFAULT_TASKS) {
      const taskId = task && task.id ? task.id : '<unknown>';
      if (task && task.drops !== undefined) inspectDropPayload(errors, `TASKS["${taskId}"].drops`, task.drops);
      if (task && task.sideQuest && task.sideQuest.drops !== undefined) {
        inspectDropPayload(errors, `TASKS["${taskId}"].sideQuest.drops`, task.sideQuest.drops);
      }
    }

    for (const [questId, quest] of Object.entries(QUESTS)) {
      if (!quest || typeof quest !== 'object') continue;
      inspectQuestReward(errors, `QUESTS["${questId}"].reward`, quest.reward);
      inspectQuestReward(errors, `QUESTS["${questId}"].rewards`, quest.rewards);
      if (Array.isArray(quest.chapters)) {
        quest.chapters.forEach((chapter, index) => {
          const chapterId = chapter && chapter.id ? chapter.id : index;
          inspectQuestReward(errors, `QUESTS["${questId}"].chapters[${chapterId}].reward`, chapter && chapter.reward);
          inspectQuestReward(errors, `QUESTS["${questId}"].chapters[${chapterId}].rewards`, chapter && chapter.rewards);
        });
      }
    }

    if (errors.length > 0) {
      throw new Error(`Reward reference validation failed: ${errors.join(' ')}`);
    }
  }

  function reportInstallFailure(error) {
    const message = error instanceof Error ? error.message : String(error);
    if (typeof showToast === 'function') showToast(`Update 2 no instalado: ${message}`);
    if (typeof console !== 'undefined' && console.error) console.error('[LifeXP] Update 2 rollback:', message);
  }

  function restoreAshbrand() {
    if (typeof ITEMS === 'undefined') return;
    const current = ITEMS[ASHBRAND_ID];
    if (!current || current.id !== ASHBRAND_ID) ITEMS[ASHBRAND_ID] = cloneValue(ASHBRAND);
  }

  function patchQuests() {
    if (typeof QUESTS === 'undefined') return;
    for (const [id, patch] of Object.entries(QUEST_PATCHES)) {
      if (!QUESTS[id]) continue;
      Object.assign(QUESTS[id], patch);
    }
  }

  function commitSave() {
    if (typeof gameState !== 'undefined') gameState.__lifexpUpdate2 = UPDATE_ID;
    if (typeof saveGame === 'function') saveGame();
    if (typeof gameState !== 'undefined' && gameState.__lifexpUpdate2 !== UPDATE_ID) {
      throw new Error('Update 2 save commit could not be verified.');
    }
  }

  function install() {
    if (typeof gameState !== 'undefined' && gameState.__lifexpUpdate2 === UPDATE_ID) return;

    const transaction = captureTransactionSnapshot();
    writeBackup(transaction.rawSave);

    try {
      assertExpansionLoadOrder();
      installExpansionItems();
      restoreAshbrand();
      installExpansionEnemies();
      installExpansionQuests();
      patchQuests();
      installExpansionTasks();
      assertExpansionInstalled();
      assertRewardReferences();
      restoreAshbrand();
      commitSave();
      if (typeof renderQuests === 'function') renderQuests();
      if (typeof renderInventory === 'function') renderInventory();
    } catch (error) {
      restoreTransactionSnapshot(transaction);
      reportInstallFailure(error);
    }
  }

  // DT-11 resolved: window.LifeXPUpdate2 global removed. install() auto-runs via DOMContentLoaded.
  if (typeof document !== 'undefined' && document.readyState === 'loading') document.addEventListener('DOMContentLoaded', install, { once: true });
  else install();
})();