# PROJECT_MAP - LifeXP RPG

> **Proposito:** mapa de referencia para el Game Master y cualquier colaborador.
> Permite localizar cualquier simbolo, modelo de datos o zona de cambio sin abrir el proyecto completo.
> **Regla de uso:** actualizar la seccion 8 (changelog) en cada PR que modifique ficheros listados aqui.

---

## 0. Metadatos

| Campo | Valor |
|---|---|
| Fecha de generacion | 2026-07-30 |
| Ultima actualizacion | 2026-07-31 (Fase E saneamiento -- PR #13) |
| Branch de produccion | `main` |
| Branches activas | `main`, `backup/pre-sanitation-2026-07-30` |
| Commit base | `b703adf895dd5494fab34e12a43111d39fe3301f` |
| Build string | `LIFE_XP_BUILD = 'v13.4-equip-action-fix'` |
| Publicacion | GitHub Pages - rama `main`, raiz `/` |
| URL publica | `https://final2raven-coder.github.io/lifexp/` |
| Entrada | `index.html` (SPA de una sola pagina) |
| PWA | `manifest.json` + `sw.js` (cache-first, lista de assets hardcodeada) |

---

## 1. Arquitectura en 10 lineas

LifeXP es una **SPA vanilla JS / PWA** sin bundler ni framework.
`index.html` contiene todo el CSS y el HTML; los scripts se cargan en orden al final del `<body>`.
El estado global vive en el objeto `gameState` (definido en `game.js`) y se persiste en `localStorage` bajo la clave `lifexp_save`.
Los datos de contenido (items, enemigos, quests, clases) son constantes declaradas en ficheros separados y consumidas por `game.js` y `combat.js` como globals.
Los ficheros `expansion_*.js` y `update2_content.js` amplian esas constantes mediante `Object.assign` al arrancar.
`inventory_system.js` es el ultimo script relevante en cargarse: define el subsistema canonico de inventario, expone `normalizeItemText` y `emergencyRerollLegacyItem`, y hace repair() al arrancar.
`ashbrand_hotfix.js` es un stub vacio de compatibilidad (Fase D). Se eliminara en Fase G.
`combat.js` implementa el motor de combate por turnos; `classes.js` define el arbol de clases y las formulas de XP/stats.
No hay servidor: todo corre en el navegador. El Service Worker (`sw.js`) sirve la app offline con estrategia cache-first.
GitHub Pages publica `main` directamente; no hay paso de build.

---

## 2. Inventario de ficheros

| Ruta | Lineas | Responsabilidad | Exports principales | Dependencias |
|---|---|---|---|---|
| `index.html` | 1579 | Shell HTML + todo el CSS + orden de carga de scripts | (DOM) | Todos los `.js` |
| `game.js` | ~4068 | Motor principal: estado, tareas, UI, combate-UI, quests-UI, guild, settings, onboarding, item-system runtime | `gameState`, `DEFAULT_TASKS`, `CATEGORIES`, `STATS`, `FREQ`, `LIFE_XP_BUILD`, todas las funciones de UI | `classes.js`, `items.js`, `enemies.js`, `combat.js`, `quests.js` |
| `items.js` | 279 | Catalogo de items, rareza, tipos, tablas de drop | `RARITY`, `ITEM_TYPE`, `ITEMS`, `DROP_TABLES`, `rollDrop`, `addToInventory`, `removeFromInventory` | (solo globals de `gameState`) |
| `enemies.js` | 614 | Catalogo de enemigos + helpers de seleccion/escalado | `ENEMIES`, `getEnemyById`, `pickRandomEnemy`, `scaleEnemy` | `items.js` (drops) |
| `combat.js` | 798 | Motor de combate por turnos: dano, skills, estados, auto-combat, recompensas | `combatState`, `initCombat`, `executePlayerAction`, `executeEnemyTurn`, `resolveAutoCombat`, `calculateCombatRewards`, `rollEncounter` | `game.js` (`gameState`, `getDerivedStats`), `enemies.js`, `items.js` |
| `classes.js` | 223 | Arbol de clases, formulas XP/nivel, stats derivados, recursos | `CLASS_TREE`, `BASE_CLASSES`, `xpForLevel`, `levelFromXp`, `calculateDerivedStats`, `calculateResources`, `getClassChain` | |
| `quests.js` | ~610 | Catalogo de quests + motor de estado de quests. FUENTE DE VERDAD UNICA para logica de quests. | `QUEST_TYPE`, `QUEST_STATUS`, `QUESTS`, `initQuestState`, `acceptQuest`, `completeQuest`, `updateQuestProgress`, `applyQuestRewards`, `window.acceptQuestCanonical`, `window.abandonQuestCanonical` | `game.js` (`gameState`, `saveGame`) |
| `inventory_system.js` | ~160 | Subsistema canonico de inventario: resolucion de IDs, aliases, normalizacion, render, repair. FUENTE DE VERDAD UNICA. Expone tambien `normalizeItemText` y `emergencyRerollLegacyItem` (absorbidos de ashbrand_hotfix en Fase D). | `window.LifeXPInventory.resolve()`, `window.LifeXPInventory.repair()`, `window.normalizeItemText`, `window.emergencyRerollLegacyItem`, `window.renderInventory` | `items.js` (`ITEMS`, `RARITY`), `game.js` (`gameState`, `saveGame`) |
| `ashbrand_hotfix.js` | 11 | STUB VACIO de compatibilidad (Fase D). Sin logica. Se eliminara en Fase G. | (ninguno) | (ninguno) |
| `expansion_enemies.js` | 21 | Expansion 1: 7 enemigos nuevos (niveles 1-15) | `EXPANSION_ENEMIES_V1`, `EXPANSION_THEME_ENEMIES_V1`, `installExpansionEnemies()` | `enemies.js` (`ENEMIES`) |
| `expansion_items.js` | 32 | Expansion 1: 11 items nuevos | `EXPANSION_ITEMS_V1`, `EXPANSION_DROP_TABLES_V1`, `installExpansionItems()` | `items.js` (`ITEMS`, `DROP_TABLES`) |
| `expansion_quests.js` | 24 | Expansion 1: 5 quests nuevas (daily, compound, bounty, story) | `EXPANSION_QUESTS_V1`, `installExpansionQuests()`, `updateExpansionQuestProgress()` | `quests.js` (`QUESTS`, `updateQuestProgress`) |
| `expansion_tasks.js` | 28 | Expansion 1: tareas adicionales para `DEFAULT_TASKS` | `EXPANSION_TASKS_V1`, `installExpansionTasks()` | `game.js` (`DEFAULT_TASKS`) |
| `update2_content.js` | 115 | Update 2: redefine Ashbrand con efectos/attunement + quests de Ashbrand; expone `window.LifeXPUpdate2` | `window.LifeXPUpdate2` | `items.js`, `quests.js`, `game.js` |
| `sw.js` | 61 | Service Worker PWA: cache-first, lista de assets hardcodeada | | |
| `manifest.json` | 24 | Manifiesto PWA: nombre, iconos, colores, display | | |
| `emergency-save.html` | 133 | Herramienta standalone de rescate de save: lee/escribe `localStorage` directamente | | (standalone) |
| `PLAN_DE_ACCION.md` | | Hoja de ruta del saneamiento en curso | | |
| `LifeXP_RPG_GDD_v2.md` | | Game Design Document: reglas, mecanicas, narrativa | | |
| `LifeXP_Agent_Content_Guide_v2.md` | | Guia operativa para el Game Master agent | | |

---

## 3. Indice de simbolos (ficheros grandes)

### `game.js` (4124 lineas -- post Fase B)

| Rango aprox. | Simbolo / Seccion |
|---|---|
| 1-42 | Constantes: `LIFE_XP_BUILD`, `CATEGORIES`, `STATS`, `FREQ` |
| 43-536 | `DEFAULT_TASKS` - array de tareas por defecto |
| 537-593 | `gameState` - objeto de estado global |
| 594-606 | Variables de UI: `currentTask`, `timerInterval`, etc. |
| 607-719 | Utilidades: `todayStr`, `daysBetween`, `xpForLevel`, `addXp`, `addStats`, `getTaskById`, `isTaskDue`, `getAvailableTasks`, `pickRandomTask` |
| 720-801 | Persistencia: `saveGame`, `loadGame`, `updateStreak`, `showScreen` |
| 802-946 | UI Hub: `renderHub` |
| 857-946 | UI Personaje: `renderCharacter` |
| 947-1122 | UI Inventario: `renderInventory`, `renderEquipment`, `equipItemFromInventory`, `showLegacyItemModal` |
| 1123-1512 | `ITEM_FLAVOR_TEXT` - textos de flavor por item |
| 1513-1619 | Item runtime: `getItemFlavorText`, `showAttunementFlavor`, `unequipItemToInventory`, `sellItemFromInventory`, `useConsumable` |
| 1620-1664 | Settings: `forceAppUpdate`, `renderSettings` |
| 1665-1771 | Navegacion de tareas: `openRandomTask`, `openCategory`, `shuffleTask` |
| 1772-1985 | Completar tarea: `completeTask`, `finalizeCompletion`, `rollDropFromTheme`, `rollDrop`, `rollSideQuestDrop` |
| 1986-2079 | Encuentros: `pendingEncounter`, `dismissComplete`, `checkForEncounter`, `triggerEncounterAfterTask`, `startCombatFromEncounter` |
| 2080-2230 | UI Combate: `renderCombatScreen`, `renderCombatActions`, `renderCombatLog`, `executeCombatAction`, `showCombatVictory`, `showCombatDefeat`, `endCombatAndReturn` |
| 2231-2309 | Tareas guardadas/overflow: `saveForLater`, `showSavedTasks`, `showOverflowTasks` |
| 2310-2467 | Modales y UI generica: `openModal` y helpers |
| 2468-2636 | Export/Import/Snapshot: `exportSnapshot`, `generateTaskMetrics`, `generateContentSuggestions`, `importDataText` |
| 2637-2960 | Guild: `createGuild`, `joinGuildFromReceipt`, `generateReceipt`, `processReceipt`, `renderGuild` |
| 3095-3162 | Toast/Feedback: `showFlavorDialog`, `showToast`, `showLevelUpEffect`, `triggerHaptic` |
| 3163-3262 | Onboarding: `onboardingSteps`, `showOnboarding`, `finishOnboarding` |
| 3263-3530 | UI Quests: `renderQuests`, `showAvailableQuests`, `acceptQuest` (delega a quests.js), `showQuestDetail`, `abandonQuest` (delega a quests.js), `migrateQuestState`. `updateQuestProgress` y `completeQuest` eliminadas: las versiones canonicas de quests.js se usan directamente. |
| 3596-3760 | Item system runtime: `initializeItemSystem`, `normalizeItemDefinition`, `getItemDefinition`, `getItemAttunement`, `equipItem`, `getEquippedItemEffects`, `unequipItem` |
| 3761-3800 | Block 2.1 -- inventory identity recovery: `resolveInventoryItemId` (delega a inventory_system.js), `repairInventoryIdentities` (delega a inventory_system.js) |
| 3801-4124 | Item modal + efectos: `renderInventoryGrid`, `renderStashGrid`, `showItemModal`, `getItemKnowledgeState`, `isItemEffectKnown`, `discoverItemEffect`, `isItemEffectUnlocked`, `renderActivationPanel` |

### `inventory_system.js` (~160 lineas -- post Fase D)

| Rango aprox. | Simbolo |
|---|---|
| 1-10 | Cabecera, BUILD = 'v15-merged-hotfix', tabla aliases |
| 11-20 | `text()` - normalizacion interna de strings |
| 21-45 | `resolve()` - resolucion de IDs canonicos |
| 46-55 | `normalize()` - normalizacion de entradas de inventario |
| 56-75 | `repairList()`, `repair()` - reparacion de inventario/stash |
| 76-100 | `icon()` - generacion de SVG por tipo de item |
| 101-120 | `render()` - renderizado de grids de inventario/stash |
| 121-130 | Exports: `window.LifeXPInventory`, `renderCanonicalInventory`, `renderCanonicalStash` |
| 131-135 | `window.normalizeItemText = text` (alias global, antes en ashbrand_hotfix.js) |
| 136-155 | `window.emergencyRerollLegacyItem` (movido de ashbrand_hotfix.js en Fase D) |
| 156-165 | `window.renderInventory` override + listener DOMContentLoaded |

### `combat.js` (798 lineas)

| Rango aprox. | Simbolo |
|---|---|
| 1-13 | `combatState = null` |
| 14-171 | Status effects: `applyStatusEffect`, `tickCombatStatuses` (burn, poison, freeze, stun, bleed, slow, fear, shield) |
| 172-191 | `applyEquipmentOnHitEffects` |
| 192-242 | `initCombat` |
| 243-335 | `calculateDamage`, `calculateHeal` |
| 336-389 | `PLAYER_SKILLS` |
| 390-438 | `getAvailableActions` |
| 439-540 | `executePlayerAction` |
| 541-623 | `executeEnemyTurn` |
| 624-663 | `resolveAutoCombat` |
| 664-728 | `calculateCombatRewards`, `applyCombatRewards` |
| 729-770 | `addCombatLog`, `getCombatLog`, `getCombatState`, `isCombatActive`, `endCombat` |
| 772-798 | `rollEncounter`, `getEncounterType` |

### `items.js` (279 lineas)

| Rango aprox. | Simbolo |
|---|---|
| 1-10 | `RARITY`, `ITEM_TYPE` |
| 11-147 | `ITEMS` - catalogo completo de items base |
| 148-171 | `DROP_TABLES` - tablas de drop por tema |
| 172-279 | Helpers: `getInventoryCapacity`, `addToContainer`, `addToInventory`, `removeFromInventory`, `equipItem` (legacy), `rollDrop`, `sellItem`; `window._itemsRollDrop = rollDrop` |

### `quests.js` (597 lineas)

| Rango aprox. | Simbolo |
|---|---|
| 1-30 | `QUEST_TYPE`, `QUEST_STATUS` |
| 31-256 | `QUESTS` - catalogo: dailies, simples, compuestas, bounties, story arcs |
| 257-373 | Estado: `initQuestState`, `getActiveQuests`, `getAvailableQuests`, `acceptQuest`, `abandonQuest`, `completeQuest`, `failQuest` |
| 374-563 | Progreso: `updateQuestProgress`, `checkQuestCompletion`, `applyQuestRewards`, `checkDailyQuestReset`, `getQuestProgress` |
| 564-597 | Helpers UI: `getQuestTypeInfo`, `formatObjective` |

### `classes.js` (223 lineas)

| Rango aprox. | Simbolo |
|---|---|
| 5-146 | `CLASS_TREE` - arbol completo (tiers 1-4, 6 ramas base) |
| 147-152 | `BASE_CLASSES` |
| 153-176 | Formulas: `xpForLevel`, `levelFromXp`, `xpToNextLevel`, `xpProgressInLevel` |
| 177-230 | `calculateDerivedStats`, `calculateResources`, `getAvailableClassChanges`, `getClassChain`, `getTierName` |

---

## 4. Modelos de datos

### 4.1 Task (en `DEFAULT_TASKS` / `EXPANSION_TASKS_V1`)

```js
{
  id: string,          // unico, ej: 'casa_1'
  cat: string,         // 'casa' | 'cuerpo' | 'gestiones' | 'social' | 'personal'
  name: string,
  freq: string,        // 'daily' | 'weekly' | 'biweekly' | 'monthly' | 'quarterly' | 'biannual' | 'annual'
  desc: string,        // descripcion practica para el jugador
  stats: { fue?, vit?, des?, int?, vol?, pre? },  // valores 0-100 (se dividen /10 para puntos)
  xp: number,
  drops: null | { theme: string, items: string[] },
  sideQuest: null | {
    desc: string,
    stats: { ... },
    xp: number,
    drops: string[] | null,
    dropBonus: number   // % bonus de drop chance
  }
}
```

### 4.2 Item (en `ITEMS`)

```js
{
  id: string,
  name: string,
  type: 'weapon' | 'armor' | 'accessory' | 'artifact' | 'consumable' | 'material' | 'skill' | 'key',
  rarity: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary',
  icon: string,        // clave ASCII (ej: 'SWORD', 'FIRE') o emoji
  lore: string,
  desc: string,
  stats: { fue?, vit?, des?, int?, vol?, pre? },
  value: number,       // precio en gold
  themes: string[],    // temas de drop (ej: ['fuego', 'fuego_comida'])
  effects?: Effect[],  // efectos con unlockStage y trigger
  attunement?: {
    required: boolean,
    current: number,
    max: number,       // default 3
    stages: string[]
  },
  passive?: string,    // texto de efecto pasivo (legacy)
  effect?: object,     // efecto legacy (consumibles)
  activation?: object | null,
  curse?: object | null,
  cantSell?: boolean,
  teachesSkill?: string  // para type:'skill'
}
```

### 4.3 Enemy (en `ENEMIES`)

```js
{
  id: string,
  name: string,
  icon: string,        // emoji
  type: 'common' | 'elite' | 'boss',
  level: number,
  hp: number,
  fue: number, vit: number, des: number, int: number, vol: number, pre: number,
  xp: number,
  gold: number,
  skills: [{ id, name, type, power, cost?, damageType?, scaling?, effect? }],
  drops: [{ itemId: string, chance: number }],
  themes: string[]
}
```

### 4.4 Quest (en `QUESTS`)

```js
{
  id: string,
  type: 'daily' | 'simple' | 'compound' | 'bounty' | 'story' | 'class',
  name: string,
  desc: string,
  minLevel: number,
  objectives: [{
    id: string,
    type: 'complete_tasks' | 'defeat_enemy' | 'defeat_boss' | 'reach_level' | 'equip_item',
    count: number,
    category?: string | null,
    enemyId?: string,
    progress: number
  }],
  rewards: { xp: number, gold?: number, items?: string[] },
  repeatable: boolean,
  resetDaily?: boolean,
  timeLimit?: number,     // dias (bounties)
  requirements?: { classId?, minStats? },
  // Solo type:'story':
  chapters?: [{ id, name, desc, objectives, rewards }],
  currentChapter?: number
}
```

### 4.5 Clase (en `CLASS_TREE`)

```js
{
  name: string,
  icon: string,
  tier: 1 | 2 | 3 | 4,
  reqLevel: number,
  parent?: string,       // id de la clase padre (ausente en tier 1)
  stats: { fue?, vit?, des?, int?, vol?, pre? },  // bonus al elegir
  desc: string,
  branches: string[]     // ids de clases hijas disponibles
}
```

### 4.6 `gameState` (save en `localStorage['lifexp_save']`)

```js
{
  // Jugador
  name: string,
  level: number,
  xp: number,
  gold: number,
  streak: number,
  lastActiveDate: string | null,   // 'YYYY-MM-DD'

  // Stats base
  stats: { fue, vit, des, int, vol, pre },  // numeros enteros

  // Tareas
  tasks: [],           // tareas activas (IDs o objetos - ver loadGame)
  savedTasks: [],      // IDs guardados para despues
  taskHistory: [{ taskId, date, xp, sideQuest }],

  // Inventario
  inventory: string[],             // IDs de items
  equipment: {
    weapon: string | null,
    armor: string | null,
    accessory1: string | null,
    accessory2: string | null,
    artifact: string | null
  },
  stash: string[],
  stashCapacity: 30,
  inventoryCapacityBonus: number,
  pendingLoot: null | object,
  saveVersion: number,             // actualmente 3 tras migracion

  // Clase
  classId: string | null,
  classChanges: number,

  // Quests
  quests: {
    active: string[],
    completed: string[],
    failed: string[],
    dailyReset: string | null,
    [questId]: { startedAt, objectives, currentChapter }
  },
  completedQuests: string[],       // alias legacy

  // Item system
  itemSystem: {
    version: 1,
    attunement: { [itemId]: number },
    rituals: { [itemId]: object },
    curses: { [itemId]: object },
    equipAttempts?: { [itemId]: number }
  },

  // Guild
  guild: null | { name, id, members, receipts },
  playerId: string,

  // Misc
  onboardingDone: boolean
}
```

### 4.7 `localStorage` - claves conocidas

| Clave | Contenido |
|---|---|
| `lifexp_save` | JSON de `gameState` (save principal) |
| `lifexp_save_backup_<timestamp>` | Backup automatico antes de import/reset |
| `lifexp_save_last_backup` | Clave del ultimo backup |
| `lifexp_onboarding_done` | `'true'` si el onboarding se completo |
| `lifexp_recovery_backup_v15` | Backup creado por `emergencyRerollLegacyItem` antes de modificar un slot |

---

## 5. Contratos e invariantes

> Estas reglas **no se deben romper** en ninguna actualizacion.

1. **Orden de carga de scripts** (definido en `index.html` lineas 1566-1577):
   `classes.js` -> `items.js` -> `enemies.js` -> `combat.js` -> `quests.js` -> `game.js` -> `expansion_items.js` -> `expansion_enemies.js` -> `expansion_quests.js` -> `expansion_tasks.js` -> `update2_content.js` -> `inventory_system.js` -> `ashbrand_hotfix.js` (stub).
   Cualquier nuevo fichero debe anadirse **despues** de `game.js` y **antes** de `ashbrand_hotfix.js`.

2. **IDs unicos:** cada `task.id`, `item.id`, `enemy.id` y `quest.id` debe ser unico en todo el proyecto. Los expansions usan prefijos (`casa_exp_`, `expansion_`, etc.) para evitar colisiones.

3. **`saveVersion`:** actualmente `3`. Cualquier migracion de save debe incrementar este numero y ser reversible. Nunca eliminar campos del save sin migracion explicita.

4. **`localStorage['lifexp_save']`** nunca se sobreescribe sin hacer backup previo (`backupCurrentSave()`). Las actualizaciones de contenido son aditivas (`Object.assign`), nunca destructivas.

5. **`rollDrop` es el unico punto de entrada para drops:** `game.js` llama a `window._itemsRollDrop` (alias de `rollDrop` en `items.js`). No duplicar logica de drop en otros ficheros.

6. **`gameState` es el unico estado mutable global:** no crear variables de estado paralelas. Todo cambio de estado pasa por `gameState` y termina en `saveGame()`.

7. **`inventory_system.js` es idempotente:** puede ejecutarse multiples veces sin efectos secundarios. Mantener esta propiedad en cualquier modificacion.

8. **Items en `equipment` son IDs canonicos** (claves de `ITEMS`). `inventory_system.js` es la fuente de verdad unica para aliases. Nunca guardar nombres de display en `equipment`.

9. **Maximo 3 quests activas simultaneas** (`acceptQuest` en `quests.js` lo valida; `game.js` delega a `quests.js`). No cambiar este limite sin actualizar `quests.js`.

10. **`expansion_*.js` y `update2_content.js` son aditivos:** sus funciones `install*` hacen `Object.assign` sobre las constantes base. Si un ID ya existe, se sobreescribe (comportamiento intencional para patches). Documentar explicitamente cualquier sobreescritura.

11. **El Service Worker (`sw.js`) tiene la lista de assets hardcodeada.** Cualquier fichero nuevo debe anadirse a esa lista o no se servira offline.

12. **`ITEM_FLAVOR_TEXT` en `game.js` (~L1123-1512)** debe tener una entrada por cada item equipable que tenga attunement. Sin entrada -> el juego muestra texto vacio en el modal.

13. **Aliases de items:** anadir SOLO en `inventory_system.js` (campo `aliases`). No anadir en `game.js` ni en ningun otro fichero.

14. **`inventory_system.js` no contiene fallbacks hardcodeados:** si un item no se resuelve, `emergencyRerollLegacyItem` retorna `{ success: false, reason: 'item_unresolvable' }`. Nunca sustituir un item no resolvible por otro item concreto.

---

## 6. Indice practico - donde se cambia que

| Quiero... | Fichero | Zona / Funcion |
|---|---|---|
| Anadir una tarea nueva | `game.js` o `expansion_tasks.js` | Array `DEFAULT_TASKS` (~L43) o `EXPANSION_TASKS_V1` |
| Cambiar XP/stats de una tarea existente | `game.js` | `DEFAULT_TASKS`, buscar por `id` |
| Anadir un item nuevo | `items.js` o `expansion_items.js` | Objeto `ITEMS` + entrada en `DROP_TABLES` si tiene tema |
| Anadir flavor text a un item | `game.js` | `ITEM_FLAVOR_TEXT` (~L1123) |
| Anadir un enemigo nuevo | `enemies.js` o `expansion_enemies.js` | Objeto `ENEMIES` + `EXPANSION_THEME_ENEMIES_V1` |
| Cambiar stats/drops de un enemigo | `enemies.js` | Objeto `ENEMIES`, buscar por `id` |
| Anadir una quest nueva | `quests.js` o `expansion_quests.js` | Objeto `QUESTS` o `EXPANSION_QUESTS_V1` |
| Cambiar recompensas de una quest | `quests.js` | `QUESTS[id].rewards` |
| Anadir una clase nueva | `classes.js` | `CLASS_TREE` + anadir a `branches` del padre |
| Cambiar formula de XP por nivel | `classes.js` | `xpForLevel` (~L153) |
| Cambiar formula de HP/MP/SP | `classes.js` | `calculateResources` (~L190) |
| Cambiar stats derivados | `classes.js` | `calculateDerivedStats` (~L177) |
| Anadir un skill de combate al jugador | `combat.js` | `PLAYER_SKILLS` (~L336) + `getAvailableActions` (~L390) |
| Anadir un status effect nuevo | `combat.js` | `tickCombatStatuses` (~L29), anadir `case` |
| Cambiar logica de encuentros | `combat.js` | `rollEncounter` (~L772), `getEncounterType` (~L791) |
| Cambiar capacidad de inventario | `game.js` + `items.js` | `getInventoryCapacity` en `items.js` (~L172); `stashCapacity` en `gameState` |
| Anadir un alias de item (nombre legacy) | `inventory_system.js` | campo `aliases` (fuente de verdad unica) |
| Cambiar colores de categoria/stat | `index.html` | Variables CSS `:root` (~L10-50) |
| Anadir una pantalla nueva | `index.html` + `game.js` | HTML de la pantalla + `showScreen()` (~L786) |
| Cambiar el nombre de la app / iconos PWA | `manifest.json` | Campos `name`, `short_name`, `icons` |
| Anadir un asset nuevo (para offline) | `sw.js` | Array de assets en la constante de cache (~L5-20) |
| Migrar el save a una nueva version | `game.js` | `loadGame` (~L728), incrementar `saveVersion` |
| Exportar snapshot para el Game Master | `game.js` | `exportSnapshot` (~L2468) |
| Recuperar un save corrupto manualmente | `emergency-save.html` | Standalone, abrir directamente en el navegador |
| Cambiar limite de quests activas | `quests.js` | `acceptQuest` (~L304) -- game.js delega |
| Anadir un ritual de item | `game.js` | `advanceItemRitual` (~L3893), `attemptItemActivation` (~L3905) |
| Cambiar drop rate global por rareza | `items.js` | `RARITY[x].dropRate` (~L1) |
| Recuperar un slot de inventario corrupto | consola del navegador | `emergencyRerollLegacyItem(indice)` (definido en `inventory_system.js`) |

---

## 7. Deuda tecnica detectada

| # | Descripcion | Fichero(s) | Coste estimado | Estado |
|---|---|---|---|---|
| DT-01 | ~~**`acceptQuest` duplicado**~~ **RESUELTA (Fase E -- PR #13).** game.js delega a quests.js. | `quests.js`, `game.js` | -- | Resuelta |
| DT-02 | ~~**`updateQuestProgress` duplicado**~~ **RESUELTA (Fase E -- PR #13).** Eliminada de game.js; quests.js es la unica implementacion. | `quests.js`, `game.js` | -- | Resuelta |
| DT-03 | ~~**`completeQuest` duplicado**~~ **RESUELTA (Fase E -- PR #13).** Eliminada de game.js; quests.js es la unica implementacion. | `quests.js`, `game.js` | -- | Resuelta |
| DT-04 | **`equipItem` duplicado:** version legacy en `items.js` (~L219) y version canonica en `game.js` (~L3693). | `items.js`, `game.js` | Alto | Pendiente |
| DT-05 | **`ITEM_FLAVOR_TEXT` hardcodeado en `game.js`** (~L1123-1512, ~390 lineas). Deberia estar en un fichero propio. | `game.js` | Bajo | Pendiente (Fase F) |
| DT-06 | **Lista de assets en `sw.js` hardcodeada.** Cualquier fichero nuevo olvidado rompe la PWA offline. | `sw.js` | Bajo | Aceptado (documentado) |
| DT-07 | ~~**`ashbrand_hotfix.js` era un parche de emergencia**~~ **RESUELTA (Fase D -- PR #12).** Logica absorbida por `inventory_system.js`. Stub vacio pendiente de eliminacion en Fase G. | `inventory_system.js` | -- | Resuelta |
| DT-08 | ~~**`inventory_system.js` era un IIFE sin exports explicitos**~~ **RESUELTA (Fase D -- PR #12).** Todos los simbolos publicos estan en `window.LifeXPInventory` y como globals nombrados. | `inventory_system.js` | -- | Resuelta |
| DT-09 | **`game.js` tiene 4124 lineas** - mezcla motor, UI, guild, item system, quests UI y onboarding. | `game.js` | Alto | Pendiente (Fase G) |
| DT-10 | **`window._itemsRollDrop`** es un global fragil para comunicar `items.js` -> `game.js`. | `items.js`, `game.js` | Bajo | Pendiente |
| DT-11 | **`window.LifeXPUpdate2`** en `update2_content.js` - mismo patron de global fragil. | `update2_content.js`, `game.js` | Bajo | Pendiente |
| DT-12 | **`saveVersion` en `gameState` es 2** (declaracion) pero la migracion en `loadGame` lo sube a 3. Confuso. | `game.js` | Bajo | Pendiente |
| DT-13 | **`expansion_*.js` no tienen guards de doble instalacion.** Si se llaman dos veces, `Object.assign` sobreescribe silenciosamente. | `expansion_*.js` | Bajo | Pendiente |
| DT-14 | ~~**`LEGACY_ITEM_ALIASES` en `game.js`**~~ **RESUELTA (Fase B -- PR #10).** | `inventory_system.js` | -- | Resuelta |
| DT-15 | **`emergency-save.html` no esta en la lista de assets del SW** - no funciona offline. Intencional. | `sw.js`, `emergency-save.html` | Bajo | Documentado, aceptado |
| DT-16 | ~~**Fallback hardcodeado a 'cuchilla_llameante'**~~ **RESUELTA (Fase B/C -- PR #11).** | `inventory_system.js` | -- | Resuelta |
| DT-17 | **`ashbrand_hotfix.js` stub** sigue en `index.html` y `sw.js`. Se eliminara en Fase G. | `index.html`, `sw.js`, `ashbrand_hotfix.js` | Bajo | Pendiente (Fase G) |

---

## 8. Changelog del mapa

| Fecha | Cambios | Secciones actualizadas |
|---|---|---|
| 2026-07-30 | Creacion inicial. Exploracion completa del repositorio en commit `26ed59a`. Lectura de todos los ficheros JS, HTML, JSON y expansiones. | Todas (0-7) |
| 2026-07-30 | Saneamiento Fase A completada: 11 ramas eliminadas. Repositorio reducido a 2 ramas (`main`, `backup/pre-sanitation-2026-07-30`). Anadido `PLAN_DE_ACCION.md` al inventario. Columna Estado anadida a deuda tecnica. Seccion 6 actualizada (aliases apuntan a fuente unica tras Fase B). | 0, 2, 6, 7, 8 |
| 2026-07-30 | Saneamiento Fase B completada (PR #10): `game.js` 4150->4124 lineas. `LEGACY_ITEM_ALIASES` eliminado. `resolveInventoryItemId` y `repairInventoryIdentities` delegan a `inventory_system.js`. `ashbrand_hotfix.js` delega resolucion/reparacion. DT-14 resuelta. Invariante 13 anadida. Seccion 3 actualizada (rangos game.js). Commit base actualizado a `b703adf`. | 0, 1, 2, 3, 5, 6, 7, 8 |
| 2026-07-31 | Saneamiento Fase C completada (PR #11): auditoria confirma que el fallback hardcodeado ya no existia en main (eliminado en Fase B). Solo actualizacion documental. `ashbrand_hotfix.js` actualizado en inventario (97->40 lineas reales). DT-16 anadida y resuelta. Invariante 14 anadida. | 0, 2, 5, 7, 8 |
| 2026-07-31 | Saneamiento Fase E completada (PR #13): funciones duplicadas de quests eliminadas de game.js. migrateQuestState() anade migracion de save legacy. acceptQuest/abandonQuest en game.js son delegaciones. updateQuestProgress y completeQuest eliminadas de game.js. DT-01, DT-02, DT-03 resueltas. Invariante 9 actualizada. Seccion 2 actualizada (lineas y exports). Seccion 3 actualizada (zona quests game.js). Seccion 6 actualizada (limite quests). | 0, 2, 3, 5, 6, 7, 8 |
| 2026-07-31 | Saneamiento Fase D completada (PR #12): `inventory_system.js` absorbe `normalizeItemText` y `emergencyRerollLegacyItem` de `ashbrand_hotfix.js`. BUILD actualizado a 'v15-merged-hotfix'. `ashbrand_hotfix.js` vaciado a stub de 11 lineas. DT-07 y DT-08 resueltas. DT-17 anadida. Seccion 1 actualizada. Seccion 2 actualizada (lineas y responsabilidades). Seccion 3 anadido indice de inventory_system.js. Seccion 4.7 actualizada (clave lifexp_recovery_backup_v15). Invariante 7 actualizada (ashbrand->inventory_system). Seccion 6 anadida fila emergencyRerollLegacyItem. | 0, 1, 2, 3, 4, 5, 6, 7, 8 |
