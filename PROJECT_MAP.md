# PROJECT_MAP - LifeXP RPG

> **Proposito:** mapa de referencia para el Game Master y cualquier colaborador.
> Permite localizar cualquier simbolo, modelo de datos o zona de cambio sin abrir el proyecto completo.
> **Regla de uso:** actualizar la seccion 8 (changelog) en cada PR que modifique ficheros listados aqui.

---

## 0. Metadatos

| Campo | Valor |
|---|---|
| Fecha de generacion | 2026-07-30 |
| Ultima actualizacion | 2026-07-30 (Fase B completada) |
| Branch de produccion | `main` |
| Branches activas | `main`, `backup/pre-sanitation-2026-07-30`, `refactor/unify-item-aliases` |
| Commit base | `218cb09e118920b5323598e194c1bd8f07be2ae1` |
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
`ashbrand_hotfix.js` es el ultimo script en cargarse y repara identidades de inventario corruptas de forma idempotente.
`inventory_system.js` define el subsistema canonico de inventario (resolucion de IDs, aliases, normalizacion). **Fuente de verdad unica para aliases tras Fase B.**
`combat.js` implementa el motor de combate por turnos; `classes.js` define el arbol de clases y las formulas de XP/stats.
No hay servidor: todo corre en el navegador. El Service Worker (`sw.js`) sirve la app offline con estrategia cache-first.
GitHub Pages publica `main` directamente; no hay paso de build.

---

## 2. Inventario de ficheros

| Ruta | Lineas | Responsabilidad | Exports principales | Dependencias |
|---|---|---|---|---|
| `index.html` | 1579 | Shell HTML + todo el CSS + orden de carga de scripts | (DOM) | Todos los `.js` |
| `game.js` | 4124 | Motor principal: estado, tareas, UI, combate-UI, quests-UI, guild, settings, onboarding, item-system runtime | `gameState`, `DEFAULT_TASKS`, `CATEGORIES`, `STATS`, `FREQ`, `LIFE_XP_BUILD`, todas las funciones de UI | `classes.js`, `items.js`, `enemies.js`, `combat.js`, `quests.js` |
| `items.js` | 279 | Catalogo de items, rareza, tipos, tablas de drop | `RARITY`, `ITEM_TYPE`, `ITEMS`, `DROP_TABLES`, `rollDrop`, `addToInventory`, `removeFromInventory` | (solo globals de `gameState`) |
| `enemies.js` | 614 | Catalogo de enemigos + helpers de seleccion/escalado | `ENEMIES`, `getEnemyById`, `pickRandomEnemy`, `scaleEnemy` | `items.js` (drops) |
| `combat.js` | 798 | Motor de combate por turnos: dano, skills, estados, auto-combat, recompensas | `combatState`, `initCombat`, `executePlayerAction`, `executeEnemyTurn`, `resolveAutoCombat`, `calculateCombatRewards`, `rollEncounter` | `game.js` (`gameState`, `getDerivedStats`), `enemies.js`, `items.js` |
| `classes.js` | 223 | Arbol de clases, formulas XP/nivel, stats derivados, recursos | `CLASS_TREE`, `BASE_CLASSES`, `xpForLevel`, `levelFromXp`, `calculateDerivedStats`, `calculateResources`, `getClassChain` | |
| `quests.js` | 597 | Catalogo de quests + motor de estado de quests | `QUEST_TYPE`, `QUEST_STATUS`, `QUESTS`, `initQuestState`, `acceptQuest`, `completeQuest`, `updateQuestProgress`, `applyQuestRewards` | `game.js` (`gameState`, `saveGame`) |
| `inventory_system.js` | 133 | Subsistema canonico de inventario: resolucion de IDs, aliases, normalizacion. **Fuente de verdad unica para aliases.** | `window.LifeXPInventory.resolve`, `window.LifeXPInventory.repair` | `items.js` (`ITEMS`) |
| `ashbrand_hotfix.js` | 97 | Recuperacion idempotente de identidades de inventario corruptas. Delega resolucion a `inventory_system.js`. | `normalizeItemText` (global), IIFE de reparacion | `items.js`, `game.js` (`gameState`), `inventory_system.js` |
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

### `game.js` (4124 lineas)

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
| 3263-3595 | UI Quests: `renderQuests`, `showAvailableQuests`, `acceptQuest`, `showQuestDetail`, `abandonQuest`, `updateQuestProgress`, `completeQuest` |
| 3596-3763 | Item system runtime: `initializeItemSystem`, `normalizeItemDefinition`, `getItemDefinition`, `getItemAttunement`, `equipItem`, `getEquippedItemEffects`, `unequipItem`, `renderInventoryGrid`, `renderStashGrid` |
| 3764-3789 | Alias delegation (Fase B): `resolveInventoryItemId` y `repairInventoryIdentities` - wrappers que delegan a `window.LifeXPInventory`. Fuente de verdad en `inventory_system.js`. |
| 3790-4124 | Item modal + efectos: `showItemModal`, `getItemKnowledgeState`, `isItemEffectKnown`, `discoverItemEffect`, `isItemEffectUnlocked`, `renderActivationPanel` |

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
  level: number,
  hp: number,
  maxHp: number,
  atk: number,
  def: number,
  spd: number,
  xpReward: number,
  goldReward: number,
  drops: string[],     // IDs de items posibles
  abilities: string[], // IDs de habilidades
  lore: string,
  theme: string        // tema narrativo
}
```

### 4.4 Quest (en `QUESTS`)

```js
{
  id: string,
  type: QUEST_TYPE,    // 'daily' | 'simple' | 'compound' | 'story' | 'bounty' | 'class'
  title: string,
  desc: string,
  objectives: Objective[],
  rewards: { xp, gold, items?, statBonus? },
  prerequisites?: string[],  // IDs de quests requeridas
  repeatable?: boolean,
  timeLimit?: number   // dias
}
```

### 4.5 gameState (en `game.js`)

```js
{
  playerName: string,
  class: string,
  level: number,
  xp: number,
  stats: { fue, vit, des, int, vol, pre },
  inventory: Item[],   // array de slots { id, name, ... }
  stash: Item[],
  equipped: { weapon, armor, accessory, artifact },
  gold: number,
  streak: number,
  lastTaskDate: string,
  completedTasks: {},  // { taskId: lastCompletedDate }
  quests: {},          // estado de quests activas/completadas
  lore: {},            // entradas de lore descubiertas
  acclimation: {},     // progreso de aclimatacion por categoria
  rituals: {},         // progreso de rituales de items
  saveVersion: number,
  guild: {}            // datos de guild si existe
}
```

---

## 5. Invariantes criticos

1. **`inventory_system.js` se carga antes que `ashbrand_hotfix.js`** (orden en `index.html`). Si se invierte, `window.LifeXPInventory` no existe cuando el hotfix intenta usarlo.
2. **`saveVersion`** debe incrementarse en `loadGame` cada vez que se migra el esquema del save. No cambiar el valor declarado en `gameState` sin actualizar la migracion.
3. **IDs de items son inmutables.** Cambiar un ID rompe todos los saves que tengan ese item. Si hay que renombrar, anadir un alias en `inventory_system.js`.
4. **`DEFAULT_TASKS` es inmutable en runtime.** No modificar el array despues de `loadGame`. Las tareas personalizadas van en otro array.
5. **`main` siempre desplegable.** Nunca commitear directo a `main`; siempre via PR desde rama de trabajo.
6. **Aliases de items: fuente de verdad unica en `inventory_system.js`.** `game.js` y `ashbrand_hotfix.js` delegan via `window.LifeXPInventory.resolve` y `.repair`. No anadir aliases en otros ficheros.

---

## 6. Guia rapida de cambios

| Quiero... | Fichero | Donde buscar |
|---|---|---|
| Anadir una tarea nueva | `game.js` o `expansion_tasks.js` | `DEFAULT_TASKS` o `EXPANSION_TASKS_V1` |
| Cambiar XP/stats de una tarea | `game.js` | `DEFAULT_TASKS`, buscar por `id` |
| Anadir un item nuevo | `items.js` o `expansion_items.js` | Objeto `ITEMS` o `EXPANSION_ITEMS_V1` |
| Cambiar stats de un item | `items.js` | `ITEMS[id].stats` |
| Anadir un enemigo nuevo | `enemies.js` o `expansion_enemies.js` | Objeto `ENEMIES` o `EXPANSION_ENEMIES_V1` |
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
| Anadir un alias de item (nombre legacy) | `inventory_system.js` | `aliases` (fuente de verdad unica tras Fase B) |
| Cambiar colores de categoria/stat | `index.html` | Variables CSS `:root` (~L10-50) |
| Anadir una pantalla nueva | `index.html` + `game.js` | HTML de la pantalla + `showScreen()` (~L786) |
| Cambiar el nombre de la app / iconos PWA | `manifest.json` | Campos `name`, `short_name`, `icons` |
| Anadir un asset nuevo (para offline) | `sw.js` | Array de assets en la constante de cache (~L5-20) |
| Migrar el save a una nueva version | `game.js` | `loadGame` (~L728), incrementar `saveVersion` |
| Exportar snapshot para el Game Master | `game.js` | `exportSnapshot` (~L2468) |
| Recuperar un save corrupto manualmente | `emergency-save.html` | Standalone, abrir directamente en el navegador |
| Cambiar limite de quests activas | `quests.js` + `game.js` | `acceptQuest` en ambos ficheros |
| Anadir un ritual de item | `game.js` | `advanceItemRitual` (~L3893), `attemptItemActivation` (~L3905) |
| Cambiar drop rate global por rareza | `items.js` | `RARITY[x].dropRate` (~L1) |

---

## 7. Deuda tecnica detectada

| # | Descripcion | Fichero(s) | Coste estimado | Estado |
|---|---|---|---|---|
| DT-01 | **`acceptQuest` duplicado:** existe en `quests.js` (~L304) y en `game.js` (~L3446). Pueden divergir. | `quests.js`, `game.js` | Medio | Pendiente (Fase E) |
| DT-02 | **`updateQuestProgress` duplicado:** idem, en `quests.js` (~L374) y `game.js` (~L3505). | `quests.js`, `game.js` | Medio | Pendiente (Fase E) |
| DT-03 | **`completeQuest` duplicado:** idem, en `quests.js` (~L333) y `game.js` (~L3547). | `quests.js`, `game.js` | Medio | Pendiente (Fase E) |
| DT-04 | **`equipItem` duplicado:** version legacy en `items.js` (~L219) y version canonica en `game.js` (~L3693). | `items.js`, `game.js` | Alto (riesgo de regresion en inventario) | Pendiente |
| DT-05 | **`ITEM_FLAVOR_TEXT` hardcodeado en `game.js`** (lineas 1123-1512, ~390 lineas). Deberia estar en `items.js` o en un fichero propio. | `game.js` | Bajo (mover, no refactorizar) | Pendiente (Fase F) |
| DT-06 | **Lista de assets en `sw.js` hardcodeada.** Cualquier fichero nuevo olvidado rompe la PWA offline. | `sw.js` | Bajo (anadir al array manualmente) | Pendiente |
| DT-07 | **`ashbrand_hotfix.js` es un parche de emergencia** que deberia integrarse en `inventory_system.js` y eliminarse como fichero separado. | `ashbrand_hotfix.js`, `inventory_system.js` | Medio | Pendiente (Fase D) |
| DT-08 | **`inventory_system.js` es un IIFE** que no expone sus funciones publicamente de forma explicita. Dificulta el testing y la extension. | `inventory_system.js` | Bajo-Medio | Pendiente |
| DT-09 | **`game.js` tiene 4124 lineas** - mezcla motor, UI, guild, item system, quests UI y onboarding. Candidato a split en modulos. | `game.js` | Alto (riesgo alto, beneficio alto) | Pendiente (Fase G) |
| DT-10 | **`window._itemsRollDrop`** es un global fragil para comunicar `items.js` -> `game.js`. | `items.js`, `game.js` | Bajo (renombrar o usar modulo) | Pendiente |
| DT-11 | **`window.LifeXPUpdate2`** en `update2_content.js` - mismo patron de global fragil. | `update2_content.js`, `game.js` | Bajo | Pendiente |
| DT-12 | **`saveVersion` en `gameState` es 2** (declaracion) pero la migracion en `loadGame` lo sube a 3. Confuso para futuros migradores. | `game.js` | Bajo (documentar o unificar) | Pendiente |
| DT-13 | **`expansion_*.js` no tienen guards de doble instalacion.** Si se llaman dos veces, `Object.assign` sobreescribe silenciosamente. | `expansion_*.js` | Bajo (anadir flag de instalacion) | Pendiente |
| DT-14 | **`LEGACY_ITEM_ALIASES` en `game.js`** - tres fuentes de verdad para aliases. | `game.js`, `inventory_system.js`, `ashbrand_hotfix.js` | Medio | **RESUELTA (Fase B).** `game.js` y `ashbrand_hotfix.js` delegan a `inventory_system.js`. |
| DT-15 | **`emergency-save.html` no esta en la lista de assets del SW** - no funciona offline. Puede ser intencional (herramienta de rescate), pero deberia documentarse. | `sw.js`, `emergency-save.html` | Bajo | Pendiente |

---

## 8. Changelog del mapa

| Fecha | Cambios | Secciones actualizadas |
|---|---|---|
| 2026-07-30 | Creacion inicial. Exploracion completa del repositorio en commit `26ed59a`. Lectura de todos los ficheros JS, HTML, JSON y expansiones. | Todas (0-7) |
| 2026-07-30 | Saneamiento Fase A completada: 11 ramas eliminadas. Repositorio reducido a 2 ramas activas. Anadido `PLAN_DE_ACCION.md` al inventario. Columna Estado anadida a deuda tecnica. | 0, 2, 7, 8 |
| 2026-07-30 | Saneamiento Fase B completada: `LEGACY_ITEM_ALIASES` eliminado de `game.js`; aliases delegados a `inventory_system.js`. `ashbrand_hotfix.js` limpiado. DT-14 resuelta. `game.js` pasa de 4150 a 4124 lineas. Invariante 6 anadida. | 0, 1, 2, 3, 5, 6, 7, 8 |
