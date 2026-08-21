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
| Ultima actualizacion | 2026-08-21 (`feat/category-task-completion` -- Fase 3B, catalogo por categoria y completado manual) |
| Branch de produccion | `main` |
| Branches existentes verificados | `main`, `backup/pre-sanitation-2026-07-30`, `fix/update-verifiable`, `fix/update-verifiable-recovery`, `fix/task-history-availability`, `feat/category-task-completion` |
| Tags de backup existentes verificados | Ninguno visible en el repositorio; la copia de seguridad disponible es la rama `backup/pre-sanitation-2026-07-30` |
| Ramas historicas citadas | Las ramas de PR integradas o eliminadas se conservan unicamente en el changelog; no son ramas activas |
| Commit de `main` verificado | `8660448bd94d8762078f98acca97dd1546cd5abd` |
| Commit actual de `feat/category-task-completion` | `ffd2f4fe394afa9a4e7de341352abf5613fbd8cd` (fase 3B; UI de categorias, accesibilidad y disponibilidad por intervalo) |
| Commit de la rama de backup | `218cb09e118920b5323598e194c1bd8f07be2ae1` |
| Build string | `LIFE_XP_BUILD = 'v13.4-equip-action-fix'` (declaracion efectiva auditada en `data_tasks.js`; el valor `v13.6-inventory-language-boundary` anterior del mapa era incorrecto) |
| Publicacion | GitHub Pages - rama `main`, raiz `/` |
| URL publica | `https://final2raven-coder.github.io/lifexp/` |
| Entrada | `index.html` (SPA de una sola pagina) |
| PWA | `manifest.json` + `sw.js` (cache-first, CACHE_NAME = lifexp-v23, status verificable desde `main.js`, sincronizado con index.html via validador check 10) |

---

## 1. Inventario de ficheros

| Fichero | Rol | Simbolos / zonas relevantes |
|---|---|---|
| `index.html` | Shell de la SPA, pantallas, overlays, estilos base | `#app`, pantallas `screen-*`, overlay de resultado de tarea, modal de inventario |
| `main.js` | Bootstrap, navegacion, PWA, toasts, validadores | `initializeApp`, `showScreen`, `registerServiceWorker`, `runIntegrityChecks` |
| `engine.js` | Estado canonico, tareas, progreso, guardado/carga y migraciones | `DEFAULT_GAME_STATE`, `getTaskAvailability`, `getAvailableTasks`, `loadGameSafely`, `normalizeSaveState`, `createTaskHistoryEntry` |
| `data_tasks.js` | Catalogo y definiciones de tareas | `CATEGORIES`, `DEFAULT_TASKS`, `initializeTasks` |
| `items.js` | Items, drops, inventario, equipamiento, rituales y ledger | `ITEMS`, `rollDropByTheme`, `LifeXPInventory`, `deliverReward` |
| `enemies.js` | Enemigos y encuentros | `ENEMIES` |
| `combat.js` | Combate y resultados | `startCombat`, `endCombat`, `pendingEncounter` |
| `quests.js` | Quests, progreso, estados y recompensas | `QUESTS`, `updateQuestProgress`, `completeQuest` |
| `classes.js` | Clases, habilidades y progresion | `CLASS_TREE` |
| `ui_hub.js` | Hub principal, categorias, accesibilidad de tarjetas | `renderHub`, tarjetas `.cat-card`, apertura de categoria con teclado |
| `ui_tasks.js` | Pantalla de tarea, catalogo por categoria y completado | `openCategory`, `renderCategoryTaskList`, `completeTaskFromCategory`, `completeTask`, `finalizeCompletion`, `pendingTaskResult` |
| `ui_inventory.js` | Inventario, baul y equipamiento | `renderInventory`, `renderStash`, `equipItem`, `unequipItem` |
| `ui_quests.js` | Pantalla de quests y progreso | `renderQuests`, `renderQuestDetail` |
| `ui_character.js` | Hoja de personaje | `renderCharacter` |
| `ui_lore.js` | Lore desbloqueado | `renderLore` |
| `ui_settings.js` | Ajustes, export/import y reset | `exportSave`, `importSave`, `resetGame` |
| `sw.js` | Service worker PWA | cache `lifexp-v23` |
| `PROJECT_MAP.md` | Mapa vivo del proyecto | este fichero |
| `LifeXP_RPG_GDD_v2.md` | GDD canonico | reglas de producto y mecanicas |
| `LifeXP_Agent_Content_Guide_v2.md` | Guia de contenido | restricciones para GM y contenido |
| `CONTENT_AUDIT_GM.md` | Auditoria de contenido | cobertura y deuda de contenido |

### Ficheros que no deben modificarse en esta fase

- `items.js`, `enemies.js`, `quests.js`, `classes.js`: no forman parte del arreglo de catalogo por categoria.
- `main.js`, `index.html`, `sw.js`: no forman parte del alcance funcional de esta fase.
- No se anade contenido nuevo, se cambia balance ni se modifica la estructura de los saves existentes.

---

## 2. Contrato de estado y compatibilidad

### 2.1 Guardado principal

`localStorage['lifexp_save']` contiene el estado completo serializado.

Campos canonicos:

- `player`: `name`, `level`, `xp`, `xpToNext`, `stats`.
- `gold`.
- `tasks`: catalogo persistido con `id`, `cat`, `name`, `desc`, `xp`, `stats`, `schedule` y `lastDone`.
- `taskHistory`: registros de completado con `taskId`, `date`, `xp`, `sideQuest` y `completionId`.
- `savedTasks`.
- `inventory`, `equipment`, `stash`, `stashCapacity`, `inventoryCapacityBonus`.
- `pendingLoot`: estado versionado con entradas pendientes y metadatos conservados.
- `rewardLedger`: ledger de reclamaciones de recompensas.
- `pendingTaskResult`: resultado de tarea pendiente de confirmar en UI.
- `saveVersion`: version canonica actual `4`.
- `quests`, `itemSystem`, `loreUnlocked`, `acclimation`, guild/co-op.

### 2.2 Reglas de compatibilidad

- Los saves anteriores a v4 se normalizan mediante `loadGameSafely` y `normalizeSaveState`.
- Antes de migrar se crea una copia con prefijo `lifexp_premigration_`; se conservan las tres mas recientes.
- La migracion es aditiva: conserva campos desconocidos y metadatos de drops pendientes.
- Un save invalido no reemplaza el save original y muestra un error recuperable.
- `taskHistory` antiguo sin `completionId` sigue siendo legible; los nuevos registros usan identificadores unicos.
- `pendingTaskResult` se conserva para que un resultado visible no se pierda si la pagina se recarga.

### 2.3 Disponibilidad de tareas

`getTaskAvailability(task, referenceDate)` devuelve un estado declarativo:

- `archived`: tarea fuera del catalogo activo.
- `needs_review`: fecha `lastDone` invalida.
- `completed`: limite configurado a cero.
- `available`: puede iniciarse.
- `cooldown`: tiene que esperar hasta `nextAvailableDate`.

Para tareas con `limit: 1`, el cooldown se ancla en la ultima entrada de `taskHistory` y respeta `intervalDays`. El catalogo puede mostrar la tarea y permitir un completado manual explicito durante ese cooldown; el aleatorio solo recibe tareas disponibles y prioriza overflow real.

### 2.4 Recompensas

- Los drops pasan por `LifeXPInventory.deliverReward`.
- `claimId` es unico por completado de tarea, incluso si se repite manualmente el mismo dia.
- Si el inventario esta lleno, el item queda pendiente; nunca desaparece silenciosamente.
- El resultado visible se guarda antes de abrir el modal.
- Si falla el guardado, se restaura el estado anterior y no se presenta una recompensa no persistida.

---

## 3. Navegacion y pantallas

- `showScreen('hub')`: hub principal.
- `showScreen('category-tasks')`: catalogo completo de una categoria.
- `showScreen('task')`: tarea elegida, timer y completado.
- `showScreen('inventory')`: inventario/equipamiento/baul.
- `showScreen('quests')`: quests.
- `showScreen('character')`: personaje.
- `showScreen('lore')`: lore.
- `showScreen('settings')`: ajustes.

### 3.1 Flujo de categoria

1. `renderHub` pinta tarjetas de categoria.
2. Click, Enter o Espacio en una tarjeta llama a `openCategory(catId)`.
3. `renderCategoryTaskList(catId)` muestra todas las tareas no archivadas de esa categoria, estado y ultima fecha.
4. `openRandomTaskFromCategory(catId)` elige solo desde `getAvailableTasks(catId)`.
5. `completeTaskFromCategory(taskId)` permite el completado manual explicito para una tarea `available` o `cooldown`.
6. `completeTask` y `finalizeCompletion` mantienen el flujo comun de side quest, XP, stats, oro, drops, encuentros y quests.

---

## 4. Invariantes de producto

- No se completan por el aleatorio tareas en cooldown o no disponibles.
- Las tareas archivadas no aparecen como contenido activo.
- El aleatorio no devuelve tareas si no existe ninguna disponible; no degrada silenciosamente a todo el catalogo.
- El overflow solo se marca cuando hay tareas realmente atrasadas.
- La finalizacion manual es una accion explicita del jugador, no una excepcion por id.
- Una repeticion valida no colisiona con la recompensa de otra finalizacion.
- Los resultados pendientes se pueden recuperar tras recargar.
- Los items rechazados o pendientes conservan un registro recuperable.
- No se cambia el comportamiento de inventario, baul, equipo, rituales, lore, aclimatacion o quests fuera del flujo de recompensa de tarea.

---

## 5. Riesgos y deuda tecnica

- Las tareas antiguas con schedules incompletos siguen usando el fallback de intervalo de un dia.
- Los drops legacy basados en strings siguen requiriendo normalizacion en el borde de recompensa.
- La UI de categoria usa estilos inline heredados del shell; una futura mejora visual deberia ser un refactor separado.
- `taskHistory` antiguo puede contener registros sin `completionId`; se mantienen visibles y se usan como historial legacy.
- El codigo conserva comentarios historicos de placeholders en zonas no relacionadas; no se han eliminado porque esta fase no es un refactor.

---

## 6. Verificacion funcional

### Para probar como jugador

1. Abre una categoria desde el hub con click, Enter o Espacio.
2. Comprueba que aparecen todas sus tareas y que cada una muestra su disponibilidad e historial.
3. Completa manualmente una tarea disponible; comprueba que el resultado se muestra y que vuelve al hub al continuar.
4. Recarga durante un resultado pendiente; comprueba que el resultado reaparece sin perder progreso.
5. Abre de nuevo la categoria y verifica que el historial aumenta y que el aleatorio no ofrece tareas no disponibles.

### Validaciones tecnicas ejecutadas

- `node --check engine.js`.
- `node --check ui_tasks.js`.
- `node --check ui_hub.js`.
- Revisión de referencias a resolver duplicado: ninguna.
- Revisión de placeholders de sustitucion: ninguna en los ficheros de la fase.
- Revisión de ids hardcodeados para casos individuales: ninguna.

---

## 7. Alcance de la Fase 3B

Incluido:

- Catalogo completo por categoria.
- Completado manual explicito desde el catalogo.
- Disponibilidad y cooldown coherentes con el historial.
- Pool aleatorio limitado a tareas disponibles.
- Identificadores unicos de recompensa por finalizacion.
- Accesibilidad de apertura de categorias por teclado.
- Actualizacion de este mapa en el mismo cambio.

No incluido:

- Nuevo contenido, nuevas mecanicas, nuevos enemigos o nuevos objetos.
- Cambios de balance.
- Refactor de ficheros largos o extraccion de componentes.
- Cambios en `main` o despliegue de GitHub Pages.

---

## 8. Changelog

## Fase 3B - catalogo por categoria

- `ui_tasks.js`: mantiene el catalogo completo por categoria, la finalizacion manual controlada y los identificadores unicos de recompensa.
- `ui_hub.js`: mantiene la apertura de categorias mediante teclado.
- `engine.js`: calcula correctamente el cooldown de tareas de limite unitario y no devuelve tareas no disponibles al pool aleatorio.
- No se modifican `main`, los saves existentes ni el contenido de tareas.

### 2026-08-21 - Fase 3A: modelo canonico de historial y disponibilidad

- `engine.js`: anade `taskHistory`, `getTaskAvailability`, cooldowns, limites, fechas validas, migracion segura a save v4 y snapshots pre-migracion.
- `ui_tasks.js`: muestra estado de tarea, historial y resultado persistente; separa resolver de drops por tema para evitar colision de nombres.
- `items.js`: normaliza `pendingLoot`, ledger de recompensas y entrega segura ante inventario lleno.
- `PROJECT_MAP.md`: documenta el contrato y el flujo de recuperacion.

### 2026-08-21 - Correccion previa: disponibilidad y UI de tareas

- Se anadio el historial visible de tareas.
- Se corrigio el pool de tareas para respetar cooldowns.
- Se anadio recuperacion de resultados pendientes tras recarga.

### 2026-07-30 - Baseline verificado

- Se verifico `main`, la rama de backup y los artefactos de publicacion.
- Se creo el mapa inicial del proyecto.

---

## 9. Guia rapida para futuros cambios

Antes de tocar codigo:

1. Lee este fichero completo.
2. Abre solo los ficheros que correspondan al cambio; por defecto, no mas de cuatro.
3. Separa arreglo, contenido y refactor en ramas distintas.
4. No borres campos de saves ni contenido no resoluble.
5. Ejecuta las validaciones tecnicas y las pruebas como jugador.
6. Actualiza este mapa en el mismo PR.
7. Verifica que `main` sigue sin cambios y desplegable.
