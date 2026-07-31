// LifeXP Expansion 1 - Initial progression and seasonal content
// Integracion: cargar despues de quests.js, items.js y enemies.js.

const EXPANSION_QUESTS_V1 = {
  daily_routine_4:{id:'daily_routine_4',type:'daily',name:'Pulso del Dia',desc:'Completa 4 tareas en el mismo dia.',minLevel:1,objectives:[{id:'obj_1',type:'complete_tasks',count:4,category:null,progress:0}],rewards:{xp:75,gold:20},repeatable:true,resetDaily:true},
  quest_first_week:{id:'quest_first_week',type:'compound',name:'Ritmo Inicial',desc:'Construye una primera semana variada y sostenible.',minLevel:1,objectives:[{id:'obj_1',type:'complete_tasks',count:2,category:'casa',progress:0},{id:'obj_2',type:'complete_tasks',count:2,category:'cuerpo',progress:0},{id:'obj_3',type:'complete_tasks',count:1,category:'personal',progress:0}],rewards:{xp:180,gold:70,items:['anillo_constancia']},repeatable:false},
  quest_clear_path:{id:'quest_clear_path',type:'compound',name:'Camino Despejado',desc:'Combina una gestion practica con una salida activa.',minLevel:2,objectives:[{id:'obj_1',type:'complete_tasks',count:3,category:'gestiones',progress:0},{id:'obj_2',type:'complete_tasks',count:2,category:'cuerpo',progress:0}],rewards:{xp:220,gold:85,items:['botas_sendero']},repeatable:false},
  bounty_threshold:{id:'bounty_threshold',type:'bounty',name:'El Umbral Tiembla',desc:'Derrota guardianes que aparecen cuando dejas asuntos preparados.',minLevel:5,timeLimit:10,objectives:[{id:'obj_1',type:'defeat_enemy',enemyId:'guardia_del_umbral',count:2,progress:0}],rewards:{xp:240,gold:120,items:['escudo_cotidiano']},repeatable:true},
  story_first_thread:{id:'story_first_thread',type:'story',name:'El Primer Hilo',desc:'Una pequena anomalia conecta tus acciones cotidianas con algo mas antiguo.',minLevel:3,chapters:[
    {id:'ch_1',name:'Senales Discretas',desc:'Reune pistas a traves de tareas de Gestiones y Personal.',objectives:[{id:'obj_1',type:'complete_tasks',count:2,category:'gestiones',progress:0},{id:'obj_2',type:'complete_tasks',count:1,category:'personal',progress:0}],rewards:{xp:70,items:['fragmento_historia']}},
    {id:'ch_2',name:'El Patron',desc:'Observa tu entorno y mantente en movimiento.',objectives:[{id:'obj_1',type:'complete_tasks',count:2,category:'cuerpo',progress:0},{id:'obj_2',type:'complete_tasks',count:1,category:'casa',progress:0}],rewards:{xp:100,gold:35}},
    {id:'ch_3',name:'El Guardian',desc:'Enfrentate a lo que protege el siguiente paso.',objectives:[{id:'obj_1',type:'defeat_boss',enemyId:'guardian_del_hilo',count:1,progress:0}],rewards:{xp:180,items:['claridad_practica']}}
  ],currentChapter:0,rewards:{xp:260,gold:130},repeatable:false}
};

function installExpansionQuests() {
  if (installExpansionQuests._installed) return;
  installExpansionQuests._installed = true;
  Object.assign(QUESTS, EXPANSION_QUESTS_V1);
}

function updateExpansionQuestProgress(task) {
  // Compatibility bridge for the current game.js call style.
  if (typeof updateQuestProgress !== 'function' || !task) return;
  updateQuestProgress('task_complete',{category:task.cat,taskId:task.id});
}
