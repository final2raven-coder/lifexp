# LifeXP Save Migration Contract

## Scope

This document describes the save-loading contract introduced for DT-16 and DT-17. The loader treats player data as high-risk data: it parses and migrates a candidate copy, snapshots the original raw bytes, and commits only after every step succeeds.

Current canonical save version: `3`.

## Ordered migrations

Migrations are explicit and sequential:

- `0 -> 1`: establish inventory, equipment, stash, capacity, and pending-loot fields.
- `1 -> 2`: establish the item-system state (`attunement`, `rituals`, and `curses`).
- `2 -> 3`: establish guild/receipt fields and migrate legacy active quest state.

The loader starts at the save's actual `saveVersion`. A save without a version is treated as version `0`. The in-memory and persisted `saveVersion` is advanced only after the corresponding migration function returns successfully. A missing step, unsupported version, malformed root, invalid version, or migration exception aborts the load.

## Transaction and recovery behavior

1. Read the raw `lifexp_save` string.
2. Store the exact raw string before parsing under `lifexp_premigration_v<from>_<timestamp>`.
3. Keep only the three most recent pre-migration snapshots.
4. Parse, validate, and migrate a separate candidate object.
5. Apply explicit defaults for missing or invalid known fields.
6. Preserve unknown fields for forward compatibility.
7. Commit the migrated candidate only after all checks succeed.
8. If anything fails, restore the original raw save and keep the previous in-memory state. A visible error is shown to the player.

The loader never deletes a player's save. A corrupted save is retained exactly as found, and a pre-migration snapshot is attempted before parsing so the original bytes remain available even when JSON parsing fails.

## Quest progress rules

Legacy active quests are migrated by quest ID. For every current objective:

- If the objective ID exists in the legacy state, its progress is preserved and clamped to the current objective count.
- If it does not exist, the objective starts at `0` and a warning identifies the quest/objective.
- Legacy objectives that no longer exist in the current definition are not copied into the active state; a warning identifies each reset.
- A legacy quest whose definition is unavailable is retained by ID and its opaque state is preserved for later recovery.

A v2 save that already contains a complete and valid canonical `quests` container is not rebuilt from the legacy `activeQuests` field. Canonical validity is decided from the original parsed save before schema defaults add missing arrays. The container must include `active`, `completed`, `failed`, a valid `dailyReset`, and an objectives array for every active quest state. A present but partial or invalid container never becomes canonical merely because defaults fill missing fields.

If a partial or invalid canonical container has a usable legacy `activeQuests` array, the legacy state is migrated deterministically by quest ID and objective ID. The same rule is applied to a save already marked as version `3`; the version marker does not make an incomplete container valid. If no usable legacy source exists, loading aborts before commit, the exact raw save remains unchanged, the pre-migration recovery snapshot is retained, and the player sees a visible error.

Active canonical quests whose definitions are not available in the current catalog remain recoverable as opaque quest state. They are not reactivated from old objective definitions and are not silently deleted.

## Schema defaults

Known fields receive explicit defaults, including player values, stats, task arrays, inventory/equipment, stash, class, quest containers, item-system containers, lore/acclimation, and guild/receipt state. Unknown fields are copied through unchanged.

Legacy equipment values are intentionally preserved as-is. DT-10 legacy item normalisation is out of scope for this change.

## Expansion load order

The expansion files expose installer functions and must load after their base catalogs. `update2_content.js` now asserts at runtime that:

- base catalogs and expansion declarations exist;
- all four installer functions exist;
- installers are called explicitly;
- every declared expansion item, enemy, quest, and task is present after installation.

A load-order or installation failure produces a visible error and prevents the update marker from being written.

## Fixtures and verification

The fixture suite covers:

| Fixture | Expected result |
| --- | --- |
| v0 save | migrates sequentially to v3 and receives explicit defaults |
| v1 save | preserves inventory/equipment and receives item-system defaults |
| v2 save with legacy `activeQuests` | migrates quest state and preserves matching objective progress |
| v2 save with complete canonical `quests` and legacy `activeQuests` | preserves canonical quest progress rather than rebuilding it |
| v2 save with partial canonical `quests` and legacy `activeQuests` | rebuilds from legacy IDs, clamps progress, and warns about removed objectives |
| v2 save with partial canonical `quests` and no usable legacy source | fails visibly, leaves the exact raw save unchanged, and retains a recovery snapshot |
| canonical save with an unknown active quest | preserves the opaque quest state for later recovery |
| v3 save | loads without migration and preserves unknown fields |
| save with legacy equipment ID/value | preserves the legacy value; no DT-10 conversion occurs |
| corrupted JSON save | returns failure, keeps the exact original raw save, and shows an error |
| four existing snapshots | retains only the three newest snapshots |
| DT-17 static contract | rejects conditional undefined-installer calls and requires runtime assertions |

Run the suite with:

```sh
node tests/save_migrations.test.js
```

The suite is dependency-free and uses an in-memory `localStorage` implementation.

## DT-10 follow-up edge cases

During this work, the following legacy-equipment cases were deliberately observed but not changed:

- an equipment slot can contain a string display value instead of an item object;
- an equipment slot can contain an object with an old or unknown `id`;
- an equipment slot can be missing while the other slots exist;
- an inventory entry can use a display name where current systems expect an ID;
- an item can exist in inventory/equipment/stash with a quantity shape that is not canonical;
- unknown legacy IDs must remain recoverable rather than being silently dropped;
- migration must distinguish an already canonical ID from a display-name collision.

These cases should be handled by a separate DT-10 migration PR with deterministic mapping and explicit backup/rollback behavior.
