// ===========================================================================
// LifeXP RPG - material_interactions.js
// Canonical boundary for declarative material-use discoveries.
// Depends on: gameState, ITEMS and the optional getMissionItemId() resolver.
// This module never saves by itself. The caller owns the surrounding
// transaction, persistence and rollback boundary.
// ===========================================================================

(function createLifeXPMaterialInteractions() {
  const MATERIAL_INTERACTION_VERSION = 1;
  const GRANTED_STATUS = 'granted';
  const SOURCE = 'material_interaction';

  function isPlainObject(value) {
    return value !== null && typeof value === 'object' && !Array.isArray(value);
  }

  function cloneRecord(value) {
    return isPlainObject(value) ? { ...value } : value;
  }

  function getState() {
    if (typeof gameState === 'undefined' || !isPlainObject(gameState)) return null;

    if (!isPlainObject(gameState.materialInteractions)) {
      gameState.materialInteractions = {
        version: MATERIAL_INTERACTION_VERSION,
        ledger: {},
        discoveredUses: {}
      };
    }

    const state = gameState.materialInteractions;
    if (!Number.isInteger(state.version) || state.version < MATERIAL_INTERACTION_VERSION) {
      state.version = MATERIAL_INTERACTION_VERSION;
    }
    if (!isPlainObject(state.ledger)) state.ledger = {};
    if (!isPlainObject(state.discoveredUses)) state.discoveredUses = {};
    return state;
  }

  function normalizeId(value) {
    return typeof value === 'string' && value.trim() ? value.trim() : null;
  }

  function resolveMaterialId(itemId) {
    const rawId = normalizeId(itemId);
    if (!rawId) return null;

    if (typeof getMissionItemId === 'function') {
      try {
        const resolvedId = normalizeId(getMissionItemId(rawId));
        if (resolvedId) return resolvedId;
      } catch (error) {
        return null;
      }
    }

    return rawId;
  }

  function getMaterialDefinition(itemId) {
    const resolvedId = resolveMaterialId(itemId);
    if (!resolvedId || typeof ITEMS === 'undefined' || !isPlainObject(ITEMS)) return null;
    const item = ITEMS[resolvedId];
    if (!isPlainObject(item) || item.type !== 'material') return null;
    return { id: resolvedId, item };
  }

  function createClaimId(itemId, useId) {
    return `material_use:${JSON.stringify([itemId, useId])}`;
  }

  function createGrantedRecord(itemId, useId, claimId) {
    return {
      status: GRANTED_STATUS,
      claimId,
      itemId,
      useId,
      source: SOURCE
    };
  }

  function getDiscoveredUseRecord(state, itemId, useId) {
    const itemUses = state?.discoveredUses?.[itemId];
    if (!isPlainObject(itemUses)) return null;
    const record = itemUses[useId];
    return record ? record : null;
  }

  function hasGrantedLedgerClaim(state, itemId, useId) {
    const claimId = createClaimId(itemId, useId);
    const claim = state?.ledger?.[claimId];
    return isPlainObject(claim) && claim.status === GRANTED_STATUS;
  }

  function ensureItemUseBucket(state, itemId) {
    if (!isPlainObject(state.discoveredUses[itemId])) {
      state.discoveredUses[itemId] = {};
    }
    return state.discoveredUses[itemId];
  }

  function discoverUse(itemId, useId) {
    const state = getState();
    const normalizedUseId = normalizeId(useId);
    const material = getMaterialDefinition(itemId);
    if (!state || !material || !normalizedUseId) return false;

    const resolvedItemId = material.id;
    const claimId = createClaimId(resolvedItemId, normalizedUseId);
    if (getDiscoveredUseRecord(state, resolvedItemId, normalizedUseId) || hasGrantedLedgerClaim(state, resolvedItemId, normalizedUseId)) {
      return false;
    }

    const record = createGrantedRecord(resolvedItemId, normalizedUseId, claimId);
    ensureItemUseBucket(state, resolvedItemId)[normalizedUseId] = record;
    state.ledger[claimId] = cloneRecord(record);
    return true;
  }

  function reconcile() {
    const state = getState();
    if (!state) return false;

    let changed = false;

    for (const [claimId, rawClaim] of Object.entries(state.ledger)) {
      if (!isPlainObject(rawClaim) || rawClaim.status !== GRANTED_STATUS) continue;
      const itemId = resolveMaterialId(rawClaim.itemId);
      const useId = normalizeId(rawClaim.useId);
      if (!itemId || !useId) continue;

      const itemUses = state.discoveredUses[itemId];
      if (!isPlainObject(itemUses)) {
        state.discoveredUses[itemId] = {};
        changed = true;
      }
      if (!state.discoveredUses[itemId][useId]) {
        state.discoveredUses[itemId][useId] = {
          ...rawClaim,
          claimId: createClaimId(itemId, useId),
          itemId,
          useId,
          status: GRANTED_STATUS
        };
        changed = true;
      }
    }

    for (const [itemId, rawUses] of Object.entries(state.discoveredUses)) {
      if (!isPlainObject(rawUses)) continue;
      for (const [useId, rawRecord] of Object.entries(rawUses)) {
        if (!rawRecord) continue;
        const normalizedUseId = normalizeId(useId);
        if (!normalizedUseId) continue;
        const claimId = createClaimId(itemId, normalizedUseId);
        const claim = state.ledger[claimId];
        if (!isPlainObject(claim) || claim.status !== GRANTED_STATUS) {
          state.ledger[claimId] = createGrantedRecord(itemId, normalizedUseId, claimId);
          changed = true;
        }
      }
    }

    return changed;
  }

  window.LifeXPMaterialInteractions = Object.freeze({
    discoverUse,
    reconcile
  });
})();
