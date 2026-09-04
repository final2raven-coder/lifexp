// LifeXP Expansion 1 - Starter tasks
// Integracion: cargar despues de engine.js y antes de loadGame().
// DT-20 fix (2026-07-31): todos los drops.items y sideQuest.drops usan IDs
// canonicos de ITEMS (snake_case). Los nombres de display anteriores
// (Title Case con espacios) fallaban en silencio porque el motor busca
// items por ID, no por nombre.

const EXPANSION_TASKS_V1 = [
  {
    id: 'casa_exp_01', cat: 'casa', name: 'Organize the pantry by zones', freq: 'monthly',
    desc: 'Review supplies, group foods, and keep items that expire soonest in view.',
    stats: { vol: 60, int: 40 }, xp: 35,
    drops: { theme: 'hallazgos', items: ['moneda_antigua', 'objeto_olvidado'] },
    sideQuest: { desc: 'Note what is missing and prepare a restocking list.', stats: { int: 8, vol: 6 }, xp: 15, drops: ['llave_cofre'], dropBonus: 10 }
  },
  {
    id: 'casa_exp_02', cat: 'casa', name: 'Clean the windows in one area', freq: 'monthly',
    desc: 'Clean the glass and frames in one specific room or area.',
    stats: { vit: 50, des: 30, vol: 20 }, xp: 30,
    drops: { theme: 'sol_viento', items: ['fragmento_solar', 'pluma_viento'] },
    sideQuest: { desc: 'Also clean the tracks and check the latches.', stats: { des: 6, vol: 5 }, xp: 12, drops: ['cristal_solar'], dropBonus: 10 }
  },
  {
    id: 'casa_exp_03', cat: 'casa', name: 'Check the first-aid kit and expiry dates', freq: 'quarterly',
    desc: 'Check medicines, medical supplies, and expiry dates.',
    stats: { int: 60, vol: 40 }, xp: 35,
    drops: { theme: 'agua_quimicos', items: ['antidoto', 'frasco_vacio'] },
    sideQuest: { desc: 'Replace expired items and leave an emergency list.', stats: { int: 8, vol: 6 }, xp: 15, drops: ['pocion_vida_menor'], dropBonus: 12 }
  },
  {
    id: 'cuerpo_exp_01', cat: 'cuerpo', name: 'Recovery walk', freq: 'weekly',
    desc: 'Walk at an easy pace for at least 25 minutes.',
    stats: { vit: 45, des: 35, vol: 20 }, xp: 25,
    drops: { theme: 'exploracion', items: ['caparazon', 'mapa_tesoro'] },
    sideQuest: { desc: 'Take a different route or walk for 15 additional minutes.', stats: { vit: 8, des: 7 }, xp: 12, drops: ['amuleto_brisa'], dropBonus: 10 }
  },
  {
    id: 'cuerpo_exp_02', cat: 'cuerpo', name: 'Joint mobility routine', freq: 'weekly',
    desc: 'Work on neck, shoulder, hip, and ankle mobility without pain.',
    stats: { des: 45, vit: 30, vol: 25 }, xp: 25,
    drops: null,
    sideQuest: { desc: 'Note which area felt most limited and gently repeat that work.', stats: { des: 8, vol: 6 }, xp: 12, drops: null, dropBonus: 0 }
  },
  {
    id: 'cuerpo_exp_03', cat: 'cuerpo', name: 'Prepare a balanced meal', freq: 'weekly',
    desc: 'Prepare a complete meal with protein, vegetables, and a source of energy.',
    stats: { vit: 35, int: 35, vol: 30 }, xp: 30,
    drops: { theme: 'fuego_comida', items: ['racion_combate', 'especia_rara'] },
    sideQuest: { desc: 'Leave one portion prepared for another time.', stats: { vit: 7, int: 7 }, xp: 15, drops: ['semilla_rara'], dropBonus: 12 }
  },
  {
    id: 'gestiones_exp_01', cat: 'gestiones', name: 'Review the week\'s expenses', freq: 'weekly',
    desc: 'Review recent transactions and identify one expense that needs action.',
    stats: { int: 55, vol: 45 }, xp: 25,
    drops: { theme: 'comercio', items: ['moneda_oro', 'pagina_arcana'] },
    sideQuest: { desc: 'Write down one simple rule to improve next week.', stats: { int: 8, vol: 7 }, xp: 12, drops: ['contrato_mercantil'], dropBonus: 10 }
  },
  {
    id: 'gestiones_exp_02', cat: 'gestiones', name: 'Organize a digital folder', freq: 'monthly',
    desc: 'Choose a folder, remove duplicates, and leave a clear structure.',
    stats: { int: 65, vol: 35 }, xp: 30,
    drops: { theme: 'conocimiento', items: ['cristal_solar', 'pagina_arcana'] },
    sideQuest: { desc: 'Create a naming convention to prevent the chaos from returning.', stats: { int: 10, vol: 5 }, xp: 15, drops: ['grimorio_antiguo'], dropBonus: 12 }
  },
  {
    id: 'gestiones_exp_03', cat: 'gestiones', name: 'Review upcoming renewals', freq: 'monthly',
    desc: 'Check subscriptions, documents, and payments that will expire soon.',
    stats: { int: 55, vol: 45 }, xp: 30,
    drops: { theme: 'oro_comercio', items: ['moneda_oro', 'contrato_mercantil'] },
    sideQuest: { desc: 'Cancel an unnecessary renewal or set a reminder.', stats: { int: 7, vol: 8 }, xp: 15, drops: ['sello_alianza'], dropBonus: 12 }
  },
  {
    id: 'social_exp_01', cat: 'social', name: 'Suggest a concrete plan', freq: 'monthly',
    desc: 'Write to someone and suggest a specific day, time, and activity.',
    stats: { pre: 55, vol: 30, int: 15 }, xp: 30,
    drops: { theme: 'alianzas', items: ['sello_alianza', 'pagina_arcana'] },
    sideQuest: { desc: 'Take responsibility for coordinating the details.', stats: { pre: 8, int: 6 }, xp: 15, drops: ['sello_alianza'], dropBonus: 12 }
  },
  {
    id: 'social_exp_02', cat: 'social', name: 'Ask and listen without multitasking', freq: 'weekly',
    desc: 'Have a quality conversation while giving it your full attention.',
    stats: { pre: 45, vol: 35, int: 20 }, xp: 25,
    drops: { theme: 'alianzas', items: ['token_amistad', 'hidromiel'] },
    sideQuest: { desc: 'Remember an important detail and bring it up again later.', stats: { pre: 7, int: 6 }, xp: 12, drops: ['sello_alianza'], dropBonus: 10 }
  },
  {
    id: 'personal_exp_01', cat: 'personal', name: '45-minute project block', freq: 'weekly',
    desc: 'Work without interruptions on one concrete task in a personal project.',
    stats: { int: 50, vol: 40, des: 10 }, xp: 35,
    drops: { theme: 'creacion', items: ['dado_destino', 'pagina_arcana'] },
    sideQuest: { desc: 'Finish a piece that can be marked as complete.', stats: { int: 10, vol: 8 }, xp: 18, drops: ['grimorio_antiguo'], dropBonus: 15 }
  },
  {
    id: 'personal_exp_02', cat: 'personal', name: 'Chinese conversation practice', freq: 'weekly',
    desc: 'Speak in Chinese for at least 15 minutes, with a person or a tool.',
    stats: { int: 45, vol: 45, pre: 10 }, xp: 35,
    drops: { theme: 'oriente', items: ['talisman_oriental', 'cuentas_jade'] },
    sideQuest: { desc: 'Prepare and use five new phrases.', stats: { int: 10, vol: 8 }, xp: 18, drops: ['pagina_arcana'], dropBonus: 15 }
  },
  {
    id: 'personal_exp_03', cat: 'personal', name: 'Monthly goals review', freq: 'monthly',
    desc: 'Review what you want to maintain, start, and stop during the next month.',
    stats: { int: 55, vol: 35, pre: 10 }, xp: 35,
    drops: { theme: 'destino', items: ['esencia_oscura', 'orbe_mental'] },
    sideQuest: { desc: 'Turn one goal into an action with a specific date.', stats: { int: 10, vol: 8 }, xp: 18, drops: ['esencia_oscura'], dropBonus: 15 }
  }
];

function installExpansionTasks() {
  if (installExpansionTasks._installed) return;
  installExpansionTasks._installed = true;
  const existing = new Set(DEFAULT_TASKS.map(t => t.id));
  for (const task of EXPANSION_TASKS_V1) if (!existing.has(task.id)) DEFAULT_TASKS.push(task);
  if (typeof gameState !== 'undefined' && gameState.tasks && gameState.tasks.length > 0) {
    const active = new Set(gameState.tasks.map(t => t.id));
    for (const task of EXPANSION_TASKS_V1) if (!active.has(task.id)) gameState.tasks.push(JSON.parse(JSON.stringify(task)));
  }
}
