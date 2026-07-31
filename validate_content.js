#!/usr/bin/env node
// =============================================================================
// LifeXP Content Integrity Validator  v1.0
// =============================================================================
// Usage:  node validate_content.js [--dir <path>]
// Exit:   0 = clean (only warnings), 1 = errors found
// =============================================================================
'use strict';

const fs   = require('fs');
const path = require('path');
const vm   = require('vm');

const DIR = (() => {
  const i = process.argv.indexOf('--dir');
  return i !== -1 ? process.argv[i + 1] : process.cwd();
})();

// ---------------------------------------------------------------------------
// Reporting
// ---------------------------------------------------------------------------
const ERRORS   = [];
const WARNINGS = [];
function err(code, msg)  { ERRORS.push(`[ERR]  ${code}: ${msg}`); }
function warn(code, msg) { WARNINGS.push(`[WARN] ${code}: ${msg}`); }

// IDs must be lowercase snake_case only
const ID_RE = /^[a-z0-9_]+$/;
function looksLikeDisplayName(s) {
  return typeof s === 'string' && !ID_RE.test(s);
}

// ---------------------------------------------------------------------------
// Sandbox
// ---------------------------------------------------------------------------
const sandbox = vm.createContext({
  window: { rollDropByTheme: null },
  document: {
    readyState: 'complete',
    addEventListener: () => {},
    removeEventListener: () => {}
  },
  localStorage: { getItem: () => null, setItem: () => {}, removeItem: () => {} },
  console,
  Object, Math, Array, JSON, parseInt, parseFloat, isNaN, isFinite,
  setTimeout: () => {}, clearTimeout: () => {},
  // Data globals
  RARITY: {}, ITEM_TYPE: {}, ITEMS: {}, DROP_TABLES: {},
  ENEMIES: {}, THEME_ENEMIES: {},
  QUESTS: {}, QUEST_TYPE: {}, QUEST_STATUS: {},
  CLASS_TREE: {},
  DEFAULT_TASKS: [],
  EXPANSION_ITEMS_V1: {}, EXPANSION_DROP_TABLES_V1: {},
  EXPANSION_ENEMIES_V1: {}, EXPANSION_THEME_ENEMIES_V1: {},
  EXPANSION_QUESTS_V1: {},
  EXPANSION_TASKS_V1: [],
  ITEM_FLAVOR: {},
  // Runtime stubs
  gameState: {
    inventory: [], stash: [], equipment: {},
    gold: 0, inventoryCapacityBonus: 0, stashCapacity: 30,
    __lifexpUpdate2: null
  },
  saveGame: () => {}, renderQuests: () => {}, renderInventory: () => {},
  updateQuestProgress: () => {},
  installExpansionItems: () => {}, installExpansionEnemies: () => {},
  installExpansionQuests: () => {}, installExpansionTasks: () => {},
});

// ---------------------------------------------------------------------------
// Load helper: strip top-level const/let/var so declarations land on sandbox
// ---------------------------------------------------------------------------
function loadFile(filename) {
  const filepath = path.join(DIR, filename);
  if (!fs.existsSync(filepath)) {
    warn('MISSING_FILE', `${filename} not found - skipping`);
    return false;
  }
  try {
    let code = fs.readFileSync(filepath, 'utf8');
    // Convert top-level `const X =` / `let X =` / `var X =` to plain `X =`
    // so they become properties of the sandbox context object.
    code = code.replace(/^(const|let|var)\s+([A-Z_][A-Za-z0-9_]*)\s*=/gm, '$2 =');
    vm.runInContext(code, sandbox, { filename });
    return true;
  } catch (e) {
    err('SYNTAX', `${filename}: ${e.message}`);
    return false;
  }
}

// ---------------------------------------------------------------------------
// Load order (mirrors index.html)
// ---------------------------------------------------------------------------
loadFile('classes.js');
loadFile('items.js');
loadFile('enemies.js');
loadFile('quests.js');
loadFile('data_tasks.js');
loadFile('expansion_items.js');
loadFile('expansion_enemies.js');
loadFile('expansion_quests.js');
loadFile('expansion_tasks.js');

// Merge expansions manually (mirrors install functions)
Object.assign(sandbox.ITEMS,         sandbox.EXPANSION_ITEMS_V1        || {});
Object.assign(sandbox.DROP_TABLES,   sandbox.EXPANSION_DROP_TABLES_V1  || {});
Object.assign(sandbox.ENEMIES,       sandbox.EXPANSION_ENEMIES_V1       || {});
Object.assign(sandbox.THEME_ENEMIES, sandbox.EXPANSION_THEME_ENEMIES_V1 || {});
Object.assign(sandbox.QUESTS,        sandbox.EXPANSION_QUESTS_V1        || {});
if (Array.isArray(sandbox.EXPANSION_TASKS_V1)) {
  sandbox.DEFAULT_TASKS.push(...sandbox.EXPANSION_TASKS_V1);
}

// update2_content.js: stub install functions, then load
sandbox.installExpansionItems   = () => {};
sandbox.installExpansionEnemies = () => {};
sandbox.installExpansionQuests  = () => {};
sandbox.installExpansionTasks   = () => {};
loadFile('update2_content.js');

// ---------------------------------------------------------------------------
// Snapshot catalogues
// ---------------------------------------------------------------------------
const ITEMS        = sandbox.ITEMS;
const DROP_TABLES  = sandbox.DROP_TABLES;
const ENEMIES      = sandbox.ENEMIES;
const THEME_ENEMIES= sandbox.THEME_ENEMIES;
const QUESTS       = sandbox.QUESTS;
const CLASS_TREE   = sandbox.CLASS_TREE;
const TASKS        = sandbox.DEFAULT_TASKS;

const itemIds  = new Set(Object.keys(ITEMS));
const enemyIds = new Set(Object.keys(ENEMIES));
const questIds = new Set(Object.keys(QUESTS));
const classIds = new Set(Object.keys(CLASS_TREE));

// ---------------------------------------------------------------------------
// CHECK 1 - Duplicate / mismatched IDs
// ---------------------------------------------------------------------------
function checkDuplicates(obj, label) {
  const seen = {};
  for (const [key, val] of Object.entries(obj)) {
    if (val && val.id && val.id !== key) {
      err('ID_MISMATCH', `${label}["${key}"].id = "${val.id}" (key != inner id)`);
    }
    if (seen[key]) err('DUPLICATE_ID', `${label}: duplicate key "${key}"`);
    seen[key] = true;
  }
}
checkDuplicates(ITEMS,    'ITEMS');
checkDuplicates(ENEMIES,  'ENEMIES');
checkDuplicates(QUESTS,   'QUESTS');
checkDuplicates(CLASS_TREE, 'CLASS_TREE');

const taskIdCount = {};
for (const t of TASKS) taskIdCount[t.id] = (taskIdCount[t.id] || 0) + 1;
for (const [id, n] of Object.entries(taskIdCount)) {
  if (n > 1) err('DUPLICATE_ID', `DEFAULT_TASKS: duplicate id "${id}" (x${n})`);
}

// ---------------------------------------------------------------------------
// CHECK 2 - Enemy drops -> ITEMS
// ---------------------------------------------------------------------------
for (const [eid, enemy] of Object.entries(ENEMIES)) {
  if (!Array.isArray(enemy.drops)) continue;
  for (const drop of enemy.drops) {
    if (!drop.itemId) {
      err('DROP_NO_ITEMID', `ENEMIES["${eid}"].drops: entry missing itemId`);
      continue;
    }
    if (looksLikeDisplayName(drop.itemId)) {
      err('DROP_DISPLAY_NAME', `ENEMIES["${eid}"].drops: "${drop.itemId}" looks like a display name`);
    } else if (!itemIds.has(drop.itemId)) {
      err('BROKEN_ITEM_REF', `ENEMIES["${eid}"].drops: itemId "${drop.itemId}" not in ITEMS`);
    }
  }
}

// ---------------------------------------------------------------------------
// CHECK 3 - DROP_TABLES -> ITEMS
// ---------------------------------------------------------------------------
for (const [theme, pool] of Object.entries(DROP_TABLES)) {
  if (!Array.isArray(pool)) continue;
  for (const itemId of pool) {
    if (looksLikeDisplayName(itemId)) {
      err('DROP_TABLE_DISPLAY_NAME', `DROP_TABLES["${theme}"]: "${itemId}" looks like a display name`);
    } else if (!itemIds.has(itemId)) {
      err('BROKEN_ITEM_REF', `DROP_TABLES["${theme}"]: "${itemId}" not in ITEMS`);
    }
  }
}

// ---------------------------------------------------------------------------
// CHECK 4 - THEME_ENEMIES -> ENEMIES
// ---------------------------------------------------------------------------
for (const [theme, eids] of Object.entries(THEME_ENEMIES)) {
  if (!Array.isArray(eids)) continue;
  for (const eid of eids) {
    if (looksLikeDisplayName(eid)) {
      err('THEME_DISPLAY_NAME', `THEME_ENEMIES["${theme}"]: "${eid}" looks like a display name`);
    } else if (!enemyIds.has(eid)) {
      err('BROKEN_ENEMY_REF', `THEME_ENEMIES["${theme}"]: enemyId "${eid}" not in ENEMIES`);
    }
  }
}

// ---------------------------------------------------------------------------
// CHECK 5 - Quest reward items + objective enemyIds + prerequisites + classId
// ---------------------------------------------------------------------------
function checkQuestItems(context, items) {
  if (!Array.isArray(items)) return;
  for (const itemId of items) {
    if (looksLikeDisplayName(itemId)) {
      err('QUEST_REWARD_DISPLAY_NAME', `${context}: "${itemId}" looks like a display name`);
    } else if (!itemIds.has(itemId)) {
      err('BROKEN_ITEM_REF', `${context}: "${itemId}" not in ITEMS`);
    }
  }
}
function checkQuestObjectives(context, objectives) {
  if (!Array.isArray(objectives)) return;
  for (const obj of objectives) {
    if ((obj.type === 'defeat_enemy' || obj.type === 'defeat_boss') && obj.enemyId) {
      if (!enemyIds.has(obj.enemyId)) {
        err('BROKEN_ENEMY_REF', `${context}: enemyId "${obj.enemyId}" not in ENEMIES`);
      }
    }
  }
}

for (const [qid, quest] of Object.entries(QUESTS)) {
  const ctx = `QUESTS["${qid}"]`;
  if (quest.rewards) checkQuestItems(`${ctx}.rewards.items`, quest.rewards.items);
  checkQuestObjectives(`${ctx}.objectives`, quest.objectives);

  if (Array.isArray(quest.chapters)) {
    for (const ch of quest.chapters) {
      const cctx = `${ctx}/${ch.id}`;
      if (ch.rewards) checkQuestItems(`${cctx}.rewards.items`, ch.rewards.items);
      checkQuestObjectives(`${cctx}.objectives`, ch.objectives);
      if (ch.encounter && ch.encounter.enemyId && !enemyIds.has(ch.encounter.enemyId)) {
        err('BROKEN_ENEMY_REF', `${cctx}.encounter: enemyId "${ch.encounter.enemyId}" not in ENEMIES`);
      }
    }
  }

  for (const pq of [quest.prerequisite, ...(quest.prerequisites || [])].filter(Boolean)) {
    if (!questIds.has(pq)) err('BROKEN_QUEST_REF', `${ctx}.prerequisite: "${pq}" not in QUESTS`);
  }

  if (quest.type === 'class_quest' && quest.classId && !classIds.has(quest.classId)) {
    err('BROKEN_CLASS_REF', `${ctx}.classId: "${quest.classId}" not in CLASS_TREE`);
  }
}

// ---------------------------------------------------------------------------
// CHECK 6 - Task drop references
// ---------------------------------------------------------------------------
for (const task of TASKS) {
  if (!task.drops) continue;
  const { theme, items } = task.drops;
  if (theme && !DROP_TABLES[theme]) {
    warn('UNKNOWN_THEME', `TASKS["${task.id}"].drops.theme: "${theme}" not in DROP_TABLES`);
  }
  if (Array.isArray(items)) {
    for (const itemId of items) {
      if (looksLikeDisplayName(itemId)) {
        err('TASK_DROP_DISPLAY_NAME', `TASKS["${task.id}"].drops.items: "${itemId}" looks like a display name`);
      } else if (!itemIds.has(itemId)) {
        err('BROKEN_ITEM_REF', `TASKS["${task.id}"].drops.items: "${itemId}" not in ITEMS`);
      }
    }
  }
  if (task.sideQuest && task.sideQuest.drops) {
    const sd = task.sideQuest.drops;
    if (sd.theme && !DROP_TABLES[sd.theme]) {
      warn('UNKNOWN_THEME', `TASKS["${task.id}"].sideQuest.drops.theme: "${sd.theme}" not in DROP_TABLES`);
    }
    if (Array.isArray(sd.items)) {
      for (const itemId of sd.items) {
        if (!itemIds.has(itemId)) {
          err('BROKEN_ITEM_REF', `TASKS["${task.id}"].sideQuest.drops.items: "${itemId}" not in ITEMS`);
        }
      }
    }
  }
}

// ---------------------------------------------------------------------------
// CHECK 7 - Quest reachability + circular prerequisites
// ---------------------------------------------------------------------------
for (const [qid, quest] of Object.entries(QUESTS)) {
  if (quest.minLevel !== undefined && quest.minLevel > 40) {
    warn('UNREACHABLE_QUEST', `QUESTS["${qid}"].minLevel = ${quest.minLevel} (above max designed level 40)`);
  }
  if (quest.prerequisite) {
    let cursor = quest.prerequisite;
    const visited = new Set([qid]);
    let depth = 0;
    while (cursor && depth < 20) {
      if (visited.has(cursor)) {
        err('CIRCULAR_PREREQ', `QUESTS["${qid}"]: circular prerequisite chain at "${cursor}"`);
        break;
      }
      visited.add(cursor);
      cursor = QUESTS[cursor] && QUESTS[cursor].prerequisite;
      depth++;
    }
  }
}

// ---------------------------------------------------------------------------
// CHECK 8 - Every enemy reachable via at least one theme
// ---------------------------------------------------------------------------
const enemiesInThemes = new Set();
for (const eids of Object.values(THEME_ENEMIES)) {
  if (Array.isArray(eids)) eids.forEach(id => enemiesInThemes.add(id));
}
for (const [eid, enemy] of Object.entries(ENEMIES)) {
  if (Array.isArray(enemy.themes) && enemy.themes.length > 0) enemiesInThemes.add(eid);
}
for (const eid of enemyIds) {
  if (!enemiesInThemes.has(eid)) {
    warn('ORPHAN_ENEMY', `ENEMIES["${eid}"]: not reachable via any theme or THEME_ENEMIES entry`);
  }
}

// ---------------------------------------------------------------------------
// CHECK 9 - Every item obtainable (warning only)
// ---------------------------------------------------------------------------
const obtainableItems = new Set();
for (const pool of Object.values(DROP_TABLES)) {
  if (Array.isArray(pool)) pool.forEach(id => obtainableItems.add(id));
}
for (const enemy of Object.values(ENEMIES)) {
  if (Array.isArray(enemy.drops)) enemy.drops.forEach(d => d.itemId && obtainableItems.add(d.itemId));
}
function collectQuestItems(quest) {
  if (quest.rewards && Array.isArray(quest.rewards.items)) quest.rewards.items.forEach(id => obtainableItems.add(id));
  if (Array.isArray(quest.chapters)) {
    for (const ch of quest.chapters) {
      if (ch.rewards && Array.isArray(ch.rewards.items)) ch.rewards.items.forEach(id => obtainableItems.add(id));
    }
  }
}
for (const quest of Object.values(QUESTS)) collectQuestItems(quest);

for (const itemId of itemIds) {
  if (!obtainableItems.has(itemId)) {
    warn('UNOBTAINABLE_ITEM', `ITEMS["${itemId}"]: not reachable via any drop table, enemy drop, or quest reward`);
  }
}

// ---------------------------------------------------------------------------
// SUMMARY
// ---------------------------------------------------------------------------
console.log('');
console.log('=================================================================');
console.log('  LifeXP Content Integrity Validator  v1.0');
console.log('=================================================================');
console.log('  Catalogue loaded:');
console.log(`    ITEMS    : ${itemIds.size}`);
console.log(`    ENEMIES  : ${enemyIds.size}`);
console.log(`    QUESTS   : ${questIds.size}`);
console.log(`    CLASSES  : ${classIds.size}`);
console.log(`    TASKS    : ${TASKS.length}`);
console.log('-----------------------------------------------------------------');

if (ERRORS.length === 0 && WARNINGS.length === 0) {
  console.log('  All checks passed. No errors, no warnings.');
} else {
  if (ERRORS.length > 0) {
    console.log(`\n  ERRORS (${ERRORS.length}) -- these break integrity:\n`);
    ERRORS.forEach(e => console.log('  ' + e));
  }
  if (WARNINGS.length > 0) {
    console.log(`\n  WARNINGS (${WARNINGS.length}) -- these smell bad:\n`);
    WARNINGS.forEach(w => console.log('  ' + w));
  }
}

console.log('');
console.log('-----------------------------------------------------------------');
console.log(`  Result: ${ERRORS.length} error(s), ${WARNINGS.length} warning(s)`);
console.log('=================================================================');
console.log('');

process.exit(ERRORS.length > 0 ? 1 : 0);
