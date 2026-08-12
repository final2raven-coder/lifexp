# DROP_MAPPING.md

> **Propósito:** inventario reproducible y exhaustivo de referencias de drop en `data_tasks.js`, `expansion_tasks.js` y `items.js` (`DROP_TABLES`).
> Regenerado: 2026-08-12 sobre `fix/dt13-dt02-drop-ids`, leyendo el código actual.
> Este documento no cambia contenido jugable ni aplica sustituciones.

---

## Método y alcance

- Se auditan todas las ocurrencias de `task.drops.items`, `task.sideQuest.drops` y las listas de `DROP_TABLES`.
- Cada expresión tiene la forma `valor actual -> ID propuesto (confianza)`. En este estado, los valores ya son IDs canónicos; por eso el valor actual y el propuesto coinciden y la confianza es `EXACT`.
- Las repeticiones se conservan y se marcan con `xN`; no se eliminan drops ni se alteran tasas o cantidades.
- No se hacen inferencias `FUZZY` y no se inventan sustituciones `NONE`.

## Resumen

| Superficie | Referencias | EXACT | FUZZY | NONE |
|---|---:|---:|---:|---:|
| `data_tasks.js` | 110 | 110 | 0 | 0 |
| `expansion_tasks.js` | 39 | 39 | 0 | 0 |
| `items.js` (`DROP_TABLES`) | 120 | 120 | 0 | 0 |
| **Total** | **269** | **269** | **0** | **0** |

- `items.js`: **87** ejecutables en el catálogo base.
- `expansion_items.js`: **88** IDs detectables textualmente, pero el validador no puede cargar el fichero por un error de sintaxis independiente.

## Inventario — `data_tasks.js`

| task id | field | current value -> proposed ID (confidence) |
|---|---|---|
| `casa_1` | `drops.items` | `pocion_agua_menor` -> `pocion_agua_menor` (EXACT); `veneno_basico` -> `veneno_basico` (EXACT); `frasco_vacio` -> `frasco_vacio` (EXACT) |
| `casa_1` | `sideQuest.drops` | `esencia_purificadora` -> `esencia_purificadora` (EXACT); `cristal_limpieza` -> `cristal_limpieza` (EXACT) |
| `casa_2` | `drops.items` | `moneda_antigua` -> `moneda_antigua` (EXACT); `objeto_olvidado` -> `objeto_olvidado` (EXACT) |
| `casa_2` | `sideQuest.drops` | `bolsa_oro_grande` -> `bolsa_oro_grande` (EXACT) |
| `casa_3` | `drops.items` | `gota_agua_pura` -> `gota_agua_pura` (EXACT) |
| `casa_3` | `sideQuest.drops` | `esencia_limpieza` -> `esencia_limpieza` (EXACT) |
| `casa_4` | `drops.items` | `grasa_fuego` -> `grasa_fuego` (EXACT); `espatula_encantada` -> `espatula_encantada` (EXACT) |
| `casa_4` | `sideQuest.drops` | `llama_culinaria` -> `llama_culinaria` (EXACT) |
| `casa_6` | `drops.items` | `fragmento_solar` -> `fragmento_solar` (EXACT); `pluma_viento` -> `pluma_viento` (EXACT) |
| `casa_6` | `sideQuest.drops` | `brisa_atrapada` -> `brisa_atrapada` (EXACT) |
| `casa_8` | `drops.items` | `pluma_sueno` -> `pluma_sueno` (EXACT); `esencia_descanso` -> `esencia_descanso` (EXACT) |
| `casa_8` | `sideQuest.drops` | `bendicion_descanso` -> `bendicion_descanso` (EXACT) |
| `casa_9` | `drops.items` | `prenda_olvidada` -> `prenda_olvidada` (EXACT); `moneda_antigua` -> `moneda_antigua` (EXACT) |
| `casa_9` | `sideQuest.drops` | `amuleto_explorador` -> `amuleto_explorador` (EXACT) |
| `casa_10` | `drops.items` | `cristal_solar` -> `cristal_solar` (EXACT); `pluma_viento` -> `pluma_viento` (EXACT) |
| `casa_10` | `sideQuest.drops` | `luz_atrapada` -> `luz_atrapada` (EXACT) |
| `casa_11` | `drops.items` | `racion_serena` -> `racion_serena` (EXACT); `gema_fuego_menor` -> `gema_fuego_menor` (EXACT); `receta_secreta` -> `receta_secreta` (EXACT) |
| `casa_11` | `sideQuest.drops` | `receta_secreta` -> `receta_secreta` (EXACT); `racion_serena` -> `racion_serena` (EXACT) |
| `casa_12` | `drops.items` | `bolsa_oro_grande` -> `bolsa_oro_grande` (EXACT); `ingrediente_especial` -> `ingrediente_especial` (EXACT) |
| `casa_12` | `sideQuest.drops` | `ojo_comerciante` -> `ojo_comerciante` (EXACT) |
| `casa_13` | `drops.items` | `polvo_sueno` -> `polvo_sueno` (EXACT) |
| `casa_13` | `sideQuest.drops` | `cristal_tranquilidad` -> `cristal_tranquilidad` (EXACT) |
| `casa_14` | `drops.items` | `hoja_calma` -> `hoja_calma` (EXACT); `rocio_matutino` -> `rocio_matutino` (EXACT x2) |
| `casa_14` | `sideQuest.drops` | `espiritu_jardin` -> `espiritu_jardin` (EXACT); `flor_luminosa` -> `flor_luminosa` (EXACT) |
| `casa_15` | `drops.items` | `escarcha_eterna` -> `escarcha_eterna` (EXACT x2) |
| `casa_15` | `sideQuest.drops` | `cristal_hielo_puro` -> `cristal_hielo_puro` (EXACT) |
| `cuerpo_3` | `drops.items` | `mapa_zona` -> `mapa_zona` (EXACT); `piedra_camino` -> `piedra_camino` (EXACT); `bolsa_oro_grande` -> `bolsa_oro_grande` (EXACT) |
| `cuerpo_3` | `sideQuest.drops` | `botas_sendero` -> `botas_sendero` (EXACT); `amuleto_explorador` -> `amuleto_explorador` (EXACT) |
| `cuerpo_5` | `drops.items` | `orbe_claridad` -> `orbe_claridad` (EXACT); `incienso_mistico` -> `incienso_mistico` (EXACT) |
| `cuerpo_5` | `sideQuest.drops` | `foco_interior` -> `foco_interior` (EXACT); `mente_cristal` -> `mente_cristal` (EXACT) |
| `cuerpo_6` | `drops.items` | `coral_magico` -> `coral_magico` (EXACT x2); `escama_brillante` -> `escama_brillante` (EXACT) |
| `cuerpo_6` | `sideQuest.drops` | `tridente_menor` -> `tridente_menor` (EXACT); `bendicion_mar` -> `bendicion_mar` (EXACT) |
| `gestiones_1` | `drops.items` | `bolsa_oro_grande` -> `bolsa_oro_grande` (EXACT); `lingote_oro` -> `lingote_oro` (EXACT) |
| `gestiones_1` | `sideQuest.drops` | `sabiduria_fiscal` -> `sabiduria_fiscal` (EXACT); `corona_contribuyente` -> `corona_contribuyente` (EXACT) |
| `gestiones_2` | `drops.items` | `bolsa_oro_grande` -> `bolsa_oro_grande` (EXACT); `gema_menor` -> `gema_menor` (EXACT) |
| `gestiones_2` | `sideQuest.drops` | `ojo_comerciante` -> `ojo_comerciante` (EXACT) |
| `gestiones_3` | `drops.items` | `cristal_memoria` -> `cristal_memoria` (EXACT); `pergamino_blanco` -> `pergamino_blanco` (EXACT) |
| `gestiones_3` | `sideQuest.drops` | `biblioteca_personal` -> `biblioteca_personal` (EXACT) |
| `gestiones_4` | `drops.items` | `mensaje_importante` -> `mensaje_importante` (EXACT); `llave_olvidada` -> `llave_olvidada` (EXACT) |
| `gestiones_4` | `sideQuest.drops` | `sello_eficiencia` -> `sello_eficiencia` (EXACT) |
| `gestiones_5` | `drops.items` | `pergamino_planificacion` -> `pergamino_planificacion` (EXACT) |
| `gestiones_5` | `sideQuest.drops` | `agenda_encantada` -> `agenda_encantada` (EXACT) |
| `social_1` | `drops.items` | `recuerdo_especial` -> `recuerdo_especial` (EXACT); `lazo_conexion` -> `lazo_conexion` (EXACT) |
| `social_1` | `sideQuest.drops` | `anillo_vinculo` -> `anillo_vinculo` (EXACT); `flor_eterna` -> `flor_eterna` (EXACT) |
| `social_2` | `drops.items` | `token_amistad` -> `token_amistad` (EXACT) |
| `social_2` | `sideQuest.drops` | `sello_hermandad` -> `sello_hermandad` (EXACT) |
| `social_3` | `drops.items` | `token_amistad` -> `token_amistad` (EXACT) |
| `social_3` | `sideQuest.drops` | `sello_hermandad` -> `sello_hermandad` (EXACT) |
| `social_4` | `drops.items` | `bendicion_familiar` -> `bendicion_familiar` (EXACT) |
| `social_4` | `sideQuest.drops` | `lazo_sangre` -> `lazo_sangre` (EXACT) |
| `social_5` | `drops.items` | `recuerdo_aventura` -> `recuerdo_aventura` (EXACT); `hidromiel_camaraderia` -> `hidromiel_camaraderia` (EXACT) |
| `social_5` | `sideQuest.drops` | `corona_organizador` -> `corona_organizador` (EXACT) |
| `personal_1` | `drops.items` | `dado_destino` -> `dado_destino` (EXACT); `tinta_magica` -> `tinta_magica` (EXACT); `fragmento_historia` -> `fragmento_historia` (EXACT) |
| `personal_1` | `sideQuest.drops` | `pluma_creador` -> `pluma_creador` (EXACT); `capitulo_terminado` -> `capitulo_terminado` (EXACT) |
| `personal_2` | `drops.items` | `caracter_antiguo` -> `caracter_antiguo` (EXACT); `talisman_oriental_early` -> `talisman_oriental_early` (EXACT); `jade_menor` -> `jade_menor` (EXACT) |
| `personal_2` | `sideQuest.drops` | `escama_brillante` -> `escama_brillante` (EXACT); `pergamino_sabiduria` -> `pergamino_sabiduria` (EXACT) |
| `personal_3` | `drops.items` | `pagina_reflexion` -> `pagina_reflexion` (EXACT); `tinta_pensamiento` -> `tinta_pensamiento` (EXACT) |
| `personal_3` | `sideQuest.drops` | `claridad_mental` -> `claridad_mental` (EXACT) |
| `personal_4` | `drops.items` | `pergamino_hechizo` -> `pergamino_hechizo` (EXACT); `conocimiento_antiguo` -> `conocimiento_antiguo` (EXACT) |
| `personal_4` | `sideQuest.drops` | `grimorio_menor` -> `grimorio_menor` (EXACT); `sabiduria_acumulada` -> `sabiduria_acumulada` (EXACT) |
| `personal_5` | `drops.items` | `paz_interior` -> `paz_interior` (EXACT); `hoja_calma` -> `hoja_calma` (EXACT) |
| `personal_5` | `sideQuest.drops` | `reconexion_natural` -> `reconexion_natural` (EXACT); `espiritu_libre` -> `espiritu_libre` (EXACT) |
| `personal_6` | `drops.items` | `vision_futuro` -> `vision_futuro` (EXACT); `bendicion_oraculo` -> `bendicion_oraculo` (EXACT) |
| `personal_6` | `sideQuest.drops` | `fragmento_destino` -> `fragmento_destino` (EXACT); `profecia` -> `profecia` (EXACT) |

## Inventario — `expansion_tasks.js`

| task id | field | current value -> proposed ID (confidence) |
|---|---|---|
| `casa_exp_01` | `drops.items` | `moneda_antigua` -> `moneda_antigua` (EXACT); `objeto_olvidado` -> `objeto_olvidado` (EXACT) |
| `casa_exp_01` | `sideQuest.drops` | `llave_cofre` -> `llave_cofre` (EXACT) |
| `casa_exp_02` | `drops.items` | `fragmento_solar` -> `fragmento_solar` (EXACT); `pluma_viento` -> `pluma_viento` (EXACT) |
| `casa_exp_02` | `sideQuest.drops` | `cristal_solar` -> `cristal_solar` (EXACT) |
| `casa_exp_03` | `drops.items` | `antidoto` -> `antidoto` (EXACT); `frasco_vacio` -> `frasco_vacio` (EXACT) |
| `casa_exp_03` | `sideQuest.drops` | `pocion_vida_menor` -> `pocion_vida_menor` (EXACT) |
| `cuerpo_exp_01` | `drops.items` | `caparazon` -> `caparazon` (EXACT); `mapa_tesoro` -> `mapa_tesoro` (EXACT) |
| `cuerpo_exp_01` | `sideQuest.drops` | `amuleto_brisa` -> `amuleto_brisa` (EXACT) |
| `cuerpo_exp_03` | `drops.items` | `racion_combate` -> `racion_combate` (EXACT); `especia_rara` -> `especia_rara` (EXACT) |
| `cuerpo_exp_03` | `sideQuest.drops` | `semilla_rara` -> `semilla_rara` (EXACT) |
| `gestiones_exp_01` | `drops.items` | `moneda_oro` -> `moneda_oro` (EXACT); `pagina_arcana` -> `pagina_arcana` (EXACT) |
| `gestiones_exp_01` | `sideQuest.drops` | `contrato_mercantil` -> `contrato_mercantil` (EXACT) |
| `gestiones_exp_02` | `drops.items` | `cristal_solar` -> `cristal_solar` (EXACT); `pagina_arcana` -> `pagina_arcana` (EXACT) |
| `gestiones_exp_02` | `sideQuest.drops` | `grimorio_antiguo` -> `grimorio_antiguo` (EXACT) |
| `gestiones_exp_03` | `drops.items` | `moneda_oro` -> `moneda_oro` (EXACT); `contrato_mercantil` -> `contrato_mercantil` (EXACT) |
| `gestiones_exp_03` | `sideQuest.drops` | `sello_alianza` -> `sello_alianza` (EXACT) |
| `social_exp_01` | `drops.items` | `sello_alianza` -> `sello_alianza` (EXACT); `pagina_arcana` -> `pagina_arcana` (EXACT) |
| `social_exp_01` | `sideQuest.drops` | `sello_alianza` -> `sello_alianza` (EXACT) |
| `social_exp_02` | `drops.items` | `token_amistad` -> `token_amistad` (EXACT); `hidromiel` -> `hidromiel` (EXACT) |
| `social_exp_02` | `sideQuest.drops` | `sello_alianza` -> `sello_alianza` (EXACT) |
| `personal_exp_01` | `drops.items` | `dado_destino` -> `dado_destino` (EXACT); `pagina_arcana` -> `pagina_arcana` (EXACT) |
| `personal_exp_01` | `sideQuest.drops` | `grimorio_antiguo` -> `grimorio_antiguo` (EXACT) |
| `personal_exp_02` | `drops.items` | `talisman_oriental` -> `talisman_oriental` (EXACT); `cuentas_jade` -> `cuentas_jade` (EXACT) |
| `personal_exp_02` | `sideQuest.drops` | `pagina_arcana` -> `pagina_arcana` (EXACT) |
| `personal_exp_03` | `drops.items` | `esencia_oscura` -> `esencia_oscura` (EXACT); `orbe_mental` -> `orbe_mental` (EXACT) |
| `personal_exp_03` | `sideQuest.drops` | `esencia_oscura` -> `esencia_oscura` (EXACT) |

## Inventario — `items.js` (`DROP_TABLES`)

| theme | current values -> proposed IDs (confidence) |
|---|---|
| `hallazgos` | `moneda_antigua` -> `moneda_antigua` (EXACT); `moneda_oro` -> `moneda_oro` (EXACT); `llave_cofre` -> `llave_cofre` (EXACT); `amuleto_espacio` -> `amuleto_espacio` (EXACT); `objeto_olvidado` -> `objeto_olvidado` (EXACT); `seda_arana` -> `seda_arana` (EXACT); `cola_rata` -> `cola_rata` (EXACT); `esencia_espectral` -> `esencia_espectral` (EXACT); `mapa_tesoro` -> `mapa_tesoro` (EXACT) |
| `exploracion` | `botas_viajero` -> `botas_viajero` (EXACT); `daga_oxidada` -> `daga_oxidada` (EXACT); `caparazon` -> `caparazon` (EXACT); `mapa_tesoro` -> `mapa_tesoro` (EXACT); `pluma_grifo` -> `pluma_grifo` (EXACT); `token_amistad` -> `token_amistad` (EXACT) |
| `naturaleza` | `hierba_curativa` -> `hierba_curativa` (EXACT); `antidoto` -> `antidoto` (EXACT); `arco_espino` -> `arco_espino` (EXACT); `semilla_rara` -> `semilla_rara` (EXACT); `corazon_bosque` -> `corazon_bosque` (EXACT); `esencia_vida` -> `esencia_vida` (EXACT); `amuleto_bosque` -> `amuleto_bosque` (EXACT); `colmillo_hielo` -> `colmillo_hielo` (EXACT) |
| `fuego` | `gema_fuego` -> `gema_fuego` (EXACT); `skill_llamarada` -> `skill_llamarada` (EXACT); `cuchilla_llameante` -> `cuchilla_llameante` (EXACT); `corazon_fuego` -> `corazon_fuego` (EXACT); `escama_fuego` -> `escama_fuego` (EXACT) |
| `fuego_comida` | `racion_combate` -> `racion_combate` (EXACT); `gema_fuego` -> `gema_fuego` (EXACT); `especia_rara` -> `especia_rara` (EXACT); `elixir_vitalidad` -> `elixir_vitalidad` (EXACT); `cuchilla_llameante` -> `cuchilla_llameante` (EXACT); `semilla_rara` -> `semilla_rara` (EXACT); `sake_demonio` -> `sake_demonio` (EXACT) |
| `agua_quimicos` | `pocion_agua` -> `pocion_agua` (EXACT); `veneno_basico` -> `veneno_basico` (EXACT); `frasco_vacio` -> `frasco_vacio` (EXACT); `daga_corrosiva` -> `daga_corrosiva` (EXACT); `escudo_antiveneno` -> `escudo_antiveneno` (EXACT); `antidoto` -> `antidoto` (EXACT); `esencia_agua` -> `esencia_agua` (EXACT); `escama_fuego` -> `escama_fuego` (EXACT); `pocion_agua_menor` -> `pocion_agua_menor` (EXACT); `seda_arana` -> `seda_arana` (EXACT); `cola_rata` -> `cola_rata` (EXACT) |
| `agua_profunda` | `perla_marina` -> `perla_marina` (EXACT); `tridente_marino` -> `tridente_marino` (EXACT); `escamas_sirena` -> `escamas_sirena` (EXACT); `pocion_respiracion` -> `pocion_respiracion` (EXACT); `escama_marina` -> `escama_marina` (EXACT); `tentaculo_kraken` -> `tentaculo_kraken` (EXACT); `esencia_oscura` -> `esencia_oscura` (EXACT); `caparazon` -> `caparazon` (EXACT) |
| `hielo` | `fragmento_hielo` -> `fragmento_hielo` (EXACT); `pocion_escarcha` -> `pocion_escarcha` (EXACT); `hoja_gelida` -> `hoja_gelida` (EXACT); `armadura_invierno` -> `armadura_invierno` (EXACT); `skill_rayo_hielo` -> `skill_rayo_hielo` (EXACT); `colmillo_hielo` -> `colmillo_hielo` (EXACT) |
| `sol_viento` | `fragmento_solar` -> `fragmento_solar` (EXACT); `pluma_viento` -> `pluma_viento` (EXACT); `amuleto_brisa` -> `amuleto_brisa` (EXACT); `capa_ligera` -> `capa_ligera` (EXACT); `espada_radiante` -> `espada_radiante` (EXACT); `capa_alba` -> `capa_alba` (EXACT); `cristal_solar` -> `cristal_solar` (EXACT); `pluma_grifo` -> `pluma_grifo` (EXACT) |
| `luz` | `fragmento_solar` -> `fragmento_solar` (EXACT); `cristal_solar` -> `cristal_solar` (EXACT); `espada_radiante` -> `espada_radiante` (EXACT); `capa_alba` -> `capa_alba` (EXACT) |
| `mente` | `rosario_concentracion` -> `rosario_concentracion` (EXACT); `orbe_mental` -> `orbe_mental` (EXACT); `skill_foco_interior` -> `skill_foco_interior` (EXACT); `fragmento_sueno` -> `fragmento_sueno` (EXACT); `esencia_oscura` -> `esencia_oscura` (EXACT); `pagina_arcana` -> `pagina_arcana` (EXACT) |
| `conocimiento` | `grimorio_arcano` -> `grimorio_arcano` (EXACT); `grimorio_antiguo` -> `grimorio_antiguo` (EXACT); `pagina_arcana` -> `pagina_arcana` (EXACT); `tinta_magica` -> `tinta_magica` (EXACT); `filacteria` -> `filacteria` (EXACT); `contrato_sospechoso` -> `contrato_sospechoso` (EXACT) |
| `oriente` | `cuentas_jade` -> `cuentas_jade` (EXACT); `talisman_oriental` -> `talisman_oriental` (EXACT); `katana_oriental` -> `katana_oriental` (EXACT); `escama_dragon` -> `escama_dragon` (EXACT); `cola_kitsune` -> `cola_kitsune` (EXACT); `cuerno_oni` -> `cuerno_oni` (EXACT); `sake_demonio` -> `sake_demonio` (EXACT); `tinta_magica` -> `tinta_magica` (EXACT); `pagina_arcana` -> `pagina_arcana` (EXACT) |
| `social` | `sello_alianza` -> `sello_alianza` (EXACT); `hidromiel` -> `hidromiel` (EXACT); `token_amistad` -> `token_amistad` (EXACT) |
| `alianzas` | `sello_alianza` -> `sello_alianza` (EXACT); `token_amistad` -> `token_amistad` (EXACT); `contrato_sospechoso` -> `contrato_sospechoso` (EXACT); `daga_asesino` -> `daga_asesino` (EXACT); `capa_sombras` -> `capa_sombras` (EXACT); `veneno_letal` -> `veneno_letal` (EXACT) |
| `comercio` | `moneda_oro` -> `moneda_oro` (EXACT); `llave_cofre` -> `llave_cofre` (EXACT); `contrato_mercantil` -> `contrato_mercantil` (EXACT); `contrato_sospechoso` -> `contrato_sospechoso` (EXACT) |
| `destino` | `dado_destino` -> `dado_destino` (EXACT); `fragmento_hielo` -> `fragmento_hielo` (EXACT); `esencia_oscura` -> `esencia_oscura` (EXACT); `fragmento_sueno` -> `fragmento_sueno` (EXACT) |
| `creacion` | `dado_destino` -> `dado_destino` (EXACT); `tinta_magica` -> `tinta_magica` (EXACT) |
| `refugio` | `moneda_antigua` -> `moneda_antigua` (EXACT); `objeto_olvidado` -> `objeto_olvidado` (EXACT) |
| `descanso` | `hierba_curativa` -> `hierba_curativa` (EXACT); `pocion_agua` -> `pocion_agua` (EXACT); `pocion_agua_menor` -> `pocion_agua_menor` (EXACT) |
| `oro_comercio` | `moneda_oro` -> `moneda_oro` (EXACT); `contrato_mercantil` -> `contrato_mercantil` (EXACT); `token_amistad` -> `token_amistad` (EXACT) |

## Bloqueo técnico independiente

La ejecución actual de `node validate_content.js` carga 87 items base, 37 enemigos, 15 quests, 102 clases y 55 tareas, pero termina con 116 errores porque `expansion_items.js` falla al parsearse con `Unexpected identifier 's'`. Las referencias que dependen de ese catálogo aparecen como `BROKEN_ITEM_REF` mientras no cargue la expansión; no se renombran por ese motivo.

La reparación de sintaxis de `expansion_items.js` queda fuera de este inventario y debe hacerse en una tarea técnica separada, con validación antes y después.

## Verificación reproducible

```text
node validate_content.js
```
