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
