# CONTENT_AUDIT_GM.md
# FICHERO PARA EL GAME MASTER - CONTIENE SPOILERS. NO LEER SI ERES EL JUGADOR.

Generado: 2026-07-31 - Auditoria de contenido post-saneamiento.

---

## 1. Inventario completo de contenido

### Items (98 total)

Base items.js (87):
- Armas (10): daga_corrosiva, cuchilla_llameante (Ashbrand), espada_radiante, hoja_gelida, arco_espino, tridente_marino, katana_oriental, baculo_liche, daga_oxidada, daga_asesino
- Armaduras (7): escudo_antiveneno, armadura_invierno, capa_alba, capa_ligera, escamas_sirena, botas_viajero, capa_sombras
- Accesorios (9): amuleto_brisa, cristal_solar, perla_marina, rosario_concentracion, cuentas_jade, sello_alianza, amuleto_espacio, amuleto_bosque, escoba_encantada
- Artefactos (4): orbe_mental, dado_destino, escama_dragon, grimorio_arcano
- Consumibles (14): pocion_agua, pocion_escarcha, racion_combate, elixir_vitalidad, hierba_curativa, antidoto, veneno_basico, pocion_respiracion, hidromiel, pocion_agua_menor, pocion_vida_menor, pocion_fuerza, sake_demonio, veneno_letal
- Materiales (36): moneda_antigua, moneda_oro, gema_fuego, fragmento_hielo, fragmento_solar, pluma_viento, especia_rara, frasco_vacio, talisman_oriental, nucleo_slime, piel_lobo, colmillo_alfa, cola_rata, seda_araña, objeto_olvidado, esencia_espectral, corazon_bosque, esencia_vida, semilla_rara, colmillo_hielo, corazon_fuego, escama_fuego, esencia_agua, escama_marina, tentaculo_kraken, esencia_oscura, fragmento_sueno, pagina_arcana, tinta_magica, grimorio_antiguo, filacteria, cola_kitsune, cuerno_oni, caparazon, pluma_grifo, token_amistad
- Skills (3): skill_foco_interior, skill_llamarada, skill_rayo_hielo
- Keys/Quest (4): llave_cofre, contrato_mercantil, mapa_tesoro, contrato_sospechoso

Expansion items (11):
escudo_cotidiano, botas_sendero, anillo_constancia, broche_vinculo, mapa_rutas_cercanas, racion_serena, sello_preparacion, claridad_practica, talisman_oriental_early, fragmento_historia, sello_eficiencia

---

### Enemigos (37 total)

Base enemies.js (30):
- Comunes (13): rata_gigante (L1), arana_domestica (L2), slime_acido (L3), planta_carnivora (L3), salamandra (L4), halcon_viento (L4), lobo_escarcha (L5), bandido (L5), mercader_corrupto (L5), cangrejo_gigante (L6), libro_maldito (L6), pesadilla (L7), oni (L8)
- Elites (11): poltergeist (L8), elemental_agua (L12), capitan_bandidos (L12), elemental_hielo (L14), golem_horno (L15), serpiente_marina (L16), treant (L18), devorador_suenos (L18), grifo (L20), kitsune (L20), asesino_gremio (L22)
- Bosses (6): espiritu_bosque (L25), lobo_alfa (L15), kraken_menor (L30), espejo_oscuro (L30), liche (L35), dragon_oriental (L40)

Expansion enemies (7):
- Comunes (4): eco_inquieto (L1), duende_del_desorden (L2), cobrador_de_niebla (L3), imitador_social (L4)
- Elites (2): guardia_del_umbral (L8), buho_de_las_dudas (L10)
- Boss (1): guardian_del_hilo (L15)

---

### Quests (15 total)

Base quests.js (10):
- Dailies (3): daily_any_3, daily_casa_2, daily_cuerpo_2
- Simples (3): quest_first_steps, quest_home_master, quest_body_temple
- Bounties (2): bounty_slimes (vs slime_acido), bounty_bandits (vs bandido)
- Story (1): story_wolf_hills - 4 capitulos, boss lobo_alfa L15
- Class quest (1): class_warrior_berserker - minLevel 30, req classId 'guerrero', boss espejo_oscuro

Expansion quests (5):
- Daily (1): daily_routine_4
- Compuestas (2): quest_first_week (casa+cuerpo+personal), quest_clear_path (gestiones+cuerpo)
- Bounty (1): bounty_threshold (vs guardia_del_umbral x2)
- Story (1): story_first_thread - 3 capitulos, boss guardian_del_hilo L15

---

### Tareas (~63 total estimado)

Base DEFAULT_TASKS (~49): distribuidas en 5 categorias. Frecuencias: daily, weekly, biweekly, monthly, quarterly, biannual, annual.

Expansion tasks (14):
- Casa (3): casa_exp_01 (ordenar despensa, monthly), casa_exp_02 (limpiar ventanas, monthly), casa_exp_03 (revisar botiquin, quarterly)
- Cuerpo (3): cuerpo_exp_01 (paseo recuperacion, weekly), cuerpo_exp_02 (movilidad articular, weekly), cuerpo_exp_03 (comida equilibrada, weekly)
- Gestiones (3): gestiones_exp_01 (revisar gastos, weekly), gestiones_exp_02 (ordenar carpeta digital, monthly), gestiones_exp_03 (revisar renovaciones, monthly)
- Social (2): social_exp_01 (proponer plan concreto, monthly), social_exp_02 (conversacion de calidad, weekly)
- Personal (3): personal_exp_01 (bloque proyecto 45min, weekly), personal_exp_02 (practica chino, weekly), personal_exp_03 (revision mensual objetivos, monthly)

---

### Clases (6 base, 4 tiers)

- Guerrero -> Berserker (T2) -> Campeon (T3) -> Paladin (T4)
- Arquero -> Cazador (T2) -> Explorador (T3) -> Maestro del Arco (T4)
- Mago -> Hechicero (T2) -> Archimago (T3) -> Maestro Arcano (T4)
- Clerigo -> Sanador (T2) -> Sacerdote (T3) -> Sumo Sacerdote (T4)
- Picaro -> Asesino (T2) -> Maestro Ladron (T3) -> Sombra (T4)
- Monje -> Asceta (T2) -> Maestro Zen (T3) -> Iluminado (T4)

---

## 2. Referencias rotas detectadas

### CRITICO - expansion_tasks.js: drops con nombres de display en lugar de IDs

Todas las tareas de expansion_tasks.js usan nombres de display (strings con mayusculas y espacios) en los campos drops.items[] y sideQuest.drops[], en lugar de IDs canonicos. Ademas, muchos de esos nombres apuntan a items que no existen en ITEMS.

Detalle por tarea:

casa_exp_01: drops.items=['Moneda Antigua','Objeto Olvidado'] (nombres, no IDs); sideQuest.drops=['Llave Olvidada'] (ID inexistente)
casa_exp_02: drops.items=['Fragmento Solar','Pluma del Viento'] (nombres); sideQuest.drops=['Luz Atrapada'] (inexistente)
casa_exp_03: drops.items=['Antidoto','Frasco Vacio'] (nombres); sideQuest.drops=['Sello de Preparacion'] (nombre)
cuerpo_exp_01: drops.items=['Piedra del Camino','Mapa de Zona'] (inexistentes); sideQuest.drops=['Brisa Atrapada'] (inexistente)
cuerpo_exp_02: null (OK)
cuerpo_exp_03: drops.items=['Racion de Combate','Especia Rara'] (nombres); sideQuest.drops=['Receta Secreta'] (inexistente)
gestiones_exp_01: drops.items=['Moneda de Oro','Pergamino de Planificacion'] (nombre/inexistente); sideQuest.drops=['Ojo del Comerciante'] (inexistente)
gestiones_exp_02: drops.items=['Cristal de Memoria','Pergamino en Blanco'] (inexistentes); sideQuest.drops=['Biblioteca Personal'] (inexistente)
gestiones_exp_03: drops.items=['Moneda de Oro','Contrato Mercantil'] (nombres); sideQuest.drops=['Sello de Eficiencia'] (nombre)
social_exp_01: drops.items=['Sello de Alianza','Pergamino de Persuasion'] (nombre/inexistente); sideQuest.drops=['Corona del Organizador'] (inexistente)
social_exp_02: drops.items=['Token de Amistad','Hidromiel'] (nombres); sideQuest.drops=['Sello de Hermandad'] (inexistente)
personal_exp_01: drops.items=['Dado del Destino','Fragmento de Historia'] (nombres); sideQuest.drops=['Capitulo Terminado'] (inexistente)
personal_exp_02: drops.items=['Talisman Oriental','Jade Menor'] (nombre/inexistente); sideQuest.drops=['Pergamino de Sabiduria'] (inexistente)
personal_exp_03: drops.items=['Vision del Futuro','Bendicion del Oraculo'] (inexistentes); sideQuest.drops=['Fragmento de Destino'] (inexistente)

Impacto: El motor de drops (rollDropFromTheme) usa drops.theme para buscar en DROP_TABLES, no drops.items[]. El campo items[] parece ser informativo/legacy. El sideQuest.drops[] si puede ser usado por rollSideQuestDrop. Riesgo: drops de side quests silenciosamente vacios o errores en runtime.

### CRITICO - THEME_ENEMIES con IDs fantasma

En enemies.js, THEME_ENEMIES referencia 3 IDs que no existen en ENEMIES:
- destino: 'mote_del_umbral', 'custodio_del_umbral'
- refugio: 'vigia_del_refugio'
- creacion: 'custodio_del_umbral'

Impacto: getThemeEnemies('destino') devuelve array vacio. Las tareas con theme 'destino', 'refugio' o 'creacion' nunca generan encuentros. Silencioso pero real.

### MENOR - story_wolf_hills boss drops

El boss lobo_alfa definido inline en el capitulo 4 tiene:
drops: [{ itemId: 'capa_lobo', chance: 0.4 }, ...]
'capa_lobo' no existe en ITEMS. El drop falla silenciosamente.

### MENOR - DT-11 resuelta pero no marcada en el mapa

update2_content.js resolvio DT-11 (elimino window.LifeXPUpdate2), pero PROJECT_MAP.md sigue marcandola como pendiente.

---

## 3. Contenido huerfano (sin conexion)

Enemigos sin quest que los referencie (31 de 37):
poltergeist, elemental_agua, golem_horno, treant, espiritu_bosque, elemental_hielo, grifo, capitan_bandidos, serpiente_marina, kraken_menor, devorador_suenos, oni, kitsune, dragon_oriental, libro_maldito, liche, mercader_corrupto, asesino_gremio, espejo_oscuro (solo class_quest), eco_inquieto, duende_del_desorden, cobrador_de_niebla, imitador_social, buho_de_las_dudas, halcon_viento, planta_carnivora, cangrejo_gigante, pesadilla, elemental_hielo, arana_domestica, rata_gigante

Solo 6 de 37 enemigos estan referenciados en quests: slime_acido, bandido, lobo_escarcha, lobo_alfa, guardia_del_umbral, guardian_del_hilo.

Porcentaje de contenido conectado (estimado):
- Quests con enemigo referenciado: 5/15 = 33%
- Items con quest que los recompensa: ~15/98 = 15%
- Enemigos referenciados en quests: 6/37 = 16%
- Tareas con drops funcionales (theme valido): ~40/63 = 63%
- Contenido huerfano (sin conexion narrativa): ~70-75%

---

## 4. Balance de recompensas

XP por quest:
- Dailies: 40-75 XP/dia (razonable para nivel 1-5)
- Simples: 150-180 XP (bien calibradas para nivel 3-5)
- Compuestas: 180-220 XP (correctas)
- Bounties: 120-240 XP (bien)
- Story arcs: story_wolf_hills 330 XP total, story_first_thread 610 XP total
- Class quest: 500 XP (nivel 30, correcto)

Desequilibrios:
- story_first_thread (minLevel 3) da mas XP que story_wolf_hills (minLevel 10). Invertido.
- Solo 1 class quest, solo para Guerrero. Las otras 5 clases no tienen momento de identidad.
- Tramo 21-30: solo 4 enemigos, 0 quests nuevas.
- Tramo 31+: solo 2 enemigos, 0 quests.

Items dominantes: escamas_sirena (epic armor, muy accesible), dado_destino (passive reroll muy valioso).
Items infrautilizados: daga_oxidada (fue+1 solo), amuleto_brisa (des+2 solo).

---

## 5. Cobertura por nivel

Tramo 1-3: 9 comunes, 8 quests disponibles - BIEN CUBIERTO
Tramo 4-7: 7 enemigos, 2 bounties - RAZONABLE
Tramo 8-12: 5 enemigos, 3 quests (home_master, body_temple, bounty_bandits) - ESCASO
Tramo 13-18: 5 enemigos, 1 story arc - SOLO 1 OPCION
Tramo 19-25: 4 enemigos, 0 quests nuevas - DESIERTO
Tramo 26-35: 3 bosses, 1 class quest (solo guerrero) - CASI VACIO
Tramo 36+: 1 boss, 0 quests - VACIO TOTAL

---

## 6. Riesgo de fatiga por zona

1. Nivel 8-12: solo story_wolf_hills como contenido nuevo. Sin alternativa si no interesa ese arco.
2. Nivel 19-25: zona completamente vacia de quests. Alta probabilidad de abandono.
3. Categoria social: 2 quests, 2 tareas de expansion, 0 story arcs. La mas desatendida.
4. Clases 2-6: sin class quests. Sin momento de identidad de clase para 5 de 6 clases.
5. Dailies: mecanicamente identicas (completa N tareas de categoria X). Sin variacion narrativa.
