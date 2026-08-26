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
  campeon_arena: { name: 'Campeón de la Arena', iconRef: 'class.campeon_arena', tier: 4, reqLevel: 100, parent: 'duelista', stats: { des: 4, fue: 2 }, desc: 'Invicto en combate singular.' },
  leyenda_acero: { name: 'Leyenda del Acero', iconRef: 'class.leyenda_acero', tier: 4, reqLevel: 100, parent: 'maestro_armas', stats: { fue: 3, des: 3 }, desc: 'Sinónimo de victoria.' },
  avatar_destruccion: { name: 'Avatar de la Destrucción', iconRef: 'class.avatar_destruccion', tier: 4, reqLevel: 100, parent: 'devastador', stats: { fue: 6 }, desc: 'Encarnación del caos.' },
  senor_carmesi: { name: 'Señor Carmesí', iconRef: 'class.senor_carmesi', tier: 4, reqLevel: 100, parent: 'campeon_sangriento', stats: { fue: 4, vit: 2 }, desc: 'La sangre es poder.' },
  caballero_sagrado: { name: 'Caballero Sagrado', iconRef: 'class.caballero_sagrado', tier: 4, reqLevel: 100, parent: 'paladin', stats: { vit: 4, vol: 2 }, desc: 'Bendecido por la luz.' },
  conquistador: { name: 'Conquistador', iconRef: 'class.conquistador', tier: 4, reqLevel: 100, parent: 'senor_guerra', stats: { vit: 3, pre: 3 }, desc: 'Forjador de imperios.' },

  // ══════════ ARQUERO ══════════
  arquero: {
    name: 'Arquero', iconRef: 'class.arquero', tier: 1, reqLevel: 10,
    stats: { des: 3, fue: 2 }, desc: 'Precisión letal a distancia.',
    branches: ['cazador', 'tirador', 'explorador']
  },
  cazador: { name: 'Cazador', iconRef: 'class.cazador', tier: 2, reqLevel: 30, parent: 'arquero', stats: { des: 2, int: 2, vit: 1 }, desc: 'Trampas y bestias.', branches: ['maestro_bestias', 'trampero'] },
  tirador: { name: 'Tirador', iconRef: 'class.tirador', tier: 2, reqLevel: 30, parent: 'arquero', stats: { des: 4, fue: 1 }, desc: 'Un disparo, un muerto.', branches: ['francotirador', 'artillero'] },
  explorador: { name: 'Explorador', iconRef: 'class.explorador', tier: 2, reqLevel: 30, parent: 'arquero', stats: { des: 3, vol: 2 }, desc: 'Velocidad y sigilo.', branches: ['sabueso', 'corredor_viento'] },
  maestro_bestias: { name: 'Maestro de Bestias', iconRef: 'class.maestro_bestias', tier: 3, reqLevel: 60, parent: 'cazador', stats: { des: 2, pre: 2, int: 1 }, desc: 'Múltiples compañeros.', branches: ['senor_jauria'] },
  trampero: { name: 'Trampero', iconRef: 'class.trampero', tier: 3, reqLevel: 60, parent: 'cazador', stats: { int: 3, des: 2 }, desc: 'Control mortal.', branches: ['arquitecto_muerte'] },
  francotirador: { name: 'Francotirador', iconRef: 'class.francotirador', tier: 3, reqLevel: 60, parent: 'tirador', stats: { des: 5 }, desc: 'El disparo perfecto.', branches: ['ojo_halcon'] },
  artillero: { name: 'Artillero', iconRef: 'class.artillero', tier: 3, reqLevel: 60, parent: 'tirador', stats: { des: 3, fue: 2 }, desc: 'Daño en área.', branches: ['devastador_cielo'] },
  sabueso: { name: 'Sabueso', iconRef: 'class.sabueso', tier: 3, reqLevel: 60, parent: 'explorador', stats: { des: 3, int: 2 }, desc: 'Rastreo.', branches: ['cazador_sombras'] },
  corredor_viento: { name: 'Corredor del Viento', iconRef: 'class.corredor_viento', tier: 3, reqLevel: 60, parent: 'explorador', stats: { des: 4, vol: 1 }, desc: 'Inalcanzable.', branches: ['fantasma_bosque'] },
  senor_jauria: { name: 'Señor de la Jauría', iconRef: 'class.senor_jauria', tier: 4, reqLevel: 100, parent: 'maestro_bestias', stats: { des: 3, pre: 3 }, desc: 'El pack obedece.' },
  arquitecto_muerte: { name: 'Arquitecto de la Muerte', iconRef: 'class.arquitecto_muerte', tier: 4, reqLevel: 100, parent: 'trampero', stats: { int: 4, des: 2 }, desc: 'Todo terreno es mortal.' },
  ojo_halcon: { name: 'Ojo de Halcón', iconRef: 'class.ojo_halcon', tier: 4, reqLevel: 100, parent: 'francotirador', stats: { des: 6 }, desc: 'Nunca falla.' },
  devastador_cielo: { name: 'Devastador del Cielo', iconRef: 'class.devastador_cielo', tier: 4, reqLevel: 100, parent: 'artillero', stats: { des: 4, fue: 2 }, desc: 'Lluvia de destrucción.' },
  cazador_sombras: { name: 'Cazador de Sombras', iconRef: 'class.cazador_sombras', tier: 4, reqLevel: 100, parent: 'sabueso', stats: { des: 4, int: 2 }, desc: 'Aparece y desaparece.' },
  fantasma_bosque: { name: 'Fantasma del Bosque', iconRef: 'class.fantasma_bosque', tier: 4, reqLevel: 100, parent: 'corredor_viento', stats: { des: 5, vol: 1 }, desc: 'Nadie lo ve venir.' },

  // ══════════ MAGO ══════════
  mago: {
    name: 'Mago', iconRef: 'class.mago', tier: 1, reqLevel: 10,
    stats: { int: 3, vol: 2 }, desc: 'Canaliza las fuerzas arcanas.',
    branches: ['elementalista', 'arcanista', 'brujo']
  },
  elementalista: { name: 'Elementalista', iconRef: 'class.elementalista', tier: 2, reqLevel: 30, parent: 'mago', stats: { int: 3, des: 2 }, desc: 'Domina los elementos.', branches: ['piromante', 'criomante', 'electromante'] },
  arcanista: { name: 'Arcanista', iconRef: 'class.arcanista', tier: 2, reqLevel: 30, parent: 'mago', stats: { int: 4, vol: 1 }, desc: 'Magia pura.', branches: ['cronomante', 'archimago'] },
  brujo: { name: 'Brujo', iconRef: 'class.brujo', tier: 2, reqLevel: 30, parent: 'mago', stats: { int: 2, vol: 3 }, desc: 'Pactos oscuros.', branches: ['nigromante', 'demonologo'] },
  piromante: { name: 'Piromante', iconRef: 'class.piromante', tier: 3, reqLevel: 60, parent: 'elementalista', stats: { int: 4, fue: 1 }, desc: 'Fuego.', branches: ['senor_infierno'] },
  criomante: { name: 'Criomante', iconRef: 'class.criomante', tier: 3, reqLevel: 60, parent: 'elementalista', stats: { int: 4, vit: 1 }, desc: 'Hielo.', branches: ['corazon_hielo'] },
  electromante: { name: 'Electromante', iconRef: 'class.electromante', tier: 3, reqLevel: 60, parent: 'elementalista', stats: { int: 3, des: 2 }, desc: 'Rayo.', branches: ['heraldo_tormenta'] },
  cronomante: { name: 'Cronomante', iconRef: 'class.cronomante', tier: 3, reqLevel: 60, parent: 'arcanista', stats: { int: 3, vol: 2 }, desc: 'Tiempo.', branches: ['tejedor_tiempo'] },
  archimago: { name: 'Archimago', iconRef: 'class.archimago', tier: 3, reqLevel: 60, parent: 'arcanista', stats: { int: 5 }, desc: 'Todas las escuelas.', branches: ['gran_sabio'] },
  nigromante: { name: 'Nigromante', iconRef: 'class.nigromante', tier: 3, reqLevel: 60, parent: 'brujo', stats: { int: 3, vol: 2 }, desc: 'No-muertos.', branches: ['liche'] },
  demonologo: { name: 'Demonólogo', iconRef: 'class.demonologo', tier: 3, reqLevel: 60, parent: 'brujo', stats: { int: 2, vol: 3 }, desc: 'Invocaciones.', branches: ['senor_pactos'] },
  senor_infierno: { name: 'Señor del Infierno', iconRef: 'class.senor_infierno', tier: 4, reqLevel: 100, parent: 'piromante', stats: { int: 5, fue: 1 }, desc: 'Fuego eterno.' },
  corazon_hielo: { name: 'Corazón de Hielo', iconRef: 'class.corazon_hielo', tier: 4, reqLevel: 100, parent: 'criomante', stats: { int: 5, vit: 1 }, desc: 'Inmutable.' },
  heraldo_tormenta: { name: 'Heraldo de la Tormenta', iconRef: 'class.heraldo_tormenta', tier: 4, reqLevel: 100, parent: 'electromante', stats: { int: 4, des: 2 }, desc: 'El rayo obedece.' },
  tejedor_tiempo: { name: 'Tejedor del Tiempo', iconRef: 'class.tejedor_tiempo', tier: 4, reqLevel: 100, parent: 'cronomante', stats: { int: 4, vol: 2 }, desc: 'El tiempo es suyo.' },
  gran_sabio: { name: 'Gran Sabio', iconRef: 'class.gran_sabio', tier: 4, reqLevel: 100, parent: 'archimago', stats: { int: 6 }, desc: 'Conocimiento absoluto.' },
  liche: { name: 'Liche', iconRef: 'class.liche', tier: 4, reqLevel: 100, parent: 'nigromante', stats: { int: 4, vol: 2 }, desc: 'Más allá de la muerte.' },
  senor_pactos: { name: 'Señor de los Pactos', iconRef: 'class.senor_pactos', tier: 4, reqLevel: 100, parent: 'demonologo', stats: { int: 3, vol: 3 }, desc: 'Todo tiene un precio.' },

  // ══════════ CLÉRIGO ══════════
  clerigo: {
    name: 'Clérigo', iconRef: 'class.clerigo', tier: 1, reqLevel: 10,
    stats: { vol: 3, pre: 2 }, desc: 'Canal de la luz divina.',
    branches: ['sacerdote', 'oraculo', 'inquisidor']
  },
  sacerdote: { name: 'Sacerdote', iconRef: 'class.sacerdote', tier: 2, reqLevel: 30, parent: 'clerigo', stats: { vol: 3, int: 2 }, desc: 'Curación pura.', branches: ['sumo_sacerdote', 'monje_sanador'] },
  oraculo: { name: 'Oráculo', iconRef: 'class.oraculo', tier: 2, reqLevel: 30, parent: 'clerigo', stats: { vol: 2, pre: 3 }, desc: 'Ve más allá.', branches: ['profeta', 'mistico'] },
  inquisidor: { name: 'Inquisidor', iconRef: 'class.inquisidor', tier: 2, reqLevel: 30, parent: 'clerigo', stats: { vol: 2, fue: 2, vit: 1 }, desc: 'Justicia ofensiva.', branches: ['templario', 'exorcista'] },
  sumo_sacerdote: { name: 'Sumo Sacerdote', iconRef: 'class.sumo_sacerdote', tier: 3, reqLevel: 60, parent: 'sacerdote', stats: { vol: 4, int: 1 }, desc: 'Curación masiva.', branches: ['santo'] },
  monje_sanador: { name: 'Monje Sanador', iconRef: 'class.monje_sanador', tier: 3, reqLevel: 60, parent: 'sacerdote', stats: { vol: 2, des: 2, vit: 1 }, desc: 'Cura y lucha.', branches: ['puno_divino'] },
  profeta: { name: 'Profeta', iconRef: 'class.profeta', tier: 3, reqLevel: 60, parent: 'oraculo', stats: { pre: 4, vol: 1 }, desc: 'Buffs extremos.', branches: ['vidente_celestial'] },
  mistico: { name: 'Místico', iconRef: 'class.mistico', tier: 3, reqLevel: 60, parent: 'oraculo', stats: { vol: 3, int: 2 }, desc: 'Magia divina.', branches: ['avatar_luz'] },
  templario: { name: 'Templario', iconRef: 'class.templario', tier: 3, reqLevel: 60, parent: 'inquisidor', stats: { vit: 3, vol: 2 }, desc: 'Tanque sagrado.', branches: ['juez_sagrado'] },
  exorcista: { name: 'Exorcista', iconRef: 'class.exorcista', tier: 3, reqLevel: 60, parent: 'inquisidor', stats: { vol: 4, int: 1 }, desc: 'Destruye lo impuro.', branches: ['purificador'] },
  santo: { name: 'Santo', iconRef: 'class.santo', tier: 4, reqLevel: 100, parent: 'sumo_sacerdote', stats: { vol: 5, int: 1 }, desc: 'Tocado por lo divino.' },
  puno_divino: { name: 'Puño Divino', iconRef: 'class.puno_divino', tier: 4, reqLevel: 100, parent: 'monje_sanador', stats: { vol: 3, des: 2, vit: 1 }, desc: 'Sanación en cada golpe.' },
  vidente_celestial: { name: 'Vidente Celestial', iconRef: 'class.vidente_celestial', tier: 4, reqLevel: 100, parent: 'profeta', stats: { pre: 5, vol: 1 }, desc: 'Ve todos los futuros.' },
  avatar_luz: { name: 'Avatar de la Luz', iconRef: 'class.avatar_luz', tier: 4, reqLevel: 100, parent: 'mistico', stats: { vol: 4, int: 2 }, desc: 'La luz encarnada.' },
  juez_sagrado: { name: 'Juez Sagrado', iconRef: 'class.juez_sagrado', tier: 4, reqLevel: 100, parent: 'templario', stats: { vit: 4, vol: 2 }, desc: 'Su juicio es ley.' },
  purificador: { name: 'Purificador', iconRef: 'class.purificador', tier: 4, reqLevel: 100, parent: 'exorcista', stats: { vol: 5, int: 1 }, desc: 'Limpia toda corrupción.' },

  // ══════════ PÍCARO ══════════
  picaro: {
    name: 'Pícaro', iconRef: 'class.picaro', tier: 1, reqLevel: 10,
    stats: { des: 3, pre: 2 }, desc: 'Sigilo y golpes letales.',
    branches: ['asesino', 'ladron', 'duelista_sombrio']
  },
  asesino: { name: 'Asesino', iconRef: 'class.asesino', tier: 2, reqLevel: 30, parent: 'picaro', stats: { des: 4, fue: 1 }, desc: 'Un golpe, una muerte.', branches: ['sicario', 'sombra_letal'] },
  ladron: { name: 'Ladrón', iconRef: 'class.ladron', tier: 2, reqLevel: 30, parent: 'picaro', stats: { des: 2, pre: 3 }, desc: 'Lo tuyo es mío.', branches: ['maestro_ladron', 'contrabandista'] },
  duelista_sombrio: { name: 'Duelista Sombrío', iconRef: 'class.duelista_sombrio', tier: 2, reqLevel: 30, parent: 'picaro', stats: { des: 3, vol: 2 }, desc: 'Evasión y contraataques.', branches: ['bailarin_sombras', 'acechador'] },
  sicario: { name: 'Sicario', iconRef: 'class.sicario', tier: 3, reqLevel: 60, parent: 'asesino', stats: { des: 4, fue: 1 }, desc: 'Eliminación profesional.', branches: ['mano_muerte'] },
  sombra_letal: { name: 'Sombra Letal', iconRef: 'class.sombra_letal', tier: 3, reqLevel: 60, parent: 'asesino', stats: { des: 3, int: 2 }, desc: 'Venenos.', branches: ['susurro_venenoso'] },
  maestro_ladron: { name: 'Maestro Ladrón', iconRef: 'class.maestro_ladron', tier: 3, reqLevel: 60, parent: 'ladron', stats: { des: 3, pre: 2 }, desc: 'Roba lo imposible.', branches: ['rey_ladrones'] },
  contrabandista: { name: 'Contrabandista', iconRef: 'class.contrabandista', tier: 3, reqLevel: 60, parent: 'ladron', stats: { pre: 4, int: 1 }, desc: 'Negocios turbios.', branches: ['baron_bajomundo'] },
  bailarin_sombras: { name: 'Bailarín de Sombras', iconRef: 'class.bailarin_sombras', tier: 3, reqLevel: 60, parent: 'duelista_sombrio', stats: { des: 5 }, desc: 'Imposible de tocar.', branches: ['espejismo'] },
  acechador: { name: 'Acechador', iconRef: 'class.acechador', tier: 3, reqLevel: 60, parent: 'duelista_sombrio', stats: { des: 3, vol: 2 }, desc: 'Emboscadas.', branches: ['depredador_silente'] },
  mano_muerte: { name: 'Mano de la Muerte', iconRef: 'class.mano_muerte', tier: 4, reqLevel: 100, parent: 'sicario', stats: { des: 5, fue: 1 }, desc: 'Su toque es letal.' },
  susurro_venenoso: { name: 'Susurro Venenoso', iconRef: 'class.susurro_venenoso', tier: 4, reqLevel: 100, parent: 'sombra_letal', stats: { des: 4, int: 2 }, desc: 'El veneno perfecto.' },
  rey_ladrones: { name: 'Rey de los Ladrones', iconRef: 'class.rey_ladrones', tier: 4, reqLevel: 100, parent: 'maestro_ladron', stats: { des: 4, pre: 2 }, desc: 'Todo le pertenece.' },
  baron_bajomundo: { name: 'Barón del Bajo Mundo', iconRef: 'class.baron_bajomundo', tier: 4, reqLevel: 100, parent: 'contrabandista', stats: { pre: 5, int: 1 }, desc: 'Controla los bajos fondos.' },
  espejismo: { name: 'Espejismo', iconRef: 'class.espejismo', tier: 4, reqLevel: 100, parent: 'bailarin_sombras', stats: { des: 6 }, desc: 'Solo una sombra.' },
  depredador_silente: { name: 'Depredador Silente', iconRef: 'class.depredador_silente', tier: 4, reqLevel: 100, parent: 'acechador', stats: { des: 4, vol: 2 }, desc: 'Caza en silencio.' },

  // ══════════ MONJE ══════════
  monje: {
    name: 'Monje', iconRef: 'class.monje', tier: 1, reqLevel: 10,
    stats: { des: 2, vol: 3 }, desc: 'Cuerpo y mente en armonía.',
    branches: ['luchador', 'asceta', 'artista_marcial']
  },
  luchador: { name: 'Luchador', iconRef: 'class.luchador', tier: 2, reqLevel: 30, parent: 'monje', stats: { fue: 3, des: 2 }, desc: 'Combos devastadores.', branches: ['maestro_puno', 'gladiador'] },
  asceta: { name: 'Asceta', iconRef: 'class.asceta', tier: 2, reqLevel: 30, parent: 'monje', stats: { vol: 4, vit: 1 }, desc: 'Resistencia sobrenatural.', branches: ['ermitano', 'iluminado'] },
  artista_marcial: { name: 'Artista Marcial', iconRef: 'class.artista_marcial', tier: 2, reqLevel: 30, parent: 'monje', stats: { des: 3, fue: 1, vol: 1 }, desc: 'Técnicas refinadas.', branches: ['maestro_dragon', 'maestro_tigre'] },
  maestro_puno: { name: 'Maestro del Puño', iconRef: 'class.maestro_puno', tier: 3, reqLevel: 60, parent: 'luchador', stats: { fue: 4, des: 1 }, desc: 'Puños como martillos.', branches: ['puno_cielo'] },
  gladiador: { name: 'Gladiador', iconRef: 'class.gladiador', tier: 3, reqLevel: 60, parent: 'luchador', stats: { fue: 2, des: 2, vit: 1 }, desc: 'Versátil.', branches: ['campeon_eterno'] },
  ermitano: { name: 'Ermitaño', iconRef: 'class.ermitano', tier: 3, reqLevel: 60, parent: 'asceta', stats: { vol: 4, vit: 1 }, desc: 'Casi inmortal.', branches: ['uno_vacio'] },
  iluminado: { name: 'Iluminado', iconRef: 'class.iluminado', tier: 3, reqLevel: 60, parent: 'asceta', stats: { vol: 3, int: 2 }, desc: 'Ki ofensivo y defensivo.', branches: ['trascendido'] },
  maestro_dragon: { name: 'Maestro del Dragón', iconRef: 'class.maestro_dragon', tier: 3, reqLevel: 60, parent: 'artista_marcial', stats: { des: 2, int: 2, fue: 1 }, desc: 'Ataques elementales.', branches: ['dragon_ascendido'] },
  maestro_tigre: { name: 'Maestro del Tigre', iconRef: 'class.maestro_tigre', tier: 3, reqLevel: 60, parent: 'artista_marcial', stats: { fue: 3, des: 2 }, desc: 'Fuerza bruta.', branches: ['tigre_blanco'] },
  puno_cielo: { name: 'Puño del Cielo', iconRef: 'class.puno_cielo', tier: 4, reqLevel: 100, parent: 'maestro_puno', stats: { fue: 5, des: 1 }, desc: 'Rompe el cielo.' },
  campeon_eterno: { name: 'Campeón Eterno', iconRef: 'class.campeon_eterno', tier: 4, reqLevel: 100, parent: 'gladiador', stats: { fue: 3, des: 2, vit: 1 }, desc: 'Nunca derrotado.' },
  uno_vacio: { name: 'Uno con el Vacío', iconRef: 'class.uno_vacio', tier: 4, reqLevel: 100, parent: 'ermitano', stats: { vol: 5, vit: 1 }, desc: 'Trasciende lo físico.' },
  trascendido: { name: 'Trascendido', iconRef: 'class.trascendido', tier: 4, reqLevel: 100, parent: 'iluminado', stats: { vol: 4, int: 2 }, desc: 'Más allá.' },
  dragon_ascendido: { name: 'Dragón Ascendido', iconRef: 'class.dragon_ascendido', tier: 4, reqLevel: 100, parent: 'maestro_dragon', stats: { des: 3, int: 2, fue: 1 }, desc: 'El dragón interior.' },
  tigre_blanco: { name: 'Tigre Blanco', iconRef: 'class.tigre_blanco', tier: 4, reqLevel: 100, parent: 'maestro_tigre', stats: { fue: 4, des: 2 }, desc: 'Rey de las bestias.' },

  // ══════════ HIDDEN CLASSES ══════════
  ninja: { name: 'Ninja', iconRef: 'class.ninja', tier: 4, reqLevel: 60, hidden: true, stats: { des: 3, vol: 2, int: 1 }, desc: 'Híbrido Pícaro/Monje.' },
  samurai: { name: 'Samurái', iconRef: 'class.samurai', tier: 4, reqLevel: 60, hidden: true, stats: { fue: 3, vol: 2, des: 1 }, desc: 'Híbrido Guerrero/Monje.' },
  bardo: { name: 'Bardo', iconRef: 'class.bardo', tier: 4, reqLevel: 60, hidden: true, stats: { pre: 4, vol: 2 }, desc: 'Híbrido Clérigo/Pícaro.' },
  alquimista: { name: 'Alquimista', iconRef: 'class.alquimista', tier: 4, reqLevel: 60, hidden: true, stats: { int: 3, des: 2, vol: 1 }, desc: 'Crafteo y pociones.' }
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
