// LifeXP Expansion 1 - Early encounters and mid-journey threats
// Integration: load after enemies.js and items.js.
// Internal IDs remain Spanish snake_case for save compatibility and naming consistency.
// Player-facing names and skill text are English.

const EXPANSION_ENEMIES_V1 = {
  eco_inquieto: {
    id: 'eco_inquieto', name: 'Restless Echo', icon: '\ud83e\udee7', type: 'common', level: 1,
    hp: 32, fue: 4, vit: 4, des: 9, int: 7, vol: 8, pre: 2, xp: 18, gold: 6,
    skills: [{ id: 'susurro', name: 'Whisper', type: 'attack', power: 9, damageType: 'magical' }],
    drops: [{ itemId: 'fragmento_historia', chance: 0.25 }],
    themes: ['mente', 'destino']
  },

  duende_del_desorden: {
    id: 'duende_del_desorden', name: 'Disorder Goblin', icon: '\ud83e\uddf9', type: 'common', level: 2,
    hp: 42, fue: 8, vit: 6, des: 9, int: 4, vol: 5, pre: 3, xp: 22, gold: 8,
    skills: [{ id: 'trasto', name: 'Throw Junk', type: 'attack', power: 11 }],
    drops: [
      { itemId: 'sello_preparacion', chance: 0.18 },
      { itemId: 'moneda_antigua', chance: 0.3 }
    ],
    themes: ['casa', 'hallazgos']
  },

  cobrador_de_niebla: {
    id: 'cobrador_de_niebla', name: 'Fog Collector', icon: '\ud83d\udce8', type: 'common', level: 3,
    hp: 48, fue: 7, vit: 7, des: 10, int: 10, vol: 7, pre: 8, xp: 26, gold: 12,
    skills: [{ id: 'recordatorio', name: 'Unwelcome Reminder', type: 'attack', power: 13, damageType: 'magical' }],
    drops: [
      { itemId: 'moneda_oro', chance: 0.22 },
      { itemId: 'sello_eficiencia', chance: 0.08 }
    ],
    themes: ['gestiones', 'oro_comercio']
  },

  imitador_social: {
    id: 'imitador_social', name: 'Social Mimic', icon: '\ud83c\udfad', type: 'common', level: 4,
    hp: 55, fue: 8, vit: 8, des: 13, int: 9, vol: 10, pre: 14, xp: 32, gold: 16,
    skills: [{ id: 'duda', name: 'Sow Doubt', type: 'attack', power: 15 }],
    drops: [
      { itemId: 'broche_vinculo', chance: 0.12 },
      { itemId: 'token_amistad', chance: 0.25 }
    ],
    themes: ['alianzas', 'social']
  },

  guardia_del_umbral: {
    id: 'guardia_del_umbral', name: 'Threshold Guard', icon: '\ud83d\udeaa', type: 'elite', level: 8,
    hp: 150, fue: 16, vit: 16, des: 10, int: 9, vol: 14, pre: 8, xp: 95, gold: 42,
    skills: [
      { id: 'bloqueo', name: 'Brace', type: 'buff', effect: 'defense_up' },
      { id: 'embestida', name: 'Charge', type: 'attack', power: 27, scaling: { fue: 0.7 } }
    ],
    drops: [
      { itemId: 'escudo_cotidiano', chance: 0.35 },
      { itemId: 'botas_sendero', chance: 0.2 }
    ],
    themes: ['casa', 'gestiones', 'exploracion']
  },

  buho_de_las_dudas: {
    id: 'buho_de_las_dudas', name: 'Owl of Doubt', icon: '\ud83e\udd89', type: 'elite', level: 10,
    hp: 135, fue: 9, vit: 10, des: 19, int: 22, vol: 18, pre: 12, xp: 115, gold: 50,
    skills: [
      { id: 'mirada', name: 'Paralyzing Gaze', type: 'attack', power: 29, damageType: 'magical', scaling: { int: 0.7 } },
      { id: 'pluma_cortante', name: 'Cutting Feather', type: 'attack', power: 22, scaling: { des: 0.5 } }
    ],
    drops: [
      { itemId: 'anillo_constancia', chance: 0.25 },
      { itemId: 'claridad_practica', chance: 0.08 }
    ],
    themes: ['mente', 'conocimiento']
  },

  guardian_del_hilo: {
    id: 'guardian_del_hilo', name: 'Thread Warden', icon: '\ud83e\uddf5', type: 'boss', level: 15,
    hp: 360, fue: 18, vit: 20, des: 18, int: 24, vol: 22, pre: 16, xp: 360, gold: 180,
    skills: [
      { id: 'tiron_destino', name: 'Pull of Fate', type: 'attack', power: 42, damageType: 'magical', scaling: { int: 0.8 } },
      { id: 'nudo', name: 'Knot', type: 'debuff', effect: 'slow' },
      { id: 'recomponer', name: 'Reweave', type: 'heal', power: 55 }
    ],
    drops: [
      { itemId: 'claridad_practica', chance: 0.3 },
      { itemId: 'anillo_constancia', chance: 0.45 },
      { itemId: 'fragmento_historia', chance: 0.7 }
    ],
    themes: ['destino', 'creacion', 'mente']
  },

  campanero_de_ceniza: {
    id: 'campanero_de_ceniza', name: 'Ashen Bellkeeper', icon: '\ud83d\udd14', type: 'elite', level: 9,
    hp: 158, fue: 15, vit: 16, des: 11, int: 11, vol: 14, pre: 8, xp: 101, gold: 45,
    skills: [
      { id: 'ascua_errante', name: 'Wandering Ember', type: 'attack', power: 20, damageType: 'magical', scaling: { int: 0.4 } }
    ],
    drops: [
      { itemId: 'gema_fuego', chance: 0.25 },
      { itemId: 'especia_rara', chance: 0.2 }
    ],
    themes: ['fuego', 'fuego_comida']
  },

  serpiente_de_tinta: {
    id: 'serpiente_de_tinta', name: 'Ink Serpent', icon: '\ud83d\udc0d', type: 'elite', level: 10,
    hp: 165, fue: 15, vit: 15, des: 11, int: 14, vol: 15, pre: 8, xp: 108, gold: 49,
    skills: [
      { id: 'mordisco_entintado', name: 'Inked Bite', type: 'attack', power: 27, damageType: 'magical', scaling: { int: 0.6 } },
      { id: 'nube_de_tinta', name: 'Ink Cloud', type: 'debuff', effect: 'blind' }
    ],
    drops: [
      { itemId: 'pagina_arcana', chance: 0.35 },
      { itemId: 'tinta_magica', chance: 0.25 },
      { itemId: 'frasco_vacio', chance: 0.15 }
    ],
    themes: ['conocimiento', 'agua_quimicos']
  },

  ciervo_de_los_sellos: {
    id: 'ciervo_de_los_sellos', name: 'Sealbound Stag', icon: '\ud83e\udd8c', type: 'elite', level: 11,
    hp: 173, fue: 15, vit: 15, des: 12, int: 16, vol: 15, pre: 8, xp: 114, gold: 52,
    skills: [
      { id: 'embestida_sellada', name: 'Sealed Charge', type: 'attack', power: 28, scaling: { des: 0.5 } },
      { id: 'ramas_de_resguardo', name: 'Warding Branches', type: 'buff', effect: 'defense_up' }
    ],
    drops: [
      { itemId: 'sello_alianza', chance: 0.25 },
      { itemId: 'amuleto_bosque', chance: 0.2 },
      { itemId: 'semilla_rara', chance: 0.35 }
    ],
    themes: ['naturaleza', 'refugio']
  },

  guardian_de_la_marea: {
    id: 'guardian_de_la_marea', name: 'Tide Warden', icon: '\ud83d\udca7', type: 'elite', level: 23,
    hp: 198, fue: 18, vit: 12, des: 31, int: 14, vol: 16, pre: 21, xp: 242, gold: 121,
    skills: [
      { id: 'embate_de_marea', name: 'Tidal Impact', type: 'attack', power: 38, scaling: { fue: 0.7 } },
      { id: 'caparazon_de_agua', name: 'Water Shell', type: 'buff', effect: 'defense_up' }
    ],
    drops: [
      { itemId: 'escama_marina', chance: 0.4 },
      { itemId: 'pocion_respiracion', chance: 0.18 },
      { itemId: 'perla_marina', chance: 0.08 }
    ],
    themes: ['agua_profunda', 'exploracion']
  },

  cartografo_sin_rostro: {
    id: 'cartografo_sin_rostro', name: 'Faceless Cartographer', icon: '\ud83d\uddfa\ufe0f', type: 'elite', level: 24,
    hp: 216, fue: 19, vit: 13, des: 33, int: 15, vol: 17, pre: 22, xp: 264, gold: 132,
    skills: [
      { id: 'trazo_cortante', name: 'Cutting Line', type: 'attack', power: 42, damageType: 'magical', scaling: { int: 0.7 } },
      { id: 'desviar_rumbo', name: 'Misroute', type: 'debuff', effect: 'confusion' }
    ],
    drops: [
      { itemId: 'mapa_tesoro', chance: 0.25 },
      { itemId: 'pagina_arcana', chance: 0.35 },
      { itemId: 'esencia_espectral', chance: 0.2 }
    ],
    themes: ['conocimiento', 'exploracion', 'hallazgos']
  },

  forjador_del_eco: {
    id: 'forjador_del_eco', name: 'Echo Forger', icon: '\ud83d\udd25', type: 'elite', level: 25,
    hp: 234, fue: 20, vit: 13, des: 34, int: 16, vol: 18, pre: 23, xp: 286, gold: 143,
    skills: [
      { id: 'martillo_resonante', name: 'Resonant Hammer', type: 'attack', power: 45, scaling: { fue: 0.8 } },
      { id: 'calor_remanente', name: 'Lingering Heat', type: 'buff', effect: 'attack_up' }
    ],
    drops: [
      { itemId: 'corazon_fuego', chance: 0.35 },
      { itemId: 'tinta_magica', chance: 0.22 },
      { itemId: 'dado_destino', chance: 0.06 }
    ],
    themes: ['creacion', 'fuego']
  },

  monje_del_vacio: {
    id: 'monje_del_vacio', name: 'Void Monk', icon: 'MONK', type: 'elite', level: 26,
    hp: 251, fue: 21, vit: 14, des: 36, int: 16, vol: 19, pre: 24, xp: 308, gold: 154,
    skills: [
      { id: 'golpe_silencioso', name: 'Silent Strike', type: 'attack', power: 47, scaling: { vol: 0.7 } },
      { id: 'respiracion_vacia', name: 'Empty Breath', type: 'debuff', effect: 'mp_drain' }
    ],
    drops: [
      { itemId: 'rosario_concentracion', chance: 0.35 },
      { itemId: 'fragmento_sueno', chance: 0.3 },
      { itemId: 'talisman_oriental', chance: 0.12 }
    ],
    themes: ['mente', 'destino', 'oriente']
  },

  custodio_de_las_rutas: {
    id: 'custodio_de_las_rutas', name: 'Route Warden', icon: '\ud83e\udde9', type: 'elite', level: 27,
    hp: 270, fue: 22, vit: 15, des: 37, int: 17, vol: 20, pre: 25, xp: 330, gold: 165,
    skills: [
      { id: 'corte_de_ruta', name: 'Roadcut', type: 'attack', power: 48, scaling: { des: 0.8 } },
      { id: 'senal_de_repliegue', name: 'Fallback Signal', type: 'buff', effect: 'evasion_up' }
    ],
    drops: [
      { itemId: 'mapa_tesoro', chance: 0.32 },
      { itemId: 'botas_viajero', chance: 0.22 },
      { itemId: 'contrato_sospechoso', chance: 0.18 }
    ],
    themes: ['exploracion', 'alianzas', 'oro_comercio']
  },

  sacerdotisa_del_umbral: {
    id: 'sacerdotisa_del_umbral', name: 'Threshold Priestess', icon: '\u2728', type: 'elite', level: 28,
    hp: 288, fue: 23, vit: 15, des: 39, int: 18, vol: 20, pre: 26, xp: 352, gold: 176,
    skills: [
      { id: 'lanza_de_luz', name: 'Spear of Light', type: 'attack', power: 50, damageType: 'magical', scaling: { int: 0.8 } },
      { id: 'velo_sereno', name: 'Serene Veil', type: 'heal', power: 36 }
    ],
    drops: [
      { itemId: 'cristal_solar', chance: 0.28 },
      { itemId: 'grimorio_arcano', chance: 0.15 },
      { itemId: 'fragmento_solar', chance: 0.35 }
    ],
    themes: ['luz', 'conocimiento', 'destino']
  },

  bestia_de_la_niebla: {
    id: 'bestia_de_la_niebla', name: 'Mistbound Beast', icon: '\ud83d\udc3a', type: 'elite', level: 29,
    hp: 306, fue: 24, vit: 16, des: 40, int: 18, vol: 21, pre: 27, xp: 374, gold: 187,
    skills: [
      { id: 'mordida_de_niebla', name: 'Mistbite', type: 'attack', power: 53, damageType: 'magical', scaling: { int: 0.7 } },
      { id: 'aullido_velado', name: 'Veiled Howl', type: 'debuff', effect: 'fear' }
    ],
    drops: [
      { itemId: 'esencia_oscura', chance: 0.32 },
      { itemId: 'pocion_respiracion', chance: 0.18 },
      { itemId: 'perla_marina', chance: 0.1 }
    ],
    themes: ['mente', 'agua_profunda', 'destino']
  }
};

const EXPANSION_THEME_ENEMIES_V1 = {
  destino: ['pesadilla', 'devorador_suenos', 'eco_inquieto', 'guardian_del_hilo', 'monje_del_vacio', 'sacerdotisa_del_umbral', 'bestia_de_la_niebla'],
  mente: ['pesadilla', 'devorador_suenos', 'eco_inquieto', 'buho_de_las_dudas', 'monje_del_vacio', 'sacerdotisa_del_umbral', 'bestia_de_la_niebla'],
  casa: ['duende_del_desorden', 'guardia_del_umbral'],
  gestiones: ['cobrador_de_niebla', 'guardia_del_umbral'],
  oro_comercio: ['mercader_corrupto', 'bandido', 'cobrador_de_niebla', 'custodio_de_las_rutas'],
  alianzas: ['mercader_corrupto', 'asesino_gremio', 'imitador_social', 'custodio_de_las_rutas'],
  social: ['imitador_social'],
  conocimiento: ['libro_maldito', 'liche', 'buho_de_las_dudas', 'serpiente_de_tinta', 'cartografo_sin_rostro', 'sacerdotisa_del_umbral'],
  creacion: ['pesadilla', 'guardian_del_hilo', 'forjador_del_eco'],
  fuego: ['salamandra', 'golem_horno', 'campanero_de_ceniza', 'forjador_del_eco'],
  fuego_comida: ['salamandra', 'golem_horno', 'campanero_de_ceniza'],
  naturaleza: ['planta_carnivora', 'treant', 'espiritu_bosque', 'ciervo_de_los_sellos'],
  refugio: ['rata_gigante', 'poltergeist', 'ciervo_de_los_sellos'],
  agua_quimicos: ['rata_gigante', 'arana_domestica', 'slime_acido', 'elemental_agua', 'serpiente_de_tinta'],
  agua_profunda: ['cangrejo_gigante', 'serpiente_marina', 'kraken_menor', 'elemental_agua', 'guardian_de_la_marea', 'bestia_de_la_niebla'],
  hielo: ['lobo_escarcha', 'elemental_hielo'],
  sol_viento: ['halcon_viento', 'grifo'],
  luz: ['halcon_viento', 'grifo', 'sacerdotisa_del_umbral'],
  exploracion: ['bandido', 'capitan_bandidos', 'halcon_viento', 'lobo_escarcha', 'guardian_de_la_marea', 'cartografo_sin_rostro', 'custodio_de_las_rutas'],
  oriente: ['oni', 'kitsune', 'dragon_oriental', 'monje_del_vacio'],
  hallazgos: ['rata_gigante', 'arana_domestica', 'poltergeist', 'cartografo_sin_rostro']
};

function installExpansionEnemies() {
  if (installExpansionEnemies._installed) return;
  installExpansionEnemies._installed = true;
  Object.assign(ENEMIES, EXPANSION_ENEMIES_V1);
  Object.assign(THEME_ENEMIES, EXPANSION_THEME_ENEMIES_V1);
}
