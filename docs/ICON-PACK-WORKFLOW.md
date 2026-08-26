# LifeXP icon pack workflow

This workflow is deliberately separate from the application update. It does not change `index.html`, catalogs, saves, or gameplay rules. Its only job is to turn a reviewed source ZIP into a reproducible icon-pack artifact.

## Why discovery comes first

The original Game-icons source ZIP is not part of this delivery. The workflow therefore never downloads an external source or guesses an icon. It reads the ZIP already present in the repository, verifies that it contains SVG files and license material, and produces a candidate report.

The `discover` mode reports:

- the source ZIP SHA-256;
- every SVG found;
- license/attribution files found;
- semantic references detected in LifeXP;
- deterministic filename candidates for each reference;
- unmatched and ambiguous references.

The build mode refuses to continue unless every selected SVG exists exactly in the source ZIP and every selected icon has explicit attribution metadata.

## Repository layout expected by the workflow

```text
assets/source/game-icons/game-icons.zip
assets/icon-pack/selection.json
assets/icon-pack/selection.schema.json
.github/workflows/build-icon-pack.yml
tools/build_icon_pack.js
```

The ZIP must be the original source archive. Do not commit the generated pack ZIP as the source input.

## First run: discovery

1. Put the original source ZIP at `assets/source/game-icons/game-icons.zip`.
2. Run the GitHub Actions workflow manually.
3. Select `discover`.
4. Download the `lifexp-icon-pack-discover` artifact.
5. Review `icon-pack-discovery.json` and `icon-pack-discovery.md`.
6. Create `assets/icon-pack/selection.json` from reviewed exact paths and attribution data.

The discovery score is only a search aid. It is never used as an automatic selection during build.

## Selection manifest contract

Validate the manifest against `assets/icon-pack/selection.schema.json` before running build. The builder performs the same critical checks at runtime.

The manifest is JSON with these fields:

- `packId`: stable pack identifier.
- `version`: pack version.
- `source.name`: source collection name.
- `source.license`: exact license label from the source terms.
- `source.licenseUrl`: URL for that license.
- `source.licenseFiles`: optional exact paths inside the ZIP to copy into the artifact. If omitted, all recognized license/readme files are copied.
- `entries`: object keyed by LifeXP semantic reference.
- each entry requires `sourcePath`, `title`, `author`, `license`, `licenseUrl`, and `sourceUrl`.

Use only semantic references already supported by LifeXP, such as `world.fire`, `ui.inventory`, `item.weapon`, `class.guerrero`, or `enemy.rata_gigante`. The validator rejects arbitrary namespaces.

The source path must match the ZIP entry exactly, including its directory and filename. This is intentional: it makes a wrong or silently substituted asset fail the build.

## Second run: build

1. Commit the reviewed `selection.json` and the original source ZIP in a branch.
2. Run the workflow manually with mode `build`.
3. Download `lifexp-icon-pack-build`.
4. Verify `BUILD-REPORT.json`, `ATTRIBUTION.md`, `licenses/source/`, and `SHA256SUMS.txt`.
5. Review the generated `lifexp-game-icons-pack.js` before loading it in LifeXP.

The generated script must be loaded after `icon_system.js` and before UI code that renders icons. This workflow does not edit `index.html` automatically.

## Local execution

From the repository root:

```bash
node tools/build_icon_pack.js --mode discover --source assets/source/game-icons/game-icons.zip --out dist/icon-pack-discovery
node tools/build_icon_pack.js --mode build --source assets/source/game-icons/game-icons.zip --manifest assets/icon-pack/selection.json --out dist/icon-pack
```

The local command uses the system `unzip` and `zip` tools and Node.js. No network access or package installation is required.

## Safety checks

The builder fails if:

- the source ZIP is missing;
- no SVG is present;
- no recognizable license/attribution file is present;
- a manifest reference is invalid or duplicated;
- a selected path is not an exact ZIP entry or is not an SVG;
- attribution metadata is incomplete;
- an SVG contains script, `foreignObject`, event handlers, or `javascript:` URLs;
- the generated pack cannot be created.

The output contains no source ZIP, only the selected SVG data, copied license material, metadata, attribution, checksums, and the generated registration script.

## Manual verification as player

This is a build artifact, not a gameplay change. After a later integration into the application:

1. Open LifeXP and confirm the first screen loads.
2. Visit tasks, combat, inventory/equipment, settings, and class selection.
3. Export the save and confirm that level, inventory, equipment, stash, quests, lore, acclimation, and rituals are unchanged.
