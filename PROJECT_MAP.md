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
| Ultima actualizacion | 2026-08-19 (`fix/rewards-recoverable` -- validacion transaccional de referencias de recompensas, Fase A1) |
| Branch de produccion | `main` |
| Branches existentes verificados | `main`, `backup/pre-sanitation-2026-07-30`, `chore/dt15-project-map-sync`, `fix/rewards-contract`, `fix/quest-ui-modal-wrappers`, `fix/rewards-recoverable` |
| Tags de backup existentes verificados | Ninguno visible en el repositorio; la copia de seguridad disponible es la rama `backup/pre-sanitation-2026-07-30` |
| Ramas historicas citadas | Las ramas de PR integradas o eliminadas se conservan unicamente en el changelog; no son ramas activas |
| Commit de `main` verificado | `9fcaf2d9a8e649f62d0ff65f813f8f78dd3cb728` |
| Commit de la rama de backup | `218cb09e118920b5323598e194c1bd8f07be2ae1` |
| Build string | `LIFE_XP_BUILD = 'v13.6-inventory-language-boundary'` |
| Publicacion | GitHub Pages - rama `main`, raiz `/` |
| URL publica | `https://final2raven-coder.github.io/lifexp/` |
| Entrada | `index.html` (SPA de una sola pagina) |
| PWA | `manifest.json` + `sw.js` (cache-first, CACHE_NAME = lifexp-v22, sincronizado con index.html via validador check 10) |

---

## 1. Arquitectura en 10 lineas

LifeXP es una **SPA vanilla JS / PWA** sin bundler ni framework.
`index.html` carga los catalogos primero, despues el motor y finalmente las capas de UI y sistemas secundarios. El estado vivo es `gameState` en `engine.js`, persistido en `localStorage`.
Los catalogos son objetos/listas globales (`ITEMS`, `ENEMIES`, `QUESTS`, `CLASS_TREE`, `DEFAULT_TASKS`) y las expansiones se cargan de forma declarativa antes de `update2_content.js`.
La UI de quests consume wrappers estables; los drops de tareas y combate pasan por `LifeXPInventory.deliverReward()`.
La frontera de recompensas mantiene `pendingLoot` y `rewardLedger` para reintentos sin duplicacion ni reroll.
Las migraciones de save son encadenadas, conservan campos desconocidos y guardan snapshots premigracion.
La instalacion de Update 2 es aditiva, idempotente y transaccional.
El validador de contenido se ejecuta manualmente; CI cubre sintaxis y fixtures de migracion/transaccion.
El despliegue es GitHub Pages desde `main`.

---

## 2. Inventario de ficheros relevantes

### 2a. Entrada y configuracion

| Fichero | Bytes | Responsabilidad |
|---|---:|---|
| `index.html` | 86848 | Shell SPA y orden de carga de scripts |
| `manifest.json` | 900 | Metadatos PWA |
| `sw.js` | 2656 | Service worker cache-first |

### 2b. Datos base

| Fichero | Bytes | Responsabilidad |
|---|---:|---|
| `classes.js` | 36515 | `CLASS_TREE` y clases |
| `items.js` | 46351 | `ITEMS`, `RARITY`, `ITEM_TYPE`, `DROP_TABLES` |
| `enemies.js` | 31277 | `ENEMIES`, `THEME_ENEMIES` |
| `quests.js` | 14649 | `QUESTS`, prerequisitos y wrappers estables |
| `data_tasks.js` | 22154 | `DEFAULT_TASKS` |

### 2c. Expansiones de contenido

| Fichero | Bytes | Responsabilidad |
|---|---:|---|
| `expansion_items.js` | 13695 | `EXPANSION_ITEMS_V1` y `EXPANSION_DROP_TABLES_V1` |
| `expansion_enemies.js` | 2750 | `EXPANSION_ENEMIES_V1` |
| `expansion_quests.js` | 10156 | `EXPANSION_QUESTS_V1` |
| `expansion_tasks.js` | 7322 | `EXPANSION_TASKS_V1` |
| `update2_content.js` | 13452 | Instalacion idempotente, parches narrativos y validacion transaccional |

### 2d. Motor y sistemas

| Fichero | Bytes | Responsabilidad |
|---|---:|---|
| `engine.js` | 158402 | Estado, tareas, migraciones y persistencia |
| `combat.js` | 36557 | Combate y rewards estructuradas |
| `quests.js` | 14649 | Estado y acciones de quests |
| `inventory_system.js` | 17831 | Entrega canonica de recompensas |
| `item_system.js` | 52710 | Equipamiento, attunement y rituales |
| `guild.js` | 23834 | Guild/coop receipts y sincronizacion |

### 2e. UI y soporte

| Fichero | Bytes | Responsabilidad |
|---|---:|---|
| `ui_hub.js` | 33898 | Hub, inventario y equipamiento |
| `ui_tasks.js` | 31985 | UI de tareas |
| `ui_combat.js` | 43414 | UI de combate |
| `ui_misc.js` | 42076 | Mapa, gremio, lore y clase |
| `ui_feedback.js` | 7042 | Toasts y feedback |
| `ui_quests.js` | 31560 | UI de quests |
| `main.js` | 28540 | Arranque, listeners y service worker |
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

## 6. Invariantes criticos

1. **`gameState` es el unico estado mutable.** Ningun fichero de datos (ITEMS, ENEMIES, QUESTS, etc.) se modifica

2. **`localStorage` es parte de la persistencia.** La clave principal es `lifexp_save`.

3. **Las recompensas se entregan por la frontera canonica.** Toda recompensa pasa por `LifeXPInventory.deliverReward()`.

4. **Los IDs de items son canonicos.** Las referencias de drops usan IDs `snake_case` declarados en `ITEMS`.

5. **La migracion es conservadora.** No se borran campos desconocidos y se conserva un backup del raw save antes de migrar.

6. **Las instalaciones de contenido son idempotentes.** Un marcador en `gameState` evita duplicados.

7. **El orden de carga es contrato.** Los ficheros de expansion deben existir antes de `update2_content.js`.

8. **Los commits durables ocurren despues de las validaciones.** Una instalacion transaccional no escribe el marcador ni llama a `saveGame()` hasta haber validado catalogos, referencias y renderizado.

9. **Un rollback restaura estructura y contenido.** Las restauraciones profundas devuelven tambien la longitud original de arrays, no solo sus claves numeradas.

7. Deuda tecnica conocida

- `validate_content.js` conserva errores baseline historicos en el catalogo de enemigos y varias referencias de contenido.
- Hay avisos de `UNOBTAINABLE_ITEM` que requieren un diagnostico separado.
- El engine es grande y mezcla estado, reglas y UI indirecta; cualquier refactor requiere una rama propia y aprobacion.
- La sincronizacion PWA depende de actualizar `CACHE_NAME` cuando se incorporan ficheros nuevos.

## 8. Changelog del mapa

- **2026-08-19 - `fix/rewards-recoverable` (Fase A2):** el rollback restaura la longitud original de arrays mutados, y el renderizado de Update 2 ocurre antes del `commitSave()`, que queda como ultimo paso durable. El fixture verifica que un fallo de render no escribe el save ni deja tareas parciales.

- **2026-08-19 - `fix/rewards-recoverable` (Fase A1):** la instalacion transaccional valida de forma general las referencias de recompensas antes de guardar. Se cubren tablas de drops, drops de enemigos, drops de tareas y side quests en array u objeto, recompensas de quests y recompensas de capitulos. Una referencia no canonica o ausente provoca rollback determinista y conserva el save anterior. La cobertura vive en `tests/update2_transaction.test.js`, que prueba siete formas de referencia rota.


| 2026-08-19 | `fix/quest-ui-modal-wrappers` | Expone aliases estables hacia `acceptQuest` y `abandonQuest` de `quests.js` para que la UI no dependa de redefiniciones, y corrige el cierre del modal de aceptación para cerrar el modal que realmente se abre. No toca contenido jugable, saves ni `main`. |

| 2026-08-19 | `fix/rewards-contract` (Fase 1C) | Conecta combate con la frontera canonica: el paquete de recompensas y su claim ID se crean una sola vez por combate; XP y oro se aplican una sola vez; cada drop usa un claim independiente y conserva los estados `granted`, `pending` o `rejected` para reintento sin reroll. La UI muestra el resultado estructurado de cada drop. No toca contenido jugable; quests siguen pendientes. |

| 2026-08-19 | `fix/rewards-contract` (Fase 1B) | Conecta drops de tareas y side quests con `LifeXPInventory.deliverReward()`, normaliza formas actuales y legacy y elimina inserciones directas no canonicas. No cambia XP, oro, historial ni reglas de drop. |

| 2026-08-19 | `fix/rewards-contract` (Fase 1A) | Introduce el contrato durable de recompensas sin tocar contenido: `pendingLoot` pasa a `{ version: 1, entries: [] }` con normalizacion compatible con `null`, arrays y formatos legacy; `rewardLedger` registra `claimId` y estados; `LifeXPInventory.deliverReward()` resuelve IDs canonicos, comprueba la insercion real y devuelve `granted`, `pending` o `rejected`. Compatible con saves anteriores y sin duplicar recompensas. |

| 2026-08-12 | `fix/content-validator-scope` | El validador acepta `--dir`, omite ficheros no presentes sin inventar errores y documenta el estado baseline; el gate CI permanece en sintaxis y fixtures runtime. |

| 2026-08-12 | `fix/quest-id-normalization` | Normaliza referencias de quests a IDs canonicos sin borrar progreso legacy; conserva `activeQuests` no resolubles con `unresolved: true` y registra la recuperacion pendiente. Incluye migraciones v2 parciales, rollback y snapshots. |

| 2026-08-12 | `chore/dt15-project-map-sync` | Sincroniza el mapa con los simbolos y lineas reales del repositorio; no cambia comportamiento. |

| 2026-08-12 | `fix/save-recovery` | Migra saves v0-v3, conserva campos desconocidos y guarda snapshots premigracion con rollback visible si el candidato falla. |

| 2026-08-11 | `fix/rewards-recoverable` | Añade el contrato de pendingLoot y ledger, protege entregas contra duplicados y hace recuperables las recompensas que no caben en inventario. |

## 9. Comandos de validacion

### Sintaxis y tests

```bash
node --check engine.js
node --check update2_content.js
node --check tests/save_migrations.test.js
node --check tests/update2_transaction.test.js
node tests/save_migrations.test.js
node tests/update2_transaction.test.js
```

### Validador de contenido

```bash
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
