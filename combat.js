// ===========================================================================
// LifeXP RPG - combat.js
// Sistema de combate, habilidades, estados, encuentros y recompensas.
// ===========================================================================

let combatState = null;
let combatRewardSequence = 0;

// ===========================================================================
// ENCOUNTER DIFFICULTY
// ===========================================================================

const ENCOUNTER_THREAT = Object.freeze({
  minor: {
    label: 'Amenaza menor',
    description: 'Un encuentro por debajo de tu nivel. Sirve para limpiar la zona y mantener el ritmo.',
    tactical: false
  },
  balanced: {
    label: 'Encuentro equilibrado',
    description: 'Un encuentro en torno a tu nivel actual.',
    tactical: false
  },
  elevated: {
    label: 'Amenaza elevada',
    description: 'Un encuentro por encima de tu nivel. Conviene prepararse.',
    tactical: true
  },
  milestone: {
    label: 'Desafío mayor',
    description: 'Un encuentro de riesgo alto que exige una buena preparación.',
    tactical: true
  }
});

function getEncounterPlayerLevel(playerLevel) {
  return Math.max(1, Number(playerLevel) || 1);
}

function getEncounterDifficultyProfile(encounterType = 'common') {
  const profiles = {
    common: { levelWindow: 2 },
    elite: { levelWindow: 1 },
    boss: { levelWindow: 0 }
  };
  return profiles[encounterType] || profiles.common;
}

function getEncounterThreat(encounterType, enemyLevel, playerLevel) {
  const combatLevel = getEncounterPlayerLevel(playerLevel);
  const levelGap = (Number(enemyLevel) || combatLevel) - combatLevel;
  const threatKey = encounterType === 'boss' || levelGap >= 3
    ? 'milestone'
    : levelGap >= 1
      ? 'elevated'
      : levelGap <= -2 ? 'minor' : 'balanced';
  return { key: threatKey, encounterType, levelGap, ...ENCOUNTER_THREAT[threatKey] };
}

const GROUP_FORMATION_POLICY = Object.freeze({
  commonChance: 0.08,
  minMembers: 5,
  maxMembers: 6,
  homogeneousWeight: 55,
  memberTargetOffsetMin: -3,
  memberTargetOffsetMax: 1
});

function getFormationThreat(members, playerLevel, encounterType = 'common') {
  const validMembers = Array.isArray(members) ? members.filter(Boolean) : [];
  if (validMembers.length === 0) return getEncounterThreat(encounterType, playerLevel, playerLevel);
  const combatLevel = getEncounterPlayerLevel(playerLevel);
  const averageLevel = validMembers.reduce((total, member) => total + (Number(member.level) || combatLevel), 0) / validMembers.length;
  const levelGap = averageLevel - combatLevel;
  const formationPressure = levelGap + Math.max(0, validMembers.length - 1) * 0.75;
  const threatKey = encounterType === 'boss' || formationPressure >= 3
    ? 'milestone'
    : formationPressure >= 1.5
      ? 'elevated'
      : formationPressure <= -2 ? 'minor' : 'balanced';
  return {
    key: threatKey,
    encounterType,
    levelGap,
    formationPressure,
    memberCount: validMembers.length,
    averageLevel,
    ...ENCOUNTER_THREAT[threatKey]
  };
}

function getFormationMemberTargetLevel(playerLevel) {
  const span = GROUP_FORMATION_POLICY.memberTargetOffsetMax - GROUP_FORMATION_POLICY.memberTargetOffsetMin + 1;
  const offset = GROUP_FORMATION_POLICY.memberTargetOffsetMin + Math.floor(Math.random() * span);
  return Math.max(1, getEncounterPlayerLevel(playerLevel) + offset);
}

function getCommonEncounterCandidates(theme, playerLevel) {
  const combatLevel = getEncounterPlayerLevel(playerLevel);
  const profile = getEncounterDifficultyProfile('common');
  const minLevel = Math.max(1, combatLevel - profile.levelWindow);
  const maxLevel = combatLevel + profile.levelWindow;
  const themed = theme && typeof getEnemiesByTheme === 'function'
    ? getEnemiesByTheme(theme).filter(enemy => enemy.type === 'common')
    : [];
  const global = typeof getEnemiesByType === 'function' ? getEnemiesByType('common') : [];
  const inBand = candidates => candidates.filter(enemy => enemy.level >= minLevel && enemy.level <= maxLevel);
  const candidates = inBand(themed);
  if (candidates.length > 0) return candidates;
  const globalInBand = inBand(global);
  return globalInBand.length > 0 ? globalInBand : [...new Map(
    [...themed, ...global].map(enemy => [enemy.id, enemy])
  ).values()];
}

function generateEncounterFormation(theme, playerLevel, encounterType = 'common') {
  if (encounterType !== 'common' || Math.random() >= GROUP_FORMATION_POLICY.commonChance) return null;
  const candidates = getCommonEncounterCandidates(theme, playerLevel);
  if (candidates.length === 0) return null;

  const memberCount = GROUP_FORMATION_POLICY.minMembers
    + Math.floor(Math.random() * (GROUP_FORMATION_POLICY.maxMembers - GROUP_FORMATION_POLICY.minMembers + 1));
  const isHomogeneous = Math.random() * 100 < GROUP_FORMATION_POLICY.homogeneousWeight;
  const members = [];
  const first = candidates[Math.floor(Math.random() * candidates.length)];
  const sources = isHomogeneous
    ? Array.from({ length: memberCount }, () => first)
    : Array.from({ length: memberCount }, () => candidates[Math.floor(Math.random() * candidates.length)]);

  for (const source of sources) {
    const targetLevel = getFormationMemberTargetLevel(playerLevel);
    const scaled = scaleEncounterEnemy(source, targetLevel);
    if (scaled) members.push(scaled);
  }
  if (members.length === 0) return null;

  return {
    members,
    mode: isHomogeneous ? 'homogeneous' : 'mixed',
    memberCount: members.length,
    targetLevel: getEncounterPlayerLevel(playerLevel)
  };
}

// ===========================================================================
// STATUS EFFECTS
// ===========================================================================

const STATUS_DEFINITIONS = {
  poison: { name: 'Veneno', icon: '☠️', color: '#8bc34a' },
  burn: { name: 'Quemadura', icon: '🔥', color: '#ff5722' },
  bleed: { name: 'Sangrado', icon: '🩸', color: '#e91e63' },
  stun: { name: 'Aturdido', icon: '💫', color: '#ffc107' },
  freeze: { name: 'Congelado', icon: '❄️', color: '#03a9f4' },
  weaken: { name: 'Debilitado', icon: '⬇️', color: '#9e9e9e' },
  strengthen: { name: 'Fortalecido', icon: '⬆️', color: '#4caf50' },
  regen: { name: 'Regeneración', icon: '💚', color: '#00c853' },
  shield: { name: 'Escudo', icon: '🛡️', color: '#2196f3' },
  focus: { name: 'Concentración', icon: '🎯', color: '#673ab7' }
};

function applyStatusEffect(target, status, data = {}, sourceId = null) {
  if (!target) return false;
  const duration = Math.max(1, Number(data.duration) || 1);
  const amount = Number(data.amount) || 0;
  const effect = {
    id: `${status}:${Date.now()}:${Math.random().toString(36).slice(2, 8)}`,
    type: status,
    name: data.name || STATUS_DEFINITIONS[status]?.name || status,
    icon: data.icon || STATUS_DEFINITIONS[status]?.icon || '✨',
    duration,
    remaining: duration,
    amount,
    sourceId,
    damage: Number(data.damage) || 0
  };
  const collection = status === 'strengthen' || status === 'regen' || status === 'shield' || status === 'focus'
    ? target.buffs
    : target.debuffs;
  if (!Array.isArray(collection)) return false;
  const existing = collection.find(item => item.type === status);
  if (existing) {
    existing.remaining = Math.max(existing.remaining, duration);
    existing.amount = Math.max(existing.amount || 0, amount);
    existing.damage = Math.max(existing.damage || 0, effect.damage);
  } else {
    collection.push(effect);
  }
  return true;
}

function removeStatusEffect(target, effectId) {
  if (!target) return false;
  for (const collection of [target.buffs, target.debuffs]) {
    const index = Array.isArray(collection) ? collection.findIndex(effect => effect.id === effectId) : -1;
    if (index >= 0) {
      collection.splice(index, 1);
      return true;
    }
  }
  return false;
}

function tickCombatStatuses(target, label) {
  const effects = [
    ...(Array.isArray(target?.buffs) ? target.buffs : []),
    ...(Array.isArray(target?.debuffs) ? target.debuffs : [])
  ];
  const results = [];
  for (const effect of effects) {
    if (effect.type === 'poison' || effect.type === 'burn' || effect.type === 'bleed') {
      const damage = effect.damage || effect.amount || 0;
      target.hp = Math.max(0, target.hp - damage);
      results.push({ type: effect.type, damage });
      addCombatLog(`${effect.icon} ${label} sufre ${damage} de ${effect.name}.`);
    } else if (effect.type === 'regen') {
      const heal = Math.min(effect.amount || 0, target.maxHp - target.hp);
      target.hp += heal;
      results.push({ type: effect.type, heal });
      addCombatLog(`${effect.icon} ${label} recupera ${heal} HP.`);
    }
    effect.remaining -= 1;
    if (effect.remaining <= 0) removeStatusEffect(target, effect.id);
  }
  return results;
}

// ===========================================================================
// COMBAT CORE
// ===========================================================================

function createCombatantInstance(enemy, index = 0) {
  if (!enemy || typeof enemy !== 'object') return null;
  const baseId = enemy.id || enemy.name || 'enemy';
  return {
    ...enemy,
    instanceId: enemy.instanceId || `${baseId}:${index + 1}`,
    hp: Number.isFinite(Number(enemy.hp)) ? Number(enemy.hp) : 0,
    maxHp: Number.isFinite(Number(enemy.maxHp)) ? Number(enemy.maxHp) : Number(enemy.hp) || 0,
    buffs: Array.isArray(enemy.buffs) ? [...enemy.buffs] : [],
    debuffs: Array.isArray(enemy.debuffs) ? [...enemy.debuffs] : [],
    defending: Boolean(enemy.defending)
  };
}

function createCombatFormation(enemy, encounterMeta = null) {
  const sourceMembers = Array.isArray(enemy)
    ? enemy
    : Array.isArray(encounterMeta?.formation?.members)
      ? encounterMeta.formation.members
      : [enemy];
  const members = sourceMembers
    .map((member, index) => createCombatantInstance(member, index))
    .filter(Boolean);
  if (members.length === 0) return null;

  const sourceMeta = encounterMeta?.formation && typeof encounterMeta.formation === 'object'
    ? encounterMeta.formation
    : {};
  return {
    version: 1,
    id: sourceMeta.id || `formation:${members.map(member => member.instanceId).join('|')}`,
    mode: sourceMeta.mode || (members.length === 1 ? 'single' : 'group'),
    members
  };
}

function getCombatMembers(state = combatState) {
  if (!state) return [];
  if (Array.isArray(state.formation?.members)) return state.formation.members;
  return state.enemy ? [state.enemy] : [];
}

function getLivingCombatMembers(state = combatState) {
  return getCombatMembers(state).filter(member => Number(member.hp) > 0);
}

function getCombatMemberByInstanceId(instanceId, state = combatState) {
  return getCombatMembers(state).find(member => member.instanceId === instanceId) || null;
}

function getCombatTarget(targetInstanceId = null, state = combatState) {
  if (!state) return null;
  if (targetInstanceId) return getCombatMemberByInstanceId(targetInstanceId, state);
  if (state.selectedTargetInstanceId) {
    const selected = getCombatMemberByInstanceId(state.selectedTargetInstanceId, state);
    if (selected) return selected;
  }
  return state.enemy && state.enemy.hp > 0 ? state.enemy : getLivingCombatMembers(state)[0] || null;
}

function validateCombatTarget(targetInstanceId = null, state = combatState) {
  const target = getCombatTarget(targetInstanceId, state);
  if (!target) return { valid: false, target: null, message: 'No hay un objetivo válido.' };
  if (target.hp <= 0) return { valid: false, target, message: 'Ese objetivo ya ha sido derrotado.' };
  return { valid: true, target, message: null };
}

function selectCombatTarget(targetInstanceId, state = combatState) {
  const validation = validateCombatTarget(targetInstanceId, state);
  if (!validation.valid) return validation;
  state.selectedTargetInstanceId = validation.target.instanceId;
  return { valid: true, target: validation.target, message: null };
}

function initCombat(enemy, isTactical = false, encounterMeta = null) {
  const playerStats = typeof getDerivedStats === 'function' ? getDerivedStats() : gameState.stats;
  const resources = typeof calculateResources === 'function' ? calculateResources(playerStats) : {
    hp: 100 + playerStats.vit * 5,
    mp: 30 + playerStats.int * 3,
    sp: 50 + (playerStats.fue + playerStats.des),
    focusMax: 100
  };
  const formation = createCombatFormation(enemy, encounterMeta);
  if (!formation) return null;
  const primaryEnemy = formation.members[0];
  
  combatState = {
    active: true,
    tactical: isTactical,
    encounter: encounterMeta && typeof encounterMeta === 'object' ? { ...encounterMeta } : null,
    formation,
    turn: 1,
    phase: 'player',
    
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
    
    // Compatibility alias: current combat logic continues to use the primary
    // member until the target-selection phase is enabled.
    enemy: primaryEnemy,
    
    log: [],
    rewards: null,
    rewardClaimId: createCombatRewardClaimId(formation.members.length === 1
      ? primaryEnemy
      : { id: formation.id }),
    rewardApplication: {
      xpApplied: false,
      goldApplied: false,
      drops: {}
    }
  };
  
  addCombatLog(formation.members.length === 1
    ? `¡Encuentro con ${primaryEnemy.name}!`
    : `¡Encuentro con ${formation.members.length} enemigos!`);
  return combatState;
}

function createCombatRewardClaimId(enemy) {
  combatRewardSequence += 1;
  const enemyId = enemy?.id || enemy?.name || 'encounter';
  return `combat:${enemyId}:${Date.now()}:${combatRewardSequence}`;
}

// ===========================================================================
// DAMAGE CALCULATION
// ===========================================================================

function calculateDamage(attacker, defender, skill = null) {
  let baseDamage = 0;
  let damageType = 'physical';
  
  if (skill) {
    baseDamage = skill.power || 10;
    damageType = skill.damageType || 'physical';
    
    if (skill.scaling) {
      for (const [stat, mult] of Object.entries(skill.scaling)) {
        baseDamage += Math.floor((attacker.stats?.[stat] || attacker[stat] || 10) * mult);
      }
    }
  } else {
    baseDamage = 5 + Math.floor((attacker.fue || attacker.stats?.fue || 10) * 0.8);
  }
  
  const attackerStats = attacker.stats || attacker;
  const defenderStats = defender.stats || defender;
  const attackStat = damageType === 'magical' ? (attackerStats.int || 10) : (attackerStats.fue || 10);
  const defenseStat = damageType === 'magical' ? (defenderStats.vol || 10) : (defenderStats.vit || 10);
  const defense = Math.floor(defenseStat * 0.5);
  let damage = Math.max(1, Math.floor(baseDamage + attackStat * 0.4 - defense));
  
  const isCrit = Math.random() * 100 < (attackerStats.pre || 10) * 0.5;
  if (isCrit) damage = Math.floor(damage * 1.5);
  
  if (defender.defending) damage = Math.floor(damage * 0.5);
  const shield = (defender.buffs || []).find(effect => effect.type === 'shield');
  if (shield) {
    const absorbed = Math.min(shield.amount || 0, damage);
    shield.amount -= absorbed;
    damage -= absorbed;
    if (shield.amount <= 0) removeStatusEffect(defender, shield.id);
  }
  
  return { damage: Math.max(0, damage), damageType, isCrit };
}

function calculateHeal(attacker, skill) {
  const base = skill.power || 20;
  const scaling = skill.scaling?.int || 0.5;
  return Math.max(1, Math.floor(base + (attacker.stats?.int || attacker.int || 10) * scaling));
}

// ===========================================================================
// PLAYER SKILLS
// ===========================================================================

const PLAYER_SKILLS = {
  basic_attack: {
    id: 'basic_attack', name: 'Ataque básico', icon: '⚔️', type: 'attack', power: 10,
    scaling: { fue: 0.6 }, desc: 'Un ataque físico fiable.'
  },
  power_strike: {
    id: 'power_strike', name: 'Golpe poderoso', icon: '💥', type: 'attack', power: 22,
    scaling: { fue: 0.9 }, costType: 'sp', cost: 20, desc: 'Un golpe fuerte que consume energía.'
  },
  quick_shot: {
    id: 'quick_shot', name: 'Disparo rápido', icon: '🏹', type: 'attack', power: 14,
    scaling: { des: 0.8 }, costType: 'sp', cost: 15, desc: 'Un disparo veloz y preciso.'
  },
  fireball: {
    id: 'fireball', name: 'Bola de fuego', icon: '🔥', type: 'attack', power: 28,
    scaling: { int: 1.1 }, damageType: 'magical', costType: 'mp', cost: 18, desc: 'Daño mágico de fuego.'
  },
  heal: {
    id: 'heal', name: 'Curar', icon: '💚', type: 'heal', power: 24,
    scaling: { int: 0.8 }, costType: 'mp', cost: 15, desc: 'Recupera una parte de tus HP.'
  },
  defend: {
    id: 'defend', name: 'Defender', icon: '🛡️', type: 'defend', focusGain: 15,
    desc: 'Reduce el daño del siguiente turno.'
  },
  focus_strike: {
    id: 'focus_strike', name: 'Golpe concentrado', icon: '🎯', type: 'attack', power: 40,
    scaling: { fue: 1.2 }, costType: 'focus', cost: 50, desc: 'Un golpe de gran precisión.'
  },
  ultimate: {
    id: 'ultimate', name: 'Técnica definitiva', icon: '✨', type: 'ultimate', power: 60,
    scaling: { fue: 1.5, int: 0.5 }, costType: 'focus', cost: 100, desc: 'Tu técnica más poderosa.'
  }
};

function getPlayerSkillContext(player) {
  const stats = player?.stats || {};
  return {
    stats,
    level: gameState?.level || 1,
    equippedSkills: gameState?.equippedSkills || [],
    knownSkills: gameState?.knownSkills || [],
    classId: gameState?.classId || null
  };
}

function resolvePlayerSkill(actionId, context) {
  const definition = PLAYER_SKILLS[actionId];
  if (!definition) return null;
  const known = actionId === 'basic_attack' || actionId === 'defend' || actionId === 'flee'
    || (Array.isArray(context.knownSkills) && context.knownSkills.includes(actionId));
  const equipped = actionId === 'basic_attack' || actionId === 'defend'
    || (Array.isArray(context.equippedSkills) && context.equippedSkills.includes(actionId));
  return {
    ...definition,
    known,
    equipped,
    authorized: known && equipped,
    usable: known && equipped,
    reason: !known ? 'unknown' : !equipped ? 'not_equipped' : null
  };
}

function getResolvedPlayerSkills(context) {
  return Object.keys(PLAYER_SKILLS).map(id => {
    const resolved = resolvePlayerSkill(id, context);
    return { id, definition: PLAYER_SKILLS[id], ...resolved };
  });
}

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
  
  actions.push({
    id: 'flee', name: 'Huir', icon: '🏃', type: 'flee',
    available: true,
    fleeChance: Math.min(90, 30 + p.stats.des * 2),
    desc: `${Math.min(90, 30 + p.stats.des * 2)}% de éxito`
  });
  
  return actions;
}

// ===========================================================================
// PLAYER ACTIONS
// ===========================================================================

function executePlayerAction(actionId, targetInstanceId = null) {
  if (!combatState || combatState.phase !== 'player') return null;

  const p = combatState.player;
  const e = combatState.enemy;

  const action = PLAYER_SKILLS[actionId] || { id: actionId };
  const requiresTarget = action.type === 'attack' || action.type === 'ultimate';
  const targetValidation = requiresTarget ? validateCombatTarget(targetInstanceId) : null;
  if (targetValidation && !targetValidation.valid) {
    return { action: actionId, success: false, message: targetValidation.message, effects: [] };
  }
  const target = targetValidation?.target || e;

  tickCombatStatuses(p, 'Tú');
  if (p.hp <= 0) { combatState.phase = 'defeat'; return { action: 'status', defeat: true, effects: [] }; }

  if (p._skipTurn) {
    delete p._skipTurn;
    combatState.phase = 'enemy';
    return { action: 'skip', success: false, message: 'No puedes actuar este turno.', effects: [] };
  }

  p.defending = false;
  
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
      if (action.costType && action.cost) {
        if (p[action.costType] < action.cost) {
          result.success = false;
          result.message = `No tienes suficiente ${action.costType.toUpperCase()}`;
          return result;
        }
        p[action.costType] -= action.cost;
      }
      
      const dmgResult = calculateDamage(p, target, action);
      target.hp = Math.max(0, target.hp - dmgResult.damage);
      result.targetInstanceId = target.instanceId;
      result.effects.push(...applyEquipmentOnHitEffects(p, target, dmgResult));
      
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
  
  if (getLivingCombatMembers().length === 0) {
    combatState.phase = 'victory';
    result.victory = true;
    addCombatLog(`🏆 ¡Victoria! ${getCombatMembers().length === 1 ? e.name + ' derrotado.' : 'La formación ha sido derrotada.'}`);
    calculateCombatRewards();
  } else if (combatState.phase === 'player') {
    combatState.phase = 'enemy';
  }
  
  return result;
}

// ===========================================================================
// ENEMY AI
// ===========================================================================

function executeEnemyMemberTurn(enemyMember, player) {
  const result = { action: 'attack', effects: [], memberInstanceId: enemyMember.instanceId };

  tickCombatStatuses(enemyMember, enemyMember.name || 'Enemigo');
  if (enemyMember.hp <= 0) {
    result.action = 'status';
    result.defeated = true;
    return result;
  }

  if (enemyMember._skipTurn) {
    delete enemyMember._skipTurn;
    addCombatLog(`${enemyMember.icon || '👾'} ${enemyMember.name} no puede actuar este turno.`);
    result.action = 'skip';
    return result;
  }

  enemyMember.defending = false;
  
  let chosenSkill = null;
  
  if (enemyMember.skills && enemyMember.skills.length > 0) {
    const usable = enemyMember.skills.filter(skill => {
      if (skill.costType === 'mp' && (enemyMember.mp || 0) < skill.cost) return false;
      if (skill.type === 'heal' && enemyMember.hp >= enemyMember.maxHp * 0.8) return false;
      return true;
    });
    
    if (usable.length > 0 && Math.random() < 0.4) {
      chosenSkill = usable[Math.floor(Math.random() * usable.length)];
    }
  }
  
  if (chosenSkill) {
    if (chosenSkill.costType === 'mp') {
      enemyMember.mp = (enemyMember.mp || 0) - chosenSkill.cost;
    }
    
    if (chosenSkill.type === 'heal') {
      const heal = chosenSkill.power || 20;
      enemyMember.hp = Math.min(enemyMember.maxHp, enemyMember.hp + heal);
      result.heal = heal;
      addCombatLog(`${enemyMember.icon} ${enemyMember.name} usa ${chosenSkill.name}: +${heal} HP`);
    } else {
      const dmgResult = calculateDamage(enemyMember, player, chosenSkill);
      player.hp = Math.max(0, player.hp - dmgResult.damage);
      result.damage = dmgResult.damage;
      result.isCrit = dmgResult.isCrit;
      addCombatLog(`${enemyMember.icon} ${enemyMember.name} usa ${chosenSkill.name}: ${dmgResult.damage} daño${dmgResult.isCrit ? ' ¡CRÍTICO!' : ''}`);
    }
  } else {
    const dmgResult = calculateDamage(enemyMember, player);
    player.hp = Math.max(0, player.hp - dmgResult.damage);
    result.damage = dmgResult.damage;
    result.isCrit = dmgResult.isCrit;
    addCombatLog(`${enemyMember.icon} ${enemyMember.name} ataca: ${dmgResult.damage} daño${dmgResult.isCrit ? ' ¡CRÍTICO!' : ''}`);
  }

  return result;
}

function executeEnemyTurn() {
  if (!combatState || combatState.phase !== 'enemy') return null;
  
  const p = combatState.player;
  const livingMembers = getLivingCombatMembers();
  if (livingMembers.length === 0) {
    combatState.phase = 'victory';
    calculateCombatRewards();
    return { action: 'status', victory: true, effects: [], members: [] };
  }

  const memberResults = [];
  for (const enemyMember of livingMembers) {
    if (p.hp <= 0) break;
    memberResults.push(executeEnemyMemberTurn(enemyMember, p));
  }

  const result = memberResults.length === 1
    ? { ...memberResults[0], members: memberResults }
    : {
        action: 'formation_attack',
        effects: memberResults.flatMap(memberResult => memberResult.effects || []),
        damage: memberResults.reduce((total, memberResult) => total + (memberResult.damage || 0), 0),
        members: memberResults
      };

  if (p.hp <= 0) {
    combatState.phase = 'defeat';
    result.defeat = true;
    addCombatLog('💀 Has sido derrotado...');
  } else if (getLivingCombatMembers().length === 0) {
    combatState.phase = 'victory';
    result.victory = true;
    addCombatLog('🏆 ¡La formación ha sido derrotada!');
    calculateCombatRewards();
  } else {
    combatState.phase = 'player';
    combatState.turn++;
  }
  
  return result;
}

// ===========================================================================
// AUTO COMBAT
// ===========================================================================

function resolveAutoCombat(enemy) {
  const combatEnemy = Array.isArray(enemy) ? enemy : enemy;
  const members = Array.isArray(combatEnemy) ? combatEnemy : [combatEnemy];
  const playerStats = typeof getDerivedStats === 'function' ? getDerivedStats() : gameState.stats;
  const playerLevel = gameState?.level || 1;
  let playerPower = (playerStats.fue || 10) + (playerStats.int || 10) + (playerStats.des || 10) + (playerStats.vit || 10);
  const enemyPower = members.reduce((total, member) => total + (member.level || 1) * 4 + (member.hp || 0) / 10, 0);
  const result = {
    victory: playerPower >= enemyPower,
    turns: Math.max(1, Math.ceil(enemyPower / Math.max(1, playerPower))),
    damageTaken: Math.max(0, Math.floor(enemyPower - playerPower * 0.35)),
    rewards: null,
    threat: getFormationThreat(members, playerLevel, members.length > 1 ? 'common' : members[0]?.type || 'common')
  };
  if (result.victory) {
    result.rewards = members.map(calculateCombatMemberRewards).reduce((total, rewards) => ({
      xp: total.xp + rewards.xp,
      gold: total.gold + rewards.gold,
      drops: total.drops.concat(rewards.drops)
    }), { xp: 0, gold: 0, drops: [] });
  }
  return result;
}

// ===========================================================================
// REWARDS
// ===========================================================================

function calculateCombatMemberRewards(member) {
  const rewards = {
    memberInstanceId: member.instanceId,
    enemyId: member.id || member.name || member.instanceId,
    xp: member.xp || Math.floor(member.level * 15),
    gold: member.gold || Math.floor(member.level * 5 + Math.random() * member.level * 3),
    drops: []
  };
  
  if (member.drops && member.drops.length > 0) {
    for (const drop of member.drops) {
      const chance = drop.chance || 0.1;
      if (Math.random() < chance) {
        rewards.drops.push(drop.itemId || drop.item);
      }
    }
  }
  
  return rewards;
}

function calculateCombatRewards() {
  if (!combatState || combatState.phase !== 'victory') return null;
  if (combatState.rewards) return combatState.rewards;
  
  const memberRewards = getCombatMembers().map(calculateCombatMemberRewards);
  const dropSources = memberRewards.flatMap(memberReward => memberReward.drops.map(itemId => ({
    itemId,
    memberInstanceId: memberReward.memberInstanceId,
    enemyId: memberReward.enemyId
  })));
  const rewards = {
    xp: memberRewards.reduce((total, memberReward) => total + memberReward.xp, 0),
    gold: memberRewards.reduce((total, memberReward) => total + memberReward.gold, 0),
    drops: dropSources.map(drop => drop.itemId),
    memberRewards,
    dropSources
  };
  
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
  
  const dropSources = Array.isArray(r.dropSources)
    ? r.dropSources
    : r.drops.map((itemId, index) => ({
        itemId,
        memberInstanceId: combatState.enemy?.instanceId || null,
        enemyId: combatState.enemy?.id || combatState.enemy?.name || null,
        dropIndex: index
      }));
  const dropResults = r.drops.map((itemId, index) => {
    const source = dropSources[index] || {};
    const memberInstanceId = source.memberInstanceId || combatState.enemy?.instanceId || 'member';
    const claimId = `${rewardClaimId}:member:${memberInstanceId}:drop:${index}`;
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
            enemyId: source.enemyId || combatState.enemy?.id || combatState.enemy?.name || null,
            memberInstanceId,
            dropIndex: index
          }
        })
      : { status: 'rejected', rejected: true, pending: false, reason: 'reward_boundary_unavailable', recoverable: false, claimId, itemId, quantity: 1 };
    application.drops[index] = {
      claimId,
      itemId,
      memberInstanceId,
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

// ===========================================================================
// COMBAT LOG
// ===========================================================================

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

// ===========================================================================
// COMBAT UTILITIES
// ===========================================================================

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
