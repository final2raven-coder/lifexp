// ===========================================================================
// LifeXP RPG - Default Tasks
// ===========================================================================

const CATEGORIES = {
  casa: { name: 'Casa', icon: '🏠', color: '#f59e0b' },
  cuerpo: { name: 'Cuerpo', icon: '💪', color: '#ef4444' },
  gestiones: { name: 'Gestiones', icon: '📋', color: '#3b82f6' },
  social: { name: 'Social', icon: '👥', color: '#8b5cf6' },
  personal: { name: 'Personal', icon: '🌱', color: '#10b981' }
};

const FREQ = {
  daily: { name: 'Diaria', days: 1 },
  every3days: { name: 'Cada 3 dias', days: 3 },
  weekly: { name: 'Semanal', days: 7 },
  biweekly: { name: 'Quincenal', days: 14 },
  monthly: { name: 'Mensual', days: 30 },
  quarterly: { name: 'Trimestral', days: 90 }
};

const DEFAULT_TASKS = [
  // CASA
  {
    id: 'casa_1', cat: 'casa', name: 'Limpiar bano', freq: 'weekly',
    desc: 'Limpia lavabo, inodoro, ducha y suelo.',
    stats: { vit: 50, vol: 50 }, xp: 30,
    drops: ['frasco_vacio'],
    sideQuest: {
      desc: 'Limpia tambien azulejos y espejos.',
      stats: { vit: 5, vol: 5 }, xp: 15,
      drops: ['agua_pura'],
      dropBonus: 10
    }
  },
  {
    id: 'casa_2', cat: 'casa', name: 'Ordenar bano', freq: 'weekly',
    desc: 'Recoge productos y objetos del bano y dejalos en su sitio.',
    stats: { vol: 60, int: 40 }, xp: 20,
    drops: ['frasco_vacio'],
    sideQuest: {
      desc: 'Revisa tambien el armario del bano y tira lo caducado.',
      stats: { int: 5, vol: 5 }, xp: 10,
      drops: ['antidoto'],
      dropBonus: 8
    }
  },
  {
    id: 'casa_3', cat: 'casa', name: 'Limpiar salon', freq: 'weekly',
    desc: 'Quita polvo, aspira o barre y deja el salon recogido.',
    stats: { vit: 50, vol: 50 }, xp: 30,
    drops: ['cristal_solar'],
    sideQuest: {
      desc: 'Mueve los muebles accesibles y limpia debajo.',
      stats: { vit: 6, vol: 4 }, xp: 15,
      drops: ['objeto_olvidado'],
      dropBonus: 10
    }
  },
  {
    id: 'casa_4', cat: 'casa', name: 'Limpiar cocina', freq: 'weekly',
    desc: 'Limpia encimera, fregadero, fuegos y suelo.',
    stats: { vit: 50, vol: 30, int: 20 }, xp: 30,
    drops: ['especia_rara'],
    sideQuest: {
      desc: 'Limpia tambien el interior de un armario o cajon.',
      stats: { vol: 5, int: 5 }, xp: 15,
      drops: ['frasco_vacio'],
      dropBonus: 10
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
    desc: 'Tiende la ropa cuando termine la lavadora.',
    stats: { vit: 70, vol: 30 }, xp: 15,
    drops: null,
    sideQuest: {
      desc: 'Dobla y guarda la ropa seca.',
      stats: { vol: 5, vit: 5 }, xp: 10,
      drops: null,
      dropBonus: 0
    }
  },
  {
    id: 'casa_7', cat: 'casa', name: 'Hacer la cama', freq: 'daily',
    desc: 'Haz la cama y deja el dormitorio recogido.',
    stats: { vol: 40, int: 30, vit: 30 }, xp: 10,
    drops: null,
    sideQuest: null
  },
  {
    id: 'casa_8', cat: 'casa', name: 'Cambiar sabanas', freq: 'weekly',
    desc: 'Cambia las sabanas y prepara la cama.',
    stats: { vit: 50, vol: 50 }, xp: 20,
    drops: ['tela_eterna'],
    sideQuest: {
      desc: 'Lava tambien la manta o funda nordica.',
      stats: { vit: 5, vol: 5 }, xp: 10,
      drops: ['tela_eterna'],
      dropBonus: 8
    }
  },
  {
    id: 'casa_9', cat: 'casa', name: 'Aspirar y limpiar polvo', freq: 'weekly',
    desc: 'Aspira o barre la casa y quita el polvo de las superficies.',
    stats: { vit: 50, vol: 50 }, xp: 35,
    drops: ['esencia_aire'],
    sideQuest: {
      desc: 'Limpia tambien rodapies y rincones.',
      stats: { vit: 5, vol: 5 }, xp: 15,
      drops: ['pluma_viento'],
      dropBonus: 10
    }
  },
  {
    id: 'casa_10', cat: 'casa', name: 'Fregar suelos', freq: 'weekly',
    desc: 'Friega todos los suelos de la casa.',
    stats: { vit: 60, vol: 40 }, xp: 30,
    drops: ['agua_pura'],
    sideQuest: {
      desc: 'Limpia tambien las manchas dificiles.',
      stats: { vit: 5, vol: 5 }, xp: 15,
      drops: ['acido_gota'],
      dropBonus: 10
    }
  },
  {
    id: 'casa_11', cat: 'casa', name: 'Planificar menu semanal y hacer lista compra', freq: 'weekly',
    desc: 'Planifica las comidas de la semana y haz la lista de la compra.',
    stats: { int: 50, vol: 50 }, xp: 30,
    drops: ['receta_legendaria'],
    sideQuest: {
      desc: 'Planifica tambien desayunos y meriendas.',
      stats: { int: 6, vol: 4 }, xp: 15,
      drops: ['especia_rara'],
      dropBonus: 10
    }
  },
  {
    id: 'casa_12', cat: 'casa', name: 'Hacer la compra', freq: 'weekly',
    desc: 'Haz la compra siguiendo la lista.',
    stats: { vit: 40, int: 30, vol: 30 }, xp: 30,
    drops: ['moneda_oro'],
    sideQuest: {
      desc: 'Compra tambien algo para una receta nueva.',
      stats: { int: 5, vol: 5 }, xp: 15,
      drops: ['ingrediente_raro'],
      dropBonus: 10
    }
  },
  {
    id: 'casa_13', cat: 'casa', name: 'Limpiar dormitorio', freq: 'weekly',
    desc: 'Haz la cama, quita polvo y ordena las mesitas.',
    stats: { vit: 50, vol: 50 }, xp: 25,
    drops: ['pluma_sueno'],
    sideQuest: {
      desc: 'Limpia tambien debajo de la cama.',
      stats: { vit: 5, vol: 5 }, xp: 12,
      drops: ['esencia_aire'],
      dropBonus: 8
    }
  },
  {
    id: 'casa_14', cat: 'casa', name: 'Cuidar plantas', freq: 'weekly',
    desc: 'Riega, poda y revisa tus plantas.',
    stats: { vit: 30, int: 30, vol: 40 }, xp: 20,
    drops: ['semilla_rara'],
    sideQuest: {
      desc: 'Cambia la tierra o limpia las hojas.',
      stats: { int: 5, vol: 5 }, xp: 10,
      drops: ['hoja_curativa'],
      dropBonus: 8
    }
  },
  {
    id: 'casa_15', cat: 'casa', name: 'Lavar platos', freq: 'daily',
    desc: 'Lava los platos, vasos y cubiertos.',
    stats: { vit: 50, vol: 50 }, xp: 15,
    drops: ['esencia_agua'],
    sideQuest: {
      desc: 'Limpia tambien el fregadero y el escurridor.',
      stats: { vit: 4, vol: 6 }, xp: 8,
      drops: ['gota_hielo'],
      dropBonus: 6
    }
  },

  // CUERPO
  {
    id: 'cuerpo_1', cat: 'cuerpo', name: 'Entrenamiento de fuerza', freq: 'weekly',
    desc: 'Haz una sesion de fuerza de al menos 30 minutos.',
    stats: { vit: 70, vol: 30 }, xp: 40,
    drops: ['mineral_hierro'],
    sideQuest: {
      desc: 'Anade una serie extra a cada ejercicio principal.',
      stats: { vit: 8, vol: 4 }, xp: 20,
      drops: ['fragmento_metal'],
      dropBonus: 12
    }
  },
  {
    id: 'cuerpo_2', cat: 'cuerpo', name: 'Correr o cardio', freq: 'weekly',
    desc: 'Haz al menos 25 minutos de cardio.',
    stats: { vit: 70, des: 30 }, xp: 35,
    drops: ['esencia_fuego'],
    sideQuest: {
      desc: 'Haz diez minutos adicionales.',
      stats: { vit: 8, des: 4 }, xp: 18,
      drops: ['llama_culinaria'],
      dropBonus: 10
    }
  },
  {
    id: 'cuerpo_3', cat: 'cuerpo', name: 'Caminar al aire libre', freq: 'daily',
    desc: 'Camina al menos 30 minutos al aire libre.',
    stats: { vit: 40, des: 30, vol: 30 }, xp: 20,
    drops: ['pluma_viento'],
    sideQuest: {
      desc: 'Explora una ruta nueva.',
      stats: { des: 6, vol: 4 }, xp: 10,
      drops: ['mapa_tesoro'],
      dropBonus: 8
    }
  },
  {
    id: 'cuerpo_4', cat: 'cuerpo', name: 'Estiramientos', freq: 'daily',
    desc: 'Haz al menos 10 minutos de estiramientos.',
    stats: { des: 60, vit: 40 }, xp: 15,
    drops: ['esencia_aire'],
    sideQuest: {
      desc: 'Mantén cada estiramiento 30 segundos más.',
      stats: { des: 7, vit: 3 }, xp: 8,
      drops: ['pocion_mente'],
      dropBonus: 6
    }
  },
  {
    id: 'cuerpo_5', cat: 'cuerpo', name: 'Meditación', freq: 'daily',
    desc: 'Medita al menos 10 minutos.',
    stats: { int: 50, vol: 50 }, xp: 15,
    drops: ['orbe_mental'],
    sideQuest: {
      desc: 'Medita cinco minutos adicionales.',
      stats: { int: 6, vol: 4 }, xp: 8,
      drops: ['esencia_oscura'],
      dropBonus: 6
    }
  },
  {
    id: 'cuerpo_6', cat: 'cuerpo', name: 'Natación', freq: 'monthly',
    desc: 'Nada durante al menos 30 minutos.',
    stats: { vit: 60, des: 40 }, xp: 35,
    drops: ['gota_hielo'],
    sideQuest: {
      desc: 'Haz diez largos adicionales.',
      stats: { vit: 8, des: 4 }, xp: 18,
      drops: ['perla_abisal'],
      dropBonus: 12
    }
  },
  {
    id: 'cuerpo_7', cat: 'cuerpo', name: 'Sauna o bano relajante', freq: 'monthly',
    desc: 'Toma un tiempo de calor y descanso para recuperar.',
    stats: { vit: 50, vol: 50 }, xp: 25,
    drops: ['agua_pura'],
    sideQuest: {
      desc: 'Prepara el espacio con luz y musica relajantes.',
      stats: { vol: 6, int: 4 }, xp: 12,
      drops: ['esencia_agua'],
      dropBonus: 8
    }
  },

  // GESTIONES
  {
    id: 'gestiones_1', cat: 'gestiones', name: 'Revisar finanzas', freq: 'weekly',
    desc: 'Revisa cuentas, gastos y presupuesto.',
    stats: { int: 70, vol: 30 }, xp: 30,
    drops: ['moneda_oro'],
    sideQuest: {
      desc: 'Busca un gasto que puedas reducir.',
      stats: { int: 8, vol: 2 }, xp: 15,
      drops: ['moneda_antigua'],
      dropBonus: 10
    }
  },
  {
    id: 'gestiones_2', cat: 'gestiones', name: 'Pagar facturas', freq: 'monthly',
    desc: 'Revisa y paga tus facturas pendientes.',
    stats: { int: 60, vol: 40 }, xp: 25,
    drops: ['contrato_mercantil'],
    sideQuest: {
      desc: 'Organiza los recibos y comprobantes.',
      stats: { int: 6, vol: 4 }, xp: 12,
      drops: ['sello_alianza'],
      dropBonus: 8
    }
  },
  {
    id: 'gestiones_3', cat: 'gestiones', name: 'Archivar documentos', freq: 'monthly',
    desc: 'Ordena y archiva documentos importantes.',
    stats: { int: 70, vol: 30 }, xp: 25,
    drops: ['pagina_arcana'],
    sideQuest: {
      desc: 'Digitaliza un documento importante.',
      stats: { int: 8, vol: 2 }, xp: 12,
      drops: ['cristal_solar'],
      dropBonus: 8
    }
  },
  {
    id: 'gestiones_4', cat: 'gestiones', name: 'Responder mensajes pendientes', freq: 'daily',
    desc: 'Responde mensajes importantes pendientes.',
    stats: { int: 50, vol: 30, pre: 20 }, xp: 20,
    drops: ['sello_alianza'],
    sideQuest: {
      desc: 'Limpia tambien la bandeja de entrada.',
      stats: { int: 5, vol: 5 }, xp: 10,
      drops: ['pagina_arcana'],
      dropBonus: 7
    }
  },
  {
    id: 'gestiones_5', cat: 'gestiones', name: 'Planificar la semana', freq: 'weekly',
    desc: 'Planifica tus tareas y citas de la semana.',
    stats: { int: 60, vol: 40 }, xp: 25,
    drops: ['dado_destino'],
    sideQuest: {
      desc: 'Reserva tambien tiempo de descanso.',
      stats: { int: 5, vol: 5 }, xp: 12,
      drops: ['reloj_arena'],
      dropBonus: 8
    }
  },

  // SOCIAL
  {
    id: 'social_1', cat: 'social', name: 'Llamar a alguien querido', freq: 'weekly',
    desc: 'Llama y ten una conversacion con alguien importante para ti.',
    stats: { pre: 60, vol: 40 }, xp: 20,
    drops: ['token_amistad'],
    sideQuest: {
      desc: 'Pregunta por algo importante para esa persona.',
      stats: { pre: 7, int: 3 }, xp: 10,
      drops: ['hidromiel'],
      dropBonus: 8
    }
  },
  {
    id: 'social_2', cat: 'social', name: 'Quedar con alguien', freq: 'weekly',
    desc: 'Organiza un encuentro presencial.',
    stats: { pre: 50, vol: 30, int: 20 }, xp: 25,
    drops: ['token_amistad'],
    sideQuest: {
      desc: 'Propón una actividad nueva.',
      stats: { pre: 6, vol: 4 }, xp: 12,
      drops: ['sello_alianza'],
      dropBonus: 8
    }
  },
  {
    id: 'social_3', cat: 'social', name: 'Conocer a alguien nuevo', freq: 'monthly',
    desc: 'Inicia una conversación o actividad con alguien nuevo.',
    stats: { pre: 60, vol: 20, int: 20 }, xp: 30,
    drops: ['sello_alianza'],
    sideQuest: {
      desc: 'Intercambia una forma de contacto.',
      stats: { pre: 7, int: 3 }, xp: 15,
      drops: ['token_amistad'],
      dropBonus: 10
    }
  },
  {
    id: 'social_4', cat: 'social', name: 'Tiempo de calidad con familia', freq: 'weekly',
    desc: 'Pasa tiempo de calidad con tu familia.',
    stats: { pre: 50, vol: 30, int: 20 }, xp: 25,
    drops: ['token_amistad'],
    sideQuest: {
      desc: 'Mira fotos o recuerdos juntos.',
      stats: { pre: 5, int: 5 }, xp: 12,
      drops: ['esencia_memoria'],
      dropBonus: 8
    }
  },
  {
    id: 'social_5', cat: 'social', name: 'Participar en comunidad', freq: 'monthly',
    desc: 'Participa en una actividad de tu comunidad.',
    stats: { pre: 50, int: 30, vol: 20 }, xp: 30,
    drops: ['sello_alianza'],
    sideQuest: {
      desc: 'Ofrece ayuda concreta a alguien.',
      stats: { pre: 6, vol: 4 }, xp: 15,
      drops: ['moneda_oro'],
      dropBonus: 10
    }
  },

  // PERSONAL
  {
    id: 'personal_1', cat: 'personal', name: 'Leer', freq: 'daily',
    desc: 'Lee al menos 20 minutos.',
    stats: { int: 70, vol: 30 }, xp: 20,
    drops: ['pagina_arcana'],
    sideQuest: {
      desc: 'Lee diez minutos adicionales y anota una idea.',
      stats: { int: 8, vol: 2 }, xp: 10,
      drops: ['grimorio_antiguo'],
      dropBonus: 8
    }
  },
  {
    id: 'personal_2', cat: 'personal', name: 'Practicar chino', freq: 'daily',
    desc: 'Practica chino durante al menos 15 minutos.',
    stats: { int: 60, pre: 40 }, xp: 25,
    drops: ['talisman_oriental'],
    sideQuest: {
      desc: 'Aprende cinco palabras nuevas.',
      stats: { int: 8, pre: 2 }, xp: 12,
      drops: ['cuentas_jade'],
      dropBonus: 10
    }
  },
  {
    id: 'personal_3', cat: 'personal', name: 'Aprender algo nuevo', freq: 'weekly',
    desc: 'Dedica tiempo a aprender una habilidad o tema nuevo.',
    stats: { int: 80, vol: 20 }, xp: 30,
    drops: ['pagina_arcana'],
    sideQuest: {
      desc: 'Explica lo aprendido a otra persona.',
      stats: { int: 6, pre: 4 }, xp: 15,
      drops: ['cristal_solar'],
      dropBonus: 10
    }
  },
  {
    id: 'personal_4', cat: 'personal', name: 'Escribir o dibujar', freq: 'weekly',
    desc: 'Crea algo por escrito o en dibujo durante al menos 30 minutos.',
    stats: { int: 50, des: 30, vol: 20 }, xp: 30,
    drops: ['tinta_arcana'],
    sideQuest: {
      desc: 'Termina una pieza que puedas guardar.',
      stats: { int: 6, des: 4 }, xp: 15,
      drops: ['pluma_viento'],
      dropBonus: 10
    }
  },
  {
    id: 'personal_5', cat: 'personal', name: 'Practicar autocuidado', freq: 'weekly',
    desc: 'Haz algo que te ayude a descansar y cuidarte.',
    stats: { vol: 60, vit: 40 }, xp: 20,
    drops: ['pocion_vida_menor'],
    sideQuest: {
      desc: 'Prepara el autocuidado con antelación.',
      stats: { vol: 7, int: 3 }, xp: 10,
      drops: ['hoja_curativa'],
      dropBonus: 8
    }
  },
  {
    id: 'personal_6', cat: 'personal', name: 'Revisar objetivos', freq: 'monthly',
    desc: 'Revisa tus objetivos y ajusta el rumbo.',
    stats: { int: 60, vol: 40 }, xp: 25,
    drops: ['dado_destino'],
    sideQuest: {
      desc: 'Define una accion concreta para un objetivo.',
      stats: { int: 6, vol: 4 }, xp: 12,
      drops: ['reloj_arena'],
      dropBonus: 8
    }
  },
  {
    id: 'personal_7', cat: 'personal', name: 'Ocio y juego', freq: 'weekly',
    desc: 'Dedica tiempo a una actividad de ocio que disfrutes.',
    stats: { vol: 60, int: 40 }, xp: 20,
    drops: ['dado_destino'],
    sideQuest: {
      desc: 'Prueba una variante o actividad diferente.',
      stats: { vol: 6, int: 4 }, xp: 10,
      drops: ['objeto_olvidado'],
      dropBonus: 8
    }
  },
  {
    id: 'personal_8', cat: 'personal', name: 'Ver una pelicula o serie', freq: 'weekly',
    desc: 'Disfruta de una pelicula o varios episodios sin multitarea.',
    stats: { vol: 60, int: 40 }, xp: 20,
    drops: ['entrada_festival'],
    sideQuest: {
      desc: 'Escribe una frase sobre lo que te ha dejado.',
      stats: { int: 5, vol: 5 }, xp: 10,
      drops: ['pagina_arcana'],
      dropBonus: 8
    }
  },
  {
    id: 'personal_9', cat: 'personal', name: 'Explorar un contenido cultural', freq: 'monthly',
    desc: 'Visita o descubre una obra, exposicion o contenido cultural nuevo.',
    stats: { int: 50, pre: 30, vol: 20 }, xp: 30,
    drops: ['entrada_festival'],
    sideQuest: {
      desc: 'Comparte una recomendacion con alguien.',
      stats: { int: 5, pre: 5 }, xp: 15,
      drops: ['talisman_oriental'],
      dropBonus: 10
    }
  }
];
