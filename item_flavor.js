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
    attune_3:      'The acid has stopped eating at the blade. It has found something else to consume.',
    ritual:        'The green along the edge brightens. The dagger has learned the difference between damage and purpose.'
  },

  daga_asesino: {
    first_look:    'The blade has no maker\'s mark. The balance is perfect. Someone spent a long time making sure this would never be traced back to them.',
    equip_fail_1:  'The grip is wrong in your hand — not uncomfortable, but designed for a different kind of intention. The dagger knows the difference.',
    equip_fail_n:  'You reach for the same balance and find the same silence. The blade does not punish impatience. It simply refuses to become yours.',
    equip_success: 'The dagger disappears against your palm. You understand why its maker left no mark. Some weapons are meant to be remembered only by the person they reached.',
    attune_1:      'You stop looking at the edge and start reading the space around it.',
    attune_2:      'You completed something in difficult conditions. The dagger registered the patience it took not to rush.',
    attune_3:      'The blade is no longer hidden from you. It is hidden with you.',
    ritual:        'The dagger finds the gap in a problem before you do. Its edge does not flash; it arrives.'
  },

  lanza_tridente: {
    first_look:    'The three points are uneven, as if shaped by currents rather than tools. The metal smells faintly of rain.',
    equip_fail_1:  'The shaft pulls toward the floor when you lift it. There is weight here that strength alone will not move.',
    equip_fail_n:  'The trident stays still in your hands, waiting for you to stop fighting its balance.',
    equip_success: 'The three points settle into alignment. Something deep in the metal recognizes the direction you are facing.',
    attune_1:      'The rain smell returns whenever you finish a task that leaves you tired.',
    attune_2:      'You completed something that required endurance. The trident registered it.',
    attune_3:      'The deep water in the metal has accepted you. You can feel the current when you hold it still.'
  },

  arco_umbrio: {
    first_look:    'The bow is darker than the room around it. The string catches no light at all.',
    equip_fail_1:  'The string goes slack in your hands. It does not need strength. It needs a steadiness you have not yet found.',
    equip_fail_n:  'The bow remains quiet. It is not asking you to pull harder.',
    equip_success: 'The string draws back without a sound. The darkness around the bow gathers close, as if listening.',
    attune_1:      'The shadow under the bow points toward the thing you have been avoiding.',
    attune_2:      'You held your attention through a difficult task. The bow noticed the absence of noise in you.',
    attune_3:      'The string hums when you are still. You no longer need to see the target to know where it is.'
  },

  martillo_solar: {
    first_look:    'The head of the hammer is warm even in the shade. Its surface holds the faint pattern of a sunrise.',
    equip_fail_1:  'The hammer drags your shoulder down. It is not heavy; it is asking whether you know what force is for.',
    equip_fail_n:  'The light in the metal fades when you grip it. It will not answer a gesture you do not mean.',
    equip_success: 'The warmth spreads from the hammer into your hands. The metal brightens once, then settles into a steady glow.',
    attune_1:      'The sunrise pattern is clearer after every task that begins before you are ready.',
    attune_2:      'You completed something that asked for persistence. The hammer kept the memory.',
    attune_3:      'The hammer does not shine for display. It shines because something in you has learned to keep going.'
  },

  baston_liche: {
    first_look:    'The wood is cold and the carved symbols shift when you are not looking directly at them. This belonged to something that is no longer alive. That does not mean it is harmless.',
    equip_fail_1:  'The staff pulls away from your hand with a sound like a page turning. Whatever intelligence remains in the wood has decided you are not yet worth the risk.',
    equip_fail_n:  'The symbols move faster when you try again. The staff is not rejecting you. It is learning what you will do when it does.',
    equip_success: 'The wood accepts your grip with a dry crack. Somewhere inside it, something old opens one eye.',
    attune_1:      'A new symbol has appeared. You are not sure whether it was there before.',
    attune_2:      'You finished something that should have left you empty. The staff is warmer now.',
    attune_3:      'The staff has stopped testing you. That is not the same as trusting you.'
  },

  espada_novato: {
    first_look:    'The blade is plain, well-balanced and clean. It has seen enough hands to know the difference between a beginning and an excuse.',
    equip_fail_1:  'The sword is not too heavy. Your grip simply has not learned where to put the weight.',
    equip_fail_n:  'Again the balance slips. The blade is patient in the way a teacher can be patient.',
    equip_success: 'The sword settles into your hand. It does not promise anything. It gives you a place to start.',
    attune_1:      'The first lesson is not about the sword. It is about returning to it.',
    attune_2:      'You have repeated the work often enough for the blade to recognize your rhythm.',
    attune_3:      'The sword is no longer a beginning. It is proof that beginnings can hold.'
  },

  hacha_piedra: {
    first_look:    'The stone edge is rough, heavy and honest. It was made for a world where every tool had to explain itself.',
    equip_fail_1:  'The axe turns in your hands. Its weight is asking for your whole body, not just your arms.',
    equip_fail_n:  'The stone edge waits. It has survived worse handling than this.',
    equip_success: 'The axe rests against your shoulder with the familiarity of a burden you chose.',
    attune_1:      'The stone remembers every surface it has broken. You begin to understand why.',
    attune_2:      'You completed something that required more effort than elegance. The axe approved.',
    attune_3:      'The edge is still rough. You are simply no longer surprised by what it can do.'
  },

  // == ARMOR ================================================================

  armadura_cuero: {
    first_look:    'The leather has been repaired so many times that the repairs have become its pattern. It smells of rain and old roads.',
    equip_fail_1:  'The straps pull in the wrong places. The armor is not fitted to the way you move yet.',
    equip_fail_n:  'You adjust the straps again. The leather waits for you to learn where you actually need protection.',
    equip_success: 'The armor settles close to your body. The old repairs feel like small maps of where others have already been.',
    attune_1:      'The leather softens after difficult work, as if it remembers that you kept moving.',
    attune_2:      'A seam held through a task that could have split it. The armor registered the pressure.',
    attune_3:      'The repairs no longer feel like weaknesses. They are the places the armor knows you best.'
  },

  malla_hierro: {
    first_look:    'Every ring is cold. Together they make a weight that changes how you stand.',
    equip_fail_1:  'The mail drags at your shoulders and the links tangle when you turn.',
    equip_fail_n:  'The rings settle badly again. A chain is only strong when its links agree on direction.',
    equip_success: 'The mail falls into place with a sound like distant rain. Your movements become louder, but harder to interrupt.',
    attune_1:      'The rings stop catching on each other when you move with intention.',
    attune_2:      'You endured a task without trying to rush past the difficult part. The mail became quieter.',
    attune_3:      'The armor moves as one surface now. You can feel every link without being slowed by any of them.'
  },

  escudo_madera: {
    first_look:    'The shield is made from several kinds of wood. Each plank has a different grain, but the whole holds together.',
    equip_fail_1:  'The shield turns away from the impact you imagined. It asks you to meet the force, not decorate it.',
    equip_fail_n:  'Your arm tires before the shield does. It has learned that defense is a decision made repeatedly.',
    equip_success: 'The wood catches the first pressure and gives back a low, solid note.',
    attune_1:      'You begin to feel where the shield will be before you move it there.',
    attune_2:      'You protected something without being asked. The shield kept the memory.',
    attune_3:      'The shield does not make you fearless. It gives fear somewhere to stop.'
  },

  manto_viajero: {
    first_look:    'The cloak has pockets in places no tailor would choose. Someone made it for a journey that did not follow roads.',
    equip_fail_1:  'The fabric catches the air and pulls you off balance. It wants you to learn the weather around your body.',
    equip_fail_n:  'The cloak settles only after you stop treating it like decoration.',
    equip_success: 'The hood rests over your shoulders. The pockets are empty, but not for long.',
    attune_1:      'You find a new pocket after a day of work. It holds exactly what you needed.',
    attune_2:      'The cloak stayed dry through a task that left everything else damp.',
    attune_3:      'The fabric moves with the wind instead of against it. You have learned a small kind of travel.'
  },

  armadura_escamas: {
    first_look:    'The scales overlap like a fish that learned to walk. Their edges are polished from use, not care.',
    equip_fail_1:  'The armor catches at your elbows. It is built for a different rhythm than the one you are bringing to it.',
    equip_fail_n:  'The scales click against each other. They are listening to the shape of your movement.',
    equip_success: 'The scales align over your body and the sound becomes a quiet, protective rhythm.',
    attune_1:      'The armor turns with you instead of making you turn around it.',
    attune_2:      'You finished a task while carrying more than you wanted to. The scales remember the weight.',
    attune_3:      'The armor feels less like a shell and more like a second decision.'
  },

  // == ACCESSORIES ==========================================================

  anillo_foco: {
    first_look:    'The ring is smooth except for one notch on the inside. It seems to fit the finger before you put it on.',
    equip_fail_1:  'The ring is cold against your skin. Your attention scatters before it can settle.',
    equip_fail_n:  'The notch presses harder this time. Focus is not the same as force.',
    equip_success: 'The ring warms. The room does not become quieter; you simply hear less of what does not matter.',
    attune_1:      'The notch is no longer sharp. You have worn down one edge of distraction.',
    attune_2:      'You completed a task without leaving it halfway. The ring noticed.',
    attune_3:      'The ring does not control your attention. It reminds you that it is yours.'
  },

  collar_serpiente: {
    first_look:    'The collar is made of small metal vertebrae. Each one is warm in a different way.',
    equip_fail_1:  'The pieces tighten around your neck. They are measuring whether you can remain calm when something wants control.',
    equip_fail_n:  'The metal relaxes only when your breathing does.',
    equip_success: 'The vertebrae settle. You feel a second pulse under your own.',
    attune_1:      'The collar loosens at the exact moment you need to speak.',
    attune_2:      'You kept your composure during a difficult exchange. The metal stopped watching so closely.',
    attune_3:      'The second pulse is no longer separate. It follows your choice instead of preceding it.'
  },

  brazalete_tormenta: {
    first_look:    'The bracelet smells of metal after lightning. Tiny blue lines move under its surface.',
    equip_fail_1:  'The current jumps to your wrist and stops. Your body is not yet a path it trusts.',
    equip_fail_n:  'The blue lines retreat when you reach for them. The storm is patient.',
    equip_success: 'The bracelet hums in time with your pulse. The air around your hand tastes sharp.',
    attune_1:      'The current waits for your decision before it moves.',
    attune_2:      'You finished something that demanded a sudden change. The bracelet discharged into the ground.',
    attune_3:      'The storm does not obey you. It recognizes where you are going.'
  },

  amuleto_luna: {
    first_look:    'The stone is pale and cold enough to numb your fingertips. Its surface shows a moon that is never in the same phase twice.',
    equip_fail_1:  'The amulet pulls at your chest and your thoughts turn toward sleep. It is waiting for a quieter mind.',
    equip_fail_n:  'The stone remains cold. It is not asking you to dream harder.',
    equip_success: 'The moon on the stone changes once. You feel the change in the room before you see it.',
    attune_1:      'You sleep more deeply after difficult days. The amulet keeps the edge of the night away.',
    attune_2:      'You completed something that required you to listen before acting. The stone brightened.',
    attune_3:      'The moon is still changing. Now you are able to change with it.'
  },

  dados_destino: {
    first_look:    'The dice are made from two different materials, though they share the same worn corners. They feel heavier than chance should.',
    equip_fail_1:  'The dice roll out of your hand and stop at the edge of the table. They are not interested in a guess.',
    equip_fail_n:  'The numbers turn up blank. You are asking for luck before giving it anything to work with.',
    equip_success: 'The dice settle in your palm. They do not show a number until you have made a choice.',
    attune_1:      'One face has gained a mark you do not remember carving.',
    attune_2:      'You made a decision without waiting for certainty. The dice came up different.',
    attune_3:      'The dice still leave room for chance. They no longer leave you room to pretend you had none.'
  },

  // == ARTIFACTS ============================================================

  fragmento_eco: {
    first_look:    'The shard repeats the last sound made near it, but not in the same voice. It is still learning what memory is.',
    equip_fail_1:  'The echo arrives before the action. You cannot hold the fragment and remain entirely in the present.',
    equip_fail_n:  'The fragment repeats your hesitation. It is not mocking you. It is keeping a record.',
    equip_success: 'The shard goes silent, then gives back a sound you had forgotten you made.',
    attune_1:      'The echo is beginning to separate the important sounds from the rest.',
    attune_2:      'You finished a task that required you to remember why you began. The shard repeated the reason.',
    attune_3:      'The fragment no longer repeats everything. It has learned what deserves to return.'
  },

  mascara_umbria: {
    first_look:    'The mask has no eye holes, yet the inside is worn where eyes would be. It was made for someone who knew another way to look.',
    equip_fail_1:  'Darkness closes over your face. The mask offers a dozen directions and no help choosing one.',
    equip_fail_n:  'The mask stays dark. It will not show you what you refuse to notice.',
    equip_success: 'The inside of the mask warms. You can see the outline of things that have tried not to be seen.',
    attune_1:      'The mask lets through the shape of a familiar room.',
    attune_2:      'You noticed a pattern in a difficult task before it repeated. The mask opened one eye.',
    attune_3:      'The darkness is no longer empty. It has become another kind of map.'
  },

  reloj_quebrado: {
    first_look:    'The clock has no hands. Its face is scratched where the hours used to be.',
    equip_fail_1:  'The ticking starts in your wrist and pulls your attention away from the moment you are in.',
    equip_fail_n:  'The clock refuses to tick at a useful speed. Time is not a resource it intends to simplify.',
    equip_success: 'A single hand appears and points nowhere. You feel the next minute arrive before it begins.',
    attune_1:      'The hand moves when you finish something you had postponed.',
    attune_2:      'You completed a task without checking how much time remained. The clock lost a scratch.',
    attune_3:      'The clock still has no numbers. You have stopped needing them to know when to move.'
  },

  semilla_antigua: {
    first_look:    'The seed is dry, hard and warm at its center. It has waited through seasons that no longer have names.',
    equip_fail_1:  'The seed remains closed in your hand. It does not respond to being wanted.',
    equip_fail_n:  'Nothing happens. Growth is not impressed by impatience.',
    equip_success: 'A thin root appears along the seed, then disappears into your palm without leaving a mark.',
    attune_1:      'The seed is heavier after every task that makes room for something new.',
    attune_2:      'You completed something that required patience without a visible reward. The seed split slightly.',
    attune_3:      'A green thread has begun to move inside the shell. You cannot rush it, but you can keep it safe.'
  },

  moneda_oro: {
    first_look:    'Pure gold does not shine the way people expect. It is quieter than that. More certain.',
  },

  mapa_tesoro: {
    first_look:    'The map is partial. The destination is marked but the route has gaps. Someone left those gaps deliberately. You will have to fill them in yourself.'
  },
};

const ITEM_FLAVOR_FALLBACKS = {
  weapon: {
    first_look: 'The weapon feels like it has been waiting for a hand that knows what it wants.',
    equip_fail_1: 'The weapon does not reject you. It simply does not recognize you yet.',
    equip_fail_n: 'The weapon remains patient. You are the one who keeps changing.',
    equip_success: 'The weapon settles into your hand. The weight is real, and so is the choice.',
    attune_1: 'Something in the weapon has begun to notice you.',
    attune_2: 'The weapon remembers what you have done with it.',
    attune_3: 'The weapon no longer feels separate from the work that brought you here.',
    ritual: 'The weapon has remembered a purpose it had kept hidden.'
  },
  armor: {
    first_look: 'The armor carries the marks of the people who wore it before you.',
    equip_fail_1: 'The armor is not ready to move with you yet.',
    equip_fail_n: 'The armor waits for you to stop fighting its shape.',
    equip_success: 'The armor settles. Protection is a practice, not a promise.',
    attune_1: 'The armor is learning the shape of your movement.',
    attune_2: 'The armor remembers the pressure you carried.',
    attune_3: 'The armor has stopped asking whether you belong inside it.',
    ritual: 'The armor has learned where to hold and where to give.'
  },
  accessory: {
    first_look: 'The accessory is small enough to underestimate and old enough to know better.',
    equip_fail_1: 'The accessory remains closed to you.',
    equip_fail_n: 'The accessory is still waiting for the right kind of attention.',
    equip_success: 'The accessory warms against your skin.',
    attune_1: 'The accessory has begun to answer small choices.',
    attune_2: 'The accessory remembers the intention behind your actions.',
    attune_3: 'The accessory no longer feels like something you are carrying.',
    ritual: 'The accessory has opened a second way for its power to move.'
  },
  artifact: {
    first_look: 'The artifact feels older than the explanation you could give it.',
    equip_fail_1: 'The artifact does not yet accept the shape of your intent.',
    equip_fail_n: 'The artifact remains quiet, but quiet is not the same as empty.',
    equip_success: 'The artifact settles into place with a weight that feels deliberate.',
    attune_1: 'The artifact has begun to reveal the edges of its purpose.',
    attune_2: 'The artifact remembers the work you have done near it.',
    attune_3: 'The artifact has started to treat you as part of its story.',
    ritual: 'The artifact has revealed a function it was keeping from you.'
  },
  default: {
    first_look: 'The item carries a history you cannot read yet.',
    equip_fail_1: 'The item does not respond to you yet.',
    equip_fail_n: 'The item remains patient.',
    equip_success: 'The item settles into place.',
    attune_1: 'Something about the item has changed.',
    attune_2: 'The item remembers your work.',
    attune_3: 'The item recognizes you now.',
    ritual: 'The item has revealed another layer of itself.'
  }
};

function getItemFlavorText(itemId, situation) {
  const item = (typeof ITEMS !== 'undefined' && ITEMS[itemId]) || null;
  const specific = ITEM_FLAVOR_TEXT[itemId];
  if (specific && specific[situation]) return specific[situation];
  const type = item?.type || 'default';
  return ITEM_FLAVOR_FALLBACKS[type]?.[situation] || ITEM_FLAVOR_FALLBACKS.default[situation] || '';
}
