// ===========================================================================
// LifeXP RPG - main.js
// Punto de entrada: event listeners y registro del Service Worker.
// Debe cargarse ULTIMO, despues de todos los demas modulos.
// Depende de: todos los modulos anteriores.
// ===========================================================================

// ===========================================================================
// EVENT LISTENERS
// ===========================================================================

document.addEventListener('DOMContentLoaded', () => {
  // Load game
  loadGame();

  // Emergency save tools also work when the Settings UI is unresponsive.
  handleEmergencyDataRoute();

  // Quest discovery buttons: explicit listeners avoid issues with inline handlers
  // when the app is served from a PWA cache or a restrictive WebView.
  document.getElementById('btn-show-available-quests')?.addEventListener('click', showAvailableQuests);
  document.getElementById('btn-show-available-quests-empty')?.addEventListener('click', showAvailableQuests);
  
  // Navigation
  document.querySelectorAll('.nav-item').forEach(item => {
    item.addEventListener('click', () => {
      showScreen(item.dataset.screen);
    });
  });
  
  // Hub buttons
  document.getElementById('btn-random-task').addEventListener('click', openRandomTask);
  
  // Task screen buttons
  document.getElementById('btn-back-hub').addEventListener('click', () => showScreen('hub'));
  document.getElementById('btn-complete').addEventListener('click', completeTask);
  document.getElementById('btn-save-later').addEventListener('click', saveForLater);
  document.getElementById('btn-shuffle').addEventListener('click', shuffleTask);
  
  // Timer
  document.getElementById('timer-toggle').addEventListener('click', toggleTimer);
  document.getElementById('timer-reset').addEventListener('click', resetTimer);
  
  // Complete overlay
  document.getElementById('btn-side-quest-yes').addEventListener('click', () => {
    document.getElementById('side-quest-prompt').classList.add('hidden');
    finalizeCompletion(true);
  });
  document.getElementById('btn-side-quest-no').addEventListener('click', () => {
    document.getElementById('side-quest-prompt').classList.add('hidden');
    finalizeCompletion(false);
  });
  document.getElementById('btn-complete-continue').addEventListener('click', dismissComplete);
  
  // Modal backdrop close
  document.querySelectorAll('.modal-backdrop').forEach(backdrop => {
    backdrop.addEventListener('click', (e) => {
      if (e.target === backdrop) {
        backdrop.classList.remove('show');
      }
    });
  });
  
  // Check for first time / onboarding
  if (!localStorage.getItem('lifexp_onboarding_done')) {
    showOnboarding();
  }
  
  // Initial render
  renderHub();
});

// PWA Service Worker Registration
// ===========================================================================

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register(`sw.js?build=${LIFE_XP_BUILD}`, { updateViaCache: 'none' }).then(reg => reg.update()).catch(() => {
      console.log('Service worker registration failed (expected in dev)');
    });
  });
}


