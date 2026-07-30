# PROJECT_MAP — LifeXP RPG

> **Propósito:** mapa de referencia para el Game Master y cualquier colaborador.
> Permite localizar cualquier símbolo, modelo de datos o zona de cambio sin abrir el proyecto completo.
> **Regla de uso:** actualizar la sección 8 (changelog) en cada PR que modifique ficheros listados aquí.

---

## 0. Metadatos

| Campo | Valor |
|---|---|
| Fecha de generación | 2026-07-30 |
| Branch de producción | `main` |
| Branch de este mapa | `chore/project-map` |
| Commit base | `26ed59a076fef0eb16b59fefdb696434cd7b7547` |
| Build string | `LIFE_XP_BUILD = 'v13.4-equip-action-fix'` |
| Publicación | GitHub Pages — rama `main`, raíz `/` |
| URL pública | `https://final2raven-coder.github.io/lifexp/` |
| Entrada | `index.html` (SPA de una sola página) |
| PWA | `manifest.json` + `sw.js` (cache-first, lista de assets hardcodeada) |

---

## 1. Arquitectura en 10 líneas

LifeXP es una **SPA vanilla JS / PWA** sin bundler ni framework.
`index.html` contiene todo el CSS y el HTML; los scripts se cargan en orden al final del `<body>`.
El estado global vive en el objeto `gameState` (definido en `game.js`) y se persiste en `localStorage` bajo la clave `lifexp_save`.
Los datos de contenido (items, enemigos, quests, clases) son constantes declaradas en ficheros separados y consumidas por `game.js` y `combat.js` como globals.
Los ficheros `expansion_*.js` y `update2_content.js` amplían esas constantes mediante `Object.assign` al arrancar.
`ashbrand_hotfix.js` es el último script en cargarse y repara identidades de inventario corruptas de forma idempotente.
`inventory_system.js` define el subsistema canónico de inventario (resolución de IDs, aliases, normalización).
`combat.js` implementa el motor de combate por turnos; `classes.js` define el árbol de clases y las fórmulas de XP/stats.
No hay servidor: todo corre en el navegador. El Service Worker (`sw.js`) sirve la app offline con estrategia cache-first.
GitHub Pages publica `main` directamente; no hay paso de build.

---

## 2. Inventario de ficheros

| Ruta | Líneas | Responsabilidad | Exports principales | Dependencias |
|---|---|---|---|---|
| `index.html` | 1579 | Shell HTML + todo el CSS + orden de carga de scripts | — (DOM) | Todos los `.js` |
| `game.js` | 4150 | Motor principal: estado, tareas, UI, combate-UI, quests-UI, guild, settings, onboarding, item-system runtime | `gameState`, `DEFAULT_TASKS`, `CATEGORIES`, `STATS`, `FREQ`, `LIFE_XP_BUILD`, todas las funciones de UI | `classes.js`, `items.js`, `enemies.js`, `combat.js`, `quests.js` |
| `items.js` | 279 | Catálogo de items, rareza, tipos, tablas de drop | `RARITY`, `ITEM_TYPE`, `ITEMS`, `DROP_TABLES`, `rollDrop`, `addToInventory`, `removeFromInventory` | — (solo globals de `gameState`) |
| `enemies.js` | 614 | Catálogo de enemigos + helpers de selección/escalado | `ENEMIES`, `getEnemyById`, `pickRandomEnemy`, `scaleEnemy` | `items.js` (drops) |
| `combat.js` | 798 | Motor de combate por turnos: daño, skills, estados, auto-combat, recompensas | `combatState`, `initCombat`, `executePlayerAction`, `executeEnemyTurn`, `resolveAutoCombat`, `calculateCombatRewards`, `rollEncounter` | `game.js` (`gameState`, `getDerivedStats`), `enemies.js`, `items.js` |
| `classes.js` | 223 | Árbol de clases, fórmulas XP/nivel, stats derivados, recursos | `CLASS_TREE`, `BASE_CLASSES`, `xpForLevel`, `levelFromXp`, `calculateDerivedStats`, `calculateResources`, `getClassChain` | — |
| `quests.js` | 597 | Catálogo de quests + motor de estado de quests | `QUEST_TYPE`, `QUEST_STATUS`, `QUESTS`, `initQuestState`, `acceptQuest`, `completeQuest`, `updateQuestProgress`, `applyQuestRewards` | `game.js` (`gameState`, `saveGame`) |
| `inventory_system.js` | 133 | Subsistema canónico de inventario: resolución de IDs, aliases, normalización | `resolve` (interno IIFE), expone funciones via `window` | `items.js` (`ITEMS`) |
| `ashbrand_hotfix.js` | 97 | Recuperación idempotente de identidades de inventario corruptas | `normalizeItemText` (global), IIFE de reparación | `items.js`, `game.js` (`gameState`) |
| `expansion_enemies.js` | 21 | Expansión 1: 7 enemigos nuevos (niveles 1–15) | `EXPANSION_ENEMIES_V1`, `EXPANSION_THEME_ENEMIES_V1`, `installExpansionEnemies()` | `enemies.js` (`ENEMIES`) |
| `expansion_items.js` | 32 | Expansión 1: 11 items nuevos | `EXPANSION_ITEMS_V1`, `EXPANSION_DROP_TABLES_V1`, `installExpansionItems()` | `items.js` (`ITEMS`, `DROP_TABLES`) |
| `expansion_quests.js` | 24 | Expansión 1: 5 quests nuevas (daily, compound, bounty, story) | `EXPANSION_QUESTS_V1`, `installExpansionQuests()`, `updateExpansionQuestProgress()` | `quests.js` (`QUESTS`, `updateQuestProgress`) |
| `expansion_tasks.js` | 28 | Expansión 1: tareas adicionales para `DEFAULT_TASKS` | `EXPANSION_TASKS_V1`, `installExpansionTasks()` | `game.js` (`DEFAULT_TASKS`) |
| `update2_content.js` | 115 | Update 2: redefine Ashbrand con efectos/attunement + quests de Ashbrand; expone `window.LifeXPUpdate2` | `window.LifeXPUpdate2` | `items.js`, `quests.js`, `game.js` |
| `sw.js` | 61 | Service Worker PWA: cache-first, lista de assets hardcodeada | — | — |
| `manifest.json` | 24 | Manifiesto PWA: nombre, iconos, colores, display | — | — |
| `emergency-save.html` | 133 | Herramienta standalone de rescate de save: lee/escribe `localStorage` directamente | — | — (standalone) |
| `LifeXP_RPG_GDD_v2.md` | — | Game Design Document: reglas, mecánicas, narrativa | — | — |
| `LifeXP_Agent_Content_Guide_v2.md` | — | Guía operativa para el Game Master agent | — | — |

---

## 3. Índice de símbolos (ficheros grandes)

### `game.js` (4150 líneas)

| Rango aprox. | Símbolo / Sección |
|---|---|
| 1–42 | Constantes: `LIFE_XP_BUILD`, `CATEGORIES`, `STATS`, `FREQ` |
| 43–536 | `DEFAULT_TASKS` — array de tareas por defecto |
| 537–593 | `gameState` — objeto de estado global |
| 594–606 | Variables de UI: `currentTask`, `timerInterval`, etc. |
| 607–719 | Utilidades: `todayStr`, `daysBetween`, `xpForLevel`, `addXp`, `addStats`, `getTaskById`, `isTaskDue`, `getAvailableTasks`, `pickRandomTask` |
| 720–801 | Persistencia: `saveGame`, `loadGame`, `updateStreak`, `showScreen` |
| 802–946 | UI Hub: `renderHub` |
| 857–946 | UI Personaje: `renderCharacter` |
| 947–1122 | UI Inventario: `renderInventory`, `renderEquipment`, `equipItemFromInventory`, `showLegacyItemModal` |
| 1123–1512 | `ITEM_FLAVOR_TEXT` — textos de flavor por item |
| 1513–1619 | Item runtime: `getItemFlavorText`, `showAttunementFlavor`, `unequipItemToInventory`, `sellItemFromInventory`, `useConsumable` |
| 1620–1664 | Settings: `forceAppUpdate`, `renderSettings` |
| 1665–1771 | Navegación de tareas: `openRandomTask`, `openCategory`, `shuffleTask` |
| 1772–1985 | Completar tarea: `completeTask`, `finalizeCompletion`, `rollDropFromTheme`, `rollDrop`, `rollSideQuestDrop` |
| 1986–2079 | Encuentros: `pendingEncounter`, `dismissComplete`, `checkForEncounter`, `triggerEncounterAfterTask`, `startCombatFromEncounter` |
| 2080–2230 | UI Combate: `renderCombatScreen`, `renderCombatActions`, `renderCombatLog`, `executeCombatAction`, `showCombatVictory`, `showCombatDefeat`, `endCombatAndReturn` |
| 2231–2309 | Tareas guardadas/overflow: `saveForLater`, `showSavedTasks`, `showOverflowTasks` |
| 2310–2467 | Modales y UI genérica: `openModal` y helpers |
| 2468–2636 | Export/Import/Snapshot: `exportSnapshot`, `generateTaskMetrics`, `generateContentSuggestions`, `importDataText` |
| 2637–2960 | Guild: `createGuild`, `joinGuildFromReceipt`, `generateReceipt`, `processReceipt`, `renderGuild` |
| 3095–3162 | Toast/Feedback: `showFlavorDialog`, `showToast`, `showLevelUpEffect`, `triggerHaptic` |
| 3163–3262 | Onboarding: `onboardingSteps`, `showOnboarding`, `finishOnboarding` |
| 3263–3595 | UI Quests: `renderQuests`, `showAvailableQuests`, `acceptQuest`, `showQuestDetail`, `abandonQuest`, `updateQuestProgress`, `completeQuest` |
| 3596–3834 | Item system runtime: `initializeItemSystem`, `normalizeItemDefinition`, `getItemDefinition`, `getItemAttunement`, `equipItem`, `getEquippedItemEffects`, `unequipItem`, `renderInventoryGrid`, `renderStashGrid` |
| 3834–4150 | Item modal + efectos: `showItemModal`, `getItemKnowledgeState`, `isItemEffectKnown`, `discoverItemEffect`, `isItemEffectUnlocked`, `renderActivationPanel` |

### `combat.js` (798 líneas)

| Rango aprox. | Símbolo |
|---|---|
| 1–13 | `combatState = null` |
| 14–171 | Status effects: `applyStatusEffect`, `tickCombatStatuses` (burn, poison, freeze, stun, bleed, slow, fear, shield) |
| 172–191 | `applyEquipmentOnHitEffects` |
| 192–242 | `initCombat` |
| 243–335 | `calculateDamage`, `calculateHeal` |
| 336–389 | `PLAYER_SKILLS` |
| 390–438 | `getAvailableActions` |
| 439–540 | `executePlayerAction` |
| 541–623 | `executeEnemyTurn` |
| 624–663 | `resolveAutoCombat` |
| 664–728 | `calculateCombatRewards`, `applyCombatRewards` |
| 729–770 | `addCombatLog`, `getCombatLog`, `getCombatState`, `isCombatActive`, `endCombat` |
| 772–798 | `rollEncounter`, `getEncounterType` |

### `items.js` (279 líneas)

| Rango aprox. | Símbolo |
|---|---|
| 1–10 | `RARITY`, `ITEM_TYPE` |
| 11–147 | `ITEMS` — catálogo completo de items base |
| 148–171 | `DROP_TABLES` — tablas de drop por tema |
| 172–279 | Helpers: `getInventoryCapacity`, `addToContainer`, `addToInventory`, `removeFromInventory`, `equipItem` (legacy), `rollDrop`, `sellItem`; `window._itemsRollDrop = rollDrop` |

### `quests.js` (597 líneas)

| Rango aprox. | Símbolo |
|---|---|
| 1–30 | `QUEST_TYPE`, `QUEST_STATUS` |
| 31–256 | `QUESTS` — catálogo: dailies, simples, compuestas, bounties, story arcs |
| 257–373 | Estado: `initQuestState`, `getActiveQuests`, `getAvailableQuests`, `acceptQuest`, `abandonQuest`, `completeQuest`, `failQuest` |
| 374–563 | Progreso: `updateQuestProgress`, `checkQuestCompletion`, `applyQuestRewards`, `checkDailyQuestReset`, `getQuestProgress` |
| 564–597 | Helpers UI: `getQuestTypeInfo`, `formatObjective` |

### `classes.js` (223 líneas)

| Rango aprox. | Símbolo |
|---|---|
| 5–146 | `CLASS_TREE` — árbol completo (tiers 1–4, 6 ramas base) |
| 147–152 | `BASE_CLASSES` |
| 153–176 | Fórmulas: `xpForLevel`, `levelFromXp`, `xpToNextLevel`, `xpProgressInLevel` |
| 177–230 | `calculateDerivedStats`, `calculateResources`, `getAvailableClassChanges`, `getClassChain`, `getTierName` |

---

## 4. Modelos de datos

### 4.1 Task (en `DEFAULT_TASKS` / `EXPANSION_TASKS_V1`)

```js
{
  id: string,          // único, ej: 'casa_1'
  cat: string,         // 'casa' | 'cuerpo' | 'gestiones' | 'social' | 'personal'
  name: string,
  freq: string,        // 'daily' | 'weekly' | 'biweekly' | 'monthly' | 'quarterly' | 'biannual' | 'annual'
  desc: string,        // descripción práctica para el jugador
  stats: { fue?, vit?, des?, int?, vol?, pre? },  // valores 0–100 (se dividen /10 para puntos)
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
  timeLimit?: number,     // días (bounties)
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
  stats: { fue, vit, des, int, vol, pre },  // números enteros

  // Tareas
  tasks: [],           // tareas activas (IDs o objetos — ver loadGame)
  savedTasks: [],      // IDs guardados para después
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
  saveVersion: number,             // actualmente 3 tras migración

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

### 4.7 `localStorage` — claves conocidas

| Clave | Contenido |
|---|---|
| `lifexp_save` | JSON de `gameState` (save principal) |
| `lifexp_save_backup_<timestamp>` | Backup automático antes de import/reset |
| `lifexp_save_last_backup` | Clave del último backup |
| `lifexp_onboarding_done` | `'true'` si el onboarding se completó |

---

## 5. Contratos e invariantes

> Estas reglas **no se deben romper** en ninguna actualización.

1. **Orden de carga de scripts** (definido en `index.html` líneas 1566–1577):
   `classes.js` → `items.js` → `enemies.js` → `combat.js` → `quests.js` → `game.js` → `expansion_items.js` → `expansion_enemies.js` → `expansion_quests.js` → `expansion_tasks.js` → `update2_content.js` → `ashbrand_hotfix.js`.
   Cualquier nuevo fichero debe añadirse **después** de `game.js` y **antes** de `ashbrand_hotfix.js` (que siempre va último).

2. **IDs únicos:** cada `task.id`, `item.id`, `enemy.id` y `quest.id` debe ser único en todo el proyecto. Los expansions usan prefijos (`casa_exp_`, `expansion_`, etc.) para evitar colisiones.

3. **`saveVersion`:** actualmente `3`. Cualquier migración de save debe incrementar este número y ser reversible. Nunca eliminar campos del save sin migración explícita.

4. **`localStorage['lifexp_save']`** nunca se sobrescribe sin hacer backup previo (`backupCurrentSave()`). Las actualizaciones de contenido son aditivas (`Object.assign`), nunca destructivas.

5. **`rollDrop` es el único punto de entrada para drops:** `game.js` llama a `window._itemsRollDrop` (alias de `rollDrop` en `items.js`). No duplicar lógica de drop en otros ficheros.

6. **`gameState` es el único estado mutable global:** no crear variables de estado paralelas. Todo cambio de estado pasa por `gameState` y termina en `saveGame()`.

7. **`ashbrand_hotfix.js` es idempotente:** puede ejecutarse múltiples veces sin efectos secundarios. Mantener esta propiedad en cualquier modificación.

8. **Items en `equipment` son IDs canónicos** (claves de `ITEMS`). `inventory_system.js` y `ashbrand_hotfix.js` garantizan la resolución de aliases. Nunca guardar nombres de display en `equipment`.

9. **Máximo 3 quests activas simultáneas** (`acceptQuest` en `quests.js` y `game.js` lo validan). No cambiar este límite sin actualizar ambos ficheros.

10. **`expansion_*.js` y `update2_content.js` son aditivos:** sus funciones `install*` hacen `Object.assign` sobre las constantes base. Si un ID ya existe, se sobreescribe (comportamiento intencional para patches). Documentar explícitamente cualquier sobreescritura.

11. **El Service Worker (`sw.js`) tiene la lista de assets hardcodeada.** Cualquier fichero nuevo debe añadirse a esa lista o no se servirá offline.

12. **`ITEM_FLAVOR_TEXT` en `game.js` (líneas 1123–1512)** debe tener una entrada por cada item equipable que tenga attunement. Sin entrada → el juego muestra texto vacío en el modal.

---

## 6. Índice práctico — dónde se cambia qué

| Quiero… | Fichero | Zona / Función |
|---|---|---|
| Añadir una tarea nueva | `game.js` o `expansion_tasks.js` | Array `DEFAULT_TASKS` (~L43) o `EXPANSION_TASKS_V1` |
| Cambiar XP/stats de una tarea existente | `game.js` | `DEFAULT_TASKS`, buscar por `id` |
| Añadir un item nuevo | `items.js` o `expansion_items.js` | Objeto `ITEMS` + entrada en `DROP_TABLES` si tiene tema |
| Añadir flavor text a un item | `game.js` | `ITEM_FLAVOR_TEXT` (~L1123) |
| Añadir un enemigo nuevo | `enemies.js` o `expansion_enemies.js` | Objeto `ENEMIES` + `EXPANSION_THEME_ENEMIES_V1` |
| Cambiar stats/drops de un enemigo | `enemies.js` | Objeto `ENEMIES`, buscar por `id` |
| Añadir una quest nueva | `quests.js` o `expansion_quests.js` | Objeto `QUESTS` o `EXPANSION_QUESTS_V1` |
| Cambiar recompensas de una quest | `quests.js` | `QUESTS[id].rewards` |
| Añadir una clase nueva | `classes.js` | `CLASS_TREE` + añadir a `branches` del padre |
| Cambiar fórmula de XP por nivel | `classes.js` | `xpForLevel` (~L153) |
| Cambiar fórmula de HP/MP/SP | `classes.js` | `calculateResources` (~L190) |
| Cambiar stats derivados | `classes.js` | `calculateDerivedStats` (~L177) |
| Añadir un skill de combate al jugador | `combat.js` | `PLAYER_SKILLS` (~L336) + `getAvailableActions` (~L390) |
| Añadir un status effect nuevo | `combat.js` | `tickCombatStatuses` (~L29), añadir `case` |
| Cambiar lógica de encuentros | `combat.js` | `rollEncounter` (~L772), `getEncounterType` (~L791) |
| Cambiar capacidad de inventario | `game.js` + `items.js` | `getInventoryCapacity` en `items.js` (~L172); `stashCapacity` en `gameState` |
| Añadir un alias de item (nombre legacy) | `inventory_system.js` + `ashbrand_hotfix.js` | `aliases` / `ALIASES` en ambos ficheros |
| Cambiar colores de categoría/stat | `index.html` | Variables CSS `:root` (~L10–50) |
| Añadir una pantalla nueva | `index.html` + `game.js` | HTML de la pantalla + `showScreen()` (~L786) |
| Cambiar el nombre de la app / iconos PWA | `manifest.json` | Campos `name`, `short_name`, `icons` |
| Añadir un asset nuevo (para offline) | `sw.js` | Array de assets en la constante de caché (~L5–20) |
| Migrar el save a una nueva versión | `game.js` | `loadGame` (~L728), incrementar `saveVersion` |
| Exportar snapshot para el Game Master | `game.js` | `exportSnapshot` (~L2468) |
| Recuperar un save corrupto manualmente | `emergency-save.html` | Standalone, abrir directamente en el navegador |
| Cambiar límite de quests activas | `quests.js` + `game.js` | `acceptQuest` en ambos ficheros |
| Añadir un ritual de item | `game.js` | `advanceItemRitual` (~L3893), `attemptItemActivation` (~L3905) |
| Cambiar drop rate global por rareza | `items.js` | `RARITY[x].dropRate` (~L1) |

---

## 7. Deuda técnica detectada

| # | Descripción | Fichero(s) | Coste estimado |
|---|---|---|---|
| DT-01 | **`acceptQuest` duplicado:** existe en `quests.js` (~L304) y en `game.js` (~L3446). Pueden divergir. | `quests.js`, `game.js` | Medio (refactor + tests manuales) |
| DT-02 | **`updateQuestProgress` duplicado:** ídem, en `quests.js` (~L374) y `game.js` (~L3505). | `quests.js`, `game.js` | Medio |
| DT-03 | **`completeQuest` duplicado:** ídem, en `quests.js` (~L333) y `game.js` (~L3547). | `quests.js`, `game.js` | Medio |
| DT-04 | **`equipItem` duplicado:** versión legacy en `items.js` (~L219) y versión canónica en `game.js` (~L3693). | `items.js`, `game.js` | Alto (riesgo de regresión en inventario) |
| DT-05 | **`ITEM_FLAVOR_TEXT` hardcodeado en `game.js`** (líneas 1123–1512, ~390 líneas). Debería estar en `items.js` o en un fichero propio. | `game.js` | Bajo (mover, no refactorizar) |
| DT-06 | **Lista de assets en `sw.js` hardcodeada.** Cualquier fichero nuevo olvidado rompe la PWA offline. | `sw.js` | Bajo (añadir al array manualmente) |
| DT-07 | **`ashbrand_hotfix.js` es un parche de emergencia** que debería integrarse en `inventory_system.js` y eliminarse como fichero separado. | `ashbrand_hotfix.js`, `inventory_system.js` | Medio |
| DT-08 | **`inventory_system.js` es un IIFE** que no expone sus funciones públicamente de forma explícita. Dificulta el testing y la extensión. | `inventory_system.js` | Bajo-Medio |
| DT-09 | **`game.js` tiene 4150 líneas** — mezcla motor, UI, guild, item system, quests UI y onboarding. Candidato a split en módulos. | `game.js` | Alto (riesgo alto, beneficio alto) |
| DT-10 | **`window._itemsRollDrop`** es un global frágil para comunicar `items.js` → `game.js`. | `items.js`, `game.js` | Bajo (renombrar o usar módulo) |
| DT-11 | **`window.LifeXPUpdate2`** en `update2_content.js` — mismo patrón de global frágil. | `update2_content.js`, `game.js` | Bajo |
| DT-12 | **`saveVersion` en `gameState` es 2** (declaración) pero la migración en `loadGame` lo sube a 3.** Confuso para futuros migradores. | `game.js` | Bajo (documentar o unificar) |
| DT-13 | **`expansion_*.js` no tienen guards de doble instalación.** Si se llaman dos veces, `Object.assign` sobreescribe silenciosamente. | `expansion_*.js` | Bajo (añadir flag de instalación) |
| DT-14 | **`LEGACY_ITEM_ALIASES` en `game.js` (~L3772)** duplica parcialmente los aliases de `inventory_system.js` y `ashbrand_hotfix.js`. Tres fuentes de verdad para aliases. | `game.js`, `inventory_system.js`, `ashbrand_hotfix.js` | Medio |
| DT-15 | **`emergency-save.html` no está en la lista de assets del SW** — no funciona offline. Puede ser intencional (herramienta de rescate), pero debería documentarse. | `sw.js`, `emergency-save.html` | Bajo |

---

## 8. Changelog del mapa

| Fecha | Cambios | Secciones actualizadas |
|---|---|---|
| 2026-07-30 | Creación inicial. Exploración completa del repositorio en commit `26ed59a`. Lectura de todos los ficheros JS, HTML, JSON y expansiones. | Todas (0–7) |
