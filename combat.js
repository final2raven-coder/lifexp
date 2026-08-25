// ═══════════════════════════════════════════════════════════════════════════
// LifeXP RPG - Combat System (Block 4)
// ═══════════════════════════════════════════════════════════════════════════

// ═══════════════════════════════════════════════════════════════════════════
// COMBAT STATE
// ═══════════════════════════════════════════════════════════════════════════

let combatState = null;
let combatRewardSequence = 0;

// Difficulty policy for newly generated individual encounters.
const ENCOUNTER_DIFFICULTY = Object.freeze({
  common: Object.freeze({ minPlayerLevel: 1, weight: 80, levelWindow: 3, targetOffsetMin: -1, targetOffsetMax: 1 }),
  elite: Object.freeze({ minPlayerLevel: 5, weight: 15, levelWindow: 3, targetOffsetMin: 0, targetOffsetMax: 2 }),
  boss: Object.freeze({ minPlayerLevel: 15, weight: 5, levelWindow: 4, targetOffsetMin: 0, targetOffsetMax: 1 })
});

const ENCOUNTER_THREAT = Object.freeze({
  minor: Object.freeze({ label: 'Amenaza menor', description: 'Una prueba manejable para mantener el ritmo.' }),
  balanced: Object.freeze({ label: 'Amenaza equilibrada', description: 'Un combate acorde a tu preparación actual.' }),
  elevated: Object.freeze({ label: 'Amenaza elevada', description: 'Conviene observar tus recursos antes de comprometerte.' }),
  milestone: Object.freeze({ label: 'Hito de combate', description: 'Un desafío excepcional que exige preparación.' })
});

const MAX_ENCOUNTER_SCALE_GAP = 5;

function getEncounterDifficultyProfile(encounterType) {
  return ENCOUNTER_DIFFICULTY[encounterType] || ENCOUNTER_DIFFICULTY.common;
}

function getEncounterPlayerLevel(playerLevel = (typeof gameState !== 'undefined' ? gameState.level : 1)) {
  const value = Number(playerLevel);
  return Number.isFinite(value) ? Math.max(1, Math.floor(value)) : 1;
}

function getEncounterTargetLevel(playerLevel, encounterType) {
  const profile = getEncounterDifficultyProfile(encounterType);
  const span = profile.targetOffsetMax - profile.targetOffsetMin + 1;
  const offset = profile.targetOffsetMin + Math.floor(Math.random() * span);
  return Math.max(1, getEncounterPlayerLevel(playerLevel) + offset);
}

function getEncounterThreat(encounterType, enemyLevel, playerLevel) {
  const profileType = ENCOUNTER_DIFFICULTY[encounterType] ? encounterType : 'common';
  const combatLevel = getEncounterPlayerLevel(playerLevel);
  const level = Number(enemyLevel);
  const gap = (Number.isFinite(level) ? level : combatLevel) - combatLevel;
  const threatKey = profileType === 'boss'
    ? 'milestone'
    : profileType === 'elite' || gap >= 2
      ? 'elevated'
      : gap <= -1 ? 'minor' : 'balanced';
  return { key: threatKey, encounterType: profileType, levelGap: gap, ...ENCOUNTER_THREAT[threatKey] };
}

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
  if (existing) { existing.duration = Math.max(existing.duration, duration); existing.stacks = Math.min(Number(data.maxStacks || 99), (existing.stacks || 1) + stacks); }
  else list.push({ status, duration, stacks, damage: Number(data.damage || 0), source });
  return true;
}

function tickCombatStatuses(target, label = 'Objetivo') {
  if (!target?.debuffs) return [];
  const messages = [];

  for (const effect of target.debuffs) {
    const stacks = Math.max(1, Number(effect.stacks || 1));

    switch (effect.status) {

      // ── BURN: damage per turn ──────────────────────────────────────────
      case 'burn': {
        const dmg = Math.max(1, Number(effect.damage || 3) * stacks);
        target.hp = Math.max(0, target.hp - dmg);
        messages.push(`🔥 ${label} sufre ${dmg} de daño por quemadura.`);
        break;
      }

      // ── POISON: damage per turn (scales with stacks) ───────────────────
      case 'poison': {
        const dmg = Math.max(1, Math.floor((Number(effect.damage || 2) + stacks) * stacks));
        target.hp = Math.max(0, target.hp - dmg);
        messages.push(`☠️ ${label} sufre ${dmg} de daño por veneno.`);
        break;
      }

      // ── BLEED: flat damage per turn ────────────────────────────────────
      case 'bleed': {
        const dmg = Math.max(1, Number(effect.damage || 3) * stacks);
        target.hp = Math.max(0, target.hp - dmg);
        messages.push(`🩸 ${label} sangra: ${dmg} de daño.`);
        break;
      }

      // ── FEAR: 50% chance to skip action ───────────────────────────────
      case 'fear': {
        if (Math.random() < 0.5) {
          target._skipTurn = true;
          messages.push(`😨 ${label} está aterrorizado y no puede actuar.`);
        }
        break;
      }

      // ── SLOW: reduces action count / speed ────────────────────────────
      case 'slow': {
        target._slowed = true;
        messages.push(`🐢 ${label} está ralentizado.`);
        break;
      }

      // ── BLIND: reduces accuracy (applied as flag, checked in calculateDamage) ──
      case 'blind': {
        target._blinded = true;
        messages.push(`🌑 ${label} está cegado (precisión reducida).`);
        break;
      }

      // ── SLEEP: skip turn; breaks on damage ────────────────────────────
      case 'sleep': {
        target._skipTurn = true;
        messages.push(`💤 ${label} está dormido y no puede actuar.`);
        break;
      }

      // ── CONFUSION: 40% chance to attack self/ally ─────────────────────
      case 'confusion': {
        if (Math.random() < 0.4) {
          target._confused = true;
          messages.push(`🌀 ${label} está confundido y podría atacarse a sí mismo.`);
        }
        break;
      }

      // ── MP_DRAIN: drains MP each turn ─────────────────────────────────
      case 'mp_drain': {
        const drain = Math.max(1, Number(effect.damage || 5) * stacks);
        if (target.mp !== undefined) {
          target.mp = Math.max(0, target.mp - drain);
          messages.push(`💙 ${label} pierde ${drain} MP por drenaje.`);
        }
        break;
      }

      // ── LIFESTEAL: heals attacker on hit (flag for calculateDamage) ───
      case 'lifesteal': {
        target._lifesteal = true;
        break;
      }

      // ── ATTACK_UP: buff — increases damage dealt ───────────────────────
      case 'attack_up': {
        target._attackMult = (target._attackMult || 1) * 1.25;
        messages.push(`⚔️ ${label} tiene ataque aumentado.`);
        break;
      }

      // ── DEFENSE_UP: buff — reduces damage received ─────────────────────
      case 'defense_up': {
        target._defenseMult = (target._defenseMult || 1) * 0.75;
        messages.push(`🛡️ ${label} tiene defensa aumentada.`);
        break;
      }

      // ── EVASION_UP: buff — increases dodge chance ──────────────────────
      case 'evasion_up': {
        target._evasionBonus = (target._evasionBonus || 0) + 20;
        messages.push(`💨 ${label} tiene evasión aumentada.`);
        break;
      }

      // ── ALL_STATS_UP: buff — all multipliers ──────────────────────────
      case 'all_stats_up': {
        target._attackMult  = (target._attackMult  || 1) * 1.15;
        target._defenseMult = (target._defenseMult || 1) * 0.85;
        target._evasionBonus = (target._evasionBonus || 0) + 10;
        messages.push(`✨ ${label} tiene todos los atributos aumentados.`);
        break;
      }
    }

    effect.duration -= 1;
  }

  // Remove expired effects; also clear per-turn buff flags before next tick
  target.debuffs = target.debuffs.filter(x => x.duration > 0);

  // Clear per-turn flags that must be re-applied each tick
  if (!target.debuffs.some(x => x.status === 'attack_up' || x.status === 'all_stats_up'))
    delete target._attackMult;
  if (!target.debuffs.some(x => x.status === 'defense_up' || x.status === 'all_stats_up'))
    delete target._defenseMult;
  if (!target.debuffs.some(x => x.status === 'evasion_up' || x.status === 'all_stats_up'))
    delete target._evasionBonus;
  if (!target.debuffs.some(x => x.status === 'slow'))   delete target._slowed;
  if (!target.debuffs.some(x => x.status === 'blind'))  delete target._blinded;
  if (!target.debuffs.some(x => x.status === 'lifesteal')) delete target._lifesteal;
  // _skipTurn and _confused are consumed by the caller each turn
  delete target._skipTurn;
  delete target._confused;

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
    addCombatLog(`${effect.name || status} aplicado.`);
  }
  return applied;
}


function initCombat(enemy, isTactical = false, encounterMeta = null) {
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
    encounter: encounterMeta && typeof encounterMeta === 'object' ? { ...encounterMeta } : null,
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
    rewards: null,
    rewardClaimId: createCombatRewardClaimId(enemy),
    rewardApplication: {
      xpApplied: false,
      goldApplied: false,
      drops: {}
    }
  };
  
  addCombatLog(`¡Encuentro con ${enemy.name}!`);
  return combatState;
}

function createCombatRewardClaimId(enemy) {
  combatRewardSequence += 1;
  const enemyId = enemy?.id || enemy?.name || 'encounter';
  return `combat:${enemyId}:${Date.now()}:${combatRewardSequence}`;
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

  // Status: attacker attack_up / all_stats_up
  if (attacker._attackMult) baseDamage = Math.floor(baseDamage * attacker._attackMult);

  // Status: defender defense_up / all_stats_up
  if (defender._defenseMult) baseDamage = Math.floor(baseDamage * defender._defenseMult);

  // Status: attacker blind — 35% chance to miss entirely
  if (attacker._blinded && Math.random() < 0.35) {
    return { damage: 0, isCrit: false, damageType, missed: true };
  }

  // Status: defender evasion_up — extra dodge chance
  if (defender._evasionBonus) {
    const dodgeRoll = Math.random() * 100;
    if (dodgeRoll < defender._evasionBonus) {
      return { damage: 0, isCrit: false, damageType, dodged: true };
    }
  }

  const finalDamage = Math.max(1, baseDamage - reduction);

  // Status: attacker lifesteal — heal 30% of damage dealt
  if (attacker._lifesteal) {
    const heal = Math.floor(finalDamage * 0.3);
    attacker.hp = Math.min(attacker.maxHp || attacker.hp + heal, attacker.hp + heal);
  }

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
  const resolvedSkills = getResolvedPlayerSkills(getPlayerSkillContext(p));

  for (const resolved of resolvedSkills) {
    if (!resolved.definition || !PLAYER_SKILLS[resolved.id]) continue;
    actions.push({
      ...resolved.definition,
      available: resolved.usable,
      skillState: {
        known: resolved.known,
        equipped: resolved.equipped,
        authorized: resolved.authorized,
        reason: resolved.reason,
        unmetRequirements: resolved.unmetRequirements
      }
    });
  }
  
  // Flee is a combat action, not a player skill.
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

  // Tick player status effects at start of player turn
  tickCombatStatuses(p, 'Tú');
  if (p.hp <= 0) { combatState.phase = 'defeat'; return { action: 'status', defeat: true, effects: [] }; }

  // Skip turn if feared or asleep
  if (p._skipTurn) {
    delete p._skipTurn;
    combatState.phase = 'enemy';
    return { action: 'skip', success: false, message: 'No puedes actuar este turno.', effects: [] };
  }

  // Reset defending
  p.defending = false;
  
  const action = PLAYER_SKILLS[actionId] || { id: actionId };
  const resolvedSkill = actionId === 'flee' ? null : resolvePlayerSkill(actionId, getPlayerSkillContext(p));
  if (actionId !== 'flee' && (!resolvedSkill || !resolvedSkill.usable)) {
    return {
      action: actionId,
      success: false,
      message: resolvedSkill?.reason === 'not_equipped'
        ? 'Esta habilidad no está equipada.'
        : 'Esta habilidad no está disponible.',
      effects: []
    };
  }
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

  // Skip turn if feared or asleep
  if (e._skipTurn) {
    delete e._skipTurn;
    combatState.phase = 'player';
    addCombatLog(`${e.icon || '👾'} ${e.name} no puede actuar este turno.`);
    return { action: 'skip', effects: [] };
  }

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
  if (combatState.rewards) return combatState.rewards;
  
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
  if (!combatState?.rewards) return null;
  
  const r = combatState.rewards;
  const application = combatState.rewardApplication || { xpApplied: false, goldApplied: false, drops: {} };
  const rewardClaimId = combatState.rewardClaimId || (combatState.rewardClaimId = createCombatRewardClaimId(combatState.enemy));
  
  // Apply XP and gold once per victory package.
  if (!application.xpApplied) {
    if (typeof addXp === 'function') {
      addXp(r.xp);
    } else {
      gameState.xp = (gameState.xp || 0) + r.xp;
    }
    application.xpApplied = true;
  }
  
  if (!application.goldApplied) {
    gameState.gold = (gameState.gold || 0) + r.gold;
    application.goldApplied = true;
  }
  
  // Every drop is an independent durable claim. Pending drops can be retried
  // later without replaying XP, gold, or already granted drops.
  const dropResults = r.drops.map((itemId, index) => {
    const claimId = `${rewardClaimId}:drop:${index}`;
    const result = typeof LifeXPInventory !== 'undefined' && typeof LifeXPInventory.deliverReward === 'function'
      ? LifeXPInventory.deliverReward({
          itemId,
          quantity: 1,
          claimId,
          source: 'combat'
        }, {
          claimId,
          source: 'combat',
          metadata: {
            combatId: rewardClaimId,
            enemyId: combatState.enemy?.id || combatState.enemy?.name || null,
            dropIndex: index
          }
        })
      : { status: 'rejected', rejected: true, pending: false, reason: 'reward_boundary_unavailable', recoverable: false, claimId, itemId, quantity: 1 };
    application.drops[index] = {
      claimId,
      itemId,
      status: result.status,
      reason: result.reason || null,
      updatedAt: new Date().toISOString()
    };
    return result;
  });
  
  combatState.rewardApplication = application;
  if (typeof saveGame === 'function') saveGame();
  return { ...r, dropResults };
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

function pickNearestEncounterEnemy(candidates, playerLevel) {
  if (!Array.isArray(candidates) || candidates.length === 0) return null;
  const distances = candidates.map(enemy => Math.abs(Number(enemy.level) - playerLevel));
  const nearestDistance = Math.min(...distances);
  const nearest = candidates.filter(enemy => Math.abs(Number(enemy.level) - playerLevel) <= nearestDistance + 1);
  return nearest[Math.floor(Math.random() * nearest.length)] || null;
}

function pickEncounterEnemy(theme, playerLevel, encounterType = 'common') {
  const combatLevel = getEncounterPlayerLevel(playerLevel);
  const profile = getEncounterDifficultyProfile(encounterType);
  const minLevel = Math.max(1, combatLevel - profile.levelWindow);
  const maxLevel = combatLevel + profile.levelWindow;
  const themedCandidates = theme && typeof getEnemiesByTheme === 'function'
    ? getEnemiesByTheme(theme).filter(enemy => enemy.type === encounterType)
    : [];
  const globalCandidates = typeof getEnemiesByType === 'function'
    ? getEnemiesByType(encounterType)
    : [];
  const inBand = candidates => candidates.filter(enemy => enemy.level >= minLevel && enemy.level <= maxLevel);
  const themedInBand = inBand(themedCandidates);
  const globalInBand = inBand(globalCandidates);

  if (themedInBand.length > 0) {
    return { ...themedInBand[Math.floor(Math.random() * themedInBand.length)] };
  }
  if (globalInBand.length > 0) {
    return { ...globalInBand[Math.floor(Math.random() * globalInBand.length)] };
  }

  const fallbackCandidates = [...new Map(
    [...themedCandidates, ...globalCandidates].map(enemy => [enemy.id, enemy])
  ).values()];
  const nearest = pickNearestEncounterEnemy(fallbackCandidates, combatLevel);
  return nearest ? { ...nearest } : null;
}

function scaleEncounterEnemy(enemy, targetLevel) {
  if (!enemy) return null;
  const originalLevel = Number.isFinite(Number(enemy.level)) ? Number(enemy.level) : 1;
  const requestedLevel = Number.isFinite(Number(targetLevel)) ? Number(targetLevel) : originalLevel;
  const lowerBound = Math.max(1, originalLevel - MAX_ENCOUNTER_SCALE_GAP);
  const upperBound = originalLevel + MAX_ENCOUNTER_SCALE_GAP;
  const safeTargetLevel = Math.floor(Math.max(lowerBound, Math.min(upperBound, requestedLevel)));
  const levelDiff = safeTargetLevel - originalLevel;
  const hpMultiplier = Math.max(0.75, Math.min(1.35, 1 + levelDiff * 0.1));
  const statMultiplier = Math.max(0.8, Math.min(1.25, 1 + levelDiff * 0.05));
  const rewardMultiplier = Math.max(0.75, Math.min(1.35, 1 + levelDiff * 0.1));
  const scaled = { ...enemy, level: safeTargetLevel };

  scaled.hp = Math.max(1, Math.floor(Math.max(1, Number(enemy.hp) || 1) * hpMultiplier));
  scaled.maxHp = scaled.hp;
  scaled.xp = Math.max(0, Math.floor(Math.max(0, Number(enemy.xp) || 0) * rewardMultiplier));
  scaled.gold = Math.max(0, Math.floor(Math.max(0, Number(enemy.gold) || 0) * rewardMultiplier));

  for (const stat of ['fue', 'vit', 'des', 'int', 'vol', 'pre']) {
    const value = Number(enemy[stat]);
    if (Number.isFinite(value)) scaled[stat] = Math.max(0, Math.floor(value * statMultiplier));
  }
  return scaled;
}

function getEncounterType(playerLevel) {
  const combatLevel = getEncounterPlayerLevel(playerLevel);
  const available = Object.entries(ENCOUNTER_DIFFICULTY)
    .filter(([, profile]) => combatLevel >= profile.minPlayerLevel);
  const totalWeight = available.reduce((total, [, profile]) => total + profile.weight, 0);
  let roll = Math.random() * totalWeight;

  for (const [encounterType, profile] of available) {
    roll -= profile.weight;
    if (roll < 0) return encounterType;
  }
  return 'common';
}

