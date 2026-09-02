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

Actualizar este mapa en el mismo PR cuando cambien estructura, simbolos, modelos, invariantes, fases o procedimientos.

Foto actual de produccion

Campo

Estado real

Repositorio

final2raven-coder/lifexp

Rama de produccion

main

Commit actual de main

5c6215056dde6a0b38d60200740ed648bcbb4c8a

Build efectiva

v13.4-equip-action-fix

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

Cache conocida

lifexp-v23

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

gameState, schema del save, migraciones v0->v4, tareas, disponibilidad, historial, XP, stats, navegacion y resultados pendientes

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

Tareas, completado, drops, side quests, resultados pendientes y recuperacion

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

QUESTS y aliases canonicos de UI

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

Las recompensas aseguradas de una quest son independientes del loot normal. Las quests desconocidas o parcialmente migrables no se borran silenciosamente.

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

Pendiente

Requiere decision sobre cupo de dailies y misiones de progreso

F4

Parcial

Se corrigieron partes de la UI; falta barrido completo de contenido visible

F5

Parcial

Existe contrato transaccional; siguen abiertas referencias invalidas de drops y decision narrativa

F6

Ya estaba hecho

Build visible y actualizacion verificable implementadas

F7

Parcial

Hay resultado pendiente y navegacion segura; falta validar todo el recorrido de recuperacion

F8

Parcial

Motor de frecuencia e historial existe; falta integracion completa de consumidores

F9

Pendiente

Las listas existen; queda mejorar formato e informacion util

F10

Ya estaba hecho

Habilidades, requisitos, dificultad legible y formaciones jugables implementados

F11

Pendiente

Revisar botones de misiones sin accion efectiva

F12

Bloqueada

No empieza hasta cerrar F1-F8; no reutilizar la rama divergida sin revisar

F13

Pendiente

Actions ya no esta bloqueado; el ZIP/catalogo no esta verificado y se revisara mas adelante

F14

Pendiente

QA final solo despues de cerrar las fases anteriores

Deuda tecnica abierta

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

DT-21

Consumidores de tareas no integran completamente la politica nueva

PR separado despues de F1

DT-22

Hay referencias de items inexistentes en drops legacy de tareas

Resolver como contenido/datos; no crear objetos ficticios

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

Pendiente

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

2026-09-02 - Bloque 2: update2_content.js migra a una frontera generica basada en manifiestos declarativos. Se conservan la marca historica, los IDs, la instalacion aditiva, la validacion de recompensas, el backup y el rollback; las funciones installExpansion* quedan como adaptadores de compatibilidad y no se anaden nuevos parches por ID.

2026-09-02 - Save guard: la carga del save se convierte en barrera obligatoria antes de ejecutar instaladores de contenido. saveGame() bloquea escrituras prematuras, verifica la escritura y los instaladores se ejecutan desde main.js solo tras una carga valida.
2026-09-02 - Save guard test: update2_transaction.test.js se adapta al contrato de registro y ejecucion posterior a la barrera de carga. El test comprueba que no hay instalacion ni guardado antes de autorizar el instalador y conserva las pruebas de rollback, reintento e idempotencia.
2026-09-02 - F1: se incorpora en engine.js la autoridad canonica createTaskCompletionId(), llamada por el flujo unico de completado de ui_tasks.js. El identificador es determinista por tarea, fecha y secuencia del mismo dia; no se crean caminos alternativos ni se modifican recompensas o contenido. F1 queda en curso hasta verificar el recorrido completo como jugador.

2026-09-02 - F1: se confirma el fallo de presentacion del resultado por una llamada a getXpForNextLevel() que no existe en main. La correccion usa el resultado de addXp() como unica fuente de subida de nivel. Ademas, se elimina la llamada inexistente a handleEmergencyDataRoute() en main.js, que abortaba el registro de todos los listeners durante el arranque y dejaba Complete sin accion. F1 queda en curso hasta verificar el recorrido completo como jugador.

2026-09-02 - F0: mapa reducido a estado operativo. Se corrige el commit de main, se actualizan las ramas existentes, se retira historial redundante, se registra el GDD independiente, se marca Actions como desbloqueado y se deja la descompresion/catalogacion del ZIP para F13.

2026-08-26 - main: build efectiva v13.4-equip-action-fix; los PRs recientes de lenguaje dinamico, etiquetas, combate y formaciones ya no se consideran ramas activas.

2026-08-21 a 2026-08-25: se integran los contratos de resultados pendientes, recompensas durables, historial/disponibilidad, habilidades y combate. Las deudas no cerradas permanecen en la tabla DT.

