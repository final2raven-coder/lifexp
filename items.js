// ═══════════════════════════════════════════════════════════════════════════
// LifeXP RPG - Items & Inventory System (Block 3)
// ═══════════════════════════════════════════════════════════════════════════

// ═══════════════════════════════════════════════════════════════════════════
// ITEM RARITIES
// ═══════════════════════════════════════════════════════════════════════════

const RARITY = {
  common:    { name: 'Común',       color: '#9ca3af', dropRate: 0.30, sellMult: 1.0 },
  uncommon:  { name: 'Poco común',  color: '#4ade80', dropRate: 0.15, sellMult: 1.5 },
  rare:      { name: 'Raro',        color: '#60a5fa', dropRate: 0.05, sellMult: 3.0 },
  epic:      { name: 'Épico',       color: '#a855f7', dropRate: 0.01, sellMult: 8.0 },
  legendary: { name: 'Legendario',  color: '#f59e0b', dropRate: 0.001, sellMult: 25.0 }
};

// ═══════════════════════════════════════════════════════════════════════════
// ITEM TYPES
// ═══════════════════════════════════════════════════════════════════════════

const ITEM_TYPE = {
  weapon:     { name: 'Arma',       icon: '⚔️', slot: 'weapon' },
  armor:      { name: 'Armadura',   icon: '🛡️', slot: 'armor' },
  accessory:  { name: 'Accesorio',  icon: '💍', slot: 'accessory' },
  artifact:   { name: 'Artefacto',  icon: '🔮', slot: 'artifact' },
  consumable: { name: 'Consumible', icon: '🧪', slot: null },
  material:   { name: 'Material',   icon: '📦', slot: null },
  skill:      { name: 'Habilidad',  icon: '📜', slot: null },
  key:        { name: 'Llave/Quest',icon: '🔑', slot: null }
};

// ═══════════════════════════════════════════════════════════════════════════
// ITEM DATABASE
// ═══════════════════════════════════════════════════════════════════════════

const ITEMS = {
  // ══════════ ARMAS ══════════
  // Agua/Químicos
  daga_corrosiva: {
    id: 'daga_corrosiva', name: 'Daga Corrosiva', type: 'weapon', rarity: 'uncommon',
    icon: '🗡️', desc: 'El ácido corroe la hoja... y a tus enemigos.',
    stats: { fue: 3, des: 2 }, value: 50, themes: ['agua_quimicos']
  },
  // Fuego
  cuchilla_llameante: {
    id: 'cuchilla_llameante', name: 'Cuchilla Llameante', type: 'weapon', rarity: 'rare',
    icon: '🔥', desc: 'Forjada en las llamas del hogar.',
    stats: { fue: 5, int: 2 }, value: 120, themes: ['fuego', 'fuego_comida']
  },
  espada_radiante: {
    id: 'espada_radiante', name: 'Espada Radiante', type: 'weapon', rarity: 'rare',
    icon: '✨', desc: 'Brilla con la luz del sol atrapada.',
    stats: { fue: 4, vol: 3 }, value: 150, themes: ['sol_viento', 'luz']
  },
  hoja_gelida: {
    id: 'hoja_gelida', name: 'Hoja Gélida', type: 'weapon', rarity: 'uncommon',
    icon: '❄️', desc: 'Fría al tacto, letal en combate.',
    stats: { fue: 3, int: 3 }, value: 80, themes: ['hielo']
  },
  arco_espino: {
    id: 'arco_espino', name: 'Arco de Espino', type: 'weapon', rarity: 'uncommon',
    icon: '🏹', desc: 'Tallado de un árbol antiguo.',
    stats: { des: 5, vit: 1 }, value: 70, themes: ['naturaleza']
  },
  tridente_marino: {
    id: 'tridente_marino', name: 'Tridente Marino', type: 'weapon', rarity: 'rare',
    icon: '🔱', desc: 'Del fondo del mar a tus manos.',
    stats: { fue: 4, des: 3 }, value: 140, themes: ['agua_profunda']
  },
  katana_oriental: {
    id: 'katana_oriental', name: 'Katana Oriental', type: 'weapon', rarity: 'rare',
    icon: '⚔️', desc: 'Forjada por maestros del Este.',
    stats: { des: 6, fue: 2 }, value: 160, themes: ['oriente']
  },

  // ══════════ ARMADURAS ══════════
  escudo_antiveneno: {
    id: 'escudo_antiveneno', name: 'Escudo Antiveneno', type: 'armor', rarity: 'uncommon',
    icon: '🛡️', desc: 'Protege contra toxinas.',
    stats: { vit: 4, vol: 2 }, value: 60, themes: ['agua_quimicos']
  },
  armadura_invierno: {
    id: 'armadura_invierno', name: 'Armadura de Invierno', type: 'armor', rarity: 'rare',
    icon: '🧥', desc: 'El frío no te afectará.',
    stats: { vit: 5, vol: 2 }, value: 130, themes: ['hielo']
  },
  capa_alba: {
    id: 'capa_alba', name: 'Capa del Alba', type: 'armor', rarity: 'rare',
    icon: '🌅', desc: 'Tejida con los primeros rayos del sol.',
    stats: { des: 3, pre: 3 }, value: 110, themes: ['sol_viento', 'luz']
  },
  capa_ligera: {
    id: 'capa_ligera', name: 'Capa Ligera', type: 'armor', rarity: 'common',
    icon: '🧣', desc: 'Ligera como una brisa.',
    stats: { des: 2, vit: 1 }, value: 25, themes: ['sol_viento']
  },
  escamas_sirena: {
    id: 'escamas_sirena', name: 'Escamas de Sirena', type: 'armor', rarity: 'epic',
    icon: '🧜', desc: 'Protección del reino submarino.',
    stats: { vit: 6, des: 4, pre: 2 }, value: 400, themes: ['agua_profunda']
  },

  // ══════════ ACCESORIOS ══════════
  amuleto_brisa: {
    id: 'amuleto_brisa', name: 'Amuleto de Brisa', type: 'accessory', rarity: 'common',
    icon: '💨', desc: 'Susurra secretos del viento.',
    stats: { des: 2 }, value: 20, themes: ['sol_viento']
  },
  cristal_solar: {
    id: 'cristal_solar', name: 'Cristal Solar', type: 'accessory', rarity: 'uncommon',
    icon: '☀️', desc: 'Almacena la energía del sol.',
    stats: { int: 3, vol: 1 }, value: 45, themes: ['sol_viento', 'luz']
  },
  perla_marina: {
    id: 'perla_marina', name: 'Perla Marina', type: 'accessory', rarity: 'rare',
    icon: '🔵', desc: 'Del fondo del océano.',
    stats: { int: 4, pre: 2 }, value: 100, themes: ['agua_profunda']
  },
  rosario_concentracion: {
    id: 'rosario_concentracion', name: 'Rosario de Concentración', type: 'accessory', rarity: 'uncommon',
    icon: '📿', desc: 'Cada cuenta es un momento de paz.',
    stats: { vol: 4 }, value: 55, themes: ['mente']
  },
  cuentas_jade: {
    id: 'cuentas_jade', name: 'Cuentas de Jade', type: 'accessory', rarity: 'rare',
    icon: '🟢', desc: 'Traídas del lejano Este.',
    stats: { vol: 3, pre: 3 }, value: 90, themes: ['oriente']
  },
  sello_alianza: {
    id: 'sello_alianza', name: 'Sello de Alianza', type: 'accessory', rarity: 'uncommon',
    icon: '💍', desc: 'Símbolo de amistad verdadera.',
    stats: { pre: 4 }, value: 50, themes: ['social']
  },
  amuleto_espacio: {
    id: 'amuleto_espacio', name: 'Amuleto de Espacio', type: 'accessory', rarity: 'rare',
    icon: '🌀', desc: 'Contiene más de lo que parece.',
    stats: { int: 2, vol: 2 }, value: 80, themes: ['hallazgos'],
    effect: { inventoryBonus: 5 }
  },

  // ══════════ ARTEFACTOS ══════════
  orbe_mental: {
    id: 'orbe_mental', name: 'Orbe Mental', type: 'artifact', rarity: 'rare',
    icon: '🔮', desc: 'Amplifica el poder de la mente.',
    stats: { int: 5, vol: 5 }, value: 200, themes: ['mente'],
    passive: 'Meditación: +10% XP de tareas de Voluntad'
  },
  dado_destino: {
    id: 'dado_destino', name: 'Dado del Destino', type: 'artifact', rarity: 'epic',
    icon: '🎲', desc: 'El azar te favorece.',
    stats: { des: 3, pre: 3 }, value: 350, themes: ['creacion'],
    passive: 'Fortuna: +15% probabilidad de drops'
  },
  escama_dragon: {
    id: 'escama_dragon', name: 'Escama de Dragón', type: 'artifact', rarity: 'epic',
    icon: '🐉', desc: 'Del dragón que vive en tu interior.',
    stats: { fue: 4, vit: 4, int: 2 }, value: 500, themes: ['oriente'],
    passive: 'Aliento Dragón: +20% daño de fuego'
  },
  grimorio_arcano: {
    id: 'grimorio_arcano', name: 'Grimorio Arcano', type: 'artifact', rarity: 'rare',
    icon: '📕', desc: 'Contiene secretos olvidados.',
    stats: { int: 8 }, value: 250, themes: ['conocimiento'],
    passive: 'Sabiduría: Desbloquea habilidades mágicas extra'
  },

  // ══════════ CONSUMIBLES ══════════
  pocion_agua: {
    id: 'pocion_agua', name: 'Poción de Agua', type: 'consumable', rarity: 'common',
    icon: '💧', desc: 'Restaura 50 HP.',
    value: 10, themes: ['agua', 'agua_quimicos'],
    effect: { heal: 50 }
  },
  pocion_escarcha: {
    id: 'pocion_escarcha', name: 'Poción de Escarcha', type: 'consumable', rarity: 'uncommon',
    icon: '❄️', desc: 'Congela al enemigo 1 turno.',
    value: 30, themes: ['hielo'],
    effect: { freeze: 1 }
  },
  racion_combate: {
    id: 'racion_combate', name: 'Ración de Combate', type: 'consumable', rarity: 'common',
    icon: '🍖', desc: 'Restaura 30 HP y 20 SP.',
    value: 15, themes: ['fuego_comida'],
    effect: { heal: 30, restoreSp: 20 }
  },
  elixir_vitalidad: {
    id: 'elixir_vitalidad', name: 'Elixir de Vitalidad', type: 'consumable', rarity: 'rare',
    icon: '💚', desc: 'Restaura 100% HP.',
    value: 100, themes: ['fuego_comida', 'naturaleza'],
    effect: { healPercent: 100 }
  },
  hierba_curativa: {
    id: 'hierba_curativa', name: 'Hierba Curativa', type: 'consumable', rarity: 'common',
    icon: '🌿', desc: 'Restaura 30 HP.',
    value: 8, themes: ['naturaleza'],
    effect: { heal: 30 }
  },
  antidoto: {
    id: 'antidoto', name: 'Antídoto', type: 'consumable', rarity: 'common',
    icon: '💉', desc: 'Cura envenenamiento.',
    value: 12, themes: ['naturaleza', 'agua_quimicos'],
    effect: { curePoison: true }
  },
  veneno_basico: {
    id: 'veneno_basico', name: 'Veneno Básico', type: 'consumable', rarity: 'common',
    icon: '☠️', desc: 'Aplica veneno al arma (3 turnos).',
    value: 20, themes: ['agua_quimicos'],
    effect: { applyPoison: 3 }
  },
  pocion_respiracion: {
    id: 'pocion_respiracion', name: 'Poción de Respiración', type: 'consumable', rarity: 'uncommon',
    icon: '🫧', desc: 'Respira bajo el agua 10 min.',
    value: 35, themes: ['agua_profunda'],
    effect: { waterBreathing: 10 }
  },
  hidromiel: {
    id: 'hidromiel', name: 'Hidromiel', type: 'consumable', rarity: 'uncommon',
    icon: '🍺', desc: '+20% PRE durante 1 combate.',
    value: 25, themes: ['social'],
    effect: { buffPre: 20, duration: 1 }
  },

  // ══════════ MATERIALES ══════════
  moneda_antigua: {
    id: 'moneda_antigua', name: 'Moneda Antigua', type: 'material', rarity: 'common',
    icon: '🪙', desc: 'Valiosa para coleccionistas.',
    value: 5, themes: ['hallazgos']
  },
  moneda_oro: {
    id: 'moneda_oro', name: 'Moneda de Oro', type: 'material', rarity: 'uncommon',
    icon: '💰', desc: 'Oro puro.',
    value: 25, themes: ['hallazgos', 'comercio']
  },
  gema_fuego: {
    id: 'gema_fuego', name: 'Gema de Fuego', type: 'material', rarity: 'uncommon',
    icon: '🔶', desc: 'Pulsa con calor interno.',
    value: 40, themes: ['fuego', 'fuego_comida']
  },
  fragmento_hielo: {
    id: 'fragmento_hielo', name: 'Fragmento de Hielo', type: 'material', rarity: 'common',
    icon: '🧊', desc: 'Nunca se derrite.',
    value: 15, themes: ['hielo']
  },
  fragmento_solar: {
    id: 'fragmento_solar', name: 'Fragmento Solar', type: 'material', rarity: 'uncommon',
    icon: '✨', desc: 'Brilla incluso en la oscuridad.',
    value: 30, themes: ['sol_viento', 'luz']
  },
  pluma_viento: {
    id: 'pluma_viento', name: 'Pluma del Viento', type: 'material', rarity: 'common',
    icon: '🪶', desc: 'Ligera como el aire.',
    value: 12, themes: ['sol_viento']
  },
  especia_rara: {
    id: 'especia_rara', name: 'Especia Rara', type: 'material', rarity: 'uncommon',
    icon: '🌶️', desc: 'Mejora cualquier receta.',
    value: 20, themes: ['fuego_comida']
  },
  frasco_vacio: {
    id: 'frasco_vacio', name: 'Frasco Vacío', type: 'material', rarity: 'common',
    icon: '🫙', desc: 'Para crear pociones.',
    value: 5, themes: ['agua_quimicos']
  },
  talisman_oriental: {
    id: 'talisman_oriental', name: 'Talismán Oriental', type: 'material', rarity: 'rare',
    icon: '🧧', desc: 'Protege contra espíritus.',
    value: 70, themes: ['oriente']
  },

  // ══════════ HABILIDADES (SKILLS) ══════════
  skill_foco_interior: {
    id: 'skill_foco_interior', name: 'Pergamino: Foco Interior', type: 'skill', rarity: 'rare',
    icon: '📜', desc: 'Aprende la habilidad Foco Interior.',
    value: 150, themes: ['mente'],
    teachesSkill: 'foco_interior'
  },
  skill_llamarada: {
    id: 'skill_llamarada', name: 'Pergamino: Llamarada', type: 'skill', rarity: 'uncommon',
    icon: '📜', desc: 'Aprende la habilidad Llamarada.',
    value: 80, themes: ['fuego'],
    teachesSkill: 'llamarada'
  },
  skill_rayo_hielo: {
    id: 'skill_rayo_hielo', name: 'Pergamino: Rayo de Hielo', type: 'skill', rarity: 'uncommon',
    icon: '📜', desc: 'Aprende la habilidad Rayo de Hielo.',
    value: 80, themes: ['hielo'],
    teachesSkill: 'rayo_hielo'
  },

  // ══════════ LLAVES/QUEST ══════════
  llave_cofre: {
    id: 'llave_cofre', name: 'Llave de Cofre', type: 'key', rarity: 'uncommon',
    icon: '🔑', desc: 'Abre cofres encontrados.',
    value: 0, themes: ['comercio', 'hallazgos'],
    cantSell: true
  },
  contrato_mercantil: {
    id: 'contrato_mercantil', name: 'Contrato Mercantil', type: 'key', rarity: 'rare',
    icon: '📋', desc: 'Mejores precios con mercaderes.',
    value: 0, themes: ['comercio'],
    cantSell: true,
    effect: { merchantDiscount: 10 }
  }
};

// ═══════════════════════════════════════════════════════════════════════════
// DROP TABLES (by theme)
// ═══════════════════════════════════════════════════════════════════════════

const DROP_TABLES = {

  destino: ['piedra_del_umbral', 'fragmento_del_umbral', 'esencia_de_retorno'],
  exploracion: ['piedra_del_umbral', 'fragmento_del_umbral', 'botas_viajero'],
  refugio: ['broche_del_refugio', 'moneda_antigua'],
  conocimiento: ['sello_de_la_pregunta', 'grimorio_arcano'],
  creacion: ['guantes_del_trazo', 'dado_destino'],
  agua_quimicos: ['pocion_agua', 'veneno_basico', 'frasco_vacio', 'daga_corrosiva', 'escudo_antiveneno', 'antidoto'],
  fuego: ['gema_fuego', 'skill_llamarada', 'cuchilla_llameante'],
  fuego_comida: ['racion_combate', 'gema_fuego', 'especia_rara', 'elixir_vitalidad', 'cuchilla_llameante'],
  naturaleza: ['hierba_curativa', 'antidoto', 'arco_espino'],
  sol_viento: ['fragmento_solar', 'pluma_viento', 'amuleto_brisa', 'capa_ligera', 'espada_radiante', 'capa_alba', 'cristal_solar'],
  luz: ['fragmento_solar', 'cristal_solar', 'espada_radiante', 'capa_alba'],
  hielo: ['fragmento_hielo', 'pocion_escarcha', 'hoja_gelida', 'armadura_invierno', 'skill_rayo_hielo'],
  hallazgos: ['moneda_antigua', 'moneda_oro', 'llave_cofre', 'amuleto_espacio'],
  agua_profunda: ['perla_marina', 'tridente_marino', 'escamas_sirena', 'pocion_respiracion'],
  mente: ['rosario_concentracion', 'orbe_mental', 'skill_foco_interior'],
  conocimiento: ['grimorio_arcano'],
  oriente: ['cuentas_jade', 'talisman_oriental', 'katana_oriental', 'escama_dragon'],
  social: ['sello_alianza', 'hidromiel'],
  comercio: ['moneda_oro', 'llave_cofre', 'contrato_mercantil'],
  creacion: ['dado_destino'],
  descanso: ['hierba_curativa', 'pocion_agua']
};

// ═══════════════════════════════════════════════════════════════════════════
// INVENTORY FUNCTIONS
// ═══════════════════════════════════════════════════════════════════════════

function getInventoryCapacity() {
  let base = 20;
  // Check for capacity bonuses from equipment
  const equipped = gameState.equipment || {};
  for (const slot of Object.values(equipped)) {
    if (slot) {
      const item = ITEMS[slot];
      if (item && item.effect && item.effect.inventoryBonus) {
        base += item.effect.inventoryBonus;
      }
    }
  }
  return base;
}

function canAddToInventory() {
  return gameState.inventory.length < getInventoryCapacity();
}

function addToInventory(itemId, quantity = 1) {
  const item = ITEMS[itemId];
  if (!item) return false;
  
  // Stack consumables and materials
  if (item.type === 'consumable' || item.type === 'material') {
    const existing = gameState.inventory.find(i => i.id === itemId);
    if (existing) {
      existing.qty = (existing.qty || 1) + quantity;
      return true;
    }
  }
  
  if (!canAddToInventory()) return false;
  
  gameState.inventory.push({ id: itemId, qty: quantity });
  return true;
}

function removeFromInventory(itemId, quantity = 1) {
  const index = gameState.inventory.findIndex(i => i.id === itemId);
  if (index === -1) return false;
  
  const slot = gameState.inventory[index];
  slot.qty = (slot.qty || 1) - quantity;
  
  if (slot.qty <= 0) {
    gameState.inventory.splice(index, 1);
  }
  
  return true;
}

function getItemCount(itemId) {
  const slot = gameState.inventory.find(i => i.id === itemId);
  return slot ? (slot.qty || 1) : 0;
}

// ═══════════════════════════════════════════════════════════════════════════
// EQUIPMENT FUNCTIONS
// ═══════════════════════════════════════════════════════════════════════════

function equipItem(itemId) {
  const item = ITEMS[itemId];
  if (!item || !item.type) return false;
  
  const type = ITEM_TYPE[item.type];
  if (!type || !type.slot) return false;
  
  // For accessories, find empty slot or replace
  let slot = type.slot;
  if (slot === 'accessory') {
    if (!gameState.equipment.accessory1) {
      slot = 'accessory1';
    } else if (!gameState.equipment.accessory2) {
      slot = 'accessory2';
    } else {
      slot = 'accessory1'; // Replace first by default
    }
  }
  
  // Unequip current if any
  const current = gameState.equipment[slot];
  if (current) {
    addToInventory(current);
  }
  
  // Remove from inventory and equip
  removeFromInventory(itemId);
  gameState.equipment[slot] = itemId;
  
  return true;
}

function unequipItem(slot) {
  const itemId = gameState.equipment[slot];
  if (!itemId) return false;
  
  if (!canAddToInventory()) return false;
  
  addToInventory(itemId);
  gameState.equipment[slot] = null;
  
  return true;
}

function getEquipmentStats() {
  const stats = { fue: 0, vit: 0, des: 0, int: 0, vol: 0, pre: 0 };
  
  for (const itemId of Object.values(gameState.equipment)) {
    if (itemId) {
      const item = ITEMS[itemId];
      if (item && item.stats) {
        for (const [stat, value] of Object.entries(item.stats)) {
          stats[stat] = (stats[stat] || 0) + value;
        }
      }
    }
  }
  
  return stats;
}

// ═══════════════════════════════════════════════════════════════════════════
// DROP SYSTEM
// ═══════════════════════════════════════════════════════════════════════════

function rollDrop(theme, bonusChance = 0) {
  // Base drop chance
  const baseChance = 0.40 + bonusChance;
  if (Math.random() > baseChance) return null;
  
  // Get items for this theme
  const pool = DROP_TABLES[theme];
  if (!pool || pool.length === 0) return null;
  
  // Weight by rarity (inverse of drop rate for selection)
  const weighted = [];
  for (const itemId of pool) {
    const item = ITEMS[itemId];
    if (!item) continue;
    
    const rarity = RARITY[item.rarity] || RARITY.common;
    // More common items appear more often in pool
    const weight = Math.max(1, Math.floor(rarity.dropRate * 1000));
    for (let i = 0; i < weight; i++) {
      weighted.push(itemId);
    }
  }
  
  if (weighted.length === 0) return null;
  
  // Pick random
  const itemId = weighted[Math.floor(Math.random() * weighted.length)];
  
  // Rarity upgrade roll
  const item = ITEMS[itemId];
  const rarityOrder = ['common', 'uncommon', 'rare', 'epic', 'legendary'];
  let finalRarity = item.rarity;
  
  // Small chance to upgrade rarity
  if (Math.random() < 0.05 + bonusChance * 0.5) {
    const idx = rarityOrder.indexOf(finalRarity);
    if (idx < rarityOrder.length - 1) {
      finalRarity = rarityOrder[idx + 1];
    }
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
  const gold = Math.floor(item.value * rarity.sellMult * 0.3 * toSell); // 30% base sell value
  
  removeFromInventory(itemId, toSell);
  gameState.gold += gold;
  
  return gold;
}


// ═══════════════════════════════════════════════════════════════════════════
// INVENTORY UPDATE 2: stash, capacity and safe loot handling
// ═══════════════════════════════════════════════════════════════════════════

function getInventoryCapacity() {
  let base = 20 + (gameState.inventoryCapacityBonus || 0);
  const equipped = gameState.equipment || {};
  for (const slot of Object.values(equipped)) {
    if (slot) {
      const item = ITEMS[slot];
      if (item?.effect?.inventoryBonus) base += item.effect.inventoryBonus;
    }
  }
  return base;
}

function containerHasSpace(container, itemId, quantity = 1) {
  const list = container === 'stash' ? (gameState.stash || []) : (gameState.inventory || []);
  const item = ITEMS[itemId];
  if (!item) return false;
  if ((item.type === 'consumable' || item.type === 'material') && list.some(i => i.id === itemId)) return true;
  const capacity = container === 'stash' ? (gameState.stashCapacity || 30) : getInventoryCapacity();
  return list.length < capacity;
}

function addToContainer(itemId, container = 'inventory', quantity = 1) {
  const item = ITEMS[itemId];
  if (!item) return { success: false, reason: 'unknown_item' };
  const list = container === 'stash' ? (gameState.stash || (gameState.stash = [])) : (gameState.inventory || (gameState.inventory = []));
  if (!containerHasSpace(container, itemId, quantity)) return { success: false, reason: 'full' };
  if (item.type === 'consumable' || item.type === 'material') {
    const existing = list.find(i => i.id === itemId);
    if (existing) { existing.qty = (existing.qty || 1) + quantity; return { success: true, stacked: true }; }
  }
  list.push({ id: itemId, qty: quantity });
  return { success: true, stacked: false };
}

function addToInventory(itemId, quantity = 1) {
  return addToContainer(itemId, 'inventory', quantity).success;
}

function addLootSafely(itemId, quantity = 1) {
  const result = addToContainer(itemId, 'inventory', quantity);
  if (result.success) return { ...result, destination: 'inventory' };
  const stashResult = addToContainer(itemId, 'stash', quantity);
  if (stashResult.success) return { ...stashResult, destination: 'stash' };
  gameState.pendingLoot = { itemId, quantity, reason: 'inventory_and_stash_full' };
  return { success: false, destination: 'pending' };
}

function moveBetweenContainers(itemId, from, to, quantity = 1) {
  const source = from === 'stash' ? gameState.stash : gameState.inventory;
  if (!source) return false;
  const slot = source.find(i => i.id === itemId);
  if (!slot) return false;
  const amount = Math.min(quantity, slot.qty || 1);
  const result = addToContainer(itemId, to, amount);
  if (!result.success) return false;
  slot.qty = (slot.qty || 1) - amount;
  if (slot.qty <= 0) source.splice(source.indexOf(slot), 1);
  return true;
}

function upgradeStashCapacity(amount = 10) {
  gameState.stashCapacity = (gameState.stashCapacity || 30) + amount;
  saveGame();
  return gameState.stashCapacity;
}

function upgradeInventoryCapacity(amount = 1) {
  gameState.inventoryCapacityBonus = (gameState.inventoryCapacityBonus || 0) + amount;
  saveGame();
  return getInventoryCapacity();
}

function resolvePendingLoot(action, itemId = null) {
  const pending = gameState.pendingLoot;
  if (!pending) return false;
  if (action === 'stash') {
    const result = addToContainer(pending.itemId, 'stash', pending.quantity);
    if (!result.success) return false;
  } else if (action === 'discard') {
    gameState.pendingLoot = null; saveGame(); return true;
  } else if (action === 'replace' && itemId) {
    if (!removeFromInventory(itemId)) return false;
    const result = addToContainer(pending.itemId, 'inventory', pending.quantity);
    if (!result.success) return false;
  } else return false;
  gameState.pendingLoot = null; saveGame(); return true;
}


// ═══════════════════════════════════════════════════════════════════════════
// INVENTORY UPDATE 10: legacy item recovery / emergency reroll
// ═══════════════════════════════════════════════════════════════════════════

function normalizeItemText(value) {
  return String(value || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().trim();
}

function findItemIdByLegacyName(name) {
  const wanted = normalizeItemText(name);
  if (!wanted) return null;
  const entry = Object.entries(ITEMS).find(([id, item]) => normalizeItemText(item.name) === wanted);
  if (entry) return entry[0];
  const partial = Object.entries(ITEMS).find(([id, item]) => {
    const itemName = normalizeItemText(item.name);
    return itemName.includes(wanted) || wanted.includes(itemName);
  });
  return partial ? partial[0] : null;
}

function migrateLegacyInventory() {
  if (!Array.isArray(gameState.inventory)) gameState.inventory = [];
  let changed = false;
  for (const slot of gameState.inventory) {
    if (slot.id && ITEMS[slot.id]) continue;
    const recoveredId = findItemIdByLegacyName(slot.name || slot.legacyName);
    if (recoveredId) {
      slot.id = recoveredId;
      delete slot.name;
      delete slot.legacyName;
      slot.recovered = true;
      changed = true;
    } else {
      slot.recoveryStatus = 'unrecoverable';
      slot.recoveryUsed = Boolean(slot.recoveryUsed);
    }
  }
  if (changed) saveGame();
  return changed;
}

function getRecoveryCandidates(slot) {
  const desiredTheme = slot?.theme;
  const entries = Object.entries(ITEMS).filter(([id, item]) => {
    if (!item || item.rarity === 'legendary') return false;
    if (desiredTheme && Array.isArray(item.themes) && item.themes.includes(desiredTheme)) return true;
    return !desiredTheme;
  });
  const pool = entries.length ? entries : Object.entries(ITEMS).filter(([id, item]) => item && item.rarity !== 'legendary');
  return pool.map(([id]) => id);
}

function emergencyRerollLegacyItem(slotIndex) {
  const slot = gameState.inventory?.[slotIndex];
  if (!slot || slot.recoveryUsed) return { success: false, reason: 'already_used' };
  const recoveredId = findItemIdByLegacyName(slot.name || slot.legacyName);
  if (recoveredId) {
    slot.id = recoveredId;
    delete slot.name;
    delete slot.legacyName;
    slot.recoveryStatus = 'recovered_by_name';
    slot.recoveryUsed = true;
    saveGame();
    return { success: true, itemId: recoveredId, method: 'name' };
  }
  const candidates = getRecoveryCandidates(slot);
  if (!candidates.length) return { success: false, reason: 'no_candidates' };
  const itemId = candidates[Math.floor(Math.random() * candidates.length)];
  slot.id = itemId;
  slot.qty = slot.qty || 1;
  delete slot.name;
  delete slot.legacyName;
  slot.recoveryStatus = 'rerolled';
  slot.recoveryUsed = true;
  saveGame();
  return { success: true, itemId, method: 'reroll' };
}

function getLegacyInventorySlotIndex(slot) {
  return Array.isArray(gameState.inventory) ? gameState.inventory.indexOf(slot) : -1;
}


// Block 1 bootstrap: item definitions are extended at runtime by game.js.
// This marker is intentionally harmless for older saves and older content.
