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
`index.html` contiene toda la carcasa visual y carga los scripts en un orden estricto.
`engine.js` posee el estado mutable y el contrato de persistencia.
`items.js`, `enemies.js`, `quests.js`, `classes.js` y `data_tasks.js` son catalogos base declarativos.
Los ficheros `expansion_*.js` exponen instaladores declarativos y `update2_content.js` valida su orden de carga, los ejecuta explicitamente, comprueba la instalacion completa antes de marcar la actualizacion y revierte catalogos, estado en memoria y save si falla cualquier paso.
`inventory_system.js` mantiene la resolucion canonica de items y la entrega durable de recompensas.
`combat.js` calcula recompensas de combate y delega su entrega al subsistema de inventario.
`ui_tasks.js` conecta completado de tareas y side quests con la entrega durable y su recuperacion.
`ui_quests.js` renderiza las quests y sus recompensas segun el contrato de `quests.js`.
`validate_content.js` comprueba sintaxis, referencias, duplicados, orden de carga y coherencia de catalogos antes de publicar.

---

## 2. Inventario de ficheros

| Carpeta / fichero | Responsabilidad |
|---|---|
| `index.html` | SPA completa: HTML, CSS, modales y orden de carga |
| `main.js` | Bootstrap, registro de service worker y arranque |
| `engine.js` | `gameState`, persistencia, migraciones, tareas disponibles y navegacion |
| `items.js` | Catalogo canonico `ITEMS`, `RARITY` e `ITEM_TYPE` |
| `enemies.js` | Catalogo canonico `ENEMIES`, tablas tematicas y enemigos de expansion base |
| `quests.js` | Catalogo canonico `QUESTS`, progreso, estados y recompensas de quests |
| `classes.js` | Arbol de clases y progresion |
| `data_tasks.js` | Tareas base y `LIFE_XP_BUILD` |
| `expansion_items.js` | Items, tablas de drops y sus instaladores |
| `expansion_enemies.js` | Enemigos y tablas de enemigos de expansion |
| `expansion_quests.js` | Quests declarativas de expansion |
| `expansion_tasks.js` | Tareas adicionales declarativas |
| `update2_content.js` | Instalacion transaccional de Update 2, validacion de referencias de recompensas y rollback |
| `inventory_system.js` | Resolucion, entrega, pendientes, ledger y recuperacion de recompensas |
| `item_system.js` | Equipamiento, attunement, rituales, maldiciones y compatibilidad de objetos |
| `item_flavor.js` | Presentacion de objetos y flavor text |
| `combat.js` | Combate y drops de enemigos |
| `ui_tasks.js` | Pantalla de tareas, completado, drops, side quests y recuperacion |
| `ui_quests.js` | Pantalla de quests y detalle de recompensas |
| `ui_hub.js` | Pantalla principal y resumen del estado |
| `ui_combat.js` | Interfaz visual de combate |
| `ui_misc.js` | Utilidades visuales, exportacion y accesibilidad |
| `ui_feedback.js` | Toasts y feedback de acciones |
| `guild.js` | Sistema de gremio y receipts |
| `sw.js` | Service worker cache-first |
| `manifest.json` | Metadatos de PWA |
| `validate_content.js` | Validador local/CI de integridad |
| `tests/save_migrations.test.js` | Pruebas de migraciones, backup y rollback de saves |
| `tests/update2_transaction.test.js` | Pruebas transaccionales de Update 2 y referencias de recompensas |
| `emergency-save.html` | Herramienta manual de exportacion/importacion de saves |
| `PROJECT_MAP.md` | Mapa vivo de estructura, contratos, invariantes y changelog |

---

## 3. Modelo de datos: `gameState`

`gameState` es el unico estado mutable. Los catalogos son datos declarativos y no se modifican salvo durante una instalacion transaccional que se revierte si falla.

Campos criticos:

- `inventory`: lista de stacks de items canonicos.
- `equipment`: slots por tipo de equipamiento.
- `stash`: baul persistente.
- `pendingLoot`: bandeja durable de recompensas pendientes; version 1.
- `rewardLedger`: estados por `claimId`, con entrega idempotente.
- `quests`: estado canonico de quests activas, completadas y fallidas.
- `loreUnlocked`: entradas de lore ya descubiertas.
- `acclimation`: progreso de aclimatacion.
- `itemSystem`: attunement, rituales y maldiciones.
- `saveVersion`: version de save; la actual es 3.

---

## 4. Modelos de datos: contenido

### Items

`ITEMS[id]` exige IDs canonicos estables y tipos declarados por `ITEM_TYPE`: `weapon`, `armor`, `accessory`, `artifact`, `consumable`, `material`, `skill` y `key`.

`fragmento_historia` pertenece al tipo `material` cuando aparece en el catalogo. No existe un tipo canonico `story` o `lore`.

### Drops

- Las tablas `DROP_TABLES[theme]` contienen IDs de items.
- Los enemigos declaran drops con `itemId` y metadata de probabilidad/cantidad segun el modelo existente.
- Las tareas declaran `drops: { theme, items }` o un valor nulo; una side quest puede declarar drops como array o como objeto compatible.
- Las quests pueden declarar `reward`, `rewards` y recompensas equivalentes dentro de `chapters`.
- Toda referencia de inventario debe resolver a una clave existente de `ITEMS`; los nombres visibles no son IDs canonicos.

### Instaladores

Los instaladores de expansion son idempotentes y no deben borrar datos existentes. `update2_content.js` hace backup del save, captura snapshots de catalogos y estado, instala, valida y solo despues marca y guarda la actualizacion.

---

## 5. Orden de carga de scripts (index.html, lineas 1373-1395)

1. `engine.js`
2. `classes.js`
3. `items.js`
4. `enemies.js`
5. `quests.js`
6. `data_tasks.js`
7. `expansion_items.js`
8. `expansion_enemies.js`
9. `expansion_quests.js`
10. `expansion_tasks.js`
11. `inventory_system.js`
12. `item_system.js`
13. `combat.js`
14. `ui_tasks.js`
15. `ui_quests.js`
16. `ui_hub.js`
17. `ui_combat.js`
18. `ui_misc.js`
19. `ui_feedback.js`
20. `update2_content.js`
21. `main.js`

---

## 6. Invariantes criticos

1. **`gameState` es el unico estado mutable.** Ningun fichero de datos (ITEMS, ENEMIES, QUESTS, etc.) se modifica en runtime salvo dentro de una instalacion transaccional con rollback.
2. **Los IDs de contenido son unicos y estables.** No se reutilizan IDs con otro significado.
3. **Los drops de inventario usan IDs canonicos.** Nunca se convierten nombres de display en items nuevos durante la entrega.
4. **Los saves antiguos son compatibles.** Las migraciones son deterministas, hacen backup y no borran datos no resolubles.
5. **`update2_content.js` es una IIFE transaccional.** Se auto-ejecuta al cargarse; comprueba si ya se aplico antes de actuar; si falla un instalador o cualquier paso posterior restaura catalogos, `gameState` y `lifexp_save`; una instalacion correcta es idempotente. La validacion bloqueante recorre tablas de drops, enemigos, tareas, side quests, recompensas de quests y capitulos antes de guardar.
6. **La UI no es fuente de verdad.** Renderiza el estado persistido y no concede recompensas por si sola.
7. **`pendingLoot` no pierde referencias.** Lo no resoluble se conserva para recuperacion y exportacion.
8. **`rewardLedger` evita duplicados.** Un mismo `claimId` no vuelve a insertar la misma recompensa.
9. **No se hace reroll silencioso.** La recuperacion usa el payload original.
10. **El contenido narrativo no se revela en validadores o mensajes tecnicos al jugador.**
11. **Las referencias de quests desconocidas no bloquean la carga del save.** Se conservan y se presentan como estado recuperable.
12. **Contrato de recompensas durable.** `pendingLoot` usa `{ version: 1, entries: [] }` y acepta formatos legacy al cargar; `rewardLedger` registra `claimId` y estados para que las entregas sean idempotentes. `ui_tasks.js` y `combat.js` conectan tareas, side quests y combate a `LifeXPInventory.deliverReward()`; la instalacion transaccional bloquea referencias de drops no canonicas o ausentes antes del commit.

---

## 7. Registro de deuda tecnica

| ID | Deuda | Riesgo | Estado |
|---|---|---|---|
| DT-08 | `update2_content.js` parchea quests por IDs concretos. | Baja | **ABIERTO** | Owner: mantenedor. Siguiente accion: evaluar una API declarativa de patches; conservar el comportamiento actual hasta aprobar el refactor. |
| DT-09 | La bandeja de recuperacion necesita una UI general unica. | Media | **ABIERTO** | Owner: mantenedor. Siguiente accion: Fase B de `fix/rewards-recoverable`. |
| DT-10 | Hay aliases legacy en `inventory_system.js`. | Baja | **ABIERTO** | Owner: mantenedor. Siguiente accion: reducir aliases cuando los saves antiguos ya tengan migracion segura. |
| DT-11 | La entrega de quests debe usar claim IDs estables en todos los consumidores. | Media | **ABIERTO** | Owner: mantenedor. Siguiente accion: Fase B/C de `fix/rewards-recoverable`. |

---

## 3b. Contrato de persistencia y recuperacion

- `saveGame()` serializa el estado canonico completo sin eliminar campos desconocidos.
- `loadGame()` hace backup antes de migrar y conserva payloads legacy no resolubles.
- `pendingLoot.entries[]` guarda `claimId`, origen, referencia original, estado y metadata suficiente para recuperar sin reroll.
- `rewardLedger[claimId]` guarda el estado final o pendiente de cada entrega.
- Los errores de instalacion restauran el save anterior y dejan un backup de la transaccion.
- `update2_content.js` valida catalogs, instaladores y entradas de expansion antes de marcar la actualizacion; su transaccion restaura snapshots profundos de `ITEMS`, `ENEMIES`, `QUESTS`, `DEFAULT_TASKS`, `DROP_TABLES`, `THEME_ENEMIES`, `gameState` y `lifexp_save` ante cualquier fallo. Tambien valida que las referencias de inventario sean IDs canonicos existentes en `ITEMS`.

### Pruebas existentes

- Fixtures de regresion: `tests/save_migrations.test.js` (v0, v1, v2 legacy/canonico, v2 parcial con recuperacion legacy, rollback de parcial, quest canonica desconocida, v3, corrupcion, snapshots y DT-17) y `tests/update2_transaction.test.js` (instalacion, cuatro instaladores, commit, rollback, reintento e idempotencia).
- `.github/workflows/ci.yml` ejecuta en cada push y pull request `node --check` sobre los scripts de produccion y las suites `tests/save_migrations.test.js` y `tests/update2_transaction.test.js`, usando Node.js `22.14.0`.

---

## 8. Changelog del mapa

- **2026-08-19 - `fix/rewards-recoverable` (Fase A1):** la instalacion transaccional valida de forma general las referencias de recompensas antes de guardar. Se cubren tablas de drops, drops de enemigos, drops de tareas y side quests en array u objeto, recompensas de quests y recompensas de capitulos. Una referencia no canonica o ausente provoca rollback determinista y conserva el save anterior. La cobertura vive en `tests/update2_transaction.test.js`, que prueba siete formas de referencia rota.

- **2026-08-19 - `fix/quest-ui-modal-wrappers`:** se corrigieron aliases canonicos del modal de quests, cierre consistente de wrappers y renderizado estable de detalle/progreso. No cambia el modelo de saves ni el contrato de recompensas.
- **2026-08-18 - `fix/update2-transaction`:** instalacion transaccional de Update 2 con backup exacto, snapshots profundos, rollback y reintento seguro.
- **2026-08-18 - `fix/rewards-contract`:** contrato durable inicial para `pendingLoot`, `rewardLedger`, normalizacion de referencias legacy y entrega idempotente desde tareas y combate.

---

## 9. Recuentos de contenido (verificados 2026-07-31)

| Catalogo | Base | Expansion | Total aproximado |
|---|---:|---:|---:|
| Items | 64 | 1 | 65 |
| Enemigos | 28 | 5 | 33 |
| Quests | 12 | 4 | 16 |
| Tareas | 42 | 9 | 51 |
| Tablas de drops | 11 | 3 | 14 |

---

## 10. Validador de integridad de contenido

`validate_content.js` se ejecuta con `node validate_content.js` desde la raiz.

Comprueba como minimo:

1. Sintaxis de todos los scripts declarativos.
2. IDs duplicados o fuera de `snake_case`.
3. Referencias de drops de enemigos a `ITEMS`.
4. Referencias de `DROP_TABLES` a `ITEMS`.
5. Referencias de `THEME_ENEMIES` a `ENEMIES`.
6. Referencias de quests a tareas, clases, enemigos e items segun el modelo existente.
7. Tareas y side quests sin campos requeridos.
8. Compatibilidad de `fragmento_historia` como `material` cuando esta soportado.
9. Coherencia de la orden de carga y de la cache PWA.

Se debe ejecutar antes de abrir cualquier PR que modifique ficheros de datos o scripts de instalacion. Si hay errores, el PR no se mergea.
