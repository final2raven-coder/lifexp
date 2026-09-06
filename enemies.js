
// LifeXP RPG - Enemies Database (Block 4.2)


// ENEMY TEMPLATES


const ENEMIES = {

  rata_gigante: {
    id: 'rata_gigante', name: 'Giant Rat', icon: '\uD83D\uDC00',
    type: 'common', level: 1,
    hp: 30, fue: 5, vit: 4, des: 8, int: 2, vol: 3, pre: 1,
    xp: 15, gold: 5,
    skills: [],
    drops: [
      { itemId: 'cola_rata', chance: 0.3 },
      { itemId: 'moneda_antigua', chance: 0.1 }
    ],
    themes: ['hallazgos', 'agua_quimicos']
  },

  'arana_domestica': {
    id: 'arana_domestica', name: 'House Spider', icon: '\uD83D\uDD77\uFE0F',
    type: 'common', level: 2,
    hp: 25, fue: 4, vit: 3, des: 12, int: 3, vol: 4, pre: 2,
    xp: 18, gold: 6,
    skills: [
      { id: 'veneno_leve', name: 'Venomous Bite', type: 'attack', power: 8, cost: 0 }
    ],
    drops: [
      { itemId: 'seda_arana', chance: 0.25 },
      { itemId: 'veneno_basico', chance: 0.15 }
    ],
    themes: ['hallazgos', 'agua_quimicos']
  },

  poltergeist: {
    id: 'poltergeist', name: 'Poltergeist', icon: '\uD83D\uDC7B',
    type: 'elite', level: 8,
    hp: 120, fue: 8, vit: 6, des: 14, int: 15, vol: 12, pre: 10,
    xp: 80, gold: 35,
    skills: [
      { id: 'lanzar_objeto', name: 'Hurl Object', type: 'attack', power: 20, scaling: { int: 0.5 } },
      { id: 'aullido', name: 'Terrifying Howl', type: 'debuff', effect: 'fear' }
    ],
    drops: [
      { itemId: 'esencia_espectral', chance: 0.4 },
      { itemId: 'objeto_olvidado', chance: 0.6 }
    ],
    themes: ['hallazgos']
  },

  slime_acido: {
    id: 'slime_acido', name: 'Acid Slime', icon: '\uD83D\uDFE2',
    type: 'common', level: 3,
    hp: 45, fue: 6, vit: 8, des: 4, int: 5, vol: 6, pre: 1,
    xp: 22, gold: 8,
    skills: [
      { id: 'salpicadura', name: 'Acid Splash', type: 'attack', power: 12, damageType: 'magical' }
    ],
    drops: [
      { itemId: 'nucleo_slime', chance: 0.35 },
      { itemId: 'frasco_vacio', chance: 0.2 }
    ],
    themes: ['agua_quimicos']
  },

  elemental_agua: {
    id: 'elemental_agua', name: 'Water Elemental', icon: '\uD83D\uDCA7',
    type: 'elite', level: 12,
    hp: 180, fue: 10, vit: 14, des: 12, int: 18, vol: 15, pre: 8,
    xp: 120, gold: 55,
    skills: [
      { id: 'chorro_presion', name: 'Pressurized Jet', type: 'attack', power: 25, scaling: { int: 0.8 }, damageType: 'magical' },
      { id: 'regenerar', name: 'Regeneration', type: 'heal', power: 30 }
    ],
    drops: [
      { itemId: 'esencia_agua', chance: 0.5 },
      { itemId: 'pocion_agua_menor', chance: 0.3 }
    ],
    themes: ['agua_quimicos', 'agua_profunda']
  },

  salamandra: {
    id: 'salamandra', name: 'Fire Salamander', icon: '\uD83E\uDD8E',
    type: 'common', level: 4,
    hp: 40, fue: 8, vit: 5, des: 10, int: 8, vol: 6, pre: 3,
    xp: 28, gold: 12,
    skills: [
      { id: 'llamarada', name: 'Flare', type: 'attack', power: 15, damageType: 'magical', scaling: { int: 0.4 } }
    ],
    drops: [
      { itemId: 'escama_fuego', chance: 0.3 },
      { itemId: 'gema_fuego', chance: 0.1 }
    ],
    themes: ['fuego', 'fuego_comida']
  },

  golem_horno: {
    id: 'golem_horno', name: 'Oven Golem', icon: '\uD83D\uDD25',
    type: 'elite', level: 15,
    hp: 250, fue: 20, vit: 22, des: 6, int: 12, vol: 18, pre: 5,
    xp: 150, gold: 70,
    skills: [
      { id: 'puno_ardiente', name: 'Blazing Fist', type: 'attack', power: 35, scaling: { fue: 1.0 } },
      { id: 'explosion_calor', name: 'Heat Burst', type: 'attack', power: 25, damageType: 'magical' }
    ],
    drops: [
      { itemId: 'corazon_fuego', chance: 0.4 },
      { itemId: 'cuchilla_llameante', chance: 0.15 }
    ],
    themes: ['fuego', 'fuego_comida']
  },

  planta_carnivora: {
    id: 'planta_carnivora', name: 'Carnivorous Plant', icon: '\uD83C\uDF3F',
    type: 'common', level: 3,
    hp: 35, fue: 7, vit: 6, des: 5, int: 4, vol: 8, pre: 2,
    xp: 20, gold: 7,
    skills: [
      { id: 'mordisco', name: 'Bite', type: 'attack', power: 12 }
    ],
    drops: [
      { itemId: 'hierba_curativa', chance: 0.4 },
      { itemId: 'semilla_rara', chance: 0.15 }
    ],
    themes: ['naturaleza']
  },

  treant: {
    id: 'treant', name: 'Guardian Treant', icon: '\uD83C\uDF33',
    type: 'elite', level: 18,
    hp: 300, fue: 22, vit: 28, des: 4, int: 14, vol: 20, pre: 12,
    xp: 180, gold: 80,
    skills: [
      { id: 'ramas_aplastantes', name: 'Crushing Branches', type: 'attack', power: 40, scaling: { fue: 1.2 } },
      { id: 'regeneracion_natural', name: 'Natural Regeneration', type: 'heal', power: 40 }
    ],
    drops: [
      { itemId: 'corazon_bosque', chance: 0.35 },
      { itemId: 'arco_espino', chance: 0.2 }
    ],
    themes: ['naturaleza']
  },

  espiritu_bosque: {
    id: 'espiritu_bosque', name: 'Forest Spirit', icon: '\uD83E\uDDDA',
    type: 'boss', level: 25,
    hp: 500, fue: 15, vit: 20, des: 25, int: 30, vol: 28, pre: 22,
    xp: 400, gold: 200,
    skills: [
      { id: 'furia_naturaleza', name: 'Wrath of Nature', type: 'attack', power: 50, damageType: 'magical', scaling: { int: 1.0 } },
      { id: 'raices', name: 'Grasping Roots', type: 'debuff', effect: 'slow' },
      { id: 'bendicion_verde', name: 'Verdant Blessing', type: 'heal', power: 80 }
    ],
    drops: [
      { itemId: 'esencia_vida', chance: 0.6 },
      { itemId: 'arco_espino', chance: 0.4 },
      { itemId: 'amuleto_bosque', chance: 0.25 }
    ],
    themes: ['naturaleza']
  },

  lobo_escarcha: {
    id: 'lobo_escarcha', name: 'Frost Wolf', icon: '\uD83D\uDC3A',
    type: 'common', level: 5,
    hp: 55, fue: 10, vit: 8, des: 12, int: 6, vol: 8, pre: 5,
    xp: 35, gold: 15,
    skills: [
      { id: 'mordisco_gelido', name: 'Frostbite', type: 'attack', power: 18 }
    ],
    drops: [
      { itemId: 'colmillo_hielo', chance: 0.3 },
      { itemId: 'piel_lobo', chance: 0.4 }
    ],
    themes: ['hielo']
  },

  elemental_hielo: {
    id: 'elemental_hielo', name: 'Ice Elemental', icon: '\u2744\uFE0F',
    type: 'elite', level: 14,
    hp: 200, fue: 12, vit: 16, des: 10, int: 20, vol: 16, pre: 8,
    xp: 140, gold: 65,
    skills: [
      { id: 'ventisca', name: 'Blizzard', type: 'attack', power: 28, damageType: 'magical', scaling: { int: 0.9 } },
      { id: 'armadura_hielo', name: 'Ice Armor', type: 'buff', effect: 'defense_up' }
    ],
    drops: [
      { itemId: 'fragmento_hielo', chance: 0.5 },
      { itemId: 'hoja_gelida', chance: 0.2 }
    ],
    themes: ['hielo']
  },

  halcon_viento: {
    id: 'halcon_viento', name: 'Wind Hawk', icon: '\uD83E\uDD85',
    type: 'common', level: 4,
    hp: 35, fue: 7, vit: 5, des: 16, int: 6, vol: 7, pre: 8,
    xp: 25, gold: 10,
    skills: [
      { id: 'picotazo', name: 'Swift Peck', type: 'attack', power: 14, scaling: { des: 0.5 } }
    ],
    drops: [
      { itemId: 'pluma_viento', chance: 0.4 },
      { itemId: 'fragmento_solar', chance: 0.1 }
    ],
    themes: ['sol_viento', 'exploracion']
  },

  grifo: {
    id: 'grifo', name: 'Griffin', icon: '\uD83E\uDD81',
    type: 'elite', level: 20,
    hp: 280, fue: 24, vit: 18, des: 22, int: 14, vol: 16, pre: 18,
    xp: 200, gold: 100,
    skills: [
      { id: 'zarpazo', name: 'Claw Swipe', type: 'attack', power: 35, scaling: { fue: 0.8, des: 0.4 } },
      { id: 'grito_guerra', name: 'War Cry', type: 'buff', effect: 'attack_up' }
    ],
    drops: [
      { itemId: 'pluma_grifo', chance: 0.45 },
      { itemId: 'capa_alba', chance: 0.15 }
    ],
    themes: ['sol_viento', 'luz']
  },

  bandido: {
    id: 'bandido', name: 'Bandit', icon: '\uD83D\uDDE1\uFE0F',
    type: 'common', level: 5,
    hp: 60, fue: 12, vit: 10, des: 10, int: 5, vol: 6, pre: 8,
    xp: 30, gold: 25,
    skills: [
      { id: 'golpe_traicionero', name: 'Treacherous Strike', type: 'attack', power: 20 }
    ],
    drops: [
      { itemId: 'moneda_antigua', chance: 0.5 },
      { itemId: 'daga_oxidada', chance: 0.2 }
    ],
    themes: ['exploracion']
  },

  capitan_bandidos: {
    id: 'capitan_bandidos', name: 'Bandit Captain', icon: '\u2694\uFE0F',
    type: 'elite', level: 12,
    hp: 180, fue: 18, vit: 15, des: 14, int: 8, vol: 10, pre: 14,
    xp: 110, gold: 80,
    skills: [
      { id: 'combo_espadas', name: 'Sword Combo', type: 'attack', power: 28, scaling: { fue: 0.7, des: 0.5 } },
      { id: 'llamar_refuerzos', name: 'Call Reinforcements', type: 'summon' }
    ],
    drops: [
      { itemId: 'botas_viajero', chance: 0.35 },
      { itemId: 'mapa_tesoro', chance: 0.15 }
    ],
    themes: ['exploracion']
  },

  cangrejo_gigante: {
    id: 'cangrejo_gigante', name: 'Giant Crab', icon: '\uD83E\uDD80',
    type: 'common', level: 6,
    hp: 70, fue: 14, vit: 16, des: 6, int: 3, vol: 8, pre: 2,
    xp: 40, gold: 18,
    skills: [
      { id: 'pinza', name: 'Crushing Claws', type: 'attack', power: 22, scaling: { fue: 0.6 } }
    ],
    drops: [
      { itemId: 'caparazon', chance: 0.4 },
      { itemId: 'perla_marina', chance: 0.1 }
    ],
    themes: ['agua_profunda']
  },

  serpiente_marina: {
    id: 'serpiente_marina', name: 'Sea Serpent', icon: '\uD83D\uDC0D',
    type: 'elite', level: 16,
    hp: 220, fue: 16, vit: 14, des: 20, int: 12, vol: 14, pre: 10,
    xp: 160, gold: 75,
    skills: [
      { id: 'constriccion', name: 'Constriction', type: 'attack', power: 30 },
      { id: 'veneno_marino', name: 'Sea Venom', type: 'attack', power: 15, damageType: 'magical', effect: 'poison' }
    ],
    drops: [
      { itemId: 'escama_marina', chance: 0.45 },
      { itemId: 'tridente_marino', chance: 0.15 }
    ],
    themes: ['agua_profunda']
  },

  kraken_menor: {
    id: 'kraken_menor', name: 'Lesser Kraken', icon: '\uD83D\uDC19',
    type: 'boss', level: 30,
    hp: 600, fue: 28, vit: 25, des: 18, int: 22, vol: 24, pre: 15,
    xp: 500, gold: 250,
    skills: [
      { id: 'tentaculos', name: 'Tentacle Lash', type: 'attack', power: 45, scaling: { fue: 1.0 } },
      { id: 'tinta', name: 'Ink Cloud', type: 'debuff', effect: 'blind' },
      { id: 'remolino', name: 'Whirlpool', type: 'attack', power: 35, damageType: 'magical' }
    ],
    drops: [
      { itemId: 'tentaculo_kraken', chance: 0.6 },
      { itemId: 'escamas_sirena', chance: 0.25 },
      { itemId: 'tridente_marino', chance: 0.3 }
    ],
    themes: ['agua_profunda']
  },

  pesadilla: {
    id: 'pesadilla', name: 'Nightmare', icon: '\uD83D\uDE31',
    type: 'common', level: 7,
    hp: 50, fue: 5, vit: 6, des: 14, int: 16, vol: 10, pre: 8,
    xp: 45, gold: 20,
    skills: [
      { id: 'terror', name: 'Vision of Terror', type: 'attack', power: 18, damageType: 'magical', scaling: { int: 0.6 } }
    ],
    drops: [
      { itemId: 'esencia_oscura', chance: 0.35 },
      { itemId: 'orbe_mental', chance: 0.15 }
    ],
    themes: ['mente', 'destino']
  },

  devorador_suenos: {
    id: 'devorador_suenos', name: 'Dream Eater', icon: '\uD83C\uDF19',
    type: 'elite', level: 18,
    hp: 200, fue: 10, vit: 12, des: 16, int: 26, vol: 22, pre: 14,
    xp: 170, gold: 85,
    skills: [
      { id: 'drenar_mente', name: 'Mind Drain', type: 'attack', power: 30, damageType: 'magical', scaling: { int: 1.0 }, effect: 'mp_drain' },
      { id: 'hipnosis', name: 'Hypnosis', type: 'debuff', effect: 'sleep' }
    ],
    drops: [
      { itemId: 'fragmento_sueno', chance: 0.5 },
      { itemId: 'rosario_concentracion', chance: 0.2 }
    ],
    themes: ['mente', 'destino']
  },

  oni: {
    id: 'oni', name: 'Oni', icon: '\uD83D\uDC79',
    type: 'common', level: 8,
    hp: 90, fue: 16, vit: 14, des: 10, int: 8, vol: 12, pre: 6,
    xp: 55, gold: 30,
    skills: [
      { id: 'maza_oni', name: 'Mace Strike', type: 'attack', power: 25, scaling: { fue: 0.8 } }
    ],
    drops: [
      { itemId: 'cuerno_oni', chance: 0.35 },
      { itemId: 'sake_demonio', chance: 0.15 }
    ],
    themes: ['oriente']
  },

  kitsune: {
    id: 'kitsune', name: 'Kitsune', icon: '\uD83E\uDD8A',
    type: 'elite', level: 20,
    hp: 180, fue: 12, vit: 14, des: 24, int: 26, vol: 20, pre: 22,
    xp: 190, gold: 95,
    skills: [
      { id: 'fuego_zorro', name: 'Foxfire', type: 'attack', power: 35, damageType: 'magical', scaling: { int: 0.9 } },
      { id: 'ilusion', name: 'Illusion', type: 'debuff', effect: 'confusion' }
    ],
    drops: [
      { itemId: 'cola_kitsune', chance: 0.4 },
      { itemId: 'talisman_oriental', chance: 0.25 }
    ],
    themes: ['oriente']
  },

  dragon_oriental: {
    id: 'dragon_oriental', name: 'Eastern Dragon', icon: '\uD83D\uDC32',
    type: 'boss', level: 40,
    hp: 800, fue: 30, vit: 28, des: 26, int: 35, vol: 32, pre: 28,
    xp: 800, gold: 400,
    skills: [
      { id: 'aliento_dragon', name: 'Dragon Breath', type: 'attack', power: 60, damageType: 'magical', scaling: { int: 1.2 } },
      { id: 'cola_dragon', name: 'Tail Sweep', type: 'attack', power: 50, scaling: { fue: 1.0 } },
      { id: 'aura_dragon', name: 'Draconic Aura', type: 'buff', effect: 'all_stats_up' }
    ],
    drops: [
      { itemId: 'escama_dragon', chance: 0.7 },
      { itemId: 'katana_oriental', chance: 0.3 },
      { itemId: 'cuentas_jade', chance: 0.4 }
    ],
    themes: ['oriente']
  },

  libro_maldito: {
    id: 'libro_maldito', name: 'Cursed Book', icon: '\uD83D\uDCD5',
    type: 'common', level: 6,
    hp: 40, fue: 3, vit: 5, des: 8, int: 18, vol: 14, pre: 4,
    xp: 38, gold: 15,
    skills: [
      { id: 'paginas_cortantes', name: 'Cutting Pages', type: 'attack', power: 16, damageType: 'magical' }
    ],
    drops: [
      { itemId: 'pagina_arcana', chance: 0.4 },
      { itemId: 'tinta_magica', chance: 0.2 }
    ],
    themes: ['conocimiento']
  },

  liche: {
    id: 'liche', name: 'Lich', icon: '\uD83D\uDC80',
    type: 'boss', level: 35,
    hp: 450, fue: 12, vit: 15, des: 14, int: 40, vol: 35, pre: 20,
    xp: 600, gold: 300,
    mp: 200,
    skills: [
      { id: 'rayo_muerte', name: 'Death Ray', type: 'attack', power: 55, damageType: 'magical', cost: 25, costType: 'mp', scaling: { int: 1.3 } },
      { id: 'invocar_esqueletos', name: 'Summon Skeletons', type: 'summon', cost: 30, costType: 'mp' },
      { id: 'drenar_vida', name: 'Life Drain', type: 'attack', power: 30, damageType: 'magical', effect: 'lifesteal' }
    ],
    drops: [
      { itemId: 'filacteria', chance: 0.5 },
      { itemId: 'grimorio_antiguo', chance: 0.35 },
      { itemId: 'baculo_liche', chance: 0.2 }
    ],
    themes: ['conocimiento', 'mente']
  },

  mercader_corrupto: {
    id: 'mercader_corrupto', name: 'Corrupt Merchant', icon: '\uD83C\uDFAD',
    type: 'common', level: 5,
    hp: 50, fue: 8, vit: 8, des: 10, int: 12, vol: 10, pre: 16,
    xp: 32, gold: 50,
    skills: [
      { id: 'soborno', name: 'Bribe', type: 'debuff', effect: 'confusion' }
    ],
    drops: [
      { itemId: 'moneda_antigua', chance: 0.6 },
      { itemId: 'contrato_sospechoso', chance: 0.2 }
    ],
    themes: ['alianzas', 'oro_comercio']
  },

  asesino_gremio: {
    id: 'asesino_gremio', name: 'Guild Assassin', icon: '\uD83D\uDDE1\uFE0F',
    type: 'elite', level: 22,
    hp: 180, fue: 18, vit: 12, des: 30, int: 14, vol: 16, pre: 20,
    xp: 220, gold: 110,
    skills: [
      { id: 'golpe_mortal', name: 'Killing Blow', type: 'attack', power: 45, scaling: { des: 1.2 } },
      { id: 'veneno_asesino', name: 'Assassin\'s Poison', type: 'attack', power: 20, effect: 'poison' },
      { id: 'sombras', name: 'Meld into Shadows', type: 'buff', effect: 'evasion_up' }
    ],
    drops: [
      { itemId: 'daga_asesino', chance: 0.35 },
      { itemId: 'capa_sombras', chance: 0.2 },
      { itemId: 'veneno_letal', chance: 0.25 }
    ],
    themes: ['alianzas']
  },

  lobo_alfa: {
    id: 'lobo_alfa', name: 'Alpha Wolf', icon: '\uD83D\uDC3A',
    type: 'boss', level: 15,
    hp: 400, maxHp: 400,
    fue: 20, vit: 18, des: 16, int: 8, vol: 14, pre: 12,
    xp: 200, gold: 100,
    skills: [
      { id: 'mordisco_feroz', name: 'Feral Bite', type: 'attack', power: 35, scaling: { fue: 0.8 } },
      { id: 'aullido_alfa', name: 'Terrifying Howl', type: 'debuff', effect: 'fear', duration: 2 },
      { id: 'zarpazo_rapido', name: 'Swift Claw', type: 'attack', power: 22, scaling: { des: 0.6 } }
    ],
    drops: [
      { itemId: 'piel_lobo', chance: 0.6 },
      { itemId: 'colmillo_alfa', chance: 0.8 }
    ],
    themes: ['naturaleza', 'exploracion']
  },

  espejo_oscuro: {
    id: 'espejo_oscuro', name: 'Dark Mirror', icon: '\uD83E\uDEDE',
    type: 'boss', level: 30,
    hp: 650, maxHp: 650,
    fue: 18, vit: 20, des: 20, int: 28, vol: 22, pre: 25,
    xp: 500, gold: 250,
    skills: [
      { id: 'reflejo_dolor', name: 'Pain Reflection', type: 'attack', power: 40, scaling: { int: 1.0 }, damageType: 'magical' },
      { id: 'confusion_profunda', name: 'Deep Confusion', type: 'debuff', effect: 'confusion', duration: 3 },
      { id: 'drenaje_mental', name: 'Mental Drain', type: 'debuff', effect: 'mp_drain', duration: 2, damage: 8 },
      { id: 'miedo_interior', name: 'Inner Fear', type: 'debuff', effect: 'fear', duration: 2 },
      { id: 'imagen_perfecta', name: 'Perfect Image', type: 'buff', effect: 'all_stats_up', duration: 3 }
    ],
    drops: [
      { itemId: 'esencia_oscura', chance: 0.7 },
      { itemId: 'fragmento_sueno', chance: 0.5 }
    ],
    themes: ['mente', 'destino']
  },

};


// ENEMY HELPERS


function getEnemyById(enemyId) {
  return ENEMIES[enemyId] ? { ...ENEMIES[enemyId] } : null;
}

function getEnemiesByTheme(theme) {
  return Object.values(ENEMIES).filter(e => e.themes && e.themes.includes(theme));
}

function getEnemiesByType(type) {
  return Object.values(ENEMIES).filter(e => e.type === type);
}

function getEnemiesByLevel(minLevel, maxLevel) {
  return Object.values(ENEMIES).filter(e => e.level >= minLevel && e.level <= maxLevel);
}

function pickRandomEnemy(theme, playerLevel, encounterType = 'common') {
  let candidates = [];
  if (theme) {
    candidates = getEnemiesByTheme(theme);
  } else {
    candidates = Object.values(ENEMIES);
  }
  candidates = candidates.filter(e => e.type === encounterType);
  const minLvl = Math.max(1, playerLevel - 5);
  const maxLvl = playerLevel + 5;
  candidates = candidates.filter(e => e.level >= minLvl && e.level <= maxLvl);
  if (candidates.length === 0) {
    candidates = (theme ? getEnemiesByTheme(theme) : Object.values(ENEMIES))
      .filter(e => e.type === encounterType);
  }
  if (candidates.length === 0) {
    candidates = getEnemiesByType(encounterType);
  }
  if (candidates.length === 0) return null;
  return { ...candidates[Math.floor(Math.random() * candidates.length)] };
}

function scaleEnemy(enemy, targetLevel) {
  if (!enemy || enemy.level === targetLevel) return enemy;
  const scaled = { ...enemy };
  const levelDiff = targetLevel - enemy.level;
  const multiplier = 1 + (levelDiff * 0.1);
  scaled.level = targetLevel;
  scaled.hp = Math.floor(enemy.hp * multiplier);
  scaled.maxHp = scaled.hp;
  scaled.xp = Math.floor(enemy.xp * multiplier);
  scaled.gold = Math.floor(enemy.gold * multiplier);
  for (const stat of ['fue', 'vit', 'des', 'int', 'vol', 'pre']) {
    if (scaled[stat]) {
      scaled[stat] = Math.floor(scaled[stat] * (1 + levelDiff * 0.05));
    }
  }
  return scaled;
}


// THEME TO ENEMY MAPPING
// DT-19 fix (2026-08-03): sustituidos IDs inexistentes por IDs canonicos
//   destino:  mote_del_umbral, custodio_del_umbral -> pesadilla, devorador_suenos
//   refugio:  vigia_del_refugio                    -> rata_gigante, poltergeist
//   creacion: custodio_del_umbral                  -> pesadilla


const THEME_ENEMIES = {
  destino: ['pesadilla', 'devorador_suenos'],
  refugio: ['rata_gigante', 'poltergeist'],
  creacion: ['pesadilla'],
  agua_quimicos: ['rata_gigante', 'arana_domestica', 'slime_acido', 'elemental_agua'],
  fuego: ['salamandra', 'golem_horno'],
  fuego_comida: ['salamandra', 'golem_horno'],
  naturaleza: ['planta_carnivora', 'treant', 'espiritu_bosque'],
  hielo: ['lobo_escarcha', 'elemental_hielo'],
  sol_viento: ['halcon_viento', 'grifo'],
  luz: ['halcon_viento', 'grifo'],
  exploracion: ['bandido', 'capitan_bandidos', 'halcon_viento', 'lobo_escarcha'],
  agua_profunda: ['cangrejo_gigante', 'serpiente_marina', 'kraken_menor', 'elemental_agua'],
  mente: ['pesadilla', 'devorador_suenos'],
  oriente: ['oni', 'kitsune', 'dragon_oriental'],
  conocimiento: ['libro_maldito', 'liche'],
  hallazgos: ['rata_gigante', 'arana_domestica', 'poltergeist'],
  alianzas: ['mercader_corrupto', 'asesino_gremio'],
  oro_comercio: ['mercader_corrupto', 'bandido']
};

function getThemeEnemies(theme) {
  const enemyIds = THEME_ENEMIES[theme] || [];
  return enemyIds.map(id => ENEMIES[id]).filter(Boolean);
}
