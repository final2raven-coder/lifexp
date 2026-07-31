// LifeXP Expansion 1 - Early items
// Integracion: cargar despues de items.js.

const EXPANSION_ITEMS_V1 = {
  escudo_cotidiano:{id:'escudo_cotidiano',name:'Escudo Cotidiano',type:'armor',rarity:'common',icon:'SHIELD',desc:'Una defensa sencilla, forjada con constancia.',stats:{vit:2,vol:1},value:24,themes:['casa','gestiones']},
  botas_sendero:{id:'botas_sendero',name:'Botas del Sendero',type:'armor',rarity:'uncommon',icon:'BOOTS',desc:'Cada paso abre una posibilidad.',stats:{des:3,vit:1},value:55,themes:['exploracion','cuerpo']},
  anillo_constancia:{id:'anillo_constancia',name:'Anillo de Constancia',type:'accessory',rarity:'uncommon',icon:'RING',desc:'Recuerda que volver tambien es avanzar.',stats:{vol:3,int:1},value:60,themes:['mente','destino']},
  broche_vinculo:{id:'broche_vinculo',name:'Broche del Vinculo',type:'accessory',rarity:'uncommon',icon:'CLIP',desc:'Une intencion y presencia.',stats:{pre:3,vol:1},value:60,themes:['alianzas','social']},
  mapa_rutas_cercanas:{id:'mapa_rutas_cercanas',name:'Mapa de Rutas Cercanas',type:'material',rarity:'common',icon:'MAP',desc:'Marca caminos que todavia no has probado.',value:12,themes:['exploracion']},
  racion_serena:{id:'racion_serena',name:'Racion Serena',type:'consumable',rarity:'common',icon:'BENTO',desc:'Restaura 25 HP y 10 SP.',value:14,themes:['fuego_comida'],effect:{heal:25,restoreSp:10}},
  sello_preparacion:{id:'sello_preparacion',name:'Sello de Preparacion',type:'material',rarity:'uncommon',icon:'BOOKMARK',desc:'Prueba de haber dejado el siguiente paso listo.',value:35,themes:['gestiones','casa']},
  claridad_practica:{id:'claridad_practica',name:'Claridad Practica',type:'artifact',rarity:'rare',icon:'BRIGHT',desc:'Convierte planes pequenos en movimiento.',stats:{int:3,vol:3},value:160,themes:['destino'],passive:'Planificacion: +5% XP en tareas de Gestiones'},
  talisman_oriental_early:{id:'talisman_oriental_early',name:'Taliman de Practica',type:'accessory',rarity:'common',icon:'TALISMAN',desc:'Un recordatorio para volver a intentarlo.',stats:{int:2,vol:1},value:25,themes:['oriente']},
  fragmento_historia:{id:'fragmento_historia',name:'Fragmento de Historia',type:'material',rarity:'common',icon:'BOOK',desc:'Una idea que pide ser desarrollada.',value:10,themes:['creacion']},
  sello_eficiencia:{id:'sello_eficiencia',name:'Sello de Eficiencia',type:'accessory',rarity:'rare',icon:'CHECK',desc:'Premia los sistemas que evitan repetir trabajo.',stats:{int:4,vol:2},value:100,themes:['gestiones']}
};

const EXPANSION_DROP_TABLES_V1 = {
  destino:['claridad_practica','anillo_constancia'],
  exploracion:['mapa_rutas_cercanas','botas_sendero'],
  alianzas:['broche_vinculo'],
  oriente:['talisman_oriental_early'],
  creacion:['fragmento_historia'],
  gestiones:['sello_eficiencia','sello_preparacion'],
  casa:['escudo_cotidiano','sello_preparacion'],
  fuego_comida:['racion_serena']
};

function installExpansionItems() {
  if (installExpansionItems._installed) return;
  installExpansionItems._installed = true;
  Object.assign(ITEMS, EXPANSION_ITEMS_V1);
  Object.assign(DROP_TABLES, EXPANSION_DROP_TABLES_V1);
}
