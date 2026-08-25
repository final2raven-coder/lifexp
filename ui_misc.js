// ===========================================================================
// LifeXP RPG - ui_misc.js
// Modales, timer, cambio de clase, export/import/snapshot, reset.
// Depende de: engine.js, classes.js.
// ===========================================================================

function openModal(modalId) {
  const modal = document.getElementById(modalId);
  if (!modal) return false;
  modal.classList.add('show');
  // Fallback for cached/older CSS versions.
  modal.style.display = 'flex';
  return true;
}

function closeModal(modalId) {
  const modal = document.getElementById(modalId);
  if (!modal) return;
  modal.classList.remove('show');
  modal.style.display = '';
}

// ===========================================================================
// TIMER
// ===========================================================================

function toggleTimer() {
  if (timerRunning) {
    stopTimer();
  } else {
    startTimer();
  }
}

function startTimer() {
  timerRunning = true;
  document.getElementById('timer-toggle').textContent = '⏸';
  timerInterval = setInterval(() => {
    timerSeconds++;
    updateTimerDisplay();
  }, 1000);
}

function stopTimer() {
  timerRunning = false;
  clearInterval(timerInterval);
  document.getElementById('timer-toggle').textContent = '▶';
}

function resetTimer() {
  stopTimer();
  timerSeconds = 0;
  updateTimerDisplay();
}

function updateTimerDisplay() {
  const mins = Math.floor(timerSeconds / 60).toString().padStart(2, '0');
  const secs = (timerSeconds % 60).toString().padStart(2, '0');
  document.getElementById('timer-display').textContent = `${mins}:${secs}`;
}

// ===========================================================================
// CLASS CHANGE SYSTEM
// ===========================================================================

function showClassChangeModal() {
  const classId = gameState.classId === 'novato' ? null : gameState.classId;
  const level = gameState.level;
  const available = getAvailableClassChanges(classId, level);
  
  if (available.length === 0) {
    alert('No classes are available to change.');
    return;
  }
  
  const info = document.getElementById('modal-class-info');
  const options = document.getElementById('modal-class-options');
  
  if (!classId) {
    info.textContent = `You reached level ${level}. It is time to choose your first class!`;
  } else {
    const currentCls = CLASS_TREE[classId];
    info.textContent = `Puedes avanzar desde ${currentCls.name} a una de estas especializaciones:`;
  }
  
  options.innerHTML = '';
  
  for (const clsId of available) {
    const cls = CLASS_TREE[clsId];
    const statsText = Object.entries(cls.stats).map(([s, v]) => `${STATS[s].abbr} +${v}`).join(', ');
    
    options.innerHTML += `
      <div class="card" style="cursor: pointer; transition: transform 0.2s;" 
           onclick="selectClass('${clsId}')"
           onmouseenter="this.style.transform='scale(1.02)'" 
           onmouseleave="this.style.transform='scale(1)'">
        <div style="display: flex; align-items: center; gap: 12px;">
          <div style="font-size: 40px;">${cls.icon}</div>
          <div style="flex: 1;">
            <div style="font-size: 16px; font-weight: 700; color: var(--gold);">${cls.name}</div>
            <div style="font-size: 12px; color: var(--text-muted); margin-top: 2px;">${cls.desc}</div>
            <div style="font-size: 11px; color: var(--green); margin-top: 4px;">${statsText}</div>
          </div>
        </div>
      </div>
    `;
  }
  
  document.getElementById('modal-class').classList.add('show');
}

function selectClass(classId) {
  const cls = CLASS_TREE[classId];
  
  if (!confirm(`Become ${cls.name}?\n\n${cls.desc}\n\nThis decision will affect your progression path.`)) {
    return;
  }
  
  gameState.classId = classId;
  saveGame();
  
  closeModal('modal-class');
  renderCharacter();
  renderHub();
  
  // Show celebration
  alert(`\uD83C\uDF89 You became ${cls.name}!\n\nYour stats improved and you now have access to new skills.`);
}

// ===========================================================================
// IMPORT/EXPORT
// ===========================================================================

function downloadJson(data, filename) {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

function backupCurrentSave(reason = 'manual') {
  try {
    const current = localStorage.getItem('lifexp_save');
    if (!current) return false;
    const key = 'lifexp_save_backup_' + Date.now();
    localStorage.setItem(key, current);
    localStorage.setItem('lifexp_save_last_backup', key);
    return true;
  } catch (e) {
    console.warn('Could not create save backup:', e);
    return false;
  }
}

function exportData(options = {}) {
  const filename = options.filename || `lifexp_save_${todayStr()}.json`;
  downloadJson(gameState, filename);
}

function exportSnapshot() {
  // Generate a comprehensive snapshot for content update planning
  const snapshot = {
    meta: {
      exportDate: new Date().toISOString(),
      version: '1.0',
      purpose: 'LifeXP content update planning snapshot',
      instructions: "This file contains the player's current state and usage metrics. Use it to plan content updates (new tasks, quests, items, enemies, and balance changes)."
    },
    
    player: {
      name: gameState.name,
      level: gameState.level,
      xp: gameState.xp,
      gold: gameState.gold,
      streak: gameState.streak,
      classId: gameState.classId,
      classLevel: gameState.classLevel,
      stats: { ...gameState.stats }
    },
    
    progression: {
      totalTasksCompleted: gameState.taskHistory.length,
      uniqueTasksCompleted: [...new Set(gameState.taskHistory.map(h => h.taskId))].length,
      sideQuestsCompleted: gameState.taskHistory.filter(h => h.sideQuest).length,
      totalXpEarned: gameState.taskHistory.reduce((a, h) => a + h.xp, 0),
      questsCompleted: gameState.completedQuests.length,
      daysActive: calculateDaysActive()
    },
    
    taskMetrics: generateTaskMetrics(),
    
    inventory: {
      itemCount: gameState.inventory.length,
      equipped: { ...gameState.equipment },
      items: gameState.inventory.map(slot => ({
        id: slot.id,
        qty: slot.qty || 1,
        name: typeof ITEMS !== 'undefined' && ITEMS[slot.id] ? ITEMS[slot.id].name : slot.id
      }))
    },
    
    activeQuests: gameState.activeQuests.map(q => ({
      questId: q.questId,
      stepIndex: q.stepIndex,
      startedAt: q.startedAt
    })),
    
    suggestions: generateContentSuggestions()
  };
  
  const data = JSON.stringify(snapshot, null, 2);
  const blob = new Blob([data], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `lifexp_snapshot_${todayStr()}.json`;
  a.click();
  URL.revokeObjectURL(url);
  
  alert('Snapshot exported. Share it with your Langdock agent to plan content updates.');
}

function calculateDaysActive() {
  if (gameState.taskHistory.length === 0) return 0;
  const dates = [...new Set(gameState.taskHistory.map(h => h.date))];
  return dates.length;
}

function generateTaskMetrics() {
  const metrics = {
    byCategory: {},
    byFrequency: {},
    mostCompleted: [],
    neverCompleted: [],
    overflowFrequent: []
  };
  
  // Initialize categories
  for (const cat of Object.keys(CATEGORIES)) {
    metrics.byCategory[cat] = { completed: 0, overflow: 0 };
  }
  
  // Count completions by task
  const taskCounts = {};
  for (const h of gameState.taskHistory) {
    taskCounts[h.taskId] = (taskCounts[h.taskId] || 0) + 1;
  }
  
  // Categorize
  for (const h of gameState.taskHistory) {
    const task = getTaskById(h.taskId);
    if (task) {
      metrics.byCategory[task.cat].completed++;
    }
  }
  
  // Find most completed
  const sorted = Object.entries(taskCounts).sort((a, b) => b[1] - a[1]);
  metrics.mostCompleted = sorted.slice(0, 5).map(([id, count]) => {
    const task = getTaskById(id);
    return { id, name: task?.name || id, count };
  });
  
  // Find never completed
  metrics.neverCompleted = gameState.tasks
    .filter(t => !taskCounts[t.id])
    .map(t => ({ id: t.id, name: t.name, category: t.cat }));
  
  return metrics;
}

function generateContentSuggestions() {
  const suggestions = [];
  const level = gameState.level;
  const totalTasks = gameState.taskHistory.length;
  
  // Level-based suggestions
  if (level >= 10 && gameState.classId === 'novato') {
    suggestions.push({
      type: 'progression',
      priority: 'high',
      message: 'The player is level ' + level + ' but is still a Novice. Consider adding reminders or tutorials about the class system.'
    });
  }
  
  if (level >= 20) {
    suggestions.push({
      type: 'content',
      priority: 'medium',
      message: 'Player level ' + level + '. Consider adding more advanced story quests or endgame content.'
    });
  }
  
  // Task variety
  const taskMetrics = generateTaskMetrics();
  const neglectedCats = Object.entries(taskMetrics.byCategory)
    .filter(([cat, data]) => data.completed < totalTasks * 0.1)
    .map(([cat]) => CATEGORIES[cat].name);
  
  if (neglectedCats.length > 0) {
    suggestions.push({
      type: 'balance',
      priority: 'medium',
      message: 'Underused categories: ' + neglectedCats.join(', ') + '. Consider making tasks in these categories more appealing or adding better rewards.'
    });
  }
  
  // Never completed tasks
  if (taskMetrics.neverCompleted.length > 5) {
    suggestions.push({
      type: 'cleanup',
      priority: 'low',
      message: taskMetrics.neverCompleted.length + ' tareas nunca completadas. Revisa si son relevantes o si necesitan ajustes.'
    });
  }
  
  // Inventory suggestions
  if (gameState.inventory.length >= 18) {
    suggestions.push({
      type: 'systems',
      priority: 'medium',
      message: 'Inventory is nearly full. Consider adding a stash, crafting to consume materials, or a shop for selling.'
    });
  }
  
  return suggestions;
}

function importDataText(text) {
  const data = JSON.parse(text);
  if (!data || typeof data !== 'object' || Array.isArray(data)) {
    throw new Error('The file does not contain a valid save.');
  }
  if (!('level' in data) && !('tasks' in data) && !('taskHistory' in data)) {
    throw new Error('Faltan datos reconocibles de LifeXP.');
  }
  backupCurrentSave('before-import');
  gameState = { ...gameState, ...data };
  gameState.inventory = Array.isArray(gameState.inventory) ? gameState.inventory : [];
  gameState.stash = Array.isArray(gameState.stash) ? gameState.stash : [];
  gameState.taskHistory = Array.isArray(gameState.taskHistory) ? gameState.taskHistory : [];
  gameState.completedQuests = Array.isArray(gameState.completedQuests) ? gameState.completedQuests : [];
  gameState.activeQuests = Array.isArray(gameState.activeQuests) ? gameState.activeQuests : [];
  saveGame();
  return true;
}

function showImportModal() {
  const input = document.createElement('input');
  input.type = 'file';
  input.accept = '.json,application/json';
  input.onchange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    try {
      importDataText(await file.text());
      alert('Datos importados correctamente');
      location.reload();
    } catch (err) {
      alert('Import error: ' + err.message);
    }
  };
  input.click();
}

function handleEmergencyDataRoute() {
  const params = new URLSearchParams(location.search);
  if (params.get('export') === '1') {
    exportData({ filename: `lifexp_save_${todayStr()}.json` });
    history.replaceState({}, document.title, location.pathname);
    return;
  }
  if (params.get('import') === '1') {
    showImportModal();
    history.replaceState({}, document.title, location.pathname);
  }
}

window.LifeXPBackup = {
  export: () => exportData(),
  importText: (text) => importDataText(text),
  backup: () => backupCurrentSave('manual')
};

function resetGame() {
  if (!confirm('Are you sure you want to delete all progress?')) return;
  if (!confirm('ARE YOU SURE? This action cannot be undone.')) return;
  
  localStorage.removeItem('lifexp_save');
  location.reload();
}

