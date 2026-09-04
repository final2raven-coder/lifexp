// LifeXP Expansion 1 - Early items
// Integracion: cargar despues de items.js.

const EXPANSION_ITEMS_V1 = {
  escudo_cotidiano:{id:'escudo_cotidiano',name:'Everyday Shield',type:'armor',rarity:'common',icon:'SHIELD',desc:'A simple defense, forged through consistency.',stats:{vit:2,vol:1},value:24,themes:['casa','gestiones']},
  botas_sendero:{id:'botas_sendero',name:'Pathway Boots',type:'armor',rarity:'uncommon',icon:'BOOTS',desc:'Every step opens a possibility.',stats:{des:3,vit:1},value:55,themes:['exploracion','cuerpo']},
  anillo_constancia:{id:'anillo_constancia',name:'Constancy Ring',type:'accessory',rarity:'uncommon',icon:'RING',desc:'A reminder that returning is also progress.',stats:{vol:3,int:1},value:60,themes:['mente','destino']},
  broche_vinculo:{id:'broche_vinculo',name:'Bond Brooch',type:'accessory',rarity:'uncommon',icon:'CLIP',desc:'It joins intention and presence.',stats:{pre:3,vol:1},value:60,themes:['alianzas','social']},
  mapa_rutas_cercanas:{id:'mapa_rutas_cercanas',name:'Nearby Routes Map',type:'material',rarity:'common',icon:'MAP',desc:'Marks paths you have not tried yet.',value:12,themes:['exploracion']},
  racion_serena:{id:'racion_serena',name:'Serene Ration',type:'consumable',rarity:'common',icon:'BENTO',desc:'Restores 25 HP and 10 SP.',value:14,themes:['fuego_comida'],effect:{heal:25,restoreSp:10}},
  sello_preparacion:{id:'sello_preparacion',name:'Preparation Seal',type:'material',rarity:'uncommon',icon:'BOOKMARK',desc:'Proof that you have left the next step ready.',value:35,themes:['gestiones','casa']},
  claridad_practica:{id:'claridad_practica',name:'Practical Clarity',type:'artifact',rarity:'rare',icon:'BRIGHT',desc:'Turns small plans into movement.',stats:{int:3,vol:3},value:160,themes:['destino'],passive:'Planning: +5% XP on Admin tasks'},
  talisman_oriental_early:{id:'talisman_oriental_early',name:'Practice Talisman',type:'accessory',rarity:'common',icon:'TALISMAN',desc:'A reminder to try again.',stats:{int:2,vol:1},value:25,themes:['oriente']},
  fragmento_historia:{id:'fragmento_historia',name:'History Fragment',type:'material',rarity:'common',icon:'BOOK',desc:'An idea asking to be developed.',value:10,themes:['creacion']},
  sello_eficiencia:{id:'sello_eficiencia',name:'Efficiency Seal',type:'accessory',rarity:'rare',icon:'CHECK',desc:'Rewards systems that prevent repeated work.',stats:{int:4,vol:2},value:100,themes:['gestiones']},

  // ---- Items created for DT-13/DT-02 drop normalisation (2026-08-11) ----
  // agua_quimicos / agua
  esencia_purificadora:{id:'esencia_purificadora',name:'Voidwater Extract',type:'material',rarity:'uncommon',icon:'WATER',desc:'Distilled from a spring that runs beneath a ruined alchemist\'s tower. It dissolves impurities and leaves behind a faint blue residue.',value:20,themes:['agua_quimicos','agua']},
  cristal_limpieza:{id:'cristal_limpieza',name:'Scour Shard',type:'material',rarity:'common',icon:'GEM',desc:'A fragment of crystallised reagent. Alchemists use it to strip residue from their equipment. It crumbles after a single use.',value:8,themes:['agua_quimicos']},
  gota_agua_pura:{id:'gota_agua_pura',name:'Stillwater Bead',type:'material',rarity:'common',icon:'WATER',desc:'A single drop of water from a sealed underground lake. It has never touched air before. Collectors pay well for it.',value:6,themes:['agua','agua_quimicos']},
  esencia_limpieza:{id:'esencia_limpieza',name:'Reagent Dew',type:'material',rarity:'common',icon:'FLASK',desc:'Condensed from the exhaust of an elemental water reactor. Smells faintly of copper and rain.',value:7,themes:['agua','agua_quimicos']},

  // fuego / fuego_comida
  grasa_fuego:{id:'grasa_fuego',name:'Salamander Fat',type:'material',rarity:'common',icon:'FIRE',desc:'Rendered from a fire salamander. Burns at a steady, controllable temperature. Prized by forge-cooks and weaponsmiths alike.',value:9,themes:['fuego','fuego_comida']},
  espatula_encantada:{id:'espatula_encantada',name:'Hearthwitch\'s Turner',type:'material',rarity:'uncommon',icon:'TOOL',desc:'A flat iron tool bound with a minor heat-ward. It never burns the hand that holds it, and it always knows when to flip.',value:22,themes:['fuego_comida','casa']},
  llama_culinaria:{id:'llama_culinaria',name:'Ember Wisp',type:'material',rarity:'uncommon',icon:'FIRE',desc:'A small fire spirit that settled into a cooking hearth and refused to leave. It produces perfect, even heat and occasionally hums.',value:18,themes:['fuego_comida','fuego']},
  gema_fuego_menor:{id:'gema_fuego_menor',name:'Cinder Shard',type:'material',rarity:'common',icon:'GEM',desc:'A fragment of volcanic glass with an ember sealed inside. The ember has been burning for forty years and shows no sign of stopping.',value:12,themes:['fuego','fuego_comida']},
  receta_secreta:{id:'receta_secreta',name:'Charred Formulary',type:'material',rarity:'uncommon',icon:'SCROLL',desc:'A page torn from a fire mage\'s recipe book. The margins are scorched but the instructions are legible. Mostly.',value:28,themes:['fuego_comida']},

  // sol_viento / luz
  brisa_atrapada:{id:'brisa_atrapada',name:'Bottled Gale',type:'material',rarity:'common',icon:'WIND',desc:'A wind spirit caught mid-flight and sealed in green glass. It rattles the cork when it wants to be released.',value:10,themes:['sol_viento']},
  luz_atrapada:{id:'luz_atrapada',name:'Noon Sliver',type:'material',rarity:'common',icon:'SUN',desc:'A thin wedge of solidified midday light. It stays warm in the dark and casts no shadow of its own.',value:11,themes:['sol_viento','luz']},

  // descanso
  pluma_sueno:{id:'pluma_sueno',name:'Lullwing Feather',type:'material',rarity:'uncommon',icon:'FEATHER',desc:'Shed by a Lullwing — a bird that exists only between waking and sleep. Finding one means you were almost dreaming.',value:25,themes:['descanso','mente']},
  esencia_descanso:{id:'esencia_descanso',name:'Moonpool Distillate',type:'material',rarity:'common',icon:'LIFE',desc:'Water drawn from a pool that only forms under a full moon. It smells of cold stone and induces a deep, dreamless calm.',value:14,themes:['descanso']},
  bendicion_descanso:{id:'bendicion_descanso',name:'Nightwarden Draught',type:'consumable',rarity:'uncommon',icon:'POTION',desc:'Brewed by the Nightwardens — an order that guards sleeping cities. Restores 40 HP and clears Fatigue.',value:32,themes:['descanso'],effect:{heal:40,removeFatigue:true}},
  polvo_sueno:{id:'polvo_sueno',name:'Dusk Pollen',type:'material',rarity:'common',icon:'DUST',desc:'Gathered from flowers that only bloom at twilight. Inhaled, it slows the mind to a comfortable drift.',value:9,themes:['descanso','mente']},
  cristal_tranquilidad:{id:'cristal_tranquilidad',name:'Stillstone',type:'accessory',rarity:'uncommon',icon:'GEM',desc:'A pale blue stone found only in caves where no wind has ever reached. It absorbs ambient noise and stays cold regardless of temperature.',stats:{vol:2,int:1},value:45,themes:['descanso','mente']},

  // hallazgos
  prenda_olvidada:{id:'prenda_olvidada',name:'Wanderer\'s Remnant',type:'material',rarity:'common',icon:'BOX',desc:'A piece of clothing left in a place no one visits anymore. The fabric is intact. The owner did not come back for it.',value:5,themes:['hallazgos']},

  // naturaleza
  rocio_matutino:{id:'rocio_matutino',name:'Firstlight Dew',type:'material',rarity:'common',icon:'WATER',desc:'Collected from leaves before sunrise, before the world has fully decided to wake. It evaporates if exposed to direct sunlight.',value:8,themes:['naturaleza','agua']},
  espiritu_jardin:{id:'espiritu_jardin',name:'Rootbound Wisp',type:'material',rarity:'uncommon',icon:'LEAF',desc:'A minor nature spirit that chose to inhabit a well-tended garden rather than a forest. It is smaller than most, but more particular.',value:30,themes:['naturaleza']},
  flor_luminosa:{id:'flor_luminosa',name:'Ghostbloom',type:'material',rarity:'uncommon',icon:'LEAF',desc:'A flower that produces its own faint light. It does not need soil, sunlight, or water. No one has determined what it does need.',value:26,themes:['naturaleza','luz']},
  paz_interior:{id:'paz_interior',name:'Heartwood Resin',type:'material',rarity:'uncommon',icon:'ORB',desc:'Sap from the oldest tree in a forest that has never been cut. It hardens into amber and holds a stillness that does not belong to the world outside.',value:35,themes:['naturaleza','mente']},
  hoja_calma:{id:'hoja_calma',name:'Windstill Leaf',type:'material',rarity:'common',icon:'LEAF',desc:'A leaf from a tree that grows in the eye of a permanent storm. It does not move. It has never moved.',value:10,themes:['naturaleza']},
  reconexion_natural:{id:'reconexion_natural',name:'Mycelium Thread',type:'material',rarity:'uncommon',icon:'TREE',desc:'A single strand from the underground network that connects the roots of an old forest. It carries signals no one has learned to read.',value:28,themes:['naturaleza']},
  espiritu_libre:{id:'espiritu_libre',name:'Untethered Wisp',type:'material',rarity:'uncommon',icon:'FEATHER',desc:'A nature spirit that refused every forest, every garden, every grove. It drifts. It does not answer to anyone.',value:22,themes:['naturaleza','sol_viento']},

  // hielo
  escarcha_eterna:{id:'escarcha_eterna',name:'Undying Rime',type:'material',rarity:'uncommon',icon:'ICE',desc:'A sliver of ice from a glacier that predates the current age. It has never melted. Scholars argue about why.',value:32,themes:['hielo']},
  cristal_hielo_puro:{id:'cristal_hielo_puro',name:'Glacial Core',type:'material',rarity:'rare',icon:'ICE',desc:'A perfectly transparent crystal formed at the centre of an ancient glacier. It resonates at a frequency just below hearing.',value:55,themes:['hielo']},

  // exploracion
  mapa_zona:{id:'mapa_zona',name:'Scout Rubbing',type:'material',rarity:'common',icon:'MAP',desc:'A charcoal impression of a carved stone marker left by an earlier expedition. The original marker has since been buried.',value:8,themes:['exploracion']},
  piedra_camino:{id:'piedra_camino',name:'Waymarker Stone',type:'material',rarity:'common',icon:'SHELL',desc:'A flat stone worn smooth by the road. Travelers notch them to count the days. This one has seven notches and then stops.',value:5,themes:['exploracion']},
  amuleto_explorador:{id:'amuleto_explorador',name:'Pathfinder\'s Compass Rose',type:'accessory',rarity:'uncommon',icon:'RING',desc:'A small medallion engraved with a compass rose that points toward the nearest unexplored territory rather than north.',stats:{des:2,vit:1},value:52,themes:['exploracion']},

  // mente
  orbe_claridad:{id:'orbe_claridad',name:'Lucid Sphere',type:'material',rarity:'uncommon',icon:'ORB',desc:'A glass orb filled with a liquid that has no name. When held, nearby thoughts become easier to separate from one another.',value:30,themes:['mente']},
  incienso_mistico:{id:'incienso_mistico',name:'Mindveil Smoke',type:'consumable',rarity:'common',icon:'DUST',desc:'Burned by seers before entering a trance. The smoke does not rise — it spreads horizontally and lingers at eye level. +2 Intellect for 1 combat.',value:15,themes:['mente'],effect:{buffInt:2,duration:1}},
  foco_interior:{id:'foco_interior',name:'Anchor Shard',type:'material',rarity:'uncommon',icon:'ORB',desc:'A fragment of obsidian carried by monks who practice thought-stilling. It is heavy for its size. That is the point.',value:28,themes:['mente']},
  mente_cristal:{id:'mente_cristal',name:'Cognite',type:'material',rarity:'rare',icon:'GEM',desc:'A mineral that forms only in places of prolonged intense thought — libraries, war rooms, old laboratories. This one is unusually large.',value:60,themes:['mente']},
  pagina_reflexion:{id:'pagina_reflexion',name:'Mirror Vellum',type:'material',rarity:'common',icon:'PAGE',desc:'A page treated with a reagent that makes it reflect the reader\'s thoughts back as text. Most people find the results uncomfortable.',value:8,themes:['mente','conocimiento']},
  tinta_pensamiento:{id:'tinta_pensamiento',name:'Ideograph Ink',type:'material',rarity:'uncommon',icon:'INK',desc:'An ink that writes what the author means, not what they say. Scribes who use it report that the process is exhausting and accurate.',value:25,themes:['mente','conocimiento']},
  claridad_mental:{id:'claridad_mental',name:'Clearwater Lens',type:'material',rarity:'uncommon',icon:'ORB',desc:'A thin disc of ground crystal worn over one eye by scholars of the Clarity Order. Everything seen through it appears slightly more true.',value:30,themes:['mente']},

  // agua_profunda
  escama_brillante:{id:'escama_brillante',name:'Abyssal Scale',type:'material',rarity:'uncommon',icon:'SCALE',desc:'A scale from a creature that lives below the light threshold. It catches light from sources that are not present and refracts it into colours with no names.',value:30,themes:['agua_profunda']},
  coral_magico:{id:'coral_magico',name:'Resonance Coral',type:'material',rarity:'uncommon',icon:'SHELL',desc:'A piece of coral that grows toward sound instead of light. It has oriented itself toward something no one else can hear.',value:25,themes:['agua_profunda']},
  tridente_menor:{id:'tridente_menor',name:'Tidecaller\'s Prong',type:'weapon',rarity:'uncommon',icon:'TRIDENT',desc:'A short trident used by coastal militia to drive off sea creatures. The tines are still sharp. The wielder is not accounted for.',stats:{fue:2,des:2},value:65,themes:['agua_profunda']},
  bendicion_mar:{id:'bendicion_mar',name:'Brine Benediction',type:'consumable',rarity:'uncommon',icon:'WATER',desc:'A flask of seawater blessed by a tide-priest at the moment of high water. Restores 35 HP. Tastes of salt and old stone.',value:28,themes:['agua_profunda'],effect:{heal:35}},

  // comercio / gestiones / oro
  bolsa_oro_grande:{id:'bolsa_oro_grande',name:'Guild Purse',type:'material',rarity:'uncommon',icon:'GOLD',desc:'A heavy leather purse stamped with the seal of a merchant guild that dissolved three decades ago. The coins inside are still valid.',value:40,themes:['comercio','hallazgos']},
  lingote_oro:{id:'lingote_oro',name:'Assay Ingot',type:'material',rarity:'rare',icon:'GOLD',desc:'A bar of gold stamped with a mint mark from a city that no longer exists. Assayers still accept it. They do not ask questions.',value:80,themes:['comercio']},
  sabiduria_fiscal:{id:'sabiduria_fiscal',name:'Taxmaster\'s Ledger Page',type:'material',rarity:'uncommon',icon:'SCROLL',desc:'A single page torn from the ledger of a legendary taxmaster who never lost a case. The numbers on it are not from this kingdom.',value:35,themes:['gestiones','comercio']},
  corona_contribuyente:{id:'corona_contribuyente',name:'Tithe Crown',type:'material',rarity:'uncommon',icon:'CROWN',desc:'A small iron crown awarded by an ancient city to citizens who paid in full and on time. It is heavier than it looks. The city is gone.',value:30,themes:['gestiones']},
  gema_menor:{id:'gema_menor',name:'Rough Tourmaline',type:'material',rarity:'common',icon:'GEM',desc:'An uncut gemstone pulled from a riverbed. The colour shifts depending on the angle. Worth something to the right cutter.',value:15,themes:['hallazgos','comercio']},
  ojo_comerciante:{id:'ojo_comerciante',name:'Assessor\'s Monocle',type:'accessory',rarity:'uncommon',icon:'GEM',desc:'A single-lens instrument used by guild assessors to detect counterfeit goods. It also makes prices easier to read in dim light.',stats:{int:2,pre:1},value:55,themes:['comercio','gestiones']},

  // conocimiento
  cristal_memoria:{id:'cristal_memoria',name:'Mnemite',type:'material',rarity:'uncommon',icon:'GEM',desc:'A mineral that absorbs ambient thought over decades. Scholars use them as external memory. This one holds something from last week that you have not thought of yet.',value:35,themes:['conocimiento','mente']},
  pergamino_blanco:{id:'pergamino_blanco',name:'Prepared Vellum',type:'material',rarity:'common',icon:'SCROLL',desc:'A sheet of vellum treated to accept any ink without bleeding. It has been waiting for something worth writing.',value:6,themes:['conocimiento']},
  biblioteca_personal:{id:'biblioteca_personal',name:'Scholar\'s Codex',type:'material',rarity:'rare',icon:'BOOK',desc:'A compact volume of cross-referenced notes, marginalia, and corrections. It took years to build. It is not finished.',value:70,themes:['conocimiento']},
  mensaje_importante:{id:'mensaje_importante',name:'Sealed Dispatch',type:'material',rarity:'common',icon:'SCROLL',desc:'A letter sealed with wax that is still warm. The seal belongs to a courier order known for never losing a message. This one has not been delivered.',value:8,themes:['comercio','gestiones']},
  llave_olvidada:{id:'llave_olvidada',name:'Orphaned Key',type:'material',rarity:'common',icon:'KEY',desc:'A key with no known lock. The teeth are unusual. Someone had it made for a specific purpose and then lost track of both.',value:10,themes:['hallazgos','comercio']},
  pergamino_planificacion:{id:'pergamino_planificacion',name:'Campaign Scroll',type:'material',rarity:'uncommon',icon:'SCROLL',desc:'A scroll covered in overlapping timelines, supply routes, and crossed-out contingencies. Whoever drew this was preparing for something large.',value:22,themes:['conocimiento','gestiones']},
  agenda_encantada:{id:'agenda_encantada',name:'Prescient Folio',type:'material',rarity:'uncommon',icon:'BOOK',desc:'A bound folio that writes tomorrow\'s entries before you do. The handwriting is yours. The events are close but not quite right.',value:30,themes:['conocimiento','gestiones']},
  pergamino_hechizo:{id:'pergamino_hechizo',name:'Fading Cantrip',type:'material',rarity:'uncommon',icon:'SCROLL',desc:'A scroll bearing a single spell written in careful, diminishing ink. The last line is almost gone. It still works, but only once.',value:28,themes:['conocimiento']},
  conocimiento_antiguo:{id:'conocimiento_antiguo',name:'Recovered Folio',type:'material',rarity:'rare',icon:'BOOK',desc:'A folio of knowledge that was nearly lost — water-damaged, partially burned, and then painstakingly restored. Someone decided it was worth saving.',value:65,themes:['conocimiento']},
  grimorio_menor:{id:'grimorio_menor',name:'Apprentice Grimoire',type:'material',rarity:'uncommon',icon:'BOOK',desc:'A small spellbook filled to two-thirds capacity. The remaining pages are blank and waiting. The previous owner left no forwarding address.',value:32,themes:['conocimiento']},
  sabiduria_acumulada:{id:'sabiduria_acumulada',name:'Annotated Compendium',type:'material',rarity:'rare',icon:'BOOK',desc:'A reference volume so heavily annotated that the original text is barely visible. Three generations of scholars have added to it. None of them agreed.',value:75,themes:['conocimiento','mente']},

  // social / alianzas (vinculo / amistad themes)
  recuerdo_especial:{id:'recuerdo_especial',name:'Keepsake Shard',type:'material',rarity:'uncommon',icon:'TOKEN',desc:'A fragment of something that was once whole — a cup, a tile, a mirror. The other pieces are with someone else. Both parties kept one.',value:30,themes:['social','alianzas']},
  lazo_conexion:{id:'lazo_conexion',name:'Binding Cord',type:'material',rarity:'uncommon',icon:'CLIP',desc:'A braided cord used in a pact ceremony. It ties two things together without restricting either. The knot cannot be undone by one person alone.',value:28,themes:['social','alianzas']},
  anillo_vinculo:{id:'anillo_vinculo',name:'Covenant Band',type:'accessory',rarity:'uncommon',icon:'RING',desc:'A plain ring exchanged as a promise between two people who chose each other deliberately. It fits both of them.',stats:{pre:2,vol:1},value:50,themes:['social','alianzas']},
  flor_eterna:{id:'flor_eterna',name:'Undying Bloom',type:'material',rarity:'uncommon',icon:'LEAF',desc:'A flower preserved by a minor enchantment at the moment of gifting. It does not wilt. It smells exactly as it did the day it was picked.',value:25,themes:['social']},
  sello_hermandad:{id:'sello_hermandad',name:'Compact Seal',type:'material',rarity:'uncommon',icon:'SEAL',desc:'A wax seal pressed between two people who chose each other as kin. The design is unique to the pair. No one else can replicate it.',value:30,themes:['social','alianzas']},
  bendicion_familiar:{id:'bendicion_familiar',name:'Hearthstone Draught',type:'consumable',rarity:'uncommon',icon:'POTION',desc:'A remedy passed down through families rather than sold. Restores 30 HP. The taste is specific and impossible to describe to someone who did not grow up with it.',value:22,themes:['social'],effect:{heal:30}},
  lazo_sangre:{id:'lazo_sangre',name:'Bloodline Token',type:'material',rarity:'rare',icon:'TOKEN',desc:'A token that carries the weight of shared history — not chosen, but inherited. It is heavier than it looks and harder to put down.',value:55,themes:['social','alianzas']},
  recuerdo_aventura:{id:'recuerdo_aventura',name:'Shared Relic',type:'material',rarity:'uncommon',icon:'TOKEN',desc:'A small object that holds the shape of a story two people lived together. Neither could explain it to a stranger. Neither would want to.',value:28,themes:['social','alianzas']},
  corona_organizador:{id:'corona_organizador',name:'Warden\'s Circlet',type:'material',rarity:'uncommon',icon:'CROWN',desc:'A circlet awarded to whoever made the plan actually happen — not who proposed it, but who saw it through. It is dented on one side.',value:25,themes:['social','gestiones']},

  // creacion
  pluma_creador:{id:'pluma_creador',name:'Stormscribe Quill',type:'material',rarity:'uncommon',icon:'FEATHER',desc:'A quill taken from a storm-bird mid-flight. It writes faster than thought and occasionally continues after the hand has stopped.',value:30,themes:['creacion','conocimiento']},
  capitulo_terminado:{id:'capitulo_terminado',name:'Sealed Manuscript',type:'material',rarity:'uncommon',icon:'BOOK',desc:'A section of a larger work, complete in itself and bound separately. The wax seal means the author considered it finished. That is rare.',value:28,themes:['creacion']},

  // oriente
  caracter_antiguo:{id:'caracter_antiguo',name:'Archaic Glyph',type:'material',rarity:'uncommon',icon:'PAGE',desc:'A single character carved in a script that predates the current writing system by several centuries. Scholars disagree on its meaning. They agree it is important.',value:25,themes:['oriente','conocimiento']},
  jade_menor:{id:'jade_menor',name:'Unpolished Jade',type:'material',rarity:'common',icon:'JADE',desc:'A small piece of jade still rough from the quarry. The colour is good. A skilled carver would know what to do with it.',value:12,themes:['oriente']},
  pergamino_sabiduria:{id:'pergamino_sabiduria',name:'Doctrine Scroll',type:'material',rarity:'uncommon',icon:'SCROLL',desc:'A scroll that teaches one principle, stated once, clearly, without elaboration. The school that produced it no longer exists.',value:30,themes:['oriente','conocimiento']},

  // destino
  vision_futuro:{id:'vision_futuro',name:'Unwritten Shard',type:'material',rarity:'rare',icon:'ORB',desc:'A fragment of a prophetic mirror that shattered before the vision was complete. It shows something that has not happened yet. The image is unclear but urgent.',value:70,themes:['destino','mente']},
  bendicion_oraculo:{id:'bendicion_oraculo',name:'Oracle\'s Preparation',type:'consumable',rarity:'rare',icon:'POTION',desc:'A compound taken by seers before a reading. It sharpens the mind and steadies the will. +5 Intellect and +5 Willpower for 1 combat.',value:90,themes:['destino'],effect:{buffInt:5,buffVol:5,duration:1}},
  fragmento_destino:{id:'fragmento_destino',name:'Fate Splinter',type:'material',rarity:'uncommon',icon:'ORB',desc:'A piece of something larger that has not been assembled yet. It fits nothing currently in existence. That will change.',value:40,themes:['destino']},
  profecia:{id:'profecia',name:'Undated Prophecy',type:'material',rarity:'rare',icon:'SCROLL',desc:'A text that describes a specific event in precise detail. The date is missing. The event has not happened yet, or it already has.',value:65,themes:['destino','conocimiento']},
  // ---- Additional items for missing drop references ----
  ingrediente_especial:{id:'ingrediente_especial',name:'Alchemist\'s Curiosity',type:'material',rarity:'uncommon',icon:'FLASK',desc:'An ingredient with no established use. Every alchemist who examines it has a different theory. All of them want to keep it.',value:22,themes:['fuego_comida','comercio']},
  hidromiel_camaraderia:{id:'hidromiel_camaraderia',name:'Hearthfire Mead',type:'consumable',rarity:'uncommon',icon:'MEAD',desc:'Brewed in batches large enough to share. The recipe requires at least two people to make it correctly. Restores 25 HP and +10% Presence for 1 combat.',value:30,themes:['social','alianzas'],effect:{heal:25,buffPre:10,duration:1}},

};

const EXPANSION_DROP_TABLES_V1 = {
  destino:['claridad_practica','anillo_constancia','vision_futuro','fragmento_destino','bendicion_oraculo','profecia'],
  exploracion:['mapa_rutas_cercanas','botas_sendero','mapa_zona','piedra_camino','amuleto_explorador'],
  alianzas:['broche_vinculo','recuerdo_especial','lazo_conexion','sello_hermandad','lazo_sangre','recuerdo_aventura'],
  oriente:['talisman_oriental_early','caracter_antiguo','jade_menor','pergamino_sabiduria'],
  creacion:['fragmento_historia','pluma_creador','capitulo_terminado'],
  gestiones:['sello_eficiencia','sello_preparacion','sabiduria_fiscal','corona_contribuyente','ojo_comerciante','pergamino_planificacion','agenda_encantada','corona_organizador'],
  casa:['escudo_cotidiano','sello_preparacion','espatula_encantada'],
  fuego_comida:['racion_serena','grasa_fuego','llama_culinaria','gema_fuego_menor','receta_secreta'],
  agua_quimicos:['esencia_purificadora','cristal_limpieza','gota_agua_pura','esencia_limpieza'],
  agua:['gota_agua_pura','esencia_limpieza','rocio_matutino'],
  sol_viento:['brisa_atrapada','luz_atrapada','espiritu_libre'],
  luz:['luz_atrapada','flor_luminosa'],
  descanso:['pluma_sueno','esencia_descanso','bendicion_descanso','polvo_sueno','cristal_tranquilidad'],
  hallazgos:['prenda_olvidada','gema_menor','bolsa_oro_grande','llave_olvidada'],
  naturaleza:['rocio_matutino','espiritu_jardin','flor_luminosa','paz_interior','hoja_calma','reconexion_natural','espiritu_libre'],
  hielo:['escarcha_eterna','cristal_hielo_puro'],
  mente:['orbe_claridad','foco_interior','mente_cristal','pagina_reflexion','tinta_pensamiento','claridad_mental','cristal_memoria','pluma_sueno','polvo_sueno','paz_interior'],
  agua_profunda:['escama_brillante','coral_magico','tridente_menor','bendicion_mar'],
  comercio:['bolsa_oro_grande','lingote_oro','sabiduria_fiscal','gema_menor','ojo_comerciante','mensaje_importante','llave_olvidada'],
  conocimiento:['cristal_memoria','pergamino_blanco','biblioteca_personal','pergamino_planificacion','agenda_encantada','pergamino_hechizo','conocimiento_antiguo','grimorio_menor','sabiduria_acumulada'],
  social:['recuerdo_especial','lazo_conexion','anillo_vinculo','flor_eterna','sello_hermandad','bendicion_familiar','lazo_sangre','recuerdo_aventura','corona_organizador'],
  fuego:['grasa_fuego','llama_culinaria','gema_fuego_menor'],
  amistad:['token_amistad','hidromiel_camaraderia','recuerdo_aventura','sello_hermandad'],
  vinculo:['anillo_vinculo','lazo_conexion','flor_eterna','lazo_sangre','bendicion_familiar'],
  oro:['bolsa_oro_grande','lingote_oro','gema_menor','moneda_oro'],
};

function installExpansionItems() {
  installExpansionItems._installed = true;
  Object.assign(ITEMS, EXPANSION_ITEMS_V1);
  // Merge expansion drop tables into existing DROP_TABLES (additive, per-theme)
  for (const [theme, pool] of Object.entries(EXPANSION_DROP_TABLES_V1)) {
    if (!DROP_TABLES[theme]) {
      DROP_TABLES[theme] = [...pool];
    } else {
      const existing = new Set(DROP_TABLES[theme]);
      for (const id of pool) if (!existing.has(id)) DROP_TABLES[theme].push(id);
    }
  }
}
