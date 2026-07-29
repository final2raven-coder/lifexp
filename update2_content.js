// LifeXP Update 2 - Ashbrand recovery, English quest layer and safe content install
// Load after game.js. This file is additive and idempotent.
(function () {
  'use strict';

  const UPDATE_ID = 'lifexp_update2_ashbrand_quests';
  const ASHBRAND_ID = 'cuchilla_llameante';

  const ASHBRAND = {
    id: ASHBRAND_ID,
    name: 'Ashbrand',
    type: 'weapon',
    rarity: 'rare',
    icon: '🔥',
    desc: 'A short sword taken from a shrine after the fire had gone out. The blade is warm. It does not glow.',
    lore: 'Ashbrand remembers a fire that refused to become a ruin.',
    stats: { fue: 5, int: 2 },
    value: 120,
    themes: ['fuego', 'fuego_comida', 'ash'],
    effects: [
      { id: 'burning_edge', name: 'Burning Edge', trigger: 'on_hit', status: 'burn', unlockStage: 1, chance: 0.35, duration: 3, damage: 4, description: 'Attacks can apply Burn for 3 turns.' },
      { id: 'pressure', name: 'Pressure', trigger: 'on_hit', status: 'burn', unlockStage: 2, chance: 0.15, duration: 2, damage: 2, description: 'A burning target can receive a shorter Burn.' }
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
    daily_any_3: {
      name: 'The Threefold Ember',
      desc: 'Three small flames must answer before the watch can begin.',
      setting: 'The refuge keeps one ember alive for every path you tend.',
      lore: 'Old wardens never spoke of grand victories. They counted the lights that remained lit.'
    },
    daily_casa_2: {
      name: 'The Quiet Hearth',
      desc: 'Restore two corners of the refuge before the evening bell.',
      setting: 'Dust gathers where the refuge walls meet, hiding marks left by former keepers.',
      lore: 'A clean hearth is not empty. It is a promise that someone intends to return.'
    },
    daily_cuerpo_2: {
      name: 'The Traveller’s Readiness',
      desc: 'Strengthen the body before the road asks for its price.',
      setting: 'Beyond the last gate, the old road climbs without shelter or easy ground.',
      lore: 'The road does not care how strong you meant to become. It remembers only what you carried.'
    },
    quest_first_steps: {
      name: 'The First Watch',
      desc: 'Take your place at the refuge wall and answer the first sign.',
      setting: 'The refuge stands at the edge of a road no map records twice.',
      lore: 'The first watch is rarely remembered for what it reveals. It is remembered because someone stayed.'
    },
    quest_home_master: {
      name: 'Keeper of the Refuge',
      desc: 'Restore the refuge until every neglected corner can hold a light.',
      setting: 'The refuge has survived many hands, but none of them left the same marks.',
      lore: 'Shelter is an active spell. Its strength is renewed by hands that notice what others miss.'
    },
    quest_body_temple: {
      name: 'The Body as a Compass',
      desc: 'Prepare the vessel that will carry you beyond the familiar roads.',
      setting: 'The northern passes measure every traveller by breath, balance and endurance.',
      lore: 'A compass can point the way. Only a prepared body can follow it.'
    },
    bounty_slimes: {
      name: 'The Pipe-Mire Brood',
      desc: 'Drive the hungry things from the channels beneath the refuge.',
      setting: 'Something soft and bright has begun moving through the pipes at night.',
      lore: 'The mire feeds on what is ignored. It grows quiet whenever a lantern approaches.'
    },
    bounty_bandits: {
      name: 'Knives on the Old Road',
      desc: 'Break the hold of the road thieves before the next caravan arrives.',
      setting: 'The old road narrows between broken markers where travellers vanish from sight.',
      lore: 'Every toll begins as a request made by someone who believes no one will answer.'
    },
    story_wolf_hills: {
      name: 'The Wolf Above the Hills',
      desc: 'Follow the night-borne signs and face what has claimed the high ground.',
      setting: 'The hills have gone silent after dusk, as though the wind itself is listening.',
      lore: 'The oldest tracks are not always the largest. Some creatures learn to make fear walk ahead of them.'
    },
    class_warrior_berserker: {
      name: 'The Red Path',
      desc: 'Prove that force can be guided without being extinguished.',
      setting: 'The Red Path opens only where discipline and fury meet without either yielding.',
      lore: 'A berserker is not a storm without a sky. The hardest lesson is choosing where the lightning lands.'
    }
  };

  const OBJECTIVE_WORDS = {
    any: 'any path', casa: 'the refuge', cuerpo: 'the body', gestiones: 'the ledger', social: 'the circle', personal: 'the inner road'
  };

  function backupBeforeMutation() {
    try {
      const raw = localStorage.getItem('lifexp_save');
      if (raw && !localStorage.getItem('lifexp_update2_backup')) {
        localStorage.setItem('lifexp_update2_backup', raw);
        localStorage.setItem('lifexp_update2_backup_time', new Date().toISOString());
      }
    } catch (error) { console.warn('Update 2 backup unavailable:', error); }
  }

  function ensureContainer(container, id, qty) {
    if (!Array.isArray(container)) return false;
    const found = container.find(slot => slot && slot.id === id);
    if (found) { found.qty = Math.max(1, Number(found.qty || 1)); return false; }
    container.push({ id, qty: qty || 1, obtainedAt: typeof todayStr === 'function' ? todayStr() : new Date().toISOString().slice(0, 10) });
    return true;
  }

  function migrateLegacyAshbrand(container) {
    if (!Array.isArray(container)) return 0;
    let moved = 0;
    for (const slot of container) {
      if (!slot || !['ashbrand', 'Ashbrand', 'cuchilla_llameante'].includes(slot.id)) continue;
      if (slot.id !== ASHBRAND_ID) { slot.id = ASHBRAND_ID; moved += 1; }
    }
    return moved;
  }

  function restoreAshbrand() {
    if (typeof ITEMS === 'undefined' || typeof gameState === 'undefined') return false;
    Object.assign(ITEMS, { [ASHBRAND_ID]: { ...(ITEMS[ASHBRAND_ID] || {}), ...ASHBRAND } });
    gameState.inventory = Array.isArray(gameState.inventory) ? gameState.inventory : [];
    gameState.stash = Array.isArray(gameState.stash) ? gameState.stash : [];
    migrateLegacyAshbrand(gameState.inventory);
    migrateLegacyAshbrand(gameState.stash);
    if (gameState.equipment && Object.values(gameState.equipment).some(id => ['ashbrand', 'Ashbrand'].includes(id))) {
      for (const slot of Object.keys(gameState.equipment)) if (['ashbrand', 'Ashbrand'].includes(gameState.equipment[slot])) gameState.equipment[slot] = ASHBRAND_ID;
    }
    const owned = gameState.inventory.some(x => x?.id === ASHBRAND_ID) || gameState.stash.some(x => x?.id === ASHBRAND_ID) || Object.values(gameState.equipment || {}).includes(ASHBRAND_ID);
    if (!owned) ensureContainer(gameState.inventory, ASHBRAND_ID, 1);
    return true;
  }

  function patchQuests() {
    if (typeof QUESTS === 'undefined') return;
    for (const [id, patch] of Object.entries(QUEST_PATCHES)) if (QUESTS[id]) Object.assign(QUESTS[id], patch);
    if (typeof EXPANSION_QUESTS_V1 !== 'undefined') {
      for (const [id, quest] of Object.entries(EXPANSION_QUESTS_V1)) {
        if (!QUESTS[id]) QUESTS[id] = quest;
        if (QUESTS[id] && !QUESTS[id].setting) {
          QUESTS[id].setting = 'The frontier changes whenever a keeper chooses to move.';
          QUESTS[id].lore = 'Small acts leave marks that remain after the traveller has gone.';
        }
      }
    }
  }

  function patchExpansionQuestLanguage() {
    if (typeof QUESTS === 'undefined') return;
    const patches = {
      daily_routine_4: ['The Fourfold Ember', 'Four lights must answer before the watch can begin.'],
      quest_first_week: ['The First Circuit', 'Trace a complete circuit through refuge, body and inner road.'],
      quest_clear_path: ['The Open Road', 'Prepare the ledger and the body for a road beyond the gate.'],
      bounty_threshold: ['The Shaking Threshold', 'Drive back the guardians gathering at the old threshold.'],
      story_first_thread: ['The First Thread', 'Follow the small anomaly before it knots around the refuge.']
    };
    for (const [id, [name, desc]] of Object.entries(patches)) {
      if (!QUESTS[id]) continue;
      QUESTS[id].name = name;
      QUESTS[id].desc = desc;
      QUESTS[id].setting = QUESTS[id].setting || 'The frontier changes whenever a keeper chooses to move.';
      QUESTS[id].lore = QUESTS[id].lore || 'Small acts leave marks that remain after the traveller has gone.';
      if (Array.isArray(QUESTS[id].chapters)) {
        QUESTS[id].chapters.forEach((chapter, index) => {
          chapter.name = ['Quiet Signs', 'The Pattern', 'The Watcher'][index] || `Chapter ${index + 1}`;
          chapter.desc = ['Gather the signs that do not belong to chance.', 'Watch the pattern take shape across familiar ground.', 'Face what has been waiting beyond the next step.'][index] || 'Continue along the marked path.';
        });
      }
    }
  }

  function patchQuestDetail() {
    if (typeof showQuestDetail !== 'function' || showQuestDetail.__update2) return;
    const original = showQuestDetail;
    function detailWithLore(questId) {
      original(questId);
      const quest = typeof QUESTS !== 'undefined' ? QUESTS[questId] : null;
      const content = document.getElementById('modal-item-content');
      if (!quest || !content) return;
      const escape = value => String(value || '').replace(/[&<>\"']/g, ch => ({ '&':'&amp;', '<':'&lt;', '>':'&gt;', '\"':'&quot;', "'":'&#39;' }[ch]));
      const context = `${quest.setting ? `<div class=\"card quest-setting\"><div style=\"font-size:11px;color:var(--gold);margin-bottom:4px;\">SETTING</div>${escape(quest.setting)}</div>` : ''}${quest.lore ? `<div class=\"card quest-lore\"><div style=\"font-size:11px;color:var(--gold);margin-bottom:4px;\">FIELD NOTE</div>${escape(quest.lore)}</div>` : ''}`;
      content.insertAdjacentHTML('beforeend', context);
    }
    detailWithLore.__update2 = true;
    window.showQuestDetail = detailWithLore;
  }

  function patchAvailableQuestCards() {
    if (typeof showAvailableQuests !== 'function' || showAvailableQuests.__update2) return;
    const original = showAvailableQuests;
    function cardsWithLore() {
      original();
      const list = document.getElementById('available-quests-list') || document.getElementById('modal-tasks-list');
      if (!list || typeof QUESTS === 'undefined') return;
      list.querySelectorAll('[data-update2-quest-context]').forEach(node => node.remove());
    }
    cardsWithLore.__update2 = true;
    window.showAvailableQuests = cardsWithLore;
  }

  function patchObjectiveText() {
    if (typeof formatObjective !== 'function' || formatObjective.__update2) return;
    const original = formatObjective;
    function englishObjective(obj) {
      const count = Number(obj.count || 0);
      if (obj.type === 'complete_tasks') return { text: `Complete ${count} rites along ${OBJECTIVE_WORDS[obj.category || 'any']}.`, progress: `${obj.progress || 0}/${count}`, done: (obj.progress || 0) >= count };
      if (obj.type === 'defeat_enemy') return { text: `Defeat ${count} marked foes.`, progress: `${obj.progress || 0}/${count}`, done: (obj.progress || 0) >= count };
      if (obj.type === 'defeat_boss') return { text: 'Defeat the marked guardian.', progress: `${obj.progress || 0}/${count}`, done: (obj.progress || 0) >= count };
      return original(obj);
    }
    englishObjective.__update2 = true;
    window.formatObjective = englishObjective;
  }

  function install() {
    if (typeof gameState === 'undefined' || gameState.__lifexpUpdate2 === UPDATE_ID) return;
    backupBeforeMutation();
    // Expansion modules are optional. If present, install them before patching references.
    if (typeof installExpansionItems === 'function') installExpansionItems();
    if (typeof installExpansionEnemies === 'function') installExpansionEnemies();
    if (typeof installExpansionQuests === 'function') installExpansionQuests();
    if (typeof installExpansionTasks === 'function') installExpansionTasks();
    restoreAshbrand();
    patchQuests();
    patchExpansionQuestLanguage();
    patchObjectiveText();
    patchQuestDetail();
    patchAvailableQuestCards();
    gameState.__lifexpUpdate2 = UPDATE_ID;
    if (typeof renderQuests === 'function') renderQuests();
    if (typeof renderInventory === 'function') renderInventory();
    if (typeof saveGame === 'function') saveGame();
  }

  window.LifeXPUpdate2 = { install, restoreAshbrand, patchQuests, patchExpansionQuestLanguage };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', install, { once: true });
  else install();
})();
