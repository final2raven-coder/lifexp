// ═══════════════════════════════════════════════════════════════════════════
// LifeXP RPG - Game Engine v1.0
// Bloque 1: Estructura base + Sistema de tareas + Stats
// ═══════════════════════════════════════════════════════════════════════════

const LIFE_XP_BUILD = 'v13.3-block2-hidden-effects';

// ═══════════════════════════════════════════════════════════════════════════
// CONSTANTS
// ═══════════════════════════════════════════════════════════════════════════

const CATEGORIES = {
  casa: { name: 'Casa', icon: '🏠', color: '#f87171' },
  cuerpo: { name: 'Cuerpo', icon: '💪', color: '#4ade80' },
  gestiones: { name: 'Gestiones', icon: '📋', color: '#fbbf24' },
  social: { name: 'Social', icon: '👥', color: '#60a5fa' },
  personal: { name: 'Personal', icon: '🌟', color: '#a78bfa' }
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

// ═══════════════════════════════════════════════════════════════════════════
// DEFAULT TASKS (with side quests and drops)
// ═══════════════════════════════════════════════════════════════════════════

const DEFAULT_TASKS = [
  // ══════════ CASA ══════════
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

  // ══════════ CUERPO ══════════
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

  // ══════════ GESTIONES ══════════
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

  // ══════════ SOCIAL ══════════
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

  // ══════════ PERSONAL ══════════
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

// ═══════════════════════════════════════════════════════════════════════════
// GAME STATE
// ═══════════════════════════════════════════════════════════════════════════

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

// ═══════════════════════════════════════════════════════════════════════════
// UTILITY FUNCTIONS
// ═══════════════════════════════════════════════════════════════════════════

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

// ═══════════════════════════════════════════════════════════════════════════
// TASK LOGIC
// ═══════════════════════════════════════════════════════════════════════════

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

// ═══════════════════════════════════════════════════════════════════════════
// DROP SYSTEM
// ═══════════════════════════════════════════════════════════════════════════



// ═══════════════════════════════════════════════════════════════════════════
// SAVE/LOAD
// ═══════════════════════════════════════════════════════════════════════════

function saveGame() {
  try {
    localStorage.setItem('lifexp_save', JSON.stringify(gameState));
  } catch (e) {
    console.warn('Could not save game:', e);
  }
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

// ═══════════════════════════════════════════════════════════════════════════
// UI RENDERING
// ═══════════════════════════════════════════════════════════════════════════

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
        <div class="alert-icon">📌</div>
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
  document.getElementById('char-class-icon').textContent = cls ? cls.icon : '🧑‍🌾';
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
        <div style="font-size: 24px; color: var(--blue);">💧 ${resources.mp}</div>
        <div style="font-size: 11px; color: var(--text-muted);">MP</div>
      </div>
      <div style="text-align: center;">
        <div style="font-size: 24px; color: var(--green);">⚡ ${resources.sp}</div>
        <div style="font-size: 11px; color: var(--text-muted);">SP</div>
      </div>
      <div style="text-align: center;">
        <div style="font-size: 24px; color: var(--purple);">🎯 ${resources.focusMax}</div>
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
    { key: 'armor', name: 'Armadura', icon: '🛡️' },
    { key: 'accessory1', name: 'Accesorio 1', icon: '💍' },
    { key: 'accessory2', name: 'Accesorio 2', icon: '💍' },
    { key: 'artifact', name: 'Artefacto', icon: '🔮' }
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
  actionBtn.textContent = used ? 'Recuperación ya usada' : '🔄 Rehacer recompensa';
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
      showToast(successText, 'success');
    }
  } else {
    // Record the attempt
    gameState.itemSystem.equipAttempts[itemId] = prevAttempts + 1;
    saveGame();

    // Show flavor toast — evocative, not a stat sheet
    var situation = prevAttempts === 0 ? 'equip_fail_1' : 'equip_fail_n';
    var flavor = getItemFlavorText(itemId, situation);
    if (typeof showToast === 'function') showToast(flavor, 'error');

    // Refresh modal so the hint appears
    showItemModal(itemId, 'inventory');
  }
}

// ═══════════════════════════════════════════════════════════════════════════
// ITEM FLAVOR TEXT SYSTEM
// Per-item, per-situation English narrative text.
// Situations:
//   first_look     — first time the modal is opened (item only in inventory)
//   equip_fail_1   — first failed equip attempt
//   equip_fail_n   — subsequent failed equip attempts
//   equip_success  — first successful equip
//   attune_1/2/3   — attunement stage advances
//   ritual         — ritual/activation triggered
// ═══════════════════════════════════════════════════════════════════════════

const ITEM_FLAVOR_TEXT = {

  // ── WEAPONS ──────────────────────────────────────────────────────────────

  cuchilla_llameante: {
    first_look:    'The blade is warm to the touch. Not hot — warm, the way a stone holds heat long after the fire has moved on. You do not know yet what it asks of you.',
    equip_fail_1:  'Your hand closes around the grip and the warmth pulls back. The sword does not resist you. It simply waits, as if it already knows you are not ready.',
    equip_fail_n:  'Again the heat retreats when you reach for it. Something in the blade measures you each time. You are closer than you were. That is not nothing.',
    equip_success: 'The warmth does not retreat this time. It spreads up your arm slowly, like a fire remembering how to breathe. The blade is yours now — or you are its.',
    attune_1:      'The edge catches the light differently. You notice it only when you stop looking directly at it.',
    attune_2:      'During a task, the grip grew hot for a moment. You did not drop it. The blade noticed.',
    attune_3:      'The old heat answers without being forced. Whatever the sword was waiting for, you have become it.',
    ritual:        'The pressure builds in the blade and releases in a single breath. The second burn is shorter, sharper. The sword has remembered something it had forgotten.'
  },

  daga_corrosiva: {
    first_look:    'The edge is dark where the acid has eaten into the metal. It should be ruined. Instead it is sharper than anything you have seen. You are not sure whether to be impressed or careful.',
    equip_fail_1:  'The dagger slips from your grip — not from your hand, but from something deeper. Your body knows it is not ready to carry what this blade has already dissolved.',
    equip_fail_n:  'The acid smell is stronger when you try. The blade is patient. It has been waiting a long time already.',
    equip_success: 'The grip settles into your hand like it was always going to end up there. The acid smell fades. The dagger has decided you are worth the wait.',
    attune_1:      'The corrosion pattern shifts slightly when you hold it. You are not imagining it.',
    attune_2:      'A task left a mark on your hands. The dagger recognized it.',
    attune_3:      'The blade and the acid have reached an agreement. So have you and the blade.'
  },

  espada_radiante: {
    first_look:    'The light it holds is not a reflection. It comes from somewhere inside the metal, steady and unhurried. You have the feeling it has been waiting in the dark for a long time.',
    equip_fail_1:  'The light dims when you reach for the hilt. Not in anger — more like a candle behind glass. The sword is not refusing you. It is asking whether you are ready to carry something that does not hide.',
    equip_fail_n:  'The light is still there. It has not given up on you. That is worth something.',
    equip_success: 'The light does not dim this time. It steadies, as if it has found the hand it was looking for. You feel it in your chest before you feel it in your arm.',
    attune_1:      'Shadows near the blade behave differently. They do not flee — they simply make room.',
    attune_2:      'You completed something difficult. The sword was brighter for the rest of the day.',
    attune_3:      'The light is yours now. Not borrowed. Not lent. Yours.'
  },

  hoja_gelida: {
    first_look:    'The cold does not come from the air around it. It comes from the blade itself, as if it is remembering a winter that has not ended yet.',
    equip_fail_1:  'The cold bites your fingers and you let go before you mean to. The blade is not cruel. It simply requires a steadiness you have not built yet.',
    equip_fail_n:  'The cold is the same each time. You are the one who is changing.',
    equip_success: 'The cold settles into your grip and stays there, familiar now. The blade has decided you can hold something that does not warm to you.',
    attune_1:      'Your breath fogs near the blade even in warm rooms.',
    attune_2:      'You held something difficult without flinching. The blade registered it.',
    attune_3:      'The cold is no longer uncomfortable. It is simply part of how you hold things now.'
  },

  arco_espino: {
    first_look:    'The wood is old but not brittle. It bends without complaint. You get the sense it has been waiting for someone who knows how to be patient.',
    equip_fail_1:  'The bow does not resist you. It simply does not respond. Like asking a question to someone who has decided to wait before answering.',
    equip_fail_n:  'The wood is still warm from the last time you tried. It remembers.',
    equip_success: 'The string settles into your fingers and the bow bends without effort. The thorn pattern on the grip fits your hand exactly. It was always going to be yours.',
    attune_1:      'The wood has a faint pulse when you hold it still.',
    attune_2:      'You completed something that required patience. The bow responded.',
    attune_3:      'The bow and the archer have reached an understanding that does not need words.'
  },

  tridente_marino: {
    first_look:    'The metal is cold and smells of deep water. The three prongs are not decorative. Whatever this was made for, it was not ceremony.',
    equip_fail_1:  'The weight is wrong in your hands — not too heavy, but distributed for a body that moves differently than yours does now. The sea asks for a different kind of readiness.',
    equip_fail_n:  'The salt smell is stronger when you try. The trident is patient. The sea always is.',
    equip_success: 'The weight redistributes itself the moment you commit. The trident has found its bearer. The sea has made its choice.',
    attune_1:      'The metal is slightly warmer than it should be. The cold is retreating.',
    attune_2:      'You completed something that required endurance. The trident registered it.',
    attune_3:      'The deep water in the metal has accepted you. You can feel the current when you hold it still.'
  },

  katana_oriental: {
    first_look:    'The blade was folded many times. You can see the layers if you look at the right angle. Each one is a decision someone made a long time ago.',
    equip_fail_1:  'The sword does not move when you reach for it. Not resistance — stillness. The kind that comes from knowing exactly what it is waiting for.',
    equip_fail_n:  'The stillness is the same. You are the one who is different each time you try.',
    equip_success: 'The sword comes to your hand without hesitation. The layers in the blade catch the light differently now. Something has been decided.',
    attune_1:      'The edge holds its angle longer than it should.',
    attune_2:      'You completed something with precision. The blade noticed the quality of the work.',
    attune_3:      'The sword and the hand have become one decision. The masters who made it would recognize what you have become.'
  },

  baculo_liche: {
    first_look:    'The wood is cold and the carved symbols shift when you are not looking directly at them. This belonged to something that is no longer alive. That does not mean it is harmless.',
    equip_fail_1:  'The staff pulls away from your hand with a sound like a page turning. Whatever intelligence remains in the wood has decided you are not yet worth the risk.',
    equip_fail_n:  'The symbols are different each time you look. The staff is reading you as carefully as you are reading it.',
    equip_success: 'The cold settles and the symbols stop moving. The staff has made its assessment. You are not what it expected, but you are enough.',
    attune_1:      'The carved symbols have stopped shifting. One of them has become legible.',
    attune_2:      'You completed something that required understanding something difficult. The staff grew heavier for a moment, then lighter.',
    attune_3:      'The intelligence in the wood has accepted you as its current keeper. It does not trust you. It has simply decided to work with you.'
  },

  daga_asesino: {
    first_look:    'The blade has no maker\'s mark. The balance is perfect. Someone spent a long time making sure this would never be traced back to them.',
    equip_fail_1:  'The grip is wrong in your hand — not uncomfortable, but designed for a different kind of intention. The dagger knows the difference.',
    equip_fail_n:  'The balance is still perfect. You are the variable.',
    equip_success: 'The grip settles and the balance shifts to meet you. The dagger has accepted a new kind of intention. It will work with what you bring.',
    attune_1:      'The blade disappears in shadow more completely than it should.',
    attune_2:      'You completed something that required discretion. The dagger registered the quality of the approach.',
    attune_3:      'The dagger has learned your intentions. It has decided they are worth serving.'
  },

  daga_oxidada: {
    first_look:    'The rust is old and the edge is dull. Someone kept this anyway. That means something, even if you do not know what yet.',
    equip_fail_1:  'The grip crumbles slightly at the pressure. The dagger is not refusing you — it is simply not ready to be used by someone who does not know its history.',
    equip_fail_n:  'The rust has not spread. The dagger is holding on.',
    equip_success: 'The grip holds. The dagger has decided you are worth the effort of staying together.',
    attune_1:      'The rust has receded slightly near the edge.',
    attune_2:      'You completed something that required persistence. The dagger responded.',
    attune_3:      'The rust is gone from the edge entirely. Whatever this blade was before, it is becoming something again.'
  },

  // ── ARMOR ─────────────────────────────────────────────────────────────────

  escudo_antiveneno: {
    first_look:    'The surface is marked with old stains that did not eat through. Whatever was thrown at this shield, it held. You wonder what the person behind it was protecting.',
    equip_fail_1:  'The straps do not fit. Not because they are the wrong size — because your arm has not yet learned the weight of what it means to stand between something and the thing trying to reach it.',
    equip_fail_n:  'The straps are the same. You are learning what they are asking for.',
    equip_success: 'The straps settle and the weight distributes correctly. The shield has found someone willing to stand in front of things.',
    attune_1:      'The stains on the surface have faded slightly.',
    attune_2:      'You completed something that required protecting something or someone. The shield registered it.',
    attune_3:      'The shield and the arm have become one decision. Whatever comes, you will not step aside.'
  },

  armadura_invierno: {
    first_look:    'The metal is cold even in a warm room. The joints move without sound. Whoever made this understood that winter is not an obstacle — it is a condition you learn to move inside.',
    equip_fail_1:  'The armor does not close around you. Not because it is the wrong size — because your body has not yet learned to carry cold without flinching.',
    equip_fail_n:  'The cold is the same each time. You are the one who is changing.',
    equip_success: 'The armor closes and the cold becomes familiar. You have learned to carry winter. The armor has decided you are ready for what comes next.',
    attune_1:      'The joints move more quietly than before.',
    attune_2:      'You completed something in difficult conditions. The armor registered the endurance.',
    attune_3:      'The cold is no longer something you endure. It is something you carry. The armor knows the difference.'
  },

  capa_alba: {
    first_look:    'The fabric catches the light at the edges. Not a reflection — something woven into the material itself. You have the feeling it was made for a specific kind of morning.',
    equip_fail_1:  'The clasp does not hold. The cape is not refusing you — it is waiting for the right kind of beginning. You have not found it yet.',
    equip_fail_n:  'The light at the edges is still there. It has not given up on you.',
    equip_success: 'The clasp holds and the light settles around you. The cape has found its morning. So have you.',
    attune_1:      'The light at the edges is brighter in the early hours.',
    attune_2:      'You completed something at the start of a day. The cape registered the intention.',
    attune_3:      'The cape and the morning have become the same thing. Whatever you begin now, you begin with light.'
  },

  capa_ligera: {
    first_look:    'It weighs almost nothing. The fabric moves before the wind does. Someone made this for someone who needed to move without being slowed down by what they were carrying.',
    equip_fail_1:  'The cape slides off before you can fasten it. It is not rejecting you — it is simply designed for a different kind of readiness.',
    equip_fail_n:  'The fabric is still light. You are the one who needs to become lighter.',
    equip_success: 'The cape settles and stays. You are ready to move. The cape has decided to come with you.',
    attune_1:      'The fabric moves a moment before you do.',
    attune_2:      'You completed something quickly and well. The cape registered the efficiency.',
    attune_3:      'The cape and the movement are the same thing now. You do not wear it. You carry it the way you carry your own speed.'
  },

  escamas_sirena: {
    first_look:    'The scales shift color when you move them. Not iridescent — something deeper, like they are responding to something you cannot see. The ocean is very far away. The scales do not seem to know that.',
    equip_fail_1:  'The scales pull away from your skin. The ocean has not decided you are ready for what it is willing to lend.',
    equip_fail_n:  'The color shifts are slower now. The scales are considering you.',
    equip_success: 'The scales settle against your skin and the color steadies. The ocean has made its decision. You are its representative on dry land.',
    attune_1:      'The scales are warmer than they should be.',
    attune_2:      'You completed something that required depth or endurance. The scales registered it.',
    attune_3:      'The ocean and the land have reached an agreement through you. The scales are proof.'
  },

  botas_viajero: {
    first_look:    'The leather is worn in exactly the right places. Someone walked a very long way in these. The road they traveled is still in the soles.',
    equip_fail_1:  'The boots do not fit — not in size, but in intention. They were made for someone who had already decided where they were going.',
    equip_fail_n:  'The worn places in the leather are the same. You are the one who is deciding.',
    equip_success: 'The boots settle and the road in the soles becomes yours. You have decided where you are going. The boots have decided to take you there.',
    attune_1:      'The leather has softened slightly around your feet.',
    attune_2:      'You completed something that required going somewhere or doing something outside. The boots registered the distance.',
    attune_3:      'The road in the soles is yours now. Every step you take adds to it.'
  },

  capa_sombras: {
    first_look:    'The fabric is darker than the room it is in. Not black — something that absorbs the light around it without reflecting anything back. You are not sure whether it is hiding you or hiding from you.',
    equip_fail_1:  'The cape does not settle on your shoulders. It is waiting for someone who understands the difference between hiding and choosing not to be seen.',
    equip_fail_n:  'The darkness in the fabric is the same. You are learning the difference.',
    equip_success: 'The cape settles and the room adjusts around you. You have learned the difference. The cape has decided you are ready to use it.',
    attune_1:      'Shadows near you are slightly deeper than they should be.',
    attune_2:      'You completed something that required discretion or careful timing. The cape registered the approach.',
    attune_3:      'The cape and the shadow are the same thing now. You do not hide. You simply choose when to be visible.'
  },

  // ── ACCESSORIES ──────────────────────────────────────────────────────────

  amuleto_brisa: {
    first_look:    'The charm is light enough that you keep checking whether you dropped it. The wind near it moves differently — not stronger, just more deliberate.',
    equip_fail_1:  'The chain slips through your fingers before you can fasten it. The wind is not ready to follow you yet.',
    equip_fail_n:  'The charm is still there. The wind is still considering you.',
    equip_success: 'The chain holds and the wind near you shifts. It has decided to come with you.',
    attune_1:      'The air near you moves slightly before you do.',
    attune_2:      'You completed something outdoors or in open space. The charm registered the exposure.',
    attune_3:      'The wind and the charm have made you their agreement. You move together now.'
  },

  cristal_solar: {
    first_look:    'The crystal is warm even in shadow. It holds the light from somewhere else — somewhere the sun was stronger than it is here.',
    equip_fail_1:  'The crystal dims when you try to wear it. It is not refusing you. It is waiting for you to bring something worth illuminating.',
    equip_fail_n:  'The warmth is still there. The crystal has not given up.',
    equip_success: 'The crystal brightens when you fasten it. You have brought something worth illuminating. The sun has decided to lend you some of what it stored.',
    attune_1:      'The crystal is warmer in the morning than in the afternoon.',
    attune_2:      'You completed something in daylight or with clear intention. The crystal registered it.',
    attune_3:      'The stored light is yours now. The crystal has finished its work. You carry the sun.'
  },

  perla_marina: {
    first_look:    'The pearl is heavier than it looks. Something is inside it — not a sound, but the memory of pressure. The deep ocean does not give things up easily.',
    equip_fail_1:  'The pearl pulls away from your hand. The deep ocean has not decided you are ready for what it is willing to share.',
    equip_fail_n:  'The weight is the same. You are the one who is changing.',
    equip_success: 'The pearl settles and the weight becomes familiar. The deep ocean has made its decision. You carry its memory now.',
    attune_1:      'The pearl is slightly warmer than the water around it.',
    attune_2:      'You completed something that required depth or sustained effort. The pearl registered it.',
    attune_3:      'The deep ocean and the surface have reached an agreement through you. The pearl is the proof.'
  },

  rosario_concentracion: {
    first_look:    'Each bead is slightly different from the others. Someone counted them many times. The counting is still in the material.',
    equip_fail_1:  'The beads slip through your fingers before you can hold them still. The rosary is waiting for hands that have learned to be patient.',
    equip_fail_n:  'The counting is still in the beads. You are learning to be still enough to feel it.',
    equip_success: 'The beads settle in your hands and the counting becomes yours. You have learned to be still. The rosary has decided to help you stay that way.',
    attune_1:      'The beads are warmer than they should be.',
    attune_2:      'You completed something that required focus or sustained attention. The rosary registered the quality of the effort.',
    attune_3:      'The counting and the stillness are the same thing now. The rosary has finished teaching you. You carry the lesson.'
  },

  cuentas_jade: {
    first_look:    'The jade is cool and the color is deeper than it looks in photographs. Someone brought these a very long way. The distance is still in the stone.',
    equip_fail_1:  'The beads do not settle around your wrist. The distance in the stone is waiting for someone who understands what it means to carry something from far away.',
    equip_fail_n:  'The cool is the same. You are learning what the distance means.',
    equip_success: 'The beads settle and the cool becomes familiar. The distance in the stone is yours now. You carry what was brought from far away.',
    attune_1:      'The jade is slightly warmer near your skin.',
    attune_2:      'You completed something that required patience or long-term thinking. The beads registered it.',
    attune_3:      'The distance and the arrival are the same thing now. The jade has accepted you as its current destination.'
  },

  sello_alianza: {
    first_look:    'The signet has no crest. The metal bears a thumbprint that will not polish away. Someone made a promise with this. The promise is still in the metal.',
    equip_fail_1:  'The ring does not fit — not in size, but in weight. It is waiting for someone who has something worth promising.',
    equip_fail_n:  'The thumbprint is still there. The promise is still waiting.',
    equip_success: 'The ring settles and the weight becomes familiar. You have something worth promising. The seal has decided to carry it.',
    attune_1:      'The metal is warmer near the thumbprint.',
    attune_2:      'You completed something social or kept a commitment. The seal registered the quality of the follow-through.',
    attune_3:      'The promise and the seal are the same thing now. Whatever you commit to, the seal carries it with you.'
  },

  amuleto_espacio: {
    first_look:    'The charm is small but the pocket on the inside is not. Nothing placed there makes the same sound twice. You are not sure whether that is a feature or a warning.',
    equip_fail_1:  'The charm does not open for you. The space inside is waiting for someone who understands that more room is not the same as more capacity.',
    equip_fail_n:  'The pocket is still there. You are learning the difference.',
    equip_success: 'The charm opens and the space inside settles. You understand the difference now. The charm has decided you are ready for more room.',
    attune_1:      'The sounds from inside the pocket are slightly different each time.',
    attune_2:      'You completed something that required organization or managing multiple things at once. The charm registered it.',
    attune_3:      'The space inside and the space outside have reached an agreement through you. You carry more than you appear to.'
  },

  amuleto_bosque: {
    first_look:    'The wood is still alive. Not growing — but not dead either. Something in the forest decided this piece was worth keeping separate from the rest.',
    equip_fail_1:  'The amulet pulls away from your hand. The forest has not decided you are ready for what it is willing to share.',
    equip_fail_n:  'The wood is still warm. The forest is still considering you.',
    equip_success: 'The amulet settles and the warmth becomes familiar. The forest has made its decision. You carry its attention now.',
    attune_1:      'The wood is slightly warmer near living things.',
    attune_2:      'You completed something outdoors or involving care for living things. The amulet registered it.',
    attune_3:      'The forest and the keeper are the same thing now. The amulet has finished its work.'
  },

  // ── ARTIFACTS ────────────────────────────────────────────────────────────

  orbe_mental: {
    first_look:    'The sphere reflects a room with one extra chair. The chair is always empty. You are not sure whether that is a promise or a question.',
    equip_fail_1:  'The sphere grows cold when you reach for it. The room in the reflection has not decided you are ready to sit in the extra chair.',
    equip_fail_n:  'The chair is still empty. The sphere is still considering you.',
    equip_success: 'The sphere warms and the reflection steadies. The extra chair is yours now. The sphere has decided you are ready to use what it offers.',
    attune_1:      'The room in the reflection is slightly larger.',
    attune_2:      'You completed something that required sustained mental effort. The sphere registered the quality of the thinking.',
    attune_3:      'The room in the reflection is full of chairs now. The sphere has finished its assessment. You carry the capacity.',
    ritual:        'The sphere grows very still. The room in the reflection empties. Then it fills again, differently. Something has been reorganized.'
  },

  dado_destino: {
    first_look:    'Six faces, seven tally marks. It always lands on a corner when nobody is watching. You count the marks again. There are still seven.',
    equip_fail_1:  'The die rolls off your palm before you can close your hand. It lands on a corner. It is not ready to be carried by someone who has not accepted what it means to let chance have a say.',
    equip_fail_n:  'It lands on a corner again. The die is consistent. You are the variable.',
    equip_success: 'The die settles in your palm and stays. You have accepted what it means. The die has decided to work with your intentions.',
    attune_1:      'The tally marks are slightly different each time you count.',
    attune_2:      'You completed something with an uncertain outcome. The die registered the willingness to proceed anyway.',
    attune_3:      'The seven marks and the six faces have reached an agreement through you. The die has decided you understand the difference between chance and choice.',
    ritual:        'The die rolls without being thrown. It lands on a face that was not there before. The reroll is ready.'
  },

  escama_dragon: {
    first_look:    'The scale is split down the middle. It smells of smoke when held near a flame. Something very large shed this. You wonder whether it noticed.',
    equip_fail_1:  'The scale grows cold when you reach for it. The wyrm has not decided you are ready for what it is willing to lend.',
    equip_fail_n:  'The smoke smell is stronger when you try. The wyrm is still considering you.',
    equip_success: 'The scale warms and the smoke smell fades. The wyrm has made its decision. You carry its attention now.',
    attune_1:      'The scale is warmer near fire.',
    attune_2:      'You completed something that required endurance or facing something difficult. The scale registered it.',
    attune_3:      'The old fire breathes with you now. The wyrm has decided you are worth the investment.',
    ritual:        'The scale grows very hot for a moment. The split closes slightly. The burn you carry lasts longer now.'
  },

  grimorio_arcano: {
    first_look:    'Most pages are blank. The last page contains a sentence that stops before its final word. You read it three times. The missing word is different each time.',
    equip_fail_1:  'The book closes before you can open it fully. The missing word is not ready to be found by someone who has not yet asked the right question.',
    equip_fail_n:  'The sentence on the last page is slightly different. The book is reading you as carefully as you are reading it.',
    equip_success: 'The book opens and stays open. You have asked the right question. The grimoire has decided you are ready to look for the answer.',
    attune_1:      'A few lines remain after you close the book.',
    attune_2:      'You completed something that required learning or understanding something new. The grimoire registered the quality of the inquiry.',
    attune_3:      'The missing word is waiting for you. The grimoire has finished its preparation. You carry the question and the capacity to find the answer.',
    ritual:        'You write a question in the book. The ink holds. The answer is somewhere in the next task you complete.'
  },

  escoba_encantada: {
    first_look:    'The bristles move slightly when the room is still. Not sweeping — listening. Whatever enchantment is in this broom, it has opinions about dust.',
    equip_fail_1:  'The broom leans away from you. It is not refusing you — it is waiting for someone who takes the work seriously.',
    equip_fail_n:  'The bristles are still moving. The broom is still waiting.',
    equip_success: 'The broom settles in your hand and the bristles still. It has decided you take the work seriously. The enchantment is ready to help.',
    attune_1:      'The bristles move more purposefully near neglected corners.',
    attune_2:      'You completed a cleaning or organizing task. The broom registered the quality of the attention.',
    attune_3:      'The enchantment and the intention are the same thing now. The broom has finished its assessment. The work is easier.'
  },

  // ── CONSUMABLES (first_look only) ────────────────────────────────────────

  pocion_agua:         { first_look: 'The liquid is clearer than water should be. Something was added to it — or something was removed. Either way, it will do what it promises.' },
  pocion_escarcha:     { first_look: 'The bottle is cold enough to fog the air around it. Whatever is inside has not forgotten where it came from.' },
  racion_combate:      { first_look: 'Compact, dense, and designed to be eaten quickly. Someone who understood urgency made this. It will not be pleasant. It will be enough.' },
  elixir_vitalidad:    { first_look: 'The color is wrong for something that heals. But the smell is right — green and sharp and alive. You trust the smell more than the color.' },
  hierba_curativa:     { first_look: 'The leaves are still fresh. Someone picked these recently, or they have been preserved by something you cannot see. Either way, they will work.' },
  antidoto:            { first_look: 'The liquid is bitter before you open it. That is usually a good sign. Poison does not like things that taste like this.' },
  veneno_basico:       { first_look: 'The vial is sealed with wax. The wax is a different color than it was when it was applied. The poison has been thinking about getting out.' },
  pocion_respiracion:  { first_look: 'The bubbles inside move upward even when the bottle is upside down. The water inside does not know it is inside a bottle. That is the point.' },
  hidromiel:           { first_look: 'The smell is strong and warm and old. Someone made this for a celebration that may or may not have happened. It does not matter. The mead is ready.' },
  pocion_vida_menor:   { first_look: 'The taste is bitter and the color is wrong, but the warmth that follows is real. Someone made this quickly, for someone who needed it quickly.' },
  pocion_fuerza:       { first_look: 'It smells of iron and effort. Whoever distilled this understood that strength is not given — it is concentrated from what you have already done.' },
  sake_demonio:        { first_look: 'The liquid is darker than sake should be. The smell is warm and slightly wrong. Whatever was added to this was not added for flavor.' },
  veneno_letal:        { first_look: 'The vial is heavier than it looks. The poison inside has weight that does not come from the liquid. Use this carefully. Use this once.' },
  pocion_agua_menor:   { first_look: 'Smaller than the others. Enough for what it needs to do. No more.' },

  // ── MATERIALS (first_look only) ───────────────────────────────────────────

  moneda_antigua:      { first_look: 'The face on the coin is worn past recognition. The metal is heavier than modern coins. Someone spent this once and it came back. It always comes back.' },
  moneda_oro:          { first_look: 'Pure gold does not shine the way people expect. It is quieter than that. More certain.' },
  gema_fuego:          { first_look: 'The heat inside the gem is not from the room. It has been there since before you found it. It will be there after.' },
  fragmento_hielo:     { first_look: 'It does not melt. You have been holding it long enough that it should have. It has decided not to.' },
  fragmento_solar:     { first_look: 'It glows slightly even in full light. The sun stored something in this piece that it did not store in the light around it.' },
  pluma_viento:        { first_look: 'The feather moves before the air does. It is not reacting to the wind. It is anticipating it.' },
  especia_rara:        { first_look: 'The smell changes depending on what you are thinking about. That is either a property of the spice or a property of you. You are not sure which.' },
  frasco_vacio:        { first_look: 'The glass is clean and the seal is intact. It is ready to hold something. What it holds will determine what it becomes.' },
  nucleo_slime:        { first_look: 'The core is still slightly warm. Whatever the slime was, this is what it was organized around. It is denser than it looks and it does not dissolve.' },
  piel_lobo:           { first_look: 'The fur is thick and the smell is cold and wild. The wolf this came from was not small. You can tell by the weight of what it left behind.' },
  colmillo_alfa:       { first_look: 'The tooth is larger than you expected. The pack followed whatever carried this. That authority is still in the bone.' },
  cola_rata:           { first_look: 'Unremarkable. Useful. Someone who knows what they are doing will find a use for this. You are becoming someone who knows what they are doing.' },
  seda_arana:          { first_look: 'The thread is stronger than it looks and lighter than it should be. The spider that made this was not making it for you. That does not mean you cannot use it.' },
  objeto_olvidado:     { first_look: 'You cannot remember where you found this. That is part of what it is. Something that has been forgotten carries the weight of everything that forgot it.' },
  esencia_espectral:   { first_look: 'The vial is cold and the liquid inside does not move when you tilt it. Whatever this is, it is not entirely here. That is what makes it useful.' },
  corazon_bosque:      { first_look: 'The heartwood is still warm. The tree this came from was very old. The warmth is what the tree decided to leave behind.' },
  esencia_vida:        { first_look: 'The liquid is green and it moves on its own. Not much — just enough to remind you that it is alive. Handle it accordingly.' },
  semilla_rara:        { first_look: 'The seed is heavier than seeds should be. Whatever grows from this will not be ordinary. That is either a promise or a warning. Probably both.' },
  colmillo_hielo:      { first_look: 'The cold in this tooth has not faded since the wolf fell. It will not fade. The cold was not the wolf\'s — it was the tooth\'s.' },
  corazon_fuego:       { first_look: 'The heat inside this is not from combustion. It is from something that decided to keep burning after everything else stopped. That decision is still active.' },
  escama_fuego:        { first_look: 'The scale is warm and the color shifts when you move it. The salamander this came from lived in fire. The fire is still in the scale.' },
  esencia_agua:        { first_look: 'The liquid moves in the vial as if it is looking for somewhere to go. It has not found it yet. That is what makes it useful — it is still searching.' },
  escama_marina:       { first_look: 'The scale smells of deep water and the color is darker than the surface of the sea. This came from somewhere the light does not reach.' },
  tentaculo_kraken:    { first_look: 'The suction cups are still active. Whatever the kraken was, this piece of it has not accepted that it is separate. Handle it carefully.' },
  esencia_oscura:      { first_look: 'The vial is dark even in full light. The liquid inside absorbs rather than reflects. Whatever this is, it came from somewhere that does not give things back easily.' },
  fragmento_sueno:     { first_look: 'The fragment is warm and slightly translucent. If you look at it in the right light, you can see something moving inside. It is not your reflection.' },
  pagina_arcana:       { first_look: 'The page is blank until you stop looking directly at it. Whatever is written there is meant to be read from the corner of your eye.' },
  tinta_magica:        { first_look: 'The ink is darker than ink should be. Whatever you write with this will mean more than you intend. Use it carefully.' },
  grimorio_antiguo:    { first_look: 'The binding is old and the pages are dense with writing in a hand that was very careful. Someone spent a long time making sure this would survive them.' },
  filacteria:          { first_look: 'The container is sealed and the seal is old. Whatever is inside has been waiting a very long time. You are not sure whether opening it would be a rescue or a release.' },
  cola_kitsune:        { first_look: 'The fur is soft and the color shifts between silver and gold depending on the light. The kitsune this came from was very old. The age is in the fur.' },
  cuerno_oni:          { first_look: 'The horn is heavier than bone should be. The weight is not from the material — it is from what the oni carried in its intentions. That weight transfers.' },
  pluma_grifo:         { first_look: 'The feather is larger than any bird feather you have seen. The quill is strong enough to write with. The barbs are strong enough to cut. The grifo did not give this up easily.' },
  caparazon:           { first_look: 'The shell is harder than it looks and the inside is smooth. The crab that carried this was very patient. The patience is in the material.' },
  token_amistad:       { first_look: 'The token is small and the material is ordinary. What makes it valuable is not what it is made of — it is what it represents. Someone gave this to someone else. That matters.' },

  // ── KEYS / SPECIAL ───────────────────────────────────────────────────────

  llave_cofre:         { first_look: 'The key is specific. It was made for one lock. You do not know which one yet. That is the point of having it.' },
  contrato_mercantil:  { first_look: 'The terms are favorable. Someone negotiated carefully. The ink is dry and the seal is intact. This is a promise that has been kept so far.' },
  mapa_tesoro:         { first_look: 'The map is partial. The destination is marked but the route has gaps. Someone left those gaps deliberately. You will have to fill them in yourself.' },
  contrato_sospechoso: { first_look: 'The terms are written in very small letters. The seal is from a faction you do not recognize. This is either an opportunity or a trap. Possibly both.' },

  // ── SKILLS ───────────────────────────────────────────────────────────────

  skill_foco_interior: { first_look: 'The scroll is dense with notation. The technique described requires stillness before movement. You will need to practice before it becomes instinct.' },
  skill_llamarada:     { first_look: 'The scroll is warm to the touch. The technique described is fast and direct. It does not ask for precision — it asks for commitment.' },
  skill_rayo_hielo:    { first_look: 'The scroll is cold and the ink is blue. The technique described requires holding two things at once: the cold and the direction. That is harder than it sounds.' },
  talisman_oriental:   { first_look: 'The paper is old and the characters are precise. Someone wrote this with complete attention. The intention is still in the ink.' }

};

// ── FLAVOR TEXT ACCESSOR ─────────────────────────────────────────────────────
// Returns the correct flavor text for a given item and situation.
// Falls back gracefully: item-specific → type-generic → universal.

function getItemFlavorText(itemId, situation) {
  var entry = ITEM_FLAVOR_TEXT[itemId];
  if (entry && entry[situation]) return entry[situation];

  var item = typeof getItemDefinition === 'function' ? getItemDefinition(itemId) : null;
  var type = item ? item.type : null;

  var TYPE_FALLBACKS = {
    weapon: {
      first_look:    'The weapon has a history you cannot read yet. It will tell you in time.',
      equip_fail_1:  'The weapon does not respond. Something in it is waiting for a readiness you have not built yet.',
      equip_fail_n:  'It resists again. You are closer than you were. The weapon is measuring you.',
      equip_success: 'The weapon settles into your grip. Whatever it was waiting for, you have become it.',
      attune_1: 'The weapon has begun to recognize you.', attune_2: 'Your work has left a mark on the weapon. It has noticed.', attune_3: 'The weapon and the hand are one decision now.',
      ritual: 'Something in the weapon shifts. A capacity that was dormant has woken.'
    },
    armor: {
      first_look:    'The armor carries the shape of someone who wore it before you. You will make it yours.',
      equip_fail_1:  'The armor does not close around you. It is waiting for a body that has learned what it means to be protected.',
      equip_fail_n:  'The armor is the same. You are the one who is changing.',
      equip_success: 'The armor closes and settles. You have learned what it means to be protected. The armor has decided to help.',
      attune_1: 'The armor moves more naturally.', attune_2: 'Your effort has been registered. The armor has noticed.', attune_3: 'The armor and the body are one intention now.'
    },
    accessory: {
      first_look:    'The object is small but the weight of it is not. Something is stored inside it that you cannot see yet.',
      equip_fail_1:  'The accessory does not settle. It is waiting for someone who understands what it is for.',
      equip_fail_n:  'It resists again. You are learning what it is for.',
      equip_success: 'The accessory settles. You understand what it is for. It has decided to help you use it.',
      attune_1: 'The object has begun to respond to you.', attune_2: 'Your work has left a mark on it. It has noticed.', attune_3: 'The object and the intention are the same thing now.'
    },
    artifact: {
      first_look:    'The artifact is older than it looks. Whatever it was made for, it has been waiting a long time.',
      equip_fail_1:  'The artifact does not respond. It is waiting for someone who has earned the right to use what it offers.',
      equip_fail_n:  'It resists again. You are earning the right.',
      equip_success: 'The artifact responds. You have earned the right. It has decided to work with you.',
      attune_1: 'The artifact has begun to recognize you.', attune_2: 'Your effort has been registered. The artifact has noticed.', attune_3: 'The artifact and the bearer are one purpose now.',
      ritual: 'Something in the artifact shifts. A capacity that was sealed has opened.'
    }
  };

  var typeFallback = TYPE_FALLBACKS[type];
  if (typeFallback && typeFallback[situation]) return typeFallback[situation];

  var UNIVERSAL = {
    first_look:    'You hold it and something in it holds back. Not resistance — recognition. It is deciding what you are.',
    equip_fail_1:  'It does not respond. Something in it is waiting for a readiness you have not built yet.',
    equip_fail_n:  'It resists again. You are closer than you were.',
    equip_success: 'It settles. Whatever it was waiting for, you have become it.',
    attune_1: 'It has begun to recognize you.', attune_2: 'Your work has left a mark. It has noticed.', attune_3: 'The object and the bearer are one intention now.',
    ritual: 'Something shifts. A capacity that was waiting has answered.'
  };

  return UNIVERSAL[situation] || 'Something has changed.';
}

// ── ATTUNEMENT FLAVOR TRIGGER ─────────────────────────────────────────────────
function showAttunementFlavor(itemId, newStage) {
  var text = getItemFlavorText(itemId, 'attune_' + newStage);
  if (typeof showToast === 'function') showToast(text, 'success');
}

// ── RITUAL FLAVOR TRIGGER ─────────────────────────────────────────────────────
function showRitualFlavor(itemId) {
  var text = getItemFlavorText(itemId, 'ritual');
  if (typeof showToast === 'function') showToast(text, 'success');
}

// ── LEGACY SHIM ───────────────────────────────────────────────────────────────
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
      <button class="btn btn-secondary mb-8" onclick="exportData()">📤 Exportar save</button>
      <button class="btn btn-secondary mb-8" onclick="showImportModal()">📥 Importar save</button>
      <button class="btn btn-ghost" onclick="resetGame()" style="color: var(--red)">🗑️ Resetear progreso</button>
    </div>
    
    <div class="section-title">Content Planning</div>
    <div class="card">
      <p style="font-size: 12px; color: var(--text-muted); margin-bottom: 12px;">
        Exporta un snapshot con métricas de uso y sugerencias para planificar actualizaciones de contenido con tu agente de Langdock.
      </p>
      <button class="btn btn-gold" onclick="exportSnapshot()">📊 Exportar Snapshot para Agente</button>
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

// ═══════════════════════════════════════════════════════════════════════════
// TASK SCREEN
// ═══════════════════════════════════════════════════════════════════════════

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

// ═══════════════════════════════════════════════════════════════════════════
// TASK COMPLETION
// ═══════════════════════════════════════════════════════════════════════════

function completeTask() {
  if (!currentTask) return;
  
  stopTimer();
  
  // Show completion overlay
  const overlay = document.getElementById('complete-overlay');
  overlay.classList.add('show');
  
  // Icon & title
  document.getElementById('complete-icon').textContent = currentIsOverflow ? '⚡' : '🏆';
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
  rewardsHtml += `<div class="complete-reward">+${goldEarned} 🪙</div>`;
  document.getElementById('complete-rewards').innerHTML = rewardsHtml;
  
  if (leveledUp) {
    document.getElementById('complete-title').textContent = '¡Subiste de nivel!';
    document.getElementById('complete-icon').textContent = '🎉';
  }
  
  // Check for random encounter after task completion
  triggerEncounterAfterTask(task);
  
  // Update quest progress
  if (typeof updateQuestProgress === 'function') {
    updateQuestProgress(task);
  if (typeof recordItemAttunementFromTask === 'function') recordItemAttunementFromTask(task);
  }
}

// Drop system - connects to items.js
// ─── Drop system ────────────────────────────────────────────────────────────
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

// ═══════════════════════════════════════════════════════════════════════════
// ENCOUNTER SYSTEM
// ═══════════════════════════════════════════════════════════════════════════

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

// ═══════════════════════════════════════════════════════════════════════════
// COMBAT UI
// ═══════════════════════════════════════════════════════════════════════════

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
  document.getElementById('combat-result-icon').textContent = '🏆';
  document.getElementById('combat-result-title').textContent = '¡Victoria!';
  document.getElementById('combat-result-subtitle').textContent = `${combatState.enemy.name} derrotado`;
  
  let rewardsHtml = '';
  if (rewards) {
    rewardsHtml = `
      <div class="complete-reward gold">+${rewards.xp} XP</div>
      <div class="complete-reward">+${rewards.gold} 🪙</div>
    `;
    if (rewards.drops && rewards.drops.length > 0) {
      for (const drop of rewards.drops) {
        const item = typeof ITEMS !== 'undefined' ? ITEMS[drop] : null;
        rewardsHtml += `<div class="complete-reward" style="color: var(--purple);">🎁 ${item?.name || drop}</div>`;
      }
    }
  }
  document.getElementById('combat-result-rewards').innerHTML = rewardsHtml;
  
  document.getElementById('combat-result-overlay').classList.add('show');
}

function showCombatDefeat() {
  document.getElementById('combat-result-icon').textContent = '💀';
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

// ═══════════════════════════════════════════════════════════════════════════
// SAVE FOR LATER
// ═══════════════════════════════════════════════════════════════════════════

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
  document.getElementById('modal-tasks-title').textContent = '📌 Tareas guardadas';
  
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

// ═══════════════════════════════════════════════════════════════════════════
// TIMER
// ═══════════════════════════════════════════════════════════════════════════

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

// ═══════════════════════════════════════════════════════════════════════════
// CLASS CHANGE SYSTEM
// ═══════════════════════════════════════════════════════════════════════════

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
  alert(`🎉 ¡Te has convertido en ${cls.name}!\n\nTus stats han mejorado y tienes acceso a nuevas habilidades.`);
}

// ═══════════════════════════════════════════════════════════════════════════
// IMPORT/EXPORT
// ═══════════════════════════════════════════════════════════════════════════

function exportData() {
  const data = JSON.stringify(gameState, null, 2);
  const blob = new Blob([data], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `lifexp_save_${todayStr()}.json`;
  a.click();
  URL.revokeObjectURL(url);
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

function showImportModal() {
  const input = document.createElement('input');
  input.type = 'file';
  input.accept = '.json';
  input.onchange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    try {
      const text = await file.text();
      const data = JSON.parse(text);
      gameState = { ...gameState, ...data };
      saveGame();
      alert('Datos importados correctamente');
      showScreen('hub');
    } catch (err) {
      alert('Error al importar: ' + err.message);
    }
  };
  input.click();
}

function resetGame() {
  if (!confirm('¿Seguro que quieres borrar todo el progreso?')) return;
  if (!confirm('¿SEGURO? Esta acción no se puede deshacer.')) return;
  
  localStorage.removeItem('lifexp_save');
  location.reload();
}

// ═══════════════════════════════════════════════════════════════════════════
// GUILD / COOP SYSTEM (Receipt-based sync)
// ═══════════════════════════════════════════════════════════════════════════

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
        text: `🎮 Actualización de ${gameState.name} en ${gameState.guildName}`,
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
  
  alert(`Recibo generado!\\n\\nCompártelo con tu guild por WhatsApp o donde prefieras.\\n\\n📊 ${receipt.recentAchievements.tasksCompleted} tareas | +${receipt.recentAchievements.xpEarned} XP`);
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
        text: `🎮 ¡Únete a mi guild "${gameState.guildName}" en LifeXP!`,
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
    
    alert(`Recibo de ${receipt.playerName} procesado!\\n\\n📊 Nivel ${receipt.currentState.level} | ${receipt.recentAchievements.tasksCompleted} tareas recientes`);
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
        <button class="btn btn-gold mb-8" onclick="exportGuildInvite()">🏰 Crear Guild</button>
        <button class="btn btn-secondary" onclick="importReceipt()">📥 Unirme con invitación</button>
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
    const medal = idx === 0 ? '🥇' : idx === 1 ? '🥈' : idx === 2 ? '🥉' : '▪️';
    const classIcon = typeof CLASS_TREE !== 'undefined' && CLASS_TREE[m.classId] 
      ? CLASS_TREE[m.classId].icon : '🧑‍🌾';
    
    membersHtml += `
      <div class="card" style="display: flex; align-items: center; gap: 12px; ${isMe ? 'border-color: var(--gold);' : ''}">
        <div style="font-size: 20px;">${medal}</div>
        <div style="font-size: 28px;">${classIcon}</div>
        <div style="flex: 1;">
          <div style="font-weight: 700;">${m.odeName} ${isMe ? '(tú)' : ''}</div>
          <div style="font-size: 12px; color: var(--text-muted);">
            Lv ${m.level} · ${m.className || 'Novato'} · 🔥${m.streak || 0}
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
      <button class="btn btn-gold" onclick="exportReceipt()">📤 Enviar recibo</button>
      <button class="btn btn-secondary" onclick="importReceipt()">📥 Recibir recibo</button>
    </div>
    <button class="btn btn-ghost" style="width: 100%; margin-top: 8px;" onclick="exportGuildInvite()">🔗 Invitar a alguien</button>
  `;
}

// ═══════════════════════════════════════════════════════════════════════════
// EVENT LISTENERS
// ═══════════════════════════════════════════════════════════════════════════

document.addEventListener('DOMContentLoaded', () => {
  // Load game
  loadGame();

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

// ═══════════════════════════════════════════════════════════════════════════
// UI POLISH: TOAST, ONBOARDING, FEEDBACK
// ═══════════════════════════════════════════════════════════════════════════

let toastTimeout = null;

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
    icon: '📋',
    title: 'Sistema de Tareas',
    text: 'Cada día recibirás tareas aleatorias de tus categorías (Casa, Cuerpo, Gestiones, Social, Personal). Completa la tarea en la vida real y márcala como hecha.'
  },
  {
    icon: '⚡',
    title: 'Overflow',
    text: 'Las tareas atrasadas entran en "overflow" y dan +50% XP. Tienen prioridad, así que intenta mantenerlas al día.'
  },
  {
    icon: '🎲',
    title: 'Drops y Combate',
    text: 'Al completar tareas puedes conseguir items y encontrar enemigos. El combate puede ser automático o táctico según la dificultad.'
  },
  {
    icon: '🏰',
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

// ═══════════════════════════════════════════════════════════════════════════
// QUESTS RENDERING
// ═══════════════════════════════════════════════════════════════════════════

function renderQuests() {
  const container = document.getElementById('quests-container');
  if (!container) return;
  
  // Update count in header
  const countEl = document.getElementById('quests-count');
  if (countEl) {
    const activeCount = (gameState.activeQuests || []).length;
    countEl.textContent = `${activeCount} activa${activeCount !== 1 ? 's' : ''}`;
  }
  
  // Check if quests.js loaded
  if (typeof QUESTS === 'undefined') {
    container.innerHTML = '<div class="text-muted text-center">Sistema de quests cargando...</div>';
    return;
  }
  
  // Generate daily quests if needed
  if (typeof generateDailyQuests === 'function') {
    generateDailyQuests();
  }
  
  const active = gameState.activeQuests || [];
  
  if (active.length === 0) {
    container.innerHTML = `
      <div class="card" style="text-align: center; padding: 24px;">
        <div style="font-size: 32px; margin-bottom: 12px;">📜</div>
        <div style="color: var(--text-muted);">No tienes quests activas</div>
        <button class="btn btn-primary" style="margin-top: 16px;" onclick="showAvailableQuests()">
          Ver quests disponibles
        </button>
      </div>
    `;
    return;
  }
  
  container.innerHTML = '';
  
  for (const questState of active) {
    const quest = QUESTS[questState.questId];
    if (!quest) continue;
    
    const currentStep = quest.steps ? quest.steps[questState.stepIndex || 0] : null;
    const progress = questState.progress || {};
    const legacyObjective = !currentStep && quest.objectives?.[0] ? quest.objectives[0] : null;
    
    // Calculate progress percentage
    let progressPct = 0;
    if (currentStep && currentStep.objective) {
      const obj = currentStep.objective;
      if (obj.type === 'completeTasks') {
        const done = progress.tasksCompleted || 0;
        progressPct = Math.min(100, Math.round((done / obj.count) * 100));
      } else if (obj.type === 'defeatEnemy') {
        progressPct = progress.enemyDefeated ? 100 : 0;
      }
    } else if (legacyObjective) {
      progressPct = Math.min(100, Math.round(((progress.tasksCompleted || 0) / legacyObjective.count) * 100));
    }
    
    const typeColors = {
      daily: 'var(--green)',
      simple: 'var(--blue)',
      composed: 'var(--purple)',
      story: 'var(--gold)',
      bounty: 'var(--red)',
      class: 'var(--cyan)'
    };
    const color = typeColors[quest.type] || 'var(--text-muted)';
    
    container.innerHTML += `
      <div class="card" onclick="showQuestDetail('${questState.questId}')" style="cursor: pointer; border-left: 3px solid ${color};">
        <div style="display: flex; justify-content: space-between; align-items: flex-start;">
          <div>
            <div style="font-size: 11px; color: ${color}; text-transform: uppercase; margin-bottom: 4px;">
              ${quest.type}
            </div>
            <div style="font-weight: 700;">${quest.name}</div>
            ${currentStep ? `<div style="font-size: 12px; color: var(--text-muted); margin-top: 4px;">${currentStep.desc}</div>` : `<div style="font-size: 12px; color: var(--text-muted); margin-top: 4px;">${quest.desc || ''}</div>`}
          </div>
          <div style="text-align: right;">
            <div style="font-size: 20px;">${quest.icon || '📜'}</div>
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
  title.textContent = '📜 Quests disponibles';

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

  const activeQuests    = Array.isArray(gameState.activeQuests)    ? gameState.activeQuests    : [];
  const completedQuests = Array.isArray(gameState.completedQuests) ? gameState.completedQuests : [];
  const playerLevel     = gameState.level || 1;

  const typeConfig = {
    daily:       { color: 'var(--green)',  label: 'Diaria',    icon: '📅' },
    simple:      { color: 'var(--blue)',   label: 'Misión',    icon: '📜' },
    compound:    { color: 'var(--purple)', label: 'Compuesta', icon: '📚' },
    story:       { color: 'var(--gold)',   label: 'Historia',  icon: '⭐' },
    bounty:      { color: 'var(--red)',    label: 'Bounty',    icon: '🎯' },
    class_quest: { color: 'var(--cyan)',   label: 'Clase',     icon: '⚔️' },
    event:       { color: 'var(--orange)', label: 'Evento',    icon: '🎉' },
  };

  list.innerHTML = '';
  let count = 0;

  for (const [questId, quest] of Object.entries(QUESTS)) {
    if (activeQuests.some(q => q.questId === questId)) continue;
    if (completedQuests.includes(questId) && !quest.repeatable) continue;
    if ((quest.levelReq || quest.minLevel) && playerLevel < (quest.levelReq || quest.minLevel)) continue;

    const cfg   = typeConfig[quest.type] || { color: 'var(--text-muted)', label: quest.type, icon: '📜' };
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
          ${rewardGold ? `<span style="font-size:11px;color:var(--gold);">+${rewardGold} 🪙</span>` : ''}
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

function acceptQuest(questId) {
  if (typeof QUESTS === 'undefined' || !QUESTS[questId]) return;
  
  // Check if already active
  if (gameState.activeQuests.some(q => q.questId === questId)) return;
  
  gameState.activeQuests.push({
    questId,
    stepIndex: 0,
    progress: {},
    startedAt: todayStr()
  });
  
  saveGame();
  closeModal('modal-tasks');
  renderQuests();
}

function showQuestDetail(questId) {
  const questState = gameState.activeQuests.find(q => q.questId === questId);
  if (!questState || typeof QUESTS === 'undefined') return;
  
  const quest = QUESTS[questId];
  if (!quest) return;
  
  const content = document.getElementById('modal-item-content');
  const currentStep = quest.steps ? quest.steps[questState.stepIndex || 0] : null;
  
  content.innerHTML = `
    <div style="text-align: center; margin-bottom: 16px;">
      <div style="font-size: 48px;">${quest.icon || '📜'}</div>
      <h3 style="margin-top: 8px;">${quest.name}</h3>
      <div style="font-size: 12px; color: var(--text-muted);">${quest.desc}</div>
    </div>
    ${currentStep ? `
      <div class="card" style="margin-bottom: 12px;">
        <div style="font-size: 11px; color: var(--text-muted); margin-bottom: 4px;">OBJETIVO ACTUAL</div>
        <div>${currentStep.desc}</div>
      </div>
    ` : ''}
    <div style="font-size: 12px; color: var(--gold);">
      Recompensa: +${quest.rewards?.xp || 0} XP | +${quest.rewards?.gold || 0} 🪙
    </div>
  `;
  
  const actionBtn = document.getElementById('btn-item-action');
  actionBtn.textContent = '❌ Abandonar quest';
  actionBtn.onclick = () => abandonQuest(questId);
  
  openModal('modal-item');
}

function abandonQuest(questId) {
  gameState.activeQuests = gameState.activeQuests.filter(q => q.questId !== questId);
  saveGame();
  closeModal('modal-item');
  renderQuests();
}

function updateQuestProgress(taskCompleted) {
  if (typeof QUESTS === 'undefined') return;
  
  for (const questState of gameState.activeQuests) {
    const quest = QUESTS[questState.questId];
    if (!quest || !quest.steps) continue;
    
    const currentStep = quest.steps[questState.stepIndex || 0];
    if (!currentStep || !currentStep.objective) continue;
    
    const obj = currentStep.objective;
    
    // Check task completion objectives
    if (obj.type === 'completeTasks') {
      const catMatch = !obj.category || taskCompleted.cat === obj.category;
      if (catMatch) {
        questState.progress.tasksCompleted = (questState.progress.tasksCompleted || 0) + 1;
        
        // Check if step complete
        if (questState.progress.tasksCompleted >= obj.count) {
          advanceQuestStep(questState);
        }
      }
    }
  }
  
  saveGame();
}

function advanceQuestStep(questState) {
  const quest = QUESTS[questState.questId];
  if (!quest) return;
  
  questState.stepIndex = (questState.stepIndex || 0) + 1;
  questState.progress = {}; // Reset progress for new step
  
  // Check if quest complete
  if (!quest.steps || questState.stepIndex >= quest.steps.length) {
    completeQuest(questState.questId);
  }
}

function completeQuest(questId) {
  const quest = QUESTS[questId];
  if (!quest) return;
  
  // Remove from active
  gameState.activeQuests = gameState.activeQuests.filter(q => q.questId !== questId);
  
  // Add to completed (unless repeatable)
  if (!quest.repeatable && !gameState.completedQuests.includes(questId)) {
    gameState.completedQuests.push(questId);
  }
  
  // Grant rewards
  if (quest.rewards) {
    if (quest.rewards.xp) addXp(quest.rewards.xp);
    if (quest.rewards.gold) gameState.gold += quest.rewards.gold;
    if (quest.rewards.items && typeof addToInventory === 'function') {
      for (const itemId of quest.rewards.items) {
        addToInventory(itemId);
      }
    }
  }
  
  saveGame();
  
  // Show completion notification (simple alert for now)
  alert(`¡Quest completada: ${quest.name}!\n+${quest.rewards?.xp || 0} XP | +${quest.rewards?.gold || 0} oro`);
  
  renderQuests();
  renderHub();
}

// ═══════════════════════════════════════════════════════════════════════════
// PWA Service Worker Registration
// ═══════════════════════════════════════════════════════════════════════════

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
// Block 2.1 hotfix - inventory identity recovery and non-emoji item icons
// ============================================================================

const LEGACY_ITEM_ALIASES = {
  'cuchilla llameante': 'cuchilla_llameante',
  'flaming blade': 'cuchilla_llameante',
  'ashbrand': 'cuchilla_llameante',
  'daga corrosiva': 'daga_corrosiva',
  'espada radiante': 'espada_radiante',
  'hoja gelida': 'hoja_gelida',
  'hoja gélida': 'hoja_gelida',
  'arco de espino': 'arco_espino',
  'tridente marino': 'tridente_marino',
  'katana oriental': 'katana_oriental'
};

function resolveInventoryItemId(slot) {
  if (!slot) return null;
  if (slot.id && typeof ITEMS !== 'undefined' && ITEMS[slot.id]) return slot.id;
  const raw = slot.id || slot.name || slot.legacyName || slot.itemName || '';
  const normalized = normalizeItemText(raw);
  if (LEGACY_ITEM_ALIASES[normalized]) return LEGACY_ITEM_ALIASES[normalized];
  if (typeof ITEMS !== 'undefined') {
    const exact = Object.entries(ITEMS).find(([id, item]) => normalizeItemText(item.name) === normalized);
    if (exact) return exact[0];
    const byId = Object.keys(ITEMS).find(id => normalizeItemText(id) === normalized || normalizeItemText(id.replaceAll('_', ' ')) === normalized);
    if (byId) return byId;
  }
  return null;
}

function repairInventoryIdentities() {
  let changed = false;
  for (const list of [gameState.inventory, gameState.stash]) {
    if (!Array.isArray(list)) continue;
    for (const slot of list) {
      const resolved = resolveInventoryItemId(slot);
      if (resolved && slot.id !== resolved) {
        slot.id = resolved;
        delete slot.name; delete slot.legacyName; delete slot.itemName;
        slot.recoveredAtBuild = LIFE_XP_BUILD;
        changed = true;
      }
    }
  }
  if (changed) saveGame();
  return changed;
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
  showToast('Ritual complete.', 'gold');
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
        if (flavorText && typeof showToast === 'function') showToast(flavorText, 'default');
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

  // ── HEADER ────────────────────────────────────────────────────────────────
  var html = '';
  html += '<div style="text-align:center;padding-bottom:10px;border-bottom:1px solid var(--border);margin-bottom:10px;">';
  html += '<div style="font-size:48px;line-height:1;margin-bottom:6px;">' + (item.icon || '📦') + '</div>';
  html += '<div style="font-size:18px;font-weight:700;color:' + rarity.color + ';letter-spacing:.3px;">' + escapeItemHtml(item.name) + '</div>';
  html += '<div style="font-size:11px;color:var(--text-muted);text-transform:uppercase;letter-spacing:1px;margin-top:3px;">';
  html += escapeItemHtml(type.name) + ' · <span style="color:' + rarity.color + ';">' + escapeItemHtml(rarity.name) + '</span>';
  if (qty > 1) html += ' · ×' + qty;
  html += '</div></div>';

  // ── LORE ──────────────────────────────────────────────────────────────────
  var lore = item.lore || item.desc || '';
  if (lore) {
    html += '<div style="font-size:13px;color:var(--text-muted);font-style:italic;line-height:1.5;margin-bottom:8px;">' + escapeItemHtml(lore) + '</div>';
  }

  // ── STATS ─────────────────────────────────────────────────────────────────
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

  // ── PASSIVE ───────────────────────────────────────────────────────────────
  if (item.passive) {
    html += '<div style="font-size:11px;color:var(--gold);margin:4px 0;">✦ ' + escapeItemHtml(item.passive) + '</div>';
  }

  // ── EFFECTS (only known) ──────────────────────────────────────────────────
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
        html += '<div style="font-size:12px;margin-bottom:4px;color:var(--text-muted);opacity:.5;">🔒 ' + escapeItemHtml(e.name || 'Efecto');
        html += ' <span style="font-size:10px;">(Aclimatación ' + (e.unlockStage || '?') + '/' + att.max + (e.activationRequired ? ' · Ritual' : '') + ')</span></div>';
      }
    });
    html += '</div>';
  }

  // ── REQUIREMENTS — progressive discovery, no spoilers ───────────────────
  // Requirements are never shown as a stat list. The player discovers them
  // by attempting to equip. If they've tried before, show a single flavor hint.
  var equipAttempts = (gameState.itemSystem && gameState.itemSystem.equipAttempts && gameState.itemSystem.equipAttempts[itemId]) || 0;
  if (!req.canEquip && equipAttempts > 0) {
    // Show a vague hint — evocative, not a stat sheet
    var hint = (req.flavorReasons && req.flavorReasons[0]) || 'Algo en ti todavía no está listo para esto.';
    html += '<div style="margin-top:8px;font-size:12px;color:var(--text-muted);font-style:italic;padding:8px;background:var(--bg-surface);border-radius:6px;border-left:2px solid var(--border);">⟳ ' + escapeItemHtml(hint) + '</div>';
  }

  // ── ATTUNEMENT (only if stage > 0 or equipped) ───────────────────────────
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

  // ── ACTIVATION (gated by minimumStage) ───────────────────────────────────
  var minStage = Number((item.attunement && item.attunement.minimumStage) || 1);
  if (!item.attunement || !item.attunement.required || att.stage >= minStage) {
    html += renderActivationPanel(itemId);
  }

  // ── CURSE ─────────────────────────────────────────────────────────────────
  if (item.curse) {
    html += '<div class="item-panel item-curse" style="margin-top:8px;border-color:var(--red);">';
    html += '<div class="item-panel-label" style="font-size:10px;letter-spacing:1px;text-transform:uppercase;margin-bottom:4px;color:var(--red);">Maldición</div>';
    html += '<div style="font-size:12px;color:var(--red);">' + escapeItemHtml((item.curse && item.curse.description) || 'El objeto lleva una maldición.') + '</div>';
    html += '</div>';
  }

  // ── VALUE ─────────────────────────────────────────────────────────────────
  html += '<div style="font-size:11px;color:var(--text-muted);margin-top:10px;text-align:right;">' + (item.value || 0) + ' 🪙</div>';

  document.getElementById('modal-item-content').innerHTML = html;

  // ── ACTION BUTTON ─────────────────────────────────────────────────────────
  var actionBtn = document.getElementById('btn-item-action');
  actionBtn.disabled = false;
  if (container === 'stash') {
    actionBtn.textContent = 'Sacar al inventario';
    actionBtn.onclick = function() { moveItemToInventory(itemId); };
  } else if (type.slot) {
    // Always show "Equipar" — player discovers requirements by trying
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
