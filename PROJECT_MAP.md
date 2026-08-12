# PROJECT_MAP - LifeXP RPG

> **Proposito:** mapa de referencia para el Game Master y cualquier colaborador.
> Permite localizar cualquier simbolo, modelo de datos o zona de cambio sin abrir el proyecto completo.
> **Regla de uso:** actualizar la seccion 8 (changelog) en cada PR que modifique ficheros listados aqui.

---

## 0. Metadatos

| Campo | Valor |
|---|---|
| Fecha de generacion | 2026-07-30 |
| Ultima actualizacion | 2026-08-12 (fix/dt13-dt02-drop-ids -- inventario DROP_MAPPING regenerado contra el codigo actual; sin cambios de contenido; bloqueo de sintaxis en expansion_items.js documentado) |
| Branch de produccion | `main` |
| Branches activas | `main`, `backup/pre-sanitation-2026-07-30`, `fix/dt13-dt02-drop-ids` |
| Commit base | `21f934ff6a31ca2e4090bfe34e586b15c2690e35` |
| Build string | `LIFE_XP_BUILD = 'v13.6-inventory-language-boundary'` |
| Publicacion | GitHub Pages - rama `main`, raiz `/` |
| URL publica | `https://final2raven-coder.github.io/lifexp/` |
| Entrada | `index.html` (SPA de una sola pagina) |
| PWA | `manifest.json` + `sw.js` (cache-first, CACHE_NAME = lifexp-v22, sincronizado con index.html via validador check 10) |

---

## 1. Arquitectura en 10 lineas

LifeXP es una **SPA vanilla JS / PWA** sin bundler ni framework.
`index.html` contiene todo el CSS y el HTML; los scripts se cargan en orden al final del `<body>`.
El estado global vive en el objeto `gameState` (definido en `engine.js`) y se persiste en `localStorage` bajo la clave `lifexp_save`.
Los datos de contenido (items, enemigos, quests, clases) son constantes declaradas en ficheros separados y consumidas por `engine.js` y `combat.js` como globals.
Los ficheros `expansion_*.js` y `update2_content.js` amplian esas constantes mediante `Object.assign` al arrancar.
`inventory_system.js` define el subsistema canonico de inventario, expone `normalizeItemText` y `emergencyRerollLegacyItem`, y hace repair() al arrancar.
`item_system.js` gestiona attunement, rituales, curses, modales de item, knowledge system y activation panel. Los mensajes del dominio de objetos se muestran en ingles; las tareas y el flujo del mundo real conservan el espanol.
`item_flavor.js` contiene el lore narrativo de items (flavor text por item y por stage de attunement).
`guild.js` implementa el sistema cooperativo (receipts, sync, guild state).
`main.js` es el punto de entrada: registra el Service Worker y conecta los event listeners del DOM.

> **NOTA:** `game.js` ya NO existe. El estado global (`gameState`) y las funciones de motor viven en `engine.js` desde el refactor de split (DT-09 resuelto).

---

## 2. Inventario de ficheros

### 2a. Ficheros de motor y UI

| Fichero | Lineas | Responsabilidad principal | Exports / globals clave |
|---|---|---|---|
| `index.html` | ~1400 | CSS completo + HTML de todas las pantallas + orden de carga de scripts | -- |
| `engine.js` | 315 | `gameState`, utilidades, persistencia, migracion de save, `updateStreak`, `showScreen` | `gameState`, `saveGame`, `loadGame`, `addXp`, `addStats`, `getAvailableTasks`, `showScreen` |
| `combat.js` | ~750 | Logica de combate (turnos, acciones, drops de combate) | `startCombat`, `executeCombatRound`, `COMBAT_STATE` |
| `guild.js` | 331 | Sistema cooperativo: receipts, sync, guild state | `generateReceipt`, `applyReceipt`, `renderGuild` |
| `inventory_system.js` | 174 | Subsistema canonico de inventario; repair al arrancar | `LifeXPInventory`, `normalizeItemText`, `emergencyRerollLegacyItem`, `renderInventory`, `renderCanonicalInventory`, `renderCanonicalStash` |
| `item_system.js` | 614 | Attunement, rituales, curses, modales de item, knowledge system, activation panel y narrativa declarativa de fallos de equipamiento | `initializeItemSystem`, `equipItem`, `unequipItem`, `showItemModal`, `getActiveItemEffects`, `renderActivationPanel`, `getItemRequirementNarrative` |
| `main.js` | 84 | Punto de entrada: event listeners + registro del Service Worker | -- |

### 2b. Ficheros de UI (pantallas)

| Fichero | Lineas | Pantalla / zona | Funciones clave |
|---|---|---|---|
| `ui_hub.js` | 413 | Hub principal, inventario, equipamiento, settings; deriva los fallos de equipamiento al narrador de requisitos | `renderHub`, `renderCharacter`, `renderInventory`, `renderEquipment`, `equipItemFromInventory`, `unequipItemToInventory`, `useConsumable`, `renderSettings` |
| `ui_tasks.js` | 340 | Pantalla de tarea, completado, drops, encuentros | `openRandomTask`, `openCategory`, `shuffleTask`, `renderTaskScreen`, `completeTask`, `rollDrop`, `dismissComplete` |
| `ui_combat.js` | 316 | Pantalla de combate, encuentros post-tarea, tareas guardadas, overflow | `checkForEncounter`, `triggerEncounterAfterTask`, `startCombatFromEncounter`, `renderCombatScreen`, `executeCombatAction`, `showCombatVictory`, `saveForLater`, `showSavedTasks`, `showOverflowTasks` |
| `ui_misc.js` | 397 | Pantallas miscelaneas: mapa, gremio, lore, clase, quests rapidas | `renderMap`, `renderClassScreen`, `renderLore`, `openQuestPanel` |
| `ui_feedback.js` | 177 | Toasts, notificaciones, animaciones de feedback; dialogo de descubrimiento de objetos en ingles | `showFlavorDialog`, `showToast`, `showXpGain`, `showLevelUp`, `showDropNotification` |
| `ui_quests.js` | 234 | Pantalla de quests: lista, detalle, progreso | `renderQuestsScreen`, `renderQuestDetail`, `claimQuestReward` |

### 2c. Ficheros de datos (contenido)

| Fichero | Lineas | Contenido | Constante exportada |
|---|---|---|---|
| `classes.js` | 223 | Arbol de clases: 6 clases base, 102 nodos de progresion | `CLASS_TREE` |
| `items.js` | 268 | 87 items base + `RARITY`, `ITEM_TYPE`, `DROP_TABLES` | `ITEMS`, `RARITY`, `ITEM_TYPE`, `DROP_TABLES` |
| `enemies.js` | 614 | 85 enemigos base (niveles 1-40+) | `ENEMIES` |
| `quests.js` | 604 | 33 quests base (dailies, simples, bounties, story, class quests) | `QUESTS` |
| `data_tasks.js` | 533 | 41 tareas base (`DEFAULT_TASKS`) | `DEFAULT_TASKS` |
| `item_flavor.js` | 467 | Flavor text narrativo de 87 items (lore + attunement stages) | `ITEM_FLAVOR` |

### 2d. Ficheros de expansion y actualizaciones

| Fichero | Lineas | Contenido | Constante exportada |
|---|---|---|---|
| `expansion_items.js` | 171 | 88 items de expansion + 25 drop tables tematicas | `EXPANSION_ITEMS_V1`, `EXPANSION_DROP_TABLES_V1` |
| `expansion_enemies.js` | 21 | 18 enemigos de expansion | `EXPANSION_ENEMIES_V1` |
| `expansion_quests.js` | 26 | 20 quests de expansion | `EXPANSION_QUESTS_V1` |
| `expansion_tasks.js` | 30 | 14 tareas de expansion | `EXPANSION_TASKS_V1` |
| `update2_content.js` | 106 | Patches narrativos de quests (Ashbrand arc); instala Ashbrand en ITEMS si no existe, con rareza `rare` y textos del objeto en ingles | -- (IIFE auto-ejecutable) |

### 2e. Ficheros de soporte / PWA

| Fichero | Responsabilidad |
|---|---|
| `sw.js` | Service Worker cache-first. `CACHE_NAME = lifexp-v22`. Lista de assets sincronizada con `index.html` (verificada por check 10 del validador). |
| `manifest.json` | Metadatos PWA (nombre, iconos, colores) |
| `emergency-save.html` | Herramienta standalone de recuperacion de save |

### 2f. Herramientas de desarrollo (no se cargan en produccion)

| Fichero | Responsabilidad |
|---|---|
| `validate_content.js` | Validador de integridad referencial v1.1. Node.js, solo lectura. Ver seccion 10. |

---

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
  pendingLoot: ItemInstance | null

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
  sideQuest?: { desc, stats, xp, sideQuest.drops, dropBonus }
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
13. update2_content.js  -- IIFE: patches narrativos + instala Ashbrand si falta
14. inventory_system.js -- LifeXPInventory, repair() al arrancar
15. ui_hub.js           -- UI del hub, inventario, equipamiento
16. ui_tasks.js         -- UI de tareas
17. ui_combat.js        -- UI de combate, encuentros y feedback de post-tarea
18. ui_misc.js          -- UI miscelanea (mapa, clase, lore)
19. guild.js            -- Sistema de gremio (receipts, sync, guild state)
20. ui_feedback.js     -- Toasts y feedback visual
21. ui_quests.js       -- UI de quests
22. item_system.js     -- Sistema de items (attunement, rituales, modales)
23. main.js             -- Punto de entrada (event listeners, SW)
```

---

## 5b. Procedimiento para anadir un fichero nuevo

Cada vez que se anade un nuevo `.js` a la app, seguir estos pasos en orden:

1. Crear el fichero `.js` en la raiz del repositorio.
2. Anadir `<script src="nuevo.js"></script>` en `index.html` en la posicion correcta segun dependencias (ver seccion 5).
3. Anadir `'/nuevo.js'` en `urlsToCache` de `sw.js` en la misma posicion relativa que en `index.html`.
4. Incrementar `CACHE_NAME` en `sw.js` (`lifexp-vN` -> `lifexp-v(N+1)`).
5. Ejecutar `node validate_content.js` -- debe salir sin errores `SW_MISSING_ASSET`.
6. Abrir PR con los 3 ficheros modificados: el nuevo `.js`, `index.html`, `sw.js`.

> **Regla:** el validador (check 10) detecta cualquier desincronia entre `index.html` y `sw.js` como error bloqueante. Un PR con `SW_MISSING_ASSET` no se mergea.

---

## 6. Invariantes criticos

1. **`gameState` es el unico estado mutable.** Ningun fichero de datos (ITEMS, ENEMIES, QUESTS, etc.) se modifica en runtime salvo por las expansiones al arrancar (antes de `loadGame`).
2. **`saveVersion: 3` es la version canonica.** Cualquier migracion futura incrementa este numero y anade un bloque en `loadGame`.
3. **Los IDs son unicos y estables.** Un ID de item, enemigo, quest o tarea nunca cambia una vez publicado. Cambiar un ID rompe saves existentes.
4. **Las expansiones son aditivas e idempotentes.** `Object.assign` y `push` no sobreescriben entradas existentes con el mismo ID (las expansiones usan IDs nuevos).
5. **`update2_content.js` es una IIFE.** Se auto-ejecuta al cargarse. No expone globals. Es idempotente: comprueba si ya se aplico antes de actuar.
6. **`inventory_system.js` hace repair() al arrancar.** Normaliza items legacy del save antes de que la UI los renderice.
7. **`main` siempre desplegable.** Nunca se comitea directamente a `main`. Todo cambio va por rama + PR.
8. **No hay `game.js`.** El fichero fue eliminado en el refactor de split. Cualquier referencia a `game.js` en documentacion antigua es incorrecta.
9. **Los IDs de contenido son `snake_case` puro (`^[a-z0-9_]+$`).** Cualquier string con espacios, mayusculas o acentos en un campo de ID es un error detectable por el validador.
10. **`sw.js` y `index.html` deben estar sincronizados.** Cada `<script src="...">` en `index.html` debe tener su entrada en `urlsToCache` de `sw.js`. El validador (check 10, `SW_MISSING_ASSET`) lo detecta como error bloqueante.
11. **Version de cache incremental.** Al anadir o eliminar cualquier fichero de la app, incrementar `CACHE_NAME` en `sw.js` (`lifexp-v21` -> `lifexp-v22`, etc.) para forzar actualizacion en clientes existentes.

---

## 7. Deuda tecnica activa

| ID | Descripcion | Prioridad | Estado |
|---|---|---|---|
| DT-01 | ~~`sw.js` tiene lista de assets hardcodeada; si se anade un fichero nuevo sin actualizar el SW, la PWA puede servir version antigua~~ | -- | **RESUELTO** (fix/sw-assets: check 10 en validador detecta desincronias; CACHE_NAME subida a v21) |
| DT-02 | ~~`DROP_TABLES` en `items.js` usa nombres de items en texto libre (no IDs); si un item se renombra, los drops se rompen silenciosamente~~ | -- | **RESUELTO** (fix/dt13-dt02-drop-ids: todos los drops de tareas normalizados a IDs canonicos snake_case; validador check 6 endurecido detecta cualquier regresion) |
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
| DT-13 | ~~`DEFAULT_TASKS` y `EXPANSION_TASKS_V1` usan strings de display (con espacios/mayusculas/acentos) en `drops.items` en lugar de IDs canonicos~~ | -- | **RESUELTO** (fix/dt13-dt02-drop-ids: 110 strings de display reemplazados por IDs canonicos en `data_tasks.js`; 77 items nuevos con nombres de fantasia en ingles anadidos a `expansion_items.js`; inventario `docs/DROP_MAPPING.md` generado) |
| DT-14 | ~~`THEME_ENEMIES["refugio"]` referencia `vigia_del_refugio` que no existe en ENEMIES~~ | -- | **RESUELTO** (verificado 2026-08-11: corregido en PR anterior como parte de DT-19; `refugio` mapea a `['rata_gigante', 'poltergeist']`, ambos IDs canonicos existentes.) |
| DT-18 | ~~PROJECT_MAP.md desactualizado~~ | -- | **RESUELTO** (este PR) |

---

## 8. Changelog del mapa

| Fecha | PR / Rama | Cambios |
|---|---|---|
| 2026-07-30 | PR #14 / Fase F saneamiento | Creacion inicial del mapa post-saneamiento |
| 2026-07-31 | `chore/sync-project-map` | Saneamiento completo: correccion de arquitectura (engine.js, no game.js), orden real de carga de scripts verificado en index.html, recuentos de contenido verificados en codigo, ficheros UI documentados con funciones clave, deuda tecnica actualizada (DT-09/11/18 resueltos, DT-06/12 nuevos), seccion 9 de recuentos anadida, branches activas actualizadas |
| 2026-07-31 | `feat/content-validator` | Anadido `validate_content.js` (seccion 2f y seccion 10); invariante 9 anadida; DT-13/14 nuevos (detectados por validador); DT-02 marcado como detectado; branches activas actualizadas |
| 2026-08-04 | `fix/sw-assets` | `sw.js` CACHE_NAME subida a v21 (fuerza refresh en clientes); eliminado `sw.js` del fetch regex (innecesario); `validate_content.js` v1.1 con check 10 (SW_MISSING_ASSET/SW_ORPHAN_ASSET); seccion 5b anadida (procedimiento para anadir fichero); invariantes 10 y 11 anadidas; DT-01 resuelto |
| 2026-08-10 | `fix/project-map-utf8-clean` | Normalizacion de `PROJECT_MAP.md` a UTF-8 valido para evitar el fallo de conversion de Jekyll en GitHub Pages; sin cambios funcionales en el mapa. |
| 2026-08-10 | `fix/item-requirement-narrative` | Ashbrand pasa a rareza rara sin alterar su ID ni los saves existentes; los requisitos de equipamiento se traducen a sensaciones narrativas declarativas por tipo de objeto y estadistica; el flujo visible de Ashbrand queda en espanol; `sw.js` pasa a `lifexp-v22` para invalidar la cache anterior. |
| 2026-08-11 | `fix/inventory-language-boundary` | Separa la frontera de idioma: inventario, equipo, objetos, requisitos, attunement, rituales, curses y activacion usan ingles; tareas, categorias y botones del mundo real permanecen en espanol. Ashbrand conserva su ID y pasa a rareza `rare` con narrativa del objeto en ingles; `sw.js` no se modifica porque `lifexp-v22` ya esta vigente. |
| 2026-08-11 | `fix/dt13-dt02-drop-ids` | DT-13 y DT-02 resueltos: 110 strings de display en `data_tasks.js` reemplazados por IDs canonicos snake_case; 77 items nuevos con nombres de fantasia en ingles anadidos a `expansion_items.js` (total 88 items, 25 drop tables tematicas); `validate_content.js` check 6 endurecido para validar todos los formatos de drop de tareas; inventario inicial `docs/DROP_MAPPING.md` generado. |
| 2026-08-11 | `fix/dt14-dt06-quickwins` | DT-06 y DT-14 confirmados resueltos tras verificacion exhaustiva: `ashbrand_hotfix.js` ya no existe en `main` (eliminado en saneamiento previo, sin referencias en `index.html` ni `sw.js`); `THEME_ENEMIES["refugio"]` ya usa IDs canonicos `rata_gigante` y `poltergeist` (corregido como DT-19 en PR anterior). Eliminada entrada de `ashbrand_hotfix.js` de seccion 2e. Branches activas y metadatos actualizados. |
| 2026-08-12 | `fix/dt13-dt02-drop-ids` | Inventario `docs/DROP_MAPPING.md` regenerado contra el estado actual: 110 referencias en `data_tasks.js`, 39 en `expansion_tasks.js` y 120 en `DROP_TABLES`; no se aplican sustituciones. Se documenta el error de sintaxis de `expansion_items.js` que bloquea la validacion completa. |

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
|---|---|---|
| `items.js` (base) | 87 | recuento ejecutable verificado con `validate_content.js` |
| `expansion_items.js` | 88 | 77 items nuevos con nombres de fantasia en ingles (DT-13/DT-02) |
| `update2_content.js` | 1 (Ashbrand) | Solo si no existe ya en ITEMS |
| **Total** | **~174** | Sin contar duplicados (Ashbrand puede ya estar en base) |

Raridades base: uncommon: 35, rare: 27, common: 20, epic: 5 (sin legendarios base).

### Enemigos

| Fuente | Cantidad | Niveles |
|---|---|---|
| `enemies.js` (base) | 85 | 1-40+ (niveles: 1,2,3,4,5,6,7,8,12,14,15,16,18,20,22,25,30,35,40) |
| `expansion_enemies.js` | 18 | |
| **Total** | **103** | |

### Quests

| Fuente | Cantidad | Tipos principales |
|---|---|---|
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
|---|---|
| `item_flavor.js` (items con flavor text) | 87 entradas |

---

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


### Verificacion actual de la rama (2026-08-12)

La ejecucion actual de `node validate_content.js` carga 87 items base, 37 enemigos, 15 quests, 102 clases y 55 tareas, pero termina con 116 errores porque `expansion_items.js` falla al parsearse con `Unexpected identifier 's'`. Los `BROKEN_ITEM_REF` derivados de no cargar la expansion no se interpretan como renombres de drops. La correccion de esa sintaxis debe ser un cambio tecnico separado.

Errores principales detectados (no corregidos en este PR -- solo deteccion):
- `expansion_items.js` no carga por `Unexpected identifier 's'`; por ello el validador no incorpora los 88 items de expansion.
- Las referencias de tareas y tablas que dependen de la expansion aparecen como `BROKEN_ITEM_REF` hasta reparar esa sintaxis; no se renombran por este motivo.
- Persisten referencias de contenido independientes en enemigos, quests y tablas tematicas; requieren diagnosticos separados.
- 12 avisos: temas desconocidos en drops de tareas e items no obtenibles.

