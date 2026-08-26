// ===========================================================================
// LifeXP RPG - ui_misc.js
// Modales, timer, class selection, export/import, metrics, recovery.
// ===========================================================================

// ===========================================================================
// MODAL SYSTEM
// ===========================================================================

function openModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) modal.classList.add('active');
}

function closeModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) modal.classList.remove('active');
}

// Close modal on backdrop click
window.addEventListener('click', (e) => {
  if (e.target.classList.contains('modal-overlay')) {
    e.target.classList.remove('active');
  }
});

// ===========================================================================
// TIMER
// ===========================================================================

function toggleTimer() {
  if (gameState.timerRunning) {
    stopTimer();
  } else {
    startTimer();
  }
}

function startTimer() {
  gameState.timerRunning = true;
  gameState.timerStartedAt = Date.now();
  document.getElementById('timer-toggle').innerHTML = LifeXPIcons.renderUI('ui.pause', { size: 18 });
  saveGame();
  updateTimerDisplay();
}

function stopTimer() {
  gameState.timerRunning = false;
  if (gameState.timerStartedAt) {
    gameState.totalFocusSeconds += Math.floor((Date.now() - gameState.timerStartedAt) / 1000);
  }
  gameState.timerStartedAt = null;
  document.getElementById('timer-toggle').innerHTML = LifeXPIcons.renderUI('ui.play', { size: 18 });
  saveGame();
  updateTimerDisplay();
}

function resetTimer() {
  stopTimer();
  gameState.totalFocusSeconds = 0;
  saveGame();
  updateTimerDisplay();
}

function updateTimerDisplay() {
  let seconds = gameState.totalFocusSeconds || 0;
  if (gameState.timerRunning && gameState.timerStartedAt) {
    seconds += Math.floor((Date.now() - gameState.timerStartedAt) / 1000);
  }
  const mins = Math.floor(seconds / 60).toString().padStart(2, '0');
  const secs = (seconds % 60).toString().padStart(2, '0');
  document.getElementById('timer-display').textContent = `${mins}:${secs}`;
}

// ===========================================================================
// CLASS SELECTION
// ===========================================================================

function showClassChangeModal() {
  const list = document.getElementById('class-options');
  if (!list) return;
  
  const available = getAvailableClassChanges(gameState.classId === 'novato' ? null : gameState.classId, gameState.level);
  
  list.innerHTML = available.map(classId => {
    const cls = CLASS_TREE[classId];
    const reqText = getClassRequirementsText(cls);
    const resourceText = cls.resources ? `Resources: ${cls.resources.join(', ')}` : '';
    
    return `
      <div class="class-option" onclick="selectClass('${classId}')">
        <div class="class-option-icon">${LifeXPIcons.renderClass(cls, { size: 44 })}</div>
        <div class="class-option-info">
          <div class="class-option-name" style="color: ${cls.color}">${cls.name}</div>
          <div class="class-option-desc">${cls.description}</div>
          <div class="class-option-req">${reqText}</div>
          ${resourceText ? `<div class="class-option-resources">${resourceText}</div>` : ''}
        </div>
      </div>
    `;
  }).join('');
  
  openModal('modal-class-change');
}

function selectClass(classId) {
  const cls = CLASS_TREE[classId];
  if (!cls) return;
  
  if (!confirm(`Choose ${cls.name} as your class? This cannot be undone.`)) return;
  
  gameState.classId = classId;
  gameState.classHistory = gameState.classHistory || [];
  gameState.classHistory.push({
    classId,
    chosenAt: new Date().toISOString(),
    level: gameState.level
  });
  
  saveGame();
  closeModal('modal-class-change');
  renderCharacter();
  showToast(`You are now a ${cls.name}!`, 'gold');
}

// ===========================================================================
// EXPORT / IMPORT
// ===========================================================================

function downloadJson(data, filename) {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

function backupCurrentSave(reason = 'manual') {
  const payload = {
    reason,
    exportedAt: new Date().toISOString(),
    saveVersion: gameState.saveVersion,
    gameState: JSON.parse(JSON.stringify(gameState))
  };
  
  localStorage.setItem('lifexp_last_backup', JSON.stringify(payload));
  return payload;
}

function exportData(options = {}) {
  const payload = backupCurrentSave(options.reason || 'manual');
  downloadJson(payload, `lifexp-save-${new Date().toISOString().slice(0, 10)}.json`);
  showToast('Save exported.', 'success');
}

function exportSnapshot() {
  const snapshot = generateAgentSnapshot();
  downloadJson(snapshot, `lifexp-snapshot-${new Date().toISOString().slice(0, 10)}.json`);
  showToast('Snapshot exported.', 'success');
}

function importDataText(text) {
  try {
    const imported = JSON.parse(text);
    const candidate = imported.gameState || imported;
    if (!candidate || typeof candidate !== 'object' || !candidate.tasks || !Array.isArray(candidate.tasks)) {
      throw new Error('Invalid save format');
    }
    
    backupCurrentSave('before-import');
    gameState = migrateSave(candidate);
    saveGame();
    location.reload();
  } catch (error) {
    showToast('Could not import save.', 'error');
  }
}

function showImportModal() {
  const input = document.getElementById('import-file');
  if (!input) return;
  input.value = '';
  input.onchange = async () => {
    const file = input.files?.[0];
    if (!file) return;
    const text = await file.text();
    importDataText(text);
  };
  input.click();
}

// ===========================================================================
// CONTENT METRICS / SUGGESTIONS
// ===========================================================================

function calculateDaysActive() {
  const dates = gameState.taskHistory.map(h => h.date?.slice(0, 10)).filter(Boolean);
  return new Set(dates).size;
}

function generateTaskMetrics() {
  const byCategory = {};
  const completed = gameState.taskHistory.filter(h => h.completed);
  
  for (const entry of completed) {
    byCategory[entry.category] = byCategory[entry.category] || { completed: 0, xp: 0 };
    byCategory[entry.category].completed++;
    byCategory[entry.category].xp += entry.xp || 0;
  }
  
  return {
    totalTasks: gameState.tasks.length,
    completedTasks: completed.length,
    byCategory,
    daysActive: calculateDaysActive(),
    currentStreak: gameState.streak,
    level: gameState.level,
    totalXp: gameState.xp
  };
}

function generateContentSuggestions() {
  const metrics = generateTaskMetrics();
  const suggestions = [];
  const categoryIds = Object.keys(CATEGORIES);
  
  for (const catId of categoryIds) {
    const catMetrics = metrics.byCategory[catId];
    if (!catMetrics || catMetrics.completed < 3) {
      suggestions.push({ type: 'category', category: catId, reason: 'Low activity' });
    }
  }
  
  if (metrics.daysActive < 7) {
    suggestions.push({ type: 'retention', reason: 'Less than 7 active days' });
  }
  
  return suggestions;
}

function generateAgentSnapshot() {
  return {
    exportedAt: new Date().toISOString(),
    player: {
      level: gameState.level,
      xp: gameState.xp,
      gold: gameState.gold,
      streak: gameState.streak,
      classId: gameState.classId
    },
    metrics: generateTaskMetrics(),
    suggestions: generateContentSuggestions(),
    inventory: gameState.inventory.map(i => ({ itemId: i.itemId, qty: i.qty })),
    completedQuests: gameState.completedQuests || []
  };
}

// ===========================================================================
// EMERGENCY ROUTE
// ===========================================================================

function handleEmergencyDataRoute() {
  const params = new URLSearchParams(location.search);
  if (params.get('emergency') !== '1') return false;
  
  const content = document.getElementById('emergency-content');
  if (!content) return false;
  
  content.innerHTML = `
    <h2>Emergency data recovery</h2>
    <p>Your save is still stored locally. Use the export action to make a backup before recovery.</p>
    <button class="btn btn-gold" onclick="exportData({ reason: 'emergency-route' })">Export current save</button>
  `;
  showScreen('emergency');
  return true;
}

// ===========================================================================
// RESET
// ===========================================================================

function resetGame() {
  if (!confirm('Reset all progress? This cannot be undone.')) return;
  
  backupCurrentSave('before-reset');
  localStorage.removeItem('lifexp_save');
  location.reload();
}
