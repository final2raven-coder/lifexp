// ===========================================================================
// LifeXP RPG - main.js
// Punto de entrada: event listeners y registro del Service Worker.
// Debe cargarse ULTIMO, despues de todos los demas modulos.
// Depende de: todos los modulos anteriores.
// ===========================================================================

// ===========================================================================
// SCREEN AND MODAL HISTORY
// ===========================================================================

let lifeXPHistoryReady = false;

function initializeLifeXPHistory() {
  if (typeof history === 'undefined' || typeof history.replaceState !== 'function') return;
  const currentState = history.state && typeof history.state === 'object' ? history.state : {};
  history.replaceState({ ...currentState, lifexp: true, screen: currentState.screen || 'hub', modal: null }, '', window.location.href);
  lifeXPHistoryReady = true;
}

function syncLifeXPScreenHistory(screenId, options = {}) {
  if (!lifeXPHistoryReady || typeof history === 'undefined') return;
  if (options.fromHistory) return;
  const nextState = { lifexp: true, screen: screenId, modal: null };
  if (options.replaceHistory) {
    history.replaceState(nextState, '', window.location.href);
    return;
  }
  if (history.state?.lifexp && history.state.screen === screenId && !history.state.modal) return;
  history.pushState(nextState, '', window.location.href);
}

function pushTaskResultHistory() {
  if (!lifeXPHistoryReady || typeof history === 'undefined') return;
  if (history.state?.lifexp && history.state.modal === 'task-result') return;
  const screen = history.state?.lifexp && history.state.screen ? history.state.screen : 'task';
  history.pushState({ lifexp: true, screen, modal: 'task-result' }, '', window.location.href);
}

function closeTaskResultModal(options = {}) {
  const overlay = document.getElementById('complete-overlay');
  if (!overlay?.classList.contains('show')) return;
  overlay.classList.remove('show');
  overlay.setAttribute('aria-hidden', 'true');
  overlay.removeAttribute('aria-modal');
  if (typeof history === 'undefined' || history.state?.modal !== 'task-result') return;
  if (options.navigateHistory) {
    history.back();
  } else if (!options.fromHistory) {
    history.replaceState({ ...history.state, modal: null }, '', window.location.href);
  }
}

function handleLifeXPBack(event) {
  if (event.state?.lifexp && event.state.modal === 'task-result' && typeof hasPendingTaskResult === 'function' && hasPendingTaskResult()) {
    showPendingTaskResult();
    return;
  }
  if (typeof isTaskResultModalVisible === 'function' && isTaskResultModalVisible()) {
    closeTaskResultModal({ fromHistory: true });
    const targetScreen = event.state?.lifexp && event.state.screen ? event.state.screen : 'task';
    showScreen(targetScreen, { fromHistory: true });
    return;
  }
  const targetScreen = event.state?.lifexp && event.state.screen ? event.state.screen : 'hub';
  showScreen(targetScreen, { fromHistory: true });
}

function handleLifeXPKeydown(event) {
  if (event.key === 'Escape') {
    if (typeof isTaskResultModalVisible === 'function' && isTaskResultModalVisible()) {
      event.preventDefault();
      closeTaskResultModal({ navigateHistory: true });
      return;
    }
    const openModal = document.querySelector('.modal-backdrop.show');
    if (openModal) {
      event.preventDefault();
      openModal.classList.remove('show');
    }
    return;
  }

  if (event.key !== 'Tab' || typeof isTaskResultModalVisible !== 'function' || !isTaskResultModalVisible()) return;
  const overlay = document.getElementById('complete-overlay');
  const focusable = [...overlay.querySelectorAll('button:not([disabled]), [href], input, select, textarea, [tabindex]:not([tabindex="-1"])')];
  if (focusable.length < 2) return;
  const first = focusable[0];
  const last = focusable[focusable.length - 1];
  if (event.shiftKey && document.activeElement === first) {
    event.preventDefault();
    last.focus();
  } else if (!event.shiftKey && document.activeElement === last) {
    event.preventDefault();
    first.focus();
  }
}

// PWA UPDATE VERIFICATION
// ===========================================================================

const LIFE_XP_UPDATE_CHECK_TIMEOUT_MS = 2500;

function getLifeXPEffectiveBuild() {
  return typeof LIFE_XP_BUILD === 'string' && LIFE_XP_BUILD.trim() ? LIFE_XP_BUILD : 'unknown';
}

function reportLifeXPUpdateStatus(message, level = 'info') {
  if (typeof showToast === 'function') showToast(message);
  else if (typeof console !== 'undefined' && console[level]) console[level](`[LifeXP] ${message}`);
}

function readLifeXPDeclaredSourceBuild() {
  const sourceUrl = new URL('./data_tasks.js', window.location.href);
  sourceUrl.searchParams.set('lifexp_build_check', String(Date.now()));
  return fetch(sourceUrl.href, { cache: 'no-store', credentials: 'same-origin' })
    .then(response => {
      if (!response.ok) throw new Error(`Source build request failed with HTTP ${response.status}.`);
      return response.text();
    })
    .then(source => {
      const match = source.match(/\bconst\s+LIFE_XP_BUILD\s*=\s*['"]([^'"]+)['"]/);
      if (!match) throw new Error('The source does not declare LIFE_XP_BUILD.');
      return match[1];
    });
}

function requestLifeXPServiceWorkerStatus(registration) {
  const worker = registration && (registration.waiting || registration.active || registration.installing);
  if (!worker || typeof MessageChannel === 'undefined') return Promise.reject(new Error('Service Worker status is unavailable.'));
  return new Promise((resolve, reject) => {
    const channel = new MessageChannel();
    const timeout = setTimeout(() => reject(new Error('Service Worker status timed out.')), LIFE_XP_UPDATE_CHECK_TIMEOUT_MS);
    channel.port1.onmessage = event => {
      clearTimeout(timeout);
      if (event.data?.type === 'lifexp-sw-status') resolve(event.data);
      else reject(new Error('Service Worker returned an invalid status.'));
    };
    try { worker.postMessage({ type: 'lifexp-get-status' }, [channel.port2]); }
    catch (error) { clearTimeout(timeout); reject(error); }
  });
}

function observeLifeXPServiceWorkerInstallation(registration, previousController) {
  return new Promise(resolve => {
    let settled = false;
    let updateFound = Boolean(registration.waiting);
    let observedWorker = null;
    const finish = status => {
      if (settled) return;
      settled = true;
      registration.removeEventListener('updatefound', handleUpdateFound);
      navigator.serviceWorker.removeEventListener('controllerchange', handleControllerChange);
      resolve(status);
    };
    const handleControllerChange = () => finish('activated');
    const observeWorker = worker => {
      if (!worker || worker === observedWorker) return;
      observedWorker = worker;
      updateFound = true;
      worker.addEventListener('statechange', () => {
        if (worker.state === 'redundant') finish('not-confirmed');
        else if (worker.state === 'installed' && registration.waiting && navigator.serviceWorker.controller === previousController) {
          setTimeout(() => finish('pending-reload'), 200);
        }
      });
    };
    const handleUpdateFound = () => observeWorker(registration.installing);
    registration.addEventListener('updatefound', handleUpdateFound);
    navigator.serviceWorker.addEventListener('controllerchange', handleControllerChange);
    observeWorker(registration.installing);
    setTimeout(() => finish(registration.waiting ? 'pending-reload' : updateFound ? 'not-confirmed' : 'unchanged'), LIFE_XP_UPDATE_CHECK_TIMEOUT_MS);
  });
}

async function verifyLifeXPUpdate(registration, installationStatus) {
  const effectiveBuild = getLifeXPEffectiveBuild();
  let declaredBuild;
  let serviceWorkerStatus;
  try { declaredBuild = await readLifeXPDeclaredSourceBuild(); }
  catch (error) {
    reportLifeXPUpdateStatus(`Actualización no confirmada. Build en ejecución: ${effectiveBuild}. No se pudo leer la build declarada de la fuente.`, 'warn');
    return { confirmed: false, effectiveBuild, installationStatus, error };
  }
  if (declaredBuild !== effectiveBuild) {
    reportLifeXPUpdateStatus(`Actualización no confirmada. Build en ejecución: ${effectiveBuild}; build declarada por la fuente: ${declaredBuild}.`, 'warn');
    return { confirmed: false, effectiveBuild, declaredBuild, installationStatus };
  }
  try { serviceWorkerStatus = await requestLifeXPServiceWorkerStatus(registration); }
  catch (error) {
    reportLifeXPUpdateStatus(`Build comprobada: ${effectiveBuild}. No se pudo confirmar el estado de la caché o del Service Worker; no se muestra una actualización como aplicada.`, 'warn');
    return { confirmed: false, effectiveBuild, declaredBuild, installationStatus, error };
  }
  const cacheName = serviceWorkerStatus.cacheName || 'desconocida';
  if (installationStatus === 'activated') reportLifeXPUpdateStatus(`Caché actualizada: ${cacheName}. La página sigue ejecutando la build ${effectiveBuild}; recarga para ejecutar los assets recién activados.`);
  else if (installationStatus === 'pending-reload') reportLifeXPUpdateStatus(`Hay una actualización preparada en la caché ${cacheName}. La página sigue ejecutando la build ${effectiveBuild}; recarga para aplicarla.`);
  else reportLifeXPUpdateStatus(`No se ha confirmado una build nueva. Build en ejecución: ${effectiveBuild}; fuente declarada: ${declaredBuild}; caché activa: ${cacheName}.`);
  return { confirmed: installationStatus === 'activated' || installationStatus === 'pending-reload', effectiveBuild, declaredBuild, installationStatus, serviceWorkerStatus };
}

async function registerAndVerifyLifeXPServiceWorker() {
  const effectiveBuild = getLifeXPEffectiveBuild();
  if (!('serviceWorker' in navigator)) {
    reportLifeXPUpdateStatus(`Actualización no confirmada. Build en ejecución: ${effectiveBuild}. Este dispositivo no ofrece Service Worker.`, 'warn');
    return;
  }
  const previousController = navigator.serviceWorker.controller;
  try {
    const registration = await navigator.serviceWorker.register('./sw.js');
    const installationPromise = observeLifeXPServiceWorkerInstallation(registration, previousController);
    try { await registration.update(); }
    catch (error) { await verifyLifeXPUpdate(registration, 'not-confirmed'); return; }
    await verifyLifeXPUpdate(registration, await installationPromise);
  } catch (error) {
    reportLifeXPUpdateStatus(`Actualización no confirmada. Build en ejecución: ${effectiveBuild}. No se pudo registrar o comprobar el Service Worker.`, 'warn');
    if (typeof console !== 'undefined' && console.warn) console.warn('[LifeXP] Service Worker update verification failed:', error);
  }
}

// EVENT LISTENERS
// ===========================================================================

document.addEventListener('DOMContentLoaded', () => {
  // Load game
  loadGame();
  initializeLifeXPHistory();
  document.addEventListener('keydown', handleLifeXPKeydown);
  window.addEventListener('popstate', handleLifeXPBack);

  // Quest discovery buttons: explicit listeners avoid issues with inline handlers
  // when the app is served from a PWA cache or a restrictive WebView.
  document.getElementById('btn-show-available-quests')?.addEventListener('click', showAvailableQuests);
  document.getElementById('btn-show-available-quests-empty')?.addEventListener('click', showAvailableQuests);
  
  // Navigation
  document.querySelectorAll('.nav-item').forEach(item => {
    item.addEventListener('click', () => {
      if (typeof hasPendingTaskResult === 'function' && hasPendingTaskResult()) {
        showPendingTaskResult();
        return;
      }
      showScreen(item.dataset.screen);
    });
  });
  
  // Hub buttons
  document.getElementById('btn-random-task').addEventListener('click', openRandomTask);
  
  // Task screen buttons
  document.getElementById('btn-back-hub').addEventListener('click', () => {
    if (typeof hasPendingTaskResult === 'function' && hasPendingTaskResult()) {
      showPendingTaskResult();
      return;
    }
    showScreen('hub');
  });
  document.getElementById('btn-complete').addEventListener('click', completeTask);
  document.getElementById('btn-save-later').addEventListener('click', saveForLater);
  document.getElementById('btn-shuffle').addEventListener('click', shuffleTask);
  
  // Timer
  document.getElementById('timer-toggle').addEventListener('click', toggleTimer);
  document.getElementById('timer-reset').addEventListener('click', resetTimer);
  
  // Completion overlay
  document.getElementById('btn-side-quest-yes').addEventListener('click', () => finalizeCompletion(true));
  document.getElementById('btn-side-quest-no').addEventListener('click', () => finalizeCompletion(false));
  document.getElementById('btn-complete-continue').addEventListener('click', dismissComplete);
  
  // Modal close buttons
  document.querySelectorAll('[data-close-modal]').forEach(btn => {
    btn.addEventListener('click', () => {
      const modalId = btn.dataset.closeModal;
      document.getElementById(modalId)?.classList.remove('show');
    });
  });
  
  // Modal backdrop close
  document.querySelectorAll('.modal-backdrop').forEach(backdrop => {
    backdrop.addEventListener('click', (e) => {
      if (e.target !== backdrop) return;
      if (backdrop.id === 'complete-overlay') {
        closeTaskResultModal({ navigateHistory: true });
      } else {
        backdrop.classList.remove('show');
      }
    });
  });
  
  // Initialize theme
  initTheme();
  
  // Initial render
  renderHub();
  restorePendingTaskResult();
});

window.addEventListener('pageshow', () => {
  if (typeof hasPendingTaskResult === 'function' && hasPendingTaskResult() && !isTaskResultModalVisible()) {
    restorePendingTaskResult();
  }
});

// Service Worker registration and update verification
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    registerAndVerifyLifeXPServiceWorker();
  });
}
