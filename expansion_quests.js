// LifeXP Expansion 1 - Initial progression and seasonal content
// Integracion: cargar despues de quests.js, items.js y enemies.js.

const EXPANSION_QUESTS_V1 = {
  daily_routine_4:{id:'daily_routine_4',
    archived: true, catalogStatus: 'retired',type:'daily',name:'Daily Pulse',desc:'Complete 4 tasks on the same day.',minLevel:1,objectives:[{id:'obj_1',type:'complete_tasks',count:4,category:null,progress:0}],rewards:{xp:75,gold:20},repeatable:true,resetDaily:true},
  quest_first_week:{id:'quest_first_week',
    archived: true, catalogStatus: 'retired',type:'compound',name:'Starting Rhythm',desc:'Build a varied, sustainable first week.',minLevel:1,objectives:[{id:'obj_1',type:'complete_tasks',count:2,category:'casa',progress:0},{id:'obj_2',type:'complete_tasks',count:2,category:'cuerpo',progress:0},{id:'obj_3',type:'complete_tasks',count:1,category:'personal',progress:0}],rewards:{xp:180,gold:70,items:['anillo_constancia']},repeatable:false},
  quest_clear_path:{id:'quest_clear_path',
    archived: true, catalogStatus: 'retired',type:'compound',name:'Clear Path',desc:'Combine a practical errand with an active outing.',minLevel:2,objectives:[{id:'obj_1',type:'complete_tasks',count:3,category:'gestiones',progress:0},{id:'obj_2',type:'complete_tasks',count:2,category:'cuerpo',progress:0}],rewards:{xp:220,gold:85,items:['botas_sendero']},repeatable:false},
  bounty_threshold:{id:'bounty_threshold',
    archived: true, catalogStatus: 'retired',type:'bounty',name:'The Threshold Trembles',desc:'Defeat guardians that appear when you leave matters prepared.',minLevel:5,timeLimit:10,objectives:[{id:'obj_1',type:'defeat_enemy',enemyId:'guardia_del_umbral',count:2,progress:0}],rewards:{xp:240,gold:120,items:['escudo_cotidiano']},repeatable:true},
  story_first_thread:{id:'story_first_thread',
    archived: true, catalogStatus: 'retired',type:'story',name:'The First Thread',desc:'A small anomaly connects your everyday actions to something older.',minLevel:3,chapters:[
    {id:'ch_1',name:'Subtle Signs',desc:'Gather clues through Admin and Personal tasks.',objectives:[{id:'obj_1',type:'complete_tasks',count:2,category:'gestiones',progress:0},{id:'obj_2',type:'complete_tasks',count:1,category:'personal',progress:0}],rewards:{xp:70,items:['fragmento_historia']}},
    {id:'ch_2',name:'The Pattern',desc:'Observe your surroundings and keep moving.',objectives:[{id:'obj_1',type:'complete_tasks',count:2,category:'cuerpo',progress:0},{id:'obj_2',type:'complete_tasks',count:1,category:'casa',progress:0}],rewards:{xp:100,gold:35}},
    {id:'ch_3',name:'The Warden',desc:'Face what protects the next step.',objectives:[{id:'obj_1',type:'defeat_boss',enemyId:'guardian_del_hilo',count:1,progress:0}],rewards:{xp:180,items:['claridad_practica']}}
  ],currentChapter:0,rewards:{xp:260,gold:130},repeatable:false},

  m7_refuge_signal: {
    id: 'm7_refuge_signal',
    type: 'story',
    name: 'A Note Worth Keeping',
    desc: 'While sorting your notes, you find one you do not remember writing. It is specific enough to bother you. Get your week in order, then look at the note properly.',
    minLevel: 1,
    sourceOnly: true,
    origin: 'personal',
    slotGroup: 'personal_project',
    chapters: [
      {
        id: 'm7_chapter_first_mark',
        name: 'The Note',
        desc: 'Make a plan for the week. When you are done, spend a minute looking at the note again.',
        objectives: [
          { id: 'm7_action_trace', type: 'complete_tasks', taskId: 'gestiones_5', count: 1, progress: 0 }
        ],
        actions: [
          {
            id: 'm7_action_trace',
            title: 'Take another look',
            description: 'Complete your weekly planning task. Then read the note once and write down the one detail that seems out of place.',
            reveals: [
              {
                id: 'm7_reveal_first_mark',
                title: 'The handwriting is yours',
                body: 'The note uses your shorthand and mentions a place you know. You still do not remember making it.',
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
                  name: 'Check the place mentioned in the note',
                  desc: 'Spend ten focused minutes checking the place named in the note. Write down what you find, even if it is only that nothing is there.',
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
        name: 'Check the place',
        desc: 'Follow the note to the place it mentions. Bring back one concrete detail.',
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
            title: 'Check the place',
            description: 'Complete the temporary task created by the note. Keep the result simple: record one thing you found or confirmed.',
            reveals: [
              {
                id: 'm7_reveal_hidden_shelf',
                title: 'A useful page',
                body: 'Behind the record there is a folded page with a short set of instructions. It looks old, but the advice is practical.',
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
        name: 'Use the page',
        desc: 'Read the recovered page and try one of its suggestions in a real piece of work.',
        objectives: [
          { id: 'm7_action_answer', type: 'complete_tasks', taskId: 'personal_4', count: 1, progress: 0 }
        ],
        actions: [
          {
            id: 'm7_action_answer',
            title: 'Try one suggestion',
            description: 'Read the page, choose one useful suggestion, and use it during your reading session. Keep the part that works.',
            reveals: [
              {
                id: 'm7_reveal_answer',
                title: 'It is useful after all',
                body: 'The page is not a revelation. It is a small method, written clearly enough to try. One part fits the way you already work.',
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
    name: 'Put It to Use',
    desc: 'Use the idea from the page in one focused piece of creative work.',
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
        title: 'Make something with it',
        description: 'Use the method from the page during a 30-minute creative session. The result can be rough; the point is to test the idea.',
        reveals: [
          {
            id: 'm7_followup_reveal',
            title: 'A method worth remembering',
            body: 'You tried the method instead of leaving it on the page. That is enough to keep: an idea becomes useful when it survives contact with ordinary work.',
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
    name: 'Back Up the Note',
    desc: 'Make a copy of the note and the page so the useful parts do not get lost.',
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
        title: 'Save a copy',
        description: 'Back up the note and the page to the place where you keep important records. Check that the copy is readable.',
        reveals: [
          {
            id: 'm7_watch_reveal',
            title: 'Keep the useful parts',
            body: 'The strange part may remain unexplained. The notes are still worth keeping because they gave you something you can use.',
          }
        ]
      }
    ],
    rewards: { xp: 80, gold: 18 },
    repeatable: false
  },

  // ========== M8 CONTENT BLOCK 1: EXTERNAL REQUEST ==========
  // This first M8 network is intentionally small and executable with the
  // current mission-action contract. More elaborate exclusive choices remain
  // future content until the runtime contract declares them explicitly.
  m8_unexpected_request: {
    id: 'm8_unexpected_request',
    type: 'story',
    name: 'A Request at the Door',
    desc: 'Someone has asked for help. I need to understand what I am agreeing to before I answer.',
    minLevel: 1,
    sourceOnly: true,
    origin: 'passive',
    slotGroup: 'personal_project',
    chapters: [
      {
        id: 'm8_chapter_request',
        name: 'Before I Answer',
        desc: 'The request is simple on the surface, but I do not know the whole situation yet.',
        objectives: [
          { id: 'm8_action_consider_request', type: 'complete_tasks', taskId: 'personal_3', count: 1, progress: 0 }
        ],
        actions: [
          {
            id: 'm8_action_consider_request',
            title: 'Think before answering',
            description: 'Use your journaling and reflection session to write down what you know, what you do not know, and what you can realistically offer.',
            reveals: [
              {
                id: 'm8_reveal_request_is_specific',
                title: 'The request is more specific than it first sounded',
                body: 'Writing it down makes the limits clearer. I may be able to help, but only if I answer honestly about what I can take on.'
              }
            ],
            consequences: [
              {
                id: 'm8_consequence_prepare_reply',
                type: 'create_derived_task',
                templateId: 'm8_task_prepare_reply',
                status: 'accepted',
                taskTemplate: {
                  id: 'm8_task_prepare_reply',
                  name: 'Prepare a clear reply',
                  desc: 'Write a short reply to the person who asked for help. State what you can do, what you cannot do, and when you can follow up.',
                  cat: 'social',
                  freq: 'once',
                  stats: { pre: 50, vol: 50 },
                  xp: 35,
                  availability: { type: 'once', intervalDays: null, limit: 1, repeatable: false }
                }
              }
            ]
          }
        ]
      },
      {
        id: 'm8_chapter_reply',
        name: 'A Clear Answer',
        desc: 'Answer without promising more than you can actually do.',
        objectives: [
          { id: 'm8_action_prepare_reply', type: 'complete_tasks', derivedTaskId: 'derived_m8_unexpected_request_m8_action_consider_request_m8_task_prepare_reply', count: 1, progress: 0 }
        ],
        actions: [
          {
            id: 'm8_action_prepare_reply',
            title: 'Answer clearly',
            description: 'Complete the temporary reply task and send the answer you can stand behind. Keep the boundary clear instead of agreeing out of pressure.',
            reveals: [
              {
                id: 'm8_reveal_clear_answer',
                title: 'A clear answer is still an answer',
                body: 'The situation did not need a grand promise. It needed a response that was honest enough for both sides to use.'
              }
            ],
            consequences: [
              {
                id: 'm8_consequence_grant_oathseal',
                type: 'grant_reward',
                reward: { items: ['sello_alianza'] }
              },
              {
                id: 'm8_consequence_mark_request_handled',
                type: 'set_world_state',
                path: 'm8.request.handled',
                value: true
              },
              {
                id: 'm8_consequence_offer_followup',
                type: 'make_follow_up_available',
                questId: 'm8_request_followup'
              }
            ]
          }
        ]
      }
    ],
    rewards: { xp: 120, gold: 30 },
    repeatable: false
  },

  m8_request_followup: {
    id: 'm8_request_followup',
    type: 'simple',
    name: 'Keep the Thread',
    desc: 'Follow up on the request without letting it take over everything else.',
    minLevel: 1,
    sourceOnly: true,
    origin: 'personal',
    slotGroup: 'personal_project',
    objectives: [
      { id: 'm8_followup_action', type: 'complete_tasks', taskId: 'gestiones_4', count: 1, progress: 0 }
    ],
    actions: [
      {
        id: 'm8_followup_action',
        title: 'Keep the thread',
        description: 'Use your inbox session to send the follow-up, record what still needs an answer, and leave the rest for later.',
        reveals: [
          {
            id: 'm8_followup_reveal',
            title: 'The request has a place now',
            body: 'It is no longer an unfinished thought waiting in the background. I know what I agreed to and what I did not.'
          }
        ]
      }
    ],
    rewards: { xp: 70, gold: 15 },
    repeatable: false
  }
};


const MISSION_SOURCES_V1 = {
  m7_initial_lead: {
    id: 'm7_initial_lead',
    type: 'passive',
    questId: 'm7_refuge_signal',
    title: 'A note you do not remember making',
    description: 'While sorting your records, you find a note in your own shorthand. It points to something worth checking.',
    delivery: 'available',
    requirements: { minLevel: 1 }
  },
  m7_recovery_lead: {
    id: 'm7_recovery_lead',
    type: 'recovery',
    questId: 'm7_refuge_signal',
    targetActionId: 'm7_action_open_register',
    message: 'The note points to a place you can check. Take ten minutes, write down what you find, and continue from there.',
    delivery: 'available'
  },
  m7_world_watch_lead: {
    id: 'm7_world_watch_lead',
    type: 'passive',
    questId: 'm7_refuge_watch',
    title: 'Keep a copy of the notes',
    description: 'You have enough to keep a copy of the note and the page. Put both somewhere you can find them again.',
    delivery: 'available',
    requirements: {
      minLevel: 1,
      worldState: { 'm7.refuge.signal_resolved': true }
    }
  },

  m8_request_at_the_door: {
    id: 'm8_request_at_the_door',
    type: 'passive',
    questId: 'm8_unexpected_request',
    title: 'A request at the door',
    description: 'Someone has asked for help. Read the request before deciding what you can honestly offer.',
    delivery: 'available',
    requirements: { minLevel: 1 }
  },
  m8_request_recovery: {
    id: 'm8_request_recovery',
    type: 'recovery',
    questId: 'm8_unexpected_request',
    targetActionId: 'm8_action_consider_request',
    message: 'Start with the request itself. Write down what is known, what is uncertain, and what you can realistically offer.',
    delivery: 'available'
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
