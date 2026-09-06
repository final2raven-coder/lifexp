# LifeXP F12 content integration v1

This is the local integration package for the approved task catalog review.

## Scope

- Activates 73 reviewed tasks across Casa, Cuerpo, Gestiones, Social, and Personal.
- Archives 57 old task definitions in-place instead of deleting them.
- Preserves `taskHistory`, `savedTasks`, completion references, and old IDs in the save.
- Uses only the existing runtime fields: `id`, `cat`, `name`, `freq`, `desc`, `stats`, and `xp`.
- Keeps the canonical completion flow unchanged.
- Adds no new loot. Loot/theme intersection is a separate F12c block.

## Files to place

1. `content_review_integration_v1.js`: place immediately after `update2_content.js` and before `inventory_system.js` in `index.html`.
2. Add the same file to the Service Worker cache list and increment its cache version in `sw.js`.
3. Keep `content_review_tasks_v1.json`, `content_review_retired_v1.json`, and `content_review_migration_v1.json` as audit records; they are not loaded by the browser.
4. Replace `PROJECT_MAP.md` with the included updated map.

## Verification as a player

1. Export the save before updating, then load the updated build and confirm your level, inventory, quests, and task history are still present.
2. Open each category: only the reviewed active tasks should be offered; retired tasks should not appear as available.
3. Complete one task from a category and confirm XP, history, frequency, and the normal reward flow still work.

## Important

Do not replace `engine.js`, `data_tasks.js`, or `update2_content.js` with files from this package. This package intentionally changes only the content integration boundary.
