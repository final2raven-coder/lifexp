// ===========================================================================
// LifeXP RPG - Item Flavor Text System
// Extracted from game.js (Fase F saneamiento)
// ===========================================================================
//
// ITEM_FLAVOR_TEXT: per-item, per-situation English narrative text.
// getItemFlavorText(itemId, situation): accessor with type-generic fallbacks.
//
// This file must be loaded BEFORE game.js in index.html.
// ===========================================================================

// ===========================================================================
// ITEM FLAVOR TEXT SYSTEM
// Per-item, per-situation English narrative text.
// Situations:
//   first_look     — first time the modal is opened (item only in inventory)
//   equip_fail_1   — first failed equip attempt
//   equip_fail_n   — subsequent failed equip attempts
//   equip_success  — first successful equip
//   attune_1/2/3   — attunement stage advances
//   ritual         — ritual/activation triggered
// ===========================================================================

const ITEM_FLAVOR_TEXT = {

  // == WEAPONS ==============================================================

  cuchilla_llameante: {
    first_look:    'The blade is warm to the touch. Not hot — warm, the way a stone holds heat long after the fire has moved on. You do not know yet what it asks of you.',
    equip_fail_1:  'Your hand closes around the grip and the warmth pulls back. The sword does not resist you. It simply waits, as if it already knows you are not ready.',
    equip_fail_n:  'Again the heat retreats when you reach for it. Something in the blade measures you each time. You are closer than you were. That is not nothing.',
    equip_success: 'The warmth does not retreat this time. It spreads up your arm slowly, like a fire remembering how to breathe. The blade is yours now — or you are its.',
    attune_1:      'The edge catches the light differently. You notice it only when you stop looking directly at it.',
    attune_2:      'During a task, the grip grew hot for a moment. You did not drop it. The blade noticed.',
    attune_3:      'The old heat answers without being forced. Whatever the sword was waiting for, you have become it.',
    ritual:        'The pressure builds in the blade and releases in a single breath. The second burn is shorter, sharper. The sword has remembered something it had forgotten.'
  },

  daga_corrosiva: {
    first_look:    'The edge is dark where the acid has eaten into the metal. It should be ruined. Instead it is sharper than anything you have seen. You are not sure whether to be impressed or careful.',
    equip_fail_1:  'The dagger slips from your grip — not from your hand, but from something deeper. Your body knows it is not ready to carry what this blade has already dissolved.',
    equip_fail_n:  'The acid smell is stronger when you try. The blade is patient. It has been waiting a long time already.',
    equip_success: 'The grip settles into your hand like it was always going to end up there. The acid smell fades. The dagger has decided you are worth the wait.',
    attune_1:      'The corrosion pattern shifts slightly when you hold it. You are not imagining it.',
    attune_2:      'A task left a mark on your hands. The dagger recognized it.',
    attune_3:      'The blade and the acid have reached an agreement. So have you and the blade.'
  },

  espada_radiante: {
    first_look:    'The light it holds is not a reflection. It comes from somewhere inside the metal, steady and unhurried. You have the feeling it has been waiting in the dark for a long time.',
    equip_fail_1:  'The light dims when you reach for the hilt. Not in anger — more like a candle behind glass. The sword is not refusing you. It is asking whether you are ready to carry something that does not hide.',
    equip_fail_n:  'The light is still there. It has not given up on you. That is worth something.',
    equip_success: 'The light does not dim this time. It steadies, as if it has found the hand it was looking for. You feel it in your chest before you feel it in your arm.',
    attune_1:      'Shadows near the blade behave differently. They do not flee — they simply make room.',
    attune_2:      'You completed something difficult. The sword was brighter for the rest of the day.',
    attune_3:      'The light is yours now. Not borrowed. Not lent. Yours.'
  },

  hoja_gelida: {
    first_look:    'The cold does not come from the air around it. It comes from the blade itself, as if it is remembering a winter that has not ended yet.',
    equip_fail_1:  'The cold bites your fingers and you let go before you mean to. The blade is not cruel. It simply requires a steadiness you have not built yet.',
    equip_fail_n:  'The cold is the same each time. You are the one who is changing.',
    equip_success: 'The cold settles into your grip and stays there, familiar now. The blade has decided you can hold something that does not warm to you.',
    attune_1:      'Your breath fogs near the blade even in warm rooms.',
    attune_2:      'You held something difficult without flinching. The blade registered it.',
    attune_3:      'The cold is no longer uncomfortable. It is simply part of how you hold things now.'
  },

  arco_espino: {
    first_look:    'The wood is old but not brittle. It bends without complaint. You get the sense it has been waiting for someone who knows how to be patient.',
    equip_fail_1:  'The bow does not resist you. It simply does not respond. Like asking a question to someone who has decided to wait before answering.',
    equip_fail_n:  'The wood is still warm from the last time you tried. It remembers.',
    equip_success: 'The string settles into your fingers and the bow bends without effort. The thorn pattern on the grip fits your hand exactly. It was always going to be yours.',
    attune_1:      'The wood has a faint pulse when you hold it still.',
    attune_2:      'You completed something that required patience. The bow responded.',
    attune_3:      'The bow and the archer have reached an understanding that does not need words.'
  },

  tridente_marino: {
    first_look:    'The metal is cold and smells of deep water. The three prongs are not decorative. Whatever this was made for, it was not ceremony.',
    equip_fail_1:  'The weight is wrong in your hands — not too heavy, but distributed for a body that moves differently than yours does now. The sea asks for a different kind of readiness.',
    equip_fail_n:  'The salt smell is stronger when you try. The trident is patient. The sea always is.',
    equip_success: 'The weight redistributes itself the moment you commit. The trident has found its bearer. The sea has made its choice.',
    attune_1:      'The metal is slightly warmer than it should be. The cold is retreating.',
    attune_2:      'You completed something that required endurance. The trident registered it.',
    attune_3:      'The deep water in the metal has accepted you. You can feel the current when you hold it still.'
  },

  katana_oriental: {
    first_look:    'The blade was folded many times. You can see the layers if you look at the right angle. Each one is a decision someone made a long time ago.',
    equip_fail_1:  'The sword does not move when you reach for it. Not resistance — stillness. The kind that comes from knowing exactly what it is waiting for.',
    equip_fail_n:  'The stillness is the same. You are the one who is different each time you try.',
    equip_success: 'The sword comes to your hand without hesitation. The layers in the blade catch the light differently now. Something has been decided.',
    attune_1:      'The edge holds its angle longer than it should.',
    attune_2:      'You completed something with precision. The blade noticed the quality of the work.',
    attune_3:      'The sword and the hand have become one decision. The masters who made it would recognize what you have become.'
  },

  baculo_liche: {
    first_look:    'The wood is cold and the carved symbols shift when you are not looking directly at them. This belonged to something that is no longer alive. That does not mean it is harmless.',
    equip_fail_1:  'The staff pulls away from your hand with a sound like a page turning. Whatever intelligence remains in the wood has decided you are not yet worth the risk.',
    equip_fail_n:  'The symbols are different each time you look. The staff is reading you as carefully as you are reading it.',
    equip_success: 'The cold settles and the symbols stop moving. The staff has made its assessment. You are not what it expected, but you are enough.',
    attune_1:      'The carved symbols have stopped shifting. One of them has become legible.',
    attune_2:      'You completed something that required understanding something difficult. The staff grew heavier for a moment, then lighter.',
    attune_3:      'The intelligence in the wood has accepted you as its current keeper. It does not trust you. It has simply decided to work with you.'
  },

  daga_asesino: {
    first_look:    'The blade has no maker\'s mark. The balance is perfect. Someone spent a long time making sure this would never be traced back to them.',
    equip_fail_1:  'The grip is wrong in your hand — not uncomfortable, but designed for a different kind of intention. The dagger knows the difference.',
    equip_fail_n:  'The balance is still perfect. You are the variable.',
    equip_success: 'The grip settles and the balance shifts to meet you. The dagger has accepted a new kind of intention. It will work with what you bring.',
    attune_1:      'The blade disappears in shadow more completely than it should.',
    attune_2:      'You completed something that required discretion. The dagger registered the quality of the approach.',
    attune_3:      'The dagger has learned your intentions. It has decided they are worth serving.'
  },

  daga_oxidada: {
    first_look:    'The rust is old and the edge is dull. Someone kept this anyway. That means something, even if you do not know what yet.',
    equip_fail_1:  'The grip crumbles slightly at the pressure. The dagger is not refusing you — it is simply not ready to be used by someone who does not know its history.',
    equip_fail_n:  'The rust has not spread. The dagger is holding on.',
    equip_success: 'The grip holds. The dagger has decided you are worth the effort of staying together.',
    attune_1:      'The rust has receded slightly near the edge.',
    attune_2:      'You completed something that required persistence. The dagger responded.',
    attune_3:      'The rust is gone from the edge entirely. Whatever this blade was before, it is becoming something again.'
  },

  // == ARMOR =================================================================

  escudo_antiveneno: {
    first_look:    'The surface is marked with old stains that did not eat through. Whatever was thrown at this shield, it held. You wonder what the person behind it was protecting.',
    equip_fail_1:  'The straps do not fit. Not because they are the wrong size — because your arm has not yet learned the weight of what it means to stand between something and the thing trying to reach it.',
    equip_fail_n:  'The straps are the same. You are learning what they are asking for.',
    equip_success: 'The straps settle and the weight distributes correctly. The shield has found someone willing to stand in front of things.',
    attune_1:      'The stains on the surface have faded slightly.',
    attune_2:      'You completed something that required protecting something or someone. The shield registered it.',
    attune_3:      'The shield and the arm have become one decision. Whatever comes, you will not step aside.'
  },

  armadura_invierno: {
    first_look:    'The metal is cold even in a warm room. The joints move without sound. Whoever made this understood that winter is not an obstacle — it is a condition you learn to move inside.',
    equip_fail_1:  'The armor does not close around you. Not because it is the wrong size — because your body has not yet learned to carry cold without flinching.',
    equip_fail_n:  'The cold is the same each time. You are the one who is changing.',
    equip_success: 'The armor closes and the cold becomes familiar. You have learned to carry winter. The armor has decided you are ready for what comes next.',
    attune_1:      'The joints move more quietly than before.',
    attune_2:      'You completed something in difficult conditions. The armor registered the endurance.',
    attune_3:      'The cold is no longer something you endure. It is something you carry. The armor knows the difference.'
  },

  capa_alba: {
    first_look:    'The fabric catches the light at the edges. Not a reflection — something woven into the material itself. You have the feeling it was made for a specific kind of morning.',
    equip_fail_1:  'The clasp does not hold. The cape is not refusing you — it is waiting for the right kind of beginning. You have not found it yet.',
    equip_fail_n:  'The light at the edges is still there. It has not given up on you.',
    equip_success: 'The clasp holds and the light settles around you. The cape has found its morning. So have you.',
    attune_1:      'The light at the edges is brighter in the early hours.',
    attune_2:      'You completed something at the start of a day. The cape registered the intention.',
    attune_3:      'The cape and the morning have become the same thing. Whatever you begin now, you begin with light.'
  },

  capa_ligera: {
    first_look:    'It weighs almost nothing. The fabric moves before the wind does. Someone made this for someone who needed to move without being slowed down by what they were carrying.',
    equip_fail_1:  'The cape slides off before you can fasten it. It is not rejecting you — it is simply designed for a different kind of readiness.',
    equip_fail_n:  'The fabric is still light. You are the one who needs to become lighter.',
    equip_success: 'The cape settles and stays. You are ready to move. The cape has decided to come with you.',
    attune_1:      'The fabric moves a moment before you do.',
    attune_2:      'You completed something quickly and well. The cape registered the efficiency.',
    attune_3:      'The cape and the movement are the same thing now. You do not wear it. You carry it the way you carry your own speed.'
  },

  escamas_sirena: {
    first_look:    'The scales shift color when you move them. Not iridescent — something deeper, like they are responding to something you cannot see. The ocean is very far away. The scales do not seem to know that.',
    equip_fail_1:  'The scales pull away from your skin. The ocean has not decided you are ready for what it is willing to lend.',
    equip_fail_n:  'The color shifts are slower now. The scales are considering you.',
    equip_success: 'The scales settle against your skin and the color steadies. The ocean has made its decision. You are its representative on dry land.',
    attune_1:      'The scales are warmer than they should be.',
    attune_2:      'You completed something that required depth or endurance. The scales registered it.',
    attune_3:      'The ocean and the land have reached an agreement through you. The scales are proof.'
  },

  botas_viajero: {
    first_look:    'The leather is worn in exactly the right places. Someone walked a very long way in these. The road they traveled is still in the soles.',
    equip_fail_1:  'The boots do not fit — not in size, but in intention. They were made for someone who had already decided where they were going.',
    equip_fail_n:  'The worn places in the leather are the same. You are the one who is deciding.',
    equip_success: 'The boots settle and the road in the soles becomes yours. You have decided where you are going. The boots have decided to take you there.',
    attune_1:      'The leather has softened slightly around your feet.',
    attune_2:      'You completed something that required going somewhere or doing something outside. The boots registered the distance.',
    attune_3:      'The road in the soles is yours now. Every step you take adds to it.'
  },

  capa_sombras: {
    first_look:    'The fabric is darker than the room it is in. Not black — something that absorbs the light around it without reflecting anything back. You are not sure whether it is hiding you or hiding from you.',
    equip_fail_1:  'The cape does not settle on your shoulders. It is waiting for someone who understands the difference between hiding and choosing not to be seen.',
    equip_fail_n:  'The darkness in the fabric is the same. You are learning the difference.',
    equip_success: 'The cape settles and the room adjusts around you. You have learned the difference. The cape has decided you are ready to use it.',
    attune_1:      'Shadows near you are slightly deeper than they should be.',
    attune_2:      'You completed something that required discretion or careful timing. The cape registered the approach.',
    attune_3:      'The cape and the shadow are the same thing now. You do not hide. You simply choose when to be visible.'
  },

  // == ACCESSORIES ==========================================================

  amuleto_brisa: {
    first_look:    'The charm is light enough that you keep checking whether you dropped it. The wind near it moves differently — not stronger, just more deliberate.',
    equip_fail_1:  'The chain slips through your fingers before you can fasten it. The wind is not ready to follow you yet.',
    equip_fail_n:  'The charm is still there. The wind is still considering you.',
    equip_success: 'The chain holds and the wind near you shifts. It has decided to come with you.',
    attune_1:      'The air near you moves slightly before you do.',
    attune_2:      'You completed something outdoors or in open space. The charm registered the exposure.',
    attune_3:      'The wind and the charm have made you their agreement. You move together now.'
  },

  cristal_solar: {
    first_look:    'The crystal is warm even in shadow. It holds the light from somewhere else — somewhere the sun was stronger than it is here.',
    equip_fail_1:  'The crystal dims when you try to wear it. It is not refusing you. It is waiting for you to bring something worth illuminating.',
    equip_fail_n:  'The warmth is still there. The crystal has not given up.',
    equip_success: 'The crystal brightens when you fasten it. You have brought something worth illuminating. The sun has decided to lend you some of what it stored.',
    attune_1:      'The crystal is warmer in the morning than in the afternoon.',
    attune_2:      'You completed something in daylight or with clear intention. The crystal registered it.',
    attune_3:      'The stored light is yours now. The crystal has finished its work. You carry the sun.'
  },

  perla_marina: {
    first_look:    'The pearl is heavier than it looks. Something is inside it — not a sound, but the memory of pressure. The deep ocean does not give things up easily.',
    equip_fail_1:  'The pearl pulls away from your hand. The deep ocean has not decided you are ready for what it is willing to share.',
    equip_fail_n:  'The weight is the same. You are the one who is changing.',
    equip_success: 'The pearl settles and the weight becomes familiar. The deep ocean has made its decision. You carry its memory now.',
    attune_1:      'The pearl is slightly warmer than the water around it.',
    attune_2:      'You completed something that required depth or sustained effort. The pearl registered it.',
    attune_3:      'The deep ocean and the surface have reached an agreement through you. The pearl is the proof.'
  },

  rosario_concentracion: {
    first_look:    'Each bead is slightly different from the others. Someone counted them many times. The counting is still in the material.',
    equip_fail_1:  'The beads slip through your fingers before you can hold them still. The rosary is waiting for hands that have learned to be patient.',
    equip_fail_n:  'The counting is still in the beads. You are learning to be still enough to feel it.',
    equip_success: 'The beads settle in your hands and the counting becomes yours. You have learned to be still. The rosary has decided to help you stay that way.',
    attune_1:      'The beads are warmer than they should be.',
    attune_2:      'You completed something that required focus or sustained attention. The rosary registered the quality of the effort.',
    attune_3:      'The counting and the stillness are the same thing now. The rosary has finished teaching you. You carry the lesson.'
  },

  cuentas_jade: {
    first_look:    'The jade is cool and the color is deeper than it looks in photographs. Someone brought these a very long way. The distance is still in the stone.',
    equip_fail_1:  'The beads do not settle around your wrist. The distance in the stone is waiting for someone who understands what it means to carry something from far away.',
    equip_fail_n:  'The cool is the same. You are learning what the distance means.',
    equip_success: 'The beads settle and the cool becomes familiar. The distance in the stone is yours now. You carry what was brought from far away.',
    attune_1:      'The jade is slightly warmer near your skin.',
    attune_2:      'You completed something that required patience or long-term thinking. The beads registered it.',
    attune_3:      'The distance and the arrival are the same thing now. The jade has accepted you as its current destination.'
  },

  sello_alianza: {
    first_look:    'The signet has no crest. The metal bears a thumbprint that will not polish away. Someone made a promise with this. The promise is still in the metal.',
    equip_fail_1:  'The ring does not fit — not in size, but in weight. It is waiting for someone who has something worth promising.',
    equip_fail_n:  'The thumbprint is still there. The promise is still waiting.',
    equip_success: 'The ring settles and the weight becomes familiar. You have something worth promising. The seal has decided to carry it.',
    attune_1:      'The metal is warmer near the thumbprint.',
    attune_2:      'You completed something social or kept a commitment. The seal registered the quality of the follow-through.',
    attune_3:      'The promise and the seal are the same thing now. Whatever you commit to, the seal carries it with you.'
  },

  amuleto_espacio: {
    first_look:    'The charm is small but the pocket on the inside is not. Nothing placed there makes the same sound twice. You are not sure whether that is a feature or a warning.',
    equip_fail_1:  'The charm does not open for you. The space inside is waiting for someone who understands that more room is not the same as more capacity.',
    equip_fail_n:  'The pocket is still there. You are learning the difference.',
    equip_success: 'The charm opens and the space inside settles. You understand the difference now. The charm has decided you are ready for more room.',
    attune_1:      'The sounds from inside the pocket are slightly different each time.',
    attune_2:      'You completed something that required organization or managing multiple things at once. The charm registered it.',
    attune_3:      'The space inside and the space outside have reached an agreement through you. You carry more than you appear to.'
  },

  amuleto_bosque: {
    first_look:    'The wood is still alive. Not growing — but not dead either. Something in the forest decided this piece was worth keeping separate from the rest.',
    equip_fail_1:  'The amulet pulls away from your hand. The forest has not decided you are ready for what it is willing to share.',
    equip_fail_n:  'The wood is still warm. The forest is still considering you.',
    equip_success: 'The amulet settles and the warmth becomes familiar. The forest has made its decision. You carry its attention now.',
    attune_1:      'The wood is slightly warmer near living things.',
    attune_2:      'You completed something outdoors or involving care for living things. The amulet registered it.',
    attune_3:      'The forest and the keeper are the same thing now. The amulet has finished its work.'
  },

  // == ARTIFACTS ============================================================

  orbe_mental: {
    first_look:    'The sphere reflects a room with one extra chair. The chair is always empty. You are not sure whether that is a promise or a question.',
    equip_fail_1:  'The sphere grows cold when you reach for it. The room in the reflection has not decided you are ready to sit in the extra chair.',
    equip_fail_n:  'The chair is still empty. The sphere is still considering you.',
    equip_success: 'The sphere warms and the reflection steadies. The extra chair is yours now. The sphere has decided you are ready to use what it offers.',
    attune_1:      'The room in the reflection is slightly larger.',
    attune_2:      'You completed something that required sustained mental effort. The sphere registered the quality of the thinking.',
    attune_3:      'The room in the reflection is full of chairs now. The sphere has finished its assessment. You carry the capacity.',
    ritual:        'The sphere grows very still. The room in the reflection empties. Then it fills again, differently. Something has been reorganized.'
  },

  dado_destino: {
    first_look:    'Six faces, seven tally marks. It always lands on a corner when nobody is watching. You count the marks again. There are still seven.',
    equip_fail_1:  'The die rolls off your palm before you can close your hand. It lands on a corner. It is not ready to be carried by someone who has not accepted what it means to let chance have a say.',
    equip_fail_n:  'It lands on a corner again. The die is consistent. You are the variable.',
    equip_success: 'The die settles in your palm and stays. You have accepted what it means. The die has decided to work with your intentions.',
    attune_1:      'The tally marks are slightly different each time you count.',
    attune_2:      'You completed something with an uncertain outcome. The die registered the willingness to proceed anyway.',
    attune_3:      'The seven marks and the six faces have reached an agreement through you. The die has decided you understand the difference between chance and choice.',
    ritual:        'The die rolls without being thrown. It lands on a face that was not there before. The reroll is ready.'
  },

  escama_dragon: {
    first_look:    'The scale is split down the middle. It smells of smoke when held near a flame. Something very large shed this. You wonder whether it noticed.',
    equip_fail_1:  'The scale grows cold when you reach for it. The wyrm has not decided you are ready for what it is willing to lend.',
    equip_fail_n:  'The smoke smell is stronger when you try. The wyrm is still considering you.',
    equip_success: 'The scale warms and the smoke smell fades. The wyrm has made its decision. You carry its attention now.',
    attune_1:      'The scale is warmer near fire.',
    attune_2:      'You completed something that required endurance or facing something difficult. The scale registered it.',
    attune_3:      'The old fire breathes with you now. The wyrm has decided you are worth the investment.',
    ritual:        'The scale grows very hot for a moment. The split closes slightly. The burn you carry lasts longer now.'
  },

  grimorio_arcano: {
    first_look:    'Most pages are blank. The last page contains a sentence that stops before its final word. You read it three times. The missing word is different each time.',
    equip_fail_1:  'The book closes before you can open it fully. The missing word is not ready to be found by someone who has not yet asked the right question.',
    equip_fail_n:  'The sentence on the last page is slightly different. The book is reading you as carefully as you are reading it.',
    equip_success: 'The book opens and stays open. You have asked the right question. The grimoire has decided you are ready to look for the answer.',
    attune_1:      'A few lines remain after you close the book.',
    attune_2:      'You completed something that required learning or understanding something new. The grimoire registered the quality of the inquiry.',
    attune_3:      'The missing word is waiting for you. The grimoire has finished its preparation. You carry the question and the capacity to find the answer.',
    ritual:        'You write a question in the book. The ink holds. The answer is somewhere in the next task you complete.'
  },

  escoba_encantada: {
    first_look:    'The bristles move slightly when the room is still. Not sweeping — listening. Whatever enchantment is in this broom, it has opinions about dust.',
    equip_fail_1:  'The broom leans away from you. It is not refusing you — it is waiting for someone who takes the work seriously.',
    equip_fail_n:  'The bristles are still moving. The broom is still waiting.',
    equip_success: 'The broom settles in your hand and the bristles still. It has decided you take the work seriously. The enchantment is ready to help.',
    attune_1:      'The bristles move more purposefully near neglected corners.',
    attune_2:      'You completed a cleaning or organizing task. The broom registered the quality of the attention.',
    attune_3:      'The enchantment and the intention are the same thing now. The broom has finished its assessment. The work is easier.'
  },

  // == CONSUMABLES (first_look only) ========================================

  pocion_agua:         { first_look: 'The liquid is clearer than water should be. Something was added to it — or something was removed. Either way, it will do what it promises.' },
  pocion_escarcha:     { first_look: 'The bottle is cold enough to fog the air around it. Whatever is inside has not forgotten where it came from.' },
  racion_combate:      { first_look: 'Compact, dense, and designed to be eaten quickly. Someone who understood urgency made this. It will not be pleasant. It will be enough.' },
  elixir_vitalidad:    { first_look: 'The color is wrong for something that heals. But the smell is right — green and sharp and alive. You trust the smell more than the color.' },
  hierba_curativa:     { first_look: 'The leaves are still fresh. Someone picked these recently, or they have been preserved by something you cannot see. Either way, they will work.' },
  antidoto:            { first_look: 'The liquid is bitter before you open it. That is usually a good sign. Poison does not like things that taste like this.' },
  veneno_basico:       { first_look: 'The vial is sealed with wax. The wax is a different color than it was when it was applied. The poison has been thinking about getting out.' },
  pocion_respiracion:  { first_look: 'The bubbles inside move upward even when the bottle is upside down. The water inside does not know it is inside a bottle. That is the point.' },
  hidromiel:           { first_look: 'The smell is strong and warm and old. Someone made this for a celebration that may or may not have happened. It does not matter. The mead is ready.' },
  pocion_vida_menor:   { first_look: 'The taste is bitter and the color is wrong, but the warmth that follows is real. Someone made this quickly, for someone who needed it quickly.' },
  pocion_fuerza:       { first_look: 'It smells of iron and effort. Whoever distilled this understood that strength is not given — it is concentrated from what you have already done.' },
  sake_demonio:        { first_look: 'The liquid is darker than sake should be. The smell is warm and slightly wrong. Whatever was added to this was not added for flavor.' },
  veneno_letal:        { first_look: 'The vial is heavier than it looks. The poison inside has weight that does not come from the liquid. Use this carefully. Use this once.' },
  pocion_agua_menor:   { first_look: 'Smaller than the others. Enough for what it needs to do. No more.' },

  // == MATERIALS (first_look only) ===========================================

  moneda_antigua:      { first_look: 'The face on the coin is worn past recognition. The metal is heavier than modern coins. Someone spent this once and it came back. It always comes back.' },
  moneda_oro:          { first_look: 'Pure gold does not shine the way people expect. It is quieter than that. More certain.' },
  gema_fuego:          { first_look: 'The heat inside the gem is not from the room. It has been there since before you found it. It will be there after.' },
  fragmento_hielo:     { first_look: 'It does not melt. You have been holding it long enough that it should have. It has decided not to.' },
  fragmento_solar:     { first_look: 'It glows slightly even in full light. The sun stored something in this piece that it did not store in the light around it.' },
  pluma_viento:        { first_look: 'The feather moves before the air does. It is not reacting to the wind. It is anticipating it.' },
  especia_rara:        { first_look: 'The smell changes depending on what you are thinking about. That is either a property of the spice or a property of you. You are not sure which.' },
  frasco_vacio:        { first_look: 'The glass is clean and the seal is intact. It is ready to hold something. What it holds will determine what it becomes.' },
  nucleo_slime:        { first_look: 'The core is still slightly warm. Whatever the slime was, this is what it was organized around. It is denser than it looks and it does not dissolve.' },
  piel_lobo:           { first_look: 'The fur is thick and the smell is cold and wild. The wolf this came from was not small. You can tell by the weight of what it left behind.' },
  colmillo_alfa:       { first_look: 'The tooth is larger than you expected. The pack followed whatever carried this. That authority is still in the bone.' },
  cola_rata:           { first_look: 'Unremarkable. Useful. Someone who knows what they are doing will find a use for this. You are becoming someone who knows what they are doing.' },
  seda_arana:          { first_look: 'The thread is stronger than it looks and lighter than it should be. The spider that made this was not making it for you. That does not mean you cannot use it.' },
  objeto_olvidado:     { first_look: 'You cannot remember where you found this. That is part of what it is. Something that has been forgotten carries the weight of everything that forgot it.' },
  esencia_espectral:   { first_look: 'The vial is cold and the liquid inside does not move when you tilt it. Whatever this is, it is not entirely here. That is what makes it useful.' },
  corazon_bosque:      { first_look: 'The heartwood is still warm. The tree this came from was very old. The warmth is what the tree decided to leave behind.' },
  esencia_vida:        { first_look: 'The liquid is green and it moves on its own. Not much — just enough to remind you that it is alive. Handle it accordingly.' },
  semilla_rara:        { first_look: 'The seed is heavier than seeds should be. Whatever grows from this will not be ordinary. That is either a promise or a warning. Probably both.' },
  colmillo_hielo:      { first_look: 'The cold in this tooth has not faded since the wolf fell. It will not fade. The cold was not the wolf\'s — it was the tooth\'s.' },
  corazon_fuego:       { first_look: 'The heat inside this is not from combustion. It is from something that decided to keep burning after everything else stopped. That decision is still active.' },
  escama_fuego:        { first_look: 'The scale is warm and the color shifts when you move it. The salamander this came from lived in fire. The fire is still in the scale.' },
  esencia_agua:        { first_look: 'The liquid moves in the vial as if it is looking for somewhere to go. It has not found it yet. That is what makes it useful — it is still searching.' },
  escama_marina:       { first_look: 'The scale smells of deep water and the color is darker than the surface of the sea. This came from somewhere the light does not reach.' },
  tentaculo_kraken:    { first_look: 'The suction cups are still active. Whatever the kraken was, this piece of it has not accepted that it is separate. Handle it carefully.' },
  esencia_oscura:      { first_look: 'The vial is dark even in full light. The liquid inside absorbs rather than reflects. Whatever this is, it came from somewhere that does not give things back easily.' },
  fragmento_sueno:     { first_look: 'The fragment is warm and slightly translucent. If you look at it in the right light, you can see something moving inside. It is not your reflection.' },
  pagina_arcana:       { first_look: 'The page is blank until you stop looking directly at it. Whatever is written there is meant to be read from the corner of your eye.' },
  tinta_magica:        { first_look: 'The ink is darker than ink should be. Whatever you write with this will mean more than you intend. Use it carefully.' },
  grimorio_antiguo:    { first_look: 'The binding is old and the pages are dense with writing in a hand that was very careful. Someone spent a long time making sure this would survive them.' },
  filacteria:          { first_look: 'The container is sealed and the seal is old. Whatever is inside has been waiting a very long time. You are not sure whether opening it would be a rescue or a release.' },
  cola_kitsune:        { first_look: 'The fur is soft and the color shifts between silver and gold depending on the light. The kitsune this came from was very old. The age is in the fur.' },
  cuerno_oni:          { first_look: 'The horn is heavier than bone should be. The weight is not from the material — it is from what the oni carried in its intentions. That weight transfers.' },
  pluma_grifo:         { first_look: 'The feather is larger than any bird feather you have seen. The quill is strong enough to write with. The barbs are strong enough to cut. The grifo did not give this up easily.' },
  caparazon:           { first_look: 'The shell is harder than it looks and the inside is smooth. The crab that carried this was very patient. The patience is in the material.' },
  token_amistad:       { first_look: 'The token is small and the material is ordinary. What makes it valuable is not what it is made of — it is what it represents. Someone gave this to someone else. That matters.' },

  // == KEYS / SPECIAL =======================================================

  llave_cofre:         { first_look: 'The key is specific. It was made for one lock. You do not know which one yet. That is the point of having it.' },
  contrato_mercantil:  { first_look: 'The terms are favorable. Someone negotiated carefully. The ink is dry and the seal is intact. This is a promise that has been kept so far.' },
  mapa_tesoro:         { first_look: 'The map is partial. The destination is marked but the route has gaps. Someone left those gaps deliberately. You will have to fill them in yourself.' },
  contrato_sospechoso: { first_look: 'The terms are written in very small letters. The seal is from a faction you do not recognize. This is either an opportunity or a trap. Possibly both.' },

  // == SKILLS ===============================================================

  skill_foco_interior: { first_look: 'The scroll is dense with notation. The technique described requires stillness before movement. You will need to practice before it becomes instinct.' },
  skill_llamarada:     { first_look: 'The scroll is warm to the touch. The technique described is fast and direct. It does not ask for precision — it asks for commitment.' },
  skill_rayo_hielo:    { first_look: 'The scroll is cold and the ink is blue. The technique described requires holding two things at once: the cold and the direction. That is harder than it sounds.' },
  talisman_oriental:   { first_look: 'The paper is old and the characters are precise. Someone wrote this with complete attention. The intention is still in the ink.' }

};

// == FLAVOR TEXT ACCESSOR =====================================================
// Returns the correct flavor text for a given item and situation.
// Falls back gracefully: item-specific → type-generic → universal.

function getItemFlavorText(itemId, situation) {
  var entry = ITEM_FLAVOR_TEXT[itemId];
  if (entry && entry[situation]) return entry[situation];

  var item = typeof getItemDefinition === 'function' ? getItemDefinition(itemId) : null;
  var type = item ? item.type : null;

  var TYPE_FALLBACKS = {
    weapon: {
      first_look:    'The weapon has a history you cannot read yet. It will tell you in time.',
      equip_fail_1:  'The weapon does not respond. Something in it is waiting for a readiness you have not built yet.',
      equip_fail_n:  'It resists again. You are closer than you were. The weapon is measuring you.',
      equip_success: 'The weapon settles into your grip. Whatever it was waiting for, you have become it.',
      attune_1: 'The weapon has begun to recognize you.', attune_2: 'Your work has left a mark on the weapon. It has noticed.', attune_3: 'The weapon and the hand are one decision now.',
      ritual: 'Something in the weapon shifts. A capacity that was dormant has woken.'
    },
    armor: {
      first_look:    'The armor carries the shape of someone who wore it before you. You will make it yours.',
      equip_fail_1:  'The armor does not close around you. It is waiting for a body that has learned what it means to be protected.',
      equip_fail_n:  'The armor is the same. You are the one who is changing.',
      equip_success: 'The armor closes and settles. You have learned what it means to be protected. The armor has decided to help.',
      attune_1: 'The armor moves more naturally.', attune_2: 'Your effort has been registered. The armor has noticed.', attune_3: 'The armor and the body are one intention now.'
    },
    accessory: {
      first_look:    'The object is small but the weight of it is not. Something is stored inside it that you cannot see yet.',
      equip_fail_1:  'The accessory does not settle. It is waiting for someone who understands what it is for.',
      equip_fail_n:  'It resists again. You are learning what it is for.',
      equip_success: 'The accessory settles. You understand what it is for. It has decided to help you use it.',
      attune_1: 'The object has begun to respond to you.', attune_2: 'Your work has left a mark on it. It has noticed.', attune_3: 'The object and the intention are the same thing now.'
    },
    artifact: {
      first_look:    'The artifact is older than it looks. Whatever it was made for, it has been waiting a long time.',
      equip_fail_1:  'The artifact does not respond. It is waiting for someone who has earned the right to use what it offers.',
      equip_fail_n:  'It resists again. You are earning the right.',
      equip_success: 'The artifact responds. You have earned the right. It has decided to work with you.',
      attune_1: 'The artifact has begun to recognize you.', attune_2: 'Your effort has been registered. The artifact has noticed.', attune_3: 'The artifact and the bearer are one purpose now.',
      ritual: 'Something in the artifact shifts. A capacity that was sealed has opened.'
    }
  };

  var typeFallback = TYPE_FALLBACKS[type];
  if (typeFallback && typeFallback[situation]) return typeFallback[situation];

  var UNIVERSAL = {
    first_look:    'You hold it and something in it holds back. Not resistance — recognition. It is deciding what you are.',
    equip_fail_1:  'It does not respond. Something in it is waiting for a readiness you have not built yet.',
    equip_fail_n:  'It resists again. You are closer than you were.',
    equip_success: 'It settles. Whatever it was waiting for, you have become it.',
    attune_1: 'It has begun to recognize you.', attune_2: 'Your work has left a mark. It has noticed.', attune_3: 'The object and the bearer are one intention now.',
    ritual: 'Something shifts. A capacity that was waiting has answered.'
  };

  return UNIVERSAL[situation] || 'Something has changed.';
}
