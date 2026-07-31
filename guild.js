// ===========================================================================
// LifeXP RPG - guild.js
// Sistema de guild: creacion, recibos, invitaciones, renderizado.
// Depende de: engine.js.
// ===========================================================================

// ===========================================================================
// GUILD / COOP SYSTEM (Receipt-based sync)
// ===========================================================================

function generatePlayerId() {
  return 'player_' + Math.random().toString(36).substr(2, 9);
}

function getPlayerId() {
  if (!gameState.playerId) {
    gameState.playerId = generatePlayerId();
    saveGame();
  }
  return gameState.playerId;
}

function createGuild(name) {
  const guildId = 'guild_' + Math.random().toString(36).substr(2, 6).toUpperCase();
  gameState.guildId = guildId;
  gameState.guildName = name;
  gameState.guildMembers = [{
    odeName: gameState.name,
    oderId: getPlayerId(),
    level: gameState.level,
    classId: gameState.classId,
    lastSync: todayStr(),
    totalXp: gameState.taskHistory.reduce((a, h) => a + h.xp, 0)
  }];
  saveGame();
  return guildId;
}

function joinGuildFromReceipt(receipt) {
  if (receipt.type !== 'guild_invite') return false;
  
  gameState.guildId = receipt.guildId;
  gameState.guildName = receipt.guildName;
  gameState.guildMembers = receipt.members || [];
  
  // Add self if not already in
  const selfId = getPlayerId();
  if (!gameState.guildMembers.find(m => m.oderId === selfId)) {
    gameState.guildMembers.push({
      odeName: gameState.name,
      oderId: selfId,
      level: gameState.level,
      classId: gameState.classId,
      lastSync: todayStr(),
      totalXp: gameState.taskHistory.reduce((a, h) => a + h.xp, 0)
    });
  }
  
  saveGame();
  return true;
}

function generateReceipt() {
  // Generate a receipt with recent achievements since last receipt
  const lastReceiptDate = gameState.lastReceiptDate || '2000-01-01';
  const recentHistory = gameState.taskHistory.filter(h => h.date > lastReceiptDate);
  
  gameState.lastReceiptId++;
  const receipt = {
    type: 'progress_update',
    receiptId: `${getPlayerId()}_${gameState.lastReceiptId}`,
    playerId: getPlayerId(),
    playerName: gameState.name,
    guildId: gameState.guildId,
    timestamp: new Date().toISOString(),
    
    // Current state
    currentState: {
      level: gameState.level,
      xp: gameState.xp,
      classId: gameState.classId,
      className: typeof CLASS_TREE !== 'undefined' && CLASS_TREE[gameState.classId] 
        ? CLASS_TREE[gameState.classId].name : 'Novato',
      streak: gameState.streak,
      totalXp: gameState.taskHistory.reduce((a, h) => a + h.xp, 0),
      questsCompleted: gameState.completedQuests.length
    },
    
    // Recent achievements (since last receipt)
    recentAchievements: {
      tasksCompleted: recentHistory.length,
      xpEarned: recentHistory.reduce((a, h) => a + h.xp, 0),
      sideQuestsCompleted: recentHistory.filter(h => h.sideQuest).length,
      period: { from: lastReceiptDate, to: todayStr() }
    }
  };
  
  gameState.lastReceiptDate = todayStr();
  saveGame();
  
  return receipt;
}

function generateGuildInvite() {
  if (!gameState.guildId) return null;
  
  return {
    type: 'guild_invite',
    guildId: gameState.guildId,
    guildName: gameState.guildName,
    invitedBy: gameState.name,
    timestamp: new Date().toISOString(),
    members: gameState.guildMembers
  };
}

function exportReceipt() {
  if (!gameState.guildId) {
    alert('Primero debes crear o unirte a un guild.');
    return;
  }
  
  const receipt = generateReceipt();
  const data = JSON.stringify(receipt, null, 2);
  
  // Try to use Web Share API for mobile (WhatsApp, etc)
  if (navigator.share && navigator.canShare) {
    const file = new File([data], `recibo_${gameState.name}_${todayStr()}.json`, { type: 'application/json' });
    if (navigator.canShare({ files: [file] })) {
      navigator.share({
        title: `Recibo de ${gameState.name}`,
        text: `\uD83C\uDFAE Actualización de ${gameState.name} en ${gameState.guildName}`,
        files: [file]
      }).catch(() => downloadReceipt(data, receipt));
      return;
    }
  }
  
  // Fallback to download
  downloadReceipt(data, receipt);
}

function downloadReceipt(data, receipt) {
  const blob = new Blob([data], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `recibo_${gameState.name}_${todayStr()}.json`;
  a.click();
  URL.revokeObjectURL(url);
  
  alert(`Recibo generado!\\n\\nCompártelo con tu guild por WhatsApp o donde prefieras.\\n\\n\uD83D\uDCCA ${receipt.recentAchievements.tasksCompleted} tareas | +${receipt.recentAchievements.xpEarned} XP`);
}

function exportGuildInvite() {
  if (!gameState.guildId) {
    const name = prompt('Nombre para tu nuevo Guild:');
    if (!name) return;
    createGuild(name);
  }
  
  const invite = generateGuildInvite();
  const data = JSON.stringify(invite, null, 2);
  
  // Try Web Share API
  if (navigator.share && navigator.canShare) {
    const file = new File([data], `invite_${gameState.guildName}.json`, { type: 'application/json' });
    if (navigator.canShare({ files: [file] })) {
      navigator.share({
        title: `Invitación a ${gameState.guildName}`,
        text: `\uD83C\uDFAE ¡Únete a mi guild "${gameState.guildName}" en LifeXP!`,
        files: [file]
      }).catch(() => downloadInvite(data));
      return;
    }
  }
  
  downloadInvite(data);
}

function downloadInvite(data) {
  const blob = new Blob([data], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `invite_${gameState.guildName || 'guild'}.json`;
  a.click();
  URL.revokeObjectURL(url);
  
  alert(`Invitación generada para "${gameState.guildName}"!\\n\\nCompártela con quien quieras que se una.`);
}

function importReceipt() {
  const input = document.createElement('input');
  input.type = 'file';
  input.accept = '.json';
  input.onchange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    try {
      const text = await file.text();
      const receipt = JSON.parse(text);
      processReceipt(receipt);
    } catch (err) {
      alert('Error al importar recibo: ' + err.message);
    }
  };
  input.click();
}

function processReceipt(receipt) {
  if (receipt.type === 'guild_invite') {
    if (gameState.guildId && gameState.guildId !== receipt.guildId) {
      if (!confirm(`Ya perteneces a "${gameState.guildName}". ¿Quieres cambiar a "${receipt.guildName}"?`)) {
        return;
      }
    }
    joinGuildFromReceipt(receipt);
    alert(`¡Te has unido a "${receipt.guildName}"!`);
    renderGuild();
    return;
  }
  
  if (receipt.type === 'progress_update') {
    // Check guild match
    if (receipt.guildId !== gameState.guildId) {
      alert('Este recibo es de otro guild.');
      return;
    }
    
    // Check if already processed
    if (gameState.receivedReceipts.includes(receipt.receiptId)) {
      alert('Este recibo ya fue procesado.');
      return;
    }
    
    // Update member info
    const memberIdx = gameState.guildMembers.findIndex(m => m.oderId === receipt.playerId);
    const memberData = {
      odeName: receipt.playerName,
      oderId: receipt.playerId,
      level: receipt.currentState.level,
      classId: receipt.currentState.classId,
      className: receipt.currentState.className,
      lastSync: receipt.timestamp.slice(0, 10),
      totalXp: receipt.currentState.totalXp,
      streak: receipt.currentState.streak
    };
    
    if (memberIdx >= 0) {
      gameState.guildMembers[memberIdx] = memberData;
    } else {
      gameState.guildMembers.push(memberData);
    }
    
    gameState.receivedReceipts.push(receipt.receiptId);
    saveGame();
    
    alert(`Recibo de ${receipt.playerName} procesado!\\n\\n\uD83D\uDCCA Nivel ${receipt.currentState.level} | ${receipt.recentAchievements.tasksCompleted} tareas recientes`);
    renderGuild();
    return;
  }
  
  alert('Tipo de recibo no reconocido.');
}

function renderGuild() {
  const container = document.getElementById('guild-container');
  if (!container) return;
  
  if (!gameState.guildId) {
    container.innerHTML = `
      <div class="card" style="text-align: center; padding: 24px;">
        <div style="font-size: 48px; margin-bottom: 12px;">⚔️</div>
        <h3 style="margin-bottom: 8px;">Sin Guild</h3>
        <p style="color: var(--text-muted); margin-bottom: 16px;">Crea un guild o únete a uno existente para compartir logros con amigos.</p>
        <button class="btn btn-gold mb-8" onclick="exportGuildInvite()">\uD83C\uDFF0 Crear Guild</button>
        <button class="btn btn-secondary" onclick="importReceipt()">\uD83D\uDCE5 Unirme con invitación</button>
      </div>
    `;
    return;
  }
  
  // Has guild
  const members = gameState.guildMembers || [];
  const sorted = [...members].sort((a, b) => (b.totalXp || 0) - (a.totalXp || 0));
  
  let membersHtml = '';
  sorted.forEach((m, idx) => {
    const isMe = m.oderId === getPlayerId();
    const medal = idx === 0 ? '\uD83E\uDD47' : idx === 1 ? '\uD83E\uDD48' : idx === 2 ? '\uD83E\uDD49' : '▪️';
    const classIcon = typeof CLASS_TREE !== 'undefined' && CLASS_TREE[m.classId] 
      ? CLASS_TREE[m.classId].icon : '\uD83E\uDDD1‍\uD83C\uDF3E';
    
    membersHtml += `
      <div class="card" style="display: flex; align-items: center; gap: 12px; ${isMe ? 'border-color: var(--gold);' : ''}">
        <div style="font-size: 20px;">${medal}</div>
        <div style="font-size: 28px;">${classIcon}</div>
        <div style="flex: 1;">
          <div style="font-weight: 700;">${m.odeName} ${isMe ? '(tú)' : ''}</div>
          <div style="font-size: 12px; color: var(--text-muted);">
            Lv ${m.level} · ${m.className || 'Novato'} · \uD83D\uDD25${m.streak || 0}
          </div>
        </div>
        <div style="text-align: right;">
          <div style="font-size: 16px; color: var(--gold);">${(m.totalXp || 0).toLocaleString()} XP</div>
          <div style="font-size: 10px; color: var(--text-muted);">sync: ${m.lastSync || '?'}</div>
        </div>
      </div>
    `;
  });
  
  container.innerHTML = `
    <div style="text-align: center; margin-bottom: 16px;">
      <div style="font-size: 13px; color: var(--text-muted);">GUILD</div>
      <h2 style="color: var(--gold);">⚔️ ${gameState.guildName}</h2>
      <div style="font-size: 12px; color: var(--text-muted);">${members.length} miembro${members.length !== 1 ? 's' : ''}</div>
    </div>
    
    <div class="section-title">Ranking</div>
    ${membersHtml}
    
    <div class="section-title" style="margin-top: 20px;">Acciones</div>
    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px;">
      <button class="btn btn-gold" onclick="exportReceipt()">\uD83D\uDCE4 Enviar recibo</button>
      <button class="btn btn-secondary" onclick="importReceipt()">\uD83D\uDCE5 Recibir recibo</button>
    </div>
    <button class="btn btn-ghost" style="width: 100%; margin-top: 8px;" onclick="exportGuildInvite()">\uD83D\uDD17 Invitar a alguien</button>
  `;
}

