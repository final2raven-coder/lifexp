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
    countEl.textContent = `${active.length} activa${active.length !== 1 ? 's' : ''}`;
  }
  
  // Check if quests.js loaded
  if (typeof QUESTS === 'undefined') {
    container.innerHTML = '<div class="text-muted text-center">Sistema de quests cargando...</div>';
    return;
  }
  
  if (active.length === 0) {
    container.innerHTML = `
      <div class="card" style="text-align: center; padding: 24px;">
        <div style="font-size: 32px; margin-bottom: 12px;">\uD83D\uDCDC</div>
        <div style="color: var(--text-muted);">No tienes quests activas</div>
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
    const progressPct = prog ? prog.percent : 0;
    
    const typeColors = {
      daily: 'var(--green)',
      simple: 'var(--blue)',
      compound: 'var(--purple)',
      story: 'var(--gold)',
      bounty: 'var(--red)',
      class_quest: 'var(--cyan)',
      event: 'var(--orange)'
    };
    const color = typeColors[quest.type] || 'var(--text-muted)';
    
    container.innerHTML += `
      <div class="card" onclick="showQuestDetail('${questId}')" style="cursor: pointer; border-left: 3px solid ${color};">
        <div style="display: flex; justify-content: space-between; align-items: flex-start;">
          <div>
            <div style="font-size: 11px; color: ${color}; text-transform: uppercase; margin-bottom: 4px;">
              ${quest.type}
            </div>
            <div style="font-weight: 700;">${quest.name}</div>
            <div style="font-size: 12px; color: var(--text-muted); margin-top: 4px;">${quest.desc || ''}</div>
          </div>
          <div style="text-align: right;">
            <div style="font-size: 20px;">${quest.icon || '\uD83D\uDCDC'}</div>
          </div>
        </div>
        <div style="margin-top: 12px;">
          <div style="height: 4px; background: var(--border); border-radius: 2px; overflow: hidden;">
            <div style="height: 100%; width: ${progressPct}%; background: ${color}; border-radius: 2px;"></div>
          </div>
          <div style="font-size: 11px; color: var(--text-muted); margin-top: 4px;">${progressPct}% completado</div>
        </div>
      </div>
    `;
  }
  
  // Add button to see more quests
  container.innerHTML += `
    <button class="btn btn-ghost" style="width: 100%; margin-top: 8px;" onclick="showAvailableQuests()">
      + Ver más quests
    </button>
  `;
}

function showAvailableQuests() {
  const modal = document.getElementById('modal-tasks');
  const list  = document.getElementById('modal-tasks-list');
  const title = document.getElementById('modal-tasks-title');
  if (!modal || !list || !title) return;
  title.textContent = '\uD83D\uDCDC Quests disponibles';

  if (typeof QUESTS === 'undefined') {
    list.innerHTML = '<div class="text-muted">Sistema de quests no disponible</div>';
    openModal('modal-tasks');
    return;
  }

  // Ensure update2 patches are applied (idempotent — safe to call every time)
  if (typeof window !== 'undefined' && window.LifeXPUpdate2) {
    if (typeof window.LifeXPUpdate2.patchQuests === 'function') window.LifeXPUpdate2.patchQuests();
    if (typeof window.LifeXPUpdate2.patchExpansionQuestLanguage === 'function') window.LifeXPUpdate2.patchExpansionQuestLanguage();
  }

  const typeConfig = {
    daily:       { color: 'var(--green)',  label: 'Diaria',    icon: '\uD83D\uDCC5' },
    simple:      { color: 'var(--blue)',   label: 'Misión',    icon: '\uD83D\uDCDC' },
    compound:    { color: 'var(--purple)', label: 'Compuesta', icon: '\uD83D\uDCDA' },
    story:       { color: 'var(--gold)',   label: 'Historia',  icon: '⭐' },
    bounty:      { color: 'var(--red)',    label: 'Bounty',    icon: '\uD83C\uDFAF' },
    class_quest: { color: 'var(--cyan)',   label: 'Clase',     icon: '⚔️' },
    event:       { color: 'var(--orange)', label: 'Evento',    icon: '\uD83C\uDF89' },
  };

  // getAvailableQuests() (quests.js) applies level/class/stat/active/completed filters
  const available = typeof getAvailableQuests === 'function' ? getAvailableQuests() : [];

  list.innerHTML = '';
  let count = 0;

  for (const quest of available) {
    const questId = quest.id;

    const cfg   = typeConfig[quest.type] || { color: 'var(--text-muted)', label: quest.type, icon: '\uD83D\uDCDC' };
    // Prefer EN fantasy name if patched by update2, fall back to ES name
    const displayName = quest.name || questId;
    // Lore line: setting > lore > desc (in that priority — setting is the world-flavour hook)
    const loreLine = quest.setting || quest.lore || '';
    // Practical desc always shown below (ES)
    const practicalDesc = quest.desc || '';

    const rewardXp   = quest.rewards?.xp   || 0;
    const rewardGold = quest.rewards?.gold  || 0;
    const rewardItems = (quest.rewards?.items || []).length;

    list.innerHTML += `
      <div class="card" style="cursor:pointer;border-left:3px solid ${cfg.color};margin-bottom:8px;" onclick="acceptQuest('${questId}')">
        <div style="display:flex;justify-content:space-between;align-items:flex-start;gap:8px;">
          <div style="flex:1;min-width:0;">
            <div style="font-size:10px;color:${cfg.color};text-transform:uppercase;letter-spacing:1px;margin-bottom:2px;">${cfg.icon} ${cfg.label}</div>
            <div style="font-weight:700;font-size:14px;color:var(--text);margin-bottom:4px;">${escapeHtml(displayName)}</div>
            ${loreLine ? `<div style="font-size:12px;color:var(--text-muted);font-style:italic;line-height:1.4;margin-bottom:4px;">${escapeHtml(loreLine)}</div>` : ''}
            ${practicalDesc ? `<div style="font-size:11px;color:var(--text-muted);line-height:1.4;">${escapeHtml(practicalDesc)}</div>` : ''}
          </div>
        </div>
        <div style="display:flex;gap:10px;margin-top:8px;padding-top:6px;border-top:1px solid var(--border);">
          ${rewardXp   ? `<span style="font-size:11px;color:var(--gold);">+${rewardXp} XP</span>` : ''}
          ${rewardGold ? `<span style="font-size:11px;color:var(--gold);">+${rewardGold} \uD83E\uDE99</span>` : ''}
          ${rewardItems ? `<span style="font-size:11px;color:var(--blue);">+${rewardItems} objeto${rewardItems>1?'s':''}</span>` : ''}
        </div>
      </div>
    `;
    count++;
  }

  if (!count) {
    list.innerHTML = '<div class="text-muted text-center" style="padding:20px;">No hay quests disponibles ahora</div>';
  }

  openModal('modal-tasks');
}

// ===========================================================================
// QUEST FUNCTIONS — delegations to quests.js canonical implementations
// (Fase E saneamiento: duplicados eliminados, game.js delega a quests.js)
// ===========================================================================

function acceptQuest(questId) {
  if (typeof window.acceptQuestCanonical !== 'function') return;
  const result = window.acceptQuestCanonical(questId);
  if (result && !result.success) {
    if (typeof showToast === 'function') showToast(result.message, 'error');
    return;
  }
  closeModal('modal-tasks');
  renderQuests();
}

function showQuestDetail(questId) {
  if (typeof QUESTS === 'undefined') return;
  const quest = QUESTS[questId];
  if (!quest) return;

  const prog = typeof getQuestProgress === 'function' ? getQuestProgress(questId) : null;
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
      Recompensa: +${quest.rewards?.xp || 0} XP | +${quest.rewards?.gold || 0} \uD83E\uDE99
    </div>
  `;

  const actionBtn = document.getElementById('btn-item-action');
  actionBtn.textContent = '\u274C Abandonar quest';
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
// ===========================================================================

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register(`sw.js?build=${LIFE_XP_BUILD}`, { updateViaCache: 'none' }).then(reg => reg.update()).catch(() => {
      console.log('Service worker registration failed (expected in dev)');
    });
  });
}


