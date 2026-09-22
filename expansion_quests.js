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
  },

  // ========== M8 CONTENT BLOCK 2: OBJECT DISCOVERY ==========
  // This network uses the existing material reward from the preceding
  // progression slice. It adds no new item, save field or engine behaviour.
  m8_margin_in_the_page: {
    id: 'm8_margin_in_the_page',
    type: 'story',
    name: 'A Mark in the Margin',
    desc: 'The recovered page is useful, but one mark in its margin does not belong to the method around it. I need to understand that before I use the page again.',
    minLevel: 1,
    sourceOnly: true,
    origin: 'personal',
    slotGroup: 'personal_project',
    chapters: [
      {
        id: 'm8_chapter_page_observation',
        name: 'The Mark',
        desc: 'Read the recovered page once more and separate the useful instruction from the mark that does not fit.',
        objectives: [
          { id: 'm8_action_page_observation', type: 'complete_tasks', taskId: 'personal_4', count: 1, progress: 0 }
        ],
        actions: [
          {
            id: 'm8_action_page_observation',
            title: 'Read the margin carefully',
            description: 'Complete your reading session. Then look at the recovered page and write down the one mark or phrase that does not belong with the rest.',
            reveals: [
              {
                id: 'm8_reveal_page_margin',
                title: 'The margin was added later',
                body: 'The mark is not part of the method. It was added after the page was written, in a hand that copied one of your own habits without quite understanding it.'
              }
            ],
            consequences: [
              {
                id: 'm8_consequence_rewrite_margin',
                type: 'create_derived_task',
                templateId: 'm8_task_rewrite_margin',
                status: 'accepted',
                taskTemplate: {
                  id: 'm8_task_rewrite_margin',
                  name: 'Rewrite the margin in plain language',
                  desc: 'Rewrite the marked instruction in your own words. Keep it to three sentences or fewer, and note what remains unclear.',
                  cat: 'personal',
                  freq: 'once',
                  stats: { int: 50, vol: 50 },
                  xp: 30,
                  availability: { type: 'once', intervalDays: null, limit: 1, repeatable: false }
                }
              }
            ]
          }
        ]
      },
      {
        id: 'm8_chapter_page_rewrite',
        name: 'Make It Legible',
        desc: 'Rewrite the mark without pretending that an unclear instruction is already understood.',
        objectives: [
          {
            id: 'm8_action_page_rewrite',
            type: 'complete_tasks',
            derivedTaskId: 'derived_m8_margin_in_the_page_m8_action_page_observation_m8_task_rewrite_margin',
            count: 1,
            progress: 0
          }
        ],
        actions: [
          {
            id: 'm8_action_page_rewrite',
            title: 'Separate meaning from assumption',
            description: 'Complete the temporary rewriting task. Keep the part you can explain and leave the uncertain part marked as uncertain.',
            reveals: [
              {
                id: 'm8_reveal_margin_is_instruction',
                title: 'It is an instruction, not a signature',
                body: 'The mark describes a way of preparing the next step. It is not a name, a warning, or a message addressed to you personally.'
              }
            ],
            consequences: [
              {
                id: 'm8_consequence_unlock_page_margin_use',
                type: 'unlock_item_use',
                materialId: 'pagina_arcana',
                useId: 'm8_use_page_margin'
              },
              {
                id: 'm8_consequence_mark_margin_understood',
                type: 'set_world_state',
                path: 'm8.page.margin_understood',
                value: true
              }
            ]
          }
        ]
      },
      {
        id: 'm8_chapter_page_trial',
        name: 'Try the Useful Part',
        desc: 'Use the clarified instruction once, then decide whether it deserves a place in your ordinary method.',
        objectives: [
          { id: 'm8_action_page_trial', type: 'complete_tasks', taskId: 'personal_1', count: 1, progress: 0 }
        ],
        actions: [
          {
            id: 'm8_action_page_trial',
            title: 'Test the instruction once',
            description: 'Complete one focused creative session using the clarified instruction. Keep the result modest; the point is to test whether the method helps.',
            reveals: [
              {
                id: 'm8_reveal_page_can_be_used',
                title: 'The page earns its place',
                body: 'The instruction is not powerful because it came from somewhere strange. It is useful because it survives an ordinary piece of work.'
              }
            ],
            consequences: [
              {
                id: 'm8_consequence_grant_practical_clarity',
                type: 'grant_reward',
                reward: { items: ['claridad_practica'] }
              },
              {
                id: 'm8_consequence_offer_page_followup',
                type: 'make_follow_up_available',
                questId: 'm8_page_followup'
              },
              {
                id: 'm8_consequence_mark_page_trialled',
                type: 'set_world_state',
                path: 'm8.page.instruction_trialled',
                value: true
              }
            ]
          }
        ]
      }
    ],
    rewards: { xp: 150, gold: 35 },
    repeatable: false
  },

  m8_page_followup: {
    id: 'm8_page_followup',
    type: 'simple',
    name: 'Keep the Useful Line',
    desc: 'Turn the tested instruction into a short note you can find when you need it.',
    minLevel: 1,
    sourceOnly: true,
    origin: 'personal',
    slotGroup: 'personal_project',
    objectives: [
      { id: 'm8_page_followup_action', type: 'complete_tasks', taskId: 'gestiones_3', count: 1, progress: 0 }
    ],
    actions: [
      {
        id: 'm8_page_followup_action',
        title: 'Leave a usable note',
        description: 'Use your records session to save the tested instruction where you will actually find it. Keep only the part that proved useful.',
        reveals: [
          {
            id: 'm8_page_followup_reveal',
            title: 'A small method is enough',
            body: 'The page can remain unexplained in places. One useful line, kept where you can reach it, is already a real result.'
          }
        ]
      }
    ],
    rewards: { xp: 75, gold: 16 },
    repeatable: false
  },

  // ========== M8 CONTENT BLOCK 3: MATERIAL DISCOVERY ==========
  // This network introduces an existing material through a mission reward,
  // then uses the canonical material-use boundary to make its purpose useful.
  m8_the_piece_between_pages: {
    id: 'm8_the_piece_between_pages',
    type: 'story',
    name: 'The Piece Between Pages',
    desc: 'The useful method has led to another small inconsistency: a piece of material pressed between two pages that should have been empty. I can record it before I decide what it means.',
    minLevel: 1,
    sourceOnly: true,
    origin: 'personal',
    slotGroup: 'personal_project',
    chapters: [
      {
        id: 'm8_chapter_piece_found',
        name: 'Something Left Behind',
        desc: 'Review the records around the recovered page and write down what you can establish about the loose piece.',
        objectives: [
          { id: 'm8_action_piece_found', type: 'complete_tasks', taskId: 'gestiones_3', count: 1, progress: 0 }
        ],
        actions: [
          {
            id: 'm8_action_piece_found',
            title: 'Record the loose piece',
            description: 'Complete your records session. Note where the loose piece was found, what it looks like, and which facts you cannot confirm yet.',
            reveals: [
              {
                id: 'm8_reveal_piece_recorded',
                title: 'The piece was placed there deliberately',
                body: 'It was not part of the page. Someone put it between the records after the writing was finished, and then left no explanation.'
              }
            ],
            consequences: [
              {
                id: 'm8_consequence_grant_history_fragment',
                type: 'grant_reward',
                reward: { items: ['fragmento_historia'] }
              },
              {
                id: 'm8_consequence_examine_history_fragment',
                type: 'create_derived_task',
                templateId: 'm8_task_examine_history_fragment',
                status: 'accepted',
                taskTemplate: {
                  id: 'm8_task_examine_history_fragment',
                  name: 'Examine the recovered fragment',
                  desc: 'Spend ten focused minutes examining the fragment. Write down three observable details and one question you still cannot answer.',
                  cat: 'personal',
                  freq: 'once',
                  stats: { int: 50, vol: 50 },
                  xp: 30,
                  availability: { type: 'once', intervalDays: null, limit: 1, repeatable: false }
                }
              }
            ]
          }
        ]
      },
      {
        id: 'm8_chapter_piece_examined',
        name: 'Look Without Guessing',
        desc: 'Examine the fragment closely and keep observation separate from interpretation.',
        objectives: [
          {
            id: 'm8_action_piece_examine',
            type: 'complete_tasks',
            derivedTaskId: 'derived_m8_the_piece_between_pages_m8_action_piece_found_m8_task_examine_history_fragment',
            count: 1,
            progress: 0
          }
        ],
        actions: [
          {
            id: 'm8_action_piece_examine',
            title: 'Keep the facts separate',
            description: 'Complete the temporary examination task. Keep the observable details and your theories in separate notes.',
            reveals: [
              {
                id: 'm8_reveal_piece_is_record',
                title: 'It carries a record, not a message',
                body: 'The fragment does not contain a sentence waiting to be read. Its value is in the trace it preserves: a piece of a record that was meant to be consulted later.'
              }
            ],
            consequences: [
              {
                id: 'm8_consequence_unlock_history_fragment_use',
                type: 'unlock_item_use',
                materialId: 'fragmento_historia',
                useId: 'm8_use_history_fragment_as_record'
              },
              {
                id: 'm8_consequence_mark_history_fragment_understood',
                type: 'set_world_state',
                path: 'm8.fragment.record_understood',
                value: true
              }
            ]
          }
        ]
      },
      {
        id: 'm8_chapter_piece_kept',
        name: 'Keep the Record',
        desc: 'Use the fragment as a prompt to preserve one useful piece of knowledge in a place you can reach again.',
        objectives: [
          { id: 'm8_action_piece_kept', type: 'complete_tasks', taskId: 'personal_3', count: 1, progress: 0 }
        ],
        actions: [
          {
            id: 'm8_action_piece_kept',
            title: 'Preserve one useful detail',
            description: 'Complete a short reflection session and record one useful detail from the investigation where you can find it later.',
            reveals: [
              {
                id: 'm8_reveal_piece_has_place',
                title: 'The record has a place now',
                body: 'The fragment still does not explain who left it. It has done something more practical: it showed me how to keep one useful detail from becoming another loose thought.'
              }
            ],
            consequences: [
              {
                id: 'm8_consequence_grant_fragment_followthrough',
                type: 'grant_reward',
                reward: { items: ['sello_preparacion'] }
              },
              {
                id: 'm8_consequence_offer_fragment_followup',
                type: 'make_follow_up_available',
                questId: 'm8_fragment_followup'
              },
              {
                id: 'm8_consequence_mark_fragment_kept',
                type: 'set_world_state',
                path: 'm8.fragment.record_kept',
                value: true
              }
            ]
          }
        ]
      }
    ],
    rewards: { xp: 155, gold: 38 },
    repeatable: false
  },

  m8_fragment_followup: {
    id: 'm8_fragment_followup',
    type: 'simple',
    name: 'Make the Record Reachable',
    desc: 'Put the useful detail somewhere it can support the next ordinary piece of work.',
    minLevel: 1,
    sourceOnly: true,
    origin: 'personal',
    slotGroup: 'personal_project',
    objectives: [
      { id: 'm8_fragment_followup_action', type: 'complete_tasks', taskId: 'gestiones_4', count: 1, progress: 0 }
    ],
    actions: [
      {
        id: 'm8_fragment_followup_action',
        title: 'Place the detail where it helps',
        description: 'Use your inbox session to put the useful detail somewhere visible and easy to retrieve. Remove any note you no longer need.',
        reveals: [
          {
            id: 'm8_fragment_followup_reveal',
            title: 'Useful information should be reachable',
            body: 'The fragment did not ask for a shrine. It asked for a place where the next step could begin without another search.'
          }
        ]
      }
    ],
    rewards: { xp: 80, gold: 17 },
    repeatable: false
  },

  // ========== M8 CONTENT BLOCK 4: REFUGE PROJECT ==========
  // This network improves a practical routine through declarative state only.
  // It does not claim storage capacity or add a new refuge subsystem.
  m8_one_clear_surface: {
    id: 'm8_one_clear_surface',
    type: 'story',
    name: 'One Clear Surface',
    desc: 'The record is reachable now, but the place where I work still makes the next step harder than it needs to be. I can improve one small part without trying to rebuild everything.',
    minLevel: 1,
    sourceOnly: true,
    origin: 'personal',
    slotGroup: 'personal_project',
    chapters: [
      {
        id: 'm8_chapter_surface_notice',
        name: 'The Friction',
        desc: 'Notice one concrete obstacle in the place where you usually begin work.',
        objectives: [
          { id: 'm8_action_surface_notice', type: 'complete_tasks', taskId: 'casa_exp_01', count: 1, progress: 0 }
        ],
        actions: [
          {
            id: 'm8_action_surface_notice',
            title: 'Name the obstacle',
            description: 'Complete the pantry organisation task. While doing it, note one specific object, pile, or missing arrangement that makes starting harder.',
            reveals: [
              {
                id: 'm8_reveal_surface_obstacle',
                title: 'The problem has a size',
                body: 'The refuge is not failing everywhere. One small obstruction is doing most of the work. That makes it possible to change without turning the whole place into another project.'
              }
            ],
            consequences: [
              {
                id: 'm8_consequence_prepare_surface',
                type: 'create_derived_task',
                templateId: 'm8_task_prepare_surface',
                status: 'accepted',
                taskTemplate: {
                  id: 'm8_task_prepare_surface',
                  name: 'Prepare one clear starting surface',
                  desc: 'Choose one defined surface used for starting work. Clear only that surface, remove anything that does not belong there, and leave the next useful item ready.',
                  cat: 'casa',
                  freq: 'once',
                  stats: { vol: 50, des: 50 },
                  xp: 30,
                  availability: { type: 'once', intervalDays: null, limit: 1, repeatable: false }
                }
              }
            ]
          }
        ]
      },
      {
        id: 'm8_chapter_surface_ready',
        name: 'Make the Start Easier',
        desc: 'Prepare one bounded surface and leave the next step visible.',
        objectives: [
          {
            id: 'm8_action_surface_ready',
            type: 'complete_tasks',
            derivedTaskId: 'derived_m8_one_clear_surface_m8_action_surface_notice_m8_task_prepare_surface',
            count: 1,
            progress: 0
          }
        ],
        actions: [
          {
            id: 'm8_action_surface_ready',
            title: 'Leave the next step ready',
            description: 'Complete the temporary refuge task. Keep the scope to one surface and leave one useful item ready for the next session.',
            reveals: [
              {
                id: 'm8_reveal_surface_ready',
                title: 'A beginning can be prepared',
                body: 'The surface does not solve every problem. It removes one decision from the beginning, which is enough to make returning less expensive.'
              }
            ],
            consequences: [
              {
                id: 'm8_consequence_grant_preparation_seal',
                type: 'grant_reward',
                reward: { items: ['sello_preparacion'] }
              },
              {
                id: 'm8_consequence_mark_surface_ready',
                type: 'set_world_state',
                path: 'm8.refuge.clear_surface_ready',
                value: true
              }
            ]
          }
        ]
      },
      {
        id: 'm8_chapter_surface_test',
        name: 'Return Once',
        desc: 'Use the prepared surface for one ordinary work session and see whether it reduces friction.',
        objectives: [
          { id: 'm8_action_surface_test', type: 'complete_tasks', taskId: 'personal_1', count: 1, progress: 0 }
        ],
        actions: [
          {
            id: 'm8_action_surface_test',
            title: 'Return to the prepared place',
            description: 'Complete one focused project session from the prepared surface. At the end, note whether the start was easier and what should remain ready.',
            reveals: [
              {
                id: 'm8_reveal_surface_is_enough',
                title: 'The refuge changes by use',
                body: 'The place did not become perfect. It became easier to enter, and that is the kind of change that can survive an ordinary week.'
              }
            ],
            consequences: [
              {
                id: 'm8_consequence_offer_surface_followup',
                type: 'make_follow_up_available',
                questId: 'm8_surface_followup'
              },
              {
                id: 'm8_consequence_mark_surface_tested',
                type: 'set_world_state',
                path: 'm8.refuge.clear_surface_tested',
                value: true
              }
            ]
          }
        ]
      }
    ],
    rewards: { xp: 145, gold: 32 },
    repeatable: false
  },

  m8_surface_followup: {
    id: 'm8_surface_followup',
    type: 'simple',
    name: 'Leave Tomorrow a Start',
    desc: 'Keep the prepared surface useful without turning it into a maintenance project.',
    minLevel: 1,
    sourceOnly: true,
    origin: 'personal',
    slotGroup: 'personal_project',
    objectives: [
      { id: 'm8_surface_followup_action', type: 'complete_tasks', taskId: 'casa_exp_02', count: 1, progress: 0 }
    ],
    actions: [
      {
        id: 'm8_surface_followup_action',
        title: 'Reset only what matters',
        description: 'Complete the focused cleaning task in one area. Keep the prepared starting surface intact and change only what would otherwise get in the way.',
        reveals: [
          {
            id: 'm8_surface_followup_reveal',
            title: 'Maintenance can stay small',
            body: 'The useful part was not building a perfect refuge. It was keeping one beginning available without asking for a new overhaul every time.'
          }
        ]
      }
    ],
    rewards: { xp: 78, gold: 16 },
    repeatable: false
  },

  // ========== M8 CONTENT BLOCK 5: ENCOUNTER AFTERMATH ==========
  // This network handles the consequences of an encounter without changing
  // combat rules or requiring a new enemy catalogue entry.
  m8_footprints_after_the_quiet: {
    id: 'm8_footprints_after_the_quiet',
    type: 'story',
    name: 'Footprints After the Quiet',
    desc: 'The starting place is easier to return to now. This morning, something had been there before me. The signs are small, but they were not there yesterday.',
    minLevel: 1,
    sourceOnly: true,
    origin: 'passive',
    slotGroup: 'personal_project',
    chapters: [
      {
        id: 'm8_chapter_aftermath_notice',
        name: 'What Remains',
        desc: 'Look at the signs of the encounter without turning them into a story before you know what happened.',
        objectives: [
          { id: 'm8_action_aftermath_notice', type: 'complete_tasks', taskId: 'cuerpo_exp_01', count: 1, progress: 0 }
        ],
        actions: [
          {
            id: 'm8_action_aftermath_notice',
            title: 'Notice what changed',
            description: 'Complete your recovery walk. Pay attention to one concrete change in the place where you usually begin, and record it without guessing at its cause.',
            reveals: [
              {
                id: 'm8_reveal_aftermath_signs',
                title: 'The signs are recent',
                body: 'The marks are too fresh to belong to the old disorder. Something passed through after the surface was prepared, and it took care not to disturb everything.'
              }
            ],
            consequences: [
              {
                id: 'm8_consequence_reconstruct_encounter',
                type: 'create_derived_task',
                templateId: 'm8_task_reconstruct_encounter',
                status: 'accepted',
                taskTemplate: {
                  id: 'm8_task_reconstruct_encounter',
                  name: 'Reconstruct what happened',
                  desc: 'Spend ten focused minutes listing the sequence of visible changes. Separate what you saw from what you think it might mean.',
                  cat: 'personal',
                  freq: 'once',
                  stats: { int: 50, vol: 50 },
                  xp: 30,
                  availability: { type: 'once', intervalDays: null, limit: 1, repeatable: false }
                }
              }
            ]
          }
        ]
      },
      {
        id: 'm8_chapter_aftermath_reconstruct',
        name: 'Do Not Chase the Wrong Thing',
        desc: 'Reconstruct the encounter from its traces and identify the part that needs attention now.',
        objectives: [
          {
            id: 'm8_action_aftermath_reconstruct',
            type: 'complete_tasks',
            derivedTaskId: 'derived_m8_footprints_after_the_quiet_m8_action_aftermath_notice_m8_task_reconstruct_encounter',
            count: 1,
            progress: 0
          }
        ],
        actions: [
          {
            id: 'm8_action_aftermath_reconstruct',
            title: 'Keep the sequence clear',
            description: 'Complete the temporary reconstruction task. Identify one practical consequence that needs attention and leave the uncertain parts open.',
            reveals: [
              {
                id: 'm8_reveal_aftermath_real_problem',
                title: 'The damage is smaller than the uncertainty',
                body: 'Nothing important was taken. The real problem is that the encounter left the beginning unclear again. A small repair is more useful than a long pursuit.'
              }
            ],
            consequences: [
              {
                id: 'm8_consequence_grant_pathway_boots',
                type: 'grant_reward',
                reward: { items: ['botas_sendero'] }
              },
              {
                id: 'm8_consequence_mark_aftermath_understood',
                type: 'set_world_state',
                path: 'm8.aftermath.sequence_understood',
                value: true
              }
            ]
          }
        ]
      },
      {
        id: 'm8_chapter_aftermath_restore',
        name: 'Make the Return Possible',
        desc: 'Restore the small part that was disturbed and leave a clear way back into the next session.',
        objectives: [
          { id: 'm8_action_aftermath_restore', type: 'complete_tasks', taskId: 'casa_exp_02', count: 1, progress: 0 }
        ],
        actions: [
          {
            id: 'm8_action_aftermath_restore',
            title: 'Restore one practical part',
            description: 'Complete the focused cleaning task in one area. Restore only what the encounter disturbed and leave the next useful starting point visible.',
            reveals: [
              {
                id: 'm8_reveal_aftermath_response',
                title: 'The response is preparation',
                body: 'The encounter may happen again or it may not. The useful response is the same either way: make the place readable enough to return without starting from confusion.'
              }
            ],
            consequences: [
              {
                id: 'm8_consequence_offer_aftermath_followup',
                type: 'make_follow_up_available',
                questId: 'm8_aftermath_followup'
              },
              {
                id: 'm8_consequence_mark_aftermath_restored',
                type: 'set_world_state',
                path: 'm8.aftermath.return_restored',
                value: true
              }
            ]
          }
        ]
      }
    ],
    rewards: { xp: 150, gold: 36 },
    repeatable: false
  },

  m8_aftermath_followup: {
    id: 'm8_aftermath_followup',
    type: 'simple',
    name: 'Leave a Quiet Signal',
    desc: 'Make the next return easier to recognise without trying to control everything around it.',
    minLevel: 1,
    sourceOnly: true,
    origin: 'personal',
    slotGroup: 'personal_project',
    objectives: [
      { id: 'm8_aftermath_followup_action', type: 'complete_tasks', taskId: 'gestiones_3', count: 1, progress: 0 }
    ],
    actions: [
      {
        id: 'm8_aftermath_followup_action',
        title: 'Leave a clear signal',
        description: 'Use your records session to write one short note that tells you where to begin next time. Keep it practical and easy to recognise.',
        reveals: [
          {
            id: 'm8_aftermath_followup_reveal',
            title: 'A return does not need certainty',
            body: 'I still do not know what crossed the threshold. I do know where to begin if the signs appear again, and that is enough for now.'
          }
        ]
      }
    ],
    rewards: { xp: 82, gold: 18 },
    repeatable: false
  },

  // ========== M8 CONTENT BLOCK 6: GUILD ORDER ==========
  // This order uses the existing guild_order slot and membership check.
  // It adds no reputation, economy or faction system.
  m8_the_unsealed_order: {
    id: 'm8_the_unsealed_order',
    type: 'story',
    name: 'The Order Without a Seal',
    desc: 'The guild has sent an order with no seal and no useful context. I can make it legible before I decide how much of it I can carry.',
    minLevel: 1,
    sourceOnly: true,
    origin: 'guild',
    slotGroup: 'guild_order',
    chapters: [
      {
        id: 'm8_chapter_order_scope',
        name: 'Read the Order Properly',
        desc: 'Separate the actual request from the assumptions that arrived with it.',
        objectives: [
          { id: 'm8_action_order_scope', type: 'complete_tasks', taskId: 'gestiones_exp_02', count: 1, progress: 0 }
        ],
        actions: [
          {
            id: 'm8_action_order_scope',
            title: 'Make the order readable',
            description: 'Complete your digital folder session. Put the order and its supporting information together, then write down what is explicitly requested and what is missing.',
            reveals: [
              {
                id: 'm8_reveal_order_scope',
                title: 'The order has a smaller centre',
                body: 'Once the papers are together, the request is no longer an open-ended demand. One deliverable is clear. The rest is context that can wait.'
              }
            ],
            consequences: [
              {
                id: 'm8_consequence_prepare_order_record',
                type: 'create_derived_task',
                templateId: 'm8_task_prepare_order_record',
                status: 'accepted',
                taskTemplate: {
                  id: 'm8_task_prepare_order_record',
                  name: 'Prepare the guild order record',
                  desc: 'Write a short record of the order: the requested result, the next action, and one question that must be answered before more work begins.',
                  cat: 'gestiones',
                  freq: 'once',
                  stats: { int: 50, vol: 50 },
                  xp: 32,
                  availability: { type: 'once', intervalDays: null, limit: 1, repeatable: false }
                }
              }
            ]
          }
        ]
      },
      {
        id: 'm8_chapter_order_record',
        name: 'A Usable Brief',
        desc: 'Turn the order into a brief that another person could understand without the missing context.',
        objectives: [
          {
            id: 'm8_action_order_record',
            type: 'complete_tasks',
            derivedTaskId: 'derived_m8_the_unsealed_order_m8_action_order_scope_m8_task_prepare_order_record',
            count: 1,
            progress: 0
          }
        ],
        actions: [
          {
            id: 'm8_action_order_record',
            title: 'Leave a usable brief',
            description: 'Complete the temporary record task. Keep the brief short enough to use, and mark the unanswered question instead of filling it with a guess.',
            reveals: [
              {
                id: 'm8_reveal_order_brief',
                title: 'The missing context is now visible',
                body: 'The order did not need more ceremony. It needed one clear gap named before anyone started promising a result.'
              }
            ],
            consequences: [
              {
                id: 'm8_consequence_mark_order_briefed',
                type: 'set_world_state',
                path: 'm8.guild.order_briefed',
                value: true
              }
            ]
          }
        ]
      },
      {
        id: 'm8_chapter_order_reply',
        name: 'Send the Right Question',
        desc: 'Ask for the missing detail before the order grows beyond its actual scope.',
        objectives: [
          { id: 'm8_action_order_reply', type: 'complete_tasks', taskId: 'social_exp_01', count: 1, progress: 0 }
        ],
        actions: [
          {
            id: 'm8_action_order_reply',
            title: 'Send a precise reply',
            description: 'Complete the concrete planning task and send one clear question to the guild contact. State what is already understood and what answer is needed.',
            reveals: [
              {
                id: 'm8_reveal_order_accepted',
                title: 'The order can be carried honestly',
                body: 'The reply does not reject the work. It gives the work a boundary the guild can actually answer, which is a better beginning than an impressive promise.'
              }
            ],
            consequences: [
              {
                id: 'm8_consequence_grant_efficiency_seal',
                type: 'grant_reward',
                reward: { items: ['sello_eficiencia'] }
              },
              {
                id: 'm8_consequence_offer_guild_followup',
                type: 'make_follow_up_available',
                questId: 'm8_guild_order_followup'
              },
              {
                id: 'm8_consequence_mark_order_replied',
                type: 'set_world_state',
                path: 'm8.guild.order_replied',
                value: true
              }
            ]
          }
        ]
      }
    ],
    rewards: { xp: 165, gold: 42 },
    repeatable: false
  },

  m8_guild_order_followup: {
    id: 'm8_guild_order_followup',
    type: 'simple',
    name: 'Close the Open Line',
    desc: 'Record the guild answer and leave the order ready for the next person who needs it.',
    minLevel: 1,
    sourceOnly: true,
    origin: 'guild',
    slotGroup: 'guild_order',
    objectives: [
      { id: 'm8_guild_order_followup_action', type: 'complete_tasks', taskId: 'gestiones_exp_03', count: 1, progress: 0 }
    ],
    actions: [
      {
        id: 'm8_guild_order_followup_action',
        title: 'Close the open line',
        description: 'Complete your renewals review. Record the guild answer, the next responsible step, and any date that must not be forgotten.',
        reveals: [
          {
            id: 'm8_guild_order_followup_reveal',
            title: 'A clean handover is a real result',
            body: 'The order is no longer waiting in the wrong place. The next step has an owner, a question answered, and a date that can be checked.'
          }
        ]
      }
    ],
    rewards: { xp: 88, gold: 20 },
    repeatable: false
  },

  // ========== M8 CONTENT BLOCK 7: PERSONAL BOUNDARY ==========
  // This network explores limited help without introducing relationship
  // meters, reputation or irreversible choices.
  m8_the_part_i_can_carry: {
    id: 'm8_the_part_i_can_carry',
    type: 'story',
    name: 'The Part I Can Carry',
    desc: 'The guild order is clearer now, but another request has arrived through the same open line. I can help with one part. I need to say which part before the promise grows larger than the work.',
    minLevel: 1,
    sourceOnly: true,
    origin: 'personal',
    slotGroup: 'personal_project',
    chapters: [
      {
        id: 'm8_chapter_carry_scope',
        name: 'Choose the Part',
        desc: 'Decide what help is concrete enough to offer without taking responsibility for the whole situation.',
        objectives: [
          { id: 'm8_action_carry_scope', type: 'complete_tasks', taskId: 'social_exp_02', count: 1, progress: 0 }
        ],
        actions: [
          {
            id: 'm8_action_carry_scope',
            title: 'Listen for the actual request',
            description: 'Complete a focused conversation without multitasking. Write down what the other person is asking for and which part you can realistically help with.',
            reveals: [
              {
                id: 'm8_reveal_carry_scope',
                title: 'Help has a boundary',
                body: 'The request contains more than one problem, but I am not responsible for solving all of it. One part is clear enough to carry. The rest needs another answer.'
              }
            ],
            consequences: [
              {
                id: 'm8_consequence_prepare_limited_reply',
                type: 'create_derived_task',
                templateId: 'm8_task_prepare_limited_reply',
                status: 'accepted',
                taskTemplate: {
                  id: 'm8_task_prepare_limited_reply',
                  name: 'Prepare a bounded offer',
                  desc: 'Write a short message that states the one part you can help with, the part you cannot take on, and the next step for your offer.',
                  cat: 'social',
                  freq: 'once',
                  stats: { pre: 50, vol: 50 },
                  xp: 32,
                  availability: { type: 'once', intervalDays: null, limit: 1, repeatable: false }
                }
              }
            ]
          }
        ]
      },
      {
        id: 'm8_chapter_carry_offer',
        name: 'Make the Offer Usable',
        desc: 'Offer one specific piece of help without hiding the limit around it.',
        objectives: [
          {
            id: 'm8_action_carry_offer',
            type: 'complete_tasks',
            derivedTaskId: 'derived_m8_the_part_i_can_carry_m8_action_carry_scope_m8_task_prepare_limited_reply',
            count: 1,
            progress: 0
          }
        ],
        actions: [
          {
            id: 'm8_action_carry_offer',
            title: 'Send the bounded offer',
            description: 'Complete the temporary reply task and send the offer. Keep the boundary in the message instead of relying on the other person to infer it.',
            reveals: [
              {
                id: 'm8_reveal_carry_offer',
                title: 'The limit makes the help clearer',
                body: 'The offer is smaller than an open promise, but it is usable. The other person can accept it, decline it, or ask someone else for the part I cannot carry.'
              }
            ],
            consequences: [
              {
                id: 'm8_consequence_grant_bond_brooch',
                type: 'grant_reward',
                reward: { items: ['broche_vinculo'] }
              },
              {
                id: 'm8_consequence_mark_carry_offer_sent',
                type: 'set_world_state',
                path: 'm8.personal.bounded_offer_sent',
                value: true
              }
            ]
          }
        ]
      },
      {
        id: 'm8_chapter_carry_review',
        name: 'Leave the Rest Outside',
        desc: 'Review the offer and protect the next step from becoming another unfinished promise.',
        objectives: [
          { id: 'm8_action_carry_review', type: 'complete_tasks', taskId: 'personal_exp_03', count: 1, progress: 0 }
        ],
        actions: [
          {
            id: 'm8_action_carry_review',
            title: 'Review what remains yours',
            description: 'Complete your monthly goals review. Record the next action you actually own and leave the other person’s part outside your list.',
            reveals: [
              {
                id: 'm8_reveal_carry_review',
                title: 'Not every loose end is mine',
                body: 'The request is no longer an undefined weight. I know what I offered, what I did not offer, and what I can stop carrying in my head.'
              }
            ],
            consequences: [
              {
                id: 'm8_consequence_offer_carry_followup',
                type: 'make_follow_up_available',
                questId: 'm8_carry_followup'
              },
              {
                id: 'm8_consequence_mark_carry_reviewed',
                type: 'set_world_state',
                path: 'm8.personal.bounded_offer_reviewed',
                value: true
              }
            ]
          }
        ]
      }
    ],
    rewards: { xp: 155, gold: 34 },
    repeatable: false
  },

  m8_carry_followup: {
    id: 'm8_carry_followup',
    type: 'simple',
    name: 'Keep the Boundary Visible',
    desc: 'Follow up on the part you offered without quietly accepting the whole problem.',
    minLevel: 1,
    sourceOnly: true,
    origin: 'personal',
    slotGroup: 'personal_project',
    objectives: [
      { id: 'm8_carry_followup_action', type: 'complete_tasks', taskId: 'social_exp_01', count: 1, progress: 0 }
    ],
    actions: [
      {
        id: 'm8_carry_followup_action',
        title: 'Follow up without expanding the promise',
        description: 'Complete the concrete planning task and send a short follow-up about the part you offered. Do not add new work unless you explicitly choose it.',
        reveals: [
          {
            id: 'm8_carry_followup_reveal',
            title: 'A promise can stay its own size',
            body: 'The follow-up keeps the useful thread alive without making the original offer larger by accident. That is enough to close this part cleanly.'
          }
        ]
      }
    ],
    rewards: { xp: 86, gold: 18 },
    repeatable: false
  },

  // ========== M8 CONTENT BLOCK 8: OBJECT DISCOVERY ==========
  // This network uses an existing material and its canonical use boundary.
  // It adds no item, save field or new interaction subsystem.
  m8_the_blank_space: {
    id: 'm8_the_blank_space',
    type: 'story',
    name: 'The Blank Space',
    desc: 'The last request is no longer taking up the whole room in my head. While putting the records back in order, I notice a blank space that looks intentional.',
    minLevel: 1,
    sourceOnly: true,
    origin: 'personal',
    slotGroup: 'personal_project',
    chapters: [
      {
        id: 'm8_chapter_blank_space',
        name: 'What Was Left Open',
        desc: 'Look at the gap in the records and establish whether it is missing information or room left for a reason.',
        objectives: [
          { id: 'm8_action_blank_space', type: 'complete_tasks', taskId: 'gestiones_exp_02', count: 1, progress: 0 }
        ],
        actions: [
          {
            id: 'm8_action_blank_space',
            title: 'Check the gap',
            description: 'Complete your digital folder session. Look at one place where information is missing or separated, and write down whether the gap needs filling or simply needs a clear label.',
            reveals: [
              {
                id: 'm8_reveal_blank_space_intentional',
                title: 'The gap was left open',
                body: 'The blank space is not damage. It was left for something that had not happened yet, which is a quieter instruction than a finished page would have been.'
              }
            ],
            consequences: [
              {
                id: 'm8_consequence_grant_prepared_vellum',
                type: 'grant_reward',
                reward: { items: ['pergamino_blanco'] }
              },
              {
                id: 'm8_consequence_prepare_blank_space',
                type: 'create_derived_task',
                templateId: 'm8_task_prepare_blank_space',
                status: 'accepted',
                taskTemplate: {
                  id: 'm8_task_prepare_blank_space',
                  name: 'Give the blank space a purpose',
                  desc: 'Write one short note about what belongs in the blank space and what does not. Keep the note practical and leave the uncertain part open.',
                  cat: 'personal',
                  freq: 'once',
                  stats: { int: 50, vol: 50 },
                  xp: 30,
                  availability: { type: 'once', intervalDays: null, limit: 1, repeatable: false }
                }
              }
            ]
          }
        ]
      },
      {
        id: 'm8_chapter_blank_space_used',
        name: 'Write Only What Helps',
        desc: 'Use the prepared material to make the next piece of information easier to place.',
        objectives: [
          {
            id: 'm8_action_blank_space_used',
            type: 'complete_tasks',
            derivedTaskId: 'derived_m8_the_blank_space_m8_action_blank_space_m8_task_prepare_blank_space',
            count: 1,
            progress: 0
          }
        ],
        actions: [
          {
            id: 'm8_action_blank_space_used',
            title: 'Keep the page open',
            description: 'Complete the temporary note task. Use the recovered material as a place for one useful line, not as a reason to fill every empty space.',
            reveals: [
              {
                id: 'm8_reveal_blank_space_function',
                title: 'An empty place can be useful',
                body: 'The material is not asking for a complete explanation. It gives the next useful detail somewhere to land without forcing the rest to be decided early.'
              }
            ],
            consequences: [
              {
                id: 'm8_consequence_unlock_prepared_vellum_use',
                type: 'unlock_item_use',
                materialId: 'pergamino_blanco',
                useId: 'm8_use_prepared_vellum'
              },
              {
                id: 'm8_consequence_mark_blank_space_ready',
                type: 'set_world_state',
                path: 'm8.object.blank_space_ready',
                value: true
              }
            ]
          }
        ]
      },
      {
        id: 'm8_chapter_blank_space_trial',
        name: 'Add One Useful Line',
        desc: 'Use the clarified space during one ordinary piece of work and keep the result small.',
        objectives: [
          { id: 'm8_action_blank_space_trial', type: 'complete_tasks', taskId: 'personal_exp_01', count: 1, progress: 0 }
        ],
        actions: [
          {
            id: 'm8_action_blank_space_trial',
            title: 'Test the open place',
            description: 'Complete one focused project block. Add one useful line to the prepared space and stop before the note becomes another project.',
            reveals: [
              {
                id: 'm8_reveal_blank_space_kept',
                title: 'The record can grow slowly',
                body: 'The blank space did not need to be solved in one sitting. It became useful because one line could be added without demanding the whole answer.'
              }
            ],
            consequences: [
              {
                id: 'm8_consequence_offer_blank_space_followup',
                type: 'make_follow_up_available',
                questId: 'm8_blank_space_followup'
              },
              {
                id: 'm8_consequence_mark_blank_space_used',
                type: 'set_world_state',
                path: 'm8.object.blank_space_used',
                value: true
              }
            ]
          }
        ]
      }
    ],
    rewards: { xp: 148, gold: 33 },
    repeatable: false
  },

  m8_blank_space_followup: {
    id: 'm8_blank_space_followup',
    type: 'simple',
    name: 'Keep the Page Findable',
    desc: 'Leave the useful record where the next session can reach it without another search.',
    minLevel: 1,
    sourceOnly: true,
    origin: 'personal',
    slotGroup: 'personal_project',
    objectives: [
      { id: 'm8_blank_space_followup_action', type: 'complete_tasks', taskId: 'gestiones_exp_03', count: 1, progress: 0 }
    ],
    actions: [
      {
        id: 'm8_blank_space_followup_action',
        title: 'Make the page easy to find',
        description: 'Complete your renewals review and leave the useful record in the place where you check dates and commitments. Remove any duplicate note.',
        reveals: [
          {
            id: 'm8_blank_space_followup_reveal',
            title: 'Findability is part of the work',
            body: 'The page is not valuable because it is mysterious. It is valuable because the next useful line can be found when it is needed.'
          }
        ]
      }
    ],
    rewards: { xp: 84, gold: 18 },
    repeatable: false
  },

  // ========== M8 CONTENT BLOCK 9: REFUGE PROJECT ==========
  // This network improves a repeatable preparation point through declarative
  // state. It does not add storage, capacity or a new refuge subsystem.
  m8_the_place_for_returning: {
    id: 'm8_the_place_for_returning',
    type: 'story',
    name: 'The Place for Returning',
    desc: 'The blank page has a purpose now, and the prepared surface is easier to use. The next problem is quieter: I still do not have one reliable place to begin when I return after a break.',
    minLevel: 1,
    sourceOnly: true,
    origin: 'personal',
    slotGroup: 'personal_project',
    chapters: [
      {
        id: 'm8_chapter_returning_choice',
        name: 'Choose the Point of Return',
        desc: 'Choose one existing place or arrangement that can serve as a clear beginning after an interruption.',
        objectives: [
          { id: 'm8_action_returning_choice', type: 'complete_tasks', taskId: 'casa_exp_03', count: 1, progress: 0 }
        ],
        actions: [
          {
            id: 'm8_action_returning_choice',
            title: 'Choose one point of return',
            description: 'Complete the first-aid kit and expiry-date check. While doing it, choose one small place or arrangement that can show you where to begin after a break.',
            reveals: [
              {
                id: 'm8_reveal_returning_point',
                title: 'A return needs a visible edge',
                body: 'The place does not need to hold everything. It only needs to make the first step recognisable when memory and momentum are not available.'
              }
            ],
            consequences: [
              {
                id: 'm8_consequence_prepare_return_point',
                type: 'create_derived_task',
                templateId: 'm8_task_prepare_return_point',
                status: 'accepted',
                taskTemplate: {
                  id: 'm8_task_prepare_return_point',
                  name: 'Prepare the point of return',
                  desc: 'Prepare one small point of return for a future session. Leave the next useful item, note, or instruction visible and remove only what blocks it.',
                  cat: 'casa',
                  freq: 'once',
                  stats: { vol: 50, des: 50 },
                  xp: 30,
                  availability: { type: 'once', intervalDays: null, limit: 1, repeatable: false }
                }
              }
            ]
          }
        ]
      },
      {
        id: 'm8_chapter_returning_prepared',
        name: 'Make the Return Obvious',
        desc: 'Prepare the chosen point without expanding it into a full reorganisation.',
        objectives: [
          {
            id: 'm8_action_returning_prepared',
            type: 'complete_tasks',
            derivedTaskId: 'derived_m8_the_place_for_returning_m8_action_returning_choice_m8_task_prepare_return_point',
            count: 1,
            progress: 0
          }
        ],
        actions: [
          {
            id: 'm8_action_returning_prepared',
            title: 'Leave a simple beginning',
            description: 'Complete the temporary refuge task. Keep the chosen point small, visible, and easy to restore without another planning session.',
            reveals: [
              {
                id: 'm8_reveal_returning_prepared',
                title: 'The beginning is waiting',
                body: 'The point of return is not a command. It is an invitation that remains readable when the previous session is no longer in reach.'
              }
            ],
            consequences: [
              {
                id: 'm8_consequence_grant_everyday_shield',
                type: 'grant_reward',
                reward: { items: ['escudo_cotidiano'] }
              },
              {
                id: 'm8_consequence_mark_return_point_ready',
                type: 'set_world_state',
                path: 'm8.refuge.return_point_ready',
                value: true
              }
            ]
          }
        ]
      },
      {
        id: 'm8_chapter_returning_tested',
        name: 'Come Back Once',
        desc: 'Return to the prepared point after a pause and check whether it gives you a beginning instead of another decision.',
        objectives: [
          { id: 'm8_action_returning_tested', type: 'complete_tasks', taskId: 'personal_exp_01', count: 1, progress: 0 }
        ],
        actions: [
          {
            id: 'm8_action_returning_tested',
            title: 'Use the point after a pause',
            description: 'Complete one focused project block starting from the prepared point. Note whether it reduced the number of decisions needed to begin.',
            reveals: [
              {
                id: 'm8_reveal_returning_works',
                title: 'Returning can be a skill',
                body: 'The point did not preserve the whole plan. It preserved enough of the beginning for the work to become available again.'
              }
            ],
            consequences: [
              {
                id: 'm8_consequence_offer_returning_followup',
                type: 'make_follow_up_available',
                questId: 'm8_returning_followup'
              },
              {
                id: 'm8_consequence_mark_return_point_tested',
                type: 'set_world_state',
                path: 'm8.refuge.return_point_tested',
                value: true
              }
            ]
          }
        ]
      }
    ],
    rewards: { xp: 152, gold: 35 },
    repeatable: false
  },

  m8_returning_followup: {
    id: 'm8_returning_followup',
    type: 'simple',
    name: 'Keep the First Step Clear',
    desc: 'Maintain the point of return without turning it into another obligation to manage.',
    minLevel: 1,
    sourceOnly: true,
    origin: 'personal',
    slotGroup: 'personal_project',
    objectives: [
      { id: 'm8_returning_followup_action', type: 'complete_tasks', taskId: 'casa_exp_02', count: 1, progress: 0 }
    ],
    actions: [
      {
        id: 'm8_returning_followup_action',
        title: 'Protect the first step',
        description: 'Complete the focused cleaning task in one area. Keep the point of return recognisable and remove only what makes the next beginning harder.',
        reveals: [
          {
            id: 'm8_returning_followup_reveal',
            title: 'The refuge does not need to be perfect',
            body: 'A reliable beginning is not a finished system. It is a small place that stays available when the rest of the week has moved on.'
          }
        ]
      }
    ],
    rewards: { xp: 86, gold: 18 },
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
  },

  m8_page_margin_source: {
    id: 'm8_page_margin_source',
    type: 'passive',
    questId: 'm8_margin_in_the_page',
    title: 'A mark in the recovered page',
    description: 'The page you recovered has a margin mark that does not belong to the method around it. Read it again before you use the page further.',
    delivery: 'available',
    requirements: {
      minLevel: 1,
      worldState: { 'm7.refuge.signal_resolved': true }
    }
  },
  m8_page_margin_recovery: {
    id: 'm8_page_margin_recovery',
    type: 'recovery',
    questId: 'm8_margin_in_the_page',
    targetActionId: 'm8_action_page_observation',
    message: 'Start with the recovered page. Read it once, mark the part that does not fit, and write down what you actually know.',
    delivery: 'available'
  },

  m8_piece_between_pages_source: {
    id: 'm8_piece_between_pages_source',
    type: 'passive',
    questId: 'm8_the_piece_between_pages',
    title: 'Something between the pages',
    description: 'The useful instruction has led to another inconsistency: a loose piece pressed between two pages. Record what you can before guessing what it means.',
    delivery: 'available',
    requirements: {
      minLevel: 1,
      worldState: { 'm8.page.instruction_trialled': true }
    }
  },
  m8_piece_between_pages_recovery: {
    id: 'm8_piece_between_pages_recovery',
    type: 'recovery',
    questId: 'm8_the_piece_between_pages',
    targetActionId: 'm8_action_piece_found',
    message: 'Start with the records around the recovered page. Note where the loose piece was found, what it looks like, and what remains uncertain.',
    delivery: 'available'
  },

  m8_clear_surface_source: {
    id: 'm8_clear_surface_source',
    type: 'passive',
    questId: 'm8_one_clear_surface',
    title: 'One clear surface',
    description: 'The record is reachable now, but the place where you begin work still adds friction. Improve one bounded part without rebuilding everything.',
    delivery: 'available',
    requirements: {
      minLevel: 1,
      worldState: { 'm8.fragment.record_kept': true }
    }
  },
  m8_clear_surface_recovery: {
    id: 'm8_clear_surface_recovery',
    type: 'recovery',
    questId: 'm8_one_clear_surface',
    targetActionId: 'm8_action_surface_notice',
    message: 'Start with one place where you begin work. Name one concrete obstruction before trying to change it.',
    delivery: 'available'
  },

  m8_footprints_after_quiet_source: {
    id: 'm8_footprints_after_quiet_source',
    type: 'passive',
    questId: 'm8_footprints_after_the_quiet',
    title: 'Footprints after the quiet',
    description: 'Something disturbed the place where you had prepared a beginning. Look at what remains before deciding what it means.',
    delivery: 'available',
    requirements: {
      minLevel: 1,
      worldState: { 'm8.refuge.clear_surface_tested': true }
    }
  },
  m8_footprints_after_quiet_recovery: {
    id: 'm8_footprints_after_quiet_recovery',
    type: 'recovery',
    questId: 'm8_footprints_after_the_quiet',
    targetActionId: 'm8_action_aftermath_notice',
    message: 'Start with one concrete change in the prepared place. Record what you saw before deciding what caused it.',
    delivery: 'available'
  },

  m8_unsealed_order_source: {
    id: 'm8_unsealed_order_source',
    type: 'guild',
    questId: 'm8_the_unsealed_order',
    title: 'An order without a seal',
    description: 'The guild has sent an order with missing context. Read what is actually requested before accepting more work.',
    delivery: 'available',
    requiresGuild: true,
    slotGroup: 'guild_order',
    requirements: {
      minLevel: 1,
      requiresGuild: true
    }
  },
  m8_unsealed_order_recovery: {
    id: 'm8_unsealed_order_recovery',
    type: 'recovery',
    questId: 'm8_the_unsealed_order',
    targetActionId: 'm8_action_order_scope',
    message: 'Start by putting the order and its supporting information together. Write down the requested result and the missing question.',
    delivery: 'available'
  },

  m8_part_i_can_carry_source: {
    id: 'm8_part_i_can_carry_source',
    type: 'passive',
    questId: 'm8_the_part_i_can_carry',
    title: 'The part I can carry',
    description: 'Another request has arrived through the open line. Listen for the part you can honestly help with before you answer.',
    delivery: 'available',
    requirements: {
      minLevel: 1,
      worldState: { 'm8.guild.order_replied': true }
    }
  },
  m8_part_i_can_carry_recovery: {
    id: 'm8_part_i_can_carry_recovery',
    type: 'recovery',
    questId: 'm8_the_part_i_can_carry',
    targetActionId: 'm8_action_carry_scope',
    message: 'Start with a focused conversation. Write down the actual request and the one part you can realistically help with.',
    delivery: 'available'
  },

  m8_blank_space_source: {
    id: 'm8_blank_space_source',
    type: 'passive',
    questId: 'm8_the_blank_space',
    title: 'A blank space left open',
    description: 'The records contain a gap that looks intentional. Check whether it needs information or simply needs a clear purpose.',
    delivery: 'available',
    requirements: {
      minLevel: 1,
      worldState: { 'm8.personal.bounded_offer_reviewed': true }
    }
  },
  m8_blank_space_recovery: {
    id: 'm8_blank_space_recovery',
    type: 'recovery',
    questId: 'm8_the_blank_space',
    targetActionId: 'm8_action_blank_space',
    message: 'Start with one digital folder or record. Look at the gap, write down what is missing, and decide whether it needs filling.',
    delivery: 'available'
  },

  m8_place_for_returning_source: {
    id: 'm8_place_for_returning_source',
    type: 'passive',
    questId: 'm8_the_place_for_returning',
    title: 'A place for returning',
    description: 'The prepared surface and the open record are useful, but there is still no obvious beginning after a break. Choose one small point of return.',
    delivery: 'available',
    requirements: {
      minLevel: 1,
      worldState: { 'm8.object.blank_space_used': true }
    }
  },
  m8_place_for_returning_recovery: {
    id: 'm8_place_for_returning_recovery',
    type: 'recovery',
    questId: 'm8_the_place_for_returning',
    targetActionId: 'm8_action_returning_choice',
    message: 'Start with one place that could show you where to begin after a break. Choose a small point of return before trying to reorganise anything else.',
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
