// ===========================================================================
// LifeXP RPG - ui_feedback.js
// Toast, flavor dialog, level-up, haptic y onboarding.
// Depende de: engine.js.
// ===========================================================================


// ===========================================================================
// UI POLISH: TOAST, ONBOARDING, FEEDBACK
// ===========================================================================

let toastTimeout = null;

function showFlavorDialog(message, type = 'default') {
  if (!message) return;
  var existing = document.querySelector('.flavor-dialog');
  if (existing) existing.remove();

  var dialog = document.createElement('section');
  dialog.className = 'flavor-dialog ' + type;
  dialog.setAttribute('role', 'dialog');
  dialog.setAttribute('aria-label', 'Descubrimiento de objeto');
  dialog.innerHTML = '<div class="flavor-dialog-text"></div>' +
    '<button class="btn btn-ghost flavor-dialog-dismiss" type="button">Continuar</button>';
  dialog.querySelector('.flavor-dialog-text').textContent = message;
  document.body.appendChild(dialog);

  var dismiss = function() {
    dialog.remove();
    document.removeEventListener('keydown', onKey);
  };
  var onKey = function(event) {
    if (event.key === 'Escape' || event.key === 'Enter') dismiss();
  };
  dialog.querySelector('.flavor-dialog-dismiss').addEventListener('click', dismiss);
  document.addEventListener('keydown', onKey);
  dialog.querySelector('.flavor-dialog-dismiss').focus();
}

function showToast(message, type = 'default') {
  // Remove existing toast
  const existing = document.querySelector('.toast');
  if (existing) existing.remove();
  
  // Create toast
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.textContent = message;
  document.body.appendChild(toast);
  
  // Show
  requestAnimationFrame(() => {
    toast.classList.add('show');
  });
  
  // Auto hide
  clearTimeout(toastTimeout);
  toastTimeout = setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => toast.remove(), 300);
  }, 2500);
}

function showLevelUpEffect() {
  const effect = document.createElement('div');
  effect.className = 'level-up-effect';
  document.body.appendChild(effect);
  
  setTimeout(() => effect.remove(), 1000);
}

function triggerHaptic() {
  // Try vibration API if available
  if (navigator.vibrate) {
    navigator.vibrate(50);
  }
}

// Onboarding
const onboardingSteps = [
  {
    icon: '⚔️',
    title: 'Bienvenido a LifeXP',
    text: 'Un RPG donde progresas completando tareas de la vida real. Sube de nivel, consigue loot, y derrota enemigos.'
  },
  {
    icon: '\uD83D\uDCCB',
    title: 'Sistema de Tareas',
    text: 'Cada día recibirás tareas aleatorias de tus categorías (Casa, Cuerpo, Gestiones, Social, Personal). Completa la tarea en la vida real y márcala como hecha.'
  },
  {
    icon: '⚡',
    title: 'Overflow',
    text: 'Las tareas atrasadas entran en "overflow" y dan +50% XP. Tienen prioridad, así que intenta mantenerlas al día.'
  },
  {
    icon: '\uD83C\uDFB2',
    title: 'Drops y Combate',
    text: 'Al completar tareas puedes conseguir items y encontrar enemigos. El combate puede ser automático o táctico según la dificultad.'
  },
  {
    icon: '\uD83C\uDFF0',
    title: '¡A jugar!',
    text: 'Pulsa el botón central para recibir tu primera tarea. ¡Buena suerte, aventurero!'
  }
];

let currentOnboardingStep = 0;

function showOnboarding() {
  currentOnboardingStep = 0;
  renderOnboardingStep();
}

function renderOnboardingStep() {
  const step = onboardingSteps[currentOnboardingStep];
  
  // Remove existing
  const existing = document.querySelector('.onboarding-overlay');
  if (existing) existing.remove();
  
  // Create overlay
  const overlay = document.createElement('div');
  overlay.className = 'onboarding-overlay';
  
  // Dots
  let dotsHtml = '';
  for (let i = 0; i < onboardingSteps.length; i++) {
    dotsHtml += `<div class="onboarding-dot ${i === currentOnboardingStep ? 'active' : ''}"></div>`;
  }
  
  overlay.innerHTML = `
    <div class="onboarding-step">
      <div class="onboarding-icon">${step.icon}</div>
      <div class="onboarding-title">${step.title}</div>
      <div class="onboarding-text">${step.text}</div>
      <div class="onboarding-dots">${dotsHtml}</div>
      <button class="btn btn-gold" onclick="nextOnboardingStep()">${currentOnboardingStep < onboardingSteps.length - 1 ? 'Siguiente' : '¡Empezar!'}</button>
      ${currentOnboardingStep > 0 ? '<button class="btn btn-ghost" style="margin-top: 8px;" onclick="prevOnboardingStep()">Atrás</button>' : ''}
    </div>
  `;
  
  document.body.appendChild(overlay);
}

function nextOnboardingStep() {
  currentOnboardingStep++;
  if (currentOnboardingStep >= onboardingSteps.length) {
    finishOnboarding();
  } else {
    renderOnboardingStep();
  }
}

function prevOnboardingStep() {
  if (currentOnboardingStep > 0) {
    currentOnboardingStep--;
    renderOnboardingStep();
  }
}

function finishOnboarding() {
  localStorage.setItem('lifexp_onboarding_done', 'true');
  const overlay = document.querySelector('.onboarding-overlay');
  if (overlay) {
    overlay.style.opacity = '0';
    setTimeout(() => overlay.remove(), 300);
  }
  showToast('¡Bienvenido, aventurero!', 'gold');
}

function skipOnboarding() {
  finishOnboarding();
}

// ===========================================================================
// QUESTS RENDERING
