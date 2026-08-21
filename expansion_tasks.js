// LifeXP Expansion 1 - Starter tasks
// Integracion: cargar despues de engine.js y antes de loadGame().
// DT-20 fix (2026-07-31): todos los drops.items y sideQuest.drops usan IDs
// canonicos de ITEMS (snake_case). Los nombres de display anteriores
// (Title Case con espacios) fallaban en silencio porque el motor busca
// items por ID, no por nombre.

const EXPANSION_TASKS_V1 = [
  {
    id: 'casa_exp_01', cat: 'casa', name: 'Ordenar despensa por zonas', freq: 'monthly',
    desc: 'Revisa existencias, agrupa alimentos y deja lo que caduca antes a la vista.',
    stats: { vol: 60, int: 40 }, xp: 35,
    drops: { theme: 'hallazgos', items: ['moneda_antigua', 'objeto_olvidado'] },
    sideQuest: { desc: 'Anota lo que falta y prepara una lista de reposicion.', stats: { int: 8, vol: 6 }, xp: 15, drops: ['llave_cofre'], dropBonus: 10 }
  },
  {
    id: 'casa_exp_02', cat: 'casa', name: 'Limpiar ventanas de una zona', freq: 'monthly',
    desc: 'Limpia cristales y marcos de una habitacion o zona concreta.',
    stats: { vit: 50, des: 30, vol: 20 }, xp: 30,
    drops: { theme: 'sol_viento', items: ['fragmento_solar', 'pluma_viento'] },
    sideQuest: { desc: 'Limpia tambien los railes y revisa los cierres.', stats: { des: 6, vol: 5 }, xp: 12, drops: ['cristal_solar'], dropBonus: 10 }
  },
  {
    id: 'casa_exp_03', cat: 'casa', name: 'Revisar botiquin y caducidades', freq: 'quarterly',
    desc: 'Comprueba medicamentos, material sanitario y fechas de caducidad.',
    stats: { int: 60, vol: 40 }, xp: 35,
    drops: { theme: 'agua_quimicos', items: ['antidoto', 'frasco_vacio'] },
    sideQuest: { desc: 'Reemplaza lo caducado y deja una lista de emergencia.', stats: { int: 8, vol: 6 }, xp: 15, drops: ['pocion_vida_menor'], dropBonus: 12 }
  },
  {
    id: 'cuerpo_exp_01', cat: 'cuerpo', name: 'Paseo de recuperacion', freq: 'weekly',
    desc: 'Camina a ritmo suave durante al menos 25 minutos.',
    stats: { vit: 45, des: 35, vol: 20 }, xp: 25,
    drops: { theme: 'exploracion', items: ['caparazon', 'mapa_tesoro'] },
    sideQuest: { desc: 'Haz una ruta distinta o camina 15 minutos adicionales.', stats: { vit: 8, des: 7 }, xp: 12, drops: ['amuleto_brisa'], dropBonus: 10 }
  },
  {
    id: 'cuerpo_exp_02', cat: 'cuerpo', name: 'Rutina de movilidad articular', freq: 'weekly',
    desc: 'Trabaja movilidad de cuello, hombros, cadera y tobillos sin dolor.',
    stats: { des: 45, vit: 30, vol: 25 }, xp: 25,
    drops: null,
    sideQuest: { desc: 'Registra que zona se sentia mas limitada y repitela con suavidad.', stats: { des: 8, vol: 6 }, xp: 12, drops: null, dropBonus: 0 }
  },
  {
    id: 'cuerpo_exp_03', cat: 'cuerpo', name: 'Preparar una comida equilibrada', freq: 'weekly',
    desc: 'Prepara una comida completa con proteina, vegetales y una fuente de energia.',
    stats: { vit: 35, int: 35, vol: 30 }, xp: 30,
    drops: { theme: 'fuego_comida', items: ['racion_combate', 'especia_rara'] },
    sideQuest: { desc: 'Deja una porcion preparada para otro momento.', stats: { vit: 7, int: 7 }, xp: 15, drops: ['semilla_rara'], dropBonus: 12 }
  },
  {
    id: 'gestiones_exp_01', cat: 'gestiones', name: 'Revisar gastos de la semana', freq: 'weekly',
    desc: 'Mira movimientos recientes y detecta un gasto que requiera accion.',
    stats: { int: 55, vol: 45 }, xp: 25,
    drops: { theme: 'comercio', items: ['moneda_oro', 'pagina_arcana'] },
    sideQuest: { desc: 'Anota una regla sencilla para mejorar la proxima semana.', stats: { int: 8, vol: 7 }, xp: 12, drops: ['contrato_mercantil'], dropBonus: 10 }
  },
  {
    id: 'gestiones_exp_02', cat: 'gestiones', name: 'Ordenar una carpeta digital', freq: 'monthly',
    desc: 'Elige una carpeta, elimina duplicados y deja una estructura clara.',
    stats: { int: 65, vol: 35 }, xp: 30,
    drops: { theme: 'conocimiento', items: ['cristal_solar', 'pagina_arcana'] },
    sideQuest: { desc: 'Crea una convencion de nombres para evitar que vuelva el caos.', stats: { int: 10, vol: 5 }, xp: 15, drops: ['grimorio_antiguo'], dropBonus: 12 }
  },
  {
    id: 'gestiones_exp_03', cat: 'gestiones', name: 'Revisar renovaciones proximas', freq: 'monthly',
    desc: 'Comprueba suscripciones, documentos y pagos que venceran pronto.',
    stats: { int: 55, vol: 45 }, xp: 30,
    drops: { theme: 'oro_comercio', items: ['moneda_oro', 'contrato_mercantil'] },
    sideQuest: { desc: 'Cancela una renovacion innecesaria o configura un recordatorio.', stats: { int: 7, vol: 8 }, xp: 15, drops: ['sello_alianza'], dropBonus: 12 }
  },
  {
    id: 'social_exp_01', cat: 'social', name: 'Proponer un plan concreto', freq: 'monthly',
    desc: 'Escribe a alguien y propone dia, hora y actividad concretos.',
    stats: { pre: 55, vol: 30, int: 15 }, xp: 30,
    drops: { theme: 'alianzas', items: ['sello_alianza', 'pagina_arcana'] },
    sideQuest: { desc: 'Hazte cargo de coordinar los detalles.', stats: { pre: 8, int: 6 }, xp: 15, drops: ['sello_alianza'], dropBonus: 12 }
  },
  {
    id: 'social_exp_02', cat: 'social', name: 'Preguntar y escuchar sin multitarea', freq: 'weekly',
    desc: 'Ten una conversacion de calidad prestando atencion completa.',
    stats: { pre: 45, vol: 35, int: 20 }, xp: 25,
    drops: { theme: 'alianzas', items: ['token_amistad', 'hidromiel'] },
    sideQuest: { desc: 'Recuerda despues un detalle importante y retomalo mas adelante.', stats: { pre: 7, int: 6 }, xp: 12, drops: ['sello_alianza'], dropBonus: 10 }
  },
  {
    id: 'personal_exp_01', cat: 'personal', name: 'Bloque de proyecto de 45 minutos', freq: 'weekly',
    desc: 'Trabaja sin interrupciones en una tarea concreta de un proyecto personal.',
    stats: { int: 50, vol: 40, des: 10 }, xp: 35,
    drops: { theme: 'creacion', items: ['dado_destino', 'pagina_arcana'] },
    sideQuest: { desc: 'Termina una pieza que pueda marcarse como cerrada.', stats: { int: 10, vol: 8 }, xp: 18, drops: ['grimorio_antiguo'], dropBonus: 15 }
  },
  {
    id: 'personal_exp_02', cat: 'personal', name: 'Practica de conversacion en chino', freq: 'weekly',
    desc: 'Habla en chino durante al menos 15 minutos, con una persona o herramienta.',
    stats: { int: 45, vol: 45, pre: 10 }, xp: 35,
    drops: { theme: 'oriente', items: ['talisman_oriental', 'cuentas_jade'] },
    sideQuest: { desc: 'Prepara y usa cinco frases nuevas.', stats: { int: 10, vol: 8 }, xp: 18, drops: ['pagina_arcana'], dropBonus: 15 }
  },
  {
    id: 'personal_exp_03', cat: 'personal', name: 'Revision mensual de objetivos', freq: 'monthly',
    desc: 'Revisa que quieres mantener, empezar y dejar durante el proximo mes.',
    stats: { int: 55, vol: 35, pre: 10 }, xp: 35,
    drops: { theme: 'destino', items: ['esencia_oscura', 'orbe_mental'] },
    sideQuest: { desc: 'Convierte un objetivo en una accion con fecha concreta.', stats: { int: 10, vol: 8 }, xp: 18, drops: ['esencia_oscura'], dropBonus: 15 }
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

// LifeXP task catalog update - thematic metadata and approved task refresh.
// This layer is declarative and keeps the original expansion installer intact.

const TASK_THEMES_V2 = {
  casa_1: ['curacion', 'agua', 'veneno', 'acido'],
  casa_2: ['purificacion', 'santuario', 'viento'],
  casa_3: ['agua', 'purificacion', 'santuario'],
  casa_4: ['purificacion', 'agua', 'fuego', 'comida', 'veneno', 'acido'],
  casa_5: ['agua', 'purificacion', 'atuendo', 'viento', 'santuario'],
  casa_6: ['viento', 'atuendo', 'purificacion'],
  casa_7: ['atuendo', 'orden', 'santuario'],
  casa_8: ['regeneracion', 'sueno', 'atuendo', 'purificacion'],
  casa_9: ['atuendo', 'orden', 'santuario', 'presencia'],
  casa_10: ['purificacion', 'viento', 'luz', 'santuario'],
  casa_11: ['estrategia', 'inteligencia', 'comida', 'consumibles'],
  casa_12: ['comercio', 'oro', 'comida', 'consumibles', 'estrategia'],
  casa_13: ['purificacion', 'regeneracion', 'santuario', 'orden'],
  casa_14: ['naturaleza', 'agua', 'curacion', 'vida'],
  casa_15: ['hielo', 'comida', 'consumibles', 'purificacion', 'orden'],
  cuerpo_1: ['fuerza', 'resistencia', 'voluntad'],
  cuerpo_2: ['resistencia', 'movimiento', 'viento', 'voluntad'],
  cuerpo_3: ['exploracion', 'camino', 'resistencia', 'viento', 'naturaleza'],
  cuerpo_4: ['agilidad', 'equilibrio', 'regeneracion', 'calma'],
  cuerpo_5: ['mente', 'calma', 'voluntad', 'espiritu'],
  cuerpo_6: ['agua_profunda', 'resistencia', 'exploracion'],
  cuerpo_7: ['curacion', 'pureza', 'presencia', 'regeneracion'],
  gestiones_1: ['oro', 'comercio', 'contratos', 'inteligencia'],
  gestiones_2: ['oro', 'comercio', 'estrategia', 'inteligencia'],
  gestiones_3: ['memoria', 'conocimiento', 'proteccion', 'archivo'],
  gestiones_4: ['comunicacion', 'orden', 'estrategia', 'memoria'],
  gestiones_5: ['estrategia', 'inteligencia', 'tiempo', 'destino'],
  social_1: ['vinculo', 'presencia', 'moral', 'calma'],
  social_2: ['amistad', 'vinculo', 'comunicacion', 'presencia'],
  social_3: ['amistad', 'vinculo', 'comunicacion', 'presencia'],
  social_4: ['familia', 'vinculo', 'memoria', 'comunicacion'],
  social_5: ['amistad', 'alianzas', 'estrategia', 'moral'],
  personal_1: ['creacion', 'imaginacion', 'narrativa', 'fantasia', 'conocimiento'],
  personal_2: ['oriente', 'lenguaje', 'memoria', 'conocimiento', 'comunicacion'],
  personal_3: ['mente', 'memoria', 'calma', 'destino', 'conocimiento'],
  personal_4: ['conocimiento', 'sabiduria', 'narrativa', 'magia'],
  personal_5: ['calma', 'regeneracion', 'naturaleza', 'espiritu'],
  personal_6: ['destino', 'profecia', 'conocimiento', 'creacion', 'narrativa'],
  personal_7: ['ocio', 'fantasia', 'habilidad', 'estrategia'],
  personal_8: ['ocio', 'narrativa', 'imaginacion', 'regeneracion'],
  personal_9: ['ocio', 'narrativa', 'oriente', 'imaginacion'],
  casa_exp_01: ['comida', 'consumibles', 'orden', 'comercio'],
  casa_exp_02: ['luz', 'viento', 'agua', 'purificacion', 'santuario'],
  casa_exp_03: ['curacion', 'veneno', 'acido', 'orden', 'conocimiento'],
  cuerpo_exp_01: ['regeneracion', 'exploracion', 'viento', 'naturaleza'],
  cuerpo_exp_02: ['agilidad', 'equilibrio', 'movimiento', 'curacion'],
  cuerpo_exp_03: ['comida', 'consumibles', 'fuego', 'curacion', 'naturaleza'],
  gestiones_exp_01: ['oro', 'comercio', 'inteligencia', 'orden'],
  gestiones_exp_02: ['conocimiento', 'memoria', 'orden', 'archivo'],
  gestiones_exp_03: ['contratos', 'tiempo', 'comercio', 'oro', 'proteccion'],
  social_exp_01: ['alianzas', 'comunicacion', 'estrategia', 'destino'],
  social_exp_02: ['vinculo', 'escucha', 'mente', 'presencia', 'calma'],
  personal_exp_01: ['creacion', 'inteligencia', 'concentracion', 'voluntad', 'conocimiento'],
  personal_exp_02: ['oriente', 'lenguaje', 'comunicacion', 'memoria', 'presencia'],
  personal_exp_03: ['destino', 'estrategia', 'inteligencia', 'voluntad', 'tiempo']
};

const RETIRED_TASK_IDS_V2 = new Set(['casa_2', 'casa_6', 'cuerpo_6']);

const NEW_HOME_TASKS_V2 = [
  { id: 'casa_16', cat: 'casa', name: 'Ordenar el bano', freq: 'weekly', desc: 'Dejar en su sitio los productos, objetos y superficies del bano.', stats: { vol: 60, int: 40 }, xp: 25, themes: ['orden', 'agua', 'curacion', 'santuario'], drops: null, sideQuest: null },
  { id: 'casa_17', cat: 'casa', name: 'Ordenar el comedor', freq: 'weekly', desc: 'Recoger y colocar en su sitio todo lo que haya quedado en el comedor.', stats: { vol: 60, int: 40 }, xp: 25, themes: ['orden', 'santuario', 'comida', 'moral'], drops: null, sideQuest: null },
  { id: 'casa_18', cat: 'casa', name: 'Limpiar y barrer el comedor', freq: 'weekly', desc: 'Limpiar las superficies y barrer todo el suelo del comedor.', stats: { vit: 50, vol: 50 }, xp: 30, themes: ['purificacion', 'santuario', 'comida', 'orden'], drops: null, sideQuest: null },
  { id: 'casa_19', cat: 'casa', name: 'Ordenar la cocina', freq: 'weekly', desc: 'Dejar utensilios, alimentos y superficies de la cocina en su sitio.', stats: { vol: 50, int: 30, vit: 20 }, xp: 25, themes: ['orden', 'santuario', 'comida', 'consumibles'], drops: null, sideQuest: null },
  { id: 'casa_20', cat: 'casa', name: 'Limpiar el horno', freq: 'biweekly', desc: 'Limpiar el interior y las partes accesibles del horno.', stats: { vit: 40, vol: 60 }, xp: 30, themes: ['fuego', 'purificacion', 'acido', 'comida'], drops: null, sideQuest: null },
  { id: 'casa_21', cat: 'casa', name: 'Ordenar el lavadero', freq: 'weekly', desc: 'Colocar productos, ropa y objetos del lavadero para dejarlo despejado.', stats: { vol: 60, int: 40 }, xp: 25, themes: ['orden', 'agua', 'purificacion', 'santuario'], drops: null, sideQuest: null },
  { id: 'casa_22', cat: 'casa', name: 'Limpiar terraza inferior', freq: 'weekly', desc: 'Limpiar el suelo, las superficies y los elementos accesibles de la terraza inferior.', stats: { vit: 55, vol: 45 }, xp: 30, themes: ['purificacion', 'viento', 'luz', 'naturaleza', 'santuario'], drops: null, sideQuest: null },
  { id: 'casa_23', cat: 'casa', name: 'Ordenar dormitorio', freq: 'weekly', desc: 'Dejar en su sitio la ropa, los objetos y las superficies del dormitorio.', stats: { vol: 60, int: 20, vit: 20 }, xp: 25, themes: ['orden', 'regeneracion', 'sueno', 'santuario'], drops: null, sideQuest: null },
  { id: 'casa_24', cat: 'casa', name: 'Cocinar la cena y la comida del dia siguiente', freq: 'daily', desc: 'Cocinar la cena y dejar preparada la comida del dia siguiente.', stats: { vit: 30, int: 35, vol: 35 }, xp: 30, themes: ['fuego', 'comida', 'consumibles', 'curacion'], drops: null, sideQuest: null },
  { id: 'casa_25', cat: 'casa', name: 'Ordenar la nevera', freq: 'biweekly', desc: 'Revisar y colocar los alimentos de la nevera para que todo quede visible y ordenado.', stats: { vol: 60, int: 40 }, xp: 25, themes: ['hielo', 'comida', 'consumibles', 'orden'], drops: null, sideQuest: null },
  { id: 'casa_26', cat: 'casa', name: 'Ordenar escritorio', freq: 'weekly', desc: 'Dejar el escritorio despejado y colocar cada objeto en su sitio.', stats: { vol: 50, int: 50 }, xp: 25, themes: ['orden', 'conocimiento', 'creacion', 'memoria'], drops: null, sideQuest: null },
  { id: 'casa_27', cat: 'casa', name: 'Limpiar escritorio', freq: 'weekly', desc: 'Limpiar la superficie y las zonas accesibles del escritorio.', stats: { vit: 40, vol: 40, int: 20 }, xp: 20, themes: ['purificacion', 'conocimiento', 'creacion', 'orden'], drops: null, sideQuest: null },
  { id: 'casa_28', cat: 'casa', name: 'Barrer pasillos', freq: 'weekly', desc: 'Barrer todos los pasillos de la casa.', stats: { vit: 60, vol: 40 }, xp: 20, themes: ['purificacion', 'santuario', 'viento', 'exploracion'], drops: null, sideQuest: null }
];

function cloneTaskCatalogV2(task) {
  return JSON.parse(JSON.stringify(task));
}

function patchTaskCatalogV2(task, patch) {
  Object.assign(task, patch);
  if (Array.isArray(patch.themes)) task.themes = [...new Set(patch.themes)];
}

const installExpansionTasksBaseV2 = installExpansionTasks;
installExpansionTasks = function installExpansionTasksV2() {
  if (installExpansionTasks._catalogV2Installed) return;
  installExpansionTasks._catalogV2Installed = true;
  if (typeof FREQ !== 'undefined' && !FREQ.every3days) FREQ.every3days = { name: 'Cada 3 dias', days: 3 };
  installExpansionTasksBaseV2();

  const defaultById = new Map(DEFAULT_TASKS.map(task => [task.id, task]));
  for (const [id, themes] of Object.entries(TASK_THEMES_V2)) {
    const task = defaultById.get(id);
    if (task) patchTaskCatalogV2(task, { themes });
  }

  const casa11 = defaultById.get('casa_11');
  if (casa11) patchTaskCatalogV2(casa11, { name: 'Planificar recetas para los proximos 3 dias y hacer la lista de la compra', freq: 'every3days', desc: 'Planificar las comidas de los proximos tres dias y dejar preparada la lista de la compra.', stats: { int: 50, vol: 50 }, xp: 30 });
  const casa12 = defaultById.get('casa_12');
  if (casa12) patchTaskCatalogV2(casa12, { freq: 'every3days', desc: 'Hacer la compra usando la lista preparada para los proximos tres dias.' });
  const casa13 = defaultById.get('casa_13');
  if (casa13) patchTaskCatalogV2(casa13, { name: 'Limpiar dormitorio, incluyendo barrer', desc: 'Hacer la cama a fondo, quitar polvo, barrer y ordenar las mesitas.' });
  const casaExp02 = defaultById.get('casa_exp_02');
  if (casaExp02) patchTaskCatalogV2(casaExp02, { name: 'Limpiar todas las ventanas', desc: 'Limpia los cristales y marcos de todas las ventanas de la casa.' });

  for (const id of RETIRED_TASK_IDS_V2) {
    const index = DEFAULT_TASKS.findIndex(task => task.id === id);
    if (index !== -1) DEFAULT_TASKS.splice(index, 1);
  }

  const additions = [...NEW_HOME_TASKS_V2];
  const existing = new Set(DEFAULT_TASKS.map(task => task.id));
  for (const task of additions) {
    if (!existing.has(task.id)) {
      DEFAULT_TASKS.push(cloneTaskCatalogV2(task));
      existing.add(task.id);
    }
  }

  if (typeof gameState !== 'undefined' && Array.isArray(gameState.tasks) && gameState.tasks.length > 0) {
    const activeById = new Map(gameState.tasks.map(task => [task.id, task]));
    for (const [id, themes] of Object.entries(TASK_THEMES_V2)) {
      const task = activeById.get(id);
      if (task) patchTaskCatalogV2(task, { themes });
    }
    for (const [id, patch] of Object.entries({
      casa_11: { name: 'Planificar recetas para los proximos 3 dias y hacer la lista de la compra', freq: 'every3days', desc: 'Planificar las comidas de los proximos tres dias y dejar preparada la lista de la compra.', stats: { int: 50, vol: 50 }, xp: 30 },
      casa_12: { freq: 'every3days', desc: 'Hacer la compra usando la lista preparada para los proximos tres dias.' },
      casa_13: { name: 'Limpiar dormitorio, incluyendo barrer', desc: 'Hacer la cama a fondo, quitar polvo, barrer y ordenar las mesitas.' },
      casa_exp_02: { name: 'Limpiar todas las ventanas', desc: 'Limpia los cristales y marcos de todas las ventanas de la casa.' }
    })) {
      const task = activeById.get(id);
      if (task) patchTaskCatalogV2(task, patch);
    }
    for (const task of additions) {
      if (!activeById.has(task.id)) gameState.tasks.push(cloneTaskCatalogV2(task));
    }
  }
};
