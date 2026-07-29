// ═══════════════════════════════════════════════════════════════════════════
// LifeXP RPG - Combat System (Block 4)
// ═══════════════════════════════════════════════════════════════════════════

// ═══════════════════════════════════════════════════════════════════════════
// COMBAT STATE
// ═══════════════════════════════════════════════════════════════════════════

let combatState = null;

// ============================================================================
// LifeXP Block 1 - status effects and equipment effects
// ============================================================================
function getCombatEffectDefinition(effect) {
  return effect?.effect || effect?.data || effect || {};
}

function applyStatusEffect(target, status, data = {}, source = 'unknown') {
  if (!target) return false;
  const list = target.debuffs || (target.debuffs = []);
  const existing = list.find(x => x.status === status);
  const duration = Math.max(1, Number(data.duration || 1));
  const stacks = Math.max(1, Number(data.stacks || 1));
  if (target.statusResistances?.includes?.(status)) return false;
  if (existing) { existing.duration = Math.max(existing.duration, duration); existing.stacks = Math.min(Number(data.maxStacks || 99), (existing.stacks || 1) + stacks); }
  else list.push({ status, duration, stacks, damage: Number(data.damage || 0), source });
  return true;
}

function tickCombatStatuses(target, label = 'Objetivo') {
  if (!target?.debuffs) return [];
  const messages = [];
  for (const effect of target.debuffs) {
    if (effect.status === 'burn' || effect.status === 'poison' || effect.status === 'bleed') {
      const damage = Math.max(1, Number(effect.damage || 3) * Number(effect.stacks || 1));
      target.hp = Math.max(0, target.hp - damage);
      messages.push(`${label} sufre ${damage} de daño por ${effect.status}.`);
    }
    effect.duration -= 1;
  }
  target.debuffs = target.debuffs.filter(x => x.duration > 0);
  messages.forEach(addCombatLog);
  return messages;
}

function applyEquipmentOnHitEffects(attacker, defender, result) {
  if (attacker !== combatState?.player || !defender || !result) return [];
  const applied = [];
  if (typeof getEquippedItemEffects !== 'function') return applied;
  for (const effect of getEquippedItemEffects()) {
    const data = getCombatEffectDefinition(effect);
    const trigger = effect.trigger || data.trigger || 'on_hit';
    if (trigger !== 'on_hit') continue;
    const chance = Number(effect.chance ?? data.chance ?? 1);
    if (Math.random() > chance) continue;
    const status = effect.status || data.status;
    if (!status) continue;
    applyStatusEffect(defender, status, { ...data, damage: data.damage || (status === 'burn' ? 4 : 0) }, effect.itemId);
    applied.push(status);
    if (typeof advanceItemProgressFromCombat === 'function') advanceItemProgressFromCombat(effect.itemId, { trigger: 'on_hit' });
    addCombatLog(`${effect.name || status} aplicado.`);
  }
  return applied;
}


function initCombat(enemy, isTactical = false) {
  const playerStats = typeof getDerivedStats === 'function' ? getDerivedStats() : gameState.stats;
  const resources = typeof calculateResources === 'function' ? calculateResources(playerStats) : {
    hp: 100 + playerStats.vit * 5,
    mp: 30 + playerStats.int * 3,
    sp: 50 + (playerStats.fue + playerStats.des),
    focusMax: 100
  };
  
  combatState = {
    active: true,
    tactical: isTactical,
    turn: 1,
    phase: 'player', // 'player' | 'enemy' | 'resolution' | 'victory' | 'defeat'
    
    player: {
      hp: resources.hp,
      maxHp: resources.hp,
      mp: resources.mp,
      maxMp: resources.mp,
      sp: resources.sp,
      maxSp: resources.sp,
      focus: 0,
      focusMax: resources.focusMax,
      stats: playerStats,
      buffs: [],
      debuffs: [],
      defending: false
    },
    
    enemy: {
      ...enemy,
      hp: enemy.hp,
      maxHp: enemy.hp,
      buffs: [],
      debuffs: [],
      defending: false
    },
    
    log: [],
    rewards: null
  };
  
  addCombatLog(`¡Encuentro con ${enemy.name}!`);
  return combatState;
}

// ═══════════════════════════════════════════════════════════════════════════
// DAMAGE CALCULATIONS
// ═══════════════════════════════════════════════════════════════════════════

function calculateDamage(attacker, defender, skill = null) {
  let baseDamage = 0;
  let damageType = 'physical';
  
  if (skill) {
    baseDamage = skill.power || 10;
    damageType = skill.damageType || 'physical';
    
    // Scale with stat
    if (skill.scaling) {
      for (const [stat, mult] of Object.entries(skill.scaling)) {
        baseDamage += Math.floor((attacker.stats?.[stat] || attacker[stat] || 10) * mult);
      }
    }
  } else {
    // Basic attack
    const fue = attacker.stats?.fue || attacker.fue || 10;
    const des = attacker.stats?.des || attacker.des || 10;
    baseDamage = 5 + Math.floor(fue * 0.8 + des * 0.2);
  }
  
  // Equipment bonus (player only)
  if (attacker === combatState?.player && typeof getEquipmentStats === 'function') {
    const eqStats = getEquipmentStats();
    if (damageType === 'physical') {
      baseDamage += Math.floor((eqStats.fue || 0) * 0.5);
    } else if (damageType === 'magical') {
      baseDamage += Math.floor((eqStats.int || 0) * 0.5);
    }
  }
  
  // Critical hit (DES-based)
  const critChance = (attacker.stats?.des || attacker.des || 10) * 0.5 + 5;
  const isCrit = Math.random() * 100 < critChance;
  if (isCrit) {
    baseDamage = Math.floor(baseDamage * 1.5);
  }
  
  // Defense reduction
  const defense = defender.stats?.vit || defender.vit || defender.def || 5;
  const reduction = Math.floor(defense * 0.3);
  
  // Defending stance
  if (defender.defending) {
    baseDamage = Math.floor(baseDamage * 0.5);
  }
  
  const finalDamage = Math.max(1, baseDamage - reduction);
  
  return { damage: finalDamage, isCrit, damageType };
}

function calculateHeal(caster, skill) {
  let baseHeal = skill.power || 20;
  
  if (skill.scaling) {
    for (const [stat, mult] of Object.entries(skill.scaling)) {
      baseHeal += Math.floor((caster.stats?.[stat] || caster[stat] || 10) * mult);
    }
  }
  
  return baseHeal;
}

// ═══════════════════════════════════════════════════════════════════════════
// PLAYER ACTIONS
// ═══════════════════════════════════════════════════════════════════════════

const PLAYER_SKILLS = {
  // Basic attacks by class affinity
  basic_attack: {
    id: 'basic_attack', name: 'Ataque básico', icon: '⚔️',
    type: 'attack', cost: 0, costType: null,
    power: 10, scaling: { fue: 0.8, des: 0.2 }, damageType: 'physical',
    desc: 'Un golpe simple pero efectivo.'
  },
  
  // Physical skills (SP)
  power_strike: {
    id: 'power_strike', name: 'Golpe Potente', icon: '💪',
    type: 'attack', cost: 15, costType: 'sp',
    power: 25, scaling: { fue: 1.2 }, damageType: 'physical',
    desc: 'Un golpe con toda tu fuerza.'
  },
  quick_slash: {
    id: 'quick_slash', name: 'Tajo Rápido', icon: '⚡',
    type: 'attack', cost: 10, costType: 'sp',
    power: 15, scaling: { des: 1.0, fue: 0.3 }, damageType: 'physical',
    desc: 'Ataque veloz con alta probabilidad de crítico.'
  },
  
  // Magic skills (MP)
  fire_bolt: {
    id: 'fire_bolt', name: 'Descarga de Fuego', icon: '🔥',
    type: 'attack', cost: 12, costType: 'mp',
    power: 20, scaling: { int: 1.0 }, damageType: 'magical',
    desc: 'Lanza una bola de fuego al enemigo.'
  },
  heal: {
    id: 'heal', name: 'Curación', icon: '💚',
    type: 'heal', cost: 15, costType: 'mp',
    power: 30, scaling: { vol: 0.8, int: 0.3 },
    desc: 'Restaura HP.'
  },
  
  // Defensive
  defend: {
    id: 'defend', name: 'Defender', icon: '🛡️',
    type: 'defend', cost: 0, costType: null,
    focusGain: 15,
    desc: 'Reduce el daño recibido 50% y gana Focus.'
  },
  
  // Ultimate (Focus)
  ultimate_strike: {
    id: 'ultimate_strike', name: 'Golpe Definitivo', icon: '💥',
    type: 'ultimate', cost: 100, costType: 'focus',
    power: 80, scaling: { fue: 1.5, des: 0.5 }, damageType: 'physical',
    desc: 'Tu ataque más poderoso. Requiere Focus completo.'
  }
};

function getAvailableActions() {
  const p = combatState.player;
  const actions = [];
  
  // Basic attack always available
  actions.push({ ...PLAYER_SKILLS.basic_attack, available: true });
  
  // Equipped skills (simplified: use power_strike and fire_bolt for now)
  const skill1 = PLAYER_SKILLS.power_strike;
  const skill2 = PLAYER_SKILLS.fire_bolt;
  
  actions.push({
    ...skill1,
    available: p[skill1.costType] >= skill1.cost
  });
  
  actions.push({
    ...skill2,
    available: p[skill2.costType] >= skill2.cost
  });
  
  // Heal
  const healSkill = PLAYER_SKILLS.heal;
  actions.push({
    ...healSkill,
    available: p.mp >= healSkill.cost && p.hp < p.maxHp
  });
  
  // Ultimate
  const ultimate = PLAYER_SKILLS.ultimate_strike;
  actions.push({
    ...ultimate,
    available: p.focus >= ultimate.cost
  });
  
  // Defend
  actions.push({ ...PLAYER_SKILLS.defend, available: true });
  
  // Flee
  actions.push({
    id: 'flee', name: 'Huir', icon: '🏃', type: 'flee',
    available: true,
    fleeChance: Math.min(90, 30 + p.stats.des * 2),
    desc: `${Math.min(90, 30 + p.stats.des * 2)}% de éxito`
  });
  
  return actions;
}

function executePlayerAction(actionId) {
  if (!combatState || combatState.phase !== 'player') return null;
  
  const p = combatState.player;
  const e = combatState.enemy;
  
  // Reset defending
  p.defending = false;
  
  const action = PLAYER_SKILLS[actionId] || { id: actionId };
  let result = { action: actionId, success: true, effects: [] };
  
  switch (action.type || actionId) {
    case 'attack':
    case 'ultimate':
      // Pay cost
      if (action.costType && action.cost) {
        if (p[action.costType] < action.cost) {
          result.success = false;
          result.message = `No tienes suficiente ${action.costType.toUpperCase()}`;
          return result;
        }
        p[action.costType] -= action.cost;
      }
      
      // Calculate and apply damage
      const dmgResult = calculateDamage(p, e, action);
      e.hp = Math.max(0, e.hp - dmgResult.damage);
      result.effects.push(...applyEquipmentOnHitEffects(p, e, dmgResult));
      
      // Gain focus from attacking
      p.focus = Math.min(p.focusMax, p.focus + 10);
      
      result.damage = dmgResult.damage;
      result.isCrit = dmgResult.isCrit;
      addCombatLog(`${action.icon} ${action.name}: ${dmgResult.damage} daño${dmgResult.isCrit ? ' ¡CRÍTICO!' : ''}`);
      break;
      
    case 'heal':
      if (p.mp < action.cost) {
        result.success = false;
        result.message = 'No tienes suficiente MP';
        return result;
      }
      p.mp -= action.cost;
      
      const healAmount = calculateHeal(p, action);
      const actualHeal = Math.min(healAmount, p.maxHp - p.hp);
      p.hp += actualHeal;
      
      result.heal = actualHeal;
      addCombatLog(`${action.icon} ${action.name}: +${actualHeal} HP`);
      break;
      
    case 'defend':
      p.defending = true;
      p.focus = Math.min(p.focusMax, p.focus + (action.focusGain || 15));
      result.defending = true;
      addCombatLog(`${action.icon} Te preparas para defender. Focus +${action.focusGain || 15}`);
      break;
      
    case 'flee':
      const fleeChance = Math.min(90, 30 + p.stats.des * 2);
      if (Math.random() * 100 < fleeChance) {
        result.fled = true;
        combatState.phase = 'fled';
        addCombatLog('🏃 ¡Huiste del combate!');
      } else {
        result.fled = false;
        addCombatLog('🏃 ¡No pudiste huir!');
      }
      break;
  }
  
  // Check victory
  if (e.hp <= 0) {
    combatState.phase = 'victory';
    result.victory = true;
    addCombatLog(`🏆 ¡Victoria! ${e.name} derrotado.`);
    calculateCombatRewards();
  } else if (combatState.phase === 'player') {
    combatState.phase = 'enemy';
  }
  
  return result;
}

// ═══════════════════════════════════════════════════════════════════════════
// ENEMY AI
// ═══════════════════════════════════════════════════════════════════════════

function executeEnemyTurn() {
  if (!combatState || combatState.phase !== 'enemy') return null;
  
  const p = combatState.player;
  const e = combatState.enemy;
  
  tickCombatStatuses(e, e.name || 'Enemigo');
  if (e.hp <= 0) { combatState.phase = 'victory'; calculateCombatRewards(); return { action: 'status', victory: true, effects: [] }; }
  
  // Reset enemy defending
  e.defending = false;
  
  let result = { action: 'attack', effects: [] };
  
  // Simple AI: pick from available skills or basic attack
  let chosenSkill = null;
  
  if (e.skills && e.skills.length > 0) {
    // Filter usable skills
    const usable = e.skills.filter(s => {
      if (s.costType === 'mp' && (e.mp || 0) < s.cost) return false;
      if (s.type === 'heal' && e.hp >= e.maxHp * 0.8) return false;
      return true;
    });
    
    // 40% chance to use a skill if available
    if (usable.length > 0 && Math.random() < 0.4) {
      chosenSkill = usable[Math.floor(Math.random() * usable.length)];
    }
  }
  
  if (chosenSkill) {
    // Pay cost
    if (chosenSkill.costType === 'mp') {
      e.mp = (e.mp || 0) - chosenSkill.cost;
    }
    
    if (chosenSkill.type === 'heal') {
      const heal = chosenSkill.power || 20;
      e.hp = Math.min(e.maxHp, e.hp + heal);
      result.heal = heal;
      addCombatLog(`${e.icon} ${e.name} usa ${chosenSkill.name}: +${heal} HP`);
    } else {
      const dmgResult = calculateDamage(e, p, chosenSkill);
      p.hp = Math.max(0, p.hp - dmgResult.damage);
      result.damage = dmgResult.damage;
      result.isCrit = dmgResult.isCrit;
      addCombatLog(`${e.icon} ${e.name} usa ${chosenSkill.name}: ${dmgResult.damage} daño${dmgResult.isCrit ? ' ¡CRÍTICO!' : ''}`);
    }
  } else {
    // Basic attack
    const dmgResult = calculateDamage(e, p);
    p.hp = Math.max(0, p.hp - dmgResult.damage);
    result.damage = dmgResult.damage;
    result.isCrit = dmgResult.isCrit;
    addCombatLog(`${e.icon} ${e.name} ataca: ${dmgResult.damage} daño${dmgResult.isCrit ? ' ¡CRÍTICO!' : ''}`);
  }
  
  // Check defeat
  if (p.hp <= 0) {
    combatState.phase = 'defeat';
    result.defeat = true;
    addCombatLog('💀 Has sido derrotado...');
  } else {
    combatState.phase = 'player';
    combatState.turn++;
  }
  
  return result;
}

// ═══════════════════════════════════════════════════════════════════════════
// AUTO COMBAT (for minor encounters)
// ═══════════════════════════════════════════════════════════════════════════

function resolveAutoCombat(enemy) {
  initCombat(enemy, false);
  
  const maxTurns = 20;
  let turns = 0;
  
  while (combatState.phase !== 'victory' && combatState.phase !== 'defeat' && turns < maxTurns) {
    // Player turn - auto attack
    if (combatState.phase === 'player') {
      executePlayerAction('basic_attack');
    }
    
    // Enemy turn
    if (combatState.phase === 'enemy') {
      executeEnemyTurn();
    }
    
    turns++;
  }
  
  // Timeout = defeat
  if (turns >= maxTurns && combatState.phase !== 'victory') {
    combatState.phase = 'defeat';
    addCombatLog('💀 El combate se prolongó demasiado...');
  }
  
  return {
    victory: combatState.phase === 'victory',
    turns: turns,
    log: combatState.log,
    rewards: combatState.rewards,
    playerHp: combatState.player.hp,
    playerMaxHp: combatState.player.maxHp
  };
}

// ═══════════════════════════════════════════════════════════════════════════
// REWARDS
// ═══════════════════════════════════════════════════════════════════════════

function calculateCombatRewards() {
  if (!combatState || combatState.phase !== 'victory') return null;
  
  const e = combatState.enemy;
  
  const rewards = {
    xp: e.xp || Math.floor(e.level * 15),
    gold: e.gold || Math.floor(e.level * 5 + Math.random() * e.level * 3),
    drops: []
  };
  
  // Roll for drops
  if (e.drops && e.drops.length > 0) {
    for (const drop of e.drops) {
      const chance = drop.chance || 0.1;
      if (Math.random() < chance) {
        rewards.drops.push(drop.itemId || drop.item);
      }
    }
  }
  
  combatState.rewards = rewards;
  
  addCombatLog(`📦 Recompensas: +${rewards.xp} XP, +${rewards.gold} oro`);
  if (rewards.drops.length > 0) {
    addCombatLog(`🎁 Drops: ${rewards.drops.join(', ')}`);
  }
  
  return rewards;
}

function applyCombatRewards() {
  if (!combatState?.rewards) return;
  
  const r = combatState.rewards;
  
  // Apply XP
  if (typeof addXp === 'function') {
    addXp(r.xp);
  } else {
    gameState.xp = (gameState.xp || 0) + r.xp;
  }
  
  // Apply gold
  gameState.gold = (gameState.gold || 0) + r.gold;
  
  // Apply drops
  for (const itemId of r.drops) {
    if (typeof addToInventory === 'function') {
      addToInventory(itemId, 1);
    } else {
      gameState.inventory.push({ id: itemId, qty: 1, obtainedAt: todayStr() });
    }
  }
  
  // Save
  if (typeof saveGame === 'function') {
    saveGame();
  }
}

// ═══════════════════════════════════════════════════════════════════════════
// COMBAT LOG
// ═══════════════════════════════════════════════════════════════════════════

function addCombatLog(message) {
  if (!combatState) return;
  combatState.log.push({
    turn: combatState.turn,
    phase: combatState.phase,
    message,
    timestamp: Date.now()
  });
}

function getCombatLog() {
  return combatState?.log || [];
}

// ═══════════════════════════════════════════════════════════════════════════
// COMBAT UTILITIES
// ═══════════════════════════════════════════════════════════════════════════

function getCombatState() {
  return combatState;
}

function isCombatActive() {
  return combatState?.active && 
    combatState.phase !== 'victory' && 
    combatState.phase !== 'defeat' &&
    combatState.phase !== 'fled';
}

function endCombat() {
  const result = {
    phase: combatState?.phase,
    rewards: combatState?.rewards,
    log: combatState?.log
  };
  combatState = null;
  return result;
}

// ═══════════════════════════════════════════════════════════════════════════
// ENCOUNTER GENERATION
// ═══════════════════════════════════════════════════════════════════════════

function rollEncounter(taskTheme, playerLevel) {
  // Base encounter chance: 15%
  let chance = 0.15;
  
  // Some themes have higher encounter rates
  const highEncounterThemes = ['exploracion', 'naturaleza', 'agua_profunda'];
  if (highEncounterThemes.includes(taskTheme)) {
    chance = 0.25;
  }
  
  // Lower chance for home/admin tasks
  const lowEncounterThemes = ['hallazgos', 'oro_comercio', 'alianzas'];
  if (lowEncounterThemes.includes(taskTheme)) {
    chance = 0.08;
  }
  
  return Math.random() < chance;
}

function getEncounterType(playerLevel) {
  const roll = Math.random();
  
  // 80% common, 15% elite, 5% boss
  if (roll < 0.80) return 'common';
  if (roll < 0.95) return 'elite';
  return 'boss';
}
