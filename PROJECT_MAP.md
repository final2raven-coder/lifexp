PROJECT_MAP - LifeXP RPG

Mapa operativo vigente para el Game Master y el mantenimiento del proyecto.
Este fichero describe el estado real que debe usarse para trabajar. Los detalles de PRs cerrados, ramas eliminadas y decisiones ya integradas viven en el historial de GitHub y no se duplican aqui.

Proposito y reglas de uso

Leer este mapa antes de abrir codigo.

Abrir solo los ficheros necesarios para la tarea. Maximo recomendado: 4 por tarea.

Verificar primero si cada punto pendiente ya esta resuelto en main.

Diagnosticar antes de escribir codigo: sintoma, causa raiz, alcance, opcion A, opcion B y recomendacion.

Una fase o bloque de trabajo por sesion.

No tocar main directamente. Cada cambio va en una rama propia y en un PR.

Entregar los cambios localmente; no subir ficheros mediante la integracion de GitHub.

En `quests.js`, `acceptQuest(questId, options)` es la unica funcion canonica de aceptacion. `ui_quests.js` usa `acceptQuestFromUi(questId)` como adaptador de presentacion y no redefine `acceptQuest` ni mantiene aliases alternativos para la aceptacion. Las fuentes de mision llaman directamente al flujo canonico para conservar opciones, transaccion y resultado.

Actualizar este mapa en el mismo PR cuando cambien estructura, simbolos, modelos, invariantes, fases o procedimientos.

Foto actual de produccion

Campo

Estado real

Repositorio

final2raven-coder/lifexp

Rama de produccion

main

Commit actual de main

7a753780d1b6dc92e1f0563d441bc40e62c314e4

M0 del sistema de misiones

Contrato aprobado e integrado en `LifeXP_MISSION_SYSTEM_CONTRACT_M0.md`. El modelo nuevo usa `mission actions` como unidad narrativa canónica dentro de `gameState.quests`; objectives legacy y stages DT-24 solo son entradas de migración. No se cambia `saveVersion`. M1 sustituye el motor de ejecución y traduce las instancias existentes al modelo de actions.

Build efectiva

Generada por el artefacto de GitHub Pages desde el commit publicado; la etiqueta visible y el commit se leen de build-info.json/build-info.js. No hay una etiqueta fija en el código fuente.

Publicacion

GitHub Pages, raiz /

URL publica

https://final2raven-coder.github.io/lifexp/

Entrada

index.html

Tipo de app

SPA vanilla JS / PWA, sin bundler

Save

localStorage, clave lifexp_save

Version canonica del save

saveVersion: 4

Version del modelo de tareas

taskModelVersion: 1

Version del modelo de misiones

questModelVersion: 3; actions es el unico modelo canonico de ejecucion. Las instancias antiguas con objectives o stages se traducen una vez al cargar; no existe un segundo camino de progreso.

Cache conocida

Generada por release: lifexp-<buildId>; el Service Worker la obtiene del manifiesto publicado

Proteccion de main

Desactivada en la comprobacion de F0

Estado de Actions

La cola que bloqueo el trabajo de iconos esta resuelta, segun la comprobacion manual de Angel

Estado del pack de iconos

No verificado en main; el procesamiento/descompresion del ZIP queda pendiente para F13

La declaracion de build efectiva esta en data_tasks.js. El commit anterior registrado en versiones antiguas del mapa no debe utilizarse como referencia.

Ramas existentes y decision operativa

Solo estas ramas estaban visibles en la auditoria de F0:

Rama

Estado frente a main

Uso

Decision

main

Base de produccion

Version publicada

Unica base valida para nuevo trabajo

backup/pre-sanitation-2026-07-30

241 commits por detras, sin trabajo por delante

Respaldo historico

Conservar; no borrar sin confirmacion

feat/task-catalog-refresh

3 commits por delante y 44 por detras; divergida

Catalogo tematico antiguo

No fusionar directamente; revisar solo cuando llegue F12

refactor/icon-rendering-contract

29 commits por delante y 1 por detras; divergida

Preparacion de iconos y workflow

No fusionar directamente; revisar solo cuando llegue F13

Las ramas de PRs ya fusionados o eliminados no son ramas activas y no deben aparecer en esta tabla. Su historia se conserva en GitHub.

Arquitectura vigente

LifeXP es una SPA vanilla JS/PWA. index.html contiene el HTML y CSS de las pantallas; los scripts se cargan como globals al final del documento.

3.1 Motor y sistemas

Fichero

Responsabilidad

engine.js

gameState, schema del save, migraciones v0->v4, submodelo persistente de quests DT-24, tareas, disponibilidad, frecuencias configurables por tarea, historial, XP, stats, navegacion y resultados pendientes

material_interactions.js

Frontera canonica de usos de materiales: descubrimiento idempotente mediante `discoverUse(itemId, useId)` y reconciliacion mediante `reconcile()`; no persiste por si misma y depende de la transaccion exterior del motor

combat.js

Encuentros, dificultad, formaciones, objetivos, turnos, habilidades autorizadas y recompensas de combate

inventory_system.js

Resolucion canonica de items, repair, entregas, pendientes, ledger y renderizado canonico de inventario

item_system.js

Attunement, rituales, curses, requisitos, modales y activacion de objetos

main.js

Entrada, listeners, History API, Service Worker y verificacion de build/actualizacion

guild.js

Estado de gremio, receipts y sincronizacion cooperativa

3.2 UI

Fichero

Pantallas o responsabilidades

ui_hub.js

Hub, personaje, inventario, equipo, consumibles y Settings

ui_tasks.js

Tareas, disponibilidad, frecuencias, historial, completado, drops, side quests, resultados pendientes y recuperacion. Incluye la ruta canonica de tareas guardadas: listado, apertura, retirada explicita y conservacion visible de referencias que necesitan revision

ui_combat.js

Combate, lista de objetivos, amenaza y victoria/derrota

ui_misc.js

Mapa, gremio, lore, clase y quests rapidas

ui_quests.js

Lista, detalle, aceptacion y abandono de quests

ui_feedback.js

Feedback de recompensas, drops y subida de nivel

3.3 Datos y soporte

Fichero

Contenido

classes.js

CLASS_TREE, clases y progresion

items.js

ITEMS, RARITY, ITEM_TYPE, DROP_TABLES

enemies.js

ENEMIES y THEME_ENEMIES

quests.js

QUESTS y cupos independientes declarativos de DT-24; `acceptQuest(questId, options)` es la unica funcion canonica de aceptacion.

data_tasks.js

DEFAULT_TASKS, CATEGORIES, STATS, FREQ, LIFE_XP_BUILD

item_flavor.js

Lore declarativo de objetos

expansion_items.js

Expansion declarativa de items

expansion_enemies.js

Expansion declarativa de enemigos

expansion_quests.js

Expansion declarativa de quests

expansion_tasks.js

Expansion declarativa de tareas

update2_content.js

API declarativa de manifiestos para instalacion idempotente, validacion, persistencia y rollback

validate_content.js

Validador de integridad; solo lectura

tests/save_migrations.test.js

Fixtures de migraciones y disponibilidad

tests/update2_transaction.test.js

Fixtures de instalacion, recompensas, rollback e idempotencia

tests/dt24_quest_schema.test.js

Migracion, defaults, normalizacion idempotente y recuperacion del esquema persistente de quests DT-24

tests/dt24_quest_slots.test.js

Cupos independientes de proyectos personales y encargos de guild

tests/mission_action_task_integration.test.js

Integracion del flujo canonico de completado con tareas derivadas, deduplicacion, persistencia transaccional y referencias no resolubles

manifest.json

Metadatos PWA

sw.js

Cache y estado del Service Worker

emergency-save.html

Recuperacion manual del save

game.js no existe. engine.js es el motor canonico.

Orden de carga

El orden de index.html es contractual:

classes.js
items.js
enemies.js
combat.js
quests.js
item_flavor.js
data_tasks.js
engine.js
material_interactions.js
expansion_items.js
expansion_enemies.js
expansion_quests.js
expansion_tasks.js
update2_content.js
inventory_system.js
ui_hub.js
ui_tasks.js
ui_combat.js
ui_misc.js
guild.js
ui_feedback.js
ui_quests.js
item_system.js
main.js

Al anadir un script:

Crear el fichero en una rama propia.

Insertar su <script> en el punto correcto de index.html.

Anadir la misma ruta a urlsToCache en sw.js.

Incrementar CACHE_NAME.

Actualizar este mapa.

Ejecutar node --check y las pruebas de CI.

Save y persistencia

gameState es el unico estado mutable del juego. Se persiste en localStorage bajo lifexp_save.

API de contenido declarativo

LifeXPContent.installManifest(manifest) es la frontera generica para instalar contenido despues de cargar el save. Un manifiesto declara catalogos y recursos requeridos, aserciones, operaciones y funciones de refresco; no contiene el flujo transaccional ni la logica de persistencia.

Operaciones soportadas: invoke para adaptadores de instaladores declarativos existentes, ensureEntries para altas aditivas y patchEntries para cambios declarativos sobre entradas existentes. Las colisiones deben declarar su politica; la politica por defecto bloquea una entrada distinta y preserve conserva explicitamente una entrada historica compatible.

La frontera captura catalogos mutables, gameState y los bytes originales del save; valida la instalacion y las referencias de recompensas; persiste la marca del manifiesto de forma idempotente; y restaura memoria y save ante cualquier fallo. La marca historica __lifexpUpdate2 se conserva para no repetir Update 2 ni duplicar contenido.

Update 2 usa esta API mediante un manifiesto compatible. Sus funciones installExpansion* permanecen como adaptadores existentes y no se amplian con nuevos parches por ID.

Si el marcador persistente de Update 2 ya existe, la frontera verifica tambien que los catalogos runtime sigan completos. Un marcador valido no evita la rehidratacion cuando falta contenido en memoria. Tras la instalacion o rehidratacion, main.js reintenta pendingLoot mediante LifeXPInventory.retryPendingLoot(), conservando claimId y evitando duplicados mediante rewardLedger.

DT-23 - Rehidratacion de contenido: corregida la diferencia entre contenido marcado como instalado y contenido realmente disponible en runtime. Las recompensas pendientes se recuperan de forma determinista despues de cargar el catalogo; las no resolubles permanecen visibles y recuperables.

Campos criticos:

name, level, xp, gold, streak, lastActiveDate
stats: fue, vit, des, int, vol, pre
tasks, savedTasks, taskHistory
inventory, equipment, stash, stashCapacity, inventoryCapacityBonus
pendingLoot: { version: 1, entries: [] }
rewardLedger
classId, classLevel
activeQuests, completedQuests
guildId, guildName, guildMembers, pendingReceipts, receivedReceipts
itemSystem
loreUnlocked, acclimation
taskModelVersion, saveVersion

5.1 Migraciones

< 1 -> 1: inicializa inventario.

1 -> 2: inicializa itemSystem.

2 -> 3: inicializa estado de gremio.

3 -> 4: normaliza tareas, historial, frecuencia, disponibilidad, limites, repeticion, archivado y tareas legacy.

Reglas de migracion:

Secuencial, determinista, idempotente y no destructiva.

El save original se respalda antes de migrar.

Los campos desconocidos se conservan.

Ante un fallo se restaura el save y el estado en memoria.

No se reinicia localStorage, inventario, equipo, stash, quests, lore, acclimation ni rituales.

Contratos de dominio

6.1 Tareas

Una tarea usa, como minimo:

id, cat, name, freq, desc, stats, xp
optional: drops, sideQuest, availability, archived, reviewStatus

Las frecuencias conocidas viven en FREQ. La disponibilidad se calcula desde la politica declarativa y taskHistory, no desde un unico lastDone.

Una tarea archivada se conserva en el save pero no se ofrece para completar. Una definicion invalida queda marcada como needs_review.

6.2 Flujo canonico de completado

Seleccionar una tarea desde una categoria debe llevar al mismo flujo que una tarea aleatoria. No puede existir un boton secundario con logica propia.

El flujo canonico debe:

conceder XP;

aplicar stats cuando corresponda;

resolver y entregar recompensas mediante la frontera canonica;

preguntar por la side quest cuando corresponda;

registrar historial y completionId;

aplicar la disponibilidad/frecuencia;

persistir antes de mostrar el resultado;

dejar resultado recuperable si falla la navegacion o el guardado.

6.3 Recompensas

Todas las recompensas pasan por LifeXPInventory.deliverReward() o por el contrato equivalente de combate.

Cada entrega tiene un claimId estable.

Los estados posibles son granted, pending o rejected.

Las entregas son idempotentes.

Una referencia invalida bloquea el commit antes de guardar.

Una referencia no resoluble no desaparece: queda visible y recuperable.

pendingLoot conserva resultados pendientes.

rewardLedger evita duplicados.

6.4 Quests

Las recompensas aseguradas de una quest son independientes del loot normal. Las quests desconocidas o parcialmente migrables no se borran silenciosamente. El motor canonico usa `gameState.quests[questId].actions`, `routeNodes`, `consumedEventIds`, `discoveredRevealIds`, `consequenceClaims` y `recovery`. `objectives` y `stages` solo se leen en la frontera de traduccion y no se ejecutan. Las consecuencias M5 son declarativas y se resuelven desde `updateMissionProgress()` mediante un unico resolver transaccional para acciones, nodos de ruta y quest; los tipos soportados son `grant_reward`, `unlock_item_use`, `make_follow_up_available`, `create_derived_task` y `set_world_state`. Los claims usan estados `granted`, `pending` o `rejected`, conservan el resultado y pueden reintentarse sin duplicar entregas.

6.4.1 Politica de misiones activas

Las misiones diarias no forman parte del catalogo jugable de LifeXP. Las definiciones antiguas se conservan como `archived` / `catalogStatus: 'retired'` para que una referencia persistida siga siendo resoluble y recuperable, pero no pueden aceptarse de nuevo.

Las misiones que el jugador decide iniciar pertenecen al grupo `personal_project` y tienen un limite de 3 activas.

Las misiones de guild pertenecen al grupo `guild_order` y tienen un limite independiente de 1 activa.

La aceptacion usa siempre los cupos declarativos de `gameState.quests.slotLimits`; no existe un limite global compartido ni una excepcion por ID. Una mision de guild puede abrir contenido posterior, como investigaciones y nuevas lineas de mision, pero esas relaciones se definiran como contenido en sus fases correspondientes.

Las misiones son contenido fantastico visible en ingles y deben estar relacionadas con el estado descubierto del juego: objetos, enemigos, eventos, arco narrativo, mejoras del hogar o preparacion. Sus requisitos, tareas derivadas y recompensas se planifican en F4, F5, F11 y F12; no se mezclan con la politica de cupos.

6.4.1 Usos de materiales

`gameState.materialInteractions` es el estado persistente canonico para usos descubiertos. `LifeXPMaterialInteractions.discoverUse(itemId, useId)` resuelve aliases mediante `getMissionItemId()` cuando existe, exige un item resoluble de tipo `material`, registra un claim estable y es idempotente. `LifeXPMaterialInteractions.reconcile()` rehidrata la correspondencia entre `ledger` y `discoveredUses` sin borrar referencias desconocidas ni guardar por su cuenta. La persistencia y el rollback pertenecen a la transaccion exterior de `updateMissionProgress()`; el modulo se carga antes de `main.js` y se incluye en la cache del Service Worker.

6.5 Combate y habilidades

gameState.skills es la fuente de verdad para habilidades del jugador.

El resolver comun determina conocimiento, equipamiento, fuente, requisitos y recursos.

getAvailableActions() y executePlayerAction() usan el mismo resolver.

formation.members es la coleccion canonica de combatientes.

Los objetivos se identifican por instanceId; solo se pueden seleccionar miembros vivos.

La victoria requiere derrotar a todos los miembros vivos de la formacion.

Invariantes de producto

Todo contenido visible del juego esta en ingles. La conversacion con Angel puede ser en espanol.

La interfaz no revela objetos, enemigos, quests, lore o nombres no descubiertos.

El descubrimiento se registra en la logica de dominio, nunca por renderizar elementos.

Una recompensa anunciada llega al inventario, persiste y puede recuperarse.

No hay ramas especiales por ID. Las diferencias viven en datos declarativos.

Un objeto nuevo debe tener utilidad jugable reconocible.

Los IDs de contenido son unicos, estables y snake_case ASCII.

Las expansiones son aditivas e idempotentes y no deben sobreescribir silenciosamente entradas existentes.

update2_content.js expone la frontera declarativa de instalacion y hace rollback ante fallos.

taskHistory es append-only.

main debe seguir siendo desplegable.

index.html y sw.js deben tener los mismos scripts cacheables.

Los cambios de cache incrementan CACHE_NAME.

La actualizacion distingue recarga de interfaz, cache activada y build ejecutada.

No se pierde progreso ni se reinicia el save para resolver un bug.

Estado de fases F0-F14

Estados: completada, ya estaba hecho, parcial, pendiente, bloqueada.

Fase

Estado actual

Nota operativa

F0

Completada

Mapa compacto fusionado en main; Actions confirmado manualmente como desbloqueado; la revision del ZIP queda para F13

F1

Completada

El flujo canonico de completado existe en ui_tasks.js y llama a createTaskCompletionId(), cuya autoridad vive en engine.js. El arreglo no crea un camino alternativo ni modifica drops, quests o balance. PR #61 fusionado; verificacion funcional realizada por Angel

F2

Completada

La previsualizacion de drops posibles se retiro de la pantalla canonica y se conserva la revelacion posterior al completado. Verificacion como jugador realizada por Angel

F3

Completada

Cupos fijados: `personal_project: 3` y `guild_order: 1`; las misiones diarias se retiran del catalogo activo y sus definiciones legacy quedan archivadas y recuperables

F4

Implementada localmente; pendiente de colocacion y verificacion manual

Se corrigen las superficies visibles en espanol y se anade una migracion determinista de textos de tareas oficiales persistidas. Se conservan IDs, historial, balance, drops y tareas personalizadas. La entrega queda preparada para la rama `fix/f4-english-content-v1`.

F5

Parcial

Existe contrato transaccional; `deliverReward()` incorpora rollback de memoria y save ante fallos de persistencia; siguen pendientes las pruebas runtime, la validacion completa de referencias invalidas de drops y la decision narrativa

F6

Hecha

La actualización verificable y el pipeline de release quedan coordinados mediante el manifiesto de build, el commit publicado, el artefacto de Pages y la caché; verificación funcional pendiente solo si el despliegue requiere una comprobación adicional

F7

Completada

La recuperación de tareas guardadas y de resultados pendientes usa un único punto de entrada; el resultado vuelve a la pantalla canónica, el modal registra una única entrada de History API y atrás/Escape conservan el resultado sin duplicar recompensas. Pendiente de verificación manual en la build desplegada

F8

Completada

Disponibilidad, proxima fecha, limites por tarea, historial completo y bloqueo al agotar repeticiones integrados en motor y UI; saveVersion se conserva en 4

F9

Completada

PR fusionado en main; no se reabre durante F4.

F10

Ya estaba hecho

Habilidades, requisitos, dificultad legible y formaciones jugables implementados

F11

Implementada; pendiente de verificacion manual

PR #80 ya esta integrado. El flujo canonico persiste objetivos por capitulo, conserva completionId contra duplicados, recupera estados legacy y corrige la visibilidad del boton de accion. No se verifica ni se reabre durante F4.

F12

Bloqueada

No empieza hasta cerrar F1-F8; no reutilizar la rama divergida sin revisar

F13

Pendiente

Actions ya no esta bloqueado; el ZIP/catalogo no esta verificado y se revisara mas adelante

F14

Pendiente

QA final solo despues de cerrar las fases anteriores

M0 — Mission System

Completada

Contrato integrado mediante PR #83. Define actions como unidad narrativa y deja objectives/stages como formatos de entrada de migración. No cambia `saveVersion`.

M1 — Persistent action engine

Completada en el codigo de main; pendiente de verificacion manual

`engine.js` introduce `questModelVersion: 3`, traduce instancias legacy y DT-24 a `actions` y `routeNodes`, conserva progreso y claims, registra eventos consumidos y marca instancias no resolubles con recuperacion. `quests.js` delega el avance a `updateMissionProgress`; no mantiene un segundo motor de objectives/stages. La prueba de migraciones cubre traduccion, idempotencia, rollback, recuperacion y progreso sin duplicados. La conversion declarativa completa del catalogo estatico queda para el siguiente bloque, sin cambiar el motor.

M2 — Canonical task integration

Completada en el codigo de main; pendiente de verificacion manual

`engine.js` materializa tareas derivadas aceptadas desde `gameState.quests.derivedTasks`, conserva su origen, aplica el ciclo de vida y marca la finalizacion por `completionId`. `ui_tasks.js` mantiene `finalizeCompletion()` como unico flujo y emite eventos normalizados con `source`, `derivedTaskId` y `themes`. El guardado de progreso de misiones se difiere dentro de la transaccion de completado y se confirma junto con XP, historial, recompensa y resultado. La prueba de integracion cubre materializacion, evento derivado, duplicados, persistencia y referencias no resolubles.

M3 — Mission action UI

Completada en el codigo de main; pendiente de verificacion manual

`ui_quests.js` presenta la situacion actual, las acciones del nodo activo, su estado y progreso, las tareas compatibles y los estados vacios o de investigacion. Abrir una tarea desde una mision delega en `completeTaskFromCategory()` y por tanto conserva el flujo canonico. Se retira la previsualizacion de recompensas en las superficies de misiones. No se muestran nodos futuros, IDs tecnicos ni recompensas no descubiertas.

M4 — Narrative reveals and journal

Implementada localmente; pendiente de colocacion y verificacion manual

`engine.js` anade revelaciones declarativas por accion y nodo, registro persistente de diario dentro de `gameState.quests`, claims idempotentes, snapshots de texto para recuperacion y rollback si falla el guardado. `ui_quests.js` muestra solo entradas descubiertas, las mantiene accesibles aunque la mision activa desaparezca y anuncia una revelacion unicamente despues de su descubrimiento legitimo. `quests.js` valida el contrato de titulo, cuerpo e ID estable. No se anade contenido narrativo nuevo en esta fase.

M5 - Consequences, object uses and follow-ups

Implementada localmente; contrato tecnico de usos de materiales entregado para colocacion; pendiente de verificacion manual

`engine.js` anade `worldState`, normaliza `consequenceClaims` con estados `granted`, `pending` y `rejected`, valida referencias antes de guardar y resuelve de forma declarativa las consecuencias de acciones, nodos de ruta y quest. `grant_reward` delega en las fronteras canonicas de recompensas e inventario; `unlock_item_use` exige que el material este legitimamente descubierto; `make_follow_up_available` deja el follow-up visible sin aceptarlo automaticamente; `create_derived_task` materializa tareas con IDs estables e idempotentes; `set_world_state` persiste cambios declarativos. `retryMissionConsequences()` reintenta claims recuperables. El flujo se integra en `updateMissionProgress()` y conserva rollback de memoria, notices y bytes exactos del save si falla la transaccion. `quests.js` valida el contrato y elimina un follow-up solo cuando el jugador lo acepta. `ui_quests.js` presenta avisos y detalles sin revelar contenido no descubierto. No se anaden misiones, narrativa ni contenido nuevo y no se cambia `saveVersion: 4` ni `questModelVersion: 3`.

M6 - Recovery and mission sources

Implementada localmente; pendiente de colocacion y verificacion manual

`engine.js` anade el submodelo persistente `gameState.quests.missionSources` con estados y claims normalizados. Las fuentes declarativas soportan recuperacion, eventos pasivos y encargos de guild sin crear un segundo almacen de misiones. `getMissionSourceAvailability()` valida requisitos de nivel, guild, quests completadas, descubrimientos y `worldState`; las fuentes de guild exigen pertenencia y el grupo declarativo `guild_order`. `acceptMissionSource()` reutiliza `acceptQuest()` y aplica coste, cupo, recompensa, claim y rollback dentro de una unica transaccion idempotente. `startMissionRecovery()` materializa una direccion descubierta sobre la mision activa y puede reactivar una accion declarativa sin revelar el grafo futuro. `ui_quests.js` muestra fuentes disponibles y opciones de investigacion con confirmacion explicita para guild. No se anade contenido narrativo nuevo; `MISSION_SOURCES` queda como catalogo declarativo para el siguiente bloque de contenido. No se cambia `saveVersion: 4` ni `questModelVersion: 3`.

F6 - Contrato de publicación

GitHub Pages debe publicar el artefacto generado por `.github/workflows/deploy-pages.yml`, no la raíz de `main`. `tools/build_release.js` genera `build-info.json` y `build-info.js` usando el commit de GitHub Actions. `data_tasks.js`, `main.js`, `ui_hub.js` y `sw.js` consumen ese manifiesto; el save no participa en el versionado.

Deuda tecnica abierta

ID

Deuda

Siguiente accion

DT-25

El aviso del Hub para tareas guardadas se renderiza, pero su accion dinamica no responde de forma fiable en la build publicada

Usar delegacion estable en el contenedor del Hub; verificar como jugador y cerrar solo tras abrir la lista y una tarea guardada


ID

Deuda

Siguiente accion

DT-04

ui_misc.js agrupa varias pantallas

Proponer refactor separado; no mezclar con bugs

DT-05

item_flavor.js concentra mucho contenido narrativo

Medir carga antes de plantear cambios

DT-07

Falta guard generico de colisiones en expansiones

Disenar comprobacion declarativa antes de modificar instaladores

DT-10

Algunos items legacy requieren normalizacion edge

Ampliar fixtures sin perder datos

DT-12

Renderizado de inventario duplicado en dos zonas

Documentar contrato y proponer refactor separado

DT-19

Persisten referencias legacy no ASCII en enemigos

Cambio de datos separado con migracion y trazabilidad

DT-22

Hay referencias de items inexistentes en drops legacy de tareas

Resolver como contenido/datos; no crear objetos ficticios

DT-23

El marcador de Update 2 podia ocultar catalogos runtime incompletos y dejar recompensas recuperables sin entregar

Rehidratar catalogos y reintentar pendingLoot de forma idempotente; cerrado en este bloque local, pendiente de PR manual

F13

El workflow y la descompresion/catalogacion del ZIP no estan verificados

Revisar ruta, script, Node, artefacto y validacion cuando toque F13

No se considera deuda abierta la cola de GitHub Actions: Angel ha confirmado que ese bloqueo esta resuelto.

Decisiones pendientes

Decision

Fase

Estado

Cupo de misiones activas frente a dailies

F3

Resuelta: no hay dailies jugables; `personal_project` admite 3 misiones activas y `guild_order` admite 1 con limite separado

fragmento_historia como material o categoria narrativa propia

F5

Pendiente

Alcance de iconos: minimo, medio o completo

F13

Pendiente

El GDD existe como documento independiente

F0

Resuelta: LifeXP_RPG_GDD_v2.md existe

Validacion obligatoria

Antes de un PR que toque JavaScript de produccion:

node --check classes.js
node --check items.js
node --check enemies.js
node --check combat.js
node --check quests.js
node --check item_flavor.js
node --check data_tasks.js
node --check engine.js
node --check expansion_items.js
node --check expansion_enemies.js
node --check expansion_quests.js
node --check expansion_tasks.js
node --check update2_content.js
node --check inventory_system.js
node --check ui_hub.js
node --check ui_tasks.js
node --check ui_combat.js
node --check ui_misc.js
node --check guild.js
node --check ui_feedback.js
node --check ui_quests.js
node --check item_system.js
node --check main.js
node tests/save_migrations.test.js
node tests/update2_transaction.test.js

Antes de un PR de contenido o de scripts, ejecutar tambien:

node validate_content.js

El validador debe tener salida limpia antes de fusionar. Los errores baseline conocidos de referencias legacy no se maquillan ni se ignoran: se resuelven en su fase correspondiente.

Verificacion como jugador

Toda entrega debe explicar tres pruebas sin leer codigo. Como minimo:

Abrir la app y confirmar que la build visible y la pantalla principal cargan.

Ejecutar la accion afectada y confirmar el resultado visible, la persistencia y la recuperacion.

Recargar, volver atras o repetir la accion segun el cambio, confirmando que no se pierde progreso ni se duplica la recompensa.

Historial y alcance del mapa

El historial detallado de PRs, commits, ramas eliminadas, cambios de saneamiento y resultados antiguos de validadores se conserva en GitHub. Este mapa solo conserva:

decisiones permanentes;

contratos de dominio;

invariantes;

deuda abierta;

estado de fases;

procedimientos reproducibles;

cambios recientes que afectan al trabajo futuro.

Changelog operativo

2026-09-18 - Mission source acceptance collision fixed locally: `quests.js` conserva la unica funcion canonica `acceptQuest(questId, options)`; `ui_quests.js` renombra el adaptador visual a `acceptQuestFromUi(questId)` y actualiza sus dos superficies de aceptacion. Se elimina `window.acceptQuestCanonical`, que ocultaba la colision global y descartaba `deferSave`/el resultado canonico. No cambia `saveVersion`, `questModelVersion` ni el formato del save. Pendiente de colocacion y verificacion manual.

 se entrega localmente `material_interactions.js` como frontera canonica e idempotente para descubrir usos de materiales. Se integra en el orden de carga, la cache y el mapa. El modulo no persiste por su cuenta; `updateMissionProgress()` conserva la transaccion, los claims y el rollback. Pendiente de colocacion y verificacion manual.

2026-09-17 - M5 Mission consequences, object uses and follow-ups: implementacion local de consecuencias declarativas e idempotentes para recompensas, usos de materiales, follow-ups, tareas derivadas y `worldState`. `updateMissionProgress()` es el flujo canonico para acciones, nodos y quest; `consequenceClaims` conserva `granted`, `pending` y `rejected`, y `retryMissionConsequences()` permite recuperar resultados pendientes o rechazados. Se verifica rollback de memoria y bytes del save, validacion previa de referencias, entrega de objetos, aceptacion explicita de follow-ups y no duplicacion. Sin contenido nuevo, sin cambio de `saveVersion` y pendiente de colocar y verificar manualmente.


2026-09-17 - M6 Mission sources and recovery: implementacion local de fuentes declarativas de recuperacion, pasivas y guild. Se anade persistencia normalizada de estados y claims, requisitos de disponibilidad, aceptacion transaccional con costes y recompensas, confirmacion explicita para guild, uso del cupo `guild_order`, rollback de memoria y save, y opciones de investigacion accionables sin revelar contenido futuro. `MISSION_SOURCES` queda vacio hasta una fase de contenido; no se anaden misiones ni narrativa en este bloque. Pendiente de colocar y verificar manualmente.

2026-09-17 - M4 Mission reveals and journal: `engine.js` registra revelaciones declarativas al completar acciones o nodos, conserva snapshots en el diario persistente, evita duplicados mediante IDs estables y restaura el estado si falla el guardado. `ui_quests.js` muestra solo descubrimientos legitimos en el detalle de mision, en el listado del diario y mediante aviso posterior al descubrimiento. `quests.js` valida el contrato de revelaciones. Pendiente de colocar y verificar manualmente.

2026-09-17 - M3 Mission action UI: `ui_quests.js` deja de presentar objetivos tecnicos como pantalla pasiva y muestra la situacion actual, acciones del nodo activo, progreso, tareas compatibles, estados de disponibilidad y recuperacion. La apertura de tareas usa el flujo canonico de `ui_tasks.js`; no se crea un boton de completado alternativo. Se eliminan las previsualizaciones de recompensas en las pantallas de misiones. Pendiente de colocar y verificar manualmente.

2026-09-17 - M2: integracion local de tareas normales y derivadas con el flujo canonico. Las tareas derivadas aceptadas se materializan sin sustituir tareas existentes; `finalizeCompletion()` emite eventos con origen y `derivedTaskId`; la persistencia del progreso de misiones queda dentro de la transaccion del completado y los eventos repetidos no duplican progreso. Pendiente de colocar y verificar manualmente.

2026-09-17 - M1: sustitucion local del motor de progreso de misiones. `engine.js` fija `questModelVersion: 3`; las instancias con `objectives`, `chapters` o `stages` se traducen deterministamente a `actions` y `routeNodes`, se conserva el origen de migracion y se eliminan los campos legacy de la instancia ejecutable. `quests.js` delega el avance en el resolver de actions; los eventos se consumen por ID estable e idempotente. Se anaden pruebas para DT-24, recuperacion, recarga y duplicados. La conversion completa del catalogo estatico queda separada para el siguiente bloque.

2026-09-17 - M0 Mission System: se cierra el contrato de acciones narrativas. `LifeXP_MISSION_SYSTEM_CONTRACT_M0.md` define la separación entre catálogo y save, mission instances, route nodes, mission actions, eventos canónicos, tareas derivadas, revelaciones, consecuencias, follow-ups, fuentes pasivas/gremiales y recuperación. Se conserva la compatibilidad con objectives legacy y stages DT-24; no se cambia código runtime ni `saveVersion`. Siguiente fase: M1, fundamento persistente de acciones.

2026-09-16 - F4: se prepara localmente `fix/f4-english-content-v1`. El motor reconciliara por ID los nombres y descripciones de las tareas oficiales persistidas, incluidos los textos de side quests, usando los catalogos actuales como fuente declarativa. Las tareas personalizadas y los datos de progreso quedan intactos. Tambien se corrigen las superficies de UI que aun mostraban espanol. Pendiente de colocar y verificar como jugador.

2026-09-16 - Reconciliacion operativa: main auditada en `3688714428baa7767a083015d16e62f39f40deab`; F9 queda marcada como completada tras su PR fusionado; F11 queda implementada en PR #80 y pendiente de verificacion manual; F12 continua bloqueada.

2026-09-06 - DT-25: se prepara un arreglo local para el aviso de tareas guardadas. La accion se delega una sola vez desde el contenedor estable del Hub, de modo que las reconstrucciones de alertas no dependan de listeners directos sobre botones dinamicos. Pendiente de colocar y verificar como jugador.

2026-09-06 - F6: se prepara el pipeline de publicación reproducible. GitHub Pages generará desde el commit un manifiesto de build, una etiqueta visible y una caché coordinada; el Service Worker deja de depender de un número manual. Pendiente de colocar los ficheros en la rama y cambiar la fuente de Pages a GitHub Actions.

2026-09-06 - F5: `inventory_system.js` refuerza `LifeXPInventory.deliverReward()` con una transaccion de persistencia: captura inventario, pendingLoot, rewardLedger y los bytes originales del save; si `saveGame()` falla, devuelve `false` o lanza una excepcion, restaura memoria y save sin confirmar la entrega. Se mantienen claimId, idempotencia y recuperacion visible de referencias no resolubles. `node --check inventory_system.js` pasa. Quedan pendientes las pruebas runtime, la validacion completa de referencias de drops y la decision narrativa; no se cambia `saveVersion`.

2026-09-06 - F7: se implementa la recuperacion de tareas guardadas sin cambiar saveVersion ni el modelo persistente. El aviso del Hub abre una lista; las tareas validas entran en la pantalla canonica; las referencias invalidas quedan visibles como needs review y solo se eliminan mediante accion explicita. El guardado y la retirada son persistentes e idempotentes, con rollback en memoria si saveGame() falla. Se corrige tambien el cierre del modal guardado mediante data-close-modal.

2026-09-06 - F11: se corrige localmente el progreso canonico de misiones. Al aceptar una mision por capitulos se persisten sus objetivos iniciales; los estados legacy con objetivos vacios se materializan de forma determinista; cada objetivo consume completionId para ignorar eventos duplicados; completar un capitulo persiste el siguiente y entrega su recompensa idempotente. ui_tasks.js propaga taskId, categoria, fecha y completionId desde finalizeCompletion(). ui_quests.js restaura la visibilidad del boton de accion al abrir el detalle. Falta verificacion manual como jugador antes de cerrar la fase y entregar el PR.

2026-09-06 - F8: se integran frecuencias e historial. Cada tarea periodica permite configurar su limite de repeticiones desde la pantalla de historial; el cambio se aplica inmediatamente sin modificar entradas antiguas. La UI muestra estado, repeticiones usadas, proxima fecha e historial completo; se elimina el bypass de cooldown y no se cambia saveVersion.

2026-09-06 - F7: se completa la navegacion segura de resultados pendientes. `showPendingTaskResult()` es el punto unico de recuperacion desde menu, atras, recarga y pantalla de tarea; vuelve a la tarea canonica antes de presentar el resultado. `renderTaskResultModal()` registra una unica entrada `task-result` en History API y el cierre mediante atras o Escape no confirma ni pierde la recompensa. No cambia `saveVersion`, `pendingTaskResult`, `claimId` ni `rewardLedger`.

2026-09-04 - F3: se fija la politica de misiones activas. Las dailies dejan de formar parte del catalogo jugable; sus definiciones se conservan archivadas para resolver referencias legacy. Las misiones personales tienen 3 plazas activas y las de guild 1 plaza independiente. La aceptacion y el reset diario respetan esta politica declarativa.

2026-09-04 - DT-24 Goal 4: se implementa la progresion canonica de quests por etapas sobre el estado persistente; los completionIds se consumen una sola vez por objetivo, las etapas avanzan de forma determinista y el estado terminal queda normalizado. Los emisores canonicos de tareas, combate, nivel y equipamiento envian eventos con completionId determinista. Se anaden pruebas aisladas de progreso, duplicados, emisores y terminalizacion. El hash de main queda pendiente de correccion separada.

2026-09-03 - DT-24 terminal contract: una quest secuencial completada se normaliza con status completed, currentStage null, todas sus etapas completed, ID ausente de active y presente en completed. La reconciliacion es determinista e idempotente; Goal 4 sigue sin implementarse.

2026-09-03 - DT-24 Goal 3: la aceptacion de quests usa cupos declarativos por grupo mediante getQuestSlotGroup(), getQuestSlotLimit() y getQuestAcceptanceStatus(). personal_project permite 3 quests activas y guild_order permite 1 de forma independiente; se elimina el limite global de 3. Se anade tests/dt24_quest_slots.test.js. Goal 3 completado; etapas, progreso compartido, tareas derivadas, follow-ups y UI quedan para goals separados.

2026-09-03 - DT-24 Goal 2: se anade el submodelo persistente de quests con questModelVersion 2, cupos declarativos personal_project/guild_order, etapas, completionIds por objetivo, follow-ups y tareas derivadas. La normalizacion es aditiva, idempotente y no cambia saveVersion: 4; los registros derivados invalidos quedan conservados como needs_review. Se anade la prueba permanente tests/dt24_quest_schema.test.js. Goal 2 completado; la aceptacion, el progreso, las recompensas y la UI quedan para goals separados.

2026-09-03 - DT-23: la instalacion declarativa ya no confunde el marcador persistente con el estado runtime; valida los catalogos antes de omitir trabajo, corrige el paso de la politica onConflict a ensureEntries, permite rehidratar el instalador de items y reintenta pendingLoot tras cargar contenido. Se conserva claimId, se evita duplicacion y el save original no se modifica.

2026-09-02 - Bloque 2: update2_content.js migra a una frontera generica basada en manifiestos declarativos. Se conservan la marca historica, los IDs, la instalacion aditiva, la validacion de recompensas, el backup y el rollback; las funciones installExpansion* quedan como adaptadores de compatibilidad y no se anaden nuevos parches por ID.

2026-09-02 - Save guard: la carga del save se convierte en barrera obligatoria antes de ejecutar instaladores de contenido. saveGame() bloquea escrituras prematuras, verifica la escritura y los instaladores se ejecutan desde main.js solo tras una carga valida.
2026-09-02 - Save guard test: update2_transaction.test.js se adapta al contrato de registro y ejecucion posterior a la barrera de carga. El test comprueba que no hay instalacion ni guardado antes de autorizar el instalador y conserva las pruebas de rollback, reintento e idempotencia.
2026-09-02 - F1: se incorpora en engine.js la autoridad canonica createTaskCompletionId(), llamada por el flujo unico de completado de ui_tasks.js. El identificador es determinista por tarea, fecha y secuencia del mismo dia; no se crean caminos alternativos ni se modifican recompensas o contenido. F1 queda en curso hasta verificar el recorrido completo como jugador.

2026-09-02 - F1: se confirma el fallo de presentacion del resultado por una llamada a getXpForNextLevel() que no existe en main. La correccion usa el resultado de addXp() como unica fuente de subida de nivel. Ademas, se elimina la llamada inexistente a handleEmergencyDataRoute() en main.js, que abortaba el registro de todos los listeners durante el arranque y dejaba Complete sin accion. F1 queda en curso hasta verificar el recorrido completo como jugador.

2026-09-02 - F0: mapa reducido a estado operativo. Se corrige el commit de main, se actualizan las ramas existentes, se retira historial redundante, se registra el GDD independiente, se marca Actions como desbloqueado y se deja la descompresion/catalogacion del ZIP para F13.

2026-08-26 - main: build efectiva v13.4-equip-action-fix; los PRs recientes de lenguaje dinamico, etiquetas, combate y formaciones ya no se consideran ramas activas.

2026-08-21 a 2026-08-25: se integran los contratos de resultados pendientes, recompensas durables, historial/disponibilidad, habilidades y combate. Las deudas no cerradas permanecen en la tabla DT.

## M7 technical prerequisite — mission source and recovery boundaries

2026-09-18 - M7 content vertical slice prepared locally: declarative mission network with passive sources, existing and derived tasks, reveals, journal, material reward/use, follow-up, recovery and world-state-gated source. Pending manual placement and player verification.

2026-09-18 - M7 source registry guard verified: identical mission-source definitions are compared structurally and re-registration remains idempotent; conflicting definitions with an existing ID now fail loudly before replacement. No M7 content added.


M7 — Complete vertical slice

Implementada localmente; pendiente de colocacion y verificacion manual. La slice declarativa anade una red pequena y completa con una fuente pasiva inicial, tres nodos de ruta, una tarea existente de Admin, una tarea derivada temporal, revelaciones persistentes, diario, entrega idempotente de un material existente, desbloqueo de uso de material, follow-up, recuperacion y una segunda fuente pasiva condicionada por `worldState`. El contenido visible esta en ingles y no anade enemigos ni combate. `expansion_quests.js` registra `MISSION_SOURCES_V1` mediante la frontera canonica; no cambia `saveVersion` ni `questModelVersion`.

2026-09-18 - M7 narrative rewrite prepared locally: se reescribe todo el texto visible de M7 para usar un registro humano y dependiente de la situacion: instrucciones accionables, alcance claro y tono directo cuando corresponde; la narrativa conserva escenas y continuidad sin convertir cada elemento en misterio grandilocuente. Se mantienen intactos IDs, objetivos, requisitos, recompensas, consecuencias, fuentes y estados del mundo. No se modifica el motor ni el save. Las tareas derivadas ya materializadas en saves existentes conservan su texto copiado; su actualizacion queda fuera de este bloque y requeriria una migracion determinista aprobada.

- The canonical mission source registry is populated through `registerMissionSources()` in `quests.js`; content installers must not replace the registry or create a second source store.
- Recovery sources remain hidden from the global mission-lead list and become available only through an active mission's investigation surface.
- `getMissionSourceAvailability()` permits a recovery source to target its own active mission while continuing to block ordinary sources for already-active missions.
- Quests with `sourceOnly: true` are excluded from the general available-quest catalogue and must be reached through a declared source or follow-up path.
- This is a technical prerequisite for M7 content; no M7 narrative or new content is included in this block.
