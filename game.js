// ===========================================================================
// LifeXP RPG - Game Engine v1.0
// Bloque 1: Estructura base + Sistema de tareas + Stats
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
  daily: { name: 'Diaria', days: 1 },
  weekly: { name: 'Semanal', days: 7 },
  biweekly: { name: 'Quincenal', days: 14 },
  monthly: { name: 'Mensual', days: 30 },
  quarterly: { name: 'Trimestral', days: 90 },
  biannual: { name: 'Semestral', days: 180 },
  annual: { name: 'Anual', days: 365 }
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
    drops: { theme: 'agua_quimicos', items: ['Poción de Agua Menor', 'Veneno Básico', 'Frasco Vacío'] },
    sideQuest: {
      desc: 'Limpia también los azulejos de la ducha y organiza los productos bajo el lavabo.',
      stats: { vol: 8, int: 4 }, xp: 20,
      drops: ['Esencia Purificadora', 'Cristal de Limpieza'],
      dropBonus: 15
    }
  },
  {
    id: 'casa_2', cat: 'casa', name: 'Aspirar el comedor', freq: 'weekly',
    desc: 'Aspirar todo el suelo del comedor, incluyendo debajo de muebles accesibles.',
    stats: { vit: 50, vol: 50 }, xp: 30,
    drops: { theme: 'hallazgos', items: ['Moneda Antigua', 'Objeto Olvidado'] },
    sideQuest: {
      desc: 'Mueve todos los muebles y aspira también detrás de ellos.',
      stats: { vit: 10, vol: 5 }, xp: 15,
      drops: ['Moneda de Oro'],
      dropBonus: 20
    }
  },
  {
    id: 'casa_3', cat: 'casa', name: 'Fregar el suelo', freq: 'weekly',
    desc: 'Fregar suelos de las zonas principales de la casa.',
    stats: { vit: 50, vol: 50 }, xp: 30,
    drops: { theme: 'agua', items: ['Gota de Agua Pura'] },
    sideQuest: {
      desc: 'Usa producto especial y friega también los rincones difíciles.',
      stats: { vol: 8, vit: 4 }, xp: 12,
      drops: ['Esencia de Limpieza'],
      dropBonus: 10
    }
  },
  {
    id: 'casa_4', cat: 'casa', name: 'Limpiar cocina a fondo', freq: 'weekly',
    desc: 'Encimeras, vitrocerámica, fregadero, exterior de electrodomésticos.',
    stats: { vit: 40, vol: 60 }, xp: 50,
    drops: { theme: 'fuego', items: ['Grasa de Fuego', 'Espátula Encantada'] },
    sideQuest: {
      desc: 'Limpia también el interior del microondas y el horno por fuera.',
      stats: { vol: 10, vit: 5 }, xp: 20,
      drops: ['Llama Culinaria'],
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
    drops: { theme: 'sol_viento', items: ['Fragmento Solar', 'Pluma del Viento'] },
    sideQuest: {
      desc: 'Tiende cada prenda con cuidado para minimizar arrugas.',
      stats: { vol: 5, des: 3 }, xp: 8,
      drops: ['Brisa Atrapada'],
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
    drops: { theme: 'descanso', items: ['Pluma de Sueño', 'Esencia de Descanso'] },
    sideQuest: {
      desc: 'Rota el colchón y limpia el somier.',
      stats: { vit: 10, vol: 5 }, xp: 15,
      drops: ['Bendición del Descanso'],
      dropBonus: 15
    }
  },
  {
    id: 'casa_9', cat: 'casa', name: 'Ordenar el vestidor', freq: 'monthly',
    desc: 'Reorganizar ropa, revisar qué sobra, asegurar que todo tiene su sitio.',
    stats: { vol: 70, int: 30 }, xp: 50,
    drops: { theme: 'hallazgos', items: ['Prenda Olvidada', 'Monedas Antiguas'] },
    sideQuest: {
      desc: 'Haz purga seria: dona lo que no uses en 1 año.',
      stats: { vol: 15, int: 10 }, xp: 25,
      drops: ['Amuleto de Espacio'],
      dropBonus: 20
    }
  },
  {
    id: 'casa_10', cat: 'casa', name: 'Limpiar terraza superior', freq: 'monthly',
    desc: 'Barrer/fregar suelo, limpiar barandilla, revisar tendedero.',
    stats: { vit: 60, vol: 40 }, xp: 30,
    drops: { theme: 'sol_viento', items: ['Cristal Solar', 'Pluma de Viento'] },
    sideQuest: {
      desc: 'Limpia también los cristales y las macetas.',
      stats: { vit: 8, vol: 5 }, xp: 12,
      drops: ['Luz Atrapada'],
      dropBonus: 15
    }
  },
  {
    id: 'casa_11', cat: 'casa', name: 'Batch cooking semanal', freq: 'weekly',
    desc: 'Cocinar varias comidas para la semana en una sesión.',
    stats: { vol: 30, int: 40, vit: 30 }, xp: 50,
    drops: { theme: 'fuego_comida', items: ['Ración de Combate', 'Gema de Fuego Menor', 'Especia Rara'] },
    sideQuest: {
      desc: 'Prepara 5+ comidas diferentes y congela porciones extra.',
      stats: { int: 15, vol: 10 }, xp: 25,
      drops: ['Receta Secreta', 'Elixir de Vitalidad'],
      dropBonus: 20
    }
  },
  {
    id: 'casa_12', cat: 'casa', name: 'Hacer la compra', freq: 'weekly',
    desc: 'Ir al supermercado con lista preparada.',
    stats: { vol: 30, int: 30, pre: 40 }, xp: 30,
    drops: { theme: 'comercio', items: ['Monedas', 'Ingrediente Especial'] },
    sideQuest: {
      desc: 'Compara precios y encuentra al menos 3 ofertas.',
      stats: { int: 10, pre: 5 }, xp: 15,
      drops: ['Ojo del Comerciante'],
      dropBonus: 15
    }
  },
  {
    id: 'casa_13', cat: 'casa', name: 'Limpiar dormitorio', freq: 'weekly',
    desc: 'Hacer la cama a fondo, quitar polvo, ordenar mesitas.',
    stats: { vit: 50, vol: 50 }, xp: 30,
    drops: { theme: 'descanso', items: ['Polvo de Sueño'] },
    sideQuest: {
      desc: 'Reorganiza los cajones y limpia debajo de la cama.',
      stats: { vol: 8, vit: 5 }, xp: 12,
      drops: ['Cristal de Tranquilidad'],
      dropBonus: 10
    }
  },
  {
    id: 'casa_14', cat: 'casa', name: 'Mantenimiento plantas', freq: 'weekly',
    desc: 'Regar, revisar estado, podar si hace falta.',
    stats: { vol: 30, vit: 40, pre: 30 }, xp: 20,
    drops: { theme: 'naturaleza', items: ['Hoja Curativa', 'Semilla Rara', 'Rocío Matutino'] },
    sideQuest: {
      desc: 'Trasplanta alguna planta o añade abono a todas.',
      stats: { vit: 8, int: 5 }, xp: 15,
      drops: ['Espíritu del Jardín', 'Flor Luminosa'],
      dropBonus: 20
    }
  },
  {
    id: 'casa_15', cat: 'casa', name: 'Limpieza profunda nevera', freq: 'monthly',
    desc: 'Vaciar nevera, limpiar baldas, revisar caducidades, reorganizar.',
    stats: { vit: 40, vol: 60 }, xp: 40,
    drops: { theme: 'hielo', items: ['Fragmento de Hielo', 'Escarcha Eterna'] },
    sideQuest: {
      desc: 'Limpia también el congelador y descongela si hace falta.',
      stats: { vit: 10, vol: 10 }, xp: 20,
      drops: ['Cristal de Hielo Puro'],
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
    drops: { theme: 'exploracion', items: ['Mapa de Zona', 'Piedra del Camino', 'Monedas'] },
    sideQuest: {
      desc: 'Haz más de 5km o explora una ruta nueva.',
      stats: { vit: 12, des: 10 }, xp: 20,
      drops: ['Botas de Viajero', 'Amuleto del Explorador'],
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
    drops: { theme: 'mente', items: ['Orbe de Claridad', 'Incienso Místico'] },
    sideQuest: {
      desc: 'Medita 20+ minutos o prueba una técnica nueva.',
      stats: { vol: 15, int: 10 }, xp: 15,
      drops: ['Foco Interior', 'Mente de Cristal'],
      dropBonus: 20
    }
  },
  {
    id: 'cuerpo_6', cat: 'cuerpo', name: 'Natación', freq: 'monthly',
    desc: 'Sesión de natación en piscina.',
    stats: { vit: 35, des: 30, fue: 25, vol: 10 }, xp: 50,
    drops: { theme: 'agua_profunda', items: ['Perla Marina', 'Escama Brillante', 'Coral Mágico'] },
    sideQuest: {
      desc: 'Nada más de 1km o practica un estilo nuevo.',
      stats: { vit: 15, des: 10 }, xp: 25,
      drops: ['Tridente Menor', 'Bendición del Mar'],
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
    drops: { theme: 'oro', items: ['Bolsa de Oro Grande', 'Lingote de Oro'] },
    sideQuest: {
      desc: 'Revisa todas las deducciones posibles y optimiza.',
      stats: { int: 20, vol: 15 }, xp: 50,
      drops: ['Sabiduría Fiscal', 'Corona del Contribuyente'],
      dropBonus: 30
    }
  },
  {
    id: 'gestiones_2', cat: 'gestiones', name: 'Revisar finanzas/presupuesto', freq: 'monthly',
    desc: 'Revisar gastos, ingresos, ajustar presupuesto.',
    stats: { int: 50, vol: 50 }, xp: 35,
    drops: { theme: 'oro', items: ['Monedas de Oro', 'Gema Menor'] },
    sideQuest: {
      desc: 'Crea un plan de ahorro o inversión nuevo.',
      stats: { int: 15, vol: 10 }, xp: 20,
      drops: ['Ojo del Comerciante'],
      dropBonus: 15
    }
  },
  {
    id: 'gestiones_3', cat: 'gestiones', name: 'Backup de datos', freq: 'monthly',
    desc: 'Hacer copia de seguridad de fotos, documentos importantes, etc.',
    stats: { int: 60, vol: 40 }, xp: 25,
    drops: { theme: 'conocimiento', items: ['Cristal de Memoria', 'Pergamino en Blanco'] },
    sideQuest: {
      desc: 'Organiza los archivos y elimina duplicados.',
      stats: { int: 12, vol: 8 }, xp: 15,
      drops: ['Biblioteca Personal'],
      dropBonus: 10
    }
  },
  {
    id: 'gestiones_4', cat: 'gestiones', name: 'Limpiar email/bandeja', freq: 'weekly',
    desc: 'Procesar emails pendientes, archivar, borrar spam.',
    stats: { vol: 60, int: 40 }, xp: 20,
    drops: { theme: 'comercio', items: ['Mensaje Importante', 'Llave Olvidada'] },
    sideQuest: {
      desc: 'Llega a inbox zero y configura filtros nuevos.',
      stats: { int: 10, vol: 8 }, xp: 12,
      drops: ['Sello de Eficiencia'],
      dropBonus: 10
    }
  },
  {
    id: 'gestiones_5', cat: 'gestiones', name: 'Planificar la semana', freq: 'weekly',
    desc: 'Revisar calendario, priorizar tareas, planificar.',
    stats: { int: 50, vol: 50 }, xp: 25,
    drops: { theme: 'conocimiento', items: ['Pergamino de Planificación'] },
    sideQuest: {
      desc: 'Define objetivos claros y time-blocks.',
      stats: { int: 10, vol: 10 }, xp: 15,
      drops: ['Agenda Encantada'],
      dropBonus: 15
    }
  },

  // ========== SOCIAL ==========
  {
    id: 'social_1', cat: 'social', name: 'Fecha especial con pareja', freq: 'weekly',
    desc: 'Tiempo de calidad dedicado solo a la relación.',
    stats: { pre: 40, vit: 30, vol: 30 }, xp: 50,
    drops: { theme: 'vinculo', items: ['Recuerdo Especial', 'Lazo de Conexión'] },
    sideQuest: {
      desc: 'Planea algo nuevo o sorprende con un detalle.',
      stats: { pre: 15, int: 10 }, xp: 25,
      drops: ['Anillo de Vínculo', 'Flor Eterna'],
      dropBonus: 20
    }
  },
  {
    id: 'social_2', cat: 'social', name: 'Contactar mejor amigo 1', freq: 'weekly',
    desc: 'Llamar, escribir o quedar con tu mejor amigo/a.',
    stats: { pre: 50, vol: 50 }, xp: 30,
    drops: { theme: 'amistad', items: ['Token de Amistad'] },
    sideQuest: {
      desc: 'Queda en persona o haz videollamada de 30+ min.',
      stats: { pre: 12, vol: 8 }, xp: 15,
      drops: ['Sello de Hermandad'],
      dropBonus: 15
    }
  },
  {
    id: 'social_3', cat: 'social', name: 'Contactar mejor amigo 2', freq: 'weekly',
    desc: 'Llamar, escribir o quedar con tu otro/a mejor amigo/a.',
    stats: { pre: 50, vol: 50 }, xp: 30,
    drops: { theme: 'amistad', items: ['Token de Amistad'] },
    sideQuest: {
      desc: 'Queda en persona o haz videollamada de 30+ min.',
      stats: { pre: 12, vol: 8 }, xp: 15,
      drops: ['Sello de Hermandad'],
      dropBonus: 15
    }
  },
  {
    id: 'social_4', cat: 'social', name: 'Llamar a familia', freq: 'biweekly',
    desc: 'Llamar a padres, hermanos, o familiares cercanos.',
    stats: { pre: 50, vol: 50 }, xp: 25,
    drops: { theme: 'vinculo', items: ['Bendición Familiar'] },
    sideQuest: {
      desc: 'Haz videollamada o planea una visita.',
      stats: { pre: 10, vol: 8 }, xp: 12,
      drops: ['Lazo de Sangre'],
      dropBonus: 10
    }
  },
  {
    id: 'social_5', cat: 'social', name: 'Plan con amigos', freq: 'monthly',
    desc: 'Organizar o asistir a un plan grupal.',
    stats: { pre: 50, vol: 30, des: 20 }, xp: 50,
    drops: { theme: 'amistad', items: ['Recuerdo de Aventura', 'Hidromiel de Camaradería'] },
    sideQuest: {
      desc: 'Sé tú quien organiza y elige el plan.',
      stats: { pre: 15, int: 10 }, xp: 25,
      drops: ['Corona del Organizador'],
      dropBonus: 20
    }
  },

  // ========== PERSONAL ==========
  {
    id: 'personal_1', cat: 'personal', name: 'Sesión TTRPG (30 min)', freq: 'weekly',
    desc: 'Bloque de trabajo enfocado en el proyecto de TTRPG.',
    stats: { int: 30, vol: 50, pre: 20 }, xp: 50,
    drops: { theme: 'creacion', items: ['Dado del Destino', 'Tinta Mágica', 'Fragmento de Historia'] },
    sideQuest: {
      desc: 'Trabaja 1 hora completa o termina una sección.',
      stats: { int: 15, vol: 15 }, xp: 30,
      drops: ['Pluma del Creador', 'Capítulo Terminado'],
      dropBonus: 25
    }
  },
  {
    id: 'personal_2', cat: 'personal', name: 'Práctica de chino (30 min)', freq: 'weekly',
    desc: 'Sesión de estudio de chino: app, vídeos, flashcards.',
    stats: { int: 40, vol: 60 }, xp: 50,
    drops: { theme: 'oriente', items: ['Carácter Antiguo', 'Talismán Oriental', 'Jade Menor'] },
    sideQuest: {
      desc: 'Estudia 1 hora o incluye práctica de conversación.',
      stats: { int: 20, vol: 15 }, xp: 30,
      drops: ['Escama de Dragón', 'Pergamino de Sabiduría'],
      dropBonus: 25
    }
  },
  {
    id: 'personal_3', cat: 'personal', name: 'Journaling/reflexión', freq: 'weekly',
    desc: 'Escribir sobre cómo va la semana, qué has aprendido, qué quieres cambiar.',
    stats: { int: 40, vol: 50, pre: 10 }, xp: 25,
    drops: { theme: 'mente', items: ['Página de Reflexión', 'Tinta de Pensamiento'] },
    sideQuest: {
      desc: 'Escribe una página completa con objetivos claros.',
      stats: { int: 12, vol: 10 }, xp: 15,
      drops: ['Claridad Mental'],
      dropBonus: 15
    }
  },
  {
    id: 'personal_4', cat: 'personal', name: 'Leer libro', freq: 'weekly',
    desc: 'Sesión de lectura de un libro (no manga).',
    stats: { int: 60, vol: 40 }, xp: 30,
    drops: { theme: 'conocimiento', items: ['Pergamino de Hechizo', 'Conocimiento Antiguo'] },
    sideQuest: {
      desc: 'Lee un capítulo completo o 30+ páginas.',
      stats: { int: 15, vol: 8 }, xp: 15,
      drops: ['Grimorio Menor', 'Sabiduría Acumulada'],
      dropBonus: 15
    }
  },
  {
    id: 'personal_5', cat: 'personal', name: 'Digital detox (1h+)', freq: 'weekly',
    desc: 'Una hora o más sin pantallas.',
    stats: { vol: 70, vit: 30 }, xp: 35,
    drops: { theme: 'naturaleza', items: ['Paz Interior', 'Hoja de Calma'] },
    sideQuest: {
      desc: 'Haz 2+ horas y sal al exterior.',
      stats: { vol: 20, vit: 10 }, xp: 20,
      drops: ['Reconexión Natural', 'Espíritu Libre'],
      dropBonus: 20
    }
  },
  {
    id: 'personal_6', cat: 'personal', name: 'Audiencia con el Oráculo', freq: 'monthly',
    desc: 'Revisar y actualizar tareas, contenido del juego, y narrativa con tu asistente.',
    stats: { int: 50, vol: 50 }, xp: 40,
    drops: { theme: 'destino', items: ['Visión del Futuro', 'Bendición del Oráculo'] },
    sideQuest: {
      desc: 'Crea contenido nuevo: misiones, enemigos, o eventos.',
      stats: { int: 20, pre: 10 }, xp: 25,
      drops: ['Fragmento de Destino', 'Profecía'],
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

// ===========================================================================
// GAME STATE
// ===========================================================================

let gameState = {
  // Player
  name: 'Aventurero',
  level: 1,
  xp: 0,
  gold: 0,
  streak: 0,
  lastActiveDate: null,
  
  // Stats
  stats: {
    fue: 10,
    vit: 10,
    des: 10,
    int: 10,
    vol: 10,
    pre: 10
  },
  
  // Tasks
  tasks: [],
  savedTasks: [], // IDs of saved for later
  taskHistory: [], // { taskId, date, xp, sideQuest }
  
  // Inventory (placeholder for next block)
  inventory: [],
  equipment: {
    weapon: null,
    armor: null,
    accessory1: null,
    accessory2: null,
    artifact: null
  },
  stash: [],
  stashCapacity: 30,
  inventoryCapacityBonus: 0,
  pendingLoot: null,
  saveVersion: 2,
  
  // Class (placeholder for next block)
  classId: 'novato',
  classLevel: 1,
  
  // Quests (placeholder)
  activeQuests: [],
  completedQuests: [],
  
  // Guild / Coop
  guildId: null,
  guildName: null,
  guildMembers: [], // { odeName, oderId, lastSync }
  pendingReceipts: [], // receipts generated but not yet shared
  receivedReceipts: [], // receipts received from others
  lastReceiptId: 0
};

// Current task being viewed
let currentTask = null;
let currentIsOverflow = false;
let currentCatFilter = null;

// Timer state
let timerInterval = null;
let timerSeconds = 0;
let timerRunning = false;

// ===========================================================================
// UTILITY FUNCTIONS
// ===========================================================================

function todayStr() {
  return new Date().toISOString().slice(0, 10);
}

function daysBetween(date1, date2) {
  const d1 = new Date(date1);
  const d2 = new Date(date2);
  return Math.floor((d2 - d1) / (1000 * 60 * 60 * 24));
}

function xpForLevel(level) {
  return Math.floor(100 * Math.pow(1.4, level - 1));
}

function getXpProgress() {
  const needed = xpForLevel(gameState.level);
  const pct = Math.min(100, Math.round((gameState.xp / needed) * 100));
  return { current: gameState.xp, needed, pct };
}

function addXp(amount) {
  gameState.xp += amount;
  let leveledUp = false;
  while (gameState.xp >= xpForLevel(gameState.level)) {
    gameState.xp -= xpForLevel(gameState.level);
    gameState.level++;
    leveledUp = true;
  }
  if (leveledUp) {
    // Trigger level up effects
    if (typeof showLevelUpEffect === 'function') showLevelUpEffect();
    if (typeof triggerHaptic === 'function') triggerHaptic();
    if (typeof showToast === 'function') showToast(`¡Nivel ${gameState.level}!`, 'gold');
  }
  return leveledUp;
}

function addStats(statsObj) {
  // statsObj is like { fue: 50, vit: 30 } where values are percentages
  // We convert to actual stat points (simplified: 1 point per 10%)
  for (const [stat, pct] of Object.entries(statsObj)) {
    if (STATS[stat]) {
      const points = Math.max(1, Math.floor(pct / 10));
      gameState.stats[stat] += points;
    }
  }
}

function getMaxStat() {
  return Math.max(...Object.values(gameState.stats));
}

// ===========================================================================
// TASK LOGIC
// ===========================================================================

function getTaskById(id) {
  return gameState.tasks.find(t => t.id === id);
}

function isTaskDue(task) {
  if (!task.lastDone) return true;
  const daysSince = daysBetween(task.lastDone, todayStr());
  return daysSince >= FREQ[task.freq].days;
}

function isTaskOverdue(task) {
  if (!task.lastDone) return false;
  const daysSince = daysBetween(task.lastDone, todayStr());
  return daysSince > FREQ[task.freq].days * 1.5;
}

function getOverflowTasks() {
  return gameState.tasks.filter(t => isTaskOverdue(t));
}

function getAvailableTasks(cat = null) {
  let tasks = gameState.tasks;
  if (cat) tasks = tasks.filter(t => t.cat === cat);
  
  const overflow = tasks.filter(t => isTaskOverdue(t));
  if (overflow.length > 0) return { tasks: overflow, isOverflow: true };
  
  const due = tasks.filter(t => isTaskDue(t));
  if (due.length > 0) return { tasks: due, isOverflow: false };
  
  return { tasks, isOverflow: false };
}

function pickRandomTask(tasks) {
  return tasks[Math.floor(Math.random() * tasks.length)];
}

function getPendingCount(cat) {
  const tasks = gameState.tasks.filter(t => t.cat === cat);
  return tasks.filter(t => isTaskDue(t)).length;
}

function getOverflowCount(cat) {
  const tasks = gameState.tasks.filter(t => t.cat === cat);
  return tasks.filter(t => isTaskOverdue(t)).length;
}

// ===========================================================================
// DROP SYSTEM
// ===========================================================================



// ===========================================================================
// SAVE/LOAD
// ===========================================================================

function saveGame() {
  try {
    localStorage.setItem('lifexp_save', JSON.stringify(gameState));
  } catch (e) {
    console.warn('Could not save game:', e);
  }
}

// ---------------------------------------------------------------------------
// migrateQuestState — convierte el formato legacy (activeQuests[]/completedQuests[])
// al formato canónico de quests.js (gameState.quests.*).
// Idempotente: si ya existe gameState.quests, no hace nada.
// ---------------------------------------------------------------------------
function migrateQuestState() {
  // Already migrated or fresh save
  if (gameState.quests && Array.isArray(gameState.quests.active)) return;

  // Build canonical quests namespace
  gameState.quests = {
    active: [],
    completed: Array.isArray(gameState.completedQuests) ? [...gameState.completedQuests] : [],
    failed: [],
    dailyReset: null
  };

  // Migrate active quests from legacy format
  const legacy = Array.isArray(gameState.activeQuests) ? gameState.activeQuests : [];
  for (const qs of legacy) {
    const questId = qs.questId;
    if (!questId || typeof QUESTS === 'undefined' || !QUESTS[questId]) continue;
    const quest = QUESTS[questId];
    gameState.quests.active.push(questId);
    // Best-effort objective migration: reset progress (legacy format is incompatible)
    gameState.quests[questId] = {
      startedAt: qs.startedAt || todayStr(),
      objectives: quest.objectives ? quest.objectives.map(o => ({ ...o, progress: 0 })) : [],
      currentChapter: 0
    };
  }

  // Keep legacy fields for any code that still reads them (will be cleaned in Fase G)
  // gameState.activeQuests and gameState.completedQuests remain as-is.
}

function loadGame() {
  try {
    const saved = localStorage.getItem('lifexp_save');
    if (saved) {
      const parsed = JSON.parse(saved);
      gameState = { ...gameState, ...parsed };
      gameState.inventory = Array.isArray(gameState.inventory) ? gameState.inventory : [];
      gameState.stash = Array.isArray(gameState.stash) ? gameState.stash : [];
      gameState.stashCapacity = Number.isFinite(gameState.stashCapacity) ? gameState.stashCapacity : 30;
      gameState.inventoryCapacityBonus = Number.isFinite(gameState.inventoryCapacityBonus) ? gameState.inventoryCapacityBonus : 0;
      gameState.pendingLoot = gameState.pendingLoot || null;
      gameState.saveVersion = 3;
    }
  } catch (e) {
    console.warn('Could not load game:', e);
  }
  
  // Initialize tasks if empty
  if (!gameState.tasks || gameState.tasks.length === 0) {
    gameState.tasks = JSON.parse(JSON.stringify(DEFAULT_TASKS));
  }
  
  // Recover legacy item entries before rendering the inventory.
  if (typeof migrateLegacyInventory === 'function') migrateLegacyInventory();
  if (typeof initializeItemSystem === 'function') initializeItemSystem();
  if (typeof repairInventoryIdentities === 'function') repairInventoryIdentities();

  // Merge official content added in later versions without touching custom task data.
  const existingTaskIds = new Set((gameState.tasks || []).map(task => task.id));
  for (const officialTask of DEFAULT_TASKS) {
    if (!existingTaskIds.has(officialTask.id)) {
      gameState.tasks.push(JSON.parse(JSON.stringify(officialTask)));
    }
  }

  // Migrate legacy quest format (activeQuests[] -> gameState.quests)
  if (typeof migrateQuestState === 'function') migrateQuestState();

  // Update streak
  updateStreak();
}

function updateStreak() {
  const today = todayStr();
  if (gameState.lastActiveDate === today) return;
  
  if (gameState.lastActiveDate) {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().slice(0, 10);
    
    if (gameState.lastActiveDate < yesterdayStr) {
      gameState.streak = 0;
    }
  }
}

// ===========================================================================
// UI RENDERING
// ===========================================================================

function showScreen(screenId) {
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  document.getElementById(`screen-${screenId}`).classList.add('active');
  
  document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
  document.querySelector(`.nav-item[data-screen="${screenId}"]`)?.classList.add('active');
  
  // Render screen content
  if (screenId === 'hub') renderHub();
  else if (screenId === 'character') renderCharacter();
  else if (screenId === 'inventory') renderInventory();
  else if (screenId === 'quests') renderQuests();
  else if (screenId === 'guild') renderGuild();
  else if (screenId === 'settings') renderSettings();
}

function renderHub() {
  // Header stats
  document.getElementById('hub-streak').textContent = gameState.streak;
  document.getElementById('hub-gold').textContent = gameState.gold;
  document.getElementById('hub-level').textContent = gameState.level;
  
  const xpProg = getXpProgress();
  document.getElementById('hub-xp').textContent = xpProg.current;
  document.getElementById('hub-xp-next').textContent = xpProg.needed;
  document.getElementById('hub-xp-fill').style.width = xpProg.pct + '%';
  
  // Alerts
  const alertsDiv = document.getElementById('hub-alerts');
  alertsDiv.innerHTML = '';
  
  // Overflow alert
  const overflow = getOverflowTasks();
  if (overflow.length > 0) {
    alertsDiv.innerHTML += `
      <div class="alert alert-overflow" onclick="showOverflowTasks()">
        <div class="alert-icon">⚡</div>
        <div class="alert-text"><strong>${overflow.length} overflow</strong> — tienen prioridad</div>
      </div>
    `;
  }
  
  // Saved tasks alert
  if (gameState.savedTasks.length > 0) {
    alertsDiv.innerHTML += `
      <div class="alert alert-saved" onclick="showSavedTasks()">
        <div class="alert-icon">\uD83D\uDCCC</div>
        <div class="alert-text"><strong>${gameState.savedTasks.length} guardadas</strong> para luego</div>
      </div>
    `;
  }
  
  // Categories
  const catGrid = document.getElementById('hub-categories');
  catGrid.innerHTML = '';
  
  for (const [catId, cat] of Object.entries(CATEGORIES)) {
    const pending = getPendingCount(catId);
    const overflowCount = getOverflowCount(catId);
    
    catGrid.innerHTML += `
      <div class="cat-card" data-cat="${catId}" onclick="openCategory('${catId}')">
        <div class="cat-icon">${cat.icon}</div>
        <div class="cat-name">${cat.name}</div>
        <div class="cat-pending">${pending} pendiente${pending !== 1 ? 's' : ''}</div>
        ${overflowCount > 0 ? `<div class="cat-overflow">⚡${overflowCount}</div>` : ''}
      </div>
    `;
  }
}

function renderCharacter() {
  const level = gameState.level;
  const classId = gameState.classId;
  const cls = classId && classId !== 'novato' ? CLASS_TREE[classId] : null;
  
  // Basic info
  document.getElementById('char-name').textContent = gameState.name;
  document.getElementById('char-class-icon').textContent = cls ? cls.icon : '\uD83E\uDDD1‍\uD83C\uDF3E';
  document.getElementById('char-class-name').textContent = cls ? cls.name : 'Novato';
  document.getElementById('char-level').textContent = level;
  document.getElementById('char-tier-name').textContent = cls ? `Clase ${getTierName(cls.tier)}` : 'Sin clase';
  
  // XP bar
  const xpProgress = getXpProgress();
  document.getElementById('char-xp-text').textContent = `${xpProgress.current} / ${xpProgress.needed}`;
  document.getElementById('char-xp-bar').style.width = `${xpProgress.pct}%`;
  
  // Class change button
  const availableChanges = getAvailableClassChanges(classId === 'novato' ? null : classId, level);
  const classChangeSection = document.getElementById('class-change-section');
  if (availableChanges.length > 0) {
    classChangeSection.classList.remove('hidden');
  } else {
    classChangeSection.classList.add('hidden');
  }
  
  // Stats with class bonuses
  const baseStats = gameState.stats;
  const derivedStats = calculateDerivedStats(baseStats, classId === 'novato' ? null : classId);
  
  const statsGrid = document.getElementById('char-stats-grid');
  statsGrid.innerHTML = '';
  
  const maxStat = Math.max(...Object.values(derivedStats));
  
  for (const [statId, stat] of Object.entries(STATS)) {
    const baseValue = baseStats[statId] || 0;
    const totalValue = derivedStats[statId] || 0;
    const bonus = totalValue - baseValue;
    const pct = Math.round((totalValue / maxStat) * 100);
    
    statsGrid.innerHTML += `
      <div class="stat-item" data-stat="${statId}">
        <div class="stat-header">
          <div class="stat-name">${stat.abbr}</div>
          <div class="stat-value">${totalValue}${bonus > 0 ? ` <span style="color: var(--green); font-size: 11px;">(+${bonus})</span>` : ''}</div>
        </div>
        <div class="stat-bar">
          <div class="stat-fill" style="width: ${pct}%"></div>
        </div>
      </div>
    `;
  }
  
  // Combat resources
  const resources = calculateResources(derivedStats);
  document.getElementById('char-resources').innerHTML = `
    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px;">
      <div style="text-align: center;">
        <div style="font-size: 24px; color: var(--red);">❤️ ${resources.hp}</div>
        <div style="font-size: 11px; color: var(--text-muted);">HP</div>
      </div>
      <div style="text-align: center;">
        <div style="font-size: 24px; color: var(--blue);">\uD83D\uDCA7 ${resources.mp}</div>
        <div style="font-size: 11px; color: var(--text-muted);">MP</div>
      </div>
      <div style="text-align: center;">
        <div style="font-size: 24px; color: var(--green);">⚡ ${resources.sp}</div>
        <div style="font-size: 11px; color: var(--text-muted);">SP</div>
      </div>
      <div style="text-align: center;">
        <div style="font-size: 24px; color: var(--purple);">\uD83C\uDFAF ${resources.focusMax}</div>
        <div style="font-size: 11px; color: var(--text-muted);">Focus Max</div>
      </div>
    </div>
  `;
  
  // Class path
  const classPath = document.getElementById('char-class-path');
  if (classId && classId !== 'novato') {
    const chain = getClassChain(classId);
    classPath.innerHTML = chain.map((cId, i) => {
      const c = CLASS_TREE[cId];
      return `<span style="color: var(--gold);">${c.icon} ${c.name}</span>`;
    }).join(' → ');
  } else {
    classPath.innerHTML = '<span style="color: var(--text-muted);">Aún no has elegido una clase. Alcanza nivel 10 para desbloquear la primera.</span>';
  }
}

let currentInventoryTab = 'inventory';
let selectedItemId = null;

function switchInventoryTab(tab) {
  currentInventoryTab = tab;
  document.querySelectorAll('.inv-tab').forEach(t => t.classList.remove('active'));
  document.querySelector(`.inv-tab[data-tab="${tab}"]`)?.classList.add('active');
  document.getElementById('inv-tab-inventory')?.classList.toggle('hidden', tab !== 'inventory');
  document.getElementById('inv-tab-stash')?.classList.toggle('hidden', tab !== 'stash');
  document.getElementById('inv-tab-equipment')?.classList.toggle('hidden', tab !== 'equipment');
  renderInventory();
}

function renderInventory() {
  const capacity = typeof getInventoryCapacity === 'function' ? getInventoryCapacity() : 20;
  const count = gameState.inventory.reduce((sum, i) => sum + (i.qty || 1), 0);
  document.getElementById('inv-count').textContent = `${count}/${capacity}`;
  const stashCount = (gameState.stash || []).reduce((sum, i) => sum + (i.qty || 1), 0);
  const stashLabel = document.getElementById('stash-count');
  if (stashLabel) stashLabel.textContent = `${stashCount}/${gameState.stashCapacity || 30}`;
  
  if (currentInventoryTab === 'stash') {
    renderStashGrid();
  } else if (currentInventoryTab === 'equipment') {
    renderEquipment();
  } else {
    renderInventoryGrid();
  }
}



function showStashItemModal(itemId) {
  showItemModal(itemId, 'stash');
}

function moveItemToStash(itemId) {
  if (!moveBetweenContainers(itemId, 'inventory', 'stash')) {
    showToast('El baúl está lleno.', 'error');
    return;
  }
  saveGame(); closeModal('modal-item'); renderInventory();
}

function moveItemToInventory(itemId) {
  if (!moveBetweenContainers(itemId, 'stash', 'inventory')) {
    showToast('No hay espacio en el inventario.', 'error');
    return;
  }
  saveGame(); closeModal('modal-item'); renderInventory();
}

function renderEquipment() {
  const slots = document.getElementById('equipment-slots');
  const statsDiv = document.getElementById('equipment-stats');
  if (!slots) return;
  
  const slotConfig = [
    { key: 'weapon', name: 'Arma', icon: '⚔️' },
    { key: 'armor', name: 'Armadura', icon: '\uD83D\uDEE1️' },
    { key: 'accessory1', name: 'Accesorio 1', icon: '\uD83D\uDC8D' },
    { key: 'accessory2', name: 'Accesorio 2', icon: '\uD83D\uDC8D' },
    { key: 'artifact', name: 'Artefacto', icon: '\uD83D\uDD2E' }
  ];
  
  slots.innerHTML = '';
  
  for (const cfg of slotConfig) {
    const itemId = gameState.equipment[cfg.key];
    const item = itemId && typeof ITEMS !== 'undefined' ? ITEMS[itemId] : null;
    const rarity = item && typeof RARITY !== 'undefined' ? RARITY[item.rarity] : null;
    
    slots.innerHTML += `
      <div class="equip-slot" onclick="${item ? `showEquippedItemModal('${cfg.key}')` : ''}"
           style="background: var(--bg-surface); border: 2px solid ${rarity ? rarity.color : 'var(--border)'}; 
                  border-radius: 8px; padding: 12px; text-align: center; cursor: ${item ? 'pointer' : 'default'};">
        <div style="font-size: 28px;">${item ? item.icon : cfg.icon}</div>
        <div style="font-size: 11px; color: ${item ? rarity.color : 'var(--text-muted)'}; margin-top: 4px;">
          ${item ? item.name : cfg.name}
        </div>
      </div>
    `;
  }
  
  // Equipment stats
  if (typeof getEquipmentStats === 'function' && statsDiv) {
    const eqStats = getEquipmentStats();
    const hasStats = Object.values(eqStats).some(v => v > 0);
    
    if (hasStats) {
      statsDiv.innerHTML = Object.entries(eqStats)
        .filter(([_, v]) => v > 0)
        .map(([stat, val]) => `<span style="color: var(--stat-${stat}); margin-right: 12px;">${STATS[stat].abbr} +${val}</span>`)
        .join('');
    } else {
      statsDiv.innerHTML = '<span style="color: var(--text-muted);">Sin equipo</span>';
    }
  }
}


function showLegacyItemModal(slotIndex) {
  const slot = gameState.inventory?.[slotIndex];
  if (!slot) return;
  const oldName = slot.name || slot.legacyName || 'Recompensa sin identificar';
  const used = Boolean(slot.recoveryUsed);
  document.getElementById('modal-item-content').innerHTML = `
    <div style="text-align:center;margin-bottom:12px;">
      <div style="font-size:48px;">❔</div>
      <div style="font-size:18px;font-weight:700;color:var(--orange);">Recompensa ilegible</div>
      <div style="font-size:12px;color:var(--text-muted);">${oldName}</div>
    </div>
    <div style="font-size:13px;color:var(--text);line-height:1.5;">Esta recompensa procede de una versión antigua y no conserva un identificador válido. Puedes intentar reconstruirla o rehacerla una sola vez sin perder progreso.</div>
    <div style="margin-top:10px;font-size:11px;color:var(--text-muted);">El reroll de emergencia es una herramienta de recuperación de datos, no una mecánica normal.</div>
  `;
  const actionBtn = document.getElementById('btn-item-action');
  actionBtn.textContent = used ? 'Recuperación ya usada' : '\uD83D\uDD04 Rehacer recompensa';
  actionBtn.disabled = used;
  actionBtn.onclick = () => {
    if (used || typeof emergencyRerollLegacyItem !== 'function') return;
    const result = emergencyRerollLegacyItem(slotIndex);
    if (!result.success) { showToast('No se pudo recuperar la recompensa.', 'error'); return; }
    closeModal('modal-item');
    renderInventory();
    showToast(result.method === 'name' ? 'Recompensa reconstruida.' : 'Recompensa rehecha.', 'gold');
  };
  openModal('modal-item');
}


function equipItemFromInventory(itemId) {
  initializeItemSystem();
  if (!gameState.itemSystem.equipAttempts) gameState.itemSystem.equipAttempts = {};
  var prevAttempts = gameState.itemSystem.equipAttempts[itemId] || 0;

  if (equipItem(itemId)) {
    // Track first successful equip
    if (!gameState.itemSystem.firstEquipped) gameState.itemSystem.firstEquipped = {};
    var isFirst = !gameState.itemSystem.firstEquipped[itemId];
    gameState.itemSystem.firstEquipped[itemId] = true;
    saveGame();
    closeModal('modal-item');
    renderInventory();
    renderCharacter();
    // Show equip_success flavor on first equip
    if (isFirst && typeof showToast === 'function') {
      var successText = getItemFlavorText(itemId, 'equip_success');
      showFlavorDialog(successText, 'success');
    }
  } else {
    // Record the attempt
    gameState.itemSystem.equipAttempts[itemId] = prevAttempts + 1;
    saveGame();

    // Show flavor toast — evocative, not a stat sheet
    var situation = prevAttempts === 0 ? 'equip_fail_1' : 'equip_fail_n';
    var flavor = getItemFlavorText(itemId, situation);
    showFlavorDialog(flavor, 'error');

    // Refresh modal so the hint appears
    showItemModal(itemId, 'inventory');
  }
}


// == ATTUNEMENT FLAVOR TRIGGER =================================================
function showAttunementFlavor(itemId, newStage) {
  var text = getItemFlavorText(itemId, 'attune_' + newStage);
  showFlavorDialog(text, 'success');
}

// == RITUAL FLAVOR TRIGGER =====================================================
function showRitualFlavor(itemId) {
  var text = getItemFlavorText(itemId, 'ritual');
  showFlavorDialog(text, 'success');
}

// == LEGACY SHIM ===============================================================
function _getEquipFlavorText(itemId) {
  var attempts = (gameState.itemSystem && gameState.itemSystem.equipAttempts && gameState.itemSystem.equipAttempts[itemId]) || 0;
  return getItemFlavorText(itemId, attempts <= 1 ? 'equip_fail_1' : 'equip_fail_n');
}


function unequipItemToInventory(slot) {
  if (unequipItem(slot)) {
    saveGame();
    closeModal('modal-item');
    renderInventory();
    renderCharacter();
  } else {
    alert('Inventario lleno.');
  }
}

function sellItemFromInventory(itemId) {
  const item = ITEMS[itemId];
  if (!item) return;
  
  const gold = sellItem(itemId, 1);
  if (gold > 0) {
    saveGame();
    closeModal('modal-item');
    renderInventory();
    renderHub();
    alert('Vendido por ' + gold + ' oro.');
  }
}

function useConsumable(itemId) {
  alert('Sistema de consumibles disponible en combate (Block 4)');
  closeModal('modal-item');
}

// renderQuests() definido al final del archivo en sección QUESTS RENDERING


function forceAppUpdate() {
  const current = typeof LIFE_XP_BUILD !== 'undefined' ? LIFE_XP_BUILD : 'unknown';
  const url = `${location.pathname}?lifexp_update=${encodeURIComponent(current)}_${Date.now()}`;
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.getRegistrations().then(regs => Promise.all(regs.map(reg => reg.update()))).finally(() => location.replace(url));
  } else {
    location.replace(url);
  }
}

function renderSettings() {
  const content = document.getElementById('settings-content');
  content.innerHTML = `
    <div class="section-title">Datos</div>
    <div class="card">
      <button class="btn btn-gold mb-8" onclick="forceAppUpdate()">↻ Actualizar versión</button>
      <button class="btn btn-secondary mb-8" onclick="exportData()">\uD83D\uDCE4 Exportar save</button>
      <button class="btn btn-secondary mb-8" onclick="showImportModal()">\uD83D\uDCE5 Importar save</button>
      <button class="btn btn-ghost" onclick="resetGame()" style="color: var(--red)">\uD83D\uDDD1️ Resetear progreso</button>
    </div>
    
    <div class="section-title">Content Planning</div>
    <div class="card">
      <p style="font-size: 12px; color: var(--text-muted); margin-bottom: 12px;">
        Exporta un snapshot con métricas de uso y sugerencias para planificar actualizaciones de contenido con tu agente de Langdock.
      </p>
      <button class="btn btn-gold" onclick="exportSnapshot()">\uD83D\uDCCA Exportar Snapshot para Agente</button>
    </div>
    
    <div class="section-title">Info</div>
    <div class="card">
      <p style="font-size: 13px; color: var(--text-muted);">
        LifeXP RPG v1.0 · Build ${LIFE_XP_BUILD}<br>
        Tareas: ${gameState.tasks.length}<br>
        Nivel: ${gameState.level}<br>
        XP Total: ${gameState.taskHistory.reduce((a, h) => a + h.xp, 0)}
      </p>
    </div>
  `;
}

// ===========================================================================
// TASK SCREEN
// ===========================================================================

function openRandomTask() {
  currentCatFilter = null;
  const { tasks, isOverflow } = getAvailableTasks();
  if (tasks.length === 0) {
    alert('¡No hay tareas disponibles!');
    return;
  }
  currentTask = pickRandomTask(tasks);
  currentIsOverflow = isOverflow;
  renderTaskScreen();
  showScreen('task');
  resetTimer();
}

function openCategory(catId) {
  currentCatFilter = catId;
  const { tasks, isOverflow } = getAvailableTasks(catId);
  if (tasks.length === 0) {
    alert('¡No hay tareas disponibles en esta categoría!');
    return;
  }
  currentTask = pickRandomTask(tasks);
  currentIsOverflow = isOverflow;
  renderTaskScreen();
  showScreen('task');
  resetTimer();
}

function shuffleTask() {
  const { tasks, isOverflow } = getAvailableTasks(currentCatFilter);
  if (tasks.length <= 1) return;
  
  let newTask;
  let attempts = 0;
  do {
    newTask = pickRandomTask(tasks);
    attempts++;
  } while (newTask.id === currentTask.id && attempts < 10);
  
  currentTask = newTask;
  currentIsOverflow = isOverflow;
  renderTaskScreen();
  resetTimer();
}

function renderTaskScreen() {
  const task = currentTask;
  const cat = CATEGORIES[task.cat];
  
  // Card
  const card = document.getElementById('task-card');
  card.setAttribute('data-cat', task.cat);
  
  // Category label
  document.getElementById('task-cat-label').innerHTML = `${cat.icon} ${cat.name}`;
  document.getElementById('task-cat-badge').innerHTML = `
    <span style="color: ${cat.color}; font-size: 12px;">${cat.icon} ${cat.name}</span>
  `;
  
  // Task info
  document.getElementById('task-name').textContent = task.name;
  document.getElementById('task-desc').textContent = task.desc;
  
  // Rewards
  const rewardsDiv = document.getElementById('task-rewards');
  let rewardsHtml = '';
  
  for (const [stat, pct] of Object.entries(task.stats)) {
    const points = Math.max(1, Math.floor(pct / 10));
    rewardsHtml += `<div class="task-reward stat-${stat}">+${points} ${STATS[stat].abbr}</div>`;
  }
  rewardsHtml += `<div class="task-reward xp">+${task.xp} XP</div>`;
  rewardsDiv.innerHTML = rewardsHtml;
  
  // Drops
  const dropsBox = document.getElementById('task-drops-box');
  if (task.drops) {
    dropsBox.classList.remove('hidden');
    document.getElementById('task-drops').textContent = task.drops.items.join(', ');
  } else {
    dropsBox.classList.add('hidden');
  }
  
  // Side quest
  const sqBox = document.getElementById('side-quest-box');
  if (task.sideQuest) {
    sqBox.classList.remove('hidden');
    document.getElementById('side-quest-desc').textContent = task.sideQuest.desc;
    
    let sqRewards = '';
    for (const [stat, val] of Object.entries(task.sideQuest.stats)) {
      sqRewards += `<span class="side-quest-reward">+${Math.max(1, Math.floor(val/10))} ${STATS[stat].abbr}</span>`;
    }
    sqRewards += `<span class="side-quest-reward">+${task.sideQuest.xp} XP</span>`;
    if (task.sideQuest.dropBonus > 0) {
      sqRewards += `<span class="side-quest-reward">+${task.sideQuest.dropBonus}% drop</span>`;
    }
    document.getElementById('side-quest-rewards').innerHTML = sqRewards;
  } else {
    sqBox.classList.add('hidden');
  }
}

// ===========================================================================
// TASK COMPLETION
// ===========================================================================

function completeTask() {
  if (!currentTask) return;
  
  stopTimer();
  
  // Show completion overlay
  const overlay = document.getElementById('complete-overlay');
  overlay.classList.add('show');
  
  // Icon & title
  document.getElementById('complete-icon').textContent = currentIsOverflow ? '⚡' : '\uD83C\uDFC6';
  document.getElementById('complete-title').textContent = currentIsOverflow 
    ? '¡Overflow eliminado!' 
    : '¡Tarea completada!';
  document.getElementById('complete-subtitle').textContent = currentTask.name;
  
  // Calculate base rewards
  const baseXp = currentTask.xp;
  const xpMultiplier = currentIsOverflow ? 1.5 : 1;
  
  // Rewards display
  let rewardsHtml = `<div class="complete-reward gold">+${Math.round(baseXp * xpMultiplier)} XP</div>`;
  for (const [stat, pct] of Object.entries(currentTask.stats)) {
    const points = Math.max(1, Math.floor(pct / 10));
    rewardsHtml += `<div class="complete-reward green">+${points} ${STATS[stat].abbr}</div>`;
  }
  document.getElementById('complete-rewards').innerHTML = rewardsHtml;
  
  // Hide drop and side quest prompt initially
  document.getElementById('complete-drop').classList.add('hidden');
  document.getElementById('side-quest-prompt').classList.add('hidden');
  document.getElementById('btn-complete-continue').classList.add('hidden');
  
  // If has side quest, show prompt
  if (currentTask.sideQuest) {
    const prompt = document.getElementById('side-quest-prompt');
    prompt.classList.remove('hidden');
    document.getElementById('side-quest-prompt-desc').textContent = currentTask.sideQuest.desc;
  } else {
    // No side quest, finalize immediately
    finalizeCompletion(false);
  }
}

function finalizeCompletion(sideQuestCompleted) {
  const task = currentTask;
  const xpMultiplier = currentIsOverflow ? 1.5 : 1;
  
  // Calculate XP
  let totalXp = Math.round(task.xp * xpMultiplier);
  if (sideQuestCompleted && task.sideQuest) {
    totalXp += task.sideQuest.xp;
  }
  
  // Add XP and check level up
  const leveledUp = addXp(totalXp);
  
  // Add stats
  addStats(task.stats);
  if (sideQuestCompleted && task.sideQuest) {
    addStats(task.sideQuest.stats);
  }
  
  // Add gold (simplified)
  const goldEarned = Math.floor(task.xp / 5);
  gameState.gold += goldEarned;
  
  // Roll for drops using items.js system
  let dropResult = null;
  const bonusChance = sideQuestCompleted && task.sideQuest?.dropBonus ? task.sideQuest.dropBonus / 100 : 0;
  
  if (task.drops?.theme && typeof rollDropFromTheme === 'function') {
    dropResult = rollDropFromTheme(task.drops.theme, bonusChance);
  } else if (task.drops?.items) {
    // Fallback to old system for tasks without theme
    const drop = rollDrop(task, sideQuestCompleted);
    if (drop) dropResult = { itemId: null, name: drop };
  }
  
  // Side quest bonus drop
  if (sideQuestCompleted && task.sideQuest?.drops && !dropResult) {
    const sqDrop = rollSideQuestDrop(task);
    if (sqDrop) dropResult = { itemId: null, name: sqDrop };
  }
  
  // Show drop if any
  if (dropResult) {
    document.getElementById('complete-drop').classList.remove('hidden');
    
    if (dropResult.itemId && typeof ITEMS !== 'undefined' && ITEMS[dropResult.itemId]) {
      const item = ITEMS[dropResult.itemId];
      const rarity = RARITY[dropResult.rarity || item.rarity];
      document.getElementById('complete-drop-item').innerHTML = 
        `<span style="color: ${rarity.color};">${item.icon} ${item.name}</span>`;
      // Add to inventory using items.js system
      if (typeof addToInventory === 'function') {
        addLootSafely(dropResult.itemId, 1);
      } else {
        gameState.inventory.push({ id: dropResult.itemId, qty: 1, obtainedAt: todayStr() });
      }
    } else {
      document.getElementById('complete-drop-item').textContent = dropResult.name || dropResult;
      gameState.inventory.push({ name: dropResult.name || dropResult, type: 'item', obtainedAt: todayStr() });
    }
  }
  
  // Update task lastDone
  const taskInState = gameState.tasks.find(t => t.id === task.id);
  if (taskInState) {
    taskInState.lastDone = todayStr();
  }
  
  // Remove from saved if it was there
  gameState.savedTasks = gameState.savedTasks.filter(id => id !== task.id);
  
  // Update streak
  const today = todayStr();
  if (gameState.lastActiveDate !== today) {
    if (gameState.lastActiveDate) {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      if (gameState.lastActiveDate === yesterday.toISOString().slice(0, 10)) {
        gameState.streak++;
      } else {
        gameState.streak = 1;
      }
    } else {
      gameState.streak = 1;
    }
    gameState.lastActiveDate = today;
  }
  
  // Add to history
  gameState.taskHistory.push({
    taskId: task.id,
    date: today,
    xp: totalXp,
    sideQuest: sideQuestCompleted
  });
  
  // Save
  saveGame();
  
  // Show continue button
  document.getElementById('btn-complete-continue').classList.remove('hidden');
  
  // Update rewards display with final values
  let rewardsHtml = `<div class="complete-reward gold">+${totalXp} XP</div>`;
  rewardsHtml += `<div class="complete-reward">+${goldEarned} \uD83E\uDE99</div>`;
  document.getElementById('complete-rewards').innerHTML = rewardsHtml;
  
  if (leveledUp) {
    document.getElementById('complete-title').textContent = '¡Subiste de nivel!';
    document.getElementById('complete-icon').textContent = '\uD83C\uDF89';
  }
  
  // Check for random encounter after task completion
  triggerEncounterAfterTask(task);
  
  // Update quest progress (delegates to quests.js canonical implementation)
  if (typeof updateQuestProgress === 'function') {
    updateQuestProgress('task_complete', { category: task.cat });
  }
  if (typeof recordItemAttunementFromTask === 'function') recordItemAttunementFromTask(task);
}

// Drop system - connects to items.js
// === Drop system ============================================================
// rollDropFromTheme: bridge to items.js rollDrop(theme, bonusChance).
// items.js must be loaded first. Returns {itemId, rarity} or null.
function rollDropFromTheme(theme, bonusChance) {
  if (typeof ITEMS === 'undefined') return null;
  // items.js exposes rollDrop(theme, bonusChance) — different signature from this file's rollDrop
  // We access it via the global scope after items.js loads
  const itemsRollDrop = window._itemsRollDrop;
  if (typeof itemsRollDrop === 'function') return itemsRollDrop(theme, bonusChance || 0);
  return null;
}

// rollDrop: task-based drop resolver. Uses rollDropFromTheme when theme is set.
function rollDrop(task, sideQuestCompleted) {
  if (!task.drops) return null;
  const bonus = sideQuestCompleted && task.sideQuest ? (task.sideQuest.dropBonus || 0) / 100 : 0;
  if (task.drops.theme) {
    const result = rollDropFromTheme(task.drops.theme, bonus);
    if (result) return result;
  }
  // Fallback: old string-based items list
  if (task.drops.items && task.drops.items.length > 0) {
    const dropChance = 0.4 + bonus;
    if (Math.random() < dropChance) {
      return { itemId: null, name: task.drops.items[Math.floor(Math.random() * task.drops.items.length)] };
    }
  }
  return null;
}

// rollSideQuestDrop: drop from side quest theme.
function rollSideQuestDrop(task) {
  if (!task.sideQuest) return null;
  const theme = task.drops?.theme || null;
  if (!theme) {
    // Fallback: string list
    const drops = task.sideQuest.drops;
    if (!drops || !drops.length) return null;
    if (Math.random() < 0.6) return { itemId: null, name: drops[Math.floor(Math.random() * drops.length)] };
    return null;
  }
  const bonus = (task.sideQuest.dropBonus || 0) / 100;
  return rollDropFromTheme(theme, bonus);
}


// Pending encounter after task completion
let pendingEncounter = null;

function dismissComplete() {
  document.getElementById('complete-overlay').classList.remove('show');
  
  // Check for pending encounter
  if (pendingEncounter) {
    startCombatFromEncounter(pendingEncounter);
    pendingEncounter = null;
  } else {
    showScreen('hub');
  }
}

// ===========================================================================
// ENCOUNTER SYSTEM
// ===========================================================================

function checkForEncounter(task) {
  // Check if combat system is available
  if (typeof rollEncounter !== 'function' || typeof pickRandomEnemy !== 'function') {
    return null;
  }
  
  const theme = task.drops?.theme || null;
  const playerLevel = gameState.level || 1;
  
  // Roll for encounter
  if (!rollEncounter(theme, playerLevel)) {
    return null;
  }
  
  // Determine encounter type
  const encounterType = getEncounterType(playerLevel);
  
  // Pick enemy
  const enemy = pickRandomEnemy(theme, playerLevel, encounterType);
  if (!enemy) return null;
  
  // Scale to player level (±2)
  const targetLevel = Math.max(1, playerLevel + Math.floor(Math.random() * 5) - 2);
  const scaledEnemy = typeof scaleEnemy === 'function' ? scaleEnemy(enemy, targetLevel) : enemy;
  
  return {
    enemy: scaledEnemy,
    tactical: encounterType !== 'common', // Elite and boss = tactical
    theme: theme
  };
}

function triggerEncounterAfterTask(task) {
  const encounter = checkForEncounter(task);
  if (encounter) {
    pendingEncounter = encounter;
    
    // Show encounter alert in completion overlay
    const alertHtml = `
      <div style="background: linear-gradient(135deg, rgba(255,77,109,0.2), transparent); 
                  border: 1px solid var(--accent); border-radius: 8px; padding: 12px; 
                  margin-top: 16px; text-align: center;">
        <div style="font-size: 24px; margin-bottom: 4px;">${encounter.enemy.icon}</div>
        <div style="font-size: 14px; font-weight: 700; color: var(--accent);">¡Encuentro!</div>
        <div style="font-size: 12px; color: var(--text-muted);">${encounter.enemy.name} aparece</div>
      </div>
    `;
    
    const rewardsEl = document.getElementById('complete-rewards');
    rewardsEl.innerHTML += alertHtml;
    
    // Change continue button text
    document.getElementById('btn-complete-continue').textContent = '⚔️ ¡Al combate!';
  }
}

function startCombatFromEncounter(encounter) {
  if (!encounter || !encounter.enemy) {
    showScreen('hub');
    return;
  }
  
  // Initialize combat
  if (typeof initCombat === 'function') {
    initCombat(encounter.enemy, encounter.tactical);
  }
  
  // Show combat screen
  showScreen('combat');
  renderCombatScreen();
}

// ===========================================================================
// COMBAT UI
// ===========================================================================

function renderCombatScreen() {
  if (!combatState) return;
  
  const p = combatState.player;
  const e = combatState.enemy;
  
  // Enemy section
  document.getElementById('combat-enemy-icon').textContent = e.icon;
  document.getElementById('combat-enemy-name').textContent = e.name;
  document.getElementById('combat-enemy-level').textContent = `Lv ${e.level}`;
  document.getElementById('combat-enemy-hp').textContent = `${e.hp}/${e.maxHp}`;
  document.getElementById('combat-enemy-hp-fill').style.width = `${(e.hp / e.maxHp) * 100}%`;
  
  // Player section
  document.getElementById('combat-player-hp').textContent = `${p.hp}/${p.maxHp}`;
  document.getElementById('combat-player-hp-fill').style.width = `${(p.hp / p.maxHp) * 100}%`;
  document.getElementById('combat-player-mp').textContent = `${p.mp}/${p.maxMp}`;
  document.getElementById('combat-player-mp-fill').style.width = `${(p.mp / p.maxMp) * 100}%`;
  document.getElementById('combat-player-sp').textContent = `${p.sp}/${p.maxSp}`;
  document.getElementById('combat-player-sp-fill').style.width = `${(p.sp / p.maxSp) * 100}%`;
  document.getElementById('combat-player-focus').textContent = `${p.focus}/${p.focusMax}`;
  document.getElementById('combat-player-focus-fill').style.width = `${(p.focus / p.focusMax) * 100}%`;
  
  // Actions
  renderCombatActions();
  
  // Log
  renderCombatLog();
  
  // Phase indicator
  const phaseEl = document.getElementById('combat-phase');
  if (combatState.phase === 'player') {
    phaseEl.textContent = 'Tu turno';
    phaseEl.style.color = 'var(--green)';
  } else if (combatState.phase === 'enemy') {
    phaseEl.textContent = 'Turno enemigo';
    phaseEl.style.color = 'var(--red)';
  }
}

function renderCombatActions() {
  const actionsEl = document.getElementById('combat-actions');
  if (!actionsEl) return;
  
  const actions = typeof getAvailableActions === 'function' ? getAvailableActions() : [];
  
  actionsEl.innerHTML = '';
  
  for (const action of actions) {
    const disabled = !action.available;
    const costText = action.cost ? ` (${action.cost} ${action.costType?.toUpperCase() || ''})` : '';
    
    actionsEl.innerHTML += `
      <button class="combat-action-btn ${disabled ? 'disabled' : ''}" 
              onclick="${disabled ? '' : `executeCombatAction('${action.id}')`}"
              ${disabled ? 'disabled' : ''}>
        <span class="combat-action-icon">${action.icon}</span>
        <span class="combat-action-name">${action.name}${costText}</span>
      </button>
    `;
  }
}

function renderCombatLog() {
  const logEl = document.getElementById('combat-log');
  if (!logEl || !combatState) return;
  
  const logs = combatState.log.slice(-5); // Last 5 entries
  logEl.innerHTML = logs.map(l => `<div class="combat-log-entry">${l.message}</div>`).join('');
  logEl.scrollTop = logEl.scrollHeight;
}

function executeCombatAction(actionId) {
  if (!combatState || combatState.phase !== 'player') return;
  
  const result = executePlayerAction(actionId);
  renderCombatScreen();
  
  // Check for end conditions
  if (combatState.phase === 'victory') {
    setTimeout(() => showCombatVictory(), 500);
  } else if (combatState.phase === 'defeat') {
    setTimeout(() => showCombatDefeat(), 500);
  } else if (combatState.phase === 'fled') {
    setTimeout(() => endCombatAndReturn(), 500);
  } else if (combatState.phase === 'enemy') {
    // Enemy turn with delay
    setTimeout(() => {
      executeEnemyTurn();
      renderCombatScreen();
      
      if (combatState.phase === 'defeat') {
        setTimeout(() => showCombatDefeat(), 500);
      }
    }, 800);
  }
}

function showCombatVictory() {
  // Apply rewards
  if (typeof applyCombatRewards === 'function') {
    applyCombatRewards();
  }
  
  const rewards = combatState?.rewards;
  
  // Show victory overlay
  document.getElementById('combat-result-icon').textContent = '\uD83C\uDFC6';
  document.getElementById('combat-result-title').textContent = '¡Victoria!';
  document.getElementById('combat-result-subtitle').textContent = `${combatState.enemy.name} derrotado`;
  
  let rewardsHtml = '';
  if (rewards) {
    rewardsHtml = `
      <div class="complete-reward gold">+${rewards.xp} XP</div>
      <div class="complete-reward">+${rewards.gold} \uD83E\uDE99</div>
    `;
    if (rewards.drops && rewards.drops.length > 0) {
      for (const drop of rewards.drops) {
        const item = typeof ITEMS !== 'undefined' ? ITEMS[drop] : null;
        rewardsHtml += `<div class="complete-reward" style="color: var(--purple);">\uD83C\uDF81 ${item?.name || drop}</div>`;
      }
    }
  }
  document.getElementById('combat-result-rewards').innerHTML = rewardsHtml;
  
  document.getElementById('combat-result-overlay').classList.add('show');
}

function showCombatDefeat() {
  document.getElementById('combat-result-icon').textContent = '\uD83D\uDC80';
  document.getElementById('combat-result-title').textContent = 'Derrotado...';
  document.getElementById('combat-result-subtitle').textContent = 'Vives para luchar otro día';
  document.getElementById('combat-result-rewards').innerHTML = '';
  
  document.getElementById('combat-result-overlay').classList.add('show');
}

function endCombatAndReturn() {
  if (typeof endCombat === 'function') {
    endCombat();
  }
  document.getElementById('combat-result-overlay').classList.remove('show');
  showScreen('hub');
  renderHub();
}

// ===========================================================================
// SAVE FOR LATER
// ===========================================================================

function saveForLater() {
  if (!currentTask) return;
  if (!gameState.savedTasks.includes(currentTask.id)) {
    gameState.savedTasks.push(currentTask.id);
    saveGame();
  }
  showScreen('hub');
}

function showSavedTasks() {
  const list = document.getElementById('modal-tasks-list');
  document.getElementById('modal-tasks-title').textContent = '\uD83D\uDCCC Tareas guardadas';
  
  list.innerHTML = '';
  for (const taskId of gameState.savedTasks) {
    const task = getTaskById(taskId);
    if (!task) continue;
    const cat = CATEGORIES[task.cat];
    list.innerHTML += `
      <div class="card" style="cursor: pointer;" onclick="openSavedTask('${task.id}')">
        <div style="display: flex; align-items: center; gap: 10px;">
          <span style="font-size: 20px;">${cat.icon}</span>
          <div>
            <div style="font-weight: 600;">${task.name}</div>
            <div style="font-size: 12px; color: var(--text-muted);">${cat.name}</div>
          </div>
        </div>
      </div>
    `;
  }
  
  document.getElementById('modal-tasks').classList.add('show');
}

function openSavedTask(taskId) {
  closeModal('modal-tasks');
  currentTask = getTaskById(taskId);
  currentIsOverflow = isTaskOverdue(currentTask);
  currentCatFilter = null;
  renderTaskScreen();
  showScreen('task');
  resetTimer();
}

function showOverflowTasks() {
  const list = document.getElementById('modal-tasks-list');
  document.getElementById('modal-tasks-title').textContent = '⚡ Tareas overflow';
  
  const overflow = getOverflowTasks();
  list.innerHTML = '';
  
  for (const task of overflow) {
    const cat = CATEGORIES[task.cat];
    list.innerHTML += `
      <div class="card" style="cursor: pointer;" onclick="openOverflowTask('${task.id}')">
        <div style="display: flex; align-items: center; gap: 10px;">
          <span style="font-size: 20px;">${cat.icon}</span>
          <div>
            <div style="font-weight: 600;">${task.name}</div>
            <div style="font-size: 12px; color: var(--text-muted);">${cat.name} · ⚡ Overflow</div>
          </div>
        </div>
      </div>
    `;
  }
  
  document.getElementById('modal-tasks').classList.add('show');
}

function openOverflowTask(taskId) {
  closeModal('modal-tasks');
  currentTask = getTaskById(taskId);
  currentIsOverflow = true;
  currentCatFilter = null;
  renderTaskScreen();
  showScreen('task');
  resetTimer();
}

function openModal(modalId) {
  const modal = document.getElementById(modalId);
  if (!modal) return false;
  modal.classList.add('show');
  // Fallback for cached/older CSS versions.
  modal.style.display = 'flex';
  return true;
}

function closeModal(modalId) {
  const modal = document.getElementById(modalId);
  if (!modal) return;
  modal.classList.remove('show');
  modal.style.display = '';
}

// ===========================================================================
// TIMER
// ===========================================================================

function toggleTimer() {
  if (timerRunning) {
    stopTimer();
  } else {
    startTimer();
  }
}

function startTimer() {
  timerRunning = true;
  document.getElementById('timer-toggle').textContent = '⏸';
  timerInterval = setInterval(() => {
    timerSeconds++;
    updateTimerDisplay();
  }, 1000);
}

function stopTimer() {
  timerRunning = false;
  clearInterval(timerInterval);
  document.getElementById('timer-toggle').textContent = '▶';
}

function resetTimer() {
  stopTimer();
  timerSeconds = 0;
  updateTimerDisplay();
}

function updateTimerDisplay() {
  const mins = Math.floor(timerSeconds / 60).toString().padStart(2, '0');
  const secs = (timerSeconds % 60).toString().padStart(2, '0');
  document.getElementById('timer-display').textContent = `${mins}:${secs}`;
}

// ===========================================================================
// CLASS CHANGE SYSTEM
// ===========================================================================

function showClassChangeModal() {
  const classId = gameState.classId === 'novato' ? null : gameState.classId;
  const level = gameState.level;
  const available = getAvailableClassChanges(classId, level);
  
  if (available.length === 0) {
    alert('No hay clases disponibles para cambiar.');
    return;
  }
  
  const info = document.getElementById('modal-class-info');
  const options = document.getElementById('modal-class-options');
  
  if (!classId) {
    info.textContent = `Has alcanzado nivel ${level}. ¡Es hora de elegir tu primera clase!`;
  } else {
    const currentCls = CLASS_TREE[classId];
    info.textContent = `Puedes avanzar desde ${currentCls.name} a una de estas especializaciones:`;
  }
  
  options.innerHTML = '';
  
  for (const clsId of available) {
    const cls = CLASS_TREE[clsId];
    const statsText = Object.entries(cls.stats).map(([s, v]) => `${STATS[s].abbr} +${v}`).join(', ');
    
    options.innerHTML += `
      <div class="card" style="cursor: pointer; transition: transform 0.2s;" 
           onclick="selectClass('${clsId}')"
           onmouseenter="this.style.transform='scale(1.02)'" 
           onmouseleave="this.style.transform='scale(1)'">
        <div style="display: flex; align-items: center; gap: 12px;">
          <div style="font-size: 40px;">${cls.icon}</div>
          <div style="flex: 1;">
            <div style="font-size: 16px; font-weight: 700; color: var(--gold);">${cls.name}</div>
            <div style="font-size: 12px; color: var(--text-muted); margin-top: 2px;">${cls.desc}</div>
            <div style="font-size: 11px; color: var(--green); margin-top: 4px;">${statsText}</div>
          </div>
        </div>
      </div>
    `;
  }
  
  document.getElementById('modal-class').classList.add('show');
}

function selectClass(classId) {
  const cls = CLASS_TREE[classId];
  
  if (!confirm(`¿Quieres convertirte en ${cls.name}?\n\n${cls.desc}\n\nEsta decisión afectará tu camino de progresión.`)) {
    return;
  }
  
  gameState.classId = classId;
  saveGame();
  
  closeModal('modal-class');
  renderCharacter();
  renderHub();
  
  // Show celebration
  alert(`\uD83C\uDF89 ¡Te has convertido en ${cls.name}!\n\nTus stats han mejorado y tienes acceso a nuevas habilidades.`);
}

// ===========================================================================
// IMPORT/EXPORT
// ===========================================================================

function downloadJson(data, filename) {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

function backupCurrentSave(reason = 'manual') {
  try {
    const current = localStorage.getItem('lifexp_save');
    if (!current) return false;
    const key = 'lifexp_save_backup_' + Date.now();
    localStorage.setItem(key, current);
    localStorage.setItem('lifexp_save_last_backup', key);
    return true;
  } catch (e) {
    console.warn('Could not create save backup:', e);
    return false;
  }
}

function exportData(options = {}) {
  const filename = options.filename || `lifexp_save_${todayStr()}.json`;
  downloadJson(gameState, filename);
}

function exportSnapshot() {
  // Generate a comprehensive snapshot for content update planning
  const snapshot = {
    meta: {
      exportDate: new Date().toISOString(),
      version: '1.0',
      purpose: 'LifeXP content update planning snapshot',
      instructions: 'Este fichero contiene el estado actual del jugador y métricas de uso. Úsalo para planificar actualizaciones de contenido (nuevas tareas, quests, items, enemigos, balanceo).'
    },
    
    player: {
      name: gameState.name,
      level: gameState.level,
      xp: gameState.xp,
      gold: gameState.gold,
      streak: gameState.streak,
      classId: gameState.classId,
      classLevel: gameState.classLevel,
      stats: { ...gameState.stats }
    },
    
    progression: {
      totalTasksCompleted: gameState.taskHistory.length,
      uniqueTasksCompleted: [...new Set(gameState.taskHistory.map(h => h.taskId))].length,
      sideQuestsCompleted: gameState.taskHistory.filter(h => h.sideQuest).length,
      totalXpEarned: gameState.taskHistory.reduce((a, h) => a + h.xp, 0),
      questsCompleted: gameState.completedQuests.length,
      daysActive: calculateDaysActive()
    },
    
    taskMetrics: generateTaskMetrics(),
    
    inventory: {
      itemCount: gameState.inventory.length,
      equipped: { ...gameState.equipment },
      items: gameState.inventory.map(slot => ({
        id: slot.id,
        qty: slot.qty || 1,
        name: typeof ITEMS !== 'undefined' && ITEMS[slot.id] ? ITEMS[slot.id].name : slot.id
      }))
    },
    
    activeQuests: gameState.activeQuests.map(q => ({
      questId: q.questId,
      stepIndex: q.stepIndex,
      startedAt: q.startedAt
    })),
    
    suggestions: generateContentSuggestions()
  };
  
  const data = JSON.stringify(snapshot, null, 2);
  const blob = new Blob([data], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `lifexp_snapshot_${todayStr()}.json`;
  a.click();
  URL.revokeObjectURL(url);
  
  alert('Snapshot exportado. Compártelo con tu agente de Langdock para planificar updates de contenido.');
}

function calculateDaysActive() {
  if (gameState.taskHistory.length === 0) return 0;
  const dates = [...new Set(gameState.taskHistory.map(h => h.date))];
  return dates.length;
}

function generateTaskMetrics() {
  const metrics = {
    byCategory: {},
    byFrequency: {},
    mostCompleted: [],
    neverCompleted: [],
    overflowFrequent: []
  };
  
  // Initialize categories
  for (const cat of Object.keys(CATEGORIES)) {
    metrics.byCategory[cat] = { completed: 0, overflow: 0 };
  }
  
  // Count completions by task
  const taskCounts = {};
  for (const h of gameState.taskHistory) {
    taskCounts[h.taskId] = (taskCounts[h.taskId] || 0) + 1;
  }
  
  // Categorize
  for (const h of gameState.taskHistory) {
    const task = getTaskById(h.taskId);
    if (task) {
      metrics.byCategory[task.cat].completed++;
    }
  }
  
  // Find most completed
  const sorted = Object.entries(taskCounts).sort((a, b) => b[1] - a[1]);
  metrics.mostCompleted = sorted.slice(0, 5).map(([id, count]) => {
    const task = getTaskById(id);
    return { id, name: task?.name || id, count };
  });
  
  // Find never completed
  metrics.neverCompleted = gameState.tasks
    .filter(t => !taskCounts[t.id])
    .map(t => ({ id: t.id, name: t.name, category: t.cat }));
  
  return metrics;
}

function generateContentSuggestions() {
  const suggestions = [];
  const level = gameState.level;
  const totalTasks = gameState.taskHistory.length;
  
  // Level-based suggestions
  if (level >= 10 && gameState.classId === 'novato') {
    suggestions.push({
      type: 'progression',
      priority: 'high',
      message: 'El jugador está en nivel ' + level + ' pero sigue siendo Novato. Considera añadir recordatorios o tutoriales sobre el sistema de clases.'
    });
  }
  
  if (level >= 20) {
    suggestions.push({
      type: 'content',
      priority: 'medium',
      message: 'Jugador nivel ' + level + '. Considera añadir quests de historia más avanzadas o contenido endgame.'
    });
  }
  
  // Task variety
  const taskMetrics = generateTaskMetrics();
  const neglectedCats = Object.entries(taskMetrics.byCategory)
    .filter(([cat, data]) => data.completed < totalTasks * 0.1)
    .map(([cat]) => CATEGORIES[cat].name);
  
  if (neglectedCats.length > 0) {
    suggestions.push({
      type: 'balance',
      priority: 'medium',
      message: 'Categorías poco usadas: ' + neglectedCats.join(', ') + '. Considera hacer las tareas de estas categorías más atractivas o añadir mejores recompensas.'
    });
  }
  
  // Never completed tasks
  if (taskMetrics.neverCompleted.length > 5) {
    suggestions.push({
      type: 'cleanup',
      priority: 'low',
      message: taskMetrics.neverCompleted.length + ' tareas nunca completadas. Revisa si son relevantes o si necesitan ajustes.'
    });
  }
  
  // Inventory suggestions
  if (gameState.inventory.length >= 18) {
    suggestions.push({
      type: 'systems',
      priority: 'medium',
      message: 'Inventario casi lleno. Considera añadir sistema de stash, crafting para consumir materiales, o tienda para vender.'
    });
  }
  
  return suggestions;
}

function importDataText(text) {
  const data = JSON.parse(text);
  if (!data || typeof data !== 'object' || Array.isArray(data)) {
    throw new Error('El fichero no contiene un save válido.');
  }
  if (!('level' in data) && !('tasks' in data) && !('taskHistory' in data)) {
    throw new Error('Faltan datos reconocibles de LifeXP.');
  }
  backupCurrentSave('before-import');
  gameState = { ...gameState, ...data };
  gameState.inventory = Array.isArray(gameState.inventory) ? gameState.inventory : [];
  gameState.stash = Array.isArray(gameState.stash) ? gameState.stash : [];
  gameState.taskHistory = Array.isArray(gameState.taskHistory) ? gameState.taskHistory : [];
  gameState.completedQuests = Array.isArray(gameState.completedQuests) ? gameState.completedQuests : [];
  gameState.activeQuests = Array.isArray(gameState.activeQuests) ? gameState.activeQuests : [];
  saveGame();
  return true;
}

function showImportModal() {
  const input = document.createElement('input');
  input.type = 'file';
  input.accept = '.json,application/json';
  input.onchange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    try {
      importDataText(await file.text());
      alert('Datos importados correctamente');
      location.reload();
    } catch (err) {
      alert('Error al importar: ' + err.message);
    }
  };
  input.click();
}

function handleEmergencyDataRoute() {
  const params = new URLSearchParams(location.search);
  if (params.get('export') === '1') {
    exportData({ filename: `lifexp_save_${todayStr()}.json` });
    history.replaceState({}, document.title, location.pathname);
    return;
  }
  if (params.get('import') === '1') {
    showImportModal();
    history.replaceState({}, document.title, location.pathname);
  }
}

window.LifeXPBackup = {
  export: () => exportData(),
  importText: (text) => importDataText(text),
  backup: () => backupCurrentSave('manual')
};

function resetGame() {
  if (!confirm('¿Seguro que quieres borrar todo el progreso?')) return;
  if (!confirm('¿SEGURO? Esta acción no se puede deshacer.')) return;
  
  localStorage.removeItem('lifexp_save');
  location.reload();
}

// ===========================================================================
// GUILD / COOP SYSTEM (Receipt-based sync)
// ===========================================================================

function generatePlayerId() {
  return 'player_' + Math.random().toString(36).substr(2, 9);
}

function getPlayerId() {
  if (!gameState.playerId) {
    gameState.playerId = generatePlayerId();
    saveGame();
  }
  return gameState.playerId;
}

function createGuild(name) {
  const guildId = 'guild_' + Math.random().toString(36).substr(2, 6).toUpperCase();
  gameState.guildId = guildId;
  gameState.guildName = name;
  gameState.guildMembers = [{
    odeName: gameState.name,
    oderId: getPlayerId(),
    level: gameState.level,
    classId: gameState.classId,
    lastSync: todayStr(),
    totalXp: gameState.taskHistory.reduce((a, h) => a + h.xp, 0)
  }];
  saveGame();
  return guildId;
}

function joinGuildFromReceipt(receipt) {
  if (receipt.type !== 'guild_invite') return false;
  
  gameState.guildId = receipt.guildId;
  gameState.guildName = receipt.guildName;
  gameState.guildMembers = receipt.members || [];
  
  // Add self if not already in
  const selfId = getPlayerId();
  if (!gameState.guildMembers.find(m => m.oderId === selfId)) {
    gameState.guildMembers.push({
      odeName: gameState.name,
      oderId: selfId,
      level: gameState.level,
      classId: gameState.classId,
      lastSync: todayStr(),
      totalXp: gameState.taskHistory.reduce((a, h) => a + h.xp, 0)
    });
  }
  
  saveGame();
  return true;
}

function generateReceipt() {
  // Generate a receipt with recent achievements since last receipt
  const lastReceiptDate = gameState.lastReceiptDate || '2000-01-01';
  const recentHistory = gameState.taskHistory.filter(h => h.date > lastReceiptDate);
  
  gameState.lastReceiptId++;
  const receipt = {
    type: 'progress_update',
    receiptId: `${getPlayerId()}_${gameState.lastReceiptId}`,
    playerId: getPlayerId(),
    playerName: gameState.name,
    guildId: gameState.guildId,
    timestamp: new Date().toISOString(),
    
    // Current state
    currentState: {
      level: gameState.level,
      xp: gameState.xp,
      classId: gameState.classId,
      className: typeof CLASS_TREE !== 'undefined' && CLASS_TREE[gameState.classId] 
        ? CLASS_TREE[gameState.classId].name : 'Novato',
      streak: gameState.streak,
      totalXp: gameState.taskHistory.reduce((a, h) => a + h.xp, 0),
      questsCompleted: gameState.completedQuests.length
    },
    
    // Recent achievements (since last receipt)
    recentAchievements: {
      tasksCompleted: recentHistory.length,
      xpEarned: recentHistory.reduce((a, h) => a + h.xp, 0),
      sideQuestsCompleted: recentHistory.filter(h => h.sideQuest).length,
      period: { from: lastReceiptDate, to: todayStr() }
    }
  };
  
  gameState.lastReceiptDate = todayStr();
  saveGame();
  
  return receipt;
}

function generateGuildInvite() {
  if (!gameState.guildId) return null;
  
  return {
    type: 'guild_invite',
    guildId: gameState.guildId,
    guildName: gameState.guildName,
    invitedBy: gameState.name,
    timestamp: new Date().toISOString(),
    members: gameState.guildMembers
  };
}

function exportReceipt() {
  if (!gameState.guildId) {
    alert('Primero debes crear o unirte a un guild.');
    return;
  }
  
  const receipt = generateReceipt();
  const data = JSON.stringify(receipt, null, 2);
  
  // Try to use Web Share API for mobile (WhatsApp, etc)
  if (navigator.share && navigator.canShare) {
    const file = new File([data], `recibo_${gameState.name}_${todayStr()}.json`, { type: 'application/json' });
    if (navigator.canShare({ files: [file] })) {
      navigator.share({
        title: `Recibo de ${gameState.name}`,
        text: `\uD83C\uDFAE Actualización de ${gameState.name} en ${gameState.guildName}`,
        files: [file]
      }).catch(() => downloadReceipt(data, receipt));
      return;
    }
  }
  
  // Fallback to download
  downloadReceipt(data, receipt);
}

function downloadReceipt(data, receipt) {
  const blob = new Blob([data], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `recibo_${gameState.name}_${todayStr()}.json`;
  a.click();
  URL.revokeObjectURL(url);
  
  alert(`Recibo generado!\\n\\nCompártelo con tu guild por WhatsApp o donde prefieras.\\n\\n\uD83D\uDCCA ${receipt.recentAchievements.tasksCompleted} tareas | +${receipt.recentAchievements.xpEarned} XP`);
}

function exportGuildInvite() {
  if (!gameState.guildId) {
    const name = prompt('Nombre para tu nuevo Guild:');
    if (!name) return;
    createGuild(name);
  }
  
  const invite = generateGuildInvite();
  const data = JSON.stringify(invite, null, 2);
  
  // Try Web Share API
  if (navigator.share && navigator.canShare) {
    const file = new File([data], `invite_${gameState.guildName}.json`, { type: 'application/json' });
    if (navigator.canShare({ files: [file] })) {
      navigator.share({
        title: `Invitación a ${gameState.guildName}`,
        text: `\uD83C\uDFAE ¡Únete a mi guild "${gameState.guildName}" en LifeXP!`,
        files: [file]
      }).catch(() => downloadInvite(data));
      return;
    }
  }
  
  downloadInvite(data);
}

function downloadInvite(data) {
  const blob = new Blob([data], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `invite_${gameState.guildName || 'guild'}.json`;
  a.click();
  URL.revokeObjectURL(url);
  
  alert(`Invitación generada para "${gameState.guildName}"!\\n\\nCompártela con quien quieras que se una.`);
}

function importReceipt() {
  const input = document.createElement('input');
  input.type = 'file';
  input.accept = '.json';
  input.onchange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    try {
      const text = await file.text();
      const receipt = JSON.parse(text);
      processReceipt(receipt);
    } catch (err) {
      alert('Error al importar recibo: ' + err.message);
    }
  };
  input.click();
}

function processReceipt(receipt) {
  if (receipt.type === 'guild_invite') {
    if (gameState.guildId && gameState.guildId !== receipt.guildId) {
      if (!confirm(`Ya perteneces a "${gameState.guildName}". ¿Quieres cambiar a "${receipt.guildName}"?`)) {
        return;
      }
    }
    joinGuildFromReceipt(receipt);
    alert(`¡Te has unido a "${receipt.guildName}"!`);
    renderGuild();
    return;
  }
  
  if (receipt.type === 'progress_update') {
    // Check guild match
    if (receipt.guildId !== gameState.guildId) {
      alert('Este recibo es de otro guild.');
      return;
    }
    
    // Check if already processed
    if (gameState.receivedReceipts.includes(receipt.receiptId)) {
      alert('Este recibo ya fue procesado.');
      return;
    }
    
    // Update member info
    const memberIdx = gameState.guildMembers.findIndex(m => m.oderId === receipt.playerId);
    const memberData = {
      odeName: receipt.playerName,
      oderId: receipt.playerId,
      level: receipt.currentState.level,
      classId: receipt.currentState.classId,
      className: receipt.currentState.className,
      lastSync: receipt.timestamp.slice(0, 10),
      totalXp: receipt.currentState.totalXp,
      streak: receipt.currentState.streak
    };
    
    if (memberIdx >= 0) {
      gameState.guildMembers[memberIdx] = memberData;
    } else {
      gameState.guildMembers.push(memberData);
    }
    
    gameState.receivedReceipts.push(receipt.receiptId);
    saveGame();
    
    alert(`Recibo de ${receipt.playerName} procesado!\\n\\n\uD83D\uDCCA Nivel ${receipt.currentState.level} | ${receipt.recentAchievements.tasksCompleted} tareas recientes`);
    renderGuild();
    return;
  }
  
  alert('Tipo de recibo no reconocido.');
}

function renderGuild() {
  const container = document.getElementById('guild-container');
  if (!container) return;
  
  if (!gameState.guildId) {
    container.innerHTML = `
      <div class="card" style="text-align: center; padding: 24px;">
        <div style="font-size: 48px; margin-bottom: 12px;">⚔️</div>
        <h3 style="margin-bottom: 8px;">Sin Guild</h3>
        <p style="color: var(--text-muted); margin-bottom: 16px;">Crea un guild o únete a uno existente para compartir logros con amigos.</p>
        <button class="btn btn-gold mb-8" onclick="exportGuildInvite()">\uD83C\uDFF0 Crear Guild</button>
        <button class="btn btn-secondary" onclick="importReceipt()">\uD83D\uDCE5 Unirme con invitación</button>
      </div>
    `;
    return;
  }
  
  // Has guild
  const members = gameState.guildMembers || [];
  const sorted = [...members].sort((a, b) => (b.totalXp || 0) - (a.totalXp || 0));
  
  let membersHtml = '';
  sorted.forEach((m, idx) => {
    const isMe = m.oderId === getPlayerId();
    const medal = idx === 0 ? '\uD83E\uDD47' : idx === 1 ? '\uD83E\uDD48' : idx === 2 ? '\uD83E\uDD49' : '▪️';
    const classIcon = typeof CLASS_TREE !== 'undefined' && CLASS_TREE[m.classId] 
      ? CLASS_TREE[m.classId].icon : '\uD83E\uDDD1‍\uD83C\uDF3E';
    
    membersHtml += `
      <div class="card" style="display: flex; align-items: center; gap: 12px; ${isMe ? 'border-color: var(--gold);' : ''}">
        <div style="font-size: 20px;">${medal}</div>
        <div style="font-size: 28px;">${classIcon}</div>
        <div style="flex: 1;">
          <div style="font-weight: 700;">${m.odeName} ${isMe ? '(tú)' : ''}</div>
          <div style="font-size: 12px; color: var(--text-muted);">
            Lv ${m.level} · ${m.className || 'Novato'} · \uD83D\uDD25${m.streak || 0}
          </div>
        </div>
        <div style="text-align: right;">
          <div style="font-size: 16px; color: var(--gold);">${(m.totalXp || 0).toLocaleString()} XP</div>
          <div style="font-size: 10px; color: var(--text-muted);">sync: ${m.lastSync || '?'}</div>
        </div>
      </div>
    `;
  });
  
  container.innerHTML = `
    <div style="text-align: center; margin-bottom: 16px;">
      <div style="font-size: 13px; color: var(--text-muted);">GUILD</div>
      <h2 style="color: var(--gold);">⚔️ ${gameState.guildName}</h2>
      <div style="font-size: 12px; color: var(--text-muted);">${members.length} miembro${members.length !== 1 ? 's' : ''}</div>
    </div>
    
    <div class="section-title">Ranking</div>
    ${membersHtml}
    
    <div class="section-title" style="margin-top: 20px;">Acciones</div>
    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px;">
      <button class="btn btn-gold" onclick="exportReceipt()">\uD83D\uDCE4 Enviar recibo</button>
      <button class="btn btn-secondary" onclick="importReceipt()">\uD83D\uDCE5 Recibir recibo</button>
    </div>
    <button class="btn btn-ghost" style="width: 100%; margin-top: 8px;" onclick="exportGuildInvite()">\uD83D\uDD17 Invitar a alguien</button>
  `;
}

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
// ===========================================================================

function renderQuests() {
  const container = document.getElementById('quests-container');
  if (!container) return;
  
  // Update count in header
  const countEl = document.getElementById('quests-count');
  if (typeof initQuestState === 'function') initQuestState();
  if (typeof checkDailyQuestReset === 'function') checkDailyQuestReset();
  const active = typeof getActiveQuests === 'function' ? getActiveQuests() : [];
  if (countEl) {
    countEl.textContent = `${active.length} activa${active.length !== 1 ? 's' : ''}`;
  }
  
  // Check if quests.js loaded
  if (typeof QUESTS === 'undefined') {
    container.innerHTML = '<div class="text-muted text-center">Sistema de quests cargando...</div>';
    return;
  }
  
  if (active.length === 0) {
    container.innerHTML = `
      <div class="card" style="text-align: center; padding: 24px;">
        <div style="font-size: 32px; margin-bottom: 12px;">\uD83D\uDCDC</div>
        <div style="color: var(--text-muted);">No tienes quests activas</div>
        <button class="btn btn-primary" style="margin-top: 16px;" onclick="showAvailableQuests()">
          Ver quests disponibles
        </button>
      </div>
    `;
    return;
  }
  
  container.innerHTML = '';
  
  for (const quest of active) {
    const questId = quest.id;
    // getQuestProgress uses gameState.quests[questId] internally
    const prog = typeof getQuestProgress === 'function' ? getQuestProgress(questId) : null;
    const progressPct = prog ? prog.percent : 0;
    
    const typeColors = {
      daily: 'var(--green)',
      simple: 'var(--blue)',
      compound: 'var(--purple)',
      story: 'var(--gold)',
      bounty: 'var(--red)',
      class_quest: 'var(--cyan)',
      event: 'var(--orange)'
    };
    const color = typeColors[quest.type] || 'var(--text-muted)';
    
    container.innerHTML += `
      <div class="card" onclick="showQuestDetail('${questId}')" style="cursor: pointer; border-left: 3px solid ${color};">
        <div style="display: flex; justify-content: space-between; align-items: flex-start;">
          <div>
            <div style="font-size: 11px; color: ${color}; text-transform: uppercase; margin-bottom: 4px;">
              ${quest.type}
            </div>
            <div style="font-weight: 700;">${quest.name}</div>
            <div style="font-size: 12px; color: var(--text-muted); margin-top: 4px;">${quest.desc || ''}</div>
          </div>
          <div style="text-align: right;">
            <div style="font-size: 20px;">${quest.icon || '\uD83D\uDCDC'}</div>
          </div>
        </div>
        <div style="margin-top: 12px;">
          <div style="height: 4px; background: var(--border); border-radius: 2px; overflow: hidden;">
            <div style="height: 100%; width: ${progressPct}%; background: ${color}; border-radius: 2px;"></div>
          </div>
          <div style="font-size: 11px; color: var(--text-muted); margin-top: 4px;">${progressPct}% completado</div>
        </div>
      </div>
    `;
  }
  
  // Add button to see more quests
  container.innerHTML += `
    <button class="btn btn-ghost" style="width: 100%; margin-top: 8px;" onclick="showAvailableQuests()">
      + Ver más quests
    </button>
  `;
}

function showAvailableQuests() {
  const modal = document.getElementById('modal-tasks');
  const list  = document.getElementById('modal-tasks-list');
  const title = document.getElementById('modal-tasks-title');
  if (!modal || !list || !title) return;
  title.textContent = '\uD83D\uDCDC Quests disponibles';

  if (typeof QUESTS === 'undefined') {
    list.innerHTML = '<div class="text-muted">Sistema de quests no disponible</div>';
    openModal('modal-tasks');
    return;
  }

  // Ensure update2 patches are applied (idempotent — safe to call every time)
  if (typeof window !== 'undefined' && window.LifeXPUpdate2) {
    if (typeof window.LifeXPUpdate2.patchQuests === 'function') window.LifeXPUpdate2.patchQuests();
    if (typeof window.LifeXPUpdate2.patchExpansionQuestLanguage === 'function') window.LifeXPUpdate2.patchExpansionQuestLanguage();
  }

  const typeConfig = {
    daily:       { color: 'var(--green)',  label: 'Diaria',    icon: '\uD83D\uDCC5' },
    simple:      { color: 'var(--blue)',   label: 'Misión',    icon: '\uD83D\uDCDC' },
    compound:    { color: 'var(--purple)', label: 'Compuesta', icon: '\uD83D\uDCDA' },
    story:       { color: 'var(--gold)',   label: 'Historia',  icon: '⭐' },
    bounty:      { color: 'var(--red)',    label: 'Bounty',    icon: '\uD83C\uDFAF' },
    class_quest: { color: 'var(--cyan)',   label: 'Clase',     icon: '⚔️' },
    event:       { color: 'var(--orange)', label: 'Evento',    icon: '\uD83C\uDF89' },
  };

  // getAvailableQuests() (quests.js) applies level/class/stat/active/completed filters
  const available = typeof getAvailableQuests === 'function' ? getAvailableQuests() : [];

  list.innerHTML = '';
  let count = 0;

  for (const quest of available) {
    const questId = quest.id;

    const cfg   = typeConfig[quest.type] || { color: 'var(--text-muted)', label: quest.type, icon: '\uD83D\uDCDC' };
    // Prefer EN fantasy name if patched by update2, fall back to ES name
    const displayName = quest.name || questId;
    // Lore line: setting > lore > desc (in that priority — setting is the world-flavour hook)
    const loreLine = quest.setting || quest.lore || '';
    // Practical desc always shown below (ES)
    const practicalDesc = quest.desc || '';

    const rewardXp   = quest.rewards?.xp   || 0;
    const rewardGold = quest.rewards?.gold  || 0;
    const rewardItems = (quest.rewards?.items || []).length;

    list.innerHTML += `
      <div class="card" style="cursor:pointer;border-left:3px solid ${cfg.color};margin-bottom:8px;" onclick="acceptQuest('${questId}')">
        <div style="display:flex;justify-content:space-between;align-items:flex-start;gap:8px;">
          <div style="flex:1;min-width:0;">
            <div style="font-size:10px;color:${cfg.color};text-transform:uppercase;letter-spacing:1px;margin-bottom:2px;">${cfg.icon} ${cfg.label}</div>
            <div style="font-weight:700;font-size:14px;color:var(--text);margin-bottom:4px;">${escapeHtml(displayName)}</div>
            ${loreLine ? `<div style="font-size:12px;color:var(--text-muted);font-style:italic;line-height:1.4;margin-bottom:4px;">${escapeHtml(loreLine)}</div>` : ''}
            ${practicalDesc ? `<div style="font-size:11px;color:var(--text-muted);line-height:1.4;">${escapeHtml(practicalDesc)}</div>` : ''}
          </div>
        </div>
        <div style="display:flex;gap:10px;margin-top:8px;padding-top:6px;border-top:1px solid var(--border);">
          ${rewardXp   ? `<span style="font-size:11px;color:var(--gold);">+${rewardXp} XP</span>` : ''}
          ${rewardGold ? `<span style="font-size:11px;color:var(--gold);">+${rewardGold} \uD83E\uDE99</span>` : ''}
          ${rewardItems ? `<span style="font-size:11px;color:var(--blue);">+${rewardItems} objeto${rewardItems>1?'s':''}</span>` : ''}
        </div>
      </div>
    `;
    count++;
  }

  if (!count) {
    list.innerHTML = '<div class="text-muted text-center" style="padding:20px;">No hay quests disponibles ahora</div>';
  }

  openModal('modal-tasks');
}

// ===========================================================================
// QUEST FUNCTIONS — delegations to quests.js canonical implementations
// (Fase E saneamiento: duplicados eliminados, game.js delega a quests.js)
// ===========================================================================

function acceptQuest(questId) {
  if (typeof window.acceptQuestCanonical !== 'function') return;
  const result = window.acceptQuestCanonical(questId);
  if (result && !result.success) {
    if (typeof showToast === 'function') showToast(result.message, 'error');
    return;
  }
  closeModal('modal-tasks');
  renderQuests();
}

function showQuestDetail(questId) {
  if (typeof QUESTS === 'undefined') return;
  const quest = QUESTS[questId];
  if (!quest) return;

  const prog = typeof getQuestProgress === 'function' ? getQuestProgress(questId) : null;
  const typeInfo = typeof getQuestTypeInfo === 'function' ? getQuestTypeInfo(quest.type) : {};
  const color = typeInfo.color || 'var(--gold)';

  let objectivesHtml = '';
  if (prog && prog.objectives) {
    objectivesHtml = prog.objectives.map(obj => {
      const fmt = typeof formatObjective === 'function' ? formatObjective(obj) : { text: obj.type, progress: `${obj.progress}/${obj.count}`, done: false };
      return `<div style="display:flex;justify-content:space-between;align-items:center;padding:6px 0;border-bottom:1px solid var(--border);">
        <span style="font-size:12px;color:${fmt.done ? 'var(--green)' : 'var(--text)'};">${fmt.done ? '\u2713 ' : ''}${escapeHtml(fmt.text)}</span>
        <span style="font-size:11px;color:var(--text-muted);">${fmt.progress}</span>
      </div>`;
    }).join('');
  }

  const contentEl = document.getElementById('modal-item-content');
  contentEl.innerHTML = `
    <div style="text-align:center;margin-bottom:16px;">
      <div style="font-size:48px;">${quest.icon || '\uD83D\uDCDC'}</div>
      <h3 style="margin-top:8px;color:${color};">${escapeHtml(quest.name)}</h3>
      <div style="font-size:12px;color:var(--text-muted);">${escapeHtml(quest.desc || '')}</div>
    </div>
    ${objectivesHtml ? `<div style="margin-bottom:12px;">${objectivesHtml}</div>` : ''}
    <div style="font-size:12px;color:var(--gold);">
      Recompensa: +${quest.rewards?.xp || 0} XP | +${quest.rewards?.gold || 0} \uD83E\uDE99
    </div>
  `;

  const actionBtn = document.getElementById('btn-item-action');
  actionBtn.textContent = '\u274C Abandonar quest';
  actionBtn.onclick = () => abandonQuest(questId);
  openModal('modal-item');
}

function abandonQuest(questId) {
  if (typeof window.abandonQuestCanonical === 'function') window.abandonQuestCanonical(questId);
  closeModal('modal-item');
  renderQuests();
}

// updateQuestProgress and completeQuest are defined in quests.js (canonical).
// game.js does NOT redefine them — quests.js loads first and its definitions stand.

// ===========================================================================
// PWA Service Worker Registration
// ===========================================================================

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register(`sw.js?build=${LIFE_XP_BUILD}`, { updateViaCache: 'none' }).then(reg => reg.update()).catch(() => {
      console.log('Service worker registration failed (expected in dev)');
    });
  });
}


// ============================================================================
// LifeXP Block 1 - item system compatibility layer
// ============================================================================

function escapeItemHtml(value) {
  return String(value ?? '').replace(/[&<>"']/g, ch => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));
}
const escapeHtml = escapeItemHtml; // alias for quest/UI rendering

function initializeItemSystem() {
  if (!gameState.itemSystem || typeof gameState.itemSystem !== 'object') gameState.itemSystem = {};
  if (!gameState.itemSystem.attunement || typeof gameState.itemSystem.attunement !== 'object') gameState.itemSystem.attunement = {};
  if (!gameState.itemSystem.rituals || typeof gameState.itemSystem.rituals !== 'object') gameState.itemSystem.rituals = {};
  if (!gameState.itemSystem.curses || typeof gameState.itemSystem.curses !== 'object') gameState.itemSystem.curses = {};
  gameState.itemSystem.version = 1;
  if (typeof ITEMS !== 'undefined') {
    Object.values(ITEMS).forEach(normalizeItemDefinition);
  }
}

function normalizeItemDefinition(item) {
  if (!item) return item;
  if (!Array.isArray(item.effects)) item.effects = [];
  if (item.effect && typeof item.effect === 'object' && !item.effects.some(e => e.id === 'legacy_effect')) {
    item.effects.push({ id: 'legacy_effect', name: 'Legacy effect', description: item.passive || '', legacy: item.effect });
  }
  if (item.passive && !item.effects.some(e => e.description === item.passive)) {
    item.effects.push({ id: 'legacy_passive', name: 'Passive', description: item.passive, legacy: true });
  }
  item.lore = item.lore || item.desc || '';
  item.requirements = item.requirements || {};
  item.requirements.stats = item.requirements.stats || {};
  item.requirements.trainingId = item.requirements.trainingId || null;
  item.attunement = item.attunement || { required: false, current: 0, max: 3, stages: [] };
  item.attunement.max = Number(item.attunement.max || 3);
  item.activation = item.activation || null;
  item.curse = item.curse || null;
  return item;
}

function getItemDefinition(itemId) {
  return typeof ITEMS !== 'undefined' && ITEMS[itemId] ? normalizeItemDefinition(ITEMS[itemId]) : null;
}

function getItemAttunement(itemId) {
  initializeItemSystem();
  const item = getItemDefinition(itemId);
  const max = Math.max(1, Number(item?.attunement?.max || 3));
  const saved = gameState.itemSystem.attunement[itemId] || {};
  return { xp: Number(saved.xp || 0), stage: Math.min(max, Number(saved.stage || 0)), max };
}

function getItemAttunementStage(itemId) {
  return getItemAttunement(itemId).stage;
}

function recordItemAttunement(itemId, amount = 1) {
  const item = getItemDefinition(itemId);
  if (!item || !item.attunement?.required) return false;
  initializeItemSystem();
  const state = getItemAttunement(itemId);
  state.xp += Math.max(0, Number(amount) || 0);
  state.stage = Math.min(state.max, Math.floor(state.xp / 3));
  gameState.itemSystem.attunement[itemId] = state;
  saveGame();
  return true;
}

function recordItemAttunementFromTask(task) {
  if (!task || !gameState?.equipment) return;
  Object.values(gameState.equipment).filter(Boolean).forEach(id => {
    const item = getItemDefinition(id);
    if (!item?.attunement?.required) return;
    const themes = item.attunement.themes || item.themes || [];
    const taskThemes = task.drops?.theme ? [task.drops.theme] : [];
    const matches = !themes.length || themes.some(t => taskThemes.includes(t));
    if (matches) { recordItemAttunement(id, 1); advanceItemRitual(id, task); }
  });
}

function getPlayerStatForRequirement(stat) {
  return Number(gameState?.stats?.[stat] || 0) + Number(getEquipmentStats?.()[stat] || 0);
}

function getItemRequirementStatus(itemId) {
  const item = getItemDefinition(itemId);
  if (!item) return { canEquip: false, reasons: ['Objeto desconocido'] };
  const reasons = [];
  for (const [stat, needed] of Object.entries(item.requirements?.stats || {})) {
    const actual = getPlayerStatForRequirement(stat);
    if (actual < needed) reasons.push(`Requiere ${(STATS[stat]?.abbr || stat).toUpperCase()} ${needed} (actual ${actual})`);
  }
  if (item.requirements?.trainingId && !(gameState.training?.[item.requirements.trainingId] || gameState.unlockedTrainings?.includes?.(item.requirements.trainingId))) {
    reasons.push(`Necesita entrenamiento: ${item.requirements.trainingName || item.requirements.trainingId}`);
  }
  const att = getItemAttunement(itemId);
  if (item.attunement?.required && att.stage < Number(item.attunement.minimumStage || 0)) reasons.push(`Necesita aclimatación (${att.stage}/${item.attunement.minimumStage})`);
  return { canEquip: reasons.length === 0, reasons, attunement: att };
}

// Override equipment entry point while preserving old item behavior.
function equipItem(itemId) {
  const item = getItemDefinition(itemId);
  if (!item || !item.type) return false;
  const status = getItemRequirementStatus(itemId);
  if (!status.canEquip) {
    if (typeof showToast === 'function') showToast(status.reasons[0], 'error');
    return false;
  }
  const type = ITEM_TYPE[item.type];
  if (!type || !type.slot) return false;
  let slot = type.slot;
  if (slot === 'accessory') slot = !gameState.equipment.accessory1 ? 'accessory1' : (!gameState.equipment.accessory2 ? 'accessory2' : 'accessory1');
  const current = gameState.equipment[slot];
  if (current && !addToInventory(current)) return false;
  if (!removeFromInventory(itemId)) return false;
  gameState.equipment[slot] = itemId;
  initializeItemSystem();
  if (item.attunement?.required && !gameState.itemSystem.attunement[itemId]) gameState.itemSystem.attunement[itemId] = { xp: 0, stage: 0 };
  saveGame();
  return true;
}

function getEquippedItemEffects() {
  const effects = [];
  Object.values(gameState?.equipment || {}).filter(Boolean).forEach(id => {
    const item = getItemDefinition(id);
    if (item?.effects) item.effects.forEach(effect => effects.push({ ...effect, itemId: id }));
  });
  return effects;
}

function registerItemCurse(itemId, curseState = {}) {
  initializeItemSystem();
  gameState.itemSystem.curses[itemId] = { active: true, marks: 0, ...curseState };
  saveGame();
}

function getItemCurseState(itemId) {
  initializeItemSystem();
  return gameState.itemSystem.curses[itemId] || { active: false, marks: 0 };
}

function canUnequipItem(slot) {
  const itemId = gameState.equipment?.[slot];
  if (!itemId) return { ok: false, reason: 'No hay objeto equipado.' };
  const curse = getItemCurseState(itemId);
  const item = getItemDefinition(itemId);
  if (curse.active && item?.curse?.cannotUnequip) return { ok: false, reason: item.curse.removeHint || 'El objeto no puede desequiparse todavía.' };
  return { ok: true };
}

function unequipItem(slot) {
  const check = canUnequipItem(slot);
  if (!check.ok) { if (typeof showToast === 'function') showToast(check.reason, 'error'); return false; }
  const itemId = gameState.equipment[slot];
  if (!itemId || !canAddToInventory()) return false;
  if (!addToInventory(itemId)) return false;
  gameState.equipment[slot] = null;
  saveGame();
  return true;
}

// Item modal: effect-first information hierarchy and balanced actions.

function showEquippedItemModal(slot) {
  const itemId = gameState.equipment?.[slot]; if (!itemId) return;
  showItemModal(itemId, 'equipped');
  const actionBtn = document.getElementById('btn-item-action');
  const check = canUnequipItem(slot);
  actionBtn.textContent = check.ok ? 'Desequipar' : check.reason;
  actionBtn.disabled = !check.ok;
  actionBtn.onclick = () => unequipItemToInventory(slot);
}



// ============================================================================
// Block 2.1 - inventory identity recovery
// Alias resolution lives in inventory_system.js (single source of truth).
// ============================================================================

// Delegates to the canonical inventory system loaded in inventory_system.js.
function resolveInventoryItemId(slot) {
  if (window.LifeXPInventory && typeof window.LifeXPInventory.resolve === 'function') {
    return window.LifeXPInventory.resolve(slot);
  }
  // Fallback: direct ID lookup only (no alias resolution without the canonical system).
  if (!slot) return null;
  const id = typeof slot === 'string' ? slot : slot.id;
  return (id && typeof ITEMS !== 'undefined' && ITEMS[id]) ? id : null;
}

function repairInventoryIdentities() {
  if (window.LifeXPInventory && typeof window.LifeXPInventory.repair === 'function') {
    return window.LifeXPInventory.repair();
  }
  return false;
}

function itemIconSvg(item, size = 38) {
  const type = item?.type || 'material';
  const color = RARITY[item?.rarity]?.color || '#c9c5bb';
  const paths = {
    weapon: '<path d="M10 31 28 7l4 4-18 24H10z"/><path d="m8 33 8-2M25 10l4 4"/>',
    armor: '<path d="M12 7c3 3 9 3 12 0l5 5-3 18H10L7 12l5-5z"/><path d="M16 10v17m4-17v17"/>',
    accessory: '<circle cx="20" cy="20" r="10"/><circle cx="20" cy="20" r="4"/>',
    artifact: '<path d="m20 5 5 9-5 15-5-15 5-9z"/><path d="M9 20h22M12 13h16"/>',
    consumable: '<path d="M14 6h12M16 6v6l-5 14c-.5 2 1 4 3 4h12c2 0 3.5-2 3-4l-5-14V6"/><path d="M13 21h14"/>',
    material: '<path d="m20 5 11 7-11 17L9 12 20 5z"/><path d="m9 12 11 7 11-7"/>',
    skill: '<path d="M10 5h20v30H10z"/><path d="M15 12h10M15 18h10M15 24h7"/>',
    key: '<circle cx="13" cy="25" r="6"/><path d="m18 21 13-13M25 12l4 4M21 16l4 4"/>'
  };
  return `<svg class="item-icon-svg" width="${size}" height="${size}" viewBox="0 0 40 40" aria-hidden="true" style="color:${color}"><g fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${paths[type] || paths.material}</g></svg>`;
}

function renderInventoryGrid() {
  const grid = document.getElementById('inventory-grid');
  const empty = document.getElementById('inventory-empty');
  if (!grid) return;
  repairInventoryIdentities();
  const list = Array.isArray(gameState.inventory) ? gameState.inventory : [];
  if (list.length === 0) { grid.innerHTML = ''; empty?.classList.remove('hidden'); return; }
  empty?.classList.add('hidden');
  grid.innerHTML = list.map((slot, index) => {
    const id = resolveInventoryItemId(slot);
    const item = id ? ITEMS[id] : null;
    if (!item) return `<div class="inv-slot inv-slot-recovery" onclick="showLegacyItemModal(${index})"><div class="recovery-icon">?</div><div>Unidentified item</div><small>Review recovery</small></div>`;
    const rarity = RARITY[item.rarity] || RARITY.common;
    const qty = slot.qty || 1;
    return `<div class="inv-slot item-card" onclick="showItemModal('${id}')" style="border-color:${rarity.color}"><div class="item-card-icon">${itemIconSvg(item, 40)}</div><div class="item-card-name" style="color:${rarity.color}">${escapeItemHtml(item.name)}</div>${qty > 1 ? `<div class="item-card-qty">x${qty}</div>` : ''}</div>`;
  }).join('');
}

function renderStashGrid() {
  const grid = document.getElementById('stash-grid');
  const empty = document.getElementById('stash-empty');
  if (!grid) return;
  repairInventoryIdentities();
  const list = Array.isArray(gameState.stash) ? gameState.stash : [];
  if (!list.length) { grid.innerHTML = ''; empty?.classList.remove('hidden'); return; }
  empty?.classList.add('hidden');
  grid.innerHTML = list.map((slot, index) => {
    const id = resolveInventoryItemId(slot), item = id ? ITEMS[id] : null;
    if (!item) return `<div class="inv-slot inv-slot-recovery"><div class="recovery-icon">?</div><small>Unidentified item</small></div>`;
    const rarity = RARITY[item.rarity] || RARITY.common;
    return `<div class="inv-slot item-card" onclick="showStashItemModal('${id}')" style="border-color:${rarity.color}"><div class="item-card-icon">${itemIconSvg(item, 40)}</div><div class="item-card-name" style="color:${rarity.color}">${escapeItemHtml(item.name)}</div></div>`;
  }).join('');
}


// ============================================================================
// Block 2.2 - attunement gates and in-app activation
// ============================================================================

function getItemActivationState(itemId) {
  initializeItemSystem();
  const item = getItemDefinition(itemId);
  const req = item?.activation?.requirement || {};
  const saved = gameState.itemSystem.rituals[itemId] || {};
  const count = Number(saved.count || 0);
  const needed = Number(req.count || 0);
  return { count, needed, ready: needed > 0 && count >= needed, active: Boolean(saved.active), discovered: Boolean(saved.discovered) };
}

function getTaskTheme(task) {
  return task?.drops?.theme || task?.theme || null;
}

function isTaskRelevantToItem(task, item) {
  const themes = item?.attunement?.themes || item?.themes || item?.activation?.requirement?.themes || [];
  const taskTheme = getTaskTheme(task);
  return Boolean(taskTheme && themes.includes(taskTheme));
}

function advanceItemRitual(itemId, task) {
  const item = getItemDefinition(itemId);
  const req = item?.activation?.requirement;
  if (!item?.activation || !req?.count || !isTaskRelevantToItem(task, item)) return false;
  initializeItemSystem();
  const state = gameState.itemSystem.rituals[itemId] || { count: 0, active: false, discovered: true };
  if (!state.active) state.count = Math.min(Number(req.count), Number(state.count || 0) + 1);
  state.discovered = true;
  gameState.itemSystem.rituals[itemId] = state;
  return true;
}

function attemptItemActivation(itemId) {
  const item = getItemDefinition(itemId);
  const state = getItemActivationState(itemId);
  if (!item?.activation || !state.ready || state.active) return { success: false, reason: 'not_ready' };
  initializeItemSystem();
  gameState.itemSystem.rituals[itemId] = { ...state, active: true, discovered: true, activatedAt: Date.now() };
  saveGame();
  // Show ritual flavor text
  setTimeout(function() { showRitualFlavor(itemId); }, 300);
  return { success: true };
}




function renderItemEffectList(itemId) {
  const item = getItemDefinition(itemId);
  const att = getItemAttunement(itemId);
  const ritual = getItemActivationState(itemId);
  return (item?.effects || []).map(effect => {
    const unlocked = isItemEffectUnlocked(itemId, effect);
    if (unlocked) return `<div class="item-effect"><strong>${escapeItemHtml(effect.name || 'Effect')}</strong><br>${escapeItemHtml(effect.description || '')}</div>`;
    const stage = Number(effect.unlockStage || 1);
    const ritualText = effect.activationRequired ? ' · Ritual required' : '';
    return `<div class="item-effect item-effect-locked"><strong>Locked effect</strong><br>${escapeItemHtml(effect.name || 'Unknown effect')} · Unlocks at Attunement ${stage}/ ${att.max}${ritualText}</div>`;
  }).join('');
}


function attemptActivationFromModal(itemId) {
  const result = attemptItemActivation(itemId);
  if (!result.success) { if (typeof showToast === 'function') showToast('The ritual is not ready.', 'error'); return; }
  // showRitualFlavor() already presents the item-specific persistent text.
  showItemModal(itemId, 'inventory');
}

function showItemModal(itemId, container) {
  container = container || 'inventory';
  selectedItemId = itemId;
  var item = getItemDefinition(itemId);
  if (!item) return;

  // Show first_look flavor text the first time this item's modal is opened
  if (container !== 'equipped') {
    initializeItemSystem();
    if (!gameState.itemSystem.firstSeen) gameState.itemSystem.firstSeen = {};
    if (!gameState.itemSystem.firstSeen[itemId]) {
      gameState.itemSystem.firstSeen[itemId] = true;
      saveGame();
      setTimeout(function() {
        var flavorText = getItemFlavorText(itemId, 'first_look');
        if (flavorText) showFlavorDialog(flavorText, 'default');
      }, 400);
    }
  }
  var rarity  = RARITY[item.rarity]  || RARITY.common;
  var type    = ITEM_TYPE[item.type] || { name: item.type || 'Objeto', slot: null };
  var qty     = container === 'stash'
    ? ((gameState.stash || []).find(function(s){ return s.id === itemId; }) || {}).qty || 1
    : getItemCount(itemId);
  var req = getItemRequirementStatus(itemId);
  var att = req.attunement;

  // == HEADER ================================================================
  var html = '';
  html += '<div style="text-align:center;padding-bottom:10px;border-bottom:1px solid var(--border);margin-bottom:10px;">';
  html += '<div style="font-size:48px;line-height:1;margin-bottom:6px;">' + (item.icon || '\uD83D\uDCE6') + '</div>';
  html += '<div style="font-size:18px;font-weight:700;color:' + rarity.color + ';letter-spacing:.3px;">' + escapeItemHtml(item.name) + '</div>';
  html += '<div style="font-size:11px;color:var(--text-muted);text-transform:uppercase;letter-spacing:1px;margin-top:3px;">';
  html += escapeItemHtml(type.name) + ' · <span style="color:' + rarity.color + ';">' + escapeItemHtml(rarity.name) + '</span>';
  if (qty > 1) html += ' · ×' + qty;
  html += '</div></div>';

  // == LORE ==================================================================
  var lore = item.lore || item.desc || '';
  if (lore) {
    html += '<div style="font-size:13px;color:var(--text-muted);font-style:italic;line-height:1.5;margin-bottom:8px;">' + escapeItemHtml(lore) + '</div>';
  }

  // == STATS =================================================================
  var statsEntries = Object.entries(item.stats || {}).filter(function(e){ return e[1]; });
  if (statsEntries.length) {
    html += '<div style="display:flex;flex-wrap:wrap;gap:6px;margin:8px 0;">';
    statsEntries.forEach(function(entry) {
      var s = entry[0], v = entry[1];
      var statColor = 'var(--stat-' + s + ', var(--text))';
      html += '<span style="background:var(--bg-surface);border:1px solid var(--stat-' + s + ',var(--border));border-radius:6px;padding:3px 8px;font-size:12px;font-weight:600;color:' + statColor + ';">';
      html += (STATS[s] ? STATS[s].abbr : s.toUpperCase());
      html += ' <span style="color:var(--green);">+' + v + '</span></span>';
    });
    html += '</div>';
  }

  // == PASSIVE ===============================================================
  if (item.passive) {
    html += '<div style="font-size:11px;color:var(--gold);margin:4px 0;">✦ ' + escapeItemHtml(item.passive) + '</div>';
  }

  // == EFFECTS (only known) ==================================================
  var knownEffects = (item.effects || []).filter(function(e){ return isItemEffectKnown(itemId, e); });
  if (knownEffects.length) {
    html += '<div class="item-panel" style="margin-top:10px;">';
    html += '<div class="item-panel-label" style="color:var(--orange);font-size:10px;letter-spacing:1px;text-transform:uppercase;margin-bottom:6px;">Efectos conocidos</div>';
    knownEffects.forEach(function(e) {
      var unlocked = isItemEffectUnlocked(itemId, e);
      if (unlocked) {
        html += '<div style="font-size:12px;margin-bottom:4px;">';
        html += '<span style="color:var(--orange);font-weight:600;">' + escapeItemHtml(e.name || 'Efecto') + '</span>';
        html += ' <span style="color:var(--text-muted);">— ' + escapeItemHtml(e.description || '') + '</span></div>';
      } else {
        html += '<div style="font-size:12px;margin-bottom:4px;color:var(--text-muted);opacity:.5;">\uD83D\uDD12 ' + escapeItemHtml(e.name || 'Efecto');
        html += ' <span style="font-size:10px;">(Aclimatación ' + (e.unlockStage || '?') + '/' + att.max + (e.activationRequired ? ' · Ritual' : '') + ')</span></div>';
      }
    });
    html += '</div>';
  }

  // == REQUIREMENTS — progressive discovery, no spoilers ===================
  // Requirements are never shown as a stat list. The player discovers them
  // by attempting to equip. If they've tried before, show a single flavor hint.
  var equipAttempts = (gameState.itemSystem && gameState.itemSystem.equipAttempts && gameState.itemSystem.equipAttempts[itemId]) || 0;
  if (!req.canEquip && equipAttempts > 0) {
    // Show a vague hint — evocative, not a stat sheet
    var hint = (req.flavorReasons && req.flavorReasons[0]) || 'Algo en ti todavía no está listo para esto.';
    html += '<div style="margin-top:8px;font-size:12px;color:var(--text-muted);font-style:italic;padding:8px;background:var(--bg-surface);border-radius:6px;border-left:2px solid var(--border);">⟳ ' + escapeItemHtml(hint) + '</div>';
  }

  // == ATTUNEMENT (only if stage > 0 or equipped) ===========================
  if (item.attunement && item.attunement.required && (att.stage > 0 || container === 'equipped')) {
    var attText = (item.attunement.stages && item.attunement.stages[att.stage])
      || (att.stage >= att.max ? 'Attunement complete.' : 'The item has not responded yet.');
    var attPct = Math.min(100, att.stage / att.max * 100);
    html += '<div class="item-panel" style="margin-top:8px;">';
    html += '<div class="item-panel-label" style="font-size:10px;letter-spacing:1px;text-transform:uppercase;margin-bottom:4px;color:var(--purple);">Aclimatación</div>';
    html += '<div style="display:flex;align-items:center;gap:8px;margin-bottom:4px;">';
    html += '<div style="flex:1;height:4px;background:var(--bg-surface);border-radius:2px;overflow:hidden;">';
    html += '<div style="height:100%;width:' + attPct + '%;background:var(--purple);border-radius:2px;"></div></div>';
    html += '<span style="font-size:11px;color:var(--purple);">' + att.stage + '/' + att.max + '</span></div>';
    html += '<div style="font-size:12px;color:var(--text-muted);font-style:italic;">' + escapeItemHtml(attText) + '</div>';
    html += '</div>';
  }

  // == ACTIVATION (gated by minimumStage) ===================================
  var minStage = Number((item.attunement && item.attunement.minimumStage) || 1);
  if (!item.attunement || !item.attunement.required || att.stage >= minStage) {
    html += renderActivationPanel(itemId);
  }

  // == CURSE =================================================================
  if (item.curse) {
    html += '<div class="item-panel item-curse" style="margin-top:8px;border-color:var(--red);">';
    html += '<div class="item-panel-label" style="font-size:10px;letter-spacing:1px;text-transform:uppercase;margin-bottom:4px;color:var(--red);">Maldición</div>';
    html += '<div style="font-size:12px;color:var(--red);">' + escapeItemHtml((item.curse && item.curse.description) || 'El objeto lleva una maldición.') + '</div>';
    html += '</div>';
  }

  // == VALUE =================================================================
  html += '<div style="font-size:11px;color:var(--text-muted);margin-top:10px;text-align:right;">' + (item.value || 0) + ' \uD83E\uDE99</div>';

  document.getElementById('modal-item-content').innerHTML = html;

  // == ACTION BUTTON =========================================================
  var actionBtn = document.getElementById('btn-item-action');
  if (!actionBtn) return;
  actionBtn.style.display = 'flex';
  actionBtn.style.visibility = 'visible';
  actionBtn.style.opacity = '1';
  actionBtn.disabled = false;
  if (container === 'stash') {
    actionBtn.textContent = 'Sacar al inventario';
    actionBtn.onclick = function() { moveItemToInventory(itemId); };
  } else if (type.slot || ['weapon', 'armor', 'accessory', 'artifact'].includes(item.type)) {
    // Every equippable item keeps the primary action visible. Do not rely
    // only on ITEM_TYPE.slot: older and expansion definitions may omit it.
    actionBtn.textContent = 'Equipar';
    actionBtn.disabled = false;
    actionBtn.onclick = function() { equipItemFromInventory(itemId); };
  } else if (item.type === 'consumable') {
    actionBtn.textContent = 'Usar';
    actionBtn.onclick = function() { useConsumable(itemId); };
  } else {
    actionBtn.textContent = 'Guardar en baúl';
    actionBtn.onclick = function() { moveItemToStash(itemId); };
  }
  openModal('modal-item');
}


// ============================================================================
// Block 2.3 - hidden item knowledge
// ============================================================================
// Unknown effects are not shown as locked. They remain undiscovered until the
// item teaches them through attunement, activation, combat or another system.
// Items may later opt into visible/known effects with `knowledge: 'known'`.

function getItemKnowledgeState(itemId) {
  initializeItemSystem();
  if (!gameState.itemSystem.knowledge || typeof gameState.itemSystem.knowledge !== 'object') gameState.itemSystem.knowledge = {};
  return gameState.itemSystem.knowledge[itemId] || {};
}

function isItemEffectKnown(itemId, effect) {
  const item = getItemDefinition(itemId);
  const knowledge = getItemKnowledgeState(itemId);
  if (effect.knowledge === 'known' || effect.visibility === 'visible') return true;
  if (knowledge[effect.id] === true) return true;
  const stage = Number(effect.unlockStage || 0);
  return stage > 0 && getItemAttunement(itemId).stage >= stage;
}

function discoverItemEffect(itemId, effectId) {
  const item = getItemDefinition(itemId);
  const effect = item?.effects?.find(e => e.id === effectId);
  if (!effect) return false;
  initializeItemSystem();
  if (!gameState.itemSystem.knowledge || typeof gameState.itemSystem.knowledge !== 'object') gameState.itemSystem.knowledge = {};
  gameState.itemSystem.knowledge[itemId] = { ...(gameState.itemSystem.knowledge[itemId] || {}), [effectId]: true };
  saveGame();
  return true;
}

function isItemEffectUnlocked(itemId, effect) {
  const item = getItemDefinition(itemId);
  const att = getItemAttunement(itemId);
  const needed = Number(effect.unlockStage || 0);
  if (att.stage < needed) return false;
  if (effect.activationRequired && !getItemActivationState(itemId).active) return false;
  return isItemEffectKnown(itemId, effect);
}

function getActiveItemEffects(itemId) {
  const item = getItemDefinition(itemId);
  return (item?.effects || []).filter(effect => isItemEffectUnlocked(itemId, effect));
}



function renderActivationPanel(itemId) {
  const item = getItemDefinition(itemId);
  if (!item?.activation) return '';
  const state = getItemActivationState(itemId);
  if (state.active) return `<div class="item-panel item-activation-active"><div class="item-panel-label">ACTIVATION</div><div>Ritual complete.</div></div>`;
  const progress = `${state.count}/${state.needed}`;
  const button = state.ready ? `<button class="btn btn-primary item-ritual-button" onclick="attemptActivationFromModal('${itemId}')">Attempt activation</button>` : '';
  return `<div class="item-panel"><div class="item-panel-label">ACTIVATION</div><div>${escapeItemHtml(item.activation.description || 'Complete the required tasks.')}</div><div class="ritual-progress">${progress}</div>${button}</div>`;
}
