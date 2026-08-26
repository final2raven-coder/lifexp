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
  dialog.setAttribute('aria-label', 'Item discovery');
  dialog.innerHTML = '<div class="flavor-dialog-text"></div>' +
    '<button class="btn btn-ghost flavor-dialog-dismiss" type="button">Continue</button>';
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
    iconRef: 'ui.sword',
    title: 'Welcome to LifeXP',
    text: 'An RPG where you progress by completing real-life tasks. Level up, collect loot, and defeat enemies.'
  },
  {
    iconRef: 'ui.tasks',
    title: 'Task System',
    text: 'Each day, you receive random tasks from your categories (Home, Body, Errands, Social, Personal). Complete the task in real life and mark it as done.'
  },
  {
    iconRef: 'world.lightning',
    title: 'Overflow',
    text: 'Overdue tasks enter "overflow" and grant +50% XP. They have priority, so try to keep up with them.'
  },
  {
    iconRef: 'world.dice',
    title: 'Drops and Combat',
    text: 'Completing tasks can earn you items and trigger encounters. Combat can be automatic or tactical depending on difficulty.'
  },
  {
    iconRef: 'world.castle',
    title: "Let's play!",
    text: 'Press the central button to get your first task. Good luck, adventurer!'
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
      <div class="onboarding-icon">${LifeXPIcons.renderUI(step.iconRef, { size: 80 })}</div>
      <div class="onboarding-title">${step.title}</div>
      <div class="onboarding-text">${step.text}</div>
      <div class="onboarding-dots">${dotsHtml}</div>
      <button class="btn btn-gold" onclick="nextOnboardingStep()">${currentOnboardingStep < onboardingSteps.length - 1 ? 'Next' : 'Start playing!'}</button>
      ${currentOnboardingStep > 0 ? '<button class="btn btn-ghost" style="margin-top: 8px;" onclick="prevOnboardingStep()">Back</button>' : ''}
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
  showToast('Welcome, adventurer!', 'gold');
}

function skipOnboarding() {
  finishOnboarding();
}

// ===========================================================================
// QUESTS RENDERING
