// LifeXP canonical inventory compatibility layer.
// Kept at this path only for backwards-compatible deployment; it is not item-specific.
(function () {
  'use strict';

  const BUILD = 'v14-canonical-inventory';
  const ALIASES = {
    'cuchilla llameante': 'cuchilla_llameante',
    'flaming blade': 'cuchilla_llameante',
    'ashbrand': 'cuchilla_llameante',
    'daga corrosiva': 'daga_corrosiva',
    'espada radiante': 'espada_radiante',
    'hoja gelida': 'hoja_gelida',
    'arco de espino': 'arco_espino',
    'tridente marino': 'tridente_marino',
    'katana oriental': 'katana_oriental'
  };

  const normalize = value => String(value ?? '')
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().trim();

  function resolve(entry) {
    if (entry == null || typeof ITEMS === 'undefined') return null;
    const candidates = typeof entry === 'string'
      ? [entry]
      : [entry.id, entry.itemId, entry.itemID, entry.itemKey, entry.key,
         entry.name, entry.legacyName, entry.itemName];
    for (const candidate of candidates) {
      if (candidate == null || typeof candidate === 'object') continue;
      const value = String(candidate);
      if (ITEMS[value]) return value;
      const key = normalize(value);
      if (ALIASES[key]) return ALIASES[key];
      const byName = Object.entries(ITEMS).find(([_, item]) => normalize(item?.name) === key);
      if (byName) return byName[0];
      const byId = Object.keys(ITEMS).find(id =>
        normalize(id) === key || normalize(id.replaceAll('_', ' ')) === key);
      if (byId) return byId;
    }
    return null;
  }

  function repair() {
    if (typeof gameState === 'undefined') return false;
    let changed = false;
    for (const key of ['inventory', 'stash']) {
      const list = Array.isArray(gameState[key]) ? gameState[key] : [];
      gameState[key] = list.map(original => {
        const id = resolve(original);
        if (!id) return original; // unresolved data remains recoverable and visible
        const slot = typeof original === 'string'
          ? { id, qty: 1 }
          : { ...original, id, qty: Math.max(1, Number(original.qty ?? original.quantity ?? 1) || 1) };
        delete slot.itemId; delete slot.itemID; delete slot.itemKey; delete slot.key;
        delete slot.name; delete slot.legacyName; delete slot.itemName;
        slot.recoveredAtBuild = slot.recoveredAtBuild || BUILD;
        if (JSON.stringify(slot) !== JSON.stringify(original)) changed = true;
        return slot;
      });
    }
    if (changed && typeof saveGame === 'function') saveGame();
    return changed;
  }

  function icon(item, size = 40) {
    const color = RARITY[item?.rarity]?.color || '#c9c5bb';
    return `<svg class="item-icon-svg" width="${size}" height="${size}" viewBox="0 0 40 40" aria-hidden="true" style="color:${color}"><g fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10 31 28 7l4 4-18 24H10z"/><path d="m8 33 8-2M25 10l4 4"/></g></svg>`;
  }

  function card(entry, index, stash) {
    const id = resolve(entry);
    const item = id ? ITEMS[id] : null;
    if (!item) return `<div class="inv-slot inv-slot-recovery" role="button" tabindex="0" onclick="showLegacyItemModal(${index})"><div class="recovery-icon">?</div><div>Objeto no identificado</div><small>Revisar recuperación</small></div>`;
    const rarity = RARITY[item.rarity] || RARITY.common;
    const qty = Number(entry.qty || entry.quantity || 1);
    const fn = stash ? 'showStashItemModal' : 'showItemModal';
    const action = `${fn}('${id}')`;
    return `<div class="inv-slot item-card" role="button" tabindex="0" aria-label="Abrir objeto" onclick="${action}" onkeydown="if(event.key==='Enter'||event.key===' '){event.preventDefault();${action}}" style="border-color:${rarity.color}"><div class="item-card-icon">${icon(item)}</div><div class="item-card-name" style="color:${rarity.color}">${escapeItemHtml(item.name)}</div>${qty > 1 ? `<div class="item-card-qty">x${qty}</div>` : ''}</div>`;
  }

  function render(listId, emptyId, key, stash) {
    const grid = document.getElementById(listId);
    const empty = document.getElementById(emptyId);
    if (!grid) return;
    repair();
    const list = Array.isArray(gameState[key]) ? gameState[key] : [];
    empty?.classList.toggle('hidden', list.length > 0);
    grid.innerHTML = list.map((entry, index) => card(entry, index, stash)).join('');
  }

  const css = document.createElement('style');
  css.textContent = '.inv-slot{position:relative;min-height:104px;padding:10px 6px;background:var(--bg-card);border:2px solid var(--border);border-radius:var(--radius-sm);display:flex;flex-direction:column;align-items:center;justify-content:center;gap:5px;text-align:center;cursor:pointer;transition:transform .12s ease,border-color .2s ease,background .2s ease}.inv-slot:hover{background:var(--bg-card-hover);transform:translateY(-1px)}.inv-slot:focus-visible{outline:2px solid var(--accent);outline-offset:2px}.item-card-icon{height:44px;display:flex;align-items:center;justify-content:center}.item-icon-svg{display:block;filter:drop-shadow(0 2px 4px rgba(0,0,0,.35))}.item-card-name{max-width:100%;font-size:10px;font-weight:700;line-height:1.2;overflow-wrap:anywhere}.item-card-qty{position:absolute;top:5px;right:6px;padding:2px 5px;border-radius:10px;background:var(--bg-surface);color:var(--text);font-size:10px;font-weight:800}.inv-slot-recovery{border-color:var(--orange);color:var(--orange);font-size:11px}.recovery-icon{font-size:28px;font-weight:800}.inv-slot-recovery small{color:var(--text-muted);font-size:9px}';
  document.head.appendChild(css);

  window.LifeXPInventory = { BUILD, resolve, repair };
  window.renderInventoryGrid = () => render('inventory-grid', 'inventory-empty', 'inventory', false);
  window.renderStashGrid = () => render('stash-grid', 'stash-empty', 'stash', true);

  repair();
})();
