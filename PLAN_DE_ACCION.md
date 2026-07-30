# PLAN DE ACCION -- Saneamiento LifeXP
> Generado: 2026-07-30 | Estado: **EN CURSO**
> Regla: ningun PR de limpieza cambia comportamiento del juego. Refactors puros.
> Nada de contenido nuevo hasta que la limpieza este cerrada.

---

## Estado global

| Fase | Nombre | Estado | PR |
|---|---|---|---|
| 0 | Red de seguridad | Completada | -- |
| A | Borrar ramas muertas | En curso | -- |
| B | Unificar aliases (una sola fuente de verdad) | Pendiente | -- |
| C | Eliminar fallback hardcodeado | Pendiente | -- |
| D | Fusionar ashbrand_hotfix en inventory_system | Pendiente | -- |
| E | Unificar funciones duplicadas de quests | Pendiente | -- |
| F | Mover ITEM_FLAVOR_TEXT fuera de game.js | Pendiente | -- |
| G | Split de game.js | Pendiente | -- |

---

## Fase 0 -- Red de seguridad (Completada)

Completada: 2026-07-30

Rama de respaldo creada: backup/pre-sanitation-2026-07-30
Apunta al commit 218cb09e118920b5323598e194c1bd8f07be2ae1 (produccion a las 11:52 UTC del 30/07/2026).

Como volver: decirlo al Game Master. El se encarga.

---

## Fase A -- Borrar ramas muertas (En curso)

Objetivo: eliminar las ramas que ya estan fusionadas en main o son experimentales descartadas.
Ficheros que toca: ninguno (solo ramas de Git).
Riesgo: ninguno.
Como verificarlo: la app sigue funcionando exactamente igual tras la limpieza.

### Ramas a eliminar

| Rama | Motivo |
|---|---|
| fix/inventory-canonical-contract | Fusionada en main (0 commits por delante) |
| fix/item-ux-ashbrand | Fusionada en main (0 commits por delante) |
| fix/main-startup-inventory | Fusionada en main (mismo SHA que otra rama) |
| fix/recover-before-items-truncation | Fusionada en main (mismo SHA que otra rama) |
| fix/startup-from-clean-base | Fusionada en main (mismo SHA que fix/item-ux-ashbrand) |
| fix/startup-from-functional-base | Fusionada en main (mismo SHA que fix/item-ux-ashbrand) |
| restore-gamejs-from-functional-commit | Fusionada en main (0 commits por delante) |
| restore-only-gamejs | Fusionada en main (0 commits por delante) |
| final2raven-coder-update1 | Fusionada en main (mismo SHA que otra rama) |
| diagnostic/disable-inventory-hotfix | Experimental descartada |
| fix/startup-load-errors | Descartada (sus cambios no se fusionan) |

### Ramas a conservar

| Rama | Motivo |
|---|---|
| main | Produccion |
| backup/pre-sanitation-2026-07-30 | Red de seguridad de esta operacion |

### Resultado esperado

Repositorio con exactamente 2 ramas activas: main y backup/pre-sanitation-2026-07-30.

---

## Fase B -- Unificar aliases (Pendiente)

Objetivo: una sola fuente de verdad para aliases de items. Actualmente hay tres tablas distintas en inventory_system.js, ashbrand_hotfix.js y game.js.
Ficheros que toca: inventory_system.js, ashbrand_hotfix.js, game.js (~L3772).
Riesgo: bajo-medio.
Como verificarlo: abre el inventario. Todos los items aparecen con nombre y rareza correctos. No hay slots "?".

---

## Fase C -- Eliminar fallback hardcodeado (Pendiente)

Objetivo: eliminar la linea con fallback a 'cuchilla_llameante' en ashbrand_hotfix.js. Si un item no se resuelve, queda como "?" recuperable; nunca se convierte silenciosamente en otro item.
Ficheros que toca: ashbrand_hotfix.js (1 linea).
Riesgo: muy bajo.
Como verificarlo: ningun item inesperado en el inventario. Items no resueltos aparecen como "?" recuperables.

---

## Fase D -- Fusionar ashbrand_hotfix en inventory_system (Pendiente)

Objetivo: mover toda la logica de repair(), renderInventoryGrid(), renderStashGrid() y emergencyRerollLegacyItem() a inventory_system.js. Vaciar ashbrand_hotfix.js a un stub comentado.
Ficheros que toca: inventory_system.js, ashbrand_hotfix.js, index.html, sw.js.
Riesgo: medio.
Como verificarlo: abre inventario y baul. Equipa y desequipa un item. Cierra y vuelve a abrir la app. Todo igual.

---

## Fase E -- Unificar funciones duplicadas de quests (Pendiente)

Objetivo: eliminar las copias de acceptQuest, updateQuestProgress y completeQuest de game.js. Solo viven en quests.js.
Ficheros que toca: game.js (~3 funciones), quests.js.
Riesgo: medio-alto.
Como verificarlo: acepta una quest, completa una tarea que la avance, completala. Las recompensas llegan correctamente.

---

## Fase F -- Mover ITEM_FLAVOR_TEXT fuera de game.js (Pendiente)

Objetivo: extraer el bloque de ~390 lineas de flavor text de game.js a item_flavor.js.
Ficheros que toca: game.js (eliminar bloque), nuevo item_flavor.js, index.html, sw.js.
Riesgo: bajo.
Como verificarlo: abre el modal de cualquier item equipable con attunement. El texto de flavor aparece correctamente.

---

## Fase G -- Split de game.js (Pendiente)

Objetivo: dividir game.js (4.150 lineas) en modulos coherentes.
Division propuesta: game-core.js, game-ui.js, game-items.js, game-quests-ui.js, game-guild.js, game-onboarding.js.
Ficheros que toca: game.js, los ficheros nuevos, index.html, sw.js.
Riesgo: alto. Se planifica en detalle solo despues de que A-F esten cerradas.
Como verificarlo: toda la app funciona igual. Save antiguo carga correctamente.

---

## Decisiones

| # | Decision | Estado |
|---|---|---|
| D-01 | fix/startup-load-errors: descartar | Confirmado |
| D-02 | diagnostic/disable-inventory-hotfix: descartar | Confirmado |
| D-03 | Orden de fases A-B-C-D-E-F-G | Aprobado |

---

## Changelog del plan

| Fecha | Cambio |
|---|---|
| 2026-07-30 | Creacion inicial del plan tras auditoria completa del repositorio |
