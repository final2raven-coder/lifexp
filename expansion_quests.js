// LifeXP Expansion 1 - Initial progression and seasonal content
// Integracion: cargar despues de quests.js, items.js y enemies.js.

const EXPANSION_QUESTS_V1 = {
  daily_routine_4:{id:'daily_routine_4',type:'daily',name:'Daily Pulse',desc:'Complete 4 tasks on the same day.',minLevel:1,objectives:[{id:'obj_1',type:'complete_tasks',count:4,category:null,progress:0}],rewards:{xp:75,gold:20},repeatable:true,resetDaily:true},
  quest_first_week:{id:'quest_first_week',type:'compound',name:'Starting Rhythm',desc:'Build a varied, sustainable first week.',minLevel:1,objectives:[{id:'obj_1',type:'complete_tasks',count:2,category:'casa',progress:0},{id:'obj_2',type:'complete_tasks',count:2,category:'cuerpo',progress:0},{id:'obj_3',type:'complete_tasks',count:1,category:'personal',progress:0}],rewards:{xp:180,gold:70,items:['anillo_constancia']},repeatable:false},
  quest_clear_path:{id:'quest_clear_path',type:'compound',name:'Clear Path',desc:'Combine a practical errand with an active outing.',minLevel:2,objectives:[{id:'obj_1',type:'complete_tasks',count:3,category:'gestiones',progress:0},{id:'obj_2',type:'complete_tasks',count:2,category:'cuerpo',progress:0}],rewards:{xp:220,gold:85,items:['botas_sendero']},repeatable:false},
  bounty_threshold:{id:'bounty_threshold',type:'bounty',name:'The Threshold Trembles',desc:'Defeat guardians that appear when you leave matters prepared.',minLevel:5,timeLimit:10,objectives:[{id:'obj_1',type:'defeat_enemy',enemyId:'guardia_del_umbral',count:2,progress:0}],rewards:{xp:240,gold:120,items:['escudo_cotidiano']},repeatable:true},
  story_first_thread:{id:'story_first_thread',type:'story',name:'The First Thread',desc:'A small anomaly connects your everyday actions to something older.',minLevel:3,chapters:[
    {id:'ch_1',name:'Subtle Signs',desc:'Gather clues through Admin and Personal tasks.',objectives:[{id:'obj_1',type:'complete_tasks',count:2,category:'gestiones',progress:0},{id:'obj_2',type:'complete_tasks',count:1,category:'personal',progress:0}],rewards:{xp:70,items:['fragmento_historia']}},
    {id:'ch_2',name:'The Pattern',desc:'Observe your surroundings and keep moving.',objectives:[{id:'obj_1',type:'complete_tasks',count:2,category:'cuerpo',progress:0},{id:'obj_2',type:'complete_tasks',count:1,category:'casa',progress:0}],rewards:{xp:100,gold:35}},
    {id:'ch_3',name:'The Warden',desc:'Face what protects the next step.',objectives:[{id:'obj_1',type:'defeat_boss',enemyId:'guardian_del_hilo',count:1,progress:0}],rewards:{xp:180,items:['claridad_practica']}}
  ],currentChapter:0,rewards:{xp:260,gold:130},repeatable:false},

  m7_refuge_signal: {
    id: 'm7_refuge_signal',
    type: 'story',
    name: 'The Lantern Beneath the Dust',
    desc: 'A quiet change in the refuge suggests that an old record is waiting to be understood.',
    minLevel: 1,
    sourceOnly: true,
    origin: 'personal',
    slotGroup: 'personal_project',
    chapters: [
      {
        id: 'm7_chapter_first_mark',
        name: 'A Mark in the Margin',
        desc: 'Bring order to the week and see whether the pattern becomes clearer.',
        objectives: [
          { id: 'm7_action_trace', type: 'complete_tasks', taskId: 'gestiones_5', count: 1, progress: 0 }
        ],
        actions: [
          {
            id: 'm7_action_trace',
            title: 'Read the first mark',
            description: 'Prepare the week carefully, then return to the record with a clear mind.',
            reveals: [
              {
                id: 'm7_reveal_first_mark',
                title: 'The Margin Answers',
                body: 'The mark is not a stain. It is a direction, repeated in the same patient hand.'
              }
            ],
            consequences: [
              {
                id: 'm7_consequence_open_register',
                type: 'create_derived_task',
                templateId: 'm7_task_open_register',
                status: 'accepted',
                taskTemplate: {
                  id: 'm7_task_open_register',
                  name: 'Open the old register',
                  desc: 'Set aside ten quiet minutes, open the relevant record, and write down the first useful clue you find.',
                  cat: 'personal',
                  freq: 'once',
                  stats: { int: 50, vol: 50 },
                  xp: 35,
                  availability: { type: 'once', intervalDays: null, limit: 1, repeatable: false }
                }
              }
            ]
          }
        ]
      },
      {
        id: 'm7_chapter_open_register',
        name: 'The Open Register',
        desc: 'Follow the temporary lead before it fades into the ordinary noise of the refuge.',
        objectives: [
          {
            id: 'm7_action_open_register',
            type: 'complete_tasks',
            derivedTaskId: 'derived_m7_refuge_signal_m7_action_trace_m7_task_open_register',
            count: 1,
            progress: 0
          }
        ],
        actions: [
          {
            id: 'm7_action_open_register',
            title: 'Follow the temporary lead',
            description: 'Complete the practical step created by the first mark, then examine what it reveals.',
            reveals: [
              {
                id: 'm7_reveal_hidden_shelf',
                title: 'A Space Behind the Record',
                body: 'The register points to a place that was never meant to be hidden forever.'
              }
            ],
            consequences: [
              {
                id: 'm7_consequence_grant_page',
                type: 'grant_reward',
                reward: { items: ['pagina_arcana'] }
              },
              {
                id: 'm7_consequence_mark_trace',
                type: 'set_world_state',
                path: 'm7.refuge.trace_found',
                value: true
              }
            ]
          }
        ]
      },
      {
        id: 'm7_chapter_answer',
        name: 'The Useful Answer',
        desc: 'Study the recovered page and decide what the refuge should remember.',
        objectives: [
          { id: 'm7_action_answer', type: 'complete_tasks', taskId: 'personal_4', count: 1, progress: 0 }
        ],
        actions: [
          {
            id: 'm7_action_answer',
            title: 'Understand the recovered page',
            description: 'Spend time with a book, then return with one idea that can be put to use.',
            reveals: [
              {
                id: 'm7_reveal_answer',
                title: 'A Practical Kind of Magic',
                body: 'The page does not ask for a grand ritual. It asks to be used, patiently and well.'
              }
            ],
            consequences: [
              {
                id: 'm7_consequence_unlock_page_use',
                type: 'unlock_item_use',
                materialId: 'pagina_arcana',
                useId: 'm7_use_page_at_refuge'
              },
              {
                id: 'm7_consequence_offer_followup',
                type: 'make_follow_up_available',
                questId: 'm7_refuge_followup'
              },
              {
                id: 'm7_consequence_resolve_signal',
                type: 'set_world_state',
                path: 'm7.refuge.signal_resolved',
                value: true
              }
            ]
          }
        ]
      }
    ],
    rewards: { xp: 160, gold: 45 },
    repeatable: false
  },

  m7_refuge_followup: {
    id: 'm7_refuge_followup',
    type: 'simple',
    name: 'The Work That Remains',
    desc: 'Carry the new understanding into one deliberate act of creation.',
    minLevel: 1,
    sourceOnly: true,
    origin: 'personal',
    slotGroup: 'personal_project',
    objectives: [
      { id: 'm7_followup_action', type: 'complete_tasks', taskId: 'personal_1', count: 1, progress: 0 }
    ],
    actions: [
      {
        id: 'm7_followup_action',
        title: 'Give the answer a shape',
        description: 'Spend a focused session making something that carries the discovery forward.',
        reveals: [
          {
            id: 'm7_followup_reveal',
            title: 'The Refuge Keeps Its Promise',
            body: 'A useful discovery becomes part of the refuge when it is given a place in the work that follows.'
          }
        ]
      }
    ],
    rewards: { xp: 90, gold: 20 },
    repeatable: false
  },

  m7_refuge_watch: {
    id: 'm7_refuge_watch',
    type: 'simple',
    name: 'A Light Left Ready',
    desc: 'Use what the refuge has learned to prepare one small safeguard for the days ahead.',
    minLevel: 1,
    sourceOnly: true,
    origin: 'personal',
    slotGroup: 'personal_project',
    objectives: [
      { id: 'm7_watch_action', type: 'complete_tasks', taskId: 'gestiones_3', count: 1, progress: 0 }
    ],
    actions: [
      {
        id: 'm7_watch_action',
        title: 'Prepare the safeguard',
        description: 'Back up the important record so the refuge can keep what it has learned.',
        reveals: [
          {
            id: 'm7_watch_reveal',
            title: 'A Place for What Matters',
            body: 'The refuge is not protected by keeping every secret. It is protected by making the right knowledge durable.'
          }
        ]
      }
    ],
    rewards: { xp: 80, gold: 18 },
    repeatable: false
  }
};


const MISSION_SOURCES_V1 = {
  m7_initial_lead: {
    id: 'm7_initial_lead',
    type: 'passive',
    questId: 'm7_refuge_signal',
    title: 'A quiet change in the refuge',
    description: 'Something in the refuge has shifted. A careful hand may find where the change began.',
    delivery: 'available',
    requirements: { minLevel: 1 }
  },
  m7_recovery_lead: {
    id: 'm7_recovery_lead',
    type: 'recovery',
    questId: 'm7_refuge_signal',
    targetActionId: 'm7_action_open_register',
    message: 'The next mark is difficult to read. Revisit the discovered record and follow the clearest practical lead.',
    delivery: 'available'
  },
  m7_world_watch_lead: {
    id: 'm7_world_watch_lead',
    type: 'passive',
    questId: 'm7_refuge_watch',
    title: 'A safeguard can now be prepared',
    description: 'The refuge has learned enough to make one small protection last.',
    delivery: 'available',
    requirements: {
      minLevel: 1,
      worldState: { 'm7.refuge.signal_resolved': true }
    }
  }
};

function installExpansionQuests() {
  if (installExpansionQuests._installed) return;
  installExpansionQuests._installed = true;
  Object.assign(QUESTS, EXPANSION_QUESTS_V1);
  registerMissionSources(MISSION_SOURCES_V1);
}

function updateExpansionQuestProgress(task) {
  // Compatibility bridge for the current game.js call style.
  if (typeof updateQuestProgress !== 'function' || !task) return;
  updateQuestProgress('task_complete',{category:task.cat,taskId:task.id});
}
