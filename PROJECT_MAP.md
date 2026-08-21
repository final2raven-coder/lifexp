# PROJECT_MAP - LifeXP RPG

> **Proposito:** mapa de referencia para el Game Master y cualquier colaborador.
> Permite localizar cualquier simbolo, modelo de datos o zona de cambio sin abrir el proyecto completo.
> **Regla obligatoria:** este fichero debe actualizarse en el mismo PR que cualquier cambio estructural, de ficheros, simbolos, modelos de datos o invariantes que afecte al proyecto.
> **Regla de uso:** actualizar la seccion 8 (changelog) en cada PR que modifique ficheros listados aqui.

---

## 0. Metadatos

| Campo | Valor |
|---|---|
| Fecha de generacion | 2026-07-30 |
| Ultima actualizacion | 2026-08-21 (`fix/task-result-navigation-manual` -- resultados persistentes y navegacion segura, Fase 2A) |
| Branch de produccion | `main` |
| Branches existentes verificados | `main`, `backup/pre-sanitation-2026-07-30`, `chore/dt15-project-map-sync`, `fix/rewards-contract`, `fix/quest-ui-modal-wrappers`, `fix/rewards-recoverable`, `fix/task-result-navigation-manual` |
| Tags de backup existentes verificados | Ninguno visible en el repositorio; la copia de seguridad disponible es la rama `backup/pre-sanitation-2026-07-30` |
| Ramas historicas citadas | Las ramas de PR integradas o eliminadas se conservan unicamente en el changelog; no son ramas activas |
| Commit de `main` verificado | `123681c2f326074fe3d3a170961bac7917caef3b` |
| Commit de la rama de backup | `218cb09e118920b5323598e194c1bd8f07be2ae1` |
| Build string | `LIFE_XP_BUILD = 'v13.6-inventory-language-boundary'` |
| Publicacion | GitHub Pages - rama `main`, raiz `/` |
| URL publica | `https://final2raven-coder.github.io/lifexp/` |
| Entrada | `index.html` (SPA de una sola pagina) |
| PWA | `manifest.json` + `sw.js` (cache-first, CACHE_NAME = lifexp-v22, sincronizado con index.html via validador check 10) |

---

## 1. Arquitectura en 10 lineas

LifeXP es una **SPA vanilla JS / PWA** sin bundler ni framework.
`index.html` contiene todo el CSS y el HTML; los scripts se cargan en orden al final del `<body>`.
El estado global vive en el objeto `gameState` (definido en `engine.js`) y se persiste en `localStorage` bajo la clave `lifexp_save`; el loader actual migra saves versionados de forma secuencial hasta `saveVersion: 3`.
Los datos de contenido (items, enemigos, quests, clases) son constantes declaradas en ficheros separados y consumidas por `engine.js` y `combat.js` como globals.
Los ficheros `expansion_*.js` exponen instaladores declarativos y `update2_content.js` valida su orden de carga, los ejecuta explicitamente, comprueba la instalacion completa antes de marcar la actualizacion y revierte catalogos, estado en memoria y save si falla cualquier paso.
`inventory_system.js` define el subsistema canonico de inventario, expone `normalizeItemText` y `emergencyRerollLegacyItem`, hace repair() al arrancar y concentra la entrega estructurada de recompensas mediante `LifeXPInventory.deliverReward()`.
`item_system.js` gestiona attunement, rituales, curses, modales de item, knowledge system y activation panel. Los mensajes del dominio de objetos se muestran en ingles; las tareas y el flujo del mundo real conservan el espanol.
`item_flavor.js` contiene el lore narrativo de items (flavor text por item y por stage de attunement).
`guild.js` implementa el sistema cooperativo (receipts, sync, guild state).
`main.js` es el punto de entrada: registra el Service Worker y conecta los event listeners del DOM.

> **NOTA:** `game.js` ya NO existe. El estado global (`gameState`) y las funciones de motor viven en `engine.js` desde el refactor de split (DT-09 resuelto).

---

## 2. Inventario de ficheros

Los tamanos son bytes del arbol de `main` verificado el 2026-08-18; no son estimaciones de lineas.

### 2a. Ficheros de motor y UI

| Fichero | Bytes | Responsabilidad principal | Exports / globals clave |
|---|---:|---|---|
| `index.html` | 43838 | CSS completo + HTML de todas las pantallas + orden de carga de scripts | -- |
| `engine.js` | 30792 | `gameState`, schema canonico, contrato durable de recompensas, migraciones transaccionales v0->v3, snapshots pre-migracion, rollback, `updateStreak`, `showScreen` y resultado pendiente de tarea | `gameState`, `saveGame`, `loadGame`, `addXp`, `addStats`, `getAvailableTasks`, `showScreen`, `CURRENT_SAVE_VERSION`, `normalizePendingLootState`, `cloneSaveState` |
| `combat.js` | 30528 | Logica de combate, calculo idempotente de recompensas y entrega durable de drops | `initCombat`, `executePlayerAction`, `executeEnemyTurn`, `calculateCombatRewards`, `applyCombatRewards` |
| `guild.js` | 11298 | Sistema cooperativo: receipts, sync, guild state | `generateReceipt`, `applyReceipt`, `renderGuild` |
| `inventory_system.js` | 17410 | Subsistema canonico de inventario, entrega estructurada de recompensas, cola de pendientes y repair al arrancar | `LifeXPInventory`, `normalizeItemText`, `emergencyRerollLegacyItem`, `deliverReward`, `getPendingLoot`, `retryPendingLoot`, `renderInventory`, `renderCanonicalInventory`, `renderCanonicalStash` |
| `item_system.js` | 32396 | Attunement, rituales, curses, modales de item, knowledge system, activation panel y narrativa declarativa de fallos de equipamiento | `initializeItemSystem`, `equipItem`, `unequipItem`, `showItemModal`, `getActiveItemEffects`, `renderActivationPanel`, `getItemRequirementNarrative` |
| `main.js` | 7560 | Punto de entrada: event listeners, registro del Service Worker y sincronizacion History API de pantallas/modales | `initializeLifeXPHistory`, `syncLifeXPScreenHistory`, `pushTaskResultHistory`, `closeTaskResultModal`, `handleLifeXPBackNavigation` |

### 2b. Ficheros de UI (pantallas)

| Fichero | Bytes | Pantalla / zona | Funciones clave |
|---|---:|---|---|
| `ui_hub.js` | 16403 | Hub principal, inventario, equipamiento, settings; deriva los fallos de equipamiento al narrador de requisitos | `renderHub`, `renderCharacter`, `renderInventory`, `renderEquipment`, `equipItemFromInventory`, `unequipItemToInventory`, `useConsumable`, `renderSettings` |
| `ui_tasks.js` | 20380 | Pantalla de tarea, completado, drops, encuentros y persistencia/recuperacion de `pendingTaskResult` | `openRandomTask`, `openCategory`, `completeTask`, `finalizeCompletion`, `presentPendingTaskResult`, `restorePendingTaskResult`, `dismissComplete` |
| `ui_combat.js` | 11288 | UI de combate, encuentros y feedback estructurado de recompensas | `renderCombatScreen`, `startCombatFromEncounter`, `showCombatVictory`, `showCombatDefeat` |
| `ui_misc.js` | 12642 | Mapa, gremio, lore, clase y quests rapidas | `renderMap`, `renderGuildScreen`, `renderLore`, `renderClass`, `renderQuickQuests` |
| `ui_quests.js` | 9575 | Lista y detalle de quests | `renderQuests`, `showQuestDetail`, `acceptQuest`, `abandonQuest` |
| `ui_feedback.js` | 5518 | Feedback visual de recompensas, drops y progresion | `showRewardFeedback`, `showDropFeedback`, `showLevelUp` |

### 2c. Ficheros de datos (contenido)

| Fichero | Bytes | Contenido | Global principal |
|---|---:|---|---|
| `classes.js` | 21975 | 6 clases y arbol de progresion de 102 nodos | `CLASS_TREE` |
| `items.js` | 28242 | 87 items base, rarezas, tipos y tablas de drops | `ITEMS`, `RARITY`, `ITEM_TYPE`, `DROP_TABLES` |
| `enemies.js` | 20920 | 85 enemigos base y tablas tematicas | `ENEMIES`, `THEME_ENEMIES` |
| `quests.js` | 27978 | 33 quests base + aliases canonicos de UI | `QUESTS`, `acceptQuestCanonical`, `abandonQuestCanonical` |
| `data_tasks.js` | 20277 | 41 tareas base | `DEFAULT_TASKS` |
| `item_flavor.js` | 44397 | Flavor text narrativo de 87 items (lore + attunement stages) | `ITEM_FLAVOR` |

### 2d. Ficheros de expansion y actualizaciones

| Fichero | Bytes | Contenido | Efecto de carga |
|---|---:|---|---|
| `expansion_items.js` | 28107 | Expansion declarativa de items | `Object.assign(ITEMS, EXPANSION_ITEMS_V1)` |
| `expansion_enemies.js` | 3699 | Expansion declarativa de enemigos | `Object.assign(ENEMIES, EXPANSION_ENEMIES_V1)` |
| `expansion_quests.js` | 3089 | Expansion declarativa de quests | `Object.assign(QUESTS, EXPANSION_QUESTS_V1)` |
| `expansion_tasks.js` | 7425 | Expansion declarativa de tareas | `DEFAULT_TASKS.push(...)` |
| `update2_content.js` | 19649 | Instalacion transaccional de Update 2, validacion de referencias de recompensas y rollback | IIFE idempotente con backup y commit verificable |

### 2e. Ficheros de soporte / PWA

| Fichero | Bytes | Responsabilidad |
|---|---:|---|
| `manifest.json` | 530 | Metadatos PWA e iconos |
| `sw.js` | 2005 | Service Worker cache-first; `CACHE_NAME = lifexp-v22` |
| `emergency-save.html` | 5646 | Herramienta de recuperacion manual del save |
| `icon-192.png` | 1447 | Icono PWA 192 px |
| `icon-512.png` | 3708 | Icono PWA 512 px |

### 2f. Herramientas de desarrollo (no se cargan en produccion)

| Fichero | Bytes | Responsabilidad |
|---|---:|---|
| `validate_content.js` | 18409 | Validador de integridad de contenido, solo lectura |
| `tests/save_migrations.test.js` | 11790 | Fixtures y pruebas de migraciones de save |
| `tests/update2_transaction.test.js` | 10166 | Pruebas transaccionales de Update 2 y referencias de recompensas |
| `.github/workflows/ci.yml` | 1427 | CI de sintaxis JS y suites runtime |
| `docs/DROP_MAPPING.md` | 22020 | Inventario y trazabilidad de referencias de drops |
| `docs/SAVE_MIGRATION.md` | 9117 | Contrato y procedimiento de migracion/recuperacion de saves |

## 3. Modelo de datos: `gameState`

Definido en `engine.js`. Persistido en `localStorage` clave `lifexp_save`. Version actual: `saveVersion: 3`.

```
gameState {
  // Jugador
  name: string
  level: number
  xp: number
  gold: number
  streak: number
  lastActiveDate: string | null

  // Stats (6 atributos)
  stats: { fue, vit, des, int, vol, pre }  // base 10 cada uno

  // Tareas
  tasks: Task[]           // pool activo
  savedTasks: string[]    // IDs guardados para despues
  taskHistory: { taskId, date, xp, sideQuest }[]

  // Inventario
  inventory: ItemInstance[]
  equipment: { weapon, armor, accessory1, accessory2, artifact }  // null o ItemInstance
  stash: ItemInstance[]
  stashCapacity: number   // default 30
  inventoryCapacityBonus: number
  pendingLoot: { version: 1, entries: PendingReward[] }
  rewardLedger: { [claimId]: RewardLedgerEntry }

  // Clase
  classId: string         // default 'novato'
  classLevel: number

  // Quests
  activeQuests: QuestState[]
  completedQuests: string[]  // IDs

  // Guild / Coop
  guildId: string | null
  guildName: string | null
  guildMembers: { name, id, lastSync }[]
  pendingReceipts: Receipt[]
  receivedReceipts: Receipt[]

  // Item system
  itemSystem: {
    version: number
    attunement: { [itemId]: { count, stage } }
    rituals: { [itemId]: RitualState }
    curses: { [itemId]: CurseState }
  }

  // Lore / aclimatacion / rituales (campos adicionales del save)
  loreUnlocked: string[]
  acclimation: { [key]: number }
  saveVersion: number     // 3 = version canonica actual
}
```

### Migraciones de save

| De version | A version | Que hace |
|---|---|---|
| < 1 | 1 | Inicializa campos de inventario |
| 1 | 2 | Inicializa `itemSystem` |
| 2 | 3 | Inicializa `guildId`, `guildName`, `guildMembers`, `pendingReceipts`, `receivedReceipts` |

Logica de migracion en `engine.js` -> funcion `migrateQuestState()` y bloque de migracion en `loadGame()`.

---

## 4. Modelos de datos: contenido

### Task

```
{
  id: string          // unico, snake_case
  cat: string         // 'casa' | 'cuerpo' | 'personal' | 'gestiones' | 'social'
  name: string
  freq: string        // 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'once'
  desc: string
  stats: { [stat]: number }
  xp: number
  drops?: { theme: string, items: string[] }
  sideQuest?: { desc, stats, xp, drops, dropBonus }
}
```

### Item (definicion en ITEMS)

```
{
  id: string
  name: string
  type: 'weapon' | 'armor' | 'accessory' | 'artifact' | 'consumable' | 'material' | 'skill' | 'key'
  rarity: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary'
  icon: string
  desc: string
  lore?: string
  stats?: { [stat]: number }
  value: number
  themes?: string[]
  effects?: Effect[]
  attunement?: AttunementDef
  consumable?: ConsumableDef
}
```

### Enemy (definicion en ENEMIES)

```
{
  id: string
  name: string
  level: number
  hp: number
  attack: number
  defense: number
  xp: number
  gold: number
  drops?: string[]
  rank?: string
  themes?: string[]
}
```

### Quest (definicion en QUESTS)

```
{
  id: string
  type: string
  name: string
  desc: string
  minLevel?: number
  objective: { ... }
  reward: { xp, gold, items? }
  setting?: string
  lore?: string
}
```

---

## 5. Orden de carga de scripts (index.html, lineas 1373-1395)

El orden es estricto: cada fichero depende de los anteriores como globals.

```
1.  classes.js          -- CLASS_TREE (sin dependencias)
2.  items.js            -- ITEMS, RARITY, ITEM_TYPE, DROP_TABLES
3.  enemies.js          -- ENEMIES
4.  combat.js           -- logica de combate (depende de ENEMIES, ITEMS)
5.  quests.js           -- QUESTS (depende de ITEMS, ENEMIES)
6.  item_flavor.js      -- ITEM_FLAVOR (depende de ITEMS)
7.  data_tasks.js       -- DEFAULT_TASKS (sin dependencias de datos)
8.  engine.js           -- gameState, motor (depende de todos los datos)
9.  expansion_items.js  -- EXPANSION_ITEMS_V1 -> Object.assign(ITEMS, ...)
10. expansion_enemies.js-- EXPANSION_ENEMIES_V1 -> Object.assign(ENEMIES, ...)
11. expansion_quests.js -- EXPANSION_QUESTS_V1 -> Object.assign(QUESTS, ...)
12. expansion_tasks.js  -- EXPANSION_TASKS_V1 -> DEFAULT_TASKS.push(...)
13. update2_content.js  -- IIFE: patches narrativos + instala Ashbrand si falta; rollback transaccional si falla
14. inventory_system.js -- LifeXPInventory, repair() al arrancar
15. ui_hub.js           -- UI del hub, inventario, equipamiento
16. ui_tasks.js         -- UI de tareas
17. ui_combat.js        -- UI de combate, encuentros y feedback de post-tarea
18. ui_misc.js          -- UI miscelanea (mapa, gremio, lore, clase, quests rapidas)
19. guild.js            -- Sistema de gremio (receipts, sync, guild state)
20. ui_feedback.js      -- Toasts y feedback visual
21. ui_quests.js        -- UI de quests
22. item_system.js      -- Sistema de items (attunement, rituales, modales)
23. main.js             -- Punto de entrada (event listeners, SW)
```

---

### 5b. Procedimiento para anadir un fichero nuevo

1. Crear el fichero en una rama propia.
2. Anadir su `<script src="...">` en `index.html` en el punto correcto del orden de carga.
3. Anadir la misma ruta a `urlsToCache` en `sw.js`.
4. Incrementar `CACHE_NAME` en `sw.js`. 
5. Actualizar este mapa en el mismo PR.
6. Ejecutar `node --check` y las suites de CI antes de abrir el PR.

### 5c. Como anadir contenido (formato declarativo Fase 3)

Las nuevas tareas, items, enemigos y quests deben anadirse como datos en los ficheros `expansion_*.js`, no mediante ramas especiales en el motor. Cada expansion publica un objeto o una lista con IDs nuevos y estables, y el instalador existente la incorpora al catalogo correspondiente (`Object.assign` para catalogos y `push` para tareas). Mantener el formato de los catalogos base, usar IDs `snake_case`, referenciar drops por ID canonico y no duplicar IDs existentes.

Para una nueva actualizacion de contenido:

1. Elegir la expansion declarativa adecuada: `expansion_items.js`, `expansion_enemies.js`, `expansion_quests.js` o `expansion_tasks.js`.
2. Definir cada entrada con todos los campos requeridos por su modelo y conectar las referencias a IDs ya existentes o definidos en el mismo bloque.
3. Si el contenido necesita una regla nueva, comprobar primero si puede expresarse como propiedad declarativa; no anadir un caso especial hardcodeado al motor.
4. Actualizar las tablas de trazabilidad y este mapa si cambian cantidades, modelos, orden de carga o invariantes.
5. Verificar sintaxis, referencias, IDs unicos, instalacion idempotente y compatibilidad con saves existentes.

El contenido nuevo debe formar una red pequena y coherente entre tareas, objetos, enemigos y quests; no se deben anadir listas aisladas que no tengan conexiones jugables.

> **Nota historica:** los IDs `DT-*` se reutilizaron en distintas fases del saneamiento; cuando un mismo ID tiene mas de un significado, este registro conserva ambos PRs y lo indica expresamente.

## 5d. Resultado de tarea y navegacion segura (Fase 2A)

`gameState.pendingTaskResult` es el registro durable del resultado que aun debe mostrarse o confirmarse. `ui_tasks.js` no muestra el resultado antes de persistirlo: una decision de side quest se guarda como `awaiting_side_quest` y una finalizacion completa como `ready`.

El resultado `ready` conserva los valores mostrables y el resumen de drop; `dismissComplete()` solo lo elimina despues de guardar de nuevo el estado. Si ese guardado falla, el resultado permanece protegido y el jugador puede reintentarlo. `finalizeCompletion()` toma un snapshot en memoria y restaura el estado si no puede persistir los cambios.

`main.js` mantiene una entrada de History API para la pantalla y otra para el modal de resultado. El boton atras, `Escape` y el cierre por fondo cierran primero el modal; la navegacion no puede descartar silenciosamente un resultado pendiente. El foco inicial y el tabulado quedan contenidos en el dialogo mientras esta abierto.

## 6. Invariantes criticos

1. **`gameState` es el unico estado mutable.** Ningun fichero de datos (ITEMS, ENEMIES, QUESTS, etc.) se modifica en runtime salvo por las expansiones al arrancar (antes de `loadGame`).
2. **`saveVersion: 3` es la version canonica.** Cualquier migracion futura incrementa este numero y anade un bloque en `loadGame`.
3. **Los IDs son unicos y estables.** Un ID de item, enemigo, quest o tarea nunca cambia una vez publicado. Cambiar un ID rompe saves existentes.
4. **Las expansiones son aditivas e idempotentes.** `Object.assign` y `push` no sobreescriben entradas existentes con el mismo ID (las expansiones usan IDs nuevos).
5. **`update2_content.js` es una IIFE transaccional.** Se auto-ejecuta al cargarse; comprueba si ya se aplico antes de actuar; si falla un instalador o cualquier paso posterior restaura catalogos, `gameState` y `lifexp_save`; una instalacion correcta es idempotente. La validacion bloqueante recorre tablas de drops, enemigos, tareas, side quests, recompensas de quests y capitulos antes de guardar.
6. **`inventory_system.js` hace repair() al arrancar.** Normaliza items legacy del save antes de que la UI los renderice. Las recompensas pasan por `LifeXPInventory.deliverReward()`, que resuelve IDs, confirma insercion real y conserva entregas `pending` o `rejected` para recuperacion.
7. **`main` siempre desplegable.** Nunca se comitea directamente a `main`. Todo cambio va por rama + PR.
8. **No hay `game.js`.** El fichero fue eliminado en el refactor de split. Cualquier referencia a `game.js` en documentacion antigua es incorrecta.
9. **Los IDs de contenido son `snake_case` puro (`^[a-z0-9_]+$`).** Cualquier string con espacios, mayusculas o acentos en un campo de ID es un error detectable por el validador.
10. **`sw.js` y `index.html` deben estar sincronizados.** Cada `<script src="...">` en `index.html` debe tener su entrada en `urlsToCache` de `sw.js`. El validador (check 10, `SW_MISSING_ASSET`) lo detecta como error bloqueante.
11. **Version de cache incremental.** Al anadir o eliminar cualquier fichero de la app, incrementar `CACHE_NAME` en `sw.js` (`lifexp-v21` -> `lifexp-v22`, etc.) para forzar actualizacion en clientes existentes.
12. **Contrato de recompensas durable.** `pendingLoot` usa `{ version: 1, entries: [] }` y acepta formatos legacy al cargar; `rewardLedger` registra `claimId` y estados para que las entregas sean idempotentes. `ui_tasks.js` y `combat.js` conectan tareas, side quests y combate a `LifeXPInventory.deliverReward()`; la instalacion transaccional bloquea referencias de drops no canonicas o ausentes antes del commit.

---

## 7. Registro de deuda tecnica

Estados verificados contra `main` y la historia de PRs disponible el 2026-08-18. Los items abiertos conservan owner y siguiente accion.

| ID | Descripcion | Prioridad | Estado real | PR de cierre / siguiente accion |
|---|---|---|---|---|
| DT-01 | Lista de assets del Service Worker mantenida manualmente. | -- | **CERRADO** | PR #23 (`fix/sw-assets`): el validador comprueba la sincronizacion `index.html`/`sw.js` y se incrementa la cache. La rama ya no existe. |
| DT-02 | IDs no canonicos en tablas de drops y compatibilidad de lectura para valores legacy. | -- | **CERRADO** | PR #29 (`fix: migrate drop-table item IDs to canonical ASCII`) corrigio `DROP_TABLES` y preservo aliases de lectura; PRs #34 y #35 regeneraron la trazabilidad. Las ramas ya no existen. |
| DT-03 | Interfaz exacta entre `combat.js` y `engine.js` no verificada en el mapa. | Baja | **ABIERTO** | Owner: mantenedor. Siguiente accion: revisar ambos contratos y documentar sus simbolos sin cambiar comportamiento. |
| DT-04 | `ui_misc.js` agrupa mapa, gremio, lore, clase y quests rapidas. | Baja | **ABIERTO** | Owner: mantenedor. Siguiente accion: proponer un refactor separado; no mezclarlo con arreglos ni contenido. |
| DT-05 | `item_flavor.js` concentra el mayor volumen de datos narrativos. | Baja | **VIGILAR** | Owner: mantenedor. Siguiente accion: medir tiempo de carga antes de plantear cambios. |
| DT-06 | Stub huerfano `ashbrand_hotfix.js`. | -- | **CERRADO** | PR #26 (`fix/dt-17-remove-ashbrand-stub`) retiro el fichero; PR #33 dejo constancia documental. No existe en `main` ni se referencia desde `index.html`/`sw.js`. |
| DT-07 | Las expansiones no tienen guard explicito contra colisiones de IDs. | Media | **ABIERTO** | Owner: mantenedor. Siguiente accion: disenar una comprobacion generica de colisiones antes de cambiar los instaladores. |
| DT-08 | `update2_content.js` parchea quests por IDs concretos. | Baja | **ABIERTO** | Owner: mantenedor. Siguiente accion: evaluar una API declarativa de patches; conservar el comportamiento actual hasta aprobar el refactor. |
| DT-09 | Split de `game.js` en motor y ficheros de UI. | -- | **CERRADO** | PR #15 (`refactor/split-gamejs`): `game.js` se dividio en modulos y se elimino de la carga; `engine.js` es el motor canonico. |
| DT-10 | Algunos items legacy del save requieren normalizacion y pueden tener casos edge. | Alta | **ABIERTO** | Owner: mantenedor. Siguiente accion: ampliar fixtures de normalizacion determinista sin perder datos ni cambiar contenido. |
| DT-11 | Global innecesario `window.LifeXPUpdate2` en la instalacion de Update 2. | -- | **CERRADO** | PR #17 (`fix/dt-11-13`): elimino el global fragil. La rama ya no existe. |
| DT-12 | Renderizado de inventario duplicado entre `item_system.js` y `ui_hub.js`. | Media | **ABIERTO** | Owner: mantenedor. Siguiente accion: documentar el contrato actual y proponer un refactor separado. |
| DT-13 | Instalaciones de `expansion_*.js` sin guard de idempotencia. | -- | **CERRADO** | PR #17 (`fix/dt-11-13`): anadio guards `_installed` a las expansiones; PR #24/#28 completo el mismo patron para enemigos. Las ramas ya no existen. |
| DT-14 | Fallback de recuperacion de items y logica de restauracion especifica de Ashbrand. | -- | **CERRADO** | PR #11 elimino el fallback; PR #25 movio la migracion legacy al subsistema de inventario y PR #27 generalizo la recuperacion determinista. Las ramas ya no existen. |
| DT-16 | Migraciones de save sin proteccion transaccional completa. | -- | **CERRADO** | PR #38 (`fix/dt16-dt17-save-migrations`): snapshots, backup y rollback de migraciones; pruebas incluidas. La rama ya no existe. |
| DT-17 | Retirada del stub huerfano `ashbrand_hotfix.js` (ID historico reutilizado despues para save-safety). | -- | **CERRADO** | PR #26 (`fix/dt-17-remove-ashbrand-stub`) retiro el stub; el trabajo de save-safety posterior se documento bajo el mismo ID en PR #38. La rama ya no existe. |
| DT-18 | `PROJECT_MAP.md` desactualizado frente al repositorio. | -- | **CERRADO** | Este PR: ramas, deuda, tamanos, responsabilidades y guia Fase 3 sincronizados. |
| DT-19 | Referencias heredadas no ASCII en `enemies.js`: `seda_araña` y `araña_domestica`. | Alta | **ABIERTO** | Owner: mantenedor. Siguiente accion: preparar un cambio de datos separado que migre esas referencias a IDs canonicos y regenere la trazabilidad. |

---|---|---|---|
| DT-01 | ~~`sw.js` tiene lista de assets hardcodeada; si se anade un fichero nuevo sin actualizar el SW, la PWA puede servir version antigua~~ | -- | **RESUELTO** (fix/sw-assets: check 10 en validador detecta desincronias; CACHE_NAME subida a v21) |
| DT-02 | ~~`DROP_TABLES` en `items.js` usa nombres de items en texto libre (no IDs); si un item se renombra, los drops se rompen silenciosamente~~ | -- | **RESUELTO en `DROP_TABLES` y drops de tareas** (la trazabilidad historica de las sustituciones queda separada de las 77 definiciones nuevas aprobadas) |
| DT-03 | `combat.js` no se ha leido en detalle en esta sesion; su interfaz exacta con `engine.js` no esta verificada en este mapa | Baja | Pendiente verificacion |
| DT-04 | `ui_misc.js` agrupa pantallas muy distintas (mapa, clase, lore, quests rapidas); candidato a split en refactor futuro | Baja | Abierto |
| DT-05 | `item_flavor.js` es el fichero mas grande de datos (44 KB); si crece mucho puede afectar tiempo de carga inicial | Baja | Vigilar |
| DT-06 | ~~`ashbrand_hotfix.js` existe en el repo pero no se carga en `index.html`; es un fichero huerfano que debe eliminarse o integrarse~~ | -- | **RESUELTO** (verificado 2026-08-11: el fichero ya no existe en `main`; fue eliminado en el saneamiento previo. No hay referencias en `index.html` ni en `sw.js`.) |
| DT-07 | `expansion_*.js` usan `Object.assign` sin guard de duplicados; si un ID de expansion colisiona con uno base, el base se sobreescribe silenciosamente | Media | Abierto |
| DT-08 | `update2_content.js` parchea quests por ID hardcodeado (`daily_any_3`, `daily_casa_2`); si esos IDs cambian, el patch falla silenciosamente | Baja | Abierto |
| DT-09 | ~~Split de `game.js` en `engine.js` + ficheros UI~~ | -- | **RESUELTO** (`game.js` eliminado, `engine.js` es el motor canonico) |
| DT-10 | Algunos items en `inventory` del save pueden tener formato legacy (sin `id` canonico); `inventory_system.js` los normaliza al arrancar pero el proceso no es 100% determinista para todos los casos edge | Alta | Abierto |
| DT-11 | ~~Rama huerfana `refactor/flavor-text-extract`~~ | -- | **RESUELTO** (rama no existe en el repo actual) |
| DT-12 | `item_system.js` y `ui_hub.js` tienen logica de renderizado de inventario duplicada; `renderInventoryGrid` existe en ambos | Media | Abierto |
| DT-13 | ~~`DEFAULT_TASKS` y `EXPANSION_TASKS_V1` usan strings de display (con espacios/mayusculas/acentos) en `drops.items` en lugar de IDs canonicos~~ | -- | **RESUELTO en tareas** (110 referencias de `data_tasks.js` y 39 de `expansion_tasks.js` constan como IDs en la instantánea actual; las 77 definiciones nuevas se documentan como contenido aprobado separado) |
| DT-14 | ~~`THEME_ENEMIES["refugio"]` referencia `vigia_del_refugio` que no existe en ENEMIES~~ | -- | **RESUELTO** (verificado 2026-08-11: corregido en PR anterior como parte de DT-19; `refugio` mapea a `['rata_gigante', 'poltergeist']`, ambos IDs canonicos existentes.) |
| DT-18 | ~~PROJECT_MAP.md desactualizado~~ | -- | **RESUELTO** (este PR) |
| DT-19 | Referencias heredadas no ASCII en `enemies.js`: `seda_araña` y `araña_domestica` aparecen en un drop y dos tablas temáticas | Alta | Abierto; siguiente cambio de código separado de la trazabilidad y del contenido nuevo |

---

## 3b. Contrato de persistencia y recuperacion

- `engine.js` define `CURRENT_SAVE_VERSION = 3` y una cadena explicita de migraciones `0->1->2->3`.
- `loadGame()` crea una copia exacta previa bajo `lifexp_premigration_v<version>_<timestamp>` y conserva las tres mas recientes.
- Las migraciones trabajan sobre un candidato; el save original y el estado en memoria se restauran si falla parseo, esquema, migracion o finalizacion.
- Los campos conocidos reciben defaults declarativos; los campos desconocidos se conservan.
- La migracion de quests conserva progreso por ID, registra objetivos que se reinician y no borra quests cuyo catalogo no esta disponible.
- La validez del contenedor canonico se decide sobre el save original, antes de aplicar defaults; un save parcial usa `activeQuests` legacy o aborta con rollback visible si no puede reconstruirse de forma segura.
- Un estado canonico de quests completo conserva prioridad; los estados parciales no se aceptan por el mero hecho de haber recibido arrays por defaults y conservan el raw save exacto si la reparacion no es segura.
- `update2_content.js` valida catalogs, instaladores y entradas de expansion antes de marcar la actualizacion; su transaccion restaura snapshots profundos de `ITEMS`, `ENEMIES`, `QUESTS`, `DEFAULT_TASKS`, `DROP_TABLES`, `THEME_ENEMIES`, `gameState` y `lifexp_save` ante cualquier fallo. Tambien valida que las referencias de inventario sean IDs canonicos existentes en `ITEMS`.
- Una instalacion correcta de Update 2 escribe el marcador y llama a `saveGame()` solo al final; las ejecuciones posteriores son no-op idempotentes.
- Fixtures de regresion: `tests/save_migrations.test.js` (v0, v1, v2 legacy/canonico, v2 parcial con recuperacion legacy, rollback de parcial, quest canonica desconocida, v3, corrupcion, snapshots y DT-17) y `tests/update2_transaction.test.js` (instalacion, cuatro instaladores, commit, rollback, reintento e idempotencia).
- `.github/workflows/ci.yml` ejecuta en cada push y pull request `node --check` sobre los scripts de produccion y las suites `tests/save_migrations.test.js` y `tests/update2_transaction.test.js`, usando Node.js `22.14.0`.
- `node validate_content.js` queda fuera del gate de CI de este PR porque mantiene errores baseline ya documentados; resolver esa deuda es una tarea separada.

## 8. Changelog del mapa
- **2026-08-21 - `fix/task-result-navigation-manual` (Fase 2A):** `engine.js` añade el registro durable `pendingTaskResult` y hace que `saveGame()` comunique exito o fallo; `ui_tasks.js` persiste antes de mostrar, conserva el resultado hasta confirmacion, recupera resultados pendientes tras recarga y revierte el estado en memoria si falla el guardado final; `main.js` mantiene historial de pantalla/modal, cierre seguro con atras/Escape/fondo y foco accesible. La rama limpia se usa como base para evitar el parche destructivo de la rama v2 divergente.


- **2026-08-19 - `fix/rewards-recoverable` (Fase A1):** la instalacion transaccional valida de forma general las referencias de recompensas antes de guardar. Se cubren tablas de drops, drops de enemigos, drops de tareas y side quests en array u objeto, recompensas de quests y recompensas de capitulos. Una referencia no canonica o ausente provoca rollback determinista y conserva el save anterior. La cobertura vive en `tests/update2_transaction.test.js`, que prueba siete formas de referencia rota.


| 2026-08-19 | `fix/quest-ui-modal-wrappers` | Expone aliases estables hacia `acceptQuest` y `abandonQuest` de `quests.js` para que la UI no dependa de redefiniciones, y corrige el cierre del modal de aceptación para cerrar el modal que realmente se abre. No toca contenido jugable, saves ni `main`. |

| 2026-08-19 | `fix/rewards-contract` (Fase 1C) | Conecta combate con la frontera canonica: el paquete de recompensas y su claim ID se crean una sola vez por combate; XP y oro se aplican una sola vez; cada drop usa un claim independiente y conserva los estados `granted`, `pending` o `rejected` para reintento sin reroll. La UI muestra el resultado estructurado de cada drop. No toca contenido jugable; quests siguen pendientes. |

| 2026-08-19 | `fix/rewards-contract` (Fase 1B) | Conecta drops de tareas y side quests con `LifeXPInventory.deliverReward()`, normaliza formas actuales y legacy y elimina inserciones directas no canonicas. No cambia XP, oro, historial ni reglas de drop. |

| 2026-08-19 | `fix/rewards-contract` (Fase 1A) | Introduce el contrato durable de recompensas sin tocar contenido: `pendingLoot` pasa a `{ version: 1, entries: [] }` con normalizacion compatible con `null`, arrays y formatos legacy; `rewardLedger` registra `claimId` y estados; `LifeXPInventory.deliverReward()` resuelve IDs canonicos, comprueba la insercion real y devuelve `granted`, `pending` o `rejected`, conservando pendientes y referencias recuperables. La rama parte de `main` en `dcc567034ff3319595770fb29206d14f3e98258a`; quedan pendientes de esta misma tarea la conexion de consumidores y la UI visible de recuperacion. |

| 2026-08-19 | `fix/rewards-contract` (Fase 1B) | `ui_tasks.js` conecta drops de tareas y side quests con `LifeXPInventory.deliverReward()` usando `claimId` estable por tarea, fecha y variante; elimina inserciones directas y normaliza descriptores actuales y legacy antes de entregar. Los estados `pending` y `rejected` se muestran como recuperables sin alterar el XP, oro, historial ni reglas de drop. Combate y quests no se tocan en esta fase. |

| 2026-08-18 | `chore/dt15-project-map-sync` | Sincroniza este mapa con el estado real del repositorio: solo ramas existentes, ausencia verificada de tags de backup, deuda tecnica con PRs de cierre y owner/siguiente accion para abiertos, inventario con tamanos en bytes y guia de contenido declarativo Fase 3. Documentacion solamente. |
| Fecha | PR / Rama | Cambios |
|---|---|---|
| 2026-08-18 | `chore/add-ci` | Añade `.github/workflows/ci.yml` para ejecutar en push y pull request una version explicita de Node.js (`22.14.0`), `node --check` sobre los scripts de produccion y las suites de migraciones y de instalacion transaccional. No añade dependencias, no ejecuta `validate_content.js` por sus errores baseline conocidos y no cambia comportamiento de la aplicacion. |
| 2026-08-18 | `fix/update2-transaction` | Instalacion de Update 2 convertida en transaccion: snapshots profundos de catalogos y `gameState`, backup exacto de `lifexp_save`, rollback ante fallo de instalador/verificacion/render/commit, commit de save solo al final y reintento seguro. Se anade `tests/update2_transaction.test.js` con fixtures de exito, cuatro instaladores, rollback, reintento e idempotencia; se actualiza el contrato de persistencia. No toca contenido jugable ni `saveVersion: 3`. |
| 2026-08-13 | `fix/partial-quest-migration` | Deteccion de `quests` canonico basada en el save original antes de defaults; recuperacion determinista de contenedores parciales desde `activeQuests`, rollback visible cuando no hay fuente legacy suficiente, preservacion de quests desconocidas y fixtures de estado persistido. No toca contenido jugable ni cambia `saveVersion: 3`. |
| 2026-08-12 | `fix/dt16-dt17-save-migrations` | Persistencia transaccional: migraciones v0->v3, defaults de schema, snapshots pre-migracion, rollback ante corrupcion/fallo, progreso de quests por ID y assertion de carga/instalacion de expansion. Incluye fixtures; no toca contenido jugable. |
| 2026-07-30 | PR #14 / Fase F saneamiento | Creacion inicial del mapa post-saneamiento |
| 2026-07-31 | `chore/sync-project-map` | Saneamiento completo: correccion de arquitectura (engine.js, no game.js), orden real de carga de scripts verificado en index.html, recuentos de contenido verificados en codigo, ficheros UI documentados con funciones clave, deuda tecnica actualizada (DT-09/11/18 resueltos, DT-06/12 nuevos), seccion 9 de recuentos anadida, branches activas actualizadas |
| 2026-07-31 | `feat/content-validator` | Anadido `validate_content.js` (seccion 2f y seccion 10); invariante 9 anadida; DT-13/14 nuevos (detectados por validador); DT-02 marcado como detectado; branches activas actualizadas |
| 2026-08-04 | `fix/sw-assets` | `sw.js` CACHE_NAME subida a v21 (fuerza refresh en clientes); eliminado `sw.js` del fetch regex (innecesario); `validate_content.js` v1.1 con check 10 (SW_MISSING_ASSET/SW_ORPHAN_ASSET); seccion 5b anadida (procedimiento para anadir fichero); invariantes 10 y 11 anadidas; DT-01 resuelto |
| 2026-08-10 | `fix/project-map-utf8-clean` | Normalizacion de `PROJECT_MAP.md` a UTF-8 valido para evitar el fallo de conversion de Jekyll en GitHub Pages; sin cambios funcionales en el mapa. |
| 2026-08-10 | `fix/item-requirement-narrative` | Ashbrand pasa a rareza rara sin alterar su ID ni los saves existentes; los requisitos de equipamiento se traducen a sensaciones narrativas declarativas por tipo de objeto y estadistica; el flujo visible de Ashbrand queda en espanol; `sw.js` pasa a `lifexp-v22` para invalidar la cache anterior. |
| 2026-08-11 | `fix/inventory-language-boundary` | Separa la frontera de idioma: inventario, equipo, objetos, requisitos, attunement, rituales, curses y activacion usan ingles; tareas, categorias y botones del mundo real permanecen en espanol. Ashbrand conserva su ID y pasa a rareza `rare` con narrativa del objeto en ingles; `sw.js` no se modifica porque `lifexp-v22` ya esta vigente. |
| 2026-08-11 | `fix/dt13-dt02-drop-ids` | DT-13 y DT-02 resueltos: 110 strings de display en `data_tasks.js` reemplazados por IDs canonicos snake_case; 77 items nuevos con nombres de fantasia en ingles anadidos a `expansion_items.js` (total 88 items, 25 drop tables tematicas); `validate_content.js` check 6 endurecido para validar todos los formatos de drop de tareas; inventario inicial `docs/DROP_MAPPING.md` generado. |
| 2026-08-11 | `fix/dt14-dt06-quickwins` | DT-06 y DT-14 confirmados resueltos tras verificacion exhaustiva: `ashbrand_hotfix.js` ya no existe en `main` (eliminado en saneamiento previo, sin referencias en `index.html` ni `sw.js`); `THEME_ENEMIES["refugio"]` ya usa IDs canonicos `rata_gigante` y `poltergeist` (corregido como DT-19 en PR anterior). Eliminada entrada de `ashbrand_hotfix.js` de seccion 2e. |
| 2026-08-12 | `fix/dt13-dt02-drop-ids` | Inventario `docs/DROP_MAPPING.md` regenerado después de cambios de código: 110 referencias en `data_tasks.js`, 39 en `expansion_tasks.js` y 120 en `DROP_TABLES`; no se aplican sustituciones en esa regeneración. Se documenta el bloqueo sintáctico que existía entonces en `expansion_items.js`. |
| 2026-08-12 | `fix/expansion-items-syntax` | Reparados exclusivamente errores estructurales de `expansion_items.js`: apóstrofes internos escapados, cierres prematuros eliminados y propiedades duplicadas que impedían parsear la expansión. No cambian nombres visibles, IDs, drops, stats, valores, tablas ni balance. `node --check` pasa; la ejecución completa registrada en ese PR carga 175 items y conserva 3 errores y 26 avisos preexistentes ajenos a ese PR. |
| 2026-08-12 | `fix/drop-integrity-traceability` | Reconstruida la trazabilidad de `docs/DROP_MAPPING.md`: se separan el inventario inicial (20 `EXACT`, 8 `FUZZY`, 82 `NONE`), la regeneración posterior de 269 ocurrencias y las 77 definiciones nuevas aprobadas como contenido. Se actualizan ramas y deuda técnica sin modificar datos jugables. |

---

## 9. Recuentos de contenido (verificados 2026-07-31)

### Tareas

| Fuente | Cantidad | Categorias |
|---|---|---|
| `data_tasks.js` (base) | 41 | casa: 15, personal: 9, cuerpo: 7, gestiones: 5, social: 5 |
| `expansion_tasks.js` | 14 | casa: 3, cuerpo: 3, gestiones: 3, personal: 3, social: 2 |
| **Total** | **55** | |

### Items

| Fuente | Cantidad | Notas |
|---|---:|---|
| `items.js` (base) | 87 | recuento ejecutable verificado con `validate_content.js` |
| `expansion_items.js` | 88 | 77 items nuevos con nombres de fantasia en ingles (DT-13/DT-02) |
| `update2_content.js` | 1 (Ashbrand) | Solo si no existe ya en base |
| **Total** | **~174** | Sin contar duplicados (Ashbrand puede ya estar en base) |

Raridades base: uncommon: 35, rare: 27, common: 20, epic: 5 (sin legendarios base).

### Enemigos

| Fuente | Cantidad | Niveles |
|---|---:|---|
| `enemies.js` (base) | 85 | 1-40+ (niveles: 1,2,3,4,5,6,7,8,12,14,15,16,18,20,22,25,30,35,40) |
| `expansion_enemies.js` | 18 | |
| **Total** | **103** | |

### Quests

| Fuente | Cantidad | Tipos principales |
|---|---:|---|
| `quests.js` (base) | 33 | complete_tasks: 11, daily: 3, simple: 3, bounty: 2, defeat_enemy: 2, defeat_boss: 2, story: 1, class_quest: 1 |
| `expansion_quests.js` | 20 | |
| `update2_content.js` | 2 patches narrativos | Parchea `daily_any_3` y `daily_casa_2` con nombre/desc/lore |
| **Total** | **53** | |

### Clases

| Dato | Valor |
|---|---|
| Clases base | 6 (guerrero, arquero, mago, clerigo, picaro, monje) |
| Nodos de progresion totales | 102 (tiers 1-4) |
| Distribucion por tier | tier 1: 6, tier 2: 18, tier 3: 37, tier 4: 41 |

### Lore / Flavor

| Fuente | Cantidad |
|---|---:|
| `item_flavor.js` (items con flavor text) | 87 entradas |

## 10. Validador de integridad de contenido

### Fichero

`validate_content.js` -- Node.js, solo lectura, no toca produccion. Version actual: v1.1.

### Como ejecutarlo

```bash
# Desde la raiz del repositorio:
node validate_content.js

# Si el repo esta en otra ruta:
node validate_content.js --dir /ruta/al/repo
```

### Salida

- **Exit 0**: limpio (puede haber avisos, pero no errores).
- **Exit 1**: hay errores de integridad. El PR no debe mergearse hasta resolverlos.

La salida muestra el recuento de catalogos cargados, la lista de errores (si los hay) y la lista de avisos.

### Checks que realiza (v1.1)

| # | Codigo de error | Que detecta | Nivel |
|---|---|---|---|
| 1 | `DUPLICATE_ID`, `ID_MISMATCH` | IDs duplicados o clave != campo `id` interno en ITEMS, ENEMIES, QUESTS, CLASS_TREE, DEFAULT_TASKS | ERROR |
| 2 | `DROP_DISPLAY_NAME`, `BROKEN_ITEM_REF`, `DROP_NO_ITEMID` | Drops de enemigos con strings de display o IDs inexistentes | ERROR |
| 3 | `DROP_TABLE_DISPLAY_NAME`, `BROKEN_ITEM_REF` | DROP_TABLES con strings de display o IDs inexistentes | ERROR |
| 4 | `THEME_DISPLAY_NAME`, `BROKEN_ENEMY_REF` | THEME_ENEMIES con strings de display o IDs de enemigo inexistentes | ERROR |
| 5 | `QUEST_REWARD_DISPLAY_NAME`, `BROKEN_ITEM_REF`, `BROKEN_ENEMY_REF`, `BROKEN_QUEST_REF`, `BROKEN_CLASS_REF` | Recompensas, objetivos, prerequisitos y classId de quests rotos | ERROR |
| 6 | `TASK_DROP_DISPLAY_NAME`, `BROKEN_ITEM_REF`, `UNKNOWN_THEME` | Drops de tareas con strings de display, IDs inexistentes o temas desconocidos | ERROR / WARN |
| 7 | `UNREACHABLE_QUEST`, `CIRCULAR_PREREQ` | Quests con minLevel > 40 o cadenas de prerequisitos circulares | WARN / ERROR |
| 8 | `ORPHAN_ENEMY` | Enemigos sin ningun tema ni entrada en THEME_ENEMIES | WARN |
| 9 | `UNOBTAINABLE_ITEM` | Items que no aparecen en ningun drop table, drop de enemigo ni recompensa de quest | WARN |
| 10 | `SW_MISSING_ASSET`, `SW_ORPHAN_ASSET` | Scripts en `index.html` ausentes de `sw.js` urlsToCache (ERROR), o en `sw.js` pero no en `index.html` (WARN) |

### Regla de uso obligatorio

**Ejecutar antes de abrir cualquier PR** que modifique ficheros de datos (`items.js`, `enemies.js`, `quests.js`, `data_tasks.js`, `expansion_*.js`, `update2_content.js`) o que anada/elimine scripts (`index.html`, `sw.js`). Si hay errores, el PR no se mergea.

### Primera ejecucion (2026-07-31, estado actual del repo)

```
Catalogue loaded:
  ITEMS    : 98
  ENEMIES  : 37
  QUESTS   : 15
  CLASSES  : 102
  TASKS    : 55

Result: 100 error(s), 12 warning(s)
```

### Verificacion registrada (2026-08-12)

La ejecucion de `node --check expansion_items.js` pasa correctamente. PR #36 registro una ejecucion completa de `node validate_content.js` con 175 items, 37 enemigos, 15 quests, 102 clases y 55 tareas: 3 errores y 26 avisos. La comprobacion aislada repetida durante esta tarea solo incluyo los ficheros del alcance documental, por lo que produjo avisos adicionales de ficheros ausentes; esos avisos no se usan para cambiar el estado del proyecto.

Errores principales restantes (fuera del alcance de esta tarea):
- `ENEMIES["araña_domestica"].drops` contiene `seda_araña` como nombre de display.
- `THEME_ENEMIES["agua_quimicos"]` y `THEME_ENEMIES["hallazgos"]` contienen `araña_domestica` como nombre de display.
- Persisten 26 avisos `UNOBTAINABLE_ITEM`; requieren un diagnostico separado y no se alteran aqui.
