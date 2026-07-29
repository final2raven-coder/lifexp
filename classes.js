// ═══════════════════════════════════════════════════════════════════════════
// LifeXP RPG - Classes System (Block 2)
// ═══════════════════════════════════════════════════════════════════════════

const CLASS_TREE = {
  // ══════════ GUERRERO ══════════
  guerrero: {
    name: 'Guerrero', icon: '⚔️', tier: 1, reqLevel: 10,
    stats: { fue: 3, vit: 2 }, desc: 'Maestro del combate cuerpo a cuerpo.',
    branches: ['espadachin', 'berserker', 'caballero']
  },
  espadachin: { name: 'Espadachín', icon: '🗡️', tier: 2, reqLevel: 30, parent: 'guerrero', stats: { fue: 2, des: 2, vit: 1 }, desc: 'Equilibrio entre ataque y defensa.', branches: ['duelista', 'maestro_armas'] },
  berserker: { name: 'Berserker', icon: '🪓', tier: 2, reqLevel: 30, parent: 'guerrero', stats: { fue: 4, vol: 1 }, desc: 'Furia desatada.', branches: ['devastador', 'campeon_sangriento'] },
  caballero: { name: 'Caballero', icon: '🛡️', tier: 2, reqLevel: 30, parent: 'guerrero', stats: { vit: 3, pre: 2 }, desc: 'Protector y líder.', branches: ['paladin', 'senor_guerra'] },
  duelista: { name: 'Duelista', icon: '🤺', tier: 3, reqLevel: 60, parent: 'espadachin', stats: { des: 3, fue: 2 }, desc: 'Maestro del 1v1.', branches: ['campeon_arena'] },
  maestro_armas: { name: 'Maestro de Armas', icon: '⚔️', tier: 3, reqLevel: 60, parent: 'espadachin', stats: { fue: 2, des: 2, int: 1 }, desc: 'Domina todas las armas.', branches: ['leyenda_acero'] },
  devastador: { name: 'Devastador', icon: '💥', tier: 3, reqLevel: 60, parent: 'berserker', stats: { fue: 5 }, desc: 'Destrucción pura.', branches: ['avatar_destruccion'] },
  campeon_sangriento: { name: 'Campeón Sangriento', icon: '🩸', tier: 3, reqLevel: 60, parent: 'berserker', stats: { fue: 3, vit: 2 }, desc: 'Lifesteal.', branches: ['senor_carmesi'] },
  paladin: { name: 'Paladín', icon: '✨', tier: 3, reqLevel: 60, parent: 'caballero', stats: { vit: 3, vol: 2 }, desc: 'Tanque sagrado.', branches: ['caballero_sagrado'] },
  senor_guerra: { name: 'Señor de la Guerra', icon: '🏰', tier: 3, reqLevel: 60, parent: 'caballero', stats: { vit: 2, pre: 3 }, desc: 'Líder nato.', branches: ['conquistador'] },
  campeon_arena: { name: 'Campeón de la Arena', icon: '🏆', tier: 4, reqLevel: 100, parent: 'duelista', stats: { des: 4, fue: 2 }, desc: 'Invicto en combate singular.' },
  leyenda_acero: { name: 'Leyenda del Acero', icon: '⚔️', tier: 4, reqLevel: 100, parent: 'maestro_armas', stats: { fue: 3, des: 3 }, desc: 'Sinónimo de victoria.' },
  avatar_destruccion: { name: 'Avatar de la Destrucción', icon: '🔥', tier: 4, reqLevel: 100, parent: 'devastador', stats: { fue: 6 }, desc: 'Encarnación del caos.' },
  senor_carmesi: { name: 'Señor Carmesí', icon: '🩸', tier: 4, reqLevel: 100, parent: 'campeon_sangriento', stats: { fue: 4, vit: 2 }, desc: 'La sangre es poder.' },
  caballero_sagrado: { name: 'Caballero Sagrado', icon: '👼', tier: 4, reqLevel: 100, parent: 'paladin', stats: { vit: 4, vol: 2 }, desc: 'Bendecido por la luz.' },
  conquistador: { name: 'Conquistador', icon: '👑', tier: 4, reqLevel: 100, parent: 'senor_guerra', stats: { vit: 3, pre: 3 }, desc: 'Forjador de imperios.' },

  // ══════════ ARQUERO ══════════
  arquero: {
    name: 'Arquero', icon: '🏹', tier: 1, reqLevel: 10,
    stats: { des: 3, fue: 2 }, desc: 'Precisión letal a distancia.',
    branches: ['cazador', 'tirador', 'explorador']
  },
  cazador: { name: 'Cazador', icon: '🐺', tier: 2, reqLevel: 30, parent: 'arquero', stats: { des: 2, int: 2, vit: 1 }, desc: 'Trampas y bestias.', branches: ['maestro_bestias', 'trampero'] },
  tirador: { name: 'Tirador', icon: '🎯', tier: 2, reqLevel: 30, parent: 'arquero', stats: { des: 4, fue: 1 }, desc: 'Un disparo, un muerto.', branches: ['francotirador', 'artillero'] },
  explorador: { name: 'Explorador', icon: '🧭', tier: 2, reqLevel: 30, parent: 'arquero', stats: { des: 3, vol: 2 }, desc: 'Velocidad y sigilo.', branches: ['sabueso', 'corredor_viento'] },
  maestro_bestias: { name: 'Maestro de Bestias', icon: '🦁', tier: 3, reqLevel: 60, parent: 'cazador', stats: { des: 2, pre: 2, int: 1 }, desc: 'Múltiples compañeros.', branches: ['senor_jauria'] },
  trampero: { name: 'Trampero', icon: '🪤', tier: 3, reqLevel: 60, parent: 'cazador', stats: { int: 3, des: 2 }, desc: 'Control mortal.', branches: ['arquitecto_muerte'] },
  francotirador: { name: 'Francotirador', icon: '🔭', tier: 3, reqLevel: 60, parent: 'tirador', stats: { des: 5 }, desc: 'El disparo perfecto.', branches: ['ojo_halcon'] },
  artillero: { name: 'Artillero', icon: '💣', tier: 3, reqLevel: 60, parent: 'tirador', stats: { des: 3, fue: 2 }, desc: 'Daño en área.', branches: ['devastador_cielo'] },
  sabueso: { name: 'Sabueso', icon: '🐕', tier: 3, reqLevel: 60, parent: 'explorador', stats: { des: 3, int: 2 }, desc: 'Rastreo.', branches: ['cazador_sombras'] },
  corredor_viento: { name: 'Corredor del Viento', icon: '💨', tier: 3, reqLevel: 60, parent: 'explorador', stats: { des: 4, vol: 1 }, desc: 'Inalcanzable.', branches: ['fantasma_bosque'] },
  senor_jauria: { name: 'Señor de la Jauría', icon: '🐺', tier: 4, reqLevel: 100, parent: 'maestro_bestias', stats: { des: 3, pre: 3 }, desc: 'El pack obedece.' },
  arquitecto_muerte: { name: 'Arquitecto de la Muerte', icon: '☠️', tier: 4, reqLevel: 100, parent: 'trampero', stats: { int: 4, des: 2 }, desc: 'Todo terreno es mortal.' },
  ojo_halcon: { name: 'Ojo de Halcón', icon: '🦅', tier: 4, reqLevel: 100, parent: 'francotirador', stats: { des: 6 }, desc: 'Nunca falla.' },
  devastador_cielo: { name: 'Devastador del Cielo', icon: '🌩️', tier: 4, reqLevel: 100, parent: 'artillero', stats: { des: 4, fue: 2 }, desc: 'Lluvia de destrucción.' },
  cazador_sombras: { name: 'Cazador de Sombras', icon: '🌑', tier: 4, reqLevel: 100, parent: 'sabueso', stats: { des: 4, int: 2 }, desc: 'Aparece y desaparece.' },
  fantasma_bosque: { name: 'Fantasma del Bosque', icon: '👻', tier: 4, reqLevel: 100, parent: 'corredor_viento', stats: { des: 5, vol: 1 }, desc: 'Nadie lo ve venir.' },

  // ══════════ MAGO ══════════
  mago: {
    name: 'Mago', icon: '🔮', tier: 1, reqLevel: 10,
    stats: { int: 3, vol: 2 }, desc: 'Canaliza las fuerzas arcanas.',
    branches: ['elementalista', 'arcanista', 'brujo']
  },
  elementalista: { name: 'Elementalista', icon: '🌀', tier: 2, reqLevel: 30, parent: 'mago', stats: { int: 3, des: 2 }, desc: 'Domina los elementos.', branches: ['piromante', 'criomante', 'electromante'] },
  arcanista: { name: 'Arcanista', icon: '✨', tier: 2, reqLevel: 30, parent: 'mago', stats: { int: 4, vol: 1 }, desc: 'Magia pura.', branches: ['cronomante', 'archimago'] },
  brujo: { name: 'Brujo', icon: '🌙', tier: 2, reqLevel: 30, parent: 'mago', stats: { int: 2, vol: 3 }, desc: 'Pactos oscuros.', branches: ['nigromante', 'demonologo'] },
  piromante: { name: 'Piromante', icon: '🔥', tier: 3, reqLevel: 60, parent: 'elementalista', stats: { int: 4, fue: 1 }, desc: 'Fuego.', branches: ['senor_infierno'] },
  criomante: { name: 'Criomante', icon: '❄️', tier: 3, reqLevel: 60, parent: 'elementalista', stats: { int: 4, vit: 1 }, desc: 'Hielo.', branches: ['corazon_hielo'] },
  electromante: { name: 'Electromante', icon: '⚡', tier: 3, reqLevel: 60, parent: 'elementalista', stats: { int: 3, des: 2 }, desc: 'Rayo.', branches: ['heraldo_tormenta'] },
  cronomante: { name: 'Cronomante', icon: '⏳', tier: 3, reqLevel: 60, parent: 'arcanista', stats: { int: 3, vol: 2 }, desc: 'Tiempo.', branches: ['tejedor_tiempo'] },
  archimago: { name: 'Archimago', icon: '📚', tier: 3, reqLevel: 60, parent: 'arcanista', stats: { int: 5 }, desc: 'Todas las escuelas.', branches: ['gran_sabio'] },
  nigromante: { name: 'Nigromante', icon: '💀', tier: 3, reqLevel: 60, parent: 'brujo', stats: { int: 3, vol: 2 }, desc: 'No-muertos.', branches: ['liche'] },
  demonologo: { name: 'Demonólogo', icon: '👿', tier: 3, reqLevel: 60, parent: 'brujo', stats: { int: 2, vol: 3 }, desc: 'Invocaciones.', branches: ['senor_pactos'] },
  senor_infierno: { name: 'Señor del Infierno', icon: '🔥', tier: 4, reqLevel: 100, parent: 'piromante', stats: { int: 5, fue: 1 }, desc: 'Fuego eterno.' },
  corazon_hielo: { name: 'Corazón de Hielo', icon: '💎', tier: 4, reqLevel: 100, parent: 'criomante', stats: { int: 5, vit: 1 }, desc: 'Inmutable.' },
  heraldo_tormenta: { name: 'Heraldo de la Tormenta', icon: '🌩️', tier: 4, reqLevel: 100, parent: 'electromante', stats: { int: 4, des: 2 }, desc: 'El rayo obedece.' },
  tejedor_tiempo: { name: 'Tejedor del Tiempo', icon: '🕰️', tier: 4, reqLevel: 100, parent: 'cronomante', stats: { int: 4, vol: 2 }, desc: 'El tiempo es suyo.' },
  gran_sabio: { name: 'Gran Sabio', icon: '🧙', tier: 4, reqLevel: 100, parent: 'archimago', stats: { int: 6 }, desc: 'Conocimiento absoluto.' },
  liche: { name: 'Liche', icon: '☠️', tier: 4, reqLevel: 100, parent: 'nigromante', stats: { int: 4, vol: 2 }, desc: 'Más allá de la muerte.' },
  senor_pactos: { name: 'Señor de los Pactos', icon: '📜', tier: 4, reqLevel: 100, parent: 'demonologo', stats: { int: 3, vol: 3 }, desc: 'Todo tiene un precio.' },

  // ══════════ CLÉRIGO ══════════
  clerigo: {
    name: 'Clérigo', icon: '✝️', tier: 1, reqLevel: 10,
    stats: { vol: 3, pre: 2 }, desc: 'Canal de la luz divina.',
    branches: ['sacerdote', 'oraculo', 'inquisidor']
  },
  sacerdote: { name: 'Sacerdote', icon: '💚', tier: 2, reqLevel: 30, parent: 'clerigo', stats: { vol: 3, int: 2 }, desc: 'Curación pura.', branches: ['sumo_sacerdote', 'monje_sanador'] },
  oraculo: { name: 'Oráculo', icon: '👁️', tier: 2, reqLevel: 30, parent: 'clerigo', stats: { vol: 2, pre: 3 }, desc: 'Ve más allá.', branches: ['profeta', 'mistico'] },
  inquisidor: { name: 'Inquisidor', icon: '⚖️', tier: 2, reqLevel: 30, parent: 'clerigo', stats: { vol: 2, fue: 2, vit: 1 }, desc: 'Justicia ofensiva.', branches: ['templario', 'exorcista'] },
  sumo_sacerdote: { name: 'Sumo Sacerdote', icon: '🏛️', tier: 3, reqLevel: 60, parent: 'sacerdote', stats: { vol: 4, int: 1 }, desc: 'Curación masiva.', branches: ['santo'] },
  monje_sanador: { name: 'Monje Sanador', icon: '🙏', tier: 3, reqLevel: 60, parent: 'sacerdote', stats: { vol: 2, des: 2, vit: 1 }, desc: 'Cura y lucha.', branches: ['puno_divino'] },
  profeta: { name: 'Profeta', icon: '🌟', tier: 3, reqLevel: 60, parent: 'oraculo', stats: { pre: 4, vol: 1 }, desc: 'Buffs extremos.', branches: ['vidente_celestial'] },
  mistico: { name: 'Místico', icon: '🔯', tier: 3, reqLevel: 60, parent: 'oraculo', stats: { vol: 3, int: 2 }, desc: 'Magia divina.', branches: ['avatar_luz'] },
  templario: { name: 'Templario', icon: '🛡️', tier: 3, reqLevel: 60, parent: 'inquisidor', stats: { vit: 3, vol: 2 }, desc: 'Tanque sagrado.', branches: ['juez_sagrado'] },
  exorcista: { name: 'Exorcista', icon: '✨', tier: 3, reqLevel: 60, parent: 'inquisidor', stats: { vol: 4, int: 1 }, desc: 'Destruye lo impuro.', branches: ['purificador'] },
  santo: { name: 'Santo', icon: '😇', tier: 4, reqLevel: 100, parent: 'sumo_sacerdote', stats: { vol: 5, int: 1 }, desc: 'Tocado por lo divino.' },
  puno_divino: { name: 'Puño Divino', icon: '👊', tier: 4, reqLevel: 100, parent: 'monje_sanador', stats: { vol: 3, des: 2, vit: 1 }, desc: 'Sanación en cada golpe.' },
  vidente_celestial: { name: 'Vidente Celestial', icon: '🌌', tier: 4, reqLevel: 100, parent: 'profeta', stats: { pre: 5, vol: 1 }, desc: 'Ve todos los futuros.' },
  avatar_luz: { name: 'Avatar de la Luz', icon: '☀️', tier: 4, reqLevel: 100, parent: 'mistico', stats: { vol: 4, int: 2 }, desc: 'La luz encarnada.' },
  juez_sagrado: { name: 'Juez Sagrado', icon: '⚖️', tier: 4, reqLevel: 100, parent: 'templario', stats: { vit: 4, vol: 2 }, desc: 'Su juicio es ley.' },
  purificador: { name: 'Purificador', icon: '🔥', tier: 4, reqLevel: 100, parent: 'exorcista', stats: { vol: 5, int: 1 }, desc: 'Limpia toda corrupción.' },

  // ══════════ PÍCARO ══════════
  picaro: {
    name: 'Pícaro', icon: '🗡️', tier: 1, reqLevel: 10,
    stats: { des: 3, pre: 2 }, desc: 'Sigilo y golpes letales.',
    branches: ['asesino', 'ladron', 'duelista_sombrio']
  },
  asesino: { name: 'Asesino', icon: '🔪', tier: 2, reqLevel: 30, parent: 'picaro', stats: { des: 4, fue: 1 }, desc: 'Un golpe, una muerte.', branches: ['sicario', 'sombra_letal'] },
  ladron: { name: 'Ladrón', icon: '💰', tier: 2, reqLevel: 30, parent: 'picaro', stats: { des: 2, pre: 3 }, desc: 'Lo tuyo es mío.', branches: ['maestro_ladron', 'contrabandista'] },
  duelista_sombrio: { name: 'Duelista Sombrío', icon: '🌑', tier: 2, reqLevel: 30, parent: 'picaro', stats: { des: 3, vol: 2 }, desc: 'Evasión y contraataques.', branches: ['bailarin_sombras', 'acechador'] },
  sicario: { name: 'Sicario', icon: '💀', tier: 3, reqLevel: 60, parent: 'asesino', stats: { des: 4, fue: 1 }, desc: 'Eliminación profesional.', branches: ['mano_muerte'] },
  sombra_letal: { name: 'Sombra Letal', icon: '🦂', tier: 3, reqLevel: 60, parent: 'asesino', stats: { des: 3, int: 2 }, desc: 'Venenos.', branches: ['susurro_venenoso'] },
  maestro_ladron: { name: 'Maestro Ladrón', icon: '🎭', tier: 3, reqLevel: 60, parent: 'ladron', stats: { des: 3, pre: 2 }, desc: 'Roba lo imposible.', branches: ['rey_ladrones'] },
  contrabandista: { name: 'Contrabandista', icon: '📦', tier: 3, reqLevel: 60, parent: 'ladron', stats: { pre: 4, int: 1 }, desc: 'Negocios turbios.', branches: ['baron_bajomundo'] },
  bailarin_sombras: { name: 'Bailarín de Sombras', icon: '💃', tier: 3, reqLevel: 60, parent: 'duelista_sombrio', stats: { des: 5 }, desc: 'Imposible de tocar.', branches: ['espejismo'] },
  acechador: { name: 'Acechador', icon: '🐆', tier: 3, reqLevel: 60, parent: 'duelista_sombrio', stats: { des: 3, vol: 2 }, desc: 'Emboscadas.', branches: ['depredador_silente'] },
  mano_muerte: { name: 'Mano de la Muerte', icon: '✋', tier: 4, reqLevel: 100, parent: 'sicario', stats: { des: 5, fue: 1 }, desc: 'Su toque es letal.' },
  susurro_venenoso: { name: 'Susurro Venenoso', icon: '🐍', tier: 4, reqLevel: 100, parent: 'sombra_letal', stats: { des: 4, int: 2 }, desc: 'El veneno perfecto.' },
  rey_ladrones: { name: 'Rey de los Ladrones', icon: '👑', tier: 4, reqLevel: 100, parent: 'maestro_ladron', stats: { des: 4, pre: 2 }, desc: 'Todo le pertenece.' },
  baron_bajomundo: { name: 'Barón del Bajo Mundo', icon: '🎩', tier: 4, reqLevel: 100, parent: 'contrabandista', stats: { pre: 5, int: 1 }, desc: 'Controla los bajos fondos.' },
  espejismo: { name: 'Espejismo', icon: '🌫️', tier: 4, reqLevel: 100, parent: 'bailarin_sombras', stats: { des: 6 }, desc: 'Solo una sombra.' },
  depredador_silente: { name: 'Depredador Silente', icon: '🦇', tier: 4, reqLevel: 100, parent: 'acechador', stats: { des: 4, vol: 2 }, desc: 'Caza en silencio.' },

  // ══════════ MONJE ══════════
  monje: {
    name: 'Monje', icon: '🥋', tier: 1, reqLevel: 10,
    stats: { des: 2, vol: 3 }, desc: 'Cuerpo y mente en armonía.',
    branches: ['luchador', 'asceta', 'artista_marcial']
  },
  luchador: { name: 'Luchador', icon: '👊', tier: 2, reqLevel: 30, parent: 'monje', stats: { fue: 3, des: 2 }, desc: 'Combos devastadores.', branches: ['maestro_puno', 'gladiador'] },
  asceta: { name: 'Asceta', icon: '🧘', tier: 2, reqLevel: 30, parent: 'monje', stats: { vol: 4, vit: 1 }, desc: 'Resistencia sobrenatural.', branches: ['ermitano', 'iluminado'] },
  artista_marcial: { name: 'Artista Marcial', icon: '🥊', tier: 2, reqLevel: 30, parent: 'monje', stats: { des: 3, fue: 1, vol: 1 }, desc: 'Técnicas refinadas.', branches: ['maestro_dragon', 'maestro_tigre'] },
  maestro_puno: { name: 'Maestro del Puño', icon: '✊', tier: 3, reqLevel: 60, parent: 'luchador', stats: { fue: 4, des: 1 }, desc: 'Puños como martillos.', branches: ['puno_cielo'] },
  gladiador: { name: 'Gladiador', icon: '🏟️', tier: 3, reqLevel: 60, parent: 'luchador', stats: { fue: 2, des: 2, vit: 1 }, desc: 'Versátil.', branches: ['campeon_eterno'] },
  ermitano: { name: 'Ermitaño', icon: '🏔️', tier: 3, reqLevel: 60, parent: 'asceta', stats: { vol: 4, vit: 1 }, desc: 'Casi inmortal.', branches: ['uno_vacio'] },
  iluminado: { name: 'Iluminado', icon: '💡', tier: 3, reqLevel: 60, parent: 'asceta', stats: { vol: 3, int: 2 }, desc: 'Ki ofensivo y defensivo.', branches: ['trascendido'] },
  maestro_dragon: { name: 'Maestro del Dragón', icon: '🐉', tier: 3, reqLevel: 60, parent: 'artista_marcial', stats: { des: 2, int: 2, fue: 1 }, desc: 'Ataques elementales.', branches: ['dragon_ascendido'] },
  maestro_tigre: { name: 'Maestro del Tigre', icon: '🐅', tier: 3, reqLevel: 60, parent: 'artista_marcial', stats: { fue: 3, des: 2 }, desc: 'Fuerza bruta.', branches: ['tigre_blanco'] },
  puno_cielo: { name: 'Puño del Cielo', icon: '☁️', tier: 4, reqLevel: 100, parent: 'maestro_puno', stats: { fue: 5, des: 1 }, desc: 'Rompe el cielo.' },
  campeon_eterno: { name: 'Campeón Eterno', icon: '🏆', tier: 4, reqLevel: 100, parent: 'gladiador', stats: { fue: 3, des: 2, vit: 1 }, desc: 'Nunca derrotado.' },
  uno_vacio: { name: 'Uno con el Vacío', icon: '🕳️', tier: 4, reqLevel: 100, parent: 'ermitano', stats: { vol: 5, vit: 1 }, desc: 'Trasciende lo físico.' },
  trascendido: { name: 'Trascendido', icon: '🌟', tier: 4, reqLevel: 100, parent: 'iluminado', stats: { vol: 4, int: 2 }, desc: 'Más allá.' },
  dragon_ascendido: { name: 'Dragón Ascendido', icon: '🐲', tier: 4, reqLevel: 100, parent: 'maestro_dragon', stats: { des: 3, int: 2, fue: 1 }, desc: 'El dragón interior.' },
  tigre_blanco: { name: 'Tigre Blanco', icon: '🐯', tier: 4, reqLevel: 100, parent: 'maestro_tigre', stats: { fue: 4, des: 2 }, desc: 'Rey de las bestias.' },

  // ══════════ HIDDEN CLASSES ══════════
  ninja: { name: 'Ninja', icon: '🥷', tier: 4, reqLevel: 60, hidden: true, stats: { des: 3, vol: 2, int: 1 }, desc: 'Híbrido Pícaro/Monje.' },
  samurai: { name: 'Samurái', icon: '⚔️', tier: 4, reqLevel: 60, hidden: true, stats: { fue: 3, vol: 2, des: 1 }, desc: 'Híbrido Guerrero/Monje.' },
  bardo: { name: 'Bardo', icon: '🎵', tier: 4, reqLevel: 60, hidden: true, stats: { pre: 4, vol: 2 }, desc: 'Híbrido Clérigo/Pícaro.' },
  alquimista: { name: 'Alquimista', icon: '⚗️', tier: 4, reqLevel: 60, hidden: true, stats: { int: 3, des: 2, vol: 1 }, desc: 'Crafteo y pociones.' }
};

const BASE_CLASSES = ['guerrero', 'arquero', 'mago', 'clerigo', 'picaro', 'monje'];

// ═══════════════════════════════════════════════════════════════════════════
// XP / LEVEL FUNCTIONS
// ═══════════════════════════════════════════════════════════════════════════

function xpForLevel(level) {
  return (level * (level - 1) / 2) * 100;
}

function levelFromXp(xp) {
  return Math.floor((1 + Math.sqrt(1 + 8 * xp / 100)) / 2);
}

function xpToNextLevel(currentXp) {
  const currentLevel = levelFromXp(currentXp);
  return xpForLevel(currentLevel + 1) - currentXp;
}

function xpProgressInLevel(currentXp) {
  const currentLevel = levelFromXp(currentXp);
  const thisLevelXp = xpForLevel(currentLevel);
  const nextLevelXp = xpForLevel(currentLevel + 1);
  return Math.min(1, Math.max(0, (currentXp - thisLevelXp) / (nextLevelXp - thisLevelXp)));
}

// ═══════════════════════════════════════════════════════════════════════════
// STAT CALCULATIONS
// ═══════════════════════════════════════════════════════════════════════════

function calculateDerivedStats(baseStats, classId) {
  const derived = { ...baseStats };
  let currentClass = classId;
  while (currentClass && CLASS_TREE[currentClass]) {
    const cls = CLASS_TREE[currentClass];
    for (const [stat, value] of Object.entries(cls.stats || {})) {
      derived[stat] = (derived[stat] || 0) + value;
    }
    currentClass = cls.parent;
  }
  return derived;
}

function calculateResources(stats) {
  return {
    hp: 100 + (stats.vit || 0) * 15,
    mp: 50 + (stats.int || 0) * 10,
    sp: 50 + Math.floor(((stats.fue || 0) + (stats.des || 0)) / 2) * 5,
    focusMax: 100
  };
}

function getAvailableClassChanges(currentClass, level) {
  if (!currentClass) {
    return level >= 10 ? BASE_CLASSES : [];
  }
  const cls = CLASS_TREE[currentClass];
  if (!cls || !cls.branches) return [];
  return cls.branches.filter(branchId => {
    const branch = CLASS_TREE[branchId];
    return branch && level >= branch.reqLevel;
  });
}

function getClassChain(classId) {
  const chain = [];
  let current = classId;
  while (current && CLASS_TREE[current]) {
    chain.unshift(current);
    current = CLASS_TREE[current].parent;
  }
  return chain;
}

function getTierName(tier) {
  return ['', 'Base', 'Avanzada', 'Transcendente', 'Ascendida'][tier] || '';
}


// Block 3 equipment training registry. Quests/content may grant these IDs.
const ITEM_TRAINING = {
  fire_handling: { name: 'Fire handling', description: 'The basics of handling heat-bound weapons.' },
  edge_control: { name: 'Edge control', description: 'Training for weapons whose effects depend on pressure and timing.' },
  ritual_practice: { name: 'Ritual practice', description: 'Recognising when an item is ready to answer.' }
};
