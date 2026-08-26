// ===========================================================================
// LifeXP RPG - ui_feedback.js
// Toasts, level-up effects, haptic feedback, onboarding.
// ===========================================================================

// ===========================================================================
// TOASTS
// ===========================================================================

let toastTimeout = null;

function showFlavorDialog(message, type = 'default') {
  const existing = document.querySelector('.flavor-dialog');
  if (existing) existing.remove();
  
  const dialog = document.createElement('div');
  dialog.className = `flavor-dialog flavor-${type}`;
  dialog.innerHTML = `
    <div class="flavor-dialog-content">
      <div class="flavor-dialog-message">${message}</div>
      <button class="flavor-dialog-close" onclick="this.closest('.flavor-dialog').remove()">OK</button>
    </div>
  `;
  document.body.appendChild(dialog);
  
  // Auto-remove after 8 seconds
  setTimeout(() => {
    if (dialog.parentNode) dialog.remove();
  }, 8000);
}

function showToast(message, type = 'default') {
  const container = document.getElementById('toast-container');
  if (!container) return;
  
  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.textContent = message;
  
  container.appendChild(toast);
  
  // Trigger animation
  requestAnimationFrame(() => toast.classList.add('show'));
  
  // Remove after 3 seconds
  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => toast.remove(), 300);
  }, 3000);
}

// ===========================================================================
// LEVEL UP EFFECT
// ===========================================================================

function showLevelUpEffect() {
  const effect = document.createElement('div');
  effect.className = 'level-up-effect';
  effect.innerHTML = `
    <div class="level-up-content">
      <div class="level-up-title">LEVEL UP!</div>
      <div class="level-up-sparkle">✨</div>
    </div>
  `;
  document.body.appendChild(effect);
  
  setTimeout(() => effect.classList.add('show'), 50);
  setTimeout(() => effect.remove(), 2500);
}

// ===========================================================================
// HAPTIC FEEDBACK
// ===========================================================================

function triggerHaptic() {
  if (navigator.vibrate) {
    navigator.vibrate(50);
  }
}

// ===========================================================================
// ONBOARDING
// ===========================================================================

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
  const overlay = document.createElement('div');
  overlay.id = 'onboarding-overlay';
  overlay.className = 'modal-overlay';
  overlay.innerHTML = '<div class="onboarding-modal" id="onboarding-modal"></div>';
  document.body.appendChild(overlay);
  renderOnboardingStep();
}

function renderOnboardingStep() {
  const modal = document.getElementById('onboarding-modal');
  if (!modal) return;
  
  const step = onboardingSteps[currentOnboardingStep];
  const isFirst = currentOnboardingStep === 0;
  const isLast = currentOnboardingStep === onboardingSteps.length - 1;
  
  const dotsHtml = onboardingSteps.map((_, i) =>
    `<span class="onboarding-dot ${i === currentOnboardingStep ? 'active' : ''}"></span>`
  ).join('');
  
  modal.innerHTML = `
    <div class="onboarding-step">
      <div class="onboarding-icon">${LifeXPIcons.renderUI(step.iconRef, { size: 80 })}</div>
      <div class="onboarding-title">${step.title}</div>
      <div class="onboarding-text">${step.text}</div>
      <div class="onboarding-dots">${dotsHtml}</div>
      <div class="onboarding-buttons">
        ${!isFirst ? '<button class="btn btn-ghost" onclick="prevOnboardingStep()">Back</button>' : '<div></div>'}
        ${isLast
          ? '<button class="btn btn-gold" onclick="finishOnboarding()">Start playing</button>'
          : '<button class="btn btn-primary" onclick="nextOnboardingStep()">Next</button>'}
      </div>
      <button class="onboarding-skip" onclick="skipOnboarding()">Skip</button>
    </div>
  `;
}

function nextOnboardingStep() {
  if (currentOnboardingStep < onboardingSteps.length - 1) {
    currentOnboardingStep++;
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
  document.getElementById('onboarding-overlay')?.remove();
}

function skipOnboarding() {
  localStorage.setItem('lifexp_onboarding_done', 'true');
  document.getElementById('onboarding-overlay')?.remove();
}
