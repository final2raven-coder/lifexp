// LifeXP RPG - Items & Inventory System
// Canonical ASCII-safe build. Fantasy item text is English; task text remains unchanged in game.js.

const RARITY = {
  common: { name: 'Common', color: '#9ca3af', dropRate: 0.30, sellMult: 1.0 },
  uncommon: { name: 'Uncommon', color: '#4ade80', dropRate: 0.15, sellMult: 1.5 },
  rare: { name: 'Rare', color: '#60a5fa', dropRate: 0.05, sellMult: 3.0 },
  epic: { name: 'Epic', color: '#a855f7', dropRate: 0.01, sellMult: 8.0 },
  legendary: { name: 'Legendary', color: '#f59e0b', dropRate: 0.001, sellMult: 25.0 }
};

const ITEM_TYPE = {
  weapon: { name: 'Weapon', iconRef: 'item.weapon', slot: 'weapon' },
  armor: { name: 'Armor', iconRef: 'item.armor', slot: 'armor' },
  accessory: { name: 'Accessory', iconRef: 'item.accessory', slot: 'accessory' },
  artifact: { name: 'Artifact', iconRef: 'item.artifact', slot: 'artifact' },
  consumable: { name: 'Consumable', iconRef: 'item.consumable', slot: null },
  material: { name: 'Material', iconRef: 'item.material', slot: null },
  skill: { name: 'Skill', iconRef: 'item.skill', slot: null },
  key: { name: 'Quest Item', iconRef: 'item.key', slot: null }
};

const ITEMS = {
  daga_corrosiva: {
    id: 'daga_corrosiva', name: 'Greenbite', type: 'weapon', rarity: 'uncommon',
    iconRef: 'item.daga_corrosiva', lore: 'A narrow blade kept in a waxed leather sheath. The edge leaves a green stain on anything it cuts.',
    desc: 'A narrow blade kept in a waxed leather sheath. The edge leaves a green stain on anything it cuts.',
    stats: { fue: 3, des: 2 }, value: 50, themes: ['agua_quimicos']
  },
  cuchilla_llameante: {
    id: 'cuchilla_llameante',
    name: 'Ashbrand',
    type: 'weapon',
    rarity: 'common',
    iconRef: 'item.cuchilla_llameante',
    lore: 'Ashbrand remembers a fire that refused to become a ruin.',
    desc: 'A short sword taken from a shrine after the fire had gone out. The blade is warm. It does not glow.',
    stats: {},
    value: 120,
    themes: ['fuego', 'fuego_comida', 'ash'],
    effects: [
      { id: 'burning_edge', name: 'Burning Edge', trigger: 'passive', unlockStage: 1, description: 'Attacks can apply Burn for 3 turns.' },
      { id: 'pressure', name: 'Pressure', trigger: 'passive', unlockStage: 3, activationRequired: true, description: 'A burning target can receive another, shorter Burn.' }
    ],
    requirements: { stats: { fue: 12, des: 12 }, trainingId: null },
    attunement: {
      required: true,
      max: 3,
      minimumStage: 1,
      themes: ['fuego', 'fuego_comida', 'ash'],
      stages: ['The blade resists your hand with sudden heat.', 'The edge catches on fire when you press the attack.', 'The old heat answers without being forced.']
    },
    activation: {
      type: 'task_threshold',
      description: 'Complete three fire-related tasks, then attempt the ritual in the app.',
      instruction: 'The old fire is ready to answer.',
      requirement: { themes: ['fuego', 'fuego_comida'], count: 3 },
      unlocks: ['pressure']
    }
  },
  espada_radiante: { id: 'espada_radiante', name: 'Daybreak', type: 'weapon', rarity: 'rare', iconRef: 'item.espada_radiante', desc: 'A polished blade that shows the sky more clearly than a mirror.', stats: { fue: 4, vol: 3 }, value: 150, themes: ['sol_viento', 'luz'] },
  hoja_gelida: { id: 'hoja_gelida', name: 'Winterbite', type: 'weapon', rarity: 'uncommon', iconRef: 'item.hoja_gelida', desc: 'A chipped blade with frost sealed under the fuller.', stats: { fue: 3, int: 3 }, value: 80, themes: ['hielo'] },
  arco_espino: { id: 'arco_espino', name: 'Thornwake', type: 'weapon', rarity: 'uncommon', iconRef: 'item.arco_espino', desc: 'A bow cut from a living branch.', stats: { des: 5, vit: 1 }, value: 70, themes: ['naturaleza'] },
  tridente_marino: { id: 'tridente_marino', name: 'Drownwake', type: 'weapon', rarity: 'rare', iconRef: 'item.tridente_marino', desc: 'Water gathers around the shaft even in a dry room.', stats: { fue: 4, des: 3 }, value: 140, themes: ['agua_profunda'] },
  katana_oriental: { id: 'katana_oriental', name: 'Quiet Measure', type: 'weapon', rarity: 'rare', iconRef: 'item.katana_oriental', desc: 'A plain scabbard and a blade that has never been sharpened in public.', stats: { des: 6, fue: 2 }, value: 160, themes: ['oriente'] },
  escudo_antiveneno: { id: 'escudo_antiveneno', name: 'The Green Ward', type: 'armor', rarity: 'uncommon', iconRef: 'item.escudo_antiveneno', desc: 'A round shield sealed with dark resin.', stats: { vit: 4, vol: 2 }, value: 60, themes: ['agua_quimicos'] },
  armadura_invierno: { id: 'armadura_invierno', name: 'Frostbound Mail', type: 'armor', rarity: 'rare', iconRef: 'item.armadura_invierno', desc: 'Ice forms in the gaps when the wearer stands still.', stats: { vit: 5, vol: 2 }, value: 130, themes: ['hielo'] },
  capa_alba: { id: 'capa_alba', name: 'First Light Mantle', type: 'armor', rarity: 'rare', iconRef: 'item.capa_alba', desc: 'A pale mantle with a burnt hem.', stats: { des: 3, pre: 3 }, value: 110, themes: ['sol_viento', 'luz'] },
  capa_ligera: { id: 'capa_ligera', name: 'Wayfarer Wrap', type: 'armor', rarity: 'common', iconRef: 'item.capa_ligera', desc: 'A travel wrap with one pocket sewn shut and another sewn twice.', stats: { des: 2, vit: 1 }, value: 25, themes: ['sol_viento'] },
  escamas_sirena: { id: 'escamas_sirena', name: 'Siren Scale Coat', type: 'armor', rarity: 'epic', iconRef: 'item.escamas_sirena', desc: 'Scales that flex like wet leather.', stats: { vit: 6, des: 4, pre: 2 }, value: 400, themes: ['agua_profunda'] },
  amuleto_brisa: { id: 'amuleto_brisa', name: 'Windglass', type: 'accessory', rarity: 'common', iconRef: 'item.amuleto_brisa', desc: 'A glass bead with a thread of air trapped inside.', stats: { des: 2 }, value: 20, themes: ['sol_viento'] },
  cristal_solar: { id: 'cristal_solar', name: 'Sunshard', type: 'accessory', rarity: 'uncommon', iconRef: 'item.cristal_solar', desc: 'A broken piece of something larger.', stats: { int: 3, vol: 1 }, value: 45, themes: ['sol_viento', 'luz'] },
  perla_marina: { id: 'perla_marina', name: 'Drowned Pearl', type: 'accessory', rarity: 'rare', iconRef: 'item.perla_marina', desc: 'A pearl with a dark centre.', stats: { int: 4, pre: 2 }, value: 100, themes: ['agua_profunda'] },
  rosario_concentracion: { id: 'rosario_concentracion', name: 'Counting Beads', type: 'accessory', rarity: 'uncommon', iconRef: 'item.rosario_concentracion', desc: 'The cord has been repaired many times.', stats: { vol: 4 }, value: 55, themes: ['mente'] },
  cuentas_jade: { id: 'cuentas_jade', name: 'Jade Knots', type: 'accessory', rarity: 'rare', iconRef: 'item.cuentas_jade', desc: 'Green stone tied on red cord.', stats: { vol: 3, pre: 3 }, value: 90, themes: ['oriente'] },
  sello_alianza: { id: 'sello_alianza', name: 'Oathseal', type: 'accessory', rarity: 'uncommon', iconRef: 'item.sello_alianza', desc: 'A signet with no crest.', stats: { pre: 4 }, value: 50, themes: ['social'] },
  amuleto_espacio: { id: 'amuleto_espacio', name: 'Poche of Elsewhere', type: 'accessory', rarity: 'rare', iconRef: 'item.amuleto_espacio', desc: 'A charm with a pocket on the inside.', stats: { int: 2, vol: 2 }, value: 80, themes: ['hallazgos'], effect: { inventoryBonus: 5 } },
  orbe_mental: { id: 'orbe_mental', name: 'Thoughtstone', type: 'artifact', rarity: 'rare', iconRef: 'item.orbe_mental', desc: 'A dark sphere that reflects a room with one extra chair.', stats: { int: 5, vol: 5 }, value: 200, themes: ['mente'], passive: 'Still Mind: Meditation-related tasks grant a small bonus to XP.' },
  dado_destino: { id: 'dado_destino', name: 'The Loaded Bone', type: 'artifact', rarity: 'epic', iconRef: 'item.dado_destino', desc: 'Six faces, seven tally marks.', stats: { des: 3, pre: 3 }, value: 350, themes: ['creacion'], passive: 'One More Throw: The first failed drop roll after a completed task can be rolled once more.' },
  escama_dragon: { id: 'escama_dragon', name: 'Scale of the Wyrm', type: 'artifact', rarity: 'epic', iconRef: 'item.escama_dragon', desc: 'A black scale split down the middle.', stats: { fue: 4, vit: 4, int: 2 }, value: 500, themes: ['oriente'], passive: 'Cinder Skin: Burn applied by your equipment lasts 1 turn longer.' },
  grimorio_arcano: { id: 'grimorio_arcano', name: 'The Unfinished Grimoire', type: 'artifact', rarity: 'rare', iconRef: 'item.grimorio_arcano', desc: 'Most pages are blank.', stats: { int: 8 }, value: 250, themes: ['conocimiento'], passive: 'Open Line: Knowledge-related tasks can reveal hidden information.' },
  pocion_agua: { id: 'pocion_agua', name: 'Water Potion', type: 'consumable', rarity: 'common', iconRef: 'item.pocion_agua', desc: 'Restores 50 HP.', value: 10, themes: ['agua', 'agua_quimicos'], effect: { heal: 50 } },
  pocion_escarcha: { id: 'pocion_escarcha', name: 'Frost Potion', type: 'consumable', rarity: 'uncommon', iconRef: 'item.pocion_escarcha', desc: 'Freezes an enemy for 1 turn.', value: 30, themes: ['hielo'], effect: { freeze: 1 } },
  racion_combate: { id: 'racion_combate', name: 'Combat Ration', type: 'consumable', rarity: 'common', iconRef: 'item.racion_combate', desc: 'Restores 30 HP and 20 SP.', value: 15, themes: ['fuego_comida'], effect: { heal: 30, restoreSp: 20 } },
  elixir_vitalidad: { id: 'elixir_vitalidad', name: 'Vitality Elixir', type: 'consumable', rarity: 'rare', iconRef: 'item.elixir_vitalidad', desc: 'Restores 100% HP.', value: 100, themes: ['fuego_comida', 'naturaleza'], effect: { healPercent: 100 } },
  hierba_curativa: { id: 'hierba_curativa', name: 'Healing Herb', type: 'consumable', rarity: 'common', iconRef: 'item.hierba_curativa', desc: 'Restores 30 HP.', value: 8, themes: ['naturaleza'], effect: { heal: 30 } },
  antidoto: { id: 'antidoto', name: 'Antidote', type: 'consumable', rarity: 'common', iconRef: 'item.antidoto', desc: 'Cures Poison.', value: 12, themes: ['naturaleza', 'agua_quimicos'], effect: { curePoison: true } },
  veneno_basico: { id: 'veneno_basico', name: 'Basic Poison', type: 'consumable', rarity: 'common', iconRef: 'item.veneno_basico', desc: 'Applies Poison to a weapon for 3 turns.', value: 20, themes: ['agua_quimicos'], effect: { applyPoison: 3 } },
  pocion_respiracion: { id: 'pocion_respiracion', name: 'Breathing Potion', type: 'consumable', rarity: 'uncommon', iconRef: 'item.pocion_respiracion', desc: 'Breathe underwater for 10 minutes.', value: 35, themes: ['agua_profunda'], effect: { waterBreathing: 10 } },
  hidromiel: { id: 'hidromiel', name: 'Mead', type: 'consumable', rarity: 'uncommon', iconRef: 'item.hidromiel', desc: '+20% Presence during 1 combat.', value: 25, themes: ['social'], effect: { buffPre: 20, duration: 1 } },
  moneda_antigua: { id: 'moneda_antigua', name: 'Old Coin', type: 'material', rarity: 'common', iconRef: 'item.moneda_antigua', desc: 'Valuable to collectors.', value: 5, themes: ['hallazgos'] },
  moneda_oro: { id: 'moneda_oro', name: 'Gold Coin', type: 'material', rarity: 'uncommon', iconRef: 'item.moneda_oro', desc: 'Pure gold.', value: 25, themes: ['hallazgos', 'comercio'] },
  gema_fuego: { id: 'gema_fuego', name: 'Fire Gem', type: 'material', rarity: 'uncommon', iconRef: 'item.gema_fuego', desc: 'Pulses with inner heat.', value: 40, themes: ['fuego', 'fuego_comida'] },
  fragmento_hielo: { id: 'fragmento_hielo', name: 'Ice Fragment', type: 'material', rarity: 'common', iconRef: 'item.fragmento_hielo', desc: 'It never melts.', value: 15, themes: ['hielo'] },
  fragmento_solar: { id: 'fragmento_solar', name: 'Solar Fragment', type: 'material', rarity: 'uncommon', iconRef: 'item.fragmento_solar', desc: 'It shines even in darkness.', value: 30, themes: ['sol_viento', 'luz'] },
  pluma_viento: { id: 'pluma_viento', name: 'Wind Feather', type: 'material', rarity: 'common', iconRef: 'item.pluma_viento', desc: 'Light as air.', value: 12, themes: ['sol_viento'] },
  especia_rara: { id: 'especia_rara', name: 'Rare Spice', type: 'material', rarity: 'uncommon', iconRef: 'item.especia_rara', desc: 'Improves any recipe.', value: 20, themes: ['fuego_comida'] },
  frasco_vacio: { id: 'frasco_vacio', name: 'Empty Flask', type: 'material', rarity: 'common', iconRef: 'item.frasco_vacio', desc: 'For making potions.', value: 5, themes: ['agua_quimicos'] },
  talisman_oriental: { id: 'talisman_oriental', name: 'Eastern Talisman', type: 'material', rarity: 'rare', iconRef: 'item.talisman_oriental', desc: 'Protects against spirits.', value: 70, themes: ['oriente'] },
  skill_foco_interior: { id: 'skill_foco_interior', name: 'Scroll: Inner Focus', type: 'skill', rarity: 'rare', iconRef: 'item.skill_foco_interior', desc: 'Teaches Inner Focus.', value: 150, themes: ['mente'], teachesSkill: 'foco_interior' },
  skill_llamarada: { id: 'skill_llamarada', name: 'Scroll: Flare', type: 'skill', rarity: 'uncommon', iconRef: 'item.skill_llamarada', desc: 'Teaches Flare.', value: 80, themes: ['fuego'], teachesSkill: 'llamarada' },
  skill_rayo_hielo: { id: 'skill_rayo_hielo', name: 'Scroll: Ice Ray', type: 'skill', rarity: 'uncommon', iconRef: 'item.skill_rayo_hielo', desc: 'Teaches Ice Ray.', value: 80, themes: ['hielo'], teachesSkill: 'rayo_hielo' },
  llave_cofre: { id: 'llave_cofre', name: 'Chest Key', type: 'key', rarity: 'uncommon', iconRef: 'item.llave_cofre', desc: 'Opens found chests.', value: 0, themes: ['comercio', 'hallazgos'], cantSell: true },
  contrato_mercantil: { id: 'contrato_mercantil', name: 'Merchant Contract', type: 'key', rarity: 'rare', iconRef: 'item.contrato_mercantil', desc: 'Improves merchant prices.', value: 0, themes: ['comercio'], cantSell: true, effect: { merchantDiscount: 10 } },
  pocion_vida_menor: { id: 'pocion_vida_menor', name: 'Minor Life Potion', type: 'consumable', rarity: 'common', iconRef: 'item.pocion_vida_menor', desc: 'Restores 40 HP.', value: 18, themes: ['agua_quimicos', 'hallazgos'], effect: { heal: 40 } },
  pocion_fuerza: { id: 'pocion_fuerza', name: 'Strength Potion', type: 'consumable', rarity: 'uncommon', iconRef: 'item.pocion_fuerza', desc: '+3 Strength during 1 combat.', value: 35, themes: ['cuerpo', 'fuego'], effect: { buffFue: 3, duration: 1 } },
  escoba_encantada: { id: 'escoba_encantada', name: 'Enchanted Broom', type: 'artifact', rarity: 'uncommon', iconRef: 'item.escoba_encantada', desc: 'It moves by itself if left alone long enough.', stats: { vol: 2, vit: 1 }, value: 55, themes: ['casa', 'hallazgos'], passive: 'Home: +5% XP on cleaning tasks' },
  nucleo_slime: { id: 'nucleo_slime', name: 'Slime Core', type: 'material', rarity: 'uncommon', iconRef: 'item.nucleo_slime', desc: 'Useful for alchemy.', value: 30, themes: ['agua_quimicos', 'hallazgos'] },
  piel_lobo: { id: 'piel_lobo', name: 'Wolf Hide', type: 'material', rarity: 'uncommon', iconRef: 'item.piel_lobo', desc: 'Thick and warm. It smells of forest and battle.', value: 45, themes: ['naturaleza', 'exploracion'] },
  colmillo_alfa: { id: 'colmillo_alfa', name: 'Alpha Fang', type: 'material', rarity: 'rare', iconRef: 'item.colmillo_alfa', desc: 'Still warm from the fight.', value: 80, themes: ['naturaleza', 'exploracion'] },
  cola_rata: { id: 'cola_rata', name: 'Rat Tail', type: 'material', rarity: 'common', iconRef: 'item.cola_rata', desc: 'Repulsive but useful to alchemists.', value: 4, themes: ['hallazgos', 'agua_quimicos'] },
  seda_arana: { id: 'seda_arana', name: 'Spider Silk', type: 'material', rarity: 'common', iconRef: 'item.seda_arana', desc: 'Stronger than it looks.', value: 8, themes: ['hallazgos', 'agua_quimicos'] },
  objeto_olvidado: { id: 'objeto_olvidado', name: 'Forgotten Object', type: 'material', rarity: 'common', iconRef: 'item.objeto_olvidado', desc: 'Something someone left behind.', value: 6, themes: ['hallazgos'] },
  esencia_espectral: { id: 'esencia_espectral', name: 'Spectral Essence', type: 'material', rarity: 'uncommon', iconRef: 'item.esencia_espectral', desc: 'Cold residue of a dissolved spirit.', value: 35, themes: ['hallazgos'] },
  corazon_bosque: { id: 'corazon_bosque', name: 'Heart of the Forest', type: 'material', rarity: 'rare', iconRef: 'item.corazon_bosque', desc: 'It pulses like an old tree.', value: 90, themes: ['naturaleza'] },
  esencia_vida: { id: 'esencia_vida', name: 'Essence of Life', type: 'material', rarity: 'uncommon', iconRef: 'item.esencia_vida', desc: 'Concentrated vital energy.', value: 40, themes: ['naturaleza'] },
  semilla_rara: { id: 'semilla_rara', name: 'Rare Seed', type: 'material', rarity: 'uncommon', iconRef: 'item.semilla_rara', desc: 'No one knows what it will grow into.', value: 25, themes: ['naturaleza', 'fuego_comida'] },
  amuleto_bosque: { id: 'amuleto_bosque', name: 'Forest Amulet', type: 'accessory', rarity: 'uncommon', iconRef: 'item.amuleto_bosque', desc: 'Carved from living wood.', stats: { vit: 2, vol: 1 }, value: 50, themes: ['naturaleza'] },
  colmillo_hielo: { id: 'colmillo_hielo', name: 'Ice Fang', type: 'material', rarity: 'uncommon', iconRef: 'item.colmillo_hielo', desc: 'Cold as the winter that formed it.', value: 30, themes: ['naturaleza', 'hielo'] },
  corazon_fuego: { id: 'corazon_fuego', name: 'Heart of Fire', type: 'material', rarity: 'rare', iconRef: 'item.corazon_fuego', desc: 'A molten golem core that burns without being consumed.', value: 85, themes: ['fuego', 'fuego_comida'] },
  escama_fuego: { id: 'escama_fuego', name: 'Fire Scale', type: 'material', rarity: 'uncommon', iconRef: 'item.escama_fuego', desc: 'Resistant to extreme heat.', value: 38, themes: ['fuego', 'agua_quimicos'] },
  esencia_agua: { id: 'esencia_agua', name: 'Water Essence', type: 'material', rarity: 'uncommon', iconRef: 'item.esencia_agua', desc: 'Condensed elemental water that never evaporates.', value: 32, themes: ['agua_quimicos', 'agua_profunda'] },
  escama_marina: { id: 'escama_marina', name: 'Sea Scale', type: 'material', rarity: 'uncommon', iconRef: 'item.escama_marina', desc: 'Iridescent and hard. It repels water.', value: 28, themes: ['agua_profunda'] },
  tentaculo_kraken: { id: 'tentaculo_kraken', name: 'Kraken Tentacle', type: 'material', rarity: 'rare', iconRef: 'item.tentaculo_kraken', desc: 'It still moves a little.', value: 75, themes: ['agua_profunda'] },
  pocion_agua_menor: { id: 'pocion_agua_menor', name: 'Minor Water Potion', type: 'consumable', rarity: 'common', iconRef: 'item.pocion_agua_menor', desc: 'Restores 20 HP.', value: 12, themes: ['agua_quimicos'], effect: { heal: 20 } },
  esencia_oscura: { id: 'esencia_oscura', name: 'Dark Essence', type: 'material', rarity: 'rare', iconRef: 'item.esencia_oscura', desc: 'Residue of a materialized nightmare.', value: 80, themes: ['mente', 'destino'] },
  fragmento_sueno: { id: 'fragmento_sueno', name: 'Dream Fragment', type: 'material', rarity: 'uncommon', iconRef: 'item.fragmento_sueno', desc: 'A thought that became solid.', value: 42, themes: ['mente'] },
  pagina_arcana: { id: 'pagina_arcana', name: 'Arcane Page', type: 'material', rarity: 'uncommon', iconRef: 'item.pagina_arcana', desc: 'Torn from a book that did not want to be read.', value: 30, themes: ['conocimiento', 'oriente'] },
  tinta_magica: { id: 'tinta_magica', name: 'Magic Ink', type: 'material', rarity: 'uncommon', iconRef: 'item.tinta_magica', desc: 'It writes by itself on blank parchment.', value: 35, themes: ['conocimiento', 'oriente'] },
  grimorio_antiguo: { id: 'grimorio_antiguo', name: 'Ancient Grimoire', type: 'material', rarity: 'rare', iconRef: 'item.grimorio_antiguo', desc: 'Filled with notes in a forgotten language.', value: 95, themes: ['conocimiento', 'mente'] },
  filacteria: { id: 'filacteria', name: 'Phylactery', type: 'material', rarity: 'epic', iconRef: 'item.filacteria', desc: 'A lich soul vessel. Fragile and dangerous.', value: 200, themes: ['conocimiento', 'mente'] },
  baculo_liche: { id: 'baculo_liche', name: 'Lich Staff', type: 'weapon', rarity: 'epic', iconRef: 'item.baculo_liche', desc: 'Channels death magic.', stats: { int: 6, vol: 3 }, value: 220, themes: ['conocimiento', 'mente'] },
  cola_kitsune: { id: 'cola_kitsune', name: 'Kitsune Tail', type: 'material', rarity: 'rare', iconRef: 'item.cola_kitsune', desc: 'Soft and silver, carrying a trace of illusion.', value: 88, themes: ['oriente'] },
  cuerno_oni: { id: 'cuerno_oni', name: 'Oni Horn', type: 'material', rarity: 'rare', iconRef: 'item.cuerno_oni', desc: 'Hard as steel and smelling of sake.', value: 82, themes: ['oriente', 'mente'] },
  sake_demonio: { id: 'sake_demonio', name: 'Demon Sake', type: 'consumable', rarity: 'uncommon', iconRef: 'item.sake_demonio', desc: '+4 Strength and -2 Intellect during 1 combat.', value: 40, themes: ['oriente', 'fuego_comida'], effect: { buffFue: 4, debuffInt: 2, duration: 1 } },
  botas_viajero: { id: 'botas_viajero', name: 'Wayfarer Boots', type: 'armor', rarity: 'uncommon', iconRef: 'item.botas_viajero', desc: 'Worn by a thousand roads.', stats: { des: 2, vit: 1 }, value: 48, themes: ['exploracion'] },
  caparazon: { id: 'caparazon', name: 'Shell', type: 'material', rarity: 'common', iconRef: 'item.caparazon', desc: 'Hard and light.', value: 14, themes: ['exploracion', 'agua_profunda'] },
  mapa_tesoro: { id: 'mapa_tesoro', name: 'Treasure Map', type: 'key', rarity: 'rare', iconRef: 'item.mapa_tesoro', desc: 'Cryptic marks on old parchment.', value: 100, themes: ['exploracion', 'hallazgos'] },
  daga_oxidada: { id: 'daga_oxidada', name: 'Rusty Dagger', type: 'weapon', rarity: 'common', iconRef: 'item.daga_oxidada', desc: 'Notched and stained, but still sharp.', stats: { fue: 1 }, value: 10, themes: ['exploracion'] },
  daga_asesino: { id: 'daga_asesino', name: 'Assassins Dagger', type: 'weapon', rarity: 'rare', iconRef: 'item.daga_asesino', desc: 'Balanced for throwing.', stats: { des: 4, fue: 2 }, value: 110, themes: ['alianzas', 'exploracion'] },
  capa_sombras: { id: 'capa_sombras', name: 'Shadow Cloak', type: 'armor', rarity: 'rare', iconRef: 'item.capa_sombras', desc: 'It blends with darkness.', stats: { des: 3, pre: 2 }, value: 120, themes: ['alianzas'] },
  contrato_sospechoso: { id: 'contrato_sospechoso', name: 'Suspicious Contract', type: 'key', rarity: 'uncommon', iconRef: 'item.contrato_sospechoso', desc: 'The small print is written in a language that does not exist.', value: 55, themes: ['conocimiento', 'gestiones'] },
  token_amistad: { id: 'token_amistad', name: 'Friendship Token', type: 'material', rarity: 'common', iconRef: 'item.token_amistad', desc: 'A coin engraved with two hands.', value: 15, themes: ['alianzas', 'social'] },
  pluma_grifo: { id: 'pluma_grifo', name: 'Griffin Feather', type: 'material', rarity: 'rare', iconRef: 'item.pluma_grifo', desc: 'Golden and resilient.', value: 78, themes: ['sol_viento', 'exploracion'] },
  veneno_letal: { id: 'veneno_letal', name: 'Deadly Poison', type: 'consumable', rarity: 'rare', iconRef: 'item.veneno_letal', desc: 'Applies severe Poison to a weapon for 5 turns.', value: 90, themes: ['agua_quimicos', 'alianzas'], effect: { applyPoison: 5, poisonDamage: 8 } }
};

const DROP_TABLES = {
  hallazgos: ['moneda_antigua', 'moneda_oro', 'llave_cofre', 'amuleto_espacio', 'objeto_olvidado', 'seda_arana', 'cola_rata', 'esencia_espectral', 'mapa_tesoro'],
  exploracion: ['botas_viajero', 'daga_oxidada', 'caparazon', 'mapa_tesoro', 'pluma_grifo', 'token_amistad'],
  naturaleza: ['hierba_curativa', 'antidoto', 'arco_espino', 'semilla_rara', 'corazon_bosque', 'esencia_vida', 'amuleto_bosque', 'colmillo_hielo'],
  fuego: ['gema_fuego', 'skill_llamarada', 'cuchilla_llameante', 'corazon_fuego', 'escama_fuego'],
  fuego_comida: ['racion_combate', 'gema_fuego', 'especia_rara', 'elixir_vitalidad', 'cuchilla_llameante', 'semilla_rara', 'sake_demonio'],
  agua_quimicos: ['pocion_agua', 'veneno_basico', 'frasco_vacio', 'daga_corrosiva', 'escudo_antiveneno', 'antidoto', 'esencia_agua', 'escama_fuego', 'pocion_agua_menor', 'seda_arana', 'cola_rata'],
  agua_profunda: ['perla_marina', 'tridente_marino', 'escamas_sirena', 'pocion_respiracion', 'escama_marina', 'tentaculo_kraken', 'esencia_oscura', 'caparazon'],
  hielo: ['fragmento_hielo', 'pocion_escarcha', 'hoja_gelida', 'armadura_invierno', 'skill_rayo_hielo', 'colmillo_hielo'],
  sol_viento: ['fragmento_solar', 'pluma_viento', 'amuleto_brisa', 'capa_ligera', 'espada_radiante', 'capa_alba', 'cristal_solar', 'pluma_grifo'],
  luz: ['fragmento_solar', 'cristal_solar', 'espada_radiante', 'capa_alba'],
  mente: ['rosario_concentracion', 'orbe_mental', 'skill_foco_interior', 'fragmento_sueno', 'esencia_oscura', 'pagina_arcana'],
  conocimiento: ['grimorio_arcano', 'grimorio_antiguo', 'pagina_arcana', 'tinta_magica', 'filacteria', 'contrato_sospechoso'],
  oriente: ['cuentas_jade', 'talisman_oriental', 'katana_oriental', 'escama_dragon', 'cola_kitsune', 'cuerno_oni', 'sake_demonio', 'tinta_magica', 'pagina_arcana'],
  social: ['sello_alianza', 'hidromiel', 'token_amistad'],
  alianzas: ['sello_alianza', 'token_amistad', 'contrato_sospechoso', 'daga_asesino', 'capa_sombras', 'veneno_letal'],
  comercio: ['moneda_oro', 'llave_cofre', 'contrato_mercantil', 'contrato_sospechoso'],
  destino: ['dado_destino', 'fragmento_hielo', 'esencia_oscura', 'fragmento_sueno'],
  creacion: ['dado_destino', 'tinta_magica'],
  refugio: ['moneda_antigua', 'objeto_olvidado'],
  descanso: ['hierba_curativa', 'pocion_agua', 'pocion_agua_menor'],
  oro_comercio: ['moneda_oro', 'contrato_mercantil', 'token_amistad']
};

function getInventoryCapacity() {
  let base = 20 + (gameState.inventoryCapacityBonus || 0);
  for (const slot of Object.values(gameState.equipment || {})) {
    const item = slot ? ITEMS[slot] : null;
    if (item?.effect?.inventoryBonus) base += item.effect.inventoryBonus;
  }
  return base;
}

function containerHasSpace(container, itemId) {
  const list = container === 'stash' ? (gameState.stash || []) : (gameState.inventory || []);
  const item = ITEMS[itemId];
  if (!item) return false;
  if ((item.type === 'consumable' || item.type === 'material') && list.some(i => i.id === itemId)) return true;
  return list.length < (container === 'stash' ? (gameState.stashCapacity || 30) : getInventoryCapacity());
}

function addToContainer(itemId, container = 'inventory', quantity = 1) {
  const item = ITEMS[itemId];
  if (!item) return { success: false, reason: 'unknown_item' };
  const list = container === 'stash' ? (gameState.stash || (gameState.stash = [])) : (gameState.inventory || (gameState.inventory = []));
  if (!containerHasSpace(container, itemId)) return { success: false, reason: 'full' };
  if (item.type === 'consumable' || item.type === 'material') {
    const existing = list.find(i => i.id === itemId);
    if (existing) { existing.qty = (existing.qty || 1) + quantity; return { success: true, stacked: true }; }
  }
  list.push({ id: itemId, qty: quantity });
  return { success: true, stacked: false };
}

function addToInventory(itemId, quantity = 1) { return addToContainer(itemId, 'inventory', quantity).success; }
function getItemCount(itemId) { const slot = (gameState.inventory || []).find(i => i.id === itemId); return slot ? (slot.qty || 1) : 0; }
function removeFromInventory(itemId, quantity = 1) {
  const index = (gameState.inventory || []).findIndex(i => i.id === itemId);
  if (index === -1) return false;
  const slot = gameState.inventory[index];
  slot.qty = (slot.qty || 1) - quantity;
  if (slot.qty <= 0) gameState.inventory.splice(index, 1);
  return true;
}

// equipItem and unequipItem are defined in item_system.js (canonical, with attunement/curse checks).
// DT-04 resolved: legacy stubs removed from items.js.

function getEquipmentStats() {
  const stats = { fue: 0, vit: 0, des: 0, int: 0, vol: 0, pre: 0 };
  for (const itemId of Object.values(gameState.equipment || {})) {
    const item = itemId ? ITEMS[itemId] : null;
    if (item && item.stats) for (const [stat, value] of Object.entries(item.stats)) stats[stat] = (stats[stat] || 0) + value;
  }
  return stats;
}

// rollDropByTheme: canonical drop-by-theme function (renamed from rollDrop to avoid collision
// with ui_tasks.js rollDrop(task, sideQuestCompleted) which loads after this file).
// DT-10 resolved: name collision eliminated; window._itemsRollDrop alias removed.
function rollDropByTheme(theme, bonusChance = 0) {
  const baseChance = 0.40 + bonusChance;
  if (Math.random() > baseChance) return null;
  const pool = DROP_TABLES[theme];
  if (!pool || !pool.length) return null;
  const weighted = [];
  for (const itemId of pool) {
    const item = ITEMS[itemId];
    if (!item) continue;
    const rarity = RARITY[item.rarity] || RARITY.common;
    const weight = Math.max(1, Math.floor(rarity.dropRate * 1000));
    for (let i = 0; i < weight; i++) weighted.push(itemId);
  }
  if (!weighted.length) return null;
  const itemId = weighted[Math.floor(Math.random() * weighted.length)];
  const item = ITEMS[itemId];
  const rarityOrder = ['common', 'uncommon', 'rare', 'epic', 'legendary'];
  let finalRarity = item.rarity;
  if (Math.random() < 0.05 + bonusChance * 0.5) {
    const idx = rarityOrder.indexOf(finalRarity);
    if (idx < rarityOrder.length - 1) finalRarity = rarityOrder[idx + 1];
  }
  return { itemId, rarity: finalRarity };
}

function sellItem(itemId, quantity = 1) {
  const item = ITEMS[itemId];
  if (!item || item.cantSell) return 0;
  const count = getItemCount(itemId);
  const toSell = Math.min(count, quantity);
  if (toSell <= 0) return 0;
  const rarity = RARITY[item.rarity] || RARITY.common;
  const gold = Math.floor(item.value * rarity.sellMult * 0.3 * toSell);
  removeFromInventory(itemId, toSell);
  gameState.gold += gold;
  return gold;
}

// rollDropByTheme is the canonical drop-by-theme function.
// Exposed globally so ui_tasks.js can access it despite its own rollDrop(task) function.
if (typeof window !== 'undefined') window.rollDropByTheme = rollDropByTheme;
