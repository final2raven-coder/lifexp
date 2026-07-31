# PLAN DE ACCION -- Saneamiento LifeXP
> Generado: 2026-07-30 | Estado: **EN CURSO**
> Regla: ningun PR de limpieza cambia comportamiento del juego. Refactors puros.
> Nada de contenido nuevo hasta que la limpieza este cerrada.

---

## Estado global

| Fase | Nombre | Estado | PR |
|---|---|---|---|
| 0 | Red de seguridad | Completada 2026-07-30 | -- |
| A | Borrar ramas muertas | Completada 2026-07-30 | -- |
| B | Unificar aliases (una sola fuente de verdad) | Completada 2026-07-30 | #10 |
| C | Eliminar fallback hardcodeado | Completada 2026-07-31 | #11 |
| D | Fusionar ashbrand_hotfix en inventory_system | Completada 2026-07-31 | #12 |
| E | Unificar funciones duplicadas de quests | Pendiente | -- |
| F | Mover ITEM_FLAVOR_TEXT fuera de game.js | Pendiente | -- |
| G | Split de game.js | Pendiente | -- |

---

## Fase 0 -- Red de seguridad (Completada 2026-07-30)

Rama de respaldo creada: backup/pre-sanitation-2026-07-30
Apunta al commit 218cb09e118920b5323598e194c1bd8f07be2ae1 (produccion a las 11:52 UTC del 30/07/2026).

Como volver: decirlo al Game Master. El se encarga.

---

## Fase A -- Borrar ramas muertas (Completada 2026-07-30)

Resultado: repositorio reducido a 2 ramas activas.

### Ramas eliminadas

| Rama | Motivo |
|---|---|
| fix/inventory-canonical-contract | Fusionada en main |
| fix/item-ux-ashbrand | Fusionada en main |
| fix/main-startup-inventory | Fusionada en main |
| fix/recover-before-items-truncation | Fusionada en main |
| fix/startup-from-clean-base | Fusionada en main |
| fix/startup-from-functional-base | Fusionada en main |
| restore-gamejs-from-functional-commit | Fusionada en main |
| restore-only-gamejs | Fusionada en main |
| final2raven-coder-update1 | Fusionada en main |
| diagnostic/disable-inventory-hotfix | Experimental descartada |
| fix/startup-load-errors | Descartada (cambios no fusionados) |

### Ramas activas tras la limpieza

| Rama | Rol |
|---|---|
| main | Produccion y GitHub Pages |
| backup/pre-sanitation-2026-07-30 | Red de seguridad de esta operacion |

---

## Fase B -- Unificar aliases (Completada 2026-07-30 -- PR #10)

Objetivo: una sola fuente de verdad para aliases de items.
Ficheros tocados: game.js, ashbrand_hotfix.js (sin cambios en inventory_system.js).

### Que se hizo

- Eliminado el bloque LEGACY_ITEM_ALIASES de game.js (~27 lineas, L3772-3812).
- resolveInventoryItemId() ahora delega a window.LifeXPInventory.resolve().
- repairInventoryIdentities() ahora delega a window.LifeXPInventory.repair().
- ashbrand_hotfix.js: eliminada tabla ALIASES duplicada y resolver local; delega a inventory_system.js.
- normalizeItemText conservada como global (referencias externas existentes).
- inventory_system.js: sin cambios (ya era la fuente de verdad).

### Incidencia durante el PR

El tool de subida de ficheros rechaza emojis reales (>U+FFFF) y box-drawing chars (U+2500-257F).
Solucion aplicada: emojis escapados como surrogate pairs JS validos (\uD83C\uDFE0 etc.),
box-drawing reemplazados por = en los comentarios de seccion.
El fichero resultante es JS valido y funciona correctamente en el navegador.

---

## Fase C -- Eliminar fallback hardcodeado (Completada 2026-07-31 -- PR #11)

Objetivo: eliminar la linea con fallback a 'cuchilla_llameante' en ashbrand_hotfix.js.
Si un item no se resuelve, queda como slot invalido recuperable; nunca se convierte
silenciosamente en otro item.

### Que se encontro

Al auditar ashbrand_hotfix.js en main (post Fase B), el fallback hardcodeado ya no existia.
Fue eliminado como efecto secundario de la Fase B: al reescribir la logica de resolucion
para delegar a inventory_system.js, la rama de fallback a 'cuchilla_llameante' desaparecio.

El comportamiento actual es correcto: si inv.resolve() devuelve falsy, emergencyRerollLegacyItem()
retorna { success: false, reason: 'item_unresolvable' } sin transformar el slot.

### Que hizo este PR

Solo actualizo la documentacion (PLAN_DE_ACCION.md y PROJECT_MAP.md) para reflejar
que la Fase C estaba ya completada. Ningun fichero JS fue modificado.

---

## Fase D -- Fusionar ashbrand_hotfix en inventory_system (Completada 2026-07-31 -- PR #12)

Objetivo: mover toda la logica de ashbrand_hotfix.js a inventory_system.js y dejar
ashbrand_hotfix.js como stub vacio de compatibilidad.

### Que se hizo

- inventory_system.js: absorbidos los dos simbolos publicos que antes vivia en ashbrand_hotfix.js:
    - window.normalizeItemText: ahora es un alias directo de la funcion interna text().
    - window.emergencyRerollLegacyItem: movida integra al IIFE. Ahora llama a resolve()
      directamente en lugar de pasar por window.LifeXPInventory.resolve() (misma logica,
      sin indirecciones innecesarias). BUILD actualizado a 'v15-merged-hotfix'.
- ashbrand_hotfix.js: vaciado a stub de 11 lineas de comentario. El fichero se mantiene
  para no romper el orden de carga de index.html ni la lista de assets de sw.js.
  Se eliminara fisicamente en la Fase G.
- DT-07 y DT-08 resueltas.

### Como verificarlo

1. Abre la app normalmente. El inventario carga igual que antes.
2. Abre el inventario y el baul. Equipa y desequipa un item. Todo funciona igual.
3. Cierra la app y vuelve a abrirla. El save carga correctamente.
4. En la consola del navegador: escribe normalizeItemText('Hoja Gelida') y comprueba
   que devuelve 'hoja gelida'. Escribe window.LifeXPInventory.BUILD y comprueba
   que devuelve 'v15-merged-hotfix'.

---

## Fase E -- Unificar funciones duplicadas de quests (Pendiente)

Objetivo: eliminar las copias de acceptQuest, updateQuestProgress y completeQuest de game.js.
Solo viven en quests.js.
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

Objetivo: dividir game.js (4.124 lineas) en modulos coherentes.
Division propuesta: game-core.js, game-ui.js, game-items.js, game-quests-ui.js, game-guild.js, game-onboarding.js.
Ficheros que toca: game.js, los ficheros nuevos, index.html, sw.js.
Riesgo: alto. Se planifica en detalle solo despues de que A-F esten cerradas.
Como verificarlo: toda la app funciona igual. Save antiguo carga correctamente.
Nota: en esta fase se eliminara fisicamente ashbrand_hotfix.js del orden de carga y de sw.js.

---

## Decisiones

| # | Decision | Estado |
|---|---|---|
| D-01 | fix/startup-load-errors: descartar | Confirmado |
| D-02 | diagnostic/disable-inventory-hotfix: descartar | Confirmado |
| D-03 | Orden de fases A-B-C-D-E-F-G | Aprobado |

---

## Nota tecnica: limitacion del tool de subida

El tool de GitHub usado por el Game Master agent rechaza ficheros con:
- Emojis reales (codepoints > U+FFFF)
- Box-drawing chars (U+2500-U+257F)

Solucion estandar para game.js y ficheros JS con emojis:
1. Escapar emojis >FFFF como surrogate pairs JS: U+1F3E0 -> \uD83C\uDFE0
2. Reemplazar box-drawing por = en comentarios de seccion
3. Verificar: 0 chars >FFFF, 0 box-drawing, surrogate pairs correctos (high+low emparejados)

Esta transformacion es transparente para el navegador (JS interpreta los surrogates correctamente).

---

## Changelog del plan

| Fecha | Cambio |
|---|---|
| 2026-07-30 | Creacion inicial del plan tras auditoria completa del repositorio |
| 2026-07-30 | Fase 0 completada: rama backup/pre-sanitation-2026-07-30 creada |
| 2026-07-30 | Fase A completada: 11 ramas eliminadas, repositorio reducido a 2 ramas |
| 2026-07-30 | Fase B completada: PR #10 mergeado. Aliases unificados en inventory_system.js. DT-14 resuelta |
| 2026-07-31 | Fase C completada: PR #11. Fallback ya eliminado en Fase B. Solo actualizacion documental |
| 2026-07-31 | Fase D completada: PR #12. ashbrand_hotfix.js vaciado a stub. Logica absorbida por inventory_system.js. DT-07 y DT-08 resueltas |
