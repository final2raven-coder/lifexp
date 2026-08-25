// ===========================================================================
// LifeXP RPG - ui_quests.js
// UI de quests: renderizado, detalle, aceptar/abandonar (delegacion a quests.js).
// Depende de: engine.js, quests.js.
// ===========================================================================

// ===========================================================================

function renderQuests() {
  const container = document.getElementById('quests-container');
  if (!container) return;
  
  // Update count in header
  const countEl = document.getElementById('quests-count');
  if (typeof initQuestState === 'function') initQuestState();
  if (typeof checkDailyQuestReset === 'function') checkDailyQuestReset();
  const active = typeof getActiveQuests === 'function' ? getActiveQuests() : [];
  if (countEl) {
    countEl.textContent = `${active.length} active${active.length !== 1 ? 's' : ''}`;
  }
  
  // Check if quests.js loaded
  if (typeof QUESTS === 'undefined') {
    container.innerHTML = '<div class="text-muted text-center">Quest system loading...</div>';
    return;
  }
  
  if (active.length === 0) {
    container.innerHTML = `
      <div class="card" style="text-align: center; padding: 24px;">
        <div style="font-size: 32px; margin-bottom: 12px;">\uD83D\uDCDC</div>
        <div style="color: var(--text-muted);">No active quests</div>
        <button class="btn btn-primary" style="margin-top: 16px;" onclick="showAvailableQuests()">
          Ver quests disponibles
        </button>
      </div>
    `;
    return;
  }
  
  container.innerHTML = '';
  
  for (const quest of active) {
    const questId = quest.id;
    // getQuestProgress uses gameState.quests[questId] internally
    const prog = typeof getQuestProgress === 'function' ? getQuestProgress(questId) : null;
    const typeInfo = typeof getQuestTypeInfo === 'function' ? getQuestTypeInfo(quest.type) : { name: quest.type, icon: '\uD83D\uDCDC', color: 'var(--gold)' };
    const percent = prog?.percent || 0;
    const isStory = quest.type === 'story';
    const chapterInfo = isStory && quest.chapters ? `Chapter ${(quest.currentChapter || 0) + 1}/${quest.chapters.length}` : '';
    
    container.innerHTML += `
      <div class="card quest-card" style="border-left: 3px solid ${typeInfo.color || 'var(--gold)'}; margin-bottom: 12px; cursor: pointer;" onclick="showQuestDetail('${questId}')">
        <div style="display: flex; justify-content: space-between; align-items: flex-start; gap: 12px;">
          <div style="flex: 1; min-width: 0;">
            <div style="font-size: 11px; color: ${typeInfo.color || 'var(--gold)'}; text-transform: uppercase; letter-spacing: 1px;">
              ${typeInfo.icon || '\uD83D\uDCDC'} ${typeInfo.name || quest.type} ${chapterInfo ? `· ${chapterInfo}` : ''}
            </div>
            <div style="font-size: 16px; font-weight: 700; margin-top: 4px;">${quest.name}</div>
            <div style="font-size: 12px; color: var(--text-muted); margin-top: 4px;">${quest.desc || ''}</div>
          </div>
          <div style="font-size: 20px;">${quest.icon || '\uD83D\uDCDC'}</div>
        </div>
        <div style="margin-top: 12px;">
          <div style="display: flex; justify-content: space-between; font-size: 11px; color: var(--text-muted); margin-bottom: 4px;">
            <span>Progreso</span>
            <span>${percent}%</span>
          </div>
          <div style="height: 6px; background: var(--border); border-radius: 3px; overflow: hidden;">
            <div style="width: ${percent}%; height: 100%; background: ${typeInfo.color || 'var(--gold)'}; transition: width 0.3s ease;"></div>
          </div>
        </div>
        <div style="display: flex; justify-content: space-between; margin-top: 10px; font-size: 12px;">
          <span style="color: var(--text-muted);">Ver detalles</span>
          <span style="color: var(--gold);">+${quest.rewards?.xp || 0} XP · +${quest.rewards?.gold || 0} \uD83E\uDE99</span>
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
          <div style="color:var(--gold);font-size:12px;">+${quest.rewards?.xp || 0} XP</div>
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
  if (!quest) return;

  const prog = typeof getQuestProgress === 'function' ? getQuestProgress(questId) : null;
  const rewardStatus = typeof getQuestRewardStatus === 'function' ? getQuestRewardStatus(questId) : null;
  const typeInfo = typeof getQuestTypeInfo === 'function' ? getQuestTypeInfo(quest.type) : {};
  const color = typeInfo.color || 'var(--gold)';

  let objectivesHtml = '';
  if (prog && prog.objectives) {
    objectivesHtml = prog.objectives.map(obj => {
      const fmt = typeof formatObjective === 'function' ? formatObjective(obj) : { text: obj.type, progress: `${obj.progress}/${obj.count}`, done: false };
      return `<div style="display:flex;justify-content:space-between;align-items:center;padding:6px 0;border-bottom:1px solid var(--border);">
        <span style="font-size:12px;color:${fmt.done ? 'var(--green)' : 'var(--text)'};">${fmt.done ? '\u2713 ' : ''}${escapeHtml(fmt.text)}</span>
        <span style="font-size:11px;color:var(--text-muted);">${fmt.progress}</span>
      </div>`;
    }).join('');
  }

  const contentEl = document.getElementById('modal-item-content');
  contentEl.innerHTML = `
    <div style="text-align:center;margin-bottom:16px;">
      <div style="font-size:48px;">${quest.icon || '\uD83D\uDCDC'}</div>
      <h3 style="margin-top:8px;color:${color};">${escapeHtml(quest.name)}</h3>
      <div style="font-size:12px;color:var(--text-muted);">${escapeHtml(quest.desc || '')}</div>
    </div>
    ${objectivesHtml ? `<div style="margin-bottom:12px;">${objectivesHtml}</div>` : ''}
    <div style="font-size:12px;color:var(--gold);">
      Reward: +${quest.rewards?.xp || 0} XP | +${quest.rewards?.gold || 0} \uD83E\uDE99
    </div>
  `;

  const rewardApplications = [
    ...(rewardStatus?.final ? [{ label: 'Final reward', ...rewardStatus.final }] : []),
    ...(rewardStatus?.chapters || []).map(chapter => ({
      label: `Chapter reward ${chapter.rewardKey}`,
      ...chapter
    }))
  ];
  const statusLabel = status => status === 'granted'
    ? 'concedida'
    : status === 'pending'
      ? 'pendiente de espacio'
      : 'requires recovery';
  const recoveryApplications = rewardApplications.filter(application => application.status !== 'granted');
  const rewardStatusHtml = rewardApplications.length
    ? `<div style="margin-top:12px;font-size:12px;">
        ${rewardApplications.map(application => `<div style="color:${application.status === 'granted' ? 'var(--green)' : 'var(--orange)'};margin-top:4px;">${escapeHtml(application.label)}: ${statusLabel(application.status)}</div>`).join('')}
        ${recoveryApplications.length ? `<button class="btn btn-ghost" style="margin-top:8px;width:100%;" onclick="retryQuestRewards('${questId}'); showQuestDetail('${questId}');">Retry recoverable rewards</button>` : ''}
      </div>`
    : '';
  contentEl.innerHTML += rewardStatusHtml;

  const actionBtn = document.getElementById('btn-item-action');
  actionBtn.textContent = '\u274C Abandon quest';
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
