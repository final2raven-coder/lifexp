// ═══════════════════════════════════════════════════════════════════════════
// LifeXP RPG - Game Engine v1.0
// Bloque 1: Estructura base + Sistema de tareas + Stats
// ═══════════════════════════════════════════════════════════════════════════

const LIFE_XP_BUILD = 'v13-block2';

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

function rollDrop(task, sideQuestCompleted = false) {
  if (!task.drops) return null;
  
  let chance = 0.15; // 15% base chance
  if (sideQuestCompleted && task.sideQuest) {
    chance += (task.sideQuest.dropBonus || 0) / 100;
  }
  
  if (Math.random() < chance) {
    const items = task.drops.items;
    return items[Math.floor(Math.random() * items.length)];
  }
  return null;
}

function rollSideQuestDrop(task) {
  if (!task.sideQuest || !task.sideQuest.drops) return null;
  
  const chance = 0.25; // 25% chance for side quest drops
  if (Math.random() < chance) {
    const items = task.sideQuest.drops;
    return items[Math.floor(Math.random() * items.length)];
  }
  return null;
}

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

function renderInventoryGrid() {
  const grid = document.getElementById('inventory-grid');
  const empty = document.getElementById('inventory-empty');
  
  if (gameState.inventory.length === 0) {
    grid.innerHTML = '';
    empty?.classList.remove('hidden');
    return;
  }
  
  empty?.classList.add('hidden');
  grid.innerHTML = '';
  
  for (const slot of gameState.inventory) {
    const item = typeof ITEMS !== 'undefined' ? ITEMS[slot.id] : null;
    if (!item) {
      const slotIndex = gameState.inventory.indexOf(slot);
      const oldName = slot.name || slot.legacyName || 'Recompensa sin identificar';
      grid.innerHTML += `<div class="inv-slot" onclick="showLegacyItemModal(${slotIndex})" style="background:var(--bg-card);border:2px solid var(--orange);border-radius:8px;padding:8px;text-align:center;cursor:pointer;position:relative;"><div style="font-size:24px;">❔</div><div style="font-size:10px;color:var(--orange);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${oldName}</div><div style="font-size:9px;color:var(--text-muted);margin-top:3px;">Revisar recompensa</div></div>`;
      continue;
    }
    
    const rarity = typeof RARITY !== 'undefined' ? RARITY[item.rarity] : { color: '#9ca3af' };
    const qty = slot.qty || 1;
    
    grid.innerHTML += `
      <div class="inv-slot" onclick="showItemModal('${slot.id}')" 
           style="background: var(--bg-card); border: 2px solid ${rarity.color}; border-radius: 8px; 
                  padding: 8px; text-align: center; cursor: pointer; position: relative;">
        <div style="font-size: 24px;">${item.icon}</div>
        ${qty > 1 ? `<div style="position: absolute; bottom: 2px; right: 4px; font-size: 10px; color: var(--text-muted);">x${qty}</div>` : ''}
      </div>
    `;
  }
}

function renderStashGrid() {
  const grid = document.getElementById('stash-grid');
  const empty = document.getElementById('stash-empty');
  if (!grid) return;
  const stash = Array.isArray(gameState.stash) ? gameState.stash : [];
  if (stash.length === 0) {
    grid.innerHTML = '';
    empty?.classList.remove('hidden');
    return;
  }
  empty?.classList.add('hidden');
  grid.innerHTML = stash.map(slot => {
    const item = ITEMS[slot.id];
    if (!item) return '';
    const rarity = RARITY[item.rarity] || RARITY.common;
    const qty = slot.qty || 1;
    return `<div class="inv-slot" onclick="showStashItemModal('${slot.id}')" style="background:var(--bg-card);border:2px solid ${rarity.color};border-radius:8px;padding:8px;text-align:center;cursor:pointer;position:relative;"><div style="font-size:24px;">${item.icon}</div><div style="font-size:10px;color:${rarity.color};white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${item.name}</div>${qty > 1 ? `<div style="position:absolute;bottom:2px;right:4px;font-size:10px;color:var(--text-muted);">x${qty}</div>` : ''}</div>`;
  }).join('');
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

function showItemModal(itemId, container = 'inventory') {
  selectedItemId = itemId;
  const item = ITEMS[itemId];
  if (!item) return;
  
  const rarity = RARITY[item.rarity];
  const type = ITEM_TYPE[item.type];
  const qty = getItemCount(itemId);
  
  let statsHtml = '';
  if (item.stats) {
    statsHtml = '<div style="margin-top: 8px;">' + 
      Object.entries(item.stats).map(([s, v]) => `<span style="color: var(--stat-${s});">${STATS[s].abbr} +${v}</span>`).join(' ') +
      '</div>';
  }
  
  document.getElementById('modal-item-content').innerHTML = `
    <div style="text-align: center; margin-bottom: 12px;">
      <div style="font-size: 48px;">${item.icon}</div>
      <div style="font-size: 18px; font-weight: 700; color: ${rarity.color};">${item.name}</div>
      <div style="font-size: 12px; color: var(--text-muted);">${type.name} - ${rarity.name}${qty > 1 ? ' x' + qty : ''}</div>
    </div>
    <div style="font-size: 13px; color: var(--text);">${item.desc}</div>
    ${statsHtml}
    ${item.passive ? `<div style="margin-top: 8px; font-size: 12px; color: var(--gold);">* ${item.passive}</div>` : ''}
    <div style="margin-top: 8px; font-size: 12px; color: var(--text-muted);">Valor: ${item.value} oro</div>
  `;
  
  const actionBtn = document.getElementById('btn-item-action');
  actionBtn.disabled = false;
  if (container === 'stash') {
    actionBtn.textContent = 'Sacar al inventario';
    actionBtn.onclick = () => { moveItemToInventory(itemId); };
  } else if (type.slot) {
    actionBtn.textContent = 'Equipar';
    actionBtn.onclick = () => { equipItemFromInventory(itemId); };
  } else if (item.type === 'consumable') {
    actionBtn.textContent = 'Usar';
    actionBtn.onclick = () => { useConsumable(itemId); };
  } else {
    actionBtn.textContent = 'Guardar en baúl';
    actionBtn.onclick = () => { moveItemToStash(itemId); };
  }
  
  document.getElementById('modal-item').classList.add('show');
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

function showEquippedItemModal(slot) {
  const itemId = gameState.equipment[slot];
  if (!itemId) return;
  
  selectedItemId = itemId;
  const item = ITEMS[itemId];
  const rarity = RARITY[item.rarity];
  const type = ITEM_TYPE[item.type];
  
  let statsHtml = '';
  if (item.stats) {
    statsHtml = '<div style="margin-top: 8px;">' + 
      Object.entries(item.stats).map(([s, v]) => `<span style="color: var(--stat-${s});">${STATS[s].abbr} +${v}</span>`).join(' ') +
      '</div>';
  }
  
  document.getElementById('modal-item-content').innerHTML = `
    <div style="text-align: center; margin-bottom: 12px;">
      <div style="font-size: 48px;">${item.icon}</div>
      <div style="font-size: 18px; font-weight: 700; color: ${rarity.color};">${item.name}</div>
      <div style="font-size: 12px; color: var(--text-muted);">${type.name} - ${rarity.name} - EQUIPADO</div>
    </div>
    <div style="font-size: 13px; color: var(--text);">${item.desc}</div>
    ${statsHtml}
    ${item.passive ? `<div style="margin-top: 8px; font-size: 12px; color: var(--gold);">* ${item.passive}</div>` : ''}
  `;
  
  const actionBtn = document.getElementById('btn-item-action');
  actionBtn.textContent = 'Desequipar';
  actionBtn.onclick = () => { unequipItemToInventory(slot); };
  
  document.getElementById('modal-item').classList.add('show');
}

function equipItemFromInventory(itemId) {
  if (equipItem(itemId)) {
    saveGame();
    closeModal('modal-item');
    renderInventory();
    renderCharacter();
  } else {
    alert('No se pudo equipar el item.');
  }
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
function rollDrop(task, sideQuestCompleted) {
  if (!task.drops || !task.drops.theme) return null;
  
  // Calculate bonus from side quest
  const bonus = sideQuestCompleted && task.sideQuest ? (task.sideQuest.dropBonus || 0) / 100 : 0;
  
  // Use items.js rollDrop if available
  if (typeof rollDrop === 'function' && typeof ITEMS !== 'undefined') {
    const result = rollDrop(task.drops.theme, bonus);
    if (result) {
      // Add to inventory using items.js system
      if (typeof addToInventory === 'function') {
        addToInventory(result.itemId);
      }
      const item = ITEMS[result.itemId];
      return item ? item.name : result.itemId;
    }
  }
  
  // Fallback: use old string-based system
  if (task.drops.items && task.drops.items.length > 0) {
    const dropChance = 0.4 + bonus;
    if (Math.random() < dropChance) {
      const dropName = task.drops.items[Math.floor(Math.random() * task.drops.items.length)];
      return dropName;
    }
  }
  
  return null;
}

function rollSideQuestDrop(task) {
  if (!task.sideQuest || !task.sideQuest.drops) return null;
  
  const drops = task.sideQuest.drops;
  if (drops.length === 0) return null;
  
  // 60% chance to get side quest drop
  if (Math.random() < 0.6) {
    return drops[Math.floor(Math.random() * drops.length)];
  }
  
  return null;
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
  const list = document.getElementById('modal-tasks-list');
  const title = document.getElementById('modal-tasks-title');
  if (!modal || !list || !title) return;
  title.textContent = '📜 Quests disponibles';
  
  const activeQuests = Array.isArray(gameState.activeQuests) ? gameState.activeQuests : [];
  const completedQuests = Array.isArray(gameState.completedQuests) ? gameState.completedQuests : [];
  
  if (typeof QUESTS === 'undefined') {
    list.innerHTML = '<div class="text-muted">Sistema de quests no disponible</div>';
    openModal('modal-tasks');
    return;
  }
  
  list.innerHTML = '';
  const playerLevel = gameState.level || 1;
  
  for (const [questId, quest] of Object.entries(QUESTS)) {
    // Skip if already active or completed
    if (activeQuests.some(q => q.questId === questId)) continue;
    if (completedQuests.includes(questId) && !quest.repeatable) continue;
    
    // Check level requirement
    if ((quest.levelReq || quest.minLevel) && playerLevel < (quest.levelReq || quest.minLevel)) continue;
    
    const typeColors = {
      daily: 'var(--green)',
      simple: 'var(--blue)',
      composed: 'var(--purple)',
      story: 'var(--gold)',
      bounty: 'var(--red)',
      class: 'var(--cyan)'
    };
    const color = typeColors[quest.type] || 'var(--text-muted)';
    
    list.innerHTML += `
      <div class="card" style="cursor: pointer; border-left: 3px solid ${color};" onclick="acceptQuest('${questId}')">
        <div style="display: flex; justify-content: space-between; align-items: center;">
          <div>
            <div style="font-size: 11px; color: ${color}; text-transform: uppercase;">${quest.type}</div>
            <div style="font-weight: 600;">${quest.name}</div>
            <div style="font-size: 12px; color: var(--text-muted);">${quest.desc}</div>
          </div>
          <div style="font-size: 24px;">${quest.icon || '📜'}</div>
        </div>
        <div style="margin-top: 8px; font-size: 11px; color: var(--gold);">
          +${quest.rewards?.xp || 0} XP | +${quest.rewards?.gold || 0} 🪙
        </div>
      </div>
    `;
  }
  
  if (!list.innerHTML) {
    list.innerHTML = '<div class="text-muted text-center">No hay quests disponibles ahora</div>';
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
    if (matches) recordItemAttunement(id, 1);
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
function showItemModal(itemId, container = 'inventory') {
  selectedItemId = itemId;
  const item = getItemDefinition(itemId); if (!item) return;
  const rarity = RARITY[item.rarity] || RARITY.common;
  const type = ITEM_TYPE[item.type] || { name: item.type || 'Objeto', slot: null };
  const qty = container === 'stash' ? (gameState.stash?.find(s => s.id === itemId)?.qty || 1) : getItemCount(itemId);
  const effects = item.effects || [];
  const req = getItemRequirementStatus(itemId);
  const att = req.attunement;
  const effectsHtml = effects.length ? `<div class="item-panel"><div class="item-panel-label">EFFECTS</div>${effects.map(e => `<div class="item-effect"><strong>${escapeItemHtml(e.name || 'Effect')}</strong><br>${escapeItemHtml(e.description || '')}</div>`).join('')}</div>` : '';
  const reqHtml = (Object.keys(item.requirements?.stats || {}).length || item.requirements?.trainingId) ? `<div class="item-panel"><div class="item-panel-label">REQUIREMENTS</div>${req.reasons.length ? `<div class="item-warning">${req.reasons.map(escapeItemHtml).join('<br>')}</div>` : '<div class="item-ok">Requirements met</div>'}</div>` : '';
  const attHtml = item.attunement?.required ? `<div class="item-panel"><div class="item-panel-label">ATTUNEMENT</div><div>${att.stage}/${att.max}</div><div class="attunement-track"><span style="width:${Math.min(100, att.stage / att.max * 100)}%"></span></div>${item.attunement.stages?.[att.stage] ? `<small>${escapeItemHtml(item.attunement.stages[att.stage])}</small>` : ''}</div>` : '';
  const ritualHtml = item.activation ? `<div class="item-panel"><div class="item-panel-label">ACTIVATION</div><div>${escapeItemHtml(item.activation.description || item.activation.requirement || 'A hidden condition.')}</div></div>` : '';
  const curseHtml = item.curse ? `<div class="item-panel item-curse"><div class="item-panel-label">CURSE</div><div>${escapeItemHtml(item.curse.description || 'The item carries a curse.')}</div></div>` : '';
  const statsHtml = item.stats && Object.keys(item.stats).length ? `<div class="item-stats">${Object.entries(item.stats).map(([s,v]) => `<span style="color:var(--stat-${s})">${STATS[s]?.abbr || s} +${v}</span>`).join(' ')}</div>` : '';
  document.getElementById('modal-item-content').innerHTML = `<div class="item-hero"><div class="item-icon">${item.icon || '◆'}</div><div class="item-name" style="color:${rarity.color}">${escapeItemHtml(item.name)}</div><div class="item-subtitle">${escapeItemHtml(type.name)} · ${escapeItemHtml(rarity.name)}${qty > 1 ? ` · x${qty}` : ''}</div></div><div class="item-lore">${escapeItemHtml(item.lore || item.desc)}</div>${effectsHtml}${reqHtml}${attHtml}${ritualHtml}${curseHtml}${statsHtml}<div class="item-value">${item.value || 0} oro</div>`;
  const actionBtn = document.getElementById('btn-item-action'); actionBtn.disabled = false;
  if (container === 'stash') { actionBtn.textContent = 'Sacar al inventario'; actionBtn.onclick = () => moveItemToInventory(itemId); }
  else if (type.slot) { actionBtn.textContent = req.canEquip ? 'Equipar' : req.reasons[0]; actionBtn.disabled = !req.canEquip; actionBtn.onclick = () => equipItemFromInventory(itemId); }
  else if (item.type === 'consumable') { actionBtn.textContent = 'Usar'; actionBtn.onclick = () => useConsumable(itemId); }
  else { actionBtn.textContent = 'Guardar en baúl'; actionBtn.onclick = () => moveItemToStash(itemId); }
  openModal('modal-item');
}

function showEquippedItemModal(slot) {
  const itemId = gameState.equipment?.[slot]; if (!itemId) return;
  showItemModal(itemId, 'equipped');
  const actionBtn = document.getElementById('btn-item-action');
  const check = canUnequipItem(slot);
  actionBtn.textContent = check.ok ? 'Desequipar' : check.reason;
  actionBtn.disabled = !check.ok;
  actionBtn.onclick = () => unequipItemToInventory(slot);
}
