# LifeXP Block 1 - Item System

This build adds the compatibility layer for effect-first items.

- Existing item definitions remain valid.
- New fields are optional: `lore`, `effects`, `requirements`, `attunement`, `activation`, `curse`.
- Save data migrates to item-system version 1.
- Equipment requirements are checked before equipping.
- Combat supports status effects, including `burn`.
- Item modal prioritizes effects and requirements.
- Item modal actions have a larger primary action and smaller close button.

Example effect shape:

```js
effects: [{
  id: 'burning_edge',
  name: 'Burn',
  trigger: 'on_hit',
  status: 'burn',
  chance: 0.35,
  duration: 3,
  damage: 4,
  description: 'Attacks can apply Burn for 3 turns.'
}]
```
