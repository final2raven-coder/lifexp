// LifeXP Update 2 - declarative, additive, idempotent content installation.
(function () {
  'use strict';

  const UPDATE2_MANIFEST = {
    id: 'lifexp_update2_ashbrand_quests',
    marker: '__lifexpUpdate2',
    requiredCatalogs: [
      'EXPANSION_ITEMS_V1',
      'EXPANSION_DROP_TABLES_V1',
      'EXPANSION_ENEMIES_V1',
      'EXPANSION_QUESTS_V1',
      'EXPANSION_TASKS_V1'
    ],
    requiredInstallers: [
      'installExpansionItems',
      'installExpansionEnemies',
      'installExpansionQuests',
      'installExpansionTasks'
    ],
    requiredEntries: [
      { target: 'ITEMS', ids: ['cuchilla_llameante'] },
      { target: 'QUESTS', ids: ['daily_any_3'] }
    ],
    assertions: [
      { type: 'sourceInstalled', source: 'EXPANSION_DROP_TABLES_V1', target: 'DROP_TABLES' }
    ],
    operations: [
      {
        type: 'invoke',
        functionName: 'installExpansionItems',
        source: 'EXPANSION_ITEMS_V1',
        target: 'ITEMS'
      },
      {
        type: 'ensureEntries',
        target: 'ITEMS',
        onConflict: 'preserve',
        entries: [
          {
            id: 'cuchilla_llameante',
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
          }
        ]
      },
      {
        type: 'invoke',
        functionName: 'installExpansionEnemies',
        source: 'EXPANSION_ENEMIES_V1',
        target: 'ENEMIES'
      },
      {
        type: 'invoke',
        functionName: 'installExpansionQuests',
        source: 'EXPANSION_QUESTS_V1',
        target: 'QUESTS'
      },
      {
        type: 'patchEntries',
        target: 'QUESTS',
        missing: 'skip',
        entries: [
          {
            id: 'daily_any_3',
            patch: {
              name: 'The Threefold Ember',
              desc: 'Three small flames must answer before the watch can begin.',
              setting: 'The refuge keeps one ember alive for every path you tend.',
              lore: 'Old wardens never spoke of grand victories. They counted the lights that remained lit.'
            }
          },
          {
            id: 'daily_casa_2',
            patch: {
              name: 'The Quiet Hearth',
              desc: 'Restore two corners of the refuge before the evening bell.',
              setting: 'Dust gathers where the refuge walls meet, hiding marks left by former keepers.',
              lore: 'A clean hearth is not empty. It is a promise that someone intends to return.'
            }
          },
          {
            id: 'daily_cuerpo_2',
            patch: {
              name: 'The Travellers Readiness',
              desc: 'Strengthen the body before the road asks for its price.',
              setting: 'Beyond the refuge, the road begins with the body you bring to it.',
              lore: 'The old route-makers measured readiness by what could be carried without complaint.'
            }
          }
        ]
      },
      {
        type: 'invoke',
        functionName: 'installExpansionTasks',
        source: 'EXPANSION_TASKS_V1',
        target: 'DEFAULT_TASKS'
      }
    ],
    refreshFunctions: ['renderQuests', 'renderInventory']
  };

  const CATALOG_GETTERS = {
    ITEMS: () => typeof ITEMS !== 'undefined' ? ITEMS : undefined,
    ENEMIES: () => typeof ENEMIES !== 'undefined' ? ENEMIES : undefined,
    QUESTS: () => typeof QUESTS !== 'undefined' ? QUESTS : undefined,
    DEFAULT_TASKS: () => typeof DEFAULT_TASKS !== 'undefined' ? DEFAULT_TASKS : undefined,
    DROP_TABLES: () => typeof DROP_TABLES !== 'undefined' ? DROP_TABLES : undefined,
    THEME_ENEMIES: () => typeof THEME_ENEMIES !== 'undefined' ? THEME_ENEMIES : undefined,
    EXPANSION_ITEMS_V1: () => typeof EXPANSION_ITEMS_V1 !== 'undefined' ? EXPANSION_ITEMS_V1 : undefined,
    EXPANSION_DROP_TABLES_V1: () => typeof EXPANSION_DROP_TABLES_V1 !== 'undefined' ? EXPANSION_DROP_TABLES_V1 : undefined,
    EXPANSION_ENEMIES_V1: () => typeof EXPANSION_ENEMIES_V1 !== 'undefined' ? EXPANSION_ENEMIES_V1 : undefined,
    EXPANSION_QUESTS_V1: () => typeof EXPANSION_QUESTS_V1 !== 'undefined' ? EXPANSION_QUESTS_V1 : undefined,
    EXPANSION_TASKS_V1: () => typeof EXPANSION_TASKS_V1 !== 'undefined' ? EXPANSION_TASKS_V1 : undefined
  };

  const FUNCTION_GETTERS = {
    installExpansionItems: () => typeof installExpansionItems === 'function' ? installExpansionItems : undefined,
    installExpansionEnemies: () => typeof installExpansionEnemies === 'function' ? installExpansionEnemies : undefined,
    installExpansionQuests: () => typeof installExpansionQuests === 'function' ? installExpansionQuests : undefined,
    installExpansionTasks: () => typeof installExpansionTasks === 'function' ? installExpansionTasks : undefined,
    renderQuests: () => typeof renderQuests === 'function' ? renderQuests : undefined,
    renderInventory: () => typeof renderInventory === 'function' ? renderInventory : undefined,
    saveGame: () => typeof saveGame === 'function' ? saveGame : undefined,
    showToast: () => typeof showToast === 'function' ? showToast : undefined
  };

  function getCatalog(name) {
    const getter = CATALOG_GETTERS[name];
    return getter ? getter() : undefined;
  }

  function getRuntimeFunction(name) {
    const getter = FUNCTION_GETTERS[name];
    return getter ? getter() : undefined;
  }

  function cloneValue(value) {
    if (value === undefined) return undefined;
    return JSON.parse(JSON.stringify(value));
  }

  function valuesEqual(left, right) {
    return JSON.stringify(left) === JSON.stringify(right);
  }

  function captureMutableTarget(snapshots, name, target) {
    if (target && typeof target === 'object') snapshots.push({ name, target, value: cloneValue(target) });
  }

  function captureTransactionSnapshot() {
    const snapshots = [];
    Object.entries(CATALOG_GETTERS).forEach(([name, getter]) => captureMutableTarget(snapshots, name, getter()));
    return {
      rawSave: localStorage.getItem('lifexp_save'),
      snapshots,
      gameState: typeof gameState !== 'undefined' ? cloneValue(gameState) : undefined
    };
  }

  function restoreMutableTarget(snapshot) {
    const target = snapshot.target;
    if (Array.isArray(target)) {
      target.length = 0;
      target.push(...cloneValue(snapshot.value));
      return;
    }
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

  function assertRequiredResources(manifest) {
    const missingCatalogs = manifest.requiredCatalogs.filter(name => {
      const value = getCatalog(name);
      return !value || typeof value !== 'object';
    });
    const missingFunctions = manifest.requiredInstallers.filter(name => !getRuntimeFunction(name));
    if (missingCatalogs.length || missingFunctions.length) {
      throw new Error([
        missingCatalogs.length ? `catalogs: ${missingCatalogs.join(', ')}` : '',
        missingFunctions.length ? `installers: ${missingFunctions.join(', ')}` : ''
      ].filter(Boolean).join('; '));
    }
  }

  function getEntryId(entry) {
    return entry && typeof entry === 'object' ? entry.id : undefined;
  }

  function hasCatalogEntry(target, id) {
    if (Array.isArray(target)) return target.some(entry => getEntryId(entry) === id);
    return Object.prototype.hasOwnProperty.call(target, id);
  }

  function getCatalogEntry(target, id) {
    if (Array.isArray(target)) return target.find(entry => getEntryId(entry) === id);
    return target[id];
  }

  function assertCatalogEntry(target, id, context) {
    if (!hasCatalogEntry(target, id)) throw new Error(`${context}: missing entry "${id}".`);
  }

  function assertSourceInstalled(source, target, context) {
    if (Array.isArray(source)) {
      source.forEach((entry, index) => {
        const id = getEntryId(entry);
        if (id === undefined) throw new Error(`${context}[${index}] has no id.`);
        assertCatalogEntry(target, id, context);
      });
      return;
    }
    Object.keys(source).forEach(id => assertCatalogEntry(target, id, context));
  }

  function ensureEntries(target, entries, onConflict, context) {
    if (!target || typeof target !== 'object') throw new Error(`${context}: target catalog is unavailable.`);
    if (!Array.isArray(entries)) throw new Error(`${context}: entries must be an array.`);

    entries.forEach((entry, index) => {
      const id = getEntryId(entry);
      if (typeof id !== 'string' || !id) throw new Error(`${context}[${index}] has no valid id.`);
      const current = getCatalogEntry(target, id);
      if (current === undefined) {
        if (Array.isArray(target)) target.push(cloneValue(entry));
        else target[id] = cloneValue(entry);
        return;
      }
      if (onConflict === 'preserve') return;
      if (!valuesEqual(current, entry)) throw new Error(`${context}: conflicting entry "${id}".`);
    });
  }

  function patchEntries(target, entries, missingPolicy, context) {
    if (!target || typeof target !== 'object') throw new Error(`${context}: target catalog is unavailable.`);
    if (!Array.isArray(entries)) throw new Error(`${context}: entries must be an array.`);

    entries.forEach((operation, index) => {
      const id = operation && operation.id;
      const current = getCatalogEntry(target, id);
      if (current === undefined) {
        if (missingPolicy === 'skip') return;
        throw new Error(`${context}[${index}]: missing entry "${id}".`);
      }
      if (!operation.patch || typeof operation.patch !== 'object') {
        throw new Error(`${context}[${index}]: patch must be an object.`);
      }
      Object.assign(current, cloneValue(operation.patch));
    });
  }

  function assertManifestAssertions(manifest) {
    (manifest.requiredEntries || []).forEach((requirement, index) => {
      const target = getCatalog(requirement.target);
      if (!target) throw new Error(`requiredEntries[${index}]: target catalog is unavailable.`);
      (requirement.ids || []).forEach((id, idIndex) => {
        assertCatalogEntry(target, id, `requiredEntries[${index}].ids[${idIndex}]`);
      });
    });
    (manifest.assertions || []).forEach((assertion, index) => {
      if (assertion.type !== 'sourceInstalled') {
        throw new Error(`assertions[${index}]: unsupported assertion type "${assertion.type}".`);
      }
      const source = getCatalog(assertion.source);
      const target = getCatalog(assertion.target);
      if (!source || !target) throw new Error(`assertions[${index}]: source or target catalog is unavailable.`);
      assertSourceInstalled(source, target, `assertions[${index}]`);
    });
  }

  function assertManifestInstalled(manifest) {
    assertManifestAssertions(manifest);
    manifest.operations.forEach((operation, index) => {
      const context = `operation[${index}]`;
      if (operation.type === 'invoke') {
        const source = getCatalog(operation.source);
        const target = getCatalog(operation.target);
        if (!source || !target) throw new Error(`${context}: source or target catalog is unavailable.`);
        assertSourceInstalled(source, target, context);
        return;
      }
      if (operation.type === 'ensureEntries') {
        const target = getCatalog(operation.target);
        if (!target) throw new Error(`${context}: target catalog is unavailable.`);
        operation.entries.forEach((entry, entryIndex) => {
          const id = getEntryId(entry);
          assertCatalogEntry(target, id, `${context}.entries[${entryIndex}]`);
          if (operation.onConflict !== 'preserve' && !valuesEqual(getCatalogEntry(target, id), entry)) {
            throw new Error(`${context}: entry "${id}" differs.`);
          }
        });
        return;
      }
      if (operation.type === 'patchEntries') {
        const target = getCatalog(operation.target);
        if (!target) throw new Error(`${context}: target catalog is unavailable.`);
        operation.entries.forEach((entry, entryIndex) => {
          const current = getCatalogEntry(target, entry.id);
          if (current === undefined && operation.missing === 'skip') return;
          if (current === undefined) throw new Error(`${context}.entries[${entryIndex}]: entry is missing.`);
          Object.entries(entry.patch || {}).forEach(([key, value]) => {
            if (!valuesEqual(current[key], value)) throw new Error(`${context}: patch "${entry.id}.${key}" differs.`);
          });
        });
        return;
      }
      throw new Error(`${context}: unsupported operation type "${operation.type}".`);
    });
  }

  const CANONICAL_ITEM_ID_RE = /^[a-z0-9_]+$/;

  function hasCanonicalItem(itemId) {
    const items = getCatalog('ITEMS');
    return typeof itemId === 'string'
      && CANONICAL_ITEM_ID_RE.test(itemId)
      && items
      && Object.prototype.hasOwnProperty.call(items, itemId);
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
    const dropTables = getCatalog('DROP_TABLES');
    const enemies = getCatalog('ENEMIES');
    const tasks = getCatalog('DEFAULT_TASKS');
    const quests = getCatalog('QUESTS');

    for (const [theme, pool] of Object.entries(dropTables)) {
      if (Array.isArray(pool)) inspectItemList(errors, `DROP_TABLES["${theme}"]`, pool);
    }

    for (const [enemyId, enemy] of Object.entries(enemies)) {
      inspectEnemyDrops(errors, enemyId, enemy && enemy.drops);
    }

    for (const task of tasks) {
      const taskId = task && task.id ? task.id : '<unknown>';
      if (task && task.drops !== undefined) inspectDropPayload(errors, `TASKS["${taskId}"].drops`, task.drops);
      if (task && task.sideQuest && task.sideQuest.drops !== undefined) {
        inspectDropPayload(errors, `TASKS["${taskId}"].sideQuest.drops`, task.sideQuest.drops);
      }
    }

    for (const [questId, quest] of Object.entries(quests)) {
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

    if (errors.length > 0) throw new Error(`Reward reference validation failed: ${errors.join(' ')}`);
  }

  function reportInstallFailure(error) {
    const message = error instanceof Error ? error.message : String(error);
    const showToast = getRuntimeFunction('showToast');
    if (showToast) showToast(`Update 2 not installed: ${message}`);
    if (typeof console !== 'undefined' && console.error) console.error('[LifeXP] Update 2 rollback:', message);
  }

  function commitSave(manifest) {
    if (typeof gameState === 'undefined') throw new Error('Content save commit is unavailable before save loading.');
    const save = getRuntimeFunction('saveGame');
    if (!save) throw new Error('Content save commit is unavailable before save loading.');
    gameState[manifest.marker] = manifest.id;
    if (!save()) throw new Error('Content save commit could not be written.');
    const persisted = localStorage.getItem('lifexp_save');
    if (!persisted) throw new Error('Content save commit is missing from storage.');
    const parsed = JSON.parse(persisted);
    if (parsed[manifest.marker] !== manifest.id) throw new Error('Content save commit could not be verified.');
  }

  function refreshAfterInstall(manifest) {
    manifest.refreshFunctions.forEach(name => {
      const refresh = getRuntimeFunction(name);
      if (refresh) refresh();
    });
  }

  function installManifest(manifest) {
    if (!manifest || typeof manifest !== 'object') throw new Error('Content manifest is unavailable.');
    if (typeof gameState !== 'undefined' && gameState[manifest.marker] === manifest.id) return;

    const transaction = captureTransactionSnapshot();
    writeBackup(transaction.rawSave);

    try {
      assertRequiredResources(manifest);
      manifest.operations.forEach((operation, index) => {
        const context = `operation[${index}]`;
        if (operation.type === 'invoke') {
          const installer = getRuntimeFunction(operation.functionName);
          if (!installer) throw new Error(`${context}: installer "${operation.functionName}" is unavailable.`);
          installer();
        } else if (operation.type === 'ensureEntries') {
          ensureEntries(getCatalog(operation.target), operation.entries, context);
        } else if (operation.type === 'patchEntries') {
          patchEntries(getCatalog(operation.target), operation.entries, operation.missing, context);
        } else {
          throw new Error(`${context}: unsupported operation type "${operation.type}".`);
        }
      });
      assertManifestInstalled(manifest);
      assertRewardReferences();
      refreshAfterInstall(manifest);
      commitSave(manifest);
    } catch (error) {
      restoreTransactionSnapshot(transaction);
      reportInstallFailure(error);
    }
  }

  const api = typeof globalThis !== 'undefined' ? globalThis.LifeXPContent || {} : {};
  api.installManifest = installManifest;
  if (typeof globalThis !== 'undefined') globalThis.LifeXPContent = api;

  function installUpdate2() {
    return installManifest(UPDATE2_MANIFEST);
  }

  // Register during script loading. main.js runs the installer only after loadGame() succeeds.
  if (typeof registerLifeXPContentInstaller !== 'function') {
    reportInstallFailure(new Error('Save loading barrier is unavailable.'));
  } else {
    try { registerLifeXPContentInstaller(installUpdate2); }
    catch (error) { reportInstallFailure(error); }
  }
})();
