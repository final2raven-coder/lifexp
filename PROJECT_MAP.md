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
| Ultima actualizacion | 2026-08-26 (`refactor/icon-rendering-contract` -- contrato publico de iconos con fallback por tipo; sin cambios de contenido ni persistencia) |
| Branch de produccion | `main` |
| Branches existentes verificados | `main`, `backup/pre-sanitation-2026-07-30`, `feat/task-catalog-refresh`, `fix/consistent-skill-requirements`, `fix/combat-difficulty-readable`, `feat/combat-formations-foundation`, `fix/visible-labels-consistency` , `fix/visible-labels-5a2-3`, `fix/ui-language-complete`, `refactor/icon-rendering-contract` |
| Tags de backup existentes verificados | Ninguno visible en el repositorio; la copia de seguridad disponible es la rama `backup/pre-sanitation-2026-07-30` |
| Ramas historicas citadas | Las ramas de PR integradas o eliminadas se conservan unicamente en el changelog; no son ramas activas |
| Commit de `main` verificado | `86343256be557548f506e58b2c9fb3fc990fdaf0` (verificado el 2026-08-26; se corrige la referencia documental anterior) |
| Commit de la rama de backup | `218cb09e118920b5323598e194c1bd8f07be2ae1` |
| Build string | `LIFE_XP_BUILD = 'v13.4-equip-action-fix'` (declaracion efectiva auditada en `data_tasks.js`; el valor `v13.6-inventory-language-boundary` anterior del mapa era incorrecto) |
| Publicacion | GitHub Pages - rama `main`, raiz `/` |
| URL publica | `https://final2raven-coder.github.io/lifexp/` |
| Entrada | `index.html` (SPA de una sola pagina) |
| PWA | `manifest.json` + `sw.js` (cache-first, CACHE_NAME = lifexp-v24, status verificable desde `main.js`, sincronizado con index.html via validador check 10) |

---

## 1. Arquitectura en 10 lineas

LifeXP es una **SPA vanilla JS / PWA** sin bundler ni framework.
`index.html` contiene todo el CSS y el HTML de todas las pantallas; los scripts se cargan en orden al final del `<body>`.
El estado global vive en el objeto `gameState` (definido en `engine.js`) y se persiste en `localStorage` bajo la clave `lifexp_save`; el loader actual migra saves versionados de forma secuencial hasta `saveVersion: 4`.
Los datos de contenido (items, enemigos, quests, clases) son constantes declaradas en ficheros separados y consumidas por `engine.js` y `combat.js` como globals.
Los ficheros `expansion_*.js` exponen instaladores declarativos y `update2_content.js` valida su orden de carga, los ejecuta explicitamente, comprueba la instalacion completa antes de marcar la actualizacion y revierte catalogos, estado en memoria y save si falla cualquier paso.
`inventory_system.js` define el subsistema canonico de inventario, expone `normalizeItemText` y `emergencyRerollLegacyItem`, hace repair() al arrancar y concentra la entrega estructurada de recompensas mediante `LifeXPInventory.deliverReward()`.
`item_system.js` gestiona attunement, rituales, curses, modales de item, knowledge system y activation panel. Los mensajes del dominio de objetos se presentan mediante `LifeXPPresentation`, que mantiene la frontera de idioma del inventario separada de tareas y categorias.
`ui_hub.js`, `ui_tasks.js`, `ui_combat.js`, `ui_misc.js`, `ui_feedback.js` y `ui_quests.js` consumen el estado y generan el markup de las pantallas; `ui_combat.js` consume formaciones y feedback tactico.
`guild.js` mantiene el estado cooperativo mediante receipts append-only, sincronizacion y aplicacion idempotente.
`sw.js` registra un cache-first service worker; `main.js` publica el estado de registro, la fuente cargada y las acciones de recuperacion visibles.

---

## 2. Inventario de ficheros

### 2a. Ficheros de motor y UI

| `icon_system.js` | Contrato central de renderizado de iconos semanticos, fallbacks SVG accesibles, referencias `item.*`, `class.*`, `enemy.*`, `category.*`, `action.*`, `ui.*` y `world.*`, y registro futuro del pack local | `LifeXPIcons.render`, `renderItem`, `renderClass`, `renderEnemy`, `renderCategory`, `renderAction`, `renderUI`, `registerPack`, `hydrateStaticIcons` |

| Fichero | Bytes | Responsabilidad principal | Exports / globals clave |
|---|---:|---|---|
| `engine.js` | 47005 | `gameState`, schema canonico, contrato y resolver comun de habilidades, modelo de tareas e historial, migraciones transaccionales v0->v4, snapshots pre-migracion, rollback, `updateStreak`, `showScreen` y resultado pendiente de tarea | `gameState`, `DEFAULT_GAME_STATE`, `resolvePlayerSkill`, `getResolvedPlayerSkills`, `getPlayerSkillContext`, `saveGame`, `loadGame`, `addXp`, `addStats`, `getAvailableTasks`, `getTaskAvailability`, `createTaskHistoryEntry`, `showScreen`, `CURRENT_SAVE_VERSION`, `normalizePendingLootState`, `cloneSaveState` |
| `combat.js` | 42539 | Logica de combate, formaciones versionadas, seleccion y validacion de objetivos, turnos multi-enemigo, autorizacion uniforme de habilidades, dificultad acotada, recompensas idempotentes y entrega durable de drops | `initCombat`, `createCombatFormation`, `getCombatMembers`, `getLivingCombatMembers`, `getCombatMemberByInstanceId`, `setCombatTarget`, `getAvailableActions`, `executePlayerAction`, `executeEnemyTurn`, `calculateCombatRewards`, `applyCombatRewards`, `getEncounterType`, `pickEncounterEnemy`, `scaleEncounterEnemy`, `getEncounterThreat` |
| `guild.js` | 11298 | Sistema cooperativo: receipts, sync, guild state | `generateReceipt`, `applyReceipt`, `renderGuild` |
| `inventory_system.js` | 22047 | Subsistema canonico de inventario, entrega estructurada de recompensas, cola de pendientes, repair al arrancar, contrato de presentacion en ingles y contrato publico de iconos con fallback por tipo | `LifeXPInventory`, `LifeXPPresentation`, `LifeXPIcons`, `normalizeItemText`, `emergencyRerollLegacyItem`, `deliverReward`, `getPendingLoot`, `retryPendingLoot`, `renderInventory`, `renderCanonicalInventory`, `renderCanonicalStash` |
| `item_system.js` | 26392 | Attunement, rituales, curses, modales y activation panel | `getItemState`, `getAttunementProgress`, `performItemRitual`, `getRitualProgress`, `getCurseState`, `showItemModal`, `showEquippedItemModal`, `activateItem` |
| `main.js` | 12702 | Bootstrap de la SPA, event listeners, instalacion SW, estado verificable de build/cache y recuperacion visible | `init`, `registerServiceWorker`, `showRecoveryPanel`, `requestServiceWorkerStatus` |

### 2b. Ficheros de UI (pantallas)

| Fichero | Bytes | Responsabilidad principal | Exports / globals clave |
|---|---:|---|---|
| `ui_hub.js` | 16447 | UI del hub, personaje, inventario, equipo, settings | `renderHub`, `renderCharacter`, `renderEquipment`, `renderSettings`, `showItemModal`, `showEquippedItemModal` |
| `ui_tasks.js` | 20891 | UI de tareas, catalogo por categoria, completado, drops y encuentros | `renderTaskScreen`, `renderCategoryTaskList`, `completeCurrentTask`, `completeTaskFromCategory`, `renderTaskResult` |
| `ui_combat.js` | 16152 | UI de combate, formaciones, seleccion de objetivos, tareas guardadas y overflow | `renderCombatScreen`, `renderCombatEnemy`, `renderCombatFormation`, `renderSavedTasks`, `showOverflowTasks` |
| `ui_misc.js` | 16940 | Modales, timer, cambio de clase, export/import/snapshot, reset | `openModal`, `closeModal`, `toggleTimer`, `changeClass`, `exportSave`, `importSave`, `createSnapshot`, `resetGame` |
| `ui_feedback.js` | 7913 | Toast, flavor dialog, level-up, haptic y onboarding | `showToast`, `showFlavorDialog`, `showLevelUp`, `triggerHaptic`, `startOnboarding` |
| `ui_quests.js` | 24563 | UI de quests, aceptacion, abandono, progreso y recompensas | `renderQuests`, `acceptQuest`, `abandonQuest`, `claimQuestReward` |

### 2c. Ficheros de datos (contenido)

| Fichero | Bytes | Contenido | Exports / globals clave |
|---|---:|---|---|
| `classes.js` | 21975 | Arbol de clases por tiers, habilidades, costes y requisitos | `CLASS_TREE` |
| `items.js` | 22552 | 87 items base, rarezas, tipos y tablas de drops | `ITEMS`, `RARITY`, `ITEM_TYPE`, `DROP_TABLES` |
| `enemies.js` | 42368 | 85 enemigos base y temas de encuentro | `ENEMIES`, `THEME_ENEMIES` |
| `quests.js` | 18384 | 33 quests base y aliases canonicos de UI | `QUESTS`, `acceptQuestCanonical`, `abandonQuestCanonical` |
| `data_tasks.js` | 21908 | 41 tareas base y definiciones de frecuencia/disponibilidad declarativas | `DEFAULT_TASKS`, `FREQ` |
| `item_flavor.js` | 22434 | 87 entradas de flavor text narrativo de items | `ITEM_FLAVOR` |

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
| `sw.js` | 2312 | Service Worker cache-first; `CACHE_NAME = lifexp-v24`; responde al estado de caché mediante MessageChannel |
| `emergency-save.html` | 5646 | Herramienta de recuperacion manual del save |
| `icon-192.png` | 1447 | Icono PWA 192 px |
| `icon-512.png` | 3708 | Icono PWA 512 px |

### 2f. Herramientas de desarrollo (no se cargan en produccion)

| Fichero | Bytes | Responsabilidad |
|---|---:|---|
| `validate_content.js` | 18409 | Validador de integridad de contenido, solo lectura |
| `tests/save_migrations.test.js` | 18544 | Fixtures y pruebas de migraciones de save, historial completo, disponibilidad periodica, archivado, revision legacy e idempotencia |
| `tests/update2_transaction.test.js` | 10166 | Pruebas transaccionales de Update 2 y referencias de recompensas |
| `.github/workflows/ci.yml` | 1427 | CI de sintaxis JS y suites runtime |
| `docs/DROP_MAPPING.md` | 22020 | Inventario y trazabilidad de referencias de drops |
| `docs/SAVE_MIGRATION.md` | 9117 | Contrato y procedimiento de migracion/recuperacion de saves |

## 3. Modelo de datos: `gameState`

Definido en `engine.js`. Persistido en `localStorage` clave `lifexp_save`. Version actual: `saveVersion: 4`.

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
  taskHistory: { taskId, date, xp, sideQuest, completionId, schedule snapshot }[]  // append-only

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
  taskModelVersion: number  // version del modelo de tareas
  saveVersion: number       // 4 = version canonica actual
}
```

### Migraciones de save

| De version | A version | Que hace |
|---|---|---|
| < 1 | 1 | Inicializa campos de inventario |
| 1 | 2 | Inicializa `itemSystem` |
| 2 | 3 | Inicializa `guildId`, `guildName`, `guildMembers`, `pendingReceipts`, `receivedReceipts` |
| 3 | 4 | Normaliza tareas, historial append-only, frecuencia, disponibilidad, limite, repeticion, archivado y revision de tareas legacy |

Logica de migracion en `engine.js` -> `migrateQuestState()`, `migrateV3ToV4()` y la cadena secuencial de `loadGame()`.

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

### Task availability and history (Fase 3A)

Las tareas conservan el historial completo en `gameState.taskHistory`; cada entrada nueva incluye `completionId` y una instantanea de `frequency`, `availability`, `intervalDays`, `limit` y `repeatable`. La disponibilidad se evalua desde el historial y la politica declarativa, no solo desde `lastDone`.

```
availability?: {
  type: 'once' | 'periodic'
  intervalDays?: number
  limit?: number | null
  repeatable: boolean
}
archived?: boolean
reviewStatus?: 'needs_review'
```

Las frecuencias conocidas de `FREQ` declaran una politica periodica con limite por intervalo. Una tarea sin frecuencia o con una politica invalida queda marcada como `needs_review`; una tarea archivada se conserva en el save pero no aparece como disponible. La migracion `v3->v4` es determinista e idempotente y conserva campos desconocidos, historial legacy y snapshots de pre-migracion.

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

### Contrato de habilidades (Fase 4A)

`gameState.skills` es la fuente de verdad para la autorizacion del jugador. `known` registra las habilidades conocidas; `equipped` registra las preparadas; `sources` conserva la trazabilidad declarativa con tipos `initial`, `class`, `equipment`, `unlock` o `progression`. `resolvePlayerSkill()` deriva `authorized` y `usable` a partir de definicion, conocimiento, equipamiento, fuente, requisitos y recursos. `getAvailableActions()` y `executePlayerAction()` consumen el mismo resolver.

Una partida nueva y cualquier save sin `skills` reciben el mismo estado inicial normal (`basic_attack` y `defend`). No se conceden permisos por antiguedad, no se recuperan acciones de una lista historica y no existe una excepcion por ID. Si una habilidad guardada carece de fuente valida, se conserva pero no es utilizable.

### Contrato de encuentros individuales (Fase 4B.1)

`combat.js` aplica `ENCOUNTER_DIFFICULTY` como politica declarativa de disponibilidad por rango: los encuentros comunes estan disponibles desde el nivel 1, los elite desde el 5 y los bosses desde el 15. La seleccion prioriza enemigos del tema dentro de una banda segura, despues candidatos globales dentro de la misma banda y finalmente el enemigo mas cercano entre todos los candidatos del tipo solicitado; no selecciona arbitrariamente un enemigo fuera de banda. `scaleEncounterEnemy()` limita el escalado segun el rango declarado. `getEncounterThreat()` y `getEncounterThreatLabel()` producen metadatos de amenaza legibles antes y durante el combate. Un encuentro ya iniciado no se regenera por esta politica.

### Contrato de formaciones jugables (Fase 4B.2)

`combat.js` representa una formacion como `{ version: 1, members: CombatMember[] }`, donde cada miembro tiene `instanceId` unico, `enemyId`, `name`, `level`, `hp`, `maxHp`, `attack`, `defense`, `xp`, `gold`, `drops` y `rank`. `combatState.enemy` se mantiene como alias del primer miembro vivo o del primer miembro de la formacion para compatibilidad con consumidores legacy. `setCombatTarget()` valida el miembro contra la formacion actual, `executePlayerAction()` recibe `targetInstanceId` y `executeEnemyTurn()` itera los miembros vivos. La UI permite seleccionar un objetivo por tarjeta y muestra la amenaza agregada. Los encuentros individuales existentes se envuelven como formaciones de un miembro sin migracion de save.

---

## 5. Orden de carga de scripts (index.html, lineas 1484-1506)

```text
1.  classes.js           -- CLASS_TREE (sin dependencias)
2.  items.js             -- ITEMS, RARITY, ITEM_TYPE, DROP_TABLES
3.  enemies.js           -- ENEMIES
4.  combat.js            -- logica de combate (depende de ENEMIES, ITEMS)
5.  quests.js            -- QUESTS (depende de ITEMS, ENEMIES)
6.  item_flavor.js       -- ITEM_FLAVOR (depende de ITEMS)
7.  data_tasks.js        -- DEFAULT_TASKS (sin dependencias de datos)
8.  engine.js            -- gameState, motor (depende de todos los datos)
9.  expansion_items.js   -- EXPANSION_ITEMS_V1 -> Object.assign(ITEMS, ...)
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
20. ui_feedback.js     -- UI de feedback visual de recompensas, drops y progresion
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

El contenido nuevo debe formar una red jugable: tareas que apunten a temas, encuentros que protejan drops, quests que usen objetivos existentes y flavor text que conecte con items sin inventar tipos fuera del contrato.

### 5d. Resultado de tarea y navegacion segura (Fase 2A)

`gameState.pendingTaskResult` es transitorio y puede contener la tarea, fecha de completado, contexto de overflow, intencion de completado manual, side quest pendiente y drops estructurados. `showScreen('task-result')` no se ejecuta hasta que el resultado se guarda correctamente. Tras reload, `loadGame()` normaliza el resultado y `main.js` lo reabre de forma segura. Si el resultado es incompleto, se conserva en `pendingTaskResult` y la UI muestra una accion de recuperacion; nunca se descarta ni se convierte en recompensa improvisada.

---

## 6. Invariantes criticos

1. `main` siempre debe ser desplegable desde GitHub Pages.
2. No hacer commit directo a `main`; cada tarea tiene una rama `fix/`, `feat/`, `refactor/` o `content/` y un PR.
3. Los IDs de contenido son unicos y canonicos (`snake_case`, ASCII cuando el validador lo exige).
4. Los drops y recompensas referencian IDs de item o estructuras narrativas validadas; no se convierten strings de display en items silenciosamente.
5. Las referencias no resolubles se conservan en el save o en la cola de recuperacion visible; no desaparecen en silencio.
6. El save se migra de forma secuencial e idempotente y conserva campos desconocidos, historial, inventario, equipo, baul, quests, lore, aclimatacion y rituales.
7. Un rollback de instalacion restaura catalogos, estado y save desde el backup previo.
8. Las recompensas de tareas y combate tienen claim IDs y ledger para evitar duplicados.
9. La UI no debe presentar objetos, drops o recompensas con nombres no resolubles como si fueran items canónicos.
10. `sw.js` debe incluir todos los scripts que carga `index.html`.
11. Cada asset que se anada a `index.html` o al proyecto debe estar sincronizado con `sw.js` y con la version de cache.
12. `LifeXPPresentation` es la frontera de idioma para etiquetas visibles del inventario: nombres y metadatos de objetos en ingles; tareas, categorias y acciones de vida real conservan el idioma declarado por el contenido.

---

## 7. Registro de deuda tecnica

Estados verificados contra `main` y la historia de PRs disponible el 2026-08-18. Los items abiertos conservan owner y siguiente accion.

| ID | Descripcion | Prioridad | Estado real | PR de cierre / siguiente accion |
|---|---|---|---|---|
| DT-01 | Lista de assets del Service Worker mantenida manualmente. | -- | **CERRADO** | PR #23 (`fix/sw-assets`): el validador comprueba la sincronizacion `index.html`/`sw.js` y se incrementa la cache. La rama ya no existe. |
| DT-02 | IDs no canonicos en tablas de drops y compatibilidad de lectura para valores legacy. | -- | **CERRADO** | PR #29 (`fix: migrate drop-table item IDs to canonical ASCII`) corrigio `DROP_TABLES` y preservo aliases de lectura; PRs #34 y #35 regeneraron la trazabilidad. Las ramas ya no existen. |
| DT-03 | Interfaz exacta entre `combat.js` y `engine.js` no verificada en el mapa. | -- | **CERRADO** | `fix/combat-difficulty-readable`: contrato de combate y metadatos de encuentro revisados y documentados. |
| DT-04 | `ui_misc.js` agrupa mapa, gremio, lore, clase y quests rapidas. | Baja | **ABIERTO** | Owner: mantenedor. Siguiente accion: proponer un refactor separado; no mezclarlo con arreglos ni contenido. |
| DT-05 | `item_flavor.js` concentra el mayor volumen de datos narrativos. | Baja | **VIGILAR** | Owner: mantenedor. Siguiente accion: medir tiempo de carga antes de plantear cambios. |
| DT-06 | Stub huerfano `ashbrand_hotfix.js`. | -- | **CERRADO** | PR #26 (`fix/dt-17-remove-ashbrand-stub`) retiro el fichero; PR #33 dejo constancia documental. No existe en `main` ni se referencia desde `index.html`/`sw.js`. |
| DT-07 | Las expansiones no tienen guard explicito contra colisiones de IDs. | Media | **ABIERTO** | Owner: mantenedor. Siguiente accion: disenar una comprobacion generica de colisiones antes de cambiar los instaladores. |
| DT-08 | `update2_content.js` parchea quests por ID para compatibilidad narrativa historica. | Media | **VIGILAR** | Owner: mantenedor. Siguiente accion: mantener la tabla de patches y documentar cada migracion. |
| DT-09 | La UI de onboarding y algunos labels legacy conservan strings estaticos. | Baja | **ABIERTO** | Owner: mantenedor. Siguiente accion: unificar cuando se aborde una fase de UI; no crear ramas por texto aislado. |
| DT-10 | Algunos items en `inventory` del save pueden tener formato legacy (sin `id` canonico); `inventory_system.js` los normaliza al arrancar pero el proceso no es 100% determinista para todos los casos edge | Alta | **Abierto** |
| DT-11 | El `Service Worker` puede servir una version antigua si el navegador no actualiza la cache inmediatamente; hay panel y recovery visibles, pero no hay auto-reload forzado | Media | **Abierto** |
| DT-12 | Los alias de items legacy se mantienen en `inventory_system.js` y crecen con cada migracion | Baja | **Vigilar** |
| DT-13 | Puede haber referencias a items legacy o inexistentes en contenido antiguo, pendientes de limpiar sin perder trazabilidad | Media | **Abierto** |
| DT-14 | El save mantiene `pendingLoot` incluso cuando todas las entradas estan resueltas | Baja | **Vigilar** |
| DT-15 | Algunas referencias de `ui_combat.js` a `formation.members` necesitan pruebas E2E en dispositivos pequeños | Media | **Abierto** |
| DT-16 | La cache del SW requiere bump por release aunque los assets cambien con la misma ruta | Media | **Vigilar** |
| DT-17 | Retirada del stub huerfano `ashbrand_hotfix.js` (ID historico reutilizado despues para save-safety). | -- | **CERRADO** | PR #26 (`fix/dt-17-remove-ashbrand-stub`) retiro el stub; el trabajo de save-safety posterior se documento bajo el mismo ID en PR #38. La rama ya no existe. |
| DT-18 | `PROJECT_MAP.md` desactualizado frente al repositorio. | -- | **CERRADO** | Este PR: ramas, deuda, tamanos, responsabilidades y guia Fase 3 sincronizados. |
| DT-19 | Referencias heredadas no ASCII en `enemies.js`: `seda_araña` y `araña_domestica`. | Alta | **ABIERTO** | Owner: mantenedor. Siguiente accion: preparar un cambio de datos separado que migre esas referencias a IDs canonicos y regenere la trazabilidad. |
| DT-20 | La PWA no distinguia recarga de interfaz, actualización de caché y build ejecutada; los errores de registro del Service Worker se ignoraban. | Alta | **CERRADO** | `fix/update-verifiable-recovery` (Fase 2B): comprobacion de fuente, estado del Service Worker y estados no confirmados visibles; no toca saves ni contenido. |
| DT-21 | El flujo de `ui_tasks.js` todavia registra finalizaciones con el contrato anterior y no consume de extremo a extremo la nueva politica de disponibilidad/historial. | Alta | **ABIERTO** | Owner: mantenedor. Siguiente accion: PR separado de integracion de consumidores; no mezclarlo con esta migracion. |
| DT-22 | Persisten 96 referencias a items inexistentes en `DEFAULT_TASKS[*].drops.items` y `sideQuest.drops`, detectadas por `validate_content.js` el 2026-08-21. | Alta | **ABIERTO** | Owner: mantenedor. Siguiente accion: cambio de contenido separado con trazabilidad y validacion; no crear items falsos ni modificar drops en este PR. |

---|---|---|---|
| DT-01 | ~~`sw.js` tiene lista de assets hardcodeada; si se anade un fichero nuevo sin actualizar el SW, la PWA puede servir version antigua~~ | -- | **RESUELTO** | PR #23 (`fix/sw-assets`); validador y CI evitan que reaparezca. |
| DT-02 | ~~`DROP_TABLES` contiene nombres de display y aliases inconsistentes~~ | -- | **RESUELTO** | PR #29 y regeneracion de `docs/DROP_MAPPING.md`. |
| DT-03 | ~~`engine.js` consume skills con una lista historica en vez de resolver autorizacion~~ | -- | **RESUELTO** | PR #36 `fix/consistent-skill-requirements`. |
| DT-04 | ~~`ui_combat.js` no distingue amenaza ni comunica escala de encuentro~~ | -- | **RESUELTO** | PR #37 `fix/combat-difficulty-readable`. |
| DT-05 | ~~la instalacion de Update 2 podia marcarse completa tras una referencia rota de recompensa~~ | -- | **RESUELTO** | PR #35 `fix/update2-validate-rewards`. |
| DT-06 | ~~`ashbrand_hotfix.js` vacio y desconectado tras el saneamiento~~ | -- | **RESUELTO** | PR #26 `fix/dt-17-remove-ashbrand-stub`. |
| DT-07 | ~~las referencias heredadas de items no se conservan de forma visible al fallar la resolucion~~ | -- | **RESUELTO** | PR #38 `fix/save-safety-recovery` anade `pendingLoot`, ledger y tarjetas de recuperacion. |
| DT-08 | ~~el idioma visible de inventario/equipo y tareas se mezclaba sin contrato documentado~~ | -- | **RESUELTO** | PRs #39-#41 y `fix/ui-language-complete` consolidan `LifeXPPresentation`. |

---

## 3b. Contrato de persistencia y recuperacion

Este bloque documenta el comportamiento de recuperacion durable, no solo las migraciones de version.

### Reward ledger and pending loot

`gameState.rewardLedger` es un mapa de `claimId` a `{ status, itemId, quantity, source, reason?, updatedAt }`. `deliverReward()` debe:

1. Resolver la referencia a un ID canonico o rechazarla con `reason: 'unknown_item'`.
2. Crear una entrada de `pendingLoot` si la referencia no es resoluble o la insercion falla.
3. Persistir save y ledger antes de devolver el resultado.
4. Ser idempotente: un `claimId` concedido no vuelve a insertar el item.
5. Mantener la entrada recuperable y visible hasta que se resuelva, sin reroll aleatorio.

La UI de resultado presenta entradas `granted`, `pending` y `rejected` de forma separada. Ningun aviso de recompensa se convierte en item equipable sin resolver primero la referencia contra `ITEMS`.

### Recovery

Las entradas legacy del inventario pasan por `LifeXPInventory.repair()` al arranque. Si una entrada no es resoluble, se conserva en su contenedor y se muestra como tarjeta de recuperacion con accion de reparacion; no se elimina. `recoverItemIfLost()` solo restaura un item canonico si la evidencia en el save o una operacion autorizada lo justifica.

---

## 8. Changelog

- 2026-08-26 - `refactor/icon-rendering-contract` (fase 1): se anade `icon_system.js`, se migra `ui_hub.js` al contrato semantico y se carga el contrato antes de datos y UI en `index.html`. No se modifican reglas, contenido ni persistencia.
 del mapa

- **2026-08-26 - `refactor/icon-rendering-contract` (Fase 1B local):** `index.html` carga `icon_system.js` antes de los catalogos y la UI; `sw.js` pasa a `lifexp-v24` y precachea el contrato. El paquete local conserva los datos del juego, la persistencia y la estrategia cache-first.
- **2026-08-26 - `refactor/icon-rendering-contract` (Fase 1A):** `inventory_system.js` expone `LifeXPIcons` con resolucion de referencia, tipo seguro, renderizado de item y fallback SVG por tipo; el renderizador existente se conserva como adaptador para no cambiar la interfaz, el save, el inventario ni el comportamiento. La incorporacion de assets locales de Game-icons.net queda para una fase funcional independiente.
- **2026-08-26 - `fix/ui-language-complete` (Fase 1):** `engine.js` usa `Adventurer` como nombre predeterminado, migra de forma determinista el valor heredado `Aventurero` solo cuando coincide exactamente y muestra el mensaje de subida de nivel en inglés, preservando nombres personalizados y el progreso; `ui_quests.js` traduce las etiquetas dinamicas restantes de quests y recompensas. No se modifican mecanicas, contenido, IDs ni el resto del save.
- **2026-08-25 - `feat/combat-formations-target-selection` (Fase 4B.2, Opcion A):** `combat.js` activa el uso jugable de `formation.members` con IDs de instancia unicos y desambiguacion determinista de colisiones; `executePlayerAction()` propaga y valida `targetInstanceId`; `executeEnemyTurn()` procesa todos los miembros vivos; `ui_combat.js` renderiza la lista completa y permite seleccionar objetivos; `index.html` incorpora los estilos y la estructura multiobjetivo. Se mantiene el alias `combatState.enemy`, la compatibilidad con combates individuales y la politica de recompensas agregadas. No se modifican la generacion aleatoria de grupos, la persistencia de combates interrumpidos ni `enemies.js`.
- **2026-08-25 - `fix/combat-difficulty-readable` (Fase 4B.1):** se anade una politica declarativa de dificultad para encuentros individuales: comunes desde nivel 1, elite desde nivel 5 y bosses desde nivel 15; la seleccion prioriza tema y banda segura, el fallback elige el enemigo mas cercano disponible, el escalado queda acotado y la amenaza se comunica antes y durante el combate. `initCombat()` conserva metadatos transitorios del encuentro; no hay migracion de save ni regeneracion de combates ya iniciados. No se modifica el catalogo de enemigos ni se incluyen grupos de combate, que quedan para una rama independiente.
- **2026-08-24 - `fix/consistent-skill-requirements-clean`:** se añade el estado explicito de habilidades y una unica resolucion de autorizacion para combate. La partida actual y una partida nueva siguen la misma regla; no se añaden excepciones para saves antiguos ni por ID.
- **2026-08-21 - `feat/category-task-completion` (Fase 3B):** `ui_tasks.js` mantiene el aleatorio global y añade catalogo completo por categoria con estado, proxima fecha, historial basico, completado manual durante enfriamiento y aleatorio restringido mediante el resolver comun. `engine.js` ancla las politicas periodicas con limite uno en la ultima finalizacion y no devuelve tareas en enfriamiento como piscina aleatoria. `ui_hub.js` conserva las tarjetas de categoria como elementos interactivos tactiles mediante su `onclick`; no anade navegacion ni activacion por teclado. No se modifica contenido, recompensas ni el esquema de saves; el resultado pendiente conserva la intencion de completado manual para sobrevivir a una recarga.

---

## 9. Recuentos de contenido (verificados 2026-07-31)

### Tareas

| Fuente | Cantidad | Distribucion |
|---|---:|---|
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

**Ejecutar antes de abrir cualquier PR** que modifique ficheros de datos (`items.js`, `enemies.js`, `quests.js`, `classes.js`, `data_tasks.js`, `expansion_*.js`) o el orden de carga / assets (`index.html`, `sw.js`). Para un cambio puramente de documentacion o UI, ejecutar al menos `node --check` en todos los JS modificados y la suite de pruebas relevante.

### Primera ejecucion (2026-07-31, estado actual del repo)

- Catalogos cargados: ITEMS=87, ENEMIES=85, QUESTS=33, CLASS_TREE=6, DEFAULT_TASKS=41.
- Resultado: **Exit 1**.
- Errores: 96 referencias rotas en `DEFAULT_TASKS[*].drops.items` y `sideQuest.drops` (`BROKEN_ITEM_REF` / `TASK_DROP_DISPLAY_NAME`); 3 referencias no ASCII en `enemies.js`; 1 warning de `index.html` sin `<script src>` para `ui_quests.js` por divergencia del archivo en ese commit.
- Accion: no instalar esa expansion en produccion hasta corregir la trazabilidad; el validador evita falsificar la instalacion completa.

### Verificacion registrada (2026-08-12)

- `validate_content.js` en el estado saneado reporto 174 items, 103 enemigos, 53 quests, 6 clases y 55 tareas.
- Resultado: **Exit 0** para integridad de catalogos y assets; persisten solo warnings documentados de items no obtenibles.

### Verificacion registrada (2026-08-21, Fase 3A)

- `validate_content.js` reporto `Exit 0` tras validar `DEFAULT_TASKS` base y expansion con 55 tareas, 174 items, 103 enemigos, 53 quests y 6 clases.
- La suite `tests/save_migrations.test.js` reporto todas las pruebas de migracion, disponibilidad, historial, archivado, revision legacy e idempotencia superadas.

### 11. Cambios recientes

#### `feat/combat-formations-target-selection`

- **Fecha:** 2026-08-25.
- **Objetivo:** permitir combates de uno o varios miembros con seleccion explicita de objetivo.
- **Archivos:** `combat.js`, `ui_combat.js`, `index.html`, `PROJECT_MAP.md`.
- **Compatibilidad:** no hay migracion de save; los encuentros individuales se envuelven en formaciones de un miembro y `combatState.enemy` se mantiene como alias.

#### `feat/combat-formations-foundation`

- **Fecha:** 2026-08-25.
- **Objetivo:** establecer el modelo de formaciones y el contrato de seleccion sin activar aun grupos jugables.
- **Archivos:** `combat.js`, `PROJECT_MAP.md`.
- **No incluye:** generacion aleatoria de grupos ni contenido nuevo.
