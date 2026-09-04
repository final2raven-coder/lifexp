// ===========================================================================
// LifeXP RPG - data_tasks.js
// Modulo de datos puros: constantes globales y DEFAULT_TASKS.
// Sin dependencias. Debe cargarse antes que engine.js y expansions.
// ===========================================================================

const LIFE_XP_BUILD = 'v13.4-equip-action-fix';

// ===========================================================================
// CONSTANTS
// ===========================================================================

const CATEGORIES = {
  casa: { name: 'House', icon: '\uD83C\uDFE0', color: '#f87171' },
  cuerpo: { name: 'Body', icon: '\uD83D\uDCAA', color: '#4ade80' },
  gestiones: { name: 'Admin', icon: '\uD83D\uDCCB', color: '#fbbf24' },
  social: { name: 'Social', icon: '\uD83D\uDC65', color: '#60a5fa' },
  personal: { name: 'Personal', icon: '\uD83C\uDF1F', color: '#a78bfa' }
};

const STATS = {
  fue: { name: 'Strength', abbr: 'FUE', color: '#ef4444' },
  vit: { name: 'Vitality', abbr: 'VIT', color: '#22c55e' },
  des: { name: 'Dexterity', abbr: 'DES', color: '#3b82f6' },
  int: { name: 'Intellect', abbr: 'INT', color: '#a855f7' },
  vol: { name: 'Willpower', abbr: 'VOL', color: '#f59e0b' },
  pre: { name: 'Presence', abbr: 'PRE', color: '#ec4899' }
};

const FREQ = {
  daily: {
    name: 'Daily',
    days: 1,
    availability: { type: 'periodic', intervalDays: 1, limit: 1, repeatable: true }
  },
  weekly: {
    name: 'Weekly',
    days: 7,
    availability: { type: 'periodic', intervalDays: 7, limit: 1, repeatable: true }
  },
  biweekly: {
    name: 'Every two weeks',
    days: 14,
    availability: { type: 'periodic', intervalDays: 14, limit: 1, repeatable: true }
  },
  monthly: {
    name: 'Monthly',
    days: 30,
    availability: { type: 'periodic', intervalDays: 30, limit: 1, repeatable: true }
  },
  quarterly: {
    name: 'Quarterly',
    days: 90,
    availability: { type: 'periodic', intervalDays: 90, limit: 1, repeatable: true }
  },
  biannual: {
    name: 'Twice a year',
    days: 180,
    availability: { type: 'periodic', intervalDays: 180, limit: 1, repeatable: true }
  },
  annual: {
    name: 'Yearly',
    days: 365,
    availability: { type: 'periodic', intervalDays: 365, limit: 1, repeatable: true }
  },
  once: {
    name: 'Once',
    days: null,
    availability: { type: 'once', intervalDays: null, limit: 1, repeatable: false }
  }
};

// ===========================================================================
// DEFAULT TASKS (with side quests and drops)
// ===========================================================================

const DEFAULT_TASKS = [
  // ========== CASA ==========
  {
    id: 'casa_1', cat: 'casa', name: 'Deep-clean the bathroom', freq: 'weekly',
    desc: 'Start with the mirror, continue with the fixtures, and finish with the floor.',
    stats: { vit: 40, vol: 60 }, xp: 45,
    drops: { theme: 'agua_quimicos', items: ['pocion_agua_menor', 'veneno_basico', 'frasco_vacio'] },
    sideQuest: {
      desc: 'Also clean the shower tiles and organize the products under the sink.',
      stats: { vol: 8, int: 4 }, xp: 20,
      drops: ['esencia_purificadora', 'cristal_limpieza'],
      dropBonus: 15
    }
  },
  {
    id: 'casa_2', cat: 'casa', name: 'Vacuum the dining room', freq: 'weekly',
    desc: 'Vacuum the entire dining-room floor, including under accessible furniture.',
    stats: { vit: 50, vol: 50 }, xp: 30,
    drops: { theme: 'hallazgos', items: ['moneda_antigua', 'objeto_olvidado'] },
    sideQuest: {
      desc: 'Move all furniture and vacuum behind it too.',
      stats: { vit: 10, vol: 5 }, xp: 15,
      drops: ['bolsa_oro_grande'],
      dropBonus: 20
    }
  },
  {
    id: 'casa_3', cat: 'casa', name: 'Mop the floors', freq: 'weekly',
    desc: 'Mop the floors in the main areas of the house.',
    stats: { vit: 50, vol: 50 }, xp: 30,
    drops: { theme: 'agua', items: ['gota_agua_pura'] },
    sideQuest: {
      desc: 'Use a special cleaning product and mop the difficult corners too.',
      stats: { vol: 8, vit: 4 }, xp: 12,
      drops: ['esencia_limpieza'],
      dropBonus: 10
    }
  },
  {
    id: 'casa_4', cat: 'casa', name: 'Deep-clean the kitchen', freq: 'weekly',
    desc: 'Countertops, hob, sink, and the outside of appliances.',
    stats: { vit: 40, vol: 60 }, xp: 50,
    drops: { theme: 'fuego', items: ['grasa_fuego', 'espatula_encantada'] },
    sideQuest: {
      desc: 'Also clean the inside of the microwave and the outside of the oven.',
      stats: { vol: 10, vit: 5 }, xp: 20,
      drops: ['llama_culinaria'],
      dropBonus: 15
    }
  },
  {
    id: 'casa_5', cat: 'casa', name: 'Run a load of laundry', freq: 'weekly',
    desc: 'Gather dirty clothes, sort them if needed, and run a load of laundry.',
    stats: { vit: 80, vol: 20 }, xp: 15,
    drops: null,
    sideQuest: {
      desc: 'Sort the clothes by colour and run two loads.',
      stats: { vol: 5, vit: 5 }, xp: 10,
      drops: null,
      dropBonus: 0
    }
  },
  {
    id: 'casa_6', cat: 'casa', name: 'Hang out the laundry', freq: 'weekly',
    desc: 'Take the clothes out of the washing machine and hang them to dry.',
    stats: { vit: 60, vol: 40 }, xp: 15,
    drops: { theme: 'sol_viento', items: ['fragmento_solar', 'pluma_viento'] },
    sideQuest: {
      desc: 'Hang each garment carefully to minimize wrinkles.',
      stats: { vol: 5, des: 3 }, xp: 8,
      drops: ['brisa_atrapada'],
      dropBonus: 10
    }
  },
  {
    id: 'casa_7', cat: 'casa', name: 'Fold and put away laundry', freq: 'weekly',
    desc: 'Bring in the dry clothes, fold them, and put them away.',
    stats: { vol: 50, vit: 50 }, xp: 15,
    drops: null,
    sideQuest: {
      desc: 'Use the KonMari method and organize by colour.',
      stats: { int: 5, vol: 5 }, xp: 10,
      drops: null,
      dropBonus: 0
    }
  },
  {
    id: 'casa_8', cat: 'casa', name: 'Change the sheets and pillowcases', freq: 'biweekly',
    desc: 'Remove the sheets, put on clean ones, and change the pillowcases.',
    stats: { vit: 50, vol: 50 }, xp: 30,
    drops: { theme: 'descanso', items: ['pluma_sueno', 'esencia_descanso'] },
    sideQuest: {
      desc: 'Rotate the mattress and clean the bed base.',
      stats: { vit: 10, vol: 5 }, xp: 15,
      drops: ['bendicion_descanso'],
      dropBonus: 15
    }
  },
  {
    id: 'casa_9', cat: 'casa', name: 'Organize the wardrobe', freq: 'monthly',
    desc: 'Reorganize your clothes, review what you no longer need, and make sure everything has a place.',
    stats: { vol: 70, int: 30 }, xp: 50,
    drops: { theme: 'hallazgos', items: ['prenda_olvidada', 'moneda_antigua'] },
    sideQuest: {
      desc: 'Do a serious clear-out: donate anything you have not used in a year.',
      stats: { vol: 15, int: 10 }, xp: 25,
      drops: ['amuleto_explorador'],
      dropBonus: 20
    }
  },
  {
    id: 'casa_10', cat: 'casa', name: 'Clean the upper terrace', freq: 'monthly',
    desc: 'Sweep and mop the floor, clean the railing, and check the clothesline.',
    stats: { vit: 60, vol: 40 }, xp: 30,
    drops: { theme: 'sol_viento', items: ['cristal_solar', 'pluma_viento'] },
    sideQuest: {
      desc: 'Also clean the windows and the plant pots.',
      stats: { vit: 8, vol: 5 }, xp: 12,
      drops: ['luz_atrapada'],
      dropBonus: 15
    }
  },
  {
    id: 'casa_11', cat: 'casa', name: 'Weekly batch cooking', freq: 'weekly',
    desc: 'Cook several meals for the week in one session.',
    stats: { vol: 30, int: 40, vit: 30 }, xp: 50,
    drops: { theme: 'fuego_comida', items: ['racion_serena', 'gema_fuego_menor', 'receta_secreta'] },
    sideQuest: {
      desc: 'Prepare 5+ different meals and freeze extra portions.',
      stats: { int: 15, vol: 10 }, xp: 25,
      drops: ['receta_secreta', 'racion_serena'],
      dropBonus: 20
    }
  },
  {
    id: 'casa_12', cat: 'casa', name: 'Grocery shopping', freq: 'weekly',
    desc: 'Go to the supermarket with a prepared list.',
    stats: { vol: 30, int: 30, pre: 40 }, xp: 30,
    drops: { theme: 'comercio', items: ['bolsa_oro_grande', 'ingrediente_especial'] },
    sideQuest: {
      desc: 'Compare prices and find at least 3 deals.',
      stats: { int: 10, pre: 5 }, xp: 15,
      drops: ['ojo_comerciante'],
      dropBonus: 15
    }
  },
  {
    id: 'casa_13', cat: 'casa', name: 'Clean the bedroom', freq: 'weekly',
    desc: 'Make the bed thoroughly, dust, and tidy the bedside tables.',
    stats: { vit: 50, vol: 50 }, xp: 30,
    drops: { theme: 'descanso', items: ['polvo_sueno'] },
    sideQuest: {
      desc: 'Reorganize the drawers and clean under the bed.',
      stats: { vol: 8, vit: 5 }, xp: 12,
      drops: ['cristal_tranquilidad'],
      dropBonus: 10
    }
  },
  {
    id: 'casa_14', cat: 'casa', name: 'Care for the plants', freq: 'weekly',
    desc: 'Water the plants, check their condition, and prune them if needed.',
    stats: { vol: 30, vit: 40, pre: 30 }, xp: 20,
    drops: { theme: 'naturaleza', items: ['hoja_calma', 'rocio_matutino', 'rocio_matutino'] },
    sideQuest: {
      desc: 'Repot a plant or add fertilizer to all of them.',
      stats: { vit: 8, int: 5 }, xp: 15,
      drops: ['espiritu_jardin', 'flor_luminosa'],
      dropBonus: 20
    }
  },
  {
    id: 'casa_15', cat: 'casa', name: 'Deep-clean the fridge', freq: 'monthly',
    desc: 'Empty the fridge, clean the shelves, check expiry dates, and reorganize it.',
    stats: { vit: 40, vol: 60 }, xp: 40,
    drops: { theme: 'hielo', items: ['escarcha_eterna', 'escarcha_eterna'] },
    sideQuest: {
      desc: 'Also clean the freezer and defrost it if needed.',
      stats: { vit: 10, vol: 10 }, xp: 20,
      drops: ['cristal_hielo_puro'],
      dropBonus: 15
    }
  },

  // ========== CUERPO ==========
  {
    id: 'cuerpo_1', cat: 'cuerpo', name: 'Strength training', freq: 'weekly',
    desc: 'At-home strength session: squats, push-ups, planks, and bodyweight exercises.',
    stats: { fue: 50, vit: 30, vol: 20 }, xp: 50,
    drops: null, // Solo stats
    sideQuest: {
      desc: 'Add a new exercise or do 15 extra minutes.',
      stats: { fue: 15, vol: 10 }, xp: 25,
      drops: null,
      dropBonus: 0
    }
  },
  {
    id: 'cuerpo_2', cat: 'cuerpo', name: 'At-home cardio', freq: 'weekly',
    desc: 'Cardio session without going out: jumping jacks, burpees, dancing...',
    stats: { vit: 40, des: 30, vol: 30 }, xp: 30,
    drops: null,
    sideQuest: {
      desc: 'Do 10 more minutes or try a new routine.',
      stats: { vit: 10, des: 8 }, xp: 15,
      drops: null,
      dropBonus: 0
    }
  },
  {
    id: 'cuerpo_3', cat: 'cuerpo', name: 'Go for a run or walk', freq: 'weekly',
    desc: 'Outdoor aerobic exercise: running, brisk walking, or a combination.',
    stats: { vit: 40, des: 40, vol: 20 }, xp: 30,
    drops: { theme: 'exploracion', items: ['mapa_zona', 'piedra_camino', 'bolsa_oro_grande'] },
    sideQuest: {
      desc: 'Go more than 5 km or explore a new route.',
      stats: { vit: 12, des: 10 }, xp: 20,
      drops: ['botas_sendero', 'amuleto_explorador'],
      dropBonus: 25
    }
  },
  {
    id: 'cuerpo_4', cat: 'cuerpo', name: 'Stretching', freq: 'weekly',
    desc: 'Stretching or mobility session to maintain flexibility.',
    stats: { des: 50, vit: 30, vol: 20 }, xp: 20,
    drops: null,
    sideQuest: {
      desc: 'Do a complete yoga routine of 30+ minutes.',
      stats: { des: 15, vol: 10 }, xp: 15,
      drops: null,
      dropBonus: 0
    }
  },
  {
    id: 'cuerpo_5', cat: 'cuerpo', name: 'Meditation', freq: 'weekly',
    desc: 'Meditation session of at least 10 minutes.',
    stats: { vol: 50, int: 50 }, xp: 25,
    drops: { theme: 'mente', items: ['orbe_claridad', 'incienso_mistico'] },
    sideQuest: {
      desc: 'Meditate for 20+ minutes or try a new technique.',
      stats: { vol: 15, int: 10 }, xp: 15,
      drops: ['foco_interior', 'mente_cristal'],
      dropBonus: 20
    }
  },
  {
    id: 'cuerpo_6', cat: 'cuerpo', name: 'Swimming', freq: 'monthly',
    desc: 'Swimming session at a pool.',
    stats: { vit: 35, des: 30, fue: 25, vol: 10 }, xp: 50,
    drops: { theme: 'agua_profunda', items: ['coral_magico', 'escama_brillante', 'coral_magico'] },
    sideQuest: {
      desc: 'Swim more than 1 km or practice a new stroke.',
      stats: { vit: 15, des: 10 }, xp: 25,
      drops: ['tridente_menor', 'bendicion_mar'],
      dropBonus: 25
    }
  },
  {
    id: 'cuerpo_7', cat: 'cuerpo', name: 'Personal care routine', freq: 'weekly',
    desc: 'Skin, hair, or nail care - whatever is needed.',
    stats: { pre: 50, vol: 30, vit: 20 }, xp: 15,
    drops: null,
    sideQuest: {
      desc: 'Do a complete routine with a mask or special treatment.',
      stats: { pre: 10, vol: 5 }, xp: 10,
      drops: null,
      dropBonus: 0
    }
  },

  // ========== GESTIONES ==========
  {
    id: 'gestiones_1', cat: 'gestiones', name: 'File your tax return', freq: 'annual',
    desc: 'File your annual income-tax return.',
    stats: { int: 40, vol: 60 }, xp: 100,
    drops: { theme: 'oro', items: ['bolsa_oro_grande', 'lingote_oro'] },
    sideQuest: {
      desc: 'Review every possible deduction and optimize your return.',
      stats: { int: 20, vol: 15 }, xp: 50,
      drops: ['sabiduria_fiscal', 'corona_contribuyente'],
      dropBonus: 30
    }
  },
  {
    id: 'gestiones_2', cat: 'gestiones', name: 'Review finances and budget', freq: 'monthly',
    desc: 'Review expenses and income, then adjust the budget.',
    stats: { int: 50, vol: 50 }, xp: 35,
    drops: { theme: 'oro', items: ['bolsa_oro_grande', 'gema_menor'] },
    sideQuest: {
      desc: 'Create a new savings or investment plan.',
      stats: { int: 15, vol: 10 }, xp: 20,
      drops: ['ojo_comerciante'],
      dropBonus: 15
    }
  },
  {
    id: 'gestiones_3', cat: 'gestiones', name: 'Back up data', freq: 'monthly',
    desc: 'Back up photos, important documents, and other data.',
    stats: { int: 60, vol: 40 }, xp: 25,
    drops: { theme: 'conocimiento', items: ['cristal_memoria', 'pergamino_blanco'] },
    sideQuest: {
      desc: 'Organize the files and remove duplicates.',
      stats: { int: 12, vol: 8 }, xp: 15,
      drops: ['biblioteca_personal'],
      dropBonus: 10
    }
  },
  {
    id: 'gestiones_4', cat: 'gestiones', name: 'Clear your inbox', freq: 'weekly',
    desc: 'Process pending emails, archive messages, and delete spam.',
    stats: { vol: 60, int: 40 }, xp: 20,
    drops: { theme: 'comercio', items: ['mensaje_importante', 'llave_olvidada'] },
    sideQuest: {
      desc: 'Reach inbox zero and configure new filters.',
      stats: { int: 10, vol: 8 }, xp: 12,
      drops: ['sello_eficiencia'],
      dropBonus: 10
    }
  },
  {
    id: 'gestiones_5', cat: 'gestiones', name: 'Plan the week', freq: 'weekly',
    desc: 'Review the calendar, prioritize tasks, and plan the week.',
    stats: { int: 50, vol: 50 }, xp: 25,
    drops: { theme: 'conocimiento', items: ['pergamino_planificacion'] },
    sideQuest: {
      desc: 'Define clear goals and time blocks.',
      stats: { int: 10, vol: 10 }, xp: 15,
      drops: ['agenda_encantada'],
      dropBonus: 15
    }
  },

  // ========== SOCIAL ==========
  {
    id: 'social_1', cat: 'social', name: 'Special date with your partner', freq: 'weekly',
    desc: 'Quality time dedicated solely to the relationship.',
    stats: { pre: 40, vit: 30, vol: 30 }, xp: 50,
    drops: { theme: 'vinculo', items: ['recuerdo_especial', 'lazo_conexion'] },
    sideQuest: {
      desc: 'Plan something new or surprise your partner with a thoughtful detail.',
      stats: { pre: 15, int: 10 }, xp: 25,
      drops: ['anillo_vinculo', 'flor_eterna'],
      dropBonus: 20
    }
  },
  {
    id: 'social_2', cat: 'social', name: 'Contact best friend 1', freq: 'weekly',
    desc: 'Call, write to, or meet up with your best friend.',
    stats: { pre: 50, vol: 50 }, xp: 30,
    drops: { theme: 'amistad', items: ['token_amistad'] },
    sideQuest: {
      desc: 'Meet in person or have a video call of 30+ minutes.',
      stats: { pre: 12, vol: 8 }, xp: 15,
      drops: ['sello_hermandad'],
      dropBonus: 15
    }
  },
  {
    id: 'social_3', cat: 'social', name: 'Contact best friend 2', freq: 'weekly',
    desc: 'Call, write to, or meet up with your other best friend.',
    stats: { pre: 50, vol: 50 }, xp: 30,
    drops: { theme: 'amistad', items: ['token_amistad'] },
    sideQuest: {
      desc: 'Meet in person or have a video call of 30+ minutes.',
      stats: { pre: 12, vol: 8 }, xp: 15,
      drops: ['sello_hermandad'],
      dropBonus: 15
    }
  },
  {
    id: 'social_4', cat: 'social', name: 'Call family', freq: 'biweekly',
    desc: 'Call your parents, siblings, or close relatives.',
    stats: { pre: 50, vol: 50 }, xp: 25,
    drops: { theme: 'vinculo', items: ['bendicion_familiar'] },
    sideQuest: {
      desc: 'Have a video call or plan a visit.',
      stats: { pre: 10, vol: 8 }, xp: 12,
      drops: ['lazo_sangre'],
      dropBonus: 10
    }
  },
  {
    id: 'social_5', cat: 'social', name: 'Plans with friends', freq: 'monthly',
    desc: 'Organize or attend a group plan.',
    stats: { pre: 50, vol: 30, des: 20 }, xp: 50,
    drops: { theme: 'amistad', items: ['recuerdo_aventura', 'hidromiel_camaraderia'] },
    sideQuest: {
      desc: 'Take responsibility for organizing and choosing the plan.',
      stats: { pre: 15, int: 10 }, xp: 25,
      drops: ['corona_organizador'],
      dropBonus: 20
    }
  },

  // ========== PERSONAL ==========
  {
    id: 'personal_1', cat: 'personal', name: 'TTRPG session (30 min)', freq: 'weekly',
    desc: 'Focused work block on the TTRPG project.',
    stats: { int: 30, vol: 50, pre: 20 }, xp: 50,
    drops: { theme: 'creacion', items: ['dado_destino', 'tinta_magica', 'fragmento_historia'] },
    sideQuest: {
      desc: 'Work for a full hour or finish a section.',
      stats: { int: 15, vol: 15 }, xp: 30,
      drops: ['pluma_creador', 'capitulo_terminado'],
      dropBonus: 25
    }
  },
  {
    id: 'personal_2', cat: 'personal', name: 'Chinese practice (30 min)', freq: 'weekly',
    desc: 'Chinese study session: app, videos, flashcards.',
    stats: { int: 40, vol: 60 }, xp: 50,
    drops: { theme: 'oriente', items: ['caracter_antiguo', 'talisman_oriental_early', 'jade_menor'] },
    sideQuest: {
      desc: 'Study for an hour or include conversation practice.',
      stats: { int: 20, vol: 15 }, xp: 30,
      drops: ['escama_brillante', 'pergamino_sabiduria'],
      dropBonus: 25
    }
  },
  {
    id: 'personal_3', cat: 'personal', name: 'Journaling and reflection', freq: 'weekly',
    desc: 'Write about how the week is going, what you have learned, and what you want to change.',
    stats: { int: 40, vol: 50, pre: 10 }, xp: 25,
    drops: { theme: 'mente', items: ['pagina_reflexion', 'tinta_pensamiento'] },
    sideQuest: {
      desc: 'Write a full page with clear goals.',
      stats: { int: 12, vol: 10 }, xp: 15,
      drops: ['claridad_mental'],
      dropBonus: 15
    }
  },
  {
    id: 'personal_4', cat: 'personal', name: 'Read a book', freq: 'weekly',
    desc: 'Reading session with a book (not manga).',
    stats: { int: 60, vol: 40 }, xp: 30,
    drops: { theme: 'conocimiento', items: ['pergamino_hechizo', 'conocimiento_antiguo'] },
    sideQuest: {
      desc: 'Read a full chapter or 30+ pages.',
      stats: { int: 15, vol: 8 }, xp: 15,
      drops: ['grimorio_menor', 'sabiduria_acumulada'],
      dropBonus: 15
    }
  },
  {
    id: 'personal_5', cat: 'personal', name: 'Digital detox (1h+)', freq: 'weekly',
    desc: 'An hour or more without screens.',
    stats: { vol: 70, vit: 30 }, xp: 35,
    drops: { theme: 'naturaleza', items: ['paz_interior', 'hoja_calma'] },
    sideQuest: {
      desc: 'Do 2+ hours and go outside.',
      stats: { vol: 20, vit: 10 }, xp: 20,
      drops: ['reconexion_natural', 'espiritu_libre'],
      dropBonus: 20
    }
  },
  {
    id: 'personal_6', cat: 'personal', name: 'Audience with the Oracle', freq: 'monthly',
    desc: 'Review and update tasks, game content, and narrative with your assistant.',
    stats: { int: 50, vol: 50 }, xp: 40,
    drops: { theme: 'destino', items: ['vision_futuro', 'bendicion_oraculo'] },
    sideQuest: {
      desc: 'Create new content: quests, enemies, or events.',
      stats: { int: 20, pre: 10 }, xp: 25,
      drops: ['fragmento_destino', 'profecia'],
      dropBonus: 25
    }
  },
  // Ocio (no drops, low VOL)
  {
    id: 'personal_7', cat: 'personal', name: 'Gaming session', freq: 'weekly',
    desc: 'Leisure time spent playing something.',
    stats: { des: 50, vol: 20, int: 30 }, xp: 15,
    drops: null,
    sideQuest: null
  },
  {
    id: 'personal_8', cat: 'personal', name: 'Watch a film or series', freq: 'weekly',
    desc: 'Leisure time spent watching something.',
    stats: { int: 40, vol: 30, pre: 30 }, xp: 15,
    drops: null,
    sideQuest: null
  },
  {
    id: 'personal_9', cat: 'personal', name: 'Read manga', freq: 'weekly',
    desc: 'Time spent reading manga.',
    stats: { int: 50, vol: 30, des: 20 }, xp: 15,
    drops: null,
    sideQuest: null
  }
];

