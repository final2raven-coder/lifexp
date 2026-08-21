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

// EVENT LISTENERS
// ===========================================================================

document.addEventListener('DOMContentLoaded', () => {
  // Load game
  loadGame();
  initializeLifeXPHistory();
  document.addEventListener('keydown', handleLifeXPKeydown);
  window.addEventListener('popstate', handleLifeXPBack);

  // Emergency save tools also work when the Settings UI is unresponsive.
  handleEmergencyDataRoute();

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

// Service Worker registration
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('./sw.js').catch(() => {});
  });
}