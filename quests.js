// ===========================================================================
// LifeXP RPG - Quest System (Block 5)
// ===========================================================================

// ===========================================================================
// QUEST TYPES
// ===========================================================================

const QUEST_TYPE = {
  daily: { name: 'Diaria', icon: '\uD83D\uDCC5', color: '#4ade80' },
  simple: { name: 'Misi\u00F3n', icon: '\uD83D\uDCDC', color: '#60a5fa' },
  compound: { name: 'Compuesta', icon: '\uD83D\uDCDA', color: '#a78bfa' },
  story: { name: 'Historia', icon: '\u2B50', color: '#ffd700' },
  bounty: { name: 'Bounty', icon: '\uD83C\uDFAF', color: '#f87171' },
  class_quest: { name: 'Clase', icon: '\u2694\uFE0F', color: '#ff4d6d' },
  event: { name: 'Evento', icon: '\uD83C\uDF89', color: '#22d3ee' }
};

const QUEST_STATUS = {
  available: 'available',
  active: 'active',
  completed: 'completed',
  failed: 'failed',
  locked: 'locked'
};

// ===========================================================================
// QUEST DATABASE
// ===========================================================================

const QUESTS = {
  
  // ========== DAILY QUESTS ==========
  daily_any_3: {
    id: 'daily_any_3',
    type: 'daily',
    name: 'Rutina Diaria',
    desc: 'Completa 3 tareas de cualquier categor\u00EDa.',
    minLevel: 1,
    objectives: [
      { id: 'obj_1', type: 'complete_tasks', count: 3, category: null, progress: 0 }
    ],
    rewards: { xp: 50, gold: 15 },
    repeatable: true,
    resetDaily: true
  },
  
  daily_casa_2: {
    id: 'daily_casa_2',
    type: 'daily',
    name: 'Hogar Ordenado',
    desc: 'Completa 2 tareas de Casa.',
    minLevel: 1,
    objectives: [
      { id: 'obj_1', type: 'complete_tasks', count: 2, category: 'casa', progress: 0 }
    ],
    rewards: { xp: 40, gold: 10 },
    repeatable: true,
    resetDaily: true
  },
  
  daily_cuerpo_2: {
    id: 'daily_cuerpo_2',
    type: 'daily',
    name: 'Cuerpo en Forma',
    desc: 'Completa 2 tareas de Cuerpo.',
    minLevel: 1,
    objectives: [
      { id: 'obj_1', type: 'complete_tasks', count: 2, category: 'cuerpo', progress: 0 }
    ],
    rewards: { xp: 45, gold: 12 },
    repeatable: true,
    resetDaily: true
  },

  // ========== SIMPLE QUESTS ==========
  quest_first_steps: {
    id: 'quest_first_steps',
    type: 'simple',
    name: 'Primeros Pasos',
    desc: 'Completa tu primera tarea y familiar\u00EDzate con el sistema.',
    minLevel: 1,
    objectives: [
      { id: 'obj_1', type: 'complete_tasks', count: 1, category: null, progress: 0 }
    ],
    rewards: { xp: 30, gold: 10, items: ['pocion_vida_menor'] },
    repeatable: false
  },
  
  quest_home_master: {
    id: 'quest_home_master',
    type: 'simple',
    name: 'Maestro del Hogar',
    desc: 'Demuestra que puedes mantener tu espacio en orden.',
    minLevel: 3,
    objectives: [
      { id: 'obj_1', type: 'complete_tasks', count: 10, category: 'casa', progress: 0 }
    ],
    rewards: { xp: 150, gold: 50, items: ['escoba_encantada'] },
    repeatable: false
  },
  
  quest_body_temple: {
    id: 'quest_body_temple',
    type: 'simple',
    name: 'El Cuerpo es un Templo',
    desc: 'Cuida tu cuerpo completando tareas f\u00EDsicas.',
    minLevel: 3,
    objectives: [
      { id: 'obj_1', type: 'complete_tasks', count: 10, category: 'cuerpo', progress: 0 }
    ],
    rewards: { xp: 150, gold: 50, items: ['pocion_fuerza'] },
    repeatable: false
  },

  // ========== BOUNTIES ==========
  bounty_slimes: {
    id: 'bounty_slimes',
    type: 'bounty',
    name: 'Plaga de Slimes',
    desc: 'Los slimes han infestado las tuber\u00EDas. Elim\u00EDnalos.',
    minLevel: 5,
    timeLimit: 7, // days
    objectives: [
      { id: 'obj_1', type: 'defeat_enemy', enemyId: 'slime_acido', count: 3, progress: 0 }
    ],
    rewards: { xp: 120, gold: 60, items: ['nucleo_slime'] },
    repeatable: true
  },
  
  bounty_bandits: {
    id: 'bounty_bandits',
    type: 'bounty',
    name: 'Bandidos en el Camino',
    desc: 'Unos bandidos molestan a los viajeros. Enc\u00E1rgate de ellos.',
    minLevel: 8,
    timeLimit: 5,
    objectives: [
      { id: 'obj_1', type: 'defeat_enemy', enemyId: 'bandido', count: 5, progress: 0 }
    ],
    rewards: { xp: 200, gold: 100 },
    repeatable: true
  },

  // ========== STORY QUESTS ==========
  story_wolf_hills: {
    id: 'story_wolf_hills',
    type: 'story',
    name: 'El Lobo de las Colinas',
    desc: 'Un lobo gigante aterroriza los alrededores. Investiga y enfr\u00E9ntalo.',
    minLevel: 10,
    chapters: [
      {
        id: 'ch_1',
        name: 'Rumores',
        desc: 'Investiga en el pueblo sobre el lobo.',
        objectives: [
          { id: 'obj_1', type: 'complete_tasks', count: 2, category: 'social', progress: 0 }
        ],
        rewards: { xp: 50 },
        dialogue: {
          start: 'Los aldeanos hablan de un lobo enorme en las colinas. Deber\u00EDas investigar.',
          complete: 'Los rumores son ciertos. El lobo ataca de noche. Debes rastrearlo.'
        }
      },
      {
        id: 'ch_2',
        name: 'Rastreo',
        desc: 'Rastrea al lobo en las colinas.',
        objectives: [
          { id: 'obj_1', type: 'complete_tasks', count: 3, category: 'cuerpo', progress: 0 }
        ],
        encounter: { enemyId: 'lobo_escarcha', count: 2, auto: true },
        rewards: { xp: 80, items: ['piel_lobo'] },
        dialogue: {
          start: 'Sigues las huellas por las colinas...',
          complete: 'Encuentras la guarida. El lobo alfa est\u00E1 dentro.'
        }
      },
      {
        id: 'ch_3',
        name: 'Preparaci\u00F3n',
        desc: 'Prepara tu equipo para el enfrentamiento.',
        objectives: [
          { id: 'obj_1', type: 'complete_tasks', count: 2, category: 'casa', progress: 0 },
          { id: 'obj_2', type: 'complete_tasks', count: 1, category: 'gestiones', progress: 0 }
        ],
        rewards: { items: ['pocion_fuerza', 'pocion_fuerza'] },
        dialogue: {
          start: 'Necesitas estar preparado. Organiza tu equipo.',
          complete: 'Est\u00E1s listo. Es hora de enfrentar al lobo alfa.'
        }
      },
      {
        id: 'ch_4',
        name: 'El Enfrentamiento',
        desc: 'Derrota al Lobo Alfa.',
        objectives: [
          { id: 'obj_1', type: 'defeat_boss', enemyId: 'lobo_alfa', count: 1, progress: 0 }
        ],
        rewards: { xp: 200, gold: 100, items: ['colmillo_alfa'] },
        dialogue: {
          start: '\u00A1El Lobo Alfa aparece! Es enorme.',
          complete: '\u00A1Victoria! El lobo ha ca\u00EDdo. Los aldeanos est\u00E1n a salvo.'
        }
      }
    ],
    currentChapter: 0,
    rewards: { xp: 300, gold: 150 }, // Final rewards
    repeatable: false
  },

  // ========== CLASS QUESTS ==========
  class_warrior_berserker: {
    id: 'class_warrior_berserker',
    type: 'class_quest',
    name: 'El Camino del Berserker',
    desc: 'Demuestra tu furia interior para desbloquear la clase Berserker.',
    minLevel: 30,
    requirements: {
      classId: 'guerrero',
      minStats: { fue: 25 }
    },
    objectives: [
      { id: 'obj_1', type: 'complete_tasks', count: 10, category: 'cuerpo', timeLimit: 7, progress: 0 },
      { id: 'obj_2', type: 'defeat_boss', enemyId: 'espejo_oscuro', count: 1, progress: 0 }
    ],
    rewards: { 
      xp: 500, 
      gold: 200,
      unlockClass: 'berserker'
    },
    repeatable: false
  }
};

// ===========================================================================
// QUEST STATE MANAGEMENT
// ===========================================================================

function initQuestState() {
  if (!gameState.quests) {
    gameState.quests = {
      active: [],      // Quest IDs currently active
      completed: [],   // Quest IDs completed
      failed: [],      // Quest IDs failed
      dailyReset: null // Last daily reset date
    };
  }
}

function getActiveQuests() {
  initQuestState();
  return gameState.quests.active.map(qid => {
    const quest = QUESTS[qid];
    if (!quest) return null;
    const state = gameState.quests[qid] || {};
    return { ...quest, ...state };
  }).filter(Boolean);
}

function getAvailableQuests() {
  initQuestState();
  const playerLevel = gameState.level || 1;
  
  return Object.values(QUESTS).filter(q => {
    // Not already active or completed (unless repeatable)
    if (gameState.quests.active.includes(q.id)) return false;
    if (gameState.quests.completed.includes(q.id) && !q.repeatable) return false;
    
    // Level requirement
    if (q.minLevel && playerLevel < q.minLevel) return false;
    
    // Class requirement
    if (q.requirements?.classId && gameState.classId !== q.requirements.classId) return false;
    
    // Stat requirements
    if (q.requirements?.minStats) {
      for (const [stat, min] of Object.entries(q.requirements.minStats)) {
        if ((gameState.stats[stat] || 0) < min) return false;
      }
    }
    
    return true;
  });
}

let questRewardSequence = 0;

function createQuestInstanceId(questId) {
  questRewardSequence += 1;
  return `quest:${questId}:${Date.now()}:${questRewardSequence}`;
}

function ensureQuestRewardState(questId, questState) {
  if (!questState || typeof questState !== 'object') return null;
  if (!questState.instanceId) {
    const legacyDate = typeof questState.startedAt === 'string' && questState.startedAt
      ? questState.startedAt
      : 'legacy';
    questState.instanceId = `quest:${questId}:${legacyDate}`;
  }
  if (!questState.rewardApplication || typeof questState.rewardApplication !== 'object') {
    questState.rewardApplication = { final: null, chapters: {} };
  }
  if (!questState.rewardApplication.chapters || typeof questState.rewardApplication.chapters !== 'object') {
    questState.rewardApplication.chapters = {};
  }
  return questState.rewardApplication;
}

function cloneQuestRewardPackage(rewards) {
  return rewards && typeof rewards === 'object' ? JSON.parse(JSON.stringify(rewards)) : {};
}

function getQuestRewardSlot(questId, questState, rewardKey, claimId, rewards) {
  const application = ensureQuestRewardState(questId, questState);
  if (!application) return null;
  const isFinal = rewardKey === 'final';
  const collection = isFinal ? application : application.chapters;
  const key = isFinal ? 'final' : String(rewardKey);
  if (!collection[key] || typeof collection[key] !== 'object') {
    collection[key] = {
      claimId,
      rewardPackage: cloneQuestRewardPackage(rewards),
      status: 'pending',
      xp: null,
      gold: null,
      items: [],
      unlockClass: null
    };
  } else {
    if (!collection[key].claimId) collection[key].claimId = claimId;
    if (!collection[key].rewardPackage) collection[key].rewardPackage = cloneQuestRewardPackage(rewards);
    if (!Array.isArray(collection[key].items)) collection[key].items = [];
  }
  return collection[key];
}

function getQuestRewardResult(status, details = {}) {
  return {
    status,
    granted: status === 'granted',
    pending: status === 'pending',
    rejected: status === 'rejected',
    ...details
  };
}

function applyQuestScalarReward(kind, amount, claimId, source, options = {}) {
  const numericAmount = Number(amount);
  if (!Number.isFinite(numericAmount) || numericAmount <= 0) {
    return getQuestRewardResult('granted', { claimId, kind, amount: 0, skipped: true });
  }
  if (!gameState.rewardLedger || typeof gameState.rewardLedger !== 'object' || Array.isArray(gameState.rewardLedger)) {
    gameState.rewardLedger = {};
  }
  const previous = gameState.rewardLedger[claimId];
  if (previous?.status === 'granted') {
    return getQuestRewardResult('granted', { claimId, kind, amount: previous.amount || numericAmount, duplicate: true });
  }
  if (previous?.status === 'rejected' && options.retryRejected !== true) {
    return getQuestRewardResult('rejected', {
      claimId,
      kind,
      amount: previous.amount || numericAmount,
      reason: previous.reason,
      recoverable: true,
      duplicate: true
    });
  }

  if (kind === 'xp') {
    if (typeof addXp !== 'function') {
      gameState.rewardLedger[claimId] = { status: 'rejected', kind, amount: numericAmount, source, reason: 'xp_api_unavailable', updatedAt: new Date().toISOString() };
      return getQuestRewardResult('rejected', { claimId, kind, amount: numericAmount, reason: 'xp_api_unavailable', recoverable: true });
    }
    addXp(numericAmount);
  } else if (kind === 'gold') {
    if (typeof gameState.gold !== 'number' || !Number.isFinite(gameState.gold)) {
      gameState.rewardLedger[claimId] = { status: 'rejected', kind, amount: numericAmount, source, reason: 'gold_state_unavailable', updatedAt: new Date().toISOString() };
      return getQuestRewardResult('rejected', { claimId, kind, amount: numericAmount, reason: 'gold_state_unavailable', recoverable: true });
    }
    gameState.gold += numericAmount;
  } else {
    gameState.rewardLedger[claimId] = { status: 'rejected', kind, amount: numericAmount, source, reason: 'unsupported_scalar_reward', updatedAt: new Date().toISOString() };
    return getQuestRewardResult('rejected', { claimId, kind, amount: numericAmount, reason: 'unsupported_scalar_reward', recoverable: false });
  }

  gameState.rewardLedger[claimId] = { status: 'granted', kind, amount: numericAmount, source, updatedAt: new Date().toISOString() };
  return getQuestRewardResult('granted', { claimId, kind, amount: numericAmount, duplicate: false });
}

function applyQuestUnlockReward(classId, claimId, source, options = {}) {
  if (!classId) return getQuestRewardResult('granted', { claimId, kind: 'unlockClass', skipped: true });
  if (!gameState.rewardLedger || typeof gameState.rewardLedger !== 'object' || Array.isArray(gameState.rewardLedger)) {
    gameState.rewardLedger = {};
  }
  const previous = gameState.rewardLedger[claimId];
  if (previous?.status === 'granted') return getQuestRewardResult('granted', { claimId, kind: 'unlockClass', classId, duplicate: true });
  if (previous?.status === 'rejected' && options.retryRejected !== true) {
    return getQuestRewardResult('rejected', { claimId, kind: 'unlockClass', classId, reason: previous.reason, recoverable: true, duplicate: true });
  }
  if (!Array.isArray(gameState.unlockedClasses)) gameState.unlockedClasses = [];
  if (!gameState.unlockedClasses.includes(classId)) gameState.unlockedClasses.push(classId);
  gameState.rewardLedger[claimId] = { status: 'granted', kind: 'unlockClass', classId, source, updatedAt: new Date().toISOString() };
  return getQuestRewardResult('granted', { claimId, kind: 'unlockClass', classId, duplicate: false });
}

function grantQuestRewards(rewards, options = {}) {
  const questId = options.questId || 'unknown';
  const questState = options.questState || null;
  const rewardKey = options.rewardKey || 'final';
  const claimId = options.claimId || `${questState?.instanceId || `quest:${questId}`}:${rewardKey}`;
  const source = options.source || (rewardKey === 'final' ? 'quest' : 'quest_chapter');
  const slot = getQuestRewardSlot(questId, questState, rewardKey, claimId, rewards);
  const rewardPackage = slot?.rewardPackage || cloneQuestRewardPackage(rewards);
  if (slot && !slot.rewardPackage) slot.rewardPackage = rewardPackage;
  const results = [];

  if (rewardPackage.xp) {
    const result = applyQuestScalarReward('xp', rewardPackage.xp, `${claimId}:xp`, source, options);
    if (slot) slot.xp = result;
    results.push(result);
  }
  if (rewardPackage.gold) {
    const result = applyQuestScalarReward('gold', rewardPackage.gold, `${claimId}:gold`, source, options);
    if (slot) slot.gold = result;
    results.push(result);
  }
  if (Array.isArray(rewardPackage.items)) {
    rewardPackage.items.forEach((itemId, index) => {
      const itemClaimId = `${claimId}:item:${index}`;
      const result = typeof LifeXPInventory !== 'undefined' && typeof LifeXPInventory.deliverReward === 'function'
        ? LifeXPInventory.deliverReward({ itemId, quantity: 1, claimId: itemClaimId, source }, {
            claimId: itemClaimId,
            source,
            retryRejected: options.retryRejected === true,
            metadata: { questId, rewardKey, itemIndex: index }
          })
        : getQuestRewardResult('rejected', { claimId: itemClaimId, itemId, reason: 'reward_boundary_unavailable', recoverable: false });
      if (slot) slot.items[index] = result;
      results.push(result);
    });
  }
  if (rewardPackage.unlockClass) {
    const result = applyQuestUnlockReward(rewardPackage.unlockClass, `${claimId}:unlock_class`, source, options);
    if (slot) slot.unlockClass = result;
    results.push(result);
  }

  const status = results.some(result => result.status === 'pending')
    ? 'pending'
    : results.some(result => result.status === 'rejected')
      ? 'rejected'
      : 'granted';
  if (slot) {
    slot.status = status;
    slot.updatedAt = new Date().toISOString();
  }
  return { status, claimId, results, rewardPackage };
}

function acceptQuest(questId) {
  initQuestState();
  const quest = QUESTS[questId];
  if (!quest) return false;
  
  // Check max active quests (3)
  if (gameState.quests.active.length >= 3) {
    return { success: false, message: 'Ya tienes 3 misiones activas.' };
  }
  
  // Initialize quest state
  gameState.quests.active.push(questId);
  gameState.quests[questId] = {
    startedAt: todayStr(),
    instanceId: createQuestInstanceId(questId),
    objectives: quest.objectives ? quest.objectives.map(o => ({ ...o, progress: 0 })) : [],
    currentChapter: 0,
    rewardApplication: { final: null, chapters: {} }
  };
  
  saveGame();
  return { success: true, message: `\u00A1Misi\u00F3n "${quest.name}" aceptada!` };
}

function abandonQuest(questId) {
  initQuestState();
  gameState.quests.active = gameState.quests.active.filter(id => id !== questId);
  delete gameState.quests[questId];
  saveGame();
}

function completeQuest(questId) {
  initQuestState();
  const quest = QUESTS[questId];
  if (!quest) return null;
  const wasActive = gameState.quests.active.includes(questId);
  if (!wasActive && gameState.quests.completed.includes(questId)) {
    return getQuestRewardStatus(questId);
  }
  const questState = gameState.quests[questId] || {
    startedAt: todayStr(),
    instanceId: createQuestInstanceId(questId),
    rewardApplication: { final: null, chapters: {} }
  };
  gameState.quests[questId] = questState;
  ensureQuestRewardState(questId, questState);
  
  // Move from active to completed
  gameState.quests.active = gameState.quests.active.filter(id => id !== questId);
  if (!gameState.quests.completed.includes(questId)) {
    gameState.quests.completed.push(questId);
  }
  
  const result = quest.rewards
    ? grantQuestRewards(quest.rewards, {
        questId,
        questState,
        rewardKey: 'final',
        claimId: `${questState.instanceId}:final`,
        source: 'quest'
      })
    : { status: 'granted', claimId: `${questState.instanceId}:final`, results: [], rewardPackage: {} };
  saveGame();
  return result;
}

function getQuestRewardStatus(questId) {
  initQuestState();
  const questState = gameState.quests[questId];
  if (!questState?.rewardApplication) return null;
  const final = questState.rewardApplication.final;
  return {
    questId,
    final: final ? { ...final, items: Array.isArray(final.items) ? [...final.items] : [] } : null,
    chapters: Object.entries(questState.rewardApplication.chapters || {}).map(([rewardKey, chapter]) => ({
      rewardKey,
      ...chapter,
      items: Array.isArray(chapter.items) ? [...chapter.items] : []
    }))
  };
}

function retryQuestRewards(questId) {
  initQuestState();
  const quest = QUESTS[questId];
  const questState = gameState.quests[questId];
  if (!quest || !questState?.rewardApplication) return null;
  const application = ensureQuestRewardState(questId, questState);
  const retries = [];
  if (application.final?.status !== 'granted' && application.final?.rewardPackage) {
    retries.push(grantQuestRewards(application.final.rewardPackage, {
      questId,
      questState,
      rewardKey: 'final',
      claimId: application.final.claimId,
      source: 'quest',
      retryRejected: true
    }));
  }
  for (const [chapterId, chapterApplication] of Object.entries(application.chapters)) {
    if (chapterApplication.status === 'granted' || !chapterApplication.rewardPackage) continue;
    retries.push(grantQuestRewards(chapterApplication.rewardPackage, {
      questId,
      questState,
      rewardKey: chapterId,
      claimId: chapterApplication.claimId,
      source: 'quest_chapter',
      retryRejected: true
    }));
  }
  if (retries.length) saveGame();
  return retries;
}

// ===========================================================================
// QUEST PROGRESS TRACKING
// ===========================================================================

function updateQuestProgress(eventType, data) {
  initQuestState();
  
  gameState.quests.active.forEach(questId => {
    const quest = QUESTS[questId];
    if (!quest) return;
    
    const questState = gameState.quests[questId];
    if (!questState) return;
    
    // Get current objectives (story quests use chapters)
    let objectives = questState.objectives || [];
    
    if (quest.type === 'story' && quest.chapters) {
      const chapter = quest.chapters[questState.currentChapter || 0];
      if (chapter) {
        objectives = questState.chapterObjectives?.[questState.currentChapter] || 
                     chapter.objectives.map(o => ({ ...o, progress: 0 }));
      }
    }
    
    let updated = false;
    
    objectives.forEach(obj => {
      if (obj.completed) return;
      
      switch (obj.type) {
        case 'complete_tasks':
          if (eventType === 'task_completed') {
            if (!obj.category || obj.category === data.category) {
              obj.progress = (obj.progress || 0) + 1;
              if (obj.progress >= obj.count) obj.completed = true;
              updated = true;
            }
          }
          break;
          
        case 'defeat_enemy':
          if (eventType === 'enemy_defeated') {
            if (obj.enemyId === data.enemyId) {
              obj.progress = (obj.progress || 0) + 1;
              if (obj.progress >= obj.count) obj.completed = true;
              updated = true;
            }
          }
          break;
          
        case 'defeat_boss':
          if (eventType === 'boss_defeated') {
            if (obj.enemyId === data.enemyId) {
              obj.progress = 1;
              obj.completed = true;
              updated = true;
            }
          }
          break;
          
        case 'reach_level':
          if (eventType === 'level_up') {
            if (data.level >= obj.level) {
              obj.progress = data.level;
              obj.completed = true;
              updated = true;
            }
          }
          break;
          
        case 'equip_item':
          if (eventType === 'item_equipped') {
            if (!obj.itemId || obj.itemId === data.itemId) {
              obj.progress = 1;
              obj.completed = true;
              updated = true;
            }
          }
          break;
      }
    });
    
    if (updated) {
      // Check if all objectives completed
      const allDone = objectives.every(o => o.completed);
      
      if (allDone) {
        if (quest.type === 'story' && quest.chapters) {
          // Advance chapter
          const nextChapter = (questState.currentChapter || 0) + 1;
          if (nextChapter >= quest.chapters.length) {
            // Story complete
            completeQuest(questId);
          } else {
            questState.currentChapter = nextChapter;
            // Grant the completed chapter package with a stable claim.
            const chapter = quest.chapters[nextChapter - 1];
            if (chapter?.rewards) {
              grantQuestRewards(chapter.rewards, {
                questId,
                questState,
                rewardKey: chapter.id,
                claimId: `${questState.instanceId}:chapter:${chapter.id}`,
                source: 'quest_chapter'
              });
            }
          }
        } else {
          completeQuest(questId);
        }
      }
      
      saveGame();
    }
  });
}

// ===========================================================================
// DAILY QUEST RESET
// ===========================================================================

function checkDailyReset() {
  initQuestState();
  const today = todayStr();
  
  if (gameState.quests.dailyReset !== today) {
    // Reset daily quests
    const dailyQuestIds = Object.keys(QUESTS).filter(id => QUESTS[id].resetDaily);
    
    dailyQuestIds.forEach(id => {
      // Remove from active if present
      gameState.quests.active = gameState.quests.active.filter(qid => qid !== id);
      // Remove from completed so they can be taken again
      gameState.quests.completed = gameState.quests.completed.filter(qid => qid !== id);
      // Clear state
      delete gameState.quests[id];
    });
    
    gameState.quests.dailyReset = today;
    saveGame();
  }
}

// ===========================================================================
// QUEST UI HELPERS
// ===========================================================================

function getQuestProgress(questId) {
  initQuestState();
  const quest = QUESTS[questId];
  const state = gameState.quests[questId];
  if (!quest || !state) return null;
  
  const objectives = state.objectives || [];
  const completed = objectives.filter(o => o.completed).length;
  const total = objectives.length;
  
  return {
    questId,
    name: quest.name,
    objectives,
    completed,
    total,
    percent: total > 0 ? Math.round((completed / total) * 100) : 0
  };
}

function isQuestCompleted(questId) {
  initQuestState();
  return gameState.quests.completed.includes(questId);
}

function isQuestActive(questId) {
  initQuestState();
  return gameState.quests.active.includes(questId);
}

// ===========================================================================
// QUEST VALIDATION (for content integrity)
// ===========================================================================

function validateQuestReferences() {
  const errors = [];
  
  Object.values(QUESTS).forEach(quest => {
    // Check item references in rewards
    const checkItems = (items, context) => {
      if (!items) return;
      items.forEach(itemId => {
        if (!ITEMS[itemId]) {
          errors.push(`Quest ${quest.id} ${context}: item '${itemId}' not found`);
        }
      });
    };
    
    if (quest.rewards?.items) checkItems(quest.rewards.items, 'rewards');
    
    // Check chapters
    if (quest.chapters) {
      quest.chapters.forEach(ch => {
        if (ch.rewards?.items) checkItems(ch.rewards.items, `chapter ${ch.id} rewards`);
        
        // Check enemy references in objectives
        ch.objectives?.forEach(obj => {
          if ((obj.type === 'defeat_enemy' || obj.type === 'defeat_boss') && obj.enemyId) {
            if (!ENEMIES[obj.enemyId]) {
              errors.push(`Quest ${quest.id} chapter ${ch.id}: enemy '${obj.enemyId}' not found`);
            }
          }
        });
      });
    }
    
    // Check objectives
    quest.objectives?.forEach(obj => {
      if ((obj.type === 'defeat_enemy' || obj.type === 'defeat_boss') && obj.enemyId) {
        if (!ENEMIES[obj.enemyId]) {
          errors.push(`Quest ${quest.id}: enemy '${obj.enemyId}' not found`);
        }
      }
    });
  });
  
  return errors;
}