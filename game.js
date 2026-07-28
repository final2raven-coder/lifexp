// ═══════════════════════════════════════════════════════════════════════════
// LifeXP RPG - Game Engine v1.0
// Bloque 1: Estructura base + Sistema de tareas + Stats
// ═══════════════════════════════════════════════════════════════════════════

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
  
  // Class (placeholder for next block)
  classId: 'novato',
  classLevel: 1,
  
  // Quests (placeholder)
  activeQuests: [],
  completedQuests: []
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
    }
  } catch (e) {
    console.warn('Could not load game:', e);
  }
  
  // Initialize tasks if empty
  if (!gameState.tasks || gameState.tasks.length === 0) {
    gameState.tasks = JSON.parse(JSON.stringify(DEFAULT_TASKS));
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
  document.getElementById('inv-tab-equipment')?.classList.toggle('hidden', tab !== 'equipment');
  renderInventory();
}

function renderInventory() {
  const capacity = typeof getInventoryCapacity === 'function' ? getInventoryCapacity() : 20;
  const count = gameState.inventory.reduce((sum, i) => sum + (i.qty || 1), 0);
  document.getElementById('inv-count').textContent = `${count}/${capacity}`;
  
  if (currentInventoryTab === 'equipment') {
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
    if (!item) continue;
    
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

function showItemModal(itemId) {
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
  if (type.slot) {
    actionBtn.textContent = 'Equipar';
    actionBtn.onclick = () => { equipItemFromInventory(itemId); };
  } else if (item.type === 'consumable') {
    actionBtn.textContent = 'Usar';
    actionBtn.onclick = () => { useConsumable(itemId); };
  } else {
    actionBtn.textContent = 'Vender';
    actionBtn.onclick = () => { sellItemFromInventory(itemId); };
  }
  
  document.getElementById('modal-item').classList.add('show');
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

function renderQuests() {
  const active = document.getElementById('quests-active');
  const empty = document.getElementById('quests-empty');
  
  if (gameState.activeQuests.length === 0) {
    active.innerHTML = '';
    empty.classList.remove('hidden');
  } else {
    empty.classList.add('hidden');
    // TODO: render quests
    active.innerHTML = '<div class="card"><p>Sistema de quests en desarrollo...</p></div>';
  }
}

function renderSettings() {
  const content = document.getElementById('settings-content');
  content.innerHTML = `
    <div class="section-title">Datos</div>
    <div class="card">
      <button class="btn btn-secondary mb-8" onclick="exportData()">📤 Exportar datos</button>
      <button class="btn btn-secondary mb-8" onclick="showImportModal()">📥 Importar datos</button>
      <button class="btn btn-ghost" onclick="resetGame()" style="color: var(--red)">🗑️ Resetear progreso</button>
    </div>
    
    <div class="section-title">Info</div>
    <div class="card">
      <p style="font-size: 13px; color: var(--text-muted);">
        LifeXP RPG v1.0<br>
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
        addToInventory(dropResult.itemId, 1);
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

function closeModal(modalId) {
  document.getElementById(modalId).classList.remove('show');
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
// EVENT LISTENERS
// ═══════════════════════════════════════════════════════════════════════════

document.addEventListener('DOMContentLoaded', () => {
  // Load game
  loadGame();
  
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
  
  // Initial render
  renderHub();
});

// ═══════════════════════════════════════════════════════════════════════════
// PWA Service Worker Registration
// ═══════════════════════════════════════════════════════════════════════════

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('sw.js').catch(() => {
      console.log('Service worker registration failed (expected in dev)');
    });
  });
}
