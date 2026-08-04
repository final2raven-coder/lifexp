// LifeXP Expansion 1 - Early encounters
// Integracion: cargar despues de enemies.js y items.js.

const EXPANSION_ENEMIES_V1 = {
  eco_inquieto:{id:'eco_inquieto',name:'Eco Inquieto',icon:'\ud83e\udeba',type:'common',level:1,hp:32,fue:4,vit:4,des:9,int:7,vol:8,pre:2,xp:18,gold:6,skills:[{id:'susurro',name:'Susurro',type:'attack',power:9,damageType:'magical'}],drops:[{itemId:'fragmento_historia',chance:0.25}],themes:['mente','destino']},
  duende_del_desorden:{id:'duende_del_desorden',name:'Duende del Desorden',icon:'\ud83e\uddf9',type:'common',level:2,hp:42,fue:8,vit:6,des:9,int:4,vol:5,pre:3,xp:22,gold:8,skills:[{id:'trasto',name:'Lanzar Trasto',type:'attack',power:11}],drops:[{itemId:'sello_preparacion',chance:0.18},{itemId:'moneda_antigua',chance:0.3}],themes:['casa','hallazgos']},
  cobrador_de_niebla:{id:'cobrador_de_niebla',name:'Cobrador de Niebla',icon:'\ud83d\udce8',type:'common',level:3,hp:48,fue:7,vit:7,des:10,int:10,vol:7,pre:8,xp:26,gold:12,skills:[{id:'recordatorio',name:'Recordatorio Incomodo',type:'attack',power:13,damageType:'magical'}],drops:[{itemId:'moneda_oro',chance:0.22},{itemId:'sello_eficiencia',chance:0.08}],themes:['gestiones','oro_comercio']},
  imitador_social:{id:'imitador_social',name:'Imitador Social',icon:'\ud83c\udfad',type:'common',level:4,hp:55,fue:8,vit:8,des:13,int:9,vol:10,pre:14,xp:32,gold:16,skills:[{id:'duda',name:'Sembrar Duda',type:'attack',power:15,damageType:'magical'}],drops:[{itemId:'broche_vinculo',chance:0.12},{itemId:'token_amistad',chance:0.25}],themes:['alianzas','social']},
  guardia_del_umbral:{id:'guardia_del_umbral',name:'Guardia del Umbral',icon:'\ud83d\udeaa',type:'elite',level:8,hp:150,fue:16,vit:16,des:10,int:9,vol:14,pre:8,xp:95,gold:42,skills:[{id:'bloqueo',name:'Bloqueo',type:'buff',effect:'defense_up'},{id:'embestida',name:'Embestida',type:'attack',power:27,scaling:{fue:0.7}}],drops:[{itemId:'escudo_cotidiano',chance:0.35},{itemId:'botas_sendero',chance:0.2}],themes:['casa','gestiones','exploracion']},
  buho_de_las_dudas:{id:'buho_de_las_dudas',name:'Buho de las Dudas',icon:'\ud83e\udd89',type:'elite',level:10,hp:135,fue:9,vit:10,des:19,int:22,vol:18,pre:12,xp:115,gold:50,skills:[{id:'mirada',name:'Mirada Paralizante',type:'attack',power:29,damageType:'magical',scaling:{int:0.7}},{id:'pluma_cortante',name:'Pluma Cortante',type:'attack',power:22,scaling:{des:0.5}}],drops:[{itemId:'anillo_constancia',chance:0.25},{itemId:'claridad_practica',chance:0.08}],themes:['mente','conocimiento']},
  guardian_del_hilo:{id:'guardian_del_hilo',name:'Guardian del Hilo',icon:'\ud83e\uddf5',type:'boss',level:15,hp:360,fue:18,vit:20,des:18,int:24,vol:22,pre:16,xp:360,gold:180,skills:[{id:'tiron_destino',name:'Tiron del Destino',type:'attack',power:42,damageType:'magical',scaling:{int:0.8}},{id:'nudo',name:'Nudo Inmovil',type:'debuff',effect:'slow'},{id:'recomponer',name:'Recomponer',type:'heal',power:55}],drops:[{itemId:'claridad_practica',chance:0.3},{itemId:'anillo_constancia',chance:0.45},{itemId:'fragmento_historia',chance:0.7}],themes:['destino','creacion','mente']}
};

const EXPANSION_THEME_ENEMIES_V1 = {
  destino:['eco_inquieto','guardian_del_hilo'], mente:['eco_inquieto','buho_de_las_dudas'], casa:['duende_del_desorden','guardia_del_umbral'], gestiones:['cobrador_de_niebla','guardia_del_umbral'], oro_comercio:['cobrador_de_niebla'], alianzas:['imitador_social'], social:['imitador_social'], conocimiento:['buho_de_las_dudas'], creacion:['guardian_del_hilo']
};

function installExpansionEnemies() {
  if (installExpansionEnemies._installed) return;
  installExpansionEnemies._installed = true;
  Object.assign(ENEMIES, EXPANSION_ENEMIES_V1);
  Object.assign(THEME_ENEMIES, EXPANSION_THEME_ENEMIES_V1);
}