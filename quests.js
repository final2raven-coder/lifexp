// ═══════════════════════════════════════════════════════════════════════════
// LifeXP RPG - Quest System (Block 5)
// ═══════════════════════════════════════════════════════════════════════════

// ═══════════════════════════════════════════════════════════════════════════
// QUEST TYPES
// ═══════════════════════════════════════════════════════════════════════════

const QUEST_TYPE = {
  daily: { name: 'Diaria', icon: '📅', color: '#4ade80' },
  simple: { name: 'Misión', icon: '📜', color: '#60a5fa' },
  compound: { name: 'Compuesta', icon: '📚', color: '#a78bfa' },
  story: { name: 'Historia', icon: '⭐', color: '#ffd700' },
  bounty: { name: 'Bounty', icon: '🎯', color: '#f87171' },
  class_quest: { name: 'Clase', icon: '⚔️', color: '#ff4d6d' },
  event: { name: 'Evento', icon: '🎉', color: '#22d3ee' }
};

const QUEST_STATUS = {
  available: 'available',
  active: 'active',
  completed: 'completed',
  failed: 'failed',
  locked: 'locked'
};

// ═══════════════════════════════════════════════════════════════════════════
// QUEST DATABASE
// ═══════════════════════════════════════════════════════════════════════════

const QUESTS = {
  
  // ══════════ DAILY QUESTS ══════════
  daily_any_3: {
    id: 'daily_any_3',
    type: 'daily',
    name: 'Rutina Diaria',
    desc: 'Completa 3 tareas de cualquier categoría.',
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

  // ══════════ SIMPLE QUESTS ══════════
  quest_first_steps: {
    id: 'quest_first_steps',
    type: 'simple',
    name: 'Primeros Pasos',
    desc: 'Completa tu primera tarea y familiarízate con el sistema.',
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
    desc: 'Cuida tu cuerpo completando tareas físicas.',
    minLevel: 3,
    objectives: [
      { id: 'obj_1', type: 'complete_tasks', count: 10, category: 'cuerpo', progress: 0 }
    ],
    rewards: { xp: 150, gold: 50, items: ['pocion_fuerza'] },
    repeatable: false
  },

  // ══════════ BOUNTIES ══════════
  bounty_slimes: {
    id: 'bounty_slimes',
    type: 'bounty',
    name: 'Plaga de Slimes',
    desc: 'Los slimes han infestado las tuberías. Elimínalos.',
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
    desc: 'Unos bandidos molestan a los viajeros. Encárgate de ellos.',
    minLevel: 8,
    timeLimit: 5,
    objectives: [
      { id: 'obj_1', type: 'defeat_enemy', enemyId: 'bandido', count: 5, progress: 0 }
    ],
    rewards: { xp: 200, gold: 100 },
    repeatable: true
  },

  // ══════════ STORY QUESTS ══════════
  story_wolf_hills: {
    id: 'story_wolf_hills',
    type: 'story',
    name: 'El Lobo de las Colinas',
    desc: 'Un lobo gigante aterroriza los alrededores. Investiga y enfréntalo.',
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
          start: 'Los aldeanos hablan de un lobo enorme en las colinas. Deberías investigar.',
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
          complete: 'Encuentras la guarida. El lobo alfa está dentro.'
        }
      },
      {
        id: 'ch_3',
        name: 'Preparación',
        desc: 'Prepara tu equipo para el enfrentamiento.',
        objectives: [
          { id: 'obj_1', type: 'complete_tasks', count: 2, category: 'casa', progress: 0 },
          { id: 'obj_2', type: 'complete_tasks', count: 1, category: 'gestiones', progress: 0 }
        ],
        rewards: { items: ['pocion_fuerza', 'pocion_fuerza'] },
        dialogue: {
          start: 'Necesitas estar preparado. Organiza tu equipo.',
          complete: 'Estás listo. Es hora de enfrentar al lobo alfa.'
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
        boss: {
          id: 'lobo_alfa',
          name: 'Lobo Alfa',
          icon: '🐺',
          level: 15,
          hp: 400,
          fue: 20, vit: 18, des: 16, int: 8, vol: 14, pre: 12,
          skills: [
            { id: 'mordisco_feroz', name: 'Mordisco Feroz', type: 'attack', power: 35, scaling: { fue: 0.8 } },
            { id: 'aullido', name: 'Aullido Aterrador', type: 'debuff', effect: 'fear' }
          ],
          drops: [
            { itemId: 'capa_lobo', chance: 0.4 },
            { itemId: 'colmillo_alfa', chance: 0.8 }
          ]
        },
        dialogue: {
          start: '¡El Lobo Alfa aparece! Es enorme.',
          complete: '¡Victoria! El lobo ha caído. Los aldeanos están a salvo.'
        }
      }
    ],
    currentChapter: 0,
    rewards: { xp: 300, gold: 150 }, // Final rewards
    repeatable: false
  },

  // ══════════ CLASS QUESTS ══════════
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

// ═══════════════════════════════════════════════════════════════════════════
// QUEST STATE MANAGEMENT
// ═══════════════════════════════════════════════════════════════════════════

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
    objectives: quest.objectives ? quest.objectives.map(o => ({ ...o, progress: 0 })) : [],
    currentChapter: 0
  };
  
  saveGame();
  return { success: true, message: `¡Misión "${quest.name}" aceptada!` };
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
  if (!quest) return;
  
  // Remove from active
  gameState.quests.active = gameState.quests.active.filter(id => id !== questId);
  
  // Add to completed (unless repeatable daily)
  if (!quest.resetDaily) {
    gameState.quests.completed.push(questId);
  }
  
  // Apply rewards
  applyQuestRewards(quest.rewards);
  
  // Clean up state
  delete gameState.quests[questId];
  
  saveGame();
  
  return quest.rewards;
}

function failQuest(questId) {
  initQuestState();
  gameState.quests.active = gameState.quests.active.filter(id => id !== questId);
  
  const quest = QUESTS[questId];
  if (quest && !quest.repeatable) {
    gameState.quests.failed.push(questId);
  }
  
  delete gameState.quests[questId];
  saveGame();
}

// ═══════════════════════════════════════════════════════════════════════════
// QUEST PROGRESS
// ═══════════════════════════════════════════════════════════════════════════

function updateQuestProgress(eventType, data) {
  initQuestState();
  
  for (const questId of gameState.quests.active) {
    const quest = QUESTS[questId];
    const state = gameState.quests[questId];
    if (!quest || !state) continue;
    
    // Get current objectives (for story quests, current chapter)
    let objectives = state.objectives;
    if (quest.type === 'story' && quest.chapters) {
      const chapter = quest.chapters[state.currentChapter];
      if (chapter) {
        objectives = state.chapterObjectives || chapter.objectives.map(o => ({ ...o, progress: 0 }));
      }
    }
    
    for (const obj of objectives) {
      if (obj.progress >= obj.count) continue; // Already complete
      
      let matched = false;
      
      switch (obj.type) {
        case 'complete_tasks':
          if (eventType === 'task_complete') {
            if (!obj.category || obj.category === data.category) {
              matched = true;
            }
          }
          break;
          
        case 'defeat_enemy':
          if (eventType === 'enemy_defeated' && data.enemyId === obj.enemyId) {
            matched = true;
          }
          break;
          
        case 'defeat_boss':
          if (eventType === 'boss_defeated' && data.enemyId === obj.enemyId) {
            matched = true;
          }
          break;
          
        case 'collect_item':
          if (eventType === 'item_obtained' && data.itemId === obj.itemId) {
            matched = true;
          }
          break;
      }
      
      if (matched) {
        obj.progress = Math.min(obj.progress + 1, obj.count);
      }
    }
    
    // Update state
    if (quest.type === 'story') {
      state.chapterObjectives = objectives;
    } else {
      state.objectives = objectives;
    }
    
    // Check completion
    checkQuestCompletion(questId);
  }
  
  saveGame();
}

function checkQuestCompletion(questId) {
  const quest = QUESTS[questId];
  const state = gameState.quests[questId];
  if (!quest || !state) return;
  
  if (quest.type === 'story') {
    // Check chapter completion
    const chapter = quest.chapters[state.currentChapter];
    if (!chapter) return;
    
    const objectives = state.chapterObjectives || [];
    const allComplete = objectives.every(o => o.progress >= o.count);
    
    if (allComplete) {
      // Apply chapter rewards
      if (chapter.rewards) {
        applyQuestRewards(chapter.rewards);
      }
      
      // Advance to next chapter
      state.currentChapter++;
      state.chapterObjectives = null;
      
      // Check if quest complete
      if (state.currentChapter >= quest.chapters.length) {
        completeQuest(questId);
      }
    }
  } else {
    // Simple quest completion
    const allComplete = state.objectives.every(o => o.progress >= o.count);
    if (allComplete) {
      completeQuest(questId);
    }
  }
}

function applyQuestRewards(rewards) {
  if (!rewards) return;
  if (typeof applyItemQuestReward === "function") applyItemQuestReward(rewards);
  
  if (rewards.xp) {
    if (typeof addXp === 'function') {
      addXp(rewards.xp);
    } else {
      gameState.xp = (gameState.xp || 0) + rewards.xp;
    }
  }
  
  if (rewards.gold) {
    gameState.gold = (gameState.gold || 0) + rewards.gold;
  }
  
  if (rewards.items) {
    for (const itemId of rewards.items) {
      if (typeof addToInventory === 'function') {
        addToInventory(itemId, 1);
      } else {
        gameState.inventory.push({ id: itemId, qty: 1, obtainedAt: todayStr() });
      }
    }
  }
  
  if (rewards.unlockClass && typeof unlockClass === 'function') {
    unlockClass(rewards.unlockClass);
  }
}

// ═══════════════════════════════════════════════════════════════════════════
// DAILY RESET
// ═══════════════════════════════════════════════════════════════════════════

function checkDailyQuestReset() {
  initQuestState();
  const today = todayStr();
  
  if (gameState.quests.dailyReset !== today) {
    // Reset daily quests
    for (const questId of [...gameState.quests.active]) {
      const quest = QUESTS[questId];
      if (quest?.resetDaily) {
        abandonQuest(questId);
      }
    }
    
    // Remove dailies from completed
    gameState.quests.completed = gameState.quests.completed.filter(qid => {
      const q = QUESTS[qid];
      return !q?.resetDaily;
    });
    
    gameState.quests.dailyReset = today;
    saveGame();
  }
}

// ═══════════════════════════════════════════════════════════════════════════
// QUEST UI HELPERS
// ═══════════════════════════════════════════════════════════════════════════

function getQuestProgress(questId) {
  const quest = QUESTS[questId];
  const state = gameState.quests?.[questId];
  if (!quest || !state) return null;
  
  let objectives = state.objectives;
  if (quest.type === 'story' && quest.chapters) {
    const chapter = quest.chapters[state.currentChapter];
    objectives = state.chapterObjectives || chapter?.objectives || [];
  }
  
  const total = objectives.reduce((sum, o) => sum + o.count, 0);
  const progress = objectives.reduce((sum, o) => sum + Math.min(o.progress, o.count), 0);
  
  return {
    current: progress,
    total: total,
    percent: total > 0 ? Math.round((progress / total) * 100) : 0,
    objectives: objectives
  };
}

function getQuestTypeInfo(type) {
  return QUEST_TYPE[type] || QUEST_TYPE.simple;
}

function formatObjective(obj) {
  const done = obj.progress >= obj.count;
  let text = '';
  
  switch (obj.type) {
    case 'complete_tasks':
      const catName = obj.category ? CATEGORIES[obj.category]?.name : 'cualquier';
      text = `Completa ${obj.count} tareas de ${catName}`;
      break;
    case 'defeat_enemy':
      const enemy = typeof ENEMIES !== 'undefined' ? ENEMIES[obj.enemyId] : null;
      text = `Derrota ${obj.count}x ${enemy?.name || obj.enemyId}`;
      break;
    case 'defeat_boss':
      text = `Derrota al boss`;
      break;
    case 'collect_item':
      const item = typeof ITEMS !== 'undefined' ? ITEMS[obj.itemId] : null;
      text = `Consigue ${obj.count}x ${item?.name || obj.itemId}`;
      break;
    default:
      text = obj.desc || 'Objetivo';
  }
  
  return {
    text,
    progress: `${obj.progress}/${obj.count}`,
    done
  };
}
