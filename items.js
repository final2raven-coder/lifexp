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
  weapon: { name: 'Weapon', icon: 'SWORD', slot: 'weapon' },
  armor: { name: 'Armor', icon: 'SHIELD', slot: 'armor' },
  accessory: { name: 'Accessory', icon: 'RING', slot: 'accessory' },
  artifact: { name: 'Artifact', icon: 'ORB', slot: 'artifact' },
  consumable: { name: 'Consumable', icon: 'POTION', slot: null },
  material: { name: 'Material', icon: 'BOX', slot: null },
  skill: { name: 'Skill', icon: 'SCROLL', slot: null },
  key: { name: 'Quest Item', icon: 'KEY', slot: null }
};

const ITEMS = {
  daga_corrosiva: {
    id: 'daga_corrosiva', name: 'Greenbite', type: 'weapon', rarity: 'uncommon',
    icon: 'DAGGER', lore: 'A narrow blade kept in a waxed leather sheath. The edge leaves a green stain on anything it cuts.',
    desc: 'A narrow blade kept in a waxed leather sheath. The edge leaves a green stain on anything it cuts.',
    stats: { fue: 3, des: 2 }, value: 50, themes: ['agua_quimicos']
  },
  cuchilla_llameante: {
    id: 'cuchilla_llameante', name: 'Ashbrand', type: 'weapon', rarity: 'common',
    icon: 'FIRE', lore: 'Ashbrand remembers a fire that refused to become a ruin.',
    desc: 'A short sword taken from a shrine after the fire had gone out. The blade is warm. It does not glow.',
    stats: {}, value: 25, themes: ['fuego', 'fuego_comida', 'ash']
  },
  espada_radiante: { id: 'espada_radiante', name: 'Radiant Sword', type: 'weapon', rarity: 'rare', icon: 'SWORD', desc: 'A blade that catches the morning light.', stats: { fue: 4, pre: 2 }, value: 125, themes: ['sol_viento'] },
  hoja_gelida: { id: 'hoja_gelida', name: 'Frostblade', type: 'weapon', rarity: 'rare', icon: 'ICE', desc: 'Cold enough to numb the hand.', stats: { des: 3, int: 2 }, value: 120, themes: ['hielo'] },
  arco_espino: { id: 'arco_espino', name: 'Thornbow', type: 'weapon', rarity: 'uncommon', icon: 'BOW', desc: 'A bow grown rather than made.', stats: { des: 3 }, value: 65, themes: ['naturaleza'] },
  tridente_marino: { id: 'tridente_marino', name: 'Sea Trident', type: 'weapon', rarity: 'rare', icon: 'TRIDENT', desc: 'A three-pronged weapon from the deep.', stats: { fue: 3, vit: 2 }, value: 135, themes: ['agua_profunda'] },
  katana_oriental: { id: 'katana_oriental', name: 'Eastern Katana', type: 'weapon', rarity: 'rare', icon: 'KATANA', desc: 'A precise blade with a quiet edge.', stats: { des: 4 }, value: 140, themes: ['oriente'] },
  talisman_espiritu: { id: 'talisman_espiritu', name: 'Spirit Talisman', type: 'accessory', rarity: 'rare', icon: 'TALISMAN', desc: 'A charm against restless spirits.', stats: { vol: 3, int: 1 }, value: 100, themes: ['oriente', 'mente'] },
  amuleto_espacio: { id: 'amuleto_espacio', name: 'Space Amulet', type: 'accessory', rarity: 'epic', icon: 'AMULET', desc: 'Its surface contains more distance than it should.', stats: { int: 4, vol: 2 }, value: 210, themes: ['destino', 'hallazgos'] },
  escudo_antiveneno: { id: 'escudo_antiveneno', name: 'Antivenom Shield', type: 'armor', rarity: 'rare', icon: 'SHIELD', desc: 'A shield layered with protective resin.', stats: { vit: 4 }, value: 115, themes: ['agua_quimicos'] },
  armadura_cuero: { id: 'armadura_cuero', name: 'Leather Armor', type: 'armor', rarity: 'common', icon: 'ARMOR', desc: 'Simple protection for the road.', stats: { vit: 2 }, value: 30, themes: ['exploracion'] },
  racion_combate: { id: 'racion_combate', name: 'Combat Ration', type: 'consumable', rarity: 'common', icon: 'FOOD', desc: 'Restores 15 HP.', value: 8, themes: ['fuego_comida'], effect: { heal: 15 } },
  elixir_vitalidad: { id: 'elixir_vitalidad', name: 'Vitality Elixir', type: 'consumable', rarity: 'rare', icon: 'ELIXIR', desc: 'Restores 100 HP.', value: 90, themes: ['cuerpo'], effect: { heal: 100 } },
  pocion_agua: { id: 'pocion_agua', name: 'Water Potion', type: 'consumable', rarity: 'common', icon: 'BUBBLE', desc: 'Restores 25 HP.', value: 15, themes: ['agua_quimicos'], effect: { heal: 25 } },
  veneno_basico: { id: 'veneno_basico', name: 'Basic Poison', type: 'consumable', rarity: 'common', icon: 'POISON', desc: 'Deals 10 damage over time.', value: 18, themes: ['agua_quimicos'], effect: { poison: 10, duration: 3 } },
  antidoto: { id: 'antidoto', name: 'Antidote', type: 'consumable', rarity: 'common', icon: 'ANTIDOTE', desc: 'Removes poison.', value: 20, themes: ['agua_quimicos'], effect: { curePoison: true } },
  frasco_vacio: { id: 'frasco_vacio', name: 'Empty Flask', type: 'material', rarity: 'common', icon: 'FLASK', desc: 'For making potions.', value: 5, themes: ['agua_quimicos'] },
  daga_oxidada: { id: 'daga_oxidada', name: 'Rusty Dagger', type: 'weapon', rarity: 'common', icon: 'DAGGER', desc: 'Notched and stained, but still sharp.', stats: { fue: 1 }, value: 10, themes: ['exploracion'] },
  mapa_tesoro: { id: 'mapa_tesoro', name: 'Treasure Map', type: 'key', rarity: 'rare', icon: 'MAP', desc: 'Cryptic marks on old parchment.', value: 100, themes: ['exploracion', 'hallazgos'] },
  llave_cofre: { id: 'llave_cofre', name: 'Chest Key', type: 'key', rarity: 'uncommon', icon: 'KEY', desc: 'Opens found chests.', value: 0, themes: ['comercio', 'hallazgos'], cantSell: true },
  moneda_antigua: { id: 'moneda_antigua', name: 'Ancient Coin', type: 'material', rarity: 'common', icon: 'COIN', desc: 'An old coin with a worn face.', value: 12, themes: ['hallazgos'] },
  moneda_oro: { id: 'moneda_oro', name: 'Gold Coin', type: 'material', rarity: 'uncommon', icon: 'GOLD', desc: 'A bright coin.', value: 25, themes: ['hallazgos'] },
  cola_rata: { id: 'cola_rata', name: 'Rat Tail', type: 'material', rarity: 'common', icon: 'RAT', desc: 'Repulsive but useful to alchemists.', value: 4, themes: ['hallazgos', 'agua_quimicos'] },
  seda_arana: { id: 'seda_arana', name: 'Spider Silk', type: 'material', rarity: 'common', icon: 'WEB', desc: 'Stronger than it looks.', value: 8, themes: ['hallazgos', 'agua_quimicos'] },
  objeto_olvidado: { id: 'objeto_olvidado', name: 'Forgotten Object', type: 'material', rarity: 'common', icon: 'BOX', desc: 'Something someone left behind.', value: 6, themes: ['hallazgos'] },
  esencia_espectral: { id: 'esencia_espectral', name: 'Spectral Essence', type: 'material', rarity: 'uncommon', icon: 'GHOST', desc: 'Cold residue of a dissolved spirit.', value: 35, themes: ['hallazgos'] },
  nucleo_slime: { id: 'nucleo_slime', name: 'Slime Core', type: 'material', rarity: 'uncommon', icon: 'SLIME', desc: 'Useful for alchemy.', value: 30, themes: ['agua_quimicos', 'hallazgos'] },
  fragmento_sueno: { id: 'fragmento_sueno', name: 'Dream Fragment', type: 'material', rarity: 'uncommon', icon: 'DREAM', desc: 'A thought that became solid.', value: 42, themes: ['mente'] },
  pagina_arcana: { id: 'pagina_arcana', name: 'Arcane Page', type: 'material', rarity: 'uncommon', icon: 'PAGE', desc: 'Torn from a book that did not want to be read.', value: 30, themes: ['conocimiento', 'oriente'] },
  tinta_magica: { id: 'tinta_magica', name: 'Magic Ink', type: 'material', rarity: 'uncommon', icon: 'INK', desc: 'It writes by itself on blank parchment.', value: 35, themes: ['conocimiento', 'oriente'] },
  grimorio_antiguo: { id: 'grimorio_antiguo', name: 'Ancient Grimoire', type: 'material', rarity: 'rare', icon: 'BOOK', desc: 'Filled with notes in a forgotten language.', value: 95, themes: ['conocimiento', 'mente'] },
  filacteria: { id: 'filacteria', name: 'Phylactery', type: 'material', rarity: 'epic', icon: 'SKULL', desc: 'A lich soul vessel. Fragile and dangerous.', value: 200, themes: ['conocimiento', 'mente'] },
  baculo_liche: { id: 'baculo_liche', name: 'Lich Staff', type: 'weapon', rarity: 'epic', icon: 'STAFF', desc: 'Channels death magic.', stats: { int: 6, vol: 3 }, value: 220, themes: ['conocimiento', 'mente'] },
  botas_viajero: { id: 'botas_viajero', name: 'Wayfarer Boots', type: 'armor', rarity: 'uncommon', icon: 'BOOTS', desc: 'Worn by a thousand roads.', stats: { des: 2, vit: 1 }, value: 48, themes: ['exploracion'] },
  caparazon: { id: 'caparazon', name: 'Shell', type: 'material', rarity: 'common', icon: 'SHELL', desc: 'Hard and light.', value: 14, themes: ['exploracion', 'agua_profunda'] },
  piel_lobo: { id: 'piel_lobo', name: 'Wolf Hide', type: 'material', rarity: 'uncommon', icon: 'HIDE', desc: 'Thick and warm. It smells of forest and battle.', value: 45, themes: ['naturaleza', 'exploracion'] },
  colmillo_alfa: { id: 'colmillo_alfa', name: 'Alpha Fang', type: 'material', rarity: 'rare', icon: 'FANG', desc: 'Still warm from the fight.', value: 80, themes: ['naturaleza', 'exploracion'] },
  corazon_bosque: { id: 'corazon_bosque', name: 'Heart of the Forest', type: 'material', rarity: 'rare', icon: 'TREE', desc: 'It pulses like an old tree.', value: 90, themes: ['naturaleza'] },
  esencia_vida: { id: 'esencia_vida', name: 'Essence of Life', type: 'material', rarity: 'uncommon', icon: 'LIFE', desc: 'Concentrated vital energy.', value: 40, themes: ['naturaleza'] },
  semilla_rara: { id: 'semilla_rara', name: 'Rare Seed', type: 'material', rarity: 'uncommon', icon: 'SEED', desc: 'No one knows what it will grow into.', value: 25, themes: ['naturaleza', 'fuego_comida'] },
  amuleto_bosque: { id: 'amuleto_bosque', name: 'Forest Amulet', type: 'accessory', rarity: 'uncommon', icon: 'LEAF', desc: 'Carved from living wood.', stats: { vit: 2, vol: 1 }, value: 50, themes: ['naturaleza'] },
  colmillo_hielo: { id: 'colmillo_hielo', name: 'Ice Fang', type: 'material', rarity: 'uncommon', icon: 'FANG', desc: 'Cold as the winter that formed it.', value: 30, themes: ['naturaleza', 'hielo'] },
  corazon_fuego: { id: 'corazon_fuego', name: 'Heart of Fire', type: 'material', rarity: 'rare', icon: 'FIRE', desc: 'A molten golem core that burns without being consumed.', value: 85, themes: ['fuego', 'fuego_comida'] },
  escama_fuego: { id: 'escama_fuego', name: 'Fire Scale', type: 'material', rarity: 'uncommon', icon: 'SCALE', desc: 'Resistant to extreme heat.', value: 38, themes: ['fuego', 'agua_quimicos'] },
  esencia_agua: { id: 'esencia_agua', name: 'Water Essence', type: 'material', rarity: 'uncommon', icon: 'WATER', desc: 'Condensed elemental water that never evaporates.', value: 32, themes: ['agua_quimicos', 'agua_profunda'] },
  escama_marina: { id: 'escama_marina', name: 'Sea Scale', type: 'material', rarity: 'uncommon', icon: 'SCALE', desc: 'Iridescent and hard. It repels water.', value: 28, themes: ['agua_profunda'] },
  tentaculo_kraken: { id: 'tentaculo_kraken', name: 'Kraken Tentacle', type: 'material', rarity: 'rare', icon: 'TENTACLE', desc: 'It still moves a little.', value: 75, themes: ['agua_profunda'] },
  pocion_agua_menor: { id: 'pocion_agua_menor', name: 'Minor Water Potion', type: 'consumable', rarity: 'common', icon: 'BUBBLE', desc: 'Restores 20 HP.', value: 12, themes: ['agua_quimicos'], effect: { heal: 20 } },
  esencia_oscura: { id: 'esencia_oscura', name: 'Dark Essence', type: 'material', rarity: 'rare', icon: 'DARK', desc: 'Residue of a materialized nightmare.', value: 80, themes: ['mente', 'destino'] },
  cola_kitsune: { id: 'cola_kitsune', name: 'Kitsune Tail', type: 'material', rarity: 'rare', icon: 'FOX', desc: 'Soft and silver, carrying a trace of illusion.', value: 88, themes: ['oriente'] },
  cuerno_oni: { id: 'cuerno_oni', name: 'Oni Horn', type: 'material', rarity: 'rare', icon: 'HORN', desc: 'Hard as steel and smelling of sake.', value: 82, themes: ['oriente', 'mente'] },
  sake_demonio: { id: 'sake_demonio', name: 'Demon Sake', type: 'consumable', rarity: 'uncommon', icon: 'SAKE', desc: '+4 Strength and -2 Intellect during 1 combat.', value: 40, themes: ['oriente', 'fuego_comida'], effect: { buffFue: 4, debuffInt: 2, duration: 1 } },
  contrato_mercantil: { id: 'contrato_mercantil', name: 'Merchant Contract', type: 'key', rarity: 'rare', icon: 'CONTRACT', desc: 'Improves merchant prices.', value: 0, themes: ['comercio'], cantSell: true, effect: { merchantDiscount: 10 } },
  pocion_vida_menor: { id: 'pocion_vida_menor', name: 'Minor Life Potion', type: 'consumable', rarity: 'common', icon: 'POTION', desc: 'Restores 40 HP.', value: 18, themes: ['agua_quimicos', 'hallazgos'], effect: { heal: 40 } },
  pocion_fuerza: { id: 'pocion_fuerza', name: 'Strength Potion', type: 'consumable', rarity: 'uncommon', icon: 'STRENGTH', desc: '+3 Strength during 1 combat.', value: 35, themes: ['cuerpo', 'fuego'], effect: { buffFue: 3, duration: 1 } },
  escoba_encantada: { id: 'escoba_encantada', name: 'Enchanted Broom', type: 'artifact', rarity: 'uncommon', icon: 'BROOM', desc: 'It moves by itself if left alone long enough.', stats: { vol: 2, vit: 1 }, value: 55, themes: ['casa', 'hallazgos'], passive: 'Home: +5% XP on cleaning tasks' },
  daga_asesino: { id: 'daga_asesino', name: 'Assassins Dagger', type: 'weapon', rarity: 'rare', icon: 'DAGGER', desc: 'Balanced for throwing.', stats: { des: 4, fue: 2 }, value: 110, themes: ['alianzas', 'exploracion'] },
  gema_fuego: { id: 'gema_fuego', name: 'Fire Gem', type: 'material', rarity: 'rare', icon: 'GEM', desc: 'A ruby that holds a small flame.', value: 65, themes: ['fuego', 'fuego_comida'] },
  especia_rara: { id: 'especia_rara', name: 'Rare Spice', type: 'material', rarity: 'uncommon', icon: 'SPICE', desc: 'Improves any recipe.', value: 20, themes: ['fuego_comida'] },
  mapa_antiguo: { id: 'mapa_antiguo', name: 'Old Map', type: 'key', rarity: 'uncommon', icon: 'MAP', desc: 'A map with routes that no longer exist.', value: 35, themes: ['exploracion'] },
  frasco_veneno: { id: 'frasco_veneno', name: 'Poison Flask', type: 'consumable', rarity: 'uncommon', icon: 'POISON', desc: 'A stronger poison.', value: 35, themes: ['agua_quimicos'], effect: { poison: 20, duration: 3 } },
  escudo_basico: { id: 'escudo_basico', name: 'Basic Shield', type: 'armor', rarity: 'common', icon: 'SHIELD', desc: 'Reliable protection.', stats: { vit: 2 }, value: 25, themes: ['cuerpo'] },
  skill_foco_interior: { id: 'skill_foco_interior', name: 'Scroll: Inner Focus', type: 'skill', rarity: 'rare', icon: 'SCROLL', desc: 'Teaches Inner Focus.', value: 150, themes: ['mente'], teachesSkill: 'foco_interior' },
  skill_llamarada: { id: 'skill_llamarada', name: 'Scroll: Flare', type: 'skill', rarity: 'uncommon', icon: 'SCROLL', desc: 'Teaches Flare.', value: 80, themes: ['fuego'], teachesSkill: 'llamarada' },
  skill_rayo_hielo: { id: 'skill_rayo_hielo', name: 'Scroll: Ice Ray', type: 'skill', rarity: 'uncommon', icon: 'SCROLL', desc: 'Teaches Ice Ray.', value: 80, themes: ['hielo'], teachesSkill: 'rayo_hielo' }
};

const DROP_TABLES = {
  hallazgos: ['moneda_antigua', 'moneda_oro', 'llave_cofre', 'amuleto_espacio', 'objeto_olvidado', 'seda_arana', 'cola_rata', 'esencia_espectral', 'mapa_tesoro'],
  exploracion: ['botas_viajero', 'daga_oxidada', 'caparazon', 'mapa_tesoro', 'piel_lobo', 'colmillo_alfa', 'daga_asesino'],
  fuego_comida: ['racion_combate', 'gema_fuego', 'especia_rara', 'elixir_vitalidad', 'cuchilla_llameante', 'semilla_rara', 'sake_demonio'],
  agua_quimicos: ['pocion_agua', 'veneno_basico', 'frasco_vacio', 'escudo_antiveneno', 'antidoto', 'esencia_agua', 'pocion_agua_menor', 'seda_arana', 'frasco_veneno'],
  naturaleza: ['piel_lobo', 'colmillo_alfa', 'corazon_bosque', 'esencia_vida', 'semilla_rara', 'amuleto_bosque', 'colmillo_hielo'],
  hielo: ['hoja_gelida', 'colmillo_hielo', 'skill_rayo_hielo'],
  mente: ['esencia_oscura', 'fragmento_sueno', 'grimorio_antiguo', 'filacteria', 'baculo_liche', 'skill_foco_interior'],
  oriente: ['talisman_oriental', 'cola_kitsune', 'cuerno_oni', 'sake_demonio', 'katana_oriental'],
  agua_profunda: ['tridente_marino', 'escama_marina', 'tentaculo_kraken', 'esencia_agua', 'caparazon'],
  sol_viento: ['pluma_viento', 'espada_radiante'],
  conocimiento: ['pagina_arcana', 'tinta_magica', 'grimorio_antiguo', 'skill_foco_interior']
};

function initializeItemSystem() {
  if (typeof gameState === 'undefined') return;
  if (!Array.isArray(gameState.inventory)) gameState.inventory = [];
  if (!Array.isArray(gameState.stash)) gameState.stash = [];
  if (!gameState.equipment || typeof gameState.equipment !== 'object') {
    gameState.equipment = { weapon: null, armor: null, accessory1: null, accessory2: null, artifact: null };
  }
}

function addToInventory(itemId, quantity = 1) {
  if (typeof gameState === 'undefined' || !ITEMS[itemId]) return false;
  initializeItemSystem();
  const existing = gameState.inventory.find(x => x && x.id === itemId);
  if (existing) existing.quantity = (existing.quantity || 1) + quantity;
  else gameState.inventory.push({ id: itemId, quantity });
  return true;
}

function removeFromInventory(itemId, quantity = 1) {
  if (typeof gameState === 'undefined') return false;
  initializeItemSystem();
  const index = gameState.inventory.findIndex(x => x && x.id === itemId);
  if (index < 0) return false;
  const entry = gameState.inventory[index];
  entry.quantity = (entry.quantity || 1) - quantity;
  if (entry.quantity <= 0) gameState.inventory.splice(index, 1);
  return true;
}

function canAddToInventory() { return typeof gameState !== 'undefined'; }

function equipItem(itemId) {
  if (typeof gameState === 'undefined') return false;
  const item = ITEMS[itemId];
  if (!item || !item.type) return false;
  const type = ITEM_TYPE[item.type];
  if (!type || !type.slot) return false;
  let slot = type.slot;
  if (slot === 'accessory') {
    if (!gameState.equipment.accessory1) slot = 'accessory1';
    else if (!gameState.equipment.accessory2) slot = 'accessory2';
    else slot = 'accessory1';
  }
  const current = gameState.equipment[slot];
  if (current) addToInventory(current);
  removeFromInventory(itemId);
  gameState.equipment[slot] = itemId;
  return true;
}

function unequipItem(slot) {
  const itemId = gameState.equipment[slot];
  if (!itemId || !canAddToInventory()) return false;
  addToInventory(itemId);
  gameState.equipment[slot] = null;
  return true;
}

function getEquipmentStats() {
  const stats = { fue: 0, vit: 0, des: 0, int: 0, vol: 0, pre: 0 };
  for (const itemId of Object.values(gameState.equipment || {})) {
    const item = itemId && ITEMS[itemId];
    if (item && item.stats) for (const [stat, value] of Object.entries(item.stats)) stats[stat] = (stats[stat] || 0) + value;
  }
  return stats;
}

function rollDrop(theme, bonusChance = 0) {
  const baseChance = 0.40 + bonusChance;
  if (Math.random() > baseChance) return null;
  const pool = DROP_TABLES[theme];
  if (!pool || !pool.length) return null;
  return pool[Math.floor(Math.random() * pool.length)];
}

function sellItem(itemId, quantity = 1) {
  if (typeof gameState === 'undefined' || !ITEMS[itemId] || ITEMS[itemId].cantSell) return 0;
  const item = ITEMS[itemId];
  if (!removeFromInventory(itemId, quantity)) return 0;
  const gold = Math.floor((item.value || 0) * quantity * 0.5);
  gameState.gold = (gameState.gold || 0) + gold;
  return gold;
}

if (typeof window !== 'undefined') window._itemsRollDrop = rollDrop;
