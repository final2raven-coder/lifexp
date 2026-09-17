// ===========================================================================
// LifeXP RPG - ui_quests.js
// UI de quests: renderizado, detalle, aceptar/abandonar (delegacion a quests.js).
// Depende de: engine.js, quests.js.
// ===========================================================================

// ===========================================================================

let selectedMissionActionId = null;

function missionUiEscape(value) {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/\"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function getMissionQuestState(questId) {
  if (!gameState?.quests || !isPlainObject(gameState.quests[questId])) return null;
  return gameState.quests[questId];
}

function getMissionCurrentRouteNode(questState) {
  if (!questState || !Array.isArray(questState.routeNodes)) return null;
  return questState.routeNodes.find(node => node.id === questState.currentNodeId) || null;
}

function getMissionActionStatusLabel(status) {
  const labels = {
    available: 'Available',
    in_progress: 'In progress',
    awaiting_task: 'Awaiting a task',
    completed: 'Completed',
    blocked: 'Blocked',
    needs_recovery: 'Needs investigation'
  };
  return labels[status] || 'In progress';
}

function getMissionActionTitle(action, index) {
  const declared = action?.title || action?.name || action?.label;
  if (typeof declared === 'string' && declared.trim()) return declared.trim();
  if (action?.status === 'completed') return `Action ${index + 1} complete`;
  return index === 0 ? 'Current action' : `Available action ${index + 1}`;
}

function getMissionActionDescription(action) {
  const declared = action?.description || action?.desc || action?.prompt || action?.narrative;
  if (typeof declared === 'string' && declared.trim()) return declared.trim();
  if (action?.status === 'completed') return 'This step has already changed the course of the mission.';
  if (action?.status === 'blocked') return 'This route is not available yet.';
  if (action?.status === 'needs_recovery') return 'Further investigation is needed before this route can continue.';
  return 'Choose a compatible task to advance the current route.';
}

function missionActionMatchesTask(action, task) {
  const criterion = action?.criterion || {};
  if (criterion.eventType && !['task_completed', 'task_complete'].includes(criterion.eventType)) return false;
  if (criterion.taskId && criterion.taskId !== task.id) return false;
  if (criterion.derivedTaskId && criterion.derivedTaskId !== task.derivedTaskId) return false;
  if (criterion.category && criterion.category !== task.cat) return false;
  if (criterion.theme && !(Array.isArray(task.themes) && task.themes.includes(criterion.theme))) return false;
  return true;
}

function getMissionActionTasks(action) {
  if (!action || ['completed', 'blocked', 'needs_recovery'].includes(action.status)) return [];
  return (Array.isArray(gameState.tasks) ? gameState.tasks : [])
    .filter(task => task && !isTaskArchived(task) && missionActionMatchesTask(action, task))
    .map(task => ({ task, availability: getTaskAvailability(task) }))
    .sort((left, right) => {
      const leftAvailable = left.availability.status === 'available' ? 0 : 1;
      const rightAvailable = right.availability.status === 'available' ? 0 : 1;
      return leftAvailable - rightAvailable || String(left.task.name).localeCompare(String(right.task.name));
    });
}

function getMissionActionProgressLabel(action) {
  const target = Math.max(1, Number(action?.target) || 1);
  const progress = Math.min(target, Math.max(0, Number(action?.progress) || 0));
  return `${progress}/${target}`;
}

function renderMissionReveals(quest, questState) {
  const questId = quest?.id || null;
  const entries = typeof getMissionJournalEntries === 'function'
    ? getMissionJournalEntries(questId)
    : [];
  if (entries.length === 0) return '';
  return `
    <section class="quest-detail-section" aria-labelledby="quest-discoveries-title">
      <div class="quest-detail-kicker" id="quest-discoveries-title">Discovered information</div>
      ${entries.map(entry => `
        <article class="quest-reveal">
          <div class="quest-reveal-title">${missionUiEscape(entry.title || 'Discovery')}</div>
          <div class="quest-reveal-body">${missionUiEscape(entry.body || '')}</div>
        </article>
      `).join('')}
    </section>
  `;
}

function showMissionRevealNotice(entry) {
  if (!entry) return;
  const title = typeof entry.title === 'string' && entry.title.trim() ? entry.title.trim() : 'New information discovered';
  const body = typeof entry.body === 'string' && entry.body.trim() ? entry.body.trim() : '';
  const message = body ? `${title}: ${body}` : title;
  if (typeof showToast === 'function') showToast(message, 'gold');
}

function renderMissionJournalSummary() {
  const entries = typeof getMissionJournalEntries === 'function' ? getMissionJournalEntries() : [];
  if (entries.length === 0) return '';
  return `
    <section class="card mission-journal-summary" aria-labelledby="mission-journal-title" style="margin-bottom:12px;">
      <div class="quest-detail-kicker" id="mission-journal-title">Journal</div>
      ${entries.map(entry => `
        <article class="quest-reveal">
          <div class="quest-reveal-title">${missionUiEscape(entry.title || 'Discovery')}</div>
          <div class="quest-reveal-body">${missionUiEscape(entry.body || '')}</div>
        </article>
      `).join('')}
    </section>
  `;
}

function renderMissionRecovery(questState) {
  const recovery = questState?.recovery;
  if (!recovery || !['needs_recovery', 'available'].includes(recovery.status)) return '';
  const message = typeof recovery.message === 'string' && recovery.message.trim()
    ? recovery.message
    : 'The next route is not clear yet. Investigate the mission when a new lead becomes available.';
  return `
    <section class="quest-recovery-panel" role="status">
      <div class="quest-detail-kicker">Investigation support</div>
      <div class="quest-recovery-copy">${missionUiEscape(message)}</div>
    </section>
  `;
}

function openMissionTask(taskId, actionId = null) {
  const task = gameState.tasks.find(candidate => candidate.id === taskId);
  if (!task) return;
  const availability = getTaskAvailability(task);
  if (availability.status !== 'available') {
    if (typeof showToast === 'function') showToast('This task is not available right now.', 'gold');
    return;
  }
  selectedMissionActionId = actionId || selectedMissionActionId;
  if (typeof completeTaskFromCategory !== 'function') return;
  completeTaskFromCategory(taskId);
}

function focusMissionAction(questId, actionId) {
  selectedMissionActionId = actionId;
  showQuestDetail(questId);
}

function renderMissionActionTask(taskRecord, actionId) {
  const task = taskRecord.task;
  const availability = taskRecord.availability;
  const safeTaskId = missionUiEscape(task.id);
  const safeActionId = missionUiEscape(actionId);
  const available = availability.status === 'available';
  const status = typeof getTaskCatalogStatus === 'function'
    ? getTaskCatalogStatus(task, availability)
    : (available ? 'Available' : 'Unavailable');
  return `
    <article class="mission-task-card">
      <div class="mission-task-main">
        <div class="mission-task-name">${missionUiEscape(task.name)}</div>
        <div class="mission-task-desc">${missionUiEscape(task.desc)}</div>
        <div class="mission-task-status">${missionUiEscape(status)}</div>
      </div>
      <button class="btn ${available ? 'btn-primary' : 'btn-ghost'} btn-small" type="button" onclick="openMissionTask('${safeTaskId}', '${safeActionId}')" ${available ? '' : 'disabled'}>${available ? 'Open task' : 'Unavailable'}</button>
    </article>
  `;
}

function renderMissionActionCard(action, index, questId, selected) {
  const status = action?.status || 'available';
  const statusLabel = getMissionActionStatusLabel(status);
  const title = getMissionActionTitle(action, index);
  const tasks = getMissionActionTasks(action);
  const taskMarkup = tasks.length > 0
    ? tasks.map(record => renderMissionActionTask(record, action.id)).join('')
    : `<div class="mission-action-empty">${status === 'completed' ? 'No further task is needed for this step.' : 'No compatible task is available right now.'}</div>`;
  const progress = getMissionActionProgressLabel(action);
  const safeQuestId = missionUiEscape(questId);
  const safeActionId = missionUiEscape(action.id);
  return `
    <article class="mission-action-card ${selected ? 'mission-action-card-selected' : ''}" data-action-status="${missionUiEscape(status)}">
      <div class="mission-action-header">
        <div>
          <div class="mission-action-status">${missionUiEscape(statusLabel)}</div>
          <h4 class="mission-action-title">${missionUiEscape(title)}</h4>
        </div>
        <div class="mission-action-progress">${missionUiEscape(progress)}</div>
      </div>
      <div class="mission-action-description">${missionUiEscape(getMissionActionDescription(action))}</div>
      ${status !== 'completed' && status !== 'blocked' && status !== 'needs_recovery' && !selected ? `<button class="btn btn-ghost btn-small mission-action-focus" type="button" onclick="focusMissionAction('${safeQuestId}', '${safeActionId}')">Focus action</button>` : ''}
      <div class="mission-action-tasks">${taskMarkup}</div>
    </article>
  `;
}

function renderQuests() {
  const container = document.getElementById('quests-container');
  if (!container) return;

  const countEl = document.getElementById('quests-count');
  if (typeof initQuestState === 'function') initQuestState();
  if (typeof checkDailyQuestReset === 'function') checkDailyQuestReset();
  const active = typeof getActiveQuests === 'function' ? getActiveQuests() : [];
  if (countEl) {
    countEl.textContent = `${active.length} active${active.length !== 1 ? 's' : ''}`;
  }

  if (typeof QUESTS === 'undefined') {
    container.innerHTML = '<div class="text-muted text-center">Quest system loading...</div>';
    return;
  }

  const journalMarkup = renderMissionJournalSummary();
  if (active.length === 0) {
    container.innerHTML = journalMarkup + `
      <div class="card" style="text-align: center; padding: 24px;">
        <div style="font-size: 32px; margin-bottom: 12px;">📜</div>
        <div style="color: var(--text-muted);">No active quests</div>
        <button class="btn btn-primary" style="margin-top: 16px;" onclick="showAvailableQuests()">
          View available quests
        </button>
      </div>
    `;
    return;
  }

  container.innerHTML = journalMarkup;

  for (const quest of active) {
    const questId = quest.id;
    const prog = typeof getQuestProgress === 'function' ? getQuestProgress(questId) : null;
    const typeInfo = typeof getQuestTypeInfo === 'function' ? getQuestTypeInfo(quest.type) : { name: quest.type, icon: '📜', color: 'var(--gold)' };
    const percent = prog?.percent || 0;
    const isStory = quest.type === 'story';
    const chapterInfo = isStory && quest.chapters ? `Chapter ${(quest.currentChapter || 0) + 1}/${quest.chapters.length}` : '';
    const safeQuestId = missionUiEscape(questId);

    container.innerHTML += `
      <div class="card quest-card" style="border-left: 3px solid ${typeInfo.color || 'var(--gold)'}; margin-bottom: 12px; cursor: pointer;" onclick="showQuestDetail('${safeQuestId}')">
        <div style="display: flex; justify-content: space-between; align-items: flex-start; gap: 12px;">
          <div style="flex: 1; min-width: 0;">
            <div style="font-size: 11px; color: ${typeInfo.color || 'var(--gold)'}; text-transform: uppercase; letter-spacing: 1px;">
              ${typeInfo.icon || '📜'} ${typeInfo.name || quest.type} ${chapterInfo ? `· ${chapterInfo}` : ''}
            </div>
            <div style="font-size: 16px; font-weight: 700; margin-top: 4px;">${missionUiEscape(quest.name)}</div>
            <div style="font-size: 12px; color: var(--text-muted); margin-top: 4px;">${missionUiEscape(quest.desc || '')}</div>
          </div>
          <div style="font-size: 20px;">${quest.icon || '📜'}</div>
        </div>
        <div style="margin-top: 12px;">
          <div style="display: flex; justify-content: space-between; font-size: 11px; color: var(--text-muted); margin-bottom: 4px;">
            <span>Route progress</span>
            <span>${percent}%</span>
          </div>
          <div style="height: 6px; background: var(--border); border-radius: 3px; overflow: hidden;">
            <div style="width: ${percent}%; height: 100%; background: ${typeInfo.color || 'var(--gold)'}; transition: width 0.3s ease;"></div>
          </div>
        </div>
        <div style="display: flex; justify-content: space-between; margin-top: 10px; font-size: 12px;">
          <span style="color: var(--text-muted);">Open mission actions</span>
          <span style="color: var(--gold);">Continue →</span>
        </div>
      </div>
    `;
  }
}

function getQuestTypeInfo(type) {
  const config = typeof QUEST_TYPE !== 'undefined' ? QUEST_TYPE[type] : null;
  return config || { name: type || 'Quest', icon: '\uD83D\uDCDC', color: 'var(--gold)' };
}

function showAvailableQuests() {
  const available = typeof getAvailableQuests === 'function' ? getAvailableQuests() : [];
  const list = available.map(quest => {
    const typeInfo = getQuestTypeInfo(quest.type);
    return `
      <div class="card" style="cursor:pointer;margin-bottom:8px;" onclick="acceptQuest('${quest.id}')">
        <div style="display:flex;justify-content:space-between;align-items:center;">
          <div>
            <div style="font-size:11px;color:${typeInfo.color};text-transform:uppercase;">${typeInfo.icon} ${typeInfo.name}</div>
            <div style="font-weight:700;margin-top:4px;">${quest.name}</div>
            <div style="font-size:12px;color:var(--text-muted);">${quest.desc || ''}</div>
          </div>
        </div>
      </div>
    `;
  }).join('');
  
  const content = document.getElementById('modal-item-content');
  if (!content) return;
  content.innerHTML = list || '<div class="text-muted text-center">No quests available.</div>';
  document.getElementById('btn-item-action').style.display = 'none';
  openModal('modal-item');
}

function acceptQuest(questId) {
  if (typeof window.acceptQuestCanonical !== 'function') return;
  const result = window.acceptQuestCanonical(questId);
  if (result && !result.success) {
    if (typeof showToast === 'function') showToast(result.message, 'error');
    return;
  }
  closeModal('modal-item');
  renderQuests();
}

function showQuestDetail(questId) {
  if (typeof QUESTS === 'undefined') return;
  const quest = QUESTS[questId];
  const questState = getMissionQuestState(questId);
  if (!quest || !questState) return;

  const progress = typeof getQuestProgress === 'function' ? getQuestProgress(questId) : null;
  const typeInfo = typeof getQuestTypeInfo === 'function' ? getQuestTypeInfo(quest.type) : {};
  const color = typeInfo.color || 'var(--gold)';
  const currentNode = getMissionCurrentRouteNode(questState);
  const currentNodeActionIds = new Set(Array.isArray(currentNode?.actionIds) ? currentNode.actionIds : []);
  const actions = (Array.isArray(progress?.actions) ? progress.actions : [])
    .filter(action => currentNodeActionIds.size === 0 || currentNodeActionIds.has(action.id))
    .filter(action => action.status !== 'blocked' || currentNodeActionIds.has(action.id));
  const activeActionId = selectedMissionActionId && actions.some(action => action.id === selectedMissionActionId)
    ? selectedMissionActionId
    : (questState.activeActionId && actions.some(action => action.id === questState.activeActionId)
      ? questState.activeActionId
      : actions.find(action => ['in_progress', 'awaiting_task', 'available'].includes(action.status))?.id);

  const contentEl = document.getElementById('modal-item-content');
  const actionMarkup = actions.length > 0
    ? actions.map((action, index) => renderMissionActionCard(action, index, questId, action.id === activeActionId)).join('')
    : `
      <div class="quest-action-empty" role="status">
        <div class="quest-action-empty-title">No action is available right now</div>
        <div class="quest-action-empty-copy">Return when the mission has a new lead.</div>
      </div>
    `;

  const currentSituation = typeof quest.desc === 'string' && quest.desc.trim()
    ? quest.desc
    : 'The mission is waiting for your next decision.';
  const currentNodeLabel = currentNode?.title || currentNode?.name || null;
  const situationMarkup = `
    <section class="quest-detail-section quest-situation" aria-labelledby="quest-situation-title">
      <div class="quest-detail-kicker" id="quest-situation-title">Current situation</div>
      <div class="quest-situation-title">${missionUiEscape(currentNodeLabel || quest.name)}</div>
      <div class="quest-situation-copy">${missionUiEscape(currentSituation)}</div>
    </section>
  `;
  const revealsMarkup = renderMissionReveals(quest, questState);
  const recoveryMarkup = renderMissionRecovery(questState);
  const progressMarkup = progress
    ? `<div class="quest-route-progress" aria-label="Route progress">Route progress: ${missionUiEscape(`${progress.percent || 0}%`)}</div>`
    : '';

  contentEl.innerHTML = `
    <div class="quest-detail" data-quest-id="${missionUiEscape(questId)}">
      <div class="quest-detail-heading" style="border-color:${missionUiEscape(color)};">
        <div class="quest-detail-type">${missionUiEscape(typeInfo.icon || '📜')} ${missionUiEscape(typeInfo.name || quest.type)}</div>
        <h3 class="quest-detail-title" style="color:${missionUiEscape(color)};">${missionUiEscape(quest.name)}</h3>
      </div>
      ${situationMarkup}
      ${revealsMarkup}
      <section class="quest-detail-section" aria-labelledby="quest-actions-title">
        <div class="quest-detail-kicker" id="quest-actions-title">Available actions</div>
        ${progressMarkup}
        <div class="quest-actions-list">${actionMarkup}</div>
      </section>
      ${recoveryMarkup}
    </div>
  `;

  const actionBtn = document.getElementById('btn-item-action');
  actionBtn.style.display = '';
  actionBtn.disabled = false;
  actionBtn.textContent = '❌ Abandon quest';
  actionBtn.onclick = () => abandonQuest(questId);
  openModal('modal-item');
}

function abandonQuest(questId) {
  if (typeof window.abandonQuestCanonical === 'function') window.abandonQuestCanonical(questId);
  closeModal('modal-item');
  renderQuests();
}

// updateQuestProgress and completeQuest are defined in quests.js (canonical).
// game.js does NOT redefine them — quests.js loads first and its definitions stand.

// ===========================================================================
// PWA Service Worker Registration

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('sw.js').catch(() => {});
  });
}
