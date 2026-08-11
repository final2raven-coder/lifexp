# DROP_MAPPING.md

> **Propósito:** inventario exhaustivo de referencias de drop rotas en `data_tasks.js`, `expansion_tasks.js` e `items.js` (DROP_TABLES).
> Generado: 2026-08-11. Rama: `fix/dt13-dt02-drop-ids`.
> **Acción requerida:** aprobar las filas FUZZY antes de ejecutar el PASO 2.

---

## Resumen

| Fichero | Total referencias rotas | EXACT | FUZZY | NONE |
|---|---|---|---|---|
| `data_tasks.js` | 110 | 20 | 8 | 82 |
| `expansion_tasks.js` | 0 | — | — | — |
| `items.js` (DROP_TABLES) | 0 | — | — | — |
| **Total** | **110** | **20** | **8** | **82** |

> **`expansion_tasks.js`:** ya usa IDs canónicos en todos sus drops (corregido en DT-20 según cabecera del fichero). Verificado manualmente: todos los IDs existen en ITEMS.
> **`items.js` DROP_TABLES:** todos los valores son IDs canónicos. Verificado manualmente: ninguna referencia rota.

---

## Leyenda de confianza

| Código | Significado |
|---|---|
| EXACT | El display string mapea sin ambigüedad al ID canónico (mismo concepto, mismo tema). Listo para reemplazar. |
| FUZZY | Mapeo probable pero requiere confirmación humana (nombre en español ≠ nombre en inglés del item, o plural). |
| NONE | No existe ningún item canónico que corresponda. El string debe eliminarse o reemplazarse por un item existente. |

---

## Tabla completa — `data_tasks.js`

| # | task id | campo | string actual | ID propuesto | confianza |
|---|---|---|---|---|---|
| 1 | `casa_1` | `drops.items` | `Poción de Agua Menor` | `pocion_agua_menor` | **EXACT** |
| 2 | `casa_1` | `drops.items` | `Veneno Básico` | `veneno_basico` | **EXACT** |
| 3 | `casa_1` | `drops.items` | `Frasco Vacío` | `frasco_vacio` | **EXACT** |
| 4 | `casa_1` | `sideQuest.drops` | `Esencia Purificadora` | `—` | **NONE** |
| 5 | `casa_1` | `sideQuest.drops` | `Cristal de Limpieza` | `—` | **NONE** |
| 6 | `casa_2` | `drops.items` | `Moneda Antigua` | `moneda_antigua` | **EXACT** |
| 7 | `casa_2` | `drops.items` | `Objeto Olvidado` | `objeto_olvidado` | **EXACT** |
| 8 | `casa_2` | `sideQuest.drops` | `Moneda de Oro` | `moneda_oro` | **EXACT** |
| 9 | `casa_3` | `drops.items` | `Gota de Agua Pura` | `—` | **NONE** |
| 10 | `casa_3` | `sideQuest.drops` | `Esencia de Limpieza` | `—` | **NONE** |
| 11 | `casa_4` | `drops.items` | `Grasa de Fuego` | `—` | **NONE** |
| 12 | `casa_4` | `drops.items` | `Espátula Encantada` | `—` | **NONE** |
| 13 | `casa_4` | `sideQuest.drops` | `Llama Culinaria` | `—` | **NONE** |
| 14 | `casa_6` | `drops.items` | `Fragmento Solar` | `fragmento_solar` | **EXACT** |
| 15 | `casa_6` | `drops.items` | `Pluma del Viento` | `pluma_viento` | **FUZZY** |
| 16 | `casa_6` | `sideQuest.drops` | `Brisa Atrapada` | `—` | **NONE** |
| 17 | `casa_8` | `drops.items` | `Pluma de Sueño` | `—` | **NONE** |
| 18 | `casa_8` | `drops.items` | `Esencia de Descanso` | `—` | **NONE** |
| 19 | `casa_8` | `sideQuest.drops` | `Bendición del Descanso` | `—` | **NONE** |
| 20 | `casa_9` | `drops.items` | `Prenda Olvidada` | `—` | **NONE** |
| 21 | `casa_9` | `drops.items` | `Monedas Antiguas` | `moneda_antigua` | **FUZZY** |
| 22 | `casa_9` | `sideQuest.drops` | `Amuleto de Espacio` | `amuleto_espacio` | **FUZZY** |
| 23 | `casa_10` | `drops.items` | `Cristal Solar` | `cristal_solar` | **EXACT** |
| 24 | `casa_10` | `drops.items` | `Pluma de Viento` | `pluma_viento` | **EXACT** |
| 25 | `casa_10` | `sideQuest.drops` | `Luz Atrapada` | `—` | **NONE** |
| 26 | `casa_11` | `drops.items` | `Ración de Combate` | `racion_combate` | **EXACT** |
| 27 | `casa_11` | `drops.items` | `Gema de Fuego Menor` | `—` | **NONE** |
| 28 | `casa_11` | `drops.items` | `Especia Rara` | `especia_rara` | **EXACT** |
| 29 | `casa_11` | `sideQuest.drops` | `Receta Secreta` | `—` | **NONE** |
| 30 | `casa_11` | `sideQuest.drops` | `Elixir de Vitalidad` | `elixir_vitalidad` | **EXACT** |
| 31 | `casa_12` | `drops.items` | `Monedas` | `—` | **NONE** |
| 32 | `casa_12` | `drops.items` | `Ingrediente Especial` | `—` | **NONE** |
| 33 | `casa_12` | `sideQuest.drops` | `Ojo del Comerciante` | `—` | **NONE** |
| 34 | `casa_13` | `drops.items` | `Polvo de Sueño` | `—` | **NONE** |
| 35 | `casa_13` | `sideQuest.drops` | `Cristal de Tranquilidad` | `—` | **NONE** |
| 36 | `casa_14` | `drops.items` | `Hoja Curativa` | `hierba_curativa` | **FUZZY** |
| 37 | `casa_14` | `drops.items` | `Semilla Rara` | `semilla_rara` | **EXACT** |
| 38 | `casa_14` | `drops.items` | `Rocío Matutino` | `—` | **NONE** |
| 39 | `casa_14` | `sideQuest.drops` | `Espíritu del Jardín` | `—` | **NONE** |
| 40 | `casa_14` | `sideQuest.drops` | `Flor Luminosa` | `—` | **NONE** |
| 41 | `casa_15` | `drops.items` | `Fragmento de Hielo` | `fragmento_hielo` | **EXACT** |
| 42 | `casa_15` | `drops.items` | `Escarcha Eterna` | `—` | **NONE** |
| 43 | `casa_15` | `sideQuest.drops` | `Cristal de Hielo Puro` | `—` | **NONE** |
| 44 | `cuerpo_3` | `drops.items` | `Mapa de Zona` | `—` | **NONE** |
| 45 | `cuerpo_3` | `drops.items` | `Piedra del Camino` | `—` | **NONE** |
| 46 | `cuerpo_3` | `drops.items` | `Monedas` | `—` | **NONE** |
| 47 | `cuerpo_3` | `sideQuest.drops` | `Botas de Viajero` | `botas_viajero` | **FUZZY** |
| 48 | `cuerpo_3` | `sideQuest.drops` | `Amuleto del Explorador` | `—` | **NONE** |
| 49 | `cuerpo_5` | `drops.items` | `Orbe de Claridad` | `—` | **NONE** |
| 50 | `cuerpo_5` | `drops.items` | `Incienso Místico` | `—` | **NONE** |
| 51 | `cuerpo_5` | `sideQuest.drops` | `Foco Interior` | `—` | **NONE** |
| 52 | `cuerpo_5` | `sideQuest.drops` | `Mente de Cristal` | `—` | **NONE** |
| 53 | `cuerpo_6` | `drops.items` | `Perla Marina` | `perla_marina` | **EXACT** |
| 54 | `cuerpo_6` | `drops.items` | `Escama Brillante` | `—` | **NONE** |
| 55 | `cuerpo_6` | `drops.items` | `Coral Mágico` | `—` | **NONE** |
| 56 | `cuerpo_6` | `sideQuest.drops` | `Tridente Menor` | `—` | **NONE** |
| 57 | `cuerpo_6` | `sideQuest.drops` | `Bendición del Mar` | `—` | **NONE** |
| 58 | `gestiones_1` | `drops.items` | `Bolsa de Oro Grande` | `—` | **NONE** |
| 59 | `gestiones_1` | `drops.items` | `Lingote de Oro` | `—` | **NONE** |
| 60 | `gestiones_1` | `sideQuest.drops` | `Sabiduría Fiscal` | `—` | **NONE** |
| 61 | `gestiones_1` | `sideQuest.drops` | `Corona del Contribuyente` | `—` | **NONE** |
| 62 | `gestiones_2` | `drops.items` | `Monedas de Oro` | `moneda_oro` | **FUZZY** |
| 63 | `gestiones_2` | `drops.items` | `Gema Menor` | `—` | **NONE** |
| 64 | `gestiones_2` | `sideQuest.drops` | `Ojo del Comerciante` | `—` | **NONE** |
| 65 | `gestiones_3` | `drops.items` | `Cristal de Memoria` | `—` | **NONE** |
| 66 | `gestiones_3` | `drops.items` | `Pergamino en Blanco` | `—` | **NONE** |
| 67 | `gestiones_3` | `sideQuest.drops` | `Biblioteca Personal` | `—` | **NONE** |
| 68 | `gestiones_4` | `drops.items` | `Mensaje Importante` | `—` | **NONE** |
| 69 | `gestiones_4` | `drops.items` | `Llave Olvidada` | `—` | **NONE** |
| 70 | `gestiones_4` | `sideQuest.drops` | `Sello de Eficiencia` | `—` | **NONE** |
| 71 | `gestiones_5` | `drops.items` | `Pergamino de Planificación` | `—` | **NONE** |
| 72 | `gestiones_5` | `sideQuest.drops` | `Agenda Encantada` | `—` | **NONE** |
| 73 | `social_1` | `drops.items` | `Recuerdo Especial` | `—` | **NONE** |
| 74 | `social_1` | `drops.items` | `Lazo de Conexión` | `—` | **NONE** |
| 75 | `social_1` | `sideQuest.drops` | `Anillo de Vínculo` | `—` | **NONE** |
| 76 | `social_1` | `sideQuest.drops` | `Flor Eterna` | `—` | **NONE** |
| 77 | `social_2` | `drops.items` | `Token de Amistad` | `token_amistad` | **EXACT** |
| 78 | `social_2` | `sideQuest.drops` | `Sello de Hermandad` | `—` | **NONE** |
| 79 | `social_3` | `drops.items` | `Token de Amistad` | `token_amistad` | **EXACT** |
| 80 | `social_3` | `sideQuest.drops` | `Sello de Hermandad` | `—` | **NONE** |
| 81 | `social_4` | `drops.items` | `Bendición Familiar` | `—` | **NONE** |
| 82 | `social_4` | `sideQuest.drops` | `Lazo de Sangre` | `—` | **NONE** |
| 83 | `social_5` | `drops.items` | `Recuerdo de Aventura` | `—` | **NONE** |
| 84 | `social_5` | `drops.items` | `Hidromiel de Camaradería` | `hidromiel` | **FUZZY** |
| 85 | `social_5` | `sideQuest.drops` | `Corona del Organizador` | `—` | **NONE** |
| 86 | `personal_1` | `drops.items` | `Dado del Destino` | `dado_destino` | **EXACT** |
| 87 | `personal_1` | `drops.items` | `Tinta Mágica` | `tinta_magica` | **EXACT** |
| 88 | `personal_1` | `drops.items` | `Fragmento de Historia` | `—` | **NONE** |
| 89 | `personal_1` | `sideQuest.drops` | `Pluma del Creador` | `—` | **NONE** |
| 90 | `personal_1` | `sideQuest.drops` | `Capítulo Terminado` | `—` | **NONE** |
| 91 | `personal_2` | `drops.items` | `Carácter Antiguo` | `—` | **NONE** |
| 92 | `personal_2` | `drops.items` | `Talismán Oriental` | `talisman_oriental` | **EXACT** |
| 93 | `personal_2` | `drops.items` | `Jade Menor` | `—` | **NONE** |
| 94 | `personal_2` | `sideQuest.drops` | `Escama de Dragón` | `escama_dragon` | **FUZZY** |
| 95 | `personal_2` | `sideQuest.drops` | `Pergamino de Sabiduría` | `—` | **NONE** |
| 96 | `personal_3` | `drops.items` | `Página de Reflexión` | `—` | **NONE** |
| 97 | `personal_3` | `drops.items` | `Tinta de Pensamiento` | `—` | **NONE** |
| 98 | `personal_3` | `sideQuest.drops` | `Claridad Mental` | `—` | **NONE** |
| 99 | `personal_4` | `drops.items` | `Pergamino de Hechizo` | `—` | **NONE** |
| 100 | `personal_4` | `drops.items` | `Conocimiento Antiguo` | `—` | **NONE** |
| 101 | `personal_4` | `sideQuest.drops` | `Grimorio Menor` | `—` | **NONE** |
| 102 | `personal_4` | `sideQuest.drops` | `Sabiduría Acumulada` | `—` | **NONE** |
| 103 | `personal_5` | `drops.items` | `Paz Interior` | `—` | **NONE** |
| 104 | `personal_5` | `drops.items` | `Hoja de Calma` | `—` | **NONE** |
| 105 | `personal_5` | `sideQuest.drops` | `Reconexión Natural` | `—` | **NONE** |
| 106 | `personal_5` | `sideQuest.drops` | `Espíritu Libre` | `—` | **NONE** |
| 107 | `personal_6` | `drops.items` | `Visión del Futuro` | `—` | **NONE** |
| 108 | `personal_6` | `drops.items` | `Bendición del Oráculo` | `—` | **NONE** |
| 109 | `personal_6` | `sideQuest.drops` | `Fragmento de Destino` | `—` | **NONE** |
| 110 | `personal_6` | `sideQuest.drops` | `Profecía` | `—` | **NONE** |

---

## Filas EXACT — aprobación automática (20 referencias)

Estas referencias pueden reemplazarse directamente en el PASO 2 sin decisión adicional.

| task id | campo | string actual | ID canónico |
|---|---|---|---|
| `casa_1` | `drops.items` | `Poción de Agua Menor` | `pocion_agua_menor` |
| `casa_1` | `drops.items` | `Veneno Básico` | `veneno_basico` |
| `casa_1` | `drops.items` | `Frasco Vacío` | `frasco_vacio` |
| `casa_2` | `drops.items` | `Moneda Antigua` | `moneda_antigua` |
| `casa_2` | `drops.items` | `Objeto Olvidado` | `objeto_olvidado` |
| `casa_2` | `sideQuest.drops` | `Moneda de Oro` | `moneda_oro` |
| `casa_6` | `drops.items` | `Fragmento Solar` | `fragmento_solar` |
| `casa_10` | `drops.items` | `Cristal Solar` | `cristal_solar` |
| `casa_10` | `drops.items` | `Pluma de Viento` | `pluma_viento` |
| `casa_11` | `drops.items` | `Ración de Combate` | `racion_combate` |
| `casa_11` | `drops.items` | `Especia Rara` | `especia_rara` |
| `casa_11` | `sideQuest.drops` | `Elixir de Vitalidad` | `elixir_vitalidad` |
| `casa_14` | `drops.items` | `Semilla Rara` | `semilla_rara` |
| `casa_15` | `drops.items` | `Fragmento de Hielo` | `fragmento_hielo` |
| `cuerpo_6` | `drops.items` | `Perla Marina` | `perla_marina` |
| `social_2` | `drops.items` | `Token de Amistad` | `token_amistad` |
| `social_3` | `drops.items` | `Token de Amistad` | `token_amistad` |
| `personal_1` | `drops.items` | `Dado del Destino` | `dado_destino` |
| `personal_1` | `drops.items` | `Tinta Mágica` | `tinta_magica` |
| `personal_2` | `drops.items` | `Talismán Oriental` | `talisman_oriental` |

---

## Filas FUZZY — requieren confirmación (8 referencias)

Para cada una se indica la razón del mapeo y qué confirmar.

| # | task id | campo | string actual | ID propuesto | razón del mapeo |
|---|---|---|---|---|---|
| 1 | `casa_6` | `drops.items` | `Pluma del Viento` | `pluma_viento` | `pluma_viento` (Wind Feather) es el único item de tema `sol_viento` con concepto de pluma. El display usa "del" en lugar de "de". |
| 2 | `casa_9` | `drops.items` | `Monedas Antiguas` | `moneda_antigua` | Plural de `moneda_antigua`. El motor busca por ID; el plural no existe como ID separado. |
| 3 | `casa_9` | `sideQuest.drops` | `Amuleto de Espacio` | `amuleto_espacio` | `amuleto_espacio` (Poche of Elsewhere) es el único item con efecto de inventario/espacio. Nombre en español coincide. |
| 4 | `cuerpo_3` | `sideQuest.drops` | `Botas de Viajero` | `botas_viajero` | `botas_viajero` (Wayfarer Boots) es el único item de tipo armor con tema `exploracion`. Nombre en español coincide. |
| 5 | `gestiones_2` | `drops.items` | `Monedas de Oro` | `moneda_oro` | Plural de `moneda_oro`. El motor busca por ID; el plural no existe como ID separado. |
| 6 | `social_5` | `drops.items` | `Hidromiel de Camaradería` | `hidromiel` | `hidromiel` (Mead) es el único item de tema `social` de tipo consumable. El display añade "de Camaradería". |
| 7 | `personal_2` | `sideQuest.drops` | `Escama de Dragón` | `escama_dragon` | `escama_dragon` (Scale of the Wyrm) es el único item de tema `oriente` con concepto de escama de dragón. |
| 8 | `casa_14` | `drops.items` | `Hoja Curativa` | `hierba_curativa` | `hierba_curativa` (Healing Herb) es el único item curativo de tema `naturaleza`. "Hoja" y "Hierba" son conceptos próximos. |

---

## Filas NONE — sin item canónico (82 referencias)

Estos strings no tienen correspondencia en ITEMS. **No se tocan en el PASO 2.**
Opciones para cada uno (decisión del Game Master):
- **A) Eliminar** el string del array (el drop queda vacío o se reduce).
- **B) Reemplazar** por un item canónico existente temáticamente coherente.
- **C) Crear** el item en `items.js` y añadirlo al DROP_TABLE correspondiente.

| # | task id | campo | string actual | tema de la tarea | sugerencia de item canónico |
|---|---|---|---|---|---|
| 1 | `casa_1` | `sideQuest.drops` | `Esencia Purificadora` | `agua_quimicos` | `esencia_agua` (Water Essence) — mismo tema |
| 2 | `casa_1` | `sideQuest.drops` | `Cristal de Limpieza` | `agua_quimicos` | `frasco_vacio` o eliminar |
| 3 | `casa_3` | `drops.items` | `Gota de Agua Pura` | `agua` | `pocion_agua` (Water Potion) — mismo tema agua |
| 4 | `casa_3` | `sideQuest.drops` | `Esencia de Limpieza` | `agua` | `esencia_agua` o eliminar |
| 5 | `casa_4` | `drops.items` | `Grasa de Fuego` | `fuego` | `gema_fuego` (Fire Gem) — mismo tema fuego |
| 6 | `casa_4` | `drops.items` | `Espátula Encantada` | `fuego` | `escoba_encantada` (Enchanted Broom) — item de casa/hallazgos |
| 7 | `casa_4` | `sideQuest.drops` | `Llama Culinaria` | `fuego` | `corazon_fuego` (Heart of Fire) o eliminar |
| 8 | `casa_6` | `sideQuest.drops` | `Brisa Atrapada` | `sol_viento` | `amuleto_brisa` (Windglass) — mismo tema |
| 9 | `casa_8` | `drops.items` | `Pluma de Sueño` | `descanso` | `fragmento_sueno` (Dream Fragment) — concepto sueño |
| 10 | `casa_8` | `drops.items` | `Esencia de Descanso` | `descanso` | `hierba_curativa` (Healing Herb) — efecto descanso/recuperación |
| 11 | `casa_8` | `sideQuest.drops` | `Bendición del Descanso` | `descanso` | `pocion_agua` o eliminar |
| 12 | `casa_9` | `drops.items` | `Prenda Olvidada` | `hallazgos` | `objeto_olvidado` (Forgotten Object) — mismo concepto |
| 13 | `casa_10` | `sideQuest.drops` | `Luz Atrapada` | `sol_viento` | `cristal_solar` (Sunshard) — mismo tema |
| 14 | `casa_11` | `drops.items` | `Gema de Fuego Menor` | `fuego_comida` | `gema_fuego` (Fire Gem) — mismo tema |
| 15 | `casa_11` | `sideQuest.drops` | `Receta Secreta` | `fuego_comida` | `especia_rara` (Rare Spice) o eliminar |
| 16 | `casa_12` | `drops.items` | `Monedas` | `comercio` | `moneda_antigua` o `moneda_oro` — ambiguo, decidir |
| 17 | `casa_12` | `drops.items` | `Ingrediente Especial` | `comercio` | `especia_rara` (Rare Spice) — tema fuego_comida/comercio |
| 18 | `casa_12` | `sideQuest.drops` | `Ojo del Comerciante` | `comercio` | `contrato_mercantil` (Merchant Contract) — mismo tema |
| 19 | `casa_13` | `drops.items` | `Polvo de Sueño` | `descanso` | `fragmento_sueno` (Dream Fragment) |
| 20 | `casa_13` | `sideQuest.drops` | `Cristal de Tranquilidad` | `descanso` | `rosario_concentracion` (Counting Beads) — tema mente/calma |
| 21 | `casa_14` | `drops.items` | `Rocío Matutino` | `naturaleza` | `esencia_vida` (Essence of Life) — tema naturaleza |
| 22 | `casa_14` | `sideQuest.drops` | `Espíritu del Jardín` | `naturaleza` | `corazon_bosque` (Heart of the Forest) |
| 23 | `casa_14` | `sideQuest.drops` | `Flor Luminosa` | `naturaleza` | `semilla_rara` o eliminar |
| 24 | `casa_15` | `drops.items` | `Escarcha Eterna` | `hielo` | `fragmento_hielo` (Ice Fragment) — mismo tema |
| 25 | `casa_15` | `sideQuest.drops` | `Cristal de Hielo Puro` | `hielo` | `colmillo_hielo` (Ice Fang) o `pocion_escarcha` |
| 26 | `cuerpo_3` | `drops.items` | `Mapa de Zona` | `exploracion` | `mapa_tesoro` (Treasure Map) — mismo tema |
| 27 | `cuerpo_3` | `drops.items` | `Piedra del Camino` | `exploracion` | `caparazon` (Shell) o `daga_oxidada` — tema exploracion |
| 28 | `cuerpo_3` | `drops.items` | `Monedas` | `exploracion` | `moneda_antigua` — tema hallazgos/exploracion |
| 29 | `cuerpo_3` | `sideQuest.drops` | `Amuleto del Explorador` | `exploracion` | `amuleto_bosque` (Forest Amulet) o `botas_viajero` |
| 30 | `cuerpo_5` | `drops.items` | `Orbe de Claridad` | `mente` | `orbe_mental` (Thoughtstone) — mismo tema |
| 31 | `cuerpo_5` | `drops.items` | `Incienso Místico` | `mente` | `rosario_concentracion` (Counting Beads) — tema mente |
| 32 | `cuerpo_5` | `sideQuest.drops` | `Foco Interior` | `mente` | `skill_foco_interior` (Scroll: Inner Focus) — mismo concepto |
| 33 | `cuerpo_5` | `sideQuest.drops` | `Mente de Cristal` | `mente` | `fragmento_sueno` o eliminar |
| 34 | `cuerpo_6` | `drops.items` | `Escama Brillante` | `agua_profunda` | `escama_marina` (Sea Scale) — mismo tema |
| 35 | `cuerpo_6` | `drops.items` | `Coral Mágico` | `agua_profunda` | `esencia_agua` o eliminar |
| 36 | `cuerpo_6` | `sideQuest.drops` | `Tridente Menor` | `agua_profunda` | `tridente_marino` (Drownwake) — mismo tema |
| 37 | `cuerpo_6` | `sideQuest.drops` | `Bendición del Mar` | `agua_profunda` | `perla_marina` o eliminar |
| 38 | `gestiones_1` | `drops.items` | `Bolsa de Oro Grande` | `oro` | `moneda_oro` (Gold Coin) — tema comercio/oro |
| 39 | `gestiones_1` | `drops.items` | `Lingote de Oro` | `oro` | `moneda_oro` — no existe lingote; mismo tema |
| 40 | `gestiones_1` | `sideQuest.drops` | `Sabiduría Fiscal` | `oro` | `contrato_mercantil` o eliminar |
| 41 | `gestiones_1` | `sideQuest.drops` | `Corona del Contribuyente` | `oro` | eliminar — no hay item equivalente |
| 42 | `gestiones_2` | `drops.items` | `Gema Menor` | `oro` | `moneda_antigua` o `gema_fuego` — decidir |
| 43 | `gestiones_2` | `sideQuest.drops` | `Ojo del Comerciante` | `oro` | `contrato_mercantil` — mismo tema comercio |
| 44 | `gestiones_3` | `drops.items` | `Cristal de Memoria` | `conocimiento` | `pagina_arcana` (Arcane Page) — tema conocimiento |
| 45 | `gestiones_3` | `drops.items` | `Pergamino en Blanco` | `conocimiento` | `tinta_magica` (Magic Ink) — tema conocimiento |
| 46 | `gestiones_3` | `sideQuest.drops` | `Biblioteca Personal` | `conocimiento` | `grimorio_antiguo` (Ancient Grimoire) |
| 47 | `gestiones_4` | `drops.items` | `Mensaje Importante` | `comercio` | `contrato_sospechoso` (Suspicious Contract) — tema gestiones |
| 48 | `gestiones_4` | `drops.items` | `Llave Olvidada` | `comercio` | `llave_cofre` (Chest Key) — mismo concepto |
| 49 | `gestiones_4` | `sideQuest.drops` | `Sello de Eficiencia` | `comercio` | `sello_alianza` (Oathseal) — concepto sello |
| 50 | `gestiones_5` | `drops.items` | `Pergamino de Planificación` | `conocimiento` | `pagina_arcana` (Arcane Page) |
| 51 | `gestiones_5` | `sideQuest.drops` | `Agenda Encantada` | `conocimiento` | `tinta_magica` o eliminar |
| 52 | `social_1` | `drops.items` | `Recuerdo Especial` | `vinculo` | `token_amistad` (Friendship Token) — tema social |
| 53 | `social_1` | `drops.items` | `Lazo de Conexión` | `vinculo` | `sello_alianza` (Oathseal) — tema social/alianzas |
| 54 | `social_1` | `sideQuest.drops` | `Anillo de Vínculo` | `vinculo` | `sello_alianza` o eliminar |
| 55 | `social_1` | `sideQuest.drops` | `Flor Eterna` | `vinculo` | eliminar — no hay item equivalente |
| 56 | `social_2` | `sideQuest.drops` | `Sello de Hermandad` | `amistad` | `sello_alianza` (Oathseal) — mismo concepto |
| 57 | `social_3` | `sideQuest.drops` | `Sello de Hermandad` | `amistad` | `sello_alianza` (Oathseal) — mismo concepto |
| 58 | `social_4` | `drops.items` | `Bendición Familiar` | `vinculo` | `token_amistad` — tema social |
| 59 | `social_4` | `sideQuest.drops` | `Lazo de Sangre` | `vinculo` | `sello_alianza` o eliminar |
| 60 | `social_5` | `drops.items` | `Recuerdo de Aventura` | `amistad` | `token_amistad` — tema social |
| 61 | `social_5` | `sideQuest.drops` | `Corona del Organizador` | `amistad` | eliminar — no hay item equivalente |
| 62 | `personal_1` | `drops.items` | `Fragmento de Historia` | `creacion` | `pagina_arcana` (Arcane Page) — tema conocimiento/creacion |
| 63 | `personal_1` | `sideQuest.drops` | `Pluma del Creador` | `creacion` | `tinta_magica` (Magic Ink) — tema creacion |
| 64 | `personal_1` | `sideQuest.drops` | `Capítulo Terminado` | `creacion` | eliminar — no hay item equivalente |
| 65 | `personal_2` | `drops.items` | `Carácter Antiguo` | `oriente` | `pagina_arcana` — tema conocimiento/oriente |
| 66 | `personal_2` | `drops.items` | `Jade Menor` | `oriente` | `cuentas_jade` (Jade Knots) — mismo material |
| 67 | `personal_2` | `sideQuest.drops` | `Pergamino de Sabiduría` | `oriente` | `pagina_arcana` o `tinta_magica` |
| 68 | `personal_3` | `drops.items` | `Página de Reflexión` | `mente` | `pagina_arcana` (Arcane Page) — mismo concepto |
| 69 | `personal_3` | `drops.items` | `Tinta de Pensamiento` | `mente` | `tinta_magica` (Magic Ink) — mismo concepto |
| 70 | `personal_3` | `sideQuest.drops` | `Claridad Mental` | `mente` | `rosario_concentracion` o eliminar |
| 71 | `personal_4` | `drops.items` | `Pergamino de Hechizo` | `conocimiento` | `skill_llamarada` o `pagina_arcana` — tema conocimiento |
| 72 | `personal_4` | `drops.items` | `Conocimiento Antiguo` | `conocimiento` | `grimorio_antiguo` (Ancient Grimoire) |
| 73 | `personal_4` | `sideQuest.drops` | `Grimorio Menor` | `conocimiento` | `grimorio_antiguo` o `pagina_arcana` |
| 74 | `personal_4` | `sideQuest.drops` | `Sabiduría Acumulada` | `conocimiento` | eliminar — no hay item equivalente |
| 75 | `personal_5` | `drops.items` | `Paz Interior` | `naturaleza` | `hierba_curativa` o `rosario_concentracion` |
| 76 | `personal_5` | `drops.items` | `Hoja de Calma` | `naturaleza` | `hierba_curativa` (Healing Herb) — tema naturaleza |
| 77 | `personal_5` | `sideQuest.drops` | `Reconexión Natural` | `naturaleza` | `corazon_bosque` (Heart of the Forest) |
| 78 | `personal_5` | `sideQuest.drops` | `Espíritu Libre` | `naturaleza` | `esencia_vida` (Essence of Life) o eliminar |
| 79 | `personal_6` | `drops.items` | `Visión del Futuro` | `destino` | `esencia_oscura` (Dark Essence) — tema destino |
| 80 | `personal_6` | `drops.items` | `Bendición del Oráculo` | `destino` | `dado_destino` (The Loaded Bone) — tema destino |
| 81 | `personal_6` | `sideQuest.drops` | `Fragmento de Destino` | `destino` | `esencia_oscura` o `fragmento_sueno` |
| 82 | `personal_6` | `sideQuest.drops` | `Profecía` | `destino` | eliminar — no hay item equivalente |

---

## Estado de `expansion_tasks.js`

Todos los drops de `expansion_tasks.js` ya usan IDs canónicos. Verificación manual:

| task id | drops.items | sideQuest.drops | estado |
|---|---|---|---|
| `casa_exp_01` | moneda_antigua, objeto_olvidado | llave_cofre | ✅ OK |
| `casa_exp_02` | fragmento_solar, pluma_viento | cristal_solar | ✅ OK |
| `casa_exp_03` | antidoto, frasco_vacio | pocion_vida_menor | ✅ OK |
| `cuerpo_exp_01` | caparazon, mapa_tesoro | amuleto_brisa | ✅ OK |
| `cuerpo_exp_02` | null | null | ✅ OK |
| `cuerpo_exp_03` | racion_combate, especia_rara | semilla_rara | ✅ OK |
| `gestiones_exp_01` | moneda_oro, pagina_arcana | contrato_mercantil | ✅ OK |
| `gestiones_exp_02` | cristal_solar, pagina_arcana | grimorio_antiguo | ✅ OK |
| `gestiones_exp_03` | moneda_oro, contrato_mercantil | sello_alianza | ✅ OK |
| `social_exp_01` | sello_alianza, pagina_arcana | sello_alianza | ✅ OK |
| `social_exp_02` | token_amistad, hidromiel | sello_alianza | ✅ OK |
| `personal_exp_01` | dado_destino, pagina_arcana | grimorio_antiguo | ✅ OK |
| `personal_exp_02` | talisman_oriental, cuentas_jade | pagina_arcana | ✅ OK |
| `personal_exp_03` | esencia_oscura, orbe_mental | esencia_oscura | ✅ OK |

---

## Estado de `items.js` DROP_TABLES

Todos los valores de DROP_TABLES son IDs canónicos. Verificación manual completa: ninguna referencia rota.

---

## Próximos pasos

1. **Aprobar filas FUZZY** (8 referencias) — confirmar o corregir los IDs propuestos.
2. **Decidir filas NONE** (82 referencias) — para cada una: eliminar, reemplazar por canónico, o crear item nuevo.
3. Una vez aprobadas las EXACT + FUZZY, ejecutar PASO 2 (reemplazos en código).
4. Ejecutar validador y verificar cero errores `TASK_DROP_DISPLAY_NAME`.
