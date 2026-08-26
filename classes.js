// ═══════════════════════════════════════════════════════════════════════════
// LifeXP RPG - Classes System (Block 2)
// ═══════════════════════════════════════════════════════════════════════════

const CLASS_TREE = {
  // ══════════ GUERRERO ══════════
  guerrero: {
    name: 'Guerrero', iconRef: 'class.guerrero', tier: 1, reqLevel: 10,
    stats: { fue: 3, vit: 2 }, desc: 'Maestro del combate cuerpo a cuerpo.',
    branches: ['espadachin', 'berserker', 'caballero']
  },
  espadachin: { name: 'Espadachín', iconRef: 'class.espadachin', tier: 2, reqLevel: 30, parent: 'guerrero', stats: { fue: 2, des: 2, vit: 1 }, desc: 'Equilibrio entre ataque y defensa.', branches: ['duelista', 'maestro_armas'] },
  berserker: { name: 'Berserker', iconRef: 'class.berserker', tier: 2, reqLevel: 30, parent: 'guerrero', stats: { fue: 4, vol: 1 }, desc: 'Furia desatada.', branches: ['devastador', 'campeon_sangriento'] },
  caballero: { name: 'Caballero', iconRef: 'class.caballero', tier: 2, reqLevel: 30, parent: 'guerrero', stats: { vit: 3, pre: 2 }, desc: 'Protector y líder.', branches: ['paladin', 'senor_guerra'] },
  duelista: { name: 'Duelista', iconRef: 'class.duelista', tier: 3, reqLevel: 60, parent: 'espadachin', stats: { des: 3, fue: 2 }, desc: 'Maestro del 1v1.', branches: ['campeon_arena'] },
  maestro_armas: { name: 'Maestro de Armas', iconRef: 'class.maestro_armas', tier: 3, reqLevel: 60, parent: 'espadachin', stats: { fue: 2, des: 2, int: 1 }, desc: 'Domina todas las armas.', branches: ['leyenda_acero'] },
  devastador: { name: 'Devastador', iconRef: 'class.devastador', tier: 3, reqLevel: 60, parent: 'berserker', stats: { fue: 5 }, desc: 'Destrucción pura.', branches: ['avatar_destruccion'] },
  campeon_sangriento: { name: 'Campeón Sangriento', iconRef: 'class.campeon_sangriento', tier: 3, reqLevel: 60, parent: 'berserker', stats: { fue: 3, vit: 2 }, desc: 'Lifesteal.', branches: ['senor_carmesi'] },
  paladin: { name: 'Paladín', iconRef: 'class.paladin', tier: 3, reqLevel: 60, parent: 'caballero', stats: { vit: 3, vol: 2 }, desc: 'Tanque sagrado.', branches: ['caballero_sagrado'] },
  senor_guerra: { name: 'Señor de la Guerra', iconRef: 'class.senor_guerra', tier: 3, reqLevel: 60, parent: 'caballero', stats: { vit: 2, pre: 3 }, desc: 'Líder nato.', branches: ['conquistador'] },
  campeon_arena: { name: 'Campeón de la Arena', iconRef: 'class.campeon_arena', tier: 4, reqLevel: 100, parent: 'duelista', stats: { des: 4, fue: 3 }, desc: 'Invencible en duelo.', branches: [] },
  leyenda_acero: { name: 'Leyenda de Acero', iconRef: 'class.leyenda_acero', tier: 4, reqLevel: 100, parent: 'maestro_armas', stats: { fue: 4, des: 2, vit: 2 }, desc: 'Arma viviente.', branches: [] },
  avatar_destruccion: { name: 'Avatar de Destrucción', iconRef: 'class.avatar_destruccion', tier: 4, reqLevel: 100, parent: 'devastador', stats: { fue: 6 }, desc: 'Fuerza imparable.', branches: [] },
  senor_carmesi: { name: 'Señor Carmesí', iconRef: 'class.senor_carmesi', tier: 4, reqLevel: 100, parent: 'campeon_sangriento', stats: { fue: 4, vit: 4 }, desc: 'Eternal warrior.', branches: [] },
  caballero_sagrado: { name: 'Caballero Sagrado', iconRef: 'class.caballero_sagrado', tier: 4, reqLevel: 100, parent: 'paladin', stats: { vit: 5, vol: 3 }, desc: 'Luz encarnada.', branches: [] },
  conquistador: { name: 'Conquistador', iconRef: 'class.conquistador', tier: 4, reqLevel: 100, parent: 'senor_guerra', stats: { vit: 3, pre: 5 }, desc: 'Domina todo.', branches: [] },

  // ══════════ MAGO ══════════
  mago: {
    name: 'Mago', iconRef: 'class.mago', tier: 1, reqLevel: 10,
    stats: { int: 3, vol: 2 }, desc: 'Canalizador de energías arcanas.',
    branches: ['elementalista', 'ilusionista', 'alquimista']
  },
  elementalista: { name: 'Elementalista', iconRef: 'class.elementalista', tier: 2, reqLevel: 30, parent: 'mago', stats: { int: 4, vol: 1 }, desc: 'Control de elementos.', branches: ['piromante', 'criomante'] },
  ilusionista: { name: 'Ilusionista', iconRef: 'class.ilusionista', tier: 2, reqLevel: 30, parent: 'mago', stats: { int: 3, pre: 2 }, desc: 'Maestro del engaño.', branches: ['psionico', 'hipnotista'] },
  alquimista: { name: 'Alquimista', iconRef: 'class.alquimista', tier: 2, reqLevel: 30, parent: 'mago', stats: { int: 2, pre: 3 }, desc: 'Ciencia y pociones.', branches: ['transmutador', 'maestro_pociones'] },
  piromante: { name: 'Piromante', iconRef: 'class.piromante', tier: 3, reqLevel: 60, parent: 'elementalista', stats: { int: 5 }, desc: 'Fuego devastador.', branches: ['archimago_fuego'] },
  criomante: { name: 'Criomante', iconRef: 'class.criomante', tier: 3, reqLevel: 60, parent: 'elementalista', stats: { int: 4, vol: 2 }, desc: 'Hielo y control.', branches: ['archimago_hielo'] },
  psionico: { name: 'Psiónico', iconRef: 'class.psionico', tier: 3, reqLevel: 60, parent: 'ilusionista', stats: { int: 4, pre: 2 }, desc: 'Poder mental.', branches: ['mente_suprema'] },
  hipnotista: { name: 'Hipnotista', iconRef: 'class.hipnotista', tier: 3, reqLevel: 60, parent: 'ilusionista', stats: { pre: 4, int: 2 }, desc: 'Control de voluntades.', branches: ['marionetista'] },
  transmutador: { name: 'Transmutador', iconRef: 'class.transmutador', tier: 3, reqLevel: 60, parent: 'alquimista', stats: { int: 3, pre: 3 }, desc: 'Cambiar la materia.', branches: ['filosofo_piedra'] },
  maestro_pociones: { name: 'Maestro de Pociones', iconRef: 'class.maestro_pociones', tier: 3, reqLevel: 60, parent: 'alquimista', stats: { int: 2, pre: 4 }, desc: 'Elixir perfecto.', branches: ['elixir_inmortal'] },
  archimago_fuego: { name: 'Archimago de Fuego', iconRef: 'class.archimago_fuego', tier: 4, reqLevel: 100, parent: 'piromante', stats: { int: 7 }, desc: 'Fuego primordial.', branches: [] },
  archimago_hielo: { name: 'Archimago de Hielo', iconRef: 'class.archimago_hielo', tier: 4, reqLevel: 100, parent: 'criomante', stats: { int: 6, vol: 3 }, desc: 'Invierno eterno.', branches: [] },
  mente_suprema: { name: 'Mente Suprema', iconRef: 'class.mente_suprema', tier: 4, reqLevel: 100, parent: 'psionico', stats: { int: 6, pre: 3 }, desc: 'Omnisciencia.', branches: [] },
  marionetista: { name: 'Marionetista', iconRef: 'class.marionetista', tier: 4, reqLevel: 100, parent: 'hipnotista', stats: { pre: 7 }, desc: 'Todos son títeres.', branches: [] },
  filosofo_piedra: { name: 'Filósofo de la Piedra', iconRef: 'class.filosofo_piedra', tier: 4, reqLevel: 100, parent: 'transmutador', stats: { int: 5, pre: 4 }, desc: 'Materia absoluta.', branches: [] },
  elixir_inmortal: { name: 'Elixir Inmortal', iconRef: 'class.elixir_inmortal', tier: 4, reqLevel: 100, parent: 'maestro_pociones', stats: { int: 4, pre: 5 }, desc: 'Vida eterna.', branches: [] },

  // ══════════ EXPLORADOR ══════════
  explorador: {
    name: 'Explorador', iconRef: 'class.explorador', tier: 1, reqLevel: 10,
    stats: { des: 3, pre: 2 }, desc: 'Atención y adaptación.',
    branches: ['ranger', 'cazador', 'superviviente']
  },
  ranger: { name: 'Ranger', iconRef: 'class.ranger', tier: 2, reqLevel: 30, parent: 'explorador', stats: { des: 4, pre: 1 }, desc: 'Maestro del entorno.', branches: ['arquero'] },
  cazador: { name: 'Cazador', iconRef: 'class.cazador', tier: 2, reqLevel: 30, parent: 'explorador', stats: { des: 3, fue: 2 }, desc: 'Persigue objetivos.', branches: ['cazador_jefe'] },
  superviviente: { name: 'Superviviente', iconRef: 'class.superviviente', tier: 2, reqLevel: 30, parent: 'explorador', stats: { vit: 3, des: 2 }, desc: 'Resiste lo imposible.', branches: ['indomable'] },
  arquero: { name: 'Arquero', iconRef: 'class.arquero', tier: 3, reqLevel: 60, parent: 'ranger', stats: { des: 5, pre: 2 }, desc: 'Precisión letal.', branches: ['maestro_arco'] },
  cazador_jefe: { name: 'Cazador Jefe', iconRef: 'class.cazador_jefe', tier: 3, reqLevel: 60, parent: 'cazador', stats: { des: 4, fue: 3 }, desc: 'Caza de élite.', branches: ['depredador_supremo'] },
  indomable: { name: 'Indomable', iconRef: 'class.indomable', tier: 3, reqLevel: 60, parent: 'superviviente', stats: { vit: 5 }, desc: 'Nunca cae.', branches: ['fuerza_naturaleza'] },
  maestro_arco: { name: 'Maestro del Arco', iconRef: 'class.maestro_arco', tier: 4, reqLevel: 100, parent: 'arquero', stats: { des: 7, pre: 3 }, desc: 'Flecha perfecta.', branches: [] },
  depredador_supremo: { name: 'Depredador Supremo', iconRef: 'class.depredador_supremo', tier: 4, reqLevel: 100, parent: 'cazador_jefe', stats: { des: 6, fue: 4 }, desc: 'Cima de la cadena.', branches: [] },
  fuerza_naturaleza: { name: 'Fuerza de la Naturaleza', iconRef: 'class.fuerza_naturaleza', tier: 4, reqLevel: 100, parent: 'indomable', stats: { vit: 7, des: 3 }, desc: 'Uno con el mundo.', branches: [] },

  // ══════════ DIPLOMÁTICO ══════════
  diplomatico: {
    name: 'Diplomático', iconRef: 'class.diplomatico', tier: 1, reqLevel: 10,
    stats: { pre: 3, vol: 2 }, desc: 'Conecta y convence.',
    branches: ['lider', 'negociador', 'mentor']
  },
  lider: { name: 'Líder', iconRef: 'class.lider', tier: 2, reqLevel: 30, parent: 'diplomatico', stats: { pre: 3, vol: 3 }, desc: 'Guía a los demás.', branches: ['comandante'] },
  negociador: { name: 'Negociador', iconRef: 'class.negociador', tier: 2, reqLevel: 30, parent: 'diplomatico', stats: { pre: 4, int: 2 }, desc: 'Siempre consigue un sí.', branches: ['maestro_tratos'] },
  mentor: { name: 'Mentor', iconRef: 'class.mentor', tier: 2, reqLevel: 30, parent: 'diplomatico', stats: { vol: 4, pre: 2 }, desc: 'Eleva a otros.', branches: ['sabio'] },
  comandante: { name: 'Comandante', iconRef: 'class.comandante', tier: 3, reqLevel: 60, parent: 'lider', stats: { pre: 5, vol: 3 }, desc: 'Liderazgo estratégico.', branches: ['gran_estratega'] },
  maestro_tratos: { name: 'Maestro de Tratos', iconRef: 'class.maestro_tratos', tier: 3, reqLevel: 60, parent: 'negociador', stats: { pre: 6, int: 2 }, desc: 'Todo es posible.', branches: ['rey_comercio'] },
  sabio: { name: 'Sabio', iconRef: 'class.sabio', tier: 3, reqLevel: 60, parent: 'mentor', stats: { vol: 5, int: 2 }, desc: 'Conocimiento compartido.', branches: ['oraculo'] },
  gran_estratega: { name: 'Gran Estratega', iconRef: 'class.gran_estratega', tier: 4, reqLevel: 100, parent: 'comandante', stats: { pre: 7, int: 3 }, desc: 'Ve diez movimientos adelante.', branches: [] },
  rey_comercio: { name: 'Rey del Comercio', iconRef: 'class.rey_comercio', tier: 4, reqLevel: 100, parent: 'maestro_tratos', stats: { pre: 8, int: 2 }, desc: 'Riqueza sin límites.', branches: [] },
  oraculo: { name: 'Oráculo', iconRef: 'class.oraculo', tier: 4, reqLevel: 100, parent: 'sabio', stats: { vol: 7, int: 3 }, desc: 'Conoce el futuro.', branches: [] },

  // ══════════ ARTESANO ══════════
  artesano: {
    name: 'Artesano', iconRef: 'class.artesano', tier: 1, reqLevel: 10,
    stats: { int: 2, pre: 3 }, desc: 'Crea y construye.',
    branches: ['herrero', 'ingeniero', 'cocinero']
  },
  herrero: { name: 'Herrero', iconRef: 'class.herrero', tier: 2, reqLevel: 30, parent: 'artesano', stats: { fue: 3, pre: 2 }, desc: 'Forja equipo.', branches: ['maestro_forja'] },
  ingeniero: { name: 'Ingeniero', iconRef: 'class.ingeniero', tier: 2, reqLevel: 30, parent: 'artesano', stats: { int: 4, pre: 1 }, desc: 'Diseña soluciones.', branches: ['inventor'] },
  cocinero: { name: 'Cocinero', iconRef: 'class.cocinero', tier: 2, reqLevel: 30, parent: 'artesano', stats: { pre: 3, vit: 2 }, desc: 'Nutre y potencia.', branches: ['chef'] },
  maestro_forja: { name: 'Maestro de la Forja', iconRef: 'class.maestro_forja', tier: 3, reqLevel: 60, parent: 'herrero', stats: { fue: 4, pre: 3 }, desc: 'Metal legendario.', branches: ['forjador_leyendas'] },
  inventor: { name: 'Inventor', iconRef: 'class.inventor', tier: 3, reqLevel: 60, parent: 'ingeniero', stats: { int: 5, pre: 2 }, desc: 'Crea lo imposible.', branches: ['genio_mecanico'] },
  chef: { name: 'Chef', iconRef: 'class.chef', tier: 3, reqLevel: 60, parent: 'cocinero', stats: { pre: 4, vit: 3 }, desc: 'Arte culinario.', branches: ['maestro_gastronomo'] },
  forjador_leyendas: { name: 'Forjador de Leyendas', iconRef: 'class.forjador_leyendas', tier: 4, reqLevel: 100, parent: 'maestro_forja', stats: { fue: 7, pre: 3 }, desc: 'Armas eternas.', branches: [] },
  genio_mecanico: { name: 'Genio Mecánico', iconRef: 'class.genio_mecanico', tier: 4, reqLevel: 100, parent: 'inventor', stats: { int: 8, pre: 2 }, desc: 'Tecnología avanzada.', branches: [] },
  maestro_gastronomo: { name: 'Maestro Gastronómo', iconRef: 'class.maestro_gastronomo', tier: 4, reqLevel: 100, parent: 'chef', stats: { pre: 6, vit: 5 }, desc: 'Cada bocado transforma.', branches: [] }
};

function getClassById(classId) {
  return CLASS_TREE[classId] || CLASS_TREE.novato;
}

function getClassTier(classId) {
  return CLASS_TREE[classId]?.tier || 0;
}

function getAvailableClassChanges(currentClassId, level) {
  return Object.entries(CLASS_TREE)
    .filter(([id, cls]) => {
      if (id === 'novato') return false;
      if (cls.reqLevel > level) return false;
      if (!currentClassId) return cls.tier === 1;
      return cls.parent === currentClassId;
    })
    .map(([id]) => id);
}

function getClassRequirementsText(cls) {
  if (!cls) return '';
  const reqs = [`Level ${cls.reqLevel}`];
  if (cls.parent) reqs.push(`Requires: ${CLASS_TREE[cls.parent]?.name || cls.parent}`);
  return reqs.join(' • ');
}

function calculateClassBonus(classId) {
  const cls = getClassById(classId);
  return cls.stats || {};
}

function getClassDisplayInfo(classId) {
  const cls = getClassById(classId);
  return {
    id: classId,
    name: cls.name,
    iconRef: cls.iconRef || 'class.generic',
    tier: cls.tier,
    description: cls.desc,
    color: cls.color || 'var(--accent)'
  };
}
