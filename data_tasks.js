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
  casa: { name: 'Casa', icon: '\uD83C\uDFE0', color: '#f87171' },
  cuerpo: { name: 'Cuerpo', icon: '\uD83D\uDCAA', color: '#4ade80' },
  gestiones: { name: 'Gestiones', icon: '\uD83D\uDCCB', color: '#fbbf24' },
  social: { name: 'Social', icon: '\uD83D\uDC65', color: '#60a5fa' },
  personal: { name: 'Personal', icon: '\uD83C\uDF1F', color: '#a78bfa' }
};

const STATS = {
  fue: { name: 'Fuerza', abbr: 'FUE', color: '#ef4444' },
  vit: { name: 'Vitalidad', abbr: 'VIT', color: '#22c55e' },
  des: { name: 'Destreza', abbr: 'DES', color: '#3b82f6' },
  int: { name: 'Intelecto', abbr: 'INT', color: '#a855f7' },
  vol: { name: 'Voluntad', abbr: 'VOL', color: '#f59e0b' },
  pre: { name: 'Presencia', abbr: 'PRE', color: '#ec4899' }
};

const FREQ = {
  daily: {
    name: 'Diaria',
    days: 1,
    availability: { type: 'periodic', intervalDays: 1, limit: 1, repeatable: true }
  },
  weekly: {
    name: 'Semanal',
    days: 7,
    availability: { type: 'periodic', intervalDays: 7, limit: 1, repeatable: true }
  },
  biweekly: {
    name: 'Quincenal',
    days: 14,
    availability: { type: 'periodic', intervalDays: 14, limit: 1, repeatable: true }
  },
  monthly: {
    name: 'Mensual',
    days: 30,
    availability: { type: 'periodic', intervalDays: 30, limit: 1, repeatable: true }
  },
  quarterly: {
    name: 'Trimestral',
    days: 90,
    availability: { type: 'periodic', intervalDays: 90, limit: 1, repeatable: true }
  },
  biannual: {
    name: 'Semestral',
    days: 180,
    availability: { type: 'periodic', intervalDays: 180, limit: 1, repeatable: true }
  },
  annual: {
    name: 'Anual',
    days: 365,
    availability: { type: 'periodic', intervalDays: 365, limit: 1, repeatable: true }
  },
  once: {
    name: 'Una sola vez',
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
    id: 'casa_1', cat: 'casa', name: 'Limpiar baño completo', freq: 'weekly',
    desc: 'Empieza por el espejo, sigue con sanitarios, acaba con el suelo.',
    stats: { vit: 40, vol: 60 }, xp: 45,
    drops: { theme: 'agua_quimicos', items: ['pocion_agua_menor', 'veneno_basico', 'frasco_vacio'] },
    sideQuest: {
      desc: 'Limpia también los azulejos de la ducha y organiza los productos bajo el lavabo.',
      stats: { vol: 8, int: 4 }, xp: 20,
      drops: ['esencia_purificadora', 'cristal_limpieza'],
      dropBonus: 15
    }
  },
  {
    id: 'casa_2', cat: 'casa', name: 'Aspirar el comedor', freq: 'weekly',
    desc: 'Aspirar todo el suelo del comedor, incluyendo debajo de muebles accesibles.',
    stats: { vit: 50, vol: 50 }, xp: 30,
    drops: { theme: 'hallazgos', items: ['moneda_antigua', 'objeto_olvidado'] },
    sideQuest: {
      desc: 'Mueve todos los muebles y aspira también detrás de ellos.',
      stats: { vit: 10, vol: 5 }, xp: 15,
      drops: ['bolsa_oro_grande'],
      dropBonus: 20
    }
  },
  {
    id: 'casa_3', cat: 'casa', name: 'Fregar el suelo', freq: 'weekly',
    desc: 'Fregar suelos de las zonas principales de la casa.',
    stats: { vit: 50, vol: 50 }, xp: 30,
    drops: { theme: 'agua', items: ['gota_agua_pura'] },
    sideQuest: {
      desc: 'Usa producto especial y friega también los rincones difíciles.',
      stats: { vol: 8, vit: 4 }, xp: 12,
      drops: ['esencia_limpieza'],
      dropBonus: 10
    }
  },
  {
    id: 'casa_4', cat: 'casa', name: 'Limpiar cocina a fondo', freq: 'weekly',
    desc: 'Encimeras, vitrocerámica, fregadero, exterior de electrodomésticos.',
    stats: { vit: 40, vol: 60 }, xp: 50,
    drops: { theme: 'fuego', items: ['grasa_fuego', 'espatula_encantada'] },
    sideQuest: {
      desc: 'Limpia también el interior del microondas y el horno por fuera.',
      stats: { vol: 10, vit: 5 }, xp: 20,
      drops: ['llama_culinaria'],
      dropBonus: 15
    }
  },
  {
    id: 'casa_5', cat: 'casa', name: 'Poner lavadora', freq: 'weekly',
    desc: 'Recoger ropa sucia, separar si hace falta, poner una lavadora.',
    stats: { vit: 80, vol: 20 }, xp: 15,
    drops: null,
    sideQuest: {
      desc: 'Separa la ropa por colores y pon dos lavadoras.',
      stats: { vol: 5, vit: 5 }, xp: 10,
      drops: null,
      dropBonus: 0
    }
  },
  {
    id: 'casa_6', cat: 'casa', name: 'Tender la ropa', freq: 'weekly',
    desc: 'Sacar la ropa de la lavadora y tenderla.',
    stats: { vit: 60, vol: 40 }, xp: 15,
    drops: { theme: 'sol_viento', items: ['fragmento_solar', 'pluma_viento'] },
    sideQuest: {
      desc: 'Tiende cada prenda con cuidado para minimizar arrugas.',
      stats: { vol: 5, des: 3 }, xp: 8,
      drops: ['brisa_atrapada'],
      dropBonus: 10
    }
  },
  {
    id: 'casa_7', cat: 'casa', name: 'Recoger y doblar ropa', freq: 'weekly',
    desc: 'Entrar la ropa seca, doblarla y guardarla en su sitio.',
    stats: { vol: 50, vit: 50 }, xp: 15,
    drops: null,
    sideQuest: {
      desc: 'Usa el método KonMari para doblar y organiza por colores.',
      stats: { int: 5, vol: 5 }, xp: 10,
      drops: null,
      dropBonus: 0
    }
  },
  {
    id: 'casa_8', cat: 'casa', name: 'Cambiar sábanas y fundas', freq: 'biweekly',
    desc: 'Quitar sábanas, poner las limpias, cambiar fundas de almohada.',
    stats: { vit: 50, vol: 50 }, xp: 30,
    drops: { theme: 'descanso', items: ['pluma_sueno', 'esencia_descanso'] },
    sideQuest: {
      desc: 'Rota el colchón y limpia el somier.',
      stats: { vit: 10, vol: 5 }, xp: 15,
      drops: ['bendicion_descanso'],
      dropBonus: 15
    }
  },
  {
    id: 'casa_9', cat: 'casa', name: 'Ordenar el vestidor', freq: 'monthly',
    desc: 'Reorganizar ropa, revisar qué sobra, asegurar que todo tiene su sitio.',
    stats: { vol: 70, int: 30 }, xp: 50,
    drops: { theme: 'hallazgos', items: ['prenda_olvidada', 'moneda_antigua'] },
    sideQuest: {
      desc: 'Haz purga seria: dona lo que no uses en 1 año.',
      stats: { vol: 15, int: 10 }, xp: 25,
      drops: ['amuleto_explorador'],
      dropBonus: 20
    }
  },
  {
    id: 'casa_10', cat: 'casa', name: 'Limpiar terraza superior', freq: 'monthly',
    desc: 'Barrer/fregar suelo, limpiar barandilla, revisar tendedero.',
    stats: { vit: 60, vol: 40 }, xp: 30,
    drops: { theme: 'sol_viento', items: ['cristal_solar', 'pluma_viento'] },
    sideQuest: {
      desc: 'Limpia también los cristales y las macetas.',
      stats: { vit: 8, vol: 5 }, xp: 12,
      drops: ['luz_atrapada'],
      dropBonus: 15
    }
  },
  {
    id: 'casa_11', cat: 'casa', name: 'Batch cooking semanal', freq: 'weekly',
    desc: 'Cocinar varias comidas para la semana en una sesión.',
    stats: { vol: 30, int: 40, vit: 30 }, xp: 50,
    drops: { theme: 'fuego_comida', items: ['racion_serena', 'gema_fuego_menor', 'receta_secreta'] },
    sideQuest: {
      desc: 'Prepara 5+ comidas diferentes y congela porciones extra.',
      stats: { int: 15, vol: 10 }, xp: 25,
      drops: ['receta_secreta', 'racion_serena'],
      dropBonus: 20
    }
  },
  {
    id: 'casa_12', cat: 'casa', name: 'Hacer la compra', freq: 'weekly',
    desc: 'Ir al supermercado con lista preparada.',
    stats: { vol: 30, int: 30, pre: 40 }, xp: 30,
    drops: { theme: 'comercio', items: ['bolsa_oro_grande', 'ingrediente_especial'] },
    sideQuest: {
      desc: 'Compara precios y encuentra al menos 3 ofertas.',
      stats: { int: 10, pre: 5 }, xp: 15,
      drops: ['ojo_comerciante'],
      dropBonus: 15
    }
  },
  {
    id: 'casa_13', cat: 'casa', name: 'Limpiar dormitorio', freq: 'weekly',
    desc: 'Hacer la cama a fondo, quitar polvo, ordenar mesitas.',
    stats: { vit: 50, vol: 50 }, xp: 30,
    drops: { theme: 'descanso', items: ['polvo_sueno'] },
    sideQuest: {
      desc: 'Reorganiza los cajones y limpia debajo de la cama.',
      stats: { vol: 8, vit: 5 }, xp: 12,
      drops: ['cristal_tranquilidad'],
      dropBonus: 10
    }
  },
  {
    id: 'casa_14', cat: 'casa', name: 'Mantenimiento plantas', freq: 'weekly',
    desc: 'Regar, revisar estado, podar si hace falta.',
    stats: { vol: 30, vit: 40, pre: 30 }, xp: 20,
    drops: { theme: 'naturaleza', items: ['hoja_calma', 'rocio_matutino', 'rocio_matutino'] },
    sideQuest: {
      desc: 'Trasplanta alguna planta o añade abono a todas.',
      stats: { vit: 8, int: 5 }, xp: 15,
      drops: ['espiritu_jardin', 'flor_luminosa'],
      dropBonus: 20
    }
  },
  {
    id: 'casa_15', cat: 'casa', name: 'Limpieza profunda nevera', freq: 'monthly',
    desc: 'Vaciar nevera, limpiar baldas, revisar caducidades, reorganizar.',
    stats: { vit: 40, vol: 60 }, xp: 40,
    drops: { theme: 'hielo', items: ['escarcha_eterna', 'escarcha_eterna'] },
    sideQuest: {
      desc: 'Limpia también el congelador y descongela si hace falta.',
      stats: { vit: 10, vol: 10 }, xp: 20,
      drops: ['cristal_hielo_puro'],
      dropBonus: 15
    }
  },

  // ========== CUERPO ==========
  {
    id: 'cuerpo_1', cat: 'cuerpo', name: 'Entrenamiento de fuerza', freq: 'weekly',
    desc: 'Sesión de fuerza en casa: sentadillas, flexiones, planchas, peso corporal.',
    stats: { fue: 50, vit: 30, vol: 20 }, xp: 50,
    drops: null, // Solo stats
    sideQuest: {
      desc: 'Añade un ejercicio nuevo o haz 15 minutos extra.',
      stats: { fue: 15, vol: 10 }, xp: 25,
      drops: null,
      dropBonus: 0
    }
  },
  {
    id: 'cuerpo_2', cat: 'cuerpo', name: 'Cardio en casa', freq: 'weekly',
    desc: 'Sesión de cardio sin salir: jumping jacks, burpees, baile...',
    stats: { vit: 40, des: 30, vol: 30 }, xp: 30,
    drops: null,
    sideQuest: {
      desc: 'Haz 10 minutos más o prueba una rutina nueva.',
      stats: { vit: 10, des: 8 }, xp: 15,
      drops: null,
      dropBonus: 0
    }
  },
  {
    id: 'cuerpo_3', cat: 'cuerpo', name: 'Salir a correr o caminar', freq: 'weekly',
    desc: 'Ejercicio aeróbico exterior: correr, caminar rápido, o combinación.',
    stats: { vit: 40, des: 40, vol: 20 }, xp: 30,
    drops: { theme: 'exploracion', items: ['mapa_zona', 'piedra_camino', 'bolsa_oro_grande'] },
    sideQuest: {
      desc: 'Haz más de 5km o explora una ruta nueva.',
      stats: { vit: 12, des: 10 }, xp: 20,
      drops: ['botas_sendero', 'amuleto_explorador'],
      dropBonus: 25
    }
  },
  {
    id: 'cuerpo_4', cat: 'cuerpo', name: 'Estiramientos', freq: 'weekly',
    desc: 'Sesión de estiramientos o movilidad para mantener flexibilidad.',
    stats: { des: 50, vit: 30, vol: 20 }, xp: 20,
    drops: null,
    sideQuest: {
      desc: 'Haz una rutina completa de yoga de 30+ minutos.',
      stats: { des: 15, vol: 10 }, xp: 15,
      drops: null,
      dropBonus: 0
    }
  },
  {
    id: 'cuerpo_5', cat: 'cuerpo', name: 'Meditación', freq: 'weekly',
    desc: 'Sesión de meditación de al menos 10 minutos.',
    stats: { vol: 50, int: 50 }, xp: 25,
    drops: { theme: 'mente', items: ['orbe_claridad', 'incienso_mistico'] },
    sideQuest: {
      desc: 'Medita 20+ minutos o prueba una técnica nueva.',
      stats: { vol: 15, int: 10 }, xp: 15,
      drops: ['foco_interior', 'mente_cristal'],
      dropBonus: 20
    }
  },
  {
    id: 'cuerpo_6', cat: 'cuerpo', name: 'Natación', freq: 'monthly',
    desc: 'Sesión de natación en piscina.',
    stats: { vit: 35, des: 30, fue: 25, vol: 10 }, xp: 50,
    drops: { theme: 'agua_profunda', items: ['coral_magico', 'escama_brillante', 'coral_magico'] },
    sideQuest: {
      desc: 'Nada más de 1km o practica un estilo nuevo.',
      stats: { vit: 15, des: 10 }, xp: 25,
      drops: ['tridente_menor', 'bendicion_mar'],
      dropBonus: 25
    }
  },
  {
    id: 'cuerpo_7', cat: 'cuerpo', name: 'Rutina cuidado personal', freq: 'weekly',
    desc: 'Cuidado de piel, pelo, uñas — lo que toque.',
    stats: { pre: 50, vol: 30, vit: 20 }, xp: 15,
    drops: null,
    sideQuest: {
      desc: 'Haz una rutina completa con mascarilla o tratamiento especial.',
      stats: { pre: 10, vol: 5 }, xp: 10,
      drops: null,
      dropBonus: 0
    }
  },

  // ========== GESTIONES ==========
  {
    id: 'gestiones_1', cat: 'gestiones', name: 'Declaración de la renta', freq: 'annual',
    desc: 'Hacer la declaración anual de IRPF.',
    stats: { int: 40, vol: 60 }, xp: 100,
    drops: { theme: 'oro', items: ['bolsa_oro_grande', 'lingote_oro'] },
    sideQuest: {
      desc: 'Revisa todas las deducciones posibles y optimiza.',
      stats: { int: 20, vol: 15 }, xp: 50,
      drops: ['sabiduria_fiscal', 'corona_contribuyente'],
      dropBonus: 30
    }
  },
  {
    id: 'gestiones_2', cat: 'gestiones', name: 'Revisar finanzas/presupuesto', freq: 'monthly',
    desc: 'Revisar gastos, ingresos, ajustar presupuesto.',
    stats: { int: 50, vol: 50 }, xp: 35,
    drops: { theme: 'oro', items: ['bolsa_oro_grande', 'gema_menor'] },
    sideQuest: {
      desc: 'Crea un plan de ahorro o inversión nuevo.',
      stats: { int: 15, vol: 10 }, xp: 20,
      drops: ['ojo_comerciante'],
      dropBonus: 15
    }
  },
  {
    id: 'gestiones_3', cat: 'gestiones', name: 'Backup de datos', freq: 'monthly',
    desc: 'Hacer copia de seguridad de fotos, documentos importantes, etc.',
    stats: { int: 60, vol: 40 }, xp: 25,
    drops: { theme: 'conocimiento', items: ['cristal_memoria', 'pergamino_blanco'] },
    sideQuest: {
      desc: 'Organiza los archivos y elimina duplicados.',
      stats: { int: 12, vol: 8 }, xp: 15,
      drops: ['biblioteca_personal'],
      dropBonus: 10
    }
  },
  {
    id: 'gestiones_4', cat: 'gestiones', name: 'Limpiar email/bandeja', freq: 'weekly',
    desc: 'Procesar emails pendientes, archivar, borrar spam.',
    stats: { vol: 60, int: 40 }, xp: 20,
    drops: { theme: 'comercio', items: ['mensaje_importante', 'llave_olvidada'] },
    sideQuest: {
      desc: 'Llega a inbox zero y configura filtros nuevos.',
      stats: { int: 10, vol: 8 }, xp: 12,
      drops: ['sello_eficiencia'],
      dropBonus: 10
    }
  },
  {
    id: 'gestiones_5', cat: 'gestiones', name: 'Planificar la semana', freq: 'weekly',
    desc: 'Revisar calendario, priorizar tareas, planificar.',
    stats: { int: 50, vol: 50 }, xp: 25,
    drops: { theme: 'conocimiento', items: ['pergamino_planificacion'] },
    sideQuest: {
      desc: 'Define objetivos claros y time-blocks.',
      stats: { int: 10, vol: 10 }, xp: 15,
      drops: ['agenda_encantada'],
      dropBonus: 15
    }
  },

  // ========== SOCIAL ==========
  {
    id: 'social_1', cat: 'social', name: 'Fecha especial con pareja', freq: 'weekly',
    desc: 'Tiempo de calidad dedicado solo a la relación.',
    stats: { pre: 40, vit: 30, vol: 30 }, xp: 50,
    drops: { theme: 'vinculo', items: ['recuerdo_especial', 'lazo_conexion'] },
    sideQuest: {
      desc: 'Planea algo nuevo o sorprende con un detalle.',
      stats: { pre: 15, int: 10 }, xp: 25,
      drops: ['anillo_vinculo', 'flor_eterna'],
      dropBonus: 20
    }
  },
  {
    id: 'social_2', cat: 'social', name: 'Contactar mejor amigo 1', freq: 'weekly',
    desc: 'Llamar, escribir o quedar con tu mejor amigo/a.',
    stats: { pre: 50, vol: 50 }, xp: 30,
    drops: { theme: 'amistad', items: ['token_amistad'] },
    sideQuest: {
      desc: 'Queda en persona o haz videollamada de 30+ min.',
      stats: { pre: 12, vol: 8 }, xp: 15,
      drops: ['sello_hermandad'],
      dropBonus: 15
    }
  },
  {
    id: 'social_3', cat: 'social', name: 'Contactar mejor amigo 2', freq: 'weekly',
    desc: 'Llamar, escribir o quedar con tu otro/a mejor amigo/a.',
    stats: { pre: 50, vol: 50 }, xp: 30,
    drops: { theme: 'amistad', items: ['token_amistad'] },
    sideQuest: {
      desc: 'Queda en persona o haz videollamada de 30+ min.',
      stats: { pre: 12, vol: 8 }, xp: 15,
      drops: ['sello_hermandad'],
      dropBonus: 15
    }
  },
  {
    id: 'social_4', cat: 'social', name: 'Llamar a familia', freq: 'biweekly',
    desc: 'Llamar a padres, hermanos, o familiares cercanos.',
    stats: { pre: 50, vol: 50 }, xp: 25,
    drops: { theme: 'vinculo', items: ['bendicion_familiar'] },
    sideQuest: {
      desc: 'Haz videollamada o planea una visita.',
      stats: { pre: 10, vol: 8 }, xp: 12,
      drops: ['lazo_sangre'],
      dropBonus: 10
    }
  },
  {
    id: 'social_5', cat: 'social', name: 'Plan con amigos', freq: 'monthly',
    desc: 'Organizar o asistir a un plan grupal.',
    stats: { pre: 50, vol: 30, des: 20 }, xp: 50,
    drops: { theme: 'amistad', items: ['recuerdo_aventura', 'hidromiel_camaraderia'] },
    sideQuest: {
      desc: 'Sé tú quien organiza y elige el plan.',
      stats: { pre: 15, int: 10 }, xp: 25,
      drops: ['corona_organizador'],
      dropBonus: 20
    }
  },

  // ========== PERSONAL ==========
  {
    id: 'personal_1', cat: 'personal', name: 'Sesión TTRPG (30 min)', freq: 'weekly',
    desc: 'Bloque de trabajo enfocado en el proyecto de TTRPG.',
    stats: { int: 30, vol: 50, pre: 20 }, xp: 50,
    drops: { theme: 'creacion', items: ['dado_destino', 'tinta_magica', 'fragmento_historia'] },
    sideQuest: {
      desc: 'Trabaja 1 hora completa o termina una sección.',
      stats: { int: 15, vol: 15 }, xp: 30,
      drops: ['pluma_creador', 'capitulo_terminado'],
      dropBonus: 25
    }
  },
  {
    id: 'personal_2', cat: 'personal', name: 'Práctica de chino (30 min)', freq: 'weekly',
    desc: 'Sesión de estudio de chino: app, vídeos, flashcards.',
    stats: { int: 40, vol: 60 }, xp: 50,
    drops: { theme: 'oriente', items: ['caracter_antiguo', 'talisman_oriental_early', 'jade_menor'] },
    sideQuest: {
      desc: 'Estudia 1 hora o incluye práctica de conversación.',
      stats: { int: 20, vol: 15 }, xp: 30,
      drops: ['escama_brillante', 'pergamino_sabiduria'],
      dropBonus: 25
    }
  },
  {
    id: 'personal_3', cat: 'personal', name: 'Journaling/reflexión', freq: 'weekly',
    desc: 'Escribir sobre cómo va la semana, qué has aprendido, qué quieres cambiar.',
    stats: { int: 40, vol: 50, pre: 10 }, xp: 25,
    drops: { theme: 'mente', items: ['pagina_reflexion', 'tinta_pensamiento'] },
    sideQuest: {
      desc: 'Escribe una página completa con objetivos claros.',
      stats: { int: 12, vol: 10 }, xp: 15,
      drops: ['claridad_mental'],
      dropBonus: 15
    }
  },
  {
    id: 'personal_4', cat: 'personal', name: 'Leer libro', freq: 'weekly',
    desc: 'Sesión de lectura de un libro (no manga).',
    stats: { int: 60, vol: 40 }, xp: 30,
    drops: { theme: 'conocimiento', items: ['pergamino_hechizo', 'conocimiento_antiguo'] },
    sideQuest: {
      desc: 'Lee un capítulo completo o 30+ páginas.',
      stats: { int: 15, vol: 8 }, xp: 15,
      drops: ['grimorio_menor', 'sabiduria_acumulada'],
      dropBonus: 15
    }
  },
  {
    id: 'personal_5', cat: 'personal', name: 'Digital detox (1h+)', freq: 'weekly',
    desc: 'Una hora o más sin pantallas.',
    stats: { vol: 70, vit: 30 }, xp: 35,
    drops: { theme: 'naturaleza', items: ['paz_interior', 'hoja_calma'] },
    sideQuest: {
      desc: 'Haz 2+ horas y sal al exterior.',
      stats: { vol: 20, vit: 10 }, xp: 20,
      drops: ['reconexion_natural', 'espiritu_libre'],
      dropBonus: 20
    }
  },
  {
    id: 'personal_6', cat: 'personal', name: 'Audiencia con el Oráculo', freq: 'monthly',
    desc: 'Revisar y actualizar tareas, contenido del juego, y narrativa con tu asistente.',
    stats: { int: 50, vol: 50 }, xp: 40,
    drops: { theme: 'destino', items: ['vision_futuro', 'bendicion_oraculo'] },
    sideQuest: {
      desc: 'Crea contenido nuevo: misiones, enemigos, o eventos.',
      stats: { int: 20, pre: 10 }, xp: 25,
      drops: ['fragmento_destino', 'profecia'],
      dropBonus: 25
    }
  },
  // Ocio (no drops, low VOL)
  {
    id: 'personal_7', cat: 'personal', name: 'Sesión videojuegos', freq: 'weekly',
    desc: 'Tiempo de ocio jugando a algo.',
    stats: { des: 50, vol: 20, int: 30 }, xp: 15,
    drops: null,
    sideQuest: null
  },
  {
    id: 'personal_8', cat: 'personal', name: 'Ver peli/serie', freq: 'weekly',
    desc: 'Tiempo de ocio viendo algo.',
    stats: { int: 40, vol: 30, pre: 30 }, xp: 15,
    drops: null,
    sideQuest: null
  },
  {
    id: 'personal_9', cat: 'personal', name: 'Leer manga', freq: 'weekly',
    desc: 'Tiempo de lectura de manga.',
    stats: { int: 50, vol: 30, des: 20 }, xp: 15,
    drops: null,
    sideQuest: null
  }
];

